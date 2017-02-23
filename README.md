# ParallaxBro

```javascript
const ParallaxBro = require('parallaxbro');
const laxbro = new ParallaxBro('#wrapper', '2000px');

const c1 = laxbro.addCollection('#collection1');

c1.addElements({
  '#element1': {
    top: 100, // All position values are assumed to be in px.
    hide: {0: false, 500: true}, // Will hide once window.pageYOffset >= 500px.
    center: true, // Applies 'margin: 0 auto'
    speed: {
      0: 1, // Speed 1 is normal scrolling rate.
      500: 0, // Speed 0 will stop the element from scrolling.
      1000: -1, // Negative values scroll the element in reverse.
    }
    zIndex: -1, // -1 is default zIndex for all elements.
    update: {
      0: ($el, posY) => $el.fadeOut(), // $el is jQuery wrapped element.
      1000: ($el, posY) => $el.fadeIn(), // Called when window.pageYOffset ≈ 1000.
    },
    xFunc: (posY) => posY,  
  },
  '#element2': { /* ... */ }
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

See [App.js](https://github.com/iamdevonbutler/parallaxbro/blob/master/app/app.js) to view the demo's parallaxbro config.


## Collections and elements

Parallax *elements* are grouped into *collections*. A collection is a convenient way to apply behaviors to a group of elements. Properties such as: `top`, and `hide`, are applied to all elements in a collection. Collections are a useful in the development of parallax designs. For instance, they offer a convenient way to either hide or position sections of your content.


## Multi parameter objects
In the example above, the `hide` and `speed` options accept both simple Boolean / Number values or a keyed object. The object keys, we call them breakpoints, change the behavior of your program when the page's y-scroll position is === the breakpoint. Object values for options can be passed to both **collections and elements**.

```javascript
c1.addElement('#wrapper', {
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
const c1 = require('./collection');

c1.addElements('#element1', {
  /**
  * @param {Object} $el - element wrapped in jQuery
  * @param {Number} posY
  * @this - the parallax element.
  */
  update: {
    0: ($el, posY) => $el.fadeOut()
    200: ($el, posY) => $el.fadeIn()
  }
});
```

## xFunc
The xFunc option for parallax elements allows you to move elements on the x-axis in addition to the y-axis.

```javascript
const c1 = require('./collection');

c1.addElements('#element1', {
    xFunc: {
      1200: (posY) => -posY
    },
});
```
The callback is passed **posY** (pageYOffset - breakpoint), and the function should return the element's new x position.


## Debug mode
Pass the option `debug=true` to add a **window.pageYOffset** indicator to the page.


## API

### ParallaxBro(selector, height, [options]) *- constructor.*

**@param {String} selector**

Selector string of the wrapper element.

**@param {Number} height**

Static height of the parallax page. It's useful to set it to a large number in development and change it once your design is completed.

**@param {Object} [options]**

* debug {Boolean} - adds a debugger to the page.
* disableStyles {Boolean} - disable ParalaxBro default page styling.
* height {String} - parallax page height.


### .addCollection(selector, [options])

```javascript
const ParallaxBro = require('parallaxbro');
const laxbro = new ParallaxBro('#wrapper');

const c1 = laxbro.addCollection('#collection1', {});

```

**@param {String} selector**
Selector string of the collection wrapper element.

**@param {Object} [options]**

Options include:
* top {Number|Object}
* hide {Boolean|Object}
* zIndex {Number|Object}
* update {Object}


### .addElements(obj)

```javascript
const c1 = require('./collection');

c1.addElements({
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
* xFunc {Function|Object}


### .addElement(selector, obj)

```javascript
const c1 = require('./collection');

c1.addElement('#elementSelector', {
  /* options */
});
```

**@param {String} selector**

Selector string of the element.


**@param {Object} options**

Options are the same as `.addElements()`
