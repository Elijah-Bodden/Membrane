## Exports
- `init`: initializes a fully-functional, self contained client that will join your network if any exists. Params: `configLoadFunction (optional)`
##### Aside: configLoadFunction:
Preferences are loaded into the `CONFIG` object when the script run. The pre-filled [`defaultConfig`](https://github.com/Elijah-Bodden/Membrane/blob/2ae86422b14dda2b2da0b4345580c387713e1988/lib/index.js#L11) acts as base, with `configLoadFunction` providing selected values to swap out. These substitutions should be formatted like:
    `
    {
        rootType.subtype.(...).preferenceName : value
        ...
    }`
(Notice that the key is a flattened version of the config location).
- `networkMap.nodes`: an adjacency list representation of the network. Mostly interesting to library users because `Object.keys(networkMap.nodes)` is an array of the hidden aliases of every member of the network.
##### Aside: aliases:
Every peer has two `aliases` - one hidden and one public.  
  - `hiddenAliases` are unique internal names for peers. They're not "private" per se, but the user usually shouldn't need to see them.
  - `publicAliases` are like usernames. They don't have to be unique (if a client sees duplicates, it'll just add a (number) to the end of one) and aren't used much internally.  
You can convert from hidden aliases to public aliases with `hiddenAliasLookup`, and from public to hidden with `pubAliasLookup`.  </br></br>
- When a client registers a new publicAlias, it automatically "parses" it, adding a number to the end if it's a duplicate of an existing alias. You can also use `pubAliasUnparser` to convert a public alias into its unparsed form.
- `livePeers`: on object mapping `hiddenAliases` of peers the client is connected to onto the `peerConnection` instances of those peers.
- `authPeers`: an array containing the `hiddenAliases` of all the client's "authenticated" peers
##### Aside: authentication
Authenticated peers are peers that the client has agreed to recieve `consumable` packages from. Packages are information structures used in communication between peers. Consumable packages are the kind package used on the application level. Consumable packages will likely be the only kind of package you'll need to explicitly worry about, so authentication effectively grants a connection the right to send data. There will be many un-authenticated structural connections, but these aren't directly relevant to applications.  
- `makeConnection`: tries to create a `PeerConnection` (passing signaling information through neighbors if necessary). Params: `alias` - the hidden alias of the target; `wantAuth` - boolean. If you already have a non-auth connection to a peer, calling this with `wantAuth` will attempt to upgrade the connection to an auth connection. A `PeerConnection` to the target if successful. Throws an error if unsuccessful (e.g. the target rejects the request).
- `onNewAuthPeer`: triggers whenever a new peer gets added to `authPeers`. Params: `callback` (can accept one parameter, the alias of the new peer)
- `onLostAuthPeer`: same as `onNewAuthPeer` but for when an auth peer gets removed.
- `onAuthRejected`: same as the previous two, but triggers when a peer responds to an authentication request (e.g. `makeConnection` with `wantAuth`=true) with a rejection
- `onNewPeer`: Like `onNewAuthPeer` but triggers when ANY new connection is created
- `onLostPeer`: like `onLostAuthPeer` but for ANY connection being closed
- `onAuth`: a more targeted version of `onNewAuthPeer` that only triggers once - when an auth connection is created to one particular auth peer. Params: `alias` - the hidden alias of the peer you want to trigger the callback on authentication with; `callback`
- `deauthPeer`: deauthenticate connection to a peer. Params: `alias` - alias of the peer you want to deauthenticate
- `sendConsumable`: send a consumable package to a peer (only works for peers you have an authenticated connection to). Params: `alias` - alias of your target; `raw` - the string you want to send
- `onConsumable`: Triggers when you recieve a consumable package from a given peer. Params: `alias` - the alias of the peer you want to listen to; `callback` - callback accepting one parameter - the raw value the peer sent.
##### Aside: gossip and GossipTransport
The network stays coordinated and coherent thanks to something called gossip. Gossip is information that gets passed around the network until every peer knows it. Internally, it's used for coordinating peers' maps and making sure everyone knows the network's topology. It's useful for tracking any kind of global state - something dynamic that you want every peer to have the same value for. Gossip comes in bundles of different types, with each type having its own parser to tell the client to do with this new information.
- `gossipTransport.addType` - creates a new type of gossip for the client to send out. Params: `name` - the name of your new type. Returns: an object containing two functions: `addGossip` and `deleteType`
- `addGossip`: adds a piece of gossip of the parent type to the stack to eventually be propagated. Params: `data` - an object holding whatever information you want to gossip
- `gossipTransport.addParser`: creates a parser to handle recieving a given type of gossip. If no parser exists for a recieved type, the `default` parser will be used, passing on the gossip but doing nothing with it. Params: `type` - the gossip type it should handle; `useDefault` - use the default parser in addition to the one you register. This automatically drops the gossip if the client already knows it, and passes it on to the client's peers if not; `parserFunction` - function with one parameter, `unknown`. If you're using default, this will be only the pieces of gossip with `identifierFields` the parser hasn't seen before. If you're not using default, this will be all pieces. Do whatever you want with the gossip in this function; `identifierFields` - used by default parser. If ALL of these fields are the same as a piece of gossip you've already gotten, the gossip will be discarded.
- `onServerError` - Triggers when a fatal server error happens.
- `onNetworkMapUpdate` - Triggers anytime nodes or connections on the map change.


## More major classes
- ### EventHandler
  A slightly modified version of the [kNow](https://github.com/Elijah-Bodden/kNow) event handler. Coordinates most of the event listening and glues most of the other components together. Instantiated as `eventHandler`.
- ### NetworkMap
  An efficient adjacency-list representation for undirected graphs. The `addNode`, `removeNode`, `addEdge`, and `removeEdge` functions should be self explanatory. `precomputeRoutes` runs Dijkstra's algorithm, taking into account edge weights. After running precomputeRoutes, `findNextHop` finds the optimal next hop for a message on its way to a reciever. `exportList` and `importList` allow compact importing and exporting of graphs. Instantiated as eventHandler. Object.keys(networkMap.nodes) gives a list of the hiddenAliases of all the nodes on the network.
- ### ServerConnection
  Handles websocket connections to the first-contact signaling server, indefinitely trying to reconnect when it goes down. While the network is completely functional without a server, it can't add new nodes.
- ### PeerConnection
  A high-level wrapper for RTCDataChannel and RTCPeerConnection, facilitating SDP exchange, "[authenication](https://github.com/Elijah-Bodden/Membrane/blob/main/docs.md#authentication)", and package handling among other things. Every WebRTC connection made in a Membrane is wrapped by a PeerConnection.
