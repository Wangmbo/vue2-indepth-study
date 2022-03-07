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
  var methods = ['push', 'shift', 'pop', 'unshift', 'reverse'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var _oldArrayPrototype$me;

      console.log('数组发生变化...'); // TODO 如果是push了一个对象之类的，也需要劫持...

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_oldArrayPrototype$me = oldArrayPrototype[method]).call.apply(_oldArrayPrototype$me, [this].concat(args));
    };
  });

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);

      // 对对象中的所有属性进行劫持
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
    // 如果是对象才观测
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

  function initMixin(Vue) {
    // 表示在vue的基础上做一次混合操作
    // 默认下划线是私有的
    Vue.prototype._init = function (options) {
      console.log(options);
      var vm = this; // vue内部会对属性检测如果是$开头的就不会进行代理

      vm.$options = options; // 后面会对options进行扩展, 这里目前是用户传入的options
      // 对数据进行初始化 watch computed props data

      initState(vm); // vm 指向当前实例
    };
  }

  function Vue(options) {
    // options 为用户传入的选项
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
