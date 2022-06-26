"use strict";

//Initial values

var CONFIG = {}
var defaultConfig = {
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
		transmitMapToOrientedPeers : true,
		defaultUnknownPublicAlias : "anonymous", //IF UNDEFINED, DEFAULT TO PRIVATE
		propogationInterval : 100,
		publicAlias : "myAlias",
		privateAlias : Math.random().toString(32).slice(2) //DO NOT OVERRIDE
	},
}

//Classes
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
			await this.precomputeRoutes(currentNode);
		}
		if (this.dead.includes(endNode)) {
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

//Mainthread init
async function preliminaryConfig(defaultConfig, provisionFunction) {
	//Provided looks like : {%flatRL% : pref}
	const provided = provisionFunction ? provisionFunction.constructor.name === "AsyncFunction" ? await provisionFunction() : provisionFunction() : {}
	var loadableConfig = Object.assign({}, defaultConfig)
	for (let i in provided) {
		const referenceChain = i.split(".")
		const deepestProperty = referenceChain.slice(-1)
		//return an object one layer shallower than the provided referenceChain, and later always refer to it including the chain's last key so that every modification to this actually mutates the referenced object's property.
		const defaultPrefParent = referenceChain.reduce((previous, current, currentIndex) => {console.log(previous?.["rtc"], previous, current, previous[current]); if (currentIndex === referenceChain.length-1) {return previous} else {return previous?.[current]}}, loadableConfig)
		if (typeof defaultPrefParent[deepestProperty] !== "undefined" && typeof defaultPrefParent[deepestProperty] === typeof provided[i]) defaultPrefParent[deepestProperty] = provided[i]
	}
	CONFIG = loadableConfig
}

function init() {
	// preliminaryConfig(defaultConfig, () => {return {"communication.publicAlias" : prompt("What public alias would you like to use?")}})
	preliminaryConfig(defaultConfig, () => {return {"communication.publicAlias" : "someAlias"}})
}

init()