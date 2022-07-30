![Membrane](./Assets/Membrane-banner.svg)</br>
![](https://api.codiga.io/project/33828/score/svg)
![](https://img.shields.io/github/license/Elijah-Bodden/membrane?color=blue&label=License)
![](https://img.shields.io/github/languages/code-size/Elijah-Bodden/membrane?color=%20%23d0a011%20&label=Raw%20Code%20Size)
[![](https://img.shields.io/website?down_color=%23D0342C&down_message=Offline&label=Website%20Status&up_color=%23e8daef&up_message=Operational&url=https%3A%2F%2Fmembranexus.com)](https://membranexus.com)
</br>
A robust, minimal-server-interaction API for peer routing in the browser

[`RTCDataChannel.prototype.standardSend`](https://github.com/Elijah-Bodden/Membrane#rtcdatachannelprototypestandardsend)

## What  is this?
The official Membrane project, that is, `./lib/index.js`, capitalizes upon the `RTCPeerConnection` API's inherent agnosticism regarding signaling. That you could just as well communicate `ICE` connectivity data through smoke signals or quantum teleportation (*if only*), as through a more conventional signalling server. That's profound; *we aren't constrained to this terribly unreliable, centralized approach*. Membrane creates unencumbered, living peer networks. Just one server-based signal opens access to an entire realm of peers, composing a single, behemoth router. Distant, unconnected members can exchange arbitrary data in miliseconds, with no cumbersome, slow intermediary server, nor any risk of downtime.

However, this approach is far from perfect. The great boon of decentralization may in fact be this project's worst enemy. Without a singular, trusted register to authenticate peers, spoofing, posing, and generally manipulating the structure of the network become elementary. 

Though plan on soon implementing a direct, key-derivation-based codeword authentication system, even this will prove far too flimsy for trustworthy, hyper-secure exchange.

In brief, this tool is robustly functional at enabling anonymous, homogeneous, untrusted data exchange across a network, but very poor at most else.

## Documentation
Here I have compiled a set of hopefully-only-slightly-pedantic descriptions for `lib`'s key functionalities. Additionally, it is advised you have a general understanding of the WebRTC API, as it is used heavily throughout this project.
- ### Aliases
    Aliases are one of the most fundamental properties of this library, defining the unique identities of peers, both formally, in the form of `hiddenAliases` and informally, to users, in the form of `publicAliases`. `hiddenAliases` are primarily used in internal transactions and routing between peers, whereas `publicAliases` are merely a cosmetic abstraction only ever seen by users. The two are correlated by the global-scope objects `hiddenAliasLookup` for finding corresponding `publicAliases` and `publicAliasLookup` for the converse.
- ### Config
  - #### Loading custom configurations:
    All global preferences are loaded into the `CONFIG` object at initialization, with the contents of `defaultConfig` acting as template, which its own `constants.configLoadFunction` extends with a set of values to substitute, formatted as follows:
    ```
    {
        rootType.subtype.(...).preferenceName : value
        ...
    }
    ```
    This function is run every time the script is initialized, invoked by `loadConfig`, and may be left undefined or simply return `{}` to use the exact `defaultConfig`. If a provided path has not been pre-defined by `defaultConfig`, its value is discarded.
  - #### communication.packageArgs 
    An array of arguments which must/may be included in packages sent over `RTCDataChannel.prototype.standardSend`<!---->. This is used in determining the validity of packages received from peers. Each entry is structured as `{ required : [...], optional: [...] }`. Optional is left open-ended by default, and may be constrained to only the arguments specified, so that anything else causes throws an error by including the value "`!*`."
  - #### communication.routeAcceptHeuristic
    A discriminator which determines whether or not to allow a peer to connect to the client, provided a single argument, `routePackage`--the initial request minus the `type` header. If this function is `async` it will be `await`ed  by default, allowing asynchronous user interaction. This function returns a boolean value, representing whether or not a route should be established.
- ### Prototype overrides
    This script extends exactly two prototypes, in both cases to add a specific formatting micro-protocol, and both times with unusual, unambiguous names in order to prevent potential future conflicts. **Note**: delineated server reactions are specific to the signaling server provided in `/src/server` but can certainly differ, or even be cut altogether to reduce server-node interaction, in a custom server implementation.
    - #### WebSocket.prototype.crudeSend
        This function accepts a mandatory first argument, `type`, and an optional second `typeArgs`--an object containing data relevant to the specific type. This data is then bundled appropriately and sent to the server. The function allows for the following types:
        - heartbeat - Generates an empty message to indicate a node is still living, as websocket does not implement any ping-pong functionality natively.
        - reportNode - Indicates that a particular node provided an invalid SDP package to a node newly requesting entry. The server will increase this node's routing weight (making it less probable it will route to it again), and provide a new route to the caller. If the node receives invalid data three times in a row, it will throw a fatal error and cease attempting.
        - returnSDP - Returns generaed SDP in response to a request from the server.
        - ignoreSDPRequest - Like reportNode but for when a node is asked to provide an answer to a new entry's request; if the seed SDP provided is invalid, a node will call this. The server will modestly penalize the node reporting the error, and send an `["ERROR"]` package to the initial requester.
    - #### RTCDatachannel.prototype.standardSend
      Simmilarly to crudeSend, this function accepts either one or two arguments. However, no checks are performed to ensure packages conform to formatting standards, and therefore must be done before calling this function. For a full list of possible inputs, see [CONFIG.communication.packageArgs](https://github.com/Elijah-Bodden/Membrane#communicationpackageargs).
- ### EventHandlingMechanism
  This class is instantiated globally under the variable name `eventHandler` within the project; see its section in [Utilities](https://github.com/Elijah-Bodden/Membrane#eventhandlingmechanism) for more information
- ### AbstractMap
  Once again, see the [relevant section](https://github.com/Elijah-Bodden/Membrane#abstractmap) of Utilities for a more complete treatment of the matter. The version in `lib` differs from the utility only insofar as it also contains efficient `exportList` and `importList` methods. Export values are stored compactly inside of the `export` variable once generated. The property `exportRefreshed` conveys whether the current value of `export` accurately represents the map. The higher-level `optionalExport` method will `exportList` if and only if `exportRefreshed` is false. This class is globally instantiated as `networkMap`; this is used to find the most efficient peer routes across the network. Taking `Object.keys(networkMap.nodes)` or `Object.keys(networkMap.adjacencyList)` will render a list of all nodes within the current network.
- ### PeerConnection
  The `peerConnection` class acts as a high-level wrapper for the RTCDataChannel and RTCPeerConnection APIs, facilitating abstract interaction between nodes, such as routing, and "authenication<!---->". Every connection made within this module is represented as an instance of this wrapper.
  #### SDP Exchange
  - #### PeerConnection.prototype.makeOffer
     To be called on a newly-instantiated channel; acts as a synchronous `createOffer` ICE candidate aggregator, eventually providing an SDP package appropriate to the peer's `transport.connection` and ready for exchange.
  - #### PeerConnection.prototype.receiveOffer
    Accepts a package of SDP generated by another peer's `makeOffer`, simmilarly aggregating the candidates generated by RTCPeerConnection's `createAnswer`, returning the total answer.
  - #### PeerConnection.prototype.receiveAnswer
    Accepts the answer generated by `peerConnection.prototype.receiveOffer` and commits it to the peerConnection, completing the SDP cycle and readying the connections for data exchange.
    ____ 
  - #### makeDefiniteRoute
    Accepts the hiddenAlias of an existing node within the network map and a level of `desiredPermissions`. Instantiates a new `peerConnection`, generates an offer through `makeOffer`, bundles this up into an appropriate package, and sends it via `detatchedRoute`<!----> to the nearest intermediary in the route to `destination`. The function then awaits one of three outcomes--`routeAccepted`, `routeRejected`, or `routeInaccessible`, and responds accordingly, either preparing the channel for data transfer or killing it and alerting the user.
  - #### comprehendProspectiveRoute
    Accepts a complete routing package, minus the `type` header, instantiates a new peer, attempts to use the SDP contained within the package, and, assuming this action has been successful, uses `CONFIG.communication.routeAcceptHeuristic`<!----> on the package to determine whether or not to persist the connection and formulate a response or to terminate the initialization protocol and destroy the peer.
  - #### handleMessage
    The central drain through which all packages recieved by the peer are aggregated; the code is quite exceptionally straightforward, but would be downright tedious to display here given its length. For a precise overview of the ways messages are handled, see <!--handleMessage code-->.
  - #### weaklyValidateMessage
    Returns a boolean representing whether or not a message conform to the standards outlined by `CONFIG.constants.packageArgs`<!---->.
  - #### initializationMethods
    Contains the two neccessary components of a proper symmetric peer handshake, namely: 
    - `invokerIntroduction` - Used on the package type of the same name, provided by the `voluntary` peer (the one which initially "requested" the route,) this method applies several essential data proivded by the first peer, and eventually bundles up its own `reciprocalAlignment` package for this peer, containing a copy of the current networkMap, if the peer claims to need one, and its own aliases.
    - `reciprocalAlignment` - Used simmilarly; accepts and parses the aliases (and possibly networkmap) provided by its peer, eventually adding it to livePeers and completing the exchange sequence.
  - #### close
    Forcefully closes a peer, removing it from enrolled registers and ledgers and alerting the network of the death through the `GossipTransport`<!---->.
  - #### stabilizeLink
    Called while a given node has less than two live peers. The peer will enter a loop of vigorously searching for a stable contact, preferably one as distant from it as possible, in order to reinforce the network. The sequence will halt only when no feasible, unconnected peers remain, or else the peer successfully adds another connection.
- ### Floundering
  If a peer ever becomes fully disconnected from the network, it will begin the violent `flounder` procedure, wiping its networkMap and performing a `serverHardRestart`, thus flailing around aimlessly until it is finally reentered into the network.
- ### GossipTransports
  The `GossipTransport` keeps all (contiguous) nodes synchronized and prevents total descent of the network into chaos. Gossip is the lifeblood of the network, constantly surging through the interstices, alerting the network of every slight reconfiguration. In the current implementation, `gossipTransport` (the global instantiation of `GossipTransport`) communicates two kinds of change: networkMap weight (calculated off of the routing penalties found within `CONFIG.constants.violationWeightPenalties` and typically assigned through the `shiftNodeWeight` function), and topological reconfiguration, i.e. node or edge addition or deletion. The flow of gossip is regulated by the instance's `propagationPulse`. The function defined over this interval determines exactly which kinds of gossip to commit every round. It decides this by looking at each defined `type`'s `iterModulo`; if `this.pulseIterations` (which is incremented each pulse) % `iterModulo` equals zero, that type's name will be pushed to the `propagationStack`. From here, all buffered items of gossip are aggregated into single per-type bundles and distributed throughout the network via `propogateAll` <!---->.
  - #### Types
    Every gossip transport has zero or more `types`, stored within `this.types`, and registered through the `addType` method. Types allow distinct, seggregated ledgers which store gossip intended for unique purposes, allowing more fine-grained control over data distribution. Within the default Membrane, two different types are registered to `gossipTransport`: `topology` and `weight`. The former is registered with only one parameter, defaulting it to dispatch every propagation pulse. The second is also given an `iterModulo` of 100, so that it propagates once every hundred runs, or every ten seconds. Assuming a type is added successfully, `addType` will return a set of "trigger functions"--an object with two properties `addGossip`, and `remove`. `addGossip` accepts precisely one argument, the piece of data to be propagated, which will be pushed to that type's buffer and eventually dispatched. True to its name, `remove` immediately and irrevocably destroys the the type and all associated values.
  - #### Parsers
    Parsers are the perfect complements to types. As such, they are absolutely useless unless at least one member of the network has registered and actively dispatches from the corresponding type. Parsers are called over gossip both on directly adding it through `addGossip` and on recieving it through `consumeGossip`. If no parser has been defined for a recieved type, a `default` parser is used. Thos allows the gossip to continue propagation, the data has no direct interface with the node. The `addParser` function is relatively extensible, allowing fine-grained on-the-fly registry; however, because of this, it is also unusually convoluted. It only strictly requires the `type` argument, the type of gossip to apply to. However, a parser registered in this fashion is perfectly inert, less useful than even `default`. If the optional `useDefault` argument is truthy, the parser will first apply the `default` parser to the data before before later passing it to the optional `parserCallback`, if it exists. If defined, `parserCallback` is provided the entire `block`. If `useDefault` is set to true, the callback will recieve two more items, `unknown` and `committable`. The former contains complete copies of every component of the block containing data not held in "`knownFacts`"; the latter is merely a copy of `unknown` with all non-`constantArgs` stripped out of each component. The optional array value `constantArgs` specifies which pieces of data are relevant to the actual fact conveyed, so that the parser can decide whether or not it already "knows" about a particular convolution, and therefore should not gossip about it (this is helpful for packages containing variable, nonessential metadata which we would like to ignore). If this argument is ommitted, the value defaults to the `Object.keys` of the first member of the `block`. Finally, the `preliminaryVerification`, only ever used if `useDefault` is set to true, acts as an individual discriminator function, run over every member of `block`. If a given item fails, it is withheld from the buffer and entirely forgotten.
  - #### `propagateAll`
    The `propagateAll` function propagates every item of a specific type of gossip simultaneously, bundling them all up into contiguous packages. If the total size of the type's block exceeds 16 KiB, it will be split into several, equally-sized packages in order to preserve transfer speed (this issue seem particularly prevalent within the SpiderMonkey engine). After having distributed the complete block to each live peer, the type's buffer will be wiped completely clean.
- ### detatchedRoute
  This function attempts to `findNextHop` to the provided `destination` parameter. Assuming a route exists between the initiator and the destination, a package will be "standardSent" to the computed nearest intermediary using the `rest` of the parameters.
- ### makeServerLink
  <!-- have not revised -->
  This function is required to initialize network activities. Effectively, it instantiates a new, unbound peer and immediately calls makeOffer on it, eventually bundling the product of this function into a stringified, Base-64-ed version and inserting it into `CONFIG.serverLink.initBindURL` at the position of the (required) asterisk. By design, this should be inserted as a query parameter. The server will then forward this to the lowest-weighted peer connected to it, which will in turn ingest the data via `receiveOffer` and return it through `crudeSend`, to finally be consumed by the initial peer, as per the standard signaling protocol. This method additionally defines exactly how these "helper" peers are to act and how to perform server reconnects, which allow nodes to reconnect to the server and begin acting as helpers immediately after they regain connectivity to it, without needing perform a full signaled initial connect. This function ultimately returns the serverHardRestart function, which allows us to fully re-initialize.
- ### init
  In order to begin network interaction, the `init` function must be called. Its purpose is multi-fold, distilled by the following sequence. I pay particular attention to these elementary actions as this is the only function which __must__ be run top-level. After this, the network becomes self-sustaining.
  1. Config is loaded
  3. `serverLink` is generated through `makeServerLink`
  4. `gossipTransport` is instantiated and given the the types "topology" and "weight"
  5. A parser is added for topology. It is only able to track link, as opposed to node events; however, because these events imply the nodular structure so heavily, they infer both from these.
  6. A simple parser is added for weight. Alongside the standard `alias` and `weightModification`, each item must also include an `occurenceID` in order to differentiate between unique adjustments of the same kind, on the same node.
  <!-- List terminator -->
  After this sequence has successfully completed, the network will act with complete autonomy in stabilizing and routing, so that only explicit actions, such as `negotiateAgnosticAuthConnection` need to be taken.
- ### Status trackers
  This project tracks connection status centrally in two ways--`livePeers` and `authPeers`. Each is modified through the appropriate `add` or `remove` method (i.e. `addAuthPeer` and `removeAuthPeer`), and may be watched for changes with a callback via an `onXUpdated` method (i.e `onAuthPeersUpdated`). Livepeers comprises a list of all directly-connected peers, with new peers automatically appended following successful initialization exchanges, and peers on death or explicit termination. AuthPeers is a softer abstraction on this, containing the hiddenAliases, rather than actual references, of all peers which have `advanced` <!---->send permissions.
- ### Authentication
  Authentication is essential to the this project's function. Within the scope of peerConnections, the term is taken in a slightly different sense from the standard cybersecurity definition. Here, if a peer is authenticated to another, this means it will readily accept `consumable` data--data intended solely for user-consumption and never used internally--from it.  
  Within Membrane networks, peers do not connect solely for the purpose of explicit data exchange; the network constantly stabilizes<!----> by creating redundant routes between nodes to improve fault tolerance. Therefore, authentication is a necessary formalism to show that, not only are two nodes implicitly connected, but, too, they both agree to exchange consumable data. There are three main ways to establish an authenticated route: `peerConnection.prototype.makeDefiniteRoute` with "permissions" set to "advanced," `(instance of peerConnection).requestPermissionEscalation`, again passing the value "advanced," or the more dynamic hybrid of the two--`peerConnection.prototype.negotiateAgnosticConnection`, which will perform an escalation if a route already exists to the destination, and, if not, employ the makeDefiniteRoute method.
## Installation and Integation
The following sequence of commands will install and initiate the demonstration on 127.0.0.1:8000 on any reasonably recent *nix-style operating system.
```shell
curl -LJo Membrane-v1.0.0.tar.gz https://github.com/Elijah-Bodden/Membrane/tarball/v1.0.0
tar xfv Membrane-v1.0.0.tar.gz --transform 's!^[^/]\+\($\|/\)!Membrane-v1.0.0\1!'
cd Membrane-v1.0.0/src/source/frontend
npm install
cd ../server
npm install
npm run deploy
```
To kill the pm2 daemon generated by `npm run deploy`, simply run `npm run kill`.
<!-- the following functions, etc, must be supplied -->
### What else you'll need
<!-- A functional server with appropriate endpoints + exchange methods (see /src/server -> wget -> cd -> npm install) -->
## Application Infrastructure

## Utilities
Within the root directory of this repository, you will find a subdirectory named `"Utilities."` Here I have compiled two of the most helpful independent utilities I wrote for this project. Each is remarkably small (they weigh just over 200 lines of code combined,) but they have been absolutely invaluable in the later stages of the project; I hope they may do for someone else. Both of these are stripped down versions of classes found in the `lib` source, and, as such, if you wish for full functionality at the expense of a few more resources, you can find classes of the same names in `index.js`.
- ### EventHandlingMechanism
    This lightweight utility acts as a fully functional event-dispatch and -signaling device, with both asyncronous, promise-based channels (invoked by the method `acquireExpectedDispatch`), and more traditional, callback-based modes (bound by calling `onReceipt`). After attatching listeners to a particular "`signalIdentifier`" by either method, you can then trigger them, resolving all promises and calling all callbacks, with `dispatch`, passing the desired identifier as the first parameter. You can also, optionally provide a second argument--an `externalDetail`--which will then pass to every callback and return with the value of every promise.
- ### AbstractMap
    This utility is simply a lightweight, adjacency-list-based representation vector for (optionally weighted) undirected force maps. Alongside standard methods for node and edge manipulation and weighting, I also include an efficient representation of Dijkstra's pathfinding algorithm, invoked by the function `precomputeRoutes`. The product of this algorithm is saved to the locally-scoped variable `distances`, and may be extracted further through the method `findNextHop`, which identifies the first intermediary between two desired nodes.
    <!-- Terminate list -->
Additionally, although I did not feel it consequential enough to merit its own individual file, you will find at the bottom of EventHandlingMechanism's utility file my heavily-used, if rather-high-overhead `checkForTypeErrors` function.
## Dependencies
