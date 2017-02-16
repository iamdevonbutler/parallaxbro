(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const ParallaxBro = require('../lib');

const laxbro = new ParallaxBro();

var page1, page2;

page1 = laxbro.addCollection('#collection1', {
  top: 200,
  // hide: {1000: true},
  center: true
});

page1.addElements({
  '#img1': {
    speed: {
      0: 1,
      300: -1
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

  constructor(selector, options) {
    options = normalizeOptions(options, {
      top: { value: 0 },
      hide: { value: false },
      zIndex: { value: -1 },
      center: { value: false }
    });
    const { top, hide, zIndex, center } = options;

    this.$el;
    this.elements = [];
    this.prevPosY;

    this.top = top;
    this.hide = hide;
    this.zIndex = zIndex;
    this.center = center;

    this.jQuery();
    this.styleCollection(selector, options);
  }

  // hide(value) {
  //   this.hide.value = value;
  //   this.$el.css('display', value ? 'none' : 'block');
  // }

  // zIndex(value) {
  //   this.zIndex.value = value;
  //   this.$el.css('zIndex', value);
  // }
  //
  // top(value) {
  //   var top;
  //   this.top.value = value;
  //   this.$el.children().css('top', value + 'px');
  // }
  //
  // center(value) {
  //   this.center.value = value;
  //   this.$el.children().css({
  //     'margin-right': 'auto',
  //     'margin-left': 'auto',
  //   });
  // }

  addElements(obj) {
    var selectors, top, center;
    selectors = Object.keys(obj);
    selectors.forEach(selector => {
      var options = obj[selector];
      this.addElement(selector, options);
    });
    return this;
  }

  addElement(selector, options) {
    var element;
    element = new ParallaxElement(selector, options, this.top);
    this.elements.push(element);
    return this;
  }

  moveElements(posY) {
    var elements;
    elements = this.elements;
    this.runCallbacks(posY);
    elements.forEach(element => element.moveElement(posY));
    this.prevPosY = posY;
  }

  runCallbacks(posY) {
    this.updateHide(posY);
    // this.updateZindex(posY);
    // this.updateCenter(posY);
  }

  updateHide(posY) {
    var prevY = this.prevPosY;
    runUpdate(posY, prevY, this.hide, value => {
      this.$el.css('opacity', value ? 0 : 1);
    });
  }

  updateZindex(posY) {
    var prevY = this.prevPosY;
    runUpdate(posY, prevY, this.zIndex, value => {
      this.$el.css('zIndex', value);
    });
  }

  updateCenter(posY) {
    var prevY = this.prevPosY;
    runUpdate(posY, prevY, this.center, value => {
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

  jQuery() {
    $ = jQuery;
    if (!$) {
      throw 'jQuery is not defined';
    }
  }

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

  constructor(selector, options, offsetTop) {
    options = normalizeOptions(options, {
      top: { value: 0 },
      hide: { value: false },
      zIndex: { value: -1 },
      speed: { value: 1 },
      center: { value: false }
    });
    const { top, hide, zIndex, speed, center } = options;

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

    // this.delta  = 0;
    // this.update = {};

    this.jQuery();
    this.styleElement(selector, { center, top });
  }

  // hide(value) {
  //   this.hide.value = value;
  //   this.$el.css('display', value ? 'none' : 'block');
  // }
  //
  // zIndex(value) {
  //   this.zIndex.value = value;
  //   this.$el.css('zIndex', value);
  // }
  //
  // top(value) {
  //   this.top.value = value;
  //   this.$el.css('top', value+'px');
  // }
  //
  // center(value) {
  //   this.center.value = value;
  //   this.$el.css({
  //     'margin-right': 'auto',
  //     'margin-left': 'auto',
  //   });
  // }

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
      console.log(posY, yPrev, delta);
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

  runCallbacks(posY) {
    this.updateHide(posY);
    this.updateTop(posY);
    this.updateOffset(posY);
    this.updateSpeed(posY);
  }

  updateOffset(posY) {
    var prevY = this.yPrev;
    runUpdate(posY, prevY, this.offsetTop, value => {
      this.offsetY = value;
    });
  }

  updateSpeed(posY) {
    var prevY = this.yPrev;
    runUpdate(posY, prevY, this.speed, (value, breakpoint, scrollingDown, actualBreakpoint) => {
      this.speed._breakpoint = actualBreakpoint;
      this.speed._lastSpeed = this.speed.value;
      this.speed.value = value;
    });
  }

  updateHide(posY) {
    var prevY = this.yPrev;
    runUpdate(posY, prevY, this.hide, value => {
      this.$el.css('display', value ? 'none' : 'block');
    });
  }

  updateTop(posY) {
    var prevY = this.yPrev;
    runUpdate(posY, prevY, this.top, value => {
      var yOffset = this.yOffset;
      this.$el.css('top', value + yOffset + 'px');
    });
  }

  /**
   * @param  {String} selector
   * @param  {Object} options
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

self.callBreakpoints = (posY, prevPosY, breakpoints, callback) => {
  var scrollingDown, yDiff;
  scrollingDown = prevPosY < posY;
  yDiff = scrollingDown ? posY - prevPosY : prevPosY - posY;
  breakpoints = breakpoints.map(breakpoint => parseInt(breakpoint, 10));
  for (let i = 0; i < yDiff; i++) {
    let pos, index;
    pos = scrollingDown ? prevPosY + i : prevPosY - i;
    index = breakpoints.indexOf(pos);
    if (index > -1) {
      let i = scrollingDown ? index : index - 1;
      callback.call(null, breakpoints[i], scrollingDown, breakpoints[index]);
    }
  }
};

self.runUpdate = (posY, prevPosY, obj, callback) => {
  var breakpoints = Object.keys(obj.breakpoints);

  if (prevPosY === undefined) {
    var value = obj.breakpoints[posY];
    if (value !== undefined) {
      callback.call(null, value, posY, true);
    }
  }
  self.callBreakpoints(posY, prevPosY, breakpoints, (breakpoint, scrollingDown, actualBreakpoint) => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmpzIiwibGliL1BhcmFsbGF4QnJvLmpzIiwibGliL1BhcmFsbGF4Q29sbGVjdGlvbi5qcyIsImxpYi9QYXJhbGxheEVsZW1lbnQuanMiLCJsaWIvaW5kZXguanMiLCJsaWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxNQUFNLGNBQWMsUUFBUSxRQUFSLENBQXBCOztBQUVBLE1BQU0sU0FBUyxJQUFJLFdBQUosRUFBZjs7QUFFQSxJQUFJLEtBQUosRUFBVyxLQUFYOztBQUVBLFFBQVEsT0FBTyxhQUFQLENBQXFCLGNBQXJCLEVBQXFDO0FBQzNDLE9BQUssR0FEc0M7QUFFM0M7QUFDQSxVQUFRO0FBSG1DLENBQXJDLENBQVI7O0FBTUEsTUFBTSxXQUFOLENBQWtCO0FBQ2hCLFdBQVM7QUFDUCxXQUFPO0FBQ0wsU0FBRyxDQURFO0FBRUwsV0FBSyxDQUFDO0FBRkQsS0FEQTtBQUtQLFNBQUs7QUFDSDtBQURHO0FBTEU7QUFETyxDQUFsQjs7O0FDWkEsTUFBTSxxQkFBcUIsUUFBUSxzQkFBUixDQUEzQjs7QUFFQSxJQUFJLENBQUo7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLE1BQU0sVUFBTixDQUFpQjs7QUFFaEMsY0FBWSxPQUFaLEVBQXFCO0FBQ25CLFVBQU0sRUFBQyxPQUFELEVBQVUsYUFBVixLQUEyQixLQUFLLGdCQUFMLENBQXNCLE9BQXRCLENBQWpDOztBQUVBLFNBQUssV0FBTCxHQUFtQixFQUFuQjs7QUFFQSxTQUFLLE1BQUw7QUFDQSxTQUFLLGdCQUFMLENBQXNCLE9BQXRCO0FBQ0EsU0FBSyxVQUFMO0FBQ0EsUUFBSSxDQUFDLGFBQUwsRUFBb0I7QUFDbEIsV0FBSyxRQUFMO0FBQ0Q7QUFDRjs7QUFFRCxnQkFBYyxRQUFkLEVBQXdCLEdBQXhCLEVBQTZCO0FBQzNCLFFBQUksVUFBSjtBQUNBLGlCQUFhLElBQUksa0JBQUosQ0FB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QUksQ0FBSixFQUFPLFdBQVAsS0FBdUIsSUFBSSxNQUFKLENBQVcsQ0FBWDtBQUp0QixHQUFQO0FBTUgsQ0FmRDs7QUFpQkE7QUFDQSxLQUFLLFFBQUwsR0FBZ0IsQ0FBQyxJQUFELEVBQU8sU0FBUCxFQUFrQixRQUFsQixLQUErQjtBQUM3QyxNQUFJLE9BQUo7QUFDQSxTQUFPLFNBQVMsU0FBVCxHQUFzQjtBQUMzQixRQUFJLE1BQU0sSUFBVjtBQUFBLFFBQWdCLE9BQU8sU0FBdkI7QUFDQSxhQUFTLE9BQVQsR0FBb0I7QUFDbEIsVUFBSSxDQUFDLFFBQUwsRUFBZSxLQUFLLEtBQUwsQ0FBVyxHQUFYLEVBQWdCLElBQWhCO0FBQ2YsZ0JBQVUsSUFBVjtBQUNEO0FBQ0QsUUFBSSxPQUFKLEVBQWE7QUFDWCxtQkFBYSxPQUFiO0FBQ0QsS0FGRCxNQUdLLElBQUksUUFBSixFQUFjO0FBQ2pCLFdBQUssS0FBTCxDQUFXLEdBQVgsRUFBZ0IsSUFBaEI7QUFDRDtBQUNELGNBQVUsV0FBVyxPQUFYLEVBQW9CLGFBQWEsR0FBakMsQ0FBVjtBQUNELEdBYkQ7QUFjRCxDQWhCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBQYXJhbGxheEJybyA9IHJlcXVpcmUoJy4uL2xpYicpO1xuXG5jb25zdCBsYXhicm8gPSBuZXcgUGFyYWxsYXhCcm8oKTtcblxudmFyIHBhZ2UxLCBwYWdlMjtcblxucGFnZTEgPSBsYXhicm8uYWRkQ29sbGVjdGlvbignI2NvbGxlY3Rpb24xJywge1xuICB0b3A6IDIwMCxcbiAgLy8gaGlkZTogezEwMDA6IHRydWV9LFxuICBjZW50ZXI6IHRydWUsXG59KTtcblxucGFnZTEuYWRkRWxlbWVudHMoe1xuICAnI2ltZzEnOiB7XG4gICAgc3BlZWQ6IHtcbiAgICAgIDA6IDEsXG4gICAgICAzMDA6IC0xLFxuICAgIH0sXG4gICAgdG9wOiB7XG4gICAgICAvLyA1MDA6IDEwMCxcbiAgICB9LFxuICAgIC8vIGhpZGU6IHtcbiAgICAvLyAgIDEwMDogZmFsc2UsXG4gICAgLy8gICA2MDA6IHRydWUsXG4gICAgLy8gfSxcbiAgICAvLyBzcGVlZDoge1xuICAgIC8vICAgMDogMSxcbiAgICAvLyAgIDIwMDogLjUsXG4gICAgLy8gICAzMDA6IDAsXG4gICAgLy8gICA0MDA6IC0xLFxuICAgIC8vIH0sXG4gIH0sXG4gIC8vICcjaW1nMic6IHtcbiAgLy8gICBoaWRlOiB0cnVlLFxuICAvLyAgIHRvcDogODAwLFxuICAvLyAgIHpJbmRleDogMCxcbiAgLy8gICBzcGVlZDogLjEsXG4gIC8vICAgdXBkYXRlOiB7XG4gIC8vICAgICAwOiAoKSA9PiB7XG4gIC8vICAgICAgIHRoaXMuZWwuZmFkZUluKCk7XG4gIC8vICAgICB9LFxuICAvLyAgICAgNDAwOiAoKSA9PiB7XG4gIC8vICAgICAgIHRoaXMuZWwuZmFkZU91dCgpO1xuICAvLyAgICAgfVxuICAvLyAgIH1cbiAgLy8gfVxufSk7XG4iLCJjb25zdCBQYXJhbGxheENvbGxlY3Rpb24gPSByZXF1aXJlKCcuL1BhcmFsbGF4Q29sbGVjdGlvbicpO1xuXG52YXIgJDtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYXJhbGF4QnJvIHtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgY29uc3Qge3dyYXBwZXIsIGRpc2FibGVTdHlsZXN9ID0gdGhpcy5ub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb2xsZWN0aW9ucyA9IFtdO1xuXG4gICAgdGhpcy5qUXVlcnkoKTtcbiAgICB0aGlzLmNhY2hlRE9NRWxlbWVudHMod3JhcHBlcik7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgaWYgKCFkaXNhYmxlU3R5bGVzKSB7XG4gICAgICB0aGlzLnN0eWxlRE9NKCk7XG4gICAgfVxuICB9XG5cbiAgYWRkQ29sbGVjdGlvbihzZWxlY3Rvciwgb2JqKSB7XG4gICAgdmFyIGNvbGxlY3Rpb247XG4gICAgY29sbGVjdGlvbiA9IG5ldyBQYXJhbGxheENvbGxlY3Rpb24oc2VsZWN0b3IsIG9iaik7XG4gICAgdGhpcy5jb2xsZWN0aW9ucy5wdXNoKGNvbGxlY3Rpb24pO1xuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgY2FjaGVET01FbGVtZW50cyh3cmFwcGVyKSB7XG4gICAgdGhpcy4kZWwgPSB7fTtcbiAgICB0aGlzLiRlbC53aW4gPSAkKHdpbmRvdyk7XG4gICAgdGhpcy4kZWwuZG9jID0gJChkb2N1bWVudCk7XG4gICAgdGhpcy4kZWwuYm9keSA9ICQoJ2JvZHknKTtcbiAgICB0aGlzLiRlbC53cmFwcGVyID0gJCh3cmFwcGVyKTtcbiAgfVxuXG4gIHN0eWxlRE9NKCkge1xuICAgIHZhciB7Ym9keSwgd3JhcHBlciwgZG9jfSA9IHRoaXMuJGVsO1xuICAgIGJvZHkuY3NzKCdoZWlnaHQnLCAnMTAwJScpO1xuICAgIHdyYXBwZXIuY3NzKCdtaW4taGVpZ2h0JywgJzEwMCUnKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgY29uc3QgdHJhY2sgPSAoKSA9PiB7XG4gICAgICB2YXIgcG9zWSA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgIHRoaXMubW92ZUVsZW1lbnRzKHBvc1kpO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRyYWNrKTtcbiAgICB9XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRyYWNrKTtcbiAgfVxuXG5cbiAgbW92ZUVsZW1lbnRzKHBvc1kpIHtcbiAgICB2YXIgY29sbGVjdGlvbnM7XG4gICAgY29sbGVjdGlvbnMgPSB0aGlzLmNvbGxlY3Rpb25zO1xuICAgIGNvbGxlY3Rpb25zLmZvckVhY2goY29sbGVjdGlvbiA9PiBjb2xsZWN0aW9uLm1vdmVFbGVtZW50cyhwb3NZKSk7XG4gIH1cblxuICBqUXVlcnkoKSB7XG4gICAgJCA9IGpRdWVyeTtcbiAgICBpZiAoISQpIHtcbiAgICAgIHRocm93ICdqUXVlcnkgaXMgbm90IGRlZmluZWQnO1xuICAgIH1cbiAgfVxuXG4gIG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucykge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICB3cmFwcGVyOiAnI3BhcmFsbGF4JyxcbiAgICAgIGRpc2FibGVTdHlsZXM6IGZhbHNlLFxuICAgIH0sIG9wdGlvbnMpO1xuICB9XG5cbn1cbiIsImNvbnN0IHtub3JtYWxpemVPcHRpb25zLCBydW5VcGRhdGV9ID0gcmVxdWlyZSgnLi91dGlscycpO1xuY29uc3QgUGFyYWxsYXhFbGVtZW50ID0gcmVxdWlyZSgnLi9QYXJhbGxheEVsZW1lbnQnKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxsYXhDb2xsZWN0aW9uIHtcblxuICBjb25zdHJ1Y3RvcihzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMsIHtcbiAgICAgIHRvcDoge3ZhbHVlOiAwfSxcbiAgICAgIGhpZGU6IHt2YWx1ZTogZmFsc2V9LFxuICAgICAgekluZGV4OiB7dmFsdWU6IC0xfSxcbiAgICAgIGNlbnRlcjoge3ZhbHVlOiBmYWxzZX0sXG4gICAgfSk7XG4gICAgY29uc3Qge3RvcCwgaGlkZSwgekluZGV4LCBjZW50ZXJ9ID0gb3B0aW9ucztcblxuICAgIHRoaXMuJGVsO1xuICAgIHRoaXMuZWxlbWVudHMgPSBbXTtcbiAgICB0aGlzLnByZXZQb3NZO1xuXG4gICAgdGhpcy50b3AgPSB0b3A7XG4gICAgdGhpcy5oaWRlID0gaGlkZTtcbiAgICB0aGlzLnpJbmRleCA9IHpJbmRleDtcbiAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5zdHlsZUNvbGxlY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpO1xuICB9XG5cbiAgLy8gaGlkZSh2YWx1ZSkge1xuICAvLyAgIHRoaXMuaGlkZS52YWx1ZSA9IHZhbHVlO1xuICAvLyAgIHRoaXMuJGVsLmNzcygnZGlzcGxheScsIHZhbHVlID8gJ25vbmUnIDogJ2Jsb2NrJyk7XG4gIC8vIH1cblxuICAvLyB6SW5kZXgodmFsdWUpIHtcbiAgLy8gICB0aGlzLnpJbmRleC52YWx1ZSA9IHZhbHVlO1xuICAvLyAgIHRoaXMuJGVsLmNzcygnekluZGV4JywgdmFsdWUpO1xuICAvLyB9XG4gIC8vXG4gIC8vIHRvcCh2YWx1ZSkge1xuICAvLyAgIHZhciB0b3A7XG4gIC8vICAgdGhpcy50b3AudmFsdWUgPSB2YWx1ZTtcbiAgLy8gICB0aGlzLiRlbC5jaGlsZHJlbigpLmNzcygndG9wJywgdmFsdWUgKyAncHgnKTtcbiAgLy8gfVxuICAvL1xuICAvLyBjZW50ZXIodmFsdWUpIHtcbiAgLy8gICB0aGlzLmNlbnRlci52YWx1ZSA9IHZhbHVlO1xuICAvLyAgIHRoaXMuJGVsLmNoaWxkcmVuKCkuY3NzKHtcbiAgLy8gICAgICdtYXJnaW4tcmlnaHQnOiAnYXV0bycsXG4gIC8vICAgICAnbWFyZ2luLWxlZnQnOiAnYXV0bycsXG4gIC8vICAgfSk7XG4gIC8vIH1cblxuICBhZGRFbGVtZW50cyhvYmopIHtcbiAgICB2YXIgc2VsZWN0b3JzLCB0b3AsIGNlbnRlcjtcbiAgICBzZWxlY3RvcnMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgIHNlbGVjdG9ycy5mb3JFYWNoKHNlbGVjdG9yID0+IHtcbiAgICAgIHZhciBvcHRpb25zID0gb2JqW3NlbGVjdG9yXTtcbiAgICAgIHRoaXMuYWRkRWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgdmFyIGVsZW1lbnQ7XG4gICAgZWxlbWVudCA9IG5ldyBQYXJhbGxheEVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMsIHRoaXMudG9wKTtcbiAgICB0aGlzLmVsZW1lbnRzLnB1c2goZWxlbWVudCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBtb3ZlRWxlbWVudHMocG9zWSkge1xuICAgIHZhciBlbGVtZW50cztcbiAgICBlbGVtZW50cyA9IHRoaXMuZWxlbWVudHM7XG4gICAgdGhpcy5ydW5DYWxsYmFja3MocG9zWSk7XG4gICAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IGVsZW1lbnQubW92ZUVsZW1lbnQocG9zWSkpO1xuICAgIHRoaXMucHJldlBvc1kgPSBwb3NZO1xuICB9XG5cbiAgcnVuQ2FsbGJhY2tzKHBvc1kpIHtcbiAgICB0aGlzLnVwZGF0ZUhpZGUocG9zWSk7XG4gICAgLy8gdGhpcy51cGRhdGVaaW5kZXgocG9zWSk7XG4gICAgLy8gdGhpcy51cGRhdGVDZW50ZXIocG9zWSk7XG4gIH1cblxuICB1cGRhdGVIaWRlKHBvc1kpIHtcbiAgICB2YXIgcHJldlkgPSB0aGlzLnByZXZQb3NZO1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgdGhpcy5oaWRlLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuJGVsLmNzcygnb3BhY2l0eScsIHZhbHVlID8gMCA6IDEpO1xuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlWmluZGV4KHBvc1kpIHtcbiAgICB2YXIgcHJldlkgPSB0aGlzLnByZXZQb3NZO1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgdGhpcy56SW5kZXgsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy4kZWwuY3NzKCd6SW5kZXgnLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVDZW50ZXIocG9zWSkge1xuICAgIHZhciBwcmV2WSA9IHRoaXMucHJldlBvc1k7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHByZXZZLCB0aGlzLmNlbnRlciwgKHZhbHVlKSA9PiB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy4kZWwuY3NzKHtcbiAgICAgICAgICAnbWFyZ2luLXJpZ2h0JzogJ2F1dG8nLFxuICAgICAgICAgICdtYXJnaW4tbGVmdCc6ICdhdXRvJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy4kZWwuY3NzKHtcbiAgICAgICAgICAnbWFyZ2luLXJpZ2h0JzogJ2luaGVyaXQnLFxuICAgICAgICAgICdtYXJnaW4tbGVmdCc6ICdpbmhlcml0JyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBqUXVlcnkoKSB7XG4gICAgJCA9IGpRdWVyeTtcbiAgICBpZiAoISQpIHtcbiAgICAgIHRocm93ICdqUXVlcnkgaXMgbm90IGRlZmluZWQnO1xuICAgIH1cbiAgfVxuXG4gIHN0eWxlQ29sbGVjdGlvbihzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIHZhciAkZWwsIGNzcztcbiAgICB2YXIge2NlbnRlciwgekluZGV4LCBoaWRlfSA9IG9wdGlvbnM7XG4gICAgY3NzID0ge307XG4gICAgY3NzLnpJbmRleCA9IHpJbmRleC52YWx1ZTtcbiAgICBpZiAoY2VudGVyLnZhbHVlKSB7XG4gICAgICBjc3NbJ21hcmdpbi1yaWdodCddID0gJ2F1dG8nO1xuICAgICAgY3NzWydtYXJnaW4tbGVmdCddID0gJ2F1dG8nO1xuICAgIH1cbiAgICBpZiAoaGlkZS52YWx1ZSkge1xuICAgICAgY3NzLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuICAgICRlbCA9ICQoc2VsZWN0b3IpO1xuICAgICRlbC5jc3MoY3NzKTtcbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG59XG4iLCJjb25zdCB7cHJlZml4LCBub3JtYWxpemVPcHRpb25zLCBydW5VcGRhdGV9ID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG52YXIgJDtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYXJhbGxheEVsZW1lbnQge1xuXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBvcHRpb25zLCBvZmZzZXRUb3ApIHtcbiAgICBvcHRpb25zID0gbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zLCB7XG4gICAgICB0b3A6IHt2YWx1ZTogMH0sXG4gICAgICBoaWRlOiB7dmFsdWU6IGZhbHNlfSxcbiAgICAgIHpJbmRleDoge3ZhbHVlOiAtMX0sXG4gICAgICBzcGVlZDoge3ZhbHVlOiAxfSxcbiAgICAgIGNlbnRlcjoge3ZhbHVlOiBmYWxzZX0sXG4gICAgfSk7XG4gICAgY29uc3Qge3RvcCwgaGlkZSwgekluZGV4LCBzcGVlZCwgY2VudGVyfSA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLiRlbDtcbiAgICB0aGlzLnByZWZpeCA9IHByZWZpeCgpO1xuICAgIHRoaXMub2Zmc2V0VG9wID0gb2Zmc2V0VG9wO1xuICAgIHRoaXMueU9mZnNldCA9IG9mZnNldFRvcC52YWx1ZTtcbiAgICB0aGlzLnlQcmV2O1xuICAgIHRoaXMudFByZXY7XG5cbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLmhpZGUgPSBoaWRlO1xuICAgIHRoaXMuekluZGV4ID0gekluZGV4O1xuICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcbiAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcblxuICAgIC8vIHRoaXMuZGVsdGEgID0gMDtcbiAgICAvLyB0aGlzLnVwZGF0ZSA9IHt9O1xuXG4gICAgdGhpcy5qUXVlcnkoKTtcbiAgICB0aGlzLnN0eWxlRWxlbWVudChzZWxlY3Rvciwge2NlbnRlciwgdG9wfSk7XG4gIH1cblxuICAvLyBoaWRlKHZhbHVlKSB7XG4gIC8vICAgdGhpcy5oaWRlLnZhbHVlID0gdmFsdWU7XG4gIC8vICAgdGhpcy4kZWwuY3NzKCdkaXNwbGF5JywgdmFsdWUgPyAnbm9uZScgOiAnYmxvY2snKTtcbiAgLy8gfVxuICAvL1xuICAvLyB6SW5kZXgodmFsdWUpIHtcbiAgLy8gICB0aGlzLnpJbmRleC52YWx1ZSA9IHZhbHVlO1xuICAvLyAgIHRoaXMuJGVsLmNzcygnekluZGV4JywgdmFsdWUpO1xuICAvLyB9XG4gIC8vXG4gIC8vIHRvcCh2YWx1ZSkge1xuICAvLyAgIHRoaXMudG9wLnZhbHVlID0gdmFsdWU7XG4gIC8vICAgdGhpcy4kZWwuY3NzKCd0b3AnLCB2YWx1ZSsncHgnKTtcbiAgLy8gfVxuICAvL1xuICAvLyBjZW50ZXIodmFsdWUpIHtcbiAgLy8gICB0aGlzLmNlbnRlci52YWx1ZSA9IHZhbHVlO1xuICAvLyAgIHRoaXMuJGVsLmNzcyh7XG4gIC8vICAgICAnbWFyZ2luLXJpZ2h0JzogJ2F1dG8nLFxuICAvLyAgICAgJ21hcmdpbi1sZWZ0JzogJ2F1dG8nLFxuICAvLyAgIH0pO1xuICAvLyB9XG5cbiAgbW92ZUVsZW1lbnQocG9zWSkge1xuICAgIHZhciAkZWwsIHlQcmV2LCB0UHJldiwgeU5ldywgc3BlZWQsIGJyZWFrcG9pbnQsIHByZXZCcmVha3BvaW50LCBkZWx0YSwgcHJlZml4O1xuXG4gICAgdGhpcy5ydW5DYWxsYmFja3MocG9zWSk7XG5cbiAgICB5UHJldiA9IHRoaXMueVByZXYgfHwgMDtcbiAgICB0UHJldiA9IHRoaXMudFByZXYgfHwgMDtcbiAgICBwcmVmaXggPSB0aGlzLnByZWZpeDtcbiAgICAkZWwgPSB0aGlzLiRlbDtcbiAgICBzcGVlZCA9IHRoaXMuc3BlZWQudmFsdWU7XG4gICAgYnJlYWtwb2ludCA9IHRoaXMuc3BlZWQuX2JyZWFrcG9pbnQ7XG5cbiAgICBpZiAoYnJlYWtwb2ludCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBsZXQgbGFzdFNwZWVkLCB5RGlmZjtcbiAgICAgIGRlbHRhID0gMDtcbiAgICAgIGxhc3RTcGVlZCA9IHRoaXMuc3BlZWQuX2xhc3RTcGVlZDtcblxuICAgICAgeURpZmYgPSB5UHJldiAtIGJyZWFrcG9pbnQ7XG4gICAgICBkZWx0YSArPSBNYXRoLnJvdW5kKHlEaWZmKmxhc3RTcGVlZCoxMDApIC8gMTAwO1xuXG4gICAgICB5RGlmZiA9IGJyZWFrcG9pbnQgLSBwb3NZO1xuICAgICAgZGVsdGEgKz0gTWF0aC5yb3VuZCh5RGlmZipzcGVlZCoxMDApIC8gMTAwO1xuICAgICAgY29uc29sZS5sb2cocG9zWSwgeVByZXYsIGRlbHRhKTtcbiAgICAgIHRoaXMuc3BlZWQuX2JyZWFrcG9pbnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGV0IHlEaWZmO1xuICAgICAgZGVsdGEgPSAwO1xuICAgICAgeURpZmYgPSB5UHJldiAtIHBvc1k7XG4gICAgICBkZWx0YSA9IE1hdGgucm91bmQoeURpZmYqc3BlZWQqMTAwKSAvIDEwMDtcbiAgICB9XG5cbiAgICB5TmV3ID0gdFByZXYgKyBkZWx0YTtcblxuICAgICRlbFswXS5zdHlsZVtwcmVmaXguZG9tICsgJ1RyYW5zZm9ybSddID0gYHRyYW5zbGF0ZTNkKDBweCwgJHt5TmV3fXB4LCAwKSB0cmFuc2xhdGVaKDApIHNjYWxlKDEpYDtcbiAgICB0aGlzLnlQcmV2ID0gcG9zWTtcbiAgICB0aGlzLnRQcmV2ID0geU5ldztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJ1bkNhbGxiYWNrcyhwb3NZKSB7XG4gICAgdGhpcy51cGRhdGVIaWRlKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlVG9wKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlT2Zmc2V0KHBvc1kpO1xuICAgIHRoaXMudXBkYXRlU3BlZWQocG9zWSk7XG4gIH1cblxuICB1cGRhdGVPZmZzZXQocG9zWSkge1xuICAgIHZhciBwcmV2WSA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHByZXZZLCB0aGlzLm9mZnNldFRvcCwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLm9mZnNldFkgPSB2YWx1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZVNwZWVkKHBvc1kpIHtcbiAgICB2YXIgcHJldlkgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgdGhpcy5zcGVlZCwgKHZhbHVlLCBicmVha3BvaW50LCBzY3JvbGxpbmdEb3duLCBhY3R1YWxCcmVha3BvaW50KSA9PiB7XG4gICAgICB0aGlzLnNwZWVkLl9icmVha3BvaW50ID0gYWN0dWFsQnJlYWtwb2ludDtcbiAgICAgIHRoaXMuc3BlZWQuX2xhc3RTcGVlZCA9IHRoaXMuc3BlZWQudmFsdWU7XG4gICAgICB0aGlzLnNwZWVkLnZhbHVlID0gdmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVIaWRlKHBvc1kpIHtcbiAgICB2YXIgcHJldlkgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgdGhpcy5oaWRlLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuJGVsLmNzcygnZGlzcGxheScsIHZhbHVlID8gJ25vbmUnIDogJ2Jsb2NrJyk7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVUb3AocG9zWSkge1xuICAgIHZhciBwcmV2WSA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHByZXZZLCB0aGlzLnRvcCwgKHZhbHVlKSA9PiB7XG4gICAgICB2YXIgeU9mZnNldCA9IHRoaXMueU9mZnNldDtcbiAgICAgIHRoaXMuJGVsLmNzcygndG9wJywgdmFsdWUreU9mZnNldCsncHgnKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgc3R5bGVFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgdmFyICRlbCwgY3NzLCB5T2Zmc2V0O1xuICAgIHZhciB7Y2VudGVyLCB0b3B9ID0gb3B0aW9ucztcbiAgICB5T2Zmc2V0ID0gdGhpcy55T2Zmc2V0O1xuICAgIGNzcyA9IHtcbiAgICAgICdwb3NpdGlvbic6ICdmaXhlZCcsXG4gICAgICAnbGVmdCc6IDAsXG4gICAgICAncmlnaHQnOiAwLFxuICAgIH07XG4gICAgaWYgKGNlbnRlcikge1xuICAgICAgY3NzWydtYXJnaW4tcmlnaHQnXSA9ICdhdXRvJztcbiAgICAgIGNzc1snbWFyZ2luLWxlZnQnXSA9ICdhdXRvJztcbiAgICB9XG4gICAgaWYgKHRvcCkge1xuICAgICAgY3NzLnRvcCA9IHRvcCt5T2Zmc2V0KydweCc7XG4gICAgfVxuICAgICRlbCA9ICQoc2VsZWN0b3IpO1xuICAgICRlbC5jc3MoY3NzKTtcbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGpRdWVyeSgpIHtcbiAgICAkID0galF1ZXJ5O1xuICAgIGlmICghJCkge1xuICAgICAgdGhyb3cgJ2pRdWVyeSBpcyBub3QgZGVmaW5lZCc7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9QYXJhbGxheEJybycpO1xuIiwiY29uc3Qgc2VsZiA9IG1vZHVsZS5leHBvcnRzO1xuXG5zZWxmLmNhbGxCcmVha3BvaW50cyA9IChwb3NZLCBwcmV2UG9zWSwgYnJlYWtwb2ludHMsIGNhbGxiYWNrKSA9PiB7XG4gIHZhciBzY3JvbGxpbmdEb3duLCB5RGlmZjtcbiAgc2Nyb2xsaW5nRG93biA9IHByZXZQb3NZIDwgcG9zWTtcbiAgeURpZmYgPSBzY3JvbGxpbmdEb3duID8gcG9zWSAtIHByZXZQb3NZIDogcHJldlBvc1kgLSBwb3NZO1xuICBicmVha3BvaW50cyA9IGJyZWFrcG9pbnRzLm1hcChicmVha3BvaW50ID0+IHBhcnNlSW50KGJyZWFrcG9pbnQsIDEwKSk7XG4gIGZvciAobGV0IGk9MDsgaTx5RGlmZjsgaSsrKSB7XG4gICAgbGV0IHBvcywgaW5kZXg7XG4gICAgcG9zID0gc2Nyb2xsaW5nRG93biA/IHByZXZQb3NZICsgaSA6IHByZXZQb3NZIC0gaTtcbiAgICBpbmRleCA9IGJyZWFrcG9pbnRzLmluZGV4T2YocG9zKTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgbGV0IGkgPSBzY3JvbGxpbmdEb3duID8gaW5kZXggOiBpbmRleCAtIDE7XG4gICAgICBjYWxsYmFjay5jYWxsKG51bGwsIGJyZWFrcG9pbnRzW2ldLCBzY3JvbGxpbmdEb3duLCBicmVha3BvaW50c1tpbmRleF0pO1xuICAgIH1cbiAgfVxufVxuXG5zZWxmLnJ1blVwZGF0ZSA9IChwb3NZLCBwcmV2UG9zWSwgb2JqLCBjYWxsYmFjaykgPT4ge1xuICB2YXIgYnJlYWtwb2ludHMgPSBPYmplY3Qua2V5cyhvYmouYnJlYWtwb2ludHMpO1xuXG4gIGlmIChwcmV2UG9zWSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIHZhbHVlID0gb2JqLmJyZWFrcG9pbnRzW3Bvc1ldO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKG51bGwsIHZhbHVlLCBwb3NZLCB0cnVlKTtcbiAgICB9XG4gIH1cbiAgc2VsZi5jYWxsQnJlYWtwb2ludHMocG9zWSwgcHJldlBvc1ksIGJyZWFrcG9pbnRzLCAoYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93biwgYWN0dWFsQnJlYWtwb2ludCkgPT4ge1xuICAgIHZhciB2YWx1ZSA9IG9iai5icmVha3BvaW50c1ticmVha3BvaW50XTtcbiAgICBjYWxsYmFjay5jYWxsKG51bGwsIHZhbHVlLCBicmVha3BvaW50LCBzY3JvbGxpbmdEb3duLCBhY3R1YWxCcmVha3BvaW50KTtcbiAgfSk7XG59XG5cbnNlbGYubm9ybWFsaXplT3B0aW9ucyA9IChvcHRpb25zLCBkZWZhdWx0cykgPT4ge1xuICB2YXIga2V5cztcblxuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICBrZXlzID0gT2JqZWN0LmtleXMob3B0aW9ucyk7XG5cbiAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgdmFyIHZhbHVlLCBpc09iamVjdDtcbiAgICB2YWx1ZSA9IG9wdGlvbnNba2V5XTtcbiAgICBpc09iamVjdCA9IHNlbGYuaXNUeXBlKHZhbHVlLCAnb2JqZWN0Jyk7XG4gICAgaWYgKGlzT2JqZWN0KSB7XG4gICAgICBsZXQgdmFsdWUxID0gdmFsdWUgJiYgdmFsdWVbJzAnXSA/IHZhbHVlWycwJ10gOiBkZWZhdWx0c1trZXldLnZhbHVlO1xuICAgICAgb3B0aW9uc1trZXldID0ge1xuICAgICAgICB2YWx1ZTogdmFsdWUxLFxuICAgICAgICBicmVha3BvaW50czogT2JqZWN0LmFzc2lnbih7fSwgezA6IHZhbHVlMX0sIHZhbHVlKSxcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBvcHRpb25zW2tleV0gPSB7XG4gICAgICAgIHZhbHVlLFxuICAgICAgICBicmVha3BvaW50czogezA6IHZhbHVlfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvcHRpb25zO1xufVxuXG4vKipcbiAqIEdpdmVuIGEgTWl4ZWQgdmFsdWUgdHlwZSBjaGVjay5cbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlLlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWMuXG4gKiBAdGVzdHMgdW5pdC5cbiAqL1xuc2VsZi5pc1R5cGUgPSAodmFsdWUsIHR5cGUpID0+IHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBOdW1iZXIuaXNOYU4odmFsdWUpID09PSBmYWxzZTtcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSB8fCB2YWx1ZSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnYXJyYXknOlxuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnbnVsbCc6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGw7XG4gICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJztcbiAgICBjYXNlICdOYU4nOlxuICAgICAgcmV0dXJuIE51bWJlci5pc05hTih2YWx1ZSk7XG4gICAgY2FzZSAnZGF0ZSc6XG4gICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucmVjZ29uaXplZCB0eXBlOiBcIiR7dHlwZX1cImApO1xuICB9XG59O1xuXG5zZWxmLnByZWZpeCA9ICgpID0+IHtcbiAgdmFyIHN0eWxlcztcbiAgc3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCAnJyksXG4gICAgcHJlID0gKEFycmF5LnByb3RvdHlwZS5zbGljZVxuICAgICAgLmNhbGwoc3R5bGVzKVxuICAgICAgLmpvaW4oJycpXG4gICAgICAubWF0Y2goLy0obW96fHdlYmtpdHxtcyktLykgfHwgKHN0eWxlcy5PTGluayA9PT0gJycgJiYgWycnLCAnbyddKVxuICAgIClbMV0sXG4gICAgZG9tID0gKCd3ZWJraXR8TW96fE1TfE8nKS5tYXRjaChuZXcgUmVnRXhwKCcoJyArIHByZSArICcpJywgJ2knKSlbMV07XG4gICAgcmV0dXJuIHtcbiAgICAgIGRvbTogZG9tLFxuICAgICAgbG93ZXJjYXNlOiBwcmUsXG4gICAgICBjc3M6ICctJyArIHByZSArICctJyxcbiAgICAgIGpzOiBwcmVbMF0udG9VcHBlckNhc2UoKSArIHByZS5zdWJzdHIoMSlcbiAgICB9O1xufTtcblxuLy8gaHR0cDovL3Vuc2NyaXB0YWJsZS5jb20vMjAwOS8wMy8yMC9kZWJvdW5jaW5nLWphdmFzY3JpcHQtbWV0aG9kcy9cbnNlbGYuZGVib3VuY2UgPSAoZnVuYywgdGhyZXNob2xkLCBleGVjQXNhcCkgPT4ge1xuICB2YXIgdGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uIGRlYm91bmNlZCAoKSB7XG4gICAgdmFyIG9iaiA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgZnVuY3Rpb24gZGVsYXllZCAoKSB7XG4gICAgICBpZiAoIWV4ZWNBc2FwKSBmdW5jLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZXhlY0FzYXApIHtcbiAgICAgIGZ1bmMuYXBwbHkob2JqLCBhcmdzKTtcbiAgICB9XG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQoZGVsYXllZCwgdGhyZXNob2xkIHx8IDEwMCk7XG4gIH07XG59O1xuIl19
