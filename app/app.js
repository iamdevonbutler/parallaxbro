const ParallaxBro = require('../lib');

const laxbro = new ParallaxBro();

var page1, page2;

page1 = laxbro.addCollection('#collection1', {
  top: 50,
  hide: false,
  center: true,
});

page1.addElements({
  '#img1': {
    top: {
      100: 100,
    },
    // speed: {
    //   0: 1,
    //   200: .5,
    //   300: 0,
    //   400: -1,
    // },
    center: true,
    hide: {
      100: false,
      300: true,
    }
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
