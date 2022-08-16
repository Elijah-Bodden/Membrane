![Membrane](./Assets/Membrane-banner.svg)
<p align="center">
<img src="https://api.codiga.io/project/33828/score/svg"/>
<img src="https://img.shields.io/github/license/Elijah-Bodden/membrane?color=blue&label=License"/>
<img src="https://img.shields.io/github/languages/code-size/Elijah-Bodden/membrane?color=%20%23d0a011%20&label=Raw%20Code%20Size"/>
<a href="https://membranexus.com">
<img src="https://img.shields.io/website?down_color=%23D0342C&down_message=Offline&label=Website%20Status&up_color=%23e8daef&up_message=Operational&url=https%3A%2F%2Fmembranexus.com"/>
</a>
<a href="https://github.com/Elijah-Bodden/Membrane/actions/workflows/codeql-analysis.yml">
<img src="https://github.com/Elijah-Bodden/Membrane/actions/workflows/codeql-analysis.yml/badge.svg"/>
</a>
<a href="https://twitter.com/intent/tweet?text=An+unkillable%2C+browser-based+p2p+network.&url=https%3A%2F%2Fgithub.com%2FElijah-Bodden%2FMembrane&hashtags=webrtc+opensource+p2p+peer2peer+github&original_referer=http%3A%2F%2Fgithub.com%2F&tw_p=tweetbutton" target="_blank">
  <img src="http://jpillora.com/github-twitter-button/img/tweet.png" title="An unkillable browser-based p2p network."></img>
</a>
</br>
<a href = https://github.com/Elijah-Bodden/Membrane/blob/main/docs.md>
<img src="https://img.shields.io/badge/Documentation-here-green?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAkCAMAAADfNcjQAAAACXBIWXMAAAPoAAAD6AG1e1JrAAABI1BMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADRGyDUAAAAYHRSTlMADsnu1gXVAQQD0YN0VgJ2Y2Fk73WFVdfzB9QGEhqEWoJndwwhc85iGNM62+uGz9LLyghgQFgxgewRXowiF3FXX/L4D7cbUhDl5FDqVCnYFGWJCjiy9Isdxyfd4QnQ9Ul2HlhyAAABVklEQVQ4y8WTxXLDMABEt41t2U2jpHaYoYGGy8zMzKT//4racqYxNse+g09vVrsaGc135k36EhQ6b0wQEoKThHTFDkAMgUkpRXYh4jqQEMGFNDypBKQUkamRoH+II4AQjGkzhkd0gZhn2dCF9snFWfweXMBGOTwkGq42gONTvqVjCBRFx0QV2D/XbjtPbWYm5OpTFuo7WQw6vDD/DgEhhczsn4IIeXxwxHR00kJ0axM2gSLoLmlPOIyokSHqfNYhjOxgERQO4FmyGi5VPBMsJRfMR+KamVM5pcW5kR18Loooym87T2Fkwr8LIlVcyFjVJNkUet7/BVYGCXu7sWI+FgvayS+vsxq4UGZ+rOn3pwtoFuKhVvLmaDtkJV5Y0psaAt/QT965S1ACWX/VoDJVaskGFGKHrzWOMOg+PiMjOsnIH30uUDywdHfCzWePfZnCa8tnifb9A/asZNZ24Y66AAAAAElFTkSuQmCC"/>
</a>
</br>
Robust, minimal-server-interaction peer routing in the browser
</p>

## What  is this?
Membrane takes signalling to the browser, creating living peer networks. After just one server-based signal, a node never again needs centrality. The network acts as one giant signaling *membrane*, connecting far-flung peers at a whim. So long as a node remains a part of the network, it has full contact with every participant. Meanwhile, the network actively stabilizes around each new member, ensuring that severed connections will not damage the network nor cut off nodes, and allowing for an overall seamless "immediate-access-to-anyone" experience.
| ![](./Assets/demo.gif) |
|:--:|
| *Taken from [Membranexus.com](https://membranexus.com), which was built using Membrane* |  

Membrane capitalizes upon the `RTCPeerConnection` API's agnosticism regarding signaling. You could just as well communicate `ICE` connectivity data through smoke signals or quantum teleportation (*if only*), as through a conventional signalling server. That's profound; *we forced to use this terribly unreliable, centralized approach*. With membrane, just one server-based signal opens an entire realm of peers; each membrane is a single, behemoth router. Distant, unconnected members can exchange arbitrary data in milliseconds, with no clumsy intermediary server, nor any risk of downtime.

To be clear, however, this approach is not perfect. The boon of decentralization may in fact be this project's worst enemy. No singular, trusted ledger to authenticate peers means spoofing, posing, and general manipulation are elementary. 

In brief, this tool is robustly functional at enabling anonymous, homogeneous, untrusted data exchange across a network, but poor at most else.

> **_NOTE:_** The module can currently only be used once built/integrated from raw source; however, an official npm package is in the works.

## Installation and Integation
### Demo
  #### Prerequisites
  - `npm`
  - `npx`
  - `node.js`  
### 
Paste the following commands into a terminal to install and initialize the demo on 127.0.0.1:8000 on any system with the prerequisities installed.
  ```shell
  curl -LJo Membrane-current.tar.gz https://github.com/Elijah-Bodden/Membrane/tarball/v1.0.5
  tar xfv Membrane-current.tar.gz --transform 's!^[^/]\+\($\|/\)!Membrane-current\1!'
  cd Membrane-current/src/source/frontend
  npm install
  cd ../server
  npm install
  npm run deploy
  rm ../../../../Membrane-current.tar.gz
  ```
  To kill the pm2 daemon created by `npm run deploy`, run `npm run kill`.
  
  However, although this demo functions, this does not mean it should be used in production. It is a quick-and-dirty demonstration of the library's promise, and is not made for any serious scalable production situation. quoting `./src/source/frontend`'s "`PLEASENOTE.md`", 
  >Excluding the included `lib` code, the vast majority of the code within this directory and its descendants should never see the light of serious production. It was hastily coded to fit its closed use case. This is nothing more than a demo of the library—far out-of-scope of this project's goal. Please do not treat it as a true part of Membrane. The project begins and ends at `lib`.  
TL;DR: This code is a great risk to the performance and stability of your frontend. Unlike `lib`, it was not intended as a viable product, and shouldn't be used like one.
### Custom Applications
Integrating the vanilla `lib` module in a custom use-case is relatively simple. Here is an overview of the typical integration process.
1. Clone `/lib/index.js`
2. (optionally) Modify `CONFIG.communication.configLoaderFunction` as needed in [this](https://github.com/Elijah-Bodden/Membrane#loading-custom-configurations) form.
3. (optionally) Create a `CONFIG.communication.routeAcceptHeuristic` either statically in `defaultConfig` or dynamically at runtime through `CONFIG.constants.configLoadFunction`. If you want to allow the user to explicitly accept certain routes, you can include an awaited async function which fetches user responses.
<!--List Break-->
At this stage, the script should be capable of standalone function. To verify, serve several instances of it into any relatively-recent `window`-based environment (i.e. a browser) with the server in `/src/source/server/`. If an instance's global `livePeers` variable contains at least one entry of the type `Object`, everything's working.  
Then:
- Use `negotiateAgnosticAuthRoute` on members of `Object.keys(networkMap.nodes)` to authenticate arbitrary nodes.
- Use `* Authenticated Peer *.standardSend("consumable", *arbitrary data*)` to send consumable data to authenticated peers.
- Define an output for consumable data with `onConsumableAuth((_dontUse, data) => {* useData *(data)})`.
- Provide initial connect and reconnect websocket urls in `CONFIG.serverLink`.
- Set up a signaling server with the appropriate endpoints and exchange methods (alternately, clone `/src/source/server` and run `npm install && npm run deploy` from within to use the server written for the demo)
## Contributing
Any and all contributions are greatly appreciated. If you want to see this project grow as much as I do, there are several ways to help. Firstly, if you see something you think you can improve within the code, please `fork` the repository and make a `pull` request once you have made any changes you'd like to see. If you just have an idea, or spot a bug, that's great too! In this case, please file an `issue` with a corresponding `bug` or `enhancement` tag. Oh, and if you like what you see here, please feel free to leave a star on the project, it would mean a ton to me.
## Authors
* **Elijah Bodden** - *Initial work* - [Elijah-Bodden](https://github.com/Elijah-Bodden)
## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Built With
- The core module - 100% [Vanilla.js](http://vanilla-js.com/)
- Frontend - Standard HTML/SCSS/JS, plus [Sigma.js](https://github.com/jacomyal/sigma.js)+[Graphology](https://github.com/graphology/graphology) to power the gorgeous network visualization graph (and a pinch of Font Awesome for icons)
- Backend - JS on [node](https://github.com/nodejs/node) using, most notably, [Winston Logger](https://github.com/winstonjs/winston) for logging and [WS](https://github.com/websockets/ws) as a WebSocket server
