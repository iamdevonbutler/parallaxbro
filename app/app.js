const ParallaxBro = require('../lib');

const laxbro = new ParallaxBro('#parallax', 2000, {debug: true});


const c1 = laxbro.addCollection('#collection1', {

});

c1.addElements({
  '[src="images/intro.jpg"]': {
    top: 200,
    center: true,
    speed: .6,
  },
  // '[src="images/splatter-intro1.jpg"]': {
  //   top: 800,
  //   center: true,
  //   speed: .8,
  //   zIndex: -2,
  // },
});

const c2 = laxbro.addCollection('#collection2', {
  top: 1100,
});

c2.addElements({
  '[src="images/project-launch.jpg"]': {
    zIndex: 1,
    speed: 1.3,
    top: 700,
    center: true,
  },
  '[src="images/splatter-projectlaunch-1.jpg"]': {
    speed: 1,
    center: true,
  },
  '[src="images/splatter-projectlaunch-3.png"]': {
    top: 100,
    speed: {
      0: 1.5,
      // 900: 0,
    },
  },
});
