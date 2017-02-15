const {prefix, normalizeOptions, runUpdate} = require('./utils');

var $;

module.exports = class ParallaxElement {

  constructor(selector, options, offsetTop) {
    const {top, hide, zIndex, speed, center} = normalizeOptions(options, {
      top: {value: 0},
      hide: {value: false},
      zIndex: {value: -1},
      speed: {value: 1},
      center: {value: false},
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
    this.styleElement(selector, {center, top});
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
    this.$el.css('top', value+'px');
  }

  center(value) {
    this.center.value = value;
    this.$el.css({
      'margin-right': 'auto',
      'margin-left': 'auto',
    });
  }

  moveElement(posY) {
    var $el, speed, delta, prefix;

    this.runCallbacks(posY);
    prefix = this.prefix;
    $el = this.$el;
    speed = this.speed;

    delta = Math.round(posY*speed*100) / 100;

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
    runUpdate(posY, prevY, this.offsetTop, (value) => {
      this.offsetY = value;
    });
  }

  updateHide(posY) {
    var prevY = this.prevPosY;
    runUpdate(posY, prevY, this.hide, (value) => {
      this.$el.css('display', value ? 'none' : 'block');
    });
  }

  updateTop(posY) {
    var prevY = this.prevPosY;
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
