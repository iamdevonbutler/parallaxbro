const ParallaxCollection = require('./ParallaxCollection');

var $;

module.exports = class ParalaxBro {

  constructor(options) {
    const {wrapper, disableStyles} = this.normalizeOptions(options);

    this.collections = [];

    this.jQuery();
    this.cacheDOMElements(wrapper);
    this.bindEvents();
    if (!disableStyles) {
      this.styleDOM();
    }
  }

  addCollection(selector, obj) {
    var collection;
    collection = new ParallaxCollection(selector, obj);
    this.collections.push(collection);
    return collection;
  }

  cacheDOMElements(wrapper) {
    this.$el = {};
    this.$el.win = $(window);
    this.$el.doc = $(document);
    this.$el.body = $('body');
    this.$el.wrapper = $(wrapper);
  }

  styleDOM() {
    var {body, wrapper, doc} = this.$el;
    body.css('height', '100%');
    wrapper.css('min-height', '100%');
  }

  bindEvents() {
    const track = () => {
      var posY = window.pageYOffset;
      this.moveElements(posY);
      requestAnimationFrame(track);
    }
    requestAnimationFrame(track);
  }


  moveElements(posY) {
    var collections;
    collections = this.collections;
    collections.forEach(collection => collection.moveElements(posY));
  }

  jQuery() {
    $ = jQuery;
    if (!$) {
      throw 'jQuery is not defined';
    }
  }

  normalizeOptions(options) {
    return Object.assign({}, {
      wrapper: '#parallax',
      disableStyles: false,
    }, options);
  }

}
