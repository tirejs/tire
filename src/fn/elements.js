tire.fn.extend({

  /**
   * Filter element collection
   *
   * @param {String|Function} obj
   * @return {Object}
   */

  filter: function (obj) {
    if (tire.isFunction(obj)) {
      var elements = [];
      this.each(function (index, elm) {
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
  },

  /**
   * Retrieve the DOM elements matched by the tire object.
   *
   * @param {Integer} index
   * @return {object}
   */

  get: function (index) {
    return index === undefined ? slice.call(this) : this[index >= 0 ? index : index + this.length];
  },

  /**
   * Clone elements
   *
   * @return {Object}
   */

  clone: function () {
    var res = [];
    this.each(function () {
      res.push(this.cloneNode(true));
    });
    return tire(res);
  }
});