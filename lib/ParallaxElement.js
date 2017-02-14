const {prefix} = require('./utils');

var $;

module.exports = class ParallaxElement {

  constructor(selector, options) {
    const {top, hide, zIndex, speed} = this.normalizeOptions(options);

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
    if (this.$el) this.$el.css('top', value+'px');
  }

  moveElement(posY) {
    var $el, speed, delta, prefix;
    prefix = this.prefix;
    $el = this.$el;
    speed = this.speed;
    delta = posY*speed;
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
      'padding-bottom': '0',
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
      speed: 1,
    }, options);
  }

}
