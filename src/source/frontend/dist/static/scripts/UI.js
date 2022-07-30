//load saved LS in visual config on load

window.addEventListener("DOMContentLoaded", async function () {
  document.querySelector("#searchEntryField").value = "";
  document.querySelector("#chatEntryField").style.height = document.querySelector("#chatEntryField").scrollHeight
  document.querySelector("#chatEntryField").scrollTop = document.querySelector("#chatEntryField").style.scrollHeight
  fusedStream = new FusedStream("messageFeedPane", "#messageSequence");
  fusedStream.chatInit()
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
    this.tutorialSpawnable = false
    this.tutorialWatcher = () => {
      eventHandler.acquireExpectedDispatch("messageSubmit", 200000000).then(this.tutorialLoader, this.tutorialWatcher)
    }
    this.tutorialLoader = (value) => {
      this.tutorialWatcher()
      if (!(this.tutorialSpawnable && this.activeChat=="system" && (value.externalDetail.toLowerCase()=="yes" || value.externalDetail.toLowerCase()=="tutorial"))) {
        return
      } else {
        this.tutorial()
      }
    }
  }
  async chatInit() {
    if (!JSON.parse(localStorage.config ?? "{}")["communication.hiddenAlias"]) {
      this.makeCache("system", {transient : "System", local : "Me"}, true)
      this.loadCache("system")
      this.loadDefaultWelcomeSequence()
    }
  }
  async streamInit() {
    this.makeCache("system", {transient : "System"}, true)
    this.loadCache("system")
  }
  async loadDefaultWelcomeSequence() {
    if (!effectiveFirstVisit) return
    this.tutorialSpawnable = true
    this.log("system", `Welcome to Membranexus.com, ${CONFIG.communication.publicAlias}!`, "transient", ["message-card-slim"])
    setTimeout(() => {
      this.log("system", `I'd love to give you a few tips on using this site, if you like.<br><br><i>Type and send "yes" at any time to begin the tutorial.</i>`, "transient", ["message-card-slim"])
    }, 1000);
    this.tutorialWatcher()
    eventHandler.onReceipt("messageSubmit", (_sig, externalDetail) => {
      if (this.activeChat=="system" && externalDetail.toLowerCase()=="stop") {
        eventHandler.dispatch("tutorialHalt")
      }
    })
  }
  async tutorial() {
    this.tutorialSpawnable = false
    var messageInterval = 4000
    var messageSets = [
      [`Great, with your cleverness and my teaching, I know you'll be a pro at this site in no time.`, []],
      [`But first of all, <i>why</i> is this site?`, []],
      [`Well, it's just one small, demonstrative piece of the jigsaw surrounding the Membrane project.`, []],
      [`I would never bore you with the details, but it is the very beating heart of this site.`, []],
      [`It allows high-speed, robust data transfer networks with little need for a server`, []],
      [`Which is where this site comes in.`, []],
      [`You see that graph in the middle of your screen?.`, []],
      [`That's every other person on this site right now.`, []],
      [`You're connected to them all, directly or indirectly.`, []],
      [`And you could talk to any one of them, just like you and I are right now`, []],
      [`At the press of the button, with no clunky server to slow you down.`, []],
      [`Oh, and don't worry about security, all of your messages are strongly end-to-end encrypted`, []],
      [`Just watch out; with no server to patrol for fakes and phonies`, []],
      [`You can never know who you're <i>actually</i> talking to.`, []],
      [`Now, on to more interesting things:`, []],
      [`Actually using the app.`, []],
      [`If you look at the graph again, you'll see one veeery big dot.`, []],
      [`That's just the initial signalling server. Don't worry about him.`, []],
      [`However, if you look a bit closer, you may also see one slightly smaller, medium dot.`, []],
      [`If you don't, don't worry. That just means you're all alone on the network right now`, []],
      [`So there's no need to show you, or who you're connected to.`, []],
      [`If you wait around a little longer, someone may come online for you to talk to.`, []],
      [`And your dot will finally appear.`, []],
      [`At any rate, this dot is you.`, []],
      [`There should be other, smaller dots, too.`, []],
      [`These are your new friends.`, []],
      [`Some of them will have lines connecting them to you.`, []],
      [`Don't worry, that just means you'll have a much harder time accidentally falling off the face of the network.`, []],
      [`However, if you wish to <i>Authenticate</i> someone,`, []],
      [`That is, become able to directly message them...`, []],
      [`There are two ways you can do it.`, []],
      [`You can either (a: right-click on their dot and select "Establish Authenticated Connection"`, []],
      [`Or, (b: if you want to be super-cool, click the dot normally while holding the "Alt" key.`, []],
      [`Either way, if they accept your request,`, []],
      [`And this can take a long time, if they're not actively using the site,`, []],
      [`You'll see their "name" appear in that bottom left corner.`, []],
      [`You'll also see a green dot pop up beside your "Notifications" button.`, []],
      [`This means you have a new notification.`, []],
      [`If they reject, it'll be a red dot and no new friend.`, []],
      [`:(`, []],
      [`Aaaaannnnyhowwww,`, []],
      [`Once you get a new pal,`, []],
      [`You can either click on their network dot,`, []],
      [`Or else on their name-tile,`, []],
      [`To open up a chat with them. From here, it's pretty straightforward to send a message.`, []],
      [`But about notifications again.`, []],
      [`You've met dots red and green, but what about blue?`, []],
      [`If you see this, it means that <i>somebody else</i> wants to chat with <i>you</i>.`, []],
      [`Just click on the notifications button to see their request.`, []],
      [`Here, you can click either "accept" or "reject`, []],
      [`But never. Ever. Reject.`, []],
      [`Because it's real mean.`, []],
      [`Oh! I almost forgot.`, []],
      [`You can configure this app to your heart's desire.`, []],
      [`Just press the "Configuration" button in your menu.`, []],
      [`The options will tell you what they do.`, []],
      [`So I shouldn't need to.`, []],
      [`...`, []],
      [`And would you look at that.`, []],
      [`What did I say>`, []],
      [`Are you a pro at this site or what?`, []],
      [`And so it looks like it's time for me to take my leave.`, []],
      [`Adieu, my lovely new friend.`, []],
      [`Thanks so much for talking with me.`, []],
      [`Maybe we will again some day.`, []],
      [`<i>Tutorial completed</i><br>To return to this page at a later time, simply double-click the "Messages" button in your side-menu. To replay this tutorial, simply send the word "tutorial" to this chat.`, []],
      [`Also, for a more <i>adequate</i> review of the underlying membrane mechanism, take a look at the project's <a href="https://github.com/Elijah-Bodden/Membrane" style="color: #000; text-decoration: underline;">documentation</a>`, []],
    ]
    eventHandler.acquireExpectedDispatch("tutorialHalt", 200000000).then(() => {
      this.tutorialSpawnable = true
      setTimeout(() => {
        this.log("system", `Okay. Goodbye and thank you so much for chatting with me, I had a great time. If you ever want to talk again, just send me a message saying "tutorial." I'll know what you mean. Also, you can press the "messages" button twice any time and it'll take you here.`, "transient", ["message-card-slim"])
      }, 1000);
    }, () => {})
    for (let i of messageSets) {
      try {
        await eventHandler.acquireExpectedDispatch("neverDispatch", messageInterval)
      } catch {
        if (this.tutorialSpawnable) return
        this.log("system", i[0], "transient", [...i[1], "message-card-slim"])
        continue
      }
    }
    eventHandler.forceReject("messageSubmit")
    this.tutorialSpawnable = true
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
  await exportToLS(reference, value)
  if (Object.keys(CONFIG)=="") return
  reference.split(".").reduce((sum, prop, index) => {return (reference.split(".").length === (index+1) ? sum : sum[prop])}, CONFIG)[reference.split(".").slice(-1)] = value
}

async function fillDefaults(shortCircuit) {
  var set = Array.from(document.querySelectorAll("[data-objective]"))
  var subset = shortCircuit ? set : set.filter(element => {return !Object.keys(JSON.parse(localStorage.config ?? "{}")).includes(element.dataset.objective)})
  Array.from(document.querySelectorAll(".configCardBool .settingsToggle")).filter(element => subset.includes(element)).forEach((element, index) => {
    element.checked = [false, false, true, true][index]
    writeSetting(element.dataset.objective, index===1 ? !element.checked : element.checked)
  })
  Array.from(document.querySelectorAll(".configCardInt .integerEntryField")).filter(element => subset.includes(element)).forEach((element, index) => {
    element.value = [10000, 100000000][index]
    writeSetting(element.dataset.objective, element.value)
  })
}