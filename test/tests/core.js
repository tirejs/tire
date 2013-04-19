module('Tire core.js');

test('isFunction', function () {
  ok($.isFunction(function () {}), 'Should return true for function');
  ok(!$.isFunction(null), 'Should return false for null');
  ok(!$.isFunction(undefined), 'Should return false for undefined');
});

test('isNumeric', function () {
  ok($.isNumeric(2), 'Should return true for number');
  ok(!$.isNumeric(null), 'Should return false for null');
  ok(!$.isNumeric(undefined), 'Should return falase for undefined');
});

test('isObject', function () {
  ok($.isObject({ 'a': 'b' }), 'Should return true for object');
  ok(!$.isObject([]), 'Should return false for array');
  ok(!$.isObject(null), 'Should return false null');
  ok(!$.isObject(undefined), 'Should return false for undefined');
  ok(!$.isObject(window), 'Should return false for window');
});

test('isString', function () {
  ok($.isString('tire'), 'Should return true for string');
  ok(!$.isString(null), 'Should return false for null');
  ok(!$.isString(undefined), 'Should return false for undefined');
});

test('isArray', function () {
  ok($.isArray([]), 'Should return true for array');
  ok(!$.isArray({}), 'Should return false for object');
  ok(!$.isArray(null), 'Should return false for null');
  ok(!$.isArray(undefined), 'Should return false for undefined');
});

test('isPlainObject', function () {
  ok($.isPlainObject({}), 'Should return true for object');
  ok(!$.isPlainObject(window), 'Should return false for window');
  ok(!$.isPlainObject(document), 'Should return false for document');
  ok(!$.isPlainObject(null), 'Should return false for null');
  ok(!$.isPlainObject(undefined), 'Should return false for undefined');
});

test('isWindow', function () {
  ok($.isWindow(window), 'Should return true for window');
  ok(!$.isWindow(document), 'Should return false for object');
  ok(!$.isWindow(null), 'Should return false for null');
  ok(!$.isWindow(undefined), 'Should return false for undefined');
});

test('each', function () {
  expect(4);
  var array = ['foo', 'foo'];
  $.each(array, function(index, element){
    ok(+index === index, true, 'Should return true if 1st param is the index');
    ok(element === 'foo', true, 'Should return true if 2nd param is the element of the array');
  });
});

test('parseJSON', function () {
  ok(!!($.parseJSON('{"a":"b"}') instanceof Object || !null), true, 'Should parse JSON string to object or return empty string');
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
  expect(4);
  elm = $('#test');
  equal(elm.length, 1, 'Should return length 1 for existing elements with specified ID');
  equal(elm.get(0).innerHTML, 'test text', 'Should contain innerHTML as exists in markup');
  elm = $('#donotexists');
  equal(elm.length, 0, 'Should return length 0 for non-existing elements');
  elm = $('#test', { rel: 'test' });
  equal(elm.attr('rel'), 'test', 'Should return rel attribute value');
});

test('Class name Selector', function () {
  expect(3);
  elm = $('.test');
  equal(elm.length, 1, 'Should return length 1 for existing elements with specified class name');
  equal(elm.get(0).innerHTML, 'test text', 'Should contain innerHTML as exists in markup');
  elm = $('.donotexists');
  equal(elm.length, 0, 'Should return length 0 for non-existing elements');
});

test('Tag name Selector', function () {
  expect(3);
  elm = $('ul');
  equal(elm.length, 1, 'Should return length 1 for existing elements with specified tagname');
  elm = $('blink');
  equal(elm.length, 0, 'Should return length 0 for non-existing elements');
  elm = $('body').find('html');
  equal(elm.length, 0, 'Should return length 0 for non-existing elemnts in the context');
});

test('Nested Selector', function () {
  expect(1);
  elm = $('ul');
  elmInner = elm.find('li');
  equal(elm === elmInner, false, 'Should return false');
});

test('Elements reference selector', function () {
  expect(3);
  elm = $(document.body);
  equal(elm.length, 1, 'Should return length 1 for existing body element');
  equal(elm.get(0), document.body, 'Should be document.body if document.body is the selector');
  elm = $(window);
  equal(elm.get(0), window, 'Should be able to pass window as selector');
});

test('HTML string selector', function () {
  expect(2);
  elm = $('<a href="#">Hello, world!</a>');
  equal(elm.length, 1, 'Should return length 1 for existing elements');
  ok(elm.get(0) instanceof HTMLAnchorElement, 'Should be a instance of HTMLAnchorElement');
});

test('Combined selectors', function () {
  expect(3);
  elm = $(document.body).find('.test-area ul');
  equal(elm.get(0), document.getElementById('ul'), 'Should be able to find element by descendant combinator (.class tag)');
  elm = $('div ul');
  equal(elm.get(0), document.getElementById('ul'), 'Should be able to find element by descendant combinator (tag tag)');
  elm = $('#ul, #test-area');
  deepEqual(Array.prototype.slice.call(elm),
    [document.getElementById('test-area'), document.getElementById('ul')],
    'Should be able to find elements by group selector, and preserve document order');
});

test('Find in context', function () {
  expect(2);
  elm = $('body', document.getElementById('test-area'));
  equal(elm.length, 0, 'Should return length 0 for non-existing elements in the context');
  elm = $('.test-area', document.getElementById('body'));
  equal(elm.get(0), document.getElementById('test-area'), 'Should be able to find element by class name');
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