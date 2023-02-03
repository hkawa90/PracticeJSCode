import { LocalStorage, BookmarkManager } from "./bookmark.js"
// const LocalStorage = require('LocalStorage')
// const expect = chai.expect
// const should = chai.should
// const describe = chai.describe
// const it = chai.it


describe("LocalStorage class", function () {
    before(() => {
        localStorage.setItem('test', 'ok')
    })
    it("constructor", function () {
        expect(new LocalStorage()).to.be.an.instanceof(LocalStorage);
    })
    it("get()/set()", function () {
        const ls = new LocalStorage()
        expect(ls.get('test')).to.equal('ok')
        expect(ls.set('test1', 'true')).to.equal(undefined)
        expect(ls.get('test1')).to.equal(true)
        expect(ls.set('test1', 1)).to.equal(undefined)
        expect(ls.get('test1')).to.equal(1)
        expect(ls.setObject('test1', { "key": "value" })).to.equal(undefined)
        expect(ls.get('test1')).to.deep.equal({ key: "value" })
        let obj = {
            key: "valeu",
            numeric: 100,
            real: 0.2,
            bool: false,
            arrayObj: [
                { a: "a" },
                { a: "b" },
                { a: "c" }
            ],
            arrayNumeric: [
                1, 2, 3, 5
            ],
            complexObject: [
                1, "abc", true
            ]
        }
        expect(ls.setObject('test1', obj)).to.equal(undefined)
        expect(ls.get('test1')).to.deep.equal(obj)
    })
    after(() => {
        localStorage.removeItem('test')
        localStorage.removeItem('test1')
    })
})

describe("BookmarkManager class", function () {
    before(() => {
    })
    it('constructor', () => {
        const app = new BookmarkManager('app')
        expect(app).to.be.an.instanceof(BookmarkManager);
        expect(app.appName).to.equal('app')
        expect(() => { new BookmarkManager() }).to.throw(Error)
    })
    it('hashCode', () => {
        const app = new BookmarkManager('app')
        expect(app.hashCode('')).to.equal(0)
        expect(() => { app.hashCode() }).to.throw(TypeError)
        expect(typeof app.hashCode('abc')).to.equal(typeof 1)
        expect(app.hashCode('abc')).to.equal(96354)
        expect(app.hashCode('abc')).to.not.equal(app.hashCode('def'))
    })
    it('getBookmarks', () => {
        localStorage.removeItem('app')
        const app = new BookmarkManager('app')
        expect(app.getBookmarks()).to.be.null
        let bookmarkObj = { secPage: 1, scroll: 1024 }
        let hash = btoa(app.hashCode('app'))
        let book = {}
        book[hash] = []
        book[hash].push(bookmarkObj)
        localStorage.setItem('app', JSON.stringify(book))
        const ro = app.getBookmarks()
        expect(ro).to.be.an('object')
        expect(ro[hash]).to.be.an('array')
        expect(ro[hash][0].secPage).to.equal(1)
        expect(ro[hash][0].scroll).to.equal(1024)
    })
    it('getBookmark', ()=> {
        localStorage.removeItem('app')
        localStorage.removeItem('app1')
        const app = new BookmarkManager('app')
        const app1 = new BookmarkManager('app')
        let bookmarkObj = { secPage: 1, scroll: 1024 }
        let hash = btoa(app.hashCode('app'))
        let book = {}
        book[hash] = []
        book[hash].push(bookmarkObj)
        bookmarkObj = { secPage: 100, scroll: 2056 }
        book[hash].push(bookmarkObj)
        hash = btoa(app.hashCode('app1'))
        bookmarkObj = { secPage: 55, scroll: 2 }
        book[hash] = []
        book[hash].push(bookmarkObj)
        localStorage.setItem('app', JSON.stringify(book))

        expect(app.getBookmark('app')).to.be.an('array')
        expect(app1.getBookmark('app1')).to.be.an('array')
        expect(app.getBookmark('app')[0]).to.be.an('object')
        expect(app.getBookmark('app')[0].secPage).to.equal(1)
        expect(app.getBookmark('app')[0].scroll).to.equal(1024)
        expect(app.getBookmark('app')[1]).to.be.an('object')
        expect(app.getBookmark('app')[1].secPage).to.equal(100)
        expect(app.getBookmark('app')[1].scroll).to.equal(2056)

        expect(app1.getBookmark('app1')[0]).to.be.an('object')
        expect(app1.getBookmark('app1')[0].secPage).to.equal(55)
        expect(app1.getBookmark('app1')[0].scroll).to.equal(2)
    })
    it('addBookmark', ()=>{
        localStorage.removeItem('app')
        const bookmarkMgr = new BookmarkManager('app')
        let bookmarkObj = { secPage: 1, scroll: 1024 }
        bookmarkMgr.addBookmark('docstr', bookmarkObj)
        let bookmark = bookmarkMgr.getBookmark('docstr')

        expect(bookmark).to.be.an('array')
        expect(bookmark[0]).to.be.an('object')
        expect(bookmark[0].secPage).to.equal(1)
        expect(bookmark[0].scroll).to.equal(1024)
    })
    it('clrBookmarks', ()=>{
        const bookmarkMgr = new BookmarkManager('app')
        bookmarkMgr.clrBookmarks()
        expect(localStorage.getItem('app')).to.equal(null)
    })
    after(() => {
        localStorage.removeItem('app')
        localStorage.removeItem('app1')
    })
})

