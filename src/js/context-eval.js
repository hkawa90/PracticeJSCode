import {genId} from './util'
import hooker from 'hooker'

// License: MIT
// https://github.com/syumai/sandboxed-eval
// License: Unkown
// https://github.com/azu/codemirror-console
/**
 *
 * @param origin
 * @param senderId
 * @param receiverId
 * @param {"module" | "script" | "AsyncFunction" | "HTML"} type
 */
const createSrcDoc = ({ origin, senderId, receiverId, type, extScript }, src) => {
    let extScriptSrc =""
    for (const ext of extScript) {
        extScriptSrc += '<script src="' + ext + '"></script>\n'
    }
    
    if (type === 'HTML') {
        return `<!doctype html>
        <html lang="jp">` + src +
            `</html>`;
    }
    // TODO: scriptだと描画がうまくいかんので、ちょっとここをコメントアウトしてみた。->うまくいったので、このままかも。
    // script does not require <script> because just use eval on contextWindow
    if (type === "script") {
        return `<!doctype html>
<html lang="en">
<head>
    ${extScriptSrc}
</head>
<body style="margin-top: 0; margin-bottom:0;">
</body>
</html>`;
    }
    return `<!doctype html>
<html lang="en">
<head>
    ${extScriptSrc} 
</head>
<body style="margin-top: 0; margin-bottom:0;">
<script>
const origin = "${origin}";
const senderId = "${senderId}";
const receiverId = "${receiverId}";
const handleMessage = async (event) => {
  if (event.source !== window.parent) {
    return;
  }
  if (event.origin !== origin) {
    return;
  }
  const { id, src } = event.data || {};
  if (id !== receiverId) {
    return;
  }
  try {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    ${(() => {
            if (type === "module") {
                // module can not get result
                return (
                    "await import(`data:text/javascript;charset=utf-8, ${encodeURIComponent(src)}`);" +
                    "window.parent.postMessage({ id: senderId, result: undefined }, origin);"
                );
            } else if (type === "AsyncFunction") {
                // new AsyncFunction cano not get result
                return (
                    "await new AsyncFunction(src)();" +
                    "window.parent.postMessage({ id: senderId, result: undefined }, origin);"
                );
            } else {
                return "const result = eval(src);" + "window.parent.postMessage({ id: senderId, result }, origin);";
            }
        })()};
  } catch (error) {
    window.parent.postMessage({ id: senderId, error: {message:error.message} }, origin);
  }
  window.removeEventListener("message", handleMessage);
};
window.addEventListener("message", handleMessage);
window.parent.postMessage({ id: senderId, ready: true }, origin);
</script>
</body>
</html>`;
};

/**
 * @returns {{run: (function(string, Object=, {type: ("module"|"script"|"AsyncFunction"|"HTML")}=): Promise<*>), remove: remove}}
 */
export function createContextEval(options) {
    const iframe = document.createElement("iframe")
    const iframeId = genId()
    // hooker.hook(iframe, "setAttribute", function() {
    //     console.trace('setAttribute:', arguments)
    //   });
    iframe.setAttribute('class', 'repl-viewer')
    iframe.setAttribute('id',  iframeId)
    if (options.sandbox) {
        iframe.setAttribute('sandbox', options.sandbox)
    }
    if (!options.view) {
        iframe.setAttribute("style", "display:none;");
    } else {
        iframe.setAttribute("style", "margin-top: 0; margin-bottom:0;");
    }
    const senderId = genId();
    const receiverId = genId();

    return {
        iframeSetAttribute: (key, value) => {
            iframe.setAttribute(key, value)
        },
        iframeId: () => {
            return iframeId
        },
        remove: (parent) => {
            console.log('repl:remove child')
            parent.removeChild(iframe);
        },
        /**
         * @param {string} src
         * @param {object} [scope]
         * @param {{ type: "module" | "script" | "AsyncFunction" | "HTML" }} [options]
         * @returns {Promise<unknown>}
         */
        run: (src, scope = {}, options = {}) => {
            
            return new Promise((resolve, reject) => {
                // type: "module" | "AsyncFunction"
                const handleMessage = (event) => {
                    if (event.source !== iframe.contentWindow) {
                        return;
                    }
                    const { id, result, error, ready } = event.data || {};
                    if (id !== senderId) {
                        return;
                    }
                    if (ready) {
                        iframe.contentWindow.postMessage({ id: receiverId, src }, "*");
                        return;
                    }
                    if (error) {
                        reject(new Error(error.message));
                    } else {
                        resolve(result);
                    }
                    window.removeEventListener("message", handleMessage);
                };
                window.addEventListener("message", handleMessage);
                const executionType = options.type ? options.type : "script";
                iframe.srcdoc = createSrcDoc({
                    origin: window.location.origin,
                    senderId,
                    receiverId,
                    type: executionType,
                    extScript: options.extScript
                }, src);
                console.log('embedded:', options.embeddedElement)
                if (options.embeddedElement) {
                    options.embeddedElement.appendChild(iframe);
                } else {
                    document.body.appendChild(iframe);
                }
                // inject global
                // avoid CloneError via postMessage
                const iframeWindow = iframe.contentWindow;
                Object.keys(scope).forEach(function (key) {
                    iframeWindow[key] = scope[key];
                });
                // type: script just use eval
                // does not use postMessage, because postMessage restrict transferable object
                if (executionType === "script") {
                    try {
                        resolve(iframeWindow.eval(src))
                    } catch (error) {
                        reject(error)
                    }
                }
            })
        }
    }
}

