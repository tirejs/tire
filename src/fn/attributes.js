tire.fn.extend({

  /**
   * Add classes to element collection
   *
   * @param {String} value
   */

  addClass: function (value) {
    if (value && tire.isString(value)) {
      return this.each(function (elm) {
        if (elm.nodeType === 1) {
          var classNames = value.split(/\s+/);
          if (!elm.className && classNames.length === 1) {
            elm.className = value;
          } else {
            var className = elm.className;

            for (var i = 0; i < classNames.length; i++) {
              if (className.indexOf(classNames[i]) === -1) {
                className += ' ' + classNames[i];
              }
            }

            elm.className = tire.trim(className);
          }
        }
      });
    }
  },

  /**
   * Remove classes from element collection
   *
   * @param {String} value
   */

  removeClass: function (value) {
    return this.each(function (elm) {
      if (value && tire.isString(value)) {
        var classNames = value.split(/\s+/);
        if (elm.nodeType === 1 && elm.className) {
          if (classNames.length === 1) {
           elm.className = elm.className.replace(value, '');
          } else {
            for (var i = 0; i < classNames.length; i++) {
              elm.className = elm.className.replace(classNames[i], '');
            }
          }

          elm.className = tire.trim(elm.className.replace(/\s{2}/g, ' '));

          if (elm.className === '') {
            elm.removeAttribute('class');
          }
        }
      }
    });
  },

  /**
   * Check if the first element in the collection has classes
   *
   * @param {String} value
   * @return {Boolean}
   */

  hasClass: function (value) {
    var classNames = (this[0] ? this[0] : this).className.split(/\s+/)
      , values = value.split(/\s+/)
      , i = 0;

    if (values.length > 1) {
      var hasClasses = false;
      for (i = 0; i < values.length; i++) {
        hasClasses = this.hasClass.call(this, values[i]);
      }
      return hasClasses;
    } else if (tire.isString(value)) {
      for (i = 0; i < classNames.length; i++) {
        if (classNames[i] === value) return true;
      }
      return false;
    }
  },

  /**
   * Get attribute from element
   * Set attribute to element collection
   *
   * @param {String} name
   * @param {String|Object} value
   *
   * @return {Object|String}
   */

  attr: function (name, value) {
    if (tire.isObject(name)) {
      return this.each(function () {
        for (var key in name) {
          if (this.setAttribute) {
            // Firefox 3.5 fix "null + '';"
            this.setAttribute(key, name[key] === null ? name[key] + '' : name[key]);
          }
        }
      });
    } else if ((value || value === null || value === false) && tire.isString(name)) {
      return this.each(function () {
        if (this.setAttribute) {
          // Firefox 3.5 fix "null + '';"
          this.setAttribute(name, value === null ? value + '' : value);
        }
      });
    } else if (tire.isString(name)) {
      var attribute;
      for (var i = 0; i < this.length; i++) {
        if (this[i].getAttribute !== undefined && (attribute = this[i].getAttribute(name)) !== null) {
          break;
        } else {
          continue;
        }
      }
      return attribute;
    }
  },

  /**
   * Shortcut for data-* attributes.
   *
   * @param {String} name
   * @param {String|Object} value
   *
   * @return {Object|String}
   */

  data: function (name, value) {
    value = this.attr('data-' + name, seralizeValue(value));
    return value instanceof tire ? value : deseralizeValue(value);
  },

  /**
   * Remove attributes from element collection
   *
   * @param {String} name
   *
   * @return {Object}
   */

  removeAttr: function (name) {
    return this.each(function () {
      if (name && this.nodeType === 1) {
        var attrNames = name.split(/\s+/);
        for (var i = 0; i < attrNames.length; i++) {
          this.removeAttribute(attrNames[i]);
        }
      }
    });
  }
});

/**
 * Serialize value into string
 *
 * @param {Object} value
 *
 * @return {String}
 */

function seralizeValue (value) {
  try {
    return value ? (tire.isPlainObject(value) || tire.isArray(value)) &&
    JSON.stringify ? JSON.stringify(value) : value : value;
  } catch (e) {
    return value;
  }
}

/**
 * Deserialize value from string to true, false, null, number, object or array.
 *
 * @param {String} value
 *
 * @return {Object}
 */

function deseralizeValue (value) {
  var num;
  try {
    return value ? value === 'true' || (value === 'false' ? false :
    value === 'null' ? null : !isNaN(num = Number(value)) ? num :
    /^[\[\{]/.test(value) ? tire.parseJSON(value) : value) : value;
  } catch (e) {
    return value;
  }
}