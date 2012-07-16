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
   * Get and set text for elemenets and input's
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
  }
  
});