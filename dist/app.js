(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const ParallaxBro = require('../lib');

const laxbro = new ParallaxBro();

var page1, page2;

page1 = laxbro.addCollection('#collection1', {
  top: 50,
  hide: false,
  center: true
});

page1.addElements({
  '#img1': {
    top: {
      100: 100
    },
    // speed: {
    //   0: 1,
    //   200: .5,
    //   300: 0,
    //   400: -1,
    // },
    center: true,
    hide: {
      100: false,
      300: true
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
    // this.$el.bodyHtml = $('body, html');
  }

  styleDOM() {
    var { body, wrapper, doc } = this.$el;
    body.css('height', '100%');
    wrapper.css('min-height', '100%');
    // doc.children()
    //   .css('height', '100%')
    //   .addClass('parallax');
  }

  bindEvents() {
    const track = () => {
      var posY = this.$el.win[0].pageYOffset;
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
const ParallaxElement = require('./ParallaxElement');

var $;

module.exports = class ParallaxCollection {

  constructor(selector, options) {
    const { top, hide, zIndex, center } = this.normalizeOptions(options);

    this.elements = [];

    this.top = top;
    this.hide = hide;
    this.zIndex = zIndex;
    this.center = center;

    this.jQuery();
  }

  // set hide(value) {
  //   var property;
  //   property = value ? 'none' : 'block';
  //   if (this.$el) this.$el.css('display', property);
  // }
  //
  // set zIndex(value) {
  //   if (this.$el) this.$el.css('zIndex', value);
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
    element = new ParallaxElement(selector, options);
    this.elements.push(element);
    return this;
  }

  moveElements(posY) {
    var elements;
    elements = this.elements;
    elements.forEach(element => element.moveElement(posY));
  }

  jQuery() {
    $ = jQuery;
    if (!$) {
      throw 'jQuery is not defined';
    }
  }

  normalizeOptions(options) {
    return Object.assign({}, {
      top: { value: 0 },
      hide: { value: false },
      zIndex: { value: -1 },
      center: false
    }, options);
  }

};

},{"./ParallaxElement":4}],4:[function(require,module,exports){
const { prefix, isType } = require('./utils');

var $;

module.exports = class ParallaxElement {

  constructor(selector, options) {
    const { top, hide, zIndex, speed, center } = this.normalizeOptions(options);

    this.$el;
    this.prefix = prefix();

    this.top = top;
    this.hide = hide;
    this.zIndex = zIndex;
    this.speed = speed;
    this.center = center;

    this.prevPosY = 0;
    // this.delta  = 0;
    // this.update = {};

    this.jQuery();
    this.styleElement(selector, { center, top });
  }

  // set hide(value) {
  //   var property;
  //   property = value ? 'block' : 'none';
  //   if (this.$el) this.$el.css('display', property);
  // }
  //
  // set zIndex(value) {
  //   if (this.$el) this.$el.css('zIndex', value);
  // }
  //
  // set top(value) {
  //   if (this.$el) this.$el.css('top', value+'px');
  // }

  moveElement(posY) {
    var $el, speed, delta, prefix;

    this.execCallbacks(posY);
    prefix = this.prefix;
    $el = this.$el;
    speed = this.speed;

    delta = Math.round(posY * speed * 100) / 100;

    $el[0].style[prefix.dom + 'Transform'] = `translate3d(0px, ${delta}px, 0) translateZ(0) scale(1)`;
    this.prevPosY = posY;
    return this;
  }

  callBreakpoints(posY, breakpoints, callback) {
    var prevPosY, scrollingDown, yDiff;

    prevPosY = this.prevPosY;
    scrollingDown = prevPosY < posY;
    yDiff = scrollingDown ? posY - prevPosY : prevPosY - posY;
    breakpoints = breakpoints.map(breakpoint => parseInt(breakpoint, 10));

    for (let i = 0; i < yDiff; i++) {
      let pos, index;
      pos = scrollingDown ? prevPosY + i : prevPosY - i;
      index = breakpoints.indexOf(pos);
      if (index > -1) {
        let i = scrollingDown ? index : index - 1;
        callback.call(this, breakpoints[i], scrollingDown);
      }
    }

    return this;
  }

  exec(posY, property, callback) {
    var breakpoints = Object.keys(this[property].breakpoints);
    this.callBreakpoints(posY, breakpoints, (breakpoint, scrollingDown) => {
      var value = this[property].breakpoints[breakpoint];
      callback.call(this, value, breakpoint, scrollingDown);
    });
  }

  execHide(posY) {
    this.exec(posY, 'hide', value => {
      this.$el.css('display', value ? 'none' : 'block');
    });
  }

  execTop(posY) {
    this.exec(posY, 'top', value => {
      this.$el.css('top', value);
    });
  }

  execCallbacks(posY) {
    this.execHide(posY);
    this.execTop(posY);
    // this.execSpeed(posY);
  }

  /**
   * Apply parallax specific styling to each element in a collection.
   * @param  {String} selector
   * @param  {Object} options
   */
  styleElement(selector, options) {
    var $el, css;
    var { center, top } = options;
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
      css.top = top;
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

  normalizeOptions(options) {
    var defaults, keys;
    defaults = {
      top: { value: 0 },
      hide: { value: false },
      zIndex: { value: -1 },
      speed: { value: 1 },
      center: { value: false }
    };
    keys = Object.keys(options);
    keys.forEach(key => {
      var value, isObject;
      value = options[key];
      isObject = isType(value, 'object');
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

    options = Object.assign({}, defaults, options);

    return options;
  }

};

},{"./utils":6}],5:[function(require,module,exports){
module.exports = require('./ParallaxBro');

},{"./ParallaxBro":2}],6:[function(require,module,exports){
const self = module.exports;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmpzIiwibGliL1BhcmFsbGF4QnJvLmpzIiwibGliL1BhcmFsbGF4Q29sbGVjdGlvbi5qcyIsImxpYi9QYXJhbGxheEVsZW1lbnQuanMiLCJsaWIvaW5kZXguanMiLCJsaWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxNQUFNLGNBQWMsUUFBUSxRQUFSLENBQXBCOztBQUVBLE1BQU0sU0FBUyxJQUFJLFdBQUosRUFBZjs7QUFFQSxJQUFJLEtBQUosRUFBVyxLQUFYOztBQUVBLFFBQVEsT0FBTyxhQUFQLENBQXFCLGNBQXJCLEVBQXFDO0FBQzNDLE9BQUssRUFEc0M7QUFFM0MsUUFBTSxLQUZxQztBQUczQyxVQUFRO0FBSG1DLENBQXJDLENBQVI7O0FBTUEsTUFBTSxXQUFOLENBQWtCO0FBQ2hCLFdBQVM7QUFDUCxTQUFLO0FBQ0gsV0FBSztBQURGLEtBREU7QUFJUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFRLElBVkQ7QUFXUCxVQUFNO0FBQ0osV0FBSyxLQUREO0FBRUosV0FBSztBQUZEO0FBWEM7QUFETyxDQUFsQjs7O0FDWkEsTUFBTSxxQkFBcUIsUUFBUSxzQkFBUixDQUEzQjs7QUFFQSxJQUFJLENBQUo7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLE1BQU0sVUFBTixDQUFpQjs7QUFFaEMsY0FBWSxPQUFaLEVBQXFCO0FBQ25CLFVBQU0sRUFBQyxPQUFELEVBQVUsYUFBVixLQUEyQixLQUFLLGdCQUFMLENBQXNCLE9BQXRCLENBQWpDOztBQUVBLFNBQUssV0FBTCxHQUFtQixFQUFuQjs7QUFFQSxTQUFLLE1BQUw7QUFDQSxTQUFLLGdCQUFMLENBQXNCLE9BQXRCO0FBQ0EsU0FBSyxVQUFMO0FBQ0EsUUFBSSxDQUFDLGFBQUwsRUFBb0I7QUFDbEIsV0FBSyxRQUFMO0FBQ0Q7QUFDRjs7QUFFRCxnQkFBYyxRQUFkLEVBQXdCLEdBQXhCLEVBQTZCO0FBQzNCLFFBQUksVUFBSjtBQUNBLGlCQUFhLElBQUksa0JBQUosQ0FBdUIsUUFBdkIsRUFBaUMsR0FBakMsQ0FBYjtBQUNBLFNBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixVQUF0QjtBQUNBLFdBQU8sVUFBUDtBQUNEOztBQUVELG1CQUFpQixPQUFqQixFQUEwQjtBQUN4QixTQUFLLEdBQUwsR0FBVyxFQUFYO0FBQ0EsU0FBSyxHQUFMLENBQVMsR0FBVCxHQUFlLEVBQUUsTUFBRixDQUFmO0FBQ0EsU0FBSyxHQUFMLENBQVMsR0FBVCxHQUFlLEVBQUUsUUFBRixDQUFmO0FBQ0EsU0FBSyxHQUFMLENBQVMsSUFBVCxHQUFnQixFQUFFLE1BQUYsQ0FBaEI7QUFDQSxTQUFLLEdBQUwsQ0FBUyxPQUFULEdBQW1CLEVBQUUsT0FBRixDQUFuQjtBQUNBO0FBQ0Q7O0FBRUQsYUFBVztBQUNULFFBQUksRUFBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixHQUFoQixLQUF1QixLQUFLLEdBQWhDO0FBQ0EsU0FBSyxHQUFMLENBQVMsUUFBVCxFQUFtQixNQUFuQjtBQUNBLFlBQVEsR0FBUixDQUFZLFlBQVosRUFBMEIsTUFBMUI7QUFDQTtBQUNBO0FBQ0E7QUFDRDs7QUFFRCxlQUFhO0FBQ1gsVUFBTSxRQUFRLE1BQU07QUFDbEIsVUFBSSxPQUFPLEtBQUssR0FBTCxDQUFTLEdBQVQsQ0FBYSxDQUFiLEVBQWdCLFdBQTNCO0FBQ0EsV0FBSyxZQUFMLENBQWtCLElBQWxCO0FBQ0EsNEJBQXNCLEtBQXRCO0FBQ0QsS0FKRDtBQUtBLDBCQUFzQixLQUF0QjtBQUNEOztBQUdELGVBQWEsSUFBYixFQUFtQjtBQUNqQixRQUFJLFdBQUo7QUFDQSxrQkFBYyxLQUFLLFdBQW5CO0FBQ0EsZ0JBQVksT0FBWixDQUFvQixjQUFjLFdBQVcsWUFBWCxDQUF3QixJQUF4QixDQUFsQztBQUNEOztBQUVELFdBQVM7QUFDUCxRQUFJLE1BQUo7QUFDQSxRQUFJLENBQUMsQ0FBTCxFQUFRO0FBQ04sWUFBTSx1QkFBTjtBQUNEO0FBQ0Y7O0FBRUQsbUJBQWlCLE9BQWpCLEVBQTBCO0FBQ3hCLFdBQU8sT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQjtBQUN2QixlQUFTLFdBRGM7QUFFdkIscUJBQWU7QUFGUSxLQUFsQixFQUdKLE9BSEksQ0FBUDtBQUlEOztBQXBFK0IsQ0FBbEM7OztBQ0pBLE1BQU0sa0JBQWtCLFFBQVEsbUJBQVIsQ0FBeEI7O0FBRUEsSUFBSSxDQUFKOztBQUVBLE9BQU8sT0FBUCxHQUFpQixNQUFNLGtCQUFOLENBQXlCOztBQUV4QyxjQUFZLFFBQVosRUFBc0IsT0FBdEIsRUFBK0I7QUFDN0IsVUFBTSxFQUFDLEdBQUQsRUFBTSxJQUFOLEVBQVksTUFBWixFQUFvQixNQUFwQixLQUE4QixLQUFLLGdCQUFMLENBQXNCLE9BQXRCLENBQXBDOztBQUVBLFNBQUssUUFBTCxHQUFnQixFQUFoQjs7QUFFQSxTQUFLLEdBQUwsR0FBVyxHQUFYO0FBQ0EsU0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLFNBQUssTUFBTCxHQUFjLE1BQWQ7QUFDQSxTQUFLLE1BQUwsR0FBYyxNQUFkOztBQUVBLFNBQUssTUFBTDtBQUNEOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxjQUFZLEdBQVosRUFBaUI7QUFDZixRQUFJLFNBQUosRUFBZSxHQUFmLEVBQW9CLE1BQXBCO0FBQ0EsZ0JBQVksT0FBTyxJQUFQLENBQVksR0FBWixDQUFaO0FBQ0EsY0FBVSxPQUFWLENBQWtCLFlBQVk7QUFDNUIsVUFBSSxVQUFVLElBQUksUUFBSixDQUFkO0FBQ0EsV0FBSyxVQUFMLENBQWdCLFFBQWhCLEVBQTBCLE9BQTFCO0FBQ0QsS0FIRDtBQUlBLFdBQU8sSUFBUDtBQUNEOztBQUVELGFBQVcsUUFBWCxFQUFxQixPQUFyQixFQUE4QjtBQUM1QixRQUFJLE9BQUo7QUFDQSxjQUFVLElBQUksZUFBSixDQUFvQixRQUFwQixFQUE4QixPQUE5QixDQUFWO0FBQ0EsU0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixPQUFuQjtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUVELGVBQWEsSUFBYixFQUFtQjtBQUNqQixRQUFJLFFBQUo7QUFDQSxlQUFXLEtBQUssUUFBaEI7QUFDQSxhQUFTLE9BQVQsQ0FBaUIsV0FBVyxRQUFRLFdBQVIsQ0FBb0IsSUFBcEIsQ0FBNUI7QUFDRDs7QUFFRCxXQUFTO0FBQ1AsUUFBSSxNQUFKO0FBQ0EsUUFBSSxDQUFDLENBQUwsRUFBUTtBQUNOLFlBQU0sdUJBQU47QUFDRDtBQUNGOztBQUVELG1CQUFpQixPQUFqQixFQUEwQjtBQUN4QixXQUFPLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0I7QUFDdkIsV0FBSyxFQUFDLE9BQU8sQ0FBUixFQURrQjtBQUV2QixZQUFNLEVBQUMsT0FBTyxLQUFSLEVBRmlCO0FBR3ZCLGNBQVEsRUFBQyxPQUFPLENBQUMsQ0FBVCxFQUhlO0FBSXZCLGNBQVE7QUFKZSxLQUFsQixFQUtKLE9BTEksQ0FBUDtBQU1EOztBQTlEdUMsQ0FBMUM7OztBQ0pBLE1BQU0sRUFBQyxNQUFELEVBQVMsTUFBVCxLQUFtQixRQUFRLFNBQVIsQ0FBekI7O0FBRUEsSUFBSSxDQUFKOztBQUVBLE9BQU8sT0FBUCxHQUFpQixNQUFNLGVBQU4sQ0FBc0I7O0FBRXJDLGNBQVksUUFBWixFQUFzQixPQUF0QixFQUErQjtBQUM3QixVQUFNLEVBQUMsR0FBRCxFQUFNLElBQU4sRUFBWSxNQUFaLEVBQW9CLEtBQXBCLEVBQTJCLE1BQTNCLEtBQXFDLEtBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsQ0FBM0M7O0FBRUEsU0FBSyxHQUFMO0FBQ0EsU0FBSyxNQUFMLEdBQWMsUUFBZDs7QUFFQSxTQUFLLEdBQUwsR0FBVyxHQUFYO0FBQ0EsU0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLFNBQUssTUFBTCxHQUFjLE1BQWQ7QUFDQSxTQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsU0FBSyxNQUFMLEdBQWMsTUFBZDs7QUFFQSxTQUFLLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDQTtBQUNBOztBQUVBLFNBQUssTUFBTDtBQUNBLFNBQUssWUFBTCxDQUFrQixRQUFsQixFQUE0QixFQUFDLE1BQUQsRUFBUyxHQUFULEVBQTVCO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsY0FBWSxJQUFaLEVBQWtCO0FBQ2hCLFFBQUksR0FBSixFQUFTLEtBQVQsRUFBZ0IsS0FBaEIsRUFBdUIsTUFBdkI7O0FBRUEsU0FBSyxhQUFMLENBQW1CLElBQW5CO0FBQ0EsYUFBUyxLQUFLLE1BQWQ7QUFDQSxVQUFNLEtBQUssR0FBWDtBQUNBLFlBQVEsS0FBSyxLQUFiOztBQUVBLFlBQVEsS0FBSyxLQUFMLENBQVcsT0FBSyxLQUFMLEdBQVcsR0FBdEIsSUFBNkIsR0FBckM7O0FBRUEsUUFBSSxDQUFKLEVBQU8sS0FBUCxDQUFhLE9BQU8sR0FBUCxHQUFhLFdBQTFCLElBQTBDLG9CQUFtQixLQUFNLCtCQUFuRTtBQUNBLFNBQUssUUFBTCxHQUFnQixJQUFoQjtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUVELGtCQUFnQixJQUFoQixFQUFzQixXQUF0QixFQUFtQyxRQUFuQyxFQUE2QztBQUMzQyxRQUFJLFFBQUosRUFBYyxhQUFkLEVBQTZCLEtBQTdCOztBQUVBLGVBQVcsS0FBSyxRQUFoQjtBQUNBLG9CQUFnQixXQUFXLElBQTNCO0FBQ0EsWUFBUSxnQkFBZ0IsT0FBTyxRQUF2QixHQUFrQyxXQUFXLElBQXJEO0FBQ0Esa0JBQWMsWUFBWSxHQUFaLENBQWdCLGNBQWMsU0FBUyxVQUFULEVBQXFCLEVBQXJCLENBQTlCLENBQWQ7O0FBRUEsU0FBSyxJQUFJLElBQUUsQ0FBWCxFQUFjLElBQUUsS0FBaEIsRUFBdUIsR0FBdkIsRUFBNEI7QUFDMUIsVUFBSSxHQUFKLEVBQVMsS0FBVDtBQUNBLFlBQU0sZ0JBQWdCLFdBQVcsQ0FBM0IsR0FBK0IsV0FBVyxDQUFoRDtBQUNBLGNBQVEsWUFBWSxPQUFaLENBQW9CLEdBQXBCLENBQVI7QUFDQSxVQUFJLFFBQVEsQ0FBQyxDQUFiLEVBQWdCO0FBQ2QsWUFBSSxJQUFJLGdCQUFnQixLQUFoQixHQUF3QixRQUFRLENBQXhDO0FBQ0EsaUJBQVMsSUFBVCxDQUFjLElBQWQsRUFBb0IsWUFBWSxDQUFaLENBQXBCLEVBQW9DLGFBQXBDO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPLElBQVA7QUFDRDs7QUFFRCxPQUFLLElBQUwsRUFBVyxRQUFYLEVBQXFCLFFBQXJCLEVBQStCO0FBQzdCLFFBQUksY0FBYyxPQUFPLElBQVAsQ0FBWSxLQUFLLFFBQUwsRUFBZSxXQUEzQixDQUFsQjtBQUNBLFNBQUssZUFBTCxDQUFxQixJQUFyQixFQUEyQixXQUEzQixFQUF3QyxDQUFDLFVBQUQsRUFBYSxhQUFiLEtBQStCO0FBQ3JFLFVBQUksUUFBUSxLQUFLLFFBQUwsRUFBZSxXQUFmLENBQTJCLFVBQTNCLENBQVo7QUFDQSxlQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW9CLEtBQXBCLEVBQTJCLFVBQTNCLEVBQXVDLGFBQXZDO0FBQ0QsS0FIRDtBQUlEOztBQUVELFdBQVMsSUFBVCxFQUFlO0FBQ2IsU0FBSyxJQUFMLENBQVUsSUFBVixFQUFnQixNQUFoQixFQUF5QixLQUFELElBQVc7QUFDakMsV0FBSyxHQUFMLENBQVMsR0FBVCxDQUFhLFNBQWIsRUFBd0IsUUFBUSxNQUFSLEdBQWlCLE9BQXpDO0FBQ0QsS0FGRDtBQUdEOztBQUVELFVBQVEsSUFBUixFQUFjO0FBQ1osU0FBSyxJQUFMLENBQVUsSUFBVixFQUFnQixLQUFoQixFQUF3QixLQUFELElBQVc7QUFDaEMsV0FBSyxHQUFMLENBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0IsS0FBcEI7QUFDRCxLQUZEO0FBR0Q7O0FBRUQsZ0JBQWMsSUFBZCxFQUFvQjtBQUNsQixTQUFLLFFBQUwsQ0FBYyxJQUFkO0FBQ0EsU0FBSyxPQUFMLENBQWEsSUFBYjtBQUNBO0FBQ0Q7O0FBRUQ7Ozs7O0FBS0EsZUFBYSxRQUFiLEVBQXVCLE9BQXZCLEVBQWdDO0FBQzlCLFFBQUksR0FBSixFQUFTLEdBQVQ7QUFDQSxRQUFJLEVBQUMsTUFBRCxFQUFTLEdBQVQsS0FBZ0IsT0FBcEI7QUFDQSxVQUFNO0FBQ0osa0JBQVksT0FEUjtBQUVKLGNBQVEsQ0FGSjtBQUdKLGVBQVM7QUFITCxLQUFOO0FBS0EsUUFBSSxNQUFKLEVBQVk7QUFDVixVQUFJLGNBQUosSUFBc0IsTUFBdEI7QUFDQSxVQUFJLGFBQUosSUFBcUIsTUFBckI7QUFDRDtBQUNELFFBQUksR0FBSixFQUFTO0FBQ1AsVUFBSSxHQUFKLEdBQVUsR0FBVjtBQUNEO0FBQ0QsVUFBTSxFQUFFLFFBQUYsQ0FBTjtBQUNBLFFBQUksR0FBSixDQUFRLEdBQVI7QUFDQSxTQUFLLEdBQUwsR0FBVyxHQUFYO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsV0FBUztBQUNQLFFBQUksTUFBSjtBQUNBLFFBQUksQ0FBQyxDQUFMLEVBQVE7QUFDTixZQUFNLHVCQUFOO0FBQ0Q7QUFDRCxXQUFPLElBQVA7QUFDRDs7QUFFRCxtQkFBaUIsT0FBakIsRUFBMEI7QUFDeEIsUUFBSSxRQUFKLEVBQWMsSUFBZDtBQUNBLGVBQVc7QUFDVCxXQUFLLEVBQUMsT0FBTyxDQUFSLEVBREk7QUFFVCxZQUFNLEVBQUMsT0FBTyxLQUFSLEVBRkc7QUFHVCxjQUFRLEVBQUMsT0FBTyxDQUFDLENBQVQsRUFIQztBQUlULGFBQU8sRUFBQyxPQUFPLENBQVIsRUFKRTtBQUtULGNBQVEsRUFBQyxPQUFPLEtBQVI7QUFMQyxLQUFYO0FBT0EsV0FBTyxPQUFPLElBQVAsQ0FBWSxPQUFaLENBQVA7QUFDQSxTQUFLLE9BQUwsQ0FBYSxPQUFPO0FBQ2xCLFVBQUksS0FBSixFQUFXLFFBQVg7QUFDQSxjQUFRLFFBQVEsR0FBUixDQUFSO0FBQ0EsaUJBQVcsT0FBTyxLQUFQLEVBQWMsUUFBZCxDQUFYO0FBQ0EsVUFBSSxRQUFKLEVBQWM7QUFDWixZQUFJLFNBQVMsU0FBUyxNQUFNLEdBQU4sQ0FBVCxHQUFzQixNQUFNLEdBQU4sQ0FBdEIsR0FBbUMsU0FBUyxHQUFULEVBQWMsS0FBOUQ7QUFDQSxnQkFBUSxHQUFSLElBQWU7QUFDYixpQkFBTyxNQURNO0FBRWIsdUJBQWEsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixFQUFDLEdBQUcsTUFBSixFQUFsQixFQUErQixLQUEvQjtBQUZBLFNBQWY7QUFJRCxPQU5ELE1BT0s7QUFDSCxnQkFBUSxHQUFSLElBQWU7QUFDYixlQURhO0FBRWIsdUJBQWEsRUFBQyxHQUFHLEtBQUo7QUFGQSxTQUFmO0FBSUQ7QUFDRixLQWpCRDs7QUFtQkEsY0FBVSxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLFFBQWxCLEVBQTRCLE9BQTVCLENBQVY7O0FBRUEsV0FBTyxPQUFQO0FBQ0Q7O0FBcEtvQyxDQUF2Qzs7O0FDSkEsT0FBTyxPQUFQLEdBQWlCLFFBQVEsZUFBUixDQUFqQjs7O0FDQUEsTUFBTSxPQUFPLE9BQU8sT0FBcEI7O0FBRUE7Ozs7Ozs7O0FBUUEsS0FBSyxNQUFMLEdBQWMsQ0FBQyxLQUFELEVBQVEsSUFBUixLQUFpQjtBQUM3QixVQUFRLElBQVI7QUFDRSxTQUFLLFFBQUw7QUFDRSxhQUFPLE9BQU8sS0FBUCxLQUFpQixRQUF4QjtBQUNGLFNBQUssUUFBTDtBQUNFLGFBQU8sT0FBTyxLQUFQLEtBQWlCLFFBQWpCLElBQTZCLE9BQU8sS0FBUCxDQUFhLEtBQWIsTUFBd0IsS0FBNUQ7QUFDRixTQUFLLFNBQUw7QUFDRSxhQUFPLFVBQVUsSUFBVixJQUFrQixVQUFVLEtBQW5DO0FBQ0YsU0FBSyxPQUFMO0FBQ0UsYUFBTyxNQUFNLE9BQU4sQ0FBYyxLQUFkLENBQVA7QUFDRixTQUFLLFFBQUw7QUFDRSxhQUFPLE9BQU8sS0FBUCxLQUFpQixRQUFqQixJQUE2QixVQUFVLElBQXZDLElBQStDLE1BQU0sT0FBTixDQUFjLEtBQWQsTUFBeUIsS0FBL0U7QUFDRixTQUFLLE1BQUw7QUFDRSxhQUFPLFVBQVUsSUFBakI7QUFDRixTQUFLLFdBQUw7QUFDRSxhQUFPLFVBQVUsU0FBakI7QUFDRixTQUFLLFVBQUw7QUFDRSxhQUFPLE9BQU8sU0FBUCxDQUFpQixRQUFqQixDQUEwQixJQUExQixDQUErQixLQUEvQixNQUEwQyxtQkFBakQ7QUFDRixTQUFLLFFBQUw7QUFDRSxhQUFPLE9BQU8sS0FBUCxLQUFpQixRQUF4QjtBQUNGLFNBQUssS0FBTDtBQUNFLGFBQU8sT0FBTyxLQUFQLENBQWEsS0FBYixDQUFQO0FBQ0YsU0FBSyxNQUFMO0FBQ0UsYUFBTyxpQkFBaUIsSUFBeEI7QUFDRjtBQUNFLFlBQU0sSUFBSSxLQUFKLENBQVcsdUJBQXNCLElBQUssR0FBdEMsQ0FBTjtBQXhCSjtBQTBCRCxDQTNCRDs7QUE2QkEsS0FBSyxNQUFMLEdBQWMsTUFBTTtBQUNsQixNQUFJLE1BQUo7QUFDQSxXQUFTLE9BQU8sZ0JBQVAsQ0FBd0IsU0FBUyxlQUFqQyxFQUFrRCxFQUFsRCxDQUFULEVBQ0UsTUFBTSxDQUFDLE1BQU0sU0FBTixDQUFnQixLQUFoQixDQUNKLElBREksQ0FDQyxNQURELEVBRUosSUFGSSxDQUVDLEVBRkQsRUFHSixLQUhJLENBR0UsbUJBSEYsS0FHMkIsT0FBTyxLQUFQLEtBQWlCLEVBQWpCLElBQXVCLENBQUMsRUFBRCxFQUFLLEdBQUwsQ0FIbkQsRUFJSixDQUpJLENBRFIsRUFNRSxNQUFPLGlCQUFELENBQW9CLEtBQXBCLENBQTBCLElBQUksTUFBSixDQUFXLE1BQU0sR0FBTixHQUFZLEdBQXZCLEVBQTRCLEdBQTVCLENBQTFCLEVBQTRELENBQTVELENBTlI7QUFPRSxTQUFPO0FBQ0wsU0FBSyxHQURBO0FBRUwsZUFBVyxHQUZOO0FBR0wsU0FBSyxNQUFNLEdBQU4sR0FBWSxHQUhaO0FBSUwsUUFBSSxJQUFJLENBQUosRUFBTyxXQUFQLEtBQXVCLElBQUksTUFBSixDQUFXLENBQVg7QUFKdEIsR0FBUDtBQU1ILENBZkQ7O0FBaUJBO0FBQ0EsS0FBSyxRQUFMLEdBQWdCLENBQUMsSUFBRCxFQUFPLFNBQVAsRUFBa0IsUUFBbEIsS0FBK0I7QUFDN0MsTUFBSSxPQUFKO0FBQ0EsU0FBTyxTQUFTLFNBQVQsR0FBc0I7QUFDM0IsUUFBSSxNQUFNLElBQVY7QUFBQSxRQUFnQixPQUFPLFNBQXZCO0FBQ0EsYUFBUyxPQUFULEdBQW9CO0FBQ2xCLFVBQUksQ0FBQyxRQUFMLEVBQWUsS0FBSyxLQUFMLENBQVcsR0FBWCxFQUFnQixJQUFoQjtBQUNmLGdCQUFVLElBQVY7QUFDRDtBQUNELFFBQUksT0FBSixFQUFhO0FBQ1gsbUJBQWEsT0FBYjtBQUNELEtBRkQsTUFHSyxJQUFJLFFBQUosRUFBYztBQUNqQixXQUFLLEtBQUwsQ0FBVyxHQUFYLEVBQWdCLElBQWhCO0FBQ0Q7QUFDRCxjQUFVLFdBQVcsT0FBWCxFQUFvQixhQUFhLEdBQWpDLENBQVY7QUFDRCxHQWJEO0FBY0QsQ0FoQkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgUGFyYWxsYXhCcm8gPSByZXF1aXJlKCcuLi9saWInKTtcblxuY29uc3QgbGF4YnJvID0gbmV3IFBhcmFsbGF4QnJvKCk7XG5cbnZhciBwYWdlMSwgcGFnZTI7XG5cbnBhZ2UxID0gbGF4YnJvLmFkZENvbGxlY3Rpb24oJyNjb2xsZWN0aW9uMScsIHtcbiAgdG9wOiA1MCxcbiAgaGlkZTogZmFsc2UsXG4gIGNlbnRlcjogdHJ1ZSxcbn0pO1xuXG5wYWdlMS5hZGRFbGVtZW50cyh7XG4gICcjaW1nMSc6IHtcbiAgICB0b3A6IHtcbiAgICAgIDEwMDogMTAwLFxuICAgIH0sXG4gICAgLy8gc3BlZWQ6IHtcbiAgICAvLyAgIDA6IDEsXG4gICAgLy8gICAyMDA6IC41LFxuICAgIC8vICAgMzAwOiAwLFxuICAgIC8vICAgNDAwOiAtMSxcbiAgICAvLyB9LFxuICAgIGNlbnRlcjogdHJ1ZSxcbiAgICBoaWRlOiB7XG4gICAgICAxMDA6IGZhbHNlLFxuICAgICAgMzAwOiB0cnVlLFxuICAgIH1cbiAgfSxcbiAgLy8gJyNpbWcyJzoge1xuICAvLyAgIGhpZGU6IHRydWUsXG4gIC8vICAgdG9wOiA4MDAsXG4gIC8vICAgekluZGV4OiAwLFxuICAvLyAgIHNwZWVkOiAuMSxcbiAgLy8gICB1cGRhdGU6IHtcbiAgLy8gICAgIDA6ICgpID0+IHtcbiAgLy8gICAgICAgdGhpcy5lbC5mYWRlSW4oKTtcbiAgLy8gICAgIH0sXG4gIC8vICAgICA0MDA6ICgpID0+IHtcbiAgLy8gICAgICAgdGhpcy5lbC5mYWRlT3V0KCk7XG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyB9XG59KTtcbiIsImNvbnN0IFBhcmFsbGF4Q29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vUGFyYWxsYXhDb2xsZWN0aW9uJyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsYXhCcm8ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBjb25zdCB7d3JhcHBlciwgZGlzYWJsZVN0eWxlc30gPSB0aGlzLm5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbGxlY3Rpb25zID0gW107XG5cbiAgICB0aGlzLmpRdWVyeSgpO1xuICAgIHRoaXMuY2FjaGVET01FbGVtZW50cyh3cmFwcGVyKTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICBpZiAoIWRpc2FibGVTdHlsZXMpIHtcbiAgICAgIHRoaXMuc3R5bGVET00oKTtcbiAgICB9XG4gIH1cblxuICBhZGRDb2xsZWN0aW9uKHNlbGVjdG9yLCBvYmopIHtcbiAgICB2YXIgY29sbGVjdGlvbjtcbiAgICBjb2xsZWN0aW9uID0gbmV3IFBhcmFsbGF4Q29sbGVjdGlvbihzZWxlY3Rvciwgb2JqKTtcbiAgICB0aGlzLmNvbGxlY3Rpb25zLnB1c2goY29sbGVjdGlvbik7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cblxuICBjYWNoZURPTUVsZW1lbnRzKHdyYXBwZXIpIHtcbiAgICB0aGlzLiRlbCA9IHt9O1xuICAgIHRoaXMuJGVsLndpbiA9ICQod2luZG93KTtcbiAgICB0aGlzLiRlbC5kb2MgPSAkKGRvY3VtZW50KTtcbiAgICB0aGlzLiRlbC5ib2R5ID0gJCgnYm9keScpO1xuICAgIHRoaXMuJGVsLndyYXBwZXIgPSAkKHdyYXBwZXIpO1xuICAgIC8vIHRoaXMuJGVsLmJvZHlIdG1sID0gJCgnYm9keSwgaHRtbCcpO1xuICB9XG5cbiAgc3R5bGVET00oKSB7XG4gICAgdmFyIHtib2R5LCB3cmFwcGVyLCBkb2N9ID0gdGhpcy4kZWw7XG4gICAgYm9keS5jc3MoJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgd3JhcHBlci5jc3MoJ21pbi1oZWlnaHQnLCAnMTAwJScpO1xuICAgIC8vIGRvYy5jaGlsZHJlbigpXG4gICAgLy8gICAuY3NzKCdoZWlnaHQnLCAnMTAwJScpXG4gICAgLy8gICAuYWRkQ2xhc3MoJ3BhcmFsbGF4Jyk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IHRyYWNrID0gKCkgPT4ge1xuICAgICAgdmFyIHBvc1kgPSB0aGlzLiRlbC53aW5bMF0ucGFnZVlPZmZzZXQ7XG4gICAgICB0aGlzLm1vdmVFbGVtZW50cyhwb3NZKTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0cmFjayk7XG4gICAgfVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0cmFjayk7XG4gIH1cblxuXG4gIG1vdmVFbGVtZW50cyhwb3NZKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25zO1xuICAgIGNvbGxlY3Rpb25zID0gdGhpcy5jb2xsZWN0aW9ucztcbiAgICBjb2xsZWN0aW9ucy5mb3JFYWNoKGNvbGxlY3Rpb24gPT4gY29sbGVjdGlvbi5tb3ZlRWxlbWVudHMocG9zWSkpO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gIH1cblxuICBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgd3JhcHBlcjogJyNwYXJhbGxheCcsXG4gICAgICBkaXNhYmxlU3R5bGVzOiBmYWxzZSxcbiAgICB9LCBvcHRpb25zKTtcbiAgfVxuXG59XG4iLCJjb25zdCBQYXJhbGxheEVsZW1lbnQgPSByZXF1aXJlKCcuL1BhcmFsbGF4RWxlbWVudCcpO1xuXG52YXIgJDtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYXJhbGxheENvbGxlY3Rpb24ge1xuXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgY29uc3Qge3RvcCwgaGlkZSwgekluZGV4LCBjZW50ZXJ9ID0gdGhpcy5ub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgdGhpcy5lbGVtZW50cyA9IFtdO1xuXG4gICAgdGhpcy50b3AgPSB0b3A7XG4gICAgdGhpcy5oaWRlID0gaGlkZTtcbiAgICB0aGlzLnpJbmRleCA9IHpJbmRleDtcbiAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gIH1cblxuICAvLyBzZXQgaGlkZSh2YWx1ZSkge1xuICAvLyAgIHZhciBwcm9wZXJ0eTtcbiAgLy8gICBwcm9wZXJ0eSA9IHZhbHVlID8gJ25vbmUnIDogJ2Jsb2NrJztcbiAgLy8gICBpZiAodGhpcy4kZWwpIHRoaXMuJGVsLmNzcygnZGlzcGxheScsIHByb3BlcnR5KTtcbiAgLy8gfVxuICAvL1xuICAvLyBzZXQgekluZGV4KHZhbHVlKSB7XG4gIC8vICAgaWYgKHRoaXMuJGVsKSB0aGlzLiRlbC5jc3MoJ3pJbmRleCcsIHZhbHVlKTtcbiAgLy8gfVxuXG4gIGFkZEVsZW1lbnRzKG9iaikge1xuICAgIHZhciBzZWxlY3RvcnMsIHRvcCwgY2VudGVyO1xuICAgIHNlbGVjdG9ycyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgc2VsZWN0b3JzLmZvckVhY2goc2VsZWN0b3IgPT4ge1xuICAgICAgdmFyIG9wdGlvbnMgPSBvYmpbc2VsZWN0b3JdO1xuICAgICAgdGhpcy5hZGRFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZEVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgZWxlbWVudDtcbiAgICBlbGVtZW50ID0gbmV3IFBhcmFsbGF4RWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgdGhpcy5lbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbW92ZUVsZW1lbnRzKHBvc1kpIHtcbiAgICB2YXIgZWxlbWVudHM7XG4gICAgZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzO1xuICAgIGVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiBlbGVtZW50Lm1vdmVFbGVtZW50KHBvc1kpKTtcbiAgfVxuXG4gIGpRdWVyeSgpIHtcbiAgICAkID0galF1ZXJ5O1xuICAgIGlmICghJCkge1xuICAgICAgdGhyb3cgJ2pRdWVyeSBpcyBub3QgZGVmaW5lZCc7XG4gICAgfVxuICB9XG5cbiAgbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgIHRvcDoge3ZhbHVlOiAwfSxcbiAgICAgIGhpZGU6IHt2YWx1ZTogZmFsc2V9LFxuICAgICAgekluZGV4OiB7dmFsdWU6IC0xfSxcbiAgICAgIGNlbnRlcjogZmFsc2UsXG4gICAgfSwgb3B0aW9ucyk7XG4gIH1cblxufVxuIiwiY29uc3Qge3ByZWZpeCwgaXNUeXBlfSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxsYXhFbGVtZW50IHtcblxuICBjb25zdHJ1Y3RvcihzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIGNvbnN0IHt0b3AsIGhpZGUsIHpJbmRleCwgc3BlZWQsIGNlbnRlcn0gPSB0aGlzLm5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICB0aGlzLiRlbDtcbiAgICB0aGlzLnByZWZpeCA9IHByZWZpeCgpO1xuXG4gICAgdGhpcy50b3AgPSB0b3A7XG4gICAgdGhpcy5oaWRlID0gaGlkZTtcbiAgICB0aGlzLnpJbmRleCA9IHpJbmRleDtcbiAgICB0aGlzLnNwZWVkID0gc3BlZWQ7XG4gICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XG5cbiAgICB0aGlzLnByZXZQb3NZID0gMDtcbiAgICAvLyB0aGlzLmRlbHRhICA9IDA7XG4gICAgLy8gdGhpcy51cGRhdGUgPSB7fTtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5zdHlsZUVsZW1lbnQoc2VsZWN0b3IsIHtjZW50ZXIsIHRvcH0pO1xuICB9XG5cbiAgLy8gc2V0IGhpZGUodmFsdWUpIHtcbiAgLy8gICB2YXIgcHJvcGVydHk7XG4gIC8vICAgcHJvcGVydHkgPSB2YWx1ZSA/ICdibG9jaycgOiAnbm9uZSc7XG4gIC8vICAgaWYgKHRoaXMuJGVsKSB0aGlzLiRlbC5jc3MoJ2Rpc3BsYXknLCBwcm9wZXJ0eSk7XG4gIC8vIH1cbiAgLy9cbiAgLy8gc2V0IHpJbmRleCh2YWx1ZSkge1xuICAvLyAgIGlmICh0aGlzLiRlbCkgdGhpcy4kZWwuY3NzKCd6SW5kZXgnLCB2YWx1ZSk7XG4gIC8vIH1cbiAgLy9cbiAgLy8gc2V0IHRvcCh2YWx1ZSkge1xuICAvLyAgIGlmICh0aGlzLiRlbCkgdGhpcy4kZWwuY3NzKCd0b3AnLCB2YWx1ZSsncHgnKTtcbiAgLy8gfVxuXG4gIG1vdmVFbGVtZW50KHBvc1kpIHtcbiAgICB2YXIgJGVsLCBzcGVlZCwgZGVsdGEsIHByZWZpeDtcblxuICAgIHRoaXMuZXhlY0NhbGxiYWNrcyhwb3NZKTtcbiAgICBwcmVmaXggPSB0aGlzLnByZWZpeDtcbiAgICAkZWwgPSB0aGlzLiRlbDtcbiAgICBzcGVlZCA9IHRoaXMuc3BlZWQ7XG5cbiAgICBkZWx0YSA9IE1hdGgucm91bmQocG9zWSpzcGVlZCoxMDApIC8gMTAwO1xuXG4gICAgJGVsWzBdLnN0eWxlW3ByZWZpeC5kb20gKyAnVHJhbnNmb3JtJ10gPSBgdHJhbnNsYXRlM2QoMHB4LCAke2RlbHRhfXB4LCAwKSB0cmFuc2xhdGVaKDApIHNjYWxlKDEpYDtcbiAgICB0aGlzLnByZXZQb3NZID0gcG9zWTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNhbGxCcmVha3BvaW50cyhwb3NZLCBicmVha3BvaW50cywgY2FsbGJhY2spIHtcbiAgICB2YXIgcHJldlBvc1ksIHNjcm9sbGluZ0Rvd24sIHlEaWZmO1xuXG4gICAgcHJldlBvc1kgPSB0aGlzLnByZXZQb3NZO1xuICAgIHNjcm9sbGluZ0Rvd24gPSBwcmV2UG9zWSA8IHBvc1k7XG4gICAgeURpZmYgPSBzY3JvbGxpbmdEb3duID8gcG9zWSAtIHByZXZQb3NZIDogcHJldlBvc1kgLSBwb3NZO1xuICAgIGJyZWFrcG9pbnRzID0gYnJlYWtwb2ludHMubWFwKGJyZWFrcG9pbnQgPT4gcGFyc2VJbnQoYnJlYWtwb2ludCwgMTApKTtcblxuICAgIGZvciAobGV0IGk9MDsgaTx5RGlmZjsgaSsrKSB7XG4gICAgICBsZXQgcG9zLCBpbmRleDtcbiAgICAgIHBvcyA9IHNjcm9sbGluZ0Rvd24gPyBwcmV2UG9zWSArIGkgOiBwcmV2UG9zWSAtIGk7XG4gICAgICBpbmRleCA9IGJyZWFrcG9pbnRzLmluZGV4T2YocG9zKTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIGxldCBpID0gc2Nyb2xsaW5nRG93biA/IGluZGV4IDogaW5kZXggLSAxO1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIGJyZWFrcG9pbnRzW2ldLCBzY3JvbGxpbmdEb3duKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGV4ZWMocG9zWSwgcHJvcGVydHksIGNhbGxiYWNrKSB7XG4gICAgdmFyIGJyZWFrcG9pbnRzID0gT2JqZWN0LmtleXModGhpc1twcm9wZXJ0eV0uYnJlYWtwb2ludHMpO1xuICAgIHRoaXMuY2FsbEJyZWFrcG9pbnRzKHBvc1ksIGJyZWFrcG9pbnRzLCAoYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93bikgPT4ge1xuICAgICAgdmFyIHZhbHVlID0gdGhpc1twcm9wZXJ0eV0uYnJlYWtwb2ludHNbYnJlYWtwb2ludF07XG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIHZhbHVlLCBicmVha3BvaW50LCBzY3JvbGxpbmdEb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4ZWNIaWRlKHBvc1kpIHtcbiAgICB0aGlzLmV4ZWMocG9zWSwgJ2hpZGUnLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuJGVsLmNzcygnZGlzcGxheScsIHZhbHVlID8gJ25vbmUnIDogJ2Jsb2NrJyk7XG4gICAgfSk7XG4gIH1cblxuICBleGVjVG9wKHBvc1kpIHtcbiAgICB0aGlzLmV4ZWMocG9zWSwgJ3RvcCcsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy4kZWwuY3NzKCd0b3AnLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBleGVjQ2FsbGJhY2tzKHBvc1kpIHtcbiAgICB0aGlzLmV4ZWNIaWRlKHBvc1kpO1xuICAgIHRoaXMuZXhlY1RvcChwb3NZKTtcbiAgICAvLyB0aGlzLmV4ZWNTcGVlZChwb3NZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBwYXJhbGxheCBzcGVjaWZpYyBzdHlsaW5nIHRvIGVhY2ggZWxlbWVudCBpbiBhIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSAge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBzdHlsZUVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgJGVsLCBjc3M7XG4gICAgdmFyIHtjZW50ZXIsIHRvcH0gPSBvcHRpb25zO1xuICAgIGNzcyA9IHtcbiAgICAgICdwb3NpdGlvbic6ICdmaXhlZCcsXG4gICAgICAnbGVmdCc6IDAsXG4gICAgICAncmlnaHQnOiAwLFxuICAgIH07XG4gICAgaWYgKGNlbnRlcikge1xuICAgICAgY3NzWydtYXJnaW4tcmlnaHQnXSA9ICdhdXRvJztcbiAgICAgIGNzc1snbWFyZ2luLWxlZnQnXSA9ICdhdXRvJztcbiAgICB9XG4gICAgaWYgKHRvcCkge1xuICAgICAgY3NzLnRvcCA9IHRvcDtcbiAgICB9XG4gICAgJGVsID0gJChzZWxlY3Rvcik7XG4gICAgJGVsLmNzcyhjc3MpO1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMsIGtleXM7XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICB0b3A6IHt2YWx1ZTogMH0sXG4gICAgICBoaWRlOiB7dmFsdWU6IGZhbHNlfSxcbiAgICAgIHpJbmRleDoge3ZhbHVlOiAtMX0sXG4gICAgICBzcGVlZDoge3ZhbHVlOiAxfSxcbiAgICAgIGNlbnRlcjoge3ZhbHVlOiBmYWxzZX0sXG4gICAgfTtcbiAgICBrZXlzID0gT2JqZWN0LmtleXMob3B0aW9ucyk7XG4gICAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICB2YXIgdmFsdWUsIGlzT2JqZWN0O1xuICAgICAgdmFsdWUgPSBvcHRpb25zW2tleV07XG4gICAgICBpc09iamVjdCA9IGlzVHlwZSh2YWx1ZSwgJ29iamVjdCcpO1xuICAgICAgaWYgKGlzT2JqZWN0KSB7XG4gICAgICAgIGxldCB2YWx1ZTEgPSB2YWx1ZSAmJiB2YWx1ZVsnMCddID8gdmFsdWVbJzAnXSA6IGRlZmF1bHRzW2tleV0udmFsdWU7XG4gICAgICAgIG9wdGlvbnNba2V5XSA9IHtcbiAgICAgICAgICB2YWx1ZTogdmFsdWUxLFxuICAgICAgICAgIGJyZWFrcG9pbnRzOiBPYmplY3QuYXNzaWduKHt9LCB7MDogdmFsdWUxfSwgdmFsdWUpLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgb3B0aW9uc1trZXldID0ge1xuICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgIGJyZWFrcG9pbnRzOiB7MDogdmFsdWV9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbiAgfVxuXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vUGFyYWxsYXhCcm8nKTtcbiIsImNvbnN0IHNlbGYgPSBtb2R1bGUuZXhwb3J0cztcblxuLyoqXG4gKiBHaXZlbiBhIE1peGVkIHZhbHVlIHR5cGUgY2hlY2suXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljLlxuICogQHRlc3RzIHVuaXQuXG4gKi9cbnNlbGYuaXNUeXBlID0gKHZhbHVlLCB0eXBlKSA9PiB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzTmFOKHZhbHVlKSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09IGZhbHNlO1xuICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKTtcbiAgICBjYXNlICdvYmplY3QnOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkgPT09IGZhbHNlO1xuICAgIGNhc2UgJ251bGwnOlxuICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsO1xuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZDtcbiAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCc7XG4gICAgY2FzZSAnTmFOJzpcbiAgICAgIHJldHVybiBOdW1iZXIuaXNOYU4odmFsdWUpO1xuICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnJlY2dvbml6ZWQgdHlwZTogXCIke3R5cGV9XCJgKTtcbiAgfVxufTtcblxuc2VsZi5wcmVmaXggPSAoKSA9PiB7XG4gIHZhciBzdHlsZXM7XG4gIHN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgJycpLFxuICAgIHByZSA9IChBcnJheS5wcm90b3R5cGUuc2xpY2VcbiAgICAgIC5jYWxsKHN0eWxlcylcbiAgICAgIC5qb2luKCcnKVxuICAgICAgLm1hdGNoKC8tKG1venx3ZWJraXR8bXMpLS8pIHx8IChzdHlsZXMuT0xpbmsgPT09ICcnICYmIFsnJywgJ28nXSlcbiAgICApWzFdLFxuICAgIGRvbSA9ICgnd2Via2l0fE1venxNU3xPJykubWF0Y2gobmV3IFJlZ0V4cCgnKCcgKyBwcmUgKyAnKScsICdpJykpWzFdO1xuICAgIHJldHVybiB7XG4gICAgICBkb206IGRvbSxcbiAgICAgIGxvd2VyY2FzZTogcHJlLFxuICAgICAgY3NzOiAnLScgKyBwcmUgKyAnLScsXG4gICAgICBqczogcHJlWzBdLnRvVXBwZXJDYXNlKCkgKyBwcmUuc3Vic3RyKDEpXG4gICAgfTtcbn07XG5cbi8vIGh0dHA6Ly91bnNjcmlwdGFibGUuY29tLzIwMDkvMDMvMjAvZGVib3VuY2luZy1qYXZhc2NyaXB0LW1ldGhvZHMvXG5zZWxmLmRlYm91bmNlID0gKGZ1bmMsIHRocmVzaG9sZCwgZXhlY0FzYXApID0+IHtcbiAgdmFyIHRpbWVvdXQ7XG4gIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQgKCkge1xuICAgIHZhciBvYmogPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuICAgIGZ1bmN0aW9uIGRlbGF5ZWQgKCkge1xuICAgICAgaWYgKCFleGVjQXNhcCkgZnVuYy5hcHBseShvYmosIGFyZ3MpO1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGV4ZWNBc2FwKSB7XG4gICAgICBmdW5jLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgfVxuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHRocmVzaG9sZCB8fCAxMDApO1xuICB9O1xufTtcbiJdfQ==
