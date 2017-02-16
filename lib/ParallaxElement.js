const {prefix, normalizeOptions, runUpdate} = require('./utils');

var $;

module.exports = class ParallaxElement {

  /**
   * @param {String} selector
   * @param {Object} options
   * @param {Object} offsetTop
   */
  constructor(selector, options, offsetTop) {
    options = normalizeOptions(options, {
      top: {value: 0},
      hide: {value: false},
      zIndex: {value: -1},
      speed: {value: 1},
      center: {value: false},
      update: {value: () => {}},
    });
    const {top, hide, zIndex, speed, center, update} = options;

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
    this.update = update;

    this.jQuery();
    this.styleElement(selector, {center, top});
  }

  /**
   * @param {Number} posY
   */
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
      delta += Math.round(yDiff*lastSpeed*100) / 100;

      yDiff = breakpoint - posY;
      delta += Math.round(yDiff*speed*100) / 100;

      this.speed._breakpoint = undefined;
    }
    else {
      let yDiff;
      delta = 0;
      yDiff = yPrev - posY;
      delta = Math.round(yDiff*speed*100) / 100;
    }

    yNew = tPrev + delta;

    $el[0].style[prefix.dom + 'Transform'] = `translate3d(0px, ${yNew}px, 0) translateZ(0) scale(1)`;
    this.yPrev = posY;
    this.tPrev = yNew;
    return this;
  }

  /**
   * @param {Number} posY
   */
  runCallbacks(posY) {
    this.updateHide(posY);
    this.updateZindex(posY);
    this.updateTop(posY);
    this.updateOffset(posY);
    this.updateSpeed(posY);
    this.updateCallback(posY);
  }

  /**
   * @param {Number} posY
   */
  updateHide(posY) {
    var yPrev = this.yPrev;
    runUpdate(posY, yPrev, this.hide, (value) => {
      this.hide.value = value;
      this.$el.css('display', value ? 'none' : 'block');
    });
  }

  updateZindex(posY) {
    var prevY = this.yPrev;
    runUpdate(posY, prevY, this.zIndex, (value) => {
      this.zIndex.value = value;
      this.$el.css('zIndex', value);
    });
  }

  /**
   * @param {Number} posY
   */
  updateTop(posY) {
    var yPrev = this.yPrev;
    runUpdate(posY, yPrev, this.top, (value) => {
      var yOffset = this.yOffset;
      this.top.value = value = value + yOffset;
      this.$el.css('top', value + 'px');
    });
  }

  /**
   * @param {Number} posY
   */
  updateOffset(posY) {
    var yPrev = this.yPrev;
    runUpdate(posY, yPrev, this.offsetTop, (value) => {
      var yDiff, top;
      yDiff = value - this.yOffset;
      this.yOffset = value;
      top = parseInt(this.$el.css('top'), 10);
      this.$el.css('top', top + yDiff + 'px');
    });
  }

  /**
   * @param {Number} posY
   */
  updateSpeed(posY) {
    var yPrev = this.yPrev;
    runUpdate(posY, yPrev, this.speed, (value, breakpoint, scrollingDown, actualBreakpoint) => {
      this.speed._breakpoint = actualBreakpoint;
      this.speed._lastSpeed = this.speed.value;
      this.speed.value = value;
    });
  }

  /**
   * @param {Number} posY
   */
  updateCallback(posY) {
    var yPrev, $el, self;
    yPrev = this.yPrev;
    $el = this.$el;
    self = this;
    runUpdate(posY, yPrev, this.update, (value, breakpoint) => {
      self.update.breakpoints[breakpoint].call(self, $el, posY, yPrev);
    });
  }

  jQuery() {
    $ = jQuery;
    if (!$) {
      throw 'jQuery is not defined';
    }
    return this;
  }

  /**
   * @param {String} selector
   * @param {Object} options
   */
  styleElement(selector, options) {
    var $el, css, yOffset;
    var {center, top} = options;
    yOffset = this.yOffset;
    css = {
      'position': 'fixed',
      'left': 0,
      'right': 0,
    };
    if (center.value) {
      css['margin-right'] = 'auto';
      css['margin-left'] = 'auto';
    }
    if (top.value) {
      css.top = top + yOffset + 'px';
    }
    $el = $(selector);
    $el.css(css);
    this.$el = $el;
    return this;
  }

}
