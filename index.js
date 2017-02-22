(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParallaxCollection = require('./ParallaxCollection');

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
        disableStyles = _normalizeOptions2.disableStyles;

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
        height: '100%'
      }, options);
    }
  }]);

  return ParalaxBro;
}();

},{"./ParallaxCollection":2}],2:[function(require,module,exports){
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
      center: { value: false },
      update: { value: function value() {} }
    });
    var _options = options,
        top = _options.top,
        hide = _options.hide,
        zIndex = _options.zIndex,
        center = _options.center,
        update = _options.update;


    this.$el;
    this.elements = [];
    this.yPrev;

    this.top = top;
    this.hide = hide;
    this.zIndex = zIndex;
    this.center = center;
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
      this.updateCenter(posY);
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
    key: 'updateCenter',
    value: function updateCenter(posY) {
      var _this4 = this;

      var prevY = this.prevY,
          center = this.center;

      runUpdate(posY, prevY, center, function (value) {
        center.value = value;
        if (value) {
          _this4.$el.css({
            'margin-right': 'auto',
            'margin-left': 'auto'
          });
        } else {
          _this4.$el.css({
            'margin-right': 'inherit',
            'margin-left': 'inherit'
          });
        }
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
      var center = options.center,
          zIndex = options.zIndex,
          hide = options.hide;

      css = {};
      css.zIndex = zIndex.value;
      if (center.value) {
        css['margin-right'] = 'auto';
        css['margin-left'] = 'auto';
      }
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

},{"./ParallaxElement":3,"./utils":5}],3:[function(require,module,exports){
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

},{"./utils":5}],4:[function(require,module,exports){
'use strict';

module.exports = require('./ParallaxBro');

},{"./ParallaxBro":1}],5:[function(require,module,exports){
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

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvUGFyYWxsYXhCcm8uanMiLCJsaWIvUGFyYWxsYXhDb2xsZWN0aW9uLmpzIiwibGliL1BhcmFsbGF4RWxlbWVudC5qcyIsImxpYi9pbmRleC5qcyIsImxpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0FBLElBQU0scUJBQXFCLFFBQVEsc0JBQVIsQ0FBM0I7O0FBRUEsSUFBSSxDQUFKOztBQUVBLE9BQU8sT0FBUDs7QUFFRTs7O0FBR0Esc0JBQVksUUFBWixFQUFnRDtBQUFBLFFBQTFCLE1BQTBCLHVFQUFqQixNQUFpQjtBQUFBLFFBQVQsT0FBUzs7QUFBQTs7QUFBQSw2QkFDdEIsS0FBSyxpQkFBTCxDQUF1QixPQUF2QixDQURzQjtBQUFBLFFBQ3ZDLGFBRHVDLHNCQUN2QyxhQUR1Qzs7QUFHOUMsU0FBSyxXQUFMLEdBQW1CLEVBQW5COztBQUVBLFFBQUksQ0FBQyxRQUFMLEVBQWU7QUFDYixZQUFNLGdEQUFOO0FBQ0Q7O0FBRUQsU0FBSyxPQUFMO0FBQ0EsU0FBSyxpQkFBTCxDQUF1QixRQUF2QjtBQUNBLFNBQUssV0FBTDtBQUNBLFFBQUksQ0FBQyxhQUFMLEVBQW9CO0FBQ2xCLFdBQUssU0FBTCxDQUFlLE1BQWY7QUFDRDs7QUFFRCxTQUFLLGdCQUFMO0FBQ0Q7O0FBRUQ7Ozs7OztBQXhCRjtBQUFBO0FBQUEsa0NBNEJnQixRQTVCaEIsRUE0QjBCLE9BNUIxQixFQTRCbUM7QUFDL0IsVUFBSSxVQUFKO0FBQ0EsbUJBQWEsSUFBSSxrQkFBSixDQUF1QixRQUF2QixFQUFpQyxPQUFqQyxDQUFiO0FBQ0EsV0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLFVBQXRCO0FBQ0EsYUFBTyxVQUFQO0FBQ0Q7QUFqQ0g7QUFBQTtBQUFBLHVDQW1DcUI7QUFBQTs7QUFDakIsaUJBQVc7QUFBQSxlQUFNLE1BQUssYUFBTCxDQUFtQixDQUFuQixD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Q0EzQkQ7O0FBNkJBLEtBQUssTUFBTCxHQUFjLFlBQU07QUFDbEIsTUFBSSxNQUFKLEVBQVksR0FBWixFQUFpQixHQUFqQjtBQUNBLFdBQVMsT0FBTyxnQkFBUCxDQUF3QixTQUFTLGVBQWpDLEVBQWtELEVBQWxELENBQVQsRUFDRSxNQUFNLENBQUMsTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBQ0osSUFESSxDQUNDLE1BREQsRUFFSixJQUZJLENBRUMsRUFGRCxFQUdKLEtBSEksQ0FHRSxtQkFIRixLQUcyQixPQUFPLEtBQVAsS0FBaUIsRUFBakIsSUFBdUIsQ0FBQyxFQUFELEVBQUssR0FBTCxDQUhuRCxFQUlKLENBSkksQ0FEUixFQU1FLE1BQU8saUJBQUQsQ0FBb0IsS0FBcEIsQ0FBMEIsSUFBSSxNQUFKLENBQVcsTUFBTSxHQUFOLEdBQVksR0FBdkIsRUFBNEIsR0FBNUIsQ0FBMUIsRUFBNEQsQ0FBNUQsQ0FOUjtBQU9FLFNBQU87QUFDTCxTQUFLLEdBREE7QUFFTCxlQUFXLEdBRk47QUFHTCxTQUFLLE1BQU0sR0FBTixHQUFZLEdBSFo7QUFJTCxRQUFJLElBQUksQ0FBSixFQUFPLFdBQVAsS0FBdUIsSUFBSSxNQUFKLENBQVcsQ0FBWDtBQUp0QixHQUFQO0FBTUgsQ0FmRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBQYXJhbGxheENvbGxlY3Rpb24gPSByZXF1aXJlKCcuL1BhcmFsbGF4Q29sbGVjdGlvbicpO1xuXG52YXIgJDtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYXJhbGF4QnJvIHtcblxuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBoZWlnaHQgPSAnMTAwJScsIG9wdGlvbnMpIHtcbiAgICBjb25zdCB7ZGlzYWJsZVN0eWxlc30gPSB0aGlzLl9ub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb2xsZWN0aW9ucyA9IFtdO1xuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgdGhyb3cgJ1lvdSBtdXN0IHBhc3MgYSBzZWxlY3RvciBzdHJpbmcgdG8gUGFyYWxheEJyby4nO1xuICAgIH1cblxuICAgIHRoaXMuX2pRdWVyeSgpO1xuICAgIHRoaXMuX2NhY2hlRE9NRWxlbWVudHMoc2VsZWN0b3IpO1xuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcbiAgICBpZiAoIWRpc2FibGVTdHlsZXMpIHtcbiAgICAgIHRoaXMuX3N0eWxlRE9NKGhlaWdodCk7XG4gICAgfVxuXG4gICAgdGhpcy5faHlkcmF0ZUVsZW1lbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBhZGRDb2xsZWN0aW9uKHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbGxlY3Rpb247XG4gICAgY29sbGVjdGlvbiA9IG5ldyBQYXJhbGxheENvbGxlY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpO1xuICAgIHRoaXMuY29sbGVjdGlvbnMucHVzaChjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuXG4gIF9oeWRyYXRlRWxlbWVudHMoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLl9tb3ZlRWxlbWVudHMoMCkgLDApXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHdyYXBwZXJcbiAgICovXG4gIF9jYWNoZURPTUVsZW1lbnRzKHdyYXBwZXIpIHtcbiAgICB0aGlzLiRlbCA9IHt9O1xuICAgIHRoaXMuJGVsLndpbiA9ICQod2luZG93KTtcbiAgICB0aGlzLiRlbC5kb2MgPSAkKGRvY3VtZW50KTtcbiAgICB0aGlzLiRlbC5ib2R5ID0gJCgnYm9keScpO1xuICAgIHRoaXMuJGVsLndyYXBwZXIgPSAkKHdyYXBwZXIpO1xuICB9XG5cbiAgX3N0eWxlRE9NKGhlaWdodCkge1xuICAgIHZhciB7Ym9keSwgd3JhcHBlciwgZG9jfSA9IHRoaXMuJGVsO1xuICAgIGRvYy5jaGlsZHJlbigpLmNzcygnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICBib2R5LmNzcygnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICB3cmFwcGVyLmNzcyh7XG4gICAgICAnaGVpZ2h0JzogaGVpZ2h0LFxuICAgICAgJ292ZXJmbG93JzogJ3Zpc2libGUnLFxuICAgICAgJ21pbi1oZWlnaHQnOiAnMTAwJScsXG4gICAgICAnYm94LXNpemluZyc6ICdib3JkZXItYm94JyxcbiAgICB9KTtcbiAgICB3cmFwcGVyLmFkZENsYXNzKCdwYXJhbGF4YnJvJyk7XG4gIH1cblxuICBfYmluZEV2ZW50cygpIHtcbiAgICBjb25zdCB0cmFjayA9ICgpID0+IHtcbiAgICAgIHZhciBwb3NZID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgdGhpcy5fbW92ZUVsZW1lbnRzKHBvc1kpO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRyYWNrKTtcbiAgICB9XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRyYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgX21vdmVFbGVtZW50cyhwb3NZKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25zO1xuICAgIGNvbGxlY3Rpb25zID0gdGhpcy5jb2xsZWN0aW9ucztcbiAgICBjb2xsZWN0aW9ucy5mb3JFYWNoKGNvbGxlY3Rpb24gPT4gY29sbGVjdGlvbi5tb3ZlRWxlbWVudHMocG9zWSkpO1xuICB9XG5cbiAgX2pRdWVyeSgpIHtcbiAgICAkID0galF1ZXJ5O1xuICAgIGlmICghJCkge1xuICAgICAgdGhyb3cgJ2pRdWVyeSBpcyBub3QgZGVmaW5lZCc7XG4gICAgfVxuICB9XG5cbiAgX25vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucykge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICB3cmFwcGVyOiAnI3BhcmFsbGF4JyxcbiAgICAgIGRpc2FibGVTdHlsZXM6IGZhbHNlLFxuICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgfSwgb3B0aW9ucyk7XG4gIH1cblxufVxuIiwiY29uc3Qge25vcm1hbGl6ZU9wdGlvbnMsIHJ1blVwZGF0ZX0gPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5jb25zdCBQYXJhbGxheEVsZW1lbnQgPSByZXF1aXJlKCcuL1BhcmFsbGF4RWxlbWVudCcpO1xuXG52YXIgJDtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYXJhbGxheENvbGxlY3Rpb24ge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucywge1xuICAgICAgdG9wOiB7dmFsdWU6IDB9LFxuICAgICAgaGlkZToge3ZhbHVlOiBmYWxzZX0sXG4gICAgICB6SW5kZXg6IHt2YWx1ZTogLTF9LFxuICAgICAgY2VudGVyOiB7dmFsdWU6IGZhbHNlfSxcbiAgICAgIHVwZGF0ZToge3ZhbHVlOiAoKSA9PiB7fX0sXG4gICAgfSk7XG4gICAgY29uc3Qge3RvcCwgaGlkZSwgekluZGV4LCBjZW50ZXIsIHVwZGF0ZX0gPSBvcHRpb25zO1xuXG4gICAgdGhpcy4kZWw7XG4gICAgdGhpcy5lbGVtZW50cyA9IFtdO1xuICAgIHRoaXMueVByZXY7XG5cbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLmhpZGUgPSBoaWRlO1xuICAgIHRoaXMuekluZGV4ID0gekluZGV4O1xuICAgIHRoaXMuY2VudGVyID0gY2VudGVyO1xuICAgIHRoaXMudXBkYXRlID0gdXBkYXRlO1xuXG4gICAgdGhpcy5qUXVlcnkoKTtcbiAgICB0aGlzLnN0eWxlQ29sbGVjdGlvbihzZWxlY3Rvciwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgKi9cbiAgYWRkRWxlbWVudHMob2JqKSB7XG4gICAgdmFyIHNlbGVjdG9ycywgdG9wLCBoZWlnaHQ7XG4gICAgc2VsZWN0b3JzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICBoZWlnaHQgPSAwO1xuICAgIHNlbGVjdG9ycy5mb3JFYWNoKHNlbGVjdG9yID0+IHtcbiAgICAgIHZhciBvcHRpb25zID0gb2JqW3NlbGVjdG9yXTtcbiAgICAgIHRoaXMuX2FkZEVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMpO1xuICAgICAgaGVpZ2h0ICs9ICQoc2VsZWN0b3IpLm91dGVySGVpZ2h0KCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBfYWRkRWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIHZhciBlbGVtZW50O1xuICAgIGVsZW1lbnQgPSBuZXcgUGFyYWxsYXhFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zLCB0aGlzLnRvcCk7XG4gICAgdGhpcy5lbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBtb3ZlRWxlbWVudHMocG9zWSkge1xuICAgIHZhciBlbGVtZW50cztcbiAgICBlbGVtZW50cyA9IHRoaXMuZWxlbWVudHM7XG4gICAgdGhpcy5ydW5DYWxsYmFja3MocG9zWSk7XG4gICAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IGVsZW1lbnQubW92ZUVsZW1lbnQocG9zWSkpO1xuICAgIHRoaXMueVByZXYgPSBwb3NZO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBydW5DYWxsYmFja3MocG9zWSkge1xuICAgIHRoaXMudXBkYXRlSGlkZShwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZVppbmRleChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZUNlbnRlcihwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZUNhbGxiYWNrKHBvc1kpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVIaWRlKHBvc1kpIHtcbiAgICB2YXIgcHJldlkgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgdGhpcy5oaWRlLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuaGlkZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy4kZWwuY3NzKCdvcGFjaXR5JywgdmFsdWUgPyAwIDogMSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZVppbmRleChwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuekluZGV4LCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuekluZGV4LnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLiRlbC5jc3MoJ3pJbmRleCcsIHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlQ2VudGVyKHBvc1kpIHtcbiAgICB2YXIge3ByZXZZLCBjZW50ZXJ9ID0gdGhpcztcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIGNlbnRlciwgKHZhbHVlKSA9PiB7XG4gICAgICBjZW50ZXIudmFsdWUgPSB2YWx1ZTtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB0aGlzLiRlbC5jc3Moe1xuICAgICAgICAgICdtYXJnaW4tcmlnaHQnOiAnYXV0bycsXG4gICAgICAgICAgJ21hcmdpbi1sZWZ0JzogJ2F1dG8nLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLiRlbC5jc3Moe1xuICAgICAgICAgICdtYXJnaW4tcmlnaHQnOiAnaW5oZXJpdCcsXG4gICAgICAgICAgJ21hcmdpbi1sZWZ0JzogJ2luaGVyaXQnLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlQ2FsbGJhY2socG9zWSkge1xuICAgIHZhciB5UHJldiwgJGVsLCBzZWxmO1xuICAgIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICAkZWwgPSB0aGlzLiRlbDtcbiAgICBzZWxmID0gdGhpcztcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMudXBkYXRlLCAodmFsdWUsIGJyZWFrcG9pbnQpID0+IHtcbiAgICAgIHNlbGYudXBkYXRlLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdLmNhbGwoc2VsZiwgJGVsLCBwb3NZLCB5UHJldik7XG4gICAgfSk7XG4gIH1cblxuICBqUXVlcnkoKSB7XG4gICAgJCA9IGpRdWVyeTtcbiAgICBpZiAoISQpIHtcbiAgICAgIHRocm93ICdqUXVlcnkgaXMgbm90IGRlZmluZWQnO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIHN0eWxlQ29sbGVjdGlvbihzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIHZhciAkZWwsIGNzcztcbiAgICB2YXIge2NlbnRlciwgekluZGV4LCBoaWRlfSA9IG9wdGlvbnM7XG4gICAgY3NzID0ge307XG4gICAgY3NzLnpJbmRleCA9IHpJbmRleC52YWx1ZTtcbiAgICBpZiAoY2VudGVyLnZhbHVlKSB7XG4gICAgICBjc3NbJ21hcmdpbi1yaWdodCddID0gJ2F1dG8nO1xuICAgICAgY3NzWydtYXJnaW4tbGVmdCddID0gJ2F1dG8nO1xuICAgIH1cbiAgICBpZiAoaGlkZS52YWx1ZSkge1xuICAgICAgY3NzLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuICAgICRlbCA9ICQoc2VsZWN0b3IpO1xuICAgICRlbC5jc3MoY3NzKTtcbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG59XG4iLCJjb25zdCB7cHJlZml4LCBub3JtYWxpemVPcHRpb25zLCBydW5VcGRhdGV9ID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgJDtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYXJhbGxheEVsZW1lbnQge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICogQHBhcmFtIHtPYmplY3R9IG9mZnNldFRvcFxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2VsZWN0b3IsIG9wdGlvbnMsIG9mZnNldFRvcCkge1xuICAgIG9wdGlvbnMgPSBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMsIHtcbiAgICAgIHRvcDoge3ZhbHVlOiAwfSxcbiAgICAgIGhpZGU6IHt2YWx1ZTogZmFsc2V9LFxuICAgICAgekluZGV4OiB7dmFsdWU6IC0xfSxcbiAgICAgIHNwZWVkOiB7dmFsdWU6IDF9LFxuICAgICAgY2VudGVyOiB7dmFsdWU6IGZhbHNlfSxcbiAgICAgIHVwZGF0ZToge3ZhbHVlOiAoKSA9PiB7fX0sXG4gICAgICB4RnVuYzoge3ZhbHVlOiAwfSxcbiAgICB9KTtcblxuXG4gICAgY29uc3Qge3RvcCwgaGlkZSwgekluZGV4LCBzcGVlZCwgY2VudGVyLCB1cGRhdGUsIHhGdW5jfSA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLiRlbDtcbiAgICB0aGlzLnByZWZpeCA9IHByZWZpeCgpO1xuICAgIHRoaXMub2Zmc2V0VG9wID0gb2Zmc2V0VG9wO1xuICAgIHRoaXMueU9mZnNldCA9IG9mZnNldFRvcC52YWx1ZTtcbiAgICB0aGlzLnlQcmV2O1xuICAgIHRoaXMudFByZXY7XG5cbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLmhpZGUgPSBoaWRlO1xuICAgIHRoaXMuekluZGV4ID0gekluZGV4O1xuICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcbiAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcbiAgICB0aGlzLnVwZGF0ZSA9IHVwZGF0ZTtcbiAgICB0aGlzLnhGdW5jID0geEZ1bmM7XG5cbiAgICB0aGlzLmpRdWVyeSgpO1xuICAgIHRoaXMuc3R5bGVFbGVtZW50KHNlbGVjdG9yLCB7Y2VudGVyLCB0b3B9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgbW92ZUVsZW1lbnQocG9zWSkge1xuICAgIHZhciAkZWwsIHlQcmV2LCB0UHJldiwgeU5ldywgeE5ldywgeEZ1bmMsIGZ1bmMsIHNwZWVkLCBicmVha3BvaW50LCBwcmV2QnJlYWtwb2ludCwgZGVsdGEsIHByZWZpeFxuXG4gICAgdGhpcy5ydW5DYWxsYmFja3MocG9zWSk7XG5cbiAgICB5UHJldiA9IHRoaXMueVByZXYgfHwgMDtcbiAgICB0UHJldiA9IHRoaXMudFByZXYgfHwgMDtcbiAgICBwcmVmaXggPSB0aGlzLnByZWZpeDtcbiAgICB4RnVuYyA9IHRoaXMueEZ1bmM7XG4gICAgJGVsID0gdGhpcy4kZWw7XG4gICAgc3BlZWQgPSB0aGlzLnNwZWVkLnZhbHVlO1xuICAgIGJyZWFrcG9pbnQgPSB0aGlzLnNwZWVkLl9icmVha3BvaW50O1xuXG4gICAgaWYgKGJyZWFrcG9pbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbGV0IGxhc3RTcGVlZCwgeURpZmY7XG4gICAgICBkZWx0YSA9IDA7XG4gICAgICBsYXN0U3BlZWQgPSB0aGlzLnNwZWVkLl9sYXN0U3BlZWQ7XG5cbiAgICAgIHlEaWZmID0geVByZXYgLSBicmVha3BvaW50O1xuICAgICAgZGVsdGEgKz0gTWF0aC5yb3VuZCh5RGlmZipsYXN0U3BlZWQqMTAwKSAvIDEwMDtcblxuICAgICAgeURpZmYgPSBicmVha3BvaW50IC0gcG9zWTtcbiAgICAgIGRlbHRhICs9IE1hdGgucm91bmQoeURpZmYqc3BlZWQqMTAwKSAvIDEwMDtcblxuICAgICAgdGhpcy5zcGVlZC5fYnJlYWtwb2ludCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsZXQgeURpZmY7XG4gICAgICBkZWx0YSA9IDA7XG4gICAgICB5RGlmZiA9IHlQcmV2IC0gcG9zWTtcbiAgICAgIGRlbHRhID0gTWF0aC5yb3VuZCh5RGlmZipzcGVlZCoxMDApIC8gMTAwO1xuICAgIH1cblxuICAgIHlOZXcgPSB0UHJldiArIGRlbHRhO1xuICAgIGZ1bmMgPSB4RnVuYy5icmVha3BvaW50c1t4RnVuYy52YWx1ZV07XG4gICAgeE5ldyA9IGZ1bmMgPyBmdW5jLmNhbGwobnVsbCwgcG9zWSAtIHhGdW5jLnZhbHVlKSA6IDA7XG5cbiAgICAkZWxbMF0uc3R5bGVbcHJlZml4LmRvbSArICdUcmFuc2Zvcm0nXSA9IGB0cmFuc2xhdGUzZCgke3hOZXd9cHgsICR7eU5ld31weCwgMCkgdHJhbnNsYXRlWigwKSBzY2FsZSgxKWA7XG4gICAgdGhpcy55UHJldiA9IHBvc1k7XG4gICAgdGhpcy50UHJldiA9IHlOZXc7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHJ1bkNhbGxiYWNrcyhwb3NZKSB7XG4gICAgdGhpcy51cGRhdGVIaWRlKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlWmluZGV4KHBvc1kpO1xuICAgIHRoaXMudXBkYXRlVG9wKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlT2Zmc2V0KHBvc1kpO1xuICAgIHRoaXMudXBkYXRlU3BlZWQocG9zWSk7XG4gICAgdGhpcy51cGRhdGVYRnVuYyhwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZUNhbGxiYWNrKHBvc1kpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVIaWRlKHBvc1kpIHtcbiAgICB2YXIgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy5oaWRlLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuaGlkZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy4kZWwuY3NzKCdkaXNwbGF5JywgdmFsdWUgPyAnbm9uZScgOiAnYmxvY2snKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZVppbmRleChwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuekluZGV4LCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuekluZGV4LnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLiRlbC5jc3MoJ3pJbmRleCcsIHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlVG9wKHBvc1kpIHtcbiAgICB2YXIgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy50b3AsICh2YWx1ZSkgPT4ge1xuICAgICAgdmFyIHlPZmZzZXQgPSB0aGlzLnlPZmZzZXQ7XG4gICAgICB0aGlzLnRvcC52YWx1ZSA9IHZhbHVlID0gdmFsdWUgKyB5T2Zmc2V0O1xuICAgICAgdGhpcy4kZWwuY3NzKCd0b3AnLCB2YWx1ZSArICdweCcpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVPZmZzZXQocG9zWSkge1xuICAgIHZhciB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLm9mZnNldFRvcCwgKHZhbHVlKSA9PiB7XG4gICAgICB2YXIgeURpZmYsIHRvcDtcbiAgICAgIHlEaWZmID0gdmFsdWUgLSB0aGlzLnlPZmZzZXQ7XG4gICAgICB0aGlzLnlPZmZzZXQgPSB2YWx1ZTtcbiAgICAgIHRvcCA9IHBhcnNlSW50KHRoaXMuJGVsLmNzcygndG9wJyksIDEwKTtcbiAgICAgIHRoaXMuJGVsLmNzcygndG9wJywgdG9wICsgeURpZmYgKyAncHgnKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlU3BlZWQocG9zWSkge1xuICAgIHZhciB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLnNwZWVkLCAodmFsdWUsIGJyZWFrcG9pbnQsIHNjcm9sbGluZ0Rvd24sIGFjdHVhbEJyZWFrcG9pbnQpID0+IHtcbiAgICAgIHRoaXMuc3BlZWQuX2JyZWFrcG9pbnQgPSBhY3R1YWxCcmVha3BvaW50O1xuICAgICAgdGhpcy5zcGVlZC5fbGFzdFNwZWVkID0gdGhpcy5zcGVlZC52YWx1ZTtcbiAgICAgIHRoaXMuc3BlZWQudmFsdWUgPSB2YWx1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlWEZ1bmMocG9zWSkge1xuICAgIHZhciB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLnhGdW5jLCAodmFsdWUsIGJyZWFrcG9pbnQsIHNjcm9sbGluZ0Rvd24sIGFjdHVhbEJyZWFrcG9pbnQpID0+IHtcbiAgICAgIHRoaXMueEZ1bmMudmFsdWUgPSBicmVha3BvaW50O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVDYWxsYmFjayhwb3NZKSB7XG4gICAgdmFyIHlQcmV2LCAkZWwsIHNlbGY7XG4gICAgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgICRlbCA9IHRoaXMuJGVsO1xuICAgIHNlbGYgPSB0aGlzO1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy51cGRhdGUsICh2YWx1ZSwgYnJlYWtwb2ludCkgPT4ge1xuICAgICAgc2VsZi51cGRhdGUuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0uY2FsbChzZWxmLCAkZWwsIHBvc1ksIHlQcmV2KTtcbiAgICB9KTtcbiAgfVxuXG4gIGpRdWVyeSgpIHtcbiAgICAkID0galF1ZXJ5O1xuICAgIGlmICghJCkge1xuICAgICAgdGhyb3cgJ2pRdWVyeSBpcyBub3QgZGVmaW5lZCc7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgc3R5bGVFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgdmFyICRlbCwgY3NzLCB5T2Zmc2V0O1xuICAgIHZhciB7Y2VudGVyLCB0b3B9ID0gb3B0aW9ucztcbiAgICB5T2Zmc2V0ID0gdGhpcy55T2Zmc2V0O1xuICAgIGNzcyA9IHtcbiAgICAgICdwb3NpdGlvbic6ICdmaXhlZCcsXG4gICAgICAnbGVmdCc6IDAsXG4gICAgICAncmlnaHQnOiAwLFxuICAgIH07XG4gICAgaWYgKGNlbnRlci52YWx1ZSkge1xuICAgICAgY3NzWydtYXJnaW4tcmlnaHQnXSA9ICdhdXRvJztcbiAgICAgIGNzc1snbWFyZ2luLWxlZnQnXSA9ICdhdXRvJztcbiAgICB9XG4gICAgaWYgKHRvcC52YWx1ZSkge1xuICAgICAgY3NzLnRvcCA9IHRvcCArIHlPZmZzZXQgKyAncHgnO1xuICAgIH1cbiAgICAkZWwgPSAkKHNlbGVjdG9yKTtcbiAgICBpZiAoISRlbC5sZW5ndGgpIHtcbiAgICAgIHRocm93IGBJbnZhbGlkIHNlbGVjdG9yIFwiJHtzZWxlY3Rvcn1cImA7XG4gICAgfVxuICAgICRlbC5jc3MoY3NzKTtcbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vUGFyYWxsYXhCcm8nKTtcbiIsImNvbnN0IHNlbGYgPSBtb2R1bGUuZXhwb3J0cztcblxuc2VsZi5jYWxsQnJlYWtwb2ludHMgPSAocG9zWSwgeVByZXYsIGJyZWFrcG9pbnRzLCBjYWxsYmFjaykgPT4ge1xuICB2YXIgc2Nyb2xsaW5nRG93biwgeURpZmY7XG4gIHNjcm9sbGluZ0Rvd24gPSB5UHJldiA8IHBvc1k7XG4gIHlEaWZmID0gc2Nyb2xsaW5nRG93biA/IHBvc1kgLSB5UHJldiA6IHlQcmV2IC0gcG9zWTtcbiAgYnJlYWtwb2ludHMgPSBicmVha3BvaW50cy5tYXAoYnJlYWtwb2ludCA9PiBwYXJzZUludChicmVha3BvaW50LCAxMCkpO1xuICAvLyBAdG9kbyAtIHdlIGNvdWxkIHVzZSBhIGRpZmZlcmVudCB0ZWNobmlxdWUgYnV0IHRoaXMgb25lIHdvcmtzIHcvIGxpdHRsZSBhcGFyZW50IGRvd25zaWRlcy5cbiAgZm9yIChsZXQgaT0wOyBpPHlEaWZmOyBpKyspIHtcbiAgICBsZXQgcG9zLCBpbmRleDtcbiAgICBwb3MgPSBzY3JvbGxpbmdEb3duID8geVByZXYgKyBpIDogeVByZXYgLSBpO1xuICAgIGluZGV4ID0gYnJlYWtwb2ludHMuaW5kZXhPZihwb3MpO1xuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICBsZXQgaSA9IHNjcm9sbGluZ0Rvd24gPyBpbmRleCA6IGluZGV4IC0gMTtcbiAgICAgIGNhbGxiYWNrLmNhbGwobnVsbCwgYnJlYWtwb2ludHNbaV0sIHNjcm9sbGluZ0Rvd24sIGJyZWFrcG9pbnRzW2luZGV4XSk7XG4gICAgfVxuICB9XG59XG5cbnNlbGYucnVuVXBkYXRlID0gKHBvc1ksIHlQcmV2LCBvYmosIGNhbGxiYWNrKSA9PiB7XG4gIHZhciBicmVha3BvaW50cyA9IE9iamVjdC5rZXlzKG9iai5icmVha3BvaW50cyk7XG5cbiAgLy8gQ2FsbCBvbiBpbml0LlxuICBpZiAoeVByZXYgPT09IHVuZGVmaW5lZCkge1xuICAgIHZhciB2YWx1ZSA9IG9iai5icmVha3BvaW50c1twb3NZXTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2FsbGJhY2suY2FsbChudWxsLCB2YWx1ZSwgcG9zWSwgdHJ1ZSk7XG4gICAgfVxuICB9XG4gIHNlbGYuY2FsbEJyZWFrcG9pbnRzKHBvc1ksIHlQcmV2LCBicmVha3BvaW50cywgKGJyZWFrcG9pbnQsIHNjcm9sbGluZ0Rvd24sIGFjdHVhbEJyZWFrcG9pbnQpID0+IHtcbiAgICB2YXIgdmFsdWUgPSBvYmouYnJlYWtwb2ludHNbYnJlYWtwb2ludF07XG4gICAgY2FsbGJhY2suY2FsbChudWxsLCB2YWx1ZSwgYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93biwgYWN0dWFsQnJlYWtwb2ludCk7XG4gIH0pO1xufVxuXG5zZWxmLm5vcm1hbGl6ZU9wdGlvbnMgPSAob3B0aW9ucywgZGVmYXVsdHMsIGV4Y2VwdGlvbnMgPSBbXSkgPT4ge1xuICB2YXIga2V5cztcblxuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICBrZXlzID0gT2JqZWN0LmtleXMob3B0aW9ucyk7XG5cbiAgLy8ga2V5cyA9IGtleXMuZmlsdGVyKGtleSA9PiBleGNlcHRpb25zLmluZGV4T2Yoa2V5KSA9PT0gLTEpO1xuXG4gIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgIHZhciB2YWx1ZSwgaXNPYmplY3Q7XG4gICAgdmFsdWUgPSBvcHRpb25zW2tleV07XG4gICAgaXNPYmplY3QgPSBzZWxmLmlzVHlwZSh2YWx1ZSwgJ29iamVjdCcpO1xuICAgIGlmIChpc09iamVjdCkge1xuICAgICAgbGV0IHZhbHVlMSA9IHZhbHVlICYmIHZhbHVlWycwJ10gPyB2YWx1ZVsnMCddIDogZGVmYXVsdHNba2V5XS52YWx1ZTtcbiAgICAgIGRlbGV0ZSB2YWx1ZS52YWx1ZTtcbiAgICAgIG9wdGlvbnNba2V5XSA9IHtcbiAgICAgICAgdmFsdWU6IHZhbHVlMSxcbiAgICAgICAgYnJlYWtwb2ludHM6IE9iamVjdC5hc3NpZ24oe30sIHswOiB2YWx1ZTF9LCB2YWx1ZSksXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgb3B0aW9uc1trZXldID0ge1xuICAgICAgICB2YWx1ZSxcbiAgICAgICAgYnJlYWtwb2ludHM6IHswOiB2YWx1ZX1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3B0aW9ucztcbn1cblxuLyoqXG4gKiBHaXZlbiBhIE1peGVkIHZhbHVlIHR5cGUgY2hlY2suXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljLlxuICogQHRlc3RzIHVuaXQuXG4gKi9cbnNlbGYuaXNUeXBlID0gKHZhbHVlLCB0eXBlKSA9PiB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzTmFOKHZhbHVlKSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09IGZhbHNlO1xuICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKTtcbiAgICBjYXNlICdvYmplY3QnOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkgPT09IGZhbHNlO1xuICAgIGNhc2UgJ251bGwnOlxuICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsO1xuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZDtcbiAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCc7XG4gICAgY2FzZSAnTmFOJzpcbiAgICAgIHJldHVybiBOdW1iZXIuaXNOYU4odmFsdWUpO1xuICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnJlY2dvbml6ZWQgdHlwZTogXCIke3R5cGV9XCJgKTtcbiAgfVxufTtcblxuc2VsZi5wcmVmaXggPSAoKSA9PiB7XG4gIHZhciBzdHlsZXMsIHByZSwgZG9tO1xuICBzdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsICcnKSxcbiAgICBwcmUgPSAoQXJyYXkucHJvdG90eXBlLnNsaWNlXG4gICAgICAuY2FsbChzdHlsZXMpXG4gICAgICAuam9pbignJylcbiAgICAgIC5tYXRjaCgvLShtb3p8d2Via2l0fG1zKS0vKSB8fCAoc3R5bGVzLk9MaW5rID09PSAnJyAmJiBbJycsICdvJ10pXG4gICAgKVsxXSxcbiAgICBkb20gPSAoJ3dlYmtpdHxNb3p8TVN8TycpLm1hdGNoKG5ldyBSZWdFeHAoJygnICsgcHJlICsgJyknLCAnaScpKVsxXTtcbiAgICByZXR1cm4ge1xuICAgICAgZG9tOiBkb20sXG4gICAgICBsb3dlcmNhc2U6IHByZSxcbiAgICAgIGNzczogJy0nICsgcHJlICsgJy0nLFxuICAgICAganM6IHByZVswXS50b1VwcGVyQ2FzZSgpICsgcHJlLnN1YnN0cigxKVxuICAgIH07XG59O1xuIl19
