import fs from 'fs'
import path from 'path'
import process from 'process'
import express from 'express'
import { hashCode } from 'local-util'
import { marked } from 'marked'
// import { DOMPurify } from 'dompurify'
// import pkg from 'dompurify';
// const { DOMPurify } = pkg;
import DOMPurify from 'isomorphic-dompurify'

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
    if (data && data.express && data.express.convert_markdown) {
      for (const chapter of data.chapters) {
        const md = fs.readFileSync(path.join(bookConfPath, chapter.file), 'utf8')
        const source = md.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "")
        const html = DOMPurify.sanitize(marked.parse(source))
        fs.writeFileSync(path.join(bookConfPath, chapter.file.replace(/\.[^/.]+$/, ".html")), html);
      }
    }
  }
} catch (err) {
  console.error(err);
}

// 追加のMIMEが必要な場合
// express.static.mime.define({ 'text/javascript': ['js'] })

app.listen(port, () => {
  console.log(`App listening on port ${port} : http://localhost:9999`)
})