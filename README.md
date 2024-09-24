![Membrane](./Assets/Membrane-banner.svg)
<p align="center">
<img src="https://img.shields.io/github/license/Elijah-Bodden/membrane?color=blue&label=License"/>
<img src="https://img.shields.io/github/languages/code-size/Elijah-Bodden/membrane?color=%20%23d0a011%20&label=Raw%20Code%20Size"/>
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
Membrane is a protocol that takes WebRTC signalling to the browser, creating living peer networks. With minimal server-based bootstrapping, it can make self-sufficient peer-to-peer networks that can operate without servers. Any member browser can create a connection to any other by signaling across its peers, avoiding clumsy, centralized signaling servers. The network also self-stabilizes, minmizing its diameter and collectively tracking its status and topology through peer "gossip".

The library is designed to be as agnostic as possible, making no-installation web clients for distributed chat, hosting, torrenting, computing, and so much more easy to implement!  
| ![](./Assets/demo.gif) |
|:--:|
| *[Membranexus.com](https://membranexus.com), built using Membrane. After a first-contact server signal, clients never need to interact with a server again - all network functions can happen on the peer level.* |  

Membrane leverages `RTCPeerConnection`'s agnosticism about signalling. You could just as well communicate `ICE` connection data through smoke signals or quantum teleportation as through a standard signalling server. In many cases, signaling servers are an unreliable and vulnerable approach. Membrane attempts to implement a better alternative protocol. With each membrane network acting as a giant, decentralized router, unconnected members on opposite sides of the earth can exchange arbitrary data in milliseconds, with no clumsy intermediary server or risk of downtime.

Of course, this approach isn't perfect. The benefits of decentralization are ultimately also the fatal flaw. What it gains in robustness and decentralization, it loses in making spoofing and manipulation easier. A decentralized public key ledger for cryptographic signing is WIP, which should largely remedy these issues. And for non trust-critical operations, the existing implementation should be good enough.  

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
  To kill the pm2 instance this creates, run `npm run kill`. To re-spawn it, run `npm run deploy` in `/src/source/server`.

### Deploying a New First-Contact Signalling Server
Installing the pre-made server from `/src/source/server/index.noStatic.js` is a piece of cake! Just run `npm i membrane-server` at the root of your node project, sit back, and relax while it installs.  
To deploy the server on pm2, run `npm explore membrane-server -- npm run deploy`. To kill the pm2 instance, run `npx pm2 kill`. Now just remember to replace the websocket addresses in your client's config with your new server's.

You will likely also want to set up coturn TURN and STUN servers and replace the addresses in the frontend's `defaultConfig` with those. And since this is a standalone signaling server, you'll have to serve your frontend (in the demo's case, `/src/source/frontend/dist`) separately.
### Build Your Own App!
Using the library for your own use-case is relatively simple. Here's a typical integration process. Find the delivery method you like below, then head down below to the general next steps  
| Delivery Method | Instructions |
---- | ----
| npm + Webpack | Run `npm install @elijah-bodden/membrane \| cd node-modules/elijah-bodden/membrane` in the root of your webpack project |
| HTML script tag | Go to the directory you serve static files from and find where you want to save the script. Run `wget https://raw.githubusercontent.com/Elijah-Bodden/Membrane/main/lib/index.js -o membrane.js`, and finally paste `<script src="/path/to/membrane.js"/>` into your HTML head. |
| Jsdelivr CDN (recommended) | Simply paste this tag into your HTML head: `<script src="https://cdn.jsdelivr.net/npm/@elijah-bodden/membrane@1.2.1/index.js"></scrípt>` |

<p align=center><i>then</i></p>

<!--List Break-->
Now comes the fun part - building the thing! You'll likely want to set up your own first-contact signaling server (like [this](https://github.com/Elijah-Bodden/Membrane#deploying-a-new-signalling-server)) and host it publicly so people can use your app from all different networks. Don't forget to edit the websocket urls in `CONFIG.serverLink` to point to it (or pass a config loader into init and do that without editing the source - how to do that next)!

The library has lots of things to play with, but here are some of the most useful (also check out the demo below to see them in use):
- `init` - Call this function to create a fully-functional, self contained client that will join your network if any exists.
- You can also define your own config loader function and pass it as a parameter to init. Its return value should look like [this](https://github.com/Elijah-Bodden/Membrane/blob/main/docs.md#loading-custom-configurations).
- If you want to make new data fields that are syncronized across the network the way the network map is, you'll need `gossipTransport`. Create a new type with `gossipTransport.addType`, use `gossipTransport.addParser` to tell it how to handle this type, and use `[gossip type you created].addGossip()` to broadcast gossip across the network.
- `Object.keys(networkMap.nodes)` is the hidden alias of every node on the network. `livePeers` is an object mapping the hidden alias of every peer the client has a direct connection to, to said client. `authPeers` is the list of all peers the client has consumable send permissions for.
- `networkMap.onUpdate` lets you track topology changes
- `onAuthPeersUpdated` lets you track changes to `authPeers`
- `[instance of peerConnection].onConsumableAuth` lets you provide a callback for recieving consumable packages.
- `peerConnection.prototype.negotiateAgnosticAuthConnection` will do its best to get you an authenticated connection to the provided hidden alias
- `sendConsumable` sends specified data as a consumable package to a specified hiddenAlias (only works if you already have an authenticated connection). Consumable packages will likely be the only kind of package you'll need to work with when building applications. 
###
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
