![Membrane](./Assets/Membrane-banner.svg)
<p align="center">
<img src="https://img.shields.io/github/license/Elijah-Bodden/membrane?color=blue&label=License"/>
<img src="https://img.shields.io/github/languages/code-size/Elijah-Bodden/membrane?color=%20%23d0a011%20&label=Raw%20Code%20Size"/>
<a href="https://membranexus.com">
<img src="https://img.shields.io/website?label=Website%20Status&url=https%3A%2F%2Fmembranexus.com"/>
</a>
<img src="https://img.shields.io/maintenance/yes/2025?label=Maintained"/>
<a href="https://twitter.com/intent/tweet?text=An+unkillable%2C+browser-based+p2p+network.&url=https%3A%2F%2Fgithub.com%2FElijah-Bodden%2FMembrane&hashtags=webrtc+opensource+p2p+peer2peer+github+projectMembrane&original_referer=http%3A%2F%2Fgithub.com%2F&tw_p=tweetbutton" target="_blank">
  <img src="http://jpillora.com/github-twitter-button/img/tweet.png" title="An unkillable browser-based p2p network."></img>
</a>
</br>
<a href = https://github.com/Elijah-Bodden/Membrane/blob/main/docs.md>
<img src="https://img.shields.io/badge/Documentation-here-green?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAkCAMAAADfNcjQAAAACXBIWXMAAAPoAAAD6AG1e1JrAAABI1BMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADRGyDUAAAAYHRSTlMADsnu1gXVAQQD0YN0VgJ2Y2Fk73WFVdfzB9QGEhqEWoJndwwhc85iGNM62+uGz9LLyghgQFgxgewRXowiF3FXX/L4D7cbUhDl5FDqVCnYFGWJCjiy9Isdxyfd4QnQ9Ul2HlhyAAABVklEQVQ4y8WTxXLDMABEt41t2U2jpHaYoYGGy8zMzKT//4racqYxNse+g09vVrsaGc135k36EhQ6b0wQEoKThHTFDkAMgUkpRXYh4jqQEMGFNDypBKQUkamRoH+II4AQjGkzhkd0gZhn2dCF9snFWfweXMBGOTwkGq42gONTvqVjCBRFx0QV2D/XbjtPbWYm5OpTFuo7WQw6vDD/DgEhhczsn4IIeXxwxHR00kJ0axM2gSLoLmlPOIyokSHqfNYhjOxgERQO4FmyGi5VPBMsJRfMR+KamVM5pcW5kR18Loooym87T2Fkwr8LIlVcyFjVJNkUet7/BVYGCXu7sWI+FgvayS+vsxq4UGZ+rOn3pwtoFuKhVvLmaDtkJV5Y0psaAt/QT965S1ACWX/VoDJVaskGFGKHrzWOMOg+PiMjOsnIH30uUDywdHfCzWePfZnCa8tnifb9A/asZNZ24Y66AAAAAElFTkSuQmCC"/>
</a>
<a href ="https://membranexus.com">
<img src="https://img.shields.io/badge/Demo-here-blue?style=for-the-badge"/>
</a>
</br>
Robust, server-minimal peer routing in the browser
<!-- </br>
Note: much of this repo is production materials. If you're looking for the actual library source, you can find it <a href="https://github.com/Elijah-Bodden/Membrane/blob/main/lib/index.js">here</a>.
</p> -->

## What's this?
The Membrane protocol takes signalling to the browser, creating living peer networks. With minimal server-based bootstrapping, it can make self-sufficient peer-to-peer WebRTC networks with full self-signaling capabilities. Instead of relying on centralized signaling servers, members rely on the network itself to pass on information to peers they want to make a new connection with. The network of disconnected peer browsers acts like a unit, tracking its geometry and spreading common knowledge about peers by "gossiping". Meanwhile, it actively stabilizes, with members mimimizing their own eccentricity to give a robust, snappy, immediate-access-to-anyone experience.
| ![](./Assets/demo.gif) |
|:--:|
| *[Membranexus.com](https://membranexus.com), built using Membrane. After each node's first connection, it never again needs the server to help it connect to other nodes or communicate network information. Its peers do both instead.* |  

Membrane leverages the `RTCPeerConnection` API's agnosticism about signalling. You could just as well communicate `ICE` connectivity data through smoke signals or quantum teleportation as through the standard signalling server. In fact, in many cases, signaling servers prove a terribly unreliable, vulnerable approach approach. And so, Membrane attempts to implement a better, alternative protocol. With each membrane acting as a giant, decentralized router, distant, unconnected members can exchange arbitrary data in milliseconds with no clumsy intermediary server or risk of downtime.

Of course, this approach isn't perfect. The benefits of decentralization are ultimately also the fatal flaw. What it gains in robustness and decentralization, it loses in making spoofing and manipulation easier, thanks to its lack of centralized authentication. 

## Installation and Integation
### Installing the Demo or Building From Source
  #### Prerequisites
  - `npm`
  - `npx`
  - `node.js`  
### 
Paste the following commands into a terminal to build a complete directory structure and initialize the demo on 127.0.0.1:8000 anywhere with the prerequisities installed.
  ```shell
  wget Membrane-current.tar.gz https://github.com/Elijah-Bodden/Membrane/tarball/v1.2.2
  tar xfv Membrane-current.tar.gz --transform 's!^[^/]\+\($\|/\)!Membrane-current\1!'
  cd Membrane-current/src/source/frontend
  npm install
  cd ../server
  npm install
  npm run deploy
  rm ../../../../Membrane-current.tar.gz
  ```
  To kill the pm2 instance created by `npm run deploy`, run `npm run kill`.

### Deploying a New First-Contact Signalling Server
Installing the pre-made server from `/src/source/server/index.noStatic.js` is a piece of cake! Just run `npm i membrane-server` at the root of your node project, sit back, and relax while it installs.  
To deploy the server on pm2, run `npm explore membrane-server -- npm run deploy`. To kill the pm2 instance, run `npm explore membrane-server -- npm run kill`. Now just remember to replace the websocket addresses in your client's config with your new server's.
### Build Your Own App!
Using the library for your own use-case is relatively simple. Here's a typical integration process. Find the delivery method you like below, then head down below to the general next steps  
| Delivery Method | Instructions |
---- | ----
| npm + Webpack | Run `npm install @elijah-bodden/membrane \| cd node-modules/elijah-bodden/membrane` in the root of your webpack project<sup id="a1">[ \[1\]](#f1)</sup>|
| HTML script tag | Go to the directory you serve static files from and find where you want to save the script. Run `wget https://raw.githubusercontent.com/Elijah-Bodden/Membrane/main/lib/index.js -o membrane.js`, and finally paste `<script src="/path/to/membrane.js"/>` into your HTML head. |
| Jsdelivr CDN (not recommended) | With this method, you won't need to (can't) follow the general instructions that come after this table. You'll be stuck with the default config and every peer request will be accepted by default. If that works, just paste this into your HTML head: `<script src="https://cdn.jsdelivr.net/npm/@elijah-bodden/membrane/index.min.js"` |

<p align=center><i>then</i></p>

THIS IS SHIT -- TODO
1. (optionally) Modify your script's `CONFIG.communication.configLoaderFunction` in [this](https://github.com/Elijah-Bodden/Membrane/blob/main/docs.md#loading-custom-configurations) form.
2. (optionally) Create a `CONFIG.communication.routeAcceptHeuristic` either statically in `defaultConfig` or dynamically at runtime through `CONFIG.constants.configLoadFunction`. If you want to allow the user to explicitly accept certain routes, you can include an awaited async function which fetches user responses.
<!--List Break-->
At this point, the script should be able to function on its own. To verify, load a few instances of the script into e.g. a browser with the [default server](https://github.com/Elijah-Bodden/Membrane#deploying-a-new-signalling-server) running. If you `livePeers` contains at least one object when you type it into console, everything's working.  
Then, to interact with the modlue:
- Use `negotiateAgnosticAuthRoute` on members of `Object.keys(networkMap.nodes)` to authenticate arbitrary nodes.
- Use `* Authenticated Peer *.standardSend("consumable", *arbitrary data*)` to send consumable data to authenticated peers.
- Define an output for consumable data with `onConsumableAuth((_dontUse, data) => {* useData *(data)})`.
- Set up a custom first-contact signaling server (or use the [included](https://github.com/Elijah-Bodden/Membrane#deploying-a-new-signalling-server) one)
- Don't forget to edit the websocket urls in `CONFIG.serverLink` to point to this server.
###
___
<b id="f1">1 </b>The following items are able to be imported from the npm module: `CONFIG`, `GossipTransport`, `authPeers`, `deauthPeer`, `defaultConfig`, `detatchedRoute`, `eventHandler`, `eventHandlingMechanism`, `gossipTransport`, `hiddenAliasLookup`, `init`, `initialReferenceLedger`, `livePeers`, `loadConfig`, `mostRecentServerHeartbeat`, `networkMap`, `networkMap`, `onAuthRejected`, `onLivePeersUpdated`, `onPublicError`, `peerConnection`, `pubAliasLookup`, `pubAliasUnparser`, `routingTableTransport`, `serverHardRestart`, and `topologyTransport`. [↩](#a1)
## Contributing
I appreciate any contributions! If you see something you think you can improve in the code, please make a PR. If you just have an idea or spot a bug, that's great too! Please, open an `issue` with either the `bug` or `enhancement` tag. And if you just want to show some love to the project, it'd mean a ton if you left a star!  
## Authors
* **Elijah Bodden** - *Initial work* - [Elijah-Bodden](https://github.com/Elijah-Bodden)
## License
MIT License. See the [LICENSE](LICENSE) file for details.

## Built With
- The core module - 100% [Vanilla.js](http://vanilla-js.com/). Also check out [kNow](https://github.com/Elijah-Bodden/kNow), which I spun off of membrane's homebrew event handler.
- Demo frontend - HTML/SCSS/JS (because i'm stupid), plus [Sigma.js](https://github.com/jacomyal/sigma.js)+[Graphology](https://github.com/graphology/graphology) to power the gorgeous network visualization graph (and some pretty Font Awesome icons!)
- Backend - [Node](https://github.com/nodejs/node) using lots of libraries, but especially [Winston](https://github.com/winstonjs/winston) for logging and [WS](https://github.com/websockets/ws) for websockets

## Contact
Elijah Bodden - elijahbodden@protonmail.com / admin@membranexus.com  
Project - https://github.com/Elijah-Bodden/Membrane  
