# ParallaxBro

```javascript
const ParallaxBro = require('parallaxbro');
const laxbro = new ParallaxBro('#wrapper');

const c1 = laxbro.addCollection('#collection1', {
  top: 0,
  hide: false,
  center: false,
  zIndex: -1,
  update: {},
});

c1.addElements({
  '#element1': {
    top: 100, // Values are assumed to be in px.
    hide: {0: false, 500: true}, // Will hide once scroll pos > 500px.
    center: false,
    speed: {
      0: 1,
      500: 0,
    }
    zIndex: -1,
    update: {
      1000: function($el, posY) {
        $el.fadeIn();
      }
    },    
  },
  '#element2': {
    /* ... */
  }
});

```

## Installing

**Npm:**

```javascript
npm i --save parallaxbro
```

**Manually:**

Find the library at: [./dist/index.js](https://github.com/iamdevonbutler/parallaxbro/blob/master/dist/index.js) and [./dist/index.min.js](https://github.com/iamdevonbutler/parallaxbro/blob/master/dist/index.min.js)

\* *jQuery is a required dependency*

## Demo

[https://iamdevonbutler.github.io/parallaxbro/](https://iamdevonbutler.github.io/parallaxbro/)

## Collections and elements

Parallax *elements* are grouped into *collections*. A collection is a convenient way to apply styles to a group of elements. Properties such as: `top`, `hide`, `center`, are applied to all elements in a collection. Collections are a useful tool when developing parallax webpages.

For instance, collections, w/ use of the `hide` property, can be built in sections, w/ all inactive sections hidden (hide=true)...then, once all sections are built, each section can be vertically positioned w/ use of the `top` property.

## Parameter objects
In the example above, the `hide` and `speed` options, are set to an object, and to that - when the user scrolls down past the breakpoint (y scroll position), the element's properties will change. Options **for both collections and elements** can be written in object notation to create a dynamic sequence of option values occurring at custom breakpoints.

```javascript
c1.addElemet('#wrapper', {
  top: {
    0: 0,
    500: 100,
    1000: 1000,
  },
  hide: {
    0: false,
    1500: true,
  }
})
```

## The speed option

Setting the speed option to **1** will have no effect on the element. It will scroll w/ the page per normal.

Setting the speed option to a **negative value** will move the element in the reverse direction.

Setting the speed option to **0** will freeze the element on the page.

## Custom updates

Leverage the `update` option to preform updates of any sort at specific breakpoints:

```javascript
const collection = require('./collection');

collection.addElements('#wrapper', {
  /**
  * @param {Object} $el - element wrapped in jQuery
  * @param {Number} posY
  * @this - the parallax element.
  */
  update: {
    0: function($el, posY) {
      $el.fadeIn()
    }
    200: function($el, posY) {
      $el.fadeOut()
    }
  }
});
```

## API

### .addCollection(selector, [options])

```javascript
const ParallaxBro = require('parallaxbro');
const laxbro = new ParallaxBro('#wrapper');

const c1 = laxbro.addCollection('#collection1', {});

```

**@param {String} selector**

Selector string of the collection wrapper element.

e.g. '#wrapper'

**@param {Object} options**

Options include:
* top {Number|Object}
* hide {Boolean|Object}
* center {Boolean|Object}
* zIndex {Number|Object}
* update {Object}


### .addElements(obj)

```javascript
const collection = require('./collection');

collection.addElements({
  '#elementSelector': { /* options */ },
  '#elementSelector2': { /* options */ },
});

```

**@param {Object} options**

Options include:
* top {Number|Object}
* hide {Boolean|Object}
* speed {Number|Object}
* center {Boolean|Object}
* zIndex {Number|Object}
* update {Object}

### .addElement(selector, obj)

**@param {String} selector**

Selector string of the element.


**@param {Object} options**

Options are the same as for `.addElements()`
