(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var ParallaxBro = require('../lib');

var laxbro = new ParallaxBro('#parallax', 2900, {
  // debug: true
});

var c1 = laxbro.addCollection('#collection1', {});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmpzIiwibGliL1BhcmFsbGF4QnJvLmpzIiwibGliL1BhcmFsbGF4Q29sbGVjdGlvbi5qcyIsImxpYi9QYXJhbGxheEVsZW1lbnQuanMiLCJsaWIvZGVidWcuanMiLCJsaWIvaW5kZXguanMiLCJsaWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQU0sY0FBYyxRQUFRLFFBQVIsQ0FBcEI7O0FBRUEsSUFBTSxTQUFTLElBQUksV0FBSixDQUFnQixXQUFoQixFQUE2QixJQUE3QixFQUFtQztBQUNoRDtBQURnRCxDQUFuQyxDQUFmOztBQUtBLElBQU0sS0FBSyxPQUFPLGFBQVAsQ0FBcUIsY0FBckIsRUFBcUMsRUFBckMsQ0FBWDtBQUNBLEdBQUcsV0FBSCxDQUFlO0FBQ2IsOEJBQTRCO0FBQzFCLFNBQUssR0FEcUI7QUFFMUIsWUFBUSxJQUZrQjtBQUcxQixXQUFPO0FBSG1CO0FBRGYsQ0FBZjs7QUFRQSxJQUFNLEtBQUssT0FBTyxhQUFQLENBQXFCLGNBQXJCLEVBQXFDLEVBQUMsS0FBSyxJQUFOLEVBQXJDLENBQVg7QUFDQSxHQUFHLFdBQUgsQ0FBZTtBQUNiLHVDQUFxQztBQUNuQyxZQUFRLENBRDJCO0FBRW5DLFdBQU8sR0FGNEI7QUFHbkMsU0FBSyxHQUg4QjtBQUluQyxZQUFRLElBSjJCO0FBS25DLFdBQU87QUFDTCxZQUFNLFdBQUMsSUFBRDtBQUFBLGVBQVUsSUFBVjtBQUFBO0FBREQ7QUFMNEIsR0FEeEI7QUFVYixpREFBK0M7QUFDN0MsV0FBTyxDQURzQztBQUU3QyxZQUFRO0FBRnFDLEdBVmxDO0FBY2IsaURBQStDO0FBQzdDLFNBQUssR0FEd0M7QUFFN0MsV0FBTztBQUNMLFlBQU0sV0FBQyxJQUFEO0FBQUEsZUFBVSxDQUFDLElBQVg7QUFBQTtBQURELEtBRnNDO0FBSzdDLFdBQU87QUFDTCxTQUFHLEdBREU7QUFF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QUFQLE9BQWlCLFFBQXhCO0FBQ0YsU0FBSyxLQUFMO0FBQ0UsYUFBTyxPQUFPLEtBQVAsQ0FBYSxLQUFiLENBQVA7QUFDRixTQUFLLE1BQUw7QUFDRSxhQUFPLGlCQUFpQixJQUF4QjtBQUNGO0FBQ0UsWUFBTSxJQUFJLEtBQUosMEJBQWlDLElBQWpDLE9BQU47QUF4Qko7QUEwQkQsQ0EzQkQ7O0FBNkJBLEtBQUssTUFBTCxHQUFjLFlBQU07QUFDbEIsTUFBSSxNQUFKLEVBQVksR0FBWixFQUFpQixHQUFqQjtBQUNBLFdBQVMsT0FBTyxnQkFBUCxDQUF3QixTQUFTLGVBQWpDLEVBQWtELEVBQWxELENBQVQsRUFDRSxNQUFNLENBQUMsTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBQ0osSUFESSxDQUNDLE1BREQsRUFFSixJQUZJLENBRUMsRUFGRCxFQUdKLEtBSEksQ0FHRSxtQkFIRixLQUcyQixPQUFPLEtBQVAsS0FBaUIsRUFBakIsSUFBdUIsQ0FBQyxFQUFELEVBQUssR0FBTCxDQUhuRCxFQUlKLENBSkksQ0FEUixFQU1FLE1BQU8saUJBQUQsQ0FBb0IsS0FBcEIsQ0FBMEIsSUFBSSxNQUFKLENBQVcsTUFBTSxHQUFOLEdBQVksR0FBdkIsRUFBNEIsR0FBNUIsQ0FBMUIsRUFBNEQsQ0FBNUQsQ0FOUjtBQU9FLFNBQU87QUFDTCxTQUFLLEdBREE7QUFFTCxlQUFXLEdBRk47QUFHTCxTQUFLLE1BQU0sR0FBTixHQUFZLEdBSFo7QUFJTCxRQUFJLElBQUksQ0FBSixFQUFPLFdBQVAsS0FBdUIsSUFBSSxNQUFKLENBQVcsQ0FBWDtBQUp0QixHQUFQO0FBTUgsQ0FmRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBQYXJhbGxheEJybyA9IHJlcXVpcmUoJy4uL2xpYicpO1xuXG5jb25zdCBsYXhicm8gPSBuZXcgUGFyYWxsYXhCcm8oJyNwYXJhbGxheCcsIDI5MDAsIHtcbiAgLy8gZGVidWc6IHRydWVcbn0pO1xuXG5cbmNvbnN0IGMxID0gbGF4YnJvLmFkZENvbGxlY3Rpb24oJyNjb2xsZWN0aW9uMScsIHt9KTtcbmMxLmFkZEVsZW1lbnRzKHtcbiAgJ1tzcmM9XCJpbWFnZXMvaW50cm8uanBnXCJdJzoge1xuICAgIHRvcDogMjAwLFxuICAgIGNlbnRlcjogdHJ1ZSxcbiAgICBzcGVlZDogLjYsXG4gIH0sXG59KTtcblxuY29uc3QgYzIgPSBsYXhicm8uYWRkQ29sbGVjdGlvbignI2NvbGxlY3Rpb24yJywge3RvcDogMTAwMH0pO1xuYzIuYWRkRWxlbWVudHMoe1xuICAnW3NyYz1cImltYWdlcy9wcm9qZWN0LWxhdW5jaC5qcGdcIl0nOiB7XG4gICAgekluZGV4OiAxLFxuICAgIHNwZWVkOiAxLjMsXG4gICAgdG9wOiA3MDAsXG4gICAgY2VudGVyOiB0cnVlLFxuICAgIHhGdW5jOiB7XG4gICAgICAxMjAwOiAocG9zWSkgPT4gcG9zWVxuICAgIH0sXG4gIH0sXG4gICdbc3JjPVwiaW1hZ2VzL3NwbGF0dGVyLXByb2plY3RsYXVuY2gtMS5qcGdcIl0nOiB7XG4gICAgc3BlZWQ6IDEsXG4gICAgY2VudGVyOiB0cnVlLFxuICB9LFxuICAnW3NyYz1cImltYWdlcy9zcGxhdHRlci1wcm9qZWN0bGF1bmNoLTMucG5nXCJdJzoge1xuICAgIHRvcDogMTAwLFxuICAgIHhGdW5jOiB7XG4gICAgICAxMjAwOiAocG9zWSkgPT4gLXBvc1lcbiAgICB9LFxuICAgIHNwZWVkOiB7XG4gICAgICAwOiAxLjUsXG4gICAgICA3MDA6IDAsXG4gICAgICAxMjAwOiAxLjUsXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5jb25zdCBjMyA9IGxheGJyby5hZGRDb2xsZWN0aW9uKCcjY29sbGVjdGlvbjMnLCB7dG9wOiAyMDAwfSk7XG5jMi5hZGRFbGVtZW50cyh7XG4gICdbc3JjPVwiaW1hZ2VzL291dHJvLmpwZ1wiXSc6IHtcbiAgICB0b3A6IDAsXG4gICAgY2VudGVyOiB0cnVlLFxuICAgIHNwZWVkOiB7XG4gICAgICAxNjAwOiAtMSxcbiAgICB9LFxuICAgIHVwZGF0ZToge1xuICAgICAgMDogKCRlbCkgPT4ge1xuICAgICAgICAkZWwuZmFkZU91dCgpO1xuICAgICAgfSxcbiAgICAgIDE2MDA6ICgkZWwpID0+IHtcbiAgICAgICAgJGVsLmZhZGVJbigpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbn0pO1xuIiwiY29uc3QgUGFyYWxsYXhDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9QYXJhbGxheENvbGxlY3Rpb24nKTtcbmNvbnN0IERlYnVnID0gcmVxdWlyZSgnLi9kZWJ1ZycpO1xuXG52YXIgJDtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYXJhbGF4QnJvIHtcblxuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBoZWlnaHQgPSAnMTAwJScsIG9wdGlvbnMpIHtcbiAgICBjb25zdCB7ZGlzYWJsZVN0eWxlcywgZGVidWd9ID0gdGhpcy5fbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKTtcblxuICAgIHRoaXMuY29sbGVjdGlvbnMgPSBbXTtcblxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHRocm93ICdZb3UgbXVzdCBwYXNzIGEgc2VsZWN0b3Igc3RyaW5nIHRvIFBhcmFsYXhCcm8uJztcbiAgICB9XG5cbiAgICB0aGlzLl9qUXVlcnkoKTtcbiAgICB0aGlzLl9jYWNoZURPTUVsZW1lbnRzKHNlbGVjdG9yKTtcbiAgICB0aGlzLl9iaW5kRXZlbnRzKCk7XG4gICAgaWYgKCFkaXNhYmxlU3R5bGVzKSB7XG4gICAgICB0aGlzLl9zdHlsZURPTShoZWlnaHQpO1xuICAgIH1cbiAgICBpZiAoZGVidWcpIHtcbiAgICAgIHRoaXMuX2luaXREZWJ1ZygpO1xuICAgIH1cblxuICAgIHRoaXMuX2h5ZHJhdGVFbGVtZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgYWRkQ29sbGVjdGlvbihzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIHZhciBjb2xsZWN0aW9uO1xuICAgIGNvbGxlY3Rpb24gPSBuZXcgUGFyYWxsYXhDb2xsZWN0aW9uKHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB0aGlzLmNvbGxlY3Rpb25zLnB1c2goY29sbGVjdGlvbik7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cblxuICBfaHlkcmF0ZUVsZW1lbnRzKCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5fbW92ZUVsZW1lbnRzKDApICwwKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB3cmFwcGVyXG4gICAqL1xuICBfY2FjaGVET01FbGVtZW50cyh3cmFwcGVyKSB7XG4gICAgdGhpcy4kZWwgPSB7fTtcbiAgICB0aGlzLiRlbC53aW4gPSAkKHdpbmRvdyk7XG4gICAgdGhpcy4kZWwuZG9jID0gJChkb2N1bWVudCk7XG4gICAgdGhpcy4kZWwuYm9keSA9ICQoJ2JvZHknKTtcbiAgICB0aGlzLiRlbC53cmFwcGVyID0gJCh3cmFwcGVyKTtcbiAgfVxuXG4gIF9pbml0RGVidWcoKSB7XG4gICAgdmFyIGRlYnVnO1xuICAgIGRlYnVnID0gbmV3IERlYnVnKCk7XG4gICAgZGVidWcuaW5pdCgpO1xuICB9XG5cbiAgX3N0eWxlRE9NKGhlaWdodCkge1xuICAgIHZhciB7Ym9keSwgd3JhcHBlciwgZG9jfSA9IHRoaXMuJGVsO1xuICAgIGRvYy5jaGlsZHJlbigpLmNzcygnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICBib2R5LmNzcygnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICB3cmFwcGVyLmNzcyh7XG4gICAgICAnaGVpZ2h0JzogaGVpZ2h0LFxuICAgICAgJ292ZXJmbG93JzogJ3Zpc2libGUnLFxuICAgICAgJ21pbi1oZWlnaHQnOiAnMTAwJScsXG4gICAgICAnYm94LXNpemluZyc6ICdib3JkZXItYm94JyxcbiAgICB9KTtcbiAgICB3cmFwcGVyLmFkZENsYXNzKCdwYXJhbGF4YnJvJyk7XG4gIH1cblxuICBfYmluZEV2ZW50cygpIHtcbiAgICBjb25zdCB0cmFjayA9ICgpID0+IHtcbiAgICAgIHZhciBwb3NZID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgdGhpcy5fbW92ZUVsZW1lbnRzKHBvc1kpO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRyYWNrKTtcbiAgICB9XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRyYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgX21vdmVFbGVtZW50cyhwb3NZKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25zO1xuICAgIGNvbGxlY3Rpb25zID0gdGhpcy5jb2xsZWN0aW9ucztcbiAgICBjb2xsZWN0aW9ucy5mb3JFYWNoKGNvbGxlY3Rpb24gPT4gY29sbGVjdGlvbi5tb3ZlRWxlbWVudHMocG9zWSkpO1xuICB9XG5cbiAgX2pRdWVyeSgpIHtcbiAgICAkID0galF1ZXJ5O1xuICAgIGlmICghJCkge1xuICAgICAgdGhyb3cgJ2pRdWVyeSBpcyBub3QgZGVmaW5lZCc7XG4gICAgfVxuICB9XG5cbiAgX25vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucykge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICB3cmFwcGVyOiAnI3BhcmFsbGF4JyxcbiAgICAgIGRpc2FibGVTdHlsZXM6IGZhbHNlLFxuICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICBkZWJ1ZzogZmFsc2UsXG4gICAgfSwgb3B0aW9ucyk7XG4gIH1cblxufVxuIiwiY29uc3Qge25vcm1hbGl6ZU9wdGlvbnMsIHJ1blVwZGF0ZX0gPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5jb25zdCBQYXJhbGxheEVsZW1lbnQgPSByZXF1aXJlKCcuL1BhcmFsbGF4RWxlbWVudCcpO1xuXG52YXIgJDtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYXJhbGxheENvbGxlY3Rpb24ge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucywge1xuICAgICAgdG9wOiB7dmFsdWU6IDB9LFxuICAgICAgaGlkZToge3ZhbHVlOiBmYWxzZX0sXG4gICAgICB6SW5kZXg6IHt2YWx1ZTogLTF9LFxuICAgICAgdXBkYXRlOiB7dmFsdWU6ICgpID0+IHt9fSxcbiAgICB9KTtcbiAgICBjb25zdCB7dG9wLCBoaWRlLCB6SW5kZXgsIHVwZGF0ZX0gPSBvcHRpb25zO1xuXG4gICAgdGhpcy4kZWw7XG4gICAgdGhpcy5lbGVtZW50cyA9IFtdO1xuICAgIHRoaXMueVByZXY7XG5cbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLmhpZGUgPSBoaWRlO1xuICAgIHRoaXMuekluZGV4ID0gekluZGV4O1xuICAgIHRoaXMudXBkYXRlID0gdXBkYXRlO1xuXG4gICAgdGhpcy5qUXVlcnkoKTtcbiAgICB0aGlzLnN0eWxlQ29sbGVjdGlvbihzZWxlY3Rvciwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgKi9cbiAgYWRkRWxlbWVudHMob2JqKSB7XG4gICAgdmFyIHNlbGVjdG9ycywgdG9wLCBoZWlnaHQ7XG4gICAgc2VsZWN0b3JzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICBoZWlnaHQgPSAwO1xuICAgIHNlbGVjdG9ycy5mb3JFYWNoKHNlbGVjdG9yID0+IHtcbiAgICAgIHZhciBvcHRpb25zID0gb2JqW3NlbGVjdG9yXTtcbiAgICAgIHRoaXMuX2FkZEVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMpO1xuICAgICAgaGVpZ2h0ICs9ICQoc2VsZWN0b3IpLm91dGVySGVpZ2h0KCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBfYWRkRWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIHZhciBlbGVtZW50O1xuICAgIGVsZW1lbnQgPSBuZXcgUGFyYWxsYXhFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zLCB0aGlzLnRvcCk7XG4gICAgdGhpcy5lbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBtb3ZlRWxlbWVudHMocG9zWSkge1xuICAgIHZhciBlbGVtZW50cztcbiAgICBlbGVtZW50cyA9IHRoaXMuZWxlbWVudHM7XG4gICAgdGhpcy5ydW5DYWxsYmFja3MocG9zWSk7XG4gICAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IGVsZW1lbnQubW92ZUVsZW1lbnQocG9zWSkpO1xuICAgIHRoaXMueVByZXYgPSBwb3NZO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBydW5DYWxsYmFja3MocG9zWSkge1xuICAgIHRoaXMudXBkYXRlSGlkZShwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZVppbmRleChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZUNhbGxiYWNrKHBvc1kpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVIaWRlKHBvc1kpIHtcbiAgICB2YXIgcHJldlkgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgdGhpcy5oaWRlLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuaGlkZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy4kZWwuY3NzKCdvcGFjaXR5JywgdmFsdWUgPyAwIDogMSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZVppbmRleChwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuekluZGV4LCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuekluZGV4LnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLiRlbC5jc3MoJ3pJbmRleCcsIHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlQ2FsbGJhY2socG9zWSkge1xuICAgIHZhciB5UHJldiwgJGVsLCBzZWxmO1xuICAgIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICAkZWwgPSB0aGlzLiRlbDtcbiAgICBzZWxmID0gdGhpcztcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMudXBkYXRlLCAodmFsdWUsIGJyZWFrcG9pbnQpID0+IHtcbiAgICAgIHNlbGYudXBkYXRlLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdLmNhbGwoc2VsZiwgJGVsLCBwb3NZLCB5UHJldik7XG4gICAgfSk7XG4gIH1cblxuICBqUXVlcnkoKSB7XG4gICAgJCA9IGpRdWVyeTtcbiAgICBpZiAoISQpIHtcbiAgICAgIHRocm93ICdqUXVlcnkgaXMgbm90IGRlZmluZWQnO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIHN0eWxlQ29sbGVjdGlvbihzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIHZhciAkZWwsIGNzcztcbiAgICB2YXIge3pJbmRleCwgaGlkZX0gPSBvcHRpb25zO1xuICAgIGNzcyA9IHt9O1xuICAgIGNzcy56SW5kZXggPSB6SW5kZXgudmFsdWU7XG4gICAgaWYgKGhpZGUudmFsdWUpIHtcbiAgICAgIGNzcy5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cbiAgICAkZWwgPSAkKHNlbGVjdG9yKTtcbiAgICAkZWwuY3NzKGNzcyk7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxufVxuIiwiY29uc3Qge3ByZWZpeCwgbm9ybWFsaXplT3B0aW9ucywgcnVuVXBkYXRlfSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxsYXhFbGVtZW50IHtcblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvZmZzZXRUb3BcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBvcHRpb25zLCBvZmZzZXRUb3ApIHtcbiAgICBvcHRpb25zID0gbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zLCB7XG4gICAgICB0b3A6IHt2YWx1ZTogMH0sXG4gICAgICBoaWRlOiB7dmFsdWU6IGZhbHNlfSxcbiAgICAgIHpJbmRleDoge3ZhbHVlOiAtMX0sXG4gICAgICBzcGVlZDoge3ZhbHVlOiAxfSxcbiAgICAgIGNlbnRlcjoge3ZhbHVlOiBmYWxzZX0sXG4gICAgICB1cGRhdGU6IHt2YWx1ZTogKCkgPT4ge319LFxuICAgICAgeEZ1bmM6IHt2YWx1ZTogMH0sXG4gICAgfSk7XG5cblxuICAgIGNvbnN0IHt0b3AsIGhpZGUsIHpJbmRleCwgc3BlZWQsIGNlbnRlciwgdXBkYXRlLCB4RnVuY30gPSBvcHRpb25zO1xuXG4gICAgdGhpcy4kZWw7XG4gICAgdGhpcy5wcmVmaXggPSBwcmVmaXgoKTtcbiAgICB0aGlzLm9mZnNldFRvcCA9IG9mZnNldFRvcDtcbiAgICB0aGlzLnlPZmZzZXQgPSBvZmZzZXRUb3AudmFsdWU7XG4gICAgdGhpcy55UHJldjtcbiAgICB0aGlzLnRQcmV2O1xuXG4gICAgdGhpcy50b3AgPSB0b3A7XG4gICAgdGhpcy5oaWRlID0gaGlkZTtcbiAgICB0aGlzLnpJbmRleCA9IHpJbmRleDtcbiAgICB0aGlzLnNwZWVkID0gc3BlZWQ7XG4gICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XG4gICAgdGhpcy51cGRhdGUgPSB1cGRhdGU7XG4gICAgdGhpcy54RnVuYyA9IHhGdW5jO1xuXG4gICAgdGhpcy5qUXVlcnkoKTtcbiAgICB0aGlzLnN0eWxlRWxlbWVudChzZWxlY3Rvciwge2NlbnRlciwgdG9wfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIG1vdmVFbGVtZW50KHBvc1kpIHtcbiAgICB2YXIgJGVsLCB5UHJldiwgdFByZXYsIHlOZXcsIHhOZXcsIHhGdW5jLCBmdW5jLCBzcGVlZCwgYnJlYWtwb2ludCwgcHJldkJyZWFrcG9pbnQsIGRlbHRhLCBwcmVmaXhcblxuICAgIHRoaXMucnVuQ2FsbGJhY2tzKHBvc1kpO1xuXG4gICAgeVByZXYgPSB0aGlzLnlQcmV2IHx8IDA7XG4gICAgdFByZXYgPSB0aGlzLnRQcmV2IHx8IDA7XG4gICAgcHJlZml4ID0gdGhpcy5wcmVmaXg7XG4gICAgeEZ1bmMgPSB0aGlzLnhGdW5jO1xuICAgICRlbCA9IHRoaXMuJGVsO1xuICAgIHNwZWVkID0gdGhpcy5zcGVlZC52YWx1ZTtcbiAgICBicmVha3BvaW50ID0gdGhpcy5zcGVlZC5fYnJlYWtwb2ludDtcblxuICAgIGlmIChicmVha3BvaW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGxldCBsYXN0U3BlZWQsIHlEaWZmO1xuICAgICAgZGVsdGEgPSAwO1xuICAgICAgbGFzdFNwZWVkID0gdGhpcy5zcGVlZC5fbGFzdFNwZWVkO1xuXG4gICAgICB5RGlmZiA9IHlQcmV2IC0gYnJlYWtwb2ludDtcbiAgICAgIGRlbHRhICs9IE1hdGgucm91bmQoeURpZmYqbGFzdFNwZWVkKjEwMCkgLyAxMDA7XG5cbiAgICAgIHlEaWZmID0gYnJlYWtwb2ludCAtIHBvc1k7XG4gICAgICBkZWx0YSArPSBNYXRoLnJvdW5kKHlEaWZmKnNwZWVkKjEwMCkgLyAxMDA7XG5cbiAgICAgIHRoaXMuc3BlZWQuX2JyZWFrcG9pbnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IHlEaWZmO1xuICAgICAgZGVsdGEgPSAwO1xuICAgICAgeURpZmYgPSB5UHJldiAtIHBvc1k7XG4gICAgICBkZWx0YSA9IE1hdGgucm91bmQoeURpZmYqc3BlZWQqMTAwKSAvIDEwMDtcbiAgICB9XG5cbiAgICB5TmV3ID0gdFByZXYgKyBkZWx0YTtcbiAgICBmdW5jID0geEZ1bmMuYnJlYWtwb2ludHNbeEZ1bmMudmFsdWVdO1xuICAgIHhOZXcgPSBmdW5jID8gZnVuYy5jYWxsKG51bGwsIHBvc1kgLSB4RnVuYy52YWx1ZSkgOiAwO1xuXG4gICAgJGVsWzBdLnN0eWxlW3ByZWZpeC5kb20gKyAnVHJhbnNmb3JtJ10gPSBgdHJhbnNsYXRlM2QoJHt4TmV3fXB4LCAke3lOZXd9cHgsIDApIHRyYW5zbGF0ZVooMCkgc2NhbGUoMSlgO1xuICAgIHRoaXMueVByZXYgPSBwb3NZO1xuICAgIHRoaXMudFByZXYgPSB5TmV3O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBydW5DYWxsYmFja3MocG9zWSkge1xuICAgIHRoaXMudXBkYXRlSGlkZShwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZVppbmRleChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZVRvcChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZU9mZnNldChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZVNwZWVkKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlWEZ1bmMocG9zWSk7XG4gICAgdGhpcy51cGRhdGVDYWxsYmFjayhwb3NZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlSGlkZShwb3NZKSB7XG4gICAgdmFyIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMuaGlkZSwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLmhpZGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuJGVsLmNzcygnZGlzcGxheScsIHZhbHVlID8gJ25vbmUnIDogJ2Jsb2NrJyk7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVaaW5kZXgocG9zWSkge1xuICAgIHZhciBwcmV2WSA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHByZXZZLCB0aGlzLnpJbmRleCwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLnpJbmRleC52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy4kZWwuY3NzKCd6SW5kZXgnLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZVRvcChwb3NZKSB7XG4gICAgdmFyIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMudG9wLCAodmFsdWUpID0+IHtcbiAgICAgIHZhciB5T2Zmc2V0ID0gdGhpcy55T2Zmc2V0O1xuICAgICAgdGhpcy50b3AudmFsdWUgPSB2YWx1ZSA9IHZhbHVlICsgeU9mZnNldDtcbiAgICAgIHRoaXMuJGVsLmNzcygndG9wJywgdmFsdWUgKyAncHgnKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlT2Zmc2V0KHBvc1kpIHtcbiAgICB2YXIgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy5vZmZzZXRUb3AsICh2YWx1ZSkgPT4ge1xuICAgICAgdmFyIHlEaWZmLCB0b3A7XG4gICAgICB5RGlmZiA9IHZhbHVlIC0gdGhpcy55T2Zmc2V0O1xuICAgICAgdGhpcy55T2Zmc2V0ID0gdmFsdWU7XG4gICAgICB0b3AgPSBwYXJzZUludCh0aGlzLiRlbC5jc3MoJ3RvcCcpLCAxMCk7XG4gICAgICB0aGlzLiRlbC5jc3MoJ3RvcCcsIHRvcCArIHlEaWZmICsgJ3B4Jyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZVNwZWVkKHBvc1kpIHtcbiAgICB2YXIgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy5zcGVlZCwgKHZhbHVlLCBicmVha3BvaW50LCBzY3JvbGxpbmdEb3duLCBhY3R1YWxCcmVha3BvaW50KSA9PiB7XG4gICAgICB0aGlzLnNwZWVkLl9icmVha3BvaW50ID0gYWN0dWFsQnJlYWtwb2ludDtcbiAgICAgIHRoaXMuc3BlZWQuX2xhc3RTcGVlZCA9IHRoaXMuc3BlZWQudmFsdWU7XG4gICAgICB0aGlzLnNwZWVkLnZhbHVlID0gdmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZVhGdW5jKHBvc1kpIHtcbiAgICB2YXIgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy54RnVuYywgKHZhbHVlLCBicmVha3BvaW50LCBzY3JvbGxpbmdEb3duLCBhY3R1YWxCcmVha3BvaW50KSA9PiB7XG4gICAgICB0aGlzLnhGdW5jLnZhbHVlID0gYnJlYWtwb2ludDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlQ2FsbGJhY2socG9zWSkge1xuICAgIHZhciB5UHJldiwgJGVsLCBzZWxmO1xuICAgIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICAkZWwgPSB0aGlzLiRlbDtcbiAgICBzZWxmID0gdGhpcztcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMudXBkYXRlLCAodmFsdWUsIGJyZWFrcG9pbnQpID0+IHtcbiAgICAgIHNlbGYudXBkYXRlLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdLmNhbGwoc2VsZiwgJGVsLCBwb3NZLCB5UHJldik7XG4gICAgfSk7XG4gIH1cblxuICBqUXVlcnkoKSB7XG4gICAgJCA9IGpRdWVyeTtcbiAgICBpZiAoISQpIHtcbiAgICAgIHRocm93ICdqUXVlcnkgaXMgbm90IGRlZmluZWQnO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIHN0eWxlRWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIHZhciAkZWwsIGNzcywgeU9mZnNldDtcbiAgICB2YXIge2NlbnRlciwgdG9wfSA9IG9wdGlvbnM7XG4gICAgeU9mZnNldCA9IHRoaXMueU9mZnNldDtcbiAgICBjc3MgPSB7XG4gICAgICAncG9zaXRpb24nOiAnZml4ZWQnLFxuICAgICAgJ2xlZnQnOiAwLFxuICAgICAgJ3JpZ2h0JzogMCxcbiAgICB9O1xuICAgIGlmIChjZW50ZXIudmFsdWUpIHtcbiAgICAgIGNzc1snbWFyZ2luLXJpZ2h0J10gPSAnYXV0byc7XG4gICAgICBjc3NbJ21hcmdpbi1sZWZ0J10gPSAnYXV0byc7XG4gICAgfVxuICAgIGlmICh0b3AudmFsdWUpIHtcbiAgICAgIGNzcy50b3AgPSB0b3AgKyB5T2Zmc2V0ICsgJ3B4JztcbiAgICB9XG4gICAgJGVsID0gJChzZWxlY3Rvcik7XG4gICAgaWYgKCEkZWwubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBgSW52YWxpZCBzZWxlY3RvciBcIiR7c2VsZWN0b3J9XCJgO1xuICAgIH1cbiAgICAkZWwuY3NzKGNzcyk7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBEZWJ1ZyB7XG5cbiAgaW5pdCgpIHtcbiAgICB2YXIgJGRlYnVnZ2VyO1xuXG4gICAgJCgnYm9keScpLmFwcGVuZCgnPHNwYW4gaWQ9XCJwYXJhbGxheGJyb0RlYnVnZ2VyXCI+MDwvc3Bhbj4nKTtcblxuICAgICRkZWJ1Z2dlciA9ICQoJyNwYXJhbGxheGJyb0RlYnVnZ2VyJyk7XG5cbiAgICAkZGVidWdnZXIuY3NzKHtcbiAgICAgICdwb3NpdGlvbic6ICdmaXhlZCcsXG4gICAgICAndG9wJzogJzAnLFxuICAgICAgJ3JpZ2h0JzogJzAnLFxuICAgICAgJ2ZvbnQtc2l6ZSc6ICcxN3B4JyxcbiAgICAgICdjb2xvcic6ICd3aGl0ZScsXG4gICAgICAnYmFja2dyb3VuZCc6ICdibGFjaycsXG4gICAgICAncGFkZGluZyc6ICcxMHB4IDEycHgnLFxuICAgICAgJ3otaW5kZXgnOiAnMTAwMDAwJyxcbiAgICAgICdib3JkZXItdG9wLWxlZnQtcmFkaXVzJzogJzRweCcsXG4gICAgICAnYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1cyc6ICc0cHgnLFxuICAgIH0pO1xuXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgJGRlYnVnZ2VyLmh0bWwoTWF0aC5yb3VuZCh3aW5kb3cucGFnZVlPZmZzZXQpKTtcbiAgICB9LCAyNTApO1xuICB9XG5cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9QYXJhbGxheEJybycpO1xuIiwiY29uc3Qgc2VsZiA9IG1vZHVsZS5leHBvcnRzO1xuXG5zZWxmLmNhbGxCcmVha3BvaW50cyA9IChwb3NZLCB5UHJldiwgYnJlYWtwb2ludHMsIGNhbGxiYWNrKSA9PiB7XG4gIHZhciBzY3JvbGxpbmdEb3duLCB5RGlmZjtcbiAgc2Nyb2xsaW5nRG93biA9IHlQcmV2IDwgcG9zWTtcbiAgeURpZmYgPSBzY3JvbGxpbmdEb3duID8gcG9zWSAtIHlQcmV2IDogeVByZXYgLSBwb3NZO1xuICBicmVha3BvaW50cyA9IGJyZWFrcG9pbnRzLm1hcChicmVha3BvaW50ID0+IHBhcnNlSW50KGJyZWFrcG9pbnQsIDEwKSk7XG4gIC8vIEB0b2RvIC0gd2UgY291bGQgdXNlIGEgZGlmZmVyZW50IHRlY2huaXF1ZSBidXQgdGhpcyBvbmUgd29ya3Mgdy8gbGl0dGxlIGFwYXJlbnQgZG93bnNpZGVzLlxuICBmb3IgKGxldCBpPTA7IGk8eURpZmY7IGkrKykge1xuICAgIGxldCBwb3MsIGluZGV4O1xuICAgIHBvcyA9IHNjcm9sbGluZ0Rvd24gPyB5UHJldiArIGkgOiB5UHJldiAtIGk7XG4gICAgaW5kZXggPSBicmVha3BvaW50cy5pbmRleE9mKHBvcyk7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIGxldCBpID0gc2Nyb2xsaW5nRG93biA/IGluZGV4IDogaW5kZXggLSAxO1xuICAgICAgY2FsbGJhY2suY2FsbChudWxsLCBicmVha3BvaW50c1tpXSwgc2Nyb2xsaW5nRG93biwgYnJlYWtwb2ludHNbaW5kZXhdKTtcbiAgICB9XG4gIH1cbn1cblxuc2VsZi5ydW5VcGRhdGUgPSAocG9zWSwgeVByZXYsIG9iaiwgY2FsbGJhY2spID0+IHtcbiAgdmFyIGJyZWFrcG9pbnRzID0gT2JqZWN0LmtleXMob2JqLmJyZWFrcG9pbnRzKTtcblxuICAvLyBDYWxsIG9uIGluaXQuXG4gIGlmICh5UHJldiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIHZhbHVlID0gb2JqLmJyZWFrcG9pbnRzW3Bvc1ldO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKG51bGwsIHZhbHVlLCBwb3NZLCB0cnVlKTtcbiAgICB9XG4gIH1cbiAgc2VsZi5jYWxsQnJlYWtwb2ludHMocG9zWSwgeVByZXYsIGJyZWFrcG9pbnRzLCAoYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93biwgYWN0dWFsQnJlYWtwb2ludCkgPT4ge1xuICAgIHZhciB2YWx1ZSA9IG9iai5icmVha3BvaW50c1ticmVha3BvaW50XTtcbiAgICBjYWxsYmFjay5jYWxsKG51bGwsIHZhbHVlLCBicmVha3BvaW50LCBzY3JvbGxpbmdEb3duLCBhY3R1YWxCcmVha3BvaW50KTtcbiAgfSk7XG59XG5cbnNlbGYubm9ybWFsaXplT3B0aW9ucyA9IChvcHRpb25zLCBkZWZhdWx0cywgZXhjZXB0aW9ucyA9IFtdKSA9PiB7XG4gIHZhciBrZXlzO1xuXG4gIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gIGtleXMgPSBPYmplY3Qua2V5cyhvcHRpb25zKTtcblxuICAvLyBrZXlzID0ga2V5cy5maWx0ZXIoa2V5ID0+IGV4Y2VwdGlvbnMuaW5kZXhPZihrZXkpID09PSAtMSk7XG5cbiAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgdmFyIHZhbHVlLCBpc09iamVjdDtcbiAgICB2YWx1ZSA9IG9wdGlvbnNba2V5XTtcbiAgICBpc09iamVjdCA9IHNlbGYuaXNUeXBlKHZhbHVlLCAnb2JqZWN0Jyk7XG4gICAgaWYgKGlzT2JqZWN0KSB7XG4gICAgICBsZXQgdmFsdWUxID0gdmFsdWUgJiYgdmFsdWVbJzAnXSA/IHZhbHVlWycwJ10gOiBkZWZhdWx0c1trZXldLnZhbHVlO1xuICAgICAgZGVsZXRlIHZhbHVlLnZhbHVlO1xuICAgICAgb3B0aW9uc1trZXldID0ge1xuICAgICAgICB2YWx1ZTogdmFsdWUxLFxuICAgICAgICBicmVha3BvaW50czogT2JqZWN0LmFzc2lnbih7fSwgezA6IHZhbHVlMX0sIHZhbHVlKSxcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBvcHRpb25zW2tleV0gPSB7XG4gICAgICAgIHZhbHVlLFxuICAgICAgICBicmVha3BvaW50czogezA6IHZhbHVlfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvcHRpb25zO1xufVxuXG4vKipcbiAqIEdpdmVuIGEgTWl4ZWQgdmFsdWUgdHlwZSBjaGVjay5cbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlLlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWMuXG4gKiBAdGVzdHMgdW5pdC5cbiAqL1xuc2VsZi5pc1R5cGUgPSAodmFsdWUsIHR5cGUpID0+IHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBOdW1iZXIuaXNOYU4odmFsdWUpID09PSBmYWxzZTtcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSB8fCB2YWx1ZSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnYXJyYXknOlxuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnbnVsbCc6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGw7XG4gICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJztcbiAgICBjYXNlICdOYU4nOlxuICAgICAgcmV0dXJuIE51bWJlci5pc05hTih2YWx1ZSk7XG4gICAgY2FzZSAnZGF0ZSc6XG4gICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucmVjZ29uaXplZCB0eXBlOiBcIiR7dHlwZX1cImApO1xuICB9XG59O1xuXG5zZWxmLnByZWZpeCA9ICgpID0+IHtcbiAgdmFyIHN0eWxlcywgcHJlLCBkb207XG4gIHN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgJycpLFxuICAgIHByZSA9IChBcnJheS5wcm90b3R5cGUuc2xpY2VcbiAgICAgIC5jYWxsKHN0eWxlcylcbiAgICAgIC5qb2luKCcnKVxuICAgICAgLm1hdGNoKC8tKG1venx3ZWJraXR8bXMpLS8pIHx8IChzdHlsZXMuT0xpbmsgPT09ICcnICYmIFsnJywgJ28nXSlcbiAgICApWzFdLFxuICAgIGRvbSA9ICgnd2Via2l0fE1venxNU3xPJykubWF0Y2gobmV3IFJlZ0V4cCgnKCcgKyBwcmUgKyAnKScsICdpJykpWzFdO1xuICAgIHJldHVybiB7XG4gICAgICBkb206IGRvbSxcbiAgICAgIGxvd2VyY2FzZTogcHJlLFxuICAgICAgY3NzOiAnLScgKyBwcmUgKyAnLScsXG4gICAgICBqczogcHJlWzBdLnRvVXBwZXJDYXNlKCkgKyBwcmUuc3Vic3RyKDEpXG4gICAgfTtcbn07XG4iXX0=
