![Membrane](./Assets/Membrane-banner.svg)</br>
![](https://api.codiga.io/project/33828/score/svg)
![](https://img.shields.io/github/license/JerichoJS/membrane?color=blue&label=License)
![](https://img.shields.io/github/languages/code-size/JerichoJS/membrane?color=%20%23d0a011%20&label=Raw%20Code%20Size)
[![](https://img.shields.io/website?down_color=%23D0342C&down_message=Offline&label=Website%20Status&up_color=%23e8daef&up_message=Operational&url=https%3A%2F%2Fmembra.ne)](https://membra.ne)
</br>
A robust, minimal-server-interaction API for peer routing in the browser

## What  is this?
The official membrane framework, specifically `index.js` within `/lib`, capitalizes upon the `RTCPeerConnection` API's inherent agnosticism regarding signaling. That you could just as well communicate the `ICE` data necessary for establishing a peer connection through smoke signals or quantum teleportation (*if only*), as through a more conventional signalling server means very little constrains us to this often-unreliable, centralized approach. Fundamentally, Membrane allows us to create unencumbered, living peer networks, so that, after just a single centralized signal, we can enter an ultra-fault-tolerant network of thousands of highly interconnected nodes, routing by peer-borne signals to any node we desire. Once we are "in," we are so for good. No matter what happens to our original signaling server, the network will remain untouched.

However, this approach is far from perfect. This very hyper-decentralization that makes us so indestructible--our greatest boon--in turn becomes our worst enemy. Without a singular, trusted register to authenticate peers, spoofing, posing, and generally manipulating the structure of the network become elementary. I plan on soon implementing a direct, key-derivation-based codeword authentication system, but even this requires a centralized medium of initial exchange.

In brief, this tool is robustly functional at enabling anonymous, homogeneous, untrusted data exchange across a network, but very poor at most else.

## Documentation
In the following section I have compiled a set of hopefully-only-slightly-pedantic descriptions for `lib`'s key functionalities.
- ### Aliases
    Aliases are one of the most fundamental properties in this library, defining the unique identities of peers, both formally internally, in the form of `hiddenAliases` and informally to users, in the form of `publicAliases`. `hiddenAliases` are primarily used in transactions and routing between peers and across the network, whereas `publicAliases` are merely a cosmetic abstraction only ever seen by users. The two are correlated by the global-scope objects `hiddenAliasLookup` for finding corresponding `publicAliases` and `publicAliasLookup` for the converse.
- ### Config
  - #### Loading custom configurations:
    All global config is loaded into the `CONFIG` object from initialization, with the contents of `defaultConfig` acting as a baseline template, which its own `constants\configLoadFunction` extends, providing a set of values to substitute, formatted as follows:
    ```JSON
    {
        rootType.subtype.(...).preferenceName : value
        ...
    }
    ```
    This function is run every time the script is initialized, invoked by `loadConfig`, and may be left undefined or simply return `{}` to use the exact `defaultConfig`. If a path is provided which has not been pre-defined by `defaultConfig`, its value is discarded.
  - #### communication.packageArgs 
    An array of arguments which must/may be included in packages sent over `RTCDataChannel.prototype.standardSend`. This is used in determining the validity of packages received from peers. Each entry is structured as `{ required : [...], optional: [...] }`. Optional is left open-ended by default, and may be constrained to only the arguments specified, so that any extraneity causes an error by including the value "`!*`."
  - #### communication.routeAcceptHeuristic
    A discriminator function provided a single argument, `routePackage`, representing all non-type data provided in the initial request. If this function is `async` it will be `await`ed  by default, allowing asynchronous user interaction. Ultimately, this function returns a boolean value, representing whether a route is to be established or not.
- ### Prototype overrides
    In total, this module extends exactly two prototypes, in both cases to add a specific formatting micro-protocol, and both times with unusual, unambiguous names in order to prevent potential future conflicts. **Note**: courses of action delineated here to be taken by the server are specific to the signaling server provided in `/src/server` but can certainly differ, or even be cut altogether to reduce server-node interaction, in a custom server implementation.
    - #### WebSocket.prototype.crudeSend
        This function accepts a mandatory first argument, `type`, and an optional second `typeArgs`--an object containing data relevant to the specific type. This data is then bundled appropriately and sent to the server. We define the following acceptable types:
        - heartbeat - Generates an empty message to indicate a node is still living, as websocket does not implement any ping-pong functionality natively.
        - reportNode - Indicates to the server that a particular node provided an invalid SDP package to a node freshly entering the network. The server will increase this node's routing weight (making it less probable it will route to it again), and provide a new route to the caller. If the node receives invalid data three times in a row, it will throw an error and stop attempting.
        - returnSDP - Returns SDP generated in response to an SDP request from the server.
        - ignoreSDPRequest - Like reportNode but for nodes of which SDP was requested; if a node receives an SDP request which itself is improperly formatted, it will call this. The server will modestly penalize the node reporting the error, and send an `["ERROR"]` package to the initial requester.
    - #### RTCDatachannel.prototype.standardSend
      Simmilarly to crudeSend, this function accepts at minimum one parameter, or two optionally. However, no checks are performed to ensure packages conform to formatting standards, and therefore must be done before calling this function. For a full list of possible inputs, see [CONFIG.communication.packageArgs](https://github.com/JerichoJS/Membrane#communicationpackageargs).
- ### EventHandlingMechanism
  This class is instantiated globally under the variable name `eventHandler` within the project; see its section in [Utilities](https://github.com/JerichoJS/Membrane#eventhandlingmechanism) for more information
- ### AbstractMap
  Once again, see the [relevant section](https://github.com/JerichoJS/Membrane#abstractmap) of Utilities for a more complete treatment of the matter. The version presented here differs from the "utility form" only insofar as it also contains efficient `exportList` and `importList` methods, with a `this`-scoped boolean property `exportRefreshed` which identifies whether the current value of `export` accurately represents the map. Additionally, the higher-level `optionalExport` method will update the value of `export` through `exportList` if and only if `exportRefreshed` is false. This class is globally instantiated as `networkMap`, the central weighted ledger for peer associations; this is used in finding the most efficient peer routes across the network. Taking `Object.keys(networkMap.nodes)` or `Object.keys(networkMap.adjacencyList)` will render a list of all nodes found within the current network.
- ### PeerConnection
  The `peerConnection` class acts as a high-level wrapper for the RTCDataChannel and RTCPeerConnection APIs, facilitating abstract interaction between nodes, such as routing, "authenication,<!---->" and updating the networkMap. Every connection made within this module is represented as an instance of this wrapper. <!---->
- ### Status trackers
  This project employs two primary sets of connection status trackers--`livePeers` and `authPeers`. Each is modified through the appropriate `add` or `remove` method (i.e. `addAuthPeer` and `removeAuthPeer`), and may be watched for changes with a callback via an `onXUpdated` method (i.e `onAuthPeersUpdated`). Livepeers comprises a list of all peers with which the client holds direct connections, with new peers automatically appended to it following successful initialization exchanges, and peers removed on explicit termination or death of their underlying dataChannels. AuthPeers acts as a softer abstraction on this, containing the hiddenAliases, rather than actual references, of all peers which have `advanced` <!---->send permissions.
- ### Authentication
  The concept of authentication is essential to the underlying mechanism of this project. Here the term authentication is taken in a slightly different sense from that in which it is used in, for instance, cybersecurity. Within the scope of peerConnections, authentication effectively means that two nodes with a shared connection mutually permit the transmission of `consumable` data--that which is presented to the user, rather than used internally. Within this network, peers do not connect solely for the purpose of explicit data exchange; the network constantly stabilizes<!----> by creating redundant routes between nodes to improve fault tolerance. Therefore authentication is a necessary formalism to show that, not only are two nodes implicitly connected, but, too, they have both agreed to exchange consumable data. Practically, there are three main ways to establish an authenticated route: runnning `peerConnection.prototype.makeDefiniteRoute` with "permissions" set to "advanced," calling `peerConnection.prototype.requestPermissionEscalation`, with the sole parameter "advanced," or the more dynamic hybrid of the two--
## Integration
<!-- the following functions, etc, must be supplied -->
### What else you'll need
<!-- A functional server with appropriate endpoints + exchange methods (see /src/server -> wget -> cd -> npm install) -->
## Application Infrastructure
## Utilities
Within the root directory of this repository, you will find a subdirectory named simply `"Utilities."` Here I have compiled two of the most helpful independent utilities I wrote for this project. Each is remarkably small (just over 200 lines of code combined,) but they have proven absolutely invaluable to me in the later stages of the project; I hope they may do for someone else in my sharing. Both of these are stripped down versions of classes found in the `lib` source, and, as such, if you wish for full functionality at the expense of a few more resources, you can find classes of the same names within `index.js`.
- ### EventHandlingMechanism
    This lightweight utility acts as a fully functional event-dispatch and -signaling device, with both asyncronous, promise-based channels (invoked by the method `acquireExpectedDispatch`), and more traditional, callback-based modes (bound by calling `onReceipt`). After attatching listeners to a particular "`signalIdentifier`" by either method, you can then trigger their products by calling `dispatch` with the desired identifier as the first parameter. Into this function you may also optionally pass a second argument--an `externalDetail`--which will then be passed to every callback and returned with the value of every promise.
- ### AbstractMap
    This utility is perhaps slightly more straightforward than the former, acting simply as a lightweight, adjacency-list-based representation vector for undirected force maps (optionally weighted). Alongside standard methods for node and edge manipulation and weighting, I also include an efficient representation of Dijkstra's pathfinding algorithm, invoked by the function `precomputeRoutes`. The product of this algorithm is saved to the locally-scoped variable `distances`, and may be extracted further through the method `findNextHop`, which identifies the first intermediary between two desired nodes.
## Thanks
