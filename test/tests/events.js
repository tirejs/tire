module('Tire events.js');

test('Should add event with on and trigger', function () {
  stop();
  $('.test').on('click', function () {
    start();
    ok(true, 'Event should be trigged');
  }).trigger('click');
});

test('Should remove event with off, event should not be trigged after', function () {
  stop();
  expect(0);
  $('.html').on('click', function () {
    start();
    equal(e.data.some, 'data', 'e.data should contain `some` key with a string value eqauls `data`');
    equal(e.type, 'click', 'e.type should equal click');
    ok(false, 'Event should not be trigged');
  }).off('click').trigger('click', { some: 'data' });
  start();
});

test('Should be able to trigger custom event', function () {
  stop();
  $('.html').on('tire', function () {
    start();
    ok(true, 'Event should be trigged');
  }).trigger('tire').off('tire');
});

test('Should be able to unbind specific events using', function () {
  stop();
  function a() {
    start();
    ok(true, 'Event should be trigged');
  }
  function b() {
    start();
    ok(false, 'Event should not be trigged');
  }
  $('.html').on('click', a).on('click', b).off('click', b).trigger('click');
});

test('Should trigger delegated event', function () {
  stop();
  $('body').on('click', 'a.del', function (e) {
    start();
    equal(e.data.some, 'data', 'e.data should contain `some` key with a string value eqauls `data`');
    equal(e.type, 'click', 'e.type should equal click');
    equal((e.srcElement || e.target), $('body').find('a.del').get(0), 'e.srcElement/e.target should equal a.del element');
    equal(e.currentTarget, $('body').find('a.del').get(0), 'e.target should equal a.del element');
    equal(e.liveFired, $('body').get(0), 'e.liveFired should equal body element');
    ok(true, 'Event should be trigged');
  });
  $('body').append('<a href="#" class="del"></a>').find('a.del').trigger('click', { some: 'data' });
});