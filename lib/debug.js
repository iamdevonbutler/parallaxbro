'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function Debug() {
    _classCallCheck(this, Debug);
  }

  _createClass(Debug, [{
    key: 'init',
    value: function init() {
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
        'border-bottom-left-radius': '4px'
      });

      setInterval(function () {
        $debugger.html(Math.round(window.pageYOffset));
      }, 250);
    }
  }]);

  return Debug;
}();