const ParallaxCollection = require('./ParallaxCollection');
const Debug = require('./debug');

var $;

module.exports = class ParalaxBro {

  /**
   * @param {Object} options
   */
  constructor(selector, height = '100%', options) {
    const {disableStyles, debug} = this._normalizeOptions(options);

    this.collections = [];

    if (!selector) {
      throw 'You must pass a selector string to ParalaxBro.';
    }

    this._stopAnimationFrame = false;

    this._jQuery();
    this._cacheDOMElements(selector);
    this._bindEvents();
    if (!disableStyles) {
      this._styleDOM(height);
    }
    if (debug) {
      this._initDebug();
    }

    this._hydrateElements();
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

  unbind() {
    this._stopAnimationFrame = true;
  }

  _hydrateElements() {
    setTimeout(() => this._moveElements(0) , 0);
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

  _initDebug() {
    var debug;
    debug = new Debug();
    debug.init();
  }

  _styleDOM(height) {
    var {body, wrapper, doc} = this.$el;
    doc.children().css('height', '100%');
    body.css('height', '100%');
    wrapper.css({
      'height': height,
      'overflow': 'visible',
      'min-height': '100%',
      'box-sizing': 'border-box',
    });
    wrapper.addClass('paralaxbro');
  }

  _bindEvents() {
    const track = () => {
      if (this._stopAnimationFrame) {
        this._stopAnimationFrame = false;
        return;
      }
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
    collections.forEach(collection => collection.moveElements(posY));
  }

  _jQuery() {
    $ = jQuery;
    if (!$) {
      throw 'jQuery is not defined';
    }
  }

  _normalizeOptions(options) {
    return Object.assign({}, {
      disableStyles: false,
      height: '100%',
      debug: false,
    }, options);
  }

}
