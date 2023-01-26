// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
import mermaid from "mermaid"
import hljs from 'highlight.js'

import { CodeMirrorRepl } from './CodeMirrorRepl'
import createDocFromMd from './CrtDoc'

import '../scss/styles.scss'

mermaid.initialize({ startOnLoad: false });

document.addEventListener('DOMContentLoaded', async function () {
  // MarkdownをHTMLへ
  const mdOptions = {
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartypants: false,
    xhtml: false
  }
  const bookInfo = await createDocFromMd(mdOptions)

  // JSコードを実行
  CodeMirrorRepl.createEditorFromSelector('.language-pjs', {
    lang: 'js',
    cmTheme: bookInfo.cmTheme, extScript: bookInfo.extScript
  })
  // HTMLのJSコードを実行
  CodeMirrorRepl.createEditorFromSelector('.language-phtml', {
    lang: 'HTML',
    cmTheme: bookInfo.cmTheme,
    extScript: bookInfo.extScript
  })
  // Event handling
  // window.addEventListener("repl-tracing", (event) => {
  // })
  // window.addEventListener("message", (event) => {
  //   console.log("event:", event)
  //   if (event.origin !== window.origin)
  //     return;
  //   const result_field = document.getElementById('result')
  //   if (result_field && event.data) {
  //     if ((event.data.type) && (event.data.type == 'logtrace')) {

  //     }
  //   }
  // }, false)
  // highlight
  document.querySelectorAll('pre code').forEach((el) => {
    const className = el.getAttribute('class')
    if (className) {
      const regex = /^language\-\w+$/g;
      const found = className.match(regex);
      if (found && (className != 'language-phtml') && (className != 'language-pjs') && (className != 'language-mermaid')) {
        hljs.highlightElement(el)
      }
    }
  })
})
