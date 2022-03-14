// TODO 梳理整个思路。。。
// 看一下用户是否传入了 render 
// 未传入render ，没传入可能传入的是template，如果template也没有传递
// 将html进行词法解析（开始标签，结束标签 属性 文本）
// ast 语法树  用来描述html语法的stack = []
// codegen   <div>hello</div> => _c('div',{},'hello') 让字符串执行
// eval 耗性能 会有作用域问题

// 模板引擎 new Function
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

export function generate(el) {
  console.log(el)
  // 遍历树 将树拼接成字符串
  let children = genChildren(el)
  let code = `_c("${ el.tag }",${el.attrs.length ? genProps(el.attrs) : 'undefined'}${ children ? `,${children}`  : '' })`

  return code
}

function gen (el) {
  if(el.type === 1) return generate(el)
  // console.log(el, 'el??');
  if(el.type === 3) {
    let text = el.text
    if(!defaultTagRE.test(text)) {
      return `_v('${text}')`
    } else {
      // 'hello' + arr + 'world'
      let tokens = []
      let match
      let lastIndex = defaultTagRE.lastIndex = 0
      // console.log(text, 'text')
      // console.log(defaultTagRE.exec(text))
      while(match = defaultTagRE.exec(text)) {
        let index = match.index // 开始索引
        // console.log(index, 'lastIndex')
        if(index > lastIndex) {
          console.log(match, 'match')
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`) // JSON.stringify..
        lastIndex = index + match[0].length
      }
      if(lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      return `_v(${tokens.join('+')})`
    }
  }
}

function genChildren(el) {
  let children = el.children
  if(children) {
    return children.map(c => gen(c)).join(',')
  }
}

function genProps(attrs) {
  let str = ''
  for(let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if(attr.name === 'style') {
      let styleObj = {}
      attr.value.replace(/([^;:]+)\:([^;:]+)/g, function() {
        styleObj[arguments[1]] = arguments[2]
      })
      attr.value = styleObj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}