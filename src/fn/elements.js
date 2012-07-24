tire.fn.extend({
  
  /**
   * Filter element collection
   *
   * @param {String|Function} obj
   * @return {Object}
   */
  
  filter: function (obj) {
    if (tire.isFun(obj)) {
      var elements = [];
      this.each(function (elm, index) {
        if (obj.call(elm, index)) {
          elements.push(elm);
        }
      });
      return tire(elements);
    } else {
      return this.filter(function () {
        return tire.matches(this, obj);
      });
    }
  },
  
  /**
   * Get elements in list but not with this selector
   *
   * @param {String} selector
   * @return {Object}
   */
  
  not: function (selector) {      
    return this.filter(function () {
      return !tire.matches(this, selector);
    });
  },
  
  /** 
   * Get the element at position specified by index from the current collection.
   *
   * @param {Integer} index
   * @return {Object}
   */
  
  eq: function (index) {
    return index === -1 ? tire(slice.call(this, this.length -1)) : tire(slice.call(this, index, index + 1));
  }
});