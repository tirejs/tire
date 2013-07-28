var wrapTags = /^(select|fieldset|table|tbody|tfoot|td|tr|colgroup)$/i
  , wrapMap = {
      thead: ['<table>', '</table>', 1],
      col: ['<table><colgroup>', '</colgroup></table>', 2],
      tr: ['<table><tbody>', '</tbody></table>', 2],
      td: ['<table><tbody><tr>', '</tr></tbody></table>', 3]
    };

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

/**
 * Check if given node is a node.
 *
 * @return {Bool}
 */

function isNode (node) {
  return node && node.nodeName && (node.nodeType === 1 || node.nodeType === 11);
}

/**
 * Collect the right nodes to work with.
 *
 * @return {Array}
 */

function normalize (node) {
  if (node instanceof tire) {
    var els = [];
    node.each(function (i, el) {
      el = normalize(el);
      el = el ? el[0] : '';
      els.push(el);
    });
    return els;
  }
  return tire.isString(node) ? wrap(node) : isNode(node) ? [node] : node;
}

/**
 * Wrap html string with a `div` or wrap special tags with their containers.
 *
 * @return {Array}
 */

function wrap (node) {
  return typeof node === 'string' && node !== '' ? function () {
    var tag = tagExp.exec(node)
      , el = document.createElement('div')
      , wrap = tag ? wrapMap[tag[1].toLowerCase()] : null
      , level = wrap ? wrap[2] + 1 : 1;
    el.innerHTML = wrap ? (wrap[0] + node + wrap[1]) : node;
    while (level--) el = el.firstChild;
    return [el];
  }() : isNode(node) ? [node.cloneNode(true)] : [];
}

/**
 * Compare the given element node name with the given name.
 *
 * @return {Bool}
 */

function nodeName (el, name) {
  return el.nodeName.toLowerCase() === name.toLowerCase();
}

/**
 * Find right target to use with dom manipulation methods.
 *
 * @param {Object} el
 * @param {String} html
 * @return {Object}
 */

function target (el, html) {
  return nodeName(el, 'table') && tagExp.test(html) && tagExp.exec(html)[1] === 'tr' ?
    el.getElementsByTagName('tbody')[0] || el.appendChild(el.ownerDocument.createElement('tbody')) :
    el;
}

tire.fn.extend({

  /**
   * Append node to element.
   *
   * @param {Object|String} node
   * @return {Object}
   */

  append: function (node) {
    return this.each(function (i, el) {
      tire.each(normalize(node), function () {
        target(el, node).appendChild(this);
      });
    });
  },

  /**
   * Prepend node to element.
   *
   * @param {Object|String} node
   * @return {Object}
   */

  prepend: function (node) {
    return this.each(function (i, el) {
      var first = target(el, node).firstChild;
      tire.each(normalize(node), function () {
        if (first) {
          first.parentNode.insertBefore(this, first);
        } else {
          target(el, node).appendChild(this);
        }
      });
    });
  },

  /**
   * Add node befor element.
   *
   * @param {Object|String} node
   * @return {Object}
   */

  before: function (node) {
    return this.each(function (i, el) {
      tire.each(normalize(node), function () {
        el.parentNode.insertBefore(this, el);
      });
    });
  },

  /**
   * Add node after element.
   *
   * @param {Object|String} node
   * @return {Object}
   */

  after: function (node) {
    return this.each(function (i, el) {
      tire.each(normalize(node), function () {
        el.parentNode.insertBefore(this, el.nextSibling);
      });
    });
  },

  /**
   * Remove element.
   *
   * @return {Object}
   */

  remove: function () {
    return this.each(function () {
      this.parentNode.removeChild(this);
    });
  },

  /**
   * Get html from element.
   * Set html to element.
   *
   * @param {Object|String} html
   * @return {Object|String}
   */

  html: function (html) {
    if (html === undefined) {
      return this[0] ? this[0].innerHTML : undefined;
    }

    return this.each(function () {
      try {
        if ((tire.isString(html) || tire.isNumeric(html)) && !wrapTags.test(this.tagName)) {
          return this.innerHTML = html;
        }
      } catch (e) {}
      var el = this;
      tire.each(normalize(this), function () {
        return el.appendChild(this);
      });
    });
  },

  /**
   * Check if the first element in the element collection matches the selector
   *
   * @param {String|Object} selector The selector match
   * @return {Boolean}
   */

  is: function (selector) {
    return this[0] && tire.matches(this[0], selector);
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
      tire.each(slice.call(this.children), function (i, value) {
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
      return this[0] ? this[0].textContent === undefined ? this[0].innerText : this[0].textContent : '';
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
      if (this[0]) {
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

/**
 * Add `appendTo`, `prependTo`, `insertBefore` and `insertAfter` methods.
 */

tire.each({
  appendTo: 'append',
  prependTo: 'prepend',
  insertBefore: 'before',
  insertAfter: 'after'
}, function (key, value) {
  tire.fn[key] = function (selector) {
    return tire(selector)[value](this);
  };
});