import fs from 'fs'
import YMLfmt from './index.mjs'

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