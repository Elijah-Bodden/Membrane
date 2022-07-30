import Sigma from "sigma";
import Graph from "graphology";
import circular from "graphology-layout/circular";
import relatedProgram from "./programs/related.shader";
import unrelatedProgram from "./programs/unrelated.shader";
import serverProgram from "./programs/server.shader";
import EdgeProgram from "./programs/edge.antialias";
import { animateNodes } from "sigma/utils/animate";

class modifierHandler {
  constructor() {
    this.SHIFT = false;
    this.CTRL = false;
    this.FUNCTION = false;
    this.ALT = false;
    this.toggleValue = async function (event, bool) {
      switch (event.key) {
        case "Alt":
          this.ALT = bool;
          break;
        case "Control":
          this.CTRL = bool;
          break;
        case "Fn":
          this.FUNCTION = bool;
          break;
        case "Shift":
          this.SHIFT = bool;
          break;
      }
    };
    window.onkeydown = async (event) => {
      this.toggleValue(event, true);
    };
    window.onkeyup = async (event) => {
      this.toggleValue(event, false);
    };
  }
}

const statusColors = {
  Neutral: "#5D5A6D",
  Selected: "#444155",
  AuthNeutral: "#8B7FD3",
  AuthSelected: "#5B4EA1",
  ErrorNeutral: "#B41E06",
  ErrorSelected: "#a30006",
  SuccessNeutral: "#178A0E",
  SuccessSelected: "#47A13F",
};
const mod = new modifierHandler();
const container = document.getElementById("graphContainer");
const suggestionsList = document.querySelector("#search-opts");
const nodeDismissHandler = new eventHandlingMechanism();
const state = {
  activeNode: undefined,
  searchQuery: "",
  suggestions: [],
  errorNodes: [],
  successNodes: [],
  renderedNodes: [],
  renderedLinks: [],
};
const graphData = {
  options: {
    allowSelfLoops: false,
    multi: false,
    type: "mixed",
  },
  nodes: [
    {
      key: "server",
      attributes: {
        size: 15,
        label: "Server",
        type: "server",
        color: statusColors.Neutral,
      },
    },
  ],
  edges: [],
};
const graph = new Graph();

graph.import(graphData);
circular.assign(graph);

const renderer = new Sigma(graph, container, {
  renderLabels: false,
  minCameraRatio: 0.1,
  maxCameraRatio: 3,
  nodeProgramClasses: {
    related: relatedProgram,
    unrelated: unrelatedProgram,
    server: serverProgram,
  },
  edgeProgramClasses: {
    antialias: EdgeProgram,
  },
});
const camera = renderer.getCamera();

camera.addListener("updated", async (_) => {
  if (camera.x > camera.ratio + 1) camera.x = camera.ratio + 1;
  if (camera.x < -camera.ratio) camera.x = -camera.ratio;
  if (camera.y > camera.ratio + 1) camera.y = camera.ratio + 1;
  if (camera.y < -camera.ratio) camera.y = -camera.ratio;
});

async function blinkStatus(statusIdentifier, node) {
  switch (statusIdentifier.toLowerCase()) {
    case "error":
      state.errorNodes.push(node);
      setTimeout(() => {
        state.errorNodes.splice(state.errorNodes.indexOf(node), 1);
        renderer.refresh();
      }, 5000);
      break;
    case "success":
      state.successNodes.push(node);
      setTimeout(() => {
        state.successNodes.splice(state.successNodes.indexOf(node), 1);
        renderer.refresh();
      }, 5000);
      break;
  }
  renderer.refresh();
}

renderer.setSetting("nodeReducer", (node, data) => {
  const res = { ...data };
  const active = state.activeNode === node;
  const error = state.errorNodes.includes(node);
  const success = state.successNodes.includes(node);
  const prepend =
    error && success
      ? error
      : !(success || error)
      ? ""
      : ["Success", "Error"][[success, error].indexOf(true)];
  const fullStatusString =
    prepend + ["Selected", "Neutral"][[active, !active].indexOf(true)];
  res.color = statusColors[fullStatusString];
  return res;
});

renderer.setSetting("edgeReducer", (edge, data) => {
  const res = { ...data };
  var prependable = graph.extremities(edge).reduce((last, extremity) => {
    return state.errorNodes.includes(extremity)
      ? "Error"
      : state.successNodes.includes(extremity) && last != "Error"
      ? "Success"
      : last;
  }, "");
  if (!prependable) {
    if (
      [1, 0]
        .map((flippedIndex, trueIndex) => {
          return (
            authPeers.includes(graph.extremities(edge)[flippedIndex]) &&
            graph.extremities(edge)[trueIndex] ===
              CONFIG.communication.hiddenAlias
          );
        })
        .includes(true)
    ) {
      prependable = "Auth";
    }
  }
  if (state.activeNode) {
    res.color = "#d9dde0";
    if (graph.hasExtremity(edge, state.activeNode)) {
      res.color = statusColors[prependable + "Selected"];
    }
    return res;
  }
  res.color = statusColors[prependable + "Neutral"];
  return res;
});

function setSearchQuery(query) {
  if (!CONFIG.UI.renderUnfamiliarPublicAliases) {
    suggestionsList.innerHTML = "";
    return;
  }
  state.searchQuery = query;
  if (query) {
    const lcQuery = escapeHTML(query.toLowerCase());
    let suggestions = Object.keys(networkMap.nodes).filter((node) => {
      try {
        return hiddenAliasLookup[node].toLowerCase().indexOf(lcQuery) != -1;
      } catch {
        return false;
      }
    });
    let sortedSuggestions = suggestions.reduce((sum, suggestion) => {
      const index = hiddenAliasLookup[suggestion]
        .toLowerCase()
        .indexOf(lcQuery);
      sum[index] = sum[index] ? sum[index] : [];
      sum[index].push(suggestion);
      return sum;
    }, {});
    var suggestionPriority = [];
    var suggestionPairs = {};
    for (let len in sortedSuggestions) {
      sortedSuggestions[len] = sortedSuggestions[len].sort((a, b) => {
        a = hiddenAliasLookup[a].toLowerCase();
        b = hiddenAliasLookup[b].toLowerCase();
        return a === b ? 0 : a > b ? 1 : -1;
      });
      for (let suggestion of sortedSuggestions[len]) {
        suggestionPriority.push(suggestion);
        let firstIndex = hiddenAliasLookup[suggestion]
          .toLowerCase()
          .indexOf(lcQuery);
        const boldedSuggestion =
          hiddenAliasLookup[suggestion].slice(0, firstIndex) +
          `<b>${hiddenAliasLookup[suggestion].slice(
            firstIndex,
            firstIndex + lcQuery.length
          )}</b>` +
          hiddenAliasLookup[suggestion].slice(firstIndex + lcQuery.length);
        suggestionPairs[suggestion] = boldedSuggestion;
      }
    }
    renderQuerySuggestions(suggestionPairs, suggestionPriority, true);
    if (
      suggestionPriority.length === 1 &&
      hiddenAliasLookup[suggestionPriority[0]].toLowerCase() === query
    ) {
      activateNode(suggestionPriority[0]);
    } else {
      state.selectedNode = undefined;
    }
  } else {
    renderQuerySuggestions();
  }
}

async function renderQuerySuggestions(
  suggestionPairs,
  suggestionPriority,
  isInformed
) {
  var suggestionPairs =
    typeof suggestionPairs === "object"
      ? suggestionPairs
      : Object.assign(hiddenAliasLookup);
  delete suggestionPairs[CONFIG.communication.hiddenAlias];
  var suggestionPriority =
    typeof suggestionPriority === "object"
      ? suggestionPriority
      : Object.keys(suggestionPairs).sort((a, b) => {
          a = hiddenAliasLookup[a].toLowerCase();
          b = hiddenAliasLookup[b].toLowerCase();
          return a === b ? 0 : a > b ? 1 : -1;
        });
  suggestionPairs =
    Object.keys(suggestionPairs).reduce((total, item) => {
      total[item] = (isInformed ? "<b>@</b>" : "@") + suggestionPairs[item];
      return total;
    }, {}) ?? {};
  suggestionsList.innerHTML = "";
  if (Object.keys(suggestionPairs) == "") return;
  Object.keys(suggestionPairs).forEach((hidden, index) => {
    suggestionsList.innerHTML += `
    <li class="context-item">
      <button class="context-button border-surround ${
        index === 0 ? "search-opts-cap " : ""
      }suggestion-button" id="${hidden}-suggestion-button" onclick="activateNode('${hidden}')" data-index=${index}>
        ${suggestionPairs[hidden]}
      </button>
    </li>
    `;
  });
  document.querySelectorAll(".suggestion-button").forEach((btn) => {
    btn.addEventListener("mouseup", async (e) => {
      setTimeout(() => {
        document.querySelector("#search-opts").style.visibility = "hidden";
      }, 1);
    });
    btn.addEventListener("keydown", async (e) => {
      if (e.key == "ArrowDown") {
        e.preventDefault();
        if (
          document.querySelectorAll(".suggestion-button")[
            new Number(e.target.dataset.index) + 1
          ] == undefined
        )
          return;
        document
          .querySelectorAll(".suggestion-button")
          [new Number(e.target.dataset.index) + 1].focus();
      }
      if (
        e.key == "ArrowUp" &&
        !e.target.classList.contains("search-opts-cap")
      ) {
        e.preventDefault();
        if (
          document.querySelectorAll(".suggestion-button")[
            new Number(e.target.dataset.index) - 1
          ] == undefined
        )
          return;
        document
          .querySelectorAll(".suggestion-button")
          [e.target.dataset.index - 1].focus();
      }
    });
  });
  document
    .querySelector(".search-opts-cap")
    .addEventListener("keydown", async (e) => {
      if (e.key == "ArrowUp") {
        e.preventDefault();
        document.querySelector("#searchEntryField").focus();
      }
    });
}

networkMap.onUpdate(async (_sig, externalDetail) => {
  switch (externalDetail[0]) {
    case "addNode":
      graph.updateNode(externalDetail[1], () => {
        return {
          x: 0,
          y: 0,
          label:
            externalDetail[1] === CONFIG.communication.hiddenAlias
              ? "𝙈𝙚"
              : CONFIG.UI.renderUnfamiliarPublicAliases
              ? hiddenAliasLookup[externalDetail[1]]
              : externalDetail[1],
          size: externalDetail[1] === CONFIG.communication.hiddenAlias ? 10 : 5,
          color: statusColors.Neutral,
          type:
            externalDetail[1] === CONFIG.communication.hiddenAlias
              ? "server"
              : "unrelated",
        };
      });
      graph.updateEdge(externalDetail[1], "server", () => {
        return { type: "antialias", size: 1 };
      });
      break;
    case "addEdge":
      graph.updateEdge(...externalDetail[1].sort(), () => {
        return { type: "antialias", size: 1 };
      });
      break;
    case "removeEdge":
      graph.dropEdge(...externalDetail[1].sort());
      break;
    case "removeNode":
      graph.dropNode(externalDetail[1]);
      break;
    case "totalWipe":
      graph.forEachNode((node) => {
        if (node === CONFIG.communication.hiddenAlias || node === "server")
          return;
        try {
          graph.dropNode(node);
        } catch {
          return;
        }
      });
      break;
  }
  const circularLocations = circular(graph);
  animateNodes(graph, circularLocations, {
    easing: "quadraticIn",
    duration: 2000,
  });
  renderer.refresh();
  setSearchQuery(document.querySelector("#searchEntryField").value);
});

async function activateNode(node) {
  state.activeNode = node;
  renderer.refresh();
  if (node)
    if (graph.nodes().includes(node)) {
      camera.animate(renderer.getNodeDisplayData(node), {
        duration: 500,
      });
    }
  if (authPeers.includes(node)) fusedStream.loadCache(node);
}

async function generateNodeContext(node, isKnownConnection, mouseUpPromise) {
  let contextType;
  let contextTypes = ["#node-context", "#connection-context"];
  if (node === "server" || node === CONFIG.communication.hiddenAlias) return;
  else if (isKnownConnection) contextType = contextTypes[1];
  else contextType = contextTypes[0];
  const context = document.querySelector(contextType);
  await mouseUpPromise;
  context.style.visibility = "visible";
  contextTypes.splice(contextTypes.indexOf(contextType), 1);
  contextTypes.forEach((type) => {
    document.querySelector(type).style.visibility = "hidden";
  });
  context.setAttribute("data-caller", node);
  let offset = 0.1 / camera.ratio;
  context.style.left = 50 + offset + "%";
  context.style.bottom = 50 + offset + "%";
  raceNodeContextDismissEvents(context);
}

async function raceNodeContextDismissEvents(context) {
  let funcs = {
    windowResizeEvent: async () => {
      nodeDismissHandler.dispatch("windowResize");
    },
    rightClickCanvasEvent: async () => {
      nodeDismissHandler.dispatch("nonContextClick");
    },
    clickContextEvent: async () => {
      nodeDismissHandler.dispatch("contextButtonClicked");
    },
    clickCanvasEvent: async () => {
      nodeDismissHandler.dispatch("nonContextClick");
    },
    clickNodeEvent: async () => {
      nodeDismissHandler.dispatch("nonContextClick");
    },
    rightClickNodeEvent: async () => {
      nodeDismissHandler.dispatch("nonContextClick");
    },
    wheelStageEvent: async () => {
      nodeDismissHandler.dispatch("wheelStage");
    },
    doubleClickStageEvent: async () => {
      nodeDismissHandler.dispatch("nonContextClick");
    },
  };

  window.onresize = funcs["windowResizeEvent"];
  context.onmouseup = funcs["clickContextEvent"];
  renderer.on("rightClickStage", funcs["rightClickCanvasEvent"]);
  renderer.on("clickStage", funcs["clickCanvasEvent"]);
  renderer.on("wheelStage", funcs["wheelStageEvent"]);
  renderer.on("clickNode", funcs["clickNodeEvent"]);
  renderer.on("rightClickNode", funcs["rightClickNodeEvent"]);
  renderer.on("doubleClickStage", funcs["doubleClickStageEvent"]);

  let resizeCall = nodeDismissHandler.acquireExpectedDispatch(
    "windowResize",
    60000
  );
  let contextClickCall = nodeDismissHandler.acquireExpectedDispatch(
    "contextButtonClicked",
    60000
  );
  let nonContextClickCall = nodeDismissHandler.acquireExpectedDispatch(
    "nonContextClick",
    60000
  );
  let wheelStageCall = nodeDismissHandler.acquireExpectedDispatch(
    "wheelStage",
    60000
  );
  let raceTimeoutDefault = nodeDismissHandler.acquireExpectedDispatch(
    "defaultRaceResolveTimer",
    59000
  );

  const promiseConsequence = (_) => {
    context.style.visibility = "hidden";
    activateNode();
    nodeDismissHandler.flushExpectedDispatches();
    window.removeEventListener("resize", funcs["windowResizeEvent"]);
    context.removeEventListener("mouseup", funcs["clickContextEvent"]);
    renderer.removeListener("rightClickStage", funcs["rightClickCanvasEvent"]);
    renderer.removeListener("clickStage", funcs["clickCanvasEvent"]);
    renderer.removeListener("wheelStage", funcs["wheelStageEvent"]);
    renderer.removeListener("clickNode", funcs["clickNodeEvent"]);
    renderer.removeListener("rightClickNode", funcs["rightClickNodeEvent"]);
    renderer.removeListener("doubleClickStage", funcs["doubleClickStageEvent"]);
  };
  Promise.race([
    resizeCall,
    contextClickCall,
    nonContextClickCall,
    wheelStageCall,
    raceTimeoutDefault,
  ]).then(promiseConsequence, promiseConsequence);
}

renderer.on("clickNode", async (event) => {
  setTimeout(() => {
    ["successNodes", "errorNodes"].forEach((nodeState) => {
      if (state[nodeState].indexOf(event.node) != -1)
        state[nodeState].splice(state[nodeState].indexOf(event.node), 1);
    });
    renderer.refresh();
    activateNode(event.node);
    if (mod.ALT) {
      if (
        event.node === "server" ||
        event.node === CONFIG.communication.hiddenAlias
      )
        return;
      peerConnection.prototype.negotiateAgnosticAuthConnection(event.node);
    }
  }, 10);
});

renderer.on("clickStage", async (event) => {
  activateNode();
});

renderer.on("rightClickNode", async (event) => {
  activateNode(event.node);
  if (event.node === "server") {
    return;
  }
  window.onmouseup = async function () {
    nodeDismissHandler.dispatch("mouseUpMenuSpawnable");
  };
  const contextPromise = nodeDismissHandler.acquireExpectedDispatch(
    "mouseUpMenuSpawnable"
  );
  generateNodeContext(
    event.node,
    authPeers.includes(event.node),
    contextPromise
  );
});


window.graphState = state;
window.generateNodeContext = generateNodeContext;
window.setSearchQuery = setSearchQuery;
window.activateNode = activateNode;
window.Graph = graph;
window.blinkStatus = blinkStatus;
window.renderer = renderer;
