(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./ParallaxCollection":2}],2:[function(require,module,exports){
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

},{"./ParallaxElement":3,"./utils":5}],3:[function(require,module,exports){
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
    var $el, yPrev, tPrev, yNew, speed, delta, prefix;

    this.runCallbacks(posY);

    yPrev = this.yPrev || 0;
    tPrev = this.tPrev || 0;
    prefix = this.prefix;
    $el = this.$el;
    speed = this.speed.value;

    delta = yPrev - posY;
    delta = Math.round(delta * speed * 100) / 100;
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
    runUpdate(posY, prevY, this.speed, value => {
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

},{"./utils":5}],4:[function(require,module,exports){
module.exports = require('./ParallaxBro');

},{"./ParallaxBro":1}],5:[function(require,module,exports){
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
      callback.call(null, breakpoints[i], scrollingDown);
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
  self.callBreakpoints(posY, prevPosY, breakpoints, (breakpoint, scrollingDown) => {
    var value = obj.breakpoints[breakpoint];
    callback.call(null, value, breakpoint, scrollingDown);
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

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvUGFyYWxsYXhCcm8uanMiLCJsaWIvUGFyYWxsYXhDb2xsZWN0aW9uLmpzIiwibGliL1BhcmFsbGF4RWxlbWVudC5qcyIsImxpYi9pbmRleC5qcyIsImxpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLE1BQU0scUJBQXFCLFFBQVEsc0JBQVIsQ0FBM0I7O0FBRUEsSUFBSSxDQUFKOztBQUVBLE9BQU8sT0FBUCxHQUFpQixNQUFNLFVBQU4sQ0FBaUI7O0FBRWhDLGNBQVksT0FBWixFQUFxQjtBQUNuQixVQUFNLEVBQUMsT0FBRCxFQUFVLGFBQVYsS0FBMkIsS0FBSyxnQkFBTCxDQUFzQixPQUF0QixDQUFqQzs7QUFFQSxTQUFLLFdBQUwsR0FBbUIsRUFBbkI7O0FBRUEsU0FBSyxNQUFMO0FBQ0EsU0FBSyxnQkFBTCxDQUFzQixPQUF0QjtBQUNBLFNBQUssVUFBTDtBQUNBLFFBQUksQ0FBQyxhQUFMLEVBQW9CO0FBQ2xCLFdBQUssUUFBTDtBQUNEO0FBQ0Y7O0FBRUQsZ0JBQWMsUUFBZCxFQUF3QixHQUF4QixFQUE2QjtBQUMzQixRQUFJLFVBQUo7QUFDQSxpQkFBYSxJQUFJLGtCQUFKLENBQXVCLFFBQXZCLEVBQWlDLEdBQWpDLENBQWI7QUFDQSxTQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsVUFBdEI7QUFDQSxXQUFPLFVBQVA7QUFDRDs7QUFFRCxtQkFBaUIsT0FBakIsRUFBMEI7QUFDeEIsU0FBSyxHQUFMLEdBQVcsRUFBWDtBQUNBLFNBQUssR0FBTCxDQUFTLEdBQVQsR0FBZSxFQUFFLE1BQUYsQ0FBZjtBQUNBLFNBQUssR0FBTCxDQUFTLEdBQVQsR0FBZSxFQUFFLFFBQUYsQ0FBZjtBQUNBLFNBQUssR0FBTCxDQUFTLElBQVQsR0FBZ0IsRUFBRSxNQUFGLENBQWhCO0FBQ0EsU0FBSyxHQUFMLENBQVMsT0FBVCxHQUFtQixFQUFFLE9BQUYsQ0FBbkI7QUFDRDs7QUFFRCxhQUFXO0FBQ1QsUUFBSSxFQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLEdBQWhCLEtBQXVCLEtBQUssR0FBaEM7QUFDQSxTQUFLLEdBQUwsQ0FBUyxRQUFULEVBQW1CLE1BQW5CO0FBQ0EsWUFBUSxHQUFSLENBQVksWUFBWixFQUEwQixNQUExQjtBQUNEOztBQUVELGVBQWE7QUFDWCxVQUFNLFFBQVEsTUFBTTtBQUNsQixVQUFJLE9BQU8sT0FBTyxXQUFsQjtBQUNBLFdBQUssWUFBTCxDQUFrQixJQUFsQjtBQUNBLDRCQUFzQixLQUF0QjtBQUNELEtBSkQ7QUFLQSwwQkFBc0IsS0FBdEI7QUFDRDs7QUFHRCxlQUFhLElBQWIsRUFBbUI7QUFDakIsUUFBSSxXQUFKO0FBQ0Esa0JBQWMsS0FBSyxXQUFuQjtBQUNBLGdCQUFZLE9BQVosQ0FBb0IsY0FBYyxXQUFXLFlBQVgsQ0FBd0IsSUFBeEIsQ0FBbEM7QUFDRDs7QUFFRCxXQUFTO0FBQ1AsUUFBSSxNQUFKO0FBQ0EsUUFBSSxDQUFDLENBQUwsRUFBUTtBQUNOLFlBQU0sdUJBQU47QUFDRDtBQUNGOztBQUVELG1CQUFpQixPQUFqQixFQUEwQjtBQUN4QixXQUFPLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0I7QUFDdkIsZUFBUyxXQURjO0FBRXZCLHFCQUFlO0FBRlEsS0FBbEIsRUFHSixPQUhJLENBQVA7QUFJRDs7QUFoRStCLENBQWxDOzs7QUNKQSxNQUFNLEVBQUMsZ0JBQUQsRUFBbUIsU0FBbkIsS0FBZ0MsUUFBUSxTQUFSLENBQXRDO0FBQ0EsTUFBTSxrQkFBa0IsUUFBUSxtQkFBUixDQUF4Qjs7QUFFQSxJQUFJLENBQUo7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLE1BQU0sa0JBQU4sQ0FBeUI7O0FBRXhDLGNBQVksUUFBWixFQUFzQixPQUF0QixFQUErQjtBQUM3QixjQUFVLGlCQUFpQixPQUFqQixFQUEwQjtBQUNsQyxXQUFLLEVBQUMsT0FBTyxDQUFSLEVBRDZCO0FBRWxDLFlBQU0sRUFBQyxPQUFPLEtBQVIsRUFGNEI7QUFHbEMsY0FBUSxFQUFDLE9BQU8sQ0FBQyxDQUFULEVBSDBCO0FBSWxDLGNBQVEsRUFBQyxPQUFPLEtBQVI7QUFKMEIsS0FBMUIsQ0FBVjtBQU1BLFVBQU0sRUFBQyxHQUFELEVBQU0sSUFBTixFQUFZLE1BQVosRUFBb0IsTUFBcEIsS0FBOEIsT0FBcEM7O0FBRUEsU0FBSyxHQUFMO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsU0FBSyxRQUFMOztBQUVBLFNBQUssR0FBTCxHQUFXLEdBQVg7QUFDQSxTQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsU0FBSyxNQUFMLEdBQWMsTUFBZDtBQUNBLFNBQUssTUFBTCxHQUFjLE1BQWQ7O0FBRUEsU0FBSyxNQUFMO0FBQ0EsU0FBSyxlQUFMLENBQXFCLFFBQXJCLEVBQStCLE9BQS9CO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGNBQVksR0FBWixFQUFpQjtBQUNmLFFBQUksU0FBSixFQUFlLEdBQWYsRUFBb0IsTUFBcEI7QUFDQSxnQkFBWSxPQUFPLElBQVAsQ0FBWSxHQUFaLENBQVo7QUFDQSxjQUFVLE9BQVYsQ0FBa0IsWUFBWTtBQUM1QixVQUFJLFVBQVUsSUFBSSxRQUFKLENBQWQ7QUFDQSxXQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsRUFBMEIsT0FBMUI7QUFDRCxLQUhEO0FBSUEsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsYUFBVyxRQUFYLEVBQXFCLE9BQXJCLEVBQThCO0FBQzVCLFFBQUksT0FBSjtBQUNBLGNBQVUsSUFBSSxlQUFKLENBQW9CLFFBQXBCLEVBQThCLE9BQTlCLEVBQXVDLEtBQUssR0FBNUMsQ0FBVjtBQUNBLFNBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsT0FBbkI7QUFDQSxXQUFPLElBQVA7QUFDRDs7QUFFRCxlQUFhLElBQWIsRUFBbUI7QUFDakIsUUFBSSxRQUFKO0FBQ0EsZUFBVyxLQUFLLFFBQWhCO0FBQ0EsU0FBSyxZQUFMLENBQWtCLElBQWxCO0FBQ0EsYUFBUyxPQUFULENBQWlCLFdBQVcsUUFBUSxXQUFSLENBQW9CLElBQXBCLENBQTVCO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLElBQWhCO0FBQ0Q7O0FBRUQsZUFBYSxJQUFiLEVBQW1CO0FBQ2pCLFNBQUssVUFBTCxDQUFnQixJQUFoQjtBQUNBO0FBQ0E7QUFDRDs7QUFFRCxhQUFXLElBQVgsRUFBaUI7QUFDZixRQUFJLFFBQVEsS0FBSyxRQUFqQjtBQUNBLGNBQVUsSUFBVixFQUFnQixLQUFoQixFQUF1QixLQUFLLElBQTVCLEVBQW1DLEtBQUQsSUFBVztBQUMzQyxXQUFLLEdBQUwsQ0FBUyxHQUFULENBQWEsU0FBYixFQUF3QixRQUFRLENBQVIsR0FBWSxDQUFwQztBQUNELEtBRkQ7QUFHRDs7QUFFRCxlQUFhLElBQWIsRUFBbUI7QUFDakIsUUFBSSxRQUFRLEtBQUssUUFBakI7QUFDQSxjQUFVLElBQVYsRUFBZ0IsS0FBaEIsRUFBdUIsS0FBSyxNQUE1QixFQUFxQyxLQUFELElBQVc7QUFDN0MsV0FBSyxHQUFMLENBQVMsR0FBVCxDQUFhLFFBQWIsRUFBdUIsS0FBdkI7QUFDRCxLQUZEO0FBR0Q7O0FBRUQsZUFBYSxJQUFiLEVBQW1CO0FBQ2pCLFFBQUksUUFBUSxLQUFLLFFBQWpCO0FBQ0EsY0FBVSxJQUFWLEVBQWdCLEtBQWhCLEVBQXVCLEtBQUssTUFBNUIsRUFBcUMsS0FBRCxJQUFXO0FBQzdDLFVBQUksS0FBSixFQUFXO0FBQ1QsYUFBSyxHQUFMLENBQVMsR0FBVCxDQUFhO0FBQ1gsMEJBQWdCLE1BREw7QUFFWCx5QkFBZTtBQUZKLFNBQWI7QUFJRCxPQUxELE1BTUs7QUFDSCxhQUFLLEdBQUwsQ0FBUyxHQUFULENBQWE7QUFDWCwwQkFBZ0IsU0FETDtBQUVYLHlCQUFlO0FBRkosU0FBYjtBQUlEO0FBQ0YsS0FiRDtBQWNEOztBQUVELFdBQVM7QUFDUCxRQUFJLE1BQUo7QUFDQSxRQUFJLENBQUMsQ0FBTCxFQUFRO0FBQ04sWUFBTSx1QkFBTjtBQUNEO0FBQ0Y7O0FBRUQsa0JBQWdCLFFBQWhCLEVBQTBCLE9BQTFCLEVBQW1DO0FBQ2pDLFFBQUksR0FBSixFQUFTLEdBQVQ7QUFDQSxRQUFJLEVBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsSUFBakIsS0FBeUIsT0FBN0I7QUFDQSxVQUFNLEVBQU47QUFDQSxRQUFJLE1BQUosR0FBYSxPQUFPLEtBQXBCO0FBQ0EsUUFBSSxPQUFPLEtBQVgsRUFBa0I7QUFDaEIsVUFBSSxjQUFKLElBQXNCLE1BQXRCO0FBQ0EsVUFBSSxhQUFKLElBQXFCLE1BQXJCO0FBQ0Q7QUFDRCxRQUFJLEtBQUssS0FBVCxFQUFnQjtBQUNkLFVBQUksT0FBSixHQUFjLE1BQWQ7QUFDRDtBQUNELFVBQU0sRUFBRSxRQUFGLENBQU47QUFDQSxRQUFJLEdBQUosQ0FBUSxHQUFSO0FBQ0EsU0FBSyxHQUFMLEdBQVcsR0FBWDtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQXRJdUMsQ0FBMUM7OztBQ0xBLE1BQU0sRUFBQyxNQUFELEVBQVMsZ0JBQVQsRUFBMkIsU0FBM0IsS0FBd0MsUUFBUSxTQUFSLENBQTlDOztBQUVBLElBQUksQ0FBSjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsTUFBTSxlQUFOLENBQXNCOztBQUVyQyxjQUFZLFFBQVosRUFBc0IsT0FBdEIsRUFBK0IsU0FBL0IsRUFBMEM7QUFDeEMsY0FBVSxpQkFBaUIsT0FBakIsRUFBMEI7QUFDbEMsV0FBSyxFQUFDLE9BQU8sQ0FBUixFQUQ2QjtBQUVsQyxZQUFNLEVBQUMsT0FBTyxLQUFSLEVBRjRCO0FBR2xDLGNBQVEsRUFBQyxPQUFPLENBQUMsQ0FBVCxFQUgwQjtBQUlsQyxhQUFPLEVBQUMsT0FBTyxDQUFSLEVBSjJCO0FBS2xDLGNBQVEsRUFBQyxPQUFPLEtBQVI7QUFMMEIsS0FBMUIsQ0FBVjtBQU9BLFVBQU0sRUFBQyxHQUFELEVBQU0sSUFBTixFQUFZLE1BQVosRUFBb0IsS0FBcEIsRUFBMkIsTUFBM0IsS0FBcUMsT0FBM0M7O0FBRUEsU0FBSyxHQUFMO0FBQ0EsU0FBSyxNQUFMLEdBQWMsUUFBZDtBQUNBLFNBQUssU0FBTCxHQUFpQixTQUFqQjtBQUNBLFNBQUssT0FBTCxHQUFlLFVBQVUsS0FBekI7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLEtBQUw7O0FBRUEsU0FBSyxHQUFMLEdBQVcsR0FBWDtBQUNBLFNBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxTQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0EsU0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLFNBQUssTUFBTCxHQUFjLE1BQWQ7O0FBRUE7QUFDQTs7QUFFQSxTQUFLLE1BQUw7QUFDQSxTQUFLLFlBQUwsQ0FBa0IsUUFBbEIsRUFBNEIsRUFBQyxNQUFELEVBQVMsR0FBVCxFQUE1QjtBQUNEOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGNBQVksSUFBWixFQUFrQjtBQUNoQixRQUFJLEdBQUosRUFBUyxLQUFULEVBQWdCLEtBQWhCLEVBQXVCLElBQXZCLEVBQTZCLEtBQTdCLEVBQW9DLEtBQXBDLEVBQTJDLE1BQTNDOztBQUVBLFNBQUssWUFBTCxDQUFrQixJQUFsQjs7QUFFQSxZQUFRLEtBQUssS0FBTCxJQUFjLENBQXRCO0FBQ0EsWUFBUSxLQUFLLEtBQUwsSUFBYyxDQUF0QjtBQUNBLGFBQVMsS0FBSyxNQUFkO0FBQ0EsVUFBTSxLQUFLLEdBQVg7QUFDQSxZQUFRLEtBQUssS0FBTCxDQUFXLEtBQW5COztBQUVBLFlBQVEsUUFBUSxJQUFoQjtBQUNBLFlBQVEsS0FBSyxLQUFMLENBQVcsUUFBTSxLQUFOLEdBQVksR0FBdkIsSUFBOEIsR0FBdEM7QUFDQSxXQUFPLFFBQVEsS0FBZjs7QUFFQSxRQUFJLENBQUosRUFBTyxLQUFQLENBQWEsT0FBTyxHQUFQLEdBQWEsV0FBMUIsSUFBMEMsb0JBQW1CLElBQUssK0JBQWxFO0FBQ0EsU0FBSyxLQUFMLEdBQWEsSUFBYjtBQUNBLFNBQUssS0FBTCxHQUFhLElBQWI7QUFDQSxXQUFPLElBQVA7QUFDRDs7QUFFRCxlQUFhLElBQWIsRUFBbUI7QUFDakIsU0FBSyxVQUFMLENBQWdCLElBQWhCO0FBQ0EsU0FBSyxTQUFMLENBQWUsSUFBZjtBQUNBLFNBQUssWUFBTCxDQUFrQixJQUFsQjtBQUNBLFNBQUssV0FBTCxDQUFpQixJQUFqQjtBQUNEOztBQUVELGVBQWEsSUFBYixFQUFtQjtBQUNqQixRQUFJLFFBQVEsS0FBSyxLQUFqQjtBQUNBLGNBQVUsSUFBVixFQUFnQixLQUFoQixFQUF1QixLQUFLLFNBQTVCLEVBQXdDLEtBQUQsSUFBVztBQUNoRCxXQUFLLE9BQUwsR0FBZSxLQUFmO0FBQ0QsS0FGRDtBQUdEOztBQUVELGNBQVksSUFBWixFQUFrQjtBQUNoQixRQUFJLFFBQVEsS0FBSyxLQUFqQjtBQUNBLGNBQVUsSUFBVixFQUFnQixLQUFoQixFQUF1QixLQUFLLEtBQTVCLEVBQW9DLEtBQUQsSUFBVztBQUM1QyxXQUFLLEtBQUwsQ0FBVyxLQUFYLEdBQW1CLEtBQW5CO0FBQ0QsS0FGRDtBQUdEOztBQUVELGFBQVcsSUFBWCxFQUFpQjtBQUNmLFFBQUksUUFBUSxLQUFLLEtBQWpCO0FBQ0EsY0FBVSxJQUFWLEVBQWdCLEtBQWhCLEVBQXVCLEtBQUssSUFBNUIsRUFBbUMsS0FBRCxJQUFXO0FBQzNDLFdBQUssR0FBTCxDQUFTLEdBQVQsQ0FBYSxTQUFiLEVBQXdCLFFBQVEsTUFBUixHQUFpQixPQUF6QztBQUNELEtBRkQ7QUFHRDs7QUFFRCxZQUFVLElBQVYsRUFBZ0I7QUFDZCxRQUFJLFFBQVEsS0FBSyxLQUFqQjtBQUNBLGNBQVUsSUFBVixFQUFnQixLQUFoQixFQUF1QixLQUFLLEdBQTVCLEVBQWtDLEtBQUQsSUFBVztBQUMxQyxVQUFJLFVBQVUsS0FBSyxPQUFuQjtBQUNBLFdBQUssR0FBTCxDQUFTLEdBQVQsQ0FBYSxLQUFiLEVBQW9CLFFBQU0sT0FBTixHQUFjLElBQWxDO0FBQ0QsS0FIRDtBQUlEOztBQUVEOzs7O0FBSUEsZUFBYSxRQUFiLEVBQXVCLE9BQXZCLEVBQWdDO0FBQzlCLFFBQUksR0FBSixFQUFTLEdBQVQsRUFBYyxPQUFkO0FBQ0EsUUFBSSxFQUFDLE1BQUQsRUFBUyxHQUFULEtBQWdCLE9BQXBCO0FBQ0EsY0FBVSxLQUFLLE9BQWY7QUFDQSxVQUFNO0FBQ0osa0JBQVksT0FEUjtBQUVKLGNBQVEsQ0FGSjtBQUdKLGVBQVM7QUFITCxLQUFOO0FBS0EsUUFBSSxNQUFKLEVBQVk7QUFDVixVQUFJLGNBQUosSUFBc0IsTUFBdEI7QUFDQSxVQUFJLGFBQUosSUFBcUIsTUFBckI7QUFDRDtBQUNELFFBQUksR0FBSixFQUFTO0FBQ1AsVUFBSSxHQUFKLEdBQVUsTUFBSSxPQUFKLEdBQVksSUFBdEI7QUFDRDtBQUNELFVBQU0sRUFBRSxRQUFGLENBQU47QUFDQSxRQUFJLEdBQUosQ0FBUSxHQUFSO0FBQ0EsU0FBSyxHQUFMLEdBQVcsR0FBWDtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUVELFdBQVM7QUFDUCxRQUFJLE1BQUo7QUFDQSxRQUFJLENBQUMsQ0FBTCxFQUFRO0FBQ04sWUFBTSx1QkFBTjtBQUNEO0FBQ0QsV0FBTyxJQUFQO0FBQ0Q7O0FBaEpvQyxDQUF2Qzs7O0FDSkEsT0FBTyxPQUFQLEdBQWlCLFFBQVEsZUFBUixDQUFqQjs7O0FDQUEsTUFBTSxPQUFPLE9BQU8sT0FBcEI7O0FBRUEsS0FBSyxlQUFMLEdBQXVCLENBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsV0FBakIsRUFBOEIsUUFBOUIsS0FBMkM7QUFDaEUsTUFBSSxhQUFKLEVBQW1CLEtBQW5CO0FBQ0Esa0JBQWdCLFdBQVcsSUFBM0I7QUFDQSxVQUFRLGdCQUFnQixPQUFPLFFBQXZCLEdBQWtDLFdBQVcsSUFBckQ7QUFDQSxnQkFBYyxZQUFZLEdBQVosQ0FBZ0IsY0FBYyxTQUFTLFVBQVQsRUFBcUIsRUFBckIsQ0FBOUIsQ0FBZDtBQUNBLE9BQUssSUFBSSxJQUFFLENBQVgsRUFBYyxJQUFFLEtBQWhCLEVBQXVCLEdBQXZCLEVBQTRCO0FBQzFCLFFBQUksR0FBSixFQUFTLEtBQVQ7QUFDQSxVQUFNLGdCQUFnQixXQUFXLENBQTNCLEdBQStCLFdBQVcsQ0FBaEQ7QUFDQSxZQUFRLFlBQVksT0FBWixDQUFvQixHQUFwQixDQUFSO0FBQ0EsUUFBSSxRQUFRLENBQUMsQ0FBYixFQUFnQjtBQUNkLFVBQUksSUFBSSxnQkFBZ0IsS0FBaEIsR0FBd0IsUUFBUSxDQUF4QztBQUNBLGVBQVMsSUFBVCxDQUFjLElBQWQsRUFBb0IsWUFBWSxDQUFaLENBQXBCLEVBQW9DLGFBQXBDO0FBQ0Q7QUFDRjtBQUNGLENBZEQ7O0FBZ0JBLEtBQUssU0FBTCxHQUFpQixDQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLEdBQWpCLEVBQXNCLFFBQXRCLEtBQW1DO0FBQ2xELE1BQUksY0FBYyxPQUFPLElBQVAsQ0FBWSxJQUFJLFdBQWhCLENBQWxCOztBQUVBLE1BQUksYUFBYSxTQUFqQixFQUE0QjtBQUMxQixRQUFJLFFBQVEsSUFBSSxXQUFKLENBQWdCLElBQWhCLENBQVo7QUFDQSxRQUFJLFVBQVUsU0FBZCxFQUF5QjtBQUN2QixlQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW9CLEtBQXBCLEVBQTJCLElBQTNCLEVBQWlDLElBQWpDO0FBQ0Q7QUFDRjtBQUNELE9BQUssZUFBTCxDQUFxQixJQUFyQixFQUEyQixRQUEzQixFQUFxQyxXQUFyQyxFQUFrRCxDQUFDLFVBQUQsRUFBYSxhQUFiLEtBQStCO0FBQy9FLFFBQUksUUFBUSxJQUFJLFdBQUosQ0FBZ0IsVUFBaEIsQ0FBWjtBQUNBLGFBQVMsSUFBVCxDQUFjLElBQWQsRUFBb0IsS0FBcEIsRUFBMkIsVUFBM0IsRUFBdUMsYUFBdkM7QUFDRCxHQUhEO0FBSUQsQ0FiRDs7QUFlQSxLQUFLLGdCQUFMLEdBQXdCLENBQUMsT0FBRCxFQUFVLFFBQVYsS0FBdUI7QUFDN0MsTUFBSSxJQUFKOztBQUVBLFlBQVUsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixRQUFsQixFQUE0QixPQUE1QixDQUFWO0FBQ0EsU0FBTyxPQUFPLElBQVAsQ0FBWSxPQUFaLENBQVA7O0FBRUEsT0FBSyxPQUFMLENBQWEsT0FBTztBQUNsQixRQUFJLEtBQUosRUFBVyxRQUFYO0FBQ0EsWUFBUSxRQUFRLEdBQVIsQ0FBUjtBQUNBLGVBQVcsS0FBSyxNQUFMLENBQVksS0FBWixFQUFtQixRQUFuQixDQUFYO0FBQ0EsUUFBSSxRQUFKLEVBQWM7QUFDWixVQUFJLFNBQVMsU0FBUyxNQUFNLEdBQU4sQ0FBVCxHQUFzQixNQUFNLEdBQU4sQ0FBdEIsR0FBbUMsU0FBUyxHQUFULEVBQWMsS0FBOUQ7QUFDQSxjQUFRLEdBQVIsSUFBZTtBQUNiLGVBQU8sTUFETTtBQUViLHFCQUFhLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0IsRUFBQyxHQUFHLE1BQUosRUFBbEIsRUFBK0IsS0FBL0I7QUFGQSxPQUFmO0FBSUQsS0FORCxNQU9LO0FBQ0gsY0FBUSxHQUFSLElBQWU7QUFDYixhQURhO0FBRWIscUJBQWEsRUFBQyxHQUFHLEtBQUo7QUFGQSxPQUFmO0FBSUQ7QUFDRixHQWpCRDtBQWtCQSxTQUFPLE9BQVA7QUFDRCxDQXpCRDs7QUEyQkE7Ozs7Ozs7O0FBUUEsS0FBSyxNQUFMLEdBQWMsQ0FBQyxLQUFELEVBQVEsSUFBUixLQUFpQjtBQUM3QixVQUFRLElBQVI7QUFDRSxTQUFLLFFBQUw7QUFDRSxhQUFPLE9BQU8sS0FBUCxLQUFpQixRQUF4QjtBQUNGLFNBQUssUUFBTDtBQUNFLGFBQU8sT0FBTyxLQUFQLEtBQWlCLFFBQWpCLElBQTZCLE9BQU8sS0FBUCxDQUFhLEtBQWIsTUFBd0IsS0FBNUQ7QUFDRixTQUFLLFNBQUw7QUFDRSxhQUFPLFVBQVUsSUFBVixJQUFrQixVQUFVLEtBQW5DO0FBQ0YsU0FBSyxPQUFMO0FBQ0UsYUFBTyxNQUFNLE9BQU4sQ0FBYyxLQUFkLENBQVA7QUFDRixTQUFLLFFBQUw7QUFDRSxhQUFPLE9BQU8sS0FBUCxLQUFpQixRQUFqQixJQUE2QixVQUFVLElBQXZDLElBQStDLE1BQU0sT0FBTixDQUFjLEtBQWQsTUFBeUIsS0FBL0U7QUFDRixTQUFLLE1BQUw7QUFDRSxhQUFPLFVBQVUsSUFBakI7QUFDRixTQUFLLFdBQUw7QUFDRSxhQUFPLFVBQVUsU0FBakI7QUFDRixTQUFLLFVBQUw7QUFDRSxhQUFPLE9BQU8sU0FBUCxDQUFpQixRQUFqQixDQUEwQixJQUExQixDQUErQixLQUEvQixNQUEwQyxtQkFBakQ7QUFDRixTQUFLLFFBQUw7QUFDRSxhQUFPLE9BQU8sS0FBUCxLQUFpQixRQUF4QjtBQUNGLFNBQUssS0FBTDtBQUNFLGFBQU8sT0FBTyxLQUFQLENBQWEsS0FBYixDQUFQO0FBQ0YsU0FBSyxNQUFMO0FBQ0UsYUFBTyxpQkFBaUIsSUFBeEI7QUFDRjtBQUNFLFlBQU0sSUFBSSxLQUFKLENBQVcsdUJBQXNCLElBQUssR0FBdEMsQ0FBTjtBQXhCSjtBQTBCRCxDQTNCRDs7QUE2QkEsS0FBSyxNQUFMLEdBQWMsTUFBTTtBQUNsQixNQUFJLE1BQUo7QUFDQSxXQUFTLE9BQU8sZ0JBQVAsQ0FBd0IsU0FBUyxlQUFqQyxFQUFrRCxFQUFsRCxDQUFULEVBQ0UsTUFBTSxDQUFDLE1BQU0sU0FBTixDQUFnQixLQUFoQixDQUNKLElBREksQ0FDQyxNQURELEVBRUosSUFGSSxDQUVDLEVBRkQsRUFHSixLQUhJLENBR0UsbUJBSEYsS0FHMkIsT0FBTyxLQUFQLEtBQWlCLEVBQWpCLElBQXVCLENBQUMsRUFBRCxFQUFLLEdBQUwsQ0FIbkQsRUFJSixDQUpJLENBRFIsRUFNRSxNQUFPLGlCQUFELENBQW9CLEtBQXBCLENBQTBCLElBQUksTUFBSixDQUFXLE1BQU0sR0FBTixHQUFZLEdBQXZCLEVBQTRCLEdBQTVCLENBQTFCLEVBQTRELENBQTVELENBTlI7QUFPRSxTQUFPO0FBQ0wsU0FBSyxHQURBO0FBRUwsZUFBVyxHQUZOO0FBR0wsU0FBSyxNQUFNLEdBQU4sR0FBWSxHQUhaO0FBSUwsUUFBSSxJQUFJLENBQUosRUFBTyxXQUFQLEtBQXVCLElBQUksTUFBSixDQUFXLENBQVg7QUFKdEIsR0FBUDtBQU1ILENBZkQ7O0FBaUJBO0FBQ0EsS0FBSyxRQUFMLEdBQWdCLENBQUMsSUFBRCxFQUFPLFNBQVAsRUFBa0IsUUFBbEIsS0FBK0I7QUFDN0MsTUFBSSxPQUFKO0FBQ0EsU0FBTyxTQUFTLFNBQVQsR0FBc0I7QUFDM0IsUUFBSSxNQUFNLElBQVY7QUFBQSxRQUFnQixPQUFPLFNBQXZCO0FBQ0EsYUFBUyxPQUFULEdBQW9CO0FBQ2xCLFVBQUksQ0FBQyxRQUFMLEVBQWUsS0FBSyxLQUFMLENBQVcsR0FBWCxFQUFnQixJQUFoQjtBQUNmLGdCQUFVLElBQVY7QUFDRDtBQUNELFFBQUksT0FBSixFQUFhO0FBQ1gsbUJBQWEsT0FBYjtBQUNELEtBRkQsTUFHSyxJQUFJLFFBQUosRUFBYztBQUNqQixXQUFLLEtBQUwsQ0FBVyxHQUFYLEVBQWdCLElBQWhCO0FBQ0Q7QUFDRCxjQUFVLFdBQVcsT0FBWCxFQUFvQixhQUFhLEdBQWpDLENBQVY7QUFDRCxHQWJEO0FBY0QsQ0FoQkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgUGFyYWxsYXhDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9QYXJhbGxheENvbGxlY3Rpb24nKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxheEJybyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGNvbnN0IHt3cmFwcGVyLCBkaXNhYmxlU3R5bGVzfSA9IHRoaXMubm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKTtcblxuICAgIHRoaXMuY29sbGVjdGlvbnMgPSBbXTtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5jYWNoZURPTUVsZW1lbnRzKHdyYXBwZXIpO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIGlmICghZGlzYWJsZVN0eWxlcykge1xuICAgICAgdGhpcy5zdHlsZURPTSgpO1xuICAgIH1cbiAgfVxuXG4gIGFkZENvbGxlY3Rpb24oc2VsZWN0b3IsIG9iaikge1xuICAgIHZhciBjb2xsZWN0aW9uO1xuICAgIGNvbGxlY3Rpb24gPSBuZXcgUGFyYWxsYXhDb2xsZWN0aW9uKHNlbGVjdG9yLCBvYmopO1xuICAgIHRoaXMuY29sbGVjdGlvbnMucHVzaChjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuXG4gIGNhY2hlRE9NRWxlbWVudHMod3JhcHBlcikge1xuICAgIHRoaXMuJGVsID0ge307XG4gICAgdGhpcy4kZWwud2luID0gJCh3aW5kb3cpO1xuICAgIHRoaXMuJGVsLmRvYyA9ICQoZG9jdW1lbnQpO1xuICAgIHRoaXMuJGVsLmJvZHkgPSAkKCdib2R5Jyk7XG4gICAgdGhpcy4kZWwud3JhcHBlciA9ICQod3JhcHBlcik7XG4gIH1cblxuICBzdHlsZURPTSgpIHtcbiAgICB2YXIge2JvZHksIHdyYXBwZXIsIGRvY30gPSB0aGlzLiRlbDtcbiAgICBib2R5LmNzcygnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICB3cmFwcGVyLmNzcygnbWluLWhlaWdodCcsICcxMDAlJyk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IHRyYWNrID0gKCkgPT4ge1xuICAgICAgdmFyIHBvc1kgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICB0aGlzLm1vdmVFbGVtZW50cyhwb3NZKTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0cmFjayk7XG4gICAgfVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0cmFjayk7XG4gIH1cblxuXG4gIG1vdmVFbGVtZW50cyhwb3NZKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25zO1xuICAgIGNvbGxlY3Rpb25zID0gdGhpcy5jb2xsZWN0aW9ucztcbiAgICBjb2xsZWN0aW9ucy5mb3JFYWNoKGNvbGxlY3Rpb24gPT4gY29sbGVjdGlvbi5tb3ZlRWxlbWVudHMocG9zWSkpO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gIH1cblxuICBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgd3JhcHBlcjogJyNwYXJhbGxheCcsXG4gICAgICBkaXNhYmxlU3R5bGVzOiBmYWxzZSxcbiAgICB9LCBvcHRpb25zKTtcbiAgfVxuXG59XG4iLCJjb25zdCB7bm9ybWFsaXplT3B0aW9ucywgcnVuVXBkYXRlfSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbmNvbnN0IFBhcmFsbGF4RWxlbWVudCA9IHJlcXVpcmUoJy4vUGFyYWxsYXhFbGVtZW50Jyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsbGF4Q29sbGVjdGlvbiB7XG5cbiAgY29uc3RydWN0b3Ioc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zLCB7XG4gICAgICB0b3A6IHt2YWx1ZTogMH0sXG4gICAgICBoaWRlOiB7dmFsdWU6IGZhbHNlfSxcbiAgICAgIHpJbmRleDoge3ZhbHVlOiAtMX0sXG4gICAgICBjZW50ZXI6IHt2YWx1ZTogZmFsc2V9LFxuICAgIH0pO1xuICAgIGNvbnN0IHt0b3AsIGhpZGUsIHpJbmRleCwgY2VudGVyfSA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLiRlbDtcbiAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgdGhpcy5wcmV2UG9zWTtcblxuICAgIHRoaXMudG9wID0gdG9wO1xuICAgIHRoaXMuaGlkZSA9IGhpZGU7XG4gICAgdGhpcy56SW5kZXggPSB6SW5kZXg7XG4gICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XG5cbiAgICB0aGlzLmpRdWVyeSgpO1xuICAgIHRoaXMuc3R5bGVDb2xsZWN0aW9uKHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8vIGhpZGUodmFsdWUpIHtcbiAgLy8gICB0aGlzLmhpZGUudmFsdWUgPSB2YWx1ZTtcbiAgLy8gICB0aGlzLiRlbC5jc3MoJ2Rpc3BsYXknLCB2YWx1ZSA/ICdub25lJyA6ICdibG9jaycpO1xuICAvLyB9XG5cbiAgLy8gekluZGV4KHZhbHVlKSB7XG4gIC8vICAgdGhpcy56SW5kZXgudmFsdWUgPSB2YWx1ZTtcbiAgLy8gICB0aGlzLiRlbC5jc3MoJ3pJbmRleCcsIHZhbHVlKTtcbiAgLy8gfVxuICAvL1xuICAvLyB0b3AodmFsdWUpIHtcbiAgLy8gICB2YXIgdG9wO1xuICAvLyAgIHRoaXMudG9wLnZhbHVlID0gdmFsdWU7XG4gIC8vICAgdGhpcy4kZWwuY2hpbGRyZW4oKS5jc3MoJ3RvcCcsIHZhbHVlICsgJ3B4Jyk7XG4gIC8vIH1cbiAgLy9cbiAgLy8gY2VudGVyKHZhbHVlKSB7XG4gIC8vICAgdGhpcy5jZW50ZXIudmFsdWUgPSB2YWx1ZTtcbiAgLy8gICB0aGlzLiRlbC5jaGlsZHJlbigpLmNzcyh7XG4gIC8vICAgICAnbWFyZ2luLXJpZ2h0JzogJ2F1dG8nLFxuICAvLyAgICAgJ21hcmdpbi1sZWZ0JzogJ2F1dG8nLFxuICAvLyAgIH0pO1xuICAvLyB9XG5cbiAgYWRkRWxlbWVudHMob2JqKSB7XG4gICAgdmFyIHNlbGVjdG9ycywgdG9wLCBjZW50ZXI7XG4gICAgc2VsZWN0b3JzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICBzZWxlY3RvcnMuZm9yRWFjaChzZWxlY3RvciA9PiB7XG4gICAgICB2YXIgb3B0aW9ucyA9IG9ialtzZWxlY3Rvcl07XG4gICAgICB0aGlzLmFkZEVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkRWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIHZhciBlbGVtZW50O1xuICAgIGVsZW1lbnQgPSBuZXcgUGFyYWxsYXhFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zLCB0aGlzLnRvcCk7XG4gICAgdGhpcy5lbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbW92ZUVsZW1lbnRzKHBvc1kpIHtcbiAgICB2YXIgZWxlbWVudHM7XG4gICAgZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzO1xuICAgIHRoaXMucnVuQ2FsbGJhY2tzKHBvc1kpO1xuICAgIGVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiBlbGVtZW50Lm1vdmVFbGVtZW50KHBvc1kpKTtcbiAgICB0aGlzLnByZXZQb3NZID0gcG9zWTtcbiAgfVxuXG4gIHJ1bkNhbGxiYWNrcyhwb3NZKSB7XG4gICAgdGhpcy51cGRhdGVIaWRlKHBvc1kpO1xuICAgIC8vIHRoaXMudXBkYXRlWmluZGV4KHBvc1kpO1xuICAgIC8vIHRoaXMudXBkYXRlQ2VudGVyKHBvc1kpO1xuICB9XG5cbiAgdXBkYXRlSGlkZShwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy5wcmV2UG9zWTtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuaGlkZSwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLiRlbC5jc3MoJ29wYWNpdHknLCB2YWx1ZSA/IDAgOiAxKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZVppbmRleChwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy5wcmV2UG9zWTtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuekluZGV4LCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuJGVsLmNzcygnekluZGV4JywgdmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlQ2VudGVyKHBvc1kpIHtcbiAgICB2YXIgcHJldlkgPSB0aGlzLnByZXZQb3NZO1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgdGhpcy5jZW50ZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuJGVsLmNzcyh7XG4gICAgICAgICAgJ21hcmdpbi1yaWdodCc6ICdhdXRvJyxcbiAgICAgICAgICAnbWFyZ2luLWxlZnQnOiAnYXV0bycsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuJGVsLmNzcyh7XG4gICAgICAgICAgJ21hcmdpbi1yaWdodCc6ICdpbmhlcml0JyxcbiAgICAgICAgICAnbWFyZ2luLWxlZnQnOiAnaW5oZXJpdCcsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gIH1cblxuICBzdHlsZUNvbGxlY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgJGVsLCBjc3M7XG4gICAgdmFyIHtjZW50ZXIsIHpJbmRleCwgaGlkZX0gPSBvcHRpb25zO1xuICAgIGNzcyA9IHt9O1xuICAgIGNzcy56SW5kZXggPSB6SW5kZXgudmFsdWU7XG4gICAgaWYgKGNlbnRlci52YWx1ZSkge1xuICAgICAgY3NzWydtYXJnaW4tcmlnaHQnXSA9ICdhdXRvJztcbiAgICAgIGNzc1snbWFyZ2luLWxlZnQnXSA9ICdhdXRvJztcbiAgICB9XG4gICAgaWYgKGhpZGUudmFsdWUpIHtcbiAgICAgIGNzcy5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cbiAgICAkZWwgPSAkKHNlbGVjdG9yKTtcbiAgICAkZWwuY3NzKGNzcyk7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxufVxuIiwiY29uc3Qge3ByZWZpeCwgbm9ybWFsaXplT3B0aW9ucywgcnVuVXBkYXRlfSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxsYXhFbGVtZW50IHtcblxuICBjb25zdHJ1Y3RvcihzZWxlY3Rvciwgb3B0aW9ucywgb2Zmc2V0VG9wKSB7XG4gICAgb3B0aW9ucyA9IG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucywge1xuICAgICAgdG9wOiB7dmFsdWU6IDB9LFxuICAgICAgaGlkZToge3ZhbHVlOiBmYWxzZX0sXG4gICAgICB6SW5kZXg6IHt2YWx1ZTogLTF9LFxuICAgICAgc3BlZWQ6IHt2YWx1ZTogMX0sXG4gICAgICBjZW50ZXI6IHt2YWx1ZTogZmFsc2V9LFxuICAgIH0pO1xuICAgIGNvbnN0IHt0b3AsIGhpZGUsIHpJbmRleCwgc3BlZWQsIGNlbnRlcn0gPSBvcHRpb25zO1xuXG4gICAgdGhpcy4kZWw7XG4gICAgdGhpcy5wcmVmaXggPSBwcmVmaXgoKTtcbiAgICB0aGlzLm9mZnNldFRvcCA9IG9mZnNldFRvcDtcbiAgICB0aGlzLnlPZmZzZXQgPSBvZmZzZXRUb3AudmFsdWU7XG4gICAgdGhpcy55UHJldjtcbiAgICB0aGlzLnRQcmV2O1xuXG4gICAgdGhpcy50b3AgPSB0b3A7XG4gICAgdGhpcy5oaWRlID0gaGlkZTtcbiAgICB0aGlzLnpJbmRleCA9IHpJbmRleDtcbiAgICB0aGlzLnNwZWVkID0gc3BlZWQ7XG4gICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XG5cbiAgICAvLyB0aGlzLmRlbHRhICA9IDA7XG4gICAgLy8gdGhpcy51cGRhdGUgPSB7fTtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5zdHlsZUVsZW1lbnQoc2VsZWN0b3IsIHtjZW50ZXIsIHRvcH0pO1xuICB9XG5cbiAgLy8gaGlkZSh2YWx1ZSkge1xuICAvLyAgIHRoaXMuaGlkZS52YWx1ZSA9IHZhbHVlO1xuICAvLyAgIHRoaXMuJGVsLmNzcygnZGlzcGxheScsIHZhbHVlID8gJ25vbmUnIDogJ2Jsb2NrJyk7XG4gIC8vIH1cbiAgLy9cbiAgLy8gekluZGV4KHZhbHVlKSB7XG4gIC8vICAgdGhpcy56SW5kZXgudmFsdWUgPSB2YWx1ZTtcbiAgLy8gICB0aGlzLiRlbC5jc3MoJ3pJbmRleCcsIHZhbHVlKTtcbiAgLy8gfVxuICAvL1xuICAvLyB0b3AodmFsdWUpIHtcbiAgLy8gICB0aGlzLnRvcC52YWx1ZSA9IHZhbHVlO1xuICAvLyAgIHRoaXMuJGVsLmNzcygndG9wJywgdmFsdWUrJ3B4Jyk7XG4gIC8vIH1cbiAgLy9cbiAgLy8gY2VudGVyKHZhbHVlKSB7XG4gIC8vICAgdGhpcy5jZW50ZXIudmFsdWUgPSB2YWx1ZTtcbiAgLy8gICB0aGlzLiRlbC5jc3Moe1xuICAvLyAgICAgJ21hcmdpbi1yaWdodCc6ICdhdXRvJyxcbiAgLy8gICAgICdtYXJnaW4tbGVmdCc6ICdhdXRvJyxcbiAgLy8gICB9KTtcbiAgLy8gfVxuXG4gIG1vdmVFbGVtZW50KHBvc1kpIHtcbiAgICB2YXIgJGVsLCB5UHJldiwgdFByZXYsIHlOZXcsIHNwZWVkLCBkZWx0YSwgcHJlZml4O1xuXG4gICAgdGhpcy5ydW5DYWxsYmFja3MocG9zWSk7XG5cbiAgICB5UHJldiA9IHRoaXMueVByZXYgfHwgMDtcbiAgICB0UHJldiA9IHRoaXMudFByZXYgfHwgMDtcbiAgICBwcmVmaXggPSB0aGlzLnByZWZpeDtcbiAgICAkZWwgPSB0aGlzLiRlbDtcbiAgICBzcGVlZCA9IHRoaXMuc3BlZWQudmFsdWU7XG5cbiAgICBkZWx0YSA9IHlQcmV2IC0gcG9zWTtcbiAgICBkZWx0YSA9IE1hdGgucm91bmQoZGVsdGEqc3BlZWQqMTAwKSAvIDEwMDtcbiAgICB5TmV3ID0gdFByZXYgKyBkZWx0YTtcblxuICAgICRlbFswXS5zdHlsZVtwcmVmaXguZG9tICsgJ1RyYW5zZm9ybSddID0gYHRyYW5zbGF0ZTNkKDBweCwgJHt5TmV3fXB4LCAwKSB0cmFuc2xhdGVaKDApIHNjYWxlKDEpYDtcbiAgICB0aGlzLnlQcmV2ID0gcG9zWTtcbiAgICB0aGlzLnRQcmV2ID0geU5ldztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJ1bkNhbGxiYWNrcyhwb3NZKSB7XG4gICAgdGhpcy51cGRhdGVIaWRlKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlVG9wKHBvc1kpO1xuICAgIHRoaXMudXBkYXRlT2Zmc2V0KHBvc1kpO1xuICAgIHRoaXMudXBkYXRlU3BlZWQocG9zWSk7XG4gIH1cblxuICB1cGRhdGVPZmZzZXQocG9zWSkge1xuICAgIHZhciBwcmV2WSA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHByZXZZLCB0aGlzLm9mZnNldFRvcCwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLm9mZnNldFkgPSB2YWx1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZVNwZWVkKHBvc1kpIHtcbiAgICB2YXIgcHJldlkgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgdGhpcy5zcGVlZCwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLnNwZWVkLnZhbHVlID0gdmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVIaWRlKHBvc1kpIHtcbiAgICB2YXIgcHJldlkgPSB0aGlzLnlQcmV2O1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgdGhpcy5oaWRlLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuJGVsLmNzcygnZGlzcGxheScsIHZhbHVlID8gJ25vbmUnIDogJ2Jsb2NrJyk7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVUb3AocG9zWSkge1xuICAgIHZhciBwcmV2WSA9IHRoaXMueVByZXY7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHByZXZZLCB0aGlzLnRvcCwgKHZhbHVlKSA9PiB7XG4gICAgICB2YXIgeU9mZnNldCA9IHRoaXMueU9mZnNldDtcbiAgICAgIHRoaXMuJGVsLmNzcygndG9wJywgdmFsdWUreU9mZnNldCsncHgnKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgc3R5bGVFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgdmFyICRlbCwgY3NzLCB5T2Zmc2V0O1xuICAgIHZhciB7Y2VudGVyLCB0b3B9ID0gb3B0aW9ucztcbiAgICB5T2Zmc2V0ID0gdGhpcy55T2Zmc2V0O1xuICAgIGNzcyA9IHtcbiAgICAgICdwb3NpdGlvbic6ICdmaXhlZCcsXG4gICAgICAnbGVmdCc6IDAsXG4gICAgICAncmlnaHQnOiAwLFxuICAgIH07XG4gICAgaWYgKGNlbnRlcikge1xuICAgICAgY3NzWydtYXJnaW4tcmlnaHQnXSA9ICdhdXRvJztcbiAgICAgIGNzc1snbWFyZ2luLWxlZnQnXSA9ICdhdXRvJztcbiAgICB9XG4gICAgaWYgKHRvcCkge1xuICAgICAgY3NzLnRvcCA9IHRvcCt5T2Zmc2V0KydweCc7XG4gICAgfVxuICAgICRlbCA9ICQoc2VsZWN0b3IpO1xuICAgICRlbC5jc3MoY3NzKTtcbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGpRdWVyeSgpIHtcbiAgICAkID0galF1ZXJ5O1xuICAgIGlmICghJCkge1xuICAgICAgdGhyb3cgJ2pRdWVyeSBpcyBub3QgZGVmaW5lZCc7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9QYXJhbGxheEJybycpO1xuIiwiY29uc3Qgc2VsZiA9IG1vZHVsZS5leHBvcnRzO1xuXG5zZWxmLmNhbGxCcmVha3BvaW50cyA9IChwb3NZLCBwcmV2UG9zWSwgYnJlYWtwb2ludHMsIGNhbGxiYWNrKSA9PiB7XG4gIHZhciBzY3JvbGxpbmdEb3duLCB5RGlmZjtcbiAgc2Nyb2xsaW5nRG93biA9IHByZXZQb3NZIDwgcG9zWTtcbiAgeURpZmYgPSBzY3JvbGxpbmdEb3duID8gcG9zWSAtIHByZXZQb3NZIDogcHJldlBvc1kgLSBwb3NZO1xuICBicmVha3BvaW50cyA9IGJyZWFrcG9pbnRzLm1hcChicmVha3BvaW50ID0+IHBhcnNlSW50KGJyZWFrcG9pbnQsIDEwKSk7XG4gIGZvciAobGV0IGk9MDsgaTx5RGlmZjsgaSsrKSB7XG4gICAgbGV0IHBvcywgaW5kZXg7XG4gICAgcG9zID0gc2Nyb2xsaW5nRG93biA/IHByZXZQb3NZICsgaSA6IHByZXZQb3NZIC0gaTtcbiAgICBpbmRleCA9IGJyZWFrcG9pbnRzLmluZGV4T2YocG9zKTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgbGV0IGkgPSBzY3JvbGxpbmdEb3duID8gaW5kZXggOiBpbmRleCAtIDE7XG4gICAgICBjYWxsYmFjay5jYWxsKG51bGwsIGJyZWFrcG9pbnRzW2ldLCBzY3JvbGxpbmdEb3duKTtcbiAgICB9XG4gIH1cbn1cblxuc2VsZi5ydW5VcGRhdGUgPSAocG9zWSwgcHJldlBvc1ksIG9iaiwgY2FsbGJhY2spID0+IHtcbiAgdmFyIGJyZWFrcG9pbnRzID0gT2JqZWN0LmtleXMob2JqLmJyZWFrcG9pbnRzKTtcblxuICBpZiAocHJldlBvc1kgPT09IHVuZGVmaW5lZCkge1xuICAgIHZhciB2YWx1ZSA9IG9iai5icmVha3BvaW50c1twb3NZXTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2FsbGJhY2suY2FsbChudWxsLCB2YWx1ZSwgcG9zWSwgdHJ1ZSk7XG4gICAgfVxuICB9XG4gIHNlbGYuY2FsbEJyZWFrcG9pbnRzKHBvc1ksIHByZXZQb3NZLCBicmVha3BvaW50cywgKGJyZWFrcG9pbnQsIHNjcm9sbGluZ0Rvd24pID0+IHtcbiAgICB2YXIgdmFsdWUgPSBvYmouYnJlYWtwb2ludHNbYnJlYWtwb2ludF07XG4gICAgY2FsbGJhY2suY2FsbChudWxsLCB2YWx1ZSwgYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93bik7XG4gIH0pO1xufVxuXG5zZWxmLm5vcm1hbGl6ZU9wdGlvbnMgPSAob3B0aW9ucywgZGVmYXVsdHMpID0+IHtcbiAgdmFyIGtleXM7XG5cbiAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuXG4gIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgIHZhciB2YWx1ZSwgaXNPYmplY3Q7XG4gICAgdmFsdWUgPSBvcHRpb25zW2tleV07XG4gICAgaXNPYmplY3QgPSBzZWxmLmlzVHlwZSh2YWx1ZSwgJ29iamVjdCcpO1xuICAgIGlmIChpc09iamVjdCkge1xuICAgICAgbGV0IHZhbHVlMSA9IHZhbHVlICYmIHZhbHVlWycwJ10gPyB2YWx1ZVsnMCddIDogZGVmYXVsdHNba2V5XS52YWx1ZTtcbiAgICAgIG9wdGlvbnNba2V5XSA9IHtcbiAgICAgICAgdmFsdWU6IHZhbHVlMSxcbiAgICAgICAgYnJlYWtwb2ludHM6IE9iamVjdC5hc3NpZ24oe30sIHswOiB2YWx1ZTF9LCB2YWx1ZSksXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgb3B0aW9uc1trZXldID0ge1xuICAgICAgICB2YWx1ZSxcbiAgICAgICAgYnJlYWtwb2ludHM6IHswOiB2YWx1ZX1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3B0aW9ucztcbn1cblxuLyoqXG4gKiBHaXZlbiBhIE1peGVkIHZhbHVlIHR5cGUgY2hlY2suXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljLlxuICogQHRlc3RzIHVuaXQuXG4gKi9cbnNlbGYuaXNUeXBlID0gKHZhbHVlLCB0eXBlKSA9PiB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzTmFOKHZhbHVlKSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09IGZhbHNlO1xuICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKTtcbiAgICBjYXNlICdvYmplY3QnOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkgPT09IGZhbHNlO1xuICAgIGNhc2UgJ251bGwnOlxuICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsO1xuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZDtcbiAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCc7XG4gICAgY2FzZSAnTmFOJzpcbiAgICAgIHJldHVybiBOdW1iZXIuaXNOYU4odmFsdWUpO1xuICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnJlY2dvbml6ZWQgdHlwZTogXCIke3R5cGV9XCJgKTtcbiAgfVxufTtcblxuc2VsZi5wcmVmaXggPSAoKSA9PiB7XG4gIHZhciBzdHlsZXM7XG4gIHN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgJycpLFxuICAgIHByZSA9IChBcnJheS5wcm90b3R5cGUuc2xpY2VcbiAgICAgIC5jYWxsKHN0eWxlcylcbiAgICAgIC5qb2luKCcnKVxuICAgICAgLm1hdGNoKC8tKG1venx3ZWJraXR8bXMpLS8pIHx8IChzdHlsZXMuT0xpbmsgPT09ICcnICYmIFsnJywgJ28nXSlcbiAgICApWzFdLFxuICAgIGRvbSA9ICgnd2Via2l0fE1venxNU3xPJykubWF0Y2gobmV3IFJlZ0V4cCgnKCcgKyBwcmUgKyAnKScsICdpJykpWzFdO1xuICAgIHJldHVybiB7XG4gICAgICBkb206IGRvbSxcbiAgICAgIGxvd2VyY2FzZTogcHJlLFxuICAgICAgY3NzOiAnLScgKyBwcmUgKyAnLScsXG4gICAgICBqczogcHJlWzBdLnRvVXBwZXJDYXNlKCkgKyBwcmUuc3Vic3RyKDEpXG4gICAgfTtcbn07XG5cbi8vIGh0dHA6Ly91bnNjcmlwdGFibGUuY29tLzIwMDkvMDMvMjAvZGVib3VuY2luZy1qYXZhc2NyaXB0LW1ldGhvZHMvXG5zZWxmLmRlYm91bmNlID0gKGZ1bmMsIHRocmVzaG9sZCwgZXhlY0FzYXApID0+IHtcbiAgdmFyIHRpbWVvdXQ7XG4gIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQgKCkge1xuICAgIHZhciBvYmogPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuICAgIGZ1bmN0aW9uIGRlbGF5ZWQgKCkge1xuICAgICAgaWYgKCFleGVjQXNhcCkgZnVuYy5hcHBseShvYmosIGFyZ3MpO1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGV4ZWNBc2FwKSB7XG4gICAgICBmdW5jLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgfVxuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHRocmVzaG9sZCB8fCAxMDApO1xuICB9O1xufTtcbiJdfQ==
