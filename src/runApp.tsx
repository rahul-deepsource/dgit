// Avoid error on Octokit
// This caused by node process.env
;(process as any).browser = true

// normalize
// import "normalize.css/normalize.css"

// global css
// import { injectGlobal } from "styled-components"

// // tslint:disable-next-line:no-unused-expression
// injectGlobal`
// select {
//   font-family: monospace;
// }

// textarea:focus,
// input:focus select:focus {
//   outline: none;
// }

// ::-webkit-scrollbar {
//   width: 5px;
// }

// ::-webkit-scrollbar-thumb {
//   background-color: rgba(0, 0, 50, .5);
//   border-radius: 0px;
//   box-shadow: 0 0 0 1px rgba(255, 255, 255, .3);
// }
// `

// import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
// import "@fortawesome/fontawesome-free/css/fontawesome.min.css"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { LoginModal } from "./ui/components/argit/LoginModal"

// // blueprint
// import "@blueprintjs/core/lib/css/blueprint.css"
// import "@blueprintjs/icons/lib/css/blueprint-icons.css"

// // contextify
// import "react-contexify/dist/ReactContexify.css"

import fs from "fs"
import * as git from "isomorphic-git"

// if (process.env.NODE_ENV !== "production") {
//   const g: any = global
//   g.git = git
//   g.fs = fs
// }

// Runner
import React from "react"
import ReactDOM from "react-dom"
import { App } from "./ui/components/App"
import { configureStore } from "./ui/store/configureStore"

export async function run(opts = {}) {
  // Run
  await Promise.all([loadBrowserFS()])

  // try {
  //   const {
  //     setupInitialRepository
  //   } = await import("./domain/git/commands/setupInitialRepository")
  //   await setupInitialRepository("/playground")
  // } catch (e) {
  //   // Skip
  //   console.error("init error", e)
  // }
  const { store, persistor } = configureStore()
  ReactDOM.render(<App />, document.querySelector(".root"))
}

// async function setupFonts() {
//   const font = new FontFace("Inconsolata", "url(/assets/Inconsolata.otf)")
//   const loadedFace = await font.load()
//   ;(document as any).fonts.add(loadedFace)
// }

async function loadBrowserFS() {
  return new Promise(resolve => {
    const BrowserFS = require("browserfs")
    BrowserFS.install(window)
    BrowserFS.configure({ fs: "IndexedDB", options: {} }, (err: any) => {
      if (err) {
        throw err
      }

      resolve()
    })
  })
}

// Do not use yet
function loadState() {
  return JSON.parse((window as any).localStorage["persist:@:0"])
}
