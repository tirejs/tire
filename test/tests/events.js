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
    ok(false, 'Event should not be trigged');
  }).off('click').trigger('click');
  start();
});

test('Should be able to trigger custom event', function () {
  stop();
  $('.html').on('tire', function () {
    start();
    ok(true, 'Event should be trigged');
  }).trigger('tire').off('tire');
});

/*
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
*/