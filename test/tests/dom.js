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
  expect(2);
  var elm = $('.html');
  equal(elm.html(), 'test text', 'Should return inner html for element');
  elm.html('html test');
  equal(elm.html(), 'html test', 'Should return inner html for element after it changed');
});

test('append', function () {
  var elm = $('.html');
  elm.append('<p>append</p>');
  equal(elm.get(0).childNodes[1].innerHTML, 'append', 'Should return inner html for element');
  var divs = $(['<div id="1" />', '<div id="2" />']);
  elm = $('#divs');
  elm.append(divs);
  equal(elm.children().length, divs.length, 'Should contains the same count divs as we appended');
});

test('prepend', function () {
  var elm = $('.html');
  elm.prepend('<p>prepend</p>');
  equal(elm.get(0).childNodes[0].innerHTML, 'prepend', 'Should return inner html for element');
  elm = $('#divs');
  elm.prepend($(['<p>prepend</p>', '<p>prepend2</p>']));
  // IE 8
  var text1 = elm.children().get(0).childNodes[0];
  text1 = text1.textContent === undefined ? text1.toString() : text1.textContent;
  var text2 = elm.children().get(1).childNodes[0];
  text2 = text2.textContent === undefined ? text2.toString() : text2.textContent;
  equal(text1, 'prepend2', 'Should return inner text for element');
  equal(text2, 'prepend', 'Should return inner text for element');
});

test('before', function () {
  $('.html').before('<p>before</p>');
  equal($('.html').get(0).previousSibling.innerHTML, 'before', 'Should return inner html for element');
  var divs = $(['<div id="divs-before1" />', '<div id="divs-before2" />']);
  var elm = $('#divs-before');
  elm.before(divs);
  equal(elm.parent().children().length, divs.length+2, 'Should contains the same count divs as we added before, plus two extra for a existing div');
});

test('after', function () {
  $('.html').after('<p>after</p>');
  var elm = $('.html').get(0);
  // <p>after</p> in IE8 is found using only one nextSibling, have to investigate this but this will fix the test for now.
  var result = elm.nextSibling.nextSibling.innerHTML === 'test text' ? elm.nextSibling.innerHTML : elm.nextSibling.nextSibling.innerHTML;
  equal(result, 'after', 'Should return inner html for element');
  var divs = $(['<div id="divs-after1" />', '<div id="divs-after2" />']);
  elm = $('#divs-after');
  elm.before(divs);
  equal(elm.parent().children().length, divs.length+4, 'Should contains the same count divs as we added before, plus four extra for a existing div');
});

test('remove', function () {
  $('#remove-me-a').remove();
  equal(document.getElementById('remove-me-a'), null, 'Element should not exists after calling remove');
});

test('empty', function () {
  $('.html').empty();
  equal($('.html').html(), '', 'Should return empty inner html after empty');
});