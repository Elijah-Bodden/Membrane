/** @format */

// Copyright 2022 Elijah Bodden

// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

"use strict";

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

var defaultConfig = {
  rtc: {
    ICEpresets: {
      iceServers: allICEServers,
      iceCandidatePoolSize: 255,
    },
    ICEGatheringMaxDelay: 10000,
    defaultChannelLabel: "channel",
    channelOptions: {
      negotiated: true,
      id: 0,
      ordered: true,
    },
    binaryType: "arraybuffer",
  },
  communication: {
    gossipInterval: 100,
    publicAlias: "",
    hiddenAlias: Math.random().toString(36).slice(2, 11),
    mapImportTimeout: 10000,
    connectionTimeout: 100000000,
    connectionAcceptRejectFunction: async function (pkg) {
	  if (pkg.wantAuth) {
		var crystalizedRef = hiddenAliasLookup[pkg.sender] ?? pkg.sender;
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
    defaultEventHandlerTimeout: 100000,
    peerPenalties: {
      pointOfRouteFailure: 10,
      initSequenceError: 100,
      invalidSDP: 100,
      genericUncaughtError: 35,
    },
  },
  server: {
    initBindURL: `wss://${window.location.hostname}:8777/bind?originatingSDP=*`,
    reconnectURL: `wss://${window.location.hostname}:8777/reconnect`,
    reconnectInterval: 5000,
    serverHeartbeatTimeout: 20000,
  },
};

var CONFIG;
var effectiveFirstVisit = false;
const livePeers = {};
const authPeers = [];
// All aliases with auth connections being considered
// (so we ignore subsequent non-auth requests)
// Ofc this blocks stabilization, see comment below about maybe eliminating auth requests alltogether
// This hack is incredibly fuck
// Will fix later
const consideringAuthConnections = []
const consideringNonAuthConnections = []
// For if a non-auth request is ongoing
// Escalate to auth once that connection is done
const authConnectionQueue = []
const currentlyAuthenticating = [];
const pubAliasLookup = {};
const hiddenAliasLookup = {};
// Parsing appends (number) to the end of repeat aliases. We don't want to keep that when we send it to other peers, hence unparser
const pubAliasUnparser = {};
const publicAliasTallies = {};
var eventHandler;
var networkMap;
var gossipTransport;
var topologyTransport;
var routingTableTransport;
var serverConnection;

async function awaitIfAsync(func, args = []) {
  var result =
    func.constructor.name === "AsyncFunction"
      ? await func(...args)
      : func(...args);
  return result;
}

WebSocket.prototype.sendPackage = async function (type, typeArgs) {
  switch (type) {
    case "heartbeat":
      this.send(JSON.stringify(["heartbeat"]));
      break;
    case "reportNode":
      this.send(JSON.stringify(["reportNode", typeArgs.nodeID]));
      break;
    case "returnSDP":
      this.send(
        JSON.stringify(["returnSDP", typeArgs.SDP, typeArgs.requesterID])
      );
      break;
    case "ignoreSDPRequest":
      this.send(JSON.stringify(["ignoreSDPRequest", typeArgs.requesterID]));
      break;
    default:
      throw new Error(`Websocket package type "${type}" not recognized.`);
  }
};

RTCDataChannel.prototype.sendPackage = async function (type, messageParams) {
  const packaged = JSON.stringify(
    messageParams ? [type, messageParams] : [type]
  );
  this.send(
    CONFIG.rtc.binaryType === "arrayBuffer"
      ? new TextEncoder().encode(packaged)
      : packaged
  );
};

function addAuthPeer(peer) {
  if (currentlyAuthenticating.includes(peer))
    currentlyAuthenticating.splice(currentlyAuthenticating.indexOf(peer), 1);
  authPeers.push(peer);
  eventHandler.dispatch("newAuthPeer", peer);
}

function deleteAuthPeer(peer) {
  if (!authPeers.includes(peer)) return;
  authPeers.splice(authPeers.indexOf(peer), 1);
  eventHandler.dispatch("lostAuthPeer", peer);
}

async function deauthPeer(peer, isInitiator) {
  if (!authPeers.includes(peer)) return;
  if (isInitiator) {
    sendPackage(peer, "forcefulDeauth");
    deleteAuthPeer(peer);
  } else {
    deleteAuthPeer(peer);
  }
}

class EventHandler {
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
        method(
          signalIdentifier,
          externalDetail,
          this.handlerFrame[signalIdentifier]
        );
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
    this.dispatchWatchers[dispatchIdentifier] = this.dispatchWatchers[
      dispatchIdentifier
    ]
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
                  CONFIG?.constants?.defaultEventHandlerTimeout ??
                  100000
                }ms`
              );
          }, timeout ?? CONFIG?.constants?.defaultEventHandlerTimeout ?? 100000);
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
eventHandler = new EventHandler();

class NetworkMap {
  constructor() {
    this.adjacencyList = {};
    this.nodes = {};
    this.export = undefined;
    this.distances = undefined;
    this.previous = undefined;
    this.computationRefreshed = false;
    this.exportRefreshed = false;
  }
  async triggerUpdate(method, relevantInformation) {
    eventHandler.dispatch("NetworkMapUpdate", [method, relevantInformation]);
  }
  async importList(raw, provider) {
    try {
      var mappedList = JSON.parse(raw);
      Object.keys(mappedList[0]).reduce((expendedKeys, currentKey) => {
        expendedKeys.push(currentKey);
        try {
          addAlias(mappedList[0][currentKey][2], mappedList[0][currentKey][0]);
          this.addNode(
            mappedList[0][currentKey][0],
            mappedList[0][currentKey][1]
          );
        } catch (error) {
          expendedKeys.forEach((key) => {
            this.removeNode(key);
            deleteAlias(key);
          });
          throw new Error(
            `Fatal error on map import: key ${currentKey} couldn't be used because ${error}`
          );
        }
        return expendedKeys;
      }, []);
      for (let i in mappedList[1]) {
        mappedList[1][i].forEach((subKey) => {
          if (!(mappedList[0]?.[subKey]?.[0] && mappedList[0]?.[i]?.[0]))
            return;
          this.addEdge(mappedList[0][i][0], mappedList[0][subKey][0]);
        });
      }
    } catch (error) {
      if (livePeers[provider]) livePeers[provider].close();
      return;
    }
    eventHandler.dispatch("mapImportSuccessful");
    this.export = raw;
    this.exportRefreshed = true;
  }
  addEdge(i, j) {
    var nodePresences = [
      Object.keys(this.nodes).includes(i),
      Object.keys(this.nodes).includes(j),
    ];
    if (!(nodePresences[0] && nodePresences[1]))
      throw new Error(
        `Unable to create an edge between ${i} and ${j} because ${
          nodePresences[0] ^ nodePresences[1]
            ? 'there exists no node "' +
              [i, j][nodePresences.indexOf(false)] +
              '"'
            : "neither exists"
        }`
      );
    this.adjacencyList[i][j] = this.nodes[j];
    this.adjacencyList[j][i] = this.nodes[i];
    this.triggerUpdate("addEdge", [i, j]);
    this.exportRefreshed = false;
  }
  addNode(key, weight) {
    this.adjacencyList[key] = {};
    this.setweight(key, weight ?? 1);
    this.triggerUpdate("addNode", key);
    this.exportRefreshed = false;
  }
  removeNode(key) {
    if (!(this.nodes[key] || this.adjacencyList[key])) return;
    delete this.nodes[key];
    delete this.adjacencyList[key];
    this.triggerUpdate("removeNode", key);
    this.exportRefreshed = false;
  }
  removeEdge(i, j) {
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
		//   Use unparser because we want to give it in the raw form we got it in
          : [alias, this.nodes[alias].weight, pubAliasUnparser[hiddenAliasLookup[alias]]];
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
    const elected = !this.exportRefreshed
      ? await this.exportList()
      : this.export;
    return elected ? elected : "none";
  }
  async precomputeRoutes(source) {
    checkForTypeErrors([{ source }], [["string", "number"]]);
    if (!Object.keys(this.nodes).includes(source)) {
      throw new Error(`Requested source node (${source}) doesn't exist`);
    }
    var dist = {};
    var prev = {};
    var queue = new Queue();
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
    if (!Object.keys(this.nodes).includes(currentNode)) {
      throw new Error(`Source node (${currentNode}) doesn't exist`);
    }
    if (!Object.keys(this.nodes).includes(endNode)) {
      throw new Error(`Destination node (${endNode}) doesn't exist`);
    }
    await this.precomputeRoutes(currentNode);
    var node = endNode;
    var lastNode = undefined;
    while (node != currentNode) {
      lastNode = node;
      if (this.distances[node] == Infinity)
        throw new Error(
          `Cannot create route between ${currentNode} and ${endNode} (something's wrong with the network topology - there exists no path between the two).`
        );
      node = this.previous[node];
    }
    return lastNode;
  }
  async findFarthestNode(currentNode) {
    checkForTypeErrors([{ currentNode }], [["string", "number"]]);
    this.precomputeRoutes(currentNode);
    let longest = Math.max(...Object.values(this.distances));
    let farthestNode = Object.keys(this.distances).find(
      (key) => this.distances[key] === longest
    );
    return farthestNode;
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

async function onNetworkMapUpdate(callback) {
  eventHandler.onReceipt("NetworkMapUpdate", async (_sig, detail) => {
    callback(detail[0], detail[1]);
  });
}

networkMap = new NetworkMap();

// Try and stabilize link every second that we only have one peer
var linkStabilizing = false;
setInterval(async () => {
  if (Object.keys(livePeers).length < 3 && !linkStabilizing) {
    linkStabilizing = true;
    try {
      await PeerConnection.prototype.stabilizeLink();
    } catch (error) {
      linkStabilizing = false;
      throw error;
    }
    linkStabilizing = false;
  }
}, 1000);

class Queue {
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
    if (Object.keys(this.queue) == "") {
      throw new Error(
        `Unable to extract key of minimum priority, queue is empty`
      );
    }
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
    if (this.queue[this.cachedPriorities[item]] == "")
      delete this.queue[this.cachedPriorities[item]];
    this.add(item, newPriority);
  }
}

async function addLivePeer(ref, peer) {
  livePeers[ref] = peer;
  eventHandler.dispatch("newPeer", ref);
}

async function deleteLivePeer(ref) {
  delete livePeers[ref];
  if (authPeers.includes(ref)) deleteAuthPeer(ref);
  eventHandler.dispatch("lostPeer", ref);
}

class PeerConnection {
  constructor(auth) {
    this.acquainted = false;
    this.initiator = true;
    this.peerData = {
      hiddenAlias: undefined,
    };
    this.auth = auth ?? false;
    this.UUID = `UUID : ${Math.random().toString(36).slice(2, 11)}`;
    this.connection = new RTCPeerConnection(CONFIG.rtc.ICEpresets);
    this.channel = this.connection.createDataChannel(
      CONFIG.rtc.defaultChannelLabel,
      CONFIG.rtc.channelOptions
    );
    this.channel.binaryType = CONFIG.rtc.binaryType;
    this.channel.onclose = function () {
      this.close();
    }.bind(this);
    this.channel.onopen = function () {
      if (this.initiator) {
        this.channel.sendPackage("initiatorIntroduction", {
          hiddenAlias: CONFIG.communication.hiddenAlias,
          isOriented: Object.keys(networkMap.nodes).length > 0,
          publicAlias: CONFIG.communication.publicAlias,
        });
        if (Object.keys(networkMap.nodes).length === 0)
          primeForMapImport(this.UUID);
      }
    }.bind(this);
    this.channel.onmessage = async function (event) {
      PeerConnection.prototype.handleMessage
        .bind(this)(event.data)
        .catch((error) => {
          if (this.peerData.hiddenAlias) {
            shiftNodeWeight(
              this.peerData.hiddenAlias,
              CONFIG.constants.genericUncaughtError
            );
          }
          throw error;
        });
    }.bind(this);
  }
  async announceConsumable(consumableRaw) {
    eventHandler.dispatch(
      `consumable | ${this.peerData.hiddenAlias}`,
      consumableRaw
    );
  }
  async makeOffer() {
    if (this.connection.remoteDescription || this.connection.localDescription) {
      throw new Error("This connection has already started ice gathering.");
    }
    await this.connection.setLocalDescription(
      await this.connection.createOffer()
    );
    this.connection.onicecandidate = async ({ candidate }) => {
      if (candidate) return;
      eventHandler.dispatch(`exhaustedICECandidates | ${this.UUID}`);
    };
    await eventHandler.acquireExpectedDispatch(
      `exhaustedICECandidates | ${this.UUID}`,
      CONFIG.rtc.ICEGatheringMaxDelay
    );
    return this.connection.localDescription;
  }
  async receiveOffer(SDP) {
    checkForTypeErrors([{ SDP }], [["object"]]);
    if (this.connection.remoteDescription || this.connection.localDescription) {
      throw new Error("This connection has already started ice gathering.");
    }
    this.initiator = false;
    await this.connection.setRemoteDescription(SDP);
    await this.connection.setLocalDescription(
      await this.connection.createAnswer()
    );
    this.connection.onicecandidate = async ({ candidate }) => {
      if (candidate) return;
      eventHandler.dispatch(`exhaustedICECandidates | ${this.UUID}`);
    };
    await eventHandler.acquireExpectedDispatch(
      `exhaustedICECandidates | ${this.UUID}`,
      CONFIG.rtc.ICEGatheringMaxDelay
    );
    return this.connection.localDescription;
  }
  async receiveAnswer(SDP) {
    if (typeof SDP === "string") SDP = JSON.parse(SDP);
    checkForTypeErrors([{ SDP }], [["object"]]);
    if (this.connection.remoteDescription) {
      throw new Error(
        "Can't receive an answer to a connection that already has a remote description."
      );
    }
    this.connection.setRemoteDescription(SDP);
  }
  async requestAuth() {
    this.channel.sendPackage("authenticationRequest");
    await eventHandler
      .acquireExpectedDispatch(
        `authenticationRequestResponse|${this.UUID}`,
        CONFIG.communication.connectionTimeout
      )
      .then(
        (value) => {
          if (value.externalDetail.status) {
            if (!authPeers.includes(this.peerData.hiddenAlias))
              addAuthPeer(this.peerData.hiddenAlias);
          } else {
            announceAuthRejected(this.peerData.hiddenAlias);
          }
        },
        () => {
          announceAuthRejected(this.peerData.hiddenAlias);
        }
      );
    return this;
  }
  async considerConnectionRequest(routePackage) {
    // this is a hack to fix race condition. Will come back to it and do something less disgusting when I have more time
    // Maybe eliminate auth requests all together and turn them into non-auth requests with an escalation request tacked on?
    if (consideringAuthConnections.includes(routePackage.sender)) {
	return
    }
    if (consideringNonAuthConnections.includes(routePackage.sender) && routePackage.wantAuth) {
	authConnectionQueue.append(routePackage.sender)
	return
    }
    if (routePackage.wantAuth) {
	consideringAuthConnections.push(routePackage.sender)
    } else {
	consideringNonAuthConnections.push(routePackage.sender)
    }
    var connection = new PeerConnection(routePackage.wantAuth);
    try {
      var SDP = await connection.receiveOffer(JSON.parse(routePackage.SDP));
    } catch (error) {
      if (routePackage.sender) {
        shiftNodeWeight(
          routePackage.sender,
          CONFIG.constants.peerPenalties.invalidSDP
        );
      }
      this.rejectConnection(routePackage, connection);
      return;
    }
    if (
      await awaitIfAsync(CONFIG.communication.connectionAcceptRejectFunction, [
        routePackage,
      ])
    ) {
      this.acceptConnection(routePackage, SDP);
    } else {
      this.rejectConnection(routePackage, connection);
    }
    if (routePackage.wantAuth) {
      consideringAuthConnections.splice(consideringAuthConnections.indexOf(routePackage.sender), 1)
    } else {
	consideringNonAuthConnections.splice(consideringNonAuthConnections.indexOf(routePackage.sender), 1)  
    }
    if (authConnectionQueue.includes(routePackage.sender)) {
	makeConnection(routePackage.sender, true)
	authConnectionQueue.splice(authConnectionQueue.indexOf(routePackage.sender), 1)  
    }
  }
  async rejectConnection(routePackage, peerConnection) {
    peerConnection.connection.close();
    sendTowards(routePackage.sender, "routeRejected", {
      destination: routePackage.sender,
      routeID: routePackage.routeID,
    }).catch(() => {});
  }
  async acceptConnection(routePackage, SDP) {
    await sendTowards(routePackage.sender, "routeAccepted", {
      SDP,
      destination: routePackage.sender,
      routeID: routePackage.routeID,
    });
  }
  async handleMessage(message) {
    const parsed = JSON.parse(
      CONFIG.rtc.binaryType === "arrayBuffer"
        ? new TextDecoder().decode(message)
        : message
    );
    checkForTypeErrors([{ parsed }], [["object"]]);
    if (
      !authPeers.includes(this.peerData?.hiddenAlias) &&
      parsed[0] === "consumable"
    ) {
      return;
    }
    let packageType = parsed[0];
    let packageData = parsed[1];
    switch (packageType) {
      case "consumable":
        this.announceConsumable(packageData.raw);
        break;
      case "gossip":
        gossipTransport.consumeGossip(packageData);
        break;
      case "mapRequest":
        this.channel.sendPackage("mapReturn", {
          map: await networkMap.optionalExport(),
        });
        break;
      case "mapReturn":
        if (
          packageData.map === "none" ||
          eventHandler.dispatchWatchers[`networkMapRecieved${this.UUID}`]
            .length < 1
        ) {
          return;
        }
        eventHandler.dispatch(`networkMapRecieved${this.UUID}`);
        networkMap.importList(packageData, this.peerData.hiddenAlias);
        break;
      case "connectionRequest":
        if (packageData.destination === CONFIG.communication.hiddenAlias) {
          this.considerConnectionRequest(packageData);
          return;
        }
        try {
          sendTowards(
            packageData.destination,
            "connectionRequest",
            packageData
          );
        } catch {
          try {
            sendTowards(packageData.sender, "routeInaccessible", {
              routeID: packageData.routeID,
              pointOfFailure: CONFIG.communication.hiddenAlias,
              destination: packageData.sender,
            });
          } catch {
            return;
          }
        }
        break;
      case "routeInaccessible":
        if (packageData.destination == CONFIG.communication.hiddenAlias) {
          eventHandler.dispatch(
            `routeInaccessible|${packageData.routeID}`,
            packageData
          );
          return;
        }
        try {
          sendTowards(
            packageData.destination,
            "routeInaccessible",
            packageData
          );
        } catch {
          return;
        }
        break;
      case "routeRejected":
	if (packageData.destination == CONFIG.communication.hiddenAlias) {
          eventHandler.dispatch(
            `routeRejected|${packageData.routeID}`,
            packageData
          );
          return;
        }
        try {
          sendTowards(packageData.destination, "routeRejected", packageData);
        } catch {
          return;
        }
        break;
      case "routeAccepted":
        if (packageData.destination == CONFIG.communication.hiddenAlias) {
          eventHandler.dispatch(
            `routeAccepted|${packageData.routeID}`,
            packageData
          );
          return;
        }
        try {
          sendTowards(packageData.destination, "routeAccepted", packageData);
        } catch {
          return;
        }
        break;
      case "authenticationRequest":
        if (!this.peerData.hiddenAlias) return;
        if (
          await awaitIfAsync(
            CONFIG.communication.connectionAcceptRejectFunction,
            [
              {
                sender: this.peerData.hiddenAlias,
                wantAuth: true,
              },
            ]
          )
        ) {
          this.channel.sendPackage("authenticationRequestResponse", {
            status: true,
          });
          this.auth = true;
          if (!authPeers.includes(this.peerData.hiddenAlias))
            addAuthPeer(this.peerData.hiddenAlias);
        } else {
          this.channel.sendPackage("authenticationRequestResponse", {
            status: false,
          });
        }
        break;
      case "authenticationRequestResponse":
        eventHandler.dispatch(`authenticationRequestResponse|${this.UUID}`, {
          status: packageData.status,
        });
        break;
      case "initiatorIntroduction":
        if (this.acquainted) {
          return;
        }
        this.initializationMethods
          .initiatorIntroduction(packageData)
          .catch((error) => {
            if (
              this.peerData.peer ||
              typeof packageData.hiddenAlias === "string"
            ) {
              shiftNodeWeight(
                this.peerData.peer,
                CONFIG.constants.peerPenalties.initSequenceError
              );
            }
            this.close();
            throw error;
          });
        break;
      case "nonInitiatorIntroduction":
        if (this.acquainted) {
          return;
        }
        this.initializationMethods
          .nonInitiatorIntroduction(packageData)
          .catch((error) => {
            if (
              this.peerData.peer ||
              typeof packageData.hiddenAlias === "string"
            ) {
              shiftNodeWeight(
                this.peerData.peer,
                CONFIG.constants.peerPenalties.initSequenceError
              );
            }
            this.close();
          });
        break;
      case "forcefulDeauth":
        deauthPeer(this.peerData.hiddenAlias, false);
        break;
      default:
        throw new Error(`unrecognized message type "${packageType}"`);
    }
  }
  initializationMethods = {
    initiatorIntroduction: async (message) => {
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
          throw new Error(`a route already exists to the desired destination`);
        }
      } catch (error) {
        this.close();
        return;
      }
      addAlias(message.publicAlias, message.hiddenAlias);
      addLivePeer(message.hiddenAlias, this);
      if (this.auth) addAuthPeer(message.hiddenAlias);
      // Pairs should be sorted so the order is consistent, since the parser uses the pair to tell if it already knows a fact
      let hiddenAliasPair = [
        CONFIG.communication.hiddenAlias,
        message.hiddenAlias,
      ].sort();
      let publicAliasPair =
        hiddenAliasPair[0] === CONFIG.communication.hiddenAlias
          ? [CONFIG.communication.publicAlias, message.publicAlias]
          : [message.publicAlias, CONFIG.communication.publicAlias];
      topologyTransport.addGossip({
        hiddenAliasPair,
        publicAliasPair,
        mode: "addLink",
      });
      this.acquainted = true;
      const providedMap = !message.isOriented
        ? await networkMap.optionalExport()
        : false;
      this.channel.sendPackage("nonInitiatorIntroduction", {
        publicAlias: CONFIG.communication.publicAlias,
        hiddenAlias: CONFIG.communication.hiddenAlias,
        map: providedMap,
      });
      this.peerData = { hiddenAlias: message.hiddenAlias };
    },
    nonInitiatorIntroduction: async (message) => {
      try {
        checkForTypeErrors(
          [
            { message },
            { "message.hiddenAlias": message.hiddenAlias },
            { "message.publicAlias": message.publicAlias },
          ],
          [["object"], ["string"], ["string"], ["boolean"]]
        );
        if (Object.keys(livePeers).includes(message.hiddenAlias)) {
          throw new Error(`a route already exists to the desired destination`);
        }
      } catch (error) {
        this.close();
        throw error;
      }
      addAlias(message.publicAlias, message.hiddenAlias);
      addLivePeer(message.hiddenAlias, this);
      if (this.auth) addAuthPeer(message.hiddenAlias);
      if (Object.keys(networkMap.nodes) == "") {
        if (!message.map) {
          const mapInterval = setTimeout(() => {
            if (networkMap) clearInterval(mapInterval);
            this.channel.sendPackage("mapRequest");
            eventHandler
              .acquireExpectedDispatch(`networkMapRecieved${this.UUID}`, 10000)
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
  async close() {
    if (!this.peerData) return;
    let alias = this.peerData.hiddenAlias;
    topologyTransport.addGossip({
      // Pairs should be sorted so the order is consistent, since the parser uses the pair to tell if it already knows a fact
      hiddenAliasPair: [alias, CONFIG.communication.hiddenAlias].sort(),
      mode: "removeLink",
    });
    if (this?.connection?.signalingState !== "closed") {
      this.connection.close();
    }
    deleteLivePeer(alias);
    if (Object.keys(livePeers).length === 0) {
      networkMap.reload();
    }
  }
  async stabilizeLink() {
    var target = await networkMap.findFarthestNode(
      CONFIG.communication.hiddenAlias
    );
    if (target === undefined || target === CONFIG.communication.hiddenAlias)
      return;
    if (Object.keys(livePeers).includes(target)) return;
    await makeConnection(target);
  }
}

async function makeConnection(destination, wantAuth) {
  if (
    (Object.keys(livePeers).includes(destination) && !wantAuth) ||
    (wantAuth && authPeers.includes(destination))
  ) {
    return livePeers[destination];
  }
  if (Object.keys(livePeers).includes(destination) && wantAuth) {
    return await livePeers[destination].requestAuth();
  }
  const peerConnection = new PeerConnection();
  const SDP = JSON.stringify(await peerConnection.makeOffer());
  const routeID = Math.random().toString().slice(2, 12);

  var result;
  try {
    await sendTowards(destination, "connectionRequest", {
      SDP,
      sender: CONFIG.communication.hiddenAlias,
      destination,
      false,
      routeID,
    });
    result = await Promise.race(
      ["routeInaccessible", "routeAccepted", "routeRejected"].map((outcome) => {
        return eventHandler.acquireExpectedDispatch(
          `${outcome}|${routeID}`,
          CONFIG.communication.connectionTimeout
        );
      })
    );
  } catch (error) {
    peerConnection.close();
    if (wantAuth) announceAuthRejected(destination);
    throw new Error(`Route request to ${destination} timed out.`);
  }
  switch (result.signalIdentifier.split("|")[0]) {
    case "routeInaccessible":
      peerConnection.close();
      if (wantAuth) announceAuthRejected(destination);
      if (result.externalDetail?.pointOfFailure) {
        shiftNodeWeight(
          result.externalDetail.pointOfFailure,
          CONFIG.constants.peerPenalties.pointOfRouteFailure
        );
      }
      throw new Error(
        `Connection to ${destination} failed. Route innaccessible.`
      );
    case "routeRejected":
      peerConnection.close();
      if (wantAuth) announceAuthRejected(destination);
      throw new Error(
        `Connection to ${destination} failed. Destination rejected request.`
      );
    case "routeAccepted":
      await peerConnection.receiveAnswer(result.externalDetail.SDP);
      if (wantAuth) {
	peerConnection.requestAuth()
      }
      return peerConnection;
  }
}

class GossipTransport {
  constructor() {
    this.types = {};
    this.propogationStack = [];
    this.intervals = {};
    this.knownFacts = {};
    this.pulseIterations = 0;
    this.parsers = {
      default: async (block, type, identifierFields) => {
        identifierFields = identifierFields
          ? identifierFields
          : Object.keys(block[0]);
        if (!identifierFields.includes("type")) identifierFields.push("type");
        block.type = type;
        var committable = [];
        var unknown = [];
        if (!this.knownFacts[type]) this.knownFacts[type] = [];
        for (let component of block) {
          var data = {};
          Object.keys(component)
            .filter((key) => identifierFields.includes(key))
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
    if (
      this.types[type]?.buffer?.length > 0 &&
      !this.propogationStack.includes(type)
    ) {
      this.propogationStack.push(type);
    }
  }
  addType(type, iterModulo) {
    checkForTypeErrors(
      [{ type }, { iterModulo }],
      [["string"], ["number", "undefined"]]
    );
    iterModulo = iterModulo ?? 1;
    if (this.types[type]) throw new Error(`Gossip type ${type} already exists`);
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
  async addParser(type, useDefault, parserCallback, identifierFields) {
    checkForTypeErrors(
      [{ type }, { useDefault }, { parserCallback }, { identifierFields }],
      [["string", "number"], ["boolean"], ["function"], ["object"]]
    );
    const pre = useDefault ? this.parsers.default : async () => [];
    this.parsers[type] = async function (block) {
      try {
        checkForTypeErrors([{ block }], [["object"]]);
      } catch {
        block = {};
      }
      try {
        const defaultOutput = await pre(block, type, identifierFields);
        return await (parserCallback ?? (async () => {}))(
          block,
          ...defaultOutput
        );
      } catch (error) {
        return;
      }
    };
    this.parsers[type].identifierFields = identifierFields;
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
    if (this.types[type].buffer == "") return;
    const approxByteLen = new TextEncoder().encode(
      this.types[type].buffer
    ).length;
    if (approxByteLen > 16384) {
      var chunks = [];
      for (let i = 0; i < Math.ceil(approxByteLen / 16384); i++) {
        chunks.push(
          this.types[type].buffer.slice(
            Math.ceil(
              ((this.types[type].buffer.length * 16384) / approxByteLen) * i
            ),
            Math.floor(
              ((this.types[type].buffer.length * 16384) / approxByteLen) *
                (i + 1)
            ) + 1
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
        `Can't send gossip to ${channel} because no peer exists with this alias`
      );
    livePeers[channel].channel.sendPackage("gossip", pkg);
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
      if (
        this.pulseIterations %
          (modulo != "null" ? parseInt(modulo) : Infinity) ===
        0
      ) {
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
  }, CONFIG.communication.gossipInterval);
}

async function sendTowards(destination, ...content) {
  try {
    var sendTowards = await networkMap.findNextHop(
      CONFIG.communication.hiddenAlias,
      destination
    );
  } catch {
    return;
  }
  sendPackage(sendTowards, ...content);
}

async function primeForMapImport(UID) {
  checkForTypeErrors([{ UID }], [["number", "string"]]);
  eventHandler
    .acquireExpectedDispatch(
      `networkMapRecieved${UID}`,
      CONFIG.communication.mapImportTimeout
    )
    .catch(() => {});
}

function parsePublicAlias(alias, hidden) {
  alias =
    alias ??
    CONFIG.communication.defaultUnknownPublicAlias ??
    hidden ??
    "Anonymous";
  publicAliasTallies[alias] =
    typeof publicAliasTallies[alias] == "number"
      ? ++publicAliasTallies[alias]
      : 0;
  return publicAliasTallies[alias] === 0
    ? alias
    : `${alias} (${publicAliasTallies[alias]})`;
}

function addAlias(pub, hidden) {
  if (hiddenAliasLookup[hidden]) return;
  pub = pub ?? undefined;
  checkForTypeErrors([{ pub }], [["string", "undefined"]]);
  const parsedPub = parsePublicAlias(pub, hidden);
  pubAliasLookup[parsedPub] = hidden;
//   initialReferenceLedger[hidden] = pub;
  hiddenAliasLookup[hidden] = parsedPub;
  pubAliasUnparser[parsedPub] = pub;
}

async function deleteAlias(hidden) {
//   delete initialReferenceLedger[hidden];
  const parsedPub = hiddenAliasLookup[hidden];
  delete hiddenAliasLookup[hidden];
  delete pubAliasLookup[parsedPub];
  delete pubAliasUnparser[parsedPub];
}

class ServerConnection {
  constructor() {
    this.server = undefined;
    this.mostRecentHeartbeat = +new Date();
    this.peer = undefined;
    this.connectAddressComponents = CONFIG.server.initBindURL.split("*");
    if (this.connectAddressComponents.length < 2) {
      throw new Error(
        `server URL should have an "*" showing where to insert SDP: ${CONFIG.server.initBindURL}`
      );
    }
  }
  async tabCloseAlert() {
    this.server.send(JSON.stringify(["forceClosing"]));
  }
  async connect(alreadySignaled = Object.keys(livePeers).length > 0) {
    if (this.server) return;
    if (alreadySignaled) {
      this.server = new WebSocket(CONFIG.server.reconnectURL);
    } else {
      let offer;
      this.peer = new PeerConnection();
      try {
        offer = await Promise.race([this.peer.makeOffer(), eventHandler.acquireExpectedDispatch("serverClosing")]);
	if (offer === "serverClosing") {
	  return
	}
      } catch (error) {
        this.close();
        return;
      }
      this.server = new WebSocket(
        this.connectAddressComponents[0] +
          encodeURIComponent(btoa(JSON.stringify(offer))) +
          this.connectAddressComponents[1]
      );
    }
    this.server.onclose = this.onClose.bind(this);
    this.server.onmessage = this.handleMessage.bind(this);
    this.server.onopen = this.onOpen.bind(this);
    this.heartBeatTimeout = setInterval(() => {
      if (
        +new Date() - this.mostRecentHeartbeat >
          CONFIG.communication.serverHeartbeatTimeout &&
        this.server
      ) {
        this.server.close();
      }
    }, 500);
  }
  async onOpen() {
    this.mostRecentHeartbeat = +new Date();
    this.server.sendPackage("heartbeat");
  }
  async onClose() {
    clearInterval(this.heartBeatTimeout);
    eventHandler.dispatch("serverClosing")
    this.server = undefined;
    this.peer = undefined;
    setTimeout(() => {
      this.connect();
    }, CONFIG.server.reconnectInterval);
  }
  async close() {
    this.server.close();
  }
  async handleMessage(event) {
    this.server.sendPackage("heartbeat");
    this.mostRecentHeartbeat = +new Date();
    const message = JSON.parse(event.data);
    switch (message[0]) {
      case "provideSDP":
        if (message[1] === "unresolved") {
          return;
        }
        try {
          await this.peer.receiveAnswer(message[1]);
        } catch (error) {
          this.server.sendPackage("reportNode", { nodeID: message[3] });
          throw new Error(
            `Recieved improperly formatted SDP while signaling through server.`
          );
        }
        break;
      case "ERROR":
        const error = new Error(
          `Unidentified server error`
        );
        serverError(error, error.stack);
        break;
      case "requestSDP":
        var connection = new PeerConnection();
        try {
          var SDP = await connection.receiveOffer(JSON.parse(atob(message[1])));
        } catch {
          connection.connection.close();
          this.server.sendPackage("ignoreSDPRequest", {
            requesterID: message[2],
          });
          return;
        }
        this.server.sendPackage("returnSDP", {
          SDP: JSON.stringify(SDP),
          requesterID: message[2],
        });
        break;
    }
  }
}

async function loadConfig(configLoadFunction) {
  CONFIG = defaultConfig;
  if (!configLoadFunction) {
    return;
  }
  const provided = await awaitIfAsync(configLoadFunction);
  for (const [loc, value] of Object.entries(provided)) {
    const referenceChain = loc.split(".");
    // Fill in the item of defaultConfig, but only if the location already exists
    const defaultPrefParent = referenceChain
      .slice(0, -1)
      .reduce((previous, current) => {
        if (typeof previous === "undefined") return undefined;
        return previous[current];
      }, CONFIG);
    if (typeof defaultPrefParent !== "object") continue;
    defaultPrefParent[referenceChain.slice(-1)] = value;
  }
}

async function init(configLoadFunction) {
  await loadConfig(configLoadFunction);
  eventHandler.dispatch("configLoaded")
  addAlias(CONFIG.communication.publicAlias, CONFIG.communication.hiddenAlias);
  serverConnection = new ServerConnection();
  await serverConnection.connect();
  gossipTransport = new GossipTransport();
  topologyTransport = gossipTransport.addType("topology");
  routingTableTransport = gossipTransport.addType("weight", 100);
  gossipTransport.addParser(
    "topology",
    true,
    async function (_, committable) {
      const removeNegated = function (negated) {
        let inverseIndex = gossipTransport.knownFacts[negated.type]
          ? gossipTransport.knownFacts[negated.type].indexOf(
              JSON.stringify(negated)
            )
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
              modification.hiddenAliasPair.forEach((alias, index) => {
                if (!Object.keys(networkMap.nodes).includes(alias)) {
                  if (!hiddenAliasLookup[alias])
                    addAlias(modification.publicAliasPair[index], alias);
                  networkMap.addNode(alias);
                }
              });
            } catch {
              return;
            }
            removeNegated(negated);
            networkMap.addEdge(
              modification.hiddenAliasPair[0],
              modification.hiddenAliasPair[1]
            );
            break;
          case "removeLink":
            negated.mode = "addLink";
            removeNegated(negated);
            networkMap.removeEdge(
              modification.hiddenAliasPair[0],
              modification.hiddenAliasPair[1]
            );
            modification.hiddenAliasPair.forEach((alias) => {
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
    ["hiddenAliasPair", "publicAliasPair", "mode"]
  );
  gossipTransport.addParser(
    "weight",
    true,
    async function (_, committable) {
      committable.forEach((modification) => {
        if (networkMap.nodes[modification.alias])
          networkMap.setweight(
            modification.alias,
            networkMap.nodes[modification.alias].weight +
              modification.weightModification
          );
      });
    },
    ["alias", "weightModification", "occurenceID"]
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

//Chrome fix:
window.addEventListener("beforeunload", () => {
  Object.values(livePeers).forEach((peer) => {
    peer.connection.close();
  });
  serverConnection.tabCloseAlert();
});

async function shiftNodeWeight(alias, weightModification) {
  routingTableTransport.addGossip({
    alias: alias,
    weightModification: weightModification,
    occurenceID: Math.random().toString().slice(2, 12),
  });
}

async function onConsumable(hiddenAlias, cb) {
  eventHandler.onReceipt(
    `consumable | ${hiddenAlias}`,
    async (_sig, detail) => {
      cb(detail);
    }
  );
}

async function announceAuthRejected(destination) {
  eventHandler.dispatch("authPeerRejected", destination);
  if (currentlyAuthenticating.includes(destination))
    currentlyAuthenticating.splice(
      currentlyAuthenticating.indexOf(destination),
      1
    );
}

async function serverError(message, stack) {
  Object.values(livePeers).forEach((peer) => {
    peer.connection.close();
  });
  serverConnection.tabCloseAlert();
  eventHandler.dispatch("fatalError", [message, stack]);
}

// Syntactic sugars for eventHandler:

async function onServerError(callback) {
  eventHandler.onReceipt("fatalError", async (_sig, detail) => {
    callback(detail[0], detail[1]);
  });
}

function onNewPeer(callback) {
  eventHandler.onReceipt("newPeer", async (_sig, detail) => {
    callback(detail);
  });
}

async function onAuthRejected(callback) {
  eventHandler.onReceipt("authPeerRejected", async (_sig, detail) => {
    callback(detail);
  });
}

function onLostPeer(callback) {
  eventHandler.onReceipt("lostPeer", async (_sig, detail) => {
    callback(detail);
  });
}

function onNewAuthPeer(callback) {
  eventHandler.onReceipt("newAuthPeer", async (_sig, detail) => {
    callback(detail);
  });
}

function onLostAuthPeer(callback) {
  eventHandler.onReceipt("lostAuthPeer", async (_sig, detail) => {
    callback(detail);
  });
}

async function sendPackage(alias, type, messageParams) {
  checkForTypeErrors(
    [{ alias }, { type }, { messageParams }],
    [["string"], ["string"], ["object", "undefined"]]
  );
  const peer = livePeers[alias];
  if (!peer) throw new Error(`no peer exists with the alias ${alias}`);
  peer.channel.sendPackage(type, messageParams);
}

async function sendConsumable(alias, raw) {
  sendPackage(alias, "consumable", {
    raw: raw,
  });
}

class AuthPeerAddListener {
  constructor() {
    this.listening = {};
    onNewAuthPeer(this.listener.bind(this));
  }
  async listener(externalDetail) {
    if (Object.keys(this.listening).includes(externalDetail)) {
      this.listening[externalDetail]();
      delete this.listening[externalDetail];
    }
  }
  async addListener(alias, callback) {
    if (authPeers.includes(alias)) {
      callback();
      return;
    }
    this.listening[alias] = callback;
  }
}

const authPeerAddListener = new AuthPeerAddListener();
function onAuth(alias, callback) {
  authPeerAddListener.addListener(alias, callback);
}

async function configLoadFunction() {
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
	return JSON.parse(window.localStorage.config ?? "{}");
}

init(configLoadFunction)
