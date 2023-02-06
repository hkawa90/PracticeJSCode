## [yaml - npm](https://www.npmjs.com/package/yaml)

`yaml`を使って`YAML front matter`を処理します。2つのモードでがあり、`{option.quick : true}`とすることで、簡易高速版となります。それ以外では、
`yaml`の`parseDocument`, `parseAllDocuments`を使って読み取ります。

```javascript
const file = fs.readFileSync('./test/test.txt', 'utf8')
// const file = fs.readFileSync('./lib/fmt//test/test.txt', 'utf8')

console.time('Time[Simple]:')
let so = { quick: true, delimitter: '-', multiBlock: false }
let r1
for (let i = 0; i < 100; i++) {
  r1 = new YMLfmt(so).parse(file)
}
console.timeEnd('Time[Simple]:')

console.time('Time[Yaml]:')
so = { quick: false, delimitter: '-', multiBlock: false }
for (let i = 0; i < 100; i++) {
  r1 = new YMLfmt(so).parse(file)
}
console.timeEnd('Time[Yaml]:')
```

```
Time[Simple]:: 240.355ms
Time[Yaml]:: 313.592ms
```