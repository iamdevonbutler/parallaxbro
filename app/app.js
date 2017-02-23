const ParallaxBro = require('../lib');

const laxbro = new ParallaxBro('#parallax', 2900, {
  // debug: true
});


const c1 = laxbro.addCollection('#collection1');
c1.addElements({
  '[src="images/intro.jpg"]': {
    top: 200,
    center: true,
    speed: .6,
  },
});

const c2 = laxbro.addCollection('#collection2', {top: 1000});
c2.addElements({
  '[src="images/project-launch.jpg"]': {
    zIndex: 1,
    speed: 1.3,
    top: 700,
    center: true,
    xFunc: {
      1200: (posY) => posY
    },
  },
  '[src="images/splatter-projectlaunch-1.jpg"]': {
    speed: 1,
    center: true,
  },
  '[src="images/splatter-projectlaunch-3.png"]': {
    top: 100,
    xFunc: {
      1200: (posY) => -posY
    },
    speed: {
      0: 1.5,
      700: 0,
      1200: 1.5,
    },
  },
});

const c3 = laxbro.addCollection('#collection3', {top: 2000});
c2.addElements({
  '[src="images/outro.jpg"]': {
    top: 0,
    center: true,
    speed: {
      1600: -1,
    },
    update: {
      0: ($el) => {
        $el.fadeOut();
      },
      1600: ($el) => {
        $el.fadeIn();
      }
    }
  },
});
