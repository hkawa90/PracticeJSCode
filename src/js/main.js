// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
import mermaid from "mermaid"
import hljs from 'highlight.js'

import { CodeMirrorRepl } from './CodeMirrorRepl'
import createDocFromMd from './CrtDoc'
import codeRepl from './codeRepl'
import { BookmarkManager, addBokmarkHandler, buildBookmarkUI } from './bookmark'

import '../scss/styles.scss'

// mermaid
mermaid.initialize({ startOnLoad: false })

document.addEventListener('DOMContentLoaded', async function () {
  // Error通知表示
  document.addEventListener('assertion', function (e) {
    const element = document.getElementById("MainDangerMessage")
    element.innerText = e.detail
    element.parentElement.classList.remove('d-none')
  }, false);

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

  /**
   * Create BookmarkManager and Initialize
   */
  const bookmark = new BookmarkManager('PracticeJS')

  if ((bookmark !== undefined) && (bookmark !== null) &&
    (bookInfo !== undefined) && (bookInfo !== null) &&
    (bookInfo.chapters !== undefined) && (bookInfo.chapters !== null) &&
    ((typeof bookInfo.chapters) === 'object') &&
    (bookInfo.chapters.length >= 1) &&
    (bookInfo.chapters[0].src !== undefined) && (bookInfo.chapters[0].src !== null) &&
    ((typeof bookInfo.chapters[0].src) === 'string')) {
    bookmark.init(bookInfo.chapters[0].src)
  }

  /**
   * Build bookmakr UI
   */
  buildBookmarkUI(bookmark)

  /**
  * bootstrapのdropdown
  * @description
  * bootstrapのdropdownのイベント処理は.dropdownのイベントhidden.bs.dropdownなどを使って
  *     行う。event.clickEvent.originalTargetで発生元を特定できるようだ。
  *     dropdownの項目にユニークなIDをつければそのID別に処理すればいいので、
  *     drpdownには１つのイベントリスナーで実現できる。
  */
  document.getElementById('add-bookmark').addEventListener('hidden.bs.dropdown', (evt) => {
    if (evt.clickEvent) {
      addBokmarkHandler(document.getElementById('CONTENTS'), bookmark, evt.clickEvent.originalTarget)
    }
    return false
  })
  document.addEventListener('beforeunload', () => {
    console.log('page transaction...')
    location.href = location.href.split('#')[0]
  })
})
