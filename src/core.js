var document   = window.document
  , _tire      = window.tire
  , _$         = window.$
  , idExp      = /^#/
  , simpleExp  = /^#?([\w-]+)$/
  , classExp   = /^\./
  , tagExp     = /<([\w:]+)/
  , slice      = [].slice
  , trim       = String.prototype.trim;

// Array Remove - By John Resig (MIT Licensed)
Array.remove = function (array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};

// If slice is not available, provide a backup, Internet Explorer 8 (and older) will need this.
try {
  slice.call(document.documentElement.childNodes, 0)[0].nodeType;
} catch(e) {
  slice = function (i) {
    var elem, results = [];
    for (; (elem = this[i]); i++ ) {
      results.push( elem );
    }
    return results;
  };
}

var tire = function (selector, context) {
  return new tire.fn.find(selector, context);
};

tire.fn = tire.prototype = {
  
  constructor: tire,
  
  /**
   * Default length is zero
   */
   
  length: 0,
  
  /**
   * Extend `tire.fn`
   *
   * @param {Object} o
   */
    
  extend: function (o) {
    for (var k in o) {
      this[k] = o[k];
    }
  },
  
  /**
   * Find elements by selector
   *
   * @param {String|Object|Function} selector
   * @param {Object} context
   *
   * @return {Object}
   */
  
  find: function (selector, context) {
    var elms = [];
    
    if (!selector) {
      return this;
    }
    
    if (tire.isFun(selector)) {
      tire.ready(selector);
    }
    
    if (selector.nodeType) {
      this.selector = '';
      this.context = selector;
      return this.set([selector]);
    }
    
    if (selector.length === 1 && selector[0].nodeType) {
      this.selector = selector.selector;
      this.context = selector[0];
      return this.set(selector);
    }
    
    this.context = context = (context || document);
    
    if (tire.isStr(selector)) {
      this.selector = selector;
      if (simpleExp.test(selector)) {
        elms = slice.call(idExp.test(selector) ? [document.getElementById(selector.substr(1))] : document.getElementsByTagName(selector), 0);
        if (elms[0] === null) {
          elms = [];
        }
      } else if (classExp.test(selector) && document.getElementsByClassName !== undefined) {
        elms = slice.call(document.getElementsByClassName(selector.substr(1)), 0);
        if (elms[0] === null) {
          elms = [];
        }
      } else if (tagExp.test(selector)) {
        var tmp = document.createElement('div');
        tmp.innerHTML = selector;
        this.each.call(slice.call(tmp.childNodes, 0), function () {
          elms.push(this);
        });
      } else {
        if (window.Sizzle !== undefined) {
          elms = Sizzle(selector, context);
        } else {
          elms = document.querySelectorAll(selector);
        }
      }
    } else  if (selector.nodeName || selector === window) {
      elms = [selector];
    }
    
    return this.set(elms);  
  },
  
  /**
   * Reduce the set of matched elements to a subset specified by a range of indices.
   * 
   * @return {Object}
   */
  
  slice: function () {
    return this.set(slice.apply(this, arguments));
  },
  
  /**
   * Run callback for each element in the collection
   *
   * @param {Function} callback
   * @return {Object}
   */
  
  each: function(callback) {
    for (var i = 0, len = this.length; i < len; ++i) {
        if (callback.call(this[i], this[i], i, this) === false)
        break;
    }
    return this;
  },
  
  /**
   * Set elements to tire object before returning `this`
   *
   * @param {Array} elements
   * @return {Object}
   */
  
  set: function (elements) {
    var i = 0;
    for (; i < elements.length; i++) {
      this[i] = elements[i];
    }
    this.length = i;
    return this;
  }
};

/**
 * Extend `tire` with arguments, if the arguments length is one the extend target is `tire`
 */

tire.extend = function () {
  var options
    , i = 1
    , target = arguments[0] || {};
  
  if (typeof target !== 'object' && typeof target !== 'function') {
    target = {};
  }

  if (arguments.length === 1) {
    target = this;
    i = 0;
  }

  for (; i < arguments.length; i++) {
    if ((options = arguments[i]) !== null) {
      for (var key in options) {
        if (target[key] === options[key]) {
          continue;
        } else {
          target[key] = options[key];
        }
      }
    }
  }

  return target;
};

tire.fn.find.prototype = tire.fn;

tire.extend({

  /**
   * Trim string. Use `String.prototype.trim` for trim or use the regex to trim
   *
   * @param {String} str
   * @return {String}
   */

  trim: function (str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
  },

  /**
   * Check if the element matches the selector
   *
   * @param {Object} element
   * @param {String} selector
   * @return {Boolean}
   */

  matches: function (element, selector) {
    if (!element || element.nodeType !== 1) return;

    // Trying to use matchesSelector if it is available
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
    if (matchesSelector) {
      return matchesSelector.call(element, selector);
    }

    // Trying to use Sizzle's matchesSelector if it is available
    if (window.Sizzle !== undefined) {
      return window.Sizzle.matchesSelector(element, selector);
    }

    // querySelectorAll fallback
    if (document.querySelectorAll !== undefined) {
      var nodes = element.parentNode.querySelectorAll(selector);

      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i] === element) return true;
      }

      return false;
    }
  },

  /**
   * Check if the object is a function
   *
   * @param {Object} obj
   * @return {Boolean}
   */

  isFun: function (obj) {
    return typeof obj === 'function';
  },

  /**
   * Check if the object is a array
   *
   * @param {Object} obj
   * @return {Boolean}
   */

  isArr: function (obj) {
    return obj instanceof Array;
  },

  /**
   * Check if the object is a string
   *
   * @param {Object} obj
   * @return {Boolean}
   */

  isStr: function (obj) {
    return typeof obj === 'string';
  },

  /**
   * Check if the object is a boolean
   *
   * @param {Object} obj
   * @return {Boolean}
   */

  isBool: function (obj) {
    return (obj === true) || (obj === false);
  },

  /**
   * Check if the object is a number
   *
   * @param {Object} obj
   * @return {Boolean}
   */

  isNum: function (obj) {
    return typeof obj === 'number';
  },

  /**
   * Check if the object is a object
   *
   * @param {Object} obj
   * @return {Boolean}
   */

  isObj: function (obj) {
    return obj instanceof Object;
  },
  
  /**
   * Parse JSON string to object.
   *
   * @param {String} str
   * @return {Object|null)
   */

  parseJSON: function (str) {
    if (!this.isStr || !str) {
      return null;
    }

    str = this.trim(str);

    if (window.JSON && window.JSON.parse) {
      return window.JSON.parse(str);
    }
  },

  /**
   * Calling .noConflict will restore the window.$` to its previous value.
   * 
   * @param {Boolean} name Restore `tire` to it's previous value.
   * @return {Object}
   */

  noConflict: function (name) {
    if (name) {
      window.tire = _tire;
    }

    window.$ = _$;
    return tire;
  }
});