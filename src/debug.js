module.exports = class Debug {

  init() {
    var $debugger;

    $('body').append('<span id="parallaxbroDebugger">0</span>');

    $debugger = $('#parallaxbroDebugger');

    $debugger.css({
      'position': 'fixed',
      'top': '0',
      'right': '0',
      'font-size': '17px',
      'color': 'white',
      'background': 'black',
      'padding': '10px 12px',
      'z-index': '100000',
      'border-top-left-radius': '4px',
      'border-bottom-left-radius': '4px',
    });

    setInterval(() => {
      $debugger.html(Math.round(window.pageYOffset));
    }, 250);
  }

}
