tire.fn.extend({
  
  /**
   * Get css property
   *
   * $('div').css('color'); will return the css property
   *
   * Set css properties
   *
   * $('div').css('color', 'black');
   * $('div').css({ color: 'black', backgroundColor: 'white' });
   *
   * @param {String|Object} prop
   * @param {String} value
   * @return {String|Object}
   */
  
  css: function (prop, value) {
    if (tire.isStr(prop) && value === undefined) {
      return this.length > 0 ? getPropertyValue(this[0], prop) : undefined;
    }
    
    return this.each(function () {
      if (tire.isStr(prop)) {
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
  } else {
    value = elm.style[prop];
  }  
  return !!value ? value : '';
}