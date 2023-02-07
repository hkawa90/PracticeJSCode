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

export default class YMLfmt extends FmtBase {
  constructor(option) {
    super(option)
  }
  setBody(str, block) {
    if (block.length === 0) {
      block.push({body: str, start: 0, end: 0, meta: null, data: null, level: 0})
    } else {
      for (let idx = 0; idx < block.length; idx++) {
        if ((idx + 1) === block.length) {
          block[idx].body = str.slice(block[idx].end + block[idx].level + 1, str.length)
        } else {
          block[idx].body = str.slice(block[idx].end + block[idx].level + 1, block[idx + 1].start - block[idx + 1].level)
        }
      }  
    }
    return block
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
            this.setBody(str, block)
            return block
          }
          break
        }
      }
      if (!found) {
        throw new Error('Fail: can not detect peer delimitter.')
      }
    }
    this.setBody(str, block)
    return block
  }
}

