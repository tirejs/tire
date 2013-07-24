tire.fn.extend({

  /**
   * Get css property
   * Set css properties
   *
   * @param {String|Object} prop
   * @param {String} value
   * @return {String|Object}
   */

  css: function (prop, value) {
    if (tire.isString(prop) && value === undefined) {
      return this.length > 0 ? getPropertyValue(this[0], prop) : undefined;
    }

    return this.each(function () {
      if (this.style !== undefined) {
        if (tire.isString(prop)) {
          this.style[prop] = value;
        } else {
          for (var key in prop) {
            this.style[key] = prop[key];
          }
        }
      }
    });
  },

  /**
   * Hide elements in collection
   *
   * @return {Object}
   */

  hide: function () {
    return this.css('display', 'none');
  },

  /**
   * Show elements in collection
   *
   * @return {Object}
   */

  show: function () {
    return this.each(function () {
      if (this.style !== undefined) {
        try { // This don't work in IE8.
          if (this.style.display === 'none') this.style.display = null;
        } catch (e) {}
        if (getPropertyValue(this, 'display') === 'none') this.style.display = 'block';
      }
    });
  }
});

function getPropertyValue(el, prop) {
  var value = '';
  if (document.defaultView && document.defaultView.getComputedStyle) {
    prop = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
    value = document.defaultView.getComputedStyle(el, '').getPropertyValue(prop);
  }

  if (!!value && value.length) {
    value = value;
  } else if (el.currentStyle) {
    value = el.currentStyle[prop] || el.style[prop];
  } else {
    value = el.style[prop];
  }

  return !!value ? value : '';
}