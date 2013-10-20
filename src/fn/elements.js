tire.fn.extend({

  /**
   * Filter element collection
   *
   * @param {String|Function} obj
   * @return {Object}
   */

  filter: function (obj) {
    if (tire.isFunction(obj)) {
      var els = [];
      this.each(function (index, el) {
        if (obj.call(el, index)) {
          els.push(el);
        }
      });
      return tire(els);
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
   * @param {Number} index
   * @return {Object}
   */

  eq: function (index) {
    return index === -1 ? tire(slice.call(this, this.length -1)) : tire(slice.call(this, index, index + 1));
  },

  /**
   * Retrieve the DOM elements matched by the tire object.
   *
   * @param {Number} index
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
    var els = [];
    this.each(function () {
      els.push(this.cloneNode(true));
    });
    return tire(els);
  },

  /**
   * Toggle show/hide.
   *
   * @param {Boolean} state
   * @return {Object}
   */

  toggle: function (state) {
    return this.each(function () {
      var el = $(this);
      el[(state === undefined ? el.css('display') === 'none' : state) ? 'show': 'hide']();
    });
  },

  /**
   * Toggle class.
   *
   * @param {Function|String} name
   * @param {Boolean} state
   * @return {Object}
   */

  toggleClass: function (name, state) {
    return this.each(function (i) {
      var el = $(this);
      name = tire.isFunction(name) ? name.call(this, i, el.attr('class'), state) : tire.isString(name) ? name : '';
      tire.each(name.split(/\s+/g), function (i, klass) {
        el[(state === undefined ? !el.hasClass(klass) : state) ? 'addClass' : 'removeClass'](klass);
      });
    });
  }
});