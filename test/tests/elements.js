module('Tire elements.js', {
  setup: function () {
    var elm;
  },
  teardown: function () {
    elm = null;
  }
});

test('filter', function () {
  expect(2);
  elm = $('div').filter(function () {
    if ($(this).hasClass('test')) return true;
  });
  equal(elm.get(0), $('.test').get(0), 'Filter should only return the elements we filter');
  equal(elm.length, 1, 'Should return length 1 since the are only one .test element');
});

test('not', function () {
  ok($('div').not('.test') !== $('div'), false, 'Should not be equal to div after removing element with not');
});

test('get', function () {
  equal($('body').get(0), document.body, 'Should return document.body');
});

test('clone', function () {
  ok($('.test').clone().text('clone') !== $('.test').text(), true, 'Should return length two for cloned div');
});
