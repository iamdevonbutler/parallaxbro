(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const ParallaxBro = require('../lib');

const laxbro = new ParallaxBro();

var page1, page2;

page1 = laxbro.addCollection('#collection1', {
  top: { 0: 200, 300: 350 },
  // hide: {1000: true},
  center: true
});

page1.addElements({
  '#img1': {
    speed: {
      0: 1
    },
    top: {
      // 500: 100,
    }
  }
});

},{"../lib":5}],2:[function(require,module,exports){
const ParallaxCollection = require('./ParallaxCollection');

var $;

module.exports = class ParalaxBro {

  constructor(options) {
    const { wrapper, disableStyles } = this.normalizeOptions(options);

    this.collections = [];

    this.jQuery();
    this.cacheDOMElements(wrapper);
    this.bindEvents();
    if (!disableStyles) {
      this.styleDOM();
    }
  }

  addCollection(selector, obj) {
    var collection;
    collection = new ParallaxCollection(selector, obj);
    this.collections.push(collection);
    return collection;
  }

  cacheDOMElements(wrapper) {
    this.$el = {};
    this.$el.win = $(window);
    this.$el.doc = $(document);
    this.$el.body = $('body');
    this.$el.wrapper = $(wrapper);
  }

  styleDOM() {
    var { body, wrapper, doc } = this.$el;
    body.css('height', '100%');
    wrapper.css('min-height', '100%');
  }

  bindEvents() {
    const track = () => {
      var posY = window.pageYOffset;
      this.moveElements(posY);
      requestAnimationFrame(track);
    };
    requestAnimationFrame(track);
  }

  moveElements(posY) {
    var collections;
    collections = this.collections;
    collections.forEach(collection => collection.moveElements(posY));
  }

  jQuery() {
    $ = jQuery;
    if (!$) {
      throw 'jQuery is not defined';
    }
  }

  normalizeOptions(options) {
    return Object.assign({}, {
      wrapper: '#parallax',
      disableStyles: false
    }, options);
  }

};

},{"./ParallaxCollection":3}],3:[function(require,module,exports){
const { normalizeOptions, runUpdate } = require('./utils');
const ParallaxElement = require('./ParallaxElement');

var $;

module.exports = class ParallaxCollection {

  /**
   * @param {String} selector
   * @param {Object} options
   */
  constructor(selector, options) {
    options = normalizeOptions(options, {
      top: { value: 0 },
      hide: { value: false },
      zIndex: { value: -1 },
      center: { value: false },
      update: { value: () => {} }
    });
    const { top, hide, zIndex, center, update } = options;

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
  addElements(obj) {
    var selectors, top, center;
    selectors = Object.keys(obj);
    selectors.forEach(selector => {
      var options = obj[selector];
      this.addElement(selector, options);
    });
    return this;
  }

  /**
   * @param {String} selector
   * @param {Object} options
   */
  addElement(selector, options) {
    var element;
    element = new ParallaxElement(selector, options, this.top);
    this.elements.push(element);
    return this;
  }

  /**
   * @param {Number} posY
   */
  moveElements(posY) {
    var elements;
    elements = this.elements;
    this.runCallbacks(posY);
    elements.forEach(element => element.moveElement(posY));
    this.yPrev = posY;
  }

  /**
   * @param {Number} posY
   */
  runCallbacks(posY) {
    this.updateHide(posY);
    this.updateZindex(posY);
    this.updateCenter(posY);
    this.updateCallback(posY);
  }

  /**
   * @param {Number} posY
   */
  updateHide(posY) {
    var prevY = this.yPrev;
    runUpdate(posY, prevY, this.hide, value => {
      this.hide.value = value;
      this.$el.css('opacity', value ? 0 : 1);
    });
  }

  /**
   * @param {Number} posY
   */
  updateZindex(posY) {
    var prevY = this.yPrev;
    runUpdate(posY, prevY, this.zIndex, value => {
      this.zIndex.value = value;
      this.$el.css('zIndex', value);
    });
  }

  /**
   * @param {Number} posY
   */
  updateCenter(posY) {
    var prevY = this.yPrev;
    runUpdate(posY, prevY, this.center, value => {
      this.center.value = value;
      if (value) {
        this.$el.css({
          'margin-right': 'auto',
          'margin-left': 'auto'
        });
      } else {
        this.$el.css({
          'margin-right': 'inherit',
          'margin-left': 'inherit'
        });
      }
    });
  }

  /**
   * @param {Number} posY
   */
  updateCallback(posY) {
    var yPrev, $el, self;
    yPrev = this.yPrev;
    $el = this.$el;
    self = this;
    runUpdate(posY, yPrev, this.update, (value, breakpoint) => {
      self.update.breakpoints[breakpoint].call(self, $el, posY, yPrev);
    });
  }

  jQuery() {
    $ = jQuery;
    if (!$) {
      throw 'jQuery is not defined';
    }
  }

  /**
   * @param {String} selector
   * @param {Object} options
   */
  styleCollection(selector, options) {
    var $el, css;
    var { center, zIndex, hide } = options;
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

};

},{"./ParallaxElement":4,"./utils":6}],4:[function(require,module,exports){
const { prefix, normalizeOptions, runUpdate } = require('./utils');

var $;

module.exports = class ParallaxElement {

  /**
   * @param {String} selector
   * @param {Object} options
   * @param {Object} offsetTop
   */
  constructor(selector, options, offsetTop) {
    options = normalizeOptions(options, {
      top: { value: 0 },
      hide: { value: false },
      zIndex: { value: -1 },
      speed: { value: 1 },
      center: { value: false },
      update: { value: () => {} }
    });
    const { top, hide, zIndex, speed, center, update } = options;

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
    this.styleElement(selector, { center, top });
  }

  /**
   * @param {Number} posY
   */
  moveElement(posY) {
    var $el, yPrev, tPrev, yNew, speed, breakpoint, prevBreakpoint, delta, prefix;

    this.runCallbacks(posY);

    yPrev = this.yPrev || 0;
    tPrev = this.tPrev || 0;
    prefix = this.prefix;
    $el = this.$el;
    speed = this.speed.value;
    breakpoint = this.speed._breakpoint;

    if (breakpoint !== undefined) {
      let lastSpeed, yDiff;
      delta = 0;
      lastSpeed = this.speed._lastSpeed;

      yDiff = yPrev - breakpoint;
      delta += Math.round(yDiff * lastSpeed * 100) / 100;

      yDiff = breakpoint - posY;
      delta += Math.round(yDiff * speed * 100) / 100;

      this.speed._breakpoint = undefined;
    } else {
      let yDiff;
      delta = 0;
      yDiff = yPrev - posY;
      delta = Math.round(yDiff * speed * 100) / 100;
    }

    yNew = tPrev + delta;

    $el[0].style[prefix.dom + 'Transform'] = `translate3d(0px, ${yNew}px, 0) translateZ(0) scale(1)`;
    this.yPrev = posY;
    this.tPrev = yNew;
    return this;
  }

  /**
   * @param {Number} posY
   */
  runCallbacks(posY) {
    this.updateHide(posY);
    this.updateTop(posY);
    this.updateOffset(posY);
    this.updateSpeed(posY);
    this.updateCallback(posY);
  }

  /**
   * @param {Number} posY
   */
  updateHide(posY) {
    var yPrev = this.yPrev;
    runUpdate(posY, yPrev, this.hide, value => {
      this.hide.value = value;
      this.$el.css('display', value ? 'none' : 'block');
    });
  }

  /**
   * @param {Number} posY
   */
  updateTop(posY) {
    var yPrev = this.yPrev;
    runUpdate(posY, yPrev, this.top, value => {
      var yOffset = this.yOffset;
      this.top.value = value = value + yOffset;
      this.$el.css('top', value + 'px');
    });
  }

  /**
   * @param {Number} posY
   */
  updateOffset(posY) {
    var yPrev = this.yPrev;
    runUpdate(posY, yPrev, this.offsetTop, value => {
      var yDiff, top;
      yDiff = value - this.yOffset;
      this.yOffset = value;
      top = parseInt(this.$el.css('top'), 10);
      this.$el.css('top', top + yDiff + 'px');
    });
  }

  /**
   * @param {Number} posY
   */
  updateSpeed(posY) {
    var yPrev = this.yPrev;
    runUpdate(posY, yPrev, this.speed, (value, breakpoint, scrollingDown, actualBreakpoint) => {
      this.speed._breakpoint = actualBreakpoint;
      this.speed._lastSpeed = this.speed.value;
      this.speed.value = value;
    });
  }

  /**
   * @param {Number} posY
   */
  updateCallback(posY) {
    var yPrev, $el, self;
    yPrev = this.yPrev;
    $el = this.$el;
    self = this;
    runUpdate(posY, yPrev, this.update, (value, breakpoint) => {
      self.update.breakpoints[breakpoint].call(self, $el, posY, yPrev);
    });
  }

  /**
   * @param {String} selector
   * @param {Object} options
   */
  styleElement(selector, options) {
    var $el, css, yOffset;
    var { center, top } = options;
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

  jQuery() {
    $ = jQuery;
    if (!$) {
      throw 'jQuery is not defined';
    }
    return this;
  }

};

},{"./utils":6}],5:[function(require,module,exports){
module.exports = require('./ParallaxBro');

},{"./ParallaxBro":2}],6:[function(require,module,exports){
const self = module.exports;

self.callBreakpoints = (posY, yPrev, breakpoints, callback) => {
  var scrollingDown, yDiff;
  scrollingDown = yPrev < posY;
  yDiff = scrollingDown ? posY - yPrev : yPrev - posY;
  breakpoints = breakpoints.map(breakpoint => parseInt(breakpoint, 10));
  // @todo - we could use a different technique but this one works w/ little aparent downsides.
  for (let i = 0; i < yDiff; i++) {
    let pos, index;
    pos = scrollingDown ? yPrev + i : yPrev - i;
    index = breakpoints.indexOf(pos);
    if (index > -1) {
      let i = scrollingDown ? index : index - 1;
      callback.call(null, breakpoints[i], scrollingDown, breakpoints[index]);
    }
  }
};

self.runUpdate = (posY, yPrev, obj, callback) => {
  var breakpoints = Object.keys(obj.breakpoints);

  // Call on init.
  if (yPrev === undefined) {
    var value = obj.breakpoints[posY];
    if (value !== undefined) {
      callback.call(null, value, posY, true);
    }
  }
  self.callBreakpoints(posY, yPrev, breakpoints, (breakpoint, scrollingDown, actualBreakpoint) => {
    var value = obj.breakpoints[breakpoint];
    callback.call(null, value, breakpoint, scrollingDown, actualBreakpoint);
  });
};

self.normalizeOptions = (options, defaults) => {
  var keys;

  options = Object.assign({}, defaults, options);
  keys = Object.keys(options);

  keys.forEach(key => {
    var value, isObject;
    value = options[key];
    isObject = self.isType(value, 'object');
    if (isObject) {
      let value1 = value && value['0'] ? value['0'] : defaults[key].value;
      delete value.value;
      options[key] = {
        value: value1,
        breakpoints: Object.assign({}, { 0: value1 }, value)
      };
    } else {
      options[key] = {
        value,
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
self.isType = (value, type) => {
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
      return typeof value === 'object' && value !== null && Array.isArray(value) === false;
    case 'null':
      return value === null;
    case 'undefined':
      return value === undefined;
    case 'function':
      return Object.prototype.toString.call(value) === '[object Function]';
    case 'symbol':
      return typeof value === 'symbol';
    case 'NaN':
      return Number.isNaN(value);
    case 'date':
      return value instanceof Date;
    default:
      throw new Error(`Unrecgonized type: "${type}"`);
  }
};

self.prefix = () => {
  var styles;
  styles = window.getComputedStyle(document.documentElement, ''), pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1], dom = 'webkit|Moz|MS|O'.match(new RegExp('(' + pre + ')', 'i'))[1];
  return {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
};

// http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
self.debounce = (func, threshold, execAsap) => {
  var timeout;
  return function debounced() {
    var obj = this,
        args = arguments;
    function delayed() {
      if (!execAsap) func.apply(obj, args);
      timeout = null;
    }
    if (timeout) {
      clearTimeout(timeout);
    } else if (execAsap) {
      func.apply(obj, args);
    }
    timeout = setTimeout(delayed, threshold || 100);
  };
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmpzIiwibGliL1BhcmFsbGF4QnJvLmpzIiwibGliL1BhcmFsbGF4Q29sbGVjdGlvbi5qcyIsImxpYi9QYXJhbGxheEVsZW1lbnQuanMiLCJsaWIvaW5kZXguanMiLCJsaWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxNQUFNLGNBQWMsUUFBUSxRQUFSLENBQXBCOztBQUVBLE1BQU0sU0FBUyxJQUFJLFdBQUosRUFBZjs7QUFFQSxJQUFJLEtBQUosRUFBVyxLQUFYOztBQUVBLFFBQVEsT0FBTyxhQUFQLENBQXFCLGNBQXJCLEVBQXFDO0FBQzNDLE9BQUssRUFBQyxHQUFHLEdBQUosRUFBUyxLQUFLLEdBQWQsRUFEc0M7QUFFM0M7QUFDQSxVQUFRO0FBSG1DLENBQXJDLENBQVI7O0FBTUEsTUFBTSxXQUFOLENBQWtCO0FBQ2hCLFdBQVM7QUFDUCxXQUFPO0FBQ0wsU0FBRztBQURFLEtBREE7QUFLUCxTQUFLO0FBQ0g7QUFERztBQUxFO0FBRE8sQ0FBbEI7OztBQ1pBLE1BQU0scUJBQXFCLFFBQVEsc0JBQVIsQ0FBM0I7O0FBRUEsSUFBSSxDQUFKOztBQUVBLE9BQU8sT0FBUCxHQUFpQixNQUFNLFVBQU4sQ0FBaUI7O0FBRWhDLGNBQVksT0FBWixFQUFxQjtBQUNuQixVQUFNLEVBQUMsT0FBRCxFQUFVLGFBQVYsS0FBMkIsS0FBSyxnQkFBTCxDQUFzQixPQUF0QixDQUFqQzs7QUFFQSxTQUFLLFdBQUwsR0FBbUIsRUFBbkI7O0FBRUEsU0FBSyxNQUFMO0FBQ0EsU0FBSyxnQkFBTCxDQUFzQixPQUF0QjtBQUNBLFNBQUssVUFBTDtBQUNBLFFBQUksQ0FBQyxhQUFMLEVBQW9CO0FBQ2xCLFdBQUssUUFBTDtBQUNEO0FBQ0Y7O0FBRUQsZ0JBQWMsUUFBZCxFQUF3QixHQUF4QixFQUE2QjtBQUMzQixRQUFJLFVBQUo7QUFDQSxpQkFBYSxJQUFJ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QUssR0FBTCxDQUhuRCxFQUlKLENBSkksQ0FEUixFQU1FLE1BQU8saUJBQUQsQ0FBb0IsS0FBcEIsQ0FBMEIsSUFBSSxNQUFKLENBQVcsTUFBTSxHQUFOLEdBQVksR0FBdkIsRUFBNEIsR0FBNUIsQ0FBMUIsRUFBNEQsQ0FBNUQsQ0FOUjtBQU9FLFNBQU87QUFDTCxTQUFLLEdBREE7QUFFTCxlQUFXLEdBRk47QUFHTCxTQUFLLE1BQU0sR0FBTixHQUFZLEdBSFo7QUFJTCxRQUFJLElBQUksQ0FBSixFQUFPLFdBQVAsS0FBdUIsSUFBSSxNQUFKLENBQVcsQ0FBWDtBQUp0QixHQUFQO0FBTUgsQ0FmRDs7QUFpQkE7QUFDQSxLQUFLLFFBQUwsR0FBZ0IsQ0FBQyxJQUFELEVBQU8sU0FBUCxFQUFrQixRQUFsQixLQUErQjtBQUM3QyxNQUFJLE9BQUo7QUFDQSxTQUFPLFNBQVMsU0FBVCxHQUFzQjtBQUMzQixRQUFJLE1BQU0sSUFBVjtBQUFBLFFBQWdCLE9BQU8sU0FBdkI7QUFDQSxhQUFTLE9BQVQsR0FBb0I7QUFDbEIsVUFBSSxDQUFDLFFBQUwsRUFBZSxLQUFLLEtBQUwsQ0FBVyxHQUFYLEVBQWdCLElBQWhCO0FBQ2YsZ0JBQVUsSUFBVjtBQUNEO0FBQ0QsUUFBSSxPQUFKLEVBQWE7QUFDWCxtQkFBYSxPQUFiO0FBQ0QsS0FGRCxNQUdLLElBQUksUUFBSixFQUFjO0FBQ2pCLFdBQUssS0FBTCxDQUFXLEdBQVgsRUFBZ0IsSUFBaEI7QUFDRDtBQUNELGNBQVUsV0FBVyxPQUFYLEVBQW9CLGFBQWEsR0FBakMsQ0FBVjtBQUNELEdBYkQ7QUFjRCxDQWhCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBQYXJhbGxheEJybyA9IHJlcXVpcmUoJy4uL2xpYicpO1xuXG5jb25zdCBsYXhicm8gPSBuZXcgUGFyYWxsYXhCcm8oKTtcblxudmFyIHBhZ2UxLCBwYWdlMjtcblxucGFnZTEgPSBsYXhicm8uYWRkQ29sbGVjdGlvbignI2NvbGxlY3Rpb24xJywge1xuICB0b3A6IHswOiAyMDAsIDMwMDogMzUwfSxcbiAgLy8gaGlkZTogezEwMDA6IHRydWV9LFxuICBjZW50ZXI6IHRydWUsXG59KTtcblxucGFnZTEuYWRkRWxlbWVudHMoe1xuICAnI2ltZzEnOiB7XG4gICAgc3BlZWQ6IHtcbiAgICAgIDA6IDEsXG4gICAgICAvLyAzMDA6IC0xLFxuICAgIH0sXG4gICAgdG9wOiB7XG4gICAgICAvLyA1MDA6IDEwMCxcbiAgICB9LFxuICAgIC8vIGhpZGU6IHtcbiAgICAvLyAgIDEwMDogZmFsc2UsXG4gICAgLy8gICA2MDA6IHRydWUsXG4gICAgLy8gfSxcbiAgICAvLyBzcGVlZDoge1xuICAgIC8vICAgMDogMSxcbiAgICAvLyAgIDIwMDogLjUsXG4gICAgLy8gICAzMDA6IDAsXG4gICAgLy8gICA0MDA6IC0xLFxuICAgIC8vIH0sXG4gIH0sXG4gIC8vICcjaW1nMic6IHtcbiAgLy8gICBoaWRlOiB0cnVlLFxuICAvLyAgIHRvcDogODAwLFxuICAvLyAgIHpJbmRleDogMCxcbiAgLy8gICBzcGVlZDogLjEsXG4gIC8vICAgdXBkYXRlOiB7XG4gIC8vICAgICAwOiAoKSA9PiB7XG4gIC8vICAgICAgIHRoaXMuZWwuZmFkZUluKCk7XG4gIC8vICAgICB9LFxuICAvLyAgICAgNDAwOiAoKSA9PiB7XG4gIC8vICAgICAgIHRoaXMuZWwuZmFkZU91dCgpO1xuICAvLyAgICAgfVxuICAvLyAgIH1cbiAgLy8gfVxufSk7XG4iLCJjb25zdCBQYXJhbGxheENvbGxlY3Rpb24gPSByZXF1aXJlKCcuL1BhcmFsbGF4Q29sbGVjdGlvbicpO1xuXG52YXIgJDtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYXJhbGF4QnJvIHtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgY29uc3Qge3dyYXBwZXIsIGRpc2FibGVTdHlsZXN9ID0gdGhpcy5ub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb2xsZWN0aW9ucyA9IFtdO1xuXG4gICAgdGhpcy5qUXVlcnkoKTtcbiAgICB0aGlzLmNhY2hlRE9NRWxlbWVudHMod3JhcHBlcik7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgaWYgKCFkaXNhYmxlU3R5bGVzKSB7XG4gICAgICB0aGlzLnN0eWxlRE9NKCk7XG4gICAgfVxuICB9XG5cbiAgYWRkQ29sbGVjdGlvbihzZWxlY3Rvciwgb2JqKSB7XG4gICAgdmFyIGNvbGxlY3Rpb247XG4gICAgY29sbGVjdGlvbiA9IG5ldyBQYXJhbGxheENvbGxlY3Rpb24oc2VsZWN0b3IsIG9iaik7XG4gICAgdGhpcy5jb2xsZWN0aW9ucy5wdXNoKGNvbGxlY3Rpb24pO1xuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgY2FjaGVET01FbGVtZW50cyh3cmFwcGVyKSB7XG4gICAgdGhpcy4kZWwgPSB7fTtcbiAgICB0aGlzLiRlbC53aW4gPSAkKHdpbmRvdyk7XG4gICAgdGhpcy4kZWwuZG9jID0gJChkb2N1bWVudCk7XG4gICAgdGhpcy4kZWwuYm9keSA9ICQoJ2JvZHknKTtcbiAgICB0aGlzLiRlbC53cmFwcGVyID0gJCh3cmFwcGVyKTtcbiAgfVxuXG4gIHN0eWxlRE9NKCkge1xuICAgIHZhciB7Ym9keSwgd3JhcHBlciwgZG9jfSA9IHRoaXMuJGVsO1xuICAgIGJvZHkuY3NzKCdoZWlnaHQnLCAnMTAwJScpO1xuICAgIHdyYXBwZXIuY3NzKCdtaW4taGVpZ2h0JywgJzEwMCUnKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgY29uc3QgdHJhY2sgPSAoKSA9PiB7XG4gICAgICB2YXIgcG9zWSA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgIHRoaXMubW92ZUVsZW1lbnRzKHBvc1kpO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRyYWNrKTtcbiAgICB9XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRyYWNrKTtcbiAgfVxuXG5cbiAgbW92ZUVsZW1lbnRzKHBvc1kpIHtcbiAgICB2YXIgY29sbGVjdGlvbnM7XG4gICAgY29sbGVjdGlvbnMgPSB0aGlzLmNvbGxlY3Rpb25zO1xuICAgIGNvbGxlY3Rpb25zLmZvckVhY2goY29sbGVjdGlvbiA9PiBjb2xsZWN0aW9uLm1vdmVFbGVtZW50cyhwb3NZKSk7XG4gIH1cblxuICBqUXVlcnkoKSB7XG4gICAgJCA9IGpRdWVyeTtcbiAgICBpZiAoISQpIHtcbiAgICAgIHRocm93ICdqUXVlcnkgaXMgbm90IGRlZmluZWQnO1xuICAgIH1cbiAgfVxuXG4gIG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucykge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICB3cmFwcGVyOiAnI3BhcmFsbGF4JyxcbiAgICAgIGRpc2FibGVTdHlsZXM6IGZhbHNlLFxuICAgIH0sIG9wdGlvbnMpO1xuICB9XG5cbn1cbiIsImNvbnN0IHtub3JtYWxpemVPcHRpb25zLCBydW5VcGRhdGV9ID0gcmVxdWlyZSgnLi91dGlscycpO1xuY29uc3QgUGFyYWxsYXhFbGVtZW50ID0gcmVxdWlyZSgnLi9QYXJhbGxheEVsZW1lbnQnKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxsYXhDb2xsZWN0aW9uIHtcblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMsIHtcbiAgICAgIHRvcDoge3ZhbHVlOiAwfSxcbiAgICAgIGhpZGU6IHt2YWx1ZTogZmFsc2V9LFxuICAgICAgekluZGV4OiB7dmFsdWU6IC0xfSxcbiAgICAgIGNlbnRlcjoge3ZhbHVlOiBmYWxzZX0sXG4gICAgICB1cGRhdGU6IHt2YWx1ZTogKCkgPT4ge319LFxuICAgIH0pO1xuICAgIGNvbnN0IHt0b3AsIGhpZGUsIHpJbmRleCwgY2VudGVyLCB1cGRhdGV9ID0gb3B0aW9ucztcblxuICAgIHRoaXMuJGVsO1xuICAgIHRoaXMuZWxlbWVudHMgPSBbXTtcbiAgICB0aGlzLnlQcmV2O1xuXG4gICAgdGhpcy50b3AgPSB0b3A7XG4gICAgdGhpcy5oaWRlID0gaGlkZTtcbiAgICB0aGlzLnpJbmRleCA9IHpJbmRleDtcbiAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcbiAgICB0aGlzLnVwZGF0ZSA9IHVwZGF0ZTtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5zdHlsZUNvbGxlY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICovXG4gIGFkZEVsZW1lbnRzKG9iaikge1xuICAgIHZhciBzZWxlY3RvcnMsIHRvcCwgY2VudGVyO1xuICAgIHNlbGVjdG9ycyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgc2VsZWN0b3JzLmZvckVhY2goc2VsZWN0b3IgPT4ge1xuICAgICAgdmFyIG9wdGlvbnMgPSBvYmpbc2VsZWN0b3JdO1xuICAgICAgdGhpcy5hZGRFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIGFkZEVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgZWxlbWVudDtcbiAgICBlbGVtZW50ID0gbmV3IFBhcmFsbGF4RWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucywgdGhpcy50b3ApO1xuICAgIHRoaXMuZWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgbW92ZUVsZW1lbnRzKHBvc1kpIHtcbiAgICB2YXIgZWxlbWVudHM7XG4gICAgZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzO1xuICAgIHRoaXMucnVuQ2FsbGJhY2tzKHBvc1kpO1xuICAgIGVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiBlbGVtZW50Lm1vdmVFbGVtZW50KHBvc1kpKTtcbiAgICB0aGlzLnlQcmV2ID0gcG9zWTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgcnVuQ2FsbGJhY2tzKHBvc1kpIHtcbiAgICB0aGlzLnVwZGF0ZUhpZGUocG9zWSk7XG4gICAgdGhpcy51cGRhdGVaaW5kZXgocG9zWSk7XG4gICAgdGhpcy51cGRhdGVDZW50ZXIocG9zWSk7XG4gICAgdGhpcy51cGRhdGVDYWxsYmFjayhwb3NZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlSGlkZShwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuaGlkZSwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLmhpZGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuJGVsLmNzcygnb3BhY2l0eScsIHZhbHVlID8gMCA6IDEpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVaaW5kZXgocG9zWSkge1xuICAgIHZhciBwcmV2WSA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHByZXZZLCB0aGlzLnpJbmRleCwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLnpJbmRleC52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy4kZWwuY3NzKCd6SW5kZXgnLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZUNlbnRlcihwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy55UHJldjtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuY2VudGVyLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuY2VudGVyLnZhbHVlID0gdmFsdWU7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy4kZWwuY3NzKHtcbiAgICAgICAgICAnbWFyZ2luLXJpZ2h0JzogJ2F1dG8nLFxuICAgICAgICAgICdtYXJnaW4tbGVmdCc6ICdhdXRvJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy4kZWwuY3NzKHtcbiAgICAgICAgICAnbWFyZ2luLXJpZ2h0JzogJ2luaGVyaXQnLFxuICAgICAgICAgICdtYXJnaW4tbGVmdCc6ICdpbmhlcml0JyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc1lcbiAgICovXG4gIHVwZGF0ZUNhbGxiYWNrKHBvc1kpIHtcbiAgICB2YXIgeVByZXYsICRlbCwgc2VsZjtcbiAgICB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgJGVsID0gdGhpcy4kZWw7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLnVwZGF0ZSwgKHZhbHVlLCBicmVha3BvaW50KSA9PiB7XG4gICAgICBzZWxmLnVwZGF0ZS5icmVha3BvaW50c1ticmVha3BvaW50XS5jYWxsKHNlbGYsICRlbCwgcG9zWSwgeVByZXYpO1xuICAgIH0pO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBzdHlsZUNvbGxlY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgJGVsLCBjc3M7XG4gICAgdmFyIHtjZW50ZXIsIHpJbmRleCwgaGlkZX0gPSBvcHRpb25zO1xuICAgIGNzcyA9IHt9O1xuICAgIGNzcy56SW5kZXggPSB6SW5kZXgudmFsdWU7XG4gICAgaWYgKGNlbnRlci52YWx1ZSkge1xuICAgICAgY3NzWydtYXJnaW4tcmlnaHQnXSA9ICdhdXRvJztcbiAgICAgIGNzc1snbWFyZ2luLWxlZnQnXSA9ICdhdXRvJztcbiAgICB9XG4gICAgaWYgKGhpZGUudmFsdWUpIHtcbiAgICAgIGNzcy5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cbiAgICAkZWwgPSAkKHNlbGVjdG9yKTtcbiAgICAkZWwuY3NzKGNzcyk7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxufVxuIiwiY29uc3Qge3ByZWZpeCwgbm9ybWFsaXplT3B0aW9ucywgcnVuVXBkYXRlfSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxsYXhFbGVtZW50IHtcblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvZmZzZXRUb3BcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBvcHRpb25zLCBvZmZzZXRUb3ApIHtcbiAgICBvcHRpb25zID0gbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zLCB7XG4gICAgICB0b3A6IHt2YWx1ZTogMH0sXG4gICAgICBoaWRlOiB7dmFsdWU6IGZhbHNlfSxcbiAgICAgIHpJbmRleDoge3ZhbHVlOiAtMX0sXG4gICAgICBzcGVlZDoge3ZhbHVlOiAxfSxcbiAgICAgIGNlbnRlcjoge3ZhbHVlOiBmYWxzZX0sXG4gICAgICB1cGRhdGU6IHt2YWx1ZTogKCkgPT4ge319LFxuICAgIH0pO1xuICAgIGNvbnN0IHt0b3AsIGhpZGUsIHpJbmRleCwgc3BlZWQsIGNlbnRlciwgdXBkYXRlfSA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLiRlbDtcbiAgICB0aGlzLnByZWZpeCA9IHByZWZpeCgpO1xuICAgIHRoaXMub2Zmc2V0VG9wID0gb2Zmc2V0VG9wO1xuICAgIHRoaXMueU9mZnNldCA9IG9mZnNldFRvcC52YWx1ZTtcbiAgICB0aGlzLnlQcmV2O1xuICAgIHRoaXMudFByZXY7XG5cbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLmhpZGUgPSBoaWRlO1xuICAgIHRoaXMuekluZGV4ID0gekluZGV4O1xuICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcbiAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcbiAgICB0aGlzLnVwZGF0ZSA9IHVwZGF0ZTtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5zdHlsZUVsZW1lbnQoc2VsZWN0b3IsIHtjZW50ZXIsIHRvcH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICBtb3ZlRWxlbWVudChwb3NZKSB7XG4gICAgdmFyICRlbCwgeVByZXYsIHRQcmV2LCB5TmV3LCBzcGVlZCwgYnJlYWtwb2ludCwgcHJldkJyZWFrcG9pbnQsIGRlbHRhLCBwcmVmaXg7XG5cbiAgICB0aGlzLnJ1bkNhbGxiYWNrcyhwb3NZKTtcblxuICAgIHlQcmV2ID0gdGhpcy55UHJldiB8fCAwO1xuICAgIHRQcmV2ID0gdGhpcy50UHJldiB8fCAwO1xuICAgIHByZWZpeCA9IHRoaXMucHJlZml4O1xuICAgICRlbCA9IHRoaXMuJGVsO1xuICAgIHNwZWVkID0gdGhpcy5zcGVlZC52YWx1ZTtcbiAgICBicmVha3BvaW50ID0gdGhpcy5zcGVlZC5fYnJlYWtwb2ludDtcblxuICAgIGlmIChicmVha3BvaW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGxldCBsYXN0U3BlZWQsIHlEaWZmO1xuICAgICAgZGVsdGEgPSAwO1xuICAgICAgbGFzdFNwZWVkID0gdGhpcy5zcGVlZC5fbGFzdFNwZWVkO1xuXG4gICAgICB5RGlmZiA9IHlQcmV2IC0gYnJlYWtwb2ludDtcbiAgICAgIGRlbHRhICs9IE1hdGgucm91bmQoeURpZmYqbGFzdFNwZWVkKjEwMCkgLyAxMDA7XG5cbiAgICAgIHlEaWZmID0gYnJlYWtwb2ludCAtIHBvc1k7XG4gICAgICBkZWx0YSArPSBNYXRoLnJvdW5kKHlEaWZmKnNwZWVkKjEwMCkgLyAxMDA7XG5cbiAgICAgIHRoaXMuc3BlZWQuX2JyZWFrcG9pbnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IHlEaWZmO1xuICAgICAgZGVsdGEgPSAwO1xuICAgICAgeURpZmYgPSB5UHJldiAtIHBvc1k7XG4gICAgICBkZWx0YSA9IE1hdGgucm91bmQoeURpZmYqc3BlZWQqMTAwKSAvIDEwMDtcbiAgICB9XG5cbiAgICB5TmV3ID0gdFByZXYgKyBkZWx0YTtcblxuICAgICRlbFswXS5zdHlsZVtwcmVmaXguZG9tICsgJ1RyYW5zZm9ybSddID0gYHRyYW5zbGF0ZTNkKDBweCwgJHt5TmV3fXB4LCAwKSB0cmFuc2xhdGVaKDApIHNjYWxlKDEpYDtcbiAgICB0aGlzLnlQcmV2ID0gcG9zWTtcbiAgICB0aGlzLnRQcmV2ID0geU5ldztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgcnVuQ2FsbGJhY2tzKHBvc1kpIHtcbiAgICB0aGlzLnVwZGF0ZUhpZGUocG9zWSk7XG4gICAgdGhpcy51cGRhdGVUb3AocG9zWSk7XG4gICAgdGhpcy51cGRhdGVPZmZzZXQocG9zWSk7XG4gICAgdGhpcy51cGRhdGVTcGVlZChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZUNhbGxiYWNrKHBvc1kpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVIaWRlKHBvc1kpIHtcbiAgICB2YXIgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy5oaWRlLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuaGlkZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy4kZWwuY3NzKCdkaXNwbGF5JywgdmFsdWUgPyAnbm9uZScgOiAnYmxvY2snKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlVG9wKHBvc1kpIHtcbiAgICB2YXIgeVByZXYgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCB5UHJldiwgdGhpcy50b3AsICh2YWx1ZSkgPT4ge1xuICAgICAgdmFyIHlPZmZzZXQgPSB0aGlzLnlPZmZzZXQ7XG4gICAgICB0aGlzLnRvcC52YWx1ZSA9IHZhbHVlID0gdmFsdWUgKyB5T2Zmc2V0O1xuICAgICAgdGhpcy4kZWwuY3NzKCd0b3AnLCB2YWx1ZSArICdweCcpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3NZXG4gICAqL1xuICB1cGRhdGVPZmZzZXQocG9zWSkge1xuICAgIHZhciB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLm9mZnNldFRvcCwgKHZhbHVlKSA9PiB7XG4gICAgICB2YXIgeURpZmYsIHRvcDtcbiAgICAgIHlEaWZmID0gdmFsdWUgLSB0aGlzLnlPZmZzZXQ7XG4gICAgICB0aGlzLnlPZmZzZXQgPSB2YWx1ZTtcbiAgICAgIHRvcCA9IHBhcnNlSW50KHRoaXMuJGVsLmNzcygndG9wJyksIDEwKTtcbiAgICAgIHRoaXMuJGVsLmNzcygndG9wJywgdG9wICsgeURpZmYgKyAncHgnKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlU3BlZWQocG9zWSkge1xuICAgIHZhciB5UHJldiA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHlQcmV2LCB0aGlzLnNwZWVkLCAodmFsdWUsIGJyZWFrcG9pbnQsIHNjcm9sbGluZ0Rvd24sIGFjdHVhbEJyZWFrcG9pbnQpID0+IHtcbiAgICAgIHRoaXMuc3BlZWQuX2JyZWFrcG9pbnQgPSBhY3R1YWxCcmVha3BvaW50O1xuICAgICAgdGhpcy5zcGVlZC5fbGFzdFNwZWVkID0gdGhpcy5zcGVlZC52YWx1ZTtcbiAgICAgIHRoaXMuc3BlZWQudmFsdWUgPSB2YWx1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zWVxuICAgKi9cbiAgdXBkYXRlQ2FsbGJhY2socG9zWSkge1xuICAgIHZhciB5UHJldiwgJGVsLCBzZWxmO1xuICAgIHlQcmV2ID0gdGhpcy55UHJldjtcbiAgICAkZWwgPSB0aGlzLiRlbDtcbiAgICBzZWxmID0gdGhpcztcbiAgICBydW5VcGRhdGUocG9zWSwgeVByZXYsIHRoaXMudXBkYXRlLCAodmFsdWUsIGJyZWFrcG9pbnQpID0+IHtcbiAgICAgIHNlbGYudXBkYXRlLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdLmNhbGwoc2VsZiwgJGVsLCBwb3NZLCB5UHJldik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBzdHlsZUVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgJGVsLCBjc3MsIHlPZmZzZXQ7XG4gICAgdmFyIHtjZW50ZXIsIHRvcH0gPSBvcHRpb25zO1xuICAgIHlPZmZzZXQgPSB0aGlzLnlPZmZzZXQ7XG4gICAgY3NzID0ge1xuICAgICAgJ3Bvc2l0aW9uJzogJ2ZpeGVkJyxcbiAgICAgICdsZWZ0JzogMCxcbiAgICAgICdyaWdodCc6IDAsXG4gICAgfTtcbiAgICBpZiAoY2VudGVyKSB7XG4gICAgICBjc3NbJ21hcmdpbi1yaWdodCddID0gJ2F1dG8nO1xuICAgICAgY3NzWydtYXJnaW4tbGVmdCddID0gJ2F1dG8nO1xuICAgIH1cbiAgICBpZiAodG9wKSB7XG4gICAgICBjc3MudG9wID0gdG9wICsgeU9mZnNldCsncHgnO1xuICAgIH1cbiAgICAkZWwgPSAkKHNlbGVjdG9yKTtcbiAgICAkZWwuY3NzKGNzcyk7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBqUXVlcnkoKSB7XG4gICAgJCA9IGpRdWVyeTtcbiAgICBpZiAoISQpIHtcbiAgICAgIHRocm93ICdqUXVlcnkgaXMgbm90IGRlZmluZWQnO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vUGFyYWxsYXhCcm8nKTtcbiIsImNvbnN0IHNlbGYgPSBtb2R1bGUuZXhwb3J0cztcblxuc2VsZi5jYWxsQnJlYWtwb2ludHMgPSAocG9zWSwgeVByZXYsIGJyZWFrcG9pbnRzLCBjYWxsYmFjaykgPT4ge1xuICB2YXIgc2Nyb2xsaW5nRG93biwgeURpZmY7XG4gIHNjcm9sbGluZ0Rvd24gPSB5UHJldiA8IHBvc1k7XG4gIHlEaWZmID0gc2Nyb2xsaW5nRG93biA/IHBvc1kgLSB5UHJldiA6IHlQcmV2IC0gcG9zWTtcbiAgYnJlYWtwb2ludHMgPSBicmVha3BvaW50cy5tYXAoYnJlYWtwb2ludCA9PiBwYXJzZUludChicmVha3BvaW50LCAxMCkpO1xuICAvLyBAdG9kbyAtIHdlIGNvdWxkIHVzZSBhIGRpZmZlcmVudCB0ZWNobmlxdWUgYnV0IHRoaXMgb25lIHdvcmtzIHcvIGxpdHRsZSBhcGFyZW50IGRvd25zaWRlcy5cbiAgZm9yIChsZXQgaT0wOyBpPHlEaWZmOyBpKyspIHtcbiAgICBsZXQgcG9zLCBpbmRleDtcbiAgICBwb3MgPSBzY3JvbGxpbmdEb3duID8geVByZXYgKyBpIDogeVByZXYgLSBpO1xuICAgIGluZGV4ID0gYnJlYWtwb2ludHMuaW5kZXhPZihwb3MpO1xuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICBsZXQgaSA9IHNjcm9sbGluZ0Rvd24gPyBpbmRleCA6IGluZGV4IC0gMTtcbiAgICAgIGNhbGxiYWNrLmNhbGwobnVsbCwgYnJlYWtwb2ludHNbaV0sIHNjcm9sbGluZ0Rvd24sIGJyZWFrcG9pbnRzW2luZGV4XSk7XG4gICAgfVxuICB9XG59XG5cbnNlbGYucnVuVXBkYXRlID0gKHBvc1ksIHlQcmV2LCBvYmosIGNhbGxiYWNrKSA9PiB7XG4gIHZhciBicmVha3BvaW50cyA9IE9iamVjdC5rZXlzKG9iai5icmVha3BvaW50cyk7XG5cbiAgLy8gQ2FsbCBvbiBpbml0LlxuICBpZiAoeVByZXYgPT09IHVuZGVmaW5lZCkge1xuICAgIHZhciB2YWx1ZSA9IG9iai5icmVha3BvaW50c1twb3NZXTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2FsbGJhY2suY2FsbChudWxsLCB2YWx1ZSwgcG9zWSwgdHJ1ZSk7XG4gICAgfVxuICB9XG4gIHNlbGYuY2FsbEJyZWFrcG9pbnRzKHBvc1ksIHlQcmV2LCBicmVha3BvaW50cywgKGJyZWFrcG9pbnQsIHNjcm9sbGluZ0Rvd24sIGFjdHVhbEJyZWFrcG9pbnQpID0+IHtcbiAgICB2YXIgdmFsdWUgPSBvYmouYnJlYWtwb2ludHNbYnJlYWtwb2ludF07XG4gICAgY2FsbGJhY2suY2FsbChudWxsLCB2YWx1ZSwgYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93biwgYWN0dWFsQnJlYWtwb2ludCk7XG4gIH0pO1xufVxuXG5zZWxmLm5vcm1hbGl6ZU9wdGlvbnMgPSAob3B0aW9ucywgZGVmYXVsdHMpID0+IHtcbiAgdmFyIGtleXM7XG5cbiAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuXG4gIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgIHZhciB2YWx1ZSwgaXNPYmplY3Q7XG4gICAgdmFsdWUgPSBvcHRpb25zW2tleV07XG4gICAgaXNPYmplY3QgPSBzZWxmLmlzVHlwZSh2YWx1ZSwgJ29iamVjdCcpO1xuICAgIGlmIChpc09iamVjdCkge1xuICAgICAgbGV0IHZhbHVlMSA9IHZhbHVlICYmIHZhbHVlWycwJ10gPyB2YWx1ZVsnMCddIDogZGVmYXVsdHNba2V5XS52YWx1ZTtcbiAgICAgIGRlbGV0ZSB2YWx1ZS52YWx1ZTtcbiAgICAgIG9wdGlvbnNba2V5XSA9IHtcbiAgICAgICAgdmFsdWU6IHZhbHVlMSxcbiAgICAgICAgYnJlYWtwb2ludHM6IE9iamVjdC5hc3NpZ24oe30sIHswOiB2YWx1ZTF9LCB2YWx1ZSksXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgb3B0aW9uc1trZXldID0ge1xuICAgICAgICB2YWx1ZSxcbiAgICAgICAgYnJlYWtwb2ludHM6IHswOiB2YWx1ZX1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3B0aW9ucztcbn1cblxuLyoqXG4gKiBHaXZlbiBhIE1peGVkIHZhbHVlIHR5cGUgY2hlY2suXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljLlxuICogQHRlc3RzIHVuaXQuXG4gKi9cbnNlbGYuaXNUeXBlID0gKHZhbHVlLCB0eXBlKSA9PiB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzTmFOKHZhbHVlKSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09IGZhbHNlO1xuICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKTtcbiAgICBjYXNlICdvYmplY3QnOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkgPT09IGZhbHNlO1xuICAgIGNhc2UgJ251bGwnOlxuICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsO1xuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZDtcbiAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCc7XG4gICAgY2FzZSAnTmFOJzpcbiAgICAgIHJldHVybiBOdW1iZXIuaXNOYU4odmFsdWUpO1xuICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnJlY2dvbml6ZWQgdHlwZTogXCIke3R5cGV9XCJgKTtcbiAgfVxufTtcblxuc2VsZi5wcmVmaXggPSAoKSA9PiB7XG4gIHZhciBzdHlsZXM7XG4gIHN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgJycpLFxuICAgIHByZSA9IChBcnJheS5wcm90b3R5cGUuc2xpY2VcbiAgICAgIC5jYWxsKHN0eWxlcylcbiAgICAgIC5qb2luKCcnKVxuICAgICAgLm1hdGNoKC8tKG1venx3ZWJraXR8bXMpLS8pIHx8IChzdHlsZXMuT0xpbmsgPT09ICcnICYmIFsnJywgJ28nXSlcbiAgICApWzFdLFxuICAgIGRvbSA9ICgnd2Via2l0fE1venxNU3xPJykubWF0Y2gobmV3IFJlZ0V4cCgnKCcgKyBwcmUgKyAnKScsICdpJykpWzFdO1xuICAgIHJldHVybiB7XG4gICAgICBkb206IGRvbSxcbiAgICAgIGxvd2VyY2FzZTogcHJlLFxuICAgICAgY3NzOiAnLScgKyBwcmUgKyAnLScsXG4gICAgICBqczogcHJlWzBdLnRvVXBwZXJDYXNlKCkgKyBwcmUuc3Vic3RyKDEpXG4gICAgfTtcbn07XG5cbi8vIGh0dHA6Ly91bnNjcmlwdGFibGUuY29tLzIwMDkvMDMvMjAvZGVib3VuY2luZy1qYXZhc2NyaXB0LW1ldGhvZHMvXG5zZWxmLmRlYm91bmNlID0gKGZ1bmMsIHRocmVzaG9sZCwgZXhlY0FzYXApID0+IHtcbiAgdmFyIHRpbWVvdXQ7XG4gIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQgKCkge1xuICAgIHZhciBvYmogPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuICAgIGZ1bmN0aW9uIGRlbGF5ZWQgKCkge1xuICAgICAgaWYgKCFleGVjQXNhcCkgZnVuYy5hcHBseShvYmosIGFyZ3MpO1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGV4ZWNBc2FwKSB7XG4gICAgICBmdW5jLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgfVxuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHRocmVzaG9sZCB8fCAxMDApO1xuICB9O1xufTtcbiJdfQ==
