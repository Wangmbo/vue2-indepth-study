(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function isFuntion(data) {
    return typeof data === 'function';
  }
  function isObject(val) {
    return _typeof(val) === 'object' && val != null;
  }

  var arrayMethods = Object.create(Array.prototype);
  var oldArrayPrototype = Array.prototype;
  var methods = ['push', 'shift', 'pop', 'unshift', 'reverse', 'splice', 'sort'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var _oldArrayPrototype$me;

      console.log('数组发生变化...'); // TODO 如果是push了一个对象之类的，也需要劫持...

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = (_oldArrayPrototype$me = oldArrayPrototype[method]).call.apply(_oldArrayPrototype$me, [this].concat(args)); // 如果有新增，我们要监控的是数组的每一项，而不是数组


      var addList;

      switch (method) {
        case 'push':
        case 'unshift':
          addList = args;
          break;

        case 'splice':
          addList = args.concat(2);
          break;
      }

      console.log(this.__ob__);

      this.__ob__.observeArray(addList);

      console.log(addList, 'addList');
      return result;
    };
  });

  // 如果是数组， 会劫持数组的方法，并对数组中不是基本数据类型的进行检测

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);

      // 对对象中的所有属性进行劫持
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false
      }); // data.__ob__ = this

      if (Array.isArray(data)) {
        // 数组劫持的逻辑
        // 核心思想是对数组的方法进行劫持
        // 对数组原来的方法进行改写，切片编程 高阶函数
        data.__proto__ = arrayMethods;
        this.observeArray(data);
      } else {
        this.walk(data);
      }
    } // 循环遍历劫持...


    _createClass(Observe, [{
      key: "walk",
      value: function walk(data) {
        // 对象
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        // console.log(data, 'observeArray')
        data.forEach(function (item) {
          observe(item);
        });
      }
    }]);

    return Observe;
  }();

  function defineReactive(data, key, value) {
    observe(value); // TODO Object.defineProperties

    console.log(data, 'data');
    Object.defineProperty(data, key, {
      get: function get() {
        console.log(key, 'get');
        return value;
      },
      set: function set(val) {
        console.log(key, val, 'set');
        observe(value);
        value = val;
      }
    });
  } // import { isObject } from '../utils'


  function observe(data) {
    if (data.__ob__) return; // 如果是对象才观测

    if (!isObject(data)) return; // if(!isObject(data)) return

    return new Observe(data);
  } // vue2 没有对数组进行索引的劫持
  // 而且一般用户很少通过索引去操作数组.
  // 内部就想到不对索引进行拦截，因为消耗严重.
  // 数组没有监控索引的变化，但是索引对应的内容是对象类型，需要被监控
  // 重写了push shift pop unshift reverse sort splice
  // 这几个方法

  function initState(vm) {
    var opts = vm.$options;

    if (opts.data) {
      initData(vm);
    }

    if (opts.props) ;
  }

  function initData(vm) {
    // vm
    var data = vm.$options.data; // 会将data中的所有数据进行数据劫持
    // defineProperty
    // 判断类型

    console.log(data);
    data = vm._data = isFuntion(data) ? data.call(vm) : data;

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe(data); // console.log(data)
  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }

  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z".concat(unicodeRegExp.source, "]*"); // 标签名

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // 用来获取的名的
  // match 后的索引为1的
  // Regular Expressions for parsing tags and attributes

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // a=b a="b" a='b'
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 匹配开始标签

  var startTagClose = /^\s*(\/?)>/; // <div/>

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配闭合标签
  // 将解析后的结果，组装成一个树结构 栈
  // ast 语法层面的描述
  // vdom dom节点

  var root = null;
  var stack = [];
  function paeserHTML(html) {
    function advance(len) {
      html = html.substring(len);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); // 如果没有遇到皆为标签就不停的解析

        var _end;

        var attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // console.log(attr, 'attr')
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          console.log(attr, '??attr');
          console.log(html, 'ggg');
          advance(attr[0].length);
          console.log(html, '?啦啦啦');
        }

        if (_end) {
          console.log(_end, 'end');
          advance(_end[0].length);
          console.log(html, 'end');
        }

        return match;
      }

      return false;
    }

    function createAstElement(tagName, attrs) {
      return {
        tag: tagName,
        type: 1,
        children: [],
        parent: null,
        attrs: attrs
      };
    }

    function start(tagName, attributes) {
      var parent = stack[stack.length - 1];
      var element = createAstElement(tagName, attributes);

      if (!root) {
        root = element;
      }

      element.parent = parent; // 当放入栈中时，记录父亲是谁

      if (parent) parent.children.push(element);
      stack.push(element);
    }

    function end(tagName) {
      // 弹出...
      var last = stack.pop();
      console.log(last, tagName, '--------');

      if (last.tag !== tagName) {
        throw new Error('标签有误');
      }
    }

    function chars(text) {
      console.log(text, 'text');
      console.log(stack, 'stack');
      text = text.replace(/\s/g, "");
      var parent = stack[stack.length - 1]; // console.log(parent, 'parent')

      if (text) {
        parent.children.push({
          type: 3,
          text: text
        });
      }
    }

    while (html) {
      // 解析的内容是否存在，如果存在就不停的解析 // htmlParse2
      var textEnd = html.indexOf('<'); // 当前解析的开头

      if (textEnd === 0) {
        var startTagMatch = parseStartTag();
        console.log(startTagMatch, 'startTagMatch');

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag);
        console.log(endTagMatch);

        if (endTagMatch) {
          end(endTagMatch[1]);
          advance(endTagMatch[0].length);
          continue;
        }
      }

      var text = void 0; // 1111</div>

      if (textEnd > 0) {
        console.log(html, 'html??');
        text = html.substring(0, textEnd);
      }

      if (text) {
        chars(text);
        advance(text.length);
      }
    }

    return root;
  }

  // TODO 梳理整个思路。。。
  // 看一下用户是否传入了 render 
  // 未传入render ，没传入可能传入的是template，如果template也没有传递
  // 将html进行词法解析（开始标签，结束标签 属性 文本）
  // ast 语法树  用来描述html语法的stack = []
  // codegen   <div>hello</div> => _c('div',{},'hello') 让字符串执行
  // eval 耗性能 会有作用域问题
  // 模板引擎 new Function
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  function generate(el) {
    console.log(el); // 遍历树 将树拼接成字符串

    var children = genChildren(el);
    var code = "_c(\"".concat(el.tag, "\",").concat(el.attrs.length ? genProps(el.attrs) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  function gen(el) {
    if (el.type === 1) return generate(el); // console.log(el, 'el??');

    if (el.type === 3) {
      var text = el.text;

      if (!defaultTagRE.test(text)) {
        return "_v('".concat(text, "')");
      } else {
        // 'hello' + arr + 'world'
        var tokens = [];
        var match;
        var lastIndex = defaultTagRE.lastIndex = 0; // console.log(text, 'text')
        // console.log(defaultTagRE.exec(text))

        while (match = defaultTagRE.exec(text)) {
          var index = match.index; // 开始索引
          // console.log(index, 'lastIndex')

          if (index > lastIndex) {
            console.log(match, 'match');
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }

          tokens.push("_s(".concat(match[1].trim(), ")")); // JSON.stringify..

          lastIndex = index + match[0].length;
        }

        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }

        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }

  function genChildren(el) {
    var children = el.children;

    if (children) {
      return children.map(function (c) {
        return gen(c);
      }).join(',');
    }
  }

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var styleObj = {};
          attr.value.replace(/([^;:]+)\:([^;:]+)/g, function () {
            styleObj[arguments[1]] = arguments[2];
          });
          attr.value = styleObj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function compileToFunction(template) {
    var root = paeserHTML(template);
    console.log(root, 'root');
    var code = generate(root);
    console.log(code, 'code');
    var render = new Function("with(this){return ".concat(code, "}")); // code中会用到数据 数据在vm上

    console.log(render.toString(), '/?'); // render.call(vm)

    return render;
  } // html => ast(只能描述语法 语法不存在的属性无法描述) => render函数 + （width + new Function）  => 虚拟dom => 生成真实dom
  // TODO with 函数 正则函数..

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      console.log('update vnode', vnode);
    };
  }
  function mountComponent(vm, el) {
    console.log(vm, el); // 更新函数 数据变化后 会再次调用此函数

    var updateComponent = function updateComponent() {
      // 调用render函数 生成虚拟dom
      vm._update(vm._render()); // 后续更新可以调用updateCompoennt方法
      // 用虚拟dom生成真实dom

    };

    updateComponent();
  }

  function initMixin(Vue) {
    // 表示在vue的基础上做一次混合操作
    // 默认下划线是私有的
    Vue.prototype._init = function (options) {
      console.log(options);
      var vm = this; // vue内部会对属性检测如果是$开头的就不会进行代理

      vm.$options = options; // 后面会对options进行扩展, 这里目前是用户传入的options
      // 对数据进行初始化 watch computed props data

      initState(vm); // vm 指向当前实例

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML; // TODO 生成render函数...
          // 渲染render...
          // console.log(template)

          console.log(template);
          options.render = compileToFunction(template);
        }
      }

      console.log(options.render, 'render...'); // 调用render 渲染真实dom 替换掉页面的内容

      mountComponent(vm, el); // 组件的挂载流程
    };
  } // 把模板转化成 对应的渲染函数 =》 虚拟dom概念 vnode =》 diff 算法 更新虚拟dom => 产生真实节点，更新
  //  vm.$options render 函数 就不用将模板转为渲染函数了
  // 没有render就用template
  // options.render 就是渲染函数

  function createElement(vm, tagName) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    // console.log(vm, tagName, data = {}, ...children, 'createElement')
    return vnode(vm, tagName, data, data.key, children, undefined);
  }
  function createTextElement(vm, text) {
    // console.log(vm, text, 'createTextElement')
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  } // export function 
  // TODO 虚拟DOM生成完毕...
  // TODO 整理思路!!!!

  function vnode(vm, tag, data, key, children, text) {
    return {
      vm: vm,
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text // ...

    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function (tagName, attr) {
      for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
      }

      console.log(tagName, attr, children, '_c');
      return createElement.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._v = function (text) {
      // 
      // console.log(text ,'?_v')
      return createTextElement(this, text);
    };

    Vue.prototype._s = function (val) {
      // return this[val]
      return JSON.stringify(val);
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render; // 解析出来的render方法
      // 也有可能是用户写的

      var vnode = render.call(vm); // TODO _v _c 等方法没有
      // console.log('render');
      // 生成虚拟dom

      return vnode;
    };
  }

  function Vue(options) {
    // options 为用户传入的选项
    this._init(options);
  }

  initMixin(Vue);
  renderMixin(Vue);
  lifecycleMixin(Vue); // renderMixin() // _render

  return Vue;

}));
//# sourceMappingURL=vue.js.map
