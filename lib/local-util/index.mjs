/**
 * Unicode 文字列で、各 16 ビット単位を 1 バイトしか占有しない文字列に変換します。
 * @param {string} string 入力文字列
 * @returns 1byteしか占有しない文字列
 * @see https://developer.mozilla.org/ja/docs/Web/API/btoa
 */
export function toBinary(string) {
    const codeUnits = Uint16Array.from(
        { length: string.length },
        (element, index) => string.charCodeAt(index)
    );
    const charCodes = new Uint8Array(codeUnits.buffer);

    let result = "";
    charCodes.forEach((char) => {
        result += String.fromCharCode(char);
    })
    return result;
}
/**
 * toBinary()の逆変換
 * @param {Uint8Array} binary 入力バイナリデータ
 * @returns 文字列
 * @see https://developer.mozilla.org/ja/docs/Web/API/btoa
 */
export function fromBinary(binary) {
    const bytes = Uint8Array.from({ length: binary.length }, (element, index) =>
        binary.charCodeAt(index)
    );
    const charCodes = new Uint16Array(bytes.buffer);

    let result = "";
    charCodes.forEach((char) => {
        result += String.fromCharCode(char);
    });
    return result;
}

/**
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 * @see https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
 */
export function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

/**
 * 対象オブジェクトがiterableか確認する
 * @param {object} obj チェック対象
 * @returns iterable(for of使用可能)ならtrue
 * @see https://stackoverflow.com/questions/18884249/checking-whether-something-is-iterable
 */
export function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}