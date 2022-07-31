/*
* Prefixed by https://autoprefixer.github.io
* PostCSS: v8.4.14,
* Autoprefixer: v10.4.7
* Browsers: > 0.25%,not dead
*/

@use "sass:color";

$right-panel-pane-transition: transform 1s cubic-bezier(0.4, 0, 0.6, 1);
* {
  font-family: Cantarell, Roboto, Oxygen, Ubuntu, "Open Sans", "Helvetica Neue",
    sans-serif, serif;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  transition: width 0s, height 0s, -webkit-filter 0s;
  transition: filter 0s, width 0s, height 0s;
  transition: filter 0s, width 0s, height 0s, -webkit-filter 0s;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

h1,
.h1 {
  font-size: calc(1.375rem + 1.5vw);
}

body {
  height: 100%;
  overflow: hidden;
  margin: 0;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.message-card {
  margin-top: 2px;
  will-change: transform;
  z-index: 10;
  transition: -webkit-transform 0.5s cubic-bezier(0.54, 0.78, 1, 0.77);
  transition: transform 0.5s cubic-bezier(0.54, 0.78, 1, 0.77);
  transition: transform 0.5s cubic-bezier(0.54, 0.78, 1, 0.77), -webkit-transform 0.5s cubic-bezier(0.54, 0.78, 1, 0.77);
  position: relative;
  width: 90%;
  overflow-wrap: break-word;
  padding-left: 15px;
  padding-top: 15px;
  padding-bottom: 10px;
  padding-right: 3em;
  border-radius: 15px 15px 15px 15px;
  background-color: #fefefe;
  box-shadow: rgba(0, 0, 0, 0.3) 9px 9px 8px -12px;
  border: 1px #dee2e6 solid;
}

.setting-card {
  width: 100%;
  overflow-wrap: break-word;
  padding-left: 15px;
  padding-top: 15px;
  padding-bottom: 10px;
  padding-right: 3em;
  border-radius: 0px;
  background-color: #fefefe;
  border: 2px #dee2e6 solid;
  border-left: 0px;
  border-top: 0px;
}

.message-entry-bar {
  box-sizing: border-box;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  max-height: 17.63125em;
  flex-grow: 1;
  border: 1px solid #dee2e6 !important;
  position: fixed;
  overflow-wrap: break-word;
  padding-left: 15px;
  padding-top: 15px;
  border-radius: 15px 15px 15px 15px;
  box-shadow: inset rgba(0, 0, 0, 0.2) 6px 6px 12px -6px;
  margin-top: 0vh;
  margin-bottom: 0.6em;
  margin-left: 1.5vw;
  margin-right: 1.5vw;
  position: relative;
  scrollbar-width: none;
  overflow: scroll;
  resize: none;
  -ms-overflow-style: scrollbar;

  &:focus-within {
    border: 1px solid #9c9fa1 !important;
  }
}

#chatEntryField {
  width: calc(100% - 3vw);
  font-size: 0.9em;
  max-height: -webkit-fit-content;
  max-height: -moz-fit-content;
  max-height: fit-content;
  margin-top: 0vh;
  margin-bottom: 0vh;
  margin-left: 0.3vw;
  margin-right: 0.6vw;
  scrollbar-width: none;
  border: none;
  resize: none;
  background-color: transparent;
  &:focus {
    outline: none;
  }
}

.message-card-unread {
  width: 90%;
  overflow-wrap: break-word;
  padding-left: 15px;
  padding-top: 15px;
  padding-bottom: 10px;
  padding-right: 3em;
  border-radius: 15px 15px 15px 15px;
  box-shadow: rgba(0, 0, 0, 0.3) 9px 9px 8px -12px;
  border: 1px #b3b1b1 solid;
  background-color: #e4f5e3;
}

.message-card-local {
  margin-left: 10%;
  margin-right: 0px;
}

.message-card-remote {
  margin-left: 0px;
  margin-right: 10%;
}

.border-surround {
  border: 1px solid #dee2e6 !important;
}

.button-invis {
  position: relative;
  padding: 0px;
  margin: 0px;
  background: transparent;
  border: none !important;
}

.smoothbutton {
  box-shadow: rgba(0, 0, 0, 0.3) 1px 1px 2px -1px;
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 3px;
  overflow-wrap: break-word;
  border-radius: 8px 8px 8px 8px;
  background-color: #fefefe;
  border: 2px #dee2e6 solid;
}

li {
  list-style: none;
}

.connection-kebab {
  color: black;

  &:active {
    color: rgb(100, 100, 100);
  }
}

.context-item {
  width: 100%;
  z-index: inherit;
  position: relative;
}

.context-button:hover {
  z-index: inherit;
  background-color: whitesmoke;
}

.context-button {
  font-size: 1em;
  z-index: inherit;
  color: inherit;
  outline: none;
  border: 0;
  padding: 4px 4px;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: left;
  position: relative;
  background-color: rgb(255, 255, 255);
}

.context-button.context-cap {
  border-radius: 4px 4px 0px 0px;
}

.context-button.context-terminus {
  border-radius: 0px 0px 4px 4px;
}

.search-entry-bar {
  z-index: 100;
  box-sizing: border-box;
  height: 2.5em;
  border: 1px solid #dee2e6 !important;
  position: fixed;
  overflow-wrap: break-word;
  padding-left: 7px;
  padding-top: 7px;
  padding-right: 7px;
  border-radius: 1.25em 1.25em 1.25em 1.25em;
  box-shadow: inset rgba(0, 0, 0, 0.2) 6px 6px 12px -6px;
  margin-top: 0.6rem;
  margin-left: 0.4vw;
  margin-right: 0.4vw;
  position: relative;
  scrollbar-width: none;
  resize: none;
  -ms-overflow-style: scrollbar;

  &:focus-within {
    border: 1px solid #9c9fa1 !important;
  }
}

#searchEntryField {
  z-index: 98;
  width: 100%;
  font-size: 0.9em;
  height: 2em;
  max-height: 2em;
  margin-top: 0vh;
  margin-bottom: 0.2vh;
  margin-left: 0.2vw;
  margin-right: 0.5vw;
  scrollbar-width: none;
  border: none;
  resize: none;
  white-space: nowrap;
  background-color: transparent;

  &:focus {
    outline: none;
  }
}

#search-opts {
  display: flex;
  visibility: hidden;
  margin-left: 7px;
  margin-right: 7px;
  top: -1.25em;
  width: calc(100% - 14px);
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  max-height: 11.75em;
  z-index: 99;
  position: relative;
  flex-direction: column;
  background-color: rgb(255, 255, 255);
  border-radius: 4px 4px 4px 4px;
  overflow: scroll;
}

.search-opts-cap {
  padding-top: 1.25em;
}

.context-button:focus {
  background-color: whitesmoke;
}

#connectedNodesPane {
  display: flex;
  flex-direction: column;
  left: 0%;
  width: 20%;
  margin-top: 1em;
  top: calc(50vh + 2.5em + 1vh);
  position: fixed;
  z-index: 98;
  height: calc(50vh - 2.5em - 1vh);
  border-bottom: 1px solid #dee2e6 !important;
  border-top: 1px solid #c7c9ca !important;
  overflow: scroll;
  outline: none;
}

.bg-white {
  background-color: white;
}

.bg-light {
  background-color: #f8f9fa;
}

.border-bottom {
  border-bottom: 1px solid #dee2e6 !important;
}

.list-group-item:last-child {
  border-bottom-right-radius: inherit;
  border-bottom-left-radius: inherit;
}

.list-group-item:first-child {
  padding: 1rem;
  display: flex;
  align-items: baseline;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.list-group-item {
  position: relative;
  display: block;
  padding: 1rem;
  text-decoration: none;
  border: 1px solid rgba(0, 0, 0, 0.125);
  color: #636464;
  background-color: #fefefe;

  &:hover {
    background-color: whitesmoke;
  }
}

.list-group {
  display: flex;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
  border-radius: 0px;
}

.border-no-left {
  border-left: transparent !important;
  border-top: 1px solid #d9dde0 !important;
  border-right: 1px solid #d9dde0 !important;
  border-bottom: 1px solid #d9dde0 !important;
}

.sendbutton {
  font-size: 2.1em;
  position: fixed;
  bottom: 0.4em;
  color: rgba(44, 44, 44, 0.76);
  padding: 0.2em;
  margin: -0.2em;
  z-index: 100;
  cursor: pointer;

  &:active {
    color: rgba(95, 95, 95, 0.76);
  }
}

.carved-element {
  background-color: ghostwhite !important;
}

.no-hover:hover {
  background-color: #fefefe;
}

.icon-container {
  padding-right: 5%;
  padding-bottom: 4px;
  cursor: default;
  right: 0%;
  position: absolute;
  bottom: 0px;
}

.icon {
  cursor: pointer;
}

.nav-header {
  padding-top: 0.2em !important;
  color: rgb(29, 29, 29);
  text-align: left;
  font-size: 2em;
}

.context {
  height: auto;
  z-index: 100;
  height: auto;
  visibility: hidden;
  z-index: 100;
  display: flex;
  position: absolute;
  flex-direction: column;
  background-color: rgb(255, 255, 255);
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.568) 9px 9px 8px -12px;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
}

.graph-container-container {
  overflow: hidden;
  position: absolute;
  height: 100%;
  z-index: -10;
}

#graphContainer {
  background-color: transparent;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: -5;
}

.kebab {
  cursor: pointer;
  position: relative;
  font-size: 1.25em;
  padding: 0.5em 0.75em 0.5em 0.75em;
  margin: -0.5em -0.75em -0.5em -0.75em;
  z-index: 1;

  &:active {
    color: rgb(100, 100, 100);
  }
}

.post-kebab {
  left: 105%;
}

.card-text {
  position: relative;
  top: -0.5em;
}

.date {
  font-size: 0.75em;
  color: gray;
}

.nodeCardText {
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  margin-top: -0.1em;
}

.connection-kebab {
  right: 0.8em;
  position: absolute;
}

.nav-header {
  max-height: 3.6rem;
  overflow: hidden;
}

#init-blur-wrapper {
  height: 100vh;
  width: 100vw;
}

#aliasEntryWrapper {
  max-width: 35%;
  max-height: 50%;
  overflow: auto;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  margin: auto;
  -webkit-transform: translateY(-20%);
          transform: translateY(-20%);
  z-index: 1000001;
  position: absolute;
  visibility: hidden;
  border-radius: 15px 15px 15px 15px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.336) 18px 18px 16px -24px;
  border: 1px #c7cace solid;
}

#pcuid {
  background-color: white;
}

#graphContainer {
  background-color: inherit;
}

.aliasEntryForm {
  margin: 6%;
  font-size: 1.04em;
  position: relative;
}

.aliasEntryArea {
  flex-grow: 1;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  max-width: auto;
  width: auto;
  border: 1px solid #dee2e6 !important;
  position: relative;
  padding-left: 5px;
  border-radius: 15px 15px 15px 15px;
  box-shadow: inset rgba(0, 0, 0, 0.2) 6px 6px 12px -6px;
  position: relative;
  scrollbar-width: none;
  overflow-x: scroll;
  resize: none;
  -ms-overflow-style: scrollbar;
  &:focus-within {
    border: 1px solid #9c9fa1 !important;
  }
}

#aliasEntryField {
  width: 100%;
  font-size: 0.9em;
  height: 2.2em;
  padding-top: 7px;
  margin-top: 0vh;
  margin-bottom: 0vh;
  margin-left: 0.3vw;
  margin-right: 0.6vw;
  scrollbar-width: none;
  border: none;
  resize: none;
  background-color: transparent;
  &:focus {
    outline: none;
  }
  white-space: nowrap;
}

#aliasEntryButton {
  font-size: 0.9em;
  border-radius: 10px;
  margin-left: 15px;
  flex-grow: 0;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.527) 9px 9px 8px -12px;

  &:hover {
    background-color: #fafafa;
  }

  &:active {
    background-color: rgb(243, 243, 243);
  }
}

.aliasInputWrapper {
  margin-top: 1.3em;
  display: flex;
  flex-direction: row;
}

.connectedNodeCard {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  text-decoration: none;
  position: relative;
  border-right: 1px solid #d9dde0 !important;
  border-left: 1px solid #d9dde0 !important;
  border-bottom: 1px solid #d9dde0 !important;
  border-top: none;
  color: #1f1f1f;
  background-color: #fefefe;
  padding: 0.7rem;
  padding-bottom: 0em;

  &:hover {
    color: #494b4b;
  }

  &:active:not(:focus-within) {
    background-color: rgb(240, 240, 240);
  }
}

.message-card-transient {
  margin-top: 2px;
  margin-left: 2px;
  margin-right: 2px;
  z-index: 10;
  position: relative;
  width: calc(100% - 4px);
  overflow-wrap: break-word;
  padding-left: 15px;
  padding-top: 24px;
  padding-bottom: 10px;
  padding-right: 3em;
  border-radius: 15px 15px 15px 15px;
  box-shadow: rgba(0, 0, 0, 0.3) 9px 9px 8px -12px;
}

.system-message-card-error {
  background-color: rgb(253, 241, 241);
  border: 1px rgb(212, 179, 179) solid;
}

.system-message-card-success {
  background-color: rgb(243, 253, 241);
  border: 1px rgb(181, 212, 179) solid;
}

.system-message-card-route-pending {
  background-color: rgb(241, 245, 253);
  border: 1px rgb(179, 192, 212) solid;
}

.message-card-slim {
  padding-right: 15px;

  & > i {
    visibility: hidden;
    position: absolute;
  }

  & > .date {
    margin-top: 2px;
  }
}

.align-center {
  & > * {
    text-align: center;
  }
}

.toggle {
  -webkit-appearance: none;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  height: 28px;
  width: 52px;
  border-radius: 16px;
  margin: 0;
  background-color: white;
  border: 1px solid #babec2 !important;
  transition: all 0.2s ease;

  &:after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: rgb(226, 226, 248);
    border: 1px solid #babec2 !important;
    transition: -webkit-transform 0.2s ease-in-out;
    transition: transform 0.2s ease-in-out;
    transition: transform 0.2s ease-in-out, -webkit-transform 0.2s ease-in-out;
  }

  &:focus {
    outline: 0;
  }

  &:checked {
    background-color: rgb(226, 226, 248);

    &:after {
      background-color: white;
      -webkit-transform: translatex(20px);
              transform: translatex(20px);
    }
  }
}

.aboutHeader {
  border-bottom: 1px solid #dee2e6 !important;
  margin-top: 0.5em;
  padding-bottom: 0.5em;
  font-size: 1.4em;
  text-align: center;
}

#aboutBody {
  background-color: white;
  height: calc(100vh - 3em);
  position: relative;
  overflow-y: auto;
  text-align: center;
  margin: 0.9em;
}

.configHeader {
  border-bottom: 1px solid #dee2e6 !important;
  margin-top: 0.5em;
  padding-bottom: 0.5em;
  font-size: 1.4em;
  text-align: center;
}

#configBody {
  display: flex;
  flex-direction: column;
  background-color: white;
  height: calc(100vh - 3em);
  position: relative;
  overflow-y: auto;
}

.configCardBool {
  padding: 0.5em;
  width: 100%;
  position: relative;
  border: 1px solid #dee2e6 !important;
  height: auto;
  display: flex;
  align-items: top;
  flex-direction: row;
}

.configText {
  width: 100%;
  padding-right: 1em;
}

.settingsToggle {
  position: relative;
  right: 0px;
}

.configTextDescription {
  color: #555555;
  visibility: hidden;
  position: absolute;
  font-size: 0.8em;
}

.fa-circle-info:active {
  color: #636363;
}

.configCardInt {
  padding: 0.5em;
  width: 100%;
  position: relative;
  border: 1px solid #dee2e6 !important;
  height: auto;
  display: flex;
  align-items: top;
  flex-direction: row;
}

.integerEntryContainer {
  width: 6em;
  z-index: 100;
  box-sizing: border-box;
  height: 2em;
  border: 1px solid #dee2e6 !important;
  position: fixed;
  padding-top: 4px;
  border-radius: 1.25em 1.25em 1.25em 1.25em;
  box-shadow: inset rgba(0, 0, 0, 0.2) 6px 6px 12px -6px;
  position: relative;
  scrollbar-width: none;
  resize: none;
  -ms-overflow-style: scrollbar;

  &:focus-within {
    border: 1px solid #9c9fa1 !important;
  }
}

.integerEntryContainer-wide {
  width: 9em;
}

.integerEntryField {
  z-index: 98;
  width: 100%;
  font-size: 0.9em;
  height: 2em;
  max-height: 2em;
  margin-top: 0vh;
  margin-bottom: 0.2vh;
  margin-right: 0.5vw;
  scrollbar-width: none;
  border: none;
  resize: none;
  white-space: nowrap;
  background-color: transparent;
  text-align-last: center;
  text-align: justify;

  &:focus {
    outline: none;
  }
}

.fa-repeat {
  right: 0%;
  position: absolute;
  padding-right: 0.5em;

  &:active {
    color: rgb(110, 110, 110);
  }
}

.configFootnote {
  color: #555555;
  font-size: 0.8em;
  text-align: center;
  position: relative;
  margin-top: 1em;
  padding-bottom: 7px;
}

.underline {
  text-decoration: underline;
  position: unset;
}

.fa-circle-info {
  margin-left: 3px;
}

.routePendingButtonContainer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 4px;
}

.routePendingButton {
  border-radius: 10px;
  font-size: 0.9em;
  border-radius: 20px;
  margin-top: -0.7em;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 5px;
  margin-right: 5px;
  padding-top: 4px;
  padding-bottom: 4px;

  &:active {
    -webkit-filter: brightness(95%);
            filter: brightness(95%);
  }
}

.routeRejectButton {
  background-color: rgb(253, 241, 241);
  border: 1px rgb(212, 179, 179) solid;
}

.routeAcceptButton {
  background-color: rgb(243, 253, 241);
  border: 1px rgb(181, 212, 179) solid;
}

.colorDot {
  width: 0.7em;
  height: 0.7em;
  position: absolute;
  visibility: hidden;
  display: inline-block;
  border-radius: 50%;
}

#error-dot {
  background-color: rgb(253, 241, 241);
  border: 1px rgb(212, 179, 179) solid;
}

#pending-dot {
  background-color: rgb(241, 245, 253);
  border: 1px rgb(179, 192, 212) solid;
}

#success-dot {
  background-color: rgb(243, 253, 241);
  border: 1px rgb(181, 212, 179) solid;
}

#notificationsLink {
  display: flex;
  align-items: last baseline;
}

#colorDotContainer {
  margin-left: 6px;
}

.chattingwithheader {
  min-height: 1em;
  color: #494b4b;
  padding-bottom: 0.2rem;
  text-align: center;
  font-size: 1.2rem;
  padding-top: 0.4rem;
}

.banner {
  margin-right: 0.3em;
  -o-object-fit: contain;
     object-fit: contain;
  width: auto;
  height: 2.7rem;
}

.force-noAnimation {
  transition: none !important;
}
.leftnav {
  border-radius: 0px 15px 15px 0px;
  background-color: rgba(white, 1) !important;
  box-shadow: rgba(0, 0, 0, 0.3) 9px 9px 8px -10px;
  min-height: 50%;
  max-height: 50%;
  position: fixed;
  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  /*border: 2px rgba(255,255,255,0.4) solid;*/
}
.rightnav {
  border-radius: 15px 0px 0px 15px; /*NOTE: Corner rounding looks rather ridiculous with enclosed pane translation*/
  background-color: rgba(white, 1) !important;
  box-shadow: rgba(0, 0, 0, 0.3) 8px 8px 16px -8px;
  width: 25%;
  min-height: 100%;
  max-height: 100%;
  position: fixed;
  scrollbar-width: none;
  overflow: scroll;
  -ms-overflow-style: none;
  /*border: 2px rgba(255,255,255,0.4) solid;*/
}
.mobilenav {
  border-radius: 0px 0px 0px 0px;
  background-color: rgba(white, 1) !important;
  box-shadow: rgba(0, 0, 0, 0.3) 8px -8px 16px -8px;
  z-index: 1;
  width: 100%;
  min-height: 10%;
  max-height: 10%;
  position: fixed;
  scrollbar-width: none;
  -ms-overflow-style: none;
  /*border: 2px rgba(255,255,255,0.4) solid;*/
}
.messagefeed {
  display: flex;
  flex-direction: column-reverse;
  transition: inherit;
  flex-grow: 0;
  top: 0%;
  padding: 2px;
  border-radius: 15px 15px 15px 15px;
  box-shadow: inset rgba(0, 0, 0, 0.2) 8px 8px 16px -8px;
  margin-top: 0px;
  margin-bottom: 0.6rem;
  margin-left: 1.5vw;
  margin-right: 1.5vw;
  position: relative;
  scrollbar-width: none;
  overflow: scroll;
  -ms-overflow-style: scrollbar;
  height: 90vh;
  width: 22vw;
  overflow-x: hide !important;
}
.IDpane {
  top: 100vh;
  transition: $right-panel-pane-transition;
  height: 94vh;
  width: 22vw;
  -webkit-transform: translate3d(0px, 0vh, 0px);
          transform: translate3d(0px, 0vh, 0px);
  margin-top: 1.8vh;
  margin-bottom: 1vh;
  margin-left: 1.5vw;
  margin-right: 1.5vw;
  position: fixed;
  scrollbar-width: none;
  overflow: scroll;
  -ms-overflow-style: scrollbar;
}

.messageFeedPane {
  will-change: transform;
  transition: $right-panel-pane-transition;
  display: flex;
  flex-direction: column;
  -webkit-transform: translate3d(0px, 0vh, 0px);
          transform: translate3d(0px, 0vh, 0px);
  position: fixed;
  scrollbar-width: none;
  border-radius: 15px 0px 0px 15px; /*NOTE: Corner rounding looks rather ridiculous with enclosed pane translation*/
  background-color: rgba(white, 1) !important;
  width: 25%;
  min-height: 100%;
  max-height: 100%;
  position: fixed;
  -ms-overflow-style: none;
}

#messageSequence {
  display: flex;
  flex-direction: column-reverse;
}

#systemEventSequence {
  display: flex;
  flex-direction: column-reverse;
}

.configpane {
  top: 100vh;
  display: flex;
  flex-direction: column;
  -webkit-transform: translate3d(0px, 0vh, 0px);
          transform: translate3d(0px, 0vh, 0px);
  transition: $right-panel-pane-transition;
  position: fixed;
  scrollbar-width: none;
  border-radius: 15px 0px 0px 15px; /*NOTE: Corner rounding looks rather ridiculous with enclosed pane translation*/
  background-color: rgba(white, 1) !important;
  width: 25%;
  min-height: 100%;
  max-height: 100%;
  position: fixed;
  overflow: scroll;
  -ms-overflow-style: none;
}

.aboutpane {
  top: 100vh;
  display: flex;
  flex-direction: column;
  -webkit-transform: translate3d(0px, 0vh, 0px);
          transform: translate3d(0px, 0vh, 0px);
  transition: $right-panel-pane-transition;
  position: fixed;
  scrollbar-width: none;
  border-radius: 15px 0px 0px 15px; /*NOTE: Corner rounding looks rather ridiculous with enclosed pane translation*/
  background-color: rgba(white, 1) !important;
  width: 25%;
  min-height: 100%;
  max-height: 100%;
  position: fixed;
  overflow: scroll;
  -ms-overflow-style: none;
}

.nodebar {
  top: 50%;
  min-height: 49.9%;
  max-height: 49.9%;
  overflow: -moz-hidden-unscrollable;
  overflow: hidden;
}

a.icon:link,
a.icon:visited,
a.icon:hover,
a.icon:focus {
  color: inherit;
}

a.icon.fa-brands:active,
a.icon.fa-regular:active {
  color: inherit;
  -webkit-filter: brightness(3);
          filter: brightness(3);
}

a {
  text-decoration: none;
}

.systemEventPane {
  top: 100vh;
  display: flex;
  flex-direction: column;
  -webkit-transform: translate3d(0px, 0vh, 0px);
          transform: translate3d(0px, 0vh, 0px);
  transition: $right-panel-pane-transition;
  position: fixed;
  scrollbar-width: none;
  border-radius: 15px 0px 0px 15px; /*NOTE: Corner rounding looks rather ridiculous with enclosed pane translation*/
  background-color: rgba(white, 1) !important;
  width: 25%;
  min-height: 100%;
  max-height: 100%;
  position: fixed;
  overflow: scroll;
  -ms-overflow-style: none;
}

#systemEventFeed {
  margin-top: 1em;
  margin-bottom: 1em;
  height: 100vh;
}

.rightnav {
  width: 25%;
  left: 75%;
}
.mobilenav {
  display: none;
  bottom: -20%;
}
.leftnav {
  width: 20%;
  left: 0%;
}
.graph-container-container {
  left: calc(20% - 15px);
  width: calc(55% + 15px);
}
#npclose {
  padding: 0px;
  font-size: 1.5em;
}
.newpostformactive {
  width: 40%;
}
#icon-separator {
  width: 15px;
}

.fatalBody {
  margin: 6%;
  font-size: 1.04em;
  position: relative;
  text-align: left;
}

.fatalWrapper {
  max-width: 35%;
  max-height: 75%;
  overflow: auto;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  margin: auto;
  -webkit-transform: translateY(-20%);
          transform: translateY(-20%);
  z-index: 1000001;
  position: absolute;
  visibility: hidden;
  border-radius: 15px 15px 15px 15px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.336) 18px 18px 16px -24px;
  border: 1px #c7cace solid;
  -ms-overflow-style: unset;
  scrollbar-width: unset;
  &::-webkit-scrollbar {
    display: unset;
  }
}

.center {
  text-align: center;
}
