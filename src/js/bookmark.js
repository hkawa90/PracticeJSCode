import { hashCode, isIterable } from 'local-util'

/**
 * Web StorageのlocalStorage
 * @see https://developer.mozilla.org/ja/docs/Web/API/Web_Storage_API
 */
export class LocalStorage {
    constructor() {
        if (!localStorage) {
            throw new Error('Not support localstorage')
        }
    }
    setObject(key, object) {
        localStorage.setItem(key, JSON.stringify(object))
    }
    set(key, value) {
        localStorage.setItem(key, value)
    }
    get(key) {
        let val = localStorage.getItem(key)
        let obj = undefined
        try {
            obj = JSON.parse(val.slice());
        } catch (e) {
            return val
        }
        return obj
    }
    remove(key) {
        localStorage.removeItem(key)
    }
}

/**
 * Bookmarkの管理。Bookmark情報はLocalStorageクラスで永続的に保存
 */
export class BookmarkManager {
    /**
     * コンストラクタ。localStorageがkey-value形式の保存となる
     *     ため、アプリ識別文字をkeyとして管理する
     * @param {string} appName アプリケーション識別文字列
     */
    constructor(appName) {
        if (!appName || (appName === "")) {
            throw new Error('BookmarkManager: appName is empty string.')
        }
        this.bookmark = null
        this.hash = null
        this.storage = new LocalStorage()
        this.appName = appName
    }
    init(option) {
        if (option.hash &&
            ((typeof option.hash) === 'string') &&
            ((typeof option.hash) === 'number')) {
            if (typeof option.hash === 'string') {
                this.hash = parseInt(option.hash)
            } else {
                this.hash = option.hash
            }
        } else if (option.doc && ((typeof option.doc) === 'string')) {
            this.hash = hashCode(option.doc)
        }
    }

    /**
     * アプリ単位で管理するブックマーク情報を得る
     * @returns アプリ単位で管理するブックマーク情報
     */
    getBookmarks() {
        return this.storage.get(this.appName)
    }
    /**
     * 文書(this.hash)に紐づくブックマーク情報を得る
     * @returns 文書に紐づくブックマーク情報
     */
    getBookmark() {
        if (!this.bookmark) {
            const allBookmark = this.getBookmarks()
            if (!allBookmark) {
                this.bookmark = {}
            } else {
                this.bookmark = allBookmark[this.hash]
            }
        }
        return this.bookmark
    }
    /**
     * ブックマークを保存する
     * @param {object} bmInfo ブックマーク情報
     */
    addBookmark(bmInfo) {
        let bookmarks = this.getBookmarks()
        if (!bookmarks) {
            bookmarks = {}
            bookmarks[this.hash] = []
        }
        bookmarks[this.hash].push(bmInfo)
        if (!this.bookmark || ((typeof this.bookmark) !== 'array')) {
            this.bookmark = []
        } else {
        }
        this.bookmark.push(bmInfo)
        this.storage.setObject(this.appName, bookmarks)
    }
    /**
     * 全ブックマーク情報削除
     */
    clrBookmarks() {
        this.storage.remove(this.appName)
        this.bookmark = null
    }
}

function addBookmarkItem(page, scroll, bookmark) {
    console.log('addBookmarkItem:', page)
    const list = document.getElementById('add-bookmark').querySelectorAll('.dropdown-item')
    console.log('addBookmarkItem:', list)
    // insert bookmark item
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.setAttribute('class', 'dropdown-item')
    a.setAttribute('href', '#')
    a.setAttribute('id', 'add-bookmark-item-' + list.length)
    a.innerText = 'P' + page + ':' + list.length
    li.appendChild(a)
    const ins = document.getElementById('bookmark-ins').after(li)
    if (bookmark) {
        bookmark.addBookmark({ secPage: page, scroll: scroll })
    }
}

export function buildBookmarkUI(bookmark) {
    const bookmarks = bookmark.getBookmark()
    console.log('build:', bookmarks)
    if (bookmarks && ((typeof bookmarks) === 'object') && isIterable(bookmarks)) {
        console.log('build:', bookmarks)
        for (const b of bookmarks) {
            console.log('build:', b)
            const page = b.secPage
            const scroll = b.scroll
            addBookmarkItem(page, scroll, null)
        }
    }
}

/**
 * bookmark追加buttonのイベントハンドラ. ページ位置をBookmarkManagerに登録する
 * @param {Element} targetElement bookmarkの対象となるElement.このElmentのscroll量とページを保持
 * @param {BookmarkManager} bookmark BookmarkManagerのインスタンス
 * @param {Element} clickElement クリックされたElement
 */
export function addBokmarkHandler(targetElement, bookmark, clickElement) {
    if (!bookmark || !clickElement) {
        return false
    }
    function jumpPage(page) {
        const elmList = document.querySelectorAll('.chap-item')
        for (const col of elmList) {
            if (col.dataset.chapterPage === page) {
                const event = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                })
                col.dispatchEvent(event)
                break
            }
        }
    }
    // FIXME: Can not scroll
    function setScroll(scroll) {
        console.log('setScroll:', scroll)
        console.log('setScroll:', targetElement)
        console.log('setScroll:', window)
        let target = (targetElement || window)
        setTimeout(() => {
            window.scrollTo(0, scroll)
        }, 300);
        document.removeEventListener('ChangeChapterEnded', setScroll)
    }
    const id = clickElement.getAttribute('id')
    if (!id) {
        return false
    }
    let itemNo = null
    let secPage = null

    const contentList = document.getElementById('CONTENTS').children
    if (!contentList) {
        return false
    }
    for (const col of contentList) {
        const style = col.getAttribute('style')
        if (!style || style === "") {
            const id = col.getAttribute('id')
            if (id) {
                secPage = id.slice("chap-content-".length)
            }
            break
        }
    }
    switch (id) {
        case 'add-bookmark-item':
            let scroll = (targetElement || window).scrollY
            addBookmarkItem(secPage, scroll, bookmark)
            break
        default:
            // Jump bookmark position
            itemNo = parseInt(id.substring('add-bookmark-item-'.length, id.length)) - 1
            let bookmarks = bookmark.getBookmark()
            if (bookmarks && bookmarks[itemNo]) {
                document.addEventListener('ChangeChapterEnded',
                    setScroll(bookmarks[itemNo].scroll))
                jumpPage(bookmarks[itemNo].secPage)
            }
            break
    }
    return false
}
// localStorage.getItem('PracticeJS')
// localStorage.removeItem('PracticeJS')