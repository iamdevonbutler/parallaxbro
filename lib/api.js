

var Parallax = (function($, win, doc, undefined) {

  /**
   * Private properties.
   */
  var o           = {},
      collections = {},
      callbacks   = [],
      resize      = [],
      $win        = $(win),
      $doc        = $(doc),
      top         = 0,
      isTouch     = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0)),
      winHeight   = win.innerHeight, // The height of the window.
      wrapperHeight, $body, $wrapper; // The height of the Parallax wrapper.

  var styleDOM = function( selector ) {
    $body     = $('body');
    $wrapper  = $(selector);
    $bodyHtml = $('body, html');

    $body.css('height', '100%');
    $wrapper.css('min-height', '100%');
    $doc.children()
      .css('height', '100%')
      .addClass('Parallax');
  };

  /**
   * Constuctor function.
   */
  var ParallaxElement = function( obj ) {
    var hide   = obj.hide || false,
        last   = obj.last || false,
        top    = obj.top || 0,
        zIndex = typeof obj.zIndex !== 'undefined' ? obj.zIndex: -1,
        posY   = 0,
        delta  = 0;

    this.speed = typeof obj.speed !== 'undefined' ? obj.speed: 1;
    this.update = obj.update || {};
    this.el = obj.el;

    if ( typeof obj.init === 'function' )
      this.init = obj.init;

    Object.defineProperties( this, {
      'posY': {
        get: function() { return posY; },
        set: function(value) {
          posY = value;
        }
      },
      'hide': {
        get: function() { return hide; },
        set: function(value) {
          hide = value;
          if ( this.el.length > 0 )
            this.el[0].style.display = hide ? 'none': 'block';
        }
      },
      'zIndex': {
        get: function() { return zIndex; },
        set: function(value) {
          zIndex = value;
          if ( this.el.length > 0 )
            this.el[0].style.zIndex = zIndex;
        }
      },
      'top': {
        get: function() { return top; },
        set: function(value) {
          top = value;
          if ( this.el.length > 0 )
            this.el.css('top', top);
        }
      },
      'delta': {
        get: function() { return delta; },
        set: function(value) {
          delta = value;
        }
      },
      'last': {
        get: function() { return last; },
        set: function(value) {
          last = value;
        }
      },

    });
  };

  /**
   * Constuctor function.
   */
  var ParallaxCollection = function( obj ) {
    var zIndex = typeof obj.zIndex !== 'undefined' ? obj.zIndex: -1,
        top    = obj.top || 0,
        hide   = obj.hide || false;

    this.elements = obj.elements || {};
    this.el = obj.el;

    Object.defineProperties( this, {
      'hide': {
        get: function() { return hide; },
        set: function(value) {
          hide = value;
          if ( this.el.length > 0 )
            this.el[0].style.display = hide ? 'none': 'block';
        }
      },
      'zIndex': {
        get: function() { return zIndex; },
        set: function(value) {
          zIndex = value;
          if ( this.el.length > 0 )
            this.el[0].style.zIndex = zIndex;
        }
      },
      'top': {
        get: function() { return top; },
        set: function(value) {
          top = value;
          if ( this.el.length > 0 )
            this.el.css('top', top);
        }
      },
    });
  };

  var prefix = (function () {
    var styles = window.getComputedStyle(document.documentElement, ''),
      pre = (Array.prototype.slice
        .call(styles)
        .join('')
        .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
      )[1],
      dom = ('webkit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
    return {
      dom: dom,
      lowercase: pre,
      css: '-' + pre + '-',
      js: pre[0].toUpperCase() + pre.substr(1)
    };
  })();

  /**
   * Public properties.
   */
   o.width = win.innerWidth;
   Object.defineProperties(o, {
    'wrapperHeight': {
      get: function() { return wrapperHeight; },
      set: function(value) {
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
    return function debounced () {
      var obj = this, args = arguments;
      function delayed () {
        if (!execAsap)
            func.apply(obj, args);
        timeout = null;
      }
      if (timeout)
        clearTimeout(timeout);
      else if (execAsap)
        func.apply(obj, args);
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
  var move = function(el, delta, moveTo, time, easing) {
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
  var calcDistance = function(speed, moveFrom, moveTo) {
    return (moveTo - moveFrom) * (1-speed);
    // return ((moveTo-moveFrom)*speed) - (moveTo - moveFrom);
  };

  /**
   * Execute update callback for an element.
   * @param  {el} obj.
   * @param  {posY} number.
   * @param {number} time
   * @param {string} easing cubic bezier easing function.
   */
  var execElement = function( el, posY, time, easing ) {
    // A problem  occurs when elements change speed and/or direction.
    // You are moving an element at a rate of 2, and you set the element
    // to move at a rate of 3 when the user scrolls past 800px, the move function
    // will not be called exactly on every breakpoint. It could be called at 790px
    // and next on 805px. When called at 805px, the element would move 15px
    // at a new speed. This is the issue.

    // Sort keys array in ASC when scrolling down, and DESC when scrolling up.
    var bp,
        prevBp,
        keys = Object.keys(el.update).sort(function(a,b) {
          return posY < el.posY ? b-a : a-b;
        });

    for ( var i=0,len=keys.length; i<len; i+=1 ) {
      bp = keys[i];
      prevBp = keys[i+1] ? keys[i+1] : null;

      // If we are scrolling down.
      if ( posY > el.posY && bp > el.posY && bp <= posY ) {
        move.call( o, el, calcDistance(el.speed, el.posY, bp), bp, time, easing );
        el.update[bp].call(el);
      }
      // If we are scrolling up.
      if ( posY < el.posY && prevBp && bp < el.posY && bp >= posY ) {
        move.call( o, el, calcDistance(el.speed, el.posY, bp), bp, time, easing );
        el.update[prevBp].call(el);
      }
    }

  };

  /**
   * Register each element using the o.addCallback method.
   * @param  {object} element
   */
  var bindElement = function( el ) {
    o.addCallback(function( posY, time, easing ) {
      if ( Object.keys(el.update).length > 0 )
        execElement( el, posY, time, easing );
      move.call( o, el, calcDistance(el.speed, el.posY, posY), posY, time, easing );
    });
  };

  /**
   * Apply parallax specific styling to the collection wrapper element.
   * @param {object} collection
   * @param {string} DOM selector
   */
  var styleCollection = function( collection, selector ) {
    var css = {
      'position': 'relative', // Use relative positioning to preserve child element alignment.
      'margin-top': '0',
      'margin-bottom': '0',
      'padding-top': '0',
      'padding-bottom': '0'
    };

    // Add styling to the collection element.
    collection.el = $( selector ).css( css );
  };

  /**
   * Apply parallax specific styling to each element in a collection.
   * @param  {object} el
   * @param  {string} selector
   * @param  {number} offset
   */
  var styleElement = function( el, selector ) {
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
    el.el = $( selector ).css( css );
  };

  /**
   * Get the current value for a object property such as
   * speed, top, zIndex, and hide.
   * @param  {mixed} value object or string of an element property.
   * @param  {number} width width of browser window.
   * @return {curry function}
   */
  var getVal = function( value ) {
    return function(width) {
      if ( typeof value !== 'object' ) return value;
      var keys = Object.keys(value);
      for ( var i=0, len=keys.length; i<len; i+=1 ) {
        if ( width >= parseInt(keys[len-i-1], 10) )
          return value[keys[len-i-1]];
      }
    };
  };

  /**
   * Magic.
   * @param  {object} el
   * @return {number} offset
   */
  var normalizeCollection = function( el ) {
    var hide   = getVal(el.hide),
        zIndex = getVal(el.zIndex),
        top    = getVal(el.top);

    el.hide = hide(o.width);
    el.zIndex = zIndex(o.width);
    el.top =  top(o.width);

    o.onResize(function() {
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
  var normalizeElement = function( el, offset ) {
    var speed  = getVal(el.speed),
        hide   = getVal(el.hide),
        zIndex = getVal(el.zIndex),
        top    = getVal(el.top);

    el.speed = speed(o.width);
    el.hide = hide(o.width);
    el.zIndex = zIndex(o.width);
    el.top =  ( el.speed !== 0 ) ? top(o.width)*el.speed : top(o.width);

    o.onResize(function() {
      el.speed = speed(o.width);
      el.hide = hide(o.width);
      el.zIndex = zIndex(o.width);
      el.top = ( el.speed !== 0 ) ? top(o.width)*el.speed : top(o.width);
      // if ( typeof el.init !== 'undefined' )
      //   el.init.call(el);
    });

    // Reset inital values.
    if ( Object.keys(el.update).length > 0 && typeof el.update[0] === 'undefined' ) {
      el.update[0] = function() {
        el.speed  = speed(o.width);
        el.hide   = hide(o.width);
        el.zIndex = zIndex(o.width);
        el.top =  ( el.speed !== 0 ) ? top(o.width)*el.speed : top(o.width);
      };
    }

  };

  /**
   * Dynamically set the wrapper height. Will adjust on resize.
   * @param {object} el
   * @param {number} offset Collection offset top
   */
  var setWrapperHeight = function(el, offset) {
    var elementHeight;
    o.addCallback(function(posY) {
      if ( o.wrapperHeight ) return;
      // For some reason if I initialize height outside this fn the value will be incorrect. DOM not ready?
      if (!elementHeight) elementHeight = el.el.height();
      // var distFromTop = el.top + el.delta + offset - posY;
      var distFromTop = el.el.offset().top - posY;
      var pxFromBottom = elementHeight - winHeight + distFromTop;
      if ( pxFromBottom <= 0 ) {
        o.wrapperHeight = posY + winHeight + pxFromBottom;
      }
    });

    o.onResize(function() {
      o.wrapperHeight = null;
    });
  };

  var initParallax = function() {
    for ( var i in collections ) {
      // Collection.
      styleCollection( collections[i], i );
      collections[i] = new ParallaxCollection( collections[i] );
      normalizeCollection( collections[i] );

      // Elements.
      var elements = collections[i].elements;
      for ( var ii in elements ) {
        styleElement( elements[ii], ii );
        elements[ii] = new ParallaxElement( elements[ii] );
        normalizeElement( elements[ii], collections[i].top );
        bindElement( elements[ii] );

        // Set wrapper height
        if ( elements[ii].last )
          setWrapperHeight.call(o, elements[ii], collections[i].top );

        // Call update, and init methods on page load if they apply.
        if ( typeof elements[ii].init === 'function' )
          elements[ii].init.call( elements[ii] );
        if ( typeof elements[ii].update[0] !== 'undefined' )
          elements[ii].update[0].call( elements[ii] );
      }
    }
  };

  /**
   * Style iScroll wrapper and first child.
   * @param  {string} selector id or class
   */
  var styleIscroll = function( el ) {
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

  var initIScroll = function( el ) {
    // Create an iScroll instance.
    var scroll = new IScroll(el.selector, { mouseWheel: false });

    // Modify prototype to execute parallax callbacks on scroll.
    IScroll.prototype._translate = function(x, y) {
      if ( this.options.useTransform ) {
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
      execCallbacks( -y, parseInt(this.scrollerStyle.transitionDuration,10) || 0, this.scrollerStyle.transitionTimingFunction );
    };

    styleIscroll( el );

    // Disable touch events.
    doc.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    return scroll;
  };

  /**
   * Add a counter to the browser to display the number of pixels
   * that have been scrolled.
   */
  var initDebugger = function() {
    $body.append( '<p class="parallax-debugger">0</p>' );

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

    o.addCallback(function( posY ) {
      o.debugger.html( Math.round( posY ) );
    });

  };

  var execCallbacks = function( posY, time, easing ) {
    callbacks.forEach( function(fn) {
      fn.call(o, posY, time, easing );
    });
  };

  /**
   * Public methods.
   */
  o.getElement = function(selector) {
    for ( var i in collections ) {
      if ( collections[i].elements[selector] )
        return collections[i].elements[selector];
    }
    return null;
  };

  o.addCollection = function( collection ) {
    collections[ Object.keys(collection).toString() ] = collection[Object.keys(collection)];
    return o;
  };

  o.onResize = function(fn) {
    resize.push(fn);
    return o;
  };

  o.addCallback = function(fn) {
    callbacks.push(fn);
    return o;
  };

  o.scrollTo = function(posY, time) {
    if ( isTouch ) {
      o.iscroll.scrollTo(0, posY, time || 0);
    }
    else {
      // body selector no work in firefox.
      $bodyHtml.animate({
        scrollTop: posY + 'px'
      }, time );
    }
    return o;
  };

  o.scrollToElement = function(el, time, offset) {
    if ( isTouch ) {
      o.iscroll.scrollToElement(el.el.selector, time || 0);
    }
    else {
      var toMove = ((el.el.offset().top - win.pageYOffset) / el.speed) - (offset||0);
      o.scrollTo( win.pageYOffset + toMove, time || 0);
    }
    return o;
  };

  o.init = function( selector, options ) {
    $doc.on('ready', function() {

      styleDOM(selector);
      initParallax();

      if ( isTouch ) {
        o.iscroll = initIScroll( $wrapper );
        o.iscroll.refresh(); // @hack
        o.onResize(function(){
          o.iscroll.refresh();
        });
      }

      if ( options.debug ) initDebugger();
    });

    // Respond to scroll events.
    if ( !isTouch )
      $win.on('scroll', function(e) {
        execCallbacks( win.pageYOffset, 0, 'cubic-bezier(0.1, 0.57, 0.1, 1)' );
      });

    // Resize recalculations.
    o.onResize(function() {
      o.width = win.innerWidth;
      winHeight = win.innerHeight;
    });

    var debouncedResize = debounce(function() {
      resize.forEach( function(fn) {
        fn.call(o);
      });
    }, 100);
    $win.on('resize', debouncedResize);

    return o;
  };

  return o;

}(jQuery, window, document));
