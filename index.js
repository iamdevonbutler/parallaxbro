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

},{"./ParallaxCollection":2}],2:[function(require,module,exports){
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

},{"./ParallaxElement":3}],3:[function(require,module,exports){
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

},{"./utils":5}],4:[function(require,module,exports){
module.exports = require('./ParallaxBro');

},{"./ParallaxBro":1}],5:[function(require,module,exports){
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

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvUGFyYWxsYXhCcm8uanMiLCJsaWIvUGFyYWxsYXhDb2xsZWN0aW9uLmpzIiwibGliL1BhcmFsbGF4RWxlbWVudC5qcyIsImxpYi9pbmRleC5qcyIsImxpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLE1BQU0scUJBQXFCLFFBQVEsc0JBQVIsQ0FBM0I7O0FBRUEsSUFBSSxDQUFKOztBQUVBLE9BQU8sT0FBUCxHQUFpQixNQUFNLFVBQU4sQ0FBaUI7O0FBRWhDLGNBQVksT0FBWixFQUFxQjtBQUNuQixVQUFNLEVBQUMsT0FBRCxFQUFVLGFBQVYsS0FBMkIsS0FBSyxnQkFBTCxDQUFzQixPQUF0QixDQUFqQzs7QUFFQSxTQUFLLFdBQUwsR0FBbUIsRUFBbkI7O0FBRUEsU0FBSyxNQUFMO0FBQ0EsU0FBSyxnQkFBTCxDQUFzQixPQUF0QjtBQUNBLFNBQUssVUFBTDtBQUNBLFFBQUksQ0FBQyxhQUFMLEVBQW9CO0FBQ2xCLFdBQUssUUFBTDtBQUNEO0FBQ0Y7O0FBRUQsZ0JBQWMsUUFBZCxFQUF3QixHQUF4QixFQUE2QjtBQUMzQixRQUFJLFVBQUo7QUFDQSxpQkFBYSxJQUFJLGtCQUFKLENBQXVCLFFBQXZCLEVBQWlDLEdBQWpDLENBQWI7QUFDQSxTQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsVUFBdEI7QUFDQSxXQUFPLFVBQVA7QUFDRDs7QUFFRCxtQkFBaUIsT0FBakIsRUFBMEI7QUFDeEIsU0FBSyxHQUFMLEdBQVcsRUFBWDtBQUNBLFNBQUssR0FBTCxDQUFTLEdBQVQsR0FBZSxFQUFFLE1BQUYsQ0FBZjtBQUNBLFNBQUssR0FBTCxDQUFTLEdBQVQsR0FBZSxFQUFFLFFBQUYsQ0FBZjtBQUNBLFNBQUssR0FBTCxDQUFTLElBQVQsR0FBZ0IsRUFBRSxNQUFGLENBQWhCO0FBQ0EsU0FBSyxHQUFMLENBQVMsT0FBVCxHQUFtQixFQUFFLE9B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LFNBQU4sQ0FBZ0IsS0FBaEIsQ0FDSixJQURJLENBQ0MsTUFERCxFQUVKLElBRkksQ0FFQyxFQUZELEVBR0osS0FISSxDQUdFLG1CQUhGLEtBRzJCLE9BQU8sS0FBUCxLQUFpQixFQUFqQixJQUF1QixDQUFDLEVBQUQsRUFBSyxHQUFMLENBSG5ELEVBSUosQ0FKSSxDQURSLEVBTUUsTUFBTyxpQkFBRCxDQUFvQixLQUFwQixDQUEwQixJQUFJLE1BQUosQ0FBVyxNQUFNLEdBQU4sR0FBWSxHQUF2QixFQUE0QixHQUE1QixDQUExQixFQUE0RCxDQUE1RCxDQU5SO0FBT0UsU0FBTztBQUNMLFNBQUssR0FEQTtBQUVMLGVBQVcsR0FGTjtBQUdMLFNBQUssTUFBTSxHQUFOLEdBQVksR0FIWjtBQUlMLFFBQUksSUFBSSxDQUFKLEVBQU8sV0FBUCxLQUF1QixJQUFJLE1BQUosQ0FBVyxDQUFYO0FBSnRCLEdBQVA7QUFNSCxDQWZEOztBQWlCQTtBQUNBLEtBQUssUUFBTCxHQUFnQixDQUFDLElBQUQsRUFBTyxTQUFQLEVBQWtCLFFBQWxCLEtBQStCO0FBQzdDLE1BQUksT0FBSjtBQUNBLFNBQU8sU0FBUyxTQUFULEdBQXNCO0FBQzNCLFFBQUksTUFBTSxJQUFWO0FBQUEsUUFBZ0IsT0FBTyxTQUF2QjtBQUNBLGFBQVMsT0FBVCxHQUFvQjtBQUNsQixVQUFJLENBQUMsUUFBTCxFQUFlLEtBQUssS0FBTCxDQUFXLEdBQVgsRUFBZ0IsSUFBaEI7QUFDZixnQkFBVSxJQUFWO0FBQ0Q7QUFDRCxRQUFJLE9BQUosRUFBYTtBQUNYLG1CQUFhLE9BQWI7QUFDRCxLQUZELE1BR0ssSUFBSSxRQUFKLEVBQWM7QUFDakIsV0FBSyxLQUFMLENBQVcsR0FBWCxFQUFnQixJQUFoQjtBQUNEO0FBQ0QsY0FBVSxXQUFXLE9BQVgsRUFBb0IsYUFBYSxHQUFqQyxDQUFWO0FBQ0QsR0FiRDtBQWNELENBaEJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IFBhcmFsbGF4Q29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vUGFyYWxsYXhDb2xsZWN0aW9uJyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsYXhCcm8ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBjb25zdCB7d3JhcHBlciwgZGlzYWJsZVN0eWxlc30gPSB0aGlzLm5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbGxlY3Rpb25zID0gW107XG5cbiAgICB0aGlzLmpRdWVyeSgpO1xuICAgIHRoaXMuY2FjaGVET01FbGVtZW50cyh3cmFwcGVyKTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICBpZiAoIWRpc2FibGVTdHlsZXMpIHtcbiAgICAgIHRoaXMuc3R5bGVET00oKTtcbiAgICB9XG4gIH1cblxuICBhZGRDb2xsZWN0aW9uKHNlbGVjdG9yLCBvYmopIHtcbiAgICB2YXIgY29sbGVjdGlvbjtcbiAgICBjb2xsZWN0aW9uID0gbmV3IFBhcmFsbGF4Q29sbGVjdGlvbihzZWxlY3Rvciwgb2JqKTtcbiAgICB0aGlzLmNvbGxlY3Rpb25zLnB1c2goY29sbGVjdGlvbik7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cblxuICBjYWNoZURPTUVsZW1lbnRzKHdyYXBwZXIpIHtcbiAgICB0aGlzLiRlbCA9IHt9O1xuICAgIHRoaXMuJGVsLndpbiA9ICQod2luZG93KTtcbiAgICB0aGlzLiRlbC5kb2MgPSAkKGRvY3VtZW50KTtcbiAgICB0aGlzLiRlbC5ib2R5ID0gJCgnYm9keScpO1xuICAgIHRoaXMuJGVsLndyYXBwZXIgPSAkKHdyYXBwZXIpO1xuICAgIC8vIHRoaXMuJGVsLmJvZHlIdG1sID0gJCgnYm9keSwgaHRtbCcpO1xuICB9XG5cbiAgc3R5bGVET00oKSB7XG4gICAgdmFyIHtib2R5LCB3cmFwcGVyLCBkb2N9ID0gdGhpcy4kZWw7XG4gICAgYm9keS5jc3MoJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgd3JhcHBlci5jc3MoJ21pbi1oZWlnaHQnLCAnMTAwJScpO1xuICAgIC8vIGRvYy5jaGlsZHJlbigpXG4gICAgLy8gICAuY3NzKCdoZWlnaHQnLCAnMTAwJScpXG4gICAgLy8gICAuYWRkQ2xhc3MoJ3BhcmFsbGF4Jyk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IHRyYWNrID0gKCkgPT4ge1xuICAgICAgdmFyIHBvc1kgPSB0aGlzLiRlbC53aW5bMF0ucGFnZVlPZmZzZXQ7XG4gICAgICB0aGlzLm1vdmVFbGVtZW50cyhwb3NZKTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0cmFjayk7XG4gICAgfVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0cmFjayk7XG4gIH1cblxuXG4gIG1vdmVFbGVtZW50cyhwb3NZKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25zO1xuICAgIGNvbGxlY3Rpb25zID0gdGhpcy5jb2xsZWN0aW9ucztcbiAgICBjb2xsZWN0aW9ucy5mb3JFYWNoKGNvbGxlY3Rpb24gPT4gY29sbGVjdGlvbi5tb3ZlRWxlbWVudHMocG9zWSkpO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gIH1cblxuICBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgd3JhcHBlcjogJyNwYXJhbGxheCcsXG4gICAgICBkaXNhYmxlU3R5bGVzOiBmYWxzZSxcbiAgICB9LCBvcHRpb25zKTtcbiAgfVxuXG59XG4iLCJjb25zdCBQYXJhbGxheEVsZW1lbnQgPSByZXF1aXJlKCcuL1BhcmFsbGF4RWxlbWVudCcpO1xuXG52YXIgJDtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYXJhbGxheENvbGxlY3Rpb24ge1xuXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgY29uc3Qge3RvcCwgaGlkZSwgekluZGV4LCBjZW50ZXJ9ID0gdGhpcy5ub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgdGhpcy5lbGVtZW50cyA9IFtdO1xuXG4gICAgdGhpcy50b3AgPSB0b3A7XG4gICAgdGhpcy5oaWRlID0gaGlkZTtcbiAgICB0aGlzLnpJbmRleCA9IHpJbmRleDtcbiAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gIH1cblxuICAvLyBzZXQgaGlkZSh2YWx1ZSkge1xuICAvLyAgIHZhciBwcm9wZXJ0eTtcbiAgLy8gICBwcm9wZXJ0eSA9IHZhbHVlID8gJ25vbmUnIDogJ2Jsb2NrJztcbiAgLy8gICBpZiAodGhpcy4kZWwpIHRoaXMuJGVsLmNzcygnZGlzcGxheScsIHByb3BlcnR5KTtcbiAgLy8gfVxuICAvL1xuICAvLyBzZXQgekluZGV4KHZhbHVlKSB7XG4gIC8vICAgaWYgKHRoaXMuJGVsKSB0aGlzLiRlbC5jc3MoJ3pJbmRleCcsIHZhbHVlKTtcbiAgLy8gfVxuXG4gIGFkZEVsZW1lbnRzKG9iaikge1xuICAgIHZhciBzZWxlY3RvcnMsIHRvcCwgY2VudGVyO1xuICAgIHNlbGVjdG9ycyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgc2VsZWN0b3JzLmZvckVhY2goc2VsZWN0b3IgPT4ge1xuICAgICAgdmFyIG9wdGlvbnMgPSBvYmpbc2VsZWN0b3JdO1xuICAgICAgdGhpcy5hZGRFbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZEVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgZWxlbWVudDtcbiAgICBlbGVtZW50ID0gbmV3IFBhcmFsbGF4RWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgdGhpcy5lbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbW92ZUVsZW1lbnRzKHBvc1kpIHtcbiAgICB2YXIgZWxlbWVudHM7XG4gICAgZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzO1xuICAgIGVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiBlbGVtZW50Lm1vdmVFbGVtZW50KHBvc1kpKTtcbiAgfVxuXG4gIGpRdWVyeSgpIHtcbiAgICAkID0galF1ZXJ5O1xuICAgIGlmICghJCkge1xuICAgICAgdGhyb3cgJ2pRdWVyeSBpcyBub3QgZGVmaW5lZCc7XG4gICAgfVxuICB9XG5cbiAgbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgIHRvcDoge3ZhbHVlOiAwfSxcbiAgICAgIGhpZGU6IHt2YWx1ZTogZmFsc2V9LFxuICAgICAgekluZGV4OiB7dmFsdWU6IC0xfSxcbiAgICAgIGNlbnRlcjogZmFsc2UsXG4gICAgfSwgb3B0aW9ucyk7XG4gIH1cblxufVxuIiwiY29uc3Qge3ByZWZpeCwgaXNUeXBlfSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxsYXhFbGVtZW50IHtcblxuICBjb25zdHJ1Y3RvcihzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIGNvbnN0IHt0b3AsIGhpZGUsIHpJbmRleCwgc3BlZWQsIGNlbnRlcn0gPSB0aGlzLm5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICB0aGlzLiRlbDtcbiAgICB0aGlzLnByZWZpeCA9IHByZWZpeCgpO1xuXG4gICAgdGhpcy50b3AgPSB0b3A7XG4gICAgdGhpcy5oaWRlID0gaGlkZTtcbiAgICB0aGlzLnpJbmRleCA9IHpJbmRleDtcbiAgICB0aGlzLnNwZWVkID0gc3BlZWQ7XG4gICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XG5cbiAgICB0aGlzLnByZXZQb3NZID0gMDtcbiAgICAvLyB0aGlzLmRlbHRhICA9IDA7XG4gICAgLy8gdGhpcy51cGRhdGUgPSB7fTtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5zdHlsZUVsZW1lbnQoc2VsZWN0b3IsIHtjZW50ZXIsIHRvcH0pO1xuICB9XG5cbiAgLy8gc2V0IGhpZGUodmFsdWUpIHtcbiAgLy8gICB2YXIgcHJvcGVydHk7XG4gIC8vICAgcHJvcGVydHkgPSB2YWx1ZSA/ICdibG9jaycgOiAnbm9uZSc7XG4gIC8vICAgaWYgKHRoaXMuJGVsKSB0aGlzLiRlbC5jc3MoJ2Rpc3BsYXknLCBwcm9wZXJ0eSk7XG4gIC8vIH1cbiAgLy9cbiAgLy8gc2V0IHpJbmRleCh2YWx1ZSkge1xuICAvLyAgIGlmICh0aGlzLiRlbCkgdGhpcy4kZWwuY3NzKCd6SW5kZXgnLCB2YWx1ZSk7XG4gIC8vIH1cbiAgLy9cbiAgLy8gc2V0IHRvcCh2YWx1ZSkge1xuICAvLyAgIGlmICh0aGlzLiRlbCkgdGhpcy4kZWwuY3NzKCd0b3AnLCB2YWx1ZSsncHgnKTtcbiAgLy8gfVxuXG4gIG1vdmVFbGVtZW50KHBvc1kpIHtcbiAgICB2YXIgJGVsLCBzcGVlZCwgZGVsdGEsIHByZWZpeDtcblxuICAgIHRoaXMuZXhlY0NhbGxiYWNrcyhwb3NZKTtcbiAgICBwcmVmaXggPSB0aGlzLnByZWZpeDtcbiAgICAkZWwgPSB0aGlzLiRlbDtcbiAgICBzcGVlZCA9IHRoaXMuc3BlZWQ7XG5cbiAgICBkZWx0YSA9IE1hdGgucm91bmQocG9zWSpzcGVlZCoxMDApIC8gMTAwO1xuXG4gICAgJGVsWzBdLnN0eWxlW3ByZWZpeC5kb20gKyAnVHJhbnNmb3JtJ10gPSBgdHJhbnNsYXRlM2QoMHB4LCAke2RlbHRhfXB4LCAwKSB0cmFuc2xhdGVaKDApIHNjYWxlKDEpYDtcbiAgICB0aGlzLnByZXZQb3NZID0gcG9zWTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNhbGxCcmVha3BvaW50cyhwb3NZLCBicmVha3BvaW50cywgY2FsbGJhY2spIHtcbiAgICB2YXIgcHJldlBvc1ksIHNjcm9sbGluZ0Rvd24sIHlEaWZmO1xuXG4gICAgcHJldlBvc1kgPSB0aGlzLnByZXZQb3NZO1xuICAgIHNjcm9sbGluZ0Rvd24gPSBwcmV2UG9zWSA8IHBvc1k7XG4gICAgeURpZmYgPSBzY3JvbGxpbmdEb3duID8gcG9zWSAtIHByZXZQb3NZIDogcHJldlBvc1kgLSBwb3NZO1xuICAgIGJyZWFrcG9pbnRzID0gYnJlYWtwb2ludHMubWFwKGJyZWFrcG9pbnQgPT4gcGFyc2VJbnQoYnJlYWtwb2ludCwgMTApKTtcblxuICAgIGZvciAobGV0IGk9MDsgaTx5RGlmZjsgaSsrKSB7XG4gICAgICBsZXQgcG9zLCBpbmRleDtcbiAgICAgIHBvcyA9IHNjcm9sbGluZ0Rvd24gPyBwcmV2UG9zWSArIGkgOiBwcmV2UG9zWSAtIGk7XG4gICAgICBpbmRleCA9IGJyZWFrcG9pbnRzLmluZGV4T2YocG9zKTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIGxldCBpID0gc2Nyb2xsaW5nRG93biA/IGluZGV4IDogaW5kZXggLSAxO1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIGJyZWFrcG9pbnRzW2ldLCBzY3JvbGxpbmdEb3duKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGV4ZWMocG9zWSwgcHJvcGVydHksIGNhbGxiYWNrKSB7XG4gICAgdmFyIGJyZWFrcG9pbnRzID0gT2JqZWN0LmtleXModGhpc1twcm9wZXJ0eV0uYnJlYWtwb2ludHMpO1xuICAgIHRoaXMuY2FsbEJyZWFrcG9pbnRzKHBvc1ksIGJyZWFrcG9pbnRzLCAoYnJlYWtwb2ludCwgc2Nyb2xsaW5nRG93bikgPT4ge1xuICAgICAgdmFyIHZhbHVlID0gdGhpc1twcm9wZXJ0eV0uYnJlYWtwb2ludHNbYnJlYWtwb2ludF07XG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIHZhbHVlLCBicmVha3BvaW50LCBzY3JvbGxpbmdEb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4ZWNIaWRlKHBvc1kpIHtcbiAgICB0aGlzLmV4ZWMocG9zWSwgJ2hpZGUnLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuJGVsLmNzcygnZGlzcGxheScsIHZhbHVlID8gJ25vbmUnIDogJ2Jsb2NrJyk7XG4gICAgfSk7XG4gIH1cblxuICBleGVjVG9wKHBvc1kpIHtcbiAgICB0aGlzLmV4ZWMocG9zWSwgJ3RvcCcsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy4kZWwuY3NzKCd0b3AnLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBleGVjQ2FsbGJhY2tzKHBvc1kpIHtcbiAgICB0aGlzLmV4ZWNIaWRlKHBvc1kpO1xuICAgIHRoaXMuZXhlY1RvcChwb3NZKTtcbiAgICAvLyB0aGlzLmV4ZWNTcGVlZChwb3NZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBwYXJhbGxheCBzcGVjaWZpYyBzdHlsaW5nIHRvIGVhY2ggZWxlbWVudCBpbiBhIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSAge1N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBzdHlsZUVsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICB2YXIgJGVsLCBjc3M7XG4gICAgdmFyIHtjZW50ZXIsIHRvcH0gPSBvcHRpb25zO1xuICAgIGNzcyA9IHtcbiAgICAgICdwb3NpdGlvbic6ICdmaXhlZCcsXG4gICAgICAnbGVmdCc6IDAsXG4gICAgICAncmlnaHQnOiAwLFxuICAgIH07XG4gICAgaWYgKGNlbnRlcikge1xuICAgICAgY3NzWydtYXJnaW4tcmlnaHQnXSA9ICdhdXRvJztcbiAgICAgIGNzc1snbWFyZ2luLWxlZnQnXSA9ICdhdXRvJztcbiAgICB9XG4gICAgaWYgKHRvcCkge1xuICAgICAgY3NzLnRvcCA9IHRvcDtcbiAgICB9XG4gICAgJGVsID0gJChzZWxlY3Rvcik7XG4gICAgJGVsLmNzcyhjc3MpO1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMsIGtleXM7XG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICB0b3A6IHt2YWx1ZTogMH0sXG4gICAgICBoaWRlOiB7dmFsdWU6IGZhbHNlfSxcbiAgICAgIHpJbmRleDoge3ZhbHVlOiAtMX0sXG4gICAgICBzcGVlZDoge3ZhbHVlOiAxfSxcbiAgICAgIGNlbnRlcjoge3ZhbHVlOiBmYWxzZX0sXG4gICAgfTtcbiAgICBrZXlzID0gT2JqZWN0LmtleXMob3B0aW9ucyk7XG4gICAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICB2YXIgdmFsdWUsIGlzT2JqZWN0O1xuICAgICAgdmFsdWUgPSBvcHRpb25zW2tleV07XG4gICAgICBpc09iamVjdCA9IGlzVHlwZSh2YWx1ZSwgJ29iamVjdCcpO1xuICAgICAgaWYgKGlzT2JqZWN0KSB7XG4gICAgICAgIGxldCB2YWx1ZTEgPSB2YWx1ZSAmJiB2YWx1ZVsnMCddID8gdmFsdWVbJzAnXSA6IGRlZmF1bHRzW2tleV0udmFsdWU7XG4gICAgICAgIG9wdGlvbnNba2V5XSA9IHtcbiAgICAgICAgICB2YWx1ZTogdmFsdWUxLFxuICAgICAgICAgIGJyZWFrcG9pbnRzOiBPYmplY3QuYXNzaWduKHt9LCB7MDogdmFsdWUxfSwgdmFsdWUpLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgb3B0aW9uc1trZXldID0ge1xuICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgIGJyZWFrcG9pbnRzOiB7MDogdmFsdWV9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbiAgfVxuXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vUGFyYWxsYXhCcm8nKTtcbiIsImNvbnN0IHNlbGYgPSBtb2R1bGUuZXhwb3J0cztcblxuLyoqXG4gKiBHaXZlbiBhIE1peGVkIHZhbHVlIHR5cGUgY2hlY2suXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlLlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljLlxuICogQHRlc3RzIHVuaXQuXG4gKi9cbnNlbGYuaXNUeXBlID0gKHZhbHVlLCB0eXBlKSA9PiB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzTmFOKHZhbHVlKSA9PT0gZmFsc2U7XG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09IGZhbHNlO1xuICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKTtcbiAgICBjYXNlICdvYmplY3QnOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkgPT09IGZhbHNlO1xuICAgIGNhc2UgJ251bGwnOlxuICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsO1xuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZDtcbiAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCc7XG4gICAgY2FzZSAnTmFOJzpcbiAgICAgIHJldHVybiBOdW1iZXIuaXNOYU4odmFsdWUpO1xuICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnJlY2dvbml6ZWQgdHlwZTogXCIke3R5cGV9XCJgKTtcbiAgfVxufTtcblxuc2VsZi5wcmVmaXggPSAoKSA9PiB7XG4gIHZhciBzdHlsZXM7XG4gIHN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwgJycpLFxuICAgIHByZSA9IChBcnJheS5wcm90b3R5cGUuc2xpY2VcbiAgICAgIC5jYWxsKHN0eWxlcylcbiAgICAgIC5qb2luKCcnKVxuICAgICAgLm1hdGNoKC8tKG1venx3ZWJraXR8bXMpLS8pIHx8IChzdHlsZXMuT0xpbmsgPT09ICcnICYmIFsnJywgJ28nXSlcbiAgICApWzFdLFxuICAgIGRvbSA9ICgnd2Via2l0fE1venxNU3xPJykubWF0Y2gobmV3IFJlZ0V4cCgnKCcgKyBwcmUgKyAnKScsICdpJykpWzFdO1xuICAgIHJldHVybiB7XG4gICAgICBkb206IGRvbSxcbiAgICAgIGxvd2VyY2FzZTogcHJlLFxuICAgICAgY3NzOiAnLScgKyBwcmUgKyAnLScsXG4gICAgICBqczogcHJlWzBdLnRvVXBwZXJDYXNlKCkgKyBwcmUuc3Vic3RyKDEpXG4gICAgfTtcbn07XG5cbi8vIGh0dHA6Ly91bnNjcmlwdGFibGUuY29tLzIwMDkvMDMvMjAvZGVib3VuY2luZy1qYXZhc2NyaXB0LW1ldGhvZHMvXG5zZWxmLmRlYm91bmNlID0gKGZ1bmMsIHRocmVzaG9sZCwgZXhlY0FzYXApID0+IHtcbiAgdmFyIHRpbWVvdXQ7XG4gIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQgKCkge1xuICAgIHZhciBvYmogPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuICAgIGZ1bmN0aW9uIGRlbGF5ZWQgKCkge1xuICAgICAgaWYgKCFleGVjQXNhcCkgZnVuYy5hcHBseShvYmosIGFyZ3MpO1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGV4ZWNBc2FwKSB7XG4gICAgICBmdW5jLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgfVxuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHRocmVzaG9sZCB8fCAxMDApO1xuICB9O1xufTtcbiJdfQ==
