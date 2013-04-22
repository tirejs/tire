/**
 * Create JSONP request.
 *
 * @param {String} url
 * @param {Object} options
 */

function ajaxJSONP (url, options) {
  var name = (name = /callback\=([A-Za-z0-9\-\.]+)/.exec(url)) ? name[1] : 'jsonp' + (+new Date())
    , elm = document.createElement('script')
    , abortTimeout = null
    , cleanUp = function () {
        if (abortTimeout !== null) clearTimeout(abortTimeout);
        tire(elm).remove();
        try { delete window[name]; }
        catch (e) { window[name] = undefined; }
      }
    , abort = function (error) {
        cleanUp();
        if (error === 'timeout') window[name] = noop;
        if (tire.isFunction(options.error)) options.error(error, options);
      };

  elm.onerror = function () {
    abort('error');
  };

  if (options.timeout > 0) {
    abortTimeout = setTimeout(function () {
      abort('timeout');
    }, options.timeout);
  }

  window[name] = function (data) {
    tire(elm).remove();
    try { delete window[name]; }
    catch (e) { window[name] = undefined; }
    tire.ajaxSuccess(data, null, options);
  };

  options.data = tire.param(options.data);
  elm.src = url.replace(/\=\?/, '=' + name);
  tire('head')[0].appendChild(elm);
}

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
    options = options || tire.ajaxSettings;

    if (tire.isObject(url)) {
      if (tire.isFunction(options)) {
        url.success = url.success || options;
      }
      options = url;
      url = options.url;
    }

    if (tire.isFunction(options)) options = { success: options };

    for (var opt in tire.ajaxSettings) {
      if (!options.hasOwnProperty(opt)) {
        options[opt] = tire.ajaxSettings[opt];
      }
    }

    if (!url) return options.xhr();

    var xhr = options.xhr()
      , error = 'error'
      , abortTimeout = null
      , jsonp = options.dataType === 'jsonp'
      , mime = {
          html: 'text/html',
          text: 'text/plain',
          xml: 'application/xml, text/xml',
          json: 'application/json'
        }
      , params = tire.param(options.data) !== '' ? tire.param(options.data) : null;

    for (var k in mime) {
      if (url.indexOf('.' + k) !== -1 && !options.dataType) options.dataType = k;
    }

    // test for jsonp
    if (jsonp || /\=\?|callback\=/.test(url)) {
      if (!/\=\?/.test(url)) url = (url + '&callback=?').replace(/[&?]{1,2}/, '?');
      return ajaxJSONP(url, options);
    }

    if (tire.isFunction(options.beforeOpen)) {
      var bc = options.beforeOpen(xhr, options);
      if (!bc) {
        xhr.abort();
        return xhr;
      }
      xhr = bc;
    }

    if (xhr) {
      xhr.open(options.type, url, true);

      if ((mime = mime[options.dataType.toLowerCase()]) !== undefined) {
        xhr.setRequestHeader('Accept', mime);
        if (mime.indexOf(',') !== -1) mime = mime.split(',')[0];
        if (xhr.overrideMimeType) xhr.overrideMimeType(mime);
      }

      if (options.contentType || options.data && options.type !== 'GET') {
        xhr.setRequestHeader('Content-Type', (options.contentType || 'application/x-www-form-urlencoded'));
      }

      for (var key in options.headers) {
        if (options.headers.hasOwnProperty(key)) {
          xhr.setRequestHeader(key, options.headers[key]);
        }
      }

      if (options.timeout > 0) {
        abortTimeout = setTimeout(function () {
          error = 'timeout';
          xhr.abort();
        }, options.timeout);
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            if (options.success !== undefined) {
              tire.ajaxSuccess(null, xhr, options);
            }
          } else if (options.error !== undefined) {
            if (abortTimeout !== null) clearTimeout(abortTimeout);
            options.error(error, options, xhr);
          }
        }
      };

      if (tire.isFunction(options.beforeSend)) {
        var bs = options.beforeSend(xhr, options);
        if (bs !== false) {
          xhr.send(params);
        }
        xhr = bs;
      } else {
        xhr.send(params);
      }

      return xhr;
    }
  },

  /**
   * Default ajax settings.
   */

  ajaxSettings: {

    // Modify the xhr object before open it. Default is null.
    beforeOpen: null,

    // Modify the xhr object before send. Default is null.
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
    error: noop,

    // An object of additional header key/value pairs to send along with the request
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },

    // Function that runs on a successful request.
    // Takes on argument, the response.
    success: noop,

    // Set a timeout (in milliseconds) for the request.
    timeout: 0,

    // The type of the request. Default is GET.
    type: 'GET',

    // The url to make request to. If empty no request will be made.
    url: '',

    // ActiveXObject when available (IE), otherwise XMLHttpRequest.
    xhr: function () {
      var xhr = null;
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else if (window.ActiveXObject) { // < IE 9
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
      }
      return xhr;
    }
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
