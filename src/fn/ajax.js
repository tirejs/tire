tire.extend({

  /**
   * Ajax method to create ajax request with XMLHTTPRequest (or ActiveXObject).
   * Support for JSONP. Cross domain via plugin.
   *
   * @param {String|Object} url
   * @param {Object|Function} options
   * @return {Object}
   */

  ajax: function (url, options) {
    options = options || this.ajaxSettings;

    if (tire.isObject(url)) {
      if (tire.isFunction(options)) {
        url.success = url.success || options;
      }
      options = url;
      url = options.url;
    }

    if (tire.isFunction(options)) options = { success: options };

    for (var opt in this.ajaxSettings) {
      if (!options.hasOwnProperty(opt)) {
        options[opt] = this.ajaxSettings[opt];
      }
    }

    var xhr = options.xhr
      , jsonp = options.dataType === 'jsonp'
      , mime = {
          html: 'text/html',
          text: 'text/plain',
          xml: 'application/xml, text/xml',
          json: 'application/json'
        }
      , params = tire.param(options.data) !== '' ? tire.param(options.data) : null;

    for (var k in mine) {
      if (url.indexOf('.' + k) !== -1 && !options.dataType) options.dataType = k;
    }

    // test for jsonp
    if (jsonp || /\=\?|callback\=/.test(url)) {
      if (!/\=\?/.test(url)) url = (url + '&callback=?').replace(/[&?]{1,2}/, '?');
      tire.ajaxJSONP(url, options);
      return this;
    }

    if (xhr) {
      xhr.queryString = params;
      xhr.open(options.type, url, true);
      xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');

      if ((mime = mime[options.dataType.toLowerCase()]) !== undefined) {
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
              tire.ajaxSuccess(null, xhr, options);
            }
          } else if (options.error !== undefined) {
            options.error(xhr, options);
          }
        }
      };

      if (tire.isFunction(options.beforeSend)) {
        var bs = options.beforeSend(xhr, options);
        if (bs !== false) {
          xhr.send(params);
        }
      } else {
        xhr.send(params);
      }
    }
  },

  /**
   * Create a JSONP request
   *
   * @param {String} url
   * @param {Object} options
   */

  ajaxJSONP: function (url, options) {
    var name = (name = /callback\=([A-Za-z0-9\-\.]+)/.exec(url)) ? name[1] : 'jsonp' + (+new Date())
      , elm = document.createElement('script');

    elm.onerror = function () {
      tire(elm).remove();
      try { delete window[name]; }
      catch (e) { window[name] = undefined; }
      if (tire.isFunction(options.error)) options.error('abort');
    };

    window[name] = function (data) {
      tire(elm).remove();
      try { delete window[name]; }
      catch (e) { window[name] = undefined; }
      tire.ajaxSuccess(data, null, options);
    };

    options.data = tire.param(options.data);
    elm.src = url.replace(/\=\?/, '=' + name);
    tire('head')[0].appendChild(elm);
  },

  /**
   * Default ajax settings.
   */

  ajaxSettings: {

    // Modified the xhr object before send. Default is null.
    beforeSend: null,

    // Tell server witch content type it is.
    contentType: 'application/x-www-form-urlencoded',

    // Data that is send to the server.
    data: {},

    // The type of the data.
    // Can be: json, jsonp, html, text, xml.
    dataType: '',

    // Error function that is called on failed request.
    // Take to arguments, xhr and the options object.
    error: function () {},

    // An object of additional header key/value pairs to send along with the request
    headers: {},

    // Function that runs on a successful request.
    // Takes on argument, the response.
    success: function () {},

    // The type of the request. Default is GET.
    type: 'GET',

    // The url to make request to. If empty no request will be made.
    url: '',

    // The `xhr` object.
    // ActiveXObject when available (IE), otherwise XMLHttpRequest.
    xhr: window.ActiveXObject ?
      new ActiveXObject('Microsoft.XMLHTTP') :
      new XMLHttpRequest()

  },

  /**
   * Ajax success. Check if the dataType is JSON and try to parse it or just return the response text/xml.
   *
   * @param {Object} data
   * @param {Object} xhr
   * @param {Object} options
   *
   * @return {Object}
   */

  ajaxSuccess: function (data, xhr, options) {
    var res;
    if (xhr) {
      if ((options.dataType === 'json' || false) && (res = tire.parseJSON(xhr.responseText)) === null) res = xhr.responseText;
      if (options.dataType === 'xml') res = xhr.responseXML;
      res = res || xhr.responseText;
    }
    if (!res && data) res = data;
    if (tire.isFunction(options.success)) options.success(res);
  },

  /**
   * Create a serialized representation of an array or object.
   *
   * @param {Array|Object} obj
   * @param {Obj} prefix
   * @return {String}
   */

  param: function (obj, prefix) {
    var str = [];
    this.each(obj, function (p, v) {
      var k = prefix ? prefix + '[' + p + ']' : p;
      str.push(tire.isObject(v) ? tire.param(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
    });
    return str.join('&').replace('%20', '+');
  }
});
