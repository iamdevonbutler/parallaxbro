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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmpzIiwibGliL1BhcmFsbGF4QnJvLmpzIiwibGliL1BhcmFsbGF4Q29sbGVjdGlvbi5qcyIsImxpYi9QYXJhbGxheEVsZW1lbnQuanMiLCJsaWIvZGVidWcuanMiLCJsaWIvaW5kZXguanMiLCJsaWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQU0sY0FBYyxRQUFRLFFBQVIsQ0FBcEI7O0FBRUEsSUFBTSxTQUFTLElBQUksV0FBSixDQUFnQixXQUFoQixFQUE2QixJQUE3QixFQUFtQztBQUNoRDtBQURnRCxDQUFuQyxDQUFmOztBQUtBLElBQU0sS0FBSyxPQUFPLGFBQVAsQ0FBcUIsY0FBckIsQ0FBWDtBQUNBLEdBQUcsV0FBSCxDQUFlO0FBQ2IsOEJBQTRCO0FBQzFCLFNBQUssR0FEcUI7QUFFMUIsWUFBUSxJQUZrQjtBQUcxQixXQUFPO0FBSG1CO0FBRGYsQ0FBZjs7QUFRQSxJQUFNLEtBQUssT0FBTyxhQUFQLENBQXFCLGNBQXJCLEVBQXFDLEVBQUMsS0FBSyxJQUFOLEVBQXJDLENBQVg7QUFDQSxHQUFHLFdBQUgsQ0FBZTtBQUNiLHVDQUFxQztBQUNuQyxZQUFRLENBRDJCO0FBRW5DLFdBQU8sR0FGNEI7QUFHbkMsU0FBSyxHQUg4QjtBQUluQyxZQUFRLElBSjJCO0FBS25DLFdBQU87QUFDTCxZQUFNLFdBQUMsSUFBRDtBQUFBLGVBQVUsSUFBVjtBQUFBO0FBREQ7QUFMNEIsR0FEeEI7QUFVYixpREFBK0M7QUFDN0MsV0FBTyxDQURzQztBQUU3QyxZQUFRO0FBRnFDLEdBVmxDO0FBY2IsaURBQStDO0FBQzdDLFNBQUssR0FEd0M7QUFFN0MsV0FBTztBQUNMLFlBQU0sV0FBQyxJQUFEO0FBQUEsZUFBVSxDQUFDLElBQVg7QUFBQTtBQURELEtBRnNDO0FBSzdDLFdBQU87QUFDTCxTQUFHLEdBREU7QUFFTCxXQUFLLENBRkE7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O0FBQ0UsYUFBTyxPQUFPLEtBQVAsQ0FBYSxLQUFiLENBQVA7QUFDRixTQUFLLE1BQUw7QUFDRSxhQUFPLGlCQUFpQixJQUF4QjtBQUNGO0FBQ0UsWUFBTSxJQUFJLEtBQUosMEJBQWlDLElBQWpDLE9BQU47QUF4Qko7QUEwQkQsQ0EzQkQ7O0FBNkJBLEtBQUssTUFBTCxHQUFjLFlBQU07QUFDbEIsTUFBSSxNQUFKLEVBQVksR0FBWixFQUFpQixHQUFqQjtBQUNBLFdBQVMsT0FBTyxnQkFBUCxDQUF3QixTQUFTLGVBQWpDLEVBQWtELEVBQWxELENBQVQsRUFDRSxNQUFNLENBQUMsTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBQ0osSUFESSxDQUNDLE1BREQsRUFFSixJQUZJLENBRUMsRUFGRCxFQUdKLEtBSEksQ0FHRSxtQkFIRixLQUcyQixPQUFPLEtBQVAsS0FBaUIsRUFBakIsSUFBdUIsQ0FBQyxFQUFELEVBQUssR0FBTCxDQUhuRCxFQUlKLENBSkksQ0FEUixFQU1FLE1BQU8saUJBQUQsQ0FBb0IsS0FBcEIsQ0FBMEIsSUFBSSxNQUFKLENBQVcsTUFBTSxHQUFOLEdBQVksR0FBdkIsRUFBNEIsR0FBNUIsQ0FBMUIsRUFBNEQsQ0FBNUQsQ0FOUjtBQU9FLFNBQU87QUFDTCxTQUFLLEdBREE7QUFFTCxlQUFXLEdBRk47QUFHTCxTQUFLLE1BQU0sR0FBTixHQUFZLEdBSFo7QUFJTCxRQUFJLElBQUksQ0FBSixFQUFPLFdBQVAsS0FBdUIsSUFBSSxNQUFKLENBQVcsQ0FBWDtBQUp0QixHQUFQO0FBTUgsQ0FmRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBQYXJhbGxheEJybyA9IHJlcXVpcmUoJy4uL2xpYicpO1xuXG5jb25zdCBsYXhicm8gPSBuZXcgUGFyYWxsYXhCcm8oJyNwYXJhbGxheCcsIDI5MDAsIHtcbiAgLy8gZGVidWc6IHRydWVcbn0pO1xuXG5cbmNvbnN0IGMxID0gbGF4YnJvLmFkZENvbGxlY3Rpb24oJyNjb2xsZWN0aW9uMScpO1xuYzEuYWRkRWxlbWVudHMoe1xuICAnW3NyYz1cImltYWdlcy9pbnRyby5qcGdcIl0nOiB7XG4gICAgdG9wOiAyMDAsXG4gICAgY2VudGVyOiB0cnVlLFxuICAgIHNwZWVkOiAuNixcbiAgfSxcbn0pO1xuXG5jb25zdCBjMiA9IGxheGJyby5hZGRDb2xsZWN0aW9uKCcjY29sbGVjdGlvbjInLCB7dG9wOiAxMDAwfSk7XG5jMi5hZGRFbGVtZW50cyh7XG4gICdbc3JjPVwiaW1hZ2VzL3Byb2plY3QtbGF1bmNoLmpwZ1wiXSc6IHtcbiAgICB6SW5kZXg6IDEsXG4gICAgc3BlZWQ6IDEuMyxcbiAgICB0b3A6IDcwMCxcbiAgICBjZW50ZXI6IHRydWUsXG4gICAgeEZ1bmM6IHtcbiAgICAgIDEyMDA6IChwb3NZKSA9PiBwb3NZXG4gICAgfSxcbiAgfSxcbiAgJ1tzcmM9XCJpbWFnZXMvc3BsYXR0ZXItcHJvamVjdGxhdW5jaC0xLmpwZ1wiXSc6IHtcbiAgICBzcGVlZDogMSxcbiAgICBjZW50ZXI6IHRydWUsXG4gIH0sXG4gICdbc3JjPVwiaW1hZ2VzL3NwbGF0dGVyLXByb2plY3RsYXVuY2gtMy5wbmdcIl0nOiB7XG4gICAgdG9wOiAxMDAsXG4gICAgeEZ1bmM6IHtcbiAgICAgIDEyMDA6IChwb3NZKSA9PiAtcG9zWVxuICAgIH0sXG4gICAgc3BlZWQ6IHtcbiAgICAgIDA6IDEuNSxcbiAgICAgIDcwMDogMCxcbiAgICAgIDEyMDA6IDEuNSxcbiAgICB9LFxuICB9LFxufSk7XG5cbmNvbnN0IGMzID0gbGF4YnJvLmFkZENvbGxlY3Rpb24oJyNjb2xsZWN0aW9uMycsIHt0b3A6IDIwMDB9KTtcbmMyLmFkZEVsZW1lbnRzKHtcbiAgJ1tzcmM9XCJpbWFnZXMvb3V0cm8uanBnXCJdJzoge1xuICAgIHRvcDogMCxcbiAgICBjZW50ZXI6IHRydWUsXG4gICAgc3BlZWQ6IHtcbiAgICAgIDE2MDA6IC0xLFxuICAgIH0sXG4gICAgdXBkYXRlOiB7XG4gICAgICAwOiAoJGVsKSA9PiB7XG4gICAgICAgICRlbC5mYWRlT3V0KCk7XG4gICAgICB9LFxuICAgICAgMTYwMDogKCRlbCkgPT4ge1xuICAgICAgICAkZWwuZmFkZUluKCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxufSk7XG4iLCJjb25zdCBQYXJhbGxheENvbGxlY3Rpb24gPSByZXF1aXJlKCcuL1BhcmFsbGF4Q29sbGVjdGlvbicpO1xuY29uc3QgRGVidWcgPSByZXF1aXJlKCcuL2RlYnVnJyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsYXhCcm8ge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2VsZWN0b3IsIGhlaWdodCA9ICcxMDAlJywgb3B0aW9ucykge1xuICAgIGNvbnN0IHtkaXNhYmxlU3R5bGVzLCBkZWJ1Z30gPSB0aGlzLl9ub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb2xsZWN0aW9ucyA9IFtdO1xuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgdGhyb3cgJ1lvdSBtdXN0IHBhc3MgYSBzZWxlY3RvciBzdHJpbmcgdG8gUGFyYWxheEJyby4nO1xuICAgIH1cblxuICAgIHRoaXMuX2pRdWVyeSgpO1xuICAgIHRoaXMuX2NhY2hlRE9NRWxlbWVudHMoc2VsZWN0b3IpO1xuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcbiAgICBpZiAoIWRpc2FibGVTdHlsZXMpIHtcbiAgICAgIHRoaXMuX3N0eWxlRE9NKGhlaWdodCk7XG4gICAgfVxuICAgIGlmIChkZWJ1Zykge1xuICAgICAgdGhpcy5faW5pdERlYnVnKCk7XG4gICAgfVxuXG4gICAgdGhpcy5faHlkcmF0ZUVsZW1lbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBhZGRDb2xsZWN0aW9uKHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbGxlY3Rpb247XG4gICAgY29sbGVjdGlvbiA9IG5ldyBQYXJhbGxheENvbGxlY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpO1xuICAgIHRoaXMuY29sbGVjdGlvbnMucHVzaChjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuXG4gIF9oeWRyYXRlRWxlbWVudHMoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLl9tb3ZlRWxlbWVudHMoMCkgLDApXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHdyYXBwZXJcbiAgICovXG4gIF9jYWNoZURPTUVsZW1lbnRzKHdyYXBwZXIpIHtcbiAgICB0aGlzLiRlbCA9IHt9O1xuICAgIHRoaXMuJGVsLndpbiA9ICQod2luZG93KTtcbiAgICB0aGlzLiRlbC5kb2MgPSAkKGRvY3VtZW50KTtcbiAgICB0aGlzLiRlbC5ib2R5ID0gJCgnYm9keScpO1xuICAgIHRoaXMuJGVsLndyYXBwZXIgPSAkKHdyYXBwZXIpO1xuICB9XG5cbiAgX2luaXREZWJ1ZygpIHtcbiAgICB2YXIgZGVidWc7XG4gICAgZGVidWcgPSBuZXcgRGVidWcoKTtcbiAgICBkZWJ1Zy5pbml0KCk7XG4gIH1cblxuICBfc3R5bGVET00oaGVpZ2h0KSB7XG4gICAgdmFyIHtib2R5LCB3cmFwcGVyLCBkb2N9ID0gdGhpcy4kZWw7XG4gICAgZG9jLmNoaWxkcmVuKCkuY3NzKCdoZWlnaHQnLCAnMTAwJScpO1xuICAgIGJvZHkuY3NzKCdoZWlnaHQnLCAnMTAwJScpO1xuICAgIHdyYXBwZXIuY3NzKHtcbiAgICAgICdoZWlnaHQnOiBoZWlnaHQsXG4gICAgICAnb3ZlcmZsb3cnOiAndmlzaWJsZScsXG4gICAgICAnbWluLWhlaWdodCc6ICcxMDAlJyxcbiAgICAgICdib3gtc2l6aW5nJzogJ2JvcmRlci1ib3gnLFxuICAgIH0pO1xuICAgIHdyYXBwZXIuYWRkQ2xhc3MoJ3BhcmFsYXhicm8nKTtcbiAgfVxuXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IHRyYWNrID0gKCkgPT4ge1xuICAgICAgdmFyIHBvc1kgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICB0aGlzLl9tb3ZlRWxlbWVudHMocG9zWSk7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodHJhY2spO1xuICAgIH1cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodHJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBfbW92ZUVsZW1lbnRzKHBvc1kpIHtcbiAgICB2YXIgY29sbGVjdGlvbnM7XG4gICAgY29sbGVjdGlvbnMgPSB0aGlzLmNvbGxlY3Rpb25zO1xuICAgIGNvbGxlY3Rpb25zLmZvckVhY2goY29sbGVjdGlvbiA9PiBjb2xsZWN0aW9uLm1vdmVFbGVtZW50cyhwb3NZKSk7XG4gIH1cblxuICBfalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gIH1cblxuICBfbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgIGRpc2FibGVTdHlsZXM6IGZhbHNlLFxuICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICBkZWJ1ZzogZmFsc2UsXG4gICAgfSwgb3B0aW9ucyk7XG4gIH1cblxufVxuIiwiY29uc3Qge25vcm1hbGl6ZU9wdGlvbnMsIHJ1blVwZGF0ZX0gPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5jb25zdCBQYXJhbGxheEVsZW1lbnQgPSByZXF1aXJlKCcuL1BhcmFsbGF4RWxlbWVudCcpO1xuXG52YXIgJDtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYXJhbGxheENvbGxlY3Rpb24ge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucywge1xuICAgICAgdG9wOiB7dmFsdWU6IDB9LFxuICAgICAgaGlkZToge3ZhbHVlOiBmYWxzZX0sXG4gICAgICB6SW5kZXg6IHt2YWx1ZTogLTF9LFxuICAgICAgdXBkYXRlOiB7dmFsdWU6ICgpID0+IHt9fSxcbiAgICB9KTtcbiAgICBjb25zdCB7dG9wLCBoaWRlLCB6SW5kZXgsIHVwZGF0ZX0gPSBvcHRpb25zO1xuXG4gICAgdGhpcy4kZWw7XG4gICAgdGhpcy5lbGVtZW50cyA9IFtdO1xuICAgIHRoaXMueVByZXY7XG5cbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLmhpZGUgPSBoaWRlO1xuICAgIHRoaXMuekluZGV4ID0gekluZGV4O1xuICAgIHRoaXMudXBkYXRlID0gdXBkYXRlO1xuXG4gICAgdGhpcy5qUXVlcnkoKTtcbiAgICB0aGlzLnN0eWxlQ29sbGVjdGlvbihzZWxlY3Rvciwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgKi9cbiAgYWRkRWxlbWVudHMob2JqKSB7XG4gICAgdmFyIHNlbGVjdG9ycywgdG9wLCBoZWlnaHQ7XG4gICAgc2VsZWN0b3JzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICBoZWlnaHQgPSAwO1xuICAgIHNlbGVjdG9ycy5mb3JFYWNoKHNlbGVjdG9yID0+IHtcbiAgICAgIHZhciBvcHRpb25zID0gb2JqW3NlbGVjdG9yXTtcbiAgICAgIHRoaXMuX2FkZEVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMpO1xuICAgICAgaGVpZ2h0ICs9ICQoc2VsZWN0b3IpLm91dGVySGVpZ2h0KCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBfYWRkRWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIHZhciBlbGVtZW50O1xuICAgIGVsZW1lbnQgPSBuZXcgUGFyYWxsYXhFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zLCB0aGlzLnRvcCk7XG4gICAgdGhpcy5lbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBtb3ZlRWxlbWVudHMocG9zWSkge1xuICAgIHZhciBlbGVtZW50cztcbiAgICBlbGVtZW50cyA9IHRoaXMuZWxlbWVudHM7XG4gICAgdGhpcy5ydW5DYWxsYmFja3MocG9zWSk7XG4gICAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IGVsZW1lbnQubW92ZUVsZW1lbnQocG9zWSkpO1xuICAgIHRoaXMueVByZXYgPSBwb3NZO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBydW5DYWxsYmFja3MocG9zWSkge1xuICAgIHRoaXMudXBkYXRlSGlkZShwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZVppbmRleChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZUNhbGxiYWNrKHBvc1kpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVIaWRlKHBvc1kpIHtcbiAgICB2YXIgcHJldlkgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgdGhpcy5oaWRlLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuaGlkZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy4kZWwuY3NzKCdvcGFjaXR5JywgdmFsdWUgPyAwIDogMSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZVppbmRleChwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuekluZGV4LCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuekluZGV4LnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLiRlbC5jc3MoJ3pJbmRleCcsIHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlQ2FsbGJhY2socG9zWSkge1xuICAgIHZhciB5UHJldiwgJGVsLCBzZWxmO1xuICAgIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICAkZWwgPSB0aGlzLiRlbDtcbiAgICBzZWxmID0gdGhpcztcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMudXBkYXRlLCAodmFsdWUsIGJyZWFrcG9pbnQpID0+IHtcbiAgICAgIHNlbGYudXBkYXRlLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdLmNhbGwoc2VsZiwgJGVsLCBwb3NZLCB5UHJldik7XG4gICAgfSk7XG4gIH1cblxuICBqUXVlcnkoKSB7XG4gICAgJCA9IGpRdWVyeTtcbiAgICBpZiAoISQpIHtcbiAgICAgIHRocm93ICdqUXVlcnkgaXMgbm90IGRlZmluZWQnO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIHN0eWxlQ29sbGVjdGlvbihzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIHZhciAkZWwsIGNzcztcbiAgICB2YXIge3pJbmRleCwgaGlkZX0gPSBvcHRpb25zO1xuICAgIGNzcyA9IHt9O1xuICAgIGNzcy56SW5kZXggPSB6SW5kZXgudmFsdWU7XG4gICAgaWYgKGhpZGUudmFsdWUpIHtcbiAgICAgIGNzcy5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cbiAgICAkZWwgPSAkKHNlbGVjdG9yKTtcbiAgICAkZWwuY3NzKGNzcyk7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxufVxuIiwiY29uc3Qge3ByZWZpeCwgbm9ybWFsaXplT3B0aW9ucywgcnVuVXBkYXRlfSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxsYXhFbGVtZW50IHtcblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvZmZzZXRUb3BcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBvcHRpb25zLCBvZmZzZXRUb3ApIHtcbiAgICBvcHRpb25zID0gbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zLCB7XG4gICAgICB0b3A6IHt2YWx1ZTogMH0sXG4gICAgICBoaWRlOiB7dmFsdWU6IGZhbHNlfSxcbiAgICAgIHpJbmRleDoge3ZhbHVlOiAtMX0sXG4gICAgICBzcGVlZDoge3ZhbHVlOiAxfSxcbiAgICAgIGNlbnRlcjoge3ZhbHVlOiBmYWxzZX0sXG4gICAgICB1cGRhdGU6IHt2YWx1ZTogKCkgPT4ge319LFxuICAgICAgeEZ1bmM6IHt2YWx1ZTogMH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCB7dG9wLCBoaWRlLCB6SW5kZXgsIHNwZWVkLCBjZW50ZXIsIHVwZGF0ZSwgeEZ1bmN9ID0gb3B0aW9ucztcblxuICAgIHRoaXMuJGVsO1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4KCk7XG4gICAgdGhpcy5vZmZzZXRUb3AgPSBvZmZzZXRUb3A7XG4gICAgdGhpcy55T2Zmc2V0ID0gb2Zmc2V0VG9wLnZhbHVlO1xuICAgIHRoaXMueVByZXY7XG4gICAgdGhpcy50UHJldjtcblxuICAgIHRoaXMudG9wID0gdG9wO1xuICAgIHRoaXMuaGlkZSA9IGhpZGU7XG4gICAgdGhpcy56SW5kZXggPSB6SW5kZXg7XG4gICAgdGhpcy5zcGVlZCA9IHNwZWVkO1xuICAgIHRoaXMuY2VudGVyID0gY2VudGVyO1xuICAgIHRoaXMudXBkYXRlID0gdXBkYXRlO1xuICAgIHRoaXMueEZ1bmMgPSB4RnVuYztcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5zdHlsZUVsZW1lbnQoc2VsZWN0b3IsIHtjZW50ZXIsIHRvcH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBtb3ZlRWxlbWVudChwb3NZKSB7XG4gICAgdmFyICRlbCwgeVByZXYsIHRQcmV2LCB5TmV3LCB4TmV3LCB4RnVuYywgZnVuYywgc3BlZWQsIGJyZWFrcG9pbnQsIHByZXZCcmVha3BvaW50LCBkZWx0YSwgcHJlZml4XG5cbiAgICB0aGlzLnJ1bkNhbGxiYWNrcyhwb3NZKTtcblxuICAgIHlQcmV2ID0gdGhpcy55UHJldiB8fCAwO1xuICAgIHRQcmV2ID0gdGhpcy50UHJldiB8fCAwO1xuICAgIHByZWZpeCA9IHRoaXMucHJlZml4O1xuICAgIHhGdW5jID0gdGhpcy54RnVuYztcbiAgICAkZWwgPSB0aGlzLiRlbDtcbiAgICBzcGVlZCA9IHRoaXMuc3BlZWQudmFsdWU7XG4gICAgYnJlYWtwb2ludCA9IHRoaXMuc3BlZWQuX2JyZWFrcG9pbnQ7XG5cbiAgICBpZiAoYnJlYWtwb2ludCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBsZXQgbGFzdFNwZWVkLCB5RGlmZjtcbiAgICAgIGRlbHRhID0gMDtcbiAgICAgIGxhc3RTcGVlZCA9IHRoaXMuc3BlZWQuX2xhc3RTcGVlZDtcblxuICAgICAgeURpZmYgPSB5UHJldiAtIGJyZWFrcG9pbnQ7XG4gICAgICBkZWx0YSArPSBNYXRoLnJvdW5kKHlEaWZmKmxhc3RTcGVlZCoxMDApIC8gMTAwO1xuXG4gICAgICB5RGlmZiA9IGJyZWFrcG9pbnQgLSBwb3NZO1xuICAgICAgZGVsdGEgKz0gTWF0aC5yb3VuZCh5RGlmZipzcGVlZCoxMDApIC8gMTAwO1xuXG4gICAgICB0aGlzLnNwZWVkLl9icmVha3BvaW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxldCB5RGlmZjtcbiAgICAgIGRlbHRhID0gMDtcbiAgICAgIHlEaWZmID0geVByZXYgLSBwb3NZO1xuICAgICAgZGVsdGEgPSBNYXRoLnJvdW5kKHlEaWZmKnNwZWVkKjEwMCkgLyAxMDA7XG4gICAgfVxuXG4gICAgeU5ldyA9IHRQcmV2ICsgZGVsdGE7XG4gICAgZnVuYyA9IHhGdW5jLmJyZWFrcG9pbnRzW3hGdW5jLnZhbHVlXTtcbiAgICB4TmV3ID0gZnVuYyA/IGZ1bmMuY2FsbChudWxsLCBwb3NZIC0geEZ1bmMudmFsdWUpIDogMDtcbiAgICAkZWxbMF0uc3R5bGVbcHJlZml4LmRvbSArICdUcmFuc2Zvcm0nXSA9IGB0cmFuc2xhdGUzZCgke3hOZXd9cHgsICR7eU5ld31weCwgMCkgdHJhbnNsYXRlWigwKSBzY2FsZSgxKWA7XG4gICAgdGhpcy55UHJldiA9IHBvc1k7XG4gICAgdGhpcy50UHJldiA9IHlOZXc7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHJ1bkNhbGxiYWNrcyhwb3NZKSB7XG4gICAgdGhpcy51cGRhdGVIaWRlKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlWmluZGV4KHBvc1kpO1xuICAgIHRoaXMudXBkYXRlVG9wKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlT2Zmc2V0KHBvc1kpO1xuICAgIHRoaXMudXBkYXRlU3BlZWQocG9zWSk7XG4gICAgdGhpcy51cGRhdGVYRnVuYyhwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZUNhbGxiYWNrKHBvc1kpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVIaWRlKHBvc1kpIHtcbiAgICB2YXIgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy5oaWRlLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuaGlkZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy4kZWwuY3NzKCdkaXNwbGF5JywgdmFsdWUgPyAnbm9uZScgOiAnYmxvY2snKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZVppbmRleChwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuekluZGV4LCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuekluZGV4LnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLiRlbC5jc3MoJ3pJbmRleCcsIHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlVG9wKHBvc1kpIHtcbiAgICB2YXIgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy50b3AsICh2YWx1ZSkgPT4ge1xuICAgICAgdmFyIHlPZmZzZXQgPSB0aGlzLnlPZmZzZXQ7XG4gICAgICB0aGlzLnRvcC52YWx1ZSA9IHZhbHVlID0gdmFsdWUgKyB5T2Zmc2V0O1xuICAgICAgdGhpcy4kZWwuY3NzKCd0b3AnLCB2YWx1ZSArICdweCcpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVPZmZzZXQocG9zWSkge1xuICAgIHZhciB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLm9mZnNldFRvcCwgKHZhbHVlKSA9PiB7XG4gICAgICB2YXIgeURpZmYsIHRvcDtcbiAgICAgIHlEaWZmID0gdmFsdWUgLSB0aGlzLnlPZmZzZXQ7XG4gICAgICB0aGlzLnlPZmZzZXQgPSB2YWx1ZTtcbiAgICAgIHRvcCA9IHBhcnNlSW50KHRoaXMuJGVsLmNzcygndG9wJyksIDEwKTtcbiAgICAgIHRoaXMuJGVsLmNzcygndG9wJywgdG9wICsgeURpZmYgKyAncHgnKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlU3BlZWQocG9zWSkge1xuICAgIHZhciB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLnNwZWVkLCAodmFsdWUsIGJyZWFrcG9pbnQsIHNjcm9sbGluZ0Rvd24sIGFjdHVhbEJyZWFrcG9pbnQpID0+IHtcbiAgICAgIHRoaXMuc3BlZWQuX2JyZWFrcG9pbnQgPSBhY3R1YWxCcmVha3BvaW50O1xuICAgICAgdGhpcy5zcGVlZC5fbGFzdFNwZWVkID0gdGhpcy5zcGVlZC52YWx1ZTtcbiAgICAgIHRoaXMuc3BlZWQudmFsdWUgPSB2YWx1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlWEZ1bmMocG9zWSkge1xuICAgIHZhciB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLnhGdW5jLCAodmFsdWUsIGJyZWFrcG9pbnQsIHNjcm9sbGluZ0Rvd24sIGFjdHVhbEJyZWFrcG9pbnQpID0+IHtcbiAgICAgIHRoaXMueEZ1bmMudmFsdWUgPSBicmVha3BvaW50O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVDYWxsYmFjayhwb3NZKSB7XG4gICAgdmFyIHlQcmV2LCAkZWwsIHNlbGY7XG4gICAgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgICRlbCA9IHRoaXMuJGVsO1xuICAgIHNlbGYgPSB0aGlzO1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy51cGRhdGUsICh2YWx1ZSwgYnJlYWtwb2ludCkgPT4ge1xuICAgICAgc2VsZi51cGRhdGUuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0uY2FsbChzZWxmLCAkZWwsIHBvc1ksIHlQcmV2KTtcbiAgICB9KTtcbiAgfVxuXG4gIGpRdWVyeSgpIHtcbiAgICAkID0galF1ZXJ5O1xuICAgIGlmICghJCkge1xuICAgICAgdGhyb3cgJ2pRdWVyeSBpcyBub3QgZGVmaW5lZCc7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgc3R5bGVFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgdmFyICRlbCwgY3NzLCB5T2Zmc2V0O1xuICAgIHZhciB7Y2VudGVyLCB0b3B9ID0gb3B0aW9ucztcbiAgICB5T2Zmc2V0ID0gdGhpcy55T2Zmc2V0O1xuICAgIGNzcyA9IHtcbiAgICAgICdwb3NpdGlvbic6ICdmaXhlZCcsXG4gICAgICAnbGVmdCc6IDAsXG4gICAgICAncmlnaHQnOiAwLFxuICAgIH07XG4gICAgaWYgKGNlbnRlci52YWx1ZSkge1xuICAgICAgY3NzWydtYXJnaW4tcmlnaHQnXSA9ICdhdXRvJztcbiAgICAgIGNzc1snbWFyZ2luLWxlZnQnXSA9ICdhdXRvJztcbiAgICB9XG4gICAgaWYgKHRvcC52YWx1ZSkge1xuICAgICAgY3NzLnRvcCA9IHRvcCArIHlPZmZzZXQgKyAncHgnO1xuICAgIH1cbiAgICAkZWwgPSAkKHNlbGVjdG9yKTtcbiAgICBpZiAoISRlbC5sZW5ndGgpIHtcbiAgICAgIHRocm93IGBJbnZhbGlkIHNlbGVjdG9yIFwiJHtzZWxlY3Rvcn1cImA7XG4gICAgfVxuICAgICRlbC5jc3MoY3NzKTtcbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIERlYnVnIHtcblxuICBpbml0KCkge1xuICAgIHZhciAkZGVidWdnZXI7XG5cbiAgICAkKCdib2R5JykuYXBwZW5kKCc8c3BhbiBpZD1cInBhcmFsbGF4YnJvRGVidWdnZXJcIj4wPC9zcGFuPicpO1xuXG4gICAgJGRlYnVnZ2VyID0gJCgnI3BhcmFsbGF4YnJvRGVidWdnZXInKTtcblxuICAgICRkZWJ1Z2dlci5jc3Moe1xuICAgICAgJ3Bvc2l0aW9uJzogJ2ZpeGVkJyxcbiAgICAgICd0b3AnOiAnMCcsXG4gICAgICAncmlnaHQnOiAnMCcsXG4gICAgICAnZm9udC1zaXplJzogJzE3cHgnLFxuICAgICAgJ2NvbG9yJzogJ3doaXRlJyxcbiAgICAgICdiYWNrZ3JvdW5kJzogJ2JsYWNrJyxcbiAgICAgICdwYWRkaW5nJzogJzEwcHggMTJweCcsXG4gICAgICAnei1pbmRleCc6ICcxMDAwMDAnLFxuICAgICAgJ2JvcmRlci10b3AtbGVmdC1yYWRpdXMnOiAnNHB4JyxcbiAgICAgICdib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzJzogJzRweCcsXG4gICAgfSk7XG5cbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAkZGVidWdnZXIuaHRtbChNYXRoLnJvdW5kKHdpbmRvdy5wYWdlWU9mZnNldCkpO1xuICAgIH0sIDI1MCk7XG4gIH1cblxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL1BhcmFsbGF4QnJvJyk7XG4iLCJjb25zdCBzZWxmID0gbW9kdWxlLmV4cG9ydHM7XG5cbnNlbGYuY2FsbEJyZWFrcG9pbnRzID0gKHBvc1ksIHlQcmV2LCBicmVha3BvaW50cywgY2FsbGJhY2spID0+IHtcbiAgdmFyIHNjcm9sbGluZ0Rvd24sIHlEaWZmO1xuICBzY3JvbGxpbmdEb3duID0geVByZXYgPCBwb3NZO1xuICB5RGlmZiA9IHNjcm9sbGluZ0Rvd24gPyBwb3NZIC0geVByZXYgOiB5UHJldiAtIHBvc1k7XG4gIGJyZWFrcG9pbnRzID0gYnJlYWtwb2ludHMubWFwKGJyZWFrcG9pbnQgPT4gcGFyc2VJbnQoYnJlYWtwb2ludCwgMTApKTtcbiAgLy8gQHRvZG8gLSB3ZSBjb3VsZCB1c2UgYSBkaWZmZXJlbnQgdGVjaG5pcXVlIGJ1dCB0aGlzIG9uZSB3b3JrcyB3LyBsaXR0bGUgYXBhcmVudCBkb3duc2lkZXMuXG4gIGZvciAobGV0IGk9MDsgaTx5RGlmZjsgaSsrKSB7XG4gICAgbGV0IHBvcywgaW5kZXg7XG4gICAgcG9zID0gc2Nyb2xsaW5nRG93biA/IHlQcmV2ICsgaSA6IHlQcmV2IC0gaTtcbiAgICBpbmRleCA9IGJyZWFrcG9pbnRzLmluZGV4T2YocG9zKTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgbGV0IGkgPSBzY3JvbGxpbmdEb3duID8gaW5kZXggOiBpbmRleCAtIDE7XG4gICAgICBjYWxsYmFjay5jYWxsKG51bGwsIGJyZWFrcG9pbnRzW2ldLCBzY3JvbGxpbmdEb3duLCBicmVha3BvaW50c1tpbmRleF0pO1xuICAgIH1cbiAgfVxufVxuXG5zZWxmLnJ1blVwZGF0ZSA9IChwb3NZLCB5UHJldiwgb2JqLCBjYWxsYmFjaykgPT4ge1xuICB2YXIgYnJlYWtwb2ludHMgPSBPYmplY3Qua2V5cyhvYmouYnJlYWtwb2ludHMpO1xuXG4gIC8vIENhbGwgb24gaW5pdC5cbiAgaWYgKHlQcmV2ID09PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgdmFsdWUgPSBvYmouYnJlYWtwb2ludHNbcG9zWV07XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwobnVsbCwgdmFsdWUsIHBvc1ksIHRydWUpO1xuICAgIH1cbiAgfVxuICBzZWxmLmNhbGxCcmVha3BvaW50cyhwb3NZLCB5UHJldiwgYnJlYWtwb2ludHMsIChicmVha3BvaW50LCBzY3JvbGxpbmdEb3duLCBhY3R1YWxCcmVha3BvaW50KSA9PiB7XG4gICAgdmFyIHZhbHVlID0gb2JqLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdO1xuICAgIGNhbGxiYWNrLmNhbGwobnVsbCwgdmFsdWUsIGJyZWFrcG9pbnQsIHNjcm9sbGluZ0Rvd24sIGFjdHVhbEJyZWFrcG9pbnQpO1xuICB9KTtcbn1cblxuc2VsZi5ub3JtYWxpemVPcHRpb25zID0gKG9wdGlvbnMsIGRlZmF1bHRzLCBleGNlcHRpb25zID0gW10pID0+IHtcbiAgdmFyIGtleXM7XG5cbiAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuXG4gIC8vIGtleXMgPSBrZXlzLmZpbHRlcihrZXkgPT4gZXhjZXB0aW9ucy5pbmRleE9mKGtleSkgPT09IC0xKTtcblxuICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICB2YXIgdmFsdWUsIGlzT2JqZWN0O1xuICAgIHZhbHVlID0gb3B0aW9uc1trZXldO1xuICAgIGlzT2JqZWN0ID0gc2VsZi5pc1R5cGUodmFsdWUsICdvYmplY3QnKTtcbiAgICBpZiAoaXNPYmplY3QpIHtcbiAgICAgIGxldCB2YWx1ZTEgPSB2YWx1ZSAmJiB2YWx1ZVsnMCddID8gdmFsdWVbJzAnXSA6IGRlZmF1bHRzW2tleV0udmFsdWU7XG4gICAgICBkZWxldGUgdmFsdWUudmFsdWU7XG4gICAgICBvcHRpb25zW2tleV0gPSB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZTEsXG4gICAgICAgIGJyZWFrcG9pbnRzOiBPYmplY3QuYXNzaWduKHt9LCB7MDogdmFsdWUxfSwgdmFsdWUpLFxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG9wdGlvbnNba2V5XSA9IHtcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGJyZWFrcG9pbnRzOiB7MDogdmFsdWV9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbi8qKlxuICogR2l2ZW4gYSBNaXhlZCB2YWx1ZSB0eXBlIGNoZWNrLlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUuXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpYy5cbiAqIEB0ZXN0cyB1bml0LlxuICovXG5zZWxmLmlzVHlwZSA9ICh2YWx1ZSwgdHlwZSkgPT4ge1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIE51bWJlci5pc05hTih2YWx1ZSkgPT09IGZhbHNlO1xuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIHZhbHVlID09PSB0cnVlIHx8IHZhbHVlID09PSBmYWxzZTtcbiAgICBjYXNlICdhcnJheSc6XG4gICAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSk7XG4gICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsICYmIEFycmF5LmlzQXJyYXkodmFsdWUpID09PSBmYWxzZTtcbiAgICBjYXNlICdudWxsJzpcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbDtcbiAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQ7XG4gICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG4gICAgY2FzZSAnc3ltYm9sJzpcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnO1xuICAgIGNhc2UgJ05hTic6XG4gICAgICByZXR1cm4gTnVtYmVyLmlzTmFOKHZhbHVlKTtcbiAgICBjYXNlICdkYXRlJzpcbiAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5yZWNnb25pemVkIHR5cGU6IFwiJHt0eXBlfVwiYCk7XG4gIH1cbn07XG5cbnNlbGYucHJlZml4ID0gKCkgPT4ge1xuICB2YXIgc3R5bGVzLCBwcmUsIGRvbTtcbiAgc3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCAnJyksXG4gICAgcHJlID0gKEFycmF5LnByb3RvdHlwZS5zbGljZVxuICAgICAgLmNhbGwoc3R5bGVzKVxuICAgICAgLmpvaW4oJycpXG4gICAgICAubWF0Y2goLy0obW96fHdlYmtpdHxtcyktLykgfHwgKHN0eWxlcy5PTGluayA9PT0gJycgJiYgWycnLCAnbyddKVxuICAgIClbMV0sXG4gICAgZG9tID0gKCd3ZWJraXR8TW96fE1TfE8nKS5tYXRjaChuZXcgUmVnRXhwKCcoJyArIHByZSArICcpJywgJ2knKSlbMV07XG4gICAgcmV0dXJuIHtcbiAgICAgIGRvbTogZG9tLFxuICAgICAgbG93ZXJjYXNlOiBwcmUsXG4gICAgICBjc3M6ICctJyArIHByZSArICctJyxcbiAgICAgIGpzOiBwcmVbMF0udG9VcHBlckNhc2UoKSArIHByZS5zdWJzdHIoMSlcbiAgICB9O1xufTtcbiJdfQ==
