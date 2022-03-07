import babel from 'rollup-plugin-babel'
export default {
  input: './src/index.js',
  output: {
    format: 'umd', // window.Vue // 支持amd和commonjs规范
    name: 'Vue',
    file: 'dist/vue.js',
    sourcemap: true // es5 => es6源代码
  },
  plugins: [
    babel({
      // ** 表示任意文件任意目录
      exclude: 'node_modules/**'
    })
  ]
}

// 后续 需要打包不同类型，可以写个列表，循环打包