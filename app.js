(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const ParallaxBro = require('../lib');

const laxbro = new ParallaxBro();

var page1, page2;

page1 = laxbro.addCollection('#collection1', {
  top: 200,
  hide: false,
  center: true
});

page1.addElements({
  '#img1': {
    top: {
      100: 100
    },
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
  }

  styleDOM() {
    var { body, wrapper, doc } = this.$el;
    body.css('height', '100%');
    wrapper.css('min-height', '100%');
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
const { normalizeOptions, runUpdate } = require('./utils');
const ParallaxElement = require('./ParallaxElement');

var $;

module.exports = class ParallaxCollection {

  constructor(selector, options) {
    const { top, hide, zIndex, center } = normalizeOptions(options, {
      top: { value: 0 },
      hide: { value: false },
      zIndex: { value: -1 },
      center: { value: false }
    });

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

  hide(value) {
    this.hide.value = value;
    this.$el.css('display', value ? 'none' : 'block');
  }

  zIndex(value) {
    this.zIndex.value = value;
    this.$el.css('zIndex', value);
  }

  top(value) {
    var top;
    this.top.value = value;
    this.$el.children().css('top', value + 'px');
  }

  center(value) {
    this.center.value = value;
    this.$el.children().css({
      'margin-right': 'auto',
      'margin-left': 'auto'
    });
  }

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
    this.updateZindex(posY);
    this.updateCenter(posY);
  }

  updateHide(posY) {
    var prevY = this.prevPosY;
    runUpdate(posY, prevY, this.hide, value => {
      this.$el.css('display', value ? 'none' : 'block');
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
    if (center) {
      css['margin-right'] = 'auto';
      css['margin-left'] = 'auto';
    }
    if (hide) {
      css.display = 'none';
    }
    if (zIndex) {
      css.zIndex = zIndex;
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
    const { top, hide, zIndex, speed, center } = normalizeOptions(options, {
      top: { value: 0 },
      hide: { value: false },
      zIndex: { value: -1 },
      speed: { value: 1 },
      center: { value: false }
    });

    this.$el;
    this.prefix = prefix();
    this.offsetTop = offsetTop;
    this.yOffset = offsetTop.value;
    this.prevPosY;

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

  hide(value) {
    this.hide.value = value;
    this.$el.css('display', value ? 'none' : 'block');
  }

  zIndex(value) {
    this.zIndex.value = value;
    this.$el.css('zIndex', value);
  }

  top(value) {
    this.top.value = value;
    this.$el.css('top', value + 'px');
  }

  center(value) {
    this.center.value = value;
    this.$el.css({
      'margin-right': 'auto',
      'margin-left': 'auto'
    });
  }

  moveElement(posY) {
    var $el, speed, delta, prefix;

    this.runCallbacks(posY);
    prefix = this.prefix;
    $el = this.$el;
    speed = this.speed;

    delta = Math.round(posY * speed * 100) / 100;

    $el[0].style[prefix.dom + 'Transform'] = `translate3d(0px, ${delta}px, 0) translateZ(0) scale(1)`;
    this.prevPosY = posY;
    return this;
  }

  runCallbacks(posY) {
    this.updateHide(posY);
    this.updateTop(posY);
    this.updateOffset(posY);
    // this.execSpeed(posY);
  }

  updateOffset(posY) {
    var prevY = this.prevPosY;
    runUpdate(posY, prevY, this.offsetTop, value => {
      this.offsetY = value;
    });
  }

  updateHide(posY) {
    var prevY = this.prevPosY;
    runUpdate(posY, prevY, this.hide, value => {
      this.$el.css('display', value ? 'none' : 'block');
    });
  }

  updateTop(posY) {
    var prevY = this.prevPosY;
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmpzIiwibGliL1BhcmFsbGF4QnJvLmpzIiwibGliL1BhcmFsbGF4Q29sbGVjdGlvbi5qcyIsImxpYi9QYXJhbGxheEVsZW1lbnQuanMiLCJsaWIvaW5kZXguanMiLCJsaWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxNQUFNLGNBQWMsUUFBUSxRQUFSLENBQXBCOztBQUVBLE1BQU0sU0FBUyxJQUFJLFdBQUosRUFBZjs7QUFFQSxJQUFJLEtBQUosRUFBVyxLQUFYOztBQUVBLFFBQVEsT0FBTyxhQUFQLENBQXFCLGNBQXJCLEVBQXFDO0FBQzNDLE9BQUssR0FEc0M7QUFFM0MsUUFBTSxLQUZxQztBQUczQyxVQUFRO0FBSG1DLENBQXJDLENBQVI7O0FBTUEsTUFBTSxXQUFOLENBQWtCO0FBQ2hCLFdBQVM7QUFDUCxTQUFLO0FBQ0gsV0FBSztBQURGLEtBREU7QUFJUCxVQUFNO0FBQ0osV0FBSyxLQUREO0FBRUosV0FBSztBQUZEO0FBSkM7QUFETyxDQUFsQjs7O0FDWkEsTUFBTSxxQkFBcUIsUUFBUSxzQkFBUixDQUEzQjs7QUFFQSxJQUFJLENBQUo7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLE1BQU0sVUFBTixDQUFpQjs7QUFFaEMsY0FBWSxPQUFaLEVBQXFCO0FBQ25CLFVBQU0sRUFBQyxPQUFELEVBQVUsYUFBVixLQUEyQixLQUFLLGdCQUFMLENBQXNCLE9BQXRCLENBQWpDOztBQUVBLFNBQUssV0FBTCxHQUFtQixFQUFuQjs7QUFFQSxTQUFLLE1BQUw7QUFDQSxTQUFLLGdCQUFMLENBQXNCLE9BQXRCO0FBQ0EsU0FBSyxVQUFMO0FBQ0EsUUFBSSxDQUFDLGFBQUwsRUFBb0I7QUFDbEIsV0FBSyxRQUFMO0FBQ0Q7QUFDRjs7QUFFRCxnQkFBYyxRQUFkLEVBQXdCLEdBQXhCLEVBQTZCO0FBQzNCLFFBQUksVUFBSjtBQUNBLGlCQUFhLElB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QU8sU0FBUyxTQUFULEdBQXNCO0FBQzNCLFFBQUksTUFBTSxJQUFWO0FBQUEsUUFBZ0IsT0FBTyxTQUF2QjtBQUNBLGFBQVMsT0FBVCxHQUFvQjtBQUNsQixVQUFJLENBQUMsUUFBTCxFQUFlLEtBQUssS0FBTCxDQUFXLEdBQVgsRUFBZ0IsSUFBaEI7QUFDZixnQkFBVSxJQUFWO0FBQ0Q7QUFDRCxRQUFJLE9BQUosRUFBYTtBQUNYLG1CQUFhLE9BQWI7QUFDRCxLQUZELE1BR0ssSUFBSSxRQUFKLEVBQWM7QUFDakIsV0FBSyxLQUFMLENBQVcsR0FBWCxFQUFnQixJQUFoQjtBQUNEO0FBQ0QsY0FBVSxXQUFXLE9BQVgsRUFBb0IsYUFBYSxHQUFqQyxDQUFWO0FBQ0QsR0FiRDtBQWNELENBaEJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IFBhcmFsbGF4QnJvID0gcmVxdWlyZSgnLi4vbGliJyk7XG5cbmNvbnN0IGxheGJybyA9IG5ldyBQYXJhbGxheEJybygpO1xuXG52YXIgcGFnZTEsIHBhZ2UyO1xuXG5wYWdlMSA9IGxheGJyby5hZGRDb2xsZWN0aW9uKCcjY29sbGVjdGlvbjEnLCB7XG4gIHRvcDogMjAwLFxuICBoaWRlOiBmYWxzZSxcbiAgY2VudGVyOiB0cnVlLFxufSk7XG5cbnBhZ2UxLmFkZEVsZW1lbnRzKHtcbiAgJyNpbWcxJzoge1xuICAgIHRvcDoge1xuICAgICAgMTAwOiAxMDAsXG4gICAgfSxcbiAgICBoaWRlOiB7XG4gICAgICAxMDA6IGZhbHNlLFxuICAgICAgMzAwOiB0cnVlLFxuICAgIH0sXG4gICAgLy8gc3BlZWQ6IHtcbiAgICAvLyAgIDA6IDEsXG4gICAgLy8gICAyMDA6IC41LFxuICAgIC8vICAgMzAwOiAwLFxuICAgIC8vICAgNDAwOiAtMSxcbiAgICAvLyB9LFxuICB9LFxuICAvLyAnI2ltZzInOiB7XG4gIC8vICAgaGlkZTogdHJ1ZSxcbiAgLy8gICB0b3A6IDgwMCxcbiAgLy8gICB6SW5kZXg6IDAsXG4gIC8vICAgc3BlZWQ6IC4xLFxuICAvLyAgIHVwZGF0ZToge1xuICAvLyAgICAgMDogKCkgPT4ge1xuICAvLyAgICAgICB0aGlzLmVsLmZhZGVJbigpO1xuICAvLyAgICAgfSxcbiAgLy8gICAgIDQwMDogKCkgPT4ge1xuICAvLyAgICAgICB0aGlzLmVsLmZhZGVPdXQoKTtcbiAgLy8gICAgIH1cbiAgLy8gICB9XG4gIC8vIH1cbn0pO1xuIiwiY29uc3QgUGFyYWxsYXhDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9QYXJhbGxheENvbGxlY3Rpb24nKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxheEJybyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGNvbnN0IHt3cmFwcGVyLCBkaXNhYmxlU3R5bGVzfSA9IHRoaXMubm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKTtcblxuICAgIHRoaXMuY29sbGVjdGlvbnMgPSBbXTtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5jYWNoZURPTUVsZW1lbnRzKHdyYXBwZXIpO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIGlmICghZGlzYWJsZVN0eWxlcykge1xuICAgICAgdGhpcy5zdHlsZURPTSgpO1xuICAgIH1cbiAgfVxuXG4gIGFkZENvbGxlY3Rpb24oc2VsZWN0b3IsIG9iaikge1xuICAgIHZhciBjb2xsZWN0aW9uO1xuICAgIGNvbGxlY3Rpb24gPSBuZXcgUGFyYWxsYXhDb2xsZWN0aW9uKHNlbGVjdG9yLCBvYmopO1xuICAgIHRoaXMuY29sbGVjdGlvbnMucHVzaChjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuXG4gIGNhY2hlRE9NRWxlbWVudHMod3JhcHBlcikge1xuICAgIHRoaXMuJGVsID0ge307XG4gICAgdGhpcy4kZWwud2luID0gJCh3aW5kb3cpO1xuICAgIHRoaXMuJGVsLmRvYyA9ICQoZG9jdW1lbnQpO1xuICAgIHRoaXMuJGVsLmJvZHkgPSAkKCdib2R5Jyk7XG4gICAgdGhpcy4kZWwud3JhcHBlciA9ICQod3JhcHBlcik7XG4gIH1cblxuICBzdHlsZURPTSgpIHtcbiAgICB2YXIge2JvZHksIHdyYXBwZXIsIGRvY30gPSB0aGlzLiRlbDtcbiAgICBib2R5LmNzcygnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICB3cmFwcGVyLmNzcygnbWluLWhlaWdodCcsICcxMDAlJyk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IHRyYWNrID0gKCkgPT4ge1xuICAgICAgdmFyIHBvc1kgPSB0aGlzLiRlbC53aW5bMF0ucGFnZVlPZmZzZXQ7XG4gICAgICB0aGlzLm1vdmVFbGVtZW50cyhwb3NZKTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0cmFjayk7XG4gICAgfVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0cmFjayk7XG4gIH1cblxuXG4gIG1vdmVFbGVtZW50cyhwb3NZKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25zO1xuICAgIGNvbGxlY3Rpb25zID0gdGhpcy5jb2xsZWN0aW9ucztcbiAgICBjb2xsZWN0aW9ucy5mb3JFYWNoKGNvbGxlY3Rpb24gPT4gY29sbGVjdGlvbi5tb3ZlRWxlbWVudHMocG9zWSkpO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gIH1cblxuICBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgd3JhcHBlcjogJyNwYXJhbGxheCcsXG4gICAgICBkaXNhYmxlU3R5bGVzOiBmYWxzZSxcbiAgICB9LCBvcHRpb25zKTtcbiAgfVxuXG59XG4iLCJjb25zdCB7bm9ybWFsaXplT3B0aW9ucywgcnVuVXBkYXRlfSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbmNvbnN0IFBhcmFsbGF4RWxlbWVudCA9IHJlcXVpcmUoJy4vUGFyYWxsYXhFbGVtZW50Jyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsbGF4Q29sbGVjdGlvbiB7XG5cbiAgY29uc3RydWN0b3Ioc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICBjb25zdCB7dG9wLCBoaWRlLCB6SW5kZXgsIGNlbnRlcn0gPSBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMsIHtcbiAgICAgIHRvcDoge3ZhbHVlOiAwfSxcbiAgICAgIGhpZGU6IHt2YWx1ZTogZmFsc2V9LFxuICAgICAgekluZGV4OiB7dmFsdWU6IC0xfSxcbiAgICAgIGNlbnRlcjoge3ZhbHVlOiBmYWxzZX0sXG4gICAgfSk7XG5cbiAgICB0aGlzLiRlbDtcbiAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgdGhpcy5wcmV2UG9zWTtcblxuICAgIHRoaXMudG9wID0gdG9wO1xuICAgIHRoaXMuaGlkZSA9IGhpZGU7XG4gICAgdGhpcy56SW5kZXggPSB6SW5kZXg7XG4gICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XG5cbiAgICB0aGlzLmpRdWVyeSgpO1xuICAgIHRoaXMuc3R5bGVDb2xsZWN0aW9uKHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgfVxuXG4gIGhpZGUodmFsdWUpIHtcbiAgICB0aGlzLmhpZGUudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLiRlbC5jc3MoJ2Rpc3BsYXknLCB2YWx1ZSA/ICdub25lJyA6ICdibG9jaycpO1xuICB9XG5cbiAgekluZGV4KHZhbHVlKSB7XG4gICAgdGhpcy56SW5kZXgudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLiRlbC5jc3MoJ3pJbmRleCcsIHZhbHVlKTtcbiAgfVxuXG4gIHRvcCh2YWx1ZSkge1xuICAgIHZhciB0b3A7XG4gICAgdGhpcy50b3AudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLiRlbC5jaGlsZHJlbigpLmNzcygndG9wJywgdmFsdWUgKyAncHgnKTtcbiAgfVxuXG4gIGNlbnRlcih2YWx1ZSkge1xuICAgIHRoaXMuY2VudGVyLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy4kZWwuY2hpbGRyZW4oKS5jc3Moe1xuICAgICAgJ21hcmdpbi1yaWdodCc6ICdhdXRvJyxcbiAgICAgICdtYXJnaW4tbGVmdCc6ICdhdXRvJyxcbiAgICB9KTtcbiAgfVxuXG4gIGFkZEVsZW1lbnRzKG9iaikge1xuICAgIHZhciBzZWxlY3RvcnMsIHRvcCwgY2VudGVyO1xuICAgIHNlbGVjdG9ycyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgc2VsZWN0b3JzLmZvckVhY2goc2VsZWN0b3IgPT4ge1xuICAgICAgdmFyIG9wdGlvbnMgPSBvYmpbc2VsZWN0b3JdO1xuICAgICAgdGhpcy5hZGRFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZEVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgZWxlbWVudDtcbiAgICBlbGVtZW50ID0gbmV3IFBhcmFsbGF4RWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucywgdGhpcy50b3ApO1xuICAgIHRoaXMuZWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG1vdmVFbGVtZW50cyhwb3NZKSB7XG4gICAgdmFyIGVsZW1lbnRzO1xuICAgIGVsZW1lbnRzID0gdGhpcy5lbGVtZW50cztcbiAgICB0aGlzLnJ1bkNhbGxiYWNrcyhwb3NZKTtcbiAgICBlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4gZWxlbWVudC5tb3ZlRWxlbWVudChwb3NZKSk7XG4gICAgdGhpcy5wcmV2UG9zWSA9IHBvc1k7XG4gIH1cblxuICBydW5DYWxsYmFja3MocG9zWSkge1xuICAgIHRoaXMudXBkYXRlSGlkZShwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZVppbmRleChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZUNlbnRlcihwb3NZKTtcbiAgfVxuXG4gIHVwZGF0ZUhpZGUocG9zWSkge1xuICAgIHZhciBwcmV2WSA9IHRoaXMucHJldlBvc1k7XG4gICAgcnVuVXBkYXRlKHBvc1ksIHByZXZZLCB0aGlzLmhpZGUsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy4kZWwuY3NzKCdkaXNwbGF5JywgdmFsdWUgPyAnbm9uZScgOiAnYmxvY2snKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZVppbmRleChwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy5wcmV2UG9zWTtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuekluZGV4LCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuJGVsLmNzcygnekluZGV4JywgdmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlQ2VudGVyKHBvc1kpIHtcbiAgICB2YXIgcHJldlkgPSB0aGlzLnByZXZQb3NZO1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgdGhpcy5jZW50ZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuJGVsLmNzcyh7XG4gICAgICAgICAgJ21hcmdpbi1yaWdodCc6ICdhdXRvJyxcbiAgICAgICAgICAnbWFyZ2luLWxlZnQnOiAnYXV0bycsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuJGVsLmNzcyh7XG4gICAgICAgICAgJ21hcmdpbi1yaWdodCc6ICdpbmhlcml0JyxcbiAgICAgICAgICAnbWFyZ2luLWxlZnQnOiAnaW5oZXJpdCcsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gIH1cblxuICBzdHlsZUNvbGxlY3Rpb24oc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgJGVsLCBjc3M7XG4gICAgdmFyIHtjZW50ZXIsIHpJbmRleCwgaGlkZX0gPSBvcHRpb25zO1xuICAgIGNzcyA9IHt9O1xuICAgIGlmIChjZW50ZXIpIHtcbiAgICAgIGNzc1snbWFyZ2luLXJpZ2h0J10gPSAnYXV0byc7XG4gICAgICBjc3NbJ21hcmdpbi1sZWZ0J10gPSAnYXV0byc7XG4gICAgfVxuICAgIGlmIChoaWRlKSB7XG4gICAgICBjc3MuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG4gICAgaWYgKHpJbmRleCkge1xuICAgICAgY3NzLnpJbmRleCA9IHpJbmRleDtcbiAgICB9XG4gICAgJGVsID0gJChzZWxlY3Rvcik7XG4gICAgJGVsLmNzcyhjc3MpO1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn1cbiIsImNvbnN0IHtwcmVmaXgsIG5vcm1hbGl6ZU9wdGlvbnMsIHJ1blVwZGF0ZX0gPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsbGF4RWxlbWVudCB7XG5cbiAgY29uc3RydWN0b3Ioc2VsZWN0b3IsIG9wdGlvbnMsIG9mZnNldFRvcCkge1xuICAgIGNvbnN0IHt0b3AsIGhpZGUsIHpJbmRleCwgc3BlZWQsIGNlbnRlcn0gPSBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMsIHtcbiAgICAgIHRvcDoge3ZhbHVlOiAwfSxcbiAgICAgIGhpZGU6IHt2YWx1ZTogZmFsc2V9LFxuICAgICAgekluZGV4OiB7dmFsdWU6IC0xfSxcbiAgICAgIHNwZWVkOiB7dmFsdWU6IDF9LFxuICAgICAgY2VudGVyOiB7dmFsdWU6IGZhbHNlfSxcbiAgICB9KTtcblxuICAgIHRoaXMuJGVsO1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4KCk7XG4gICAgdGhpcy5vZmZzZXRUb3AgPSBvZmZzZXRUb3A7XG4gICAgdGhpcy55T2Zmc2V0ID0gb2Zmc2V0VG9wLnZhbHVlO1xuICAgIHRoaXMucHJldlBvc1k7XG5cbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLmhpZGUgPSBoaWRlO1xuICAgIHRoaXMuekluZGV4ID0gekluZGV4O1xuICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcbiAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcblxuICAgIC8vIHRoaXMuZGVsdGEgID0gMDtcbiAgICAvLyB0aGlzLnVwZGF0ZSA9IHt9O1xuXG4gICAgdGhpcy5qUXVlcnkoKTtcbiAgICB0aGlzLnN0eWxlRWxlbWVudChzZWxlY3Rvciwge2NlbnRlciwgdG9wfSk7XG4gIH1cblxuICBoaWRlKHZhbHVlKSB7XG4gICAgdGhpcy5oaWRlLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy4kZWwuY3NzKCdkaXNwbGF5JywgdmFsdWUgPyAnbm9uZScgOiAnYmxvY2snKTtcbiAgfVxuXG4gIHpJbmRleCh2YWx1ZSkge1xuICAgIHRoaXMuekluZGV4LnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy4kZWwuY3NzKCd6SW5kZXgnLCB2YWx1ZSk7XG4gIH1cblxuICB0b3AodmFsdWUpIHtcbiAgICB0aGlzLnRvcC52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuJGVsLmNzcygndG9wJywgdmFsdWUrJ3B4Jyk7XG4gIH1cblxuICBjZW50ZXIodmFsdWUpIHtcbiAgICB0aGlzLmNlbnRlci52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuJGVsLmNzcyh7XG4gICAgICAnbWFyZ2luLXJpZ2h0JzogJ2F1dG8nLFxuICAgICAgJ21hcmdpbi1sZWZ0JzogJ2F1dG8nLFxuICAgIH0pO1xuICB9XG5cbiAgbW92ZUVsZW1lbnQocG9zWSkge1xuICAgIHZhciAkZWwsIHNwZWVkLCBkZWx0YSwgcHJlZml4O1xuXG4gICAgdGhpcy5ydW5DYWxsYmFja3MocG9zWSk7XG4gICAgcHJlZml4ID0gdGhpcy5wcmVmaXg7XG4gICAgJGVsID0gdGhpcy4kZWw7XG4gICAgc3BlZWQgPSB0aGlzLnNwZWVkO1xuXG4gICAgZGVsdGEgPSBNYXRoLnJvdW5kKHBvc1kqc3BlZWQqMTAwKSAvIDEwMDtcblxuICAgICRlbFswXS5zdHlsZVtwcmVmaXguZG9tICsgJ1RyYW5zZm9ybSddID0gYHRyYW5zbGF0ZTNkKDBweCwgJHtkZWx0YX1weCwgMCkgdHJhbnNsYXRlWigwKSBzY2FsZSgxKWA7XG4gICAgdGhpcy5wcmV2UG9zWSA9IHBvc1k7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBydW5DYWxsYmFja3MocG9zWSkge1xuICAgIHRoaXMudXBkYXRlSGlkZShwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZVRvcChwb3NZKTtcbiAgICB0aGlzLnVwZGF0ZU9mZnNldChwb3NZKTtcbiAgICAvLyB0aGlzLmV4ZWNTcGVlZChwb3NZKTtcbiAgfVxuXG4gIHVwZGF0ZU9mZnNldChwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy5wcmV2UG9zWTtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMub2Zmc2V0VG9wLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMub2Zmc2V0WSA9IHZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlSGlkZShwb3NZKSB7XG4gICAgdmFyIHByZXZZID0gdGhpcy5wcmV2UG9zWTtcbiAgICBydW5VcGRhdGUocG9zWSwgcHJldlksIHRoaXMuaGlkZSwgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLiRlbC5jc3MoJ2Rpc3BsYXknLCB2YWx1ZSA/ICdub25lJyA6ICdibG9jaycpO1xuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlVG9wKHBvc1kpIHtcbiAgICB2YXIgcHJldlkgPSB0aGlzLnByZXZQb3NZO1xuICAgIHJ1blVwZGF0ZShwb3NZLCBwcmV2WSwgdGhpcy50b3AsICh2YWx1ZSkgPT4ge1xuICAgICAgdmFyIHlPZmZzZXQgPSB0aGlzLnlPZmZzZXQ7XG4gICAgICB0aGlzLiRlbC5jc3MoJ3RvcCcsIHZhbHVlK3lPZmZzZXQrJ3B4Jyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtICB7U3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnNcbiAgICovXG4gIHN0eWxlRWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIHZhciAkZWwsIGNzcywgeU9mZnNldDtcbiAgICB2YXIge2NlbnRlciwgdG9wfSA9IG9wdGlvbnM7XG4gICAgeU9mZnNldCA9IHRoaXMueU9mZnNldDtcbiAgICBjc3MgPSB7XG4gICAgICAncG9zaXRpb24nOiAnZml4ZWQnLFxuICAgICAgJ2xlZnQnOiAwLFxuICAgICAgJ3JpZ2h0JzogMCxcbiAgICB9O1xuICAgIGlmIChjZW50ZXIpIHtcbiAgICAgIGNzc1snbWFyZ2luLXJpZ2h0J10gPSAnYXV0byc7XG4gICAgICBjc3NbJ21hcmdpbi1sZWZ0J10gPSAnYXV0byc7XG4gICAgfVxuICAgIGlmICh0b3ApIHtcbiAgICAgIGNzcy50b3AgPSB0b3AreU9mZnNldCsncHgnO1xuICAgIH1cbiAgICAkZWwgPSAkKHNlbGVjdG9yKTtcbiAgICAkZWwuY3NzKGNzcyk7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBqUXVlcnkoKSB7XG4gICAgJCA9IGpRdWVyeTtcbiAgICBpZiAoISQpIHtcbiAgICAgIHRocm93ICdqUXVlcnkgaXMgbm90IGRlZmluZWQnO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vUGFyYWxsYXhCcm8nKTtcbiIsImNvbnN0IHNlbGYgPSBtb2R1bGUuZXhwb3J0cztcblxuc2VsZi5jYWxsQnJlYWtwb2ludHMgPSAocG9zWSwgcHJldlBvc1ksIGJyZWFrcG9pbnRzLCBjYWxsYmFjaykgPT4ge1xuICB2YXIgc2Nyb2xsaW5nRG93biwgeURpZmY7XG4gIHNjcm9sbGluZ0Rvd24gPSBwcmV2UG9zWSA8IHBvc1k7XG4gIHlEaWZmID0gc2Nyb2xsaW5nRG93biA/IHBvc1kgLSBwcmV2UG9zWSA6IHByZXZQb3NZIC0gcG9zWTtcbiAgYnJlYWtwb2ludHMgPSBicmVha3BvaW50cy5tYXAoYnJlYWtwb2ludCA9PiBwYXJzZUludChicmVha3BvaW50LCAxMCkpO1xuICBmb3IgKGxldCBpPTA7IGk8eURpZmY7IGkrKykge1xuICAgIGxldCBwb3MsIGluZGV4O1xuICAgIHBvcyA9IHNjcm9sbGluZ0Rvd24gPyBwcmV2UG9zWSArIGkgOiBwcmV2UG9zWSAtIGk7XG4gICAgaW5kZXggPSBicmVha3BvaW50cy5pbmRleE9mKHBvcyk7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIGxldCBpID0gc2Nyb2xsaW5nRG93biA/IGluZGV4IDogaW5kZXggLSAxO1xuICAgICAgY2FsbGJhY2suY2FsbChudWxsLCBicmVha3BvaW50c1tpXSwgc2Nyb2xsaW5nRG93bik7XG4gICAgfVxuICB9XG59XG5cbnNlbGYucnVuVXBkYXRlID0gKHBvc1ksIHByZXZQb3NZLCBvYmosIGNhbGxiYWNrKSA9PiB7XG4gIHZhciBicmVha3BvaW50cyA9IE9iamVjdC5rZXlzKG9iai5icmVha3BvaW50cyk7XG5cbiAgaWYgKHByZXZQb3NZID09PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgdmFsdWUgPSBvYmouYnJlYWtwb2ludHNbcG9zWV07XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwobnVsbCwgdmFsdWUsIHBvc1ksIHRydWUpO1xuICAgIH1cbiAgfVxuICBcbiAgc2VsZi5jYWxsQnJlYWtwb2ludHMocG9zWSwgcHJldlBvc1ksIGJyZWFrcG9pbnRzLCAoYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93bikgPT4ge1xuICAgIHZhciB2YWx1ZSA9IG9iai5icmVha3BvaW50c1ticmVha3BvaW50XTtcbiAgICBjYWxsYmFjay5jYWxsKG51bGwsIHZhbHVlLCBicmVha3BvaW50LCBzY3JvbGxpbmdEb3duKTtcbiAgfSk7XG59XG5cbnNlbGYubm9ybWFsaXplT3B0aW9ucyA9IChvcHRpb25zLCBkZWZhdWx0cykgPT4ge1xuICB2YXIga2V5cztcblxuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICBrZXlzID0gT2JqZWN0LmtleXMob3B0aW9ucyk7XG5cbiAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgdmFyIHZhbHVlLCBpc09iamVjdDtcbiAgICB2YWx1ZSA9IG9wdGlvbnNba2V5XTtcbiAgICBpc09iamVjdCA9IHNlbGYuaXNUeXBlKHZhbHVlLCAnb2JqZWN0Jyk7XG4gICAgaWYgKGlzT2JqZWN0KSB7XG4gICAgICBsZXQgdmFsdWUxID0gdmFsdWUgJiYgdmFsdWVbJzAnXSA/IHZhbHVlWycwJ10gOiBkZWZhdWx0c1trZXldLnZhbHVlO1xuICAgICAgb3B0aW9uc1trZXldID0ge1xuICAgICAgICB2YWx1ZTogdmFsdWUxLFxuICAgICAgICBicmVha3BvaW50czogT2JqZWN0LmFzc2lnbih7fSwgezA6IHZhbHVlMX0sIHZhbHVlKSxcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBvcHRpb25zW2tleV0gPSB7XG4gICAgICAgIHZhbHVlLFxuICAgICAgICBicmVha3BvaW50czogezA6IHZhbHVlfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvcHRpb25zO1xufVxuXG4vKipcbiAqIEdpdmVuIGEgTWl4ZWQgdmFsdWUgdHlwZSBjaGVjay5cbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlLlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUuXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWMuXG4gKiBAdGVzdHMgdW5pdC5cbiAqL1xuc2VsZi5pc1R5cGUgPSAodmFsdWUsIHR5cGUpID0+IHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBOdW1iZXIuaXNOYU4odmFsdWUpID09PSBmYWxzZTtcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSB8fCB2YWx1ZSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnYXJyYXknOlxuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpO1xuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnbnVsbCc6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGw7XG4gICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJztcbiAgICBjYXNlICdOYU4nOlxuICAgICAgcmV0dXJuIE51bWJlci5pc05hTih2YWx1ZSk7XG4gICAgY2FzZSAnZGF0ZSc6XG4gICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucmVjZ29uaXplZCB0eXBlOiBcIiR7dHlwZX1cImApO1xuICB9XG59O1xuXG5zZWxmLnByZWZpeCA9ICgpID0+IHtcbiAgdmFyIHN0eWxlcztcbiAgc3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCAnJyksXG4gICAgcHJlID0gKEFycmF5LnByb3RvdHlwZS5zbGljZVxuICAgICAgLmNhbGwoc3R5bGVzKVxuICAgICAgLmpvaW4oJycpXG4gICAgICAubWF0Y2goLy0obW96fHdlYmtpdHxtcyktLykgfHwgKHN0eWxlcy5PTGluayA9PT0gJycgJiYgWycnLCAnbyddKVxuICAgIClbMV0sXG4gICAgZG9tID0gKCd3ZWJraXR8TW96fE1TfE8nKS5tYXRjaChuZXcgUmVnRXhwKCcoJyArIHByZSArICcpJywgJ2knKSlbMV07XG4gICAgcmV0dXJuIHtcbiAgICAgIGRvbTogZG9tLFxuICAgICAgbG93ZXJjYXNlOiBwcmUsXG4gICAgICBjc3M6ICctJyArIHByZSArICctJyxcbiAgICAgIGpzOiBwcmVbMF0udG9VcHBlckNhc2UoKSArIHByZS5zdWJzdHIoMSlcbiAgICB9O1xufTtcblxuLy8gaHR0cDovL3Vuc2NyaXB0YWJsZS5jb20vMjAwOS8wMy8yMC9kZWJvdW5jaW5nLWphdmFzY3JpcHQtbWV0aG9kcy9cbnNlbGYuZGVib3VuY2UgPSAoZnVuYywgdGhyZXNob2xkLCBleGVjQXNhcCkgPT4ge1xuICB2YXIgdGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uIGRlYm91bmNlZCAoKSB7XG4gICAgdmFyIG9iaiA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgZnVuY3Rpb24gZGVsYXllZCAoKSB7XG4gICAgICBpZiAoIWV4ZWNBc2FwKSBmdW5jLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZXhlY0FzYXApIHtcbiAgICAgIGZ1bmMuYXBwbHkob2JqLCBhcmdzKTtcbiAgICB9XG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQoZGVsYXllZCwgdGhyZXNob2xkIHx8IDEwMCk7XG4gIH07XG59O1xuIl19
