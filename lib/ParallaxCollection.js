const {normalizeOptions, runUpdate} = require('./utils');
const ParallaxElement = require('./ParallaxElement');

var $;

module.exports = class ParallaxCollection {

  /**
   * @param {String} selector
   * @param {Object} options
   */
  constructor(selector, options) {
    options = normalizeOptions(options, {
      top: {value: 0},
      hide: {value: false},
      zIndex: {value: -1},
      center: {value: false},
      update: {value: () => {}},
    });
    const {top, hide, zIndex, center, update} = options;

    this.$el;
    this.elements = [];
    this.yPrev;

    this.top = top;
    this.hide = hide;
    this.zIndex = zIndex;
    this.center = center;
    this.update = update;

    this.jQuery();
    this.styleCollection(selector, options);
  }

  /**
   * @param {Object} obj
   */
  addElements(obj) {
    var selectors, top, center;
    selectors = Object.keys(obj);
    selectors.forEach(selector => {
      var options = obj[selector];
      this.addElement(selector, options);
    });
    return this;
  }

  /**
   * @param {String} selector
   * @param {Object} options
   */
  addElement(selector, options) {
    var element;
    element = new ParallaxElement(selector, options, this.top);
    this.elements.push(element);
    return this;
  }

  /**
   * @param {Number} posY
   */
  moveElements(posY) {
    var elements;
    elements = this.elements;
    this.runCallbacks(posY);
    elements.forEach(element => element.moveElement(posY));
    this.yPrev = posY;
  }

  /**
   * @param {Number} posY
   */
  runCallbacks(posY) {
    this.updateHide(posY);
    this.updateZindex(posY);
    this.updateCenter(posY);
    this.updateCallback(posY);
  }

  /**
   * @param {Number} posY
   */
  updateHide(posY) {
    var prevY = this.yPrev;
    runUpdate(posY, prevY, this.hide, (value) => {
      this.hide.value = value;
      this.$el.css('opacity', value ? 0 : 1);
    });
  }

  /**
   * @param {Number} posY
   */
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
  updateCenter(posY) {
    var prevY = this.yPrev;
    runUpdate(posY, prevY, this.center, (value) => {
      this.center.value = value;
      if (value) {
        this.$el.css({
          'margin-right': 'auto',
          'margin-left': 'auto',
        });
      }
      else {
        this.$el.css({
          'margin-right': 'inherit',
          'margin-left': 'inherit',
        });
      }
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
  }

  /**
   * @param {String} selector
   * @param {Object} options
   */
  styleCollection(selector, options) {
    var $el, css;
    var {center, zIndex, hide} = options;
    css = {};
    css.zIndex = zIndex.value;
    if (center.value) {
      css['margin-right'] = 'auto';
      css['margin-left'] = 'auto';
    }
    if (hide.value) {
      css.display = 'none';
    }
    $el = $(selector);
    $el.css(css);
    this.$el = $el;
    return this;
  }

}
