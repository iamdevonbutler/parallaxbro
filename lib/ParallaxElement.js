const {prefix, isType} = require('./utils');

var $;

module.exports = class ParallaxElement {

  constructor(selector, options) {
    const {top, hide, zIndex, speed, center} = this.normalizeOptions(options);

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
    this.styleElement(selector, {center, top});
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

    delta = Math.round(posY*speed*100) / 100;

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

    for (let i=0; i<yDiff; i++) {
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
    this.exec(posY, 'hide', (value) => {
      this.$el.css('display', value ? 'none' : 'block');
    });
  }

  execTop(posY) {
    this.exec(posY, 'top', (value) => {
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
    var {center, top} = options;
    css = {
      'position': 'fixed',
      'left': 0,
      'right': 0,
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
      top: {value: 0},
      hide: {value: false},
      zIndex: {value: -1},
      speed: {value: 1},
      center: {value: false},
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
          breakpoints: Object.assign({}, {0: value1}, value),
        }
      }
      else {
        options[key] = {
          value,
          breakpoints: {0: value}
        }
      }
    });

    options = Object.assign({}, defaults, options);

    return options;
  }

}
