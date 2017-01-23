(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// sleepyhead
// optmize scripts css/js

// revert old top. element top === element top + collectyion top. makes things easier cuz u don't need to passs offset
// bug: negative speed and negative top makes top positive.
// zindex should be optional and not update dom if not passed.
// refactor normalize collection
// Parallax element extends parallax collection prototype. parllax element prototype adds 1 more method for delta.
// update method and init method should be keyed like the hide,zindex,and top methods.
// maybe cache style property on element like iscroll
// @todo test to work with element with negative speed and zero speed.
// Make all JS, no jQuery
// init method is messy
// test touch detection
// hack to hide headlines when clicking read more.
// min-height: 100%;
// height: auto !important;
// height:100%

var Parallax = function ($, win, doc, undefined) {

  /**
   * Private properties.
   */
  var o = {},
      collections = {},
      callbacks = [],
      resize = [],
      $win = $(win),
      $doc = $(doc),
      top = 0,
      isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0,
      winHeight = win.innerHeight,
      // The height of the window.
  wrapperHeight,
      $body,
      $wrapper; // The height of the Parallax wrapper.

  var styleDOM = function (selector) {
    $body = $('body');
    $wrapper = $(selector);
    $bodyHtml = $('body, html');

    $body.css('height', '100%');
    $wrapper.css('min-height', '100%');
    $doc.children().css('height', '100%').addClass('Parallax');
  };

  /**
   * Constuctor function.
   */
  var ParallaxElement = function (obj) {
    var hide = obj.hide || false,
        last = obj.last || false,
        top = obj.top || 0,
        zIndex = typeof obj.zIndex !== 'undefined' ? obj.zIndex : -1,
        posY = 0,
        delta = 0;

    this.speed = typeof obj.speed !== 'undefined' ? obj.speed : 1;
    this.update = obj.update || {};
    this.el = obj.el;

    if (typeof obj.init === 'function') this.init = obj.init;

    Object.defineProperties(this, {
      'posY': {
        get: function () {
          return posY;
        },
        set: function (value) {
          posY = value;
        }
      },
      'hide': {
        get: function () {
          return hide;
        },
        set: function (value) {
          hide = value;
          if (this.el.length > 0) this.el[0].style.display = hide ? 'none' : 'block';
        }
      },
      'zIndex': {
        get: function () {
          return zIndex;
        },
        set: function (value) {
          zIndex = value;
          if (this.el.length > 0) this.el[0].style.zIndex = zIndex;
        }
      },
      'top': {
        get: function () {
          return top;
        },
        set: function (value) {
          top = value;
          if (this.el.length > 0) this.el.css('top', top);
        }
      },
      'delta': {
        get: function () {
          return delta;
        },
        set: function (value) {
          delta = value;
        }
      },
      'last': {
        get: function () {
          return last;
        },
        set: function (value) {
          last = value;
        }
      }

    });
  };

  /**
   * Constuctor function.
   */
  var ParallaxCollection = function (obj) {
    var zIndex = typeof obj.zIndex !== 'undefined' ? obj.zIndex : -1,
        top = obj.top || 0,
        hide = obj.hide || false;

    this.elements = obj.elements || {};
    this.el = obj.el;

    Object.defineProperties(this, {
      'hide': {
        get: function () {
          return hide;
        },
        set: function (value) {
          hide = value;
          if (this.el.length > 0) this.el[0].style.display = hide ? 'none' : 'block';
        }
      },
      'zIndex': {
        get: function () {
          return zIndex;
        },
        set: function (value) {
          zIndex = value;
          if (this.el.length > 0) this.el[0].style.zIndex = zIndex;
        }
      },
      'top': {
        get: function () {
          return top;
        },
        set: function (value) {
          top = value;
          if (this.el.length > 0) this.el.css('top', top);
        }
      }
    });
  };

  var prefix = function () {
    var styles = window.getComputedStyle(document.documentElement, ''),
        pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1],
        dom = 'webkit|Moz|MS|O'.match(new RegExp('(' + pre + ')', 'i'))[1];
    return {
      dom: dom,
      lowercase: pre,
      css: '-' + pre + '-',
      js: pre[0].toUpperCase() + pre.substr(1)
    };
  }();

  /**
   * Public properties.
   */
  o.width = win.innerWidth;
  Object.defineProperties(o, {
    'wrapperHeight': {
      get: function () {
        return wrapperHeight;
      },
      set: function (value) {
        wrapperHeight = value;
        var css = {};
        css.height = wrapperHeight ? wrapperHeight : '';
        css.overflow = wrapperHeight ? 'hidden' : '';
        $wrapper.css(css);
      }
    }
  });

  /**
   * Private methods.
   */

  // http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
    var timeout;
    return function debounced() {
      var obj = this,
          args = arguments;
      function delayed() {
        if (!execAsap) func.apply(obj, args);
        timeout = null;
      }
      if (timeout) clearTimeout(timeout);else if (execAsap) func.apply(obj, args);
      timeout = setTimeout(delayed, threshold || 100);
    };
  };

  /**
   * Move elements on the Y axis using CSS (perfered)
   * or via position top.
   * @param {object} el element in a collection
   * @param {number} delta the marginal increase/decrease to move
   * @param {number} moveTo value stored in the element's obj as current posY.
   * @param {number} time
   * @param {string} easing cubic bezier easing function.
   */
  var move = function (el, delta, moveTo, time, easing) {
    el.delta = el.delta + delta;
    el.el[0].style[prefix.dom + 'TransitionTimingFunction'] = easing;
    el.el[0].style[prefix.dom + 'TransitionDuration'] = time + 'ms';
    el.el[0].style[prefix.dom + 'Transform'] = "translateY(" + el.delta + "px) translateZ(0) scale(1)";

    // Update object's state.
    el.posY = moveTo;
  };

  /**
   * Gets the number of units to move an element based on
   * it's previous position Y , speed, and new position Y.
   * @param {number} speed the rate at which to move
   * @param {number} moveFrom the last known position relative to the top
   * @param {number} moveTo
   * @return {number}
   */
  var calcDistance = function (speed, moveFrom, moveTo) {
    return (moveTo - moveFrom) * (1 - speed);
    // return ((moveTo-moveFrom)*speed) - (moveTo - moveFrom);
  };

  /**
   * Execute update callback for an element.
   * @param  {el} obj.
   * @param  {posY} number.
   * @param {number} time
   * @param {string} easing cubic bezier easing function.
   */
  var execElement = function (el, posY, time, easing) {
    // A problem  occurs when elements change speed and/or direction.
    // You are moving an element at a rate of 2, and you set the element
    // to move at a rate of 3 when the user scrolls past 800px, the move function
    // will not be called exactly on every breakpoint. It could be called at 790px
    // and next on 805px. When called at 805px, the element would move 15px
    // at a new speed. This is the issue.

    // Sort keys array in ASC when scrolling down, and DESC when scrolling up.
    var bp,
        prevBp,
        keys = Object.keys(el.update).sort(function (a, b) {
      return posY < el.posY ? b - a : a - b;
    });

    for (var i = 0, len = keys.length; i < len; i += 1) {
      bp = keys[i];
      prevBp = keys[i + 1] ? keys[i + 1] : null;

      // If we are scrolling down.
      if (posY > el.posY && bp > el.posY && bp <= posY) {
        move.call(o, el, calcDistance(el.speed, el.posY, bp), bp, time, easing);
        el.update[bp].call(el);
      }
      // If we are scrolling up.
      if (posY < el.posY && prevBp && bp < el.posY && bp >= posY) {
        move.call(o, el, calcDistance(el.speed, el.posY, bp), bp, time, easing);
        el.update[prevBp].call(el);
      }
    }
  };

  /**
   * Register each element using the o.addCallback method.
   * @param  {object} element
   */
  var bindElement = function (el) {
    o.addCallback(function (posY, time, easing) {
      if (Object.keys(el.update).length > 0) execElement(el, posY, time, easing);
      move.call(o, el, calcDistance(el.speed, el.posY, posY), posY, time, easing);
    });
  };

  /**
   * Apply parallax specific styling to the collection wrapper element.
   * @param {object} collection
   * @param {string} DOM selector
   */
  var styleCollection = function (collection, selector) {
    var css = {
      'position': 'relative', // Use relative positioning to preserve child element alignment.
      'margin-top': '0',
      'margin-bottom': '0',
      'padding-top': '0',
      'padding-bottom': '0'
    };

    // Add styling to the collection element.
    collection.el = $(selector).css(css);
  };

  /**
   * Apply parallax specific styling to each element in a collection.
   * @param  {object} el
   * @param  {string} selector
   * @param  {number} offset
   */
  var styleElement = function (el, selector) {
    // Add basic parallax styling.
    var css = {
      'position': 'absolute',
      'left': 0,
      'right': 0,
      'margin-left': 'auto',
      'margin-right': 'auto',
      'margin-top': '0',
      'margin-bottom': '0',
      'padding-top': '0',
      'padding-bottom': '0'
    };

    // Add jQuery DOM reference
    el.el = $(selector).css(css);
  };

  /**
   * Get the current value for a object property such as
   * speed, top, zIndex, and hide.
   * @param  {mixed} value object or string of an element property.
   * @param  {number} width width of browser window.
   * @return {curry function}
   */
  var getVal = function (value) {
    return function (width) {
      if (typeof value !== 'object') return value;
      var keys = Object.keys(value);
      for (var i = 0, len = keys.length; i < len; i += 1) {
        if (width >= parseInt(keys[len - i - 1], 10)) return value[keys[len - i - 1]];
      }
    };
  };

  /**
   * Magic.
   * @param  {object} el
   * @return {number} offset
   */
  var normalizeCollection = function (el) {
    var hide = getVal(el.hide),
        zIndex = getVal(el.zIndex),
        top = getVal(el.top);

    el.hide = hide(o.width);
    el.zIndex = zIndex(o.width);
    el.top = top(o.width);

    o.onResize(function () {
      el.hide = hide(o.width);
      el.zIndex = zIndex(o.width);
      el.top = top(o.width);
    });
  };

  /**
   * Magic.
   * @param  {object} el
   * @return {number} offset
   */
  var normalizeElement = function (el, offset) {
    var speed = getVal(el.speed),
        hide = getVal(el.hide),
        zIndex = getVal(el.zIndex),
        top = getVal(el.top);

    el.speed = speed(o.width);
    el.hide = hide(o.width);
    el.zIndex = zIndex(o.width);
    el.top = el.speed !== 0 ? top(o.width) * el.speed : top(o.width);

    o.onResize(function () {
      el.speed = speed(o.width);
      el.hide = hide(o.width);
      el.zIndex = zIndex(o.width);
      el.top = el.speed !== 0 ? top(o.width) * el.speed : top(o.width);
      // if ( typeof el.init !== 'undefined' )
      //   el.init.call(el);
    });

    // Reset inital values.
    if (Object.keys(el.update).length > 0 && typeof el.update[0] === 'undefined') {
      el.update[0] = function () {
        el.speed = speed(o.width);
        el.hide = hide(o.width);
        el.zIndex = zIndex(o.width);
        el.top = el.speed !== 0 ? top(o.width) * el.speed : top(o.width);
      };
    }
  };

  /**
   * Dynamically set the wrapper height. Will adjust on resize.
   * @param {object} el
   * @param {number} offset Collection offset top
   */
  var setWrapperHeight = function (el, offset) {
    var elementHeight;
    o.addCallback(function (posY) {
      if (o.wrapperHeight) return;
      // For some reason if I initialize height outside this fn the value will be incorrect. DOM not ready?
      if (!elementHeight) elementHeight = el.el.height();
      // var distFromTop = el.top + el.delta + offset - posY;
      var distFromTop = el.el.offset().top - posY;
      var pxFromBottom = elementHeight - winHeight + distFromTop;
      if (pxFromBottom <= 0) {
        o.wrapperHeight = posY + winHeight + pxFromBottom;
      }
    });

    o.onResize(function () {
      o.wrapperHeight = null;
    });
  };

  var initParallax = function () {
    for (var i in collections) {
      // Collection.
      styleCollection(collections[i], i);
      collections[i] = new ParallaxCollection(collections[i]);
      normalizeCollection(collections[i]);

      // Elements.
      var elements = collections[i].elements;
      for (var ii in elements) {
        styleElement(elements[ii], ii);
        elements[ii] = new ParallaxElement(elements[ii]);
        normalizeElement(elements[ii], collections[i].top);
        bindElement(elements[ii]);

        // Set wrapper height
        if (elements[ii].last) setWrapperHeight.call(o, elements[ii], collections[i].top);

        // Call update, and init methods on page load if they apply.
        if (typeof elements[ii].init === 'function') elements[ii].init.call(elements[ii]);
        if (typeof elements[ii].update[0] !== 'undefined') elements[ii].update[0].call(elements[ii]);
      }
    }
  };

  /**
   * Style iScroll wrapper and first child.
   * @param  {string} selector id or class
   */
  var styleIscroll = function (el) {
    // Style DOM for iScroll.
    $doc.children().css('-ms-touch-action', 'none');
    $body.css('overflow', 'hidden');

    el.css({
      'position': 'absolute',
      'zIndex': 3,
      'width': '100%',
      'top': 0,
      'bottom': 0,
      'left': 0,
      'overflow': 'hidden'
    }).children(':first-child').css({
      'position': 'absolute',
      'z-index': '3',
      'width': '100%',
      'height': '20000px',
      'overflow': 'hidden',
      '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
      '-webkit-transform': 'translateZ(0)',
      '-moz-transform': 'translateZ(0)',
      '-ms-transform': 'translateZ(0)',
      '-o-transform': 'translateZ(0)',
      'transform': 'translateZ(0)',
      '-webkit-touch-callout': 'none',
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      '-ms-user-select': 'none',
      'user-select': 'none',
      '-webkit-text-size-adjust': 'none',
      '-moz-text-size-adjust': 'none',
      '-ms-text-size-adjust': 'none',
      '-o-text-size-adjust': 'none',
      'text-size-adjust': 'none'
    });
  };

  var initIScroll = function (el) {
    // Create an iScroll instance.
    var scroll = new IScroll(el.selector, { mouseWheel: false });

    // Modify prototype to execute parallax callbacks on scroll.
    IScroll.prototype._translate = function (x, y) {
      if (this.options.useTransform) {
        this.scrollerStyle[prefix.dom + 'Transform'] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;
      } else {
        x = Math.round(x);
        y = Math.round(y);
        this.scrollerStyle.left = x + 'px';
        this.scrollerStyle.top = y + 'px';
      }
      this.x = x;
      this.y = y;

      // Negate y. iScroll says 100px from top === -100px. We want it to be 100px.
      execCallbacks(-y, parseInt(this.scrollerStyle.transitionDuration, 10) || 0, this.scrollerStyle.transitionTimingFunction);
    };

    styleIscroll(el);

    // Disable touch events.
    doc.addEventListener('touchmove', function (e) {
      e.preventDefault();
    }, false);
    return scroll;
  };

  /**
   * Add a counter to the browser to display the number of pixels
   * that have been scrolled.
   */
  var initDebugger = function () {
    $body.append('<p class="parallax-debugger">0</p>');

    o.debugger = $('.parallax-debugger').css({
      'position': 'fixed',
      'top': '0',
      'right': '0',
      'font-size': '24px',
      'color': 'white',
      'background': 'black',
      'padding': '20px',
      'z-index': '100000'
    });

    o.addCallback(function (posY) {
      o.debugger.html(Math.round(posY));
    });
  };

  var execCallbacks = function (posY, time, easing) {
    callbacks.forEach(function (fn) {
      fn.call(o, posY, time, easing);
    });
  };

  /**
   * Public methods.
   */
  o.getElement = function (selector) {
    for (var i in collections) {
      if (collections[i].elements[selector]) return collections[i].elements[selector];
    }
    return null;
  };

  o.addCollection = function (collection) {
    collections[Object.keys(collection).toString()] = collection[Object.keys(collection)];
    return o;
  };

  o.onResize = function (fn) {
    resize.push(fn);
    return o;
  };

  o.addCallback = function (fn) {
    callbacks.push(fn);
    return o;
  };

  o.scrollTo = function (posY, time) {
    if (isTouch) {
      o.iscroll.scrollTo(0, posY, time || 0);
    } else {
      // body selector no work in firefox.
      $bodyHtml.animate({
        scrollTop: posY + 'px'
      }, time);
    }
    return o;
  };

  o.scrollToElement = function (el, time, offset) {
    if (isTouch) {
      o.iscroll.scrollToElement(el.el.selector, time || 0);
    } else {
      var toMove = (el.el.offset().top - win.pageYOffset) / el.speed - (offset || 0);
      o.scrollTo(win.pageYOffset + toMove, time || 0);
    }
    return o;
  };

  o.init = function (selector, options) {
    $doc.on('ready', function () {

      styleDOM(selector);
      initParallax();

      if (isTouch) {
        o.iscroll = initIScroll($wrapper);
        o.iscroll.refresh(); // @hack
        o.onResize(function () {
          o.iscroll.refresh();
        });
      }

      if (options.debug) initDebugger();
    });

    // Respond to scroll events.
    if (!isTouch) $win.on('scroll', function (e) {
      execCallbacks(win.pageYOffset, 0, 'cubic-bezier(0.1, 0.57, 0.1, 1)');
    });

    // Resize recalculations.
    o.onResize(function () {
      o.width = win.innerWidth;
      winHeight = win.innerHeight;
    });

    var debouncedResize = debounce(function () {
      resize.forEach(function (fn) {
        fn.call(o);
      });
    }, 100);
    $win.on('resize', debouncedResize);

    return o;
  };

  return o;
}(jQuery, window, document);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTs7QUFFSixJQUFJLFdBQVksVUFBUyxDQUFULEVBQVksR0FBWixFQUFpQixHQUFqQixFQUFzQixTQUF0QixFQUFpQzs7QUFFL0M7OztBQUdBLE1BQUksSUFBYyxFQUFsQjtBQUFBLE1BQ0ksY0FBYyxFQURsQjtBQUFBLE1BRUksWUFBYyxFQUZsQjtBQUFBLE1BR0ksU0FBYyxFQUhsQjtBQUFBLE1BSUksT0FBYyxFQUFFLEdBQUYsQ0FKbEI7QUFBQSxNQUtJLE9BQWMsRUFBRSxHQUFGLENBTGxCO0FBQUEsTUFNSSxNQUFjLENBTmxCO0FBQUEsTUFPSSxVQUFnQixrQkFBa0IsTUFBbkIsSUFBK0IsVUFBVSxnQkFBVixHQUE2QixDQVAvRTtBQUFBLE1BUUksWUFBYyxJQUFJLFdBUnRCO0FBQUEsTUFRbUM7QUFDL0IsZUFUSjtBQUFBLE1BU21CLEtBVG5CO0FBQUEsTUFTMEIsUUFUMUIsQ0FMK0MsQ0FjWDs7QUFFcEMsTUFBSSxXQUFXLFVBQVUsUUFBVixFQUFxQjtBQUNsQyxZQUFZLEVBQUUsTUFBRixDQUFaO0FBQ0EsZUFBWSxFQUFFLFFBQUYsQ0FBWjtBQUNBLGdCQUFZLEVBQUUsWUFBRixDQUFaOztBQUVBLFVBQU0sR0FBTixDQUFVLFFBQVYsRUFBb0IsTUFBcEI7QUFDQSxhQUFTLEdBQVQsQ0FBYSxZQUFiLEVBQTJCLE1BQTNCO0FBQ0EsU0FBSyxRQUFMLEdBQ0csR0FESCxDQUNPLFFBRFAsRUFDaUIsTUFEakIsRUFFRyxRQUZILENBRVksVUFGWjtBQUdELEdBVkQ7O0FBWUE7OztBQUdBLE1BQUksa0JBQWtCLFVBQVUsR0FBVixFQUFnQjtBQUNwQyxRQUFJ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QUFDRCxHQVREOztBQVdBLElBQUUsSUFBRixHQUFTLFVBQVUsUUFBVixFQUFvQixPQUFwQixFQUE4QjtBQUNyQyxTQUFLLEVBQUwsQ0FBUSxPQUFSLEVBQWlCLFlBQVc7O0FBRTFCLGVBQVMsUUFBVDtBQUNBOztBQUVBLFVBQUssT0FBTCxFQUFlO0FBQ2IsVUFBRSxPQUFGLEdBQVksWUFBYSxRQUFiLENBQVo7QUFDQSxVQUFFLE9BQUYsQ0FBVSxPQUFWLEdBRmEsQ0FFUTtBQUNyQixVQUFFLFFBQUYsQ0FBVyxZQUFVO0FBQ25CLFlBQUUsT0FBRixDQUFVLE9BQVY7QUFDRCxTQUZEO0FBR0Q7O0FBRUQsVUFBSyxRQUFRLEtBQWIsRUFBcUI7QUFDdEIsS0FkRDs7QUFnQkE7QUFDQSxRQUFLLENBQUMsT0FBTixFQUNFLEtBQUssRUFBTCxDQUFRLFFBQVIsRUFBa0IsVUFBUyxDQUFULEVBQVk7QUFDNUIsb0JBQWUsSUFBSSxXQUFuQixFQUFnQyxDQUFoQyxFQUFtQyxpQ0FBbkM7QUFDRCxLQUZEOztBQUlGO0FBQ0EsTUFBRSxRQUFGLENBQVcsWUFBVztBQUNwQixRQUFFLEtBQUYsR0FBVSxJQUFJLFVBQWQ7QUFDQSxrQkFBWSxJQUFJLFdBQWhCO0FBQ0QsS0FIRDs7QUFLQSxRQUFJLGtCQUFrQixTQUFTLFlBQVc7QUFDeEMsYUFBTyxPQUFQLENBQWdCLFVBQVMsRUFBVCxFQUFhO0FBQzNCLFdBQUcsSUFBSCxDQUFRLENBQVI7QUFDRCxPQUZEO0FBR0QsS0FKcUIsRUFJbkIsR0FKbUIsQ0FBdEI7QUFLQSxTQUFLLEVBQUwsQ0FBUSxRQUFSLEVBQWtCLGVBQWxCOztBQUVBLFdBQU8sQ0FBUDtBQUNELEdBckNEOztBQXVDQSxTQUFPLENBQVA7QUFFRCxDQXpuQmUsQ0F5bkJkLE1Bem5CYyxFQXluQk4sTUF6bkJNLEVBeW5CRSxRQXpuQkYsQ0FBaEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gc2xlZXB5aGVhZFxuLy8gb3B0bWl6ZSBzY3JpcHRzIGNzcy9qc1xuXG4vLyByZXZlcnQgb2xkIHRvcC4gZWxlbWVudCB0b3AgPT09IGVsZW1lbnQgdG9wICsgY29sbGVjdHlpb24gdG9wLiBtYWtlcyB0aGluZ3MgZWFzaWVyIGN1eiB1IGRvbid0IG5lZWQgdG8gcGFzc3Mgb2Zmc2V0XG4vLyBidWc6IG5lZ2F0aXZlIHNwZWVkIGFuZCBuZWdhdGl2ZSB0b3AgbWFrZXMgdG9wIHBvc2l0aXZlLlxuLy8gemluZGV4IHNob3VsZCBiZSBvcHRpb25hbCBhbmQgbm90IHVwZGF0ZSBkb20gaWYgbm90IHBhc3NlZC5cbi8vIHJlZmFjdG9yIG5vcm1hbGl6ZSBjb2xsZWN0aW9uXG4vLyBQYXJhbGxheCBlbGVtZW50IGV4dGVuZHMgcGFyYWxsYXggY29sbGVjdGlvbiBwcm90b3R5cGUuIHBhcmxsYXggZWxlbWVudCBwcm90b3R5cGUgYWRkcyAxIG1vcmUgbWV0aG9kIGZvciBkZWx0YS5cbi8vIHVwZGF0ZSBtZXRob2QgYW5kIGluaXQgbWV0aG9kIHNob3VsZCBiZSBrZXllZCBsaWtlIHRoZSBoaWRlLHppbmRleCxhbmQgdG9wIG1ldGhvZHMuXG4vLyBtYXliZSBjYWNoZSBzdHlsZSBwcm9wZXJ0eSBvbiBlbGVtZW50IGxpa2UgaXNjcm9sbFxuLy8gQHRvZG8gdGVzdCB0byB3b3JrIHdpdGggZWxlbWVudCB3aXRoIG5lZ2F0aXZlIHNwZWVkIGFuZCB6ZXJvIHNwZWVkLlxuLy8gTWFrZSBhbGwgSlMsIG5vIGpRdWVyeVxuLy8gaW5pdCBtZXRob2QgaXMgbWVzc3lcbi8vIHRlc3QgdG91Y2ggZGV0ZWN0aW9uXG4vLyBoYWNrIHRvIGhpZGUgaGVhZGxpbmVzIHdoZW4gY2xpY2tpbmcgcmVhZCBtb3JlLlxuLy8gbWluLWhlaWdodDogMTAwJTtcbiAgICAvLyBoZWlnaHQ6IGF1dG8gIWltcG9ydGFudDtcbiAgICAvLyBoZWlnaHQ6MTAwJVxuXG52YXIgUGFyYWxsYXggPSAoZnVuY3Rpb24oJCwgd2luLCBkb2MsIHVuZGVmaW5lZCkge1xuXG4gIC8qKlxuICAgKiBQcml2YXRlIHByb3BlcnRpZXMuXG4gICAqL1xuICB2YXIgbyAgICAgICAgICAgPSB7fSxcbiAgICAgIGNvbGxlY3Rpb25zID0ge30sXG4gICAgICBjYWxsYmFja3MgICA9IFtdLFxuICAgICAgcmVzaXplICAgICAgPSBbXSxcbiAgICAgICR3aW4gICAgICAgID0gJCh3aW4pLFxuICAgICAgJGRvYyAgICAgICAgPSAkKGRvYyksXG4gICAgICB0b3AgICAgICAgICA9IDAsXG4gICAgICBpc1RvdWNoICAgICA9ICgoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB8fCAobmF2aWdhdG9yLm1zTWF4VG91Y2hQb2ludHMgPiAwKSksXG4gICAgICB3aW5IZWlnaHQgICA9IHdpbi5pbm5lckhlaWdodCwgLy8gVGhlIGhlaWdodCBvZiB0aGUgd2luZG93LlxuICAgICAgd3JhcHBlckhlaWdodCwgJGJvZHksICR3cmFwcGVyOyAvLyBUaGUgaGVpZ2h0IG9mIHRoZSBQYXJhbGxheCB3cmFwcGVyLlxuXG4gIHZhciBzdHlsZURPTSA9IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcbiAgICAkYm9keSAgICAgPSAkKCdib2R5Jyk7XG4gICAgJHdyYXBwZXIgID0gJChzZWxlY3Rvcik7XG4gICAgJGJvZHlIdG1sID0gJCgnYm9keSwgaHRtbCcpO1xuXG4gICAgJGJvZHkuY3NzKCdoZWlnaHQnLCAnMTAwJScpO1xuICAgICR3cmFwcGVyLmNzcygnbWluLWhlaWdodCcsICcxMDAlJyk7XG4gICAgJGRvYy5jaGlsZHJlbigpXG4gICAgICAuY3NzKCdoZWlnaHQnLCAnMTAwJScpXG4gICAgICAuYWRkQ2xhc3MoJ1BhcmFsbGF4Jyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbnN0dWN0b3IgZnVuY3Rpb24uXG4gICAqL1xuICB2YXIgUGFyYWxsYXhFbGVtZW50ID0gZnVuY3Rpb24oIG9iaiApIHtcbiAgICB2YXIgaGlkZSAgID0gb2JqLmhpZGUgfHwgZmFsc2UsXG4gICAgICAgIGxhc3QgICA9IG9iai5sYXN0IHx8IGZhbHNlLFxuICAgICAgICB0b3AgICAgPSBvYmoudG9wIHx8IDAsXG4gICAgICAgIHpJbmRleCA9IHR5cGVvZiBvYmouekluZGV4ICE9PSAndW5kZWZpbmVkJyA/IG9iai56SW5kZXg6IC0xLFxuICAgICAgICBwb3NZICAgPSAwLFxuICAgICAgICBkZWx0YSAgPSAwO1xuXG4gICAgdGhpcy5zcGVlZCA9IHR5cGVvZiBvYmouc3BlZWQgIT09ICd1bmRlZmluZWQnID8gb2JqLnNwZWVkOiAxO1xuICAgIHRoaXMudXBkYXRlID0gb2JqLnVwZGF0ZSB8fCB7fTtcbiAgICB0aGlzLmVsID0gb2JqLmVsO1xuXG4gICAgaWYgKCB0eXBlb2Ygb2JqLmluaXQgPT09ICdmdW5jdGlvbicgKVxuICAgICAgdGhpcy5pbml0ID0gb2JqLmluaXQ7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyggdGhpcywge1xuICAgICAgJ3Bvc1knOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBwb3NZOyB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgcG9zWSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2hpZGUnOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBoaWRlOyB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgaGlkZSA9IHZhbHVlO1xuICAgICAgICAgIGlmICggdGhpcy5lbC5sZW5ndGggPiAwIClcbiAgICAgICAgICAgIHRoaXMuZWxbMF0uc3R5bGUuZGlzcGxheSA9IGhpZGUgPyAnbm9uZSc6ICdibG9jayc7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnekluZGV4Jzoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gekluZGV4OyB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgekluZGV4ID0gdmFsdWU7XG4gICAgICAgICAgaWYgKCB0aGlzLmVsLmxlbmd0aCA+IDAgKVxuICAgICAgICAgICAgdGhpcy5lbFswXS5zdHlsZS56SW5kZXggPSB6SW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAndG9wJzoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdG9wOyB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgdG9wID0gdmFsdWU7XG4gICAgICAgICAgaWYgKCB0aGlzLmVsLmxlbmd0aCA+IDAgKVxuICAgICAgICAgICAgdGhpcy5lbC5jc3MoJ3RvcCcsIHRvcCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnZGVsdGEnOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBkZWx0YTsgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIGRlbHRhID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnbGFzdCc6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIGxhc3Q7IH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBsYXN0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQ29uc3R1Y3RvciBmdW5jdGlvbi5cbiAgICovXG4gIHZhciBQYXJhbGxheENvbGxlY3Rpb24gPSBmdW5jdGlvbiggb2JqICkge1xuICAgIHZhciB6SW5kZXggPSB0eXBlb2Ygb2JqLnpJbmRleCAhPT0gJ3VuZGVmaW5lZCcgPyBvYmouekluZGV4OiAtMSxcbiAgICAgICAgdG9wICAgID0gb2JqLnRvcCB8fCAwLFxuICAgICAgICBoaWRlICAgPSBvYmouaGlkZSB8fCBmYWxzZTtcblxuICAgIHRoaXMuZWxlbWVudHMgPSBvYmouZWxlbWVudHMgfHwge307XG4gICAgdGhpcy5lbCA9IG9iai5lbDtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCB0aGlzLCB7XG4gICAgICAnaGlkZSc6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIGhpZGU7IH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBoaWRlID0gdmFsdWU7XG4gICAgICAgICAgaWYgKCB0aGlzLmVsLmxlbmd0aCA+IDAgKVxuICAgICAgICAgICAgdGhpcy5lbFswXS5zdHlsZS5kaXNwbGF5ID0gaGlkZSA/ICdub25lJzogJ2Jsb2NrJztcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICd6SW5kZXgnOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB6SW5kZXg7IH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICB6SW5kZXggPSB2YWx1ZTtcbiAgICAgICAgICBpZiAoIHRoaXMuZWwubGVuZ3RoID4gMCApXG4gICAgICAgICAgICB0aGlzLmVsWzBdLnN0eWxlLnpJbmRleCA9IHpJbmRleDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICd0b3AnOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB0b3A7IH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICB0b3AgPSB2YWx1ZTtcbiAgICAgICAgICBpZiAoIHRoaXMuZWwubGVuZ3RoID4gMCApXG4gICAgICAgICAgICB0aGlzLmVsLmNzcygndG9wJywgdG9wKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgfTtcblxuICB2YXIgcHJlZml4ID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCAnJyksXG4gICAgICBwcmUgPSAoQXJyYXkucHJvdG90eXBlLnNsaWNlXG4gICAgICAgIC5jYWxsKHN0eWxlcylcbiAgICAgICAgLmpvaW4oJycpXG4gICAgICAgIC5tYXRjaCgvLShtb3p8d2Via2l0fG1zKS0vKSB8fCAoc3R5bGVzLk9MaW5rID09PSAnJyAmJiBbJycsICdvJ10pXG4gICAgICApWzFdLFxuICAgICAgZG9tID0gKCd3ZWJraXR8TW96fE1TfE8nKS5tYXRjaChuZXcgUmVnRXhwKCcoJyArIHByZSArICcpJywgJ2knKSlbMV07XG4gICAgcmV0dXJuIHtcbiAgICAgIGRvbTogZG9tLFxuICAgICAgbG93ZXJjYXNlOiBwcmUsXG4gICAgICBjc3M6ICctJyArIHByZSArICctJyxcbiAgICAgIGpzOiBwcmVbMF0udG9VcHBlckNhc2UoKSArIHByZS5zdWJzdHIoMSlcbiAgICB9O1xuICB9KSgpO1xuXG4gIC8qKlxuICAgKiBQdWJsaWMgcHJvcGVydGllcy5cbiAgICovXG4gICBvLndpZHRoID0gd2luLmlubmVyV2lkdGg7XG4gICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhvLCB7XG4gICAgJ3dyYXBwZXJIZWlnaHQnOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gd3JhcHBlckhlaWdodDsgfSxcbiAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgd3JhcHBlckhlaWdodCA9IHZhbHVlO1xuICAgICAgICB2YXIgY3NzID0ge307XG4gICAgICAgIGNzcy5oZWlnaHQgPSB3cmFwcGVySGVpZ2h0ID8gd3JhcHBlckhlaWdodCA6ICcnO1xuICAgICAgICBjc3Mub3ZlcmZsb3cgPSB3cmFwcGVySGVpZ2h0ID8gJ2hpZGRlbicgOiAnJztcbiAgICAgICAgJHdyYXBwZXIuY3NzKGNzcyk7XG4gICAgICB9XG4gICAgfVxuICAgfSk7XG5cblxuICAvKipcbiAgICogUHJpdmF0ZSBtZXRob2RzLlxuICAgKi9cblxuICAvLyBodHRwOi8vdW5zY3JpcHRhYmxlLmNvbS8yMDA5LzAzLzIwL2RlYm91bmNpbmctamF2YXNjcmlwdC1tZXRob2RzL1xuICB2YXIgZGVib3VuY2UgPSBmdW5jdGlvbiAoZnVuYywgdGhyZXNob2xkLCBleGVjQXNhcCkge1xuICAgIHZhciB0aW1lb3V0O1xuICAgIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQgKCkge1xuICAgICAgdmFyIG9iaiA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBmdW5jdGlvbiBkZWxheWVkICgpIHtcbiAgICAgICAgaWYgKCFleGVjQXNhcClcbiAgICAgICAgICAgIGZ1bmMuYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICB9XG4gICAgICBpZiAodGltZW91dClcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgZWxzZSBpZiAoZXhlY0FzYXApXG4gICAgICAgIGZ1bmMuYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHRocmVzaG9sZCB8fCAxMDApO1xuICAgIH07XG4gIH07XG5cbiAgLyoqXG4gICAqIE1vdmUgZWxlbWVudHMgb24gdGhlIFkgYXhpcyB1c2luZyBDU1MgKHBlcmZlcmVkKVxuICAgKiBvciB2aWEgcG9zaXRpb24gdG9wLlxuICAgKiBAcGFyYW0ge29iamVjdH0gZWwgZWxlbWVudCBpbiBhIGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIHtudW1iZXJ9IGRlbHRhIHRoZSBtYXJnaW5hbCBpbmNyZWFzZS9kZWNyZWFzZSB0byBtb3ZlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBtb3ZlVG8gdmFsdWUgc3RvcmVkIGluIHRoZSBlbGVtZW50J3Mgb2JqIGFzIGN1cnJlbnQgcG9zWS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGVhc2luZyBjdWJpYyBiZXppZXIgZWFzaW5nIGZ1bmN0aW9uLlxuICAgKi9cbiAgdmFyIG1vdmUgPSBmdW5jdGlvbihlbCwgZGVsdGEsIG1vdmVUbywgdGltZSwgZWFzaW5nKSB7XG4gICAgZWwuZGVsdGEgPSBlbC5kZWx0YSArIGRlbHRhO1xuICAgIGVsLmVsWzBdLnN0eWxlW3ByZWZpeC5kb20gKyAnVHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uJ10gPSBlYXNpbmc7XG4gICAgZWwuZWxbMF0uc3R5bGVbcHJlZml4LmRvbSArICdUcmFuc2l0aW9uRHVyYXRpb24nXSA9IHRpbWUgKyAnbXMnO1xuICAgIGVsLmVsWzBdLnN0eWxlW3ByZWZpeC5kb20gKyAnVHJhbnNmb3JtJ10gPSBcInRyYW5zbGF0ZVkoXCIgKyBlbC5kZWx0YSArIFwicHgpIHRyYW5zbGF0ZVooMCkgc2NhbGUoMSlcIjtcblxuICAgIC8vIFVwZGF0ZSBvYmplY3QncyBzdGF0ZS5cbiAgICBlbC5wb3NZID0gbW92ZVRvO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBudW1iZXIgb2YgdW5pdHMgdG8gbW92ZSBhbiBlbGVtZW50IGJhc2VkIG9uXG4gICAqIGl0J3MgcHJldmlvdXMgcG9zaXRpb24gWSAsIHNwZWVkLCBhbmQgbmV3IHBvc2l0aW9uIFkuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZCB0aGUgcmF0ZSBhdCB3aGljaCB0byBtb3ZlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBtb3ZlRnJvbSB0aGUgbGFzdCBrbm93biBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgdG9wXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBtb3ZlVG9cbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cbiAgdmFyIGNhbGNEaXN0YW5jZSA9IGZ1bmN0aW9uKHNwZWVkLCBtb3ZlRnJvbSwgbW92ZVRvKSB7XG4gICAgcmV0dXJuIChtb3ZlVG8gLSBtb3ZlRnJvbSkgKiAoMS1zcGVlZCk7XG4gICAgLy8gcmV0dXJuICgobW92ZVRvLW1vdmVGcm9tKSpzcGVlZCkgLSAobW92ZVRvIC0gbW92ZUZyb20pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBFeGVjdXRlIHVwZGF0ZSBjYWxsYmFjayBmb3IgYW4gZWxlbWVudC5cbiAgICogQHBhcmFtICB7ZWx9IG9iai5cbiAgICogQHBhcmFtICB7cG9zWX0gbnVtYmVyLlxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZWFzaW5nIGN1YmljIGJlemllciBlYXNpbmcgZnVuY3Rpb24uXG4gICAqL1xuICB2YXIgZXhlY0VsZW1lbnQgPSBmdW5jdGlvbiggZWwsIHBvc1ksIHRpbWUsIGVhc2luZyApIHtcbiAgICAvLyBBIHByb2JsZW0gIG9jY3VycyB3aGVuIGVsZW1lbnRzIGNoYW5nZSBzcGVlZCBhbmQvb3IgZGlyZWN0aW9uLlxuICAgIC8vIFlvdSBhcmUgbW92aW5nIGFuIGVsZW1lbnQgYXQgYSByYXRlIG9mIDIsIGFuZCB5b3Ugc2V0IHRoZSBlbGVtZW50XG4gICAgLy8gdG8gbW92ZSBhdCBhIHJhdGUgb2YgMyB3aGVuIHRoZSB1c2VyIHNjcm9sbHMgcGFzdCA4MDBweCwgdGhlIG1vdmUgZnVuY3Rpb25cbiAgICAvLyB3aWxsIG5vdCBiZSBjYWxsZWQgZXhhY3RseSBvbiBldmVyeSBicmVha3BvaW50LiBJdCBjb3VsZCBiZSBjYWxsZWQgYXQgNzkwcHhcbiAgICAvLyBhbmQgbmV4dCBvbiA4MDVweC4gV2hlbiBjYWxsZWQgYXQgODA1cHgsIHRoZSBlbGVtZW50IHdvdWxkIG1vdmUgMTVweFxuICAgIC8vIGF0IGEgbmV3IHNwZWVkLiBUaGlzIGlzIHRoZSBpc3N1ZS5cblxuICAgIC8vIFNvcnQga2V5cyBhcnJheSBpbiBBU0Mgd2hlbiBzY3JvbGxpbmcgZG93biwgYW5kIERFU0Mgd2hlbiBzY3JvbGxpbmcgdXAuXG4gICAgdmFyIGJwLFxuICAgICAgICBwcmV2QnAsXG4gICAgICAgIGtleXMgPSBPYmplY3Qua2V5cyhlbC51cGRhdGUpLnNvcnQoZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgICAgcmV0dXJuIHBvc1kgPCBlbC5wb3NZID8gYi1hIDogYS1iO1xuICAgICAgICB9KTtcblxuICAgIGZvciAoIHZhciBpPTAsbGVuPWtleXMubGVuZ3RoOyBpPGxlbjsgaSs9MSApIHtcbiAgICAgIGJwID0ga2V5c1tpXTtcbiAgICAgIHByZXZCcCA9IGtleXNbaSsxXSA/IGtleXNbaSsxXSA6IG51bGw7XG5cbiAgICAgIC8vIElmIHdlIGFyZSBzY3JvbGxpbmcgZG93bi5cbiAgICAgIGlmICggcG9zWSA+IGVsLnBvc1kgJiYgYnAgPiBlbC5wb3NZICYmIGJwIDw9IHBvc1kgKSB7XG4gICAgICAgIG1vdmUuY2FsbCggbywgZWwsIGNhbGNEaXN0YW5jZShlbC5zcGVlZCwgZWwucG9zWSwgYnApLCBicCwgdGltZSwgZWFzaW5nICk7XG4gICAgICAgIGVsLnVwZGF0ZVticF0uY2FsbChlbCk7XG4gICAgICB9XG4gICAgICAvLyBJZiB3ZSBhcmUgc2Nyb2xsaW5nIHVwLlxuICAgICAgaWYgKCBwb3NZIDwgZWwucG9zWSAmJiBwcmV2QnAgJiYgYnAgPCBlbC5wb3NZICYmIGJwID49IHBvc1kgKSB7XG4gICAgICAgIG1vdmUuY2FsbCggbywgZWwsIGNhbGNEaXN0YW5jZShlbC5zcGVlZCwgZWwucG9zWSwgYnApLCBicCwgdGltZSwgZWFzaW5nICk7XG4gICAgICAgIGVsLnVwZGF0ZVtwcmV2QnBdLmNhbGwoZWwpO1xuICAgICAgfVxuICAgIH1cblxuICB9O1xuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBlYWNoIGVsZW1lbnQgdXNpbmcgdGhlIG8uYWRkQ2FsbGJhY2sgbWV0aG9kLlxuICAgKiBAcGFyYW0gIHtvYmplY3R9IGVsZW1lbnRcbiAgICovXG4gIHZhciBiaW5kRWxlbWVudCA9IGZ1bmN0aW9uKCBlbCApIHtcbiAgICBvLmFkZENhbGxiYWNrKGZ1bmN0aW9uKCBwb3NZLCB0aW1lLCBlYXNpbmcgKSB7XG4gICAgICBpZiAoIE9iamVjdC5rZXlzKGVsLnVwZGF0ZSkubGVuZ3RoID4gMCApXG4gICAgICAgIGV4ZWNFbGVtZW50KCBlbCwgcG9zWSwgdGltZSwgZWFzaW5nICk7XG4gICAgICBtb3ZlLmNhbGwoIG8sIGVsLCBjYWxjRGlzdGFuY2UoZWwuc3BlZWQsIGVsLnBvc1ksIHBvc1kpLCBwb3NZLCB0aW1lLCBlYXNpbmcgKTtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQXBwbHkgcGFyYWxsYXggc3BlY2lmaWMgc3R5bGluZyB0byB0aGUgY29sbGVjdGlvbiB3cmFwcGVyIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBET00gc2VsZWN0b3JcbiAgICovXG4gIHZhciBzdHlsZUNvbGxlY3Rpb24gPSBmdW5jdGlvbiggY29sbGVjdGlvbiwgc2VsZWN0b3IgKSB7XG4gICAgdmFyIGNzcyA9IHtcbiAgICAgICdwb3NpdGlvbic6ICdyZWxhdGl2ZScsIC8vIFVzZSByZWxhdGl2ZSBwb3NpdGlvbmluZyB0byBwcmVzZXJ2ZSBjaGlsZCBlbGVtZW50IGFsaWdubWVudC5cbiAgICAgICdtYXJnaW4tdG9wJzogJzAnLFxuICAgICAgJ21hcmdpbi1ib3R0b20nOiAnMCcsXG4gICAgICAncGFkZGluZy10b3AnOiAnMCcsXG4gICAgICAncGFkZGluZy1ib3R0b20nOiAnMCdcbiAgICB9O1xuXG4gICAgLy8gQWRkIHN0eWxpbmcgdG8gdGhlIGNvbGxlY3Rpb24gZWxlbWVudC5cbiAgICBjb2xsZWN0aW9uLmVsID0gJCggc2VsZWN0b3IgKS5jc3MoIGNzcyApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBcHBseSBwYXJhbGxheCBzcGVjaWZpYyBzdHlsaW5nIHRvIGVhY2ggZWxlbWVudCBpbiBhIGNvbGxlY3Rpb24uXG4gICAqIEBwYXJhbSAge29iamVjdH0gZWxcbiAgICogQHBhcmFtICB7c3RyaW5nfSBzZWxlY3RvclxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IG9mZnNldFxuICAgKi9cbiAgdmFyIHN0eWxlRWxlbWVudCA9IGZ1bmN0aW9uKCBlbCwgc2VsZWN0b3IgKSB7XG4gICAgLy8gQWRkIGJhc2ljIHBhcmFsbGF4IHN0eWxpbmcuXG4gICAgdmFyIGNzcyA9IHtcbiAgICAgICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsXG4gICAgICAnbGVmdCc6IDAsXG4gICAgICAncmlnaHQnOiAwLFxuICAgICAgJ21hcmdpbi1sZWZ0JzogJ2F1dG8nLFxuICAgICAgJ21hcmdpbi1yaWdodCc6ICdhdXRvJyxcbiAgICAgICdtYXJnaW4tdG9wJzogJzAnLFxuICAgICAgJ21hcmdpbi1ib3R0b20nOiAnMCcsXG4gICAgICAncGFkZGluZy10b3AnOiAnMCcsXG4gICAgICAncGFkZGluZy1ib3R0b20nOiAnMCdcbiAgICB9O1xuXG4gICAgLy8gQWRkIGpRdWVyeSBET00gcmVmZXJlbmNlXG4gICAgZWwuZWwgPSAkKCBzZWxlY3RvciApLmNzcyggY3NzICk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY3VycmVudCB2YWx1ZSBmb3IgYSBvYmplY3QgcHJvcGVydHkgc3VjaCBhc1xuICAgKiBzcGVlZCwgdG9wLCB6SW5kZXgsIGFuZCBoaWRlLlxuICAgKiBAcGFyYW0gIHttaXhlZH0gdmFsdWUgb2JqZWN0IG9yIHN0cmluZyBvZiBhbiBlbGVtZW50IHByb3BlcnR5LlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHdpZHRoIHdpZHRoIG9mIGJyb3dzZXIgd2luZG93LlxuICAgKiBAcmV0dXJuIHtjdXJyeSBmdW5jdGlvbn1cbiAgICovXG4gIHZhciBnZXRWYWwgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHdpZHRoKSB7XG4gICAgICBpZiAoIHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgKSByZXR1cm4gdmFsdWU7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgICAgIGZvciAoIHZhciBpPTAsIGxlbj1rZXlzLmxlbmd0aDsgaTxsZW47IGkrPTEgKSB7XG4gICAgICAgIGlmICggd2lkdGggPj0gcGFyc2VJbnQoa2V5c1tsZW4taS0xXSwgMTApIClcbiAgICAgICAgICByZXR1cm4gdmFsdWVba2V5c1tsZW4taS0xXV07XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICAvKipcbiAgICogTWFnaWMuXG4gICAqIEBwYXJhbSAge29iamVjdH0gZWxcbiAgICogQHJldHVybiB7bnVtYmVyfSBvZmZzZXRcbiAgICovXG4gIHZhciBub3JtYWxpemVDb2xsZWN0aW9uID0gZnVuY3Rpb24oIGVsICkge1xuICAgIHZhciBoaWRlICAgPSBnZXRWYWwoZWwuaGlkZSksXG4gICAgICAgIHpJbmRleCA9IGdldFZhbChlbC56SW5kZXgpLFxuICAgICAgICB0b3AgICAgPSBnZXRWYWwoZWwudG9wKTtcblxuICAgIGVsLmhpZGUgPSBoaWRlKG8ud2lkdGgpO1xuICAgIGVsLnpJbmRleCA9IHpJbmRleChvLndpZHRoKTtcbiAgICBlbC50b3AgPSAgdG9wKG8ud2lkdGgpO1xuXG4gICAgby5vblJlc2l6ZShmdW5jdGlvbigpIHtcbiAgICAgIGVsLmhpZGUgPSBoaWRlKG8ud2lkdGgpO1xuICAgICAgZWwuekluZGV4ID0gekluZGV4KG8ud2lkdGgpO1xuICAgICAgZWwudG9wID0gdG9wKG8ud2lkdGgpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBNYWdpYy5cbiAgICogQHBhcmFtICB7b2JqZWN0fSBlbFxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IG9mZnNldFxuICAgKi9cbiAgdmFyIG5vcm1hbGl6ZUVsZW1lbnQgPSBmdW5jdGlvbiggZWwsIG9mZnNldCApIHtcbiAgICB2YXIgc3BlZWQgID0gZ2V0VmFsKGVsLnNwZWVkKSxcbiAgICAgICAgaGlkZSAgID0gZ2V0VmFsKGVsLmhpZGUpLFxuICAgICAgICB6SW5kZXggPSBnZXRWYWwoZWwuekluZGV4KSxcbiAgICAgICAgdG9wICAgID0gZ2V0VmFsKGVsLnRvcCk7XG5cbiAgICBlbC5zcGVlZCA9IHNwZWVkKG8ud2lkdGgpO1xuICAgIGVsLmhpZGUgPSBoaWRlKG8ud2lkdGgpO1xuICAgIGVsLnpJbmRleCA9IHpJbmRleChvLndpZHRoKTtcbiAgICBlbC50b3AgPSAgKCBlbC5zcGVlZCAhPT0gMCApID8gdG9wKG8ud2lkdGgpKmVsLnNwZWVkIDogdG9wKG8ud2lkdGgpO1xuXG4gICAgby5vblJlc2l6ZShmdW5jdGlvbigpIHtcbiAgICAgIGVsLnNwZWVkID0gc3BlZWQoby53aWR0aCk7XG4gICAgICBlbC5oaWRlID0gaGlkZShvLndpZHRoKTtcbiAgICAgIGVsLnpJbmRleCA9IHpJbmRleChvLndpZHRoKTtcbiAgICAgIGVsLnRvcCA9ICggZWwuc3BlZWQgIT09IDAgKSA/IHRvcChvLndpZHRoKSplbC5zcGVlZCA6IHRvcChvLndpZHRoKTtcbiAgICAgIC8vIGlmICggdHlwZW9mIGVsLmluaXQgIT09ICd1bmRlZmluZWQnIClcbiAgICAgIC8vICAgZWwuaW5pdC5jYWxsKGVsKTtcbiAgICB9KTtcblxuICAgIC8vIFJlc2V0IGluaXRhbCB2YWx1ZXMuXG4gICAgaWYgKCBPYmplY3Qua2V5cyhlbC51cGRhdGUpLmxlbmd0aCA+IDAgJiYgdHlwZW9mIGVsLnVwZGF0ZVswXSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICBlbC51cGRhdGVbMF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZWwuc3BlZWQgID0gc3BlZWQoby53aWR0aCk7XG4gICAgICAgIGVsLmhpZGUgICA9IGhpZGUoby53aWR0aCk7XG4gICAgICAgIGVsLnpJbmRleCA9IHpJbmRleChvLndpZHRoKTtcbiAgICAgICAgZWwudG9wID0gICggZWwuc3BlZWQgIT09IDAgKSA/IHRvcChvLndpZHRoKSplbC5zcGVlZCA6IHRvcChvLndpZHRoKTtcbiAgICAgIH07XG4gICAgfVxuXG4gIH07XG5cbiAgLyoqXG4gICAqIER5bmFtaWNhbGx5IHNldCB0aGUgd3JhcHBlciBoZWlnaHQuIFdpbGwgYWRqdXN0IG9uIHJlc2l6ZS5cbiAgICogQHBhcmFtIHtvYmplY3R9IGVsXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBvZmZzZXQgQ29sbGVjdGlvbiBvZmZzZXQgdG9wXG4gICAqL1xuICB2YXIgc2V0V3JhcHBlckhlaWdodCA9IGZ1bmN0aW9uKGVsLCBvZmZzZXQpIHtcbiAgICB2YXIgZWxlbWVudEhlaWdodDtcbiAgICBvLmFkZENhbGxiYWNrKGZ1bmN0aW9uKHBvc1kpIHtcbiAgICAgIGlmICggby53cmFwcGVySGVpZ2h0ICkgcmV0dXJuO1xuICAgICAgLy8gRm9yIHNvbWUgcmVhc29uIGlmIEkgaW5pdGlhbGl6ZSBoZWlnaHQgb3V0c2lkZSB0aGlzIGZuIHRoZSB2YWx1ZSB3aWxsIGJlIGluY29ycmVjdC4gRE9NIG5vdCByZWFkeT9cbiAgICAgIGlmICghZWxlbWVudEhlaWdodCkgZWxlbWVudEhlaWdodCA9IGVsLmVsLmhlaWdodCgpO1xuICAgICAgLy8gdmFyIGRpc3RGcm9tVG9wID0gZWwudG9wICsgZWwuZGVsdGEgKyBvZmZzZXQgLSBwb3NZO1xuICAgICAgdmFyIGRpc3RGcm9tVG9wID0gZWwuZWwub2Zmc2V0KCkudG9wIC0gcG9zWTtcbiAgICAgIHZhciBweEZyb21Cb3R0b20gPSBlbGVtZW50SGVpZ2h0IC0gd2luSGVpZ2h0ICsgZGlzdEZyb21Ub3A7XG4gICAgICBpZiAoIHB4RnJvbUJvdHRvbSA8PSAwICkge1xuICAgICAgICBvLndyYXBwZXJIZWlnaHQgPSBwb3NZICsgd2luSGVpZ2h0ICsgcHhGcm9tQm90dG9tO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgby5vblJlc2l6ZShmdW5jdGlvbigpIHtcbiAgICAgIG8ud3JhcHBlckhlaWdodCA9IG51bGw7XG4gICAgfSk7XG4gIH07XG5cbiAgdmFyIGluaXRQYXJhbGxheCA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciAoIHZhciBpIGluIGNvbGxlY3Rpb25zICkge1xuICAgICAgLy8gQ29sbGVjdGlvbi5cbiAgICAgIHN0eWxlQ29sbGVjdGlvbiggY29sbGVjdGlvbnNbaV0sIGkgKTtcbiAgICAgIGNvbGxlY3Rpb25zW2ldID0gbmV3IFBhcmFsbGF4Q29sbGVjdGlvbiggY29sbGVjdGlvbnNbaV0gKTtcbiAgICAgIG5vcm1hbGl6ZUNvbGxlY3Rpb24oIGNvbGxlY3Rpb25zW2ldICk7XG5cbiAgICAgIC8vIEVsZW1lbnRzLlxuICAgICAgdmFyIGVsZW1lbnRzID0gY29sbGVjdGlvbnNbaV0uZWxlbWVudHM7XG4gICAgICBmb3IgKCB2YXIgaWkgaW4gZWxlbWVudHMgKSB7XG4gICAgICAgIHN0eWxlRWxlbWVudCggZWxlbWVudHNbaWldLCBpaSApO1xuICAgICAgICBlbGVtZW50c1tpaV0gPSBuZXcgUGFyYWxsYXhFbGVtZW50KCBlbGVtZW50c1tpaV0gKTtcbiAgICAgICAgbm9ybWFsaXplRWxlbWVudCggZWxlbWVudHNbaWldLCBjb2xsZWN0aW9uc1tpXS50b3AgKTtcbiAgICAgICAgYmluZEVsZW1lbnQoIGVsZW1lbnRzW2lpXSApO1xuXG4gICAgICAgIC8vIFNldCB3cmFwcGVyIGhlaWdodFxuICAgICAgICBpZiAoIGVsZW1lbnRzW2lpXS5sYXN0IClcbiAgICAgICAgICBzZXRXcmFwcGVySGVpZ2h0LmNhbGwobywgZWxlbWVudHNbaWldLCBjb2xsZWN0aW9uc1tpXS50b3AgKTtcblxuICAgICAgICAvLyBDYWxsIHVwZGF0ZSwgYW5kIGluaXQgbWV0aG9kcyBvbiBwYWdlIGxvYWQgaWYgdGhleSBhcHBseS5cbiAgICAgICAgaWYgKCB0eXBlb2YgZWxlbWVudHNbaWldLmluaXQgPT09ICdmdW5jdGlvbicgKVxuICAgICAgICAgIGVsZW1lbnRzW2lpXS5pbml0LmNhbGwoIGVsZW1lbnRzW2lpXSApO1xuICAgICAgICBpZiAoIHR5cGVvZiBlbGVtZW50c1tpaV0udXBkYXRlWzBdICE9PSAndW5kZWZpbmVkJyApXG4gICAgICAgICAgZWxlbWVudHNbaWldLnVwZGF0ZVswXS5jYWxsKCBlbGVtZW50c1tpaV0gKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFN0eWxlIGlTY3JvbGwgd3JhcHBlciBhbmQgZmlyc3QgY2hpbGQuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gc2VsZWN0b3IgaWQgb3IgY2xhc3NcbiAgICovXG4gIHZhciBzdHlsZUlzY3JvbGwgPSBmdW5jdGlvbiggZWwgKSB7XG4gICAgLy8gU3R5bGUgRE9NIGZvciBpU2Nyb2xsLlxuICAgICRkb2MuY2hpbGRyZW4oKS5jc3MoJy1tcy10b3VjaC1hY3Rpb24nLCAnbm9uZScpO1xuICAgICRib2R5LmNzcygnb3ZlcmZsb3cnLCAnaGlkZGVuJyk7XG5cbiAgICBlbC5jc3Moe1xuICAgICAgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJyxcbiAgICAgICd6SW5kZXgnOiAzLFxuICAgICAgJ3dpZHRoJzogJzEwMCUnLFxuICAgICAgJ3RvcCc6IDAsXG4gICAgICAnYm90dG9tJzogMCxcbiAgICAgICdsZWZ0JzogMCxcbiAgICAgICdvdmVyZmxvdyc6ICdoaWRkZW4nXG4gICAgfSkuY2hpbGRyZW4oJzpmaXJzdC1jaGlsZCcpLmNzcyh7XG4gICAgICAncG9zaXRpb24nOiAnYWJzb2x1dGUnLFxuICAgICAgJ3otaW5kZXgnOiAnMycsXG4gICAgICAnd2lkdGgnOiAnMTAwJScsXG4gICAgICAnaGVpZ2h0JzogJzIwMDAwcHgnLFxuICAgICAgJ292ZXJmbG93JzogJ2hpZGRlbicsXG4gICAgICAnLXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yJzogJ3JnYmEoMCwwLDAsMCknLFxuICAgICAgJy13ZWJraXQtdHJhbnNmb3JtJzogJ3RyYW5zbGF0ZVooMCknLFxuICAgICAgJy1tb3otdHJhbnNmb3JtJzogJ3RyYW5zbGF0ZVooMCknLFxuICAgICAgJy1tcy10cmFuc2Zvcm0nOiAndHJhbnNsYXRlWigwKScsXG4gICAgICAnLW8tdHJhbnNmb3JtJzogJ3RyYW5zbGF0ZVooMCknLFxuICAgICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGVaKDApJyxcbiAgICAgICctd2Via2l0LXRvdWNoLWNhbGxvdXQnOiAnbm9uZScsXG4gICAgICAnLXdlYmtpdC11c2VyLXNlbGVjdCc6ICdub25lJyxcbiAgICAgICctbW96LXVzZXItc2VsZWN0JzogJ25vbmUnLFxuICAgICAgJy1tcy11c2VyLXNlbGVjdCc6ICdub25lJyxcbiAgICAgICd1c2VyLXNlbGVjdCc6ICdub25lJyxcbiAgICAgICctd2Via2l0LXRleHQtc2l6ZS1hZGp1c3QnOiAnbm9uZScsXG4gICAgICAnLW1vei10ZXh0LXNpemUtYWRqdXN0JzogJ25vbmUnLFxuICAgICAgJy1tcy10ZXh0LXNpemUtYWRqdXN0JzogJ25vbmUnLFxuICAgICAgJy1vLXRleHQtc2l6ZS1hZGp1c3QnOiAnbm9uZScsXG4gICAgICAndGV4dC1zaXplLWFkanVzdCc6ICdub25lJ1xuICAgIH0pO1xuICB9O1xuXG4gIHZhciBpbml0SVNjcm9sbCA9IGZ1bmN0aW9uKCBlbCApIHtcbiAgICAvLyBDcmVhdGUgYW4gaVNjcm9sbCBpbnN0YW5jZS5cbiAgICB2YXIgc2Nyb2xsID0gbmV3IElTY3JvbGwoZWwuc2VsZWN0b3IsIHsgbW91c2VXaGVlbDogZmFsc2UgfSk7XG5cbiAgICAvLyBNb2RpZnkgcHJvdG90eXBlIHRvIGV4ZWN1dGUgcGFyYWxsYXggY2FsbGJhY2tzIG9uIHNjcm9sbC5cbiAgICBJU2Nyb2xsLnByb3RvdHlwZS5fdHJhbnNsYXRlID0gZnVuY3Rpb24oeCwgeSkge1xuICAgICAgaWYgKCB0aGlzLm9wdGlvbnMudXNlVHJhbnNmb3JtICkge1xuICAgICAgICB0aGlzLnNjcm9sbGVyU3R5bGVbcHJlZml4LmRvbSArICdUcmFuc2Zvcm0nXSA9ICd0cmFuc2xhdGUoJyArIHggKyAncHgsJyArIHkgKyAncHgpJyArIHRoaXMudHJhbnNsYXRlWjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHggPSBNYXRoLnJvdW5kKHgpO1xuICAgICAgICB5ID0gTWF0aC5yb3VuZCh5KTtcbiAgICAgICAgdGhpcy5zY3JvbGxlclN0eWxlLmxlZnQgPSB4ICsgJ3B4JztcbiAgICAgICAgdGhpcy5zY3JvbGxlclN0eWxlLnRvcCA9IHkgKyAncHgnO1xuICAgICAgfVxuICAgICAgdGhpcy54ID0geDtcbiAgICAgIHRoaXMueSA9IHk7XG5cbiAgICAgIC8vIE5lZ2F0ZSB5LiBpU2Nyb2xsIHNheXMgMTAwcHggZnJvbSB0b3AgPT09IC0xMDBweC4gV2Ugd2FudCBpdCB0byBiZSAxMDBweC5cbiAgICAgIGV4ZWNDYWxsYmFja3MoIC15LCBwYXJzZUludCh0aGlzLnNjcm9sbGVyU3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uLDEwKSB8fCAwLCB0aGlzLnNjcm9sbGVyU3R5bGUudHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uICk7XG4gICAgfTtcblxuICAgIHN0eWxlSXNjcm9sbCggZWwgKTtcblxuICAgIC8vIERpc2FibGUgdG91Y2ggZXZlbnRzLlxuICAgIGRvYy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBmdW5jdGlvbiAoZSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IH0sIGZhbHNlKTtcbiAgICByZXR1cm4gc2Nyb2xsO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgYSBjb3VudGVyIHRvIHRoZSBicm93c2VyIHRvIGRpc3BsYXkgdGhlIG51bWJlciBvZiBwaXhlbHNcbiAgICogdGhhdCBoYXZlIGJlZW4gc2Nyb2xsZWQuXG4gICAqL1xuICB2YXIgaW5pdERlYnVnZ2VyID0gZnVuY3Rpb24oKSB7XG4gICAgJGJvZHkuYXBwZW5kKCAnPHAgY2xhc3M9XCJwYXJhbGxheC1kZWJ1Z2dlclwiPjA8L3A+JyApO1xuXG4gICAgby5kZWJ1Z2dlciA9ICQoJy5wYXJhbGxheC1kZWJ1Z2dlcicpLmNzcyh7XG4gICAgICAncG9zaXRpb24nOiAnZml4ZWQnLFxuICAgICAgJ3RvcCc6ICcwJyxcbiAgICAgICdyaWdodCc6ICcwJyxcbiAgICAgICdmb250LXNpemUnOiAnMjRweCcsXG4gICAgICAnY29sb3InOiAnd2hpdGUnLFxuICAgICAgJ2JhY2tncm91bmQnOiAnYmxhY2snLFxuICAgICAgJ3BhZGRpbmcnOiAnMjBweCcsXG4gICAgICAnei1pbmRleCc6ICcxMDAwMDAnXG4gICAgfSk7XG5cbiAgICBvLmFkZENhbGxiYWNrKGZ1bmN0aW9uKCBwb3NZICkge1xuICAgICAgby5kZWJ1Z2dlci5odG1sKCBNYXRoLnJvdW5kKCBwb3NZICkgKTtcbiAgICB9KTtcblxuICB9O1xuXG4gIHZhciBleGVjQ2FsbGJhY2tzID0gZnVuY3Rpb24oIHBvc1ksIHRpbWUsIGVhc2luZyApIHtcbiAgICBjYWxsYmFja3MuZm9yRWFjaCggZnVuY3Rpb24oZm4pIHtcbiAgICAgIGZuLmNhbGwobywgcG9zWSwgdGltZSwgZWFzaW5nICk7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBtZXRob2RzLlxuICAgKi9cbiAgby5nZXRFbGVtZW50ID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICBmb3IgKCB2YXIgaSBpbiBjb2xsZWN0aW9ucyApIHtcbiAgICAgIGlmICggY29sbGVjdGlvbnNbaV0uZWxlbWVudHNbc2VsZWN0b3JdIClcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb25zW2ldLmVsZW1lbnRzW3NlbGVjdG9yXTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG5cbiAgby5hZGRDb2xsZWN0aW9uID0gZnVuY3Rpb24oIGNvbGxlY3Rpb24gKSB7XG4gICAgY29sbGVjdGlvbnNbIE9iamVjdC5rZXlzKGNvbGxlY3Rpb24pLnRvU3RyaW5nKCkgXSA9IGNvbGxlY3Rpb25bT2JqZWN0LmtleXMoY29sbGVjdGlvbildO1xuICAgIHJldHVybiBvO1xuICB9O1xuXG4gIG8ub25SZXNpemUgPSBmdW5jdGlvbihmbikge1xuICAgIHJlc2l6ZS5wdXNoKGZuKTtcbiAgICByZXR1cm4gbztcbiAgfTtcblxuICBvLmFkZENhbGxiYWNrID0gZnVuY3Rpb24oZm4pIHtcbiAgICBjYWxsYmFja3MucHVzaChmbik7XG4gICAgcmV0dXJuIG87XG4gIH07XG5cbiAgby5zY3JvbGxUbyA9IGZ1bmN0aW9uKHBvc1ksIHRpbWUpIHtcbiAgICBpZiAoIGlzVG91Y2ggKSB7XG4gICAgICBvLmlzY3JvbGwuc2Nyb2xsVG8oMCwgcG9zWSwgdGltZSB8fCAwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBib2R5IHNlbGVjdG9yIG5vIHdvcmsgaW4gZmlyZWZveC5cbiAgICAgICRib2R5SHRtbC5hbmltYXRlKHtcbsKgwqDCoMKgICAgIHNjcm9sbFRvcDogcG9zWSArICdweCdcbsKgwqDCoMKgICB9LCB0aW1lICk7XG4gICAgfVxuICAgIHJldHVybiBvO1xuICB9O1xuXG4gIG8uc2Nyb2xsVG9FbGVtZW50ID0gZnVuY3Rpb24oZWwsIHRpbWUsIG9mZnNldCkge1xuICAgIGlmICggaXNUb3VjaCApIHtcbiAgICAgIG8uaXNjcm9sbC5zY3JvbGxUb0VsZW1lbnQoZWwuZWwuc2VsZWN0b3IsIHRpbWUgfHwgMCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHRvTW92ZSA9ICgoZWwuZWwub2Zmc2V0KCkudG9wIC0gd2luLnBhZ2VZT2Zmc2V0KSAvIGVsLnNwZWVkKSAtIChvZmZzZXR8fDApO1xuICAgICAgby5zY3JvbGxUbyggd2luLnBhZ2VZT2Zmc2V0ICsgdG9Nb3ZlLCB0aW1lIHx8IDApO1xuICAgIH1cbiAgICByZXR1cm4gbztcbiAgfTtcblxuICBvLmluaXQgPSBmdW5jdGlvbiggc2VsZWN0b3IsIG9wdGlvbnMgKSB7XG4gICAgJGRvYy5vbigncmVhZHknLCBmdW5jdGlvbigpIHtcblxuICAgICAgc3R5bGVET00oc2VsZWN0b3IpO1xuICAgICAgaW5pdFBhcmFsbGF4KCk7XG5cbiAgICAgIGlmICggaXNUb3VjaCApIHtcbiAgICAgICAgby5pc2Nyb2xsID0gaW5pdElTY3JvbGwoICR3cmFwcGVyICk7XG4gICAgICAgIG8uaXNjcm9sbC5yZWZyZXNoKCk7IC8vIEBoYWNrXG4gICAgICAgIG8ub25SZXNpemUoZnVuY3Rpb24oKXtcbiAgICAgICAgICBvLmlzY3JvbGwucmVmcmVzaCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCBvcHRpb25zLmRlYnVnICkgaW5pdERlYnVnZ2VyKCk7XG4gICAgfSk7XG5cbiAgICAvLyBSZXNwb25kIHRvIHNjcm9sbCBldmVudHMuXG4gICAgaWYgKCAhaXNUb3VjaCApXG4gICAgICAkd2luLm9uKCdzY3JvbGwnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGV4ZWNDYWxsYmFja3MoIHdpbi5wYWdlWU9mZnNldCwgMCwgJ2N1YmljLWJlemllcigwLjEsIDAuNTcsIDAuMSwgMSknICk7XG4gICAgICB9KTtcblxuICAgIC8vIFJlc2l6ZSByZWNhbGN1bGF0aW9ucy5cbiAgICBvLm9uUmVzaXplKGZ1bmN0aW9uKCkge1xuICAgICAgby53aWR0aCA9IHdpbi5pbm5lcldpZHRoO1xuICAgICAgd2luSGVpZ2h0ID0gd2luLmlubmVySGVpZ2h0O1xuICAgIH0pO1xuXG4gICAgdmFyIGRlYm91bmNlZFJlc2l6ZSA9IGRlYm91bmNlKGZ1bmN0aW9uKCkge1xuICAgICAgcmVzaXplLmZvckVhY2goIGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgIGZuLmNhbGwobyk7XG4gICAgICB9KTtcbiAgICB9LCAxMDApO1xuICAgICR3aW4ub24oJ3Jlc2l6ZScsIGRlYm91bmNlZFJlc2l6ZSk7XG5cbiAgICByZXR1cm4gbztcbiAgfTtcblxuICByZXR1cm4gbztcblxufShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpKTtcbiJdfQ==
