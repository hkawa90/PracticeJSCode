export function genId() {
    return Array.from(crypto.getRandomValues(new Uint32Array(4)))
        .map((n) => n.toString(36))
        .join("");
}
/**
 * モジュールなどで例外発生をWeb Pageに表示するためのイベントです
 * @param {Element} element dispatchEvent()するEventTarget
 * @param {String} type Event name
 * @param {String} information Detail information of Event
 */
export function assertEvent(element, type, information) {
    const target = element || document
    const t = type || 'app'
    const info = information || {}
    const event = new CustomEvent(type, { detail: info });
    target.dispatchEvent(event)
}

/**
 * URL validiation check
 * @param {string} string URL文字列か検査対象文字列
 * @returns {boolean} URL文字列であればtrue
 */
export function isValidHttpUrl(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}