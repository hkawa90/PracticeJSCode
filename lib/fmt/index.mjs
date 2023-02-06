import YAML from 'yaml'

class FmtBase {
  constructor(option) {
    this.option = option || {}
    this.multiBlock = this.multiBlock || false
    this.delimitter = this.option.delimitter || '-'
    this.regex = RegExp(`^${this.delimitter}{3,}$`, 'mg')
  }
  parse(str) {
  }
}

class SimpleFmt extends FmtBase {
  constructor(option) {
    super(option)
  }
  parse(str) {
    const matches = [...str.matchAll(this.regex)]
    const block = []
    for (let idx1 = 0; idx1 < matches.length; idx1++) {
      const delimitterLen = matches[idx1][0].length
      let found = false
      for (let idx2 = idx1 + 1; idx2 < matches.length; idx2++) {
        const peerDelimitterLen = matches[idx2][0].length
        if (delimitterLen === peerDelimitterLen) {
          // Got peer delimitter
          found = true
          const start = matches[idx1].index + matches[idx1][0].length
          const end = matches[idx2].index
          const meta = str.slice(start, end)
          let data = null
          try {
            data = YAML.parse(meta)
          } catch (e) {
            throw e
          }
          block.push({
            start: start, end: end, meta: meta, data: data, level: delimitterLen
          })
          idx1 = idx2
          if (!this.option.hasOwnProperty('multiBlock') || !this.option.multiBlock) {
            return block
          }
          break
        }
      }
      if (!found) {
        throw new Error('Fail: can not detect peer delimitter.')
      }
    }
    for (let idx = 0; idx < block.length; idx++) {
      if ((idx + 1) === block.length) {
        block[idx].body = str.slice(block[idx].end + block[idx].level, str.length)
      } else {
        block[idx].body = str.slice(block[idx].end + block[idx].level, block[idx + 1].start - block[idx + 1].level)
      }
    }
    return block
  }
}

class Fmt extends FmtBase  {
  constructor(option) {
    super(option)
  }
  parse(str) {
    let doc = null
    const block = []
    if (!this.option.hasOwnProperty('multiBlock') || !this.option.multiBlock) {
      doc = YAML.parseDocument(str)
    } else {
      doc = YAML.parseAllDocuments(str)
    }
    for (let idx = 0; idx < doc.length; idx++) {
      if (doc[idx].contents.hasOwnProperty('items')) {
        block.push({
          start: doc[idx].contents.range[0],
          end: doc[idx].contents.range[1],
          meta: doc[idx].contents,
          data: doc[idx].contents.items
        })
        if ((idx + 1) === doc.length) {
          block[block.length - 1].body = ''
        } else if (!doc[idx + 1].contents.hasOwnProperty('items')) {
          block[block.length - 1].body = doc[idx + 1].contents.source
        } else {
          block[block.length - 1].body = ''
        }
      }
    }

    return block
  }
}

export default class YMLfmt {
  constructor(option) {
    this.option = option
    if (this.option.hasOwnProperty('quick') && this.option.quick) {
      this.fmt = new SimpleFmt(option)
    } else {
      this.fmt = new Fmt(option)
    }
  }
  parse(str) {
    return this.fmt.parse(str)
  }
}
