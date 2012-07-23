tire.fn.extend({
  
  /**
   * Filter element collection
   *
   * @param {Function} callback
   * @return {Object}
   */
  
  filter: function (callback) {
    var elements = [];
    this.each(function (elm, index) {
      if (tire.isFun(callback) && callback.call(elm, index)) {
        elements.push(elm);
      }
    });
    return this.set(elements);
  },
  
  /**
   * Get elements in list but not with this selector
   * Will get all elements that match this selector and remove it from the element collection
   *
   * @param {String|Object} selector
   * @return {Object}
   */
  
  not: function (selector) {      
    var self = this,
        elms = this.find(selector);
        
    return this.filter(function () {
      var found = true;
      for (var i = 0; i < elms.length; i++) {
        if (this === elms[i]) found = false;
      }
      if (found) return this;
    });
  },
  
  /** 
   * Get the element at position specified by index from the current collection.
   *
   * @param {Integer} index
   * @return {Object}
   */
  
  eq: function (index) {
    return index === -1 ? this.slice(index) : this.slice(index, index + 1);
  }
});