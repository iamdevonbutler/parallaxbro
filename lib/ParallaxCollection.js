const ParallaxElement = require('./ParallaxElement');

var $;

module.exports = class ParallaxCollection {

  constructor(selector, options) {
    const {top, hide, zIndex, center} = this.normalizeOptions(options);

    this.elements = [];

    this.top = top;
    this.hide = hide;
    this.zIndex = zIndex;
    this.center = center;

    this.jQuery();
  }

  // set hide(value) {
  //   var property;
  //   property = value ? 'none' : 'block';
  //   if (this.$el) this.$el.css('display', property);
  // }
  //
  // set zIndex(value) {
  //   if (this.$el) this.$el.css('zIndex', value);
  // }

  addElements(obj) {
    var selectors, top, center;
    selectors = Object.keys(obj);
    selectors.forEach(selector => {
      var options = obj[selector];
      this.addElement(selector, options);
    });
    return this;
  }

  addElement(selector, options) {
    var element;
    element = new ParallaxElement(selector, options);
    this.elements.push(element);
    return this;
  }

  moveElements(posY) {
    var elements;
    elements = this.elements;
    elements.forEach(element => element.moveElement(posY));
  }

  jQuery() {
    $ = jQuery;
    if (!$) {
      throw 'jQuery is not defined';
    }
  }

  normalizeOptions(options) {
    return Object.assign({}, {
      top: {value: 0},
      hide: {value: false},
      zIndex: {value: -1},
      center: false,
    }, options);
  }

}
