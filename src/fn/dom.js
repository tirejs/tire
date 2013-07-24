var domReady = (function () {
  var addEventListener = !!document.addEventListener,
      isReady = false,
      toplevel = false,
      testEl = document.documentElement,
      fns = [];

  if (addEventListener) {
    document.addEventListener('DOMContentLoaded', done, true);
    window.addEventListener('load', ready, false);
  } else {
    document.attachEvent('onreadystatechange', done);
    window.attachEvent('onload', ready);

    if (testEl.doScroll && window === window.top) {
      scrollCheck();
    }
  }

  function done () {
    if (addEventListener) {
      document.removeEventListener('DOMContentLoaded', done, false);
    } else {
      document.readyState === 'complete' && document.detachEvent('onreadystatechange', done);
    }
    ready();
  }

  // If IE is used, use the trick by Diego Perini
  // http://javascript.nwbox.com/IEContentLoaded/
  function scrollCheck () {
    if (isReady) return;

    try {
      testEl.doScroll('left');
    } catch(e) {
      setTimeout(scrollCheck, 10);
    }

    ready();
  }

  function ready () {
    if (isReady) return;

    isReady = true;

    for (var i = 0; i < fns.length; i++) {
      fns[i].call(document, tire);
    }
  }

  return function (callback) {
    return isReady ? callback.call(document, tire) : fns.push(callback);
  };
})();

/**
 * Adding domReady to tire and tire.fn
 */

tire.ready = tire.fn.ready = domReady;

tire.fn.extend({

  /**
   * Check if the first element in the element collection matches the selector
   *
   * @param {String|Object} selector The selector match
   * @return {Boolean}
   */

  is: function (selector) {
    return this.length > 0 && tire.matches(this[0], selector);
  },

  /**
   * Get the first element that matches the selector, beginning at the current element and progressing up through the DOM tree.
   *
   * @param {String} selector
   * @param {Object} context
   * @return {Object}
   */

  closest: function (selector, context) {
    var node = this[0];

    while (node && !tire.matches(node, selector)) {
      node = node.parentNode;
      if (!node || !node.ownerDocument || node === context || node.nodeType === 11) break;
    }

    return tire(node);
  },

  /**
   * Get immediate parents of each element in the collection.
   * If CSS selector is given, filter results to include only ones matching the selector.
   *
   * @param {String} selector
   * @return {Object}
   */

  parent: function (selector) {
    var parent = this.pluck('parentNode');
    return selector === undefined ? tire(parent) : tire(parent).filter(selector);
  },

  /**
   * Get immediate children of each element in the current collection.
   * If selector is given, filter the results to only include ones matching the CSS selector.
   *
   * @param {String} selector
   * @return {Object}
   */

  children: function (selector) {
    var children = [];
    this.each(function () {
      tire.each(slice.call(this.children, 0), function (index, value) {
        children.push(value);
      });
    });
    return selector === undefined ? tire(children) : tire(children).filter(selector);
  },

  /**
   * Get text for the first element in the collection
   * Set text for every element in the collection
   *
   * $('div').text() => div text
   *
   * @param {String} text
   * @return {Object|String}
   */

  text: function (text) {
    if (text === undefined) {
      return this.length > 0 ? this[0].textContent === undefined ? this[0].innerText : this[0].textContent : '';
    } else {
      return this.each(function () {
        this.textContent = text;
      });
    }
  },

  /**
   * Get value for input/select elements
   * Set value for input/select elements
   *
   * @param {String} value
   * @return {Object|String}
   */

  val: function (value) {
    if (!arguments.length) {
      if (this.length > 0) {
        return this[0].multiple ? this.find('option').filter(function () {
          return this.selected;
        }).pluck('value') : this[0].value;
      }

      return undefined;
    } else {
      return this.each(function () {
        if (this.nodeType !== 1) {
          return;
        } else if (value === null || value === undefined) {
          value = '';
        } else if (tire.isNumeric(value)) {
          value += '';
        }
        this.value = value;
      });
    }
  },

  /**
   * Empty `innerHTML` for elements
   *
   * @return {Object}
   */

  empty: function () {
    return this.each(function () {
      while (this.hasChildNodes()) {
        this.removeChild(this.childNodes[0]);
      }
    });
  }
});