(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var ParallaxBro = require('../lib');

var laxbro = new ParallaxBro('#parallax', 2900, {
  // debug: true
});

var c1 = laxbro.addCollection('#collection1');
c1.addElements({
  '[src="images/intro.jpg"]': {
    top: 200,
    center: true,
    speed: .6
  }
});

var c2 = laxbro.addCollection('#collection2', { top: 1000 });
c2.addElements({
  '[src="images/project-launch.jpg"]': {
    zIndex: 1,
    speed: 1.3,
    top: 700,
    center: true,
    xFunc: {
      1200: function _(posY) {
        return posY;
      }
    }
  },
  '[src="images/splatter-projectlaunch-1.jpg"]': {
    speed: 1,
    center: true
  },
  '[src="images/splatter-projectlaunch-3.png"]': {
    top: 100,
    xFunc: {
      1200: function _(posY) {
        return -posY;
      }
    },
    speed: {
      0: 1.5,
      700: 0,
      1200: 1.5
    }
  }
});

var c3 = laxbro.addCollection('#collection3', { top: 2000 });
c2.addElements({
  '[src="images/outro.jpg"]': {
    top: 0,
    center: true,
    speed: {
      1600: -1
    },
    update: {
      0: function _($el) {
        $el.fadeOut();
      },
      1600: function _($el) {
        $el.fadeIn();
      }
    }
  }
});

},{"../lib":6}],2:[function(require,module,exports){
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

    this._stopAnimationFrame = false;

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
    key: 'unbind',
    value: function unbind() {
      this._stopAnimationFrame = true;
    }
  }, {
    key: '_hydrateElements',
    value: function _hydrateElements() {
      var _this = this;

      var posY = this.$el.doc.scrollTop() || 0;
      setTimeout(function () {
        return _this._moveElements(0);
      }, 0);
      if (posY > 0) {
        setTimeout(function () {
          return _this._moveElements(posY);
        }, 0);
      }
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
        if (_this2._stopAnimationFrame) {
          _this2._stopAnimationFrame = false;
          return;
        }
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
        disableStyles: false,
        height: '100%',
        debug: false
      }, options);
    }
  }]);

  return ParalaxBro;
}();

},{"./ParallaxCollection":3,"./debug":5}],3:[function(require,module,exports){
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

},{"./ParallaxElement":4,"./utils":7}],4:[function(require,module,exports){
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

},{"./utils":7}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
'use strict';

module.exports = require('./ParallaxBro');

},{"./ParallaxBro":2}],7:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmpzIiwibGliL1BhcmFsbGF4QnJvLmpzIiwibGliL1BhcmFsbGF4Q29sbGVjdGlvbi5qcyIsImxpYi9QYXJhbGxheEVsZW1lbnQuanMiLCJsaWIvZGVidWcuanMiLCJsaWIvaW5kZXguanMiLCJsaWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQU0sY0FBYyxRQUFRLFFBQVIsQ0FBcEI7O0FBRUEsSUFBTSxTQUFTLElBQUksV0FBSixDQUFnQixXQUFoQixFQUE2QixJQUE3QixFQUFtQztBQUNoRDtBQURnRCxDQUFuQyxDQUFmOztBQUtBLElBQU0sS0FBSyxPQUFPLGFBQVAsQ0FBcUIsY0FBckIsQ0FBWDtBQUNBLEdBQUcsV0FBSCxDQUFlO0FBQ2IsOEJBQTRCO0FBQzFCLFNBQUssR0FEcUI7QUFFMUIsWUFBUSxJQUZrQjtBQUcxQixXQUFPO0FBSG1CO0FBRGYsQ0FBZjs7QUFRQSxJQUFNLEtBQUssT0FBTyxhQUFQLENBQXFCLGNBQXJCLEVBQXFDLEVBQUMsS0FBSyxJQUFOLEVBQXJDLENBQVg7QUFDQSxHQUFHLFdBQUgsQ0FBZTtBQUNiLHVDQUFxQztBQUNuQyxZQUFRLENBRDJCO0FBRW5DLFdBQU8sR0FGNEI7QUFHbkMsU0FBSyxHQUg4QjtBQUluQyxZQUFRLElBSjJCO0FBS25DLFdBQU87QUFDTCxZQUFNLFdBQUMsSUFBRDtBQUFBLGVBQVUsSUFBVjtBQUFBO0FBREQ7QUFMNEIsR0FEeEI7QUFVYixpREFBK0M7QUFDN0MsV0FBTyxDQURzQztBQUU3QyxZQUFRO0FBRnFDLEdBVmxDO0FBY2IsaURBQStDO0FBQzdDLFNBQUssR0FEd0M7QUFFN0MsV0FBTztBQUNMLFlBQU0sV0FBQyxJQUFEO0FBQUEsZUFBVSxDQUFDLElBQVg7QUFBQTtBQURELEtBRnNDO0FBSzdDLFdBQU87QUFDTCxTQUFHLEdBREU7QUFFTCxXQUFLLENBRkE7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QU4sR0FBWSxHQUhaO0FBSUwsUUFBSSxJQUFJLENBQUosRUFBTyxXQUFQLEtBQXVCLElBQUksTUFBSixDQUFXLENBQVg7QUFKdEIsR0FBUDtBQU1ILENBZkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgUGFyYWxsYXhCcm8gPSByZXF1aXJlKCcuLi9saWInKTtcblxuY29uc3QgbGF4YnJvID0gbmV3IFBhcmFsbGF4QnJvKCcjcGFyYWxsYXgnLCAyOTAwLCB7XG4gIC8vIGRlYnVnOiB0cnVlXG59KTtcblxuXG5jb25zdCBjMSA9IGxheGJyby5hZGRDb2xsZWN0aW9uKCcjY29sbGVjdGlvbjEnKTtcbmMxLmFkZEVsZW1lbnRzKHtcbiAgJ1tzcmM9XCJpbWFnZXMvaW50cm8uanBnXCJdJzoge1xuICAgIHRvcDogMjAwLFxuICAgIGNlbnRlcjogdHJ1ZSxcbiAgICBzcGVlZDogLjYsXG4gIH0sXG59KTtcblxuY29uc3QgYzIgPSBsYXhicm8uYWRkQ29sbGVjdGlvbignI2NvbGxlY3Rpb24yJywge3RvcDogMTAwMH0pO1xuYzIuYWRkRWxlbWVudHMoe1xuICAnW3NyYz1cImltYWdlcy9wcm9qZWN0LWxhdW5jaC5qcGdcIl0nOiB7XG4gICAgekluZGV4OiAxLFxuICAgIHNwZWVkOiAxLjMsXG4gICAgdG9wOiA3MDAsXG4gICAgY2VudGVyOiB0cnVlLFxuICAgIHhGdW5jOiB7XG4gICAgICAxMjAwOiAocG9zWSkgPT4gcG9zWVxuICAgIH0sXG4gIH0sXG4gICdbc3JjPVwiaW1hZ2VzL3NwbGF0dGVyLXByb2plY3RsYXVuY2gtMS5qcGdcIl0nOiB7XG4gICAgc3BlZWQ6IDEsXG4gICAgY2VudGVyOiB0cnVlLFxuICB9LFxuICAnW3NyYz1cImltYWdlcy9zcGxhdHRlci1wcm9qZWN0bGF1bmNoLTMucG5nXCJdJzoge1xuICAgIHRvcDogMTAwLFxuICAgIHhGdW5jOiB7XG4gICAgICAxMjAwOiAocG9zWSkgPT4gLXBvc1lcbiAgICB9LFxuICAgIHNwZWVkOiB7XG4gICAgICAwOiAxLjUsXG4gICAgICA3MDA6IDAsXG4gICAgICAxMjAwOiAxLjUsXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5jb25zdCBjMyA9IGxheGJyby5hZGRDb2xsZWN0aW9uKCcjY29sbGVjdGlvbjMnLCB7dG9wOiAyMDAwfSk7XG5jMi5hZGRFbGVtZW50cyh7XG4gICdbc3JjPVwiaW1hZ2VzL291dHJvLmpwZ1wiXSc6IHtcbiAgICB0b3A6IDAsXG4gICAgY2VudGVyOiB0cnVlLFxuICAgIHNwZWVkOiB7XG4gICAgICAxNjAwOiAtMSxcbiAgICB9LFxuICAgIHVwZGF0ZToge1xuICAgICAgMDogKCRlbCkgPT4ge1xuICAgICAgICAkZWwuZmFkZU91dCgpO1xuICAgICAgfSxcbiAgICAgIDE2MDA6ICgkZWwpID0+IHtcbiAgICAgICAgJGVsLmZhZGVJbigpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbn0pO1xuIiwiY29uc3QgUGFyYWxsYXhDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9QYXJhbGxheENvbGxlY3Rpb24nKTtcbmNvbnN0IERlYnVnID0gcmVxdWlyZSgnLi9kZWJ1ZycpO1xuXG52YXIgJDtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYXJhbGF4QnJvIHtcblxuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBoZWlnaHQgPSAnMTAwJScsIG9wdGlvbnMpIHtcbiAgICBjb25zdCB7ZGlzYWJsZVN0eWxlcywgZGVidWd9ID0gdGhpcy5fbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKTtcblxuICAgIHRoaXMuY29sbGVjdGlvbnMgPSBbXTtcblxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHRocm93ICdZb3UgbXVzdCBwYXNzIGEgc2VsZWN0b3Igc3RyaW5nIHRvIFBhcmFsYXhCcm8uJztcbiAgICB9XG5cbiAgICB0aGlzLl9zdG9wQW5pbWF0aW9uRnJhbWUgPSBmYWxzZTtcblxuICAgIHRoaXMuX2pRdWVyeSgpO1xuICAgIHRoaXMuX2NhY2hlRE9NRWxlbWVudHMoc2VsZWN0b3IpO1xuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcbiAgICBpZiAoIWRpc2FibGVTdHlsZXMpIHtcbiAgICAgIHRoaXMuX3N0eWxlRE9NKGhlaWdodCk7XG4gICAgfVxuICAgIGlmIChkZWJ1Zykge1xuICAgICAgdGhpcy5faW5pdERlYnVnKCk7XG4gICAgfVxuXG4gICAgdGhpcy5faHlkcmF0ZUVsZW1lbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBhZGRDb2xsZWN0aW9uKHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbGxlY3Rpb247XG4gICAgY29sbGVjdGlvbiA9IG5ldyBQYXJhbGxheENvbGxlY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpO1xuICAgIHRoaXMuY29sbGVjdGlvbnMucHVzaChjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuXG4gIHVuYmluZCgpIHtcbiAgICB0aGlzLl9zdG9wQW5pbWF0aW9uRnJhbWUgPSB0cnVlO1xuICB9XG5cbiAgX2h5ZHJhdGVFbGVtZW50cygpIHtcbiAgICBjb25zdCBwb3NZID0gdGhpcy4kZWwuZG9jLnNjcm9sbFRvcCgpIHx8IDA7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLl9tb3ZlRWxlbWVudHMoMCkgLCAwKTtcbiAgICBpZiAocG9zWSA+IDApIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5fbW92ZUVsZW1lbnRzKHBvc1kpICwgMCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB3cmFwcGVyXG4gICAqL1xuICBfY2FjaGVET01FbGVtZW50cyh3cmFwcGVyKSB7XG4gICAgdGhpcy4kZWwgPSB7fTtcbiAgICB0aGlzLiRlbC53aW4gPSAkKHdpbmRvdyk7XG4gICAgdGhpcy4kZWwuZG9jID0gJChkb2N1bWVudCk7XG4gICAgdGhpcy4kZWwuYm9keSA9ICQoJ2JvZHknKTtcbiAgICB0aGlzLiRlbC53cmFwcGVyID0gJCh3cmFwcGVyKTtcbiAgfVxuXG4gIF9pbml0RGVidWcoKSB7XG4gICAgdmFyIGRlYnVnO1xuICAgIGRlYnVnID0gbmV3IERlYnVnKCk7XG4gICAgZGVidWcuaW5pdCgpO1xuICB9XG5cbiAgX3N0eWxlRE9NKGhlaWdodCkge1xuICAgIHZhciB7Ym9keSwgd3JhcHBlciwgZG9jfSA9IHRoaXMuJGVsO1xuICAgIGRvYy5jaGlsZHJlbigpLmNzcygnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICBib2R5LmNzcygnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICB3cmFwcGVyLmNzcyh7XG4gICAgICAnaGVpZ2h0JzogaGVpZ2h0LFxuICAgICAgJ292ZXJmbG93JzogJ3Zpc2libGUnLFxuICAgICAgJ21pbi1oZWlnaHQnOiAnMTAwJScsXG4gICAgICAnYm94LXNpemluZyc6ICdib3JkZXItYm94JyxcbiAgICB9KTtcbiAgICB3cmFwcGVyLmFkZENsYXNzKCdwYXJhbGF4YnJvJyk7XG4gIH1cblxuICBfYmluZEV2ZW50cygpIHtcbiAgICBjb25zdCB0cmFjayA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9zdG9wQW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgdGhpcy5fc3RvcEFuaW1hdGlvbkZyYW1lID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBwb3NZID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgdGhpcy5fbW92ZUVsZW1lbnRzKHBvc1kpO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRyYWNrKTtcbiAgICB9XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRyYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgX21vdmVFbGVtZW50cyhwb3NZKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25zO1xuICAgIGNvbGxlY3Rpb25zID0gdGhpcy5jb2xsZWN0aW9ucztcbiAgICBjb2xsZWN0aW9ucy5mb3JFYWNoKGNvbGxlY3Rpb24gPT4gY29sbGVjdGlvbi5tb3ZlRWxlbWVudHMocG9zWSkpO1xuICB9XG5cbiAgX2pRdWVyeSgpIHtcbiAgICAkID0galF1ZXJ5O1xuICAgIGlmICghJCkge1xuICAgICAgdGhyb3cgJ2pRdWVyeSBpcyBub3QgZGVmaW5lZCc7XG4gICAgfVxuICB9XG5cbiAgX25vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucykge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICBkaXNhYmxlU3R5bGVzOiBmYWxzZSxcbiAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgZGVidWc6IGZhbHNlLFxuICAgIH0sIG9wdGlvbnMpO1xuICB9XG5cbn1cbiIsImNvbnN0IHtub3JtYWxpemVPcHRpb25zLCBydW5VcGRhdGV9ID0gcmVxdWlyZSgnLi91dGlscycpO1xuY29uc3QgUGFyYWxsYXhFbGVtZW50ID0gcmVxdWlyZSgnLi9QYXJhbGxheEVsZW1lbnQnKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxsYXhDb2xsZWN0aW9uIHtcblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMsIHtcbiAgICAgIHRvcDoge3ZhbHVlOiAwfSxcbiAgICAgIGhpZGU6IHt2YWx1ZTogZmFsc2V9LFxuICAgICAgekluZGV4OiB7dmFsdWU6IC0xfSxcbiAgICAgIHVwZGF0ZToge3ZhbHVlOiAoKSA9PiB7fX0sXG4gICAgfSk7XG4gICAgY29uc3Qge3RvcCwgaGlkZSwgekluZGV4LCB1cGRhdGV9ID0gb3B0aW9ucztcblxuICAgIHRoaXMuJGVsO1xuICAgIHRoaXMuZWxlbWVudHMgPSBbXTtcbiAgICB0aGlzLnlQcmV2O1xuXG4gICAgdGhpcy50b3AgPSB0b3A7XG4gICAgdGhpcy5oaWRlID0gaGlkZTtcbiAgICB0aGlzLnpJbmRleCA9IHpJbmRleDtcbiAgICB0aGlzLnVwZGF0ZSA9IHVwZGF0ZTtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5zdHlsZUNvbGxlY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICovXG4gIGFkZEVsZW1lbnRzKG9iaikge1xuICAgIHZhciBzZWxlY3RvcnMsIHRvcCwgaGVpZ2h0O1xuICAgIHNlbGVjdG9ycyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgaGVpZ2h0ID0gMDtcbiAgICBzZWxlY3RvcnMuZm9yRWFjaChzZWxlY3RvciA9PiB7XG4gICAgICB2YXIgb3B0aW9ucyA9IG9ialtzZWxlY3Rvcl07XG4gICAgICB0aGlzLl9hZGRFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICAgIGhlaWdodCArPSAkKHNlbGVjdG9yKS5vdXRlckhlaWdodCgpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgX2FkZEVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgZWxlbWVudDtcbiAgICBlbGVtZW50ID0gbmV3IFBhcmFsbGF4RWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucywgdGhpcy50b3ApO1xuICAgIHRoaXMuZWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgbW92ZUVsZW1lbnRzKHBvc1kpIHtcbiAgICB2YXIgZWxlbWVudHM7XG4gICAgZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzO1xuICAgIHRoaXMucnVuQ2FsbGJhY2tzKHBvc1kpO1xuICAgIGVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiBlbGVtZW50Lm1vdmVFbGVtZW50KHBvc1kpKTtcbiAgICB0aGlzLnlQcmV2ID0gcG9zWTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgcnVuQ2FsbGJhY2tzKHBvc1kpIHtcbiAgICB0aGlzLnVwZGF0ZUhpZGUocG9zWSk7XG4gICAgdGhpcy51cGRhdGVaaW5kZXgocG9zWSk7XG4gICAgdGhpcy51cGRhdGVDYWxsYmFjayhwb3NZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlSGlkZShwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuaGlkZSwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLmhpZGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuJGVsLmNzcygnb3BhY2l0eScsIHZhbHVlID8gMCA6IDEpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVaaW5kZXgocG9zWSkge1xuICAgIHZhciBwcmV2WSA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHByZXZZLCB0aGlzLnpJbmRleCwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLnpJbmRleC52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy4kZWwuY3NzKCd6SW5kZXgnLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZUNhbGxiYWNrKHBvc1kpIHtcbiAgICB2YXIgeVByZXYsICRlbCwgc2VsZjtcbiAgICB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgJGVsID0gdGhpcy4kZWw7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLnVwZGF0ZSwgKHZhbHVlLCBicmVha3BvaW50KSA9PiB7XG4gICAgICBzZWxmLnVwZGF0ZS5icmVha3BvaW50c1ticmVha3BvaW50XS5jYWxsKHNlbGYsICRlbCwgcG9zWSwgeVByZXYpO1xuICAgIH0pO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBzdHlsZUNvbGxlY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgJGVsLCBjc3M7XG4gICAgdmFyIHt6SW5kZXgsIGhpZGV9ID0gb3B0aW9ucztcbiAgICBjc3MgPSB7fTtcbiAgICBjc3MuekluZGV4ID0gekluZGV4LnZhbHVlO1xuICAgIGlmIChoaWRlLnZhbHVlKSB7XG4gICAgICBjc3MuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG4gICAgJGVsID0gJChzZWxlY3Rvcik7XG4gICAgJGVsLmNzcyhjc3MpO1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn1cbiIsImNvbnN0IHtwcmVmaXgsIG5vcm1hbGl6ZU9wdGlvbnMsIHJ1blVwZGF0ZX0gPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsbGF4RWxlbWVudCB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAcGFyYW0ge09iamVjdH0gb2Zmc2V0VG9wXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZWxlY3Rvciwgb3B0aW9ucywgb2Zmc2V0VG9wKSB7XG4gICAgb3B0aW9ucyA9IG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucywge1xuICAgICAgdG9wOiB7dmFsdWU6IDB9LFxuICAgICAgaGlkZToge3ZhbHVlOiBmYWxzZX0sXG4gICAgICB6SW5kZXg6IHt2YWx1ZTogLTF9LFxuICAgICAgc3BlZWQ6IHt2YWx1ZTogMX0sXG4gICAgICBjZW50ZXI6IHt2YWx1ZTogZmFsc2V9LFxuICAgICAgdXBkYXRlOiB7dmFsdWU6ICgpID0+IHt9fSxcbiAgICAgIHhGdW5jOiB7dmFsdWU6IDB9LFxuICAgIH0pO1xuXG4gICAgY29uc3Qge3RvcCwgaGlkZSwgekluZGV4LCBzcGVlZCwgY2VudGVyLCB1cGRhdGUsIHhGdW5jfSA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLiRlbDtcbiAgICB0aGlzLnByZWZpeCA9IHByZWZpeCgpO1xuICAgIHRoaXMub2Zmc2V0VG9wID0gb2Zmc2V0VG9wO1xuICAgIHRoaXMueU9mZnNldCA9IG9mZnNldFRvcC52YWx1ZTtcbiAgICB0aGlzLnlQcmV2O1xuICAgIHRoaXMudFByZXY7XG5cbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLmhpZGUgPSBoaWRlO1xuICAgIHRoaXMuekluZGV4ID0gekluZGV4O1xuICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcbiAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcbiAgICB0aGlzLnVwZGF0ZSA9IHVwZGF0ZTtcbiAgICB0aGlzLnhGdW5jID0geEZ1bmM7XG5cbiAgICB0aGlzLmpRdWVyeSgpO1xuICAgIHRoaXMuc3R5bGVFbGVtZW50KHNlbGVjdG9yLCB7Y2VudGVyLCB0b3B9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgbW92ZUVsZW1lbnQocG9zWSkge1xuICAgIHZhciAkZWwsIHlQcmV2LCB0UHJldiwgeU5ldywgeE5ldywgeEZ1bmMsIGZ1bmMsIHNwZWVkLCBicmVha3BvaW50LCBwcmV2QnJlYWtwb2ludCwgZGVsdGEsIHByZWZpeFxuXG4gICAgdGhpcy5ydW5DYWxsYmFja3MocG9zWSk7XG5cbiAgICB5UHJldiA9IHRoaXMueVByZXYgfHwgMDtcbiAgICB0UHJldiA9IHRoaXMudFByZXYgfHwgMDtcbiAgICBwcmVmaXggPSB0aGlzLnByZWZpeDtcbiAgICB4RnVuYyA9IHRoaXMueEZ1bmM7XG4gICAgJGVsID0gdGhpcy4kZWw7XG4gICAgc3BlZWQgPSB0aGlzLnNwZWVkLnZhbHVlO1xuICAgIGJyZWFrcG9pbnQgPSB0aGlzLnNwZWVkLl9icmVha3BvaW50O1xuXG4gICAgaWYgKGJyZWFrcG9pbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbGV0IGxhc3RTcGVlZCwgeURpZmY7XG4gICAgICBkZWx0YSA9IDA7XG4gICAgICBsYXN0U3BlZWQgPSB0aGlzLnNwZWVkLl9sYXN0U3BlZWQ7XG5cbiAgICAgIHlEaWZmID0geVByZXYgLSBicmVha3BvaW50O1xuICAgICAgZGVsdGEgKz0gTWF0aC5yb3VuZCh5RGlmZipsYXN0U3BlZWQqMTAwKSAvIDEwMDtcblxuICAgICAgeURpZmYgPSBicmVha3BvaW50IC0gcG9zWTtcbiAgICAgIGRlbHRhICs9IE1hdGgucm91bmQoeURpZmYqc3BlZWQqMTAwKSAvIDEwMDtcblxuICAgICAgdGhpcy5zcGVlZC5fYnJlYWtwb2ludCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsZXQgeURpZmY7XG4gICAgICBkZWx0YSA9IDA7XG4gICAgICB5RGlmZiA9IHlQcmV2IC0gcG9zWTtcbiAgICAgIGRlbHRhID0gTWF0aC5yb3VuZCh5RGlmZipzcGVlZCoxMDApIC8gMTAwO1xuICAgIH1cblxuICAgIHlOZXcgPSB0UHJldiArIGRlbHRhO1xuICAgIGZ1bmMgPSB4RnVuYy5icmVha3BvaW50c1t4RnVuYy52YWx1ZV07XG4gICAgeE5ldyA9IGZ1bmMgPyBmdW5jLmNhbGwobnVsbCwgcG9zWSAtIHhGdW5jLnZhbHVlKSA6IDA7XG4gICAgJGVsWzBdLnN0eWxlW3ByZWZpeC5kb20gKyAnVHJhbnNmb3JtJ10gPSBgdHJhbnNsYXRlM2QoJHt4TmV3fXB4LCAke3lOZXd9cHgsIDApIHRyYW5zbGF0ZVooMCkgc2NhbGUoMSlgO1xuICAgIHRoaXMueVByZXYgPSBwb3NZO1xuICAgIHRoaXMudFByZXYgPSB5TmV3O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBydW5DYWxsYmFja3MocG9zWSkge1xuICAgIHRoaXMudXBkYXRlSGlkZShwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZVppbmRleChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZVRvcChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZU9mZnNldChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZVNwZWVkKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlWEZ1bmMocG9zWSk7XG4gICAgdGhpcy51cGRhdGVDYWxsYmFjayhwb3NZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlSGlkZShwb3NZKSB7XG4gICAgdmFyIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMuaGlkZSwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLmhpZGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuJGVsLmNzcygnZGlzcGxheScsIHZhbHVlID8gJ25vbmUnIDogJ2Jsb2NrJyk7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVaaW5kZXgocG9zWSkge1xuICAgIHZhciBwcmV2WSA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHByZXZZLCB0aGlzLnpJbmRleCwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLnpJbmRleC52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy4kZWwuY3NzKCd6SW5kZXgnLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZVRvcChwb3NZKSB7XG4gICAgdmFyIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMudG9wLCAodmFsdWUpID0+IHtcbiAgICAgIHZhciB5T2Zmc2V0ID0gdGhpcy55T2Zmc2V0O1xuICAgICAgdGhpcy50b3AudmFsdWUgPSB2YWx1ZSA9IHZhbHVlICsgeU9mZnNldDtcbiAgICAgIHRoaXMuJGVsLmNzcygndG9wJywgdmFsdWUgKyAncHgnKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlT2Zmc2V0KHBvc1kpIHtcbiAgICB2YXIgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy5vZmZzZXRUb3AsICh2YWx1ZSkgPT4ge1xuICAgICAgdmFyIHlEaWZmLCB0b3A7XG4gICAgICB5RGlmZiA9IHZhbHVlIC0gdGhpcy55T2Zmc2V0O1xuICAgICAgdGhpcy55T2Zmc2V0ID0gdmFsdWU7XG4gICAgICB0b3AgPSBwYXJzZUludCh0aGlzLiRlbC5jc3MoJ3RvcCcpLCAxMCk7XG4gICAgICB0aGlzLiRlbC5jc3MoJ3RvcCcsIHRvcCArIHlEaWZmICsgJ3B4Jyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZVNwZWVkKHBvc1kpIHtcbiAgICB2YXIgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy5zcGVlZCwgKHZhbHVlLCBicmVha3BvaW50LCBzY3JvbGxpbmdEb3duLCBhY3R1YWxCcmVha3BvaW50KSA9PiB7XG4gICAgICB0aGlzLnNwZWVkLl9icmVha3BvaW50ID0gYWN0dWFsQnJlYWtwb2ludDtcbiAgICAgIHRoaXMuc3BlZWQuX2xhc3RTcGVlZCA9IHRoaXMuc3BlZWQudmFsdWU7XG4gICAgICB0aGlzLnNwZWVkLnZhbHVlID0gdmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZVhGdW5jKHBvc1kpIHtcbiAgICB2YXIgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy54RnVuYywgKHZhbHVlLCBicmVha3BvaW50LCBzY3JvbGxpbmdEb3duLCBhY3R1YWxCcmVha3BvaW50KSA9PiB7XG4gICAgICB0aGlzLnhGdW5jLnZhbHVlID0gYnJlYWtwb2ludDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlQ2FsbGJhY2socG9zWSkge1xuICAgIHZhciB5UHJldiwgJGVsLCBzZWxmO1xuICAgIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICAkZWwgPSB0aGlzLiRlbDtcbiAgICBzZWxmID0gdGhpcztcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMudXBkYXRlLCAodmFsdWUsIGJyZWFrcG9pbnQpID0+IHtcbiAgICAgIHNlbGYudXBkYXRlLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdLmNhbGwoc2VsZiwgJGVsLCBwb3NZLCB5UHJldik7XG4gICAgfSk7XG4gIH1cblxuICBqUXVlcnkoKSB7XG4gICAgJCA9IGpRdWVyeTtcbiAgICBpZiAoISQpIHtcbiAgICAgIHRocm93ICdqUXVlcnkgaXMgbm90IGRlZmluZWQnO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIHN0eWxlRWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIHZhciAkZWwsIGNzcywgeU9mZnNldDtcbiAgICB2YXIge2NlbnRlciwgdG9wfSA9IG9wdGlvbnM7XG4gICAgeU9mZnNldCA9IHRoaXMueU9mZnNldDtcbiAgICBjc3MgPSB7XG4gICAgICAncG9zaXRpb24nOiAnZml4ZWQnLFxuICAgICAgJ2xlZnQnOiAwLFxuICAgICAgJ3JpZ2h0JzogMCxcbiAgICB9O1xuICAgIGlmIChjZW50ZXIudmFsdWUpIHtcbiAgICAgIGNzc1snbWFyZ2luLXJpZ2h0J10gPSAnYXV0byc7XG4gICAgICBjc3NbJ21hcmdpbi1sZWZ0J10gPSAnYXV0byc7XG4gICAgfVxuICAgIGlmICh0b3AudmFsdWUpIHtcbiAgICAgIGNzcy50b3AgPSB0b3AgKyB5T2Zmc2V0ICsgJ3B4JztcbiAgICB9XG4gICAgJGVsID0gJChzZWxlY3Rvcik7XG4gICAgaWYgKCEkZWwubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBgSW52YWxpZCBzZWxlY3RvciBcIiR7c2VsZWN0b3J9XCJgO1xuICAgIH1cbiAgICAkZWwuY3NzKGNzcyk7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBEZWJ1ZyB7XG5cbiAgaW5pdCgpIHtcbiAgICB2YXIgJGRlYnVnZ2VyO1xuXG4gICAgJCgnYm9keScpLmFwcGVuZCgnPHNwYW4gaWQ9XCJwYXJhbGxheGJyb0RlYnVnZ2VyXCI+MDwvc3Bhbj4nKTtcblxuICAgICRkZWJ1Z2dlciA9ICQoJyNwYXJhbGxheGJyb0RlYnVnZ2VyJyk7XG5cbiAgICAkZGVidWdnZXIuY3NzKHtcbiAgICAgICdwb3NpdGlvbic6ICdmaXhlZCcsXG4gICAgICAndG9wJzogJzAnLFxuICAgICAgJ3JpZ2h0JzogJzAnLFxuICAgICAgJ2ZvbnQtc2l6ZSc6ICcxN3B4JyxcbiAgICAgICdjb2xvcic6ICd3aGl0ZScsXG4gICAgICAnYmFja2dyb3VuZCc6ICdibGFjaycsXG4gICAgICAncGFkZGluZyc6ICcxMHB4IDEycHgnLFxuICAgICAgJ3otaW5kZXgnOiAnMTAwMDAwJyxcbiAgICAgICdib3JkZXItdG9wLWxlZnQtcmFkaXVzJzogJzRweCcsXG4gICAgICAnYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1cyc6ICc0cHgnLFxuICAgIH0pO1xuXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgJGRlYnVnZ2VyLmh0bWwoTWF0aC5yb3VuZCh3aW5kb3cucGFnZVlPZmZzZXQpKTtcbiAgICB9LCAyNTApO1xuICB9XG5cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9QYXJhbGxheEJybycpO1xuIiwiY29uc3Qgc2VsZiA9IG1vZHVsZS5leHBvcnRzO1xuXG5zZWxmLmNhbGxCcmVha3BvaW50cyA9IChwb3NZLCB5UHJldiwgYnJlYWtwb2ludHMsIGNhbGxiYWNrKSA9PiB7XG4gIHZhciBzY3JvbGxpbmdEb3duLCB5RGlmZjtcbiAgc2Nyb2xsaW5nRG93biA9IHlQcmV2IDwgcG9zWTtcbiAgeURpZmYgPSBzY3JvbGxpbmdEb3duID8gcG9zWSAtIHlQcmV2IDogeVByZXYgLSBwb3NZO1xuICBicmVha3BvaW50cyA9IGJyZWFrcG9pbnRzLm1hcChicmVha3BvaW50ID0+IHBhcnNlSW50KGJyZWFrcG9pbnQsIDEwKSk7XG4gIC8vIEB0b2RvIC0gd2UgY291bGQgdXNlIGEgZGlmZmVyZW50IHRlY2huaXF1ZSBidXQgdGhpcyBvbmUgd29ya3Mgdy8gbGl0dGxlIGFwYXJlbnQgZG93bnNpZGVzLlxuICBmb3IgKGxldCBpPTA7IGk8eURpZmY7IGkrKykge1xuICAgIGxldCBwb3MsIGluZGV4O1xuICAgIHBvcyA9IHNjcm9sbGluZ0Rvd24gPyB5UHJldiArIGkgOiB5UHJldiAtIGk7XG4gICAgaW5kZXggPSBicmVha3BvaW50cy5pbmRleE9mKHBvcyk7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIGxldCBpID0gc2Nyb2xsaW5nRG93biA/IGluZGV4IDogaW5kZXggLSAxO1xuICAgICAgY2FsbGJhY2suY2FsbChudWxsLCBicmVha3BvaW50c1tpXSwgc2Nyb2xsaW5nRG93biwgYnJlYWtwb2ludHNbaW5kZXhdKTtcbiAgICB9XG4gIH1cbn1cblxuc2VsZi5ydW5VcGRhdGUgPSAocG9zWSwgeVByZXYsIG9iaiwgY2FsbGJhY2spID0+IHtcbiAgdmFyIGJyZWFrcG9pbnRzID0gT2JqZWN0LmtleXMob2JqLmJyZWFrcG9pbnRzKTtcblxuICAvLyBDYWxsIG9uIGluaXQuXG4gIGlmICh5UHJldiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIHZhbHVlID0gb2JqLmJyZWFrcG9pbnRzW3Bvc1ldO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKG51bGwsIHZhbHVlLCBwb3NZLCB0cnVlKTtcbiAgICB9XG4gIH1cbiAgc2VsZi5jYWxsQnJlYWtwb2ludHMocG9zWSwgeVByZXYsIGJyZWFrcG9pbnRzLCAoYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93biwgYWN0dWFsQnJlYWtwb2ludCkgPT4ge1xuICAgIHZhciB2YWx1ZSA9IG9iai5icmVha3BvaW50c1ticmVha3BvaW50XTtcbiAgICBjYWxsYmFjay5jYWxsKG51bGwsIHZhbHVlLCBicmVha3BvaW50LCBzY3JvbGxpbmdEb3duLCBhY3R1YWxCcmVha3BvaW50KTtcbiAgfSk7XG59XG5cbnNlbGYubm9ybWFsaXplT3B0aW9ucyA9IChvcHRpb25zLCBkZWZhdWx0cywgZXhjZXB0aW9ucyA9IFtdKSA9PiB7XG4gIHZhciBrZXlzO1xuXG4gIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gIGtleXMgPSBPYmplY3Qua2V5cyhvcHRpb25zKTtcblxuICAvLyBrZXlzID0ga2V5cy5maWx0ZXIoa2V5ID0+IGV4Y2VwdGlvbnMuaW5kZXhPZihrZXkpID09PSAtMSk7XG5cbiAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgdmFyIHZhbHVlLCBpc09iamVjdDtcbiAgICB2YWx1ZSA9IG9wdGlvbnNba2V5XTtcbiAgICBpc09iamVjdCA9IHNlbGYuaXNUeXBlKHZhbHVlLCAnb2JqZWN0Jyk7XG4gICAgaWYgKGlzT2JqZWN0KSB7XG4gICAgICBsZXQgdmFsdWUxID0gdmFsdWUgJiYgdmFsdWVbJzAnXSA/IHZhbHVlWycwJ10gOiBkZWZhdWx0c1trZXldLnZhbHVlO1xuICAgICAgZGVsZXRlIHZhbHVlLnZhbHVlO1xuICAgICAgb3B0aW9uc1trZXldID0ge1xuICAgICAgICB2YWx1ZTogdmFsdWUxLFxuICAgICAgICBicmVha3BvaW50czogT2JqZWN0LmFzc2lnbih7fSwgezA6IHZhbHVlMX0sIHZhbHVlKSxcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBvcHRpb25zW2tleV0gPSB7XG4gICAgICAgIHZhbHVlLFxuICAgICAgICBicmVha3BvaW50czogezA6IHZhbHVlfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvcHRpb25zO1xufVxuXG4vKipcbiAqIEdpdmVuIGEgTWl4ZWQgdmFsdWUgdHlwZSBjaGVjay5cbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlLlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWMuXG4gKiBAdGVzdHMgdW5pdC5cbiAqL1xuc2VsZi5pc1R5cGUgPSAodmFsdWUsIHR5cGUpID0+IHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBOdW1iZXIuaXNOYU4odmFsdWUpID09PSBmYWxzZTtcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSB8fCB2YWx1ZSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnYXJyYXknOlxuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnbnVsbCc6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGw7XG4gICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJztcbiAgICBjYXNlICdOYU4nOlxuICAgICAgcmV0dXJuIE51bWJlci5pc05hTih2YWx1ZSk7XG4gICAgY2FzZSAnZGF0ZSc6XG4gICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucmVjZ29uaXplZCB0eXBlOiBcIiR7dHlwZX1cImApO1xuICB9XG59O1xuXG5zZWxmLnByZWZpeCA9ICgpID0+IHtcbiAgdmFyIHN0eWxlcywgcHJlLCBkb207XG4gIHN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgJycpLFxuICAgIHByZSA9IChBcnJheS5wcm90b3R5cGUuc2xpY2VcbiAgICAgIC5jYWxsKHN0eWxlcylcbiAgICAgIC5qb2luKCcnKVxuICAgICAgLm1hdGNoKC8tKG1venx3ZWJraXR8bXMpLS8pIHx8IChzdHlsZXMuT0xpbmsgPT09ICcnICYmIFsnJywgJ28nXSlcbiAgICApWzFdLFxuICAgIGRvbSA9ICgnd2Via2l0fE1venxNU3xPJykubWF0Y2gobmV3IFJlZ0V4cCgnKCcgKyBwcmUgKyAnKScsICdpJykpWzFdO1xuICAgIHJldHVybiB7XG4gICAgICBkb206IGRvbSxcbiAgICAgIGxvd2VyY2FzZTogcHJlLFxuICAgICAgY3NzOiAnLScgKyBwcmUgKyAnLScsXG4gICAgICBqczogcHJlWzBdLnRvVXBwZXJDYXNlKCkgKyBwcmUuc3Vic3RyKDEpXG4gICAgfTtcbn07XG4iXX0=
