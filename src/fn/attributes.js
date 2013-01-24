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
          this.setAttribute(key, name[key]);
        }
      });
    } else if (value && (tire.isString(value) || tire.isNumber(value))) {
      return this.each(function () {
        this.setAttribute(name, value);
      });
    } else if (tire.isString(name)) {
      var attribute;
      for (var i = 0; i < this.length; i++) {
        if ((attribute = this[i].getAttribute(name)) !== null) {
          break;
        } else {
          continue;
        }
      }
      return attribute;
    }
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