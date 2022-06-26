"use strict";

const { createLogger, format, transports, addColors } = require("winston");
const express = require("express");
const http = require("http");
const path = require("path");
const webSocket = require("ws");
const { URL } = require("url");

class clientQueue {
	constructor() {
		this.cachedPriorities = {};
		this.queue = {};
	}
	async add(item, priority) {
		this.cachedPriorities[item] = priority;
		if (!this.queue[priority]) {
			this.queue[priority] = [];
		}
		this.queue[priority].push(item);
	}
	async fetchMin() {
		const index = Math.min(...Object.keys(this.queue));
		return this.queue[index][0];
	}
	async modifyPriority(item, newPriority) {
		this.queue[this.cachedPriorities[item]].splice(
			this.queue[this.cachedPriorities[item]].indexOf(item),
			1
		);
		if (this.queue[this.cachedPriorities[item]] == "") delete this.queue[this.cachedPriorities[item]];
		this.add(item, newPriority);
	}
	async delete(item) {
		this.queue[this.cachedPriorities[item]].splice(
			this.queue[this.cachedPriorities[item]].indexOf(item),
			1
		);
		if (this.queue[this.cachedPriorities[item]] == "") delete this.queue[this.cachedPriorities[item]];
		delete this.cachedPriorities[item];
	}
}
const routableClients = new clientQueue();

const clients = {};
const clientAges = {};
const CONFIG = {
	defaultNoResponseTimeout: 10000,
};
var logger;

const websocketServer = http.createServer();
const websocketHandler = new webSocket.Server({ noServer: true });
const expressFrontend = express();
const ROOT = path.join(__dirname, "../development");
expressFrontend.use(express.static(ROOT));
expressFrontend.get("/", async function (req, res) {
	res.sendFile(ROOT);
});
expressFrontend.get("*", async function (req, res) {
	res.redirect("/");
});

webSocket.prototype.crudeSend = async function (type, typeArgs) {
	if (!type) return;
	switch (type) {
		case "heartbeat":
			this.send(JSON.stringify(["heartbeat"]));
			break;
		case "provideSDP":
			if (!typeArgs.SDP) return;
			this.send(JSON.stringify(["provideSDP", typeArgs.SDP]));
			break;
		case "requestSDP":
			if (!(typeArgs.SDP && typeArgs.returnID)) return;
			this.send(JSON.stringify(["requestSDP", typeArgs.SDP, typeArgs.returnID]));
			break;
		case "ERROR":
			this.send(JSON.stringify(["ERROR"]));
			break;
	}
};

class eventHandlingMechanism {
	constructor() {
		this.dispatchWatchers = {};
	}
	dispatch(signalIdentifier, externalDetail) {
		if (this.dispatchWatchers[signalIdentifier]) {
			this.dispatchWatchers[signalIdentifier].forEach((watcher) => {
				watcher.resolve(externalDetail);
			});
			delete this.dispatchWatchers[signalIdentifier];
		}
	}
	forceReject(signalIdentifier, reason) {
		if (this.dispatchWatchers[signalIdentifier]) {
			this.dispatchWatchers[signalIdentifier].forEach((watcher) => {
				watcher.reject(reason);
			});
			delete this.dispatchWatchers[signalIdentifier];
		}
	}
	async acquireExpectedDispatch(dispatchIdentifier, timeout) {
		this.dispatchWatchers[dispatchIdentifier] = this.dispatchWatchers[dispatchIdentifier]
			? this.dispatchWatchers[dispatchIdentifier]
			: [];
		var rejectGeneratedPromise;
		var resolveGeneratedPromise;
		let index =
			this.dispatchWatchers[dispatchIdentifier].push({
				promise: new Promise((resolve, reject) => {
					let hasResolved = false;
					let hasRejected = false;
					resolveGeneratedPromise = async (resolution) => {
						if (hasRejected) return;
						resolve(resolution);
						hasResolved = true;
					};
					rejectGeneratedPromise = async (rejection) => {
						if (hasResolved) return;
						reject(rejection);
						hasRejected = true;
					};
					setTimeout(() => {
						if (!hasResolved)
							reject(
								`Dispatch listener promise for the identifier ${dispatchIdentifier} timed out after ${
									timeout ?? 100000
								}ms`
							);
					}, timeout ?? 100000);
				}),
				reject: rejectGeneratedPromise,
				resolve: resolveGeneratedPromise,
			}) - 1;
		return await this.dispatchWatchers[dispatchIdentifier][index].promise;
	}
}
const eventHandler = new eventHandlingMechanism();

function initLogger() {
	addColors({
		fatal: "black bgRed bold",
		error: "brightRed bold",
		warn: "yellow bold",
		info: "white bold",
		diagnostic: "brightBlue bold",
		debug: "yellow",
		trace: "green",
	});
	logger = createLogger({
		levels: {
			fatal: 0,
			error: 1,
			warn: 2,
			info: 3,
			diagnostic: 4,
			debug: 5,
			trace: 6,
		},
		level: "diagnosic",
		format: format.combine(format.timestamp(), format.json()),
		transports: [
			new transports.File({
				filename: "index.log",
				level: "diagnostic",
				handleExceptions: true,
				humanReadableUnhandledException: true,
			}),
			new transports.Console({
				level: "warn",
				format: format.combine(
					format.colorize(),
					format.align(),
					format.printf((info) => {
						const { level, message, ...args } = info;
						return `[${level}] : ${message} ${
							Object.keys(args).length ? JSON.stringify(args, null, 2) : ""
						}`;
					})
				),
				handleExceptions: true,
				humanReadableUnhandledException: true,
			}),
		],
	});
}

function init() {
	initLogger();
	websocketServer.listen(8777);
	expressFrontend.listen(8000);
	setInterval(() => {
		let present = +new Date();
		for (let client of Object.values(clients)) {
			++clientAges[client.CID];
			if (present - client.mostRecentHeartbeat > 1000 || client.socket.readyState === webSocket.CLOSED)
				terminateAndCleanClient(client.CID);
			if (client.socket.readyState === webSocket.OPEN) client.socket.crudeSend("heartbeat");
		}
	}, 100);
}

websocketServer.on("upgrade", async (req, socket, head) => {
	const routeURL = new URL(req.url, `http://${req.headers.host}/`);
	logger.debug(`New websocket connection on ${routeURL.pathname} from ${req.socket.remoteAddress}.`);
	if (
		(routeURL.pathname !== "/bind" && routeURL.pathname !== "/reconnect") ||
		(routeURL.pathname == "/bind" && !routeURL.searchParams.get("originatingSDP"))
	) {
		socket.destroy();
		return;
	}
	websocketHandler.handleUpgrade(req, socket, head, async (upgraded) => {
		switch (routeURL.pathname) {
			case "/bind":
				new Client(upgraded).tether(routeURL.searchParams.get("originatingSDP"));
				break;
			case "/reconnect":
				new Client(upgraded).amnesicReconnect();
				break;
			default:
				socket.destroy();
				return;
		}
	});
});

class Client {
	constructor(socket) {
		this.socket = socket;
		this.mostRecentHeartbeat = +new Date();
		this.trustworthiness = 0;
		this.trustworthinessHeusistic = {
			invalidData: 0,
			noAnswer: 0,
			imposedConnections: 0,
			invalidSDP: 0,
			activeRouting: 0,
		};
		this.CID = Math.random().toString().slice(2, 17);
		clients[this.CID] = this;
		clientAges[this.CID] = 1;
	}
	incrementTrustworthinessHeuristic(prop) {
		this.trustworthinessHeusistic[prop] = this.trustworthinessHeusistic[prop]
			? ++this.trustworthinessHeusistic[prop]
			: 1;
		this.recomputeTrustworthiness();
	}
	decrementTrustworthinessHeuristic(prop) {
		this.trustworthinessHeusistic[prop] = this.trustworthinessHeusistic[prop]
			? --this.trustworthinessHeusistic[prop]
			: 0;
		this.recomputeTrustworthiness();
	}
	async tether(initSDP) {
		this.abstractConnect();
		this.initSDP = initSDP;
		const returnSDP = await fetchArbitraryLinkSDP(initSDP);
		this.socket.crudeSend("provideSDP", { SDP: returnSDP });
		routableClients.add(this.CID, this.trustworthiness);
	}
	async amnesicReconnect() {
		this.abstractConnect();
		routableClients.add(this.CID, this.trustworthiness);
	}
	async recomputeTrustworthiness() {
		var tentativeScore;
		if (
			Math.round(this.trustworthinessHeusistic.invalidSDP > clientAges[this.CID] / 200) ||
			this.trustworthinessHeusistic.noAnswer > clientAges[this.CID] / 100 ||
			this.trustworthinessHeusistic.activeRouting > 1
		)
			tentativeScore = Infinity;
		tentativeScore +=
			50 * this.trustworthinessHeusistic.invalidSDP +
			15 * this.trustworthinessHeusistic.imposedConnections +
			25 * this.trustworthinessHeusistic.noAnswer +
			5 * this.trustworthinessHeusistic.invalidData;
		tentativeScore /= clientAges[this.CID];
		this.trustworthiness = tentativeScore;
		routableClients.modifyPriority(this.CID, this.trustworthiness);
	}
	async abstractConnect() {
		this.socket.on("message", async (message) => {
			var flagInvalidMessage = (message) => {
				logger.warn(
					`Recieved malformed data (${message}) from ${this.socket._socket.remoteAddress}, dumping by default.`
				);
				this.incrementTrustworthinessHeuristic("invalidData");
			};
			try {
				var parsed = JSON.parse(message);
				if (typeof parsed[0] === "undefined") throw new Error();
			} catch {
				flagInvalidMessage(message);
				return;
			}
			switch (parsed[0]) {
				case "heartbeat":
					break;
				case "reportNode":
					if (parsed.length != 2) {
						flagInvalidMessage(parsed);
						return;
					}
					if (!this.initSDP) {
						this.socket.crudeSend("ERROR");
						return;
					}
					if (clients[parsed[1]])
						clients[parsed[1]].incrementTrustworthinessHeuristic("invalidSDP");
					this.socket.crudeSend("provideSDP", { SDP: await fetchArbitraryLinkSDP(this.initSDP) });
					break;
				case "returnSDP":
					if (parsed.length != 3) {
						flagInvalidMessage(parsed);
						return;
					}
					eventHandler.dispatch(`serialRequestResponse|${this.CID}|${parsed[2]}`, parsed[1]);
					break;
				default:
					flagInvalidMessage(message);
					return;
			}
			this.mostRecentHeartbeat = +new Date();
		});
	}
}

async function terminateAndCleanClient(CID) {
	clients[CID].socket.close();
	delete clientAges[CID];
	delete clients[CID];
	Object.keys(eventHandler.dispatchWatchers)
		.filter((key) => {
			key.split("|")[1] == CID;
		})
		.forEach((key) => {
			eventHandler.forceReject(key, "Client channel died mid-route");
		});
	routableClients.delete(CID);
}

async function fetchArbitraryLinkSDP(initSDP, recursionDepth) {
	if (!recursionDepth) recursionDepth = 0;
	if (Object.keys(routableClients.cachedPriorities).length === 0) return "unresolved";
	const requestID = Math.random().toString().slice(2, 10);
	const nomineeIndex = await routableClients.fetchMin();
	const nominee = clients[nomineeIndex];
	nominee.socket.crudeSend("requestSDP", { SDP: initSDP, returnID: requestID });
	nominee.incrementTrustworthinessHeuristic("activeRouting");
	try {
		var resolution = await eventHandler.acquireExpectedDispatch(
			`serialRequestResponse|${nomineeIndex}|${requestID}`,
			CONFIG.defaultNoResponseTimeout
		);
		if (resolution == "ERROR" || resolution == "unresolved") throw new Error();
	} catch {
		nominee.incrementTrustworthinessHeuristic("noAnswer");
		recursionDepth++;
		if (recursionDepth < 2) {
			return await fetchArbitraryLinkSDP(initSDP, recursionDepth);
		} else {
			return "ERROR";
		}
	}
	nominee.incrementTrustworthinessHeuristic("imposedConnections");
	nominee.decrementTrustworthinessHeuristic("activeRouting");
	return resolution;
}

init();
