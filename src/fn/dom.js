var domReady = (function () {
  var addEventListener = !!document.addEventListener,
      isReady = false,
      toplevel = false,
      testEl = document.documentElement,
      fns = [];

  if (addEventListener) {
    document.addEventListener('DOMContentLoaded', function done () {
      document.removeEventListener('DOMContentLoaded', done, false);
      ready();
    }, true);
    window.addEventListener('load', ready, false);
  } else {
    document.attachEvent('onreadystatechange', function done () {
      if (document.readyState === 'complete') document.detachEvent('onreadystatechange', done);
      ready();
    });
    window.attachEvent('onload', ready);

    if (testEl.doScroll && window === window.top) {
      scrollCheck();
    }
  }

  // If IE is used, use the trick by Diego Perini
  // http://javascript.nwbox.com/IEContentLoaded/
  function scrollCheck () {
    if (isReady) return;

    try {
      testEl.doScroll('left');
    } catch(e) {
      setTimeout(scrollCheck, 10);
    }

    ready();
  }

  function ready () {
    if (isReady) return;

    isReady = true;

    for (var i = 0; i < fns.length; i++) {
      fns[i].call(document);
    }
  }

  return function (callback) {
    return isReady ? callback.call(document) : fns.push(callback);
  };
})();

/** 
 * Adding domReady to tire and tire.fn
 */

tire.ready = tire.fn.ready = domReady;

tire.fn.extend({

  /**
   * Check if the first element in the element collection matches the selector
   *
   * @param {String|Object} selector The selector match
   * @return {Boolean}
   */
   
  is: function (selector) {
    return this.length > 0 && tire.matches(this[0], selector);
  },

  /**
   * Get text for the first element in the collection
   * Set text for every element in the collection
   *
   * $('div').text() => div text
   * $('input[type=text]').text() => input value
   *
   * @todo Add support for multiple inputs value, maybe use the another function for that.
   *
   * @param {String} text
   * @return {Object|String}
   */
   
  text: function (text) {
    if (text === undefined) {
      return this.length > 0 ? (this[0].tagName.toLowerCase() === 'input' ? this[0].value : this[0].textContent) : null;
    } else {
      this.each(function () {
        if (this.tagName.toLowerCase() === 'input') {
          this.value = text;
        } else {
          this.textContent = text;
        }
      });
    }
  },
  
  /**
   * Empty `innerHTML` for elements
   *
   * @return {Object} 
   */
  
  empty: function () {
    return this.each(function () {
      this.innerHTML = '';
    });
  },
  
  /**
   * Get html for the first element in the collection
   * Set html for every elements in the collection
   *
   * @param {String|Object} html
   * @param {String} location
   * @return {String|Object}
   */
  
  html: function (html, location) {
    if (arguments.length === 0) {
      return this.length > 0 ? this[0].innerHTML : null;
    }
        
    location = location || 'inner';
    
    return this.each(function () {
      if (location === 'inner') {
        if (tire.isStr(html) || tire.isNum(html)) {
          this.innerHTML = html;
        } else {
          this.innerHTML = '';
          this.appendChild(html);
        }
      } else if (location === 'remove') {
        this.parentNode.removeChild(this);
      } else {
        var wrapped  = wrap(html)
          , children = wrapped.childNodes
          , parent;
      
        if (location === 'prepend') {
          this.insertBefore(wrapped, this.firstChild);
        } else if (location === 'append') {
          this.insertBefore(wrapped, null);
        } else if (location === 'before') {
          this.parentNode.insertBefore(wrapped, this);
        } else if (location === 'after') {
          this.parentNode.insertBefore(wrapped, (this.nextElementSibling ? this.nextElementSibling : this.nextSibling));
        }

        parent = wrapped.parentNode;
        while (children.length) {
          parent.insertBefore(children[0], wrapped);
        }
        parent.removeChild(wrapped);
      }
    });
  }
});

'prepend append before after remove'.split(' ').forEach(function (name) {
  tire.fn[name] = function (name) {
    return function (html) {
      return this.html(html, name);
    };
  }(name);
});


function wrap (html) {
  var elm = document.createElement('div');
  if (tire.isStr(html)) {
    elm.innerHTML = html;
  } else {
    elm.appendChild(html);
  }
  return elm;
}