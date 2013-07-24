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
  return typeof node === 'string' ? wrap(node) : isNode(node) ? [node] : node;
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

function nodeName (elm, name) {
  return elm.nodeName.toLowerCase() === name.toLowerCase();
}

/**
 * Find right target to use with dom manipulation methods.
 *
 * @param {Object} elm
 * @param {String} html
 * @return {Object}
 */

function target (elm, html) {
  return nodeName(elm, 'table') && tagExp.test(html) && tagExp.exec(html)[1] === 'tr' ?
    elm.getElementsByTagName('tbody')[0] || elm.appendChild(elm.ownerDocument.createElement('tbody')) :
    elm;
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
    if (typeof html === 'undefined') {
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
  }

});