const ParallaxBro = require('../lib');

const laxbro = new ParallaxBro();

var page1, page2;

page1 = laxbro.addCollection('#collection1', {
  top: 200,
  // hide: {1000: true},
  center: true,
});

page1.addElements({
  '#img1': {
    speed: {
      0: 1,
      300: -1,
    },
    top: {
      // 500: 100,
    },
    // hide: {
    //   100: false,
    //   600: true,
    // },
    // speed: {
    //   0: 1,
    //   200: .5,
    //   300: 0,
    //   400: -1,
    // },
  },
  // '#img2': {
  //   hide: true,
  //   top: 800,
  //   zIndex: 0,
  //   speed: .1,
  //   update: {
  //     0: () => {
  //       this.el.fadeIn();
  //     },
  //     400: () => {
  //       this.el.fadeOut();
  //     }
  //   }
  // }
});
