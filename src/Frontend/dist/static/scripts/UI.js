//load saved LS in visual config on load

window.addEventListener("DOMContentLoaded", async function () {
  document.querySelector("#searchEntryField").value = "";
  document.querySelector("#chatEntryField").style.height = document.querySelector("#chatEntryField").scrollHeight
  document.querySelector("#chatEntryField").scrollTop = document.querySelector("#chatEntryField").style.scrollHeight
});

var noTransitionTimeout
window.addEventListener("resize", async function() {
  var set = document.querySelectorAll("*")
  for (let element of set) {
    element.classList.add("force-noAnimation")
  }
  if (noTransitionTimeout)
  clearTimeout(noTransitionTimeout)
  noTransitionTimeout = setTimeout(() => {
    for (let element of set) {
      element.classList.remove("force-noAnimation")
    }
  }, 300);
})

var postcontext
var connectioncardcontext
var connectionspanel
var fusedStream
var eventStream
var cachedConfigValues = {}

window.onload = function() {
  fusedStream = new FusedStream("messageFeedPane", "#messageSequence");
  fusedStream.chatInit()
  eventStream = new FusedStream("systemEventPane", "#systemEventSequence", false)
  eventStream.streamInit()
  let chatbar = document.querySelector("#chatEntryField");
  chatbar.style.height = "";
  chatbar.style.height = chatbar.scrollHeight + "px";
  document.querySelector("#searchEntryField").addEventListener("keydown", async (e) => {
    if (e.key == "ArrowDown" || e.key === "Enter") {
      e.preventDefault();
      document.querySelector(".search-opts-cap").focus();
    }
  });
  document.querySelector("#searchEntryField").addEventListener("keyup", async (e) => {
    if (e.key == "Backspace" || e.key == "Delete") {
      setSearchQuery(document.querySelector("#searchEntryField").value);
    }
  });
  document.querySelector("#searchEntryField").addEventListener("keypress", async (e) => {
    setSearchQuery(e.target.value + e.key);
  });
  document.querySelector("#searchEntryField").addEventListener("focusin", async (e) => {
    setSearchQuery(e.target.value)
    document.querySelector("#search-opts").style.visibility = "visible";
  });
  document.querySelector("#searchEntryField").addEventListener("focusout", async () => {
    setTimeout(() => {
      if (!document.querySelector("#search-opts").contains(document.activeElement)) {
        document.querySelector("#search-opts").style.visibility = "hidden";
      }
    });
  });
  document.querySelector("#search-opts").addEventListener("focusout", async () => {
    setTimeout(() => {
      if (!((document.querySelector("#searchEntryField") == document.activeElement) || document.querySelector("#search-opts").contains(document.activeElement)) ) {
        document.querySelector("#search-opts").style.visibility = "hidden";
      }
    });
  });
  document.querySelector("#connectedNodesPane").addEventListener("scroll", async () => {
    document.querySelector("#search-opts").style.visibility = "hidden";
    document.querySelector("#connectedNodesPane").focus();
  });
  document.querySelector("#graphContainer").addEventListener("contextmenu", async (e) => {
    e.preventDefault();
  });
  Array.from(document.querySelectorAll(".integerEntryField")).forEach(field => {
    field.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault()
        field.blur()
        return
      }
      if (!event.key.match(/^[0-9]+$/i)) {
        event.preventDefault()
      }
    })
    field.addEventListener("paste", (event) => {
      if (!(event.clipboardData || window.clipboardData).getData('text').match(/^[0-9]+$/i)) {
        event.preventDefault()
      }
    })
    field.addEventListener("focusin", () => {
      cachedConfigValues[field.id] = field.value
    })
    field.addEventListener("focusout", () => {
      if (!field.value) field.value = cachedConfigValues[field.id]
      field.value = parseInt(field.value).toString()
      writeSetting(field.dataset.objective, parseInt(field.value))
    })
  })
  Array.from(document.querySelectorAll(".integerEntryContainer")).forEach(container => {
    container.style.cursor = "text"
    container.addEventListener("click", () => {
      Array.from(container.childNodes).filter((element) => {if (!element.matches) return false; return element.matches(".integerEntryField")})[0].focus()
    })
  })
  Array.from(document.querySelectorAll(".settingsToggle")).forEach((toggle) => {
    toggle.addEventListener("change", () => {
      if (toggle.dataset.objective==="doTURN") {
        exportToLS("doTURN", toggle.checked)
        writeSetting("rtc.ICEpresets.iceServers", toggle.checked ? STUNOnly : allICEServers)
        return
      } else if (toggle.dataset.objective==="communication.moderateMapInstabilityTolerance") {
        writeSetting(toggle.dataset.objective, !toggle.checked)
        return
      }
      writeSetting(toggle.dataset.objective, toggle.checked)
    })
  })
  Array.from(document.querySelectorAll(".settingsToggle")).forEach(
    (element) => {
      if (
        Object.keys(JSON.parse(localStorage.config ?? "{}")).includes(element.dataset.objective)
      ) {
        if (element.dataset.objective==="communication.moderateMapInstabilityTolerance") {
          element.checked = !JSON.parse(localStorage.config)[
            element.dataset.objective
          ];
          return
        }
        element.checked = JSON.parse(localStorage.config)[
          element.dataset.objective
        ];
      }
    }
  );
  Array.from(document.querySelectorAll(".integerEntryField")).forEach(
    (element) => {
      if (
        Object.keys(JSON.parse(localStorage.config ?? "{}")).includes(
          element.dataset.objective
        )
      ) {
        element.value = JSON.parse(localStorage.config)[
          element.dataset.objective
        ];
      }
    }
  );
  onAuthRejected((_sig, externalDetail) => {
    eventStream.log("system", `Authentication request rejected by ${CONFIG.UI.renderUnfamiliarPublicAliases ? (hiddenAliasLookup[externalDetail] ?? externalDetail) : externalDetail}`, "transient", ["align-center", "system-message-card-error", "message-card-slim"])}
    )
  if (!JSON.parse(localStorage.config ?? "{}")["UI.renderUnfamiliarPublicAliases"]) {
    var field = document.querySelector("#searchEntryField")
    field.disabled = true
    field.placeholder="Cannot search, public aliases are disabled"
  } 
  postcontext = new standardContextMenu("post-context", "messagefeed");
  connectioncardcontext = new standardContextMenu("connection-card-context", "connectedNodesPane");
  connectionspanel = new connectionsPanel();
  connectionspanel.renderConnectionCards();
  onAuthPeersUpdated((_signalID, externalDetail) => {
    if (externalDetail[0] == "addition") {
      if (livePeers[externalDetail[1]]) {
        fusedStream.addAndLoadPeerStream(externalDetail[1])
        if (eventStream.dontAlert.includes(externalDetail[1])) {
          eventStream.dontAlert.splice(eventStream.dontAlert.indexOf(externalDetail[1]), 1)
        } else {
          eventStream.log("system", `Successfully authenticated peer session with ${CONFIG.UI.renderUnfamiliarPublicAliases ? hiddenAliasLookup[externalDetail[1]] ?? externalDetail[1] : externalDetail[1]}`, "transient", ["align-center", "system-message-card-success", "message-card-slim"])
        }
        if (!eventHandler.handlerFrame[`consumableAuth | ${livePeers[externalDetail[1]].internalUID}`])
        livePeers[externalDetail[1]].onConsumableAuth((_signal, _externalDetail_) => {
          fusedStream.log(externalDetail[1], _externalDetail_, "remote", ["message-card-unread"])
        })
        fusedStream.chatCache[externalDetail[1]].isActive = true
      }
    }
    if (externalDetail[0] == "deletion") {
      fusedStream.log(externalDetail[1], "Peer session deauthenticated", "transient", ["align-center", "system-message-card-error", "message-card-slim"])
      eventStream.log("system", `Peer session with ${CONFIG.UI.renderUnfamiliarPublicAliases ? hiddenAliasLookup[externalDetail[1]] ?? externalDetail[1] : externalDetail[1]} deauthenticated`, "transient", ["align-center", "system-message-card-error", "message-card-slim"])
      fusedStream.chatCache[externalDetail[1]].isActive = false
    }
    if (!(fusedStream.chatCache?.[externalDetail[1]]?.isActive??true)) {
      document.querySelector(".sendbutton").style.setProperty("pointer-events", "none")
      document.querySelector(".sendbutton").style.setProperty("filter", "brightness(330%)")
    } else {
      document.querySelector(".sendbutton").style.removeProperty("pointer-events")
      document.querySelector(".sendbutton").style.removeProperty("filter")
    }
    connectionspanel.renderConnectionCards()
    authPeers.forEach((node) => {
      console.log(node)
      Graph.updateNodeAttribute(node, "type", () => "related")
    })
  })
}

class RightPanel {
  constructor() {
    this.activePane = "messageFeedPane";
  }
  rotateIn(target) {
    if (Math.sign(new DOMMatrix(window.getComputedStyle(document.querySelector(`#${target}`)).getPropertyValue("transform")).f) === -1) {
      if (this.activePane == "messageFeedPane") {
        document.querySelector(`#${this.activePane}`).style.transform =
          "translate3d(0px, 100vh, 0px)";
      } else {
        document.querySelector(`#${this.activePane}`).style.transform =
          "translate3d(0px, 0vh, 0px)";
      }
    } else {
      if (this.activePane == "messageFeedPane") {
        document.querySelector(`#${this.activePane}`).style.transform =
          "translate3d(0px, -100vh, 0px)";
      } else {
        document.querySelector(`#${this.activePane}`).style.transform =
          "translate3d(0px, -200vh, 0px)";
      }
    }
    if (target === "messageFeedPane") {
      document.querySelector(`#${target}`).style.transform =
        "translate3d(0px, 0vh, 0px)";
    } else {
      document.querySelector(`#${target}`).style.transform =
        "translate3d(0px, -100vh, 0px)";
    }
    const initialState = this.activePane
    this.activePane = target;
    if (target==="messageFeedPane"&&target!=initialState) fusedStream.refresh()
  }
}

const rightPanel = new RightPanel();

class FusedStream {
  constructor(paneID, messageSequenceSelector, isInteractive) {
    this.panel = rightPanel;
    this.pane = paneID
    this.messageSequenceContainer = document.querySelector(messageSequenceSelector);
    this.chatCache = {}
    this.activeChat = undefined;
    this.isInteractive = isInteractive ?? true
    this.dontAlert = []
  }
  async chatInit() {
    if (!JSON.parse(localStorage.config ?? "{}")["communication.hiddenAlias"]) {
      this.makeCache("system", {transient : "System", local : "Me"}, true)
      this.loadCache("system")
      eventHandler.onReceipt("configLoaded", this.loadDefaultWelcomeSequence.bind(this))
    }
  }
  async streamInit() {
    this.makeCache("system", {transient : "System"}, true)
    this.loadCache("system")
  }
  async loadDefaultWelcomeSequence() {
    this.log("system", "Hello, world!", "transient", ["message-card-slim"])
    // setTimeout(() => {
    //   this.log("system", "[system]: And welcome, new user.", "transient", "message-card-slim")
    //   if ((await eventhandler.acquireExpectedDispatch("userSystemInteraction", 2000000000)) !== "continue") return
    //   eventHandler.onReceipt("breakSystemInit", (()=>{this.breakInit = true}))
    //   [["you may see tiles which look like this...", "system-message-card-route-pending message-card-slim"], ["or this...", ""]].forEach((logPair, index) => {
    //     setInterval(() => {
    //       if (this.breakInit) return
    //       this.log("system", `[system]: ${logPair[0]}`, "transient", logPair[1])
    //     }, 1000*index);
    //     return 
    //   })
    // }, 1000);
  }
  async makeCache(ID, members) {
    if (this.chatCache[ID]) return
    this.chatCache[ID] = {
      members,
      isActive : true,
      exchange : []
    }
  }
  async refresh() {
    this.loadCache(this.activeChat)
  }
  async loadCache(ID) {
    if (this.chatCache[ID] && this.panel.activePane===this.pane) {
      this.messageSequenceContainer.innerHTML = this.chatCache[ID].exchange.reduce((previous, message, index) => {
        return this.formatMessageCard(message, index, this.chatCache[ID]) + previous
      }, "")
      Array.from(document.querySelectorAll(".colorDot")).forEach((element) => {element.style.removeProperty("position"); element.style.removeProperty("visibility")})
    }
    if (this.isInteractive) {
      if (!(this.chatCache[ID].isActive)) {
        document.querySelector(".sendbutton").style.setProperty("pointer-events", "none")
        document.querySelector(".sendbutton").style.setProperty("filter", "brightness(330%)")
      } else {
        document.querySelector(".sendbutton").style.removeProperty("pointer-events")
        document.querySelector(".sendbutton").style.removeProperty("filter")
      }
    }
    document.querySelector(".chattingwithheader").innerHTML = `Chatting with ${this.getRenderableID(ID)}:`
    this.activeChat = ID
  }
  getRenderableID(ID) {
    if (ID==="system") return "System"
    if (!CONFIG.UI.renderUnfamiliarPublicAliases) {
      return ID
    }
    return hiddenAliasLookup[ID] ?? ID
  }
  async log(ID, data, polarity, tags=[], adhoc="") {
    const date = (new Date()).toUTCString()
    data = (ID==="system"&&polarity==="transient") ? "[system]: " + data : data
    var index = this.chatCache[ID].exchange.push({
      data,
      polarity,
      tags,
      date,
      adhoc
    }) - 1
    if (!this.isInteractive&&this.panel.activePane!==this.pane) {
      switch (tags.filter((tag) => {return tag.indexOf("system-message-card-") === 0}).map((tag) => tag.slice(20))[0]) {
        case "route-pending":
          document.querySelector("#pending-dot").style.cssText = "visibility: visible; position: relative;"
          break
        case "success":
          document.querySelector("#success-dot").style.cssText = "visibility: visible; position: relative;"
          break
        case "error":
          document.querySelector("#error-dot").style.cssText = "visibility: visible; position: relative;"
          break
      }
    }
    if (this.panel.activePane===this.pane&&this.activeChat===ID) {
      this.messageSequenceContainer.innerHTML = this.formatMessageCard(this.chatCache[ID].exchange[index], index, this.chatCache[ID]) + this.messageSequenceContainer.innerHTML
    }
  }
  async unLog(ID, index) {
    if (!this.chatCache[ID]) return
    this.chatCache[ID].exchange.splice(index, 1)
    this.optionalLoad(ID)
  }
  async optionalLoad(ID) {
    if (this.activeChat===ID) this.loadCache(ID)
  }
  formatMessageCard(renderPackage, index, cache, adhoc) {
    console.log(renderPackage.tags)
    if (renderPackage.tags.includes("system-message-card-route-pending")) {
      return this.formatConfirmationCard(renderPackage, index, cache, renderPackage.adhoc)
    }
    const card = `<div class="${renderPackage.tags.join(" ")} message-card message-card-${renderPackage.polarity}">
    <i class="icon post-kebab kebab fa-solid fa-ellipsis-vertical" onclick="postcontext.click(event)" data-index="${index}" data-content="${renderPackage.data}" data-sender="${cache.members[renderPackage.polarity]}"></i>
    <p class="card-text">${renderPackage.data}</p>\n
    <p class="date">${getRenderableDate(renderPackage.date)}</p>
    </div>`
    if (renderPackage.tags.includes("message-card-unread")) {
      renderPackage.tags.splice(renderPackage.tags.indexOf("message-card-unread"), 1)
    }
    return card
  }
  formatConfirmationCard(renderPackage, index, cache, adhoc) {
    const card = `<div class="${renderPackage.tags.join(" ")} message-card message-card-${renderPackage.polarity}">
    <p class="card-text">${renderPackage.data}</p>\n
    <div class="routePendingButtonContainer">
    <button class="routePendingButton routeAcceptButton" onclick="eventHandler.dispatch('authenticationAuthorized|${adhoc}'); eventStream.replaceAttribute('system', ${index}, 'system-message-card-route-pending', 'system-message-card-success'); eventStream.dontAlert.push('${adhoc}')">Accept</button>
    <button class="routePendingButton routeRejectButton" onclick="eventHandler.forceReject('authenticationAuthorized|${adhoc}'); eventStream.replaceAttribute('system', ${index}, 'system-message-card-route-pending', 'system-message-card-error')">Reject</button>
    </div>
    <p class="date">${getRenderableDate(renderPackage.date)}</p>
    </div>`
    return card
  }
  async replaceAttribute(ID, cardID, initialAttribute, newAttribute) {
    this.chatCache[ID].exchange[cardID].tags.push(newAttribute)
    this.deleteAttribute(ID, cardID, initialAttribute)
  }
  async deleteAttribute(ID, cardID, attribute) {
    if (this.chatCache[ID].exchange[cardID].tags.includes(attribute)) {
      this.chatCache[ID].exchange[cardID].tags.splice(this.chatCache[ID].exchange[cardID].tags.indexOf(attribute), 1)
    }
    this.optionalLoad(ID)
  }
  async addAndLoadPeerStream(peerID) {
    await this.makeCache(peerID, {transient : "system", local : "Me", remote : peerID})
    this.optionalLoad(peerID)
    this.log(peerID, "Peer session successfully authenticated", "transient", ["align-center", "system-message-card-success", "message-card-slim"])
  }
  async downloadContent(ID) {
    const raw = this.chatCache[ID].exchange.reduce((sum, component) => {
      return sum + `${(this.getRenderableID(this.chatCache[ID].members[component.polarity]))} (${component.polarity}): ${component.data}\n`
    }, "")
    var downloadAnchor = document.createElement("a")
    downloadAnchor.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(raw);
    downloadAnchor.target = "_blank"
    downloadAnchor.download = `${ID}-conversation.txt`
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    document.body.removeChild(downloadAnchor)
  }
}

class standardContextMenu {
  constructor(id, parentID) {
    this.parentID = parentID ? `#${parentID}` : "document";
    this.container = document.querySelector(this.parentID);
    this.eventhandler = new eventHandlingMechanism();
    this.active = false;
    this.id = id;
    console.log(document.querySelector(`#${this.id}`))
    this.menu = document.querySelector(`#${this.id}`);
  }
   async raceDismissEvents () {
    const triggerFunctions = {
      windowResizeEvent : async function () {
        this.eventhandler.dispatch("windowResize");
      }.bind(this),
      clickContextEvent : async function () {
        this.eventhandler.dispatch("contextButtonClicked");
      }.bind(this),
      clickDocumentEvent : async function (e) {
        if (e.clientY < this.menu.getBoundingClientRect().top || e.clientY > this.menu.getBoundingClientRect().bottom || e.clientX > this.menu.getBoundingClientRect().right || e.clientX < this.menu.getBoundingClientRect().left) {
          this.eventhandler.dispatch("nonContextClick");
        }
      }.bind(this)
    }
    window.onresize = triggerFunctions.windowResizeEvent;
    this.menu.onmouseup = triggerFunctions.clickContextEvent;
    window.onmousedown = triggerFunctions.clickDocumentEvent;
    const promiseConsequence = (_) => {
      this.menu.style.visibility = "hidden";
      this.eventhandler.flushExpectedDispatches();
      window.removeEventListener("resize", triggerFunctions.windowResizeEvent);
      this.menu.removeEventListener("mouseup", triggerFunctions.clickContextEvent);
      window.removeEventListener("mousedown", triggerFunctions.clickContextEvent);
    };
    Promise.race(["windowResize", "contextButtonClicked", "nonContextClick"].map((listener) => this.eventhandler.acquireExpectedDispatch(listener, 6000000))).then(promiseConsequence, promiseConsequence);
  };
  click (event) {
    ["data-reference", "data-index", "data-content", "data-sender"].forEach((propery) =>
      this.menu.setAttribute(propery, event.target.getAttribute(propery))
    );
    this.menu.style.visibility = "visible";
    this.menu.style.top = `${
      event.target.getBoundingClientRect().top +
      this.container.scrollTop -
      this.container.offsetTop
    }px`;
    this.menu.style.right = `${
      this.container.getBoundingClientRect().right -
      event.target.getBoundingClientRect().left
    }px`;
    this.raceDismissEvents();
  };
}

class connectionsPanel {
  constructor() {
    this.container = document.querySelector("#connectedNodeCardContainer");
  }
  formatConnectionCard (label) {
    return `<div class="connectedNodeCard" onclick="((event) => {if (event.target!==event.currentTarget&&event.target!==event.currentTarget.firstChild) return; rightPanel.rotateIn('messageFeedPane'); fusedStream.loadCache('${label}')})(event)"><p class="nodeCardText">@${CONFIG.UI.renderUnfamiliarPublicAliases ? hiddenAliasLookup[label] : label}</p><i class="icon kebab connection-kebab fa-solid fa-ellipsis-vertical" onclick="connectioncardcontext.click(event)" data-index="" data-reference="${label}" tabindex=0></i></div>`;
  };
  renderConnectionCards () {
    this.container.innerHTML = "";
    authPeers.forEach((connection) => {
      if (!connection) return
      this.container.innerHTML = this.formatConnectionCard(connection) + this.container.innerHTML;
    });
  };
}

async function hiddenAliasPromptMenu() {
  var flashLock
  document.querySelector("#aliasEntryField").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      document.querySelector("#aliasEntryButton").focus()
      return
    }
    if (!event.key.match(/^[a-z0-9 ]+$/i)) {
      flashLock = +new Date()
      event.preventDefault()
      event.target.parentElement.style.setProperty("border-color", "#BB4141", "important")
    }
    if (event.target.value.length>=32) {
      flashLock = +new Date()
      event.target.parentElement.style.setProperty("border-color", "#BB4141", "important")
    }
  })
  document.querySelector("#aliasEntryField").addEventListener("paste", (event) => {
    if (!(event.clipboardData || window.clipboardData).getData('text').match(/^[a-z0-9 ]+$/i)) {
      flashLock = +new Date()
      event.preventDefault()
      event.target.parentElement.style.setProperty("border-color", "#BB4141", "important")
    }
    if (event.target.value.length+(event.clipboardData || window.clipboardData).getData('text').length>32) {
      flashLock = +new Date()
      event.target.parentElement.style.setProperty("border-color", "#BB4141", "important")
    }
  })
  var flashInterval = setInterval(() => {
    if ((+new Date() - flashLock) >= 700) document.querySelector(".aliasEntryArea").style.removeProperty("border-color")
  }, 15);
  document.querySelector("#aliasEntryWrapper").style.visibility = "visible"
  var deisredAlias = (await eventHandler.acquireExpectedDispatch("hiddenAliasDelivered", 100000000)).externalDetail
  document.querySelector("#aliasEntryWrapper").style.visibility = "hidden"
  clearInterval(flashInterval)
  return deisredAlias
}

function getRenderableDate(UTCString) {
  const localTime = new Date(UTCString).toString().split(" ");
  if ( JSON.stringify(localTime.slice(1, 3)) == JSON.stringify(new Date().toString().split(" ").slice(1, 3)) ) {
    if (parseInt(localTime[4].split(":")[0]) >= 12 && parseInt(localTime[4].split(":")[0]) != 24) {
      return `${(parseInt(localTime[4].split(":")[0]) - 12) == 0 ? 12 : parseInt(localTime[4].split(":")[0]) - 12}:${ localTime[4].split(":")[1] } p.m. Today`;
    }
    const amHours = parseInt(localTime[4].split(":")[0])==0 ? 12 : parseInt(localTime[4].split(":")[0]) ;
    return `${amHours}:${localTime[4].split(":")[1]} a.m. Today`;
  } else if (new Date().toString().split(" ")[3] == localTime[3]) {
    return `${localTime[0]}, ${localTime[1]} ${localTime[2]}`;
  } else {
    return `${localTime[0]}, ${localTime[1]} ${localTime[2]}, ${localTime[3]}`;
  }
};

class settingsManager {
  constructor() {
    this.panel = rightPanel;
    this.pane = document.querySelector("#configpane");
  }
}

async function toggleDescription(event) {
  console.log(event.target.parentNode.childNodes)
  var explanation = Array.from(event.target.parentNode.childNodes).filter((element) => {if (!element.matches) return false; return element.matches(".configTextDescription")})[0]
  if (explanation.style.visibility == "visible") {
    explanation.style.removeProperty("visibility");
    explanation.style.removeProperty("position");
  } else {
    explanation.style.setProperty("visibility", "visible");
    explanation.style.setProperty("position", "relative");
  }
}

async function exportToLS(reference, value) {
  console.log(reference, value)
  if (!window.localStorage.config) window.localStorage.config = "{}"
  var tempConfig = JSON.parse(window.localStorage.config)
  tempConfig[reference] = value
  window.localStorage.config = JSON.stringify(tempConfig)
}

async function writeSetting(reference, value) {
  if (reference==="UI.renderUnfamiliarPublicAliases") {
    var field = document.querySelector("#searchEntryField")
    field.disabled = !value
    if (value) {
      field.placeholder="Search for an active node"
    }
    else {
      field.placeholder="Cannot search, public aliases are disabled"
    }
  }
  if (reference==="communication.arbitraryPeerRouteTimeout") {
    eventHandler.dispatch("arbitraryPeerRouteTimeoutUpdated")
  }
  console.log(reference)
  await exportToLS(reference, value)
  if (Object.keys(CONFIG)=="") return
  reference.split(".").reduce((sum, prop, index) => {return (reference.split(".").length === (index+1) ? sum : sum[prop])}, CONFIG)[reference.split(".").slice(-1)] = value
}

async function fillDefaults(shortCircuit) {
  var set = Array.from(document.querySelectorAll("[data-objective]"))
  var subset = shortCircuit ? set : set.filter(element => {return !Object.keys(JSON.parse(localStorage.config ?? "{}")).includes(element.dataset.objective)})
  console.log(set, subset)
  Array.from(document.querySelectorAll(".configCardBool .settingsToggle")).filter(element => subset.includes(element)).forEach((element, index) => {
    element.checked = [false, false, true, true][index]
    writeSetting(element.dataset.objective, index===1 ? !element.checked : element.checked)
  })
  Array.from(document.querySelectorAll(".configCardInt .integerEntryField")).filter(element => subset.includes(element)).forEach((element, index) => {
    element.value = [10000, 100000000][index]
    console.log(element.value, index)
    writeSetting(element.dataset.objective, element.value)
  })
}