module('Tire elements.js');

test('filter', function () {
  expect(2);
  var elm = $('div').filter(function () {
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

test('toggle', function () {
  var el = $('#toggle-el');
  equal(el.css('display'), 'block', 'Should return block as display value');
  el.toggle();
  equal(el.css('display'), 'none', 'Should return none as display value');
  el.toggle();
  equal(el.css('display'), 'block', 'Should return block as display value');
});

test('toggleClass', function () {
  var el = $('#toggle-el');
  equal(el.attr('class'), undefined, 'Should return undefined as class attribute value');
  el.toggleClass('hello');
  equal(el.attr('class'), 'hello', 'Should return hello as class attribute value');
  el.toggleClass('yet');
  equal(el.attr('class'), 'hello yet', 'Should return hello and yet as class attribute values');
  el.toggleClass(function () {
    return $(this).is('.yet')) ? 'happy' : 'sad';
  });
  equal(el.attr('class'), 'hello yet happy', 'Should return hello, yet and happy as class attribute values when yet class exists');
  el.toggleClass('state', true);
  equal(el.attr('class'), 'hello yet happy state', 'Should return hello, yet, happy and state as class attribute values when passing in true state argument');
  el.toggleClass('state', false);
  equal(el.attr('class'), 'hello yet happy', 'Should return hello, yet and happy as class attribute values when passing in false state argument');
});