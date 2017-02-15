const {prefix, normalizeOptions, runUpdate} = require('./utils');

var $;

module.exports = class ParallaxElement {

  constructor(selector, options, offsetTop) {
    options = normalizeOptions(options, {
      top: {value: 0},
      hide: {value: false},
      zIndex: {value: -1},
      speed: {value: 1},
      center: {value: false},
    });
    const {top, hide, zIndex, speed, center} = options;

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
    this.styleElement(selector, {center, top});
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
    delta = Math.round(delta*speed*100) / 100;
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
    runUpdate(posY, prevY, this.offsetTop, (value) => {
      this.offsetY = value;
    });
  }

  updateSpeed(posY) {
    var prevY = this.yPrev;
    runUpdate(posY, prevY, this.speed, (value) => {
      this.speed.value = value;
    });
  }

  updateHide(posY) {
    var prevY = this.yPrev;
    runUpdate(posY, prevY, this.hide, (value) => {
      this.$el.css('display', value ? 'none' : 'block');
    });
  }

  updateTop(posY) {
    var prevY = this.yPrev;
    runUpdate(posY, prevY, this.top, (value) => {
      var yOffset = this.yOffset;
      this.$el.css('top', value+yOffset+'px');
    });
  }

  /**
   * @param  {String} selector
   * @param  {Object} options
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
    if (center) {
      css['margin-right'] = 'auto';
      css['margin-left'] = 'auto';
    }
    if (top) {
      css.top = top+yOffset+'px';
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

}
