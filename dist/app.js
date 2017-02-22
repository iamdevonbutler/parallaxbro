(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var ParallaxBro = require('../lib');

var laxbro = new ParallaxBro('#parallax', 2000);

var c1 = laxbro.addCollection('#collection1', {
  hide: true
});

c1.addElements({
  '[src="images/intro.jpg"]': {
    top: 200,
    center: true,
    speed: .6
  },
  '[src="images/splatter-intro1.jpg"]': {
    top: 800,
    center: true,
    speed: .8,
    zIndex: -2
  }
});

var c2 = laxbro.addCollection('#collection2', {
  center: true
});

c2.addElements({
  '[src="images/project-launch.jpg"]': {
    zIndex: 1,
    speed: 1.5,
    top: 600
  },
  '[src="images/splatter-projectlaunch-1.jpg"]': {
    speed: 1

  },
  '[src="images/splatter-projectlaunch-3.png"]': {
    speed: 1
  }
});

},{"../lib":5}],2:[function(require,module,exports){
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

},{"./ParallaxCollection":3}],3:[function(require,module,exports){
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

},{"./ParallaxElement":4,"./utils":6}],4:[function(require,module,exports){
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

},{"./utils":6}],5:[function(require,module,exports){
'use strict';

module.exports = require('./ParallaxBro');

},{"./ParallaxBro":2}],6:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmpzIiwibGliL1BhcmFsbGF4QnJvLmpzIiwibGliL1BhcmFsbGF4Q29sbGVjdGlvbi5qcyIsImxpYi9QYXJhbGxheEVsZW1lbnQuanMiLCJsaWIvaW5kZXguanMiLCJsaWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQU0sY0FBYyxRQUFRLFFBQVIsQ0FBcEI7O0FBRUEsSUFBTSxTQUFTLElBQUksV0FBSixDQUFnQixXQUFoQixFQUE2QixJQUE3QixDQUFmOztBQUdBLElBQU0sS0FBSyxPQUFPLGFBQVAsQ0FBcUIsY0FBckIsRUFBcUM7QUFDOUMsUUFBTTtBQUR3QyxDQUFyQyxDQUFYOztBQUlBLEdBQUcsV0FBSCxDQUFlO0FBQ2IsOEJBQTRCO0FBQzFCLFNBQUssR0FEcUI7QUFFMUIsWUFBUSxJQUZrQjtBQUcxQixXQUFPO0FBSG1CLEdBRGY7QUFNYix3Q0FBc0M7QUFDcEMsU0FBSyxHQUQrQjtBQUVwQyxZQUFRLElBRjRCO0FBR3BDLFdBQU8sRUFINkI7QUFJcEMsWUFBUSxDQUFDO0FBSjJCO0FBTnpCLENBQWY7O0FBY0EsSUFBTSxLQUFLLE9BQU8sYUFBUCxDQUFxQixjQUFyQixFQUFxQztBQUM5QyxVQUFRO0FBRHNDLENBQXJDLENBQVg7O0FBSUEsR0FBRyxXQUFILENBQWU7QUFDYix1Q0FBcUM7QUFDbkMsWUFBUSxDQUQyQjtBQUVuQyxXQUFPLEdBRjRCO0FBR25DLFNBQUs7QUFIOEIsR0FEeEI7QUFNYixpREFBK0M7QUFDN0MsV0FBTzs7QUFEc0MsR0FObEM7QUFVYixpREFBK0M7QUFDN0MsV0FBTztBQURzQztBQVZsQyxDQUFmOzs7Ozs7Ozs7QUMzQkEsSUFBTSxxQkFBcUIsUUFBUSxzQkFBUixDQUEzQjs7QUFFQSxJQUFJLENBQUo7O0FBRUEsT0FBTyxPQUFQOztBQUVFOzs7QUFHQSxzQkFBWSxRQUFaLEVBQWdEO0FB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TUUsTUFBTyxpQkFBRCxDQUFvQixLQUFwQixDQUEwQixJQUFJLE1BQUosQ0FBVyxNQUFNLEdBQU4sR0FBWSxHQUF2QixFQUE0QixHQUE1QixDQUExQixFQUE0RCxDQUE1RCxDQU5SO0FBT0UsU0FBTztBQUNMLFNBQUssR0FEQTtBQUVMLGVBQVcsR0FGTjtBQUdMLFNBQUssTUFBTSxHQUFOLEdBQVksR0FIWjtBQUlMLFFBQUksSUFBSSxDQUFKLEVBQU8sV0FBUCxLQUF1QixJQUFJLE1BQUosQ0FBVyxDQUFYO0FBSnRCLEdBQVA7QUFNSCxDQWZEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IFBhcmFsbGF4QnJvID0gcmVxdWlyZSgnLi4vbGliJyk7XG5cbmNvbnN0IGxheGJybyA9IG5ldyBQYXJhbGxheEJybygnI3BhcmFsbGF4JywgMjAwMCk7XG5cblxuY29uc3QgYzEgPSBsYXhicm8uYWRkQ29sbGVjdGlvbignI2NvbGxlY3Rpb24xJywge1xuICBoaWRlOiB0cnVlLFxufSk7XG5cbmMxLmFkZEVsZW1lbnRzKHtcbiAgJ1tzcmM9XCJpbWFnZXMvaW50cm8uanBnXCJdJzoge1xuICAgIHRvcDogMjAwLFxuICAgIGNlbnRlcjogdHJ1ZSxcbiAgICBzcGVlZDogLjYsXG4gIH0sXG4gICdbc3JjPVwiaW1hZ2VzL3NwbGF0dGVyLWludHJvMS5qcGdcIl0nOiB7XG4gICAgdG9wOiA4MDAsXG4gICAgY2VudGVyOiB0cnVlLFxuICAgIHNwZWVkOiAuOCxcbiAgICB6SW5kZXg6IC0yLFxuICB9LFxufSk7XG5cbmNvbnN0IGMyID0gbGF4YnJvLmFkZENvbGxlY3Rpb24oJyNjb2xsZWN0aW9uMicsIHtcbiAgY2VudGVyOiB0cnVlLFxufSk7XG5cbmMyLmFkZEVsZW1lbnRzKHtcbiAgJ1tzcmM9XCJpbWFnZXMvcHJvamVjdC1sYXVuY2guanBnXCJdJzoge1xuICAgIHpJbmRleDogMSxcbiAgICBzcGVlZDogMS41LFxuICAgIHRvcDogNjAwLFxuICB9LFxuICAnW3NyYz1cImltYWdlcy9zcGxhdHRlci1wcm9qZWN0bGF1bmNoLTEuanBnXCJdJzoge1xuICAgIHNwZWVkOiAxLFxuXG4gIH0sXG4gICdbc3JjPVwiaW1hZ2VzL3NwbGF0dGVyLXByb2plY3RsYXVuY2gtMy5wbmdcIl0nOiB7XG4gICAgc3BlZWQ6IDEsXG4gIH0sXG59KTtcbiIsImNvbnN0IFBhcmFsbGF4Q29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vUGFyYWxsYXhDb2xsZWN0aW9uJyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsYXhCcm8ge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2VsZWN0b3IsIGhlaWdodCA9ICcxMDAlJywgb3B0aW9ucykge1xuICAgIGNvbnN0IHtkaXNhYmxlU3R5bGVzfSA9IHRoaXMuX25vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbGxlY3Rpb25zID0gW107XG5cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICB0aHJvdyAnWW91IG11c3QgcGFzcyBhIHNlbGVjdG9yIHN0cmluZyB0byBQYXJhbGF4QnJvLic7XG4gICAgfVxuXG4gICAgdGhpcy5falF1ZXJ5KCk7XG4gICAgdGhpcy5fY2FjaGVET01FbGVtZW50cyhzZWxlY3Rvcik7XG4gICAgdGhpcy5fYmluZEV2ZW50cygpO1xuICAgIGlmICghZGlzYWJsZVN0eWxlcykge1xuICAgICAgdGhpcy5fc3R5bGVET00oaGVpZ2h0KTtcbiAgICB9XG5cbiAgICB0aGlzLl9oeWRyYXRlRWxlbWVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGFkZENvbGxlY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29sbGVjdGlvbjtcbiAgICBjb2xsZWN0aW9uID0gbmV3IFBhcmFsbGF4Q29sbGVjdGlvbihzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgdGhpcy5jb2xsZWN0aW9ucy5wdXNoKGNvbGxlY3Rpb24pO1xuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgX2h5ZHJhdGVFbGVtZW50cygpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuX21vdmVFbGVtZW50cygwKSAsMClcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gd3JhcHBlclxuICAgKi9cbiAgX2NhY2hlRE9NRWxlbWVudHMod3JhcHBlcikge1xuICAgIHRoaXMuJGVsID0ge307XG4gICAgdGhpcy4kZWwud2luID0gJCh3aW5kb3cpO1xuICAgIHRoaXMuJGVsLmRvYyA9ICQoZG9jdW1lbnQpO1xuICAgIHRoaXMuJGVsLmJvZHkgPSAkKCdib2R5Jyk7XG4gICAgdGhpcy4kZWwud3JhcHBlciA9ICQod3JhcHBlcik7XG4gIH1cblxuICBfc3R5bGVET00oaGVpZ2h0KSB7XG4gICAgdmFyIHtib2R5LCB3cmFwcGVyLCBkb2N9ID0gdGhpcy4kZWw7XG4gICAgZG9jLmNoaWxkcmVuKCkuY3NzKCdoZWlnaHQnLCAnMTAwJScpO1xuICAgIGJvZHkuY3NzKCdoZWlnaHQnLCAnMTAwJScpO1xuICAgIHdyYXBwZXIuY3NzKHtcbiAgICAgICdoZWlnaHQnOiBoZWlnaHQsXG4gICAgICAnb3ZlcmZsb3cnOiAndmlzaWJsZScsXG4gICAgICAnbWluLWhlaWdodCc6ICcxMDAlJyxcbiAgICAgICdib3gtc2l6aW5nJzogJ2JvcmRlci1ib3gnLFxuICAgIH0pO1xuICAgIHdyYXBwZXIuYWRkQ2xhc3MoJ3BhcmFsYXhicm8nKTtcbiAgfVxuXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IHRyYWNrID0gKCkgPT4ge1xuICAgICAgdmFyIHBvc1kgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICB0aGlzLl9tb3ZlRWxlbWVudHMocG9zWSk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodHJhY2spO1xuICAgIH1cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodHJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBfbW92ZUVsZW1lbnRzKHBvc1kpIHtcbiAgICB2YXIgY29sbGVjdGlvbnM7XG4gICAgY29sbGVjdGlvbnMgPSB0aGlzLmNvbGxlY3Rpb25zO1xuICAgIGNvbGxlY3Rpb25zLmZvckVhY2goY29sbGVjdGlvbiA9PiBjb2xsZWN0aW9uLm1vdmVFbGVtZW50cyhwb3NZKSk7XG4gIH1cblxuICBfalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gIH1cblxuICBfbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgIHdyYXBwZXI6ICcjcGFyYWxsYXgnLFxuICAgICAgZGlzYWJsZVN0eWxlczogZmFsc2UsXG4gICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICB9LCBvcHRpb25zKTtcbiAgfVxuXG59XG4iLCJjb25zdCB7bm9ybWFsaXplT3B0aW9ucywgcnVuVXBkYXRlfSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbmNvbnN0IFBhcmFsbGF4RWxlbWVudCA9IHJlcXVpcmUoJy4vUGFyYWxsYXhFbGVtZW50Jyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsbGF4Q29sbGVjdGlvbiB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zLCB7XG4gICAgICB0b3A6IHt2YWx1ZTogMH0sXG4gICAgICBoaWRlOiB7dmFsdWU6IGZhbHNlfSxcbiAgICAgIHpJbmRleDoge3ZhbHVlOiAtMX0sXG4gICAgICBjZW50ZXI6IHt2YWx1ZTogZmFsc2V9LFxuICAgICAgdXBkYXRlOiB7dmFsdWU6ICgpID0+IHt9fSxcbiAgICB9KTtcbiAgICBjb25zdCB7dG9wLCBoaWRlLCB6SW5kZXgsIGNlbnRlciwgdXBkYXRlfSA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLiRlbDtcbiAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgdGhpcy55UHJldjtcblxuICAgIHRoaXMudG9wID0gdG9wO1xuICAgIHRoaXMuaGlkZSA9IGhpZGU7XG4gICAgdGhpcy56SW5kZXggPSB6SW5kZXg7XG4gICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XG4gICAgdGhpcy51cGRhdGUgPSB1cGRhdGU7XG5cbiAgICB0aGlzLmpRdWVyeSgpO1xuICAgIHRoaXMuc3R5bGVDb2xsZWN0aW9uKHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAqL1xuICBhZGRFbGVtZW50cyhvYmopIHtcbiAgICB2YXIgc2VsZWN0b3JzLCB0b3AsIGhlaWdodDtcbiAgICBzZWxlY3RvcnMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgIGhlaWdodCA9IDA7XG4gICAgc2VsZWN0b3JzLmZvckVhY2goc2VsZWN0b3IgPT4ge1xuICAgICAgdmFyIG9wdGlvbnMgPSBvYmpbc2VsZWN0b3JdO1xuICAgICAgdGhpcy5fYWRkRWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgICBoZWlnaHQgKz0gJChzZWxlY3Rvcikub3V0ZXJIZWlnaHQoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIF9hZGRFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgdmFyIGVsZW1lbnQ7XG4gICAgZWxlbWVudCA9IG5ldyBQYXJhbGxheEVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMsIHRoaXMudG9wKTtcbiAgICB0aGlzLmVsZW1lbnRzLnB1c2goZWxlbWVudCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIG1vdmVFbGVtZW50cyhwb3NZKSB7XG4gICAgdmFyIGVsZW1lbnRzO1xuICAgIGVsZW1lbnRzID0gdGhpcy5lbGVtZW50cztcbiAgICB0aGlzLnJ1bkNhbGxiYWNrcyhwb3NZKTtcbiAgICBlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4gZWxlbWVudC5tb3ZlRWxlbWVudChwb3NZKSk7XG4gICAgdGhpcy55UHJldiA9IHBvc1k7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHJ1bkNhbGxiYWNrcyhwb3NZKSB7XG4gICAgdGhpcy51cGRhdGVIaWRlKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlWmluZGV4KHBvc1kpO1xuICAgIHRoaXMudXBkYXRlQ2VudGVyKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlQ2FsbGJhY2socG9zWSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZUhpZGUocG9zWSkge1xuICAgIHZhciBwcmV2WSA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHByZXZZLCB0aGlzLmhpZGUsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy5oaWRlLnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLiRlbC5jc3MoJ29wYWNpdHknLCB2YWx1ZSA/IDAgOiAxKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlWmluZGV4KHBvc1kpIHtcbiAgICB2YXIgcHJldlkgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgdGhpcy56SW5kZXgsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy56SW5kZXgudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuJGVsLmNzcygnekluZGV4JywgdmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVDZW50ZXIocG9zWSkge1xuICAgIHZhciB7cHJldlksIGNlbnRlcn0gPSB0aGlzO1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgY2VudGVyLCAodmFsdWUpID0+IHtcbiAgICAgIGNlbnRlci52YWx1ZSA9IHZhbHVlO1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuJGVsLmNzcyh7XG4gICAgICAgICAgJ21hcmdpbi1yaWdodCc6ICdhdXRvJyxcbiAgICAgICAgICAnbWFyZ2luLWxlZnQnOiAnYXV0bycsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuJGVsLmNzcyh7XG4gICAgICAgICAgJ21hcmdpbi1yaWdodCc6ICdpbmhlcml0JyxcbiAgICAgICAgICAnbWFyZ2luLWxlZnQnOiAnaW5oZXJpdCcsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVDYWxsYmFjayhwb3NZKSB7XG4gICAgdmFyIHlQcmV2LCAkZWwsIHNlbGY7XG4gICAgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgICRlbCA9IHRoaXMuJGVsO1xuICAgIHNlbGYgPSB0aGlzO1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy51cGRhdGUsICh2YWx1ZSwgYnJlYWtwb2ludCkgPT4ge1xuICAgICAgc2VsZi51cGRhdGUuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0uY2FsbChzZWxmLCAkZWwsIHBvc1ksIHlQcmV2KTtcbiAgICB9KTtcbiAgfVxuXG4gIGpRdWVyeSgpIHtcbiAgICAkID0galF1ZXJ5O1xuICAgIGlmICghJCkge1xuICAgICAgdGhyb3cgJ2pRdWVyeSBpcyBub3QgZGVmaW5lZCc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgc3R5bGVDb2xsZWN0aW9uKHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgdmFyICRlbCwgY3NzO1xuICAgIHZhciB7Y2VudGVyLCB6SW5kZXgsIGhpZGV9ID0gb3B0aW9ucztcbiAgICBjc3MgPSB7fTtcbiAgICBjc3MuekluZGV4ID0gekluZGV4LnZhbHVlO1xuICAgIGlmIChjZW50ZXIudmFsdWUpIHtcbiAgICAgIGNzc1snbWFyZ2luLXJpZ2h0J10gPSAnYXV0byc7XG4gICAgICBjc3NbJ21hcmdpbi1sZWZ0J10gPSAnYXV0byc7XG4gICAgfVxuICAgIGlmIChoaWRlLnZhbHVlKSB7XG4gICAgICBjc3MuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG4gICAgJGVsID0gJChzZWxlY3Rvcik7XG4gICAgJGVsLmNzcyhjc3MpO1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn1cbiIsImNvbnN0IHtwcmVmaXgsIG5vcm1hbGl6ZU9wdGlvbnMsIHJ1blVwZGF0ZX0gPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsbGF4RWxlbWVudCB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAcGFyYW0ge09iamVjdH0gb2Zmc2V0VG9wXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZWxlY3Rvciwgb3B0aW9ucywgb2Zmc2V0VG9wKSB7XG4gICAgb3B0aW9ucyA9IG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucywge1xuICAgICAgdG9wOiB7dmFsdWU6IDB9LFxuICAgICAgaGlkZToge3ZhbHVlOiBmYWxzZX0sXG4gICAgICB6SW5kZXg6IHt2YWx1ZTogLTF9LFxuICAgICAgc3BlZWQ6IHt2YWx1ZTogMX0sXG4gICAgICBjZW50ZXI6IHt2YWx1ZTogZmFsc2V9LFxuICAgICAgdXBkYXRlOiB7dmFsdWU6ICgpID0+IHt9fSxcbiAgICAgIHhGdW5jOiB7dmFsdWU6IDB9LFxuICAgIH0pO1xuXG5cbiAgICBjb25zdCB7dG9wLCBoaWRlLCB6SW5kZXgsIHNwZWVkLCBjZW50ZXIsIHVwZGF0ZSwgeEZ1bmN9ID0gb3B0aW9ucztcblxuICAgIHRoaXMuJGVsO1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4KCk7XG4gICAgdGhpcy5vZmZzZXRUb3AgPSBvZmZzZXRUb3A7XG4gICAgdGhpcy55T2Zmc2V0ID0gb2Zmc2V0VG9wLnZhbHVlO1xuICAgIHRoaXMueVByZXY7XG4gICAgdGhpcy50UHJldjtcblxuICAgIHRoaXMudG9wID0gdG9wO1xuICAgIHRoaXMuaGlkZSA9IGhpZGU7XG4gICAgdGhpcy56SW5kZXggPSB6SW5kZXg7XG4gICAgdGhpcy5zcGVlZCA9IHNwZWVkO1xuICAgIHRoaXMuY2VudGVyID0gY2VudGVyO1xuICAgIHRoaXMudXBkYXRlID0gdXBkYXRlO1xuICAgIHRoaXMueEZ1bmMgPSB4RnVuYztcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5zdHlsZUVsZW1lbnQoc2VsZWN0b3IsIHtjZW50ZXIsIHRvcH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBtb3ZlRWxlbWVudChwb3NZKSB7XG4gICAgdmFyICRlbCwgeVByZXYsIHRQcmV2LCB5TmV3LCB4TmV3LCB4RnVuYywgZnVuYywgc3BlZWQsIGJyZWFrcG9pbnQsIHByZXZCcmVha3BvaW50LCBkZWx0YSwgcHJlZml4XG5cbiAgICB0aGlzLnJ1bkNhbGxiYWNrcyhwb3NZKTtcblxuICAgIHlQcmV2ID0gdGhpcy55UHJldiB8fCAwO1xuICAgIHRQcmV2ID0gdGhpcy50UHJldiB8fCAwO1xuICAgIHByZWZpeCA9IHRoaXMucHJlZml4O1xuICAgIHhGdW5jID0gdGhpcy54RnVuYztcbiAgICAkZWwgPSB0aGlzLiRlbDtcbiAgICBzcGVlZCA9IHRoaXMuc3BlZWQudmFsdWU7XG4gICAgYnJlYWtwb2ludCA9IHRoaXMuc3BlZWQuX2JyZWFrcG9pbnQ7XG5cbiAgICBpZiAoYnJlYWtwb2ludCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBsZXQgbGFzdFNwZWVkLCB5RGlmZjtcbiAgICAgIGRlbHRhID0gMDtcbiAgICAgIGxhc3RTcGVlZCA9IHRoaXMuc3BlZWQuX2xhc3RTcGVlZDtcblxuICAgICAgeURpZmYgPSB5UHJldiAtIGJyZWFrcG9pbnQ7XG4gICAgICBkZWx0YSArPSBNYXRoLnJvdW5kKHlEaWZmKmxhc3RTcGVlZCoxMDApIC8gMTAwO1xuXG4gICAgICB5RGlmZiA9IGJyZWFrcG9pbnQgLSBwb3NZO1xuICAgICAgZGVsdGEgKz0gTWF0aC5yb3VuZCh5RGlmZipzcGVlZCoxMDApIC8gMTAwO1xuXG4gICAgICB0aGlzLnNwZWVkLl9icmVha3BvaW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxldCB5RGlmZjtcbiAgICAgIGRlbHRhID0gMDtcbiAgICAgIHlEaWZmID0geVByZXYgLSBwb3NZO1xuICAgICAgZGVsdGEgPSBNYXRoLnJvdW5kKHlEaWZmKnNwZWVkKjEwMCkgLyAxMDA7XG4gICAgfVxuXG4gICAgeU5ldyA9IHRQcmV2ICsgZGVsdGE7XG4gICAgZnVuYyA9IHhGdW5jLmJyZWFrcG9pbnRzW3hGdW5jLnZhbHVlXTtcbiAgICB4TmV3ID0gZnVuYyA/IGZ1bmMuY2FsbChudWxsLCBwb3NZIC0geEZ1bmMudmFsdWUpIDogMDtcblxuICAgICRlbFswXS5zdHlsZVtwcmVmaXguZG9tICsgJ1RyYW5zZm9ybSddID0gYHRyYW5zbGF0ZTNkKCR7eE5ld31weCwgJHt5TmV3fXB4LCAwKSB0cmFuc2xhdGVaKDApIHNjYWxlKDEpYDtcbiAgICB0aGlzLnlQcmV2ID0gcG9zWTtcbiAgICB0aGlzLnRQcmV2ID0geU5ldztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgcnVuQ2FsbGJhY2tzKHBvc1kpIHtcbiAgICB0aGlzLnVwZGF0ZUhpZGUocG9zWSk7XG4gICAgdGhpcy51cGRhdGVaaW5kZXgocG9zWSk7XG4gICAgdGhpcy51cGRhdGVUb3AocG9zWSk7XG4gICAgdGhpcy51cGRhdGVPZmZzZXQocG9zWSk7XG4gICAgdGhpcy51cGRhdGVTcGVlZChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZVhGdW5jKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlQ2FsbGJhY2socG9zWSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZUhpZGUocG9zWSkge1xuICAgIHZhciB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLmhpZGUsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy5oaWRlLnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLiRlbC5jc3MoJ2Rpc3BsYXknLCB2YWx1ZSA/ICdub25lJyA6ICdibG9jaycpO1xuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlWmluZGV4KHBvc1kpIHtcbiAgICB2YXIgcHJldlkgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgdGhpcy56SW5kZXgsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy56SW5kZXgudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuJGVsLmNzcygnekluZGV4JywgdmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVUb3AocG9zWSkge1xuICAgIHZhciB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLnRvcCwgKHZhbHVlKSA9PiB7XG4gICAgICB2YXIgeU9mZnNldCA9IHRoaXMueU9mZnNldDtcbiAgICAgIHRoaXMudG9wLnZhbHVlID0gdmFsdWUgPSB2YWx1ZSArIHlPZmZzZXQ7XG4gICAgICB0aGlzLiRlbC5jc3MoJ3RvcCcsIHZhbHVlICsgJ3B4Jyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZU9mZnNldChwb3NZKSB7XG4gICAgdmFyIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMub2Zmc2V0VG9wLCAodmFsdWUpID0+IHtcbiAgICAgIHZhciB5RGlmZiwgdG9wO1xuICAgICAgeURpZmYgPSB2YWx1ZSAtIHRoaXMueU9mZnNldDtcbiAgICAgIHRoaXMueU9mZnNldCA9IHZhbHVlO1xuICAgICAgdG9wID0gcGFyc2VJbnQodGhpcy4kZWwuY3NzKCd0b3AnKSwgMTApO1xuICAgICAgdGhpcy4kZWwuY3NzKCd0b3AnLCB0b3AgKyB5RGlmZiArICdweCcpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVTcGVlZChwb3NZKSB7XG4gICAgdmFyIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMuc3BlZWQsICh2YWx1ZSwgYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93biwgYWN0dWFsQnJlYWtwb2ludCkgPT4ge1xuICAgICAgdGhpcy5zcGVlZC5fYnJlYWtwb2ludCA9IGFjdHVhbEJyZWFrcG9pbnQ7XG4gICAgICB0aGlzLnNwZWVkLl9sYXN0U3BlZWQgPSB0aGlzLnNwZWVkLnZhbHVlO1xuICAgICAgdGhpcy5zcGVlZC52YWx1ZSA9IHZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVYRnVuYyhwb3NZKSB7XG4gICAgdmFyIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMueEZ1bmMsICh2YWx1ZSwgYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93biwgYWN0dWFsQnJlYWtwb2ludCkgPT4ge1xuICAgICAgdGhpcy54RnVuYy52YWx1ZSA9IGJyZWFrcG9pbnQ7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZUNhbGxiYWNrKHBvc1kpIHtcbiAgICB2YXIgeVByZXYsICRlbCwgc2VsZjtcbiAgICB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgJGVsID0gdGhpcy4kZWw7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLnVwZGF0ZSwgKHZhbHVlLCBicmVha3BvaW50KSA9PiB7XG4gICAgICBzZWxmLnVwZGF0ZS5icmVha3BvaW50c1ticmVha3BvaW50XS5jYWxsKHNlbGYsICRlbCwgcG9zWSwgeVByZXYpO1xuICAgIH0pO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBzdHlsZUVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgJGVsLCBjc3MsIHlPZmZzZXQ7XG4gICAgdmFyIHtjZW50ZXIsIHRvcH0gPSBvcHRpb25zO1xuICAgIHlPZmZzZXQgPSB0aGlzLnlPZmZzZXQ7XG4gICAgY3NzID0ge1xuICAgICAgJ3Bvc2l0aW9uJzogJ2ZpeGVkJyxcbiAgICAgICdsZWZ0JzogMCxcbiAgICAgICdyaWdodCc6IDAsXG4gICAgfTtcbiAgICBpZiAoY2VudGVyLnZhbHVlKSB7XG4gICAgICBjc3NbJ21hcmdpbi1yaWdodCddID0gJ2F1dG8nO1xuICAgICAgY3NzWydtYXJnaW4tbGVmdCddID0gJ2F1dG8nO1xuICAgIH1cbiAgICBpZiAodG9wLnZhbHVlKSB7XG4gICAgICBjc3MudG9wID0gdG9wICsgeU9mZnNldCArICdweCc7XG4gICAgfVxuICAgICRlbCA9ICQoc2VsZWN0b3IpO1xuICAgIGlmICghJGVsLmxlbmd0aCkge1xuICAgICAgdGhyb3cgYEludmFsaWQgc2VsZWN0b3IgXCIke3NlbGVjdG9yfVwiYDtcbiAgICB9XG4gICAgJGVsLmNzcyhjc3MpO1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9QYXJhbGxheEJybycpO1xuIiwiY29uc3Qgc2VsZiA9IG1vZHVsZS5leHBvcnRzO1xuXG5zZWxmLmNhbGxCcmVha3BvaW50cyA9IChwb3NZLCB5UHJldiwgYnJlYWtwb2ludHMsIGNhbGxiYWNrKSA9PiB7XG4gIHZhciBzY3JvbGxpbmdEb3duLCB5RGlmZjtcbiAgc2Nyb2xsaW5nRG93biA9IHlQcmV2IDwgcG9zWTtcbiAgeURpZmYgPSBzY3JvbGxpbmdEb3duID8gcG9zWSAtIHlQcmV2IDogeVByZXYgLSBwb3NZO1xuICBicmVha3BvaW50cyA9IGJyZWFrcG9pbnRzLm1hcChicmVha3BvaW50ID0+IHBhcnNlSW50KGJyZWFrcG9pbnQsIDEwKSk7XG4gIC8vIEB0b2RvIC0gd2UgY291bGQgdXNlIGEgZGlmZmVyZW50IHRlY2huaXF1ZSBidXQgdGhpcyBvbmUgd29ya3Mgdy8gbGl0dGxlIGFwYXJlbnQgZG93bnNpZGVzLlxuICBmb3IgKGxldCBpPTA7IGk8eURpZmY7IGkrKykge1xuICAgIGxldCBwb3MsIGluZGV4O1xuICAgIHBvcyA9IHNjcm9sbGluZ0Rvd24gPyB5UHJldiArIGkgOiB5UHJldiAtIGk7XG4gICAgaW5kZXggPSBicmVha3BvaW50cy5pbmRleE9mKHBvcyk7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIGxldCBpID0gc2Nyb2xsaW5nRG93biA/IGluZGV4IDogaW5kZXggLSAxO1xuICAgICAgY2FsbGJhY2suY2FsbChudWxsLCBicmVha3BvaW50c1tpXSwgc2Nyb2xsaW5nRG93biwgYnJlYWtwb2ludHNbaW5kZXhdKTtcbiAgICB9XG4gIH1cbn1cblxuc2VsZi5ydW5VcGRhdGUgPSAocG9zWSwgeVByZXYsIG9iaiwgY2FsbGJhY2spID0+IHtcbiAgdmFyIGJyZWFrcG9pbnRzID0gT2JqZWN0LmtleXMob2JqLmJyZWFrcG9pbnRzKTtcblxuICAvLyBDYWxsIG9uIGluaXQuXG4gIGlmICh5UHJldiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIHZhbHVlID0gb2JqLmJyZWFrcG9pbnRzW3Bvc1ldO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKG51bGwsIHZhbHVlLCBwb3NZLCB0cnVlKTtcbiAgICB9XG4gIH1cbiAgc2VsZi5jYWxsQnJlYWtwb2ludHMocG9zWSwgeVByZXYsIGJyZWFrcG9pbnRzLCAoYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93biwgYWN0dWFsQnJlYWtwb2ludCkgPT4ge1xuICAgIHZhciB2YWx1ZSA9IG9iai5icmVha3BvaW50c1ticmVha3BvaW50XTtcbiAgICBjYWxsYmFjay5jYWxsKG51bGwsIHZhbHVlLCBicmVha3BvaW50LCBzY3JvbGxpbmdEb3duLCBhY3R1YWxCcmVha3BvaW50KTtcbiAgfSk7XG59XG5cbnNlbGYubm9ybWFsaXplT3B0aW9ucyA9IChvcHRpb25zLCBkZWZhdWx0cywgZXhjZXB0aW9ucyA9IFtdKSA9PiB7XG4gIHZhciBrZXlzO1xuXG4gIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gIGtleXMgPSBPYmplY3Qua2V5cyhvcHRpb25zKTtcblxuICAvLyBrZXlzID0ga2V5cy5maWx0ZXIoa2V5ID0+IGV4Y2VwdGlvbnMuaW5kZXhPZihrZXkpID09PSAtMSk7XG5cbiAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgdmFyIHZhbHVlLCBpc09iamVjdDtcbiAgICB2YWx1ZSA9IG9wdGlvbnNba2V5XTtcbiAgICBpc09iamVjdCA9IHNlbGYuaXNUeXBlKHZhbHVlLCAnb2JqZWN0Jyk7XG4gICAgaWYgKGlzT2JqZWN0KSB7XG4gICAgICBsZXQgdmFsdWUxID0gdmFsdWUgJiYgdmFsdWVbJzAnXSA/IHZhbHVlWycwJ10gOiBkZWZhdWx0c1trZXldLnZhbHVlO1xuICAgICAgZGVsZXRlIHZhbHVlLnZhbHVlO1xuICAgICAgb3B0aW9uc1trZXldID0ge1xuICAgICAgICB2YWx1ZTogdmFsdWUxLFxuICAgICAgICBicmVha3BvaW50czogT2JqZWN0LmFzc2lnbih7fSwgezA6IHZhbHVlMX0sIHZhbHVlKSxcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBvcHRpb25zW2tleV0gPSB7XG4gICAgICAgIHZhbHVlLFxuICAgICAgICBicmVha3BvaW50czogezA6IHZhbHVlfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvcHRpb25zO1xufVxuXG4vKipcbiAqIEdpdmVuIGEgTWl4ZWQgdmFsdWUgdHlwZSBjaGVjay5cbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlLlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWMuXG4gKiBAdGVzdHMgdW5pdC5cbiAqL1xuc2VsZi5pc1R5cGUgPSAodmFsdWUsIHR5cGUpID0+IHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBOdW1iZXIuaXNOYU4odmFsdWUpID09PSBmYWxzZTtcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSB8fCB2YWx1ZSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnYXJyYXknOlxuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnbnVsbCc6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGw7XG4gICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJztcbiAgICBjYXNlICdOYU4nOlxuICAgICAgcmV0dXJuIE51bWJlci5pc05hTih2YWx1ZSk7XG4gICAgY2FzZSAnZGF0ZSc6XG4gICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucmVjZ29uaXplZCB0eXBlOiBcIiR7dHlwZX1cImApO1xuICB9XG59O1xuXG5zZWxmLnByZWZpeCA9ICgpID0+IHtcbiAgdmFyIHN0eWxlcywgcHJlLCBkb207XG4gIHN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgJycpLFxuICAgIHByZSA9IChBcnJheS5wcm90b3R5cGUuc2xpY2VcbiAgICAgIC5jYWxsKHN0eWxlcylcbiAgICAgIC5qb2luKCcnKVxuICAgICAgLm1hdGNoKC8tKG1venx3ZWJraXR8bXMpLS8pIHx8IChzdHlsZXMuT0xpbmsgPT09ICcnICYmIFsnJywgJ28nXSlcbiAgICApWzFdLFxuICAgIGRvbSA9ICgnd2Via2l0fE1venxNU3xPJykubWF0Y2gobmV3IFJlZ0V4cCgnKCcgKyBwcmUgKyAnKScsICdpJykpWzFdO1xuICAgIHJldHVybiB7XG4gICAgICBkb206IGRvbSxcbiAgICAgIGxvd2VyY2FzZTogcHJlLFxuICAgICAgY3NzOiAnLScgKyBwcmUgKyAnLScsXG4gICAgICBqczogcHJlWzBdLnRvVXBwZXJDYXNlKCkgKyBwcmUuc3Vic3RyKDEpXG4gICAgfTtcbn07XG4iXX0=
