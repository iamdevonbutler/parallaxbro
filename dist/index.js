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
  function ParalaxBro(options) {
    _classCallCheck(this, ParalaxBro);

    var _normalizeOptions2 = this._normalizeOptions(options),
        wrapper = _normalizeOptions2.wrapper,
        disableStyles = _normalizeOptions2.disableStyles;

    this.collections = [];

    this._jQuery();
    this._cacheDOMElements(wrapper);
    this._bindEvents();
    if (!disableStyles) {
      this._styleDOM();
    }
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
    value: function _styleDOM() {
      var _$el = this.$el,
          body = _$el.body,
          wrapper = _$el.wrapper,
          doc = _$el.doc;

      body.css('height', '100%');
      wrapper.css('min-height', '100%');
    }
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this = this;

      var track = function track() {
        var posY = window.pageYOffset;
        _this._moveElements(posY);
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
        return collection._moveElements(posY);
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
        disableStyles: false
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

      var selectors, top, center;
      selectors = Object.keys(obj);
      selectors.forEach(function (selector) {
        var options = obj[selector];
        _this.addElement(selector, options);
      });
      return this;
    }

    /**
     * @param {String} selector
     * @param {Object} options
     */

  }, {
    key: 'addElement',
    value: function addElement(selector, options) {
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

      var prevY = this.yPrev;
      runUpdate(posY, prevY, this.center, function (value) {
        _this4.center.value = value;
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
      update: { value: function value() {} }
    });
    var _options = options,
        top = _options.top,
        hide = _options.hide,
        zIndex = _options.zIndex,
        speed = _options.speed,
        center = _options.center,
        update = _options.update;


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

    this.jQuery();
    this.styleElement(selector, { center: center, top: top });
  }

  /**
   * @param {Number} posY
   */


  _createClass(ParallaxElement, [{
    key: 'moveElement',
    value: function moveElement(posY) {
      var $el, yPrev, tPrev, yNew, speed, breakpoint, prevBreakpoint, delta, prefix;

      this.runCallbacks(posY);

      yPrev = this.yPrev || 0;
      tPrev = this.tPrev || 0;
      prefix = this.prefix;
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

      $el[0].style[prefix.dom + 'Transform'] = 'translate3d(0px, ' + yNew + 'px, 0) translateZ(0) scale(1)';
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
      this.updateTop(posY);
      this.updateOffset(posY);
      this.updateSpeed(posY);
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

    /**
     * @param {Number} posY
     */

  }, {
    key: 'updateTop',
    value: function updateTop(posY) {
      var _this2 = this;

      var yPrev = this.yPrev;
      runUpdate(posY, yPrev, this.top, function (value) {
        var yOffset = _this2.yOffset;
        _this2.top.value = value = value + yOffset;
        _this2.$el.css('top', value + 'px');
      });
    }

    /**
     * @param {Number} posY
     */

  }, {
    key: 'updateOffset',
    value: function updateOffset(posY) {
      var _this3 = this;

      var yPrev = this.yPrev;
      runUpdate(posY, yPrev, this.offsetTop, function (value) {
        var yDiff, top;
        yDiff = value - _this3.yOffset;
        _this3.yOffset = value;
        top = parseInt(_this3.$el.css('top'), 10);
        _this3.$el.css('top', top + yDiff + 'px');
      });
    }

    /**
     * @param {Number} posY
     */

  }, {
    key: 'updateSpeed',
    value: function updateSpeed(posY) {
      var _this4 = this;

      var yPrev = this.yPrev;
      runUpdate(posY, yPrev, this.speed, function (value, breakpoint, scrollingDown, actualBreakpoint) {
        _this4.speed._breakpoint = actualBreakpoint;
        _this4.speed._lastSpeed = _this4.speed.value;
        _this4.speed.value = value;
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
      if (center) {
        css['margin-right'] = 'auto';
        css['margin-left'] = 'auto';
      }
      if (top) {
        css.top = top + yOffset + 'px';
      }
      $el = $(selector);
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
  var keys;

  options = Object.assign({}, defaults, options);
  keys = Object.keys(options);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvUGFyYWxsYXhCcm8uanMiLCJsaWIvUGFyYWxsYXhDb2xsZWN0aW9uLmpzIiwibGliL1BhcmFsbGF4RWxlbWVudC5qcyIsImxpYi9pbmRleC5qcyIsImxpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0FBLElBQU0scUJBQXFCLFFBQVEsc0JBQVIsQ0FBM0I7O0FBRUEsSUFBSSxDQUFKOztBQUVBLE9BQU8sT0FBUDs7QUFFRTs7O0FBR0Esc0JBQVksT0FBWixFQUFxQjtBQUFBOztBQUFBLDZCQUNjLEtBQUssaUJBQUwsQ0FBdUIsT0FBdkIsQ0FEZDtBQUFBLFFBQ1osT0FEWSxzQkFDWixPQURZO0FBQUEsUUFDSCxhQURHLHNCQUNILGFBREc7O0FBR25CLFNBQUssV0FBTCxHQUFtQixFQUFuQjs7QUFFQSxTQUFLLE9BQUw7QUFDQSxTQUFLLGlCQUFMLENBQXVCLE9BQXZCO0FBQ0EsU0FBSyxXQUFMO0FBQ0EsUUFBSSxDQUFDLGFBQUwsRUFBb0I7QUFDbEIsV0FBSyxTQUFMO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7O0FBbEJGO0FBQUE7QUFBQSxrQ0FzQmdCLFFBdEJoQixFQXNCMEIsT0F0QjFCLEVBc0JtQztBQUMvQixVQUFJLFVBQUo7QUFDQSxtQkFBYSxJQUFJLGtCQUFKLENBQXVCLFFBQXZCLEVBQWlDLE9BQWpDLENBQWI7QUFDQSxXQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsVUFBdEI7QUFDQSxhQUFPLFVBQVA7QUFDRDs7QUFFRDs7OztBQTdCRjtBQUFBO0FBQUEsc0NBZ0NvQixPQWhDcEIsRUFnQzZCO0FBQ3pCLFdBQUssR0FBTCxHQUFXLEVBQVg7QUFDQSxXQUFLLEdBQUwsQ0FBUyxHQUFULEdBQWUsRUFBRSxNQUFGLENBQWY7QUFDQSxXQUFLLEdBQUwsQ0FBUyxHQUFULEdBQWUsRUFBRSxRQUFGLENBQWY7QUFDQSxXQUFLLEdB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QVcsR0FGTjtBQUdMLFNBQUssTUFBTSxHQUFOLEdBQVksR0FIWjtBQUlMLFFBQUksSUFBSSxDQUFKLEVBQU8sV0FBUCxLQUF1QixJQUFJLE1BQUosQ0FBVyxDQUFYO0FBSnRCLEdBQVA7QUFNSCxDQWZEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IFBhcmFsbGF4Q29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vUGFyYWxsYXhDb2xsZWN0aW9uJyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsYXhCcm8ge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGNvbnN0IHt3cmFwcGVyLCBkaXNhYmxlU3R5bGVzfSA9IHRoaXMuX25vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbGxlY3Rpb25zID0gW107XG5cbiAgICB0aGlzLl9qUXVlcnkoKTtcbiAgICB0aGlzLl9jYWNoZURPTUVsZW1lbnRzKHdyYXBwZXIpO1xuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcbiAgICBpZiAoIWRpc2FibGVTdHlsZXMpIHtcbiAgICAgIHRoaXMuX3N0eWxlRE9NKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgYWRkQ29sbGVjdGlvbihzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIHZhciBjb2xsZWN0aW9uO1xuICAgIGNvbGxlY3Rpb24gPSBuZXcgUGFyYWxsYXhDb2xsZWN0aW9uKHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB0aGlzLmNvbGxlY3Rpb25zLnB1c2goY29sbGVjdGlvbik7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHdyYXBwZXJcbiAgICovXG4gIF9jYWNoZURPTUVsZW1lbnRzKHdyYXBwZXIpIHtcbiAgICB0aGlzLiRlbCA9IHt9O1xuICAgIHRoaXMuJGVsLndpbiA9ICQod2luZG93KTtcbiAgICB0aGlzLiRlbC5kb2MgPSAkKGRvY3VtZW50KTtcbiAgICB0aGlzLiRlbC5ib2R5ID0gJCgnYm9keScpO1xuICAgIHRoaXMuJGVsLndyYXBwZXIgPSAkKHdyYXBwZXIpO1xuICB9XG5cbiAgX3N0eWxlRE9NKCkge1xuICAgIHZhciB7Ym9keSwgd3JhcHBlciwgZG9jfSA9IHRoaXMuJGVsO1xuICAgIGJvZHkuY3NzKCdoZWlnaHQnLCAnMTAwJScpO1xuICAgIHdyYXBwZXIuY3NzKCdtaW4taGVpZ2h0JywgJzEwMCUnKTtcbiAgfVxuXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IHRyYWNrID0gKCkgPT4ge1xuICAgICAgdmFyIHBvc1kgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICB0aGlzLl9tb3ZlRWxlbWVudHMocG9zWSk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodHJhY2spO1xuICAgIH1cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodHJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBfbW92ZUVsZW1lbnRzKHBvc1kpIHtcbiAgICB2YXIgY29sbGVjdGlvbnM7XG4gICAgY29sbGVjdGlvbnMgPSB0aGlzLmNvbGxlY3Rpb25zO1xuICAgIGNvbGxlY3Rpb25zLmZvckVhY2goY29sbGVjdGlvbiA9PiBjb2xsZWN0aW9uLl9tb3ZlRWxlbWVudHMocG9zWSkpO1xuICB9XG5cbiAgX2pRdWVyeSgpIHtcbiAgICAkID0galF1ZXJ5O1xuICAgIGlmICghJCkge1xuICAgICAgdGhyb3cgJ2pRdWVyeSBpcyBub3QgZGVmaW5lZCc7XG4gICAgfVxuICB9XG5cbiAgX25vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucykge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICB3cmFwcGVyOiAnI3BhcmFsbGF4JyxcbiAgICAgIGRpc2FibGVTdHlsZXM6IGZhbHNlLFxuICAgIH0sIG9wdGlvbnMpO1xuICB9XG5cbn1cbiIsImNvbnN0IHtub3JtYWxpemVPcHRpb25zLCBydW5VcGRhdGV9ID0gcmVxdWlyZSgnLi91dGlscycpO1xuY29uc3QgUGFyYWxsYXhFbGVtZW50ID0gcmVxdWlyZSgnLi9QYXJhbGxheEVsZW1lbnQnKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxsYXhDb2xsZWN0aW9uIHtcblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMsIHtcbiAgICAgIHRvcDoge3ZhbHVlOiAwfSxcbiAgICAgIGhpZGU6IHt2YWx1ZTogZmFsc2V9LFxuICAgICAgekluZGV4OiB7dmFsdWU6IC0xfSxcbiAgICAgIGNlbnRlcjoge3ZhbHVlOiBmYWxzZX0sXG4gICAgICB1cGRhdGU6IHt2YWx1ZTogKCkgPT4ge319LFxuICAgIH0pO1xuICAgIGNvbnN0IHt0b3AsIGhpZGUsIHpJbmRleCwgY2VudGVyLCB1cGRhdGV9ID0gb3B0aW9ucztcblxuICAgIHRoaXMuJGVsO1xuICAgIHRoaXMuZWxlbWVudHMgPSBbXTtcbiAgICB0aGlzLnlQcmV2O1xuXG4gICAgdGhpcy50b3AgPSB0b3A7XG4gICAgdGhpcy5oaWRlID0gaGlkZTtcbiAgICB0aGlzLnpJbmRleCA9IHpJbmRleDtcbiAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcbiAgICB0aGlzLnVwZGF0ZSA9IHVwZGF0ZTtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5zdHlsZUNvbGxlY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICovXG4gIGFkZEVsZW1lbnRzKG9iaikge1xuICAgIHZhciBzZWxlY3RvcnMsIHRvcCwgY2VudGVyO1xuICAgIHNlbGVjdG9ycyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgc2VsZWN0b3JzLmZvckVhY2goc2VsZWN0b3IgPT4ge1xuICAgICAgdmFyIG9wdGlvbnMgPSBvYmpbc2VsZWN0b3JdO1xuICAgICAgdGhpcy5hZGRFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGFkZEVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgZWxlbWVudDtcbiAgICBlbGVtZW50ID0gbmV3IFBhcmFsbGF4RWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucywgdGhpcy50b3ApO1xuICAgIHRoaXMuZWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgbW92ZUVsZW1lbnRzKHBvc1kpIHtcbiAgICB2YXIgZWxlbWVudHM7XG4gICAgZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzO1xuICAgIHRoaXMucnVuQ2FsbGJhY2tzKHBvc1kpO1xuICAgIGVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiBlbGVtZW50Lm1vdmVFbGVtZW50KHBvc1kpKTtcbiAgICB0aGlzLnlQcmV2ID0gcG9zWTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgcnVuQ2FsbGJhY2tzKHBvc1kpIHtcbiAgICB0aGlzLnVwZGF0ZUhpZGUocG9zWSk7XG4gICAgdGhpcy51cGRhdGVaaW5kZXgocG9zWSk7XG4gICAgdGhpcy51cGRhdGVDZW50ZXIocG9zWSk7XG4gICAgdGhpcy51cGRhdGVDYWxsYmFjayhwb3NZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlSGlkZShwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuaGlkZSwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLmhpZGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuJGVsLmNzcygnb3BhY2l0eScsIHZhbHVlID8gMCA6IDEpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVaaW5kZXgocG9zWSkge1xuICAgIHZhciBwcmV2WSA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHByZXZZLCB0aGlzLnpJbmRleCwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLnpJbmRleC52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy4kZWwuY3NzKCd6SW5kZXgnLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZUNlbnRlcihwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuY2VudGVyLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuY2VudGVyLnZhbHVlID0gdmFsdWU7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy4kZWwuY3NzKHtcbiAgICAgICAgICAnbWFyZ2luLXJpZ2h0JzogJ2F1dG8nLFxuICAgICAgICAgICdtYXJnaW4tbGVmdCc6ICdhdXRvJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy4kZWwuY3NzKHtcbiAgICAgICAgICAnbWFyZ2luLXJpZ2h0JzogJ2luaGVyaXQnLFxuICAgICAgICAgICdtYXJnaW4tbGVmdCc6ICdpbmhlcml0JyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZUNhbGxiYWNrKHBvc1kpIHtcbiAgICB2YXIgeVByZXYsICRlbCwgc2VsZjtcbiAgICB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgJGVsID0gdGhpcy4kZWw7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLnVwZGF0ZSwgKHZhbHVlLCBicmVha3BvaW50KSA9PiB7XG4gICAgICBzZWxmLnVwZGF0ZS5icmVha3BvaW50c1ticmVha3BvaW50XS5jYWxsKHNlbGYsICRlbCwgcG9zWSwgeVByZXYpO1xuICAgIH0pO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBzdHlsZUNvbGxlY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgJGVsLCBjc3M7XG4gICAgdmFyIHtjZW50ZXIsIHpJbmRleCwgaGlkZX0gPSBvcHRpb25zO1xuICAgIGNzcyA9IHt9O1xuICAgIGNzcy56SW5kZXggPSB6SW5kZXgudmFsdWU7XG4gICAgaWYgKGNlbnRlci52YWx1ZSkge1xuICAgICAgY3NzWydtYXJnaW4tcmlnaHQnXSA9ICdhdXRvJztcbiAgICAgIGNzc1snbWFyZ2luLWxlZnQnXSA9ICdhdXRvJztcbiAgICB9XG4gICAgaWYgKGhpZGUudmFsdWUpIHtcbiAgICAgIGNzcy5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cbiAgICAkZWwgPSAkKHNlbGVjdG9yKTtcbiAgICAkZWwuY3NzKGNzcyk7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxufVxuIiwiY29uc3Qge3ByZWZpeCwgbm9ybWFsaXplT3B0aW9ucywgcnVuVXBkYXRlfSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxsYXhFbGVtZW50IHtcblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvZmZzZXRUb3BcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBvcHRpb25zLCBvZmZzZXRUb3ApIHtcbiAgICBvcHRpb25zID0gbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zLCB7XG4gICAgICB0b3A6IHt2YWx1ZTogMH0sXG4gICAgICBoaWRlOiB7dmFsdWU6IGZhbHNlfSxcbiAgICAgIHpJbmRleDoge3ZhbHVlOiAtMX0sXG4gICAgICBzcGVlZDoge3ZhbHVlOiAxfSxcbiAgICAgIGNlbnRlcjoge3ZhbHVlOiBmYWxzZX0sXG4gICAgICB1cGRhdGU6IHt2YWx1ZTogKCkgPT4ge319LFxuICAgIH0pO1xuICAgIGNvbnN0IHt0b3AsIGhpZGUsIHpJbmRleCwgc3BlZWQsIGNlbnRlciwgdXBkYXRlfSA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLiRlbDtcbiAgICB0aGlzLnByZWZpeCA9IHByZWZpeCgpO1xuICAgIHRoaXMub2Zmc2V0VG9wID0gb2Zmc2V0VG9wO1xuICAgIHRoaXMueU9mZnNldCA9IG9mZnNldFRvcC52YWx1ZTtcbiAgICB0aGlzLnlQcmV2O1xuICAgIHRoaXMudFByZXY7XG5cbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLmhpZGUgPSBoaWRlO1xuICAgIHRoaXMuekluZGV4ID0gekluZGV4O1xuICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcbiAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcbiAgICB0aGlzLnVwZGF0ZSA9IHVwZGF0ZTtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5zdHlsZUVsZW1lbnQoc2VsZWN0b3IsIHtjZW50ZXIsIHRvcH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBtb3ZlRWxlbWVudChwb3NZKSB7XG4gICAgdmFyICRlbCwgeVByZXYsIHRQcmV2LCB5TmV3LCBzcGVlZCwgYnJlYWtwb2ludCwgcHJldkJyZWFrcG9pbnQsIGRlbHRhLCBwcmVmaXg7XG5cbiAgICB0aGlzLnJ1bkNhbGxiYWNrcyhwb3NZKTtcblxuICAgIHlQcmV2ID0gdGhpcy55UHJldiB8fCAwO1xuICAgIHRQcmV2ID0gdGhpcy50UHJldiB8fCAwO1xuICAgIHByZWZpeCA9IHRoaXMucHJlZml4O1xuICAgICRlbCA9IHRoaXMuJGVsO1xuICAgIHNwZWVkID0gdGhpcy5zcGVlZC52YWx1ZTtcbiAgICBicmVha3BvaW50ID0gdGhpcy5zcGVlZC5fYnJlYWtwb2ludDtcblxuICAgIGlmIChicmVha3BvaW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGxldCBsYXN0U3BlZWQsIHlEaWZmO1xuICAgICAgZGVsdGEgPSAwO1xuICAgICAgbGFzdFNwZWVkID0gdGhpcy5zcGVlZC5fbGFzdFNwZWVkO1xuXG4gICAgICB5RGlmZiA9IHlQcmV2IC0gYnJlYWtwb2ludDtcbiAgICAgIGRlbHRhICs9IE1hdGgucm91bmQoeURpZmYqbGFzdFNwZWVkKjEwMCkgLyAxMDA7XG5cbiAgICAgIHlEaWZmID0gYnJlYWtwb2ludCAtIHBvc1k7XG4gICAgICBkZWx0YSArPSBNYXRoLnJvdW5kKHlEaWZmKnNwZWVkKjEwMCkgLyAxMDA7XG5cbiAgICAgIHRoaXMuc3BlZWQuX2JyZWFrcG9pbnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IHlEaWZmO1xuICAgICAgZGVsdGEgPSAwO1xuICAgICAgeURpZmYgPSB5UHJldiAtIHBvc1k7XG4gICAgICBkZWx0YSA9IE1hdGgucm91bmQoeURpZmYqc3BlZWQqMTAwKSAvIDEwMDtcbiAgICB9XG5cbiAgICB5TmV3ID0gdFByZXYgKyBkZWx0YTtcblxuICAgICRlbFswXS5zdHlsZVtwcmVmaXguZG9tICsgJ1RyYW5zZm9ybSddID0gYHRyYW5zbGF0ZTNkKDBweCwgJHt5TmV3fXB4LCAwKSB0cmFuc2xhdGVaKDApIHNjYWxlKDEpYDtcbiAgICB0aGlzLnlQcmV2ID0gcG9zWTtcbiAgICB0aGlzLnRQcmV2ID0geU5ldztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgcnVuQ2FsbGJhY2tzKHBvc1kpIHtcbiAgICB0aGlzLnVwZGF0ZUhpZGUocG9zWSk7XG4gICAgdGhpcy51cGRhdGVUb3AocG9zWSk7XG4gICAgdGhpcy51cGRhdGVPZmZzZXQocG9zWSk7XG4gICAgdGhpcy51cGRhdGVTcGVlZChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZUNhbGxiYWNrKHBvc1kpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVIaWRlKHBvc1kpIHtcbiAgICB2YXIgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy5oaWRlLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuaGlkZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy4kZWwuY3NzKCdkaXNwbGF5JywgdmFsdWUgPyAnbm9uZScgOiAnYmxvY2snKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlVG9wKHBvc1kpIHtcbiAgICB2YXIgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy50b3AsICh2YWx1ZSkgPT4ge1xuICAgICAgdmFyIHlPZmZzZXQgPSB0aGlzLnlPZmZzZXQ7XG4gICAgICB0aGlzLnRvcC52YWx1ZSA9IHZhbHVlID0gdmFsdWUgKyB5T2Zmc2V0O1xuICAgICAgdGhpcy4kZWwuY3NzKCd0b3AnLCB2YWx1ZSArICdweCcpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVPZmZzZXQocG9zWSkge1xuICAgIHZhciB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLm9mZnNldFRvcCwgKHZhbHVlKSA9PiB7XG4gICAgICB2YXIgeURpZmYsIHRvcDtcbiAgICAgIHlEaWZmID0gdmFsdWUgLSB0aGlzLnlPZmZzZXQ7XG4gICAgICB0aGlzLnlPZmZzZXQgPSB2YWx1ZTtcbiAgICAgIHRvcCA9IHBhcnNlSW50KHRoaXMuJGVsLmNzcygndG9wJyksIDEwKTtcbiAgICAgIHRoaXMuJGVsLmNzcygndG9wJywgdG9wICsgeURpZmYgKyAncHgnKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlU3BlZWQocG9zWSkge1xuICAgIHZhciB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLnNwZWVkLCAodmFsdWUsIGJyZWFrcG9pbnQsIHNjcm9sbGluZ0Rvd24sIGFjdHVhbEJyZWFrcG9pbnQpID0+IHtcbiAgICAgIHRoaXMuc3BlZWQuX2JyZWFrcG9pbnQgPSBhY3R1YWxCcmVha3BvaW50O1xuICAgICAgdGhpcy5zcGVlZC5fbGFzdFNwZWVkID0gdGhpcy5zcGVlZC52YWx1ZTtcbiAgICAgIHRoaXMuc3BlZWQudmFsdWUgPSB2YWx1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlQ2FsbGJhY2socG9zWSkge1xuICAgIHZhciB5UHJldiwgJGVsLCBzZWxmO1xuICAgIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICAkZWwgPSB0aGlzLiRlbDtcbiAgICBzZWxmID0gdGhpcztcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMudXBkYXRlLCAodmFsdWUsIGJyZWFrcG9pbnQpID0+IHtcbiAgICAgIHNlbGYudXBkYXRlLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdLmNhbGwoc2VsZiwgJGVsLCBwb3NZLCB5UHJldik7XG4gICAgfSk7XG4gIH1cblxuICBqUXVlcnkoKSB7XG4gICAgJCA9IGpRdWVyeTtcbiAgICBpZiAoISQpIHtcbiAgICAgIHRocm93ICdqUXVlcnkgaXMgbm90IGRlZmluZWQnO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIHN0eWxlRWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIHZhciAkZWwsIGNzcywgeU9mZnNldDtcbiAgICB2YXIge2NlbnRlciwgdG9wfSA9IG9wdGlvbnM7XG4gICAgeU9mZnNldCA9IHRoaXMueU9mZnNldDtcbiAgICBjc3MgPSB7XG4gICAgICAncG9zaXRpb24nOiAnZml4ZWQnLFxuICAgICAgJ2xlZnQnOiAwLFxuICAgICAgJ3JpZ2h0JzogMCxcbiAgICB9O1xuICAgIGlmIChjZW50ZXIpIHtcbiAgICAgIGNzc1snbWFyZ2luLXJpZ2h0J10gPSAnYXV0byc7XG4gICAgICBjc3NbJ21hcmdpbi1sZWZ0J10gPSAnYXV0byc7XG4gICAgfVxuICAgIGlmICh0b3ApIHtcbiAgICAgIGNzcy50b3AgPSB0b3AgKyB5T2Zmc2V0KydweCc7XG4gICAgfVxuICAgICRlbCA9ICQoc2VsZWN0b3IpO1xuICAgICRlbC5jc3MoY3NzKTtcbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vUGFyYWxsYXhCcm8nKTtcbiIsImNvbnN0IHNlbGYgPSBtb2R1bGUuZXhwb3J0cztcblxuc2VsZi5jYWxsQnJlYWtwb2ludHMgPSAocG9zWSwgeVByZXYsIGJyZWFrcG9pbnRzLCBjYWxsYmFjaykgPT4ge1xuICB2YXIgc2Nyb2xsaW5nRG93biwgeURpZmY7XG4gIHNjcm9sbGluZ0Rvd24gPSB5UHJldiA8IHBvc1k7XG4gIHlEaWZmID0gc2Nyb2xsaW5nRG93biA/IHBvc1kgLSB5UHJldiA6IHlQcmV2IC0gcG9zWTtcbiAgYnJlYWtwb2ludHMgPSBicmVha3BvaW50cy5tYXAoYnJlYWtwb2ludCA9PiBwYXJzZUludChicmVha3BvaW50LCAxMCkpO1xuICAvLyBAdG9kbyAtIHdlIGNvdWxkIHVzZSBhIGRpZmZlcmVudCB0ZWNobmlxdWUgYnV0IHRoaXMgb25lIHdvcmtzIHcvIGxpdHRsZSBhcGFyZW50IGRvd25zaWRlcy5cbiAgZm9yIChsZXQgaT0wOyBpPHlEaWZmOyBpKyspIHtcbiAgICBsZXQgcG9zLCBpbmRleDtcbiAgICBwb3MgPSBzY3JvbGxpbmdEb3duID8geVByZXYgKyBpIDogeVByZXYgLSBpO1xuICAgIGluZGV4ID0gYnJlYWtwb2ludHMuaW5kZXhPZihwb3MpO1xuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICBsZXQgaSA9IHNjcm9sbGluZ0Rvd24gPyBpbmRleCA6IGluZGV4IC0gMTtcbiAgICAgIGNhbGxiYWNrLmNhbGwobnVsbCwgYnJlYWtwb2ludHNbaV0sIHNjcm9sbGluZ0Rvd24sIGJyZWFrcG9pbnRzW2luZGV4XSk7XG4gICAgfVxuICB9XG59XG5cbnNlbGYucnVuVXBkYXRlID0gKHBvc1ksIHlQcmV2LCBvYmosIGNhbGxiYWNrKSA9PiB7XG4gIHZhciBicmVha3BvaW50cyA9IE9iamVjdC5rZXlzKG9iai5icmVha3BvaW50cyk7XG5cbiAgLy8gQ2FsbCBvbiBpbml0LlxuICBpZiAoeVByZXYgPT09IHVuZGVmaW5lZCkge1xuICAgIHZhciB2YWx1ZSA9IG9iai5icmVha3BvaW50c1twb3NZXTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2FsbGJhY2suY2FsbChudWxsLCB2YWx1ZSwgcG9zWSwgdHJ1ZSk7XG4gICAgfVxuICB9XG4gIHNlbGYuY2FsbEJyZWFrcG9pbnRzKHBvc1ksIHlQcmV2LCBicmVha3BvaW50cywgKGJyZWFrcG9pbnQsIHNjcm9sbGluZ0Rvd24sIGFjdHVhbEJyZWFrcG9pbnQpID0+IHtcbiAgICB2YXIgdmFsdWUgPSBvYmouYnJlYWtwb2ludHNbYnJlYWtwb2ludF07XG4gICAgY2FsbGJhY2suY2FsbChudWxsLCB2YWx1ZSwgYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93biwgYWN0dWFsQnJlYWtwb2ludCk7XG4gIH0pO1xufVxuXG5zZWxmLm5vcm1hbGl6ZU9wdGlvbnMgPSAob3B0aW9ucywgZGVmYXVsdHMpID0+IHtcbiAgdmFyIGtleXM7XG5cbiAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuXG4gIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgIHZhciB2YWx1ZSwgaXNPYmplY3Q7XG4gICAgdmFsdWUgPSBvcHRpb25zW2tleV07XG4gICAgaXNPYmplY3QgPSBzZWxmLmlzVHlwZSh2YWx1ZSwgJ29iamVjdCcpO1xuICAgIGlmIChpc09iamVjdCkge1xuICAgICAgbGV0IHZhbHVlMSA9IHZhbHVlICYmIHZhbHVlWycwJ10gPyB2YWx1ZVsnMCddIDogZGVmYXVsdHNba2V5XS52YWx1ZTtcbiAgICAgIGRlbGV0ZSB2YWx1ZS52YWx1ZTtcbiAgICAgIG9wdGlvbnNba2V5XSA9IHtcbiAgICAgICAgdmFsdWU6IHZhbHVlMSxcbiAgICAgICAgYnJlYWtwb2ludHM6IE9iamVjdC5hc3NpZ24oe30sIHswOiB2YWx1ZTF9LCB2YWx1ZSksXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgb3B0aW9uc1trZXldID0ge1xuICAgICAgICB2YWx1ZSxcbiAgICAgICAgYnJlYWtwb2ludHM6IHswOiB2YWx1ZX1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3B0aW9ucztcbn1cblxuLyoqXG4gKiBHaXZlbiBhIE1peGVkIHZhbHVlIHR5cGUgY2hlY2suXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljLlxuICogQHRlc3RzIHVuaXQuXG4gKi9cbnNlbGYuaXNUeXBlID0gKHZhbHVlLCB0eXBlKSA9PiB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzTmFOKHZhbHVlKSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09IGZhbHNlO1xuICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKTtcbiAgICBjYXNlICdvYmplY3QnOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkgPT09IGZhbHNlO1xuICAgIGNhc2UgJ251bGwnOlxuICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsO1xuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZDtcbiAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCc7XG4gICAgY2FzZSAnTmFOJzpcbiAgICAgIHJldHVybiBOdW1iZXIuaXNOYU4odmFsdWUpO1xuICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnJlY2dvbml6ZWQgdHlwZTogXCIke3R5cGV9XCJgKTtcbiAgfVxufTtcblxuc2VsZi5wcmVmaXggPSAoKSA9PiB7XG4gIHZhciBzdHlsZXMsIHByZSwgZG9tO1xuICBzdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsICcnKSxcbiAgICBwcmUgPSAoQXJyYXkucHJvdG90eXBlLnNsaWNlXG4gICAgICAuY2FsbChzdHlsZXMpXG4gICAgICAuam9pbignJylcbiAgICAgIC5tYXRjaCgvLShtb3p8d2Via2l0fG1zKS0vKSB8fCAoc3R5bGVzLk9MaW5rID09PSAnJyAmJiBbJycsICdvJ10pXG4gICAgKVsxXSxcbiAgICBkb20gPSAoJ3dlYmtpdHxNb3p8TVN8TycpLm1hdGNoKG5ldyBSZWdFeHAoJygnICsgcHJlICsgJyknLCAnaScpKVsxXTtcbiAgICByZXR1cm4ge1xuICAgICAgZG9tOiBkb20sXG4gICAgICBsb3dlcmNhc2U6IHByZSxcbiAgICAgIGNzczogJy0nICsgcHJlICsgJy0nLFxuICAgICAganM6IHByZVswXS50b1VwcGVyQ2FzZSgpICsgcHJlLnN1YnN0cigxKVxuICAgIH07XG59O1xuIl19
