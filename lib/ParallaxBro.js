const ParallaxCollection = require('./ParallaxCollection');

var $;

module.exports = class ParalaxBro {

  /**
   * @param {Object} options
   */
  constructor(options) {
    const {wrapper, disableStyles} = this._normalizeOptions(options);

    this.collections = [];

    this._jQuery();
    this._cacheDOMElements(wrapper);
    this._bindEvents();
    if (!disableStyles) {
      this._styleDOM();
    }
  }

  /**
   * @param {String} selector
   * @param {Object} options
   */
  addCollection(selector, options) {
    var collection;
    collection = new ParallaxCollection(selector, options);
    this.collections.push(collection);
    return collection;
  }

  /**
   * @param {String} wrapper
   */
  _cacheDOMElements(wrapper) {
    this.$el = {};
    this.$el.win = $(window);
    this.$el.doc = $(document);
    this.$el.body = $('body');
    this.$el.wrapper = $(wrapper);
  }

  _styleDOM() {
    var {body, wrapper, doc} = this.$el;
    body.css('height', '100%');
    wrapper.css('min-height', '100%');
  }

  _bindEvents() {
    const track = () => {
      var posY = window.pageYOffset;
      this._moveElements(posY);
      requestAnimationFrame(track);
    }
    requestAnimationFrame(track);
  }

  /**
   * @param {Number} posY
   */
  _moveElements(posY) {
    var collections;
    collections = this.collections;
    collections.forEach(collection => collection._moveElements(posY));
  }

  _jQuery() {
    $ = jQuery;
    if (!$) {
      throw 'jQuery is not defined';
    }
  }

  _normalizeOptions(options) {
    return Object.assign({}, {
      wrapper: '#parallax',
      disableStyles: false,
    }, options);
  }

}
