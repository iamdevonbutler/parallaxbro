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

      var selectors, top, center, height;
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
      this.updateZindex(posY);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvUGFyYWxsYXhCcm8uanMiLCJsaWIvUGFyYWxsYXhDb2xsZWN0aW9uLmpzIiwibGliL1BhcmFsbGF4RWxlbWVudC5qcyIsImxpYi9pbmRleC5qcyIsImxpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0FBLElBQU0scUJBQXFCLFFBQVEsc0JBQVIsQ0FBM0I7O0FBRUEsSUFBSSxDQUFKOztBQUVBLE9BQU8sT0FBUDs7QUFFRTs7O0FBR0Esc0JBQVksUUFBWixFQUFnRDtBQUFBLFFBQTFCLE1BQTBCLHVFQUFqQixNQUFpQjtBQUFBLFFBQVQsT0FBUzs7QUFBQTs7QUFBQSw2QkFDdEIsS0FBSyxpQkFBTCxDQUF1QixPQUF2QixDQURzQjtBQUFBLFFBQ3ZDLGFBRHVDLHNCQUN2QyxhQUR1Qzs7QUFHOUMsU0FBSyxXQUFMLEdBQW1CLEVBQW5COztBQUVBLFFBQUksQ0FBQyxRQUFMLEVBQWU7QUFDYixZQUFNLGdEQUFOO0FBQ0Q7O0FBRUQsU0FBSyxPQUFMO0FBQ0EsU0FBSyxpQkFBTCxDQUF1QixRQUF2QjtBQUNBLFNBQUssV0FBTDtBQUNBLFFBQUksQ0FBQyxhQUFMLEVBQW9CO0FBQ2xCLFdBQUssU0FBTCxDQUFlLE1BQWY7QUFDRDs7QUFFRCxTQUFLLGdCQUFMO0FBQ0Q7O0FBRUQ7Ozs7OztBQXhCRjtBQUFBO0FBQUEsa0NBNEJnQixRQTVCaEIsRUE0QjBCLE9BNUIxQixFQTRCbUM7QUFDL0IsVUFBSSxVQUFKO0FBQ0EsbUJBQWEsSUFBSSxrQkFBSixDQUF1QixRQUF2QixFQUFpQyxPQUFqQyxDQUFiO0FBQ0EsV0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLFVBQXRCO0FBQ0EsYUFBTyxVQUFQO0FBQ0Q7QUFqQ0g7QUFBQTtBQUFBLHVDQW1DcUI7QUFBQTs7QUFDakIsaUJBQVc7QUFBQSxlQUFNLE1BQUssYUFBTCxDQUFtQixDQUFuQixD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LGFBQU8sT0FBTyxTQUFQLENBQWlCLFFBQWpCLENBQTBCLElBQTFCLENBQStCLEtBQS9CLE1BQTBDLG1CQUFqRDtBQUNGLFNBQUssUUFBTDtBQUNFLGFBQU8sUUFBTyxLQUFQLHlDQUFPLEtBQVAsT0FBaUIsUUFBeEI7QUFDRixTQUFLLEtBQUw7QUFDRSxhQUFPLE9BQU8sS0FBUCxDQUFhLEtBQWIsQ0FBUDtBQUNGLFNBQUssTUFBTDtBQUNFLGFBQU8saUJBQWlCLElBQXhCO0FBQ0Y7QUFDRSxZQUFNLElBQUksS0FBSiwwQkFBaUMsSUFBakMsT0FBTjtBQXhCSjtBQTBCRCxDQTNCRDs7QUE2QkEsS0FBSyxNQUFMLEdBQWMsWUFBTTtBQUNsQixNQUFJLE1BQUosRUFBWSxHQUFaLEVBQWlCLEdBQWpCO0FBQ0EsV0FBUyxPQUFPLGdCQUFQLENBQXdCLFNBQVMsZUFBakMsRUFBa0QsRUFBbEQsQ0FBVCxFQUNFLE1BQU0sQ0FBQyxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FDSixJQURJLENBQ0MsTUFERCxFQUVKLElBRkksQ0FFQyxFQUZELEVBR0osS0FISSxDQUdFLG1CQUhGLEtBRzJCLE9BQU8sS0FBUCxLQUFpQixFQUFqQixJQUF1QixDQUFDLEVBQUQsRUFBSyxHQUFMLENBSG5ELEVBSUosQ0FKSSxDQURSLEVBTUUsTUFBTyxpQkFBRCxDQUFvQixLQUFwQixDQUEwQixJQUFJLE1BQUosQ0FBVyxNQUFNLEdBQU4sR0FBWSxHQUF2QixFQUE0QixHQUE1QixDQUExQixFQUE0RCxDQUE1RCxDQU5SO0FBT0UsU0FBTztBQUNMLFNBQUssR0FEQTtBQUVMLGVBQVcsR0FGTjtBQUdMLFNBQUssTUFBTSxHQUFOLEdBQVksR0FIWjtBQUlMLFFBQUksSUFBSSxDQUFKLEVBQU8sV0FBUCxLQUF1QixJQUFJLE1BQUosQ0FBVyxDQUFYO0FBSnRCLEdBQVA7QUFNSCxDQWZEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IFBhcmFsbGF4Q29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vUGFyYWxsYXhDb2xsZWN0aW9uJyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsYXhCcm8ge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2VsZWN0b3IsIGhlaWdodCA9ICcxMDAlJywgb3B0aW9ucykge1xuICAgIGNvbnN0IHtkaXNhYmxlU3R5bGVzfSA9IHRoaXMuX25vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbGxlY3Rpb25zID0gW107XG5cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICB0aHJvdyAnWW91IG11c3QgcGFzcyBhIHNlbGVjdG9yIHN0cmluZyB0byBQYXJhbGF4QnJvLic7XG4gICAgfVxuXG4gICAgdGhpcy5falF1ZXJ5KCk7XG4gICAgdGhpcy5fY2FjaGVET01FbGVtZW50cyhzZWxlY3Rvcik7XG4gICAgdGhpcy5fYmluZEV2ZW50cygpO1xuICAgIGlmICghZGlzYWJsZVN0eWxlcykge1xuICAgICAgdGhpcy5fc3R5bGVET00oaGVpZ2h0KTtcbiAgICB9XG5cbiAgICB0aGlzLl9oeWRyYXRlRWxlbWVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGFkZENvbGxlY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbjtcbiAgICBjb2xsZWN0aW9uID0gbmV3IFBhcmFsbGF4Q29sbGVjdGlvbihzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgdGhpcy5jb2xsZWN0aW9ucy5wdXNoKGNvbGxlY3Rpb24pO1xuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgX2h5ZHJhdGVFbGVtZW50cygpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuX21vdmVFbGVtZW50cygwKSAsMClcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gd3JhcHBlclxuICAgKi9cbiAgX2NhY2hlRE9NRWxlbWVudHMod3JhcHBlcikge1xuICAgIHRoaXMuJGVsID0ge307XG4gICAgdGhpcy4kZWwud2luID0gJCh3aW5kb3cpO1xuICAgIHRoaXMuJGVsLmRvYyA9ICQoZG9jdW1lbnQpO1xuICAgIHRoaXMuJGVsLmJvZHkgPSAkKCdib2R5Jyk7XG4gICAgdGhpcy4kZWwud3JhcHBlciA9ICQod3JhcHBlcik7XG4gIH1cblxuICBfc3R5bGVET00oaGVpZ2h0KSB7XG4gICAgdmFyIHtib2R5LCB3cmFwcGVyLCBkb2N9ID0gdGhpcy4kZWw7XG4gICAgZG9jLmNoaWxkcmVuKCkuY3NzKCdoZWlnaHQnLCAnMTAwJScpO1xuICAgIGJvZHkuY3NzKCdoZWlnaHQnLCAnMTAwJScpO1xuICAgIHdyYXBwZXIuY3NzKHtcbiAgICAgICdoZWlnaHQnOiBoZWlnaHQsXG4gICAgICAnb3ZlcmZsb3cnOiAndmlzaWJsZScsXG4gICAgICAnbWluLWhlaWdodCc6ICcxMDAlJyxcbiAgICAgICdib3gtc2l6aW5nJzogJ2JvcmRlci1ib3gnLFxuICAgIH0pO1xuICAgIHdyYXBwZXIuYWRkQ2xhc3MoJ3BhcmFsYXhicm8nKTtcbiAgfVxuXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IHRyYWNrID0gKCkgPT4ge1xuICAgICAgdmFyIHBvc1kgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICB0aGlzLl9tb3ZlRWxlbWVudHMocG9zWSk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodHJhY2spO1xuICAgIH1cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodHJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBfbW92ZUVsZW1lbnRzKHBvc1kpIHtcbiAgICB2YXIgY29sbGVjdGlvbnM7XG4gICAgY29sbGVjdGlvbnMgPSB0aGlzLmNvbGxlY3Rpb25zO1xuICAgIGNvbGxlY3Rpb25zLmZvckVhY2goY29sbGVjdGlvbiA9PiBjb2xsZWN0aW9uLm1vdmVFbGVtZW50cyhwb3NZKSk7XG4gIH1cblxuICBfalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gIH1cblxuICBfbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgIHdyYXBwZXI6ICcjcGFyYWxsYXgnLFxuICAgICAgZGlzYWJsZVN0eWxlczogZmFsc2UsXG4gICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICB9LCBvcHRpb25zKTtcbiAgfVxuXG59XG4iLCJjb25zdCB7bm9ybWFsaXplT3B0aW9ucywgcnVuVXBkYXRlfSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbmNvbnN0IFBhcmFsbGF4RWxlbWVudCA9IHJlcXVpcmUoJy4vUGFyYWxsYXhFbGVtZW50Jyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsbGF4Q29sbGVjdGlvbiB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zLCB7XG4gICAgICB0b3A6IHt2YWx1ZTogMH0sXG4gICAgICBoaWRlOiB7dmFsdWU6IGZhbHNlfSxcbiAgICAgIHpJbmRleDoge3ZhbHVlOiAtMX0sXG4gICAgICBjZW50ZXI6IHt2YWx1ZTogZmFsc2V9LFxuICAgICAgdXBkYXRlOiB7dmFsdWU6ICgpID0+IHt9fSxcbiAgICB9KTtcbiAgICBjb25zdCB7dG9wLCBoaWRlLCB6SW5kZXgsIGNlbnRlciwgdXBkYXRlfSA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLiRlbDtcbiAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgdGhpcy55UHJldjtcblxuICAgIHRoaXMudG9wID0gdG9wO1xuICAgIHRoaXMuaGlkZSA9IGhpZGU7XG4gICAgdGhpcy56SW5kZXggPSB6SW5kZXg7XG4gICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XG4gICAgdGhpcy51cGRhdGUgPSB1cGRhdGU7XG5cbiAgICB0aGlzLmpRdWVyeSgpO1xuICAgIHRoaXMuc3R5bGVDb2xsZWN0aW9uKHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAqL1xuICBhZGRFbGVtZW50cyhvYmopIHtcbiAgICB2YXIgc2VsZWN0b3JzLCB0b3AsIGNlbnRlciwgaGVpZ2h0O1xuICAgIHNlbGVjdG9ycyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgaGVpZ2h0ID0gMDtcbiAgICBzZWxlY3RvcnMuZm9yRWFjaChzZWxlY3RvciA9PiB7XG4gICAgICB2YXIgb3B0aW9ucyA9IG9ialtzZWxlY3Rvcl07XG4gICAgICB0aGlzLl9hZGRFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICAgIGhlaWdodCArPSAkKHNlbGVjdG9yKS5vdXRlckhlaWdodCgpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgX2FkZEVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgZWxlbWVudDtcbiAgICBlbGVtZW50ID0gbmV3IFBhcmFsbGF4RWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucywgdGhpcy50b3ApO1xuICAgIHRoaXMuZWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgbW92ZUVsZW1lbnRzKHBvc1kpIHtcbiAgICB2YXIgZWxlbWVudHM7XG4gICAgZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzO1xuICAgIHRoaXMucnVuQ2FsbGJhY2tzKHBvc1kpO1xuICAgIGVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiBlbGVtZW50Lm1vdmVFbGVtZW50KHBvc1kpKTtcbiAgICB0aGlzLnlQcmV2ID0gcG9zWTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgcnVuQ2FsbGJhY2tzKHBvc1kpIHtcbiAgICB0aGlzLnVwZGF0ZUhpZGUocG9zWSk7XG4gICAgdGhpcy51cGRhdGVaaW5kZXgocG9zWSk7XG4gICAgdGhpcy51cGRhdGVDZW50ZXIocG9zWSk7XG4gICAgdGhpcy51cGRhdGVDYWxsYmFjayhwb3NZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlSGlkZShwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuaGlkZSwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLmhpZGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuJGVsLmNzcygnb3BhY2l0eScsIHZhbHVlID8gMCA6IDEpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVaaW5kZXgocG9zWSkge1xuICAgIHZhciBwcmV2WSA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHByZXZZLCB0aGlzLnpJbmRleCwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLnpJbmRleC52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy4kZWwuY3NzKCd6SW5kZXgnLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZUNlbnRlcihwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuY2VudGVyLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuY2VudGVyLnZhbHVlID0gdmFsdWU7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy4kZWwuY3NzKHtcbiAgICAgICAgICAnbWFyZ2luLXJpZ2h0JzogJ2F1dG8nLFxuICAgICAgICAgICdtYXJnaW4tbGVmdCc6ICdhdXRvJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy4kZWwuY3NzKHtcbiAgICAgICAgICAnbWFyZ2luLXJpZ2h0JzogJ2luaGVyaXQnLFxuICAgICAgICAgICdtYXJnaW4tbGVmdCc6ICdpbmhlcml0JyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZUNhbGxiYWNrKHBvc1kpIHtcbiAgICB2YXIgeVByZXYsICRlbCwgc2VsZjtcbiAgICB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgJGVsID0gdGhpcy4kZWw7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLnVwZGF0ZSwgKHZhbHVlLCBicmVha3BvaW50KSA9PiB7XG4gICAgICBzZWxmLnVwZGF0ZS5icmVha3BvaW50c1ticmVha3BvaW50XS5jYWxsKHNlbGYsICRlbCwgcG9zWSwgeVByZXYpO1xuICAgIH0pO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBzdHlsZUNvbGxlY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgJGVsLCBjc3M7XG4gICAgdmFyIHtjZW50ZXIsIHpJbmRleCwgaGlkZX0gPSBvcHRpb25zO1xuICAgIGNzcyA9IHt9O1xuICAgIGNzcy56SW5kZXggPSB6SW5kZXgudmFsdWU7XG4gICAgaWYgKGNlbnRlci52YWx1ZSkge1xuICAgICAgY3NzWydtYXJnaW4tcmlnaHQnXSA9ICdhdXRvJztcbiAgICAgIGNzc1snbWFyZ2luLWxlZnQnXSA9ICdhdXRvJztcbiAgICB9XG4gICAgaWYgKGhpZGUudmFsdWUpIHtcbiAgICAgIGNzcy5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cbiAgICAkZWwgPSAkKHNlbGVjdG9yKTtcbiAgICAkZWwuY3NzKGNzcyk7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxufVxuIiwiY29uc3Qge3ByZWZpeCwgbm9ybWFsaXplT3B0aW9ucywgcnVuVXBkYXRlfSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxsYXhFbGVtZW50IHtcblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvZmZzZXRUb3BcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBvcHRpb25zLCBvZmZzZXRUb3ApIHtcbiAgICBvcHRpb25zID0gbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zLCB7XG4gICAgICB0b3A6IHt2YWx1ZTogMH0sXG4gICAgICBoaWRlOiB7dmFsdWU6IGZhbHNlfSxcbiAgICAgIHpJbmRleDoge3ZhbHVlOiAtMX0sXG4gICAgICBzcGVlZDoge3ZhbHVlOiAxfSxcbiAgICAgIGNlbnRlcjoge3ZhbHVlOiBmYWxzZX0sXG4gICAgICB1cGRhdGU6IHt2YWx1ZTogKCkgPT4ge319LFxuICAgIH0pO1xuICAgIGNvbnN0IHt0b3AsIGhpZGUsIHpJbmRleCwgc3BlZWQsIGNlbnRlciwgdXBkYXRlfSA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLiRlbDtcbiAgICB0aGlzLnByZWZpeCA9IHByZWZpeCgpO1xuICAgIHRoaXMub2Zmc2V0VG9wID0gb2Zmc2V0VG9wO1xuICAgIHRoaXMueU9mZnNldCA9IG9mZnNldFRvcC52YWx1ZTtcbiAgICB0aGlzLnlQcmV2O1xuICAgIHRoaXMudFByZXY7XG5cbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLmhpZGUgPSBoaWRlO1xuICAgIHRoaXMuekluZGV4ID0gekluZGV4O1xuICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcbiAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcbiAgICB0aGlzLnVwZGF0ZSA9IHVwZGF0ZTtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5zdHlsZUVsZW1lbnQoc2VsZWN0b3IsIHtjZW50ZXIsIHRvcH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBtb3ZlRWxlbWVudChwb3NZKSB7XG4gICAgdmFyICRlbCwgeVByZXYsIHRQcmV2LCB5TmV3LCBzcGVlZCwgYnJlYWtwb2ludCwgcHJldkJyZWFrcG9pbnQsIGRlbHRhLCBwcmVmaXg7XG5cbiAgICB0aGlzLnJ1bkNhbGxiYWNrcyhwb3NZKTtcblxuICAgIHlQcmV2ID0gdGhpcy55UHJldiB8fCAwO1xuICAgIHRQcmV2ID0gdGhpcy50UHJldiB8fCAwO1xuICAgIHByZWZpeCA9IHRoaXMucHJlZml4O1xuICAgICRlbCA9IHRoaXMuJGVsO1xuICAgIHNwZWVkID0gdGhpcy5zcGVlZC52YWx1ZTtcbiAgICBicmVha3BvaW50ID0gdGhpcy5zcGVlZC5fYnJlYWtwb2ludDtcblxuICAgIGlmIChicmVha3BvaW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGxldCBsYXN0U3BlZWQsIHlEaWZmO1xuICAgICAgZGVsdGEgPSAwO1xuICAgICAgbGFzdFNwZWVkID0gdGhpcy5zcGVlZC5fbGFzdFNwZWVkO1xuXG4gICAgICB5RGlmZiA9IHlQcmV2IC0gYnJlYWtwb2ludDtcbiAgICAgIGRlbHRhICs9IE1hdGgucm91bmQoeURpZmYqbGFzdFNwZWVkKjEwMCkgLyAxMDA7XG5cbiAgICAgIHlEaWZmID0gYnJlYWtwb2ludCAtIHBvc1k7XG4gICAgICBkZWx0YSArPSBNYXRoLnJvdW5kKHlEaWZmKnNwZWVkKjEwMCkgLyAxMDA7XG5cbiAgICAgIHRoaXMuc3BlZWQuX2JyZWFrcG9pbnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IHlEaWZmO1xuICAgICAgZGVsdGEgPSAwO1xuICAgICAgeURpZmYgPSB5UHJldiAtIHBvc1k7XG4gICAgICBkZWx0YSA9IE1hdGgucm91bmQoeURpZmYqc3BlZWQqMTAwKSAvIDEwMDtcbiAgICB9XG5cbiAgICB5TmV3ID0gdFByZXYgKyBkZWx0YTtcblxuICAgICRlbFswXS5zdHlsZVtwcmVmaXguZG9tICsgJ1RyYW5zZm9ybSddID0gYHRyYW5zbGF0ZTNkKDBweCwgJHt5TmV3fXB4LCAwKSB0cmFuc2xhdGVaKDApIHNjYWxlKDEpYDtcbiAgICB0aGlzLnlQcmV2ID0gcG9zWTtcbiAgICB0aGlzLnRQcmV2ID0geU5ldztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgcnVuQ2FsbGJhY2tzKHBvc1kpIHtcbiAgICB0aGlzLnVwZGF0ZUhpZGUocG9zWSk7XG4gICAgdGhpcy51cGRhdGVaaW5kZXgocG9zWSk7XG4gICAgdGhpcy51cGRhdGVUb3AocG9zWSk7XG4gICAgdGhpcy51cGRhdGVPZmZzZXQocG9zWSk7XG4gICAgdGhpcy51cGRhdGVTcGVlZChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZUNhbGxiYWNrKHBvc1kpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVIaWRlKHBvc1kpIHtcbiAgICB2YXIgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy5oaWRlLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuaGlkZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy4kZWwuY3NzKCdkaXNwbGF5JywgdmFsdWUgPyAnbm9uZScgOiAnYmxvY2snKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZVppbmRleChwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuekluZGV4LCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuekluZGV4LnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLiRlbC5jc3MoJ3pJbmRleCcsIHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlVG9wKHBvc1kpIHtcbiAgICB2YXIgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy50b3AsICh2YWx1ZSkgPT4ge1xuICAgICAgdmFyIHlPZmZzZXQgPSB0aGlzLnlPZmZzZXQ7XG4gICAgICB0aGlzLnRvcC52YWx1ZSA9IHZhbHVlID0gdmFsdWUgKyB5T2Zmc2V0O1xuICAgICAgdGhpcy4kZWwuY3NzKCd0b3AnLCB2YWx1ZSArICdweCcpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVPZmZzZXQocG9zWSkge1xuICAgIHZhciB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLm9mZnNldFRvcCwgKHZhbHVlKSA9PiB7XG4gICAgICB2YXIgeURpZmYsIHRvcDtcbiAgICAgIHlEaWZmID0gdmFsdWUgLSB0aGlzLnlPZmZzZXQ7XG4gICAgICB0aGlzLnlPZmZzZXQgPSB2YWx1ZTtcbiAgICAgIHRvcCA9IHBhcnNlSW50KHRoaXMuJGVsLmNzcygndG9wJyksIDEwKTtcbiAgICAgIHRoaXMuJGVsLmNzcygndG9wJywgdG9wICsgeURpZmYgKyAncHgnKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlU3BlZWQocG9zWSkge1xuICAgIHZhciB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLnNwZWVkLCAodmFsdWUsIGJyZWFrcG9pbnQsIHNjcm9sbGluZ0Rvd24sIGFjdHVhbEJyZWFrcG9pbnQpID0+IHtcbiAgICAgIHRoaXMuc3BlZWQuX2JyZWFrcG9pbnQgPSBhY3R1YWxCcmVha3BvaW50O1xuICAgICAgdGhpcy5zcGVlZC5fbGFzdFNwZWVkID0gdGhpcy5zcGVlZC52YWx1ZTtcbiAgICAgIHRoaXMuc3BlZWQudmFsdWUgPSB2YWx1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlQ2FsbGJhY2socG9zWSkge1xuICAgIHZhciB5UHJldiwgJGVsLCBzZWxmO1xuICAgIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICAkZWwgPSB0aGlzLiRlbDtcbiAgICBzZWxmID0gdGhpcztcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMudXBkYXRlLCAodmFsdWUsIGJyZWFrcG9pbnQpID0+IHtcbiAgICAgIHNlbGYudXBkYXRlLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdLmNhbGwoc2VsZiwgJGVsLCBwb3NZLCB5UHJldik7XG4gICAgfSk7XG4gIH1cblxuICBqUXVlcnkoKSB7XG4gICAgJCA9IGpRdWVyeTtcbiAgICBpZiAoISQpIHtcbiAgICAgIHRocm93ICdqUXVlcnkgaXMgbm90IGRlZmluZWQnO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIHN0eWxlRWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIHZhciAkZWwsIGNzcywgeU9mZnNldDtcbiAgICB2YXIge2NlbnRlciwgdG9wfSA9IG9wdGlvbnM7XG4gICAgeU9mZnNldCA9IHRoaXMueU9mZnNldDtcbiAgICBjc3MgPSB7XG4gICAgICAncG9zaXRpb24nOiAnZml4ZWQnLFxuICAgICAgJ2xlZnQnOiAwLFxuICAgICAgJ3JpZ2h0JzogMCxcbiAgICB9O1xuICAgIGlmIChjZW50ZXIudmFsdWUpIHtcbiAgICAgIGNzc1snbWFyZ2luLXJpZ2h0J10gPSAnYXV0byc7XG4gICAgICBjc3NbJ21hcmdpbi1sZWZ0J10gPSAnYXV0byc7XG4gICAgfVxuICAgIGlmICh0b3AudmFsdWUpIHtcbiAgICAgIGNzcy50b3AgPSB0b3AgKyB5T2Zmc2V0ICsgJ3B4JztcbiAgICB9XG4gICAgJGVsID0gJChzZWxlY3Rvcik7XG4gICAgJGVsLmNzcyhjc3MpO1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9QYXJhbGxheEJybycpO1xuIiwiY29uc3Qgc2VsZiA9IG1vZHVsZS5leHBvcnRzO1xuXG5zZWxmLmNhbGxCcmVha3BvaW50cyA9IChwb3NZLCB5UHJldiwgYnJlYWtwb2ludHMsIGNhbGxiYWNrKSA9PiB7XG4gIHZhciBzY3JvbGxpbmdEb3duLCB5RGlmZjtcbiAgc2Nyb2xsaW5nRG93biA9IHlQcmV2IDwgcG9zWTtcbiAgeURpZmYgPSBzY3JvbGxpbmdEb3duID8gcG9zWSAtIHlQcmV2IDogeVByZXYgLSBwb3NZO1xuICBicmVha3BvaW50cyA9IGJyZWFrcG9pbnRzLm1hcChicmVha3BvaW50ID0+IHBhcnNlSW50KGJyZWFrcG9pbnQsIDEwKSk7XG4gIC8vIEB0b2RvIC0gd2UgY291bGQgdXNlIGEgZGlmZmVyZW50IHRlY2huaXF1ZSBidXQgdGhpcyBvbmUgd29ya3Mgdy8gbGl0dGxlIGFwYXJlbnQgZG93bnNpZGVzLlxuICBmb3IgKGxldCBpPTA7IGk8eURpZmY7IGkrKykge1xuICAgIGxldCBwb3MsIGluZGV4O1xuICAgIHBvcyA9IHNjcm9sbGluZ0Rvd24gPyB5UHJldiArIGkgOiB5UHJldiAtIGk7XG4gICAgaW5kZXggPSBicmVha3BvaW50cy5pbmRleE9mKHBvcyk7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIGxldCBpID0gc2Nyb2xsaW5nRG93biA/IGluZGV4IDogaW5kZXggLSAxO1xuICAgICAgY2FsbGJhY2suY2FsbChudWxsLCBicmVha3BvaW50c1tpXSwgc2Nyb2xsaW5nRG93biwgYnJlYWtwb2ludHNbaW5kZXhdKTtcbiAgICB9XG4gIH1cbn1cblxuc2VsZi5ydW5VcGRhdGUgPSAocG9zWSwgeVByZXYsIG9iaiwgY2FsbGJhY2spID0+IHtcbiAgdmFyIGJyZWFrcG9pbnRzID0gT2JqZWN0LmtleXMob2JqLmJyZWFrcG9pbnRzKTtcblxuICAvLyBDYWxsIG9uIGluaXQuXG4gIGlmICh5UHJldiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIHZhbHVlID0gb2JqLmJyZWFrcG9pbnRzW3Bvc1ldO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKG51bGwsIHZhbHVlLCBwb3NZLCB0cnVlKTtcbiAgICB9XG4gIH1cbiAgc2VsZi5jYWxsQnJlYWtwb2ludHMocG9zWSwgeVByZXYsIGJyZWFrcG9pbnRzLCAoYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93biwgYWN0dWFsQnJlYWtwb2ludCkgPT4ge1xuICAgIHZhciB2YWx1ZSA9IG9iai5icmVha3BvaW50c1ticmVha3BvaW50XTtcbiAgICBjYWxsYmFjay5jYWxsKG51bGwsIHZhbHVlLCBicmVha3BvaW50LCBzY3JvbGxpbmdEb3duLCBhY3R1YWxCcmVha3BvaW50KTtcbiAgfSk7XG59XG5cbnNlbGYubm9ybWFsaXplT3B0aW9ucyA9IChvcHRpb25zLCBkZWZhdWx0cykgPT4ge1xuICB2YXIga2V5cztcblxuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICBrZXlzID0gT2JqZWN0LmtleXMob3B0aW9ucyk7XG5cbiAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgdmFyIHZhbHVlLCBpc09iamVjdDtcbiAgICB2YWx1ZSA9IG9wdGlvbnNba2V5XTtcbiAgICBpc09iamVjdCA9IHNlbGYuaXNUeXBlKHZhbHVlLCAnb2JqZWN0Jyk7XG4gICAgaWYgKGlzT2JqZWN0KSB7XG4gICAgICBsZXQgdmFsdWUxID0gdmFsdWUgJiYgdmFsdWVbJzAnXSA/IHZhbHVlWycwJ10gOiBkZWZhdWx0c1trZXldLnZhbHVlO1xuICAgICAgZGVsZXRlIHZhbHVlLnZhbHVlO1xuICAgICAgb3B0aW9uc1trZXldID0ge1xuICAgICAgICB2YWx1ZTogdmFsdWUxLFxuICAgICAgICBicmVha3BvaW50czogT2JqZWN0LmFzc2lnbih7fSwgezA6IHZhbHVlMX0sIHZhbHVlKSxcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBvcHRpb25zW2tleV0gPSB7XG4gICAgICAgIHZhbHVlLFxuICAgICAgICBicmVha3BvaW50czogezA6IHZhbHVlfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvcHRpb25zO1xufVxuXG4vKipcbiAqIEdpdmVuIGEgTWl4ZWQgdmFsdWUgdHlwZSBjaGVjay5cbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlLlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWMuXG4gKiBAdGVzdHMgdW5pdC5cbiAqL1xuc2VsZi5pc1R5cGUgPSAodmFsdWUsIHR5cGUpID0+IHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBOdW1iZXIuaXNOYU4odmFsdWUpID09PSBmYWxzZTtcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSB8fCB2YWx1ZSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnYXJyYXknOlxuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnbnVsbCc6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGw7XG4gICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJztcbiAgICBjYXNlICdOYU4nOlxuICAgICAgcmV0dXJuIE51bWJlci5pc05hTih2YWx1ZSk7XG4gICAgY2FzZSAnZGF0ZSc6XG4gICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucmVjZ29uaXplZCB0eXBlOiBcIiR7dHlwZX1cImApO1xuICB9XG59O1xuXG5zZWxmLnByZWZpeCA9ICgpID0+IHtcbiAgdmFyIHN0eWxlcywgcHJlLCBkb207XG4gIHN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgJycpLFxuICAgIHByZSA9IChBcnJheS5wcm90b3R5cGUuc2xpY2VcbiAgICAgIC5jYWxsKHN0eWxlcylcbiAgICAgIC5qb2luKCcnKVxuICAgICAgLm1hdGNoKC8tKG1venx3ZWJraXR8bXMpLS8pIHx8IChzdHlsZXMuT0xpbmsgPT09ICcnICYmIFsnJywgJ28nXSlcbiAgICApWzFdLFxuICAgIGRvbSA9ICgnd2Via2l0fE1venxNU3xPJykubWF0Y2gobmV3IFJlZ0V4cCgnKCcgKyBwcmUgKyAnKScsICdpJykpWzFdO1xuICAgIHJldHVybiB7XG4gICAgICBkb206IGRvbSxcbiAgICAgIGxvd2VyY2FzZTogcHJlLFxuICAgICAgY3NzOiAnLScgKyBwcmUgKyAnLScsXG4gICAgICBqczogcHJlWzBdLnRvVXBwZXJDYXNlKCkgKyBwcmUuc3Vic3RyKDEpXG4gICAgfTtcbn07XG4iXX0=
