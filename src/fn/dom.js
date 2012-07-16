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