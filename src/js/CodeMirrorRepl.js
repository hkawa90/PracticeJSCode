//import { createContextEval } from 'codemirror-console/lib/context-eval'
import { createContextEval } from './context-eval'
import { EditorView, basicSetup } from "codemirror"
import { EditorState, Compartment } from "@codemirror/state"
import { javascript } from "@codemirror/lang-javascript"
import { html } from "@codemirror/lang-html"
// import { sublime } from '@uiw/codemirror-themes-all'
import { sublimeInit } from '@uiw/codemirror-themes-all'
import * as themes from '@uiw/codemirror-themes-all'
import { repositionTooltips } from '@codemirror/view'
import { DataSet, Timeline } from "vis-timeline/standalone";

class PracticeEditor {
    constructor(options) {
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
                extensions: [basicSetup, javascript(), themes['sublime'], myTheme]
            })
        } else { // html
            this.editorState = EditorState.create({
                // doc: textarea.textContent,
                extensions: [basicSetup, html(), themes['sublime'], myTheme]
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
        this.editor = this.createEditor(options)
        this.runningEvalContext = undefined;
        this.timeSeriesLog = new DataSet()
        this.timeSeriesGroupLog = new Set()
        this.network = {}
        this.network.ts = []
        // for console function
        this.consoleCount = {}
    }
    static createEditorFromSelector(selectors, lang = "js") {
        let editors = []
        const s = selectors || '[data-role="codeBlock"].language-javascript'
        const elements = document.querySelectorAll(s)
        console.log('createEditorFromSelector:', lang)
        console.log('createEditorFromSelector:', elements.length, ": ", elements)
        for (let cnt = 0; cnt < elements.length; cnt++) {
            editors.push(CodeMirrorRepl.createEditorFromElement(elements[cnt], lang))
        }
        return editors
    }
    static createEditorFromElement(element, lang = "js") {
        let repl = new CodeMirrorRepl({ lang: lang })
        repl.editor.setText(element.textContent)
        repl.editor.getText()
        repl.editor.setReadOnly(false)

        const runBtn = document.createElement('button')
        runBtn.setAttribute('class', 'runJsCode btn btn-primary me-3 mt-1')
        runBtn.setAttribute('type', 'button')

        const clrBtn = document.createElement('button')
        clrBtn.setAttribute('class', 'clrlog btn btn-primary me-3 mt-1')
        clrBtn.setAttribute('type', 'button')

        repl.vis_chkbox = document.createElement('input')
        repl.vis_chkbox.setAttribute('type', 'checkbox')
        repl.vis_chkbox.setAttribute('class', 'visCheckbox form-check-input')

        const label = document.createElement('label')
        label.setAttribute('class', 'labelVischkbox mt-1 form-check-label me-3')
        label.appendChild(repl.vis_chkbox)

        if (lang === "js") {
            repl.script_chkbox = document.createElement('input')
            repl.script_chkbox.setAttribute('type', 'checkbox')
            repl.script_chkbox.setAttribute('class', 'scrCheckbox form-check-input')

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
        if (repl.lang === 'js') {
            element.after(repl.editor.dom(), repl.outputHolder, repl.visualizeHolder, repl.iframeHolder, runBtn, clrBtn, label, repl.scrlabel, iViewlabel)
        } else {
            element.after(repl.editor.dom(), repl.outputHolder, repl.visualizeHolder, repl.iframeHolder, runBtn, clrBtn, label, iViewlabel)
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
        runBtn.addEventListener('click', () => {
            let option = {}
            if (repl.lang === "js") {
                option = { type: repl.script_chkbox.checked ? "script" : "module", view: repl.iframeView_chkbox.checked }
            } else { // html
                option = { type: "HTML", view: repl.iframeView_chkbox.checked }
            }
            repl.iframeHolder.setAttribute('style', '')
            option.embeddedElement = repl.iframeHolder
            repl.runInContext({ console: consoleMock }, option).then((r) => {
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
        return repl
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
    /**
     * @param {object} context
     * @param {{ type: "module" | "script" }} [options]
     * @returns {Promise<unknown>}
     */
    async runInContext(context, options = {}) {
        if (this.runningEvalContext) {
            this.runningEvalContext.remove(this.iframeHolder) // remove previous context at first
        }
        const jsCode = this.editor.getText()
        this.runningEvalContext = createContextEval(options.view)
        return this.runningEvalContext.run(jsCode, context, options)
    }
}
