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
    const { top, hide, zIndex } = this.normalizeOptions(options);

    this.$el;
    this.elements = [];

    this.top = top;
    this.hide = hide;
    this.zIndex = zIndex;

    this.jQuery();
    this.styleCollection();
  }

  set hide(value) {
    var property;
    property = value ? 'block' : 'none';
    if (this.$el) this.$el.css('display', property);
  }

  set zIndex(value) {
    if (this.$el) this.$el.css('zIndex', value);
  }

  set top(value) {
    if (this.$el) this.$el.css('transform', `translateY(${value}px)`);
  }

  addElements(obj) {
    var selectors;
    selectors = Object.keys(obj);
    selectors.forEach(selector => this.addElement(selector, obj[selector]));
    return this;
  }

  addElement(selector, obj) {
    var element;
    element = new ParallaxElement(selector, obj);
    this.elements.push(element);
    return this;
  }

  moveElements(posY) {
    var elements;
    elements = this.elements;
    elements.forEach(element => element.moveElement(posY));
  }

  /**
   * Apply parallax specific styling to the collection wrapper element.
   * @param {object} collection
   * @param {string} DOM selector
   */
  styleCollection(collection, selector) {
    var $el;
    $el = $(selector);
    $el.css({
      'position': 'relative',
      'margin-top': '0',
      'margin-bottom': '0',
      'padding-top': '0',
      'padding-bottom': '0'
    });
    this.$el = $el;
  }

  jQuery() {
    $ = jQuery;
    if (!$) {
      throw 'jQuery is not defined';
    }
  }

  normalizeOptions(options) {
    return Object.assign({}, {
      top: 0,
      hide: false,
      zIndex: -1
    }, options);
  }

};

},{"./ParallaxElement":3}],3:[function(require,module,exports){
const { prefix } = require('./utils');

var $;

module.exports = class ParallaxElement {

  constructor(selector, options) {
    const { top, hide, zIndex, speed } = this.normalizeOptions(options);

    this.$el;
    this.prefix = prefix();

    this.top = top;
    this.hide = hide;
    this.zIndex = zIndex;
    this.speed = speed;

    // this.posY = 0;
    // this.last = false;
    // this.delta  = 0;
    // this.update = {};

    this.jQuery();
    this.styleElement(selector);
  }

  set hide(value) {
    var property;
    property = value ? 'block' : 'none';
    if (this.$el) this.$el.css('display', property);
  }

  set zIndex(value) {
    if (this.$el) this.$el.css('zIndex', value);
  }

  set top(value) {
    if (this.$el) this.$el.css('top', value + 'px');
  }

  moveElement(posY) {
    var $el, speed, delta, prefix;
    prefix = this.prefix;
    $el = this.$el;
    speed = this.speed;
    delta = posY * speed;
    // console.log(delta);
    // console.log(prefix);
    // $el[0].style[prefix.dom + 'TransitionTimingFunction'] = easing;
    // $el[0].style[prefix.dom + 'TransitionDuration'] = time + 'ms';
    $el[0].style[prefix.dom + 'Transform'] = "translateY(" + delta + "px) translateZ(0) scale(1)";
  }

  /**
   * Apply parallax specific styling to each element in a collection.
   * @param  {object} el
   * @param  {string} selector
   * @param  {number} offset
   */
  styleElement(selector) {
    var $el;
    $el = $(selector);
    $el.css({
      'position': 'absolute',
      'left': 0,
      'right': 0,
      'margin-left': 'auto',
      'margin-right': 'auto',
      'margin-top': '0',
      'margin-bottom': '0',
      'padding-top': '0',
      'padding-bottom': '0'
    });
    this.$el = $el;
  }

  jQuery() {
    $ = jQuery;
    if (!$) {
      throw 'jQuery is not defined';
    }
  }

  normalizeOptions(options) {
    return Object.assign({}, {
      top: 0,
      hide: false,
      zIndex: -1,
      speed: 1
    }, options);
  }

};

},{"./utils":5}],4:[function(require,module,exports){
module.exports = require('./ParallaxBro');

},{"./ParallaxBro":1}],5:[function(require,module,exports){
const self = module.exports;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvUGFyYWxsYXhCcm8uanMiLCJsaWIvUGFyYWxsYXhDb2xsZWN0aW9uLmpzIiwibGliL1BhcmFsbGF4RWxlbWVudC5qcyIsImxpYi9pbmRleC5qcyIsImxpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLE1BQU0scUJBQXFCLFFBQVEsc0JBQVIsQ0FBM0I7O0FBRUEsSUFBSSxDQUFKOztBQUVBLE9BQU8sT0FBUCxHQUFpQixNQUFNLFVBQU4sQ0FBaUI7O0FBRWhDLGNBQVksT0FBWixFQUFxQjtBQUNuQixVQUFNLEVBQUMsT0FBRCxFQUFVLGFBQVYsS0FBMkIsS0FBSyxnQkFBTCxDQUFzQixPQUF0QixDQUFqQzs7QUFFQSxTQUFLLFdBQUwsR0FBbUIsRUFBbkI7O0FBRUEsU0FBSyxNQUFMO0FBQ0EsU0FBSyxnQkFBTCxDQUFzQixPQUF0QjtBQUNBLFNBQUssVUFBTDtBQUNBLFFBQUksQ0FBQyxhQUFMLEVBQW9CO0FBQ2xCLFdBQUssUUFBTDtBQUNEO0FBQ0Y7O0FBRUQsZ0JBQWMsUUFBZCxFQUF3QixHQUF4QixFQUE2QjtBQUMzQixRQUFJLFVBQUo7QUFDQSxpQkFBYSxJQUFJLGtCQUFKLENBQXVCLFFBQXZCLEVBQWlDLEdBQWpDLENBQWI7QUFDQSxTQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsVUFBdEI7QUFDQSxXQUFPLFVBQVA7QUFDRDs7QUFFRCxtQkFBaUIsT0FBakIsRUFBMEI7QUFDeEIsU0FBSyxHQUFMLEdBQVcsRUFBWDtBQUNBLFNBQUssR0FBTCxDQUFTLEdBQVQsR0FBZSxFQUFFLE1BQUYsQ0FBZjtBQUNBLFNBQUssR0FBTCxDQUFTLEdBQVQsR0FBZSxFQUFFLFFBQUYsQ0FBZjtBQUNBLFNBQUssR0FBTCxDQUFTLElBQVQsR0FBZ0IsRUFBRSxNQUFGLENBQWhCO0FBQ0EsU0FBSyxHQUFMLENBQVMsT0FBVCxHQUFtQixFQUFFLE9B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QUFnQixDQUFDLElBQUQsRUFBTyxTQUFQLEVBQWtCLFFBQWxCLEtBQStCO0FBQzdDLE1BQUksT0FBSjtBQUNBLFNBQU8sU0FBUyxTQUFULEdBQXNCO0FBQzNCLFFBQUksTUFBTSxJQUFWO0FBQUEsUUFBZ0IsT0FBTyxTQUF2QjtBQUNBLGFBQVMsT0FBVCxHQUFvQjtBQUNsQixVQUFJLENBQUMsUUFBTCxFQUFlLEtBQUssS0FBTCxDQUFXLEdBQVgsRUFBZ0IsSUFBaEI7QUFDZixnQkFBVSxJQUFWO0FBQ0Q7QUFDRCxRQUFJLE9BQUosRUFBYTtBQUNYLG1CQUFhLE9BQWI7QUFDRCxLQUZELE1BR0ssSUFBSSxRQUFKLEVBQWM7QUFDakIsV0FBSyxLQUFMLENBQVcsR0FBWCxFQUFnQixJQUFoQjtBQUNEO0FBQ0QsY0FBVSxXQUFXLE9BQVgsRUFBb0IsYUFBYSxHQUFqQyxDQUFWO0FBQ0QsR0FiRDtBQWNELENBaEJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IFBhcmFsbGF4Q29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vUGFyYWxsYXhDb2xsZWN0aW9uJyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsYXhCcm8ge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBjb25zdCB7d3JhcHBlciwgZGlzYWJsZVN0eWxlc30gPSB0aGlzLm5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbGxlY3Rpb25zID0gW107XG5cbiAgICB0aGlzLmpRdWVyeSgpO1xuICAgIHRoaXMuY2FjaGVET01FbGVtZW50cyh3cmFwcGVyKTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICBpZiAoIWRpc2FibGVTdHlsZXMpIHtcbiAgICAgIHRoaXMuc3R5bGVET00oKTtcbiAgICB9XG4gIH1cblxuICBhZGRDb2xsZWN0aW9uKHNlbGVjdG9yLCBvYmopIHtcbiAgICB2YXIgY29sbGVjdGlvbjtcbiAgICBjb2xsZWN0aW9uID0gbmV3IFBhcmFsbGF4Q29sbGVjdGlvbihzZWxlY3Rvciwgb2JqKTtcbiAgICB0aGlzLmNvbGxlY3Rpb25zLnB1c2goY29sbGVjdGlvbik7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cblxuICBjYWNoZURPTUVsZW1lbnRzKHdyYXBwZXIpIHtcbiAgICB0aGlzLiRlbCA9IHt9O1xuICAgIHRoaXMuJGVsLndpbiA9ICQod2luZG93KTtcbiAgICB0aGlzLiRlbC5kb2MgPSAkKGRvY3VtZW50KTtcbiAgICB0aGlzLiRlbC5ib2R5ID0gJCgnYm9keScpO1xuICAgIHRoaXMuJGVsLndyYXBwZXIgPSAkKHdyYXBwZXIpO1xuICAgIC8vIHRoaXMuJGVsLmJvZHlIdG1sID0gJCgnYm9keSwgaHRtbCcpO1xuICB9XG5cbiAgc3R5bGVET00oKSB7XG4gICAgdmFyIHtib2R5LCB3cmFwcGVyLCBkb2N9ID0gdGhpcy4kZWw7XG4gICAgYm9keS5jc3MoJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgd3JhcHBlci5jc3MoJ21pbi1oZWlnaHQnLCAnMTAwJScpO1xuICAgIC8vIGRvYy5jaGlsZHJlbigpXG4gICAgLy8gICAuY3NzKCdoZWlnaHQnLCAnMTAwJScpXG4gICAgLy8gICAuYWRkQ2xhc3MoJ3BhcmFsbGF4Jyk7XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIGNvbnN0IHRyYWNrID0gKCkgPT4ge1xuICAgICAgdmFyIHBvc1kgPSB0aGlzLiRlbC53aW5bMF0ucGFnZVlPZmZzZXQ7XG4gICAgICB0aGlzLm1vdmVFbGVtZW50cyhwb3NZKTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0cmFjayk7XG4gICAgfVxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0cmFjayk7XG4gIH1cblxuXG4gIG1vdmVFbGVtZW50cyhwb3NZKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25zO1xuICAgIGNvbGxlY3Rpb25zID0gdGhpcy5jb2xsZWN0aW9ucztcbiAgICBjb2xsZWN0aW9ucy5mb3JFYWNoKGNvbGxlY3Rpb24gPT4gY29sbGVjdGlvbi5tb3ZlRWxlbWVudHMocG9zWSkpO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gIH1cblxuICBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgd3JhcHBlcjogJyNwYXJhbGxheCcsXG4gICAgICBkaXNhYmxlU3R5bGVzOiBmYWxzZSxcbiAgICB9LCBvcHRpb25zKTtcbiAgfVxuXG59XG4iLCJjb25zdCBQYXJhbGxheEVsZW1lbnQgPSByZXF1aXJlKCcuL1BhcmFsbGF4RWxlbWVudCcpO1xuXG52YXIgJDtcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQYXJhbGxheENvbGxlY3Rpb24ge1xuXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yLCBvcHRpb25zKSB7XG4gICAgY29uc3Qge3RvcCwgaGlkZSwgekluZGV4fSA9IHRoaXMubm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKTtcblxuICAgIHRoaXMuJGVsO1xuICAgIHRoaXMuZWxlbWVudHMgPSBbXTtcblxuICAgIHRoaXMudG9wID0gdG9wO1xuICAgIHRoaXMuaGlkZSA9IGhpZGU7XG4gICAgdGhpcy56SW5kZXggPSB6SW5kZXg7XG5cbiAgICB0aGlzLmpRdWVyeSgpO1xuICAgIHRoaXMuc3R5bGVDb2xsZWN0aW9uKCk7XG4gIH1cblxuICBzZXQgaGlkZSh2YWx1ZSkge1xuICAgIHZhciBwcm9wZXJ0eTtcbiAgICBwcm9wZXJ0eSA9IHZhbHVlID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgICBpZiAodGhpcy4kZWwpIHRoaXMuJGVsLmNzcygnZGlzcGxheScsIHByb3BlcnR5KTtcbiAgfVxuXG4gIHNldCB6SW5kZXgodmFsdWUpIHtcbiAgICBpZiAodGhpcy4kZWwpIHRoaXMuJGVsLmNzcygnekluZGV4JywgdmFsdWUpO1xuICB9XG5cbiAgc2V0IHRvcCh2YWx1ZSkge1xuICAgIGlmICh0aGlzLiRlbCkgdGhpcy4kZWwuY3NzKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlWSgke3ZhbHVlfXB4KWApO1xuICB9XG5cbiAgYWRkRWxlbWVudHMob2JqKSB7XG4gICAgdmFyIHNlbGVjdG9ycztcbiAgICBzZWxlY3RvcnMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgIHNlbGVjdG9ycy5mb3JFYWNoKHNlbGVjdG9yID0+IHRoaXMuYWRkRWxlbWVudChzZWxlY3Rvciwgb2JqW3NlbGVjdG9yXSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkRWxlbWVudChzZWxlY3Rvciwgb2JqKSB7XG4gICAgdmFyIGVsZW1lbnQ7XG4gICAgZWxlbWVudCA9IG5ldyBQYXJhbGxheEVsZW1lbnQoc2VsZWN0b3IsIG9iaik7XG4gICAgdGhpcy5lbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbW92ZUVsZW1lbnRzKHBvc1kpIHtcbiAgICB2YXIgZWxlbWVudHM7XG4gICAgZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzO1xuICAgIGVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiBlbGVtZW50Lm1vdmVFbGVtZW50KHBvc1kpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBwYXJhbGxheCBzcGVjaWZpYyBzdHlsaW5nIHRvIHRoZSBjb2xsZWN0aW9uIHdyYXBwZXIgZWxlbWVudC5cbiAgICogQHBhcmFtIHtvYmplY3R9IGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IERPTSBzZWxlY3RvclxuICAgKi9cbiAgc3R5bGVDb2xsZWN0aW9uKGNvbGxlY3Rpb24sIHNlbGVjdG9yKSB7XG4gICAgdmFyICRlbDtcbiAgICAkZWwgPSAkKHNlbGVjdG9yKTtcbiAgICAkZWwuY3NzKHtcbiAgICAgICdwb3NpdGlvbic6ICdyZWxhdGl2ZScsXG4gICAgICAnbWFyZ2luLXRvcCc6ICcwJyxcbiAgICAgICdtYXJnaW4tYm90dG9tJzogJzAnLFxuICAgICAgJ3BhZGRpbmctdG9wJzogJzAnLFxuICAgICAgJ3BhZGRpbmctYm90dG9tJzogJzAnXG4gICAgfSk7XG4gICAgdGhpcy4kZWwgPSAkZWw7XG4gIH1cblxuICBqUXVlcnkoKSB7XG4gICAgJCA9IGpRdWVyeTtcbiAgICBpZiAoISQpIHtcbiAgICAgIHRocm93ICdqUXVlcnkgaXMgbm90IGRlZmluZWQnO1xuICAgIH1cbiAgfVxuXG4gIG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucykge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICB0b3A6IDAsXG4gICAgICBoaWRlOiBmYWxzZSxcbiAgICAgIHpJbmRleDogLTEsXG4gICAgfSwgb3B0aW9ucyk7XG4gIH1cblxufVxuIiwiY29uc3Qge3ByZWZpeH0gPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsbGF4RWxlbWVudCB7XG5cbiAgY29uc3RydWN0b3Ioc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICBjb25zdCB7dG9wLCBoaWRlLCB6SW5kZXgsIHNwZWVkfSA9IHRoaXMubm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKTtcblxuICAgIHRoaXMuJGVsO1xuICAgIHRoaXMucHJlZml4ID0gcHJlZml4KCk7XG5cbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLmhpZGUgPSBoaWRlO1xuICAgIHRoaXMuekluZGV4ID0gekluZGV4O1xuICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcblxuICAgIC8vIHRoaXMucG9zWSA9IDA7XG4gICAgLy8gdGhpcy5sYXN0ID0gZmFsc2U7XG4gICAgLy8gdGhpcy5kZWx0YSAgPSAwO1xuICAgIC8vIHRoaXMudXBkYXRlID0ge307XG5cbiAgICB0aGlzLmpRdWVyeSgpO1xuICAgIHRoaXMuc3R5bGVFbGVtZW50KHNlbGVjdG9yKTtcbiAgfVxuXG4gIHNldCBoaWRlKHZhbHVlKSB7XG4gICAgdmFyIHByb3BlcnR5O1xuICAgIHByb3BlcnR5ID0gdmFsdWUgPyAnYmxvY2snIDogJ25vbmUnO1xuICAgIGlmICh0aGlzLiRlbCkgdGhpcy4kZWwuY3NzKCdkaXNwbGF5JywgcHJvcGVydHkpO1xuICB9XG5cbiAgc2V0IHpJbmRleCh2YWx1ZSkge1xuICAgIGlmICh0aGlzLiRlbCkgdGhpcy4kZWwuY3NzKCd6SW5kZXgnLCB2YWx1ZSk7XG4gIH1cblxuICBzZXQgdG9wKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuJGVsKSB0aGlzLiRlbC5jc3MoJ3RvcCcsIHZhbHVlKydweCcpO1xuICB9XG5cbiAgbW92ZUVsZW1lbnQocG9zWSkge1xuICAgIHZhciAkZWwsIHNwZWVkLCBkZWx0YSwgcHJlZml4O1xuICAgIHByZWZpeCA9IHRoaXMucHJlZml4O1xuICAgICRlbCA9IHRoaXMuJGVsO1xuICAgIHNwZWVkID0gdGhpcy5zcGVlZDtcbiAgICBkZWx0YSA9IHBvc1kqc3BlZWQ7XG4gICAgLy8gY29uc29sZS5sb2coZGVsdGEpO1xuICAgIC8vIGNvbnNvbGUubG9nKHByZWZpeCk7XG4gICAgLy8gJGVsWzBdLnN0eWxlW3ByZWZpeC5kb20gKyAnVHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uJ10gPSBlYXNpbmc7XG4gICAgLy8gJGVsWzBdLnN0eWxlW3ByZWZpeC5kb20gKyAnVHJhbnNpdGlvbkR1cmF0aW9uJ10gPSB0aW1lICsgJ21zJztcbiAgICAkZWxbMF0uc3R5bGVbcHJlZml4LmRvbSArICdUcmFuc2Zvcm0nXSA9IFwidHJhbnNsYXRlWShcIiArIGRlbHRhICsgXCJweCkgdHJhbnNsYXRlWigwKSBzY2FsZSgxKVwiO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IHBhcmFsbGF4IHNwZWNpZmljIHN0eWxpbmcgdG8gZWFjaCBlbGVtZW50IGluIGEgY29sbGVjdGlvbi5cbiAgICogQHBhcmFtICB7b2JqZWN0fSBlbFxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHNlbGVjdG9yXG4gICAqIEBwYXJhbSAge251bWJlcn0gb2Zmc2V0XG4gICAqL1xuICBzdHlsZUVsZW1lbnQoc2VsZWN0b3IpIHtcbiAgICB2YXIgJGVsO1xuICAgICRlbCA9ICQoc2VsZWN0b3IpO1xuICAgICRlbC5jc3Moe1xuICAgICAgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJyxcbiAgICAgICdsZWZ0JzogMCxcbiAgICAgICdyaWdodCc6IDAsXG4gICAgICAnbWFyZ2luLWxlZnQnOiAnYXV0bycsXG4gICAgICAnbWFyZ2luLXJpZ2h0JzogJ2F1dG8nLFxuICAgICAgJ21hcmdpbi10b3AnOiAnMCcsXG4gICAgICAnbWFyZ2luLWJvdHRvbSc6ICcwJyxcbiAgICAgICdwYWRkaW5nLXRvcCc6ICcwJyxcbiAgICAgICdwYWRkaW5nLWJvdHRvbSc6ICcwJyxcbiAgICB9KTtcbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgfVxuXG4gIGpRdWVyeSgpIHtcbiAgICAkID0galF1ZXJ5O1xuICAgIGlmICghJCkge1xuICAgICAgdGhyb3cgJ2pRdWVyeSBpcyBub3QgZGVmaW5lZCc7XG4gICAgfVxuICB9XG5cbiAgbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgIHRvcDogMCxcbiAgICAgIGhpZGU6IGZhbHNlLFxuICAgICAgekluZGV4OiAtMSxcbiAgICAgIHNwZWVkOiAxLFxuICAgIH0sIG9wdGlvbnMpO1xuICB9XG5cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9QYXJhbGxheEJybycpO1xuIiwiY29uc3Qgc2VsZiA9IG1vZHVsZS5leHBvcnRzO1xuXG5zZWxmLnByZWZpeCA9ICgpID0+IHtcbiAgdmFyIHN0eWxlcztcbiAgc3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCAnJyksXG4gICAgcHJlID0gKEFycmF5LnByb3RvdHlwZS5zbGljZVxuICAgICAgLmNhbGwoc3R5bGVzKVxuICAgICAgLmpvaW4oJycpXG4gICAgICAubWF0Y2goLy0obW96fHdlYmtpdHxtcyktLykgfHwgKHN0eWxlcy5PTGluayA9PT0gJycgJiYgWycnLCAnbyddKVxuICAgIClbMV0sXG4gICAgZG9tID0gKCd3ZWJraXR8TW96fE1TfE8nKS5tYXRjaChuZXcgUmVnRXhwKCcoJyArIHByZSArICcpJywgJ2knKSlbMV07XG4gICAgcmV0dXJuIHtcbiAgICAgIGRvbTogZG9tLFxuICAgICAgbG93ZXJjYXNlOiBwcmUsXG4gICAgICBjc3M6ICctJyArIHByZSArICctJyxcbiAgICAgIGpzOiBwcmVbMF0udG9VcHBlckNhc2UoKSArIHByZS5zdWJzdHIoMSlcbiAgICB9O1xufTtcblxuLy8gaHR0cDovL3Vuc2NyaXB0YWJsZS5jb20vMjAwOS8wMy8yMC9kZWJvdW5jaW5nLWphdmFzY3JpcHQtbWV0aG9kcy9cbnNlbGYuZGVib3VuY2UgPSAoZnVuYywgdGhyZXNob2xkLCBleGVjQXNhcCkgPT4ge1xuICB2YXIgdGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uIGRlYm91bmNlZCAoKSB7XG4gICAgdmFyIG9iaiA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgZnVuY3Rpb24gZGVsYXllZCAoKSB7XG4gICAgICBpZiAoIWV4ZWNBc2FwKSBmdW5jLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZXhlY0FzYXApIHtcbiAgICAgIGZ1bmMuYXBwbHkob2JqLCBhcmdzKTtcbiAgICB9XG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQoZGVsYXllZCwgdGhyZXNob2xkIHx8IDEwMCk7XG4gIH07XG59O1xuIl19
