const self = module.exports;

/**
 * Given a Mixed value type check.
 * @param {Mixed} value.
 * @param {String} type.
 * @return {Boolean}
 * @api public.
 * @tests unit.
 */
self.isType = (value, type) => {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && Number.isNaN(value) === false;
    case 'boolean':
      return value === true || value === false;
    case 'array':
      return Array.isArray(value);
    case 'object':
      return typeof value === 'object' && value !== null && Array.isArray(value) === false;
    case 'null':
      return value === null;
    case 'undefined':
      return value === undefined;
    case 'function':
      return Object.prototype.toString.call(value) === '[object Function]';
    case 'symbol':
      return typeof value === 'symbol';
    case 'NaN':
      return Number.isNaN(value);
    case 'date':
      return value instanceof Date;
    default:
      throw new Error(`Unrecgonized type: "${type}"`);
  }
};

self.prefix = () => {
  var styles;
  styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('')
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('webkit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
    return {
      dom: dom,
      lowercase: pre,
      css: '-' + pre + '-',
      js: pre[0].toUpperCase() + pre.substr(1)
    };
};

// http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
self.debounce = (func, threshold, execAsap) => {
  var timeout;
  return function debounced () {
    var obj = this, args = arguments;
    function delayed () {
      if (!execAsap) func.apply(obj, args);
      timeout = null;
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    else if (execAsap) {
      func.apply(obj, args);
    }
    timeout = setTimeout(delayed, threshold || 100);
  };
};
