import { marked } from 'marked'
import * as DOMPurify from 'dompurify'
import mermaid from "mermaid"

export default async function createDocFromMd(mdOptions, dstElement = null, tocElement = null) {
    const toc = tocElement || document.getElementById('TOC')
    const content = dstElement || document.getElementById('CONTENTS')
    const mdOp = mdOptions || {}

    marked.setOptions(mdOp)

    async function getBookInfo() {
        async function fetchData(file) {
            const url = location.origin
            let r = fetch(url + file)
                .then((response) => {
                    if ((response) && (response.body)) {
                        return response.body.getReader().read();
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
                    console.log("Fetch error: ", e)
                })
            return r
        }
        const bookInfo = JSON.parse(await fetchData('/book.config.json'))
        if (bookInfo) {
            for (let i = 0; i < bookInfo.chapters.length; i++) {
                bookInfo.chapters[i].src = await fetchData(bookInfo.chapters[i].file)
            }
        }
        return bookInfo
    }
    const bookInfo = await getBookInfo()
    // parse markdown
    if (bookInfo) {
        // set page title
        document.getElementsByTagName('title')[0].innerText = bookInfo.title
        for (let i = 0; i < bookInfo.chapters.length; i++) {
            // insert markdown DOM
            const source = bookInfo.chapters[i].src.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "")
            const mdElement = document.createElement('div')
            mdElement.setAttribute('id', 'chap-' + i + '-content')
            if (i !== 0) {
                mdElement.setAttribute('style', 'display:none')
                mdElement.setAttribute('data-md-init', 'false')
            } else {
                // mermaidは`display:none`の要素配下にあるとエラーになる
                const me = mdElement.querySelectorAll('.language-mermaid')
                await mermaid.init(undefined, me)
                mdElement.setAttribute('data-md-init', 'true')
            }
            mdElement.innerHTML =
                DOMPurify.sanitize(marked.parse(source))
            content.appendChild(mdElement)
            // create TOC from DOM
            const headingList = mdElement.querySelectorAll('h1,h2,h3,h4,h5,h6')
            // create Chapter/TOC list on UI
            const chapLi = document.createElement('li')
            chapLi.setAttribute('class', 'mb-1')
            const chap = document.createElement('button')
            chap.setAttribute('class', 'btn btn-toggle align-items-center rounded')
            chap.setAttribute('data-bs-toggle', 'collapse')
            
            const secListHref = 'chap' + i + '-collapse'
            chap.setAttribute('data-bs-target', '#' + secListHref)
            chap.setAttribute('aria-expanded', 'true')
            const chapText = document.createElement('div')
            chapText.setAttribute('class', 'text-wrap text-break')
            chapText.setAttribute('style', "width:12rem;")
            chapText.setAttribute('data-chapter-page', i)
            chapText.innerText = bookInfo.chapters[i].name
            chapText.addEventListener('click', async (evt) => {
                const page = evt.target.dataset.chapterPage
                for (let p = 0; p < bookInfo.chapters.length; p++) {
                    const secListHref = 'chap' + p + '-collapse'
                    if (p.toString() === page) {
                        document.getElementById(secListHref).setAttribute('class', 'collapse show')
                        const chapPage = document.getElementById('chap-' + p + '-content')
                        chapPage.setAttribute('style', '')
                        if (chapPage.dataset.mdInit === "false") {
                            const me = chapPage.querySelectorAll('.language-mermaid')
                            await mermaid.init(undefined, me)
                            chapPage.dataset.mdInit = true
                        }
                    } else {
                        document.getElementById(secListHref).setAttribute('class', 'collapse')
                        document.getElementById('chap-' + p + '-content').setAttribute('style', 'display:none')
                    }
                }
            })            
            chap.appendChild(chapText)
            toc.appendChild(chapLi)
            chapLi.appendChild(chap)
            // create section
            const secList = document.createElement('div')
            secList.setAttribute('class', 'collapse')
            secList.setAttribute('id', secListHref)
            secList.setAttribute('style', '')
            chapLi.appendChild(secList)
            const secUl = document.createElement('ul')
            secUl.setAttribute('class', 'btn-toggle-nav list-unstyled fw-normal pb-1 small')
            secList.appendChild(secUl)
            // create section -- TOC
            for (const item of headingList.entries()) {
                const ul = document.createElement('li')
                const anchor = document.createElement('a')
                anchor.setAttribute('href', '#' + item[1].getAttribute('id'))
                anchor.setAttribute('class', 'link-dark rounded text-wrap text-break')
                anchor.setAttribute('style', 'width:10rem;')
                anchor.innerText = item[1].getAttribute('id')
                ul.append(anchor)
                secUl.appendChild(ul)
            }
        }
    }
}