// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
import mermaid from "mermaid"
import hljs from 'highlight.js'

import { CodeMirrorRepl } from './CodeMirrorRepl'
import createDocFromMd from './CrtDoc'
import codeRepl from './codeRepl'

import '../scss/styles.scss'

// mermaid
mermaid.initialize({ startOnLoad: false })

document.addEventListener('DOMContentLoaded', async function () {
  // MarkdownをHTMLへ
  const bookInfo = await createDocFromMd()

  // JSコードを実行
  CodeMirrorRepl.createEditorFromSelector('.language-pjs', {
    lang: 'js',
    cmTheme: bookInfo.cmTheme, extScript: bookInfo.extScript
  }, codeRepl)
  // HTMLのJSコードを実行
  CodeMirrorRepl.createEditorFromSelector('.language-phtml', {
    lang: 'HTML',
    cmTheme: bookInfo.cmTheme,
    extScript: bookInfo.extScript
  }, codeRepl)

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
  document.addEventListener('assertion', function (e) {
    const element = document.getElementById("MainDangerMessage")
    element.innerText = e
    element.parentElement.classList.remove('d-none')
  }, false);

})
