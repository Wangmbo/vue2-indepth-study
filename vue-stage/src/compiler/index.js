import { paeserHTML } from './parse'
import { generate } from './generate'

export function compileToFunction(template) {
  const root = paeserHTML(template)
  console.log(root, 'root')
  const code = generate(root)
  console.log(code, 'code')
  const render = new Function(`with(this){return ${code}}`) // code中会用到数据 数据在vm上
  console.log(render.toString(), '/?')
  // render.call(vm)
  return render
}
// html => ast(只能描述语法 语法不存在的属性无法描述) => render函数 + （width + new Function）  => 虚拟dom => 生成真实dom
// TODO with 函数 正则函数..