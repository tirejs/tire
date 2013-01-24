tire.fn.extend({
  
  /**
   * Get css property
   * Set css properties
   *
   * Examples:
   *
   *     // Get property
   *     $('div').css('color'); will return the css property
   *
   *     // Set properties
   *     $('div').css('color', 'black');
   *     $('div').css({ color: 'black', backgroundColor: 'white' });
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
      if (tire.isString(prop)) {
        this.style[prop] = value;
      } else {
        for (var key in prop) {
          this.style[key] = prop[key];
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
    return this.css('display', '');
  }
});

function getPropertyValue(elm, prop) {
  var value = '';
  if (document.defaultView && document.defaultView.getComputedStyle) {
    prop = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
    value = document.defaultView.getComputedStyle(elm, '').getPropertyValue(prop);
  } else if (elm.currentStyle) {
    value = elm.currentStyle[prop];
  } else {
    value = elm.style[prop];
  }
  return !!value ? value : '';
}