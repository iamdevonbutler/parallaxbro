const ParallaxBro = require('../lib');

const laxbro = new ParallaxBro('#parallax', 2000);


const c1 = laxbro.addCollection('#collection1', {
  // hide: true,
});

c1.addElements({
  '[src="images/intro.jpg"]': {
    top: 200,
    center: true,
    speed: .6,
  },
  '[src="images/splatter_intro1.jpg"]': {
    top: 800,
    center: true,
    speed: .8,
    zIndex: -2,
  }
});

const c2 = laxbro.addCollection('#collection2', {

});
