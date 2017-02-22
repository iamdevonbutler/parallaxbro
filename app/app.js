const ParallaxBro = require('../lib');

const laxbro = new ParallaxBro('#parallax', 2000);


const c1 = laxbro.addCollection('#collection1', {
  hide: true,
});

c1.addElements({
  '[src="images/intro.jpg"]': {
    top: 200,
    center: true,
    speed: .6,
  },
  '[src="images/splatter-intro1.jpg"]': {
    top: 800,
    center: true,
    speed: .8,
    zIndex: -2,
  },
});

const c2 = laxbro.addCollection('#collection2', {
  center: true,
});

c2.addElements({
  '[src="images/project-launch.jpg"]': {
    zIndex: 1,
    speed: 1.5,
    top: 600,
  },
  '[src="images/splatter-projectlaunch-1.jpg"]': {
    speed: 1,

  },
  '[src="images/splatter-projectlaunch-3.png"]': {
    speed: 1,
  },
});
