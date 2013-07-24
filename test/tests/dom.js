module('Tire dom.js');

test('is', function () {
  ok($('.test').is('div'), true, 'Should return true if the element matches the selector');
});

test('closest', function () {
  equal($('div').closest('body').get(0), document.body, 'Should return body element');
});

test('parent', function () {
  equal($('.test-area').parent().get(0), document.body, 'Should return body element');
});

test('children', function () {
  equal($('.test-area').children().eq(-1).get(0), $('#remove-me-b').get(0), 'Should return children elements');
});

test('text', function () {
  expect(2);
  $('.test').text('test text');
  equal($('.test').text(), 'test text', 'Should return text content for element');
  $('.trunk').text('test text');
  equal($('.trunk').text(), 'test text', 'Should return text content for element');
});

test('val', function () {
  var elm = $('input[type=text]');
  elm.val('');
  equal(elm.val(), '', 'Should return value of input element');
  elm.val('test text');
  equal(elm.val(), 'test text', 'Should return value of input element');
  elm.val(undefined);
  equal(elm.val(), '', 'Should return empty value of input element with undefined argument');
  elm.val(null);
  equal(elm.val(), '', 'Should return empty value of input element with null argument');
  elm.val(1);
  equal(elm.val(), '1', 'Should return number as string with number argument');
});

test('html', function () {
  var el = $('.html');
  el.html('html test');
  equal(el.html(), 'html test', 'Should return inner html for element after it changed');
});

test('append', function () {
  var el = $('.html');
  el.empty();
  el.append('<p>append</p>');
  equal(el.children().html(), 'append', 'Should return inner html for element');
  var divs = $(['<div />', '<div />']);
  el = $('#divs');
  el.append(divs);
  equal(el.children().length, divs.length, 'Should contains the same count divs as we appended');
});

test('prepend', function () {
  var el = $('.html');
  el.empty();
  el.prepend('<p>prepend</p>');
  equal(el.children().html(), 'prepend', 'Should return inner html for element');
  el = $('#divs');
  el.prepend($(['<p>prepend</p>', '<p>prepend2</p>']));
  equal(el.children().eq(0).text(), 'prepend', 'Should return inner text for element');
  equal(el.children().eq(1).text(), 'prepend2', 'Should return inner text for element');
});

test('before', function () {
  var el = $('#divs-before');
  el.append('<div />');
  el = el.find('div');
  el.before('<p>before</p>');
  equal(el.parent().find('p').eq(0).html(), 'before', 'Should return inner html for element');
  var divs = $(['<div />', '<div />']);
  el.before(divs);
  equal(el.parent().children().length, divs.length + 2, 'Should contains the same count divs as we added before, plus two extra for existing div');
});

test('after', function () {
  var el = $('#divs-after');
  el.append('<div />');
  el = el.find('div');
  el.after('<p>after</p>');
  equal(el.parent().find('p').eq(0).html(), 'after', 'Should return inner html for element');
  var divs = $(['<div />', '<div />']);
  el.after(divs);
  equal(el.parent().children().length, divs.length + 2, 'Should contains the same count divs as we added before, plus two extra for existing div');
});

test('remove', function () {
  $('#remove-me-a').remove();
  equal(document.getElementById('remove-me-a'), null, 'Element should not exists after calling remove');
});

test('empty', function () {
  $('.html').empty();
  equal($('.html').html(), '', 'Should return empty inner html after empty');
});