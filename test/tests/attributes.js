module('Tire attributes.js');

test('addClass', function () {
  expect(2);
  $('.test').addClass('dustin');
  equal($('.test').hasClass('dustin'), true, 'Should return true if the element has the class after adding it');
  $('.test').addClass('item-1 item-2 item-3');
  equal($('.test').attr('class'), 'test dustin item-1 item-2 item-3', 'Should return classes');
});

test('removeClass', function () {
  expect(2);
  $('.test').removeClass('dustin');
  equal($('.test').hasClass('dustin'), false, 'Should return false when the class if being removed');
  $('.test').removeClass('item-2');
  equal($('.test').attr('class'), 'test item-1 item-3', 'Should return classes');
});

test('attr', function () {
  $('.test').attr('rel', 'dustin');
  equal($('.test').attr('rel'), 'dustin', 'Should add attribute to element via key/value');
  $('.test').attr({ rel: 'tire' });
  equal($('.test').attr('rel'), 'tire', 'Should add attribute to element via object');
  $('.test', { rel: 'wip' });
  equal($('.test').attr('rel'), 'wip', 'Should add attribute via second argument in dollar/find function');
  ok($('.test').attr('tire', 1) instanceof tire, 'Should return tire object when setting the value');
  var a = $('.test-class');
  equal(a.attr('class'), 'test-class', 'Should equal test class');
  var b = a.find('span');
  equal(b.attr('class'), 'fjord', 'Should equal fjord class');
  equal(a.attr('class'), 'test-class', 'Should equal test class after used find method');
});

test('data', function () {
  $('.test').data('object', { a: 1, b: 2, c: 3 });
  ok($('.test').data('object') instanceof Object, 'Should convert seralize object into object');
  $('.test').data('array', [1, 2, 3]);
  ok($('.test').data('array') instanceof Array, 'Should convert seralized array into array');
  $('.test').data('true', true);
  equal($('.test').data('true'), true, 'Should convert "true" into true');
  $('.test').data('false', false);
  equal($('.test').data('false'), false, 'Should convert "false" into false');
  $('.test').data('null', null);
  equal($('.test').data('null'), null, 'Should convert "null" into null');
  $('.test').data('number', 1);
  equal($('.test').data('number'), 1, 'Should convert "1" into 1');
  ok($('.test').data('tire', 1) instanceof tire, 'Should return tire object when setting the value');
});

test('removeAttr', function () {
  expect(2);
  $('.test').removeAttr('rel');
  equal($('.test').attr('rel'), null, 'Should remove the attrbute from element');
  $('.test').removeAttr('data-tag');
  equal($('.test').attr('data-tag'), null, 'Should remove the attribute from element');
});