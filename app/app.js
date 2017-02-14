const ParallaxBro = require('../lib');

const laxbro = new ParallaxBro();

var page1, page2;

page1 = laxbro.addCollection('#collection1', {
  top: 0,
  hide: false,
});

page1.addElements({
  '#img1': {
    top: 0,
    speed: .5,
  },
  '#img2': {
    top: 400,
    zIndex: 0,
    speed: .8,
    update: {
      0: () => {
        this.el.fadeIn();
      },
      400: () => {
        this.el.fadeOut();
      }
    }
  }
});
