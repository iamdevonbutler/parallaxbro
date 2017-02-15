const {normalizeOptions, runUpdate} = require('./utils');
const ParallaxElement = require('./ParallaxElement');

var $;

module.exports = class ParallaxCollection {

  constructor(selector, options) {
    options = normalizeOptions(options, {
      top: {value: 0},
      hide: {value: false},
      zIndex: {value: -1},
      center: {value: false},
    });
    const {top, hide, zIndex, center} = options;

    this.$el;
    this.elements = [];
    this.prevPosY;

    this.top = top;
    this.hide = hide;
    this.zIndex = zIndex;
    this.center = center;

    this.jQuery();
    this.styleCollection(selector, options);
  }

  // hide(value) {
  //   this.hide.value = value;
  //   this.$el.css('display', value ? 'none' : 'block');
  // }

  // zIndex(value) {
  //   this.zIndex.value = value;
  //   this.$el.css('zIndex', value);
  // }
  //
  // top(value) {
  //   var top;
  //   this.top.value = value;
  //   this.$el.children().css('top', value + 'px');
  // }
  //
  // center(value) {
  //   this.center.value = value;
  //   this.$el.children().css({
  //     'margin-right': 'auto',
  //     'margin-left': 'auto',
  //   });
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
    element = new ParallaxElement(selector, options, this.top);
    this.elements.push(element);
    return this;
  }

  moveElements(posY) {
    var elements;
    elements = this.elements;
    this.runCallbacks(posY);
    elements.forEach(element => element.moveElement(posY));
    this.prevPosY = posY;
  }

  runCallbacks(posY) {
    this.updateHide(posY);
    // this.updateZindex(posY);
    // this.updateCenter(posY);
  }

  updateHide(posY) {
    var prevY = this.prevPosY;
    runUpdate(posY, prevY, this.hide, (value) => {
      this.$el.css('opacity', value ? 0 : 1);
    });
  }

  updateZindex(posY) {
    var prevY = this.prevPosY;
    runUpdate(posY, prevY, this.zIndex, (value) => {
      this.$el.css('zIndex', value);
    });
  }

  updateCenter(posY) {
    var prevY = this.prevPosY;
    runUpdate(posY, prevY, this.center, (value) => {
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

  jQuery() {
    $ = jQuery;
    if (!$) {
      throw 'jQuery is not defined';
    }
  }

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
