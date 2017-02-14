(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var _this = this;

const ParallaxBro = require('../lib');

const laxbro = new ParallaxBro();

var page1, page2;

page1 = laxbro.addCollection('#collection1', {
  top: 0,
  hide: false
});

page1.addElements({
  '#img1': {
    top: 0,
    speed: .5
  },
  '#img2': {
    top: 400,
    zIndex: 0,
    speed: .8,
    update: {
      0: () => {
        _this.el.fadeIn();
      },
      400: () => {
        _this.el.fadeOut();
      }
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

},{"./ParallaxElement":4}],4:[function(require,module,exports){
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

},{"./utils":6}],5:[function(require,module,exports){
module.exports = require('./ParallaxBro');

},{"./ParallaxBro":2}],6:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmpzIiwibGliL1BhcmFsbGF4QnJvLmpzIiwibGliL1BhcmFsbGF4Q29sbGVjdGlvbi5qcyIsImxpYi9QYXJhbGxheEVsZW1lbnQuanMiLCJsaWIvaW5kZXguanMiLCJsaWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE1BQU0sY0FBYyxRQUFRLFFBQVIsQ0FBcEI7O0FBRUEsTUFBTSxTQUFTLElBQUksV0FBSixFQUFmOztBQUVBLElBQUksS0FBSixFQUFXLEtBQVg7O0FBRUEsUUFBUSxPQUFPLGFBQVAsQ0FBcUIsY0FBckIsRUFBcUM7QUFDM0MsT0FBSyxDQURzQztBQUUzQyxRQUFNO0FBRnFDLENBQXJDLENBQVI7O0FBS0EsTUFBTSxXQUFOLENBQWtCO0FBQ2hCLFdBQVM7QUFDUCxTQUFLLENBREU7QUFFUCxXQUFPO0FBRkEsR0FETztBQUtoQixXQUFTO0FBQ1AsU0FBSyxHQURFO0FBRVAsWUFBUSxDQUZEO0FBR1AsV0FBTyxFQUhBO0FBSVAsWUFBUTtBQUNOLFNBQUcsTUFBTTtBQUNQLGNBQUssRUFBTCxDQUFRLE1BQVI7QUFDRCxPQUhLO0FBSU4sV0FBSyxNQUFNO0FBQ1QsY0FBSyxFQUFMLENBQVEsT0FBUjtBQUNEO0FBTks7QUFKRDtBQUxPLENBQWxCOzs7QUNYQSxNQUFNLHFCQUFxQixRQUFRLHNCQUFSLENBQTNCOztBQUVBLElBQUksQ0FBSjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsTUFBTSxVQUFOLENBQWlCOztBQUVoQyxjQUFZLE9BQVosRUFBcUI7QUFDbkIsVUFBTSxFQUFDLE9BQUQsRUFBVSxhQUFWLEtBQTJCLEtBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsQ0FBakM7O0FBRUEsU0FBSyxXQUFMLEdBQW1CLEVBQW5COztBQUVBLFNBQUssTUFBTDtBQUNBLFNBQUssZ0JBQUwsQ0FBc0IsT0FBdEI7QUFDQSxTQUFLLFVBQUw7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bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBQYXJhbGxheEJybyA9IHJlcXVpcmUoJy4uL2xpYicpO1xuXG5jb25zdCBsYXhicm8gPSBuZXcgUGFyYWxsYXhCcm8oKTtcblxudmFyIHBhZ2UxLCBwYWdlMjtcblxucGFnZTEgPSBsYXhicm8uYWRkQ29sbGVjdGlvbignI2NvbGxlY3Rpb24xJywge1xuICB0b3A6IDAsXG4gIGhpZGU6IGZhbHNlLFxufSk7XG5cbnBhZ2UxLmFkZEVsZW1lbnRzKHtcbiAgJyNpbWcxJzoge1xuICAgIHRvcDogMCxcbiAgICBzcGVlZDogLjUsXG4gIH0sXG4gICcjaW1nMic6IHtcbiAgICB0b3A6IDQwMCxcbiAgICB6SW5kZXg6IDAsXG4gICAgc3BlZWQ6IC44LFxuICAgIHVwZGF0ZToge1xuICAgICAgMDogKCkgPT4ge1xuICAgICAgICB0aGlzLmVsLmZhZGVJbigpO1xuICAgICAgfSxcbiAgICAgIDQwMDogKCkgPT4ge1xuICAgICAgICB0aGlzLmVsLmZhZGVPdXQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuIiwiY29uc3QgUGFyYWxsYXhDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9QYXJhbGxheENvbGxlY3Rpb24nKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxheEJybyB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGNvbnN0IHt3cmFwcGVyLCBkaXNhYmxlU3R5bGVzfSA9IHRoaXMubm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKTtcblxuICAgIHRoaXMuY29sbGVjdGlvbnMgPSBbXTtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5jYWNoZURPTUVsZW1lbnRzKHdyYXBwZXIpO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIGlmICghZGlzYWJsZVN0eWxlcykge1xuICAgICAgdGhpcy5zdHlsZURPTSgpO1xuICAgIH1cbiAgfVxuXG4gIGFkZENvbGxlY3Rpb24oc2VsZWN0b3IsIG9iaikge1xuICAgIHZhciBjb2xsZWN0aW9uO1xuICAgIGNvbGxlY3Rpb24gPSBuZXcgUGFyYWxsYXhDb2xsZWN0aW9uKHNlbGVjdG9yLCBvYmopO1xuICAgIHRoaXMuY29sbGVjdGlvbnMucHVzaChjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuXG4gIGNhY2hlRE9NRWxlbWVudHMod3JhcHBlcikge1xuICAgIHRoaXMuJGVsID0ge307XG4gICAgdGhpcy4kZWwud2luID0gJCh3aW5kb3cpO1xuICAgIHRoaXMuJGVsLmRvYyA9ICQoZG9jdW1lbnQpO1xuICAgIHRoaXMuJGVsLmJvZHkgPSAkKCdib2R5Jyk7XG4gICAgdGhpcy4kZWwud3JhcHBlciA9ICQod3JhcHBlcik7XG4gICAgLy8gdGhpcy4kZWwuYm9keUh0bWwgPSAkKCdib2R5LCBodG1sJyk7XG4gIH1cblxuICBzdHlsZURPTSgpIHtcbiAgICB2YXIge2JvZHksIHdyYXBwZXIsIGRvY30gPSB0aGlzLiRlbDtcbiAgICBib2R5LmNzcygnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICB3cmFwcGVyLmNzcygnbWluLWhlaWdodCcsICcxMDAlJyk7XG4gICAgLy8gZG9jLmNoaWxkcmVuKClcbiAgICAvLyAgIC5jc3MoJ2hlaWdodCcsICcxMDAlJylcbiAgICAvLyAgIC5hZGRDbGFzcygncGFyYWxsYXgnKTtcbiAgfVxuXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgY29uc3QgdHJhY2sgPSAoKSA9PiB7XG4gICAgICB2YXIgcG9zWSA9IHRoaXMuJGVsLndpblswXS5wYWdlWU9mZnNldDtcbiAgICAgIHRoaXMubW92ZUVsZW1lbnRzKHBvc1kpO1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRyYWNrKTtcbiAgICB9XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRyYWNrKTtcbiAgfVxuXG5cbiAgbW92ZUVsZW1lbnRzKHBvc1kpIHtcbiAgICB2YXIgY29sbGVjdGlvbnM7XG4gICAgY29sbGVjdGlvbnMgPSB0aGlzLmNvbGxlY3Rpb25zO1xuICAgIGNvbGxlY3Rpb25zLmZvckVhY2goY29sbGVjdGlvbiA9PiBjb2xsZWN0aW9uLm1vdmVFbGVtZW50cyhwb3NZKSk7XG4gIH1cblxuICBqUXVlcnkoKSB7XG4gICAgJCA9IGpRdWVyeTtcbiAgICBpZiAoISQpIHtcbiAgICAgIHRocm93ICdqUXVlcnkgaXMgbm90IGRlZmluZWQnO1xuICAgIH1cbiAgfVxuXG4gIG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucykge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICB3cmFwcGVyOiAnI3BhcmFsbGF4JyxcbiAgICAgIGRpc2FibGVTdHlsZXM6IGZhbHNlLFxuICAgIH0sIG9wdGlvbnMpO1xuICB9XG5cbn1cbiIsImNvbnN0IFBhcmFsbGF4RWxlbWVudCA9IHJlcXVpcmUoJy4vUGFyYWxsYXhFbGVtZW50Jyk7XG5cbnZhciAkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBhcmFsbGF4Q29sbGVjdGlvbiB7XG5cbiAgY29uc3RydWN0b3Ioc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICBjb25zdCB7dG9wLCBoaWRlLCB6SW5kZXh9ID0gdGhpcy5ub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgdGhpcy4kZWw7XG4gICAgdGhpcy5lbGVtZW50cyA9IFtdO1xuXG4gICAgdGhpcy50b3AgPSB0b3A7XG4gICAgdGhpcy5oaWRlID0gaGlkZTtcbiAgICB0aGlzLnpJbmRleCA9IHpJbmRleDtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5zdHlsZUNvbGxlY3Rpb24oKTtcbiAgfVxuXG4gIHNldCBoaWRlKHZhbHVlKSB7XG4gICAgdmFyIHByb3BlcnR5O1xuICAgIHByb3BlcnR5ID0gdmFsdWUgPyAnYmxvY2snIDogJ25vbmUnO1xuICAgIGlmICh0aGlzLiRlbCkgdGhpcy4kZWwuY3NzKCdkaXNwbGF5JywgcHJvcGVydHkpO1xuICB9XG5cbiAgc2V0IHpJbmRleCh2YWx1ZSkge1xuICAgIGlmICh0aGlzLiRlbCkgdGhpcy4kZWwuY3NzKCd6SW5kZXgnLCB2YWx1ZSk7XG4gIH1cblxuICBzZXQgdG9wKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuJGVsKSB0aGlzLiRlbC5jc3MoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGVZKCR7dmFsdWV9cHgpYCk7XG4gIH1cblxuICBhZGRFbGVtZW50cyhvYmopIHtcbiAgICB2YXIgc2VsZWN0b3JzO1xuICAgIHNlbGVjdG9ycyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgc2VsZWN0b3JzLmZvckVhY2goc2VsZWN0b3IgPT4gdGhpcy5hZGRFbGVtZW50KHNlbGVjdG9yLCBvYmpbc2VsZWN0b3JdKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhZGRFbGVtZW50KHNlbGVjdG9yLCBvYmopIHtcbiAgICB2YXIgZWxlbWVudDtcbiAgICBlbGVtZW50ID0gbmV3IFBhcmFsbGF4RWxlbWVudChzZWxlY3Rvciwgb2JqKTtcbiAgICB0aGlzLmVsZW1lbnRzLnB1c2goZWxlbWVudCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBtb3ZlRWxlbWVudHMocG9zWSkge1xuICAgIHZhciBlbGVtZW50cztcbiAgICBlbGVtZW50cyA9IHRoaXMuZWxlbWVudHM7XG4gICAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IGVsZW1lbnQubW92ZUVsZW1lbnQocG9zWSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IHBhcmFsbGF4IHNwZWNpZmljIHN0eWxpbmcgdG8gdGhlIGNvbGxlY3Rpb24gd3JhcHBlciBlbGVtZW50LlxuICAgKiBAcGFyYW0ge29iamVjdH0gY29sbGVjdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gRE9NIHNlbGVjdG9yXG4gICAqL1xuICBzdHlsZUNvbGxlY3Rpb24oY29sbGVjdGlvbiwgc2VsZWN0b3IpIHtcbiAgICB2YXIgJGVsO1xuICAgICRlbCA9ICQoc2VsZWN0b3IpO1xuICAgICRlbC5jc3Moe1xuICAgICAgJ3Bvc2l0aW9uJzogJ3JlbGF0aXZlJyxcbiAgICAgICdtYXJnaW4tdG9wJzogJzAnLFxuICAgICAgJ21hcmdpbi1ib3R0b20nOiAnMCcsXG4gICAgICAncGFkZGluZy10b3AnOiAnMCcsXG4gICAgICAncGFkZGluZy1ib3R0b20nOiAnMCdcbiAgICB9KTtcbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgfVxuXG4gIGpRdWVyeSgpIHtcbiAgICAkID0galF1ZXJ5O1xuICAgIGlmICghJCkge1xuICAgICAgdGhyb3cgJ2pRdWVyeSBpcyBub3QgZGVmaW5lZCc7XG4gICAgfVxuICB9XG5cbiAgbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgIHRvcDogMCxcbiAgICAgIGhpZGU6IGZhbHNlLFxuICAgICAgekluZGV4OiAtMSxcbiAgICB9LCBvcHRpb25zKTtcbiAgfVxuXG59XG4iLCJjb25zdCB7cHJlZml4fSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyICQ7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFyYWxsYXhFbGVtZW50IHtcblxuICBjb25zdHJ1Y3RvcihzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIGNvbnN0IHt0b3AsIGhpZGUsIHpJbmRleCwgc3BlZWR9ID0gdGhpcy5ub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgdGhpcy4kZWw7XG4gICAgdGhpcy5wcmVmaXggPSBwcmVmaXgoKTtcblxuICAgIHRoaXMudG9wID0gdG9wO1xuICAgIHRoaXMuaGlkZSA9IGhpZGU7XG4gICAgdGhpcy56SW5kZXggPSB6SW5kZXg7XG4gICAgdGhpcy5zcGVlZCA9IHNwZWVkO1xuXG4gICAgLy8gdGhpcy5wb3NZID0gMDtcbiAgICAvLyB0aGlzLmxhc3QgPSBmYWxzZTtcbiAgICAvLyB0aGlzLmRlbHRhICA9IDA7XG4gICAgLy8gdGhpcy51cGRhdGUgPSB7fTtcblxuICAgIHRoaXMualF1ZXJ5KCk7XG4gICAgdGhpcy5zdHlsZUVsZW1lbnQoc2VsZWN0b3IpO1xuICB9XG5cbiAgc2V0IGhpZGUodmFsdWUpIHtcbiAgICB2YXIgcHJvcGVydHk7XG4gICAgcHJvcGVydHkgPSB2YWx1ZSA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgaWYgKHRoaXMuJGVsKSB0aGlzLiRlbC5jc3MoJ2Rpc3BsYXknLCBwcm9wZXJ0eSk7XG4gIH1cblxuICBzZXQgekluZGV4KHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuJGVsKSB0aGlzLiRlbC5jc3MoJ3pJbmRleCcsIHZhbHVlKTtcbiAgfVxuXG4gIHNldCB0b3AodmFsdWUpIHtcbiAgICBpZiAodGhpcy4kZWwpIHRoaXMuJGVsLmNzcygndG9wJywgdmFsdWUrJ3B4Jyk7XG4gIH1cblxuICBtb3ZlRWxlbWVudChwb3NZKSB7XG4gICAgdmFyICRlbCwgc3BlZWQsIGRlbHRhLCBwcmVmaXg7XG4gICAgcHJlZml4ID0gdGhpcy5wcmVmaXg7XG4gICAgJGVsID0gdGhpcy4kZWw7XG4gICAgc3BlZWQgPSB0aGlzLnNwZWVkO1xuICAgIGRlbHRhID0gcG9zWSpzcGVlZDtcbiAgICAvLyBjb25zb2xlLmxvZyhkZWx0YSk7XG4gICAgLy8gY29uc29sZS5sb2cocHJlZml4KTtcbiAgICAvLyAkZWxbMF0uc3R5bGVbcHJlZml4LmRvbSArICdUcmFuc2l0aW9uVGltaW5nRnVuY3Rpb24nXSA9IGVhc2luZztcbiAgICAvLyAkZWxbMF0uc3R5bGVbcHJlZml4LmRvbSArICdUcmFuc2l0aW9uRHVyYXRpb24nXSA9IHRpbWUgKyAnbXMnO1xuICAgICRlbFswXS5zdHlsZVtwcmVmaXguZG9tICsgJ1RyYW5zZm9ybSddID0gXCJ0cmFuc2xhdGVZKFwiICsgZGVsdGEgKyBcInB4KSB0cmFuc2xhdGVaKDApIHNjYWxlKDEpXCI7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgcGFyYWxsYXggc3BlY2lmaWMgc3R5bGluZyB0byBlYWNoIGVsZW1lbnQgaW4gYSBjb2xsZWN0aW9uLlxuICAgKiBAcGFyYW0gIHtvYmplY3R9IGVsXG4gICAqIEBwYXJhbSAge3N0cmluZ30gc2VsZWN0b3JcbiAgICogQHBhcmFtICB7bnVtYmVyfSBvZmZzZXRcbiAgICovXG4gIHN0eWxlRWxlbWVudChzZWxlY3Rvcikge1xuICAgIHZhciAkZWw7XG4gICAgJGVsID0gJChzZWxlY3Rvcik7XG4gICAgJGVsLmNzcyh7XG4gICAgICAncG9zaXRpb24nOiAnYWJzb2x1dGUnLFxuICAgICAgJ2xlZnQnOiAwLFxuICAgICAgJ3JpZ2h0JzogMCxcbiAgICAgICdtYXJnaW4tbGVmdCc6ICdhdXRvJyxcbiAgICAgICdtYXJnaW4tcmlnaHQnOiAnYXV0bycsXG4gICAgICAnbWFyZ2luLXRvcCc6ICcwJyxcbiAgICAgICdtYXJnaW4tYm90dG9tJzogJzAnLFxuICAgICAgJ3BhZGRpbmctdG9wJzogJzAnLFxuICAgICAgJ3BhZGRpbmctYm90dG9tJzogJzAnLFxuICAgIH0pO1xuICAgIHRoaXMuJGVsID0gJGVsO1xuICB9XG5cbiAgalF1ZXJ5KCkge1xuICAgICQgPSBqUXVlcnk7XG4gICAgaWYgKCEkKSB7XG4gICAgICB0aHJvdyAnalF1ZXJ5IGlzIG5vdCBkZWZpbmVkJztcbiAgICB9XG4gIH1cblxuICBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgdG9wOiAwLFxuICAgICAgaGlkZTogZmFsc2UsXG4gICAgICB6SW5kZXg6IC0xLFxuICAgICAgc3BlZWQ6IDEsXG4gICAgfSwgb3B0aW9ucyk7XG4gIH1cblxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL1BhcmFsbGF4QnJvJyk7XG4iLCJjb25zdCBzZWxmID0gbW9kdWxlLmV4cG9ydHM7XG5cbnNlbGYucHJlZml4ID0gKCkgPT4ge1xuICB2YXIgc3R5bGVzO1xuICBzdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsICcnKSxcbiAgICBwcmUgPSAoQXJyYXkucHJvdG90eXBlLnNsaWNlXG4gICAgICAuY2FsbChzdHlsZXMpXG4gICAgICAuam9pbignJylcbiAgICAgIC5tYXRjaCgvLShtb3p8d2Via2l0fG1zKS0vKSB8fCAoc3R5bGVzLk9MaW5rID09PSAnJyAmJiBbJycsICdvJ10pXG4gICAgKVsxXSxcbiAgICBkb20gPSAoJ3dlYmtpdHxNb3p8TVN8TycpLm1hdGNoKG5ldyBSZWdFeHAoJygnICsgcHJlICsgJyknLCAnaScpKVsxXTtcbiAgICByZXR1cm4ge1xuICAgICAgZG9tOiBkb20sXG4gICAgICBsb3dlcmNhc2U6IHByZSxcbiAgICAgIGNzczogJy0nICsgcHJlICsgJy0nLFxuICAgICAganM6IHByZVswXS50b1VwcGVyQ2FzZSgpICsgcHJlLnN1YnN0cigxKVxuICAgIH07XG59O1xuXG4vLyBodHRwOi8vdW5zY3JpcHRhYmxlLmNvbS8yMDA5LzAzLzIwL2RlYm91bmNpbmctamF2YXNjcmlwdC1tZXRob2RzL1xuc2VsZi5kZWJvdW5jZSA9IChmdW5jLCB0aHJlc2hvbGQsIGV4ZWNBc2FwKSA9PiB7XG4gIHZhciB0aW1lb3V0O1xuICByZXR1cm4gZnVuY3Rpb24gZGVib3VuY2VkICgpIHtcbiAgICB2YXIgb2JqID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICBmdW5jdGlvbiBkZWxheWVkICgpIHtcbiAgICAgIGlmICghZXhlY0FzYXApIGZ1bmMuYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGltZW91dCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIH1cbiAgICBlbHNlIGlmIChleGVjQXNhcCkge1xuICAgICAgZnVuYy5hcHBseShvYmosIGFyZ3MpO1xuICAgIH1cbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dChkZWxheWVkLCB0aHJlc2hvbGQgfHwgMTAwKTtcbiAgfTtcbn07XG4iXX0=
