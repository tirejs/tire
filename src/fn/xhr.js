/**
 * Create a JSONP request
 * 
 * @param {String} url
 * @param {Object} options
 */

function ajaxJSONP(url, options) {
  var name = (name = /callback\=([A-Za-z0-9\-\.]+)/.exec(url)) ? name[1] : 'jsonp' + (+new Date())
    , elm = document.createElement('script');

  elm.onerror = function () {
    tire(elm).remove();
    try { delete window[name]; }
    catch (e) { window[name] = undefined; }
    if (tire.isFun(options.error)) options.error('abort');
  };
  
  window[name] = function (data) {
    tire(elm).remove();
    try { delete window[name]; }
    catch (e) { window[name] = undefined; }
    ajaxSuccess(data, null, options);
  };
  
  options.data = tire.param(options.data);
  elm.src = url.replace(/\=\?/, '=' + name);
  tire('head')[0].appendChild(elm);
}

/**
 * Ajax success, check if the dataType is json and try to parse it to JSON
 *
 * @param {Object} data
 * @param {Object} xhr
 * @param {Object} options
 * @return {Object}
 */

function ajaxSuccess(data, xhr, options) {
  var res;
  if (xhr) {
    if ((options.dataType === 'json' || false) && (res = tire.parseJSON(xhr.responseText)) === null) res = xhr.responseText;
    if (options.dataType === 'xml') res = xhr.responseXML;
    res = res || xhr.responseText;
  }
  if (!res && data) res = data;
  if (tire.isFun(options.success)) options.success(res);
}
        
tire.fn.extend({
  
  /**
   * Ajax method to create ajax request with XMLHTTPRequest (or ActiveXObject).
   * Supports JSONP, no cross domain yet.
   *
   * @param {String|Object} url
   * @param {Object|Function} options
   * @return {Object}
   */
  
  ajax: function (url, options) {
    options = options || {};
    
    if (tire.isObj(url)) {
      if (tire.isFun(options)) {
        url.success = url.success || options;
      }
      options = url;
      url = options.url;
    }
    
    if (tire.isFun(options)) options = { success: options };
    
    options.dataType = (options.dataType || '').toLowerCase();
        
    // won't do anything without a url
    if (!url) return;
    
    var self = this
      , method = (options.type || 'GET').toUpperCase()
      , params = options.data || null
      , jsonp = options.dataType === 'jsonp' || false
      , xhr
      , mime = { // support for script needed
          html: 'text/html',
          text: 'text/plain',
          xml: 'application/xml, text/xml',
          json: 'application/json'
      };
    
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // < IE 9
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    
    for (var k in mime) {
      if (url.indexOf('.' + k) !== -1) options.dataType = k;
    }
    
    // test for jsonp
    if (jsonp || /\=\?|callback\=/.test(url)) {
      if (/\=\?/.test(url)) url = (url + '&' + 'callback=?').replace(/[&?]{1,2}/, '?');
      ajaxJSONP(url, options);
      return this;
    }
    
    if (xhr) {
      xhr.queryString = params;
      xhr.open(method, url, true);
      xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
      
      if ((mime = mime[options.dataType]) !== undefined) {
        xhr.setRequestHeader('Accept', mime);
        if (mime.indexOf(',') !== -1) mime = mime.split(',')[0];
        if (xhr.overrideMimeType) xhr.overrideMimeType(mime);
      }
      
      if (options.contentType || options.data && method !== 'GET') {
        xhr.setRequestHeader('Content-Type', (options.contentType || 'application/x-www-form-urlencoded'));
      }

      for (var key in options.headers) {
        if (options.headers.hasOwnProperty(key)) {
          xhr.setRequestHeader(key, options.headers[key]);
        }
      }
      
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            if (options.success !== undefined) {
              ajaxSuccess(null, xhr, options);
            }
          } else if (options.error !== undefined) {
            options.error(xhr, options);
          }
        }
      };
      
      xhr.send(tire.param(params));
    } 

    return this;
  }
});

tire.extend({
  ajax: tire.fn.ajax,
  
  /**
   * Create a serialized representation of an array or object.
   *
   * @param {Array|Object} obj 
   * @param {Obj} prefix
   * @return {String}
   */
  
  param : function (obj, prefix) {
    var str = [];
    this.each(obj, function (p, v) {
      var k = prefix ? prefix + '[' + p + ']' : p;
      str.push(tire.isObj(v) ? tire.param(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
    });
    return str.join('&').replace('%20', '+');   
  }
});