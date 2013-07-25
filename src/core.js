var document   = window.document
  , _tire      = window.tire
  , _$         = window.$
  , idExp      = /^#([\w\-]*)$/
  , classExp   = /^\.([\w\-]*)$/
  , tagNameExp = /^[\w\-]+$/
  , tagExp     = /^<([\w:]+)/
  , slice      = [].slice
  , splice     = [].splice
  , noop       = function () {};

// If slice is not available we provide a backup
try {
  slice.call(document.childNodes);
} catch(e) {
  slice = function (i, e) {
    i = i || 0;
    var el, results = [];
    for (; (el = this[i]); i++) {
      if (i === e) break;
      results.push(el);
    }
    return results;
  };
}

var tire = function (selector, context) {
  return new tire.fn.find(selector, context);
};

tire.fn = tire.prototype = {

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
   * @param {String|Object|Function|Array} selector
   * @param {Object} context
   *
   * @return {Object}
   */

  find: function (selector, context) {
    var els = [], attrs;

    if (!selector) {
      return this;
    }

    if (tire.isFunction(selector)) {
      return tire.ready(selector);
    }

    if (selector.nodeType) {
      this.selector = '';
      this.context = selector;
      return this.set([selector]);
    }

    if (selector.length === 1 && selector[0].nodeType) {
      this.selector = this.context = selector[0];
      return this.set(selector);
    }

    context = this.context ? this.context : (context || document);

    if (tire.isPlainObject(context)) {
      attrs = context;
      context = document;
    }

    if (context instanceof tire) {
      context = context.context;
    }

    if (tire.isString(selector)) {
      this.selector = selector;
      if (idExp.test(selector) && context.nodeType === context.DOCUMENT_NODE) {
        els = (els = context.getElementById(selector.substr(1))) ? [els] : [];
      } else if (context.nodeType !== 1 && context.nodeType !== 9) {
        els = [];
      } else if (tagExp.test(selector)) {
        tire.each(normalize(selector), function () {
          els.push(this);
        });
      } else {
        els = slice.call(
          classExp.test(selector) && context.getElementsByClassName !== undefined ? context.getElementsByClassName(selector.substr(1)) :
          tagNameExp.test(selector) ? context.getElementsByTagName(selector) :
          context.querySelectorAll(selector)
        );
      }
    } else if (selector.nodeName || selector === window) {
      els = [selector];
    } else if (tire.isArray(selector)) {
      els = selector;
    }

    if (selector.selector !== undefined) {
      this.selector = selector.selector;
      this.context = selector.context;
    } else if (this.context === undefined) {
      if (els[0] !== undefined && !tire.isString(els[0])) {
        this.context = els[0];
      } else {
        this.context = document;
      }
    }

    return this.set(els).each(function () {
      return attrs && tire(this).attr(attrs);
    });
  },

  /**
   * Fetch property from elements
   *
   * @param {String} prop
   * @return {Array}
   */

  pluck: function (prop) {
    var result = [];
    this.each(function () {
      if (this[prop]) result.push(this[prop]);
    });
    return result;
  },

  /**
   * Run callback for each element in the collection
   *
   * @param {Function} callback
   * @return {Object}
   */

  each: function(target, callback) {
    var i, key;

    if (typeof target === 'function') {
      callback = target;
      target = this;
    }

    if (target === this || target instanceof Array) {
      for (i = 0; i < target.length; ++i) {
        if (callback.call(target[i], i, target[i]) === false) break;
      }
    } else {
      if (target instanceof tire) {
        return tire.each(slice.call(target), callback);
      } else {
        for (key in target) {
          if (target.hasOwnProperty(key) && callback.call(target[key], key, target[key]) === false) break;
        }
      }
    }

    return target;
  },

  /**
   * Set elements to tire object before returning `this`
   *
   * @param {Array} elements
   * @return {Object}
   */

  set: function (elements) {
    // Introduce a fresh `tire` set to prevent context from being overridden
    var i = 0, set = tire();
    set.selector = this.selector;
    set.context = this.context;
    for (; i < elements.length; i++) {
      set[i] = elements[i];
    }
    set.length = i;
    return set;
  }
};

/**
 * Extend `tire` with arguments, if the arguments length is one the extend target is `tire`
 */

tire.extend = function () {
  var target = arguments[0] || {};

  if (typeof target !== 'object' && typeof target !== 'function') {
    target = {};
  }

  if (arguments.length === 1) target = this;

  tire.fn.each(slice.call(arguments), function (i, value) {
    for (var key in value) {
      if (target[key] !== value[key]) target[key] = value[key];
    }
  });

  return target;
};

tire.fn.find.prototype = tire.fn;

tire.extend({

  // The current version of tire being used
  version: '{{version}}',

  // We sould be able to use each outside
  each: tire.fn.each,

  /**
   * Trim string
   *
   * @param {String} str
   * @return {String}
   */

  trim: function (str) {
    return str == null ? '' : str.trim ? str.trim() : ('' + str).replace(/^\s+|\s+$/g, '');
  },

  /**
   * Check to see if a DOM element is a descendant of another DOM element.
   *
   * @param {Object} parent
   * @param {Object} node
   *
   * @return {Boolean}
   */

  contains: function (parent, node) {
    return parent.contains ? parent != node && parent.contains(node) : !!(parent.compareDocumentPosition(node) & 16);
  },

  /**
   * Check if the element matches the selector
   *
   * @param {Object} el
   * @param {String} selector
   * @return {Boolean}
   */

  matches: function (el, selector) {
    if (!el || el.nodeType !== 1) return false;

    // Trying to use matchesSelector if it is available
    var matchesSelector = el.webkitMatchesSelector || el.mozMatchesSelector || el.oMatchesSelector || el.matchesSelector;
    if (matchesSelector) {
      return matchesSelector.call(el, selector);
    }

    // querySelectorAll fallback
    if (document.querySelectorAll !== undefined) {
      var nodes = el.parentNode.querySelectorAll(selector);

      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i] === el) return true;
      }
    }

    return false;
  },

  /**
   * Check if the `obj` is a function
   *
   * @param {Object} obj
   * @return {Boolean}
   */

  isFunction: function (obj) {
    return typeof obj === 'function';
  },

  /**
   * Check if the `obj` is a array
   *
   * @param {Object} obj
   * @return {Boolean}
   */

  isArray: function (obj) {
    return obj instanceof Array;
  },

  /**
   * Check if the `obj` is a string
   *
   * @param {Object} obj
   * @return {Boolean}
   */

  isString: function (obj) {
    return typeof obj === 'string';
  },

  /**
   * Check if the `obj` is a number
   *
   * @param {Object} obj
   * @return {Boolean}
   */

  isNumeric: function (obj) {
    return typeof obj === 'number';
  },

  /**
   * Check if the `obj` is a object
   *
   * @param {Object} obj
   * @return {Boolean}
   */

  isObject: function (obj) {
    return obj instanceof Object && !this.isArray(obj) && !this.isFunction(obj) && !this.isWindow(obj);
  },

  /**
   * Check if `obj` is a plain object
   *
   * @param {Object} obj
   * @return {Boolean}
   */

  isPlainObject: function (obj) {
    if (!obj || !this.isObject(obj) || this.isWindow(obj) || obj.nodeType) {
      return false;
    } else if (obj.__proto__ === Object.prototype) {
      return true;
    } else {
      var key;
      for (key in obj) {}
      return key === undefined || {}.hasOwnProperty.call(obj, key);
    }
  },

  /**
   * Check if `obj` is a `window` object
   */

  isWindow: function (obj) {
    return obj !== null && obj !== undefined && (obj === obj.window || 'setInterval' in obj);
  },

  /**
   * Parse JSON string to object.
   *
   * @param {String} str
   * @return {Object|null}
   */

  parseJSON: function (str) {
    if (!this.isString(str) || !str) {
      return null;
    }

    str = this.trim(str);

    if (window.JSON && window.JSON.parse) {
      return window.JSON.parse(str);
    }

    // Solution to fix JSON parse support for older browser. Not so nice but it works.
    try { return (new Function('return ' + str))(); }
    catch (e) { return null; }
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