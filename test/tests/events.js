module('Tire events.js');

test('Should add event with on and trigger', function () {
  stop();
  $('.test').on('click', function (e, data) {
    start();
    equal(data.some, 'data', '`data` should contain `some` key with a string value eqauls `data`');
    ok(true, 'Event should be trigged');
  }).trigger('click', { some: 'data' });
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
  $('body').on('click', 'a.del', function (e, data) {
    equal(data.some, 'data', '`data` should contain `some` key with a string value eqauls `data`');
    equal(e.type, 'click', 'e.type should equal click');
    equal(e.liveTarget, $('body').find('a.del').get(0), 'e.liveTarget should equal a.del element');
    ok(true, 'Event should be trigged');
  });
  $('body').append('<a href="#" class="del"></a>').find('a.del').trigger('click', { some: 'data' });
  $('body').off('click', 'a.del');
  start();
});

test('Should test mouse enter delegated event', function () {
  stop();
  $('body').on('mouseenter', 'a.mouseenter', function () {
    start();
    ok(true, 'Event should be trigged');
    $('body').off('mouseenter', 'a.mouseenter');
  });
  $('body').append('<a href="#" class="mouseenter"></a>').find('a.mouseenter').trigger('mouseenter');
});

test('Custom events, with namespaces', function () {
  var count = 0
    , tcount = 0
    , el = $('body');

  el.on('fake$event.namespaced', function () {
    count++;
  });

  el.on('tcount.events', function () {
    tcount++;
  });

  el.trigger('fake$event').trigger('fake$event');
  equal(count, 2);

  el.trigger('tcount');
  equal(tcount, 1);

  el.off('.namespaced');
  el.trigger('fake$event');
  equal(count, 2);

  el.trigger('tcount');
  el.off('.events');
  el.trigger('tcount');
  equal(tcount, 2);

  el.on('fake$event.namespaced', function () {
    count++;
  });

  el.trigger('fake$event');
  el.off('.namespaced');
  equal(count, 3);
});

test('Should trigger event with tire event object', function () {
  stop();
  $('<div />').on('click', function (e, data) {
    start();
    equal(data.some, 'data', '`data` should contain `some` key with a string value eqauls `data`');
    ok(true, 'Event should be trigged');
  }).trigger(tire.Event('click'), { some: 'data' }, true);
});

test('Should trigger element and compare e.liveTarget', function () {
  stop();
  $('<p><a id="test"></a></p>').on('click', function (e) {
    start();
    ok(true);
    ok(this === e.liveTarget);
  }).trigger('click');
});

test('Should trigger element inside the element that has the event handler and compare e.liveTarget', function () {
  $('<p><a id="test"></a></p>').on('click', function (e) {
    ok(true);
    ok($(this).find('#test').get(0) === e.liveTarget);
  }).find('#test').trigger('click');
});