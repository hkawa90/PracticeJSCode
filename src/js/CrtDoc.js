import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import mermaid from "mermaid"
//import { loadFront } from "yaml-front-matter"
import codeRepl from './codeRepl'
import { assertEvent, isValidHttpUrl } from './util'

export default async function createDocFromMd(mdOptions, dstElement = null, tocElement = null) {
    const toc = tocElement || document.getElementById('TOC')
    const content = dstElement || document.getElementById('CONTENTS')
    let mdOp = mdOptions || {
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartypants: false,
        xhtml: false
    }

    async function getBookInfo() {
        async function fetchData(file) {
            let url = ""
            if (isValidHttpUrl(file)) {
                url = file
            } else {
                url = document.location.href.split('#')[0] + file
            }
            let r = fetch(url, { mode: 'cors' })
                .then((response) => {
                    // console.log('HTTP Response:', response)
                    if ((response) && (response.body) && (response.ok)) {
                        return response.body.getReader().read()
                    } else {
                        return Promise.reject(
                            new Error(`Rresponse data is nil.`),
                        );
                    }
                })
                .then((body_data) => {
                    if (body_data) {
                        const decoder = new TextDecoder();
                        const r = decoder.decode((body_data).value)
                        return r
                    }
                })
                .catch((e) => {
                    throw e
                })
            return r
        }
        let bookInfo = null
        try {
            bookInfo = JSON.parse(await fetchData('/book.config.json'))
        } catch (e) {
            // do nothing
        }
        if (bookInfo) {
            for (let i = 0; i < bookInfo.chapters.length; i++) {
                if (bookInfo.express && bookInfo.express.convert_markdown) {
                    if (bookInfo.express.convert_markdown === true) {
                        try {
                            bookInfo.chapters[i].html = await fetchData(bookInfo.chapters[i].file.replace(/\.[^/.]+$/, ".html"))
                        } catch (e) {
                            bookInfo.chapters[i].src = await fetchData(bookInfo.chapters[i].file)
                        }        
                    }
                }
                if (!bookInfo.chapters[i].src) {
                    bookInfo.chapters[i].src = await fetchData(bookInfo.chapters[i].file)
                }
            }
        }
        return bookInfo
    }
    function loadCSS(css) {
        if (css) {
            const head = document.getElementsByTagName('head')[0];
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = css;
            link.media = 'all';
            head.appendChild(link);
        }
    }
    const bookInfo = await getBookInfo()
    // parse markdown
    if (bookInfo) {
        if (bookInfo.style) {
            loadCSS(bookInfo.style)
        }
        if (bookInfo.markedOptions) {
            mdOp = { ...bookInfo.markedOptions, ...mdOp }
        }

        marked.setOptions(mdOp)
        // set page title
        document.getElementsByTagName('title')[0].innerText = bookInfo.title
        for (let i = 0; i < bookInfo.chapters.length; i++) {
            let source = null

            const mdElement = document.createElement('div')
            mdElement.setAttribute('id', 'chap-content-' + i)
            if (i !== 0) {
                mdElement.setAttribute('style', 'display:none')
                mdElement.setAttribute('data-md-init', 'false')
            } else {
                // mermaidは`display:none`の要素配下にあるとエラーになる
                const me = mdElement.querySelectorAll('.language-mermaid')
                await mermaid.init(undefined, me)
                mdElement.setAttribute('data-md-init', 'true')
            }
            // insert markdown DOM
            if (bookInfo.chapters[i].html) {
                mdElement.innerHTML = bookInfo.chapters[i].html
            } else {
                source = bookInfo.chapters[i].src.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "")
                mdElement.innerHTML =
                    DOMPurify.sanitize(marked.parse(source))
            }
            content.appendChild(mdElement)
            // create TOC from DOM
            const headingList = mdElement.querySelectorAll('h1,h2,h3,h4,h5,h6')
            // create Chapter/TOC list on UI
            const chapLi = document.createElement('li')
            chapLi.setAttribute('class', 'mb-1')
            const chap = document.createElement('button')
            chap.setAttribute('class', 'btn btn-toggle align-items-center rounded')
            chap.setAttribute('data-bs-toggle', 'collapse')

            const secListHref = 'chap-collapse-' + i
            chap.setAttribute('data-bs-target', '#' + secListHref)
            chap.setAttribute('aria-expanded', 'true')
            const chapText = document.createElement('div')
            chapText.setAttribute('class', 'text-wrap text-break text-start chap-item')
            chapText.setAttribute('style', "width:12rem;")
            chapText.setAttribute('data-chapter-page', i)
            chapText.innerText = bookInfo.chapters[i].name
            chapText.addEventListener('click', async (evt) => {
                // Auto-run指定あるコードを実行する
                function runCode(element, selector) {
                    const p = element.querySelectorAll(selector)
                    for (const e of p) {
                        if (e.dataset.autoRun) {
                            const editor = codeRepl[e.getAttribute('id')]
                            if (editor) {
                                editor.dispatchRun()
                            }
                        }
                    }
                }
                const page = evt.target.dataset.chapterPage
                for (let p = 0; p < bookInfo.chapters.length; p++) {
                    const secListHref = 'chap-collapse-' + p
                    if (p.toString() === page) {
                        document.getElementById(secListHref).setAttribute('class', 'collapse show')
                        const chapPage = document.getElementById('chap-content-' + p)
                        chapPage.removeAttribute('style')
                        if (chapPage.dataset.mdInit === "false") {
                            // mermaid
                            const me = chapPage.querySelectorAll('.language-mermaid')
                            await mermaid.init(undefined, me)
                            // JS Code
                            runCode(chapPage, '.language-pjs')
                            runCode(chapPage, '.language-phtml')
                            chapPage.dataset.mdInit = true
                        }
                    } else {
                        document.getElementById(secListHref).setAttribute('class', 'collapse')
                        document.getElementById('chap-content-' + p).setAttribute('style', 'display:none')
                    }
                }
                // Dispatch completion event
                let cevent = new CustomEvent('ChangeChapterEnded')
                document.dispatchEvent(cevent)
            })
            chap.appendChild(chapText)
            toc.appendChild(chapLi)
            chapLi.appendChild(chap)
            // create section
            const secList = document.createElement('div')
            secList.setAttribute('class', 'collapse')
            secList.setAttribute('id', secListHref)
            secList.removeAttribute('style')
            chapLi.appendChild(secList)
            const secUl = document.createElement('ul')
            secUl.setAttribute('class', 'btn-toggle-nav list-unstyled fw-normal pb-1 small')
            secList.appendChild(secUl)
            // create section -- TOC
            for (const item of headingList.entries()) {
                const ul = document.createElement('li')
                const anchor = document.createElement('a')
                anchor.setAttribute('href', '#' + item[1].getAttribute('id'))
                anchor.setAttribute('class', 'link-dark rounded text-wrap text-break ms-4')
                anchor.setAttribute('style', 'width:10rem;')
                anchor.innerText = item[1].getAttribute('id')
                ul.append(anchor)
                secUl.appendChild(ul)
            }
        }
    }
    return bookInfo
}