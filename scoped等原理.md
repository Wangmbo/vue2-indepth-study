### scoped css 原理
使用`scoped`属性用于`<style>`标签之后，打包的代码
```html
<div data-v-257dda99b class="login">登录</div>
<style scoped>
.login[data-v-257dda99b] {
    width: 100px;
    height: 100px
}
</style>
```
我们会发现，打包的dom被PostCss添加了一个唯一的动态属性，css选择器额外添加了一个对应的属性选择来选择该组件的dom，这样就实现了组件之间的样式不互相污染。

1. 为每个组件实例生成一个唯一标识组件实例的标识符。
2. 将标识符添加到dom元素作为dom的属性，为每一个选择器的最后一个选择器单元增加一个属性选择器。

#### 特点
1. 将组件的样式作用范围限制在了组件自身的标签，即：组件内部，包含子组件的根标签，但不包含子组件的除根标签之外的其他标签，所以组件的css选择器也不能选择到子组件以及后代组件中的元素（子组件的根元素除外，子组件的根元素既有父组件实例标识又有子组件实例标识）。

### >>>、/deep/、::v-deep 深度选择器的原理
给深度作用选择器的前面一个选择器单元增加一个属性选择器，而不是之前默认的最后一个，例如`#id .cls >>> div` 会变为 `#id .cls[data-v-e0fq0c0] div`


https://vue-loader.vuejs.org/zh/guide/scoped-css.html#%E6%B7%B7%E7%94%A8%E6%9C%AC%E5%9C%B0%E5%92%8C%E5%85%A8%E5%B1%80%E6%A0%B7%E5%BC%8F   vue-loader ...