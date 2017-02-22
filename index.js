(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParallaxCollection = require('./ParallaxCollection');
var Debug = require('./debug');

var $;

module.exports = function () {

  /**
   * @param {Object} options
   */
  function ParalaxBro(selector) {
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '100%';
    var options = arguments[2];

    _classCallCheck(this, ParalaxBro);

    var _normalizeOptions2 = this._normalizeOptions(options),
        disableStyles = _normalizeOptions2.disableStyles,
        debug = _normalizeOptions2.debug;

    this.collections = [];

    if (!selector) {
      throw 'You must pass a selector string to ParalaxBro.';
    }

    this._jQuery();
    this._cacheDOMElements(selector);
    this._bindEvents();
    if (!disableStyles) {
      this._styleDOM(height);
    }
    if (debug) {
      this._initDebug();
    }

    this._hydrateElements();
  }

  /**
   * @param {String} selector
   * @param {Object} options
   */


  _createClass(ParalaxBro, [{
    key: 'addCollection',
    value: function addCollection(selector, options) {
      var collection;
      collection = new ParallaxCollection(selector, options);
      this.collections.push(collection);
      return collection;
    }
  }, {
    key: '_hydrateElements',
    value: function _hydrateElements() {
      var _this = this;

      setTimeout(function () {
        return _this._moveElements(0);
      }, 0);
    }

    /**
     * @param {String} wrapper
     */

  }, {
    key: '_cacheDOMElements',
    value: function _cacheDOMElements(wrapper) {
      this.$el = {};
      this.$el.win = $(window);
      this.$el.doc = $(document);
      this.$el.body = $('body');
      this.$el.wrapper = $(wrapper);
    }
  }, {
    key: '_initDebug',
    value: function _initDebug() {
      var debug;
      debug = new Debug();
      debug.init();
    }
  }, {
    key: '_styleDOM',
    value: function _styleDOM(height) {
      var _$el = this.$el,
          body = _$el.body,
          wrapper = _$el.wrapper,
          doc = _$el.doc;

      doc.children().css('height', '100%');
      body.css('height', '100%');
      wrapper.css({
        'height': height,
        'overflow': 'visible',
        'min-height': '100%',
        'box-sizing': 'border-box'
      });
      wrapper.addClass('paralaxbro');
    }
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this2 = this;

      var track = function track() {
        var posY = window.pageYOffset;
        _this2._moveElements(posY);
        requestAnimationFrame(track);
      };
      requestAnimationFrame(track);
    }

    /**
     * @param {Number} posY
     */

  }, {
    key: '_moveElements',
    value: function _moveElements(posY) {
      var collections;
      collections = this.collections;
      collections.forEach(function (collection) {
        return collection.moveElements(posY);
      });
    }
  }, {
    key: '_jQuery',
    value: function _jQuery() {
      $ = jQuery;
      if (!$) {
        throw 'jQuery is not defined';
      }
    }
  }, {
    key: '_normalizeOptions',
    value: function _normalizeOptions(options) {
      return Object.assign({}, {
        wrapper: '#parallax',
        disableStyles: false,
        height: '100%',
        debug: false
      }, options);
    }
  }]);

  return ParalaxBro;
}();

},{"./ParallaxCollection":2,"./debug":4}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./utils'),
    normalizeOptions = _require.normalizeOptions,
    runUpdate = _require.runUpdate;

var ParallaxElement = require('./ParallaxElement');

var $;

module.exports = function () {

  /**
   * @param {String} selector
   * @param {Object} options
   */
  function ParallaxCollection(selector, options) {
    _classCallCheck(this, ParallaxCollection);

    options = normalizeOptions(options, {
      top: { value: 0 },
      hide: { value: false },
      zIndex: { value: -1 },
      update: { value: function value() {} }
    });
    var _options = options,
        top = _options.top,
        hide = _options.hide,
        zIndex = _options.zIndex,
        update = _options.update;


    this.$el;
    this.elements = [];
    this.yPrev;

    this.top = top;
    this.hide = hide;
    this.zIndex = zIndex;
    this.update = update;

    this.jQuery();
    this.styleCollection(selector, options);
  }

  /**
   * @param {Object} obj
   */


  _createClass(ParallaxCollection, [{
    key: 'addElements',
    value: function addElements(obj) {
      var _this = this;

      var selectors, top, height;
      selectors = Object.keys(obj);
      height = 0;
      selectors.forEach(function (selector) {
        var options = obj[selector];
        _this._addElement(selector, options);
        height += $(selector).outerHeight();
      });
      return this;
    }

    /**
     * @param {String} selector
     * @param {Object} options
     */

  }, {
    key: '_addElement',
    value: function _addElement(selector, options) {
      var element;
      element = new ParallaxElement(selector, options, this.top);
      this.elements.push(element);
      return this;
    }

    /**
     * @param {Number} posY
     */

  }, {
    key: 'moveElements',
    value: function moveElements(posY) {
      var elements;
      elements = this.elements;
      this.runCallbacks(posY);
      elements.forEach(function (element) {
        return element.moveElement(posY);
      });
      this.yPrev = posY;
    }

    /**
     * @param {Number} posY
     */

  }, {
    key: 'runCallbacks',
    value: function runCallbacks(posY) {
      this.updateHide(posY);
      this.updateZindex(posY);
      this.updateCallback(posY);
    }

    /**
     * @param {Number} posY
     */

  }, {
    key: 'updateHide',
    value: function updateHide(posY) {
      var _this2 = this;

      var prevY = this.yPrev;
      runUpdate(posY, prevY, this.hide, function (value) {
        _this2.hide.value = value;
        _this2.$el.css('opacity', value ? 0 : 1);
      });
    }

    /**
     * @param {Number} posY
     */

  }, {
    key: 'updateZindex',
    value: function updateZindex(posY) {
      var _this3 = this;

      var prevY = this.yPrev;
      runUpdate(posY, prevY, this.zIndex, function (value) {
        _this3.zIndex.value = value;
        _this3.$el.css('zIndex', value);
      });
    }

    /**
     * @param {Number} posY
     */

  }, {
    key: 'updateCallback',
    value: function updateCallback(posY) {
      var yPrev, $el, self;
      yPrev = this.yPrev;
      $el = this.$el;
      self = this;
      runUpdate(posY, yPrev, this.update, function (value, breakpoint) {
        self.update.breakpoints[breakpoint].call(self, $el, posY, yPrev);
      });
    }
  }, {
    key: 'jQuery',
    value: function (_jQuery) {
      function jQuery() {
        return _jQuery.apply(this, arguments);
      }

      jQuery.toString = function () {
        return _jQuery.toString();
      };

      return jQuery;
    }(function () {
      $ = jQuery;
      if (!$) {
        throw 'jQuery is not defined';
      }
    })

    /**
     * @param {String} selector
     * @param {Object} options
     */

  }, {
    key: 'styleCollection',
    value: function styleCollection(selector, options) {
      var $el, css;
      var zIndex = options.zIndex,
          hide = options.hide;

      css = {};
      css.zIndex = zIndex.value;
      if (hide.value) {
        css.display = 'none';
      }
      $el = $(selector);
      $el.css(css);
      this.$el = $el;
      return this;
    }
  }]);

  return ParallaxCollection;
}();

},{"./ParallaxElement":3,"./utils":6}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./utils'),
    prefix = _require.prefix,
    normalizeOptions = _require.normalizeOptions,
    runUpdate = _require.runUpdate;

var $;

module.exports = function () {

  /**
   * @param {String} selector
   * @param {Object} options
   * @param {Object} offsetTop
   */
  function ParallaxElement(selector, options, offsetTop) {
    _classCallCheck(this, ParallaxElement);

    options = normalizeOptions(options, {
      top: { value: 0 },
      hide: { value: false },
      zIndex: { value: -1 },
      speed: { value: 1 },
      center: { value: false },
      update: { value: function value() {} },
      xFunc: { value: 0 }
    });

    var _options = options,
        top = _options.top,
        hide = _options.hide,
        zIndex = _options.zIndex,
        speed = _options.speed,
        center = _options.center,
        update = _options.update,
        xFunc = _options.xFunc;


    this.$el;
    this.prefix = prefix();
    this.offsetTop = offsetTop;
    this.yOffset = offsetTop.value;
    this.yPrev;
    this.tPrev;

    this.top = top;
    this.hide = hide;
    this.zIndex = zIndex;
    this.speed = speed;
    this.center = center;
    this.update = update;
    this.xFunc = xFunc;

    this.jQuery();
    this.styleElement(selector, { center: center, top: top });
  }

  /**
   * @param {Number} posY
   */


  _createClass(ParallaxElement, [{
    key: 'moveElement',
    value: function moveElement(posY) {
      var $el, yPrev, tPrev, yNew, xNew, xFunc, func, speed, breakpoint, prevBreakpoint, delta, prefix;

      this.runCallbacks(posY);

      yPrev = this.yPrev || 0;
      tPrev = this.tPrev || 0;
      prefix = this.prefix;
      xFunc = this.xFunc;
      $el = this.$el;
      speed = this.speed.value;
      breakpoint = this.speed._breakpoint;

      if (breakpoint !== undefined) {
        var lastSpeed = void 0,
            yDiff = void 0;
        delta = 0;
        lastSpeed = this.speed._lastSpeed;

        yDiff = yPrev - breakpoint;
        delta += Math.round(yDiff * lastSpeed * 100) / 100;

        yDiff = breakpoint - posY;
        delta += Math.round(yDiff * speed * 100) / 100;

        this.speed._breakpoint = undefined;
      } else {
        var _yDiff = void 0;
        delta = 0;
        _yDiff = yPrev - posY;
        delta = Math.round(_yDiff * speed * 100) / 100;
      }

      yNew = tPrev + delta;
      func = xFunc.breakpoints[xFunc.value];
      xNew = func ? func.call(null, posY - xFunc.value) : 0;

      $el[0].style[prefix.dom + 'Transform'] = 'translate3d(' + xNew + 'px, ' + yNew + 'px, 0) translateZ(0) scale(1)';
      this.yPrev = posY;
      this.tPrev = yNew;
      return this;
    }

    /**
     * @param {Number} posY
     */

  }, {
    key: 'runCallbacks',
    value: function runCallbacks(posY) {
      this.updateHide(posY);
      this.updateZindex(posY);
      this.updateTop(posY);
      this.updateOffset(posY);
      this.updateSpeed(posY);
      this.updateXFunc(posY);
      this.updateCallback(posY);
    }

    /**
     * @param {Number} posY
     */

  }, {
    key: 'updateHide',
    value: function updateHide(posY) {
      var _this = this;

      var yPrev = this.yPrev;
      runUpdate(posY, yPrev, this.hide, function (value) {
        _this.hide.value = value;
        _this.$el.css('display', value ? 'none' : 'block');
      });
    }
  }, {
    key: 'updateZindex',
    value: function updateZindex(posY) {
      var _this2 = this;

      var prevY = this.yPrev;
      runUpdate(posY, prevY, this.zIndex, function (value) {
        _this2.zIndex.value = value;
        _this2.$el.css('zIndex', value);
      });
    }

    /**
     * @param {Number} posY
     */

  }, {
    key: 'updateTop',
    value: function updateTop(posY) {
      var _this3 = this;

      var yPrev = this.yPrev;
      runUpdate(posY, yPrev, this.top, function (value) {
        var yOffset = _this3.yOffset;
        _this3.top.value = value = value + yOffset;
        _this3.$el.css('top', value + 'px');
      });
    }

    /**
     * @param {Number} posY
     */

  }, {
    key: 'updateOffset',
    value: function updateOffset(posY) {
      var _this4 = this;

      var yPrev = this.yPrev;
      runUpdate(posY, yPrev, this.offsetTop, function (value) {
        var yDiff, top;
        yDiff = value - _this4.yOffset;
        _this4.yOffset = value;
        top = parseInt(_this4.$el.css('top'), 10);
        _this4.$el.css('top', top + yDiff + 'px');
      });
    }

    /**
     * @param {Number} posY
     */

  }, {
    key: 'updateSpeed',
    value: function updateSpeed(posY) {
      var _this5 = this;

      var yPrev = this.yPrev;
      runUpdate(posY, yPrev, this.speed, function (value, breakpoint, scrollingDown, actualBreakpoint) {
        _this5.speed._breakpoint = actualBreakpoint;
        _this5.speed._lastSpeed = _this5.speed.value;
        _this5.speed.value = value;
      });
    }

    /**
     * @param {Number} posY
     */

  }, {
    key: 'updateXFunc',
    value: function updateXFunc(posY) {
      var _this6 = this;

      var yPrev = this.yPrev;
      runUpdate(posY, yPrev, this.xFunc, function (value, breakpoint, scrollingDown, actualBreakpoint) {
        _this6.xFunc.value = breakpoint;
      });
    }

    /**
     * @param {Number} posY
     */

  }, {
    key: 'updateCallback',
    value: function updateCallback(posY) {
      var yPrev, $el, self;
      yPrev = this.yPrev;
      $el = this.$el;
      self = this;
      runUpdate(posY, yPrev, this.update, function (value, breakpoint) {
        self.update.breakpoints[breakpoint].call(self, $el, posY, yPrev);
      });
    }
  }, {
    key: 'jQuery',
    value: function (_jQuery) {
      function jQuery() {
        return _jQuery.apply(this, arguments);
      }

      jQuery.toString = function () {
        return _jQuery.toString();
      };

      return jQuery;
    }(function () {
      $ = jQuery;
      if (!$) {
        throw 'jQuery is not defined';
      }
      return this;
    })

    /**
     * @param {String} selector
     * @param {Object} options
     */

  }, {
    key: 'styleElement',
    value: function styleElement(selector, options) {
      var $el, css, yOffset;
      var center = options.center,
          top = options.top;

      yOffset = this.yOffset;
      css = {
        'position': 'fixed',
        'left': 0,
        'right': 0
      };
      if (center.value) {
        css['margin-right'] = 'auto';
        css['margin-left'] = 'auto';
      }
      if (top.value) {
        css.top = top + yOffset + 'px';
      }
      $el = $(selector);
      if (!$el.length) {
        throw 'Invalid selector "' + selector + '"';
      }
      $el.css(css);
      this.$el = $el;
      return this;
    }
  }]);

  return ParallaxElement;
}();

},{"./utils":6}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function Debug() {
    _classCallCheck(this, Debug);
  }

  _createClass(Debug, [{
    key: 'init',
    value: function init() {
      var $debugger;

      $('body').append('<span id="parallaxbroDebugger">0</span>');

      $debugger = $('#parallaxbroDebugger');

      $debugger.css({
        'position': 'fixed',
        'top': '0',
        'right': '0',
        'font-size': '17px',
        'color': 'white',
        'background': 'black',
        'padding': '10px 12px',
        'z-index': '100000',
        'border-top-left-radius': '4px',
        'border-bottom-left-radius': '4px'
      });

      setInterval(function () {
        $debugger.html(Math.round(window.pageYOffset));
      }, 250);
    }
  }]);

  return Debug;
}();

},{}],5:[function(require,module,exports){
'use strict';

module.exports = require('./ParallaxBro');

},{"./ParallaxBro":1}],6:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var self = module.exports;

self.callBreakpoints = function (posY, yPrev, breakpoints, callback) {
  var scrollingDown, yDiff;
  scrollingDown = yPrev < posY;
  yDiff = scrollingDown ? posY - yPrev : yPrev - posY;
  breakpoints = breakpoints.map(function (breakpoint) {
    return parseInt(breakpoint, 10);
  });
  // @todo - we could use a different technique but this one works w/ little aparent downsides.
  for (var i = 0; i < yDiff; i++) {
    var pos = void 0,
        index = void 0;
    pos = scrollingDown ? yPrev + i : yPrev - i;
    index = breakpoints.indexOf(pos);
    if (index > -1) {
      var _i = scrollingDown ? index : index - 1;
      callback.call(null, breakpoints[_i], scrollingDown, breakpoints[index]);
    }
  }
};

self.runUpdate = function (posY, yPrev, obj, callback) {
  var breakpoints = Object.keys(obj.breakpoints);

  // Call on init.
  if (yPrev === undefined) {
    var value = obj.breakpoints[posY];
    if (value !== undefined) {
      callback.call(null, value, posY, true);
    }
  }
  self.callBreakpoints(posY, yPrev, breakpoints, function (breakpoint, scrollingDown, actualBreakpoint) {
    var value = obj.breakpoints[breakpoint];
    callback.call(null, value, breakpoint, scrollingDown, actualBreakpoint);
  });
};

self.normalizeOptions = function (options, defaults) {
  var exceptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var keys;

  options = Object.assign({}, defaults, options);
  keys = Object.keys(options);

  // keys = keys.filter(key => exceptions.indexOf(key) === -1);

  keys.forEach(function (key) {
    var value, isObject;
    value = options[key];
    isObject = self.isType(value, 'object');
    if (isObject) {
      var value1 = value && value['0'] ? value['0'] : defaults[key].value;
      delete value.value;
      options[key] = {
        value: value1,
        breakpoints: Object.assign({}, { 0: value1 }, value)
      };
    } else {
      options[key] = {
        value: value,
        breakpoints: { 0: value }
      };
    }
  });
  return options;
};

/**
 * Given a Mixed value type check.
 * @param {Mixed} value.
 * @param {String} type.
 * @return {Boolean}
 * @api public.
 * @tests unit.
 */
self.isType = function (value, type) {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && Number.isNaN(value) === false;
    case 'boolean':
      return value === true || value === false;
    case 'array':
      return Array.isArray(value);
    case 'object':
      return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null && Array.isArray(value) === false;
    case 'null':
      return value === null;
    case 'undefined':
      return value === undefined;
    case 'function':
      return Object.prototype.toString.call(value) === '[object Function]';
    case 'symbol':
      return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'symbol';
    case 'NaN':
      return Number.isNaN(value);
    case 'date':
      return value instanceof Date;
    default:
      throw new Error('Unrecgonized type: "' + type + '"');
  }
};

self.prefix = function () {
  var styles, pre, dom;
  styles = window.getComputedStyle(document.documentElement, ''), pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1], dom = 'webkit|Moz|MS|O'.match(new RegExp('(' + pre + ')', 'i'))[1];
  return {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
};

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvUGFyYWxsYXhCcm8uanMiLCJsaWIvUGFyYWxsYXhDb2xsZWN0aW9uLmpzIiwibGliL1BhcmFsbGF4RWxlbWVudC5qcyIsImxpYi9kZWJ1Zy5qcyIsImxpYi9pbmRleC5qcyIsImxpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0FBLElBQU0scUJBQXFCLFFBQVEsc0JBQVIsQ0FBM0I7QUFDQSxJQUFNLFFBQVEsUUFBUSxTQUFSLENBQWQ7O0FBRUEsSUFBSSxDQUFKOztBQUVBLE9BQU8sT0FBUDs7QUFFRTs7O0FBR0Esc0JBQVksUUFBWixFQUFnRDtBQUFBLFFBQTFCLE1BQTBCLHVFQUFqQixNQUFpQjtBQUFBLFFBQVQsT0FBUzs7QUFBQTs7QUFBQSw2QkFDZixLQUFLLGlCQUFMLENBQXVCLE9BQXZCLENBRGU7QUFBQSxRQUN2QyxhQUR1QyxzQkFDdkMsYUFEdUM7QUFBQSxRQUN4QixLQUR3QixzQkFDeEIsS0FEd0I7O0FBRzlDLFNBQUssV0FBTCxHQUFtQixFQUFuQjs7QUFFQSxRQUFJLENBQUMsUUFBTCxFQUFlO0FBQ2IsWUFBTSxnREFBTjtBQUNEOztBQUVELFNBQUssT0FBTDtBQUNBLFNBQUssaUJBQUwsQ0FBdUIsUUFBdkI7QUFDQSxTQUFLLFdBQUw7QUFDQSxRQUFJLENBQUMsYUFBTCxFQUFvQjtBQUNsQixXQUFLLFNBQUwsQ0FBZSxNQUFmO0FBQ0Q7QUFDRCxRQUFJLEtBQUosRUFBVztBQUNULFdBQUssVUFBTDtBQUNEOztBQUVELFNBQUssZ0JBQUw7QUFDRDs7QUFFRDs7Ozs7O0FBM0JGO0FBQUE7QUFBQSxrQ0ErQmdCLFFBL0JoQixFQStCMEIsT0EvQjFCLEVBK0JtQztBQUMvQixVQUFJLFVBQUo7QUFDQSxtQkFBYSxJQUFJLGtCQUFKLENBQXVCLFFBQXZCLEVBQWlDLE9BQWpDLENBQWI7QUFDQSxXQUFLLFdBQUwsQ0FBaUIs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SUFBakMsT0FBTjtBQXhCSjtBQTBCRCxDQTNCRDs7QUE2QkEsS0FBSyxNQUFMLEdBQWMsWUFBTTtBQUNsQixNQUFJLE1BQUosRUFBWSxHQUFaLEVBQWlCLEdBQWpCO0FBQ0EsV0FBUyxPQUFPLGdCQUFQLENBQXdCLFNBQVMsZUFBakMsRUFBa0QsRUFBbEQsQ0FBVCxFQUNFLE1BQU0sQ0FBQyxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FDSixJQURJLENBQ0MsTUFERCxFQUVKLElBRkksQ0FFQyxFQUZELEVBR0osS0FISSxDQUdFLG1CQUhGLEtBRzJCLE9BQU8sS0FBUCxLQUFpQixFQUFqQixJQUF1QixDQUFDLEVBQUQsRUFBSyxHQUFMLENBSG5ELEVBSUosQ0FKSSxDQURSLEVBTUUsTUFBTyxpQkFBRCxDQUFvQixLQUFwQixDQUEwQixJQUFJLE1BQUosQ0FBVyxNQUFNLEdBQU4sR0FBWSxHQUF2QixFQUE0QixHQUE1QixDQUExQixFQUE0RCxDQUE1RCxDQU5SO0FBT0UsU0FBTztBQUNMLFNBQUssR0FEQTtBQUVMLGVBQVcsR0FGTjtBQUdMLFNBQUssTUFBTSxHQUFOLEdBQVksR0FIWjtBQUlMLFFBQUksSUFBSSxDQUFKLEVBQU8sV0FBUCxLQUF1QixJQUFJLE1BQUosQ0FBVyxDQUFYO0FBSnRCLEdBQVA7QUFNSCxDQWZEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IFBhcmFsbGF4Q29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vUGFyYWxsYXhDb2xsZWN0aW9uJyk7XG5jb25zdCBEZWJ1ZyA9IHJlcXVpcmUoJy4vZGVidWcnKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxheEJybyB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZWxlY3RvciwgaGVpZ2h0ID0gJzEwMCUnLCBvcHRpb25zKSB7XG4gICAgY29uc3Qge2Rpc2FibGVTdHlsZXMsIGRlYnVnfSA9IHRoaXMuX25vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbGxlY3Rpb25zID0gW107XG5cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICB0aHJvdyAnWW91IG11c3QgcGFzcyBhIHNlbGVjdG9yIHN0cmluZyB0byBQYXJhbGF4QnJvLic7XG4gICAgfVxuXG4gICAgdGhpcy5falF1ZXJ5KCk7XG4gICAgdGhpcy5fY2FjaGVET01FbGVtZW50cyhzZWxlY3Rvcik7XG4gICAgdGhpcy5fYmluZEV2ZW50cygpO1xuICAgIGlmICghZGlzYWJsZVN0eWxlcykge1xuICAgICAgdGhpcy5fc3R5bGVET00oaGVpZ2h0KTtcbiAgICB9XG4gICAgaWYgKGRlYnVnKSB7XG4gICAgICB0aGlzLl9pbml0RGVidWcoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9oeWRyYXRlRWxlbWVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGFkZENvbGxlY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbjtcbiAgICBjb2xsZWN0aW9uID0gbmV3IFBhcmFsbGF4Q29sbGVjdGlvbihzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgdGhpcy5jb2xsZWN0aW9ucy5wdXNoKGNvbGxlY3Rpb24pO1xuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgX2h5ZHJhdGVFbGVtZW50cygpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuX21vdmVFbGVtZW50cygwKSAsMClcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gd3JhcHBlclxuICAgKi9cbiAgX2NhY2hlRE9NRWxlbWVudHMod3JhcHBlcikge1xuICAgIHRoaXMuJGVsID0ge307XG4gICAgdGhpcy4kZWwud2luID0gJCh3aW5kb3cpO1xuICAgIHRoaXMuJGVsLmRvYyA9ICQoZG9jdW1lbnQpO1xuICAgIHRoaXMuJGVsLmJvZHkgPSAkKCdib2R5Jyk7XG4gICAgdGhpcy4kZWwud3JhcHBlciA9ICQod3JhcHBlcik7XG4gIH1cblxuICBfaW5pdERlYnVnKCkge1xuICAgIHZhciBkZWJ1ZztcbiAgICBkZWJ1ZyA9IG5ldyBEZWJ1ZygpO1xuICAgIGRlYnVnLmluaXQoKTtcbiAgfVxuXG4gIF9zdHlsZURPTShoZWlnaHQpIHtcbiAgICB2YXIge2JvZHksIHdyYXBwZXIsIGRvY30gPSB0aGlzLiRlbDtcbiAgICBkb2MuY2hpbGRyZW4oKS5jc3MoJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgYm9keS5jc3MoJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgd3JhcHBlci5jc3Moe1xuICAgICAgJ2hlaWdodCc6IGhlaWdodCxcbiAgICAgICdvdmVyZmxvdyc6ICd2aXNpYmxlJyxcbiAgICAgICdtaW4taGVpZ2h0JzogJzEwMCUnLFxuICAgICAgJ2JveC1zaXppbmcnOiAnYm9yZGVyLWJveCcsXG4gICAgfSk7XG4gICAgd3JhcHBlci5hZGRDbGFzcygncGFyYWxheGJybycpO1xuICB9XG5cbiAgX2JpbmRFdmVudHMoKSB7XG4gICAgY29uc3QgdHJhY2sgPSAoKSA9PiB7XG4gICAgICB2YXIgcG9zWSA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgIHRoaXMuX21vdmVFbGVtZW50cyhwb3NZKTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0cmFjayk7XG4gICAgfVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0cmFjayk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIF9tb3ZlRWxlbWVudHMocG9zWSkge1xuICAgIHZhciBjb2xsZWN0aW9ucztcbiAgICBjb2xsZWN0aW9ucyA9IHRoaXMuY29sbGVjdGlvbnM7XG4gICAgY29sbGVjdGlvbnMuZm9yRWFjaChjb2xsZWN0aW9uID0+IGNvbGxlY3Rpb24ubW92ZUVsZW1lbnRzKHBvc1kpKTtcbiAgfVxuXG4gIF9qUXVlcnkoKSB7XG4gICAgJCA9IGpRdWVyeTtcbiAgICBpZiAoISQpIHtcbiAgICAgIHRocm93ICdqUXVlcnkgaXMgbm90IGRlZmluZWQnO1xuICAgIH1cbiAgfVxuXG4gIF9ub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgd3JhcHBlcjogJyNwYXJhbGxheCcsXG4gICAgICBkaXNhYmxlU3R5bGVzOiBmYWxzZSxcbiAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgZGVidWc6IGZhbHNlLFxuICAgIH0sIG9wdGlvbnMpO1xuICB9XG5cbn1cbiIsImNvbnN0IHtub3JtYWxpemVPcHRpb25zLCBydW5VcGRhdGV9ID0gcmVxdWlyZSgnLi91dGlscycpO1xuY29uc3QgUGFyYWxsYXhFbGVtZW50ID0gcmVxdWlyZSgnLi9QYXJhbGxheEVsZW1lbnQnKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxsYXhDb2xsZWN0aW9uIHtcblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMsIHtcbiAgICAgIHRvcDoge3ZhbHVlOiAwfSxcbiAgICAgIGhpZGU6IHt2YWx1ZTogZmFsc2V9LFxuICAgICAgekluZGV4OiB7dmFsdWU6IC0xfSxcbiAgICAgIHVwZGF0ZToge3ZhbHVlOiAoKSA9PiB7fX0sXG4gICAgfSk7XG4gICAgY29uc3Qge3RvcCwgaGlkZSwgekluZGV4LCB1cGRhdGV9ID0gb3B0aW9ucztcblxuICAgIHRoaXMuJGVsO1xuICAgIHRoaXMuZWxlbWVudHMgPSBbXTtcbiAgICB0aGlzLnlQcmV2O1xuXG4gICAgdGhpcy50b3AgPSB0b3A7XG4gICAgdGhpcy5oaWRlID0gaGlkZTtcbiAgICB0aGlzLnpJbmRleCA9IHpJbmRleDtcbiAgICB0aGlzLnVwZGF0ZSA9IHVwZGF0ZTtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5zdHlsZUNvbGxlY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICovXG4gIGFkZEVsZW1lbnRzKG9iaikge1xuICAgIHZhciBzZWxlY3RvcnMsIHRvcCwgaGVpZ2h0O1xuICAgIHNlbGVjdG9ycyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgaGVpZ2h0ID0gMDtcbiAgICBzZWxlY3RvcnMuZm9yRWFjaChzZWxlY3RvciA9PiB7XG4gICAgICB2YXIgb3B0aW9ucyA9IG9ialtzZWxlY3Rvcl07XG4gICAgICB0aGlzLl9hZGRFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICAgIGhlaWdodCArPSAkKHNlbGVjdG9yKS5vdXRlckhlaWdodCgpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgX2FkZEVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgZWxlbWVudDtcbiAgICBlbGVtZW50ID0gbmV3IFBhcmFsbGF4RWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucywgdGhpcy50b3ApO1xuICAgIHRoaXMuZWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgbW92ZUVsZW1lbnRzKHBvc1kpIHtcbiAgICB2YXIgZWxlbWVudHM7XG4gICAgZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzO1xuICAgIHRoaXMucnVuQ2FsbGJhY2tzKHBvc1kpO1xuICAgIGVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiBlbGVtZW50Lm1vdmVFbGVtZW50KHBvc1kpKTtcbiAgICB0aGlzLnlQcmV2ID0gcG9zWTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgcnVuQ2FsbGJhY2tzKHBvc1kpIHtcbiAgICB0aGlzLnVwZGF0ZUhpZGUocG9zWSk7XG4gICAgdGhpcy51cGRhdGVaaW5kZXgocG9zWSk7XG4gICAgdGhpcy51cGRhdGVDYWxsYmFjayhwb3NZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlSGlkZShwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuaGlkZSwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLmhpZGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuJGVsLmNzcygnb3BhY2l0eScsIHZhbHVlID8gMCA6IDEpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVaaW5kZXgocG9zWSkge1xuICAgIHZhciBwcmV2WSA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHByZXZZLCB0aGlzLnpJbmRleCwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLnpJbmRleC52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy4kZWwuY3NzKCd6SW5kZXgnLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZUNhbGxiYWNrKHBvc1kpIHtcbiAgICB2YXIgeVByZXYsICRlbCwgc2VsZjtcbiAgICB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgJGVsID0gdGhpcy4kZWw7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLnVwZGF0ZSwgKHZhbHVlLCBicmVha3BvaW50KSA9PiB7XG4gICAgICBzZWxmLnVwZGF0ZS5icmVha3BvaW50c1ticmVha3BvaW50XS5jYWxsKHNlbGYsICRlbCwgcG9zWSwgeVByZXYpO1xuICAgIH0pO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBzdHlsZUNvbGxlY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgJGVsLCBjc3M7XG4gICAgdmFyIHt6SW5kZXgsIGhpZGV9ID0gb3B0aW9ucztcbiAgICBjc3MgPSB7fTtcbiAgICBjc3MuekluZGV4ID0gekluZGV4LnZhbHVlO1xuICAgIGlmIChoaWRlLnZhbHVlKSB7XG4gICAgICBjc3MuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG4gICAgJGVsID0gJChzZWxlY3Rvcik7XG4gICAgJGVsLmNzcyhjc3MpO1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn1cbiIsImNvbnN0IHtwcmVmaXgsIG5vcm1hbGl6ZU9wdGlvbnMsIHJ1blVwZGF0ZX0gPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsbGF4RWxlbWVudCB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAcGFyYW0ge09iamVjdH0gb2Zmc2V0VG9wXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZWxlY3Rvciwgb3B0aW9ucywgb2Zmc2V0VG9wKSB7XG4gICAgb3B0aW9ucyA9IG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucywge1xuICAgICAgdG9wOiB7dmFsdWU6IDB9LFxuICAgICAgaGlkZToge3ZhbHVlOiBmYWxzZX0sXG4gICAgICB6SW5kZXg6IHt2YWx1ZTogLTF9LFxuICAgICAgc3BlZWQ6IHt2YWx1ZTogMX0sXG4gICAgICBjZW50ZXI6IHt2YWx1ZTogZmFsc2V9LFxuICAgICAgdXBkYXRlOiB7dmFsdWU6ICgpID0+IHt9fSxcbiAgICAgIHhGdW5jOiB7dmFsdWU6IDB9LFxuICAgIH0pO1xuXG5cbiAgICBjb25zdCB7dG9wLCBoaWRlLCB6SW5kZXgsIHNwZWVkLCBjZW50ZXIsIHVwZGF0ZSwgeEZ1bmN9ID0gb3B0aW9ucztcblxuICAgIHRoaXMuJGVsO1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4KCk7XG4gICAgdGhpcy5vZmZzZXRUb3AgPSBvZmZzZXRUb3A7XG4gICAgdGhpcy55T2Zmc2V0ID0gb2Zmc2V0VG9wLnZhbHVlO1xuICAgIHRoaXMueVByZXY7XG4gICAgdGhpcy50UHJldjtcblxuICAgIHRoaXMudG9wID0gdG9wO1xuICAgIHRoaXMuaGlkZSA9IGhpZGU7XG4gICAgdGhpcy56SW5kZXggPSB6SW5kZXg7XG4gICAgdGhpcy5zcGVlZCA9IHNwZWVkO1xuICAgIHRoaXMuY2VudGVyID0gY2VudGVyO1xuICAgIHRoaXMudXBkYXRlID0gdXBkYXRlO1xuICAgIHRoaXMueEZ1bmMgPSB4RnVuYztcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5zdHlsZUVsZW1lbnQoc2VsZWN0b3IsIHtjZW50ZXIsIHRvcH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBtb3ZlRWxlbWVudChwb3NZKSB7XG4gICAgdmFyICRlbCwgeVByZXYsIHRQcmV2LCB5TmV3LCB4TmV3LCB4RnVuYywgZnVuYywgc3BlZWQsIGJyZWFrcG9pbnQsIHByZXZCcmVha3BvaW50LCBkZWx0YSwgcHJlZml4XG5cbiAgICB0aGlzLnJ1bkNhbGxiYWNrcyhwb3NZKTtcblxuICAgIHlQcmV2ID0gdGhpcy55UHJldiB8fCAwO1xuICAgIHRQcmV2ID0gdGhpcy50UHJldiB8fCAwO1xuICAgIHByZWZpeCA9IHRoaXMucHJlZml4O1xuICAgIHhGdW5jID0gdGhpcy54RnVuYztcbiAgICAkZWwgPSB0aGlzLiRlbDtcbiAgICBzcGVlZCA9IHRoaXMuc3BlZWQudmFsdWU7XG4gICAgYnJlYWtwb2ludCA9IHRoaXMuc3BlZWQuX2JyZWFrcG9pbnQ7XG5cbiAgICBpZiAoYnJlYWtwb2ludCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBsZXQgbGFzdFNwZWVkLCB5RGlmZjtcbiAgICAgIGRlbHRhID0gMDtcbiAgICAgIGxhc3RTcGVlZCA9IHRoaXMuc3BlZWQuX2xhc3RTcGVlZDtcblxuICAgICAgeURpZmYgPSB5UHJldiAtIGJyZWFrcG9pbnQ7XG4gICAgICBkZWx0YSArPSBNYXRoLnJvdW5kKHlEaWZmKmxhc3RTcGVlZCoxMDApIC8gMTAwO1xuXG4gICAgICB5RGlmZiA9IGJyZWFrcG9pbnQgLSBwb3NZO1xuICAgICAgZGVsdGEgKz0gTWF0aC5yb3VuZCh5RGlmZipzcGVlZCoxMDApIC8gMTAwO1xuXG4gICAgICB0aGlzLnNwZWVkLl9icmVha3BvaW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxldCB5RGlmZjtcbiAgICAgIGRlbHRhID0gMDtcbiAgICAgIHlEaWZmID0geVByZXYgLSBwb3NZO1xuICAgICAgZGVsdGEgPSBNYXRoLnJvdW5kKHlEaWZmKnNwZWVkKjEwMCkgLyAxMDA7XG4gICAgfVxuXG4gICAgeU5ldyA9IHRQcmV2ICsgZGVsdGE7XG4gICAgZnVuYyA9IHhGdW5jLmJyZWFrcG9pbnRzW3hGdW5jLnZhbHVlXTtcbiAgICB4TmV3ID0gZnVuYyA/IGZ1bmMuY2FsbChudWxsLCBwb3NZIC0geEZ1bmMudmFsdWUpIDogMDtcblxuICAgICRlbFswXS5zdHlsZVtwcmVmaXguZG9tICsgJ1RyYW5zZm9ybSddID0gYHRyYW5zbGF0ZTNkKCR7eE5ld31weCwgJHt5TmV3fXB4LCAwKSB0cmFuc2xhdGVaKDApIHNjYWxlKDEpYDtcbiAgICB0aGlzLnlQcmV2ID0gcG9zWTtcbiAgICB0aGlzLnRQcmV2ID0geU5ldztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgcnVuQ2FsbGJhY2tzKHBvc1kpIHtcbiAgICB0aGlzLnVwZGF0ZUhpZGUocG9zWSk7XG4gICAgdGhpcy51cGRhdGVaaW5kZXgocG9zWSk7XG4gICAgdGhpcy51cGRhdGVUb3AocG9zWSk7XG4gICAgdGhpcy51cGRhdGVPZmZzZXQocG9zWSk7XG4gICAgdGhpcy51cGRhdGVTcGVlZChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZVhGdW5jKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlQ2FsbGJhY2socG9zWSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZUhpZGUocG9zWSkge1xuICAgIHZhciB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLmhpZGUsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy5oaWRlLnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLiRlbC5jc3MoJ2Rpc3BsYXknLCB2YWx1ZSA/ICdub25lJyA6ICdibG9jaycpO1xuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlWmluZGV4KHBvc1kpIHtcbiAgICB2YXIgcHJldlkgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgdGhpcy56SW5kZXgsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy56SW5kZXgudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuJGVsLmNzcygnekluZGV4JywgdmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVUb3AocG9zWSkge1xuICAgIHZhciB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLnRvcCwgKHZhbHVlKSA9PiB7XG4gICAgICB2YXIgeU9mZnNldCA9IHRoaXMueU9mZnNldDtcbiAgICAgIHRoaXMudG9wLnZhbHVlID0gdmFsdWUgPSB2YWx1ZSArIHlPZmZzZXQ7XG4gICAgICB0aGlzLiRlbC5jc3MoJ3RvcCcsIHZhbHVlICsgJ3B4Jyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZU9mZnNldChwb3NZKSB7XG4gICAgdmFyIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMub2Zmc2V0VG9wLCAodmFsdWUpID0+IHtcbiAgICAgIHZhciB5RGlmZiwgdG9wO1xuICAgICAgeURpZmYgPSB2YWx1ZSAtIHRoaXMueU9mZnNldDtcbiAgICAgIHRoaXMueU9mZnNldCA9IHZhbHVlO1xuICAgICAgdG9wID0gcGFyc2VJbnQodGhpcy4kZWwuY3NzKCd0b3AnKSwgMTApO1xuICAgICAgdGhpcy4kZWwuY3NzKCd0b3AnLCB0b3AgKyB5RGlmZiArICdweCcpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVTcGVlZChwb3NZKSB7XG4gICAgdmFyIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMuc3BlZWQsICh2YWx1ZSwgYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93biwgYWN0dWFsQnJlYWtwb2ludCkgPT4ge1xuICAgICAgdGhpcy5zcGVlZC5fYnJlYWtwb2ludCA9IGFjdHVhbEJyZWFrcG9pbnQ7XG4gICAgICB0aGlzLnNwZWVkLl9sYXN0U3BlZWQgPSB0aGlzLnNwZWVkLnZhbHVlO1xuICAgICAgdGhpcy5zcGVlZC52YWx1ZSA9IHZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVYRnVuYyhwb3NZKSB7XG4gICAgdmFyIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMueEZ1bmMsICh2YWx1ZSwgYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93biwgYWN0dWFsQnJlYWtwb2ludCkgPT4ge1xuICAgICAgdGhpcy54RnVuYy52YWx1ZSA9IGJyZWFrcG9pbnQ7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZUNhbGxiYWNrKHBvc1kpIHtcbiAgICB2YXIgeVByZXYsICRlbCwgc2VsZjtcbiAgICB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgJGVsID0gdGhpcy4kZWw7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLnVwZGF0ZSwgKHZhbHVlLCBicmVha3BvaW50KSA9PiB7XG4gICAgICBzZWxmLnVwZGF0ZS5icmVha3BvaW50c1ticmVha3BvaW50XS5jYWxsKHNlbGYsICRlbCwgcG9zWSwgeVByZXYpO1xuICAgIH0pO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBzdHlsZUVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgJGVsLCBjc3MsIHlPZmZzZXQ7XG4gICAgdmFyIHtjZW50ZXIsIHRvcH0gPSBvcHRpb25zO1xuICAgIHlPZmZzZXQgPSB0aGlzLnlPZmZzZXQ7XG4gICAgY3NzID0ge1xuICAgICAgJ3Bvc2l0aW9uJzogJ2ZpeGVkJyxcbiAgICAgICdsZWZ0JzogMCxcbiAgICAgICdyaWdodCc6IDAsXG4gICAgfTtcbiAgICBpZiAoY2VudGVyLnZhbHVlKSB7XG4gICAgICBjc3NbJ21hcmdpbi1yaWdodCddID0gJ2F1dG8nO1xuICAgICAgY3NzWydtYXJnaW4tbGVmdCddID0gJ2F1dG8nO1xuICAgIH1cbiAgICBpZiAodG9wLnZhbHVlKSB7XG4gICAgICBjc3MudG9wID0gdG9wICsgeU9mZnNldCArICdweCc7XG4gICAgfVxuICAgICRlbCA9ICQoc2VsZWN0b3IpO1xuICAgIGlmICghJGVsLmxlbmd0aCkge1xuICAgICAgdGhyb3cgYEludmFsaWQgc2VsZWN0b3IgXCIke3NlbGVjdG9yfVwiYDtcbiAgICB9XG4gICAgJGVsLmNzcyhjc3MpO1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRGVidWcge1xuXG4gIGluaXQoKSB7XG4gICAgdmFyICRkZWJ1Z2dlcjtcblxuICAgICQoJ2JvZHknKS5hcHBlbmQoJzxzcGFuIGlkPVwicGFyYWxsYXhicm9EZWJ1Z2dlclwiPjA8L3NwYW4+Jyk7XG5cbiAgICAkZGVidWdnZXIgPSAkKCcjcGFyYWxsYXhicm9EZWJ1Z2dlcicpO1xuXG4gICAgJGRlYnVnZ2VyLmNzcyh7XG4gICAgICAncG9zaXRpb24nOiAnZml4ZWQnLFxuICAgICAgJ3RvcCc6ICcwJyxcbiAgICAgICdyaWdodCc6ICcwJyxcbiAgICAgICdmb250LXNpemUnOiAnMTdweCcsXG4gICAgICAnY29sb3InOiAnd2hpdGUnLFxuICAgICAgJ2JhY2tncm91bmQnOiAnYmxhY2snLFxuICAgICAgJ3BhZGRpbmcnOiAnMTBweCAxMnB4JyxcbiAgICAgICd6LWluZGV4JzogJzEwMDAwMCcsXG4gICAgICAnYm9yZGVyLXRvcC1sZWZ0LXJhZGl1cyc6ICc0cHgnLFxuICAgICAgJ2JvcmRlci1ib3R0b20tbGVmdC1yYWRpdXMnOiAnNHB4JyxcbiAgICB9KTtcblxuICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICRkZWJ1Z2dlci5odG1sKE1hdGgucm91bmQod2luZG93LnBhZ2VZT2Zmc2V0KSk7XG4gICAgfSwgMjUwKTtcbiAgfVxuXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vUGFyYWxsYXhCcm8nKTtcbiIsImNvbnN0IHNlbGYgPSBtb2R1bGUuZXhwb3J0cztcblxuc2VsZi5jYWxsQnJlYWtwb2ludHMgPSAocG9zWSwgeVByZXYsIGJyZWFrcG9pbnRzLCBjYWxsYmFjaykgPT4ge1xuICB2YXIgc2Nyb2xsaW5nRG93biwgeURpZmY7XG4gIHNjcm9sbGluZ0Rvd24gPSB5UHJldiA8IHBvc1k7XG4gIHlEaWZmID0gc2Nyb2xsaW5nRG93biA/IHBvc1kgLSB5UHJldiA6IHlQcmV2IC0gcG9zWTtcbiAgYnJlYWtwb2ludHMgPSBicmVha3BvaW50cy5tYXAoYnJlYWtwb2ludCA9PiBwYXJzZUludChicmVha3BvaW50LCAxMCkpO1xuICAvLyBAdG9kbyAtIHdlIGNvdWxkIHVzZSBhIGRpZmZlcmVudCB0ZWNobmlxdWUgYnV0IHRoaXMgb25lIHdvcmtzIHcvIGxpdHRsZSBhcGFyZW50IGRvd25zaWRlcy5cbiAgZm9yIChsZXQgaT0wOyBpPHlEaWZmOyBpKyspIHtcbiAgICBsZXQgcG9zLCBpbmRleDtcbiAgICBwb3MgPSBzY3JvbGxpbmdEb3duID8geVByZXYgKyBpIDogeVByZXYgLSBpO1xuICAgIGluZGV4ID0gYnJlYWtwb2ludHMuaW5kZXhPZihwb3MpO1xuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICBsZXQgaSA9IHNjcm9sbGluZ0Rvd24gPyBpbmRleCA6IGluZGV4IC0gMTtcbiAgICAgIGNhbGxiYWNrLmNhbGwobnVsbCwgYnJlYWtwb2ludHNbaV0sIHNjcm9sbGluZ0Rvd24sIGJyZWFrcG9pbnRzW2luZGV4XSk7XG4gICAgfVxuICB9XG59XG5cbnNlbGYucnVuVXBkYXRlID0gKHBvc1ksIHlQcmV2LCBvYmosIGNhbGxiYWNrKSA9PiB7XG4gIHZhciBicmVha3BvaW50cyA9IE9iamVjdC5rZXlzKG9iai5icmVha3BvaW50cyk7XG5cbiAgLy8gQ2FsbCBvbiBpbml0LlxuICBpZiAoeVByZXYgPT09IHVuZGVmaW5lZCkge1xuICAgIHZhciB2YWx1ZSA9IG9iai5icmVha3BvaW50c1twb3NZXTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2FsbGJhY2suY2FsbChudWxsLCB2YWx1ZSwgcG9zWSwgdHJ1ZSk7XG4gICAgfVxuICB9XG4gIHNlbGYuY2FsbEJyZWFrcG9pbnRzKHBvc1ksIHlQcmV2LCBicmVha3BvaW50cywgKGJyZWFrcG9pbnQsIHNjcm9sbGluZ0Rvd24sIGFjdHVhbEJyZWFrcG9pbnQpID0+IHtcbiAgICB2YXIgdmFsdWUgPSBvYmouYnJlYWtwb2ludHNbYnJlYWtwb2ludF07XG4gICAgY2FsbGJhY2suY2FsbChudWxsLCB2YWx1ZSwgYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93biwgYWN0dWFsQnJlYWtwb2ludCk7XG4gIH0pO1xufVxuXG5zZWxmLm5vcm1hbGl6ZU9wdGlvbnMgPSAob3B0aW9ucywgZGVmYXVsdHMsIGV4Y2VwdGlvbnMgPSBbXSkgPT4ge1xuICB2YXIga2V5cztcblxuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICBrZXlzID0gT2JqZWN0LmtleXMob3B0aW9ucyk7XG5cbiAgLy8ga2V5cyA9IGtleXMuZmlsdGVyKGtleSA9PiBleGNlcHRpb25zLmluZGV4T2Yoa2V5KSA9PT0gLTEpO1xuXG4gIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgIHZhciB2YWx1ZSwgaXNPYmplY3Q7XG4gICAgdmFsdWUgPSBvcHRpb25zW2tleV07XG4gICAgaXNPYmplY3QgPSBzZWxmLmlzVHlwZSh2YWx1ZSwgJ29iamVjdCcpO1xuICAgIGlmIChpc09iamVjdCkge1xuICAgICAgbGV0IHZhbHVlMSA9IHZhbHVlICYmIHZhbHVlWycwJ10gPyB2YWx1ZVsnMCddIDogZGVmYXVsdHNba2V5XS52YWx1ZTtcbiAgICAgIGRlbGV0ZSB2YWx1ZS52YWx1ZTtcbiAgICAgIG9wdGlvbnNba2V5XSA9IHtcbiAgICAgICAgdmFsdWU6IHZhbHVlMSxcbiAgICAgICAgYnJlYWtwb2ludHM6IE9iamVjdC5hc3NpZ24oe30sIHswOiB2YWx1ZTF9LCB2YWx1ZSksXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgb3B0aW9uc1trZXldID0ge1xuICAgICAgICB2YWx1ZSxcbiAgICAgICAgYnJlYWtwb2ludHM6IHswOiB2YWx1ZX1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3B0aW9ucztcbn1cblxuLyoqXG4gKiBHaXZlbiBhIE1peGVkIHZhbHVlIHR5cGUgY2hlY2suXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljLlxuICogQHRlc3RzIHVuaXQuXG4gKi9cbnNlbGYuaXNUeXBlID0gKHZhbHVlLCB0eXBlKSA9PiB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzTmFOKHZhbHVlKSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09IGZhbHNlO1xuICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKTtcbiAgICBjYXNlICdvYmplY3QnOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkgPT09IGZhbHNlO1xuICAgIGNhc2UgJ251bGwnOlxuICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsO1xuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZDtcbiAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCc7XG4gICAgY2FzZSAnTmFOJzpcbiAgICAgIHJldHVybiBOdW1iZXIuaXNOYU4odmFsdWUpO1xuICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnJlY2dvbml6ZWQgdHlwZTogXCIke3R5cGV9XCJgKTtcbiAgfVxufTtcblxuc2VsZi5wcmVmaXggPSAoKSA9PiB7XG4gIHZhciBzdHlsZXMsIHByZSwgZG9tO1xuICBzdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsICcnKSxcbiAgICBwcmUgPSAoQXJyYXkucHJvdG90eXBlLnNsaWNlXG4gICAgICAuY2FsbChzdHlsZXMpXG4gICAgICAuam9pbignJylcbiAgICAgIC5tYXRjaCgvLShtb3p8d2Via2l0fG1zKS0vKSB8fCAoc3R5bGVzLk9MaW5rID09PSAnJyAmJiBbJycsICdvJ10pXG4gICAgKVsxXSxcbiAgICBkb20gPSAoJ3dlYmtpdHxNb3p8TVN8TycpLm1hdGNoKG5ldyBSZWdFeHAoJygnICsgcHJlICsgJyknLCAnaScpKVsxXTtcbiAgICByZXR1cm4ge1xuICAgICAgZG9tOiBkb20sXG4gICAgICBsb3dlcmNhc2U6IHByZSxcbiAgICAgIGNzczogJy0nICsgcHJlICsgJy0nLFxuICAgICAganM6IHByZVswXS50b1VwcGVyQ2FzZSgpICsgcHJlLnN1YnN0cigxKVxuICAgIH07XG59O1xuIl19
