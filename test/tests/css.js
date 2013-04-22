module('Tire css.js');

test('css', function () {
  expect(4);
  var elm = $('.test');
  elm.css('color', 'black');
  var value = elm.css('color');
  ok(value === 'rgb(0, 0, 0)' || value === '#000000' || value === 'black', 'Should return css property from element');
  elm.css({ backgroundColor: 'black', fontSize: 12 });
  ok(!!elm.css('backgroundColor'), true, 'Should return css property from element');
  ok(!!elm.css('fontSize'), true, 'Should return css property from element');
  equal(elm.css('test'), '', 'Should return empty string if css property is not found');
});

test('hide', function () {
  $('.test').hide();
  equal($('.test').css('display'), 'none', 'Should return none for display property when element is hidden');
});

test('show', function () {
  $('.test').show();
  notEqual($('.test').css('display'), 'none', 'Should return block for display property when element is visible');
});
