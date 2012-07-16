var document   = window.document
  , _tire      = window.tire
  , _$         = window.$
  , idExp      = /^#/
  , simpleExp  = /^#?([\w-]+)$/
  , classExp   = /^\./
  , tagExp     = /<([\w:]+)/
  , slice      = [].slice
  , trim       = String.prototype.trim;

// Array Remove - By John Resig (MIT Licensed)
Array.remove = function (array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};

var tire = function (selector, context) {
  return new tire.fn.find(selector, context);
}

tire.fn = tire.prototype = {
  
  constructor: tire,
  
  length: 0,
  
  /**
   * Extend `tire.fn`
   *
   * @param {Object} o
   */
    
  extend: function (o) {
    for (var k in o) {
      this[k] = o[k];
    }
  },
  
  find: function (selector, context) {
    
  }
}