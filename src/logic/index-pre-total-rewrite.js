"use strict";

/////////supports no more than 20 nodes////////////ISSUE

//Making impossible patch request leads to huge memory consumption, trying to perform function thousands of times.

//all aliases are to be comprehended by default as strings

//make "source", "target" gossip &c. transports bidirectional/untyped in this sense

//finish implementing error handlers

//set up personal, non-public TURN server

const authenticatedSenders = [];

const HTMLEscape = document.createElement("textarea");
HTMLEscape.style = "visibliity : hidden; left -10000px; position: fixed;";

const pubAliasLookup = {};
const privAliasLookup = {};
const pubAliasUnparser = {};
const publicAliasTallies = {};
const liveChannels = {};

async function setALiases(pub, priv) {
	const parsedPub = parsePublicAlias(pub);
	pubAliasLookup[parsedPub] = priv;
	privAliasLookup[priv] = parsedPub;
	pubAliasUnparser[parsedPub] = pub;
}

async function deleteAliases(priv) {
	const parsedPub = delete privAliasLookup[priv];
	--publicAliasTallies[parsedPub];
	delete pubAliasLookup[parsedPub];
	delete pubAliasUnparser[parsedPub];
}

function parsePublicAlias(pub) {
	if (typeof pub == "undefined") pub = CONFIG.communication.defaultPublicAlias;
	HTMLEscape.textContent = pub;
	const sanitizedPub = HTMLEscape.innerHTML;
	publicAliasTallies[sanitizedPub] = publicAliasTallies[sanitizedPub]
		? publicAliasTallies[sanitizedPub]++
		: 0;
	return publicAliasTallies[sanitizedPub] == 0
		? sanitizedPub
		: `${sanitizedPub} (${publicAliasTallies[sanitizedPub]})`;
}

const server = {};
const CONFIG = {
	rtc: {
		ICEpresets: {
			iceServers: [
				{
					urls: "stun:stun.1.google.com:19302",
				},
				{
					urls: "turn:openrelay.metered.ca:80",
					username: "openrelayproject",
					credential: "openrelayproject",
				},
			],
		},
	},
	communication: {
		transmitMapToOrientedPeers: true,
		defaultPublicAlias: "anonymous",
		propogationInterval: 100,
	},
};

class adjacencyList {
	constructor() {
		this.list = {};
		this.nodes = {};
		this.export = false;
		this.distances = null;
		this.previous = null;
		this.dead = [];
		this.computationRefreshed = false;
		this.exportRefreshed = false;
	}
	importList(raw) {
		const mappedList = JSON.parse(raw);
		this.nodes = {};
		Object.keys(mappedList[0]).forEach((key) => {
			this.nodes[mappedList[0][key][0].toString()] = mappedList[0][key][1];
		});
		var unMappped = {};
		for (let i in mappedList[1]) {
			unMappped[mappedList[0][i][0]] = {};
			Object.keys(mappedList[1][i]).forEach((subKey) => {
				unMappped[mappedList[0][i][0]][mappedList[0][mappedList[1][i][subKey]][0]] =
					this.nodes[mappedList[0][subKey][0]];
			});
		}
		this.export = mappedList;
		this.list = Object.assign({}, unMappped);
		this.exportRefreshed = true;
		eventHandler.dispatch("mapImportCompleted");
	}
	addEdge(i, j) {
		if (!(Object.keys(this.nodes).includes(i) && Object.keys(this.nodes).includes(j))) return;
		this.list[i][j] = this.nodes[j];
		this.list[j][i] = this.nodes[i];
		this.exportRefreshed = false;
	}
	addNode(index, weight) {
		this.list[index] = {};
		this.nodes[index] = weight ? { weight } : { weight: 1 };
		this.exportRefreshed = false;
	}
	removeNode(index) {
		this.nodes[index] = null;
		delete this.list[index];
		this.exportRefreshed = false;
	}
	removeEdge(i, j) {
		delete this.list[i][j];
		delete this.list[j][i];
		this.exportRefreshed = false;
	}
	exportList() {
		var temporaryNodeMap = {};
		var persistentNodeMap = {};
		var iters = 0;
		for (let alias in this.nodes) {
			persistentNodeMap[iters.toString(32)] = [alias, this.nodes[alias]];
			temporaryNodeMap[alias] = [iters.toString(32)];
			iters++;
		}
		var mapped = {};
		for (let i in this.list) {
			mapped[temporaryNodeMap[i]] = this.list[i];
		}
		for (let key in mapped) {
			let subkeys = [];
			for (let subKey in mapped[key]) {
				subkeys.push(temporaryNodeMap[subKey]);
			}
			mapped[key] = subkeys;
		}
		this.export = [persistentNodeMap, mapped];
		return this.export;
	}
	optionalExport() {
		if (!this.exportRefreshed) return this.exportList();
		return this.export;
	}
	async precomputeRoutes(source) {
		var dist = {};
		var prev = {};
		var queue = new crudeQueue();
		dist[source] = 0;
		Object.keys(networkMap.list).forEach((node) => {
			if (node !== source) {
				prev[node] = undefined;
				dist[node] = Infinity;
			}
			queue.add(node, dist[node]);
		});
		while (Object.keys(queue.queue) != "") {
			var idealNode = queue.extractMin();
			Object.keys(networkMap.list[idealNode]).forEach((neighbor) => {
				if (!queue.cachedPriorities[neighbor]) return;
				let alt = dist[idealNode] + networkMap.nodes[neighbor].weight;
				if (alt < dist[neighbor] && dist[idealNode] != Infinity) {
					dist[neighbor] = alt;
					prev[neighbor] = idealNode;
					queue.modifyPriority(neighbor, alt);
				}
			});
		}
		this.distances = dist;
		this.previous = prev;
		this.computationRefreshed = true;
		return dist;
	}
	async findNextHop(endNode, currentNode) {
		if (!this.computationRefreshed) {
			console.log(this.computationRefreshed);
			await this.precomputeRoutes(currentNode);
			console.log(this.distances);
		}
		if (this.dead.includes(endNode)) {
			console.log("dead");
			return "inaccessible";
		}
		var node = endNode;
		var lastNode = undefined;
		while (node != currentNode) {
			lastNode = node;
			if (this.distances[node] == Infinity) return "inaccessible";
			node = this.previous[node];
		}
		return [lastNode, this.distances[endNode]];
	}
}

const unifyingData = {
	hiddenAlias: ((Math.random() + "").slice(2, 10) + (Math.random() + "").slice(2, 10))
		.toString(16)
		.slice(0, 10),
	publicAlias: "<b>somepublicAlias</b>",
};

const networkMap = new adjacencyList();

WebSocket.prototype.crudeSend = async function (type, typeArgs) {
	if (!type) return;
	switch (type) {
		case "heartbeat":
			this.send(JSON.stringify(["heartbeat"]));
			break;
		case "reportNode":
			if (!typeArgs.nodeID) return;
			this.send(JSON.stringify(["reportNode", typeArgs.nodeID]));
			break;
		case "returnSDP":
			if (!(typeArgs.SDP && typeArgs.reciprocalID)) return;
			this.send(JSON.stringify(["returnSDP", typeArgs.SDP, typeArgs.reciprocalID]));
	}
	return;
};
RTCDataChannel.prototype.standardSend = async function (type, wrapper, message, reciprocalID) {
	const packaged = JSON.stringify([type, wrapper, message, reciprocalID ?? null]);
	this.send(new TextEncoder().encode(packaged));
};

async function closeChannel(channel) {
	if (channel.peer) {
		topologyTransport.addGossip({
			source: channel.peer.hiddenAlias,
			target: unifyingData.hiddenAlias,
			mode: "removeLink",
		});
		deleteAliases(channel.peer.hiddenAlias);
	}
	channel.connectionDevice.connection.close();
	delete liveChannels[channel.peerID];
	channel = null;
}

class dataChannelConnection {
	constructor(iceTrickled = false) {
		this.iceTrickled = iceTrickled;
		this.peer = undefined;
		this.invoked = true;
		this.acquainted = false;
		this.oriented = true;
		this.connectionDevice = (() => {
			let connectionBuffer = {};
			connectionBuffer.connection = new RTCPeerConnection(CONFIG.rtc.ICEpresets.iceServers);
			connectionBuffer.channel = connectionBuffer.connection.createDataChannel("channel", {
				negotiated: true,
				id: 0,
				ordered: true,
				iceCandidatePoolSize: 1,
			});
			connectionBuffer.channel.binaryType = "arraybuffer";
			connectionBuffer.channel.onclose = () => {
				closeChannel(this);
			};
			connectionBuffer.channel.onopen = () => {
				if (this.invoked) {
					this.connectionDevice.channel.standardSend("firstConnectionAlignment", null, {
						hiddenAlias: unifyingData.hiddenAlias,
						oriented: this.oriented,
						publicAlias: unifyingData.publicAlias,
					});
					if (!this.oriented)
						eventHandler.acquireExpectedDispatch("mapImportCompleted", 10000).then(
							() => {},
							() => {}
						);
				}
			};
			connectionBuffer.channel.onmessage = async (event) => {
				console.log(JSON.parse(new TextDecoder().decode(event.data)));
				handleMessage(event.data, this);
			};
			return connectionBuffer;
		}).bind(this)();
	}
	async makeOffer() {
		if (this.connectionDevice.connection.remoteDescription ?? null) return;
		await this.connectionDevice.connection.setLocalDescription(
			await this.connectionDevice.connection.createOffer()
		);
		const syncICESessionID = Math.floor(Math.random() * 10000);
		this.connectionDevice.connection.onicecandidate = async function ({ candidate }) {
			if (candidate) return;
			eventHandler.dispatch(`iceCandidateStoreExhausted|${syncICESessionID}`);
		}.bind(this);
		await eventHandler.acquireExpectedDispatch(`iceCandidateStoreExhausted|${syncICESessionID}`);
		return this.connectionDevice.connection.localDescription;
	}
	async pullOffer(SDP) {
		if (this.connectionDevice.connection.localDescription) return;
		this.invoked = false;
		console.log(SDP);
		await this.connectionDevice.connection.setRemoteDescription({
			type: "offer",
			sdp: SDP.sdp,
		});
		await this.connectionDevice.connection.setLocalDescription(
			await this.connectionDevice.connection.createAnswer()
		);
		const syncICESessionID = Math.floor(Math.random() * 10000);
		this.connectionDevice.connection.onicecandidate = async function ({ candidate }) {
			if (candidate) return;
			eventHandler.dispatch(`iceCandidateStoreExhausted|${syncICESessionID}`);
		};
		await eventHandler.acquireExpectedDispatch(`iceCandidateStoreExhausted|${syncICESessionID}`);
		return this.connectionDevice.connection.localDescription;
	}
	async pullAnswer(SDP) {
		///Fix idiosyncratic handling of sdp : formatted differently from pull offer, SDP input format varies from peer vs server sends.
		if (this.connectionDevice.connection.remoteDescription) return;
		await this.connectionDevice.connection.setRemoteDescription(SDP);
	}
	async inertSend(raw) {
		this.connectionDevice.channel?.standardSend("consumable", null, {
			raw: JSON.stringify(raw),
		});
	}
}

async function makePatchRequest(destination, desiredPermissions) {
	if (Object.keys(liveChannels).includes(destination)) return;
	const nextHop = await networkMap.findNextHop(destination, unifyingData.hiddenAlias);
	if (nextHop == "inaccessible") {
		console.log("requested route inaccessible");
		return;
	}
	const connection = new dataChannelConnection(false);
	const data = JSON.stringify(btoa(JSON.stringify(await connection.makeOffer())));
	liveChannels[nextHop[0]].connectionDevice.channel.standardSend("patchRequest", null, {
		data: data,
		sender: unifyingData.hiddenAlias,
		destination: destination,
		desiredPermissions: desiredPermissions,
	});
	try {
		const richStatus = await eventHandler.acquireExpectedDispatch(
			`expectReturnRoute|${destination}`,
			10000
		);
		switch (Object.keys(richStatus)) {
			case "deferred":
				connection.connectionDevice.connection.close();
				throw new Error(
					`Routing process terminated at ${richStatus.deferred.failingNode} due to faulty regional connection map or instantaneous connection severing of a sole gateway connection.`
				);
			case "rejected":
				connection.connectionDevice.connection.close();
				console.log(
					`Unable to secure connection, requested node rejected${
						richStatus.rejected.reason
							? " with the following reason:" + richStatus.rejected.reason
							: ""
					}.`
				);
				break;
			case "accepted":
				if (desiredPermissions == "full") authenticatedSenders.push(destination);
				connection.pullAnswer(richStatus.accepted.data);
				break;
		}
	} catch (e) {
		console.log(
			`Unable to establish arbitrary route with ${destination}, event handler errored with the following code: ${e}`
		);
	}
}

async function escalateSendPermissions() {}

async function handleMessage(message, callingContext) {
	const parsed = JSON.parse(new TextDecoder().decode(message));
	if (!parsed[0]) return;
	switch (parsed[0]) {
		case "inert":
			logRecievedMessage(parsed[2].raw, callingContext?.peer?.hiddenAlias);
			break;
		case "gossip":
			gossipTransport.consumeGossip(parsed[2]);
			break;
		case "mapFetch":
			callingContext.connectionDevice.channel.standardSend("mapReturn", null, {
				map: JSON.stringify(networkMap.optionalExport()),
			});
			break;
		case "mapReturn":
			if (
				parsed[2].map !== "none" &&
				parsed[2].map !== null &&
				eventHandler.dispatchWatchers["mapImportCompleted"].length > 0
			)
				networkMap.importList(JSON.parse(parsed[2].map));
		case "patchRequest":
			console.log(parsed);
			if (parsed[2].destination == unifyingData.hiddenAlias) {
				console.log(`Long-distance route recieved: ${atob(JSON.parse(parsed[2].data))}`);
				handleRequestedRouting(parsed[2]);
				return;
			}
			console.log("notDestination");
			detatchedRoute(parsed[2].destination, ["coordination", "patchRequest", null, parsed[2]]);
			break;
		case "routingUpdate":
			if (unifyingData.hiddenAlias == parsed[2]?.destination) {
				eventHandler.dispatch(
					`expectReturnRoute|${parsed[2].desiredDestination}`,
					parsed[2].failingNode
						? { deferred: parsed[2] }
						: parsed[2].reason
						? { rejected: parsed[2] }
						: { accepted: parsed[2] }
				);
			}

		case "requestedRouteInaccessible":
			if (unifyingData.hiddenAlias == parsed[2].destination) {
				eventHandler.dispatch(`expectReturnRoute|${parsed[2].desiredDestination}`, "deferred");
				return;
			}
			detatchedRoute(parsed[2].destination, parsed);
		case "firstConnectionAlignment":
			if (callingContext.acquainted) return;
			messageMethods.firstConnectionAlignment(parsed[2], callingContext);
			break;
		case "reciprocalAlignment":
			if (callingContext.acquainted) return;
			messageMethods.reciprocalAlignment(parsed[2], callingContext);
			break;
		default:
			// log(
			//   `Irregular data package provided, bearing the type '${parsed[0]},' ignoring and writing contents to pakgageTable`
			// );
			return;
	}
	return parsed;
}

async function parseNetworkMap() {
	let unDisplayed = Object.assign([], Object.keys(networkMap.nodes));
	let routes = [];
	let totals = {};
	for (let root in networkMap.list) {
		for (let peer in networkMap.list[root]) {
			if (unDisplayed.indexOf(peer) === -1) {
				continue;
			}
			totals[root] = totals[root] ? ++totals[root] : 1;
			totals[peer] = totals[peer] ? ++totals[peer] : 1;
			routes.push(`${root} : ${peer}`);
		}
		unDisplayed.splice(unDisplayed.indexOf(root), unDisplayed.indexOf(root) + 1);
	}
	document.body.innerHTML = "";
	routes.forEach((pair) => {
		document.body.innerHTML += `${pair}<br>`;
	});
	document.body.innerHTML += "<br>";
	for (let i in totals) {
		document.body.innerHTML += `node ${i}  |  ${totals[i]} connections<br>---------------------------------------------------<br>`;
	}
}

async function generateServerLink(novel) {
	var SDPFailureEvents = 0;
	if (novel) {
		var foundationalChannel = new dataChannelConnection(false);
		foundationalChannel.oriented = false;
		var offer = await foundationalChannel.makeOffer();
		server.server = new WebSocket(
			`ws://127.0.0.1:8777/bind?originatingSDP=${encodeURIComponent(btoa(JSON.stringify(offer)))}`
		);
	} else {
		server.server = new WebSocket(`ws://127.0.0.1:8777/reconnect`);
	}
	server.server.onmessage = async (event) => {
		console.log("event");
		const message = JSON.parse(event.data);
		console.log(message);
		server.server.crudeSend("heartbeat");
		switch (message[0]) {
			case "heartbeat":
				break;
			case "provideSDP":
				if (message[1] === "unresolved") {
					foundationalChannel.connectionDevice.connection.close();
					return;
				}
				try {
					await foundationalChannel.pullAnswer(message[1]);
				} catch {
					SDPFailureEvents++;
					if (SDPFailureEvents < 2) {
						server.server.crudeSend(reportNode, { nodeID: message[3] });
					} else {
						alert(
							"Something went wrong with the node you were being bound to. Please reload the page, and feel free to file a bug report if the issue persists."
						);
					}
				}
				break;
			case "ERROR":
				alert(
					"The routing server experienced an error while attempting to make your initial connection. Please reload the page, and feel free to file a bug report if the issue persists"
				);
				foundationalChannel.connectionDevice.connection.close();
				return;
			case "requestSDP":
				const connection = new dataChannelConnection(false);
				const SDP = await connection.pullOffer(JSON.parse(atob(message[1])));
				server.server.crudeSend("returnSDP", { SDP, reciprocalID: message[2] });
		}
		server.server.onclose = () => {
			setTimeout(() => {
				generateServerLink(false);
			}, 5000);
		};
	};
}

class GossipTransport {
	constructor() {
		this.types = {};
		this.propogationStack = [];
		this.intervals = {};
		this.knownFacts = [];
		this.pulseIterations = 0;
		this.parsers = {
			default: async function (block, type, saveArgs) {
				saveArgs = saveArgs ? saveArgs : Object.keys(block[0]);
				saveArgs.push("type");
				block.type = type;
				var committable = [];
				var unknown = [];
				for (let component of block) {
					var data = {};
					Object.keys(component)
						.filter((key) => saveArgs.includes(key))
						.forEach((key) => (data[key] = component[key]));
					console.log(
						this.knownFacts.includes(JSON.stringify(data)),
						!this.knownFacts.includes(JSON.stringify(data)) && Object.keys(data).length > 0
					);
					if (!this.knownFacts.includes(JSON.stringify(data)) && Object.keys(data).length > 0) {
						committable.push(data);
						unknown.push(component);
						this.types?.[type].buffer.push(component);
						this.knownFacts.push(JSON.stringify(data));
					}
				}
				console.log(committable);
				return [committable, unknown];
			}.bind(this),
		};
	}
	async pushToPropogationStack(type) {
		if (this.types[type].buffer.length > 0 && this.propogationStack.indexOf(type) == -1) {
			this.propogationStack.push(type);
		}
	}
	addType(type, iterModulo) {
		if (this.types[type]) return;
		var triggerFunctions = {
			designateEndpoints: async function designateEndpoints(...endpoints) {
				this.types[type].endpoints = endpoints;
			}.bind(this),
			addGossip: async function addGossip(gossip) {
				await this.parsers[type]([gossip]);
			}.bind(this),
			remove: async function remove() {
				triggerFunctions.addGossip({ status: terminating });
				await propogateAll(type);
				triggerFunctions = null;
				delete this.types[type];
				if (this.intervals?.[iterModulo].includes(type))
					this.intervals = this.intervals.splice(this.intervals[iterModulo].indexOf(type), 1);
			}.bind(this),
		};
		if (typeof iterModulo != "number") {
			this.intervals["null"].push(type);
			triggerFunctions.propogate = () => {
				this.pushToPropogationStack(type);
			};
		} else {
			if (!this.intervals[iterModulo]) this.intervals[iterModulo] = [];
			this.intervals[iterModulo].push(type);
		}
		this.types[type] = {
			endpoints: false,
			buffer: [],
		};
		return triggerFunctions;
	}
	async addParser(type, useDefault, parserCallback, saveArgs) {
		if (this.parsers[type]) return;
		const pre = useDefault
			? this.parsers.default
			: async () => {
					[];
			  };
		this.parsers[type] = async function (block) {
			const defaultOutput = await pre(block, type, saveArgs);
			return await (parserCallback ?? (async () => {}))(block, type, ...defaultOutput);
		};
		this.parsers[type].saveArgs = saveArgs;
	}
	async removeParser(type) {
		delete this.parsers[type];
	}
	async propogateAll(type, fixedBlock) {
		var typeObject = fixedBlock ? { buffer: [] } : this.types[type];
		var block = fixedBlock ? fixedBlock : typeObject.buffer;
		if (block == "") return;
		const byteLen = new TextEncoder().encode(block).length;
		if (byteLen > 16384) {
			var chunks = [];
			for (let i = 0; i < Math.ceil(byteLen / 16384); i++) {
				chunks.push(
					block.slice(
						Math.ceil(((block.length * 16384) / byteLen) * i),
						Math.floor(((block.length * 16384) / byteLen) * (i + 1)) + 1
					)
				);
				chunks = chunks.filter((chunk) => {
					return chunk != "";
				});
			}
			for (let channel in this.types[type].endpoints || liveChannels) {
				if (!Object.keys(liveChannels).includes(channel)) continue;
				chunks.forEach((chunk) => {
					this.sendGossipPackage({ type, chunk }, channel);
				});
			}
			typeObject.buffer = [];
			return;
		}
		for (let channel in this.types[type].endpoints || liveChannels) {
			if (!Object.keys(liveChannels).includes(channel)) continue;
			this.sendGossipPackage({ type, block }, channel);
		}
		typeObject.buffer = [];
	}
	async sendGossipPackage(pkg, channel) {
		liveChannels[channel].connectionDevice.channel.standardSend("gossip", null, pkg);
	}
	async consumeGossip(gossip) {
		console.log(gossip);
		if (this.parsers[gossip.type]) {
			this.parsers[gossip.type](gossip.block);
		} else this.parsers.default(gossip.block);
	}
	propogationPulse = setInterval(() => {
		for (let modulo in this.intervals) {
			if (this.pulseIterations % (modulo != "null" ? modulo : Infinity) === 0) {
				this.intervals[modulo].forEach((type) => {
					this.pushToPropogationStack(type);
				});
			}
		}
		this.propogationStack.forEach((type, index) => {
			this.propogateAll(type);
			this.propogationStack.slice(index, index + 1);
		});
		++this.pulseIterations;
	}, CONFIG.communication.propogationInterval);
}

const gossipTransport = new GossipTransport();
const topologyTransport = gossipTransport.addType("topology", 1);
gossipTransport.addParser(
	"topology",
	true,
	async function (_, __, committable) {
		const flipMode = function (negated) {
			let inverseIndex = gossipTransport.knownFacts.indexOf(JSON.stringify(negated));
			if (inverseIndex !== -1) {
				gossipTransport.knownFacts.slice(inverseIndex, inverseIndex + 1);
			}
		};
		committable.forEach((modification) => {
			const { mode, ...negated } = modification;
			switch (mode) {
				case "addLink":
					negated.mode = "removeLink";
					flipMode(negated);
					if (!Object.keys(networkMap.nodes).includes(modification.source)) {
						networkMap.addNode(modification.source);
						setALiases(modification.pubTarget, modification.target);
					}
					if (!Object.keys(networkMap.nodes).includes(modification.target)) {
						networkMap.addNode(modification.target);
						setALiases(modification.pubSource, modification.source);
					}
					networkMap.addEdge(modification.source, modification.target);
					break;
				case "removeLink":
					negated.mode = "addLink";
					flipMode(negated);
					networkMap.removeEdge(modification.source, modification.target);
					["source", "target"].forEach((nodeType) => {
						if (networkMap.list[modification[nodeType]] == "") {
							networkMap.removeNode(modification[nodeType]); //can delete from aliasLookupNamespace if reasonable
						}
					});
					break;
			}
		});
		parseNetworkMap();
	},
	["source", "target", "publicAlias", "hiddenAlias", "mode"]
);

async function requestExternalRoute(hiddenID) {}

///Isolated Classes////

class crudeQueue {
	constructor() {
		this.cachedPriorities = {};
		this.queue = {};
	}
	add(item, priority) {
		this.cachedPriorities[item] = priority;
		if (!this.queue[priority]) {
			this.queue[priority] = [];
		}
		this.queue[priority].push(item);
	}
	extractMin() {
		const index = Math.min(...Object.keys(this.queue));
		const extracted = this.queue[index].pop();
		delete this.cachedPriorities[extracted];
		if (this.queue[index] == "") delete this.queue[index];
		return extracted;
	}
	modifyPriority(item, newPriority) {
		this.queue[this.cachedPriorities[item]].splice(
			this.queue[this.cachedPriorities[item]].indexOf(item),
			1
		);
		if (this.queue[this.cachedPriorities[item]] == "") delete this.queue[this.cachedPriorities[item]];
		this.add(item, newPriority);
	}
}

//Execution//
generateServerLink(true);

//////////Integrations//////////
async function logRecievedMessage(raw, sender) {
	document.body.innerHTML += `!${sender} : ${JSON.parse(raw)}`;
}
