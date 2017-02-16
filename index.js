(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParallaxCollection = require('./ParallaxCollection');

var $;

module.exports = function () {
  function ParalaxBro(options) {
    _classCallCheck(this, ParalaxBro);

    var _normalizeOptions = this.normalizeOptions(options),
        wrapper = _normalizeOptions.wrapper,
        disableStyles = _normalizeOptions.disableStyles;

    this.collections = [];

    this.jQuery();
    this.cacheDOMElements(wrapper);
    this.bindEvents();
    if (!disableStyles) {
      this.styleDOM();
    }
  }

  _createClass(ParalaxBro, [{
    key: 'addCollection',
    value: function addCollection(selector, obj) {
      var collection;
      collection = new ParallaxCollection(selector, obj);
      this.collections.push(collection);
      return collection;
    }
  }, {
    key: 'cacheDOMElements',
    value: function cacheDOMElements(wrapper) {
      this.$el = {};
      this.$el.win = $(window);
      this.$el.doc = $(document);
      this.$el.body = $('body');
      this.$el.wrapper = $(wrapper);
    }
  }, {
    key: 'styleDOM',
    value: function styleDOM() {
      var _$el = this.$el,
          body = _$el.body,
          wrapper = _$el.wrapper,
          doc = _$el.doc;

      body.css('height', '100%');
      wrapper.css('min-height', '100%');
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this = this;

      var track = function track() {
        var posY = window.pageYOffset;
        _this.moveElements(posY);
        requestAnimationFrame(track);
      };
      requestAnimationFrame(track);
    }
  }, {
    key: 'moveElements',
    value: function moveElements(posY) {
      var collections;
      collections = this.collections;
      collections.forEach(function (collection) {
        return collection.moveElements(posY);
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
  }, {
    key: 'normalizeOptions',
    value: function normalizeOptions(options) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvUGFyYWxsYXhCcm8uanMiLCJsaWIvUGFyYWxsYXhDb2xsZWN0aW9uLmpzIiwibGliL1BhcmFsbGF4RWxlbWVudC5qcyIsImxpYi9pbmRleC5qcyIsImxpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0FBLElBQU0scUJBQXFCLFFBQVEsc0JBQVIsQ0FBM0I7O0FBRUEsSUFBSSxDQUFKOztBQUVBLE9BQU8sT0FBUDtBQUVFLHNCQUFZLE9BQVosRUFBcUI7QUFBQTs7QUFBQSw0QkFDYyxLQUFLLGdCQUFMLENBQXNCLE9BQXRCLENBRGQ7QUFBQSxRQUNaLE9BRFkscUJBQ1osT0FEWTtBQUFBLFFBQ0gsYUFERyxxQkFDSCxhQURHOztBQUduQixTQUFLLFdBQUwsR0FBbUIsRUFBbkI7O0FBRUEsU0FBSyxNQUFMO0FBQ0EsU0FBSyxnQkFBTCxDQUFzQixPQUF0QjtBQUNBLFNBQUssVUFBTDtBQUNBLFFBQUksQ0FBQyxhQUFMLEVBQW9CO0FBQ2xCLFdBQUssUUFBTDtBQUNEO0FBQ0Y7O0FBYkg7QUFBQTtBQUFBLGtDQWVnQixRQWZoQixFQWUwQixHQWYxQixFQWUrQjtBQUMzQixVQUFJLFVBQUo7QUFDQSxtQkFBYSxJQUFJLGtCQUFKLENBQXVCLFFBQXZCLEVBQWlDLEdBQWpDLENBQWI7QUFDQSxXQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsVUFBdEI7QUFDQSxhQUFPLFVBQVA7QUFDRDtBQXBCSDtBQUFBO0FBQUEscUNBc0JtQixPQXRCbkIsRUFzQjRCO0FBQ3hCLFdBQUssR0FBTCxHQUFXLEVBQVg7QUFDQSxXQUFLLEdBQUwsQ0FBUyxHQUFULEdBQWUsRUFBRSxNQUFGLENBQWY7QUFDQSxXQUFLLEdBQUwsQ0FBUyxHQUFULEdBQWUsRUFBRSxRQUFGLENBQWY7QUFDQSxXQUFLLEdBQUwsQ0FBUyxJQUFULEdBQWdCLEVBQUUsTUFBRixDQUFo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QVcsR0FGTjtBQUdMLFNBQUssTUFBTSxHQUFOLEdBQVksR0FIWjtBQUlMLFFBQUksSUFBSSxDQUFKLEVBQU8sV0FBUCxLQUF1QixJQUFJLE1BQUosQ0FBVyxDQUFYO0FBSnRCLEdBQVA7QUFNSCxDQWZEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IFBhcmFsbGF4Q29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vUGFyYWxsYXhDb2xsZWN0aW9uJyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsYXhCcm8ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBjb25zdCB7d3JhcHBlciwgZGlzYWJsZVN0eWxlc30gPSB0aGlzLm5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbGxlY3Rpb25zID0gW107XG5cbiAgICB0aGlzLmpRdWVyeSgpO1xuICAgIHRoaXMuY2FjaGVET01FbGVtZW50cyh3cmFwcGVyKTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICBpZiAoIWRpc2FibGVTdHlsZXMpIHtcbiAgICAgIHRoaXMuc3R5bGVET00oKTtcbiAgICB9XG4gIH1cblxuICBhZGRDb2xsZWN0aW9uKHNlbGVjdG9yLCBvYmopIHtcbiAgICB2YXIgY29sbGVjdGlvbjtcbiAgICBjb2xsZWN0aW9uID0gbmV3IFBhcmFsbGF4Q29sbGVjdGlvbihzZWxlY3Rvciwgb2JqKTtcbiAgICB0aGlzLmNvbGxlY3Rpb25zLnB1c2goY29sbGVjdGlvbik7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cblxuICBjYWNoZURPTUVsZW1lbnRzKHdyYXBwZXIpIHtcbiAgICB0aGlzLiRlbCA9IHt9O1xuICAgIHRoaXMuJGVsLndpbiA9ICQod2luZG93KTtcbiAgICB0aGlzLiRlbC5kb2MgPSAkKGRvY3VtZW50KTtcbiAgICB0aGlzLiRlbC5ib2R5ID0gJCgnYm9keScpO1xuICAgIHRoaXMuJGVsLndyYXBwZXIgPSAkKHdyYXBwZXIpO1xuICB9XG5cbiAgc3R5bGVET00oKSB7XG4gICAgdmFyIHtib2R5LCB3cmFwcGVyLCBkb2N9ID0gdGhpcy4kZWw7XG4gICAgYm9keS5jc3MoJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgd3JhcHBlci5jc3MoJ21pbi1oZWlnaHQnLCAnMTAwJScpO1xuICB9XG5cbiAgYmluZEV2ZW50cygpIHtcbiAgICBjb25zdCB0cmFjayA9ICgpID0+IHtcbiAgICAgIHZhciBwb3NZID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgdGhpcy5tb3ZlRWxlbWVudHMocG9zWSk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodHJhY2spO1xuICAgIH1cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodHJhY2spO1xuICB9XG5cblxuICBtb3ZlRWxlbWVudHMocG9zWSkge1xuICAgIHZhciBjb2xsZWN0aW9ucztcbiAgICBjb2xsZWN0aW9ucyA9IHRoaXMuY29sbGVjdGlvbnM7XG4gICAgY29sbGVjdGlvbnMuZm9yRWFjaChjb2xsZWN0aW9uID0+IGNvbGxlY3Rpb24ubW92ZUVsZW1lbnRzKHBvc1kpKTtcbiAgfVxuXG4gIGpRdWVyeSgpIHtcbiAgICAkID0galF1ZXJ5O1xuICAgIGlmICghJCkge1xuICAgICAgdGhyb3cgJ2pRdWVyeSBpcyBub3QgZGVmaW5lZCc7XG4gICAgfVxuICB9XG5cbiAgbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgIHdyYXBwZXI6ICcjcGFyYWxsYXgnLFxuICAgICAgZGlzYWJsZVN0eWxlczogZmFsc2UsXG4gICAgfSwgb3B0aW9ucyk7XG4gIH1cblxufVxuIiwiY29uc3Qge25vcm1hbGl6ZU9wdGlvbnMsIHJ1blVwZGF0ZX0gPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5jb25zdCBQYXJhbGxheEVsZW1lbnQgPSByZXF1aXJlKCcuL1BhcmFsbGF4RWxlbWVudCcpO1xuXG52YXIgJDtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYXJhbGxheENvbGxlY3Rpb24ge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucywge1xuICAgICAgdG9wOiB7dmFsdWU6IDB9LFxuICAgICAgaGlkZToge3ZhbHVlOiBmYWxzZX0sXG4gICAgICB6SW5kZXg6IHt2YWx1ZTogLTF9LFxuICAgICAgY2VudGVyOiB7dmFsdWU6IGZhbHNlfSxcbiAgICAgIHVwZGF0ZToge3ZhbHVlOiAoKSA9PiB7fX0sXG4gICAgfSk7XG4gICAgY29uc3Qge3RvcCwgaGlkZSwgekluZGV4LCBjZW50ZXIsIHVwZGF0ZX0gPSBvcHRpb25zO1xuXG4gICAgdGhpcy4kZWw7XG4gICAgdGhpcy5lbGVtZW50cyA9IFtdO1xuICAgIHRoaXMueVByZXY7XG5cbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLmhpZGUgPSBoaWRlO1xuICAgIHRoaXMuekluZGV4ID0gekluZGV4O1xuICAgIHRoaXMuY2VudGVyID0gY2VudGVyO1xuICAgIHRoaXMudXBkYXRlID0gdXBkYXRlO1xuXG4gICAgdGhpcy5qUXVlcnkoKTtcbiAgICB0aGlzLnN0eWxlQ29sbGVjdGlvbihzZWxlY3Rvciwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgKi9cbiAgYWRkRWxlbWVudHMob2JqKSB7XG4gICAgdmFyIHNlbGVjdG9ycywgdG9wLCBjZW50ZXI7XG4gICAgc2VsZWN0b3JzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICBzZWxlY3RvcnMuZm9yRWFjaChzZWxlY3RvciA9PiB7XG4gICAgICB2YXIgb3B0aW9ucyA9IG9ialtzZWxlY3Rvcl07XG4gICAgICB0aGlzLmFkZEVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgYWRkRWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIHZhciBlbGVtZW50O1xuICAgIGVsZW1lbnQgPSBuZXcgUGFyYWxsYXhFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zLCB0aGlzLnRvcCk7XG4gICAgdGhpcy5lbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBtb3ZlRWxlbWVudHMocG9zWSkge1xuICAgIHZhciBlbGVtZW50cztcbiAgICBlbGVtZW50cyA9IHRoaXMuZWxlbWVudHM7XG4gICAgdGhpcy5ydW5DYWxsYmFja3MocG9zWSk7XG4gICAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IGVsZW1lbnQubW92ZUVsZW1lbnQocG9zWSkpO1xuICAgIHRoaXMueVByZXYgPSBwb3NZO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBydW5DYWxsYmFja3MocG9zWSkge1xuICAgIHRoaXMudXBkYXRlSGlkZShwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZVppbmRleChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZUNlbnRlcihwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZUNhbGxiYWNrKHBvc1kpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVIaWRlKHBvc1kpIHtcbiAgICB2YXIgcHJldlkgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgdGhpcy5oaWRlLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuaGlkZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy4kZWwuY3NzKCdvcGFjaXR5JywgdmFsdWUgPyAwIDogMSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZVppbmRleChwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuekluZGV4LCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuekluZGV4LnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLiRlbC5jc3MoJ3pJbmRleCcsIHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlQ2VudGVyKHBvc1kpIHtcbiAgICB2YXIgcHJldlkgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgdGhpcy5jZW50ZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy5jZW50ZXIudmFsdWUgPSB2YWx1ZTtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB0aGlzLiRlbC5jc3Moe1xuICAgICAgICAgICdtYXJnaW4tcmlnaHQnOiAnYXV0bycsXG4gICAgICAgICAgJ21hcmdpbi1sZWZ0JzogJ2F1dG8nLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLiRlbC5jc3Moe1xuICAgICAgICAgICdtYXJnaW4tcmlnaHQnOiAnaW5oZXJpdCcsXG4gICAgICAgICAgJ21hcmdpbi1sZWZ0JzogJ2luaGVyaXQnLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlQ2FsbGJhY2socG9zWSkge1xuICAgIHZhciB5UHJldiwgJGVsLCBzZWxmO1xuICAgIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICAkZWwgPSB0aGlzLiRlbDtcbiAgICBzZWxmID0gdGhpcztcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMudXBkYXRlLCAodmFsdWUsIGJyZWFrcG9pbnQpID0+IHtcbiAgICAgIHNlbGYudXBkYXRlLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdLmNhbGwoc2VsZiwgJGVsLCBwb3NZLCB5UHJldik7XG4gICAgfSk7XG4gIH1cblxuICBqUXVlcnkoKSB7XG4gICAgJCA9IGpRdWVyeTtcbiAgICBpZiAoISQpIHtcbiAgICAgIHRocm93ICdqUXVlcnkgaXMgbm90IGRlZmluZWQnO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIHN0eWxlQ29sbGVjdGlvbihzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIHZhciAkZWwsIGNzcztcbiAgICB2YXIge2NlbnRlciwgekluZGV4LCBoaWRlfSA9IG9wdGlvbnM7XG4gICAgY3NzID0ge307XG4gICAgY3NzLnpJbmRleCA9IHpJbmRleC52YWx1ZTtcbiAgICBpZiAoY2VudGVyLnZhbHVlKSB7XG4gICAgICBjc3NbJ21hcmdpbi1yaWdodCddID0gJ2F1dG8nO1xuICAgICAgY3NzWydtYXJnaW4tbGVmdCddID0gJ2F1dG8nO1xuICAgIH1cbiAgICBpZiAoaGlkZS52YWx1ZSkge1xuICAgICAgY3NzLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuICAgICRlbCA9ICQoc2VsZWN0b3IpO1xuICAgICRlbC5jc3MoY3NzKTtcbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG59XG4iLCJjb25zdCB7cHJlZml4LCBub3JtYWxpemVPcHRpb25zLCBydW5VcGRhdGV9ID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgJDtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYXJhbGxheEVsZW1lbnQge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICogQHBhcmFtIHtPYmplY3R9IG9mZnNldFRvcFxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2VsZWN0b3IsIG9wdGlvbnMsIG9mZnNldFRvcCkge1xuICAgIG9wdGlvbnMgPSBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMsIHtcbiAgICAgIHRvcDoge3ZhbHVlOiAwfSxcbiAgICAgIGhpZGU6IHt2YWx1ZTogZmFsc2V9LFxuICAgICAgekluZGV4OiB7dmFsdWU6IC0xfSxcbiAgICAgIHNwZWVkOiB7dmFsdWU6IDF9LFxuICAgICAgY2VudGVyOiB7dmFsdWU6IGZhbHNlfSxcbiAgICAgIHVwZGF0ZToge3ZhbHVlOiAoKSA9PiB7fX0sXG4gICAgfSk7XG4gICAgY29uc3Qge3RvcCwgaGlkZSwgekluZGV4LCBzcGVlZCwgY2VudGVyLCB1cGRhdGV9ID0gb3B0aW9ucztcblxuICAgIHRoaXMuJGVsO1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4KCk7XG4gICAgdGhpcy5vZmZzZXRUb3AgPSBvZmZzZXRUb3A7XG4gICAgdGhpcy55T2Zmc2V0ID0gb2Zmc2V0VG9wLnZhbHVlO1xuICAgIHRoaXMueVByZXY7XG4gICAgdGhpcy50UHJldjtcblxuICAgIHRoaXMudG9wID0gdG9wO1xuICAgIHRoaXMuaGlkZSA9IGhpZGU7XG4gICAgdGhpcy56SW5kZXggPSB6SW5kZXg7XG4gICAgdGhpcy5zcGVlZCA9IHNwZWVkO1xuICAgIHRoaXMuY2VudGVyID0gY2VudGVyO1xuICAgIHRoaXMudXBkYXRlID0gdXBkYXRlO1xuXG4gICAgdGhpcy5qUXVlcnkoKTtcbiAgICB0aGlzLnN0eWxlRWxlbWVudChzZWxlY3Rvciwge2NlbnRlciwgdG9wfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIG1vdmVFbGVtZW50KHBvc1kpIHtcbiAgICB2YXIgJGVsLCB5UHJldiwgdFByZXYsIHlOZXcsIHNwZWVkLCBicmVha3BvaW50LCBwcmV2QnJlYWtwb2ludCwgZGVsdGEsIHByZWZpeDtcblxuICAgIHRoaXMucnVuQ2FsbGJhY2tzKHBvc1kpO1xuXG4gICAgeVByZXYgPSB0aGlzLnlQcmV2IHx8IDA7XG4gICAgdFByZXYgPSB0aGlzLnRQcmV2IHx8IDA7XG4gICAgcHJlZml4ID0gdGhpcy5wcmVmaXg7XG4gICAgJGVsID0gdGhpcy4kZWw7XG4gICAgc3BlZWQgPSB0aGlzLnNwZWVkLnZhbHVlO1xuICAgIGJyZWFrcG9pbnQgPSB0aGlzLnNwZWVkLl9icmVha3BvaW50O1xuXG4gICAgaWYgKGJyZWFrcG9pbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbGV0IGxhc3RTcGVlZCwgeURpZmY7XG4gICAgICBkZWx0YSA9IDA7XG4gICAgICBsYXN0U3BlZWQgPSB0aGlzLnNwZWVkLl9sYXN0U3BlZWQ7XG5cbiAgICAgIHlEaWZmID0geVByZXYgLSBicmVha3BvaW50O1xuICAgICAgZGVsdGEgKz0gTWF0aC5yb3VuZCh5RGlmZipsYXN0U3BlZWQqMTAwKSAvIDEwMDtcblxuICAgICAgeURpZmYgPSBicmVha3BvaW50IC0gcG9zWTtcbiAgICAgIGRlbHRhICs9IE1hdGgucm91bmQoeURpZmYqc3BlZWQqMTAwKSAvIDEwMDtcblxuICAgICAgdGhpcy5zcGVlZC5fYnJlYWtwb2ludCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsZXQgeURpZmY7XG4gICAgICBkZWx0YSA9IDA7XG4gICAgICB5RGlmZiA9IHlQcmV2IC0gcG9zWTtcbiAgICAgIGRlbHRhID0gTWF0aC5yb3VuZCh5RGlmZipzcGVlZCoxMDApIC8gMTAwO1xuICAgIH1cblxuICAgIHlOZXcgPSB0UHJldiArIGRlbHRhO1xuXG4gICAgJGVsWzBdLnN0eWxlW3ByZWZpeC5kb20gKyAnVHJhbnNmb3JtJ10gPSBgdHJhbnNsYXRlM2QoMHB4LCAke3lOZXd9cHgsIDApIHRyYW5zbGF0ZVooMCkgc2NhbGUoMSlgO1xuICAgIHRoaXMueVByZXYgPSBwb3NZO1xuICAgIHRoaXMudFByZXYgPSB5TmV3O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBydW5DYWxsYmFja3MocG9zWSkge1xuICAgIHRoaXMudXBkYXRlSGlkZShwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZVRvcChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZU9mZnNldChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZVNwZWVkKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlQ2FsbGJhY2socG9zWSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZUhpZGUocG9zWSkge1xuICAgIHZhciB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLmhpZGUsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy5oaWRlLnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLiRlbC5jc3MoJ2Rpc3BsYXknLCB2YWx1ZSA/ICdub25lJyA6ICdibG9jaycpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVUb3AocG9zWSkge1xuICAgIHZhciB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLnRvcCwgKHZhbHVlKSA9PiB7XG4gICAgICB2YXIgeU9mZnNldCA9IHRoaXMueU9mZnNldDtcbiAgICAgIHRoaXMudG9wLnZhbHVlID0gdmFsdWUgPSB2YWx1ZSArIHlPZmZzZXQ7XG4gICAgICB0aGlzLiRlbC5jc3MoJ3RvcCcsIHZhbHVlICsgJ3B4Jyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZU9mZnNldChwb3NZKSB7XG4gICAgdmFyIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMub2Zmc2V0VG9wLCAodmFsdWUpID0+IHtcbiAgICAgIHZhciB5RGlmZiwgdG9wO1xuICAgICAgeURpZmYgPSB2YWx1ZSAtIHRoaXMueU9mZnNldDtcbiAgICAgIHRoaXMueU9mZnNldCA9IHZhbHVlO1xuICAgICAgdG9wID0gcGFyc2VJbnQodGhpcy4kZWwuY3NzKCd0b3AnKSwgMTApO1xuICAgICAgdGhpcy4kZWwuY3NzKCd0b3AnLCB0b3AgKyB5RGlmZiArICdweCcpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVTcGVlZChwb3NZKSB7XG4gICAgdmFyIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMuc3BlZWQsICh2YWx1ZSwgYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93biwgYWN0dWFsQnJlYWtwb2ludCkgPT4ge1xuICAgICAgdGhpcy5zcGVlZC5fYnJlYWtwb2ludCA9IGFjdHVhbEJyZWFrcG9pbnQ7XG4gICAgICB0aGlzLnNwZWVkLl9sYXN0U3BlZWQgPSB0aGlzLnNwZWVkLnZhbHVlO1xuICAgICAgdGhpcy5zcGVlZC52YWx1ZSA9IHZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVDYWxsYmFjayhwb3NZKSB7XG4gICAgdmFyIHlQcmV2LCAkZWwsIHNlbGY7XG4gICAgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgICRlbCA9IHRoaXMuJGVsO1xuICAgIHNlbGYgPSB0aGlzO1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy51cGRhdGUsICh2YWx1ZSwgYnJlYWtwb2ludCkgPT4ge1xuICAgICAgc2VsZi51cGRhdGUuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0uY2FsbChzZWxmLCAkZWwsIHBvc1ksIHlQcmV2KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIHN0eWxlRWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIHZhciAkZWwsIGNzcywgeU9mZnNldDtcbiAgICB2YXIge2NlbnRlciwgdG9wfSA9IG9wdGlvbnM7XG4gICAgeU9mZnNldCA9IHRoaXMueU9mZnNldDtcbiAgICBjc3MgPSB7XG4gICAgICAncG9zaXRpb24nOiAnZml4ZWQnLFxuICAgICAgJ2xlZnQnOiAwLFxuICAgICAgJ3JpZ2h0JzogMCxcbiAgICB9O1xuICAgIGlmIChjZW50ZXIpIHtcbiAgICAgIGNzc1snbWFyZ2luLXJpZ2h0J10gPSAnYXV0byc7XG4gICAgICBjc3NbJ21hcmdpbi1sZWZ0J10gPSAnYXV0byc7XG4gICAgfVxuICAgIGlmICh0b3ApIHtcbiAgICAgIGNzcy50b3AgPSB0b3AgKyB5T2Zmc2V0KydweCc7XG4gICAgfVxuICAgICRlbCA9ICQoc2VsZWN0b3IpO1xuICAgICRlbC5jc3MoY3NzKTtcbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGpRdWVyeSgpIHtcbiAgICAkID0galF1ZXJ5O1xuICAgIGlmICghJCkge1xuICAgICAgdGhyb3cgJ2pRdWVyeSBpcyBub3QgZGVmaW5lZCc7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9QYXJhbGxheEJybycpO1xuIiwiY29uc3Qgc2VsZiA9IG1vZHVsZS5leHBvcnRzO1xuXG5zZWxmLmNhbGxCcmVha3BvaW50cyA9IChwb3NZLCB5UHJldiwgYnJlYWtwb2ludHMsIGNhbGxiYWNrKSA9PiB7XG4gIHZhciBzY3JvbGxpbmdEb3duLCB5RGlmZjtcbiAgc2Nyb2xsaW5nRG93biA9IHlQcmV2IDwgcG9zWTtcbiAgeURpZmYgPSBzY3JvbGxpbmdEb3duID8gcG9zWSAtIHlQcmV2IDogeVByZXYgLSBwb3NZO1xuICBicmVha3BvaW50cyA9IGJyZWFrcG9pbnRzLm1hcChicmVha3BvaW50ID0+IHBhcnNlSW50KGJyZWFrcG9pbnQsIDEwKSk7XG4gIC8vIEB0b2RvIC0gd2UgY291bGQgdXNlIGEgZGlmZmVyZW50IHRlY2huaXF1ZSBidXQgdGhpcyBvbmUgd29ya3Mgdy8gbGl0dGxlIGFwYXJlbnQgZG93bnNpZGVzLlxuICBmb3IgKGxldCBpPTA7IGk8eURpZmY7IGkrKykge1xuICAgIGxldCBwb3MsIGluZGV4O1xuICAgIHBvcyA9IHNjcm9sbGluZ0Rvd24gPyB5UHJldiArIGkgOiB5UHJldiAtIGk7XG4gICAgaW5kZXggPSBicmVha3BvaW50cy5pbmRleE9mKHBvcyk7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIGxldCBpID0gc2Nyb2xsaW5nRG93biA/IGluZGV4IDogaW5kZXggLSAxO1xuICAgICAgY2FsbGJhY2suY2FsbChudWxsLCBicmVha3BvaW50c1tpXSwgc2Nyb2xsaW5nRG93biwgYnJlYWtwb2ludHNbaW5kZXhdKTtcbiAgICB9XG4gIH1cbn1cblxuc2VsZi5ydW5VcGRhdGUgPSAocG9zWSwgeVByZXYsIG9iaiwgY2FsbGJhY2spID0+IHtcbiAgdmFyIGJyZWFrcG9pbnRzID0gT2JqZWN0LmtleXMob2JqLmJyZWFrcG9pbnRzKTtcblxuICAvLyBDYWxsIG9uIGluaXQuXG4gIGlmICh5UHJldiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIHZhbHVlID0gb2JqLmJyZWFrcG9pbnRzW3Bvc1ldO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKG51bGwsIHZhbHVlLCBwb3NZLCB0cnVlKTtcbiAgICB9XG4gIH1cbiAgc2VsZi5jYWxsQnJlYWtwb2ludHMocG9zWSwgeVByZXYsIGJyZWFrcG9pbnRzLCAoYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93biwgYWN0dWFsQnJlYWtwb2ludCkgPT4ge1xuICAgIHZhciB2YWx1ZSA9IG9iai5icmVha3BvaW50c1ticmVha3BvaW50XTtcbiAgICBjYWxsYmFjay5jYWxsKG51bGwsIHZhbHVlLCBicmVha3BvaW50LCBzY3JvbGxpbmdEb3duLCBhY3R1YWxCcmVha3BvaW50KTtcbiAgfSk7XG59XG5cbnNlbGYubm9ybWFsaXplT3B0aW9ucyA9IChvcHRpb25zLCBkZWZhdWx0cykgPT4ge1xuICB2YXIga2V5cztcblxuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICBrZXlzID0gT2JqZWN0LmtleXMob3B0aW9ucyk7XG5cbiAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgdmFyIHZhbHVlLCBpc09iamVjdDtcbiAgICB2YWx1ZSA9IG9wdGlvbnNba2V5XTtcbiAgICBpc09iamVjdCA9IHNlbGYuaXNUeXBlKHZhbHVlLCAnb2JqZWN0Jyk7XG4gICAgaWYgKGlzT2JqZWN0KSB7XG4gICAgICBsZXQgdmFsdWUxID0gdmFsdWUgJiYgdmFsdWVbJzAnXSA/IHZhbHVlWycwJ10gOiBkZWZhdWx0c1trZXldLnZhbHVlO1xuICAgICAgZGVsZXRlIHZhbHVlLnZhbHVlO1xuICAgICAgb3B0aW9uc1trZXldID0ge1xuICAgICAgICB2YWx1ZTogdmFsdWUxLFxuICAgICAgICBicmVha3BvaW50czogT2JqZWN0LmFzc2lnbih7fSwgezA6IHZhbHVlMX0sIHZhbHVlKSxcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBvcHRpb25zW2tleV0gPSB7XG4gICAgICAgIHZhbHVlLFxuICAgICAgICBicmVha3BvaW50czogezA6IHZhbHVlfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvcHRpb25zO1xufVxuXG4vKipcbiAqIEdpdmVuIGEgTWl4ZWQgdmFsdWUgdHlwZSBjaGVjay5cbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlLlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWMuXG4gKiBAdGVzdHMgdW5pdC5cbiAqL1xuc2VsZi5pc1R5cGUgPSAodmFsdWUsIHR5cGUpID0+IHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBOdW1iZXIuaXNOYU4odmFsdWUpID09PSBmYWxzZTtcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSB8fCB2YWx1ZSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnYXJyYXknOlxuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnbnVsbCc6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGw7XG4gICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJztcbiAgICBjYXNlICdOYU4nOlxuICAgICAgcmV0dXJuIE51bWJlci5pc05hTih2YWx1ZSk7XG4gICAgY2FzZSAnZGF0ZSc6XG4gICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucmVjZ29uaXplZCB0eXBlOiBcIiR7dHlwZX1cImApO1xuICB9XG59O1xuXG5zZWxmLnByZWZpeCA9ICgpID0+IHtcbiAgdmFyIHN0eWxlcywgcHJlLCBkb207XG4gIHN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgJycpLFxuICAgIHByZSA9IChBcnJheS5wcm90b3R5cGUuc2xpY2VcbiAgICAgIC5jYWxsKHN0eWxlcylcbiAgICAgIC5qb2luKCcnKVxuICAgICAgLm1hdGNoKC8tKG1venx3ZWJraXR8bXMpLS8pIHx8IChzdHlsZXMuT0xpbmsgPT09ICcnICYmIFsnJywgJ28nXSlcbiAgICApWzFdLFxuICAgIGRvbSA9ICgnd2Via2l0fE1venxNU3xPJykubWF0Y2gobmV3IFJlZ0V4cCgnKCcgKyBwcmUgKyAnKScsICdpJykpWzFdO1xuICAgIHJldHVybiB7XG4gICAgICBkb206IGRvbSxcbiAgICAgIGxvd2VyY2FzZTogcHJlLFxuICAgICAgY3NzOiAnLScgKyBwcmUgKyAnLScsXG4gICAgICBqczogcHJlWzBdLnRvVXBwZXJDYXNlKCkgKyBwcmUuc3Vic3RyKDEpXG4gICAgfTtcbn07XG4iXX0=
