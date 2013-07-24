var wrapTags = /^(select|fieldset|table|tbody|tfoot|td|tr|colgroup)$/i
  , wrapMap = {
      thead: ['<table>', '</table>', 1],
      col: ['<table><colgroup>', '</colgroup></table>', 2],
      tr: ['<table><tbody>', '</tbody></table>', 2],
      td: ['<table><tbody><tr>', '</tr></tbody></table>', 3]
    };

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

function isNode (node) {
  return node && node.nodeName && (node.nodeType === 1 || node.nodeType === 11);
}

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

function nodeName (elm, name) {
  return elm.nodeName.toLowerCase() === name.toLowerCase();
}

function target (elm, html) {
  return nodeName(elm, 'table') && tagExp.test(html) && tagExp.exec(html)[1] === 'tr' ?
    elm.getElementsByTagName('tbody')[0] || elm.appendChild(elm.ownerDocument.createElement('tbody')) :
    elm;
}

tire.fn.extend({

  append: function (node) {
    return this.each(function (i, el) {
      tire.each(normalize(node), function () {
        target(el, node).appendChild(this);
      });
    });
  },

  prepend: function (node) {
    return this.each(function (i, el) {
      var first = target(el, node).firstChild;
      if (!first) return tire(this).append(node);
      tire.each(normalize(node), function () {
        first.parentNode.insertBefore(this, first);
      });
    });
  },

  before: function (node) {
    return this.each(function (i, el) {
      tire.each(normalize(node), function () {
        el.parentNode.insertBefore(this, el);
      });
    });
  },

  after: function (node) {
    return this.each(function (i, el) {
      tire.each(normalize(node), function () {
        el.parentNode.insertBefore(this, el.nextSibling);
      });
    });
  },

  remove: function () {
    return this.each(function () {
      this.parentNode.removeChild(this);
    });
  },

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