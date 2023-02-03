const fs = require('fs')
const path = require('path')
const process = require('process')
const express = require('express')

const app = express()
const port = 9999

const bookConfPath = process.argv[2]
try {
  const json = fs.readFileSync(path.join(bookConfPath, 'book.config.json'), 'utf8')
  if (json) {
    const data = JSON.parse(json)
    if (data && data.express && data.express.document_root && data.express.document_root instanceof Array) {
      for (const root of data.express.document_root) {
        if (typeof root === 'string') {
          console.log('Add document root:', root)
          app.use(express.static(root))
        }
      }
    }
  }
} catch (err) {
  console.error(err);
}

// 追加のMIMEが必要な場合
// express.static.mime.define({ 'text/javascript': ['js'] })

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})