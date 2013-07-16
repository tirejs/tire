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
      return this.length > 0 ? this[0].textContent === undefined ? this[0].innerText : this[0].textContent : null;
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

      return null;
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
      this.innerHTML = '';
    });
  },

  /**
   * Get html for the first element in the collection
   * Set html for every elements in the collection
   *
   * @param {String|Object} html
   * @param {String} location
   * @return {String|Object}
   */

  html: function (html, location) {
    if (arguments.length === 0) {
      return this.length > 0 ? this[0].innerHTML : null;
    }

    location = location || 'inner';

    if (html instanceof tire) {
      var self = this;
      return html.each(function (index, elm) {
        self.html.call(self, elm, location);
      });
    }

    return this.each(function () {
      if (location === 'inner') {
        if (tire.isString(html) || tire.isNumeric(html)) {
          this.innerHTML = html;
        } else {
          this.innerHTML = '';
          this.appendChild(html);
        }
      } else if (location === 'remove') {
        this.parentNode.removeChild(this);
      } else {
        var wrapped  = wrap(html)
          , children = wrapped.childNodes
          , parent;

        if (location === 'prepend') {
          target(this, html).insertBefore(wrapped, this.firstChild);
        } else if (location === 'append') {
          target(this, html).appendChild(wrapped);
        } else if (location === 'before') {
          this.parentNode.insertBefore(wrapped, this);
        } else if (location === 'after') {
          this.parentNode.insertBefore(wrapped, (this.nextElementSibling ? this.nextElementSibling : this.nextSibling));
        }

        parent = wrapped.parentNode;
        while (children.length) {
          parent.insertBefore(children[0], wrapped);
        }
        parent.removeChild(wrapped);
      }
    });
  }
});

tire.each(['prepend', 'append', 'before', 'after', 'remove'], function (index, name) {
  tire.fn[name] = function (name) {
    return function (html) {
      return this.html(html, name);
    };
  }(name);
});

function wrap (html) {
  var name = tagExp.exec(html)[1]
    , elm = document.createElement('div');
  if (containers.hasOwnProperty(name)) elm = containers[name];
  if (tire.isString(html) || tire.isNumeric(html)) {
    elm.innerHTML = html;
  } else {
    elm.appendChild(html);
  }
  return elm;
}

function nodeName (elm, name) {
  return elm.nodeName.toLowerCase() === name.toLowerCase();
}

function target (elm, html) {
  return nodeName(elm, 'table') && tagExp.exec(html)[1] === 'tr' ?
    elm.getElementsByTagName('tbody')[0] || elm.appendChild(elm.ownerDocument.createElement('tbody')) :
    elm;
}