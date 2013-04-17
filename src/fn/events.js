var _eventId = 1
  , c = {}
  , returnTrue = function () { return true; }
  , returnFalse = function () { return false; }
  , ignoreProperties = /^([A-Z]|layer[XY]$)/
  , eventMethods = {
      preventDefault: 'isDefaultPrevented',
      stopImmediatePropagation: 'isStopImmediatePropagation',
      stopPropagation: 'isPropagationStopped'
    };

/**
 * Get tire event id
 *
 * @param {Object} element The element to get tire event id from
 *
 * @return {Integer}
 */

function getEventId (element) {
  return element._eventId || (element._eventId = _eventId++);
}

/**
 * Get event handlers
 *
 * @param {Integer} id
 * @param {String} event
 *
 * @return {Array}
 */

function getEventHandlers (id, event) {
  c[id] = c[id] || {};
  return c[id][event] = c[id][event] || [];
}

/**
 * Create event handler
 *
 * @param {Object} element
 * @param {String} event
 * @param {Function} callback
 */

function createEventHandler (element, event, callback) {
  var id = getEventId(element)
    , handlers = getEventHandlers(id, event)
    , parts = ('' + event).split('.');

  var fn = function (event) {
    var result = callback.apply(element, [event].concat(event.data));
    if (result === false) {
      if (event.stopPropagation) event.stopPropagation();
      if (event.preventDefault) event.preventDefault();
      event.cancelBubble = true;
      event.returnValue = false;
    }
    return result;
  };

  fn.guid = callback.guid = callback.guid || ++_eventId;
  fn.realEvent = parts[0];
  fn.ns = parts.slice(1).sort().join(' ');
  handlers.push(fn);
  return fn;
}

/**
 * Create event proxy for delegated events.
 *
 * @param {Object} event
 *
 * @return {Object}
 */

function createProxy (event) {
  var proxy = { originalEvent: event };

  for (var key in event) {
    if (!ignoreProperties.test(key) && event[key] !== undefined) {
      proxy[key] = event[key];
    }
    for (var name in eventMethods) {
      proxy[name] = function () {
        this[eventMethods[name]] = returnTrue;
        return event[name].apply(event, arguments);
      }
      proxy[eventMethods[name]] = returnFalse;
    }
  }

  return proxy;
}

/**
 * Add event to element, no support for delegate yet.
 * Using addEventListener or attachEvent (IE)
 *
 * @param {Object} element
 * @param {String} events
 * @param {Function} callback
 * @param {String} selector
 */

function addEvent (element, events, callback, selector) {
  var fn;

  if (tire.isString(selector)) {
    fn = function (e) {
      return (function (element, callback, selector) {
        return function delegate (e) {
          var match = tire(e.target).closest(selector, element).get(0)
            , event;

          // remove me, only for test
          callback.guid = delegate.guid;

          if (e.target === match) {
            event = tire.extend(createProxy(e), {
              currentTarget: match,
              liveFired: element
            });
            return callback.apply(match, [event].concat(slice.call(arguments, 1)));
          }
        }
      }(element, callback, selector));
    }
  } else {
    callback = selector;
    selector = undefined;
  }

  tire.each(events.split(/\s/), function (index, event) {
    var handler = createEventHandler(element, event, fn && fn() || callback);

    if (selector) handler.selector = selector;

    if (element.addEventListener) {
      element.addEventListener(event, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + event, handler);
    }
  });
}

/**
 * Test event handler
 *
 * @param {Object} parts
 * @param {Function} callback
 * @param {String} selector
 * @param {Function} handler
 */

function testEventHandler (parts, callback, selector, handler) {
  var ns = parts.slice(1).sort().join(' ');

  return callback === undefined &&
    (handler.selector === selector ||
      handler.realEvent === parts[0] ||
      handler.ns === ns) ||
      callback.guid === handler.guid;
}

/**
 * Remove event to element, no support for undelegate yet.
 * Using removeEventListener or detachEvent (IE)
 *
 * @todo Remove delegated events
 *
 * @param {Object} element
 * @param {String} events
 * @param {Function} callback
 * @param {String} selector
 */

function removeEvent (element, events, callback, selector) {
  var id = getEventId(element);

  tire.each(events.split(/\s/), function (index, event) {
    var handlers = getEventHandlers(id, event)
      , parts = ('' + event).split('.');

    for (var i = 0; i < handlers.length; i++) {
      if (testEventHandler(parts, callback, selector, handlers[i])) {
        if (element.removeEventListener) {
          element.removeEventListener(event, handlers[i], false);
        } else if (element.detachEvent) {
          var name = 'on' + event;
          if (tire.isString(element[name])) element[name] = null;
          element.detachEvent(name, handlers[i]);
        }
        // todo: fix this after delegated callback guid
       // if (!c[id][event].length) delete c[id][event];
       // c[id][event].remove(i, 1);
      }
    }
  });
  // for (var k in c[id]) return;
  // delete c[id];
}

tire.events = tire.events || {};

tire.fn.extend({

  /**
   * Add event to element
   *
   * @param {String} events
   * @param {String} selector
   * @param {Function} callback
   * @return {Object}
   */

  on: function (events, selector, callback) {
    return this.each(function () {
      addEvent(this, events, callback, selector);
    });
  },

  /**
   * Remove event from element
   *
   * @param {String} events
   * @param {String} selector
   * @param {Function} callback
   * @return {Object}
   */

  off: function (events, selector, callback) {
    return this.each(function () {
      removeEvent(this, events, callback, selector);
    });
  },

  /**
   * Trigger specific event for element collection
   *
   * @param {String} eventName The event to trigger
   * @param {Object} data JSON Object to use as the event's `data` property
   * @return {Object}
   */

  trigger: function (eventName, data) {
    return this.each(function (index, elm) {
      if (elm === document && !elm.dispatchEvent) elm = document.documentElement;

      var event
        , createEvent = !!document.createEvent;

      if (createEvent) {
        event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, true, true);
      } else {
        event = document.createEventObject();
        event.cancelBubble = true;
      }

      event.data = data || {};
      event.eventName = eventName;

      if (createEvent) {
        elm.dispatchEvent(event);
      } else {
        try { // fire event in < IE 9
          elm.fireEvent('on' + eventName, event);
        } catch (e) { // solution to trigger custom events in < IE 9
          elm.attachEvent('onpropertychange', function (ev) {
            if (ev.eventName === eventName && ev.srcElement._eventId) {
              var handlers = getEventHandlers(ev.srcElement._eventId, ev.eventName);
              if (handlers.length) {
                for (var i = 0; i < handlers.length; i++) {
                  handlers[i](ev);
                }
              }
            }
          });
          elm.fireEvent('onpropertychange', event);
        }
      }
    });
  }

});