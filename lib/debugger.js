export default class Debugger {
  constructor() {
    $body.append( '<p class="parallax-debugger">0</p>' );

    o.debugger = $('.parallax-debugger').css({
      'position': 'fixed',
      'top': '0',
      'right': '0',
      'font-size': '24px',
      'color': 'white',
      'background': 'black',
      'padding': '20px',
      'z-index': '100000'
    });

    o.addCallback(function( posY ) {
      o.debugger.html( Math.round( posY ) );
    });    
  }
}
