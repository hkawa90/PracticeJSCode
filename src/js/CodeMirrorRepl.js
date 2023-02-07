// License: Unkown
// https://github.com/azu/codemirror-console

import { createContextEval } from './context-eval'
import { EditorView, basicSetup } from "codemirror"
import { EditorState, Compartment } from "@codemirror/state"
import { javascript } from "@codemirror/lang-javascript"
import { html } from "@codemirror/lang-html"
import { sublimeInit } from '@uiw/codemirror-themes-all'
import * as themes from '@uiw/codemirror-themes-all'
import { repositionTooltips } from '@codemirror/view'
import { DataSet, Timeline } from "vis-timeline/standalone";
import YMLfmt from 'fmt'
import { genId } from './util'
import { assertEvent } from './util'

class PracticeEditor {
    constructor(options) {
        const theme = options.cmTheme || "sublime"
        // options.lang
        const myTheme = EditorView.baseTheme({
            "&.cm-editor": {
                // fontSize: '25px',
                height: '10rem',
                width: '80%'
            },
            ".cm-scroller": {
                fontFamily: 'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace'
            },
        })
        if (options.lang === 'js') {
            this.editorState = EditorState.create({
                // doc: textarea.textContent,
                extensions: [basicSetup, javascript(), themes[theme], myTheme]
            })
        } else { // html
             this.editorState = EditorState.create({
                // doc: textarea.textContent,
                extensions: [basicSetup, html(), themes[theme], myTheme]
            })
        }
        this.editorView = new EditorView({
            state: this.editorState
        })
        this.editable = new Compartment()
    }
    setText(text) {
        this.editorView.dispatch({
            changes: {
                from: 0,
                to: this.editorView.state.doc.length,
                insert: text
            }
        })
    }
    getText() {
        return this.editorView.state.doc.toString()
    }
    // TODO: readonly にならない
    setReadOnly(readOnly) {
        this.editorView.dispatch({
            effects: this.editable.reconfigure(EditorView.editable.of(readOnly))
        });
    }
    updateToMinNumberOfLines(minNumOfLines) {

        const currentNumOfLines = this.editorView.state.doc.lines;
        const currentStr = this.editorView.state.doc.toString();

        if (currentNumOfLines >= minNumOfLines) {
            return;
        }

        const lines = minNumOfLines - currentNumOfLines;

        const appendLines = "\n".repeat(lines);


        this.editorView.dispatch({
            changes: { from: currentStr.length, insert: appendLines }
        })
    }
    dom() {
        return this.editorView.dom;
    }
    theme(name) {
        this.editorView.dispatch({
            effects: themeConfig.reconfigure([themes[name]])
        })
    }
}

export class CodeMirrorRepl {
    constructor(options) {
        this.lang = options.lang || "js"
        this.options = options
        this.editor = this.createEditor(options)
        this.runningEvalContext = undefined;
        this.timeSeriesLog = new DataSet()
        this.timeSeriesGroupLog = new Set()
        this.network = {}
        this.network.ts = []
        // for console function
        this.consoleCount = {}
        this.ID = genId()
    }
    static createEditorFromSelector(selectors, options, codeRepl) {
        const s = selectors || '[data-role="codeBlock"].language-javascript'
        const elements = document.querySelectorAll(s)
        for (let cnt = 0; cnt < elements.length; cnt++) {
            const cr = CodeMirrorRepl.createEditorFromElement(elements[cnt], options)
            codeRepl[cr.id()] = cr
        }
        return codeRepl
    }
    static createEditorFromElement(element, options) {
        const repl = new CodeMirrorRepl(options)
        repl.element = element
        repl.element.setAttribute('id', repl.id())
        repl.editor.setText(element.textContent)
        const result = repl.parseConfig()
        let  config = {}
        try {
            config = result.data.config    
        } catch(_) {
            config = {}
        }
         repl.editor.setReadOnly(false)

        repl.runBtn = document.createElement('button')
        repl.runBtn.setAttribute('class', 'runJsCode btn btn-primary me-3 mt-1')
        repl.runBtn.setAttribute('type', 'button')

        const clrBtn = document.createElement('button')
        clrBtn.setAttribute('class', 'clrlog btn btn-primary me-3 mt-1')
        clrBtn.setAttribute('type', 'button')

        repl.vis_chkbox = document.createElement('input')
        repl.vis_chkbox.setAttribute('type', 'checkbox')
        repl.vis_chkbox.setAttribute('class', 'visCheckbox form-check-input')

        const label = document.createElement('label')
        label.setAttribute('class', 'labelVischkbox mt-1 form-check-label me-3')
        label.appendChild(repl.vis_chkbox)

        if (repl.lang === "js") {
            repl.script_chkbox = document.createElement('input')
            repl.script_chkbox.setAttribute('type', 'checkbox')
            repl.script_chkbox.setAttribute('class', 'scrCheckbox form-check-input')
            repl.script_chkbox.checked = true

            repl.scrlabel = document.createElement('label')
            repl.scrlabel.setAttribute('class', 'labelSrcchkbox mt-1 form-check-label me-3')
            repl.scrlabel.appendChild(repl.script_chkbox)
        } else {
            repl.script_chkbox = null
            repl.scrlabel = null
        }

        repl.iframeView_chkbox = document.createElement('input')
        repl.iframeView_chkbox.setAttribute('type', 'checkbox')
        repl.iframeView_chkbox.setAttribute('class', 'iViewCheckbox form-check-input')

        const iViewlabel = document.createElement('label')
        iViewlabel.setAttribute('class', 'labelIviewchkbox mt-1 form-check-label me-3')
        iViewlabel.appendChild(repl.iframeView_chkbox)
        // コード、実行ボタン、クリアボタン、チェックボックス、タイムライン表示を非表示にする
        if (config) {
            if (config.hasOwnProperty('hide')) {
                if (config.hide) {
                    repl.editor.dom().setAttribute('style', 'display:none')
                    // codemirroのclass=c1でdisplay:noneが有効にならない.
                    repl.editor.dom().setAttribute('class', '')
                    repl.outputHolder.setAttribute('style', 'display:none')
                    repl.visualizeHolder.setAttribute('style', 'display:none')
                    repl.runBtn.setAttribute('style', 'display:none')
                    clrBtn.setAttribute('style', 'display:none')
                    label.setAttribute('style', 'display:none')
                    iViewlabel.setAttribute('style', 'display:none')
                    if (repl.lang === 'js') {
                        repl.scrlabel.setAttribute('style', 'display:none')
                    }
                }
            }
        }
        if (repl.lang === 'js') {
            element.after(repl.editor.dom(), repl.outputHolder, repl.visualizeHolder, repl.iframeHolder, repl.runBtn, clrBtn, label, repl.scrlabel, iViewlabel)
        } else {
            element.after(repl.editor.dom(), repl.outputHolder, repl.visualizeHolder, repl.iframeHolder, repl.runBtn, clrBtn, label, iViewlabel)
        }
        element.setAttribute("style", "display:none")

        let consoleMock = {
            log: function (...theArgs) {
                let args = ""
                for (const arg of theArgs) {
                    try {
                        args += arg.toString();
                    } catch (_) {
                        // do nothing
                    }
                }
                repl.outputHolder.appendChild(repl.appendConsoleLine(args, 'normal'))
            },
            error: function (...theArgs) {
                let args = ""
                for (const arg of theArgs) {
                    try {
                        args += arg.toString();
                    } catch (_) {
                        // do nothing
                    }
                }
                repl.outputHolder.appendChild(repl.appendConsoleLine(args, 'error'))
            },
            clear: function () {
                repl.clearConsole()
            },
            count: function (label) {
                const l = label || "default"
                if (repl.consoleCount[l]) {
                    repl.consoleCount[l]++
                } else {
                    repl.consoleCount[l] = 1
                }
                const outStr = l + ": " + repl.consoleCount[l]
                repl.outputHolder.appendChild(repl.appendConsoleLine(outStr, 'count'))
            },
            countReset(label) {
                const l = label || "default"
                repl.consoleCount[l] = 0
                const outStr = l + ": " + repl.consoleCount[l]
                repl.outputHolder.appendChild(repl.appendConsoleLine(outStr, 'count'))
            },
            debug() {
                console.debug.apply(this, arguments);
            },
            assert() {
                console.assert.apply(this, arguments);
            },
            dir() {
                console.dir.apply(this, arguments);
            },
            dirxml() {
                console.dirxml.apply(this, arguments);
            },
            exception() {
                console.exception.apply(this, arguments);
            },
            group() {
                console.group.apply(this, arguments);
            },
            groupCollapsed() {
                console.groupCollapsed.apply(this, arguments);
            },
            groupEnd() {
                console.groupEnd.apply(this, arguments);
            },
            info() {
                console.info.apply(this, arguments);
            },
            profile() {
                console.profile.apply(this, arguments);
            },
            profileEnd() {
                console.profileEnd.apply(this, arguments);
            },
            table() {
                console.table.apply(this, arguments);
            },
            time() {
                console.time.apply(this, arguments);
            },
            timeEnd() {
                console.timeEnd.apply(this, arguments);
            },
            timeStamp() {
                console.timeStamp.apply(this, arguments);
            },
            trace() {
                console.trace.apply(this, arguments);
            },
            warn() {
                console.warn.apply(this, arguments);
            },
            tracing: function (...theArgs) {
                // const event = new CustomEvent('repl-tracing', { detail: {} });
                // window.dispatchEvent(event)
                if (repl.vis_chkbox.checked) {
                    if (theArgs.length >= 2) {
                        const item = theArgs[0] || ""
                        const group = theArgs[1] || ""
                        repl.network.ts.push(item)
                        repl.timeSeriesGroupLog.add(group)
                        repl.timeSeriesLog.add({
                            id: repl.timeSeriesLog.length,
                            group: group,
                            content: item,
                            start: repl.timeSeriesLog.length,
                            type: 'box'
                        })
                    }
                }
            }
        }
        // 実行ボタン押下
        repl.runBtn.addEventListener('click', () => {
            let option = {}
            if (repl.lang === "js") {
                option = {
                    type: repl.script_chkbox.checked ? "script" : "module",
                    view: repl.iframeView_chkbox.checked
                }
            } else { // html
                option = { type: "HTML", view: repl.iframeView_chkbox.checked }
            }
            repl.iframeHolder.removeAttribute('style')
            option.embeddedElement = repl.iframeHolder
            option.extScript = repl.options.extScript

            repl.runInContext({ console: consoleMock }, option).then(/*async*/(r) => {
                if (repl.vis_chkbox.checked) {
                    let groups = new DataSet();
                    let cnt = 0
                    for (let item of repl.timeSeriesGroupLog) {
                        groups.add({ id: item, content: item });
                        cnt++
                    }
                    const timeline = new Timeline(repl.visualizeHolder);
                    const options = { start: 0 }
                    timeline.setOptions(options);
                    timeline.setGroups(groups);
                    timeline.setItems(repl.timeSeriesLog);
                }
                if (repl.iframeView_chkbox.checked) {
                    function isHidden(elem) {
                        return !elem.offsetWidth && !elem.offsetHeight;
                    }
                    // TODO: iframe->repl.iframeHolder
                    const wait = async (ms) => {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                resolve(); // setTimeoutの第一引数の関数として簡略化できる
                            }, ms)
                        });
                    }
                    //await wait(10000)
                    const iframe = repl.iframeHolder.getElementsByTagName('iframe')[0]
                    const height = iframe.contentDocument.body.clientHeight
                    if ((option.iframe) &&(option.iframe.height)) {
                        iframe.style.height = parseInt(option.iframe.height) + 'px'
                    } else {
                        if (height !== 0) {
                            iframe.style.height = height + 'px';
                        } else {
                            setTimeout((iframe) => {
                                const height = iframe.contentDocument.body.clientHeight
                                const id = iframe.getAttribute('id')
                                if (height !== 0) {
                                    iframe.style.height = height + 'px';
                                }
                            }, 1000, iframe)
                            // iframe.setAttribute('style', 'display:none')
                        }
                        // console.log('lang:', repl.lang, " height:", height)
                    }
                    
                }
            }).catch((e) => {
                repl.outputHolder.appendChild(repl.appendConsoleLine(e, 'error'))
            })
        })
        // クリアボタン押下
        clrBtn.addEventListener('click', () => {
            repl.timeSeriesLog.clear()
            repl.timeSeriesGroupLog.clear()
            repl.network.ts = []
            repl.clearConsole()
            repl.iframeHolder.setAttribute('style', 'display:none')
            while (repl.visualizeHolder.firstChild) {
                repl.visualizeHolder.removeChild(repl.visualizeHolder.firstChild)
            }
        })
        if (config) {
            if (config.hasOwnProperty('autorun')) {
                if (config.autorun) {
                    element.setAttribute('data-auto-run', 'true')
                    // repl.dispatchRun()
                }
            }
        }
        return repl
    }
    id() {
        return this.ID
    }
    createEditor(options) {
        // console内容保持エレメント
        this.outputHolder = document.createElement("div")
        // vis.timeline内容保持エレメント
        this.visualizeHolder = document.createElement("div")
        this.visualizeHolder.setAttribute('class', 'vis-output')
        // iframe保持エレメント
        this.iframeHolder = document.createElement('div')
        this.iframeHolder.setAttribute('class', 'repl-iframe')

        return new PracticeEditor(options)
    }
    dispatchRun() {
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        })
        this.runBtn.dispatchEvent(event)
    }
    clearConsole() {
        if (this.outputHolder) {
            // this.outputHolderの子要素削除
            while (this.outputHolder.firstChild) {
                this.outputHolder.removeChild(this.outputHolder.firstChild)
            }
        }
    }
    appendConsoleLine(text, level) {
        const div = document.createElement("div")
        div.setAttribute('class', 'mirror-console-log-row mirror-console-log-' + level)
        div.appendChild(document.createTextNode(text))
        return div
    }
    setText(value) {
        this.editor.setValue(value)
    }
    getText() {
        return this.editor.getValue()
    }
    setOption(op, value) {
        this.editor.setOption(op, value)
    }
    destroy() {
        this.editor = null
        if (this.runningEvalContext) {
            this.runningEvalContext.remove()
        }
        Object.freeze(this)
    }
    parseConfig() {
        let result = null
        const input = this.editor.getText()
        if (input === undefined || input === null || input === '') {
            return {body : '', data: { config: {}}}
        }
        try {
            // result = loadFront(this.editor.getText())
            result = new YMLfmt({ multiBlock: false }).parse(input)
        } catch (e) {
            assertEvent(document, 'assertion', e)
            console.log(e)
        }
        return result[0]
    }
    /**
     * @param {object} context
     * @param {{ type: "module" | "script" }} [options]
     * @returns {Promise<unknown>}
     */
    async runInContext(context, options = {}) {
        if (this.runningEvalContext) {
            this.runningEvalContext.remove(this.iframeHolder) // remove previous context at first
        }

        let result = this.parseConfig()
        let jsCode = ''
        if (result !== null) {
            jsCode = result.body
            delete result.body
            if (!result.hasOwnProperty('data')) {
                result.data = {config: {}}
            } else if (result.data === null) {
                result.data = {config: {}}
            }
        } else {
            result = {}
            result.data = { config: null}
        }
        if (result.data.config) {
            if (result.data.config.hasOwnProperty('timeline')) {
                if (result.data.config.timeline) {
                    this.vis_chkbox.checked = true
                } else {
                    this.vis_chkbox.checked = false
                }
            }
            if (result.data.config.hasOwnProperty('autorun')) {
                if (result.data.config.autorun) {
                    options.autorun = true
                } else {
                    options.autorun = false
                }
            }
            if (result.data.config.hasOwnProperty('view')) {
                if (result.data.config.view) {
                    options.view = true
                    this.iframeView_chkbox.checked = true
                } else {
                    options.view = false
                    this.iframeView_chkbox.checked = false
                }
            }
            if (result.data.config.hasOwnProperty('script') && (options.type !== 'HTML')) {
                if (result.data.config.script === 'script') {
                    this.script_chkbox.checked = true
                } else {
                    this.script_chkbox.checked = false
                }
                options.type = result.data.config.script
            }
            if (result.data.config.hasOwnProperty('sandbox')) {
                if (result.data.config.sandbox !== '') {
                    options.sandbox = result.data.config.sandbox
                }
            }
            if (result.data.config.hasOwnProperty('iframe')) {
                options.iframe = result.data.config.iframe
            }
            delete result.data.config
        }
        options.sandbox = options.sandbox || "allow-scripts allow-same-origin"
        if (options.type === 'script') {
            const yfmObj = JSON.stringify(result.data)
            const yfmOjbStr =
                `{
                const ___yfmobj = JSON.parse('${yfmObj}')
                for (const ____yfmobj of Object.keys(___yfmobj)) {
                    this[____yfmobj] = ___yfmobj[____yfmobj]
                }
            }\n`
            jsCode = yfmOjbStr + jsCode
        } else if (options.type === 'module') {
            const yfmObj = JSON.stringify(result.data)
            const yfmOjbStr =
                `{
                const ___yfmobj = JSON.parse('${yfmObj}')
                for (const ____yfmobj of Object.keys(___yfmobj)) {
                    globalThis[____yfmobj] = ___yfmobj[____yfmobj]
                }
            }\n`
            jsCode = yfmOjbStr + jsCode
        }
        this.runningEvalContext = createContextEval(options)
        if (options.autorun) {
            this.runningEvalContext.iframeSetAttribute('data-autorun', 'true')
        } else {
            this.runningEvalContext.iframeSetAttribute('data-autorun', 'false')
        }
        this.iframID = this.runningEvalContext.iframeId()
        // return this.runningEvalContext.run(jsCode, context, options)
        return this.runningEvalContext.run(jsCode, context, options)
    }
}
