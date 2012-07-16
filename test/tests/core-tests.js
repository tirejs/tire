module('tire core.js', {});

test('isFun', function () {
  ok($.isFun(function () {}), 'Should return true for function');
});

test('isNum', function () {
  ok($.isNum(2), 'Should return true for number');
});

test('isObj', function () {
  ok($.isObj(tire), 'Should return true for object');
});

test('isStr', function () {
  ok($.isStr('tire'), 'Should return true for string');
});

test('isArr', function () {
  ok($.isArr([]), 'Should return true for array');
});

test('parseJSON', function () {
  ok($.parseJSON('{"a":"b"}') instanceof Object, 'Should parse JSON string to object');
});

module('Selectors', {
  setup: function () {
    var elm;
  },
  teardown: function () {
    elm = null;
  }
});

test('ID Selector', function () {
  expect(3);
  elm = $('#test');
  equal(elm.length, 1, 'Should return length 1 for existing elements with specified ID');
  equal(elm[0].innerHTML, 'test text', 'Should contain innerHTML as exists in markup');
  elm = $('#donotexists');
  equal(elm.length, 0, 'Should return length 0 for non-existing elements');
});

test('Class name Selector', function () {
  expect(3);
  elm = $('.test');
  equal(elm.length, 1, 'Should return length 1 for existing elements with specified classname');
  equal(elm[0].innerHTML, 'test text', 'Should contain innerHTML as exists in markup');
  elm = $('.donotexists');
  equal(elm.length, 0, 'Should return length 0 for non-existing elements');
});

test('Tag name Selector', function () {
  expect(2);
  elm = $('ul');
  equal(elm.length, 1, 'Should return length 1 for existing elements with specified tagname');
  elm = $('blink');
  equal(elm.length, 0, 'Should return length 0 for non-existing elements');
});

test('Elements reference selector', function () {
  expect(2);
  elm = $(document.body);
  equal(elm.length, 1, 'Should return length 1 for existing body element');
  elm = $(window);
  equal(elm[0], window, 'Should be able to pass window as selector');
});

test('HTML string selector', function () {
  expect(2);
  elm = $('<a href="#">Hello, world!</a>');
  equal(elm.length, 1, 'Should return length 1 for existing elements');
  ok(elm[0] instanceof HTMLAnchorElement, 'Should be a instanceof HTMLAnchorElement');
});

test('Empty selectors', function () {
  expect(3);
  elm = $(undefined);
  equal(elm.length, 0, 'Should return length 0 for non-existing elements');
  elm = $(null);
  equal(elm.length, 0, 'Should return length 0 for non-existing elements');
  elm = $("");
  equal(elm.length, 0, 'Should return length 0 for non-existing elements');  
});