  // Expose tire to the global object
  window.$ = window.tire = tire;

  // Expose tire as amd module
  if (typeof define === 'function' && define.amd) {
    define('tire', [], function () {
      return tire;
    });
  }
}(window));