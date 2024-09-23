/** @format */

// Copyright 2022 Elijah Bodden

// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

"use strict";

var CONFIG = {};

const allICEServers = [
        {
                urls: "stun:membranexus.com"
        },
        {
                urls: "turn:membranexus.com",
                username: "membrane",
                credential: "membrane"
        }
];
const STUNOnly = [
        {
                urls: "stun:membranexus.com"
        }
];

/*
	! NB !
	Do not, under any circumstances, and at penalty of network integrity, modify the following: 
		- rtc\Icepresets\binaryType
		- communication\specHiddenAliasAttributes\*
		- constants\radix36Charset
		- rtc\communication\hiddenAlias
*/

var defaultConfig = {
	rtc: {
		ICEpresets: {
			iceServers: [
				{
					urls: "stun:membranexus.com"
				},
				{
                			urls: "turn:membranexus.com",
                			username: "membrane",
                			credential: "membrane"
				}
			],
			iceCandidatePoolSize: 255,
		},
		ICEGatheringMaxLatency: 10000,
		defaultChannelLabel: "channel",
		channelOptions: {
			negotiated: true,
			id: 0,
			ordered: true,
		},
		channelID: undefined,
		binaryType: "arraybuffer",
	},
	communication: {
		defaultUnknownPublicAlias: undefined,
		basicPropogationInterval: 100,
		publicAlias: "",
		specHiddenAliasAttributes: {
			len: 9,
		},
		hiddenAlias: Math.random().toString(36).slice(2, 11),
		publicKey: null,
		privateKey: null,
		packageArgs: {
			consumable: { required: ["raw"], optional: [] },
			gossip: { required: ["type", "block"], optional: ["!*"] },
			mapFetch: { required: [], optional: [] },
			mapReturn: { required: ["map"], optional: [] },
			routeImperative: {
				required: ["SDP", "sender", "destination", "routeID"],
				optional: ["desiredPermissions", "!*"],
			},
			invokerIntroduction: {
				required: ["hiddenAlias", "isOriented"],
				optional: ["publicAlias"],
			},
			reciprocalAlignment: {
				required: ["hiddenAlias"],
				optional: ["publicAlias", "map"],
			},
			routeInaccessible: {
				required: ["routeID", "pointOfFailure", "destination"],
				optional: ["!"],
			},
			routeRejected: { required: ["destination", "routeID"], optional: ["!*"] },
			routeAccepted: {
				required: ["SDP", "destination", "routeID"],
				optional: ["!*"],
			},
			permissionEscalationRequest: { required: ["level"], optional: ["!*"] },
			permissionEscalationResponse: { required: ["status"], optional: ["!*"] },
			forcefulDeauth: { required: [], optional: ["!*"] },
		},
		allowNonStandardParsers: false,
		mapImportTimeout: 10000,
		moderateMapInstabilityTolerance: true,
		arbitraryPeerRouteTimeout: 100000000,
		routeAcceptHeuristic: async function (pkg) {
			if (pkg.desiredPermissions === "advanced") {
				var crystalizedRef = CONFIG.UI.renderUnfamiliarPublicAliases
					? hiddenAliasLookup[pkg.sender] ?? pkg.sender
					: pkg.sender;
				eventStream.log(
					"system",
					`Peer authentication requested by ${crystalizedRef}`,
					"transient",
					["align-center", "system-message-card-route-pending", "message-card-slim"],
					pkg.sender
				);
				var accepted = true;
				try {
					await eventHandler.acquireExpectedDispatch(
						`authenticationAuthorized|${pkg.sender}`,
						CONFIG.communication.arbitraryPeerRouteTimeout
					);
				} catch {
					eventStream.chatCache.system.exchange
						.filter(
							(item) =>
								item.data.includes(crystalizedRef) &&
								item.tags.includes("system-message-card-route-pending")
						)
						.forEach((request) => {
							request.tags.push("system-message-card-error");
							request.tags.splice(request.tags.indexOf("system-message-card-route-pending"), 1);
							eventStream.optionalLoad("system");
						});
					accepted = false;
				}
				return accepted;
			}
			return true;
		},
	},
	constants: {
		defaultPropagationIterMod: 1,
		radix36Charset: [
			"0", "1", "2", "3", "4", "5",
			"6", "7", "8", "9", "a", "b",
			"c", "d", "e", "f", "g", "h",
			"i", "j", "k", "l", "m", "n",
			"o", "p", "q", "r", "s", "t",
			"u", "v", "w", "x", "y", "z",
		],
		defaultEventHandlingMechanismTimeout: 100000,
		violationWeightPenalties: {
			pointOfRouteFailure: 10,
			acquaintedInitAttempt: 10,
			invalidMessage: 15,
			invalidAliasInRoutingMap: 20,
			failedGossip: 25,
			genericUncaughtError: 35,
			initSequenceError: 100,
			invalidSDP: 100,
		},
		configLoadFunction: async function () {
			window.addEventListener("DOMContentLoaded", () => eventHandler.dispatch("DOMFunctional"));
			await eventHandler.acquireExpectedDispatch("DOMFunctional");
			await fillDefaults();
			if (
				!JSON.parse(window.localStorage.config ?? "{}")?.["communication.publicAlias"] ||
				!JSON.parse(window.localStorage.config ?? "{}").rememberMe
			) {
				await (async () => {
					effectiveFirstVisit = true;
					var contentDisabler = document.createElement("iframe");
					contentDisabler.style.position = "absolute";
					contentDisabler.style.left =
						contentDisabler.style.right =
						contentDisabler.style.top =
						contentDisabler.style.bottom =
							"0px";
					contentDisabler.style.width = contentDisabler.style.height = "100%";
					contentDisabler.style.border = "0px";
					contentDisabler.style.zIndex = 100000;
					document.querySelector("#init-blur-wrapper").style.visibility = "visible";
					document.querySelector("#init-blur-wrapper").style.filter =
						"blur(3px) saturate(90%) brightness(90%)";
					document.body.appendChild(contentDisabler);
					const selectedHiddenAlias = await hiddenAliasPromptMenu();
					document
						.querySelector("#init-blur-wrapper")
						.replaceWith(...document.querySelector("#init-blur-wrapper").childNodes);
					document.body.removeChild(contentDisabler);
					exportToLS("communication.publicAlias", selectedHiddenAlias);
				})();
			} else {
				document
					.querySelector("#init-blur-wrapper")
					.replaceWith(...document.querySelector("#init-blur-wrapper").childNodes);
			}
			var modifiedConfig = JSON.parse(window.localStorage.config ?? "{}");
			var keys = await window.crypto.subtle.generateKey({name: "ECDSA", namedCurve: "P-384"}, true, ["sign", "verify"])
			modifiedConfig["communication.publicKey"] = keys.publicKey
			modifiedConfig["communication.privateKey"] = keys.privateKey
			return modifiedConfig
		},
	},
	serverLink: {
		initBindURL: `wss://${window.location.hostname}:8777/bind?originatingSDP=*`,
		reconnectURL: `wss://${window.location.hostname}:8777/reconnect`,
		reconnectInterval: 5000,
		defaultNoResponseTimeout: 20000,
	},
	UI: {
		renderUnfamiliarPublicAliases: true,
	},
};

var mostRecentServerHeartbeat = NaN;
var effectiveFirstVisit = false;
const livePeers = {};
const authPeers = [];
const currentlyAuthenticating = [];
var serverHardRestart;
var serverTabCloseAlert;
const pubAliasLookup = {};
const hiddenAliasLookup = {};
const pubAliasUnparser = {};
const publicAliasTallies = {};
const initialReferenceLedger = {};
const HTMLEscape = document.createElement("textarea");
HTMLEscape.setAttribute("style", "visibility : hidden; left -10000px; position: fixed;");
var eventHandler;
var networkMap;
var gossipTransport;
var topologyTransport;
var routingTableTransport;

function addAuthPeer(peer) {
	if (typeof peer != "string") return;
	if (currentlyAuthenticating.includes(peer))
		currentlyAuthenticating.splice(currentlyAuthenticating.indexOf(peer), 1);
	authPeers.push(peer);
	eventHandler.dispatch("authPeersUpdated", ["addition", peer]);
}

function deleteAuthPeer(peer) {
	if (authPeers.indexOf(peer) == -1) return;
	authPeers.splice(authPeers.indexOf(peer), 1);
	eventHandler.dispatch("authPeersUpdated", ["deletion", peer]);
}

async function onAuthPeersUpdated(callback) {
	eventHandler.onReceipt("authPeersUpdated", callback);
}

async function deauthPeer(peer, isPredicator) {
	if (!authPeers.includes(peer)) return;
	if (isPredicator) {
		livePeers[peer].transport.channel.standardSend("forcefulDeauth");
		deleteAuthPeer(peer);
	} else {
		deleteAuthPeer(peer);
		obviatePeerError(peer);
	}
}

async function loadConfig(defaultConfig, provisionFunction) {
	checkForTypeErrors([{ defaultConfig }, { provisionFunction }], [["object"], ["function", "undefined"]]);
	if (!provisionFunction) {
		CONFIG = defaultConfig;
		return;
	}
	const provided =
		provisionFunction.constructor.name === "AsyncFunction"
			? await provisionFunction()
			: provisionFunction();
	checkForTypeErrors([{ provided }], [["object"]]);
	var loadableConfig = defaultConfig;
	for (let i in provided) {
		const referenceChain = i.split(".");
		const deepestProperty = referenceChain.slice(-1);
		const defaultPrefParent = referenceChain.slice(0, -1).reduce((previous, current) => {
			return previous[current];
		}, loadableConfig);
		if (typeof defaultPrefParent[deepestProperty] === typeof provided[i]) {
			defaultPrefParent[deepestProperty] = provided[i];
		}
	}
	CONFIG = loadableConfig;
}

WebSocket.prototype.crudeSend = async function (type, typeArgs) {
	checkForTypeErrors([{ type }, { typeArgs }], [["string"], ["object", "undefined"]]);
	switch (type) {
		case "heartbeat":
			this.send(JSON.stringify(["heartbeat"]));
			mostRecentServerHeartbeat = +new Date();
			break;
		case "reportNode":
			checkForTypeErrors([{ "typeArgs.nodeID": typeArgs.nodeID }], [["string"]]);
			this.send(JSON.stringify(["reportNode", typeArgs.nodeID]));
			break;
		case "returnSDP":
			checkForTypeErrors(
				[{ "typeArgs.SDP": typeArgs.SDP }, { "typeArgs.reciprocalID": typeArgs.reciprocalID }],
				[["string"], ["string"]]
			);
			this.send(JSON.stringify(["returnSDP", typeArgs.SDP, typeArgs.reciprocalID]));
			break;
		case "ignoreSDPRequest":
			checkForTypeErrors([{ "typeArgs.reciprocalID": typeArgs.reciprocalID }], [["string"]]);
			this.send(JSON.stringify(["ignoreSDPRequest", typeArgs.reciprocalID]));
			break;
		default:
			throw new Error(
				`unable to communicate websocket message of type "${type}": no specified bundling method matches the criterion.`
			);
	}
};

RTCDataChannel.prototype.standardSend = async function (type, messageParams) {
	checkForTypeErrors([{ type }, { messageParams }], [["string"], ["object", "undefined"]]);
	const packaged = JSON.stringify(messageParams ? [type, messageParams] : [type]);
	this.send(CONFIG.rtc.binaryType === "arrayBuffer" ? new TextEncoder().encode(packaged) : packaged);
};

class eventHandlingMechanism {
	constructor() {
		this.handlerFrame = {};
		this.dispatchWatchers = {};
	}
	onReceipt(signalIdentifier, callback) {
		if (!(signalIdentifier in this.handlerFrame)) {
			this.handlerFrame[signalIdentifier] = [];
		}
		this.handlerFrame[signalIdentifier].push(callback);
	}
	dispatch(signalIdentifier, externalDetail) {
		if (this.handlerFrame[signalIdentifier]) {
			this.handlerFrame[signalIdentifier].forEach((method) => {
				method(signalIdentifier, externalDetail, this.handlerFrame[signalIdentifier]);
			});
		}
		if (this.dispatchWatchers[signalIdentifier]) {
			this.dispatchWatchers[signalIdentifier].forEach((watcher) => {
				watcher.resolve({
					signalIdentifier: signalIdentifier,
					externalDetail: externalDetail,
				});
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
									timeout ??
									CONFIG?.constants?.defaultEventHandlingMechanismTimeout ??
									100000
								}ms`
							);
					}, timeout ?? CONFIG?.constants?.defaultEventHandlingMechanismTimeout ?? 100000);
				}),
				reject: rejectGeneratedPromise,
				resolve: resolveGeneratedPromise,
			}) - 1;
		return await this.dispatchWatchers[dispatchIdentifier][index].promise;
	}
	async flushExpectedDispatches() {
		for (let i in this.dispatchWatchers) {
			for (let j = 0; j < this.dispatchWatchers[i].length; j++) {
				this.dispatchWatchers[i][j].resolve({
					signalIdentifier: i,
					externalDetail: "flushed",
				});
			}
			delete this.dispatchWatchers[i];
		}
	}
}
eventHandler = new eventHandlingMechanism();

class AbstractMap {
	constructor() {
		this.adjacencyList = {};
		this.nodes = {};
		this.export = undefined;
		this.distances = undefined;
		this.previous = undefined;
		this.computationRefreshed = false;
		this.exportRefreshed = false;
	}
	async onUpdate(callback) {
		eventHandler.onReceipt("abstractMapUpdate", callback);
	}
	async triggerUpdate(method, relevantInformation) {
		eventHandler.dispatch("abstractMapUpdate", [method, relevantInformation]);
	}
	async importList(raw, provider) {
		try {
			checkForTypeErrors([{ raw }, { provider }], [["string"], ["string"]]);
			var mappedList = JSON.parse(raw);
			if (!Array.isArray(mappedList))
				throw new TypeError(`the provided JSON-parsed object (${raw} raw) is not an array`);
			Object.keys(mappedList[0]).reduce((expendedKeys, currentKey) => {
				expendedKeys.push(currentKey);
				try {
					verifyHiddenAlias(mappedList[0][currentKey][0]);
					addAlias(mappedList[0][currentKey][2], mappedList[0][currentKey][0]);
					this.addNode(mappedList[0][currentKey][0], mappedList[0][currentKey][1]);
				} catch (error) {
					if (CONFIG.communication.moderateMapInstabilityTolerance) {
						shiftNodeWeight(
							provider,
							CONFIG.constants.violationWeightPenalties.invalidAliasInRoutingMap
						);
						this.removeNode(mappedList[0][currentKey][0]);
						deleteAlias(mappedList[0][currentKey][0]);
						delete mappedList[0][currentKey];
						return;
					} else {
						expendedKeys.forEach((key) => {
							this.removeNode(key);
							deleteAlias(key);
						});
						throw new Error(
							`sumarily terminating map import: provided key ${currentKey} could not be admitted because ${error}`
						);
					}
				}
				return expendedKeys;
			}, []);
			for (let i in mappedList[1]) {
				mappedList[1][i].forEach((subKey) => {
					if (!(mappedList[0]?.[subKey]?.[0] && mappedList[0]?.[i]?.[0])) return;
					this.addEdge(mappedList[0][i][0], mappedList[0][subKey][0]);
				});
			}
		} catch (error) {
			if (livePeers[provider]) peerConnection.prototype.close(livePeers[provider]);
			return;
		}
		eventHandler.dispatch("mapImportSuccessful");
		this.export = raw;
		this.exportRefreshed = true;
	}
	addEdge(i, j) {
		checkForTypeErrors(
			[{ i }, { j }],
			[
				["string", "number"],
				["string", "number"],
			]
		);
		var nodePresences = [Object.keys(this.nodes).includes(i), Object.keys(this.nodes).includes(j)];
		if (!(nodePresences[0] && nodePresences[1]))
			throw new Error(
				`Unable to create a representative edge between the nodes aliased ${i} and ${j} as ${
					nodePresences[0] ^ nodePresences[1]
						? 'there exists no node "' + [i, j][nodePresences.indexOf(false)] + '"'
						: "neither may be found"
				} within the present networkMap`
			);
		this.adjacencyList[i][j] = this.nodes[j];
		this.adjacencyList[j][i] = this.nodes[i];
		this.triggerUpdate("addEdge", [i, j]);
		this.exportRefreshed = false;
	}
	addNode(key, weight) {
		checkForTypeErrors(
			[{ key }, { weight }],
			[
				["string", "number"],
				["undefined", "number"],
			]
		);
		this.adjacencyList[key] = {};
		this.setweight(key, weight ?? 1);
		this.triggerUpdate("addNode", key);
		this.exportRefreshed = false;
	}
	removeNode(key) {
		try {
			checkForTypeErrors([{ key }], [["string", "number"]]);
		} catch {
			return;
		}
		if (!(this.nodes[key] || this.adjacencyList[key])) return;
		delete this.nodes[key];
		delete this.adjacencyList[key];
		this.triggerUpdate("removeNode", key);
		this.exportRefreshed = false;
	}
	removeEdge(i, j) {
		try {
			checkForTypeErrors(
				[{ i }, { j }],
				[
					["string", "number"],
					["string", "number"],
				]
			);
		} catch (error) {
			return;
		}
		if (!(this.adjacencyList[i]?.[j] || this.adjacencyList[j]?.[i])) {
			return;
		}
		delete this.adjacencyList[i]?.[j];
		delete this.adjacencyList[j]?.[i];
		this.triggerUpdate("removeEdge", [i, j]);
		this.exportRefreshed = false;
	}
	async exportList() {
		var temporaryNodeMap = {};
		var persistentNodeMap = {};
		var mapped = {};
		var iters = 0;
		for (let alias in this.nodes) {
			let shorthand = iters.toString(36);
			persistentNodeMap[shorthand] =
				alias === CONFIG.communication.hiddenAlias
					? [alias, this.nodes[alias].weight, CONFIG.communication.publicAlias]
					: [alias, this.nodes[alias].weight, initialReferenceLedger[alias]];
			mapped[shorthand] = this.adjacencyList[alias];
			temporaryNodeMap[alias] = iters.toString(36);
			iters++;
		}
		for (let key in mapped) {
			let subkeys = [];
			for (let subKey in mapped[key]) {
				subkeys.push(temporaryNodeMap[subKey]);
			}
			mapped[key] = subkeys;
		}
		this.export = JSON.stringify([persistentNodeMap, mapped]);
		this.exportRefreshed = true;
		return this.export;
	}
	async optionalExport() {
		const elected = !this.exportRefreshed ? await this.exportList() : this.export;
		return elected ? elected : "none";
	}
	async precomputeRoutes(source) {
		checkForTypeErrors([{ source }], [["string", "number"]]);
		if (!Object.keys(this.nodes).includes(source))
			throw new Error(
				`Requested source node (${source}) is not present within AbstractMap.__instance__.nodes`
			);
		var dist = {};
		var prev = {};
		var queue = new crudeQueue();
		dist[source] = 0;
		Object.keys(this.adjacencyList).forEach((node) => {
			if (node !== source) {
				prev[node] = undefined;
				dist[node] = Infinity;
			}
			queue.add(node, dist[node]);
		});
		while (Object.keys(queue.queue) != "") {
			var current = queue.extractMin();
			Object.keys(this.adjacencyList[current]).forEach((neighbor) => {
				if (!queue.cachedPriorities[neighbor]) return;
				let alt = dist[current] + this.nodes[neighbor].weight;
				if (alt < dist[neighbor] && dist[current] != Infinity) {
					dist[neighbor] = alt;
					prev[neighbor] = current;
					queue.modifyPriority(neighbor, alt);
				}
			});
		}
		this.distances = dist;
		this.previous = prev;
		this.computationRefreshed = true;
	}
	async findNextHop(currentNode, endNode) {
		checkForTypeErrors(
			[{ currentNode }, { endNode }],
			[
				["string", "number"],
				["string", "number"],
			]
		);
		await this.precomputeRoutes(currentNode);
		if (!(Object.keys(this.nodes).includes(currentNode) && Object.keys(this.nodes).includes(endNode))) {
			throw new Error(
				`The requested route <${currentNode} -> ${endNode}> is not possible in the current map (one of both of these members does not exist).`
			);
		}
		var node = endNode;
		var lastNode = undefined;
		while (node != currentNode) {
			lastNode = node;
			if (this.distances[node] == Infinity)
				throw new Error(
					`The requested route <${currentNode} -> ${endNode}> is not possible in the current map (there exists no path between intermediary node ${node} and the current node).`
				);
			node = this.previous[node];
		}
		return lastNode;
	}
	async reload() {
		this.adjacencyList = {};
		this.nodes = {};
		this.export = undefined;
		this.distances = undefined;
		this.previous = undefined;
		this.computationRefreshed = false;
		this.exportRefreshed = false;
		this.triggerUpdate("totalWipe");
	}
	async setweight(key, weight) {
		this.nodes[key] = { weight };
	}
}

networkMap = new AbstractMap();

networkMap.onUpdate((_sig, externalDetail) => {
	if (Object.keys(livePeers).length != 1 || externalDetail[0] != "addNode") return;
	setTimeout(() => {
		peerConnection.prototype.stabilizeLink().catch(() => {});
	}, 500);
});

class crudeQueue {
	constructor() {
		this.cachedPriorities = {};
		this.queue = {};
	}
	add(item, priority) {
		checkForTypeErrors([{ item }, { priority }], [["number", "string"], ["number"]]);
		this.cachedPriorities[item] = priority;
		if (!this.queue[priority]) {
			this.queue[priority] = [];
		}
		this.queue[priority].push(item);
	}
	extractMin() {
		if (Object.keys(this.queue) == "")
			throw new Error(`unable to extract key of minimum priority, queue is empty`);
		const index = Math.min(...Object.keys(this.queue));
		const extracted = this.queue[index].pop();
		delete this.cachedPriorities[extracted];
		if (this.queue[index] == "") delete this.queue[index];
		return extracted;
	}
	modifyPriority(item, newPriority) {
		checkForTypeErrors(
			[
				{ item },
				{ newPriority },
				{ "this.queue[oldPriority]": this.queue[this.cachedPriorities[item]] },
			],
			[["number", "string"], ["number"], ["object"]]
		);
		this.queue[this.cachedPriorities[item]].splice(
			this.queue[this.cachedPriorities[item]].indexOf(item),
			1
		);
		if (this.queue[this.cachedPriorities[item]] == "") delete this.queue[this.cachedPriorities[item]];
		this.add(item, newPriority);
	}
}

async function addLivePeer(ref, value) {
	livePeers[ref] = value;
	eventHandler.dispatch("livePeersUpdated");
}

async function onLivePeersUpdated(callback) {
	eventHandler.onReceipt("livePeersUpdated", callback);
}

async function deleteLivePeer(ref) {
	delete livePeers[ref];
	if (authPeers.includes(ref)) deleteAuthPeer(ref);
	eventHandler.dispatch("livePeersUpdated");
}

class peerConnection {
	constructor(permissions) {
		checkForTypeErrors([{ permissions }], [["string", "undefined"]]);
		this.closed = false;
		this.acquainted = false;
		this.voluntary = true;
		this.peerData = {
			hiddenAlias: undefined,
		};
		this.permissions = permissions ?? "standard";
		this.isAuth = permissions == "advanced";
		this.internalUID = `UID : ${Math.random().toString(36).slice(2, 11)}`;
		this.transport = (() => {
			let buffer = {};
			buffer.connection = new RTCPeerConnection(CONFIG.rtc.ICEpresets);
			buffer.channel = buffer.connection.createDataChannel(
				CONFIG.rtc.defaultChannelLabel,
				CONFIG.rtc.channelOptions
			);
			buffer.channel.binaryType = CONFIG.rtc.binaryType;
			buffer.channel.onclose = function () {
				if (this.closed) return;
				peerConnection.prototype.close(this);
			}.bind(this);
			buffer.channel.onopen = function () {
				this.announcePeer();
				if (this.voluntary) {
					this.transport.channel.standardSend("invokerIntroduction", {
						hiddenAlias: CONFIG.communication.hiddenAlias,
						isOriented: Object.keys(networkMap.nodes) != "",
						publicAlias: CONFIG.communication.publicAlias,
					});
					if (Object.keys(networkMap.nodes) == "") primeForMapImport(this.internalUID);
				}
			}.bind(this);
			buffer.channel.onmessage = async function (event) {
				peerConnection.prototype.handleMessage
					.bind(this)(event.data)
					.catch((error) => {
						if (this.peerData.hiddenAlias) {
							shiftNodeWeight(this.peerData.hiddenAlias, CONFIG.constants.genericUncaughtError);
						}
						throw error;
					});
			}.bind(this);
			return buffer;
		})();
	}
	async onpeer(cb) {
		eventHandler.onReceipt(`peerEstablished | ${this.internalUID}`, cb);
	}
	async announcePeer() {
		eventHandler.dispatch(`peerEstablished | ${this.internalUID}`);
	}
	async onConsumableAuth(cb) {
		eventHandler.onReceipt(`consumableAuth | ${this.internalUID}`, cb);
	}
	async dispatchConsumableAuth(consumableRaw) {
		eventHandler.dispatch(`consumableAuth | ${this.internalUID}`, escapeHTML(consumableRaw));
	}
	async makeOffer() {
		if (this.transport.connection.remoteDescription || this.transport.connection.localDescription)
			throw new Error(
				"This connection has already begun another ICE exchange sequence, and is, therefore, unable to generate a new local description."
			);
		await this.transport.connection.setLocalDescription(await this.transport.connection.createOffer());
		const concurrentICEDifferentiator = Math.floor(Math.random() * 1000);
		this.transport.connection.onicecandidate = async ({ candidate }) => {
			if (candidate) return;
			eventHandler.dispatch(`exhaustedICECandidates | ${concurrentICEDifferentiator}`);
		};
		await eventHandler.acquireExpectedDispatch(
			`exhaustedICECandidates | ${concurrentICEDifferentiator}`,
			CONFIG.rtc.ICEGatheringMaxLatency
		);
		return this.transport.connection.localDescription;
	}
	async receiveOffer(SDP) {
		checkForTypeErrors([{ SDP }], [["object"]]);
		if (this.transport.connection.remoteDescription || this.transport.connection.localDescription)
			throw new Error(
				"This connection has already begun another ICE exchange sequence, and is, therefore, unable to generate a new remote description."
			);
		this.voluntary = false;
		await this.transport.connection.setRemoteDescription(SDP);
		await this.transport.connection.setLocalDescription(await this.transport.connection.createAnswer());
		const concurrentICEDifferentiator = Math.floor(Math.random() * 1000);
		this.transport.connection.onicecandidate = async ({ candidate }) => {
			if (candidate) return;
			eventHandler.dispatch(`exhaustedICECandidates | ${concurrentICEDifferentiator}`);
		};
		await eventHandler.acquireExpectedDispatch(
			`exhaustedICECandidates | ${concurrentICEDifferentiator}`,
			CONFIG.rtc.ICEGatheringMaxLatency
		);
		return this.transport.connection.localDescription;
	}
	async receiveAnswer(SDP) {
		if (typeof SDP === "string") SDP = JSON.parse(SDP);
		checkForTypeErrors([{ SDP }], [["object"]]);
		if (this.transport.connection.remoteDescription)
			throw new Error(
				"This connection already holds a remote description, and therefore, cannot overwrite it with a new external description."
			);
		this.transport.connection.setRemoteDescription(SDP);
	}
	async requestPermissionEscalation(level) {
		this.transport.channel.standardSend("permissionEscalationRequest", {
			level: level ?? "advanced",
		});
		eventHandler
			.acquireExpectedDispatch(
				`permissionEscalationResponse|${this.internalUID}`,
				CONFIG.communication.arbitraryPeerRouteTimeout
			)
			.then(
				(value) => {
					if (value.externalDetail.status) {
						this.permissions = level ?? "advanced";
						if (this.permissions === "advanced" && !authPeers.includes(this.peerData.hiddenAlias))
							addAuthPeer(this.peerData.hiddenAlias);
						indicateRouteAccepted(this.peerData.hiddenAlias);
					} else {
						announceAuthRejected(this.peerData.hiddenAlias);
						obviatePeerError(this.peerData.hiddenAlias);
					}
				},
				() => {
					announceAuthRejected(this.peerData.hiddenAlias);
					obviatePeerError(this.peerData.hiddenAlias);
				}
			);
	}
	async makeDefiniteRoute(destination, desiredPermissions) {
		if (Object.keys(livePeers).includes(destination))
			throw new Error(`Direct route already exists to requested node ${destination}`);
		const generatedChannel = new peerConnection();
		const SDP = JSON.stringify(await generatedChannel.makeOffer());
		const routeID = Math.random().toString().slice(2, 12);
		var result;
		try {
			await detatchedRoute(destination, "routeImperative", {
				SDP,
				sender: CONFIG.communication.hiddenAlias,
				destination,
				desiredPermissions,
				routeID,
			});
			result = await Promise.race(
				["routeInaccessible", "routeAccepted", "routeRejected"].map((outcome) => {
					return eventHandler.acquireExpectedDispatch(
						`${outcome}|${routeID}`,
						CONFIG.communication.arbitraryPeerRouteTimeout
					);
				})
			);
		} catch (error) {
			result = { signalIdentifier: "routeInaccessible" };
		}
		switch (result.signalIdentifier.split("|")[0]) {
			case "routeInaccessible":
				peerConnection.prototype.close(generatedChannel);
				if (desiredPermissions == "advanced") announceAuthRejected(destination);
				if (result.externalDetail?.pointOfFailure) {
					shiftNodeWeight(
						result.externalDetail.pointOfFailure,
						CONFIG.constants.violationWeightPenalties.pointOfRouteFailure
					);
				}
				break;
			case "routeRejected":
				peerConnection.prototype.close(generatedChannel);
				if (desiredPermissions == "advanced") announceAuthRejected(destination);
				obviatePeerError(destination);
				break;
			case "routeAccepted":
				try {
					generatedChannel.receiveAnswer(result.externalDetail.SDP);
				} catch {
					obviatePeerError(destination);
					return;
				}
				if (desiredPermissions === "advanced") {
					addAuthPeer(destination);
				}
				indicateRouteAccepted(destination);
		}
	}
	async comprehendProspectiveRoute(routePackage) {
		var connection = new peerConnection(routePackage.desiredPermissions);
		try {
			var SDP = await connection.receiveOffer(JSON.parse(routePackage.SDP));
		} catch {
			if (routePackage.sender) {
				shiftNodeWeight(routePackage.sender, CONFIG.constants.violationWeightPenalties.invalidSDP);
			}
			this.rejectProspectiveRoute(routePackage, connection);
			return;
		}
		if (
			CONFIG.communication.routeAcceptHeuristic.constructor.name === "AsyncFunction"
				? await CONFIG.communication.routeAcceptHeuristic(routePackage)
				: CONFIG.communication.routeAcceptHeuristic(routePackage)
		) {
			this.acceptProspectiveRoute(routePackage, SDP, connection);
		} else {
			this.rejectProspectiveRoute(routePackage, connection);
		}
	}
	async rejectProspectiveRoute(routePackage, allocatedChannel) {
		allocatedChannel.transport.connection.close();
		detatchedRoute(routePackage.sender, "routeRejected", {
			destination: routePackage.sender,
			routeID: routePackage.routeID,
		}).catch(() => {});
	}
	async acceptProspectiveRoute(routePackage, SDP, allocatedChannel) {
		eventHandler.acquireExpectedDispatch(`peerEstablished | ${allocatedChannel.internalUID}`, 1000).then(
			() => {
				indicateRouteAccepted(routePackage.sender);
			},
			() => {
				obviatePeerError(routePackage.sender);
				allocatedChannel.transport.connection.close();
			}
		);
		await detatchedRoute(routePackage.sender, "routeAccepted", {
			SDP,
			destination: routePackage.sender,
			routeID: routePackage.routeID,
		});
	}
	async handleMessage(message) {
		const parsed = JSON.parse(
			CONFIG.rtc.binaryType === "arrayBuffer" ? new TextDecoder().decode(message) : message
		);
		checkForTypeErrors([{ parsed }], [["object"]]);
		if (
			!(await peerConnection.prototype.weaklyValidateMessage(parsed)) ||
			(!authPeers.includes(this.peerData?.hiddenAlias ?? Math.random().toString()) &&
				parsed[0] === "consumable")
		) {
			if (this.peerData.peer) {
				shiftNodeWeight(this.peerData.peer, CONFIG.constants.violationWeightPenalties.invalidMessage);
			}
			return;
		}
		switch (parsed[0]) {
			case "consumable":
				if (!this.peerData?.hiddenAlias) return;
				this.dispatchConsumableAuth(escapeHTML(parsed[1].raw));
				break;
			case "gossip":
				gossipTransport.consumeGossip(parsed[1]);
				if (this.peerData.peer) {
					shiftNodeWeight(
						this.peerData.peer,
						CONFIG.constants.violationWeightPenalties.failedGossip
					);
				}
				break;
			case "mapFetch":
				this.transport.channel.standardSend("mapReturn", {
					map: await networkMap.optionalExport(),
				});
				break;
			case "mapReturn":
				if (
					parsed[1].map === "none" ||
					eventHandler.dispatchWatchers[`networkMapRecieved${this.internalUID}`].length < 1
				) {
					return;
				}
				eventHandler.dispatch(`networkMapRecieved${this.internalUID}`);
				networkMap.importList(parsed[1], this.peerData.hiddenAlias);
				break;
			case "routeImperative":
				if (parsed[1].destination == CONFIG.communication.hiddenAlias) {
					this.comprehendProspectiveRoute(parsed[1]);
					return;
				}
				try {
					detatchedRoute(parsed[1].destination, "routeImperative", parsed[1]);
				} catch {
					try {
						detatchedRoute(parsed[1].sender, "routeInaccessible", {
							routeID: parsed[1].routeID,
							pointOfFailure: CONFIG.communication.hiddenAlias,
							destination: parsed[1].sender,
						});
					} catch {
						return;
					}
				}
				break;
			case "routeInaccessible":
				if (parsed[1].destination == CONFIG.communication.hiddenAlias) {
					eventHandler.dispatch(`routeInaccessible|${parsed[1].routeID}`, parsed[1]);
					return;
				}
				try {
					detatchedRoute(parsed[1].destination, "routeInaccessible", parsed[1]);
				} catch {
					return;
				}
				break;
			case "routeRejected":
				if (parsed[1].destination == CONFIG.communication.hiddenAlias) {
					eventHandler.dispatch(`routeRejected|${parsed[1].routeID}`, parsed[1]);
					return;
				}
				try {
					detatchedRoute(parsed[1].destination, "routeRejected", parsed[1]);
				} catch {
					return;
				}
				break;
			case "routeAccepted":
				if (parsed[1].destination == CONFIG.communication.hiddenAlias) {
					eventHandler.dispatch(`routeAccepted|${parsed[1].routeID}`, parsed[1]);
					return;
				}
				try {
					detatchedRoute(parsed[1].destination, "routeAccepted", parsed[1]);
				} catch {
					return;
				}
				break;
			case "permissionEscalationRequest":
				if (!this.peerData.hiddenAlias) return;
				if (
					CONFIG.communication.routeAcceptHeuristic.constructor.name === "AsyncFunction"
						? await CONFIG.communication.routeAcceptHeuristic({
								sender: this.peerData.hiddenAlias,
								desiredPermissions: parsed[1].level,
						  })
						: CONFIG.communication.routeAcceptHeuristic({
								sender: this.peerData.hiddenAlias,
								desiredPermissions: parsed[1].level,
						  })
				) {
					this.transport.channel.standardSend("permissionEscalationResponse", {
						status: true,
					});
					this.permissions = parsed[1].level ?? "advanced";
					if (this.permissions === "advanced" && !authPeers.includes(this.peerData.hiddenAlias))
						addAuthPeer(this.peerData.hiddenAlias);
					indicateRouteAccepted(this.peerData.hiddenAlias);
				} else {
					this.transport.channel.standardSend("permissionEscalationResponse", {
						status: false,
					});
				}
				break;
			case "permissionEscalationResponse":
				eventHandler.dispatch(`permissionEscalationResponse|${this.internalUID}`, {
					status: parsed[1].status,
				});
				break;
			case "invokerIntroduction":
				if (this.acquainted) {
					if (this.peerData.peer) {
						shiftNodeWeight(
							this.peerData.peer,
							CONFIG.constants.violationWeightPenalties.acquaintedInitAttempt
						);
					}
					return;
				}
				this.initializationMethods.invokerIntroduction(parsed[1]).catch((error) => {
					if (this.peerData.peer || typeof parsed[1].hiddenAlias === "string") {
						obviatePeerError(this.peerData.peer || parsed[1].hiddenAlias);
						shiftNodeWeight(
							this.peerData.peer,
							CONFIG.constants.violationWeightPenalties.initSequenceError
						);
					}
					peerConnection.prototype.close(this);
				});
				break;
			case "reciprocalAlignment":
				if (this.acquainted) {
					if (this.peerData.peer) {
						shiftNodeWeight(
							this.peerData.peer,
							CONFIG.constants.violationWeightPenalties.acquaintedInitAttempt
						);
					}
					return;
				}
				this.initializationMethods.reciprocalAlignment(parsed[1]).catch((error) => {
					if (this.peerData.peer || typeof parsed[1].hiddenAlias === "string") {
						obviatePeerError(this.peerData.peer || parsed[1].hiddenAlias);
						shiftNodeWeight(
							this.peerData.peer,
							CONFIG.constants.violationWeightPenalties.initSequenceError
						);
					}
					peerConnection.prototype.close(this);
				});
				break;
			case "forcefulDeauth":
				deauthPeer(this.peerData.hiddenAlias, false);
				break;
			default:
				nonstandardParserDrain(...parsed);
				return;
		}
	}
	async weaklyValidateMessage(message, overrideAllowNonstandardParsers) {
		try {
			checkForTypeErrors(
				[{ message }, { "message[0]": message[0] }, { "message[1]": message[1] }],
				[["object"], ["string", "number"], ["undefined", "object"]]
			);
		} catch (error) {
			return false;
		}
		if (!Object.keys(CONFIG.communication.packageArgs).includes(message[0])) {
			return !!(overrideAllowNonstandardParsers ?? CONFIG.communication.allowNonStandardParsers);
		}
		var observedIncludedArgs = Object.keys(message[1] ?? {});
		for (let arg of CONFIG.communication.packageArgs[message[0]].required) {
			if (!observedIncludedArgs.includes(arg)) return false;
			observedIncludedArgs.splice(observedIncludedArgs.indexOf(arg), 1);
		}
		if (!CONFIG.communication.packageArgs[message[0]].optional.includes("!*")) return true;
		if (
			observedIncludedArgs.filter((arg) => {
				return !CONFIG.communication.packageArgs[message[0]].optional.includes(arg) && arg != "!*";
			}) == ""
		)
			return true;
		return false;
	}
	initializationMethods = {
		invokerIntroduction: async (message) => {
			try {
				checkForTypeErrors(
					[
						{ message },
						{ "message.hiddenAlias": message.hiddenAlias },
						{ "message.publicAlias": message.publicAlias },
						{ "message.isOriented": message.isOriented },
					],
					[["object"], ["string"], ["string"], ["boolean"]]
				);
				if (Object.keys(livePeers).includes(message.hiddenAlias)) {
					throw new Error(`a route has already been secured to the desired destination`);
				}
			} catch (error) {
				if (typeof message.hiddenAlias === "string") obviatePeerError(message.hiddenAlias);
				peerConnection.prototype.close(this);
				return;
			}
			addAlias(message.publicAlias, message.hiddenAlias);
			addLivePeer(message.hiddenAlias, this);
			if (this.isAuth) addAuthPeer(message.hiddenAlias);
			topologyTransport.addGossip({
				constituentHiddenAliases: [CONFIG.communication.hiddenAlias, message.hiddenAlias],
				correspondingPublicAliases: [CONFIG.communication.publicAlias, message.publicAlias],
				mode: "addLink",
			});
			this.acquainted = true;
			const providedMap = !message.isOriented ? await networkMap.optionalExport() : false;
			this.transport.channel.standardSend("reciprocalAlignment", {
				publicAlias: CONFIG.communication.publicAlias,
				hiddenAlias: CONFIG.communication.hiddenAlias,
				map: providedMap,
			});
			this.peerData = { hiddenAlias: message.hiddenAlias };
		},
		reciprocalAlignment: async (message) => {
			try {
				checkForTypeErrors(
					[
						{ message },
						{ "message.hiddenAlias": message.hiddenAlias },
						{ "message.publicAlias": message.publicAlias },
					],
					[["object"], ["string"], ["string"], ["boolean"]]
				);
				if (Object.keys(livePeers).includes(message.hiddenAlias))
					throw new Error(`a route has already been secured to the desired destination`);
			} catch (error) {
				if (typeof message.hiddenAlias === "string") obviatePeerError(message.hiddenAlias);
				peerConnection.prototype.close(this);
				return;
			}
			addAlias(message.publicAlias, message.hiddenAlias);
			addLivePeer(message.hiddenAlias, this);
			if (this.isAuth) addAuthPeer(message.hiddenAlias);
			if (Object.keys(networkMap.nodes) == "") {
				if (!message.map) {
					const mapInterval = setTimeout(() => {
						if (networkMap) clearInterval(mapInterval);
						this.transport.channel.standardSend("mapFetch");
						eventHandler
							.acquireExpectedDispatch(`networkMapRecieved${this.internalUID}`, 10000)
							.catch(() => {});
					}, 1000);
					return;
				} else if (message.map !== "none") {
					networkMap.importList(message.map, message.hiddenAlias);
				}
			}
			this.acquainted = true;
			this.peerData = {
				hiddenAlias: message.hiddenAlias,
			};
		},
	};
	async close(peer, avoidFlounder) {
		checkForTypeErrors([{ peer }], [["object"]]);
		if (!peer.peerData) return;
		if (peer.peerData.hiddenAlias) {
			obviatePeerError(peer.peerData.hiddenAlias);
			topologyTransport.addGossip({
				constituentHiddenAliases: [peer.peerData.hiddenAlias, CONFIG.communication.hiddenAlias],
				mode: "removeLink",
			});
			if (authPeers.includes(peer.peerData.hiddenAlias)) deleteAuthPeer(peer.peerData.hiddenAlias);
			await deleteAlias(peer.peerData.hiddenAlias);
		}
		if (peer.transport?.connection?.signalingState !== "closed") {
			peer.closed = true;
			peer.transport.connection.close();
		}
		deleteLivePeer(peer.peerData.hiddenAlias);
		peerConnection.prototype.stabilizeLink();
		if (Object.keys(livePeers) == "" && !avoidFlounder) flounder();
	}
	async stabilizeLink() {
		if (Object.keys(livePeers).length !== 1) return;
		await networkMap.precomputeRoutes(CONFIG.communication.hiddenAlias);
		var invertedDistances = Object.keys(networkMap.distances).reduce((previous, key) => {
			if (previous[networkMap.distances[key]]) {
				previous[networkMap.distances[key]].push(key);
			} else {
				previous[networkMap.distances[key]] = [key];
			}
			return previous;
		}, {});
		var target = invertedDistances[Math.max(...Object.keys(invertedDistances))][0];
		if (Object.keys(livePeers).includes(target)) return;
		peerConnection.prototype.makeDefiniteRoute(target);
	}
	async negotiateAgnosticAuthConnection(target) {
		if (authPeers.includes(target) || currentlyAuthenticating.includes(target)) {
			return;
		}
		currentlyAuthenticating.push(target);
		if (livePeers[target]) {
			livePeers[target].requestPermissionEscalation();
			return;
		}
		peerConnection.prototype.makeDefiniteRoute(target, "advanced");
	}
}

async function flounder() {
	networkMap.reload();
	serverHardRestart();
}

class GossipTransport {
	constructor() {
		this.types = {};
		this.propogationStack = [];
		this.intervals = {};
		this.knownFacts = {};
		this.pulseIterations = 0;
		this.parsers = {
			default: async (block, type, constantArgs, preliminaryVerification, canExclude) => {
				preliminaryVerification = preliminaryVerification ?? (() => {});
				constantArgs = constantArgs ? constantArgs : Object.keys(block[0]);
				if (!constantArgs.includes("type")) constantArgs.push("type");
				block.type = type;
				var committable = [];
				var unknown = [];
				if (!this.knownFacts[type]) this.knownFacts[type] = [];
				for (let component of block) {
					var data = {};
					try {
						preliminaryVerification.constructor.name === "AsyncFunction"
							? await preliminaryVerification(component)
							: preliminaryVerification(component);
					} catch (error) {
						continue;
					}
					Object.keys(component)
						.filter((key) => constantArgs.includes(key))
						.forEach((key) => (data[key] = component[key]));
					if (
						!this.knownFacts[type].includes(JSON.stringify(data)) &&
						Object.keys(data).length > 0
					) {
						if (!this.types[type]) this.addType(type);
						committable.push(data);
						unknown.push(component);
						this.types[type].buffer.push(component);
						this.knownFacts[type].push(JSON.stringify(data));
					}
				}
				return [committable, unknown];
			},
		};
	}
	async pushToPropogationStack(type) {
		checkForTypeErrors([{ type }], [["string"]]);
		if (this.types[type]?.buffer?.length > 0 && !this.propogationStack.includes(type)) {
			this.propogationStack.push(type);
		}
	}
	addType(type, iterModulo) {
		checkForTypeErrors([{ type }, { iterModulo }], [["string"], ["number", "undefined"]]);
		iterModulo = iterModulo ?? CONFIG.constants.defaultPropagationIterMod;
		if (this.types[type]) throw new Error(`cannot satisfy attempt to redefine type ${type}`);
		var triggerFunctions = {
			addGossip: async function (gossip) {
				await this.parsers[type]([gossip]);
			}.bind(this),
			remove: async function () {
				for (let i in triggerFunctions) {
					triggerFunctions[i] = undefined;
				}
				delete this.types[type];
				this.intervals = this.intervals[iterModulo].splice(
					this.intervals[iterModulo].indexOf(type),
					1
				);
				if (this.interval[iterModulo] == "") delete this.intervals[iterModulo];
			}.bind(this),
		};
		if (!this.intervals[iterModulo]) this.intervals[iterModulo] = [];
		this.intervals[iterModulo].push(type);
		this.types[type] = {
			endpoints: false,
			buffer: [],
		};
		return triggerFunctions;
	}
	async addParser(type, useDefault, parserCallback, constantArgs, preliminaryVerification) {
		checkForTypeErrors(
			[{ type }, { useDefault }, { parserCallback }, { constantArgs }, { preliminaryVerification }],
			[["string", "number"], ["boolean"], ["function"], ["object"], ["function", "undefined"]]
		);
		const pre = useDefault ? this.parsers.default : async () => [];
		this.parsers[type] = async function (block) {
			try {
				checkForTypeErrors([{ block }], [["object"]]);
			} catch {
				block = {};
			}
			try {
				const defaultOutput = await pre(block, type, constantArgs, preliminaryVerification);
				return await (parserCallback ?? (async () => {}))(block, ...defaultOutput);
			} catch (error) {
				return;
			}
		};
		this.parsers[type].constantArgs = constantArgs;
	}
	async removeParser(type) {
		checkForTypeErrors([{ type }], [["string", "number"]]);
		delete this.parsers[type];
	}
	async propogateAll(type) {
		checkForTypeErrors(
			[{ type }, { block: this.types[type].buffer }],
			[["string", "number"], ["object"]]
		);
		if (!Array.isArray(this.types[type].buffer))
			throw new TypeError(`${type}'s buffer object is not of subtype array as required`);
		if (this.types[type].buffer == "") return;
		const approxByteLen = new TextEncoder().encode(this.types[type].buffer).length;
		if (approxByteLen > 16384) {
			var chunks = [];
			for (let i = 0; i < Math.ceil(approxByteLen / 16384); i++) {
				chunks.push(
					this.types[type].buffer.slice(
						Math.ceil(((this.types[type].buffer.length * 16384) / approxByteLen) * i),
						Math.floor(((this.types[type].buffer.length * 16384) / approxByteLen) * (i + 1)) + 1
					)
				);
				chunks = chunks.filter((chunk) => {
					return chunk != "";
				});
			}
			for (let channel in this.types[type].endpoints || livePeers) {
				if (!Object.keys(livePeers).includes(channel)) continue;
				chunks.forEach((chunk) => {
					this.sendGossipPackage({ type, block: chunk }, channel);
				});
			}
			this.types[type].buffer = [];
			return;
		}
		for (let channel in this.types[type].endpoints || livePeers) {
			if (!Object.keys(livePeers).includes(channel)) continue;
			this.sendGossipPackage({ type, block: this.types[type].buffer }, channel);
		}
		this.types[type].buffer = [];
	}
	async sendGossipPackage(pkg, channel) {
		checkForTypeErrors([{ pkg }, { channel }], [["object"], ["string"]]);
		if (!livePeers[channel])
			throw new Error(
				`unable to access requested gossip endpoint ${channel}: no peer exists with this alias`
			);
		livePeers[channel].transport.channel.standardSend("gossip", pkg);
	}
	async consumeGossip(gossip) {
		checkForTypeErrors([{ gossip }], [["object"]]);
		if (this.parsers[gossip.type]) {
			this.parsers[gossip.type](gossip.block);
		} else {
			this.parsers.default(gossip.block, gossip.type);
		}
	}
	pulseIteration = 0;
	propogationPulse = setInterval(() => {
		for (let modulo in this.intervals) {
			if (this.pulseIterations % (modulo != "null" ? parseInt(modulo) : Infinity) === 0) {
				this.intervals[modulo].forEach((type) => {
					this.pushToPropogationStack(type);
				});
			}
		}
		if (Object.keys[livePeers] == "") return;
		this.propogationStack.forEach((type, index) => {
			this.propogateAll(type);
			this.propogationStack.splice(index, 1);
		});
		++this.pulseIterations;
	}, CONFIG.communication.basicPropogationInterval);
}

async function detatchedRoute(destination, ...content) {
	try {
		var nextHop = await networkMap.findNextHop(CONFIG.communication.hiddenAlias, destination);
	} catch {
		return;
	}
	livePeers[nextHop].transport.channel.standardSend(...content);
}

async function primeForMapImport(UID) {
	checkForTypeErrors([{ UID }], [["number", "string"]]);
	eventHandler
		.acquireExpectedDispatch(`networkMapRecieved${UID}`, CONFIG.communication.mapImportTimeout)
		.catch(() => {});
}

function escapeHTML(data) {
	HTMLEscape.textContent = data;
	return HTMLEscape.innerHTML;
}

function parsePublicAlias(alias, hidden) {
	alias = alias ?? CONFIG.communication.defaultUnknownPublicAlias ?? hidden ?? "Anonymous";
	const escaped = escapeHTML(alias);
	publicAliasTallies[escaped] =
		typeof publicAliasTallies[escaped] == "number" ? ++publicAliasTallies[escaped] : 0;
	return publicAliasTallies[escaped] === 0 ? escaped : `${escaped} (${publicAliasTallies[escaped]})`;
}

function verifyHiddenAlias(hidden) {
	if (
		typeof hidden !== "string" ||
		hidden.length != CONFIG.communication.specHiddenAliasAttributes.len ||
		hidden.split("").filter((char) => {
			return !CONFIG.constants.radix36Charset.includes(char);
		}) != ""
	)
		throw new Error(
			`Provided hidden alias does not conform to the delineated formatting restrictions. (${
				typeof hidden !== "string"
			}, ${hidden.length != CONFIG.communication.specHiddenAliasAttributes.len}, ${hidden
				.split("")
				.filter((char) => {
					return !CONFIG.constants.radix36Charset.includes(char);
				})} on ${hidden})`
		);
}

function addAlias(pub, hidden) {
	if (hiddenAliasLookup[hidden]) return;
	pub = pub ?? undefined;
	checkForTypeErrors([{ pub }], [["string", "undefined"]]);
	verifyHiddenAlias(hidden);
	const parsedPub = parsePublicAlias(pub, hidden);
	pubAliasLookup[parsedPub] = hidden;
	initialReferenceLedger[hidden] = pub;
	hiddenAliasLookup[hidden] = parsedPub;
	pubAliasUnparser[parsedPub] = pub;
}

async function deleteAlias(hidden) {
	try {
		verifyHiddenAlias(hidden);
	} catch {
		return;
	}
	delete initialReferenceLedger[hidden];
	const parsedPub = hiddenAliasLookup[hidden];
	delete hiddenAliasLookup[hidden];
	--publicAliasTallies[parsedPub];
	delete pubAliasLookup[parsedPub];
	delete pubAliasUnparser[parsedPub];
}

async function makeServerLink(isReconnect) {
	var instanceSDPFailures = 0;
	var unparsedAddress;
	var server;
	if (!isReconnect) {
		var linkPeer = new peerConnection();
		try {
			var offer = await linkPeer.makeOffer();
		} catch (error) {
			var alertError = new Error(
				`Error: ${error} in offer process with basic timeout set to ${CONFIG.rtc.ICEGatheringMaxLatency}`
			);
			publicError(alertError.message, alertError.stack);
		}
		unparsedAddress = CONFIG.serverLink.initBindURL;
		const addressComponents = unparsedAddress.split("*");
		if (addressComponents[1] === undefined)
			throw new Error(`no viable SDP insertion point in the provided server URL : ${unparsedAddress}`);
		server = new WebSocket(
			[
				addressComponents[0],
				encodeURIComponent(btoa(JSON.stringify(offer))),
				addressComponents[1],
			].join("")
		);
	} else {
		unparsedAddress = CONFIG.serverLink.reconnectURL;
		server = new WebSocket(unparsedAddress);
	}
	server.onclose = () => {
		if (server.intentionalClose) {
			clearInterval(serverPongTimeout);
			return;
		}
		setTimeout(() => {
			makeServerLink(Object.keys(livePeers) != "");
		}, CONFIG.serverLink.reconnectInterval);
	};
	server.onmessage = async (event) => {
		server.crudeSend("heartbeat");
		const message = JSON.parse(event.data);
		switch (message[0]) {
			case "heartbeat":
				return;
			case "provideSDP":
				if (message[1] === "unresolved") {
					peerConnection.prototype.close(linkPeer, true);
					return;
				}
				try {
					await linkPeer.receiveAnswer(message[1]);
				} catch (error) {
					++instanceSDPFailures;
					if (instanceSDPFailures >= 3) {
						const error = new Error(
							`Experieneced three consequent violations of SDP formatting protocol; ceasing attempt loop.`
						);
						publicError(error.stack);
					}
					server.crudeSend("reportNode", { nodeID: message[3] });
				}
				break;
			case "ERROR":
				const error = new Error(
					`The specified routing server experienced an unidentified internal error in the process of connection : ${unparsedAddress}`
				);
				publicError(error, error.stack);
				break;
			case "requestSDP":
				var connection = new peerConnection();
				try {
					var SDP = await connection.receiveOffer(JSON.parse(atob(message[1])));
				} catch {
					connection.transport.connection.close();
					server.crudeSend("ignoreSDPRequest", { reciprocalID: message[2] });
					return;
				}
				server.crudeSend("returnSDP", {
					SDP: JSON.stringify(SDP),
					reciprocalID: message[2],
				});
				break;
		}
	};
	var serverPongTimeout = setInterval(() => {
		if (
			+new Date() - mostRecentServerHeartbeat > CONFIG.communication.defaultNoResponseTimeout &&
			mostRecentServerHeartbeat !== mostRecentServerHeartbeat /* !instanceOf NaN */
		)
			server.close();
	}, 500);
	serverTabCloseAlert = function () {
		server.send(JSON.stringify(["forceClosing"]));
	};
	return (serverHardRestart = async function () {
		server.intentionalClose = true;
		server.close();
		await makeServerLink();
	});
}

async function init() {
	await loadConfig(defaultConfig, defaultConfig.constants.configLoadFunction);
	eventHandler.dispatch("configLoaded");
	await makeServerLink();
	gossipTransport = new GossipTransport();
	topologyTransport = gossipTransport.addType("topology");
	routingTableTransport = gossipTransport.addType("weight", 100);
	gossipTransport.addParser(
		"topology",
		true,
		async function (_, committable) {
			const removeNegated = function (negated) {
				let inverseIndex = gossipTransport.knownFacts[negated.type]
					? gossipTransport.knownFacts[negated.type].indexOf(JSON.stringify(negated))
					: -1;
				if (inverseIndex !== -1) {
					gossipTransport.knownFacts[negated.type].splice(inverseIndex, 1);
				}
			};
			committable.forEach((modification) => {
				const negated = JSON.parse(JSON.stringify(modification));
				switch (modification.mode) {
					case "addLink":
						negated.mode = "removeLink";
						try {
							modification.constituentHiddenAliases.forEach((alias, index) => {
								if (!Object.keys(networkMap.nodes).includes(alias)) {
									if (!hiddenAliasLookup[alias])
										addAlias(modification.correspondingPublicAliases[index], alias);
									networkMap.addNode(alias);
								}
							});
						} catch {
							return;
						}
						removeNegated(negated);
						networkMap.addEdge(
							modification.constituentHiddenAliases[0],
							modification.constituentHiddenAliases[1]
						);
						break;
					case "removeLink":
						negated.mode = "addLink";
						removeNegated(negated);
						networkMap.removeEdge(
							modification.constituentHiddenAliases[0],
							modification.constituentHiddenAliases[1]
						);
						modification.constituentHiddenAliases.forEach((alias) => {
							if (!networkMap.adjacencyList[alias]) {
								return;
							}
							if (Object.keys(networkMap.adjacencyList[alias] ?? {}) == "") {
								networkMap.removeNode(alias);
								deleteAlias(alias);
							}
						});
						break;
				}
			});
		},
		["constituentHiddenAliases", "correspondingPublicAliases", "mode"],
		async function (component) {
			if (component.mode !== "addLink" && component.mode !== "removeLink") {
				throw new Error(`No mode "${component.mode} has been defined by the current parser`);
			}
			if (
				!(
					component.constituentHiddenAliases?.length === 2 &&
					(component.mode === "addLink" ? component.correspondingPublicAliases?.length === 2 : true)
				)
			) {
				throw new Error(
					`Component does not contain the necessary parity or form of constituentHiddenAliases and correspondingPublicAliases for its mode (${component.mode})`
				);
			}
			if (component.mode === "addLink") {
				var originalOrder = component.constituentHiddenAliases + "";
				component.constituentHiddenAliases = component.constituentHiddenAliases.sort();
				if (originalOrder != component.constituentHiddenAliases + "") {
					component.correspondingPublicAliases.reverse();
				}
			}
		},
		["correspondingPublicAliases"]
	);
	gossipTransport.addParser(
		"weight",
		true,
		async function (_, committable) {
			committable.forEach((modification) => {
				if (networkMap.nodes[modification.alias])
					networkMap.setweight(
						modification.alias,
						networkMap.nodes[modification.alias].weight + modification.weightModification
					);
			});
		},
		["alias", "weightModification", "occurenceID"],
		async function (component) {
			checkForTypeErrors(
				[
					{ "modification.alias": component.alias },
					{ "modification.weightModification": component.weightModification },
					{ "modification.occurenceID": component.occurenceID },
				],
				[["string"], ["number"], ["string"]]
			);
		}
	);
}

function checkForTypeErrors(requiredArgs, expectedTypes) {
	var mistyped = requiredArgs.filter((argumentObj, index) => {
		return expectedTypes[index]
			? !expectedTypes[index].includes(typeof Object.values(argumentObj)[0])
			: false;
	});
	if (mistyped != "") {
		throw new TypeError(
			`expected the argument "${
				Object.keys(mistyped[0])[0]
			}" to be of one of the following types: ${expectedTypes[
				requiredArgs
					.map((obj) => {
						return Object.keys(obj)[0];
					})
					.indexOf(Object.keys(mistyped[0])[0])
			].reduce((previous, current, index, array) => {
				return (
					previous +
					current +
					(array.length > 1 && index !== array.length - 1
						? index === array.length - 2
							? " or "
							: ", "
						: "")
				);
			}, "")}; got ${typeof Object.values(mistyped[0])[0]}`
		);
	}
}

init();

//Chrome hotfix:
window.addEventListener("beforeunload", () => {
	Object.values(livePeers).forEach((peer) => {
		peer.transport.connection.close();
	});
	serverTabCloseAlert();
});

async function shiftNodeWeight(alias, weightModification) {
	routingTableTransport.addGossip({
		alias: alias,
		weightModification: weightModification,
		occurenceID: Math.random().toString().slice(2, 12),
	});
}

async function announceAuthRejected(destination) {
	eventHandler.dispatch("authPeerRejected", destination);
	if (currentlyAuthenticating.includes(destination))
		currentlyAuthenticating.splice(currentlyAuthenticating.indexOf(destination), 1);
}

async function onAuthRejected(callback) {
	eventHandler.onReceipt("authPeerRejected", callback);
}

async function publicError(message, stack) {
	Object.values(livePeers).forEach((peer) => {
		peer.transport.connection.close();
	});
	serverTabCloseAlert();
	eventHandler.dispatch("fatalError", [message, stack]);
}

async function onPublicError(callback) {
	eventHandler.onReceipt("fatalError", callback);
}

function indicateRouteAccepted(node) {
	blinkStatus("success", node);
}

async function obviatePeerError(node) {
	blinkStatus("error", node);
}

//#To be defined as needed
async function nonstandardParserDrain(type, args) {}
