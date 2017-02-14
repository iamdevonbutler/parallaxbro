const ParallaxElement = require('./ParallaxElement');

var $;

module.exports = class ParallaxCollection {

  constructor(selector, options) {
    const {top, hide, zIndex} = this.normalizeOptions(options);

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
      zIndex: -1,
    }, options);
  }

}
