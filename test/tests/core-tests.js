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

module('Tire dom.js', {
  setup: function () {
    var elm;
  },
  teardown: function () {
    elm = null;
  }
});

test('is', function () {
  ok($('.test').is('div'), true, 'Should return true if the element matches the selector');
});

test('text', function () {
  expect(4);
  equal($('.test').text(), 'test text', 'Should return text content for element');
  $('.trunk').text('test text');
  equal($('.trunk').text(), 'test text', 'Should return text content for element');
  equal($('input[type=text]').text(), '', 'Should return value of input element');
  $('input[type=text]').text('test text');
  equal($('input[type=text]').text(), 'test text', 'Should return value of input element');
});

test('html', function () {
  expect(2);
  elm = $('.html');
  equal(elm.html(), 'test text', 'Should return inner html for element');
  elm.html('html test');
  equal(elm.html(), 'html test', 'Should return inner html for element after it changed');
});

test('append', function () {
  elm = $('.html');
  elm.append('<p>append</p>');
  equal(elm[0].childNodes[1].innerHTML, 'append', 'Should return inner html for element');
});

test('prepend', function () {
  elm = $('.html');
  elm.prepend('<p>prepend</p>');
  equal(elm[0].childNodes[0].innerHTML, 'prepend', 'Should return inner html for element');
});

test('before', function () {
  $('.html').before('<p>before</p>');
  equal($('.html')[0].previousSibling.innerHTML, 'before', 'Should return inner html for element');
});

test('after', function () {
  $('.html').after('<p>after</p>');
  equal($('.html')[0].nextSibling.nextSibling.innerHTML, 'after', 'Should return inner html for element');  
});

test('remove', function () {
  $('#remove-me-a').remove();
  equal(document.getElementById('remove-me-a'), null, 'Element should not exists after calling remove');
});

test('empty', function () {
  $('.html').empty();
  equal($('.html').html(), '', 'Should return empty inner html after empty');
});

module('Tire css.js', {
  setup: function () {
    var elm;
  },
  teardown: function () {
    elm = null;
  }
});

test('css', function () {
  expect(4);
  var elm = $('.test');
  elm.css('color', 'black');
  equal(elm.css('color'), 'rgb(0, 0, 0)', 'Should return css property from element');
  elm.css({ backgroundColor: 'black', fontSize: 12 });
  ok(!!elm.css('background-color'), true, 'Should return css property from element');
  ok(!!elm.css('font-size'), true, 'Should return css property from element');
  equal(elm.css('test'), undefined, 'Should return undefined is css property is not found');
});

test('hide', function () {
  $('.test').hide();
  equal($('.test').css('display'), 'none', 'Should return none for display property when element is hidden');
});

test('show', function () {
  $('.test').show();
  equal($('.test').css('display'), 'block', 'Should return block for display property when element is visible');
});