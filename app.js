(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var ParallaxBro = require('../lib');

var laxbro = new ParallaxBro();

var page1, page2;

page1 = laxbro.addCollection('#collection1', {
  // top: {},
  // hide: {1000: true},
  center: true
});

page1.addElements({
  '#img1': {
    speed: {
      0: .5
    },
    top: {
      // 500: 100,
    }
  }
});

},{"../lib":5}],2:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmpzIiwibGliL1BhcmFsbGF4QnJvLmpzIiwibGliL1BhcmFsbGF4Q29sbGVjdGlvbi5qcyIsImxpYi9QYXJhbGxheEVsZW1lbnQuanMiLCJsaWIvaW5kZXguanMiLCJsaWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQU0sY0FBYyxRQUFRLFFBQVIsQ0FBcEI7O0FBRUEsSUFBTSxTQUFTLElBQUksV0FBSixFQUFmOztBQUVBLElBQUksS0FBSixFQUFXLEtBQVg7O0FBRUEsUUFBUSxPQUFPLGFBQVAsQ0FBcUIsY0FBckIsRUFBcUM7QUFDM0M7QUFDQTtBQUNBLFVBQVE7QUFIbUMsQ0FBckMsQ0FBUjs7QUFNQSxNQUFNLFdBQU4sQ0FBa0I7QUFDaEIsV0FBUztBQUNQLFdBQU87QUFDTCxTQUFHO0FBREUsS0FEQTtBQUtQLFNBQUs7QUFDSDtBQURHO0FBTEU7QUFETyxDQUFsQjs7Ozs7Ozs7O0FDWkEsSUFBTSxxQkFBcUIsUUFBUSxzQkFBUixDQUEzQjs7QUFFQSxJQUFJLENBQUo7O0FBRUEsT0FBTyxPQUFQO0FBRUUsc0JBQVksT0FBWixFQUFxQjtBQUFBOztBQUFBLDRCQUNjLEtBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsQ0FEZDtBQUFBLFFBQ1osT0FEWSxxQkFDWixPQURZO0FBQUEsUUFDSCxhQURHLHFCQUNILGFBREc7O0FBR25CLFNBQUssV0FBTCxHQUFtQixFQUFuQjs7QUFFQSxTQUFLLE1BQUw7QUFDQSxTQUFLLGdCQUFMLENBQXNCLE9BQXRCO0FBQ0EsU0FBSyxVQUFMO0FBQ0EsUUFBSSxDQUFDLGFBQUwsRUFBb0I7QUFDbEIsV0FBSyxRQUFMO0FBQ0Q7QUFDRjs7QUFiSDtBQUFBO0FBQUEsa0NBZWdCLFFBZmhCLEVBZTBCLEdBZjFCLEVBZStCO0FBQzNCLFVBQUksVUFBSjtBQUNBLG1CQUFhLElBQUksa0JBQUosQ0FBdUIs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QixLQUFoQixDQUNKLElBREksQ0FDQyxNQURELEVBRUosSUFGSSxDQUVDLEVBRkQsRUFHSixLQUhJLENBR0UsbUJBSEYsS0FHMkIsT0FBTyxLQUFQLEtBQWlCLEVBQWpCLElBQXVCLENBQUMsRUFBRCxFQUFLLEdBQUwsQ0FIbkQsRUFJSixDQUpJLENBRFIsRUFNRSxNQUFPLGlCQUFELENBQW9CLEtBQXBCLENBQTBCLElBQUksTUFBSixDQUFXLE1BQU0sR0FBTixHQUFZLEdBQXZCLEVBQTRCLEdBQTVCLENBQTFCLEVBQTRELENBQTVELENBTlI7QUFPRSxTQUFPO0FBQ0wsU0FBSyxHQURBO0FBRUwsZUFBVyxHQUZOO0FBR0wsU0FBSyxNQUFNLEdBQU4sR0FBWSxHQUhaO0FBSUwsUUFBSSxJQUFJLENBQUosRUFBTyxXQUFQLEtBQXVCLElBQUksTUFBSixDQUFXLENBQVg7QUFKdEIsR0FBUDtBQU1ILENBZkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgUGFyYWxsYXhCcm8gPSByZXF1aXJlKCcuLi9saWInKTtcblxuY29uc3QgbGF4YnJvID0gbmV3IFBhcmFsbGF4QnJvKCk7XG5cbnZhciBwYWdlMSwgcGFnZTI7XG5cbnBhZ2UxID0gbGF4YnJvLmFkZENvbGxlY3Rpb24oJyNjb2xsZWN0aW9uMScsIHtcbiAgLy8gdG9wOiB7fSxcbiAgLy8gaGlkZTogezEwMDA6IHRydWV9LFxuICBjZW50ZXI6IHRydWUsXG59KTtcblxucGFnZTEuYWRkRWxlbWVudHMoe1xuICAnI2ltZzEnOiB7XG4gICAgc3BlZWQ6IHtcbiAgICAgIDA6IC41LFxuICAgICAgLy8gMzAwOiAtMSxcbiAgICB9LFxuICAgIHRvcDoge1xuICAgICAgLy8gNTAwOiAxMDAsXG4gICAgfSxcbiAgICAvLyBoaWRlOiB7XG4gICAgLy8gICAxMDA6IGZhbHNlLFxuICAgIC8vICAgNjAwOiB0cnVlLFxuICAgIC8vIH0sXG4gICAgLy8gc3BlZWQ6IHtcbiAgICAvLyAgIDA6IDEsXG4gICAgLy8gICAyMDA6IC41LFxuICAgIC8vICAgMzAwOiAwLFxuICAgIC8vICAgNDAwOiAtMSxcbiAgICAvLyB9LFxuICB9LFxuICAvLyAnI2ltZzInOiB7XG4gIC8vICAgaGlkZTogdHJ1ZSxcbiAgLy8gICB0b3A6IDgwMCxcbiAgLy8gICB6SW5kZXg6IDAsXG4gIC8vICAgc3BlZWQ6IC4xLFxuICAvLyAgIHVwZGF0ZToge1xuICAvLyAgICAgMDogKCkgPT4ge1xuICAvLyAgICAgICB0aGlzLmVsLmZhZGVJbigpO1xuICAvLyAgICAgfSxcbiAgLy8gICAgIDQwMDogKCkgPT4ge1xuICAvLyAgICAgICB0aGlzLmVsLmZhZGVPdXQoKTtcbiAgLy8gICAgIH1cbiAgLy8gICB9XG4gIC8vIH1cbn0pO1xuIiwiY29uc3QgUGFyYWxsYXhDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9QYXJhbGxheENvbGxlY3Rpb24nKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxheEJybyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGNvbnN0IHt3cmFwcGVyLCBkaXNhYmxlU3R5bGVzfSA9IHRoaXMubm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKTtcblxuICAgIHRoaXMuY29sbGVjdGlvbnMgPSBbXTtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5jYWNoZURPTUVsZW1lbnRzKHdyYXBwZXIpO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIGlmICghZGlzYWJsZVN0eWxlcykge1xuICAgICAgdGhpcy5zdHlsZURPTSgpO1xuICAgIH1cbiAgfVxuXG4gIGFkZENvbGxlY3Rpb24oc2VsZWN0b3IsIG9iaikge1xuICAgIHZhciBjb2xsZWN0aW9uO1xuICAgIGNvbGxlY3Rpb24gPSBuZXcgUGFyYWxsYXhDb2xsZWN0aW9uKHNlbGVjdG9yLCBvYmopO1xuICAgIHRoaXMuY29sbGVjdGlvbnMucHVzaChjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuXG4gIGNhY2hlRE9NRWxlbWVudHMod3JhcHBlcikge1xuICAgIHRoaXMuJGVsID0ge307XG4gICAgdGhpcy4kZWwud2luID0gJCh3aW5kb3cpO1xuICAgIHRoaXMuJGVsLmRvYyA9ICQoZG9jdW1lbnQpO1xuICAgIHRoaXMuJGVsLmJvZHkgPSAkKCdib2R5Jyk7XG4gICAgdGhpcy4kZWwud3JhcHBlciA9ICQod3JhcHBlcik7XG4gIH1cblxuICBzdHlsZURPTSgpIHtcbiAgICB2YXIge2JvZHksIHdyYXBwZXIsIGRvY30gPSB0aGlzLiRlbDtcbiAgICBib2R5LmNzcygnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICB3cmFwcGVyLmNzcygnbWluLWhlaWdodCcsICcxMDAlJyk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IHRyYWNrID0gKCkgPT4ge1xuICAgICAgdmFyIHBvc1kgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICB0aGlzLm1vdmVFbGVtZW50cyhwb3NZKTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0cmFjayk7XG4gICAgfVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0cmFjayk7XG4gIH1cblxuXG4gIG1vdmVFbGVtZW50cyhwb3NZKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25zO1xuICAgIGNvbGxlY3Rpb25zID0gdGhpcy5jb2xsZWN0aW9ucztcbiAgICBjb2xsZWN0aW9ucy5mb3JFYWNoKGNvbGxlY3Rpb24gPT4gY29sbGVjdGlvbi5tb3ZlRWxlbWVudHMocG9zWSkpO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gIH1cblxuICBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgd3JhcHBlcjogJyNwYXJhbGxheCcsXG4gICAgICBkaXNhYmxlU3R5bGVzOiBmYWxzZSxcbiAgICB9LCBvcHRpb25zKTtcbiAgfVxuXG59XG4iLCJjb25zdCB7bm9ybWFsaXplT3B0aW9ucywgcnVuVXBkYXRlfSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbmNvbnN0IFBhcmFsbGF4RWxlbWVudCA9IHJlcXVpcmUoJy4vUGFyYWxsYXhFbGVtZW50Jyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsbGF4Q29sbGVjdGlvbiB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zLCB7XG4gICAgICB0b3A6IHt2YWx1ZTogMH0sXG4gICAgICBoaWRlOiB7dmFsdWU6IGZhbHNlfSxcbiAgICAgIHpJbmRleDoge3ZhbHVlOiAtMX0sXG4gICAgICBjZW50ZXI6IHt2YWx1ZTogZmFsc2V9LFxuICAgICAgdXBkYXRlOiB7dmFsdWU6ICgpID0+IHt9fSxcbiAgICB9KTtcbiAgICBjb25zdCB7dG9wLCBoaWRlLCB6SW5kZXgsIGNlbnRlciwgdXBkYXRlfSA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLiRlbDtcbiAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgdGhpcy55UHJldjtcblxuICAgIHRoaXMudG9wID0gdG9wO1xuICAgIHRoaXMuaGlkZSA9IGhpZGU7XG4gICAgdGhpcy56SW5kZXggPSB6SW5kZXg7XG4gICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XG4gICAgdGhpcy51cGRhdGUgPSB1cGRhdGU7XG5cbiAgICB0aGlzLmpRdWVyeSgpO1xuICAgIHRoaXMuc3R5bGVDb2xsZWN0aW9uKHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAqL1xuICBhZGRFbGVtZW50cyhvYmopIHtcbiAgICB2YXIgc2VsZWN0b3JzLCB0b3AsIGNlbnRlcjtcbiAgICBzZWxlY3RvcnMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgIHNlbGVjdG9ycy5mb3JFYWNoKHNlbGVjdG9yID0+IHtcbiAgICAgIHZhciBvcHRpb25zID0gb2JqW3NlbGVjdG9yXTtcbiAgICAgIHRoaXMuYWRkRWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBhZGRFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgdmFyIGVsZW1lbnQ7XG4gICAgZWxlbWVudCA9IG5ldyBQYXJhbGxheEVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMsIHRoaXMudG9wKTtcbiAgICB0aGlzLmVsZW1lbnRzLnB1c2goZWxlbWVudCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIG1vdmVFbGVtZW50cyhwb3NZKSB7XG4gICAgdmFyIGVsZW1lbnRzO1xuICAgIGVsZW1lbnRzID0gdGhpcy5lbGVtZW50cztcbiAgICB0aGlzLnJ1bkNhbGxiYWNrcyhwb3NZKTtcbiAgICBlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4gZWxlbWVudC5tb3ZlRWxlbWVudChwb3NZKSk7XG4gICAgdGhpcy55UHJldiA9IHBvc1k7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHJ1bkNhbGxiYWNrcyhwb3NZKSB7XG4gICAgdGhpcy51cGRhdGVIaWRlKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlWmluZGV4KHBvc1kpO1xuICAgIHRoaXMudXBkYXRlQ2VudGVyKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlQ2FsbGJhY2socG9zWSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZUhpZGUocG9zWSkge1xuICAgIHZhciBwcmV2WSA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHByZXZZLCB0aGlzLmhpZGUsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy5oaWRlLnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLiRlbC5jc3MoJ29wYWNpdHknLCB2YWx1ZSA/IDAgOiAxKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlWmluZGV4KHBvc1kpIHtcbiAgICB2YXIgcHJldlkgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgdGhpcy56SW5kZXgsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy56SW5kZXgudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuJGVsLmNzcygnekluZGV4JywgdmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVDZW50ZXIocG9zWSkge1xuICAgIHZhciBwcmV2WSA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHByZXZZLCB0aGlzLmNlbnRlciwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLmNlbnRlci52YWx1ZSA9IHZhbHVlO1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuJGVsLmNzcyh7XG4gICAgICAgICAgJ21hcmdpbi1yaWdodCc6ICdhdXRvJyxcbiAgICAgICAgICAnbWFyZ2luLWxlZnQnOiAnYXV0bycsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuJGVsLmNzcyh7XG4gICAgICAgICAgJ21hcmdpbi1yaWdodCc6ICdpbmhlcml0JyxcbiAgICAgICAgICAnbWFyZ2luLWxlZnQnOiAnaW5oZXJpdCcsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVDYWxsYmFjayhwb3NZKSB7XG4gICAgdmFyIHlQcmV2LCAkZWwsIHNlbGY7XG4gICAgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgICRlbCA9IHRoaXMuJGVsO1xuICAgIHNlbGYgPSB0aGlzO1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy51cGRhdGUsICh2YWx1ZSwgYnJlYWtwb2ludCkgPT4ge1xuICAgICAgc2VsZi51cGRhdGUuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0uY2FsbChzZWxmLCAkZWwsIHBvc1ksIHlQcmV2KTtcbiAgICB9KTtcbiAgfVxuXG4gIGpRdWVyeSgpIHtcbiAgICAkID0galF1ZXJ5O1xuICAgIGlmICghJCkge1xuICAgICAgdGhyb3cgJ2pRdWVyeSBpcyBub3QgZGVmaW5lZCc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgc3R5bGVDb2xsZWN0aW9uKHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgdmFyICRlbCwgY3NzO1xuICAgIHZhciB7Y2VudGVyLCB6SW5kZXgsIGhpZGV9ID0gb3B0aW9ucztcbiAgICBjc3MgPSB7fTtcbiAgICBjc3MuekluZGV4ID0gekluZGV4LnZhbHVlO1xuICAgIGlmIChjZW50ZXIudmFsdWUpIHtcbiAgICAgIGNzc1snbWFyZ2luLXJpZ2h0J10gPSAnYXV0byc7XG4gICAgICBjc3NbJ21hcmdpbi1sZWZ0J10gPSAnYXV0byc7XG4gICAgfVxuICAgIGlmIChoaWRlLnZhbHVlKSB7XG4gICAgICBjc3MuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG4gICAgJGVsID0gJChzZWxlY3Rvcik7XG4gICAgJGVsLmNzcyhjc3MpO1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn1cbiIsImNvbnN0IHtwcmVmaXgsIG5vcm1hbGl6ZU9wdGlvbnMsIHJ1blVwZGF0ZX0gPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsbGF4RWxlbWVudCB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAcGFyYW0ge09iamVjdH0gb2Zmc2V0VG9wXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZWxlY3Rvciwgb3B0aW9ucywgb2Zmc2V0VG9wKSB7XG4gICAgb3B0aW9ucyA9IG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucywge1xuICAgICAgdG9wOiB7dmFsdWU6IDB9LFxuICAgICAgaGlkZToge3ZhbHVlOiBmYWxzZX0sXG4gICAgICB6SW5kZXg6IHt2YWx1ZTogLTF9LFxuICAgICAgc3BlZWQ6IHt2YWx1ZTogMX0sXG4gICAgICBjZW50ZXI6IHt2YWx1ZTogZmFsc2V9LFxuICAgICAgdXBkYXRlOiB7dmFsdWU6ICgpID0+IHt9fSxcbiAgICB9KTtcbiAgICBjb25zdCB7dG9wLCBoaWRlLCB6SW5kZXgsIHNwZWVkLCBjZW50ZXIsIHVwZGF0ZX0gPSBvcHRpb25zO1xuXG4gICAgdGhpcy4kZWw7XG4gICAgdGhpcy5wcmVmaXggPSBwcmVmaXgoKTtcbiAgICB0aGlzLm9mZnNldFRvcCA9IG9mZnNldFRvcDtcbiAgICB0aGlzLnlPZmZzZXQgPSBvZmZzZXRUb3AudmFsdWU7XG4gICAgdGhpcy55UHJldjtcbiAgICB0aGlzLnRQcmV2O1xuXG4gICAgdGhpcy50b3AgPSB0b3A7XG4gICAgdGhpcy5oaWRlID0gaGlkZTtcbiAgICB0aGlzLnpJbmRleCA9IHpJbmRleDtcbiAgICB0aGlzLnNwZWVkID0gc3BlZWQ7XG4gICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XG4gICAgdGhpcy51cGRhdGUgPSB1cGRhdGU7XG5cbiAgICB0aGlzLmpRdWVyeSgpO1xuICAgIHRoaXMuc3R5bGVFbGVtZW50KHNlbGVjdG9yLCB7Y2VudGVyLCB0b3B9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgbW92ZUVsZW1lbnQocG9zWSkge1xuICAgIHZhciAkZWwsIHlQcmV2LCB0UHJldiwgeU5ldywgc3BlZWQsIGJyZWFrcG9pbnQsIHByZXZCcmVha3BvaW50LCBkZWx0YSwgcHJlZml4O1xuXG4gICAgdGhpcy5ydW5DYWxsYmFja3MocG9zWSk7XG5cbiAgICB5UHJldiA9IHRoaXMueVByZXYgfHwgMDtcbiAgICB0UHJldiA9IHRoaXMudFByZXYgfHwgMDtcbiAgICBwcmVmaXggPSB0aGlzLnByZWZpeDtcbiAgICAkZWwgPSB0aGlzLiRlbDtcbiAgICBzcGVlZCA9IHRoaXMuc3BlZWQudmFsdWU7XG4gICAgYnJlYWtwb2ludCA9IHRoaXMuc3BlZWQuX2JyZWFrcG9pbnQ7XG5cbiAgICBpZiAoYnJlYWtwb2ludCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBsZXQgbGFzdFNwZWVkLCB5RGlmZjtcbiAgICAgIGRlbHRhID0gMDtcbiAgICAgIGxhc3RTcGVlZCA9IHRoaXMuc3BlZWQuX2xhc3RTcGVlZDtcblxuICAgICAgeURpZmYgPSB5UHJldiAtIGJyZWFrcG9pbnQ7XG4gICAgICBkZWx0YSArPSBNYXRoLnJvdW5kKHlEaWZmKmxhc3RTcGVlZCoxMDApIC8gMTAwO1xuXG4gICAgICB5RGlmZiA9IGJyZWFrcG9pbnQgLSBwb3NZO1xuICAgICAgZGVsdGEgKz0gTWF0aC5yb3VuZCh5RGlmZipzcGVlZCoxMDApIC8gMTAwO1xuXG4gICAgICB0aGlzLnNwZWVkLl9icmVha3BvaW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxldCB5RGlmZjtcbiAgICAgIGRlbHRhID0gMDtcbiAgICAgIHlEaWZmID0geVByZXYgLSBwb3NZO1xuICAgICAgZGVsdGEgPSBNYXRoLnJvdW5kKHlEaWZmKnNwZWVkKjEwMCkgLyAxMDA7XG4gICAgfVxuXG4gICAgeU5ldyA9IHRQcmV2ICsgZGVsdGE7XG5cbiAgICAkZWxbMF0uc3R5bGVbcHJlZml4LmRvbSArICdUcmFuc2Zvcm0nXSA9IGB0cmFuc2xhdGUzZCgwcHgsICR7eU5ld31weCwgMCkgdHJhbnNsYXRlWigwKSBzY2FsZSgxKWA7XG4gICAgdGhpcy55UHJldiA9IHBvc1k7XG4gICAgdGhpcy50UHJldiA9IHlOZXc7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHJ1bkNhbGxiYWNrcyhwb3NZKSB7XG4gICAgdGhpcy51cGRhdGVIaWRlKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlVG9wKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlT2Zmc2V0KHBvc1kpO1xuICAgIHRoaXMudXBkYXRlU3BlZWQocG9zWSk7XG4gICAgdGhpcy51cGRhdGVDYWxsYmFjayhwb3NZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlSGlkZShwb3NZKSB7XG4gICAgdmFyIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMuaGlkZSwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLmhpZGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuJGVsLmNzcygnZGlzcGxheScsIHZhbHVlID8gJ25vbmUnIDogJ2Jsb2NrJyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZVRvcChwb3NZKSB7XG4gICAgdmFyIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMudG9wLCAodmFsdWUpID0+IHtcbiAgICAgIHZhciB5T2Zmc2V0ID0gdGhpcy55T2Zmc2V0O1xuICAgICAgdGhpcy50b3AudmFsdWUgPSB2YWx1ZSA9IHZhbHVlICsgeU9mZnNldDtcbiAgICAgIHRoaXMuJGVsLmNzcygndG9wJywgdmFsdWUgKyAncHgnKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlT2Zmc2V0KHBvc1kpIHtcbiAgICB2YXIgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy5vZmZzZXRUb3AsICh2YWx1ZSkgPT4ge1xuICAgICAgdmFyIHlEaWZmLCB0b3A7XG4gICAgICB5RGlmZiA9IHZhbHVlIC0gdGhpcy55T2Zmc2V0O1xuICAgICAgdGhpcy55T2Zmc2V0ID0gdmFsdWU7XG4gICAgICB0b3AgPSBwYXJzZUludCh0aGlzLiRlbC5jc3MoJ3RvcCcpLCAxMCk7XG4gICAgICB0aGlzLiRlbC5jc3MoJ3RvcCcsIHRvcCArIHlEaWZmICsgJ3B4Jyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZVNwZWVkKHBvc1kpIHtcbiAgICB2YXIgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy5zcGVlZCwgKHZhbHVlLCBicmVha3BvaW50LCBzY3JvbGxpbmdEb3duLCBhY3R1YWxCcmVha3BvaW50KSA9PiB7XG4gICAgICB0aGlzLnNwZWVkLl9icmVha3BvaW50ID0gYWN0dWFsQnJlYWtwb2ludDtcbiAgICAgIHRoaXMuc3BlZWQuX2xhc3RTcGVlZCA9IHRoaXMuc3BlZWQudmFsdWU7XG4gICAgICB0aGlzLnNwZWVkLnZhbHVlID0gdmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZUNhbGxiYWNrKHBvc1kpIHtcbiAgICB2YXIgeVByZXYsICRlbCwgc2VsZjtcbiAgICB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgJGVsID0gdGhpcy4kZWw7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLnVwZGF0ZSwgKHZhbHVlLCBicmVha3BvaW50KSA9PiB7XG4gICAgICBzZWxmLnVwZGF0ZS5icmVha3BvaW50c1ticmVha3BvaW50XS5jYWxsKHNlbGYsICRlbCwgcG9zWSwgeVByZXYpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgc3R5bGVFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgdmFyICRlbCwgY3NzLCB5T2Zmc2V0O1xuICAgIHZhciB7Y2VudGVyLCB0b3B9ID0gb3B0aW9ucztcbiAgICB5T2Zmc2V0ID0gdGhpcy55T2Zmc2V0O1xuICAgIGNzcyA9IHtcbiAgICAgICdwb3NpdGlvbic6ICdmaXhlZCcsXG4gICAgICAnbGVmdCc6IDAsXG4gICAgICAncmlnaHQnOiAwLFxuICAgIH07XG4gICAgaWYgKGNlbnRlcikge1xuICAgICAgY3NzWydtYXJnaW4tcmlnaHQnXSA9ICdhdXRvJztcbiAgICAgIGNzc1snbWFyZ2luLWxlZnQnXSA9ICdhdXRvJztcbiAgICB9XG4gICAgaWYgKHRvcCkge1xuICAgICAgY3NzLnRvcCA9IHRvcCArIHlPZmZzZXQrJ3B4JztcbiAgICB9XG4gICAgJGVsID0gJChzZWxlY3Rvcik7XG4gICAgJGVsLmNzcyhjc3MpO1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL1BhcmFsbGF4QnJvJyk7XG4iLCJjb25zdCBzZWxmID0gbW9kdWxlLmV4cG9ydHM7XG5cbnNlbGYuY2FsbEJyZWFrcG9pbnRzID0gKHBvc1ksIHlQcmV2LCBicmVha3BvaW50cywgY2FsbGJhY2spID0+IHtcbiAgdmFyIHNjcm9sbGluZ0Rvd24sIHlEaWZmO1xuICBzY3JvbGxpbmdEb3duID0geVByZXYgPCBwb3NZO1xuICB5RGlmZiA9IHNjcm9sbGluZ0Rvd24gPyBwb3NZIC0geVByZXYgOiB5UHJldiAtIHBvc1k7XG4gIGJyZWFrcG9pbnRzID0gYnJlYWtwb2ludHMubWFwKGJyZWFrcG9pbnQgPT4gcGFyc2VJbnQoYnJlYWtwb2ludCwgMTApKTtcbiAgLy8gQHRvZG8gLSB3ZSBjb3VsZCB1c2UgYSBkaWZmZXJlbnQgdGVjaG5pcXVlIGJ1dCB0aGlzIG9uZSB3b3JrcyB3LyBsaXR0bGUgYXBhcmVudCBkb3duc2lkZXMuXG4gIGZvciAobGV0IGk9MDsgaTx5RGlmZjsgaSsrKSB7XG4gICAgbGV0IHBvcywgaW5kZXg7XG4gICAgcG9zID0gc2Nyb2xsaW5nRG93biA/IHlQcmV2ICsgaSA6IHlQcmV2IC0gaTtcbiAgICBpbmRleCA9IGJyZWFrcG9pbnRzLmluZGV4T2YocG9zKTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgbGV0IGkgPSBzY3JvbGxpbmdEb3duID8gaW5kZXggOiBpbmRleCAtIDE7XG4gICAgICBjYWxsYmFjay5jYWxsKG51bGwsIGJyZWFrcG9pbnRzW2ldLCBzY3JvbGxpbmdEb3duLCBicmVha3BvaW50c1tpbmRleF0pO1xuICAgIH1cbiAgfVxufVxuXG5zZWxmLnJ1blVwZGF0ZSA9IChwb3NZLCB5UHJldiwgb2JqLCBjYWxsYmFjaykgPT4ge1xuICB2YXIgYnJlYWtwb2ludHMgPSBPYmplY3Qua2V5cyhvYmouYnJlYWtwb2ludHMpO1xuXG4gIC8vIENhbGwgb24gaW5pdC5cbiAgaWYgKHlQcmV2ID09PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgdmFsdWUgPSBvYmouYnJlYWtwb2ludHNbcG9zWV07XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwobnVsbCwgdmFsdWUsIHBvc1ksIHRydWUpO1xuICAgIH1cbiAgfVxuICBzZWxmLmNhbGxCcmVha3BvaW50cyhwb3NZLCB5UHJldiwgYnJlYWtwb2ludHMsIChicmVha3BvaW50LCBzY3JvbGxpbmdEb3duLCBhY3R1YWxCcmVha3BvaW50KSA9PiB7XG4gICAgdmFyIHZhbHVlID0gb2JqLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdO1xuICAgIGNhbGxiYWNrLmNhbGwobnVsbCwgdmFsdWUsIGJyZWFrcG9pbnQsIHNjcm9sbGluZ0Rvd24sIGFjdHVhbEJyZWFrcG9pbnQpO1xuICB9KTtcbn1cblxuc2VsZi5ub3JtYWxpemVPcHRpb25zID0gKG9wdGlvbnMsIGRlZmF1bHRzKSA9PiB7XG4gIHZhciBrZXlzO1xuXG4gIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gIGtleXMgPSBPYmplY3Qua2V5cyhvcHRpb25zKTtcblxuICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICB2YXIgdmFsdWUsIGlzT2JqZWN0O1xuICAgIHZhbHVlID0gb3B0aW9uc1trZXldO1xuICAgIGlzT2JqZWN0ID0gc2VsZi5pc1R5cGUodmFsdWUsICdvYmplY3QnKTtcbiAgICBpZiAoaXNPYmplY3QpIHtcbiAgICAgIGxldCB2YWx1ZTEgPSB2YWx1ZSAmJiB2YWx1ZVsnMCddID8gdmFsdWVbJzAnXSA6IGRlZmF1bHRzW2tleV0udmFsdWU7XG4gICAgICBkZWxldGUgdmFsdWUudmFsdWU7XG4gICAgICBvcHRpb25zW2tleV0gPSB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZTEsXG4gICAgICAgIGJyZWFrcG9pbnRzOiBPYmplY3QuYXNzaWduKHt9LCB7MDogdmFsdWUxfSwgdmFsdWUpLFxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG9wdGlvbnNba2V5XSA9IHtcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGJyZWFrcG9pbnRzOiB7MDogdmFsdWV9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbi8qKlxuICogR2l2ZW4gYSBNaXhlZCB2YWx1ZSB0eXBlIGNoZWNrLlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUuXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpYy5cbiAqIEB0ZXN0cyB1bml0LlxuICovXG5zZWxmLmlzVHlwZSA9ICh2YWx1ZSwgdHlwZSkgPT4ge1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIE51bWJlci5pc05hTih2YWx1ZSkgPT09IGZhbHNlO1xuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIHZhbHVlID09PSB0cnVlIHx8IHZhbHVlID09PSBmYWxzZTtcbiAgICBjYXNlICdhcnJheSc6XG4gICAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSk7XG4gICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsICYmIEFycmF5LmlzQXJyYXkodmFsdWUpID09PSBmYWxzZTtcbiAgICBjYXNlICdudWxsJzpcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbDtcbiAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQ7XG4gICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG4gICAgY2FzZSAnc3ltYm9sJzpcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnO1xuICAgIGNhc2UgJ05hTic6XG4gICAgICByZXR1cm4gTnVtYmVyLmlzTmFOKHZhbHVlKTtcbiAgICBjYXNlICdkYXRlJzpcbiAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIERhdGU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5yZWNnb25pemVkIHR5cGU6IFwiJHt0eXBlfVwiYCk7XG4gIH1cbn07XG5cbnNlbGYucHJlZml4ID0gKCkgPT4ge1xuICB2YXIgc3R5bGVzLCBwcmUsIGRvbTtcbiAgc3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCAnJyksXG4gICAgcHJlID0gKEFycmF5LnByb3RvdHlwZS5zbGljZVxuICAgICAgLmNhbGwoc3R5bGVzKVxuICAgICAgLmpvaW4oJycpXG4gICAgICAubWF0Y2goLy0obW96fHdlYmtpdHxtcyktLykgfHwgKHN0eWxlcy5PTGluayA9PT0gJycgJiYgWycnLCAnbyddKVxuICAgIClbMV0sXG4gICAgZG9tID0gKCd3ZWJraXR8TW96fE1TfE8nKS5tYXRjaChuZXcgUmVnRXhwKCcoJyArIHByZSArICcpJywgJ2knKSlbMV07XG4gICAgcmV0dXJuIHtcbiAgICAgIGRvbTogZG9tLFxuICAgICAgbG93ZXJjYXNlOiBwcmUsXG4gICAgICBjc3M6ICctJyArIHByZSArICctJyxcbiAgICAgIGpzOiBwcmVbMF0udG9VcHBlckNhc2UoKSArIHByZS5zdWJzdHIoMSlcbiAgICB9O1xufTtcbiJdfQ==
