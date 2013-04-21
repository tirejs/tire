if (window.location.protocol.indexOf('http') !== -1 && window.location.search.indexOf('ajax=false') === -1) {
  module('Tire ajax.js', {
    setup: function () {
      var srh = XMLHttpRequest.prototype.setRequestHeader;

      window.headers = {};

      XMLHttpRequest.prototype.setRequestHeader = function (key, val) {
          window.headers[key] = val;
          srh.call(this, key, val);
      }
    }
  });

  test('get jsonp', function () {
    stop();
    $.ajax('http://echojson.com/hello/world?callback=?&history=false', function (data) {
      start();
      ok(data instanceof Object, true, 'Should return true if data is a instance of object');
      stop();
      $.ajax({ url: 'http://echojson.com/hello/world?callback=?&history=false', dataType: 'jsonp' }, function (data) {
        start();
        ok(data instanceof Object, true, 'Should return true if data is a instance of object');
      });
    });
  });

  test('get json', function () {
    stop();
    $.ajax('test.json', function (data) {
      start();
      ok(data instanceof Object, true, 'Should return true if data is a instance of object');
    });
  });

  test('ajax post', function () {
    stop();
    $.ajax('ajax_load.html', {
      type: 'POST',
      success: function (data) {
        start();
        equal(data, 'ajax load', 'Should return text');
      }
    });
  });

  test('set headers', function () {
    $.ajax('ajax_load.html', {
      headers: {
        'foo': 'bar'
      }
    });
    equal(window.headers['foo'], 'bar', 'Should call setRequestHeader correctly');
  });

  test('X-Requested-With header should equal XMLHttpRequest', function() {
    $.ajax('ajax_load.html');
    equal(window.headers['X-Requested-With'], 'XMLHttpRequest', 'Should set X-Requested-With header to "XMLHttpRequest"');
  });
}