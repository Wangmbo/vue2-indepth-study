const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*` // 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // 用来获取的名的
// match 后的索引为1的

// Regular Expressions for parsing tags and attributes
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// a=b a="b" a='b'
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配开始标签
const startTagClose = /^\s*(\/?)>/ // <div/>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配闭合标签
const doctype = /^<!DOCTYPE [^>]+>/i
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

// html字符串解析成dom树 <div id="app"> {{ name }} </div>
// 将解析后的结果，组装成一个树结构 栈
// ast 语法层面的描述
// vdom dom节点
let root = null
let stack = []
export function paeserHTML(html) {
  function advance(len) {
    html = html.substring(len)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if(start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)
      // 如果没有遇到皆为标签就不停的解析
      let end
      let attr
      while((!(end = html.match(startTagClose)) && (attr = html.match(attribute)))) {
        // console.log(attr, 'attr')
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
        console.log(attr, '??attr')
        console.log(html, 'ggg');
        advance(attr[0].length)
        console.log(html, '?啦啦啦')
      }
      if(end) {
        console.log(end, 'end')
        advance(end[0].length)
        console.log(html, 'end')
      }
      return match
    }
    return false
  }
  function createAstElement(tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      children: [],
      parent: null,
      attrs
    }
  }
  function start(tagName, attributes) {
    let parent = stack[stack.length - 1]
    const element = createAstElement(tagName, attributes)
    if(!root) {
      root = element
    }
    element.parent = parent // 当放入栈中时，记录父亲是谁
    if(parent) parent.children.push(element)
    stack.push(element)
  }
  function end(tagName) {
    // 弹出...
    let last = stack.pop()
    console.log(last, tagName, '--------')
    if(last.tag !== tagName) {
      throw new Error('标签有误')
    }
  }
  function chars(text) {
    console.log(text, 'text');
    console.log(stack, 'stack')
    text = text.replace(/\s/g, "")
    const parent = stack[stack.length - 1]
    // console.log(parent, 'parent')
    if(text) {
      parent.children.push({
        type: 3,
        text
      })
    }
  }
  while(html) { // 解析的内容是否存在，如果存在就不停的解析 // htmlParse2
    let textEnd = html.indexOf('<') // 当前解析的开头
    if(textEnd === 0) {
       const startTagMatch = parseStartTag()
       console.log(startTagMatch, 'startTagMatch')
       if(startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
       }
       const endTagMatch = html.match(endTag)
       console.log(endTagMatch)
       if(endTagMatch) {
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue
       }
    }
    let text // 1111</div>
    if(textEnd > 0) {
      console.log(html, 'html??');
      text =  html.substring(0, textEnd)
    }
    if(text) {
      chars(text)
      advance(text.length)
    }
  }
  return root
}