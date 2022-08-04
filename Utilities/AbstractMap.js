class AbstractMap {
  constructor() {
    this.adjacencyList = {};
    this.nodes = {};
    this.distances = undefined;
    this.previous = undefined;
    this.computationRefreshed = false;
  }
  async onUpdate(callback) {
    //Optional dependancy; simply comment out the following line to make fully this utility self-contained
    eventHandler.onReciept("abstractMapUpdate", callback);
  }
  async triggerUpdate(method, relevantInformation) {
    //Optional dependancy; simply comment out the following line to make fully this utility self-contained
    eventHandler.dispatch("abstractMapUpdate", [method, relevantInformation]);
  }
  addEdge(i, j) {
    var nodePresences = [
      Object.keys(this.nodes).includes(i),
      Object.keys(this.nodes).includes(j),
    ];
    if (!(nodePresences[0] && nodePresences[1]))
      throw new Error(
        `Unable to create a representative edge between the nodes aliased ${i} and ${j} as ${
          nodePresences[0] ^ nodePresences[1]
            ? 'there exists no node "' +
              [i, j][nodePresences.indexOf(false)] +
              '"'
            : "neither may be found"
        } within the present networkMap`
      );
    this.adjacencyList[i][j] = this.nodes[j];
    this.adjacencyList[j][i] = this.nodes[i];
    this.triggerUpdate("addEdge", [i, j]);
  }
  addNode(key, weight) {
    this.adjacencyList[key] = {};
    this.setweight(key, weight ?? 1);
    this.triggerUpdate("addNode", key);
  }
  removeNode(key) {
    if (!(this.nodes[key] || this.adjacencyList[key])) return;
    delete this.nodes[key];
    delete this.adjacencyList[key];
    this.triggerUpdate("removeNode", key);
  }
  removeEdge(i, j) {
    if (!(this.adjacencyList[i]?.[j] || this.adjacencyList[j]?.[i])) {
      return;
    }
    delete this.adjacencyList[i]?.[j];
    delete this.adjacencyList[j]?.[i];
    this.triggerUpdate("removeEdge", [i, j]);
  }
  async precomputeRoutes(source) {
    if (!Object.keys(this.nodes).includes(source))
      throw new Error(
        `Requested source node (${source}) is not present within AbstractMap.__instance__.nodes`
      );
    var dist = {};
    var prev = {};
    var queue = new crudeQueue(); //must be included for this action to function--see source below
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
    await this.precomputeRoutes(currentNode);
    if (
      !(
        Object.keys(this.nodes).includes(currentNode) &&
        Object.keys(this.nodes).includes(endNode)
      )
    ) {
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
          `The requested route <${currentNode} -> ${endNode}> is not possible in the current map (there exists no path between intermediary node ${node} and the requested ${currentNode}).`
        );
      node = this.previous[node];
    }
    return lastNode;
  }
  async reload() {
    this.adjacencyList = {};
    this.nodes = {};
    this.distances = undefined;
    this.previous = undefined;
    this.computationRefreshed = false;
    this.triggerUpdate("totalWipe");
  }
  async setweight(key, weight) {
    this.nodes[key] = { weight };
  }
}

class crudeQueue {
  constructor() {
    this.cachedPriorities = {};
    this.queue = {};
  }
  add(item, priority) {
    checkForTypeErrors(
      [{ item }, { priority }],
      [["number", "string"], ["number"]]
    );
    this.cachedPriorities[item] = priority;
    if (!this.queue[priority]) {
      this.queue[priority] = [];
    }
    this.queue[priority].push(item);
  }
  extractMin() {
    if (Object.keys(this.queue) == "")
      throw new Error(
        `unable to extract key of minimum priority, queue is empty`
      );
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
