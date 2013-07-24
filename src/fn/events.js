var _eventId = 1
  , c = {}
  , returnTrue = function () { return true; }
  , returnFalse = function () { return false; }
  , ignoreProperties = /^([A-Z]|layer[XY]$)/
  , mouse = {
      mouseenter: 'mouseover',
      mouseleave: 'mouseout'
    }
  , eventMethods = {
      preventDefault: 'isDefaultPrevented',
      stopImmediatePropagation: 'isStopImmediatePropagation',
      stopPropagation: 'isPropagationStopped'
    }
  , opcHandler
  , opcCache = {};

/**
 * Get event parts.
 *
 * @param {String} event
 *
 * @return {Object}
 */

function getEventParts (event) {
  var parts = ('' + event).split('.');
  return { ev: parts[0], ns: parts.slice(1).sort().join(' ') };
}

/**
 * Get real event.
 *
 * @param {String} event
 *
 * @return {String}
 */

function realEvent (event) {
  return mouse[event] || event;
}

/**
 * Get tire event id
 *
 * @param {Object} el The element to get tire event id from
 *
 * @return {Number}
 */

function getEventId (el) {
  return el._eventId || (el._eventId = _eventId++);
}

/**
 * Get event handlers
 *
 * @param {Number} id
 * @param {String} event
 *
 * @return {Array}
 */

function getEventHandlers (id, event) {
  var parts = getEventParts(event)
    , handlers = [];

  event = realEvent(parts.ev);

  c[id] = c[id] || {};

  if (event.length) {
    handlers = c[id][event] = c[id][event] || [];
  }

  if (parts.ns.length) {
    for (event in c[id]) {
      for (var i = 0, l = c[id][event].length; i < l; i++) {
        if (c[id][event][i] && c[id][event][i].ns === parts.ns) {
          handlers.push(c[id][event][i]);
        }
      }
    }
  }

  return handlers;
}

/**
 * Create event handler
 *
 * @param {Object} el
 * @param {String} event
 * @param {Function} callback
 * @param {Function} _callback Orginal callback if delegated event
 */

function createEventHandler (el, event, callback, _callback) {
  var id = getEventId(el)
    , handlers = getEventHandlers(id, event)
    , parts = getEventParts(event)
    , cb = _callback || callback;

  var fn = function (event) {
    var data = event.data;
    if (tire.isString(data) && /^[\[\{]/.test(data)) data = tire.parseJSON(event.data);
    var result = callback.apply(el, [event].concat(data));
    if (result === false) {
      if (event.stopPropagation) event.stopPropagation();
      if (event.preventDefault) event.preventDefault();
      event.cancelBubble = true;
      event.returnValue = false;
    }
    return result;
  };

  fn._i = cb._i = cb._i || ++_eventId;
  fn.realEvent = realEvent(parts.ev);
  fn.ns = parts.ns;
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
      };
      proxy[eventMethods[name]] = returnFalse;
    }
  }

  return proxy;
}

/**
 * Add event to element, no support for delegate yet.
 * Using addEventListener or attachEvent (IE)
 *
 * @param {Object} el
 * @param {String} events
 * @param {Function} callback
 * @param {String} selector
 */

function addEvent (el, events, callback, selector) {
  var fn, _callback;

  if (tire.isString(selector)) {
    _callback = callback;
    fn = function () {
      return (function (el, callback, selector) {
        return function (e) {
          var match = tire(e.target || e.srcElement).closest(selector, el).get(0)
            , event;

          if ((e.target || e.srcElement) === match) {
            event = tire.extend(createProxy(e), {
              currentTarget: match,
              liveFired: el
            });
            return callback.apply(match, [event].concat(slice.call(arguments, 1)));
          }
        };
      }(el, callback, selector));
    };
  } else {
    callback = selector;
    selector = undefined;
  }

  tire.each(events.split(/\s/), function (index, event) {
    var parts = getEventParts(event);

    if (_callback !== undefined && parts.ev in mouse) {
      var _fn = fn();
      fn = function () {
        return function (e) {
          var related = e.relatedTarget;
          if (!related || (related !== this && !tire.contains(this, related))) {
            return _fn.apply(this, arguments);
          }
        }
      }
    }

    var handler = createEventHandler(el, event, fn && fn() || callback, _callback);

    event = realEvent(parts.ev);

    if (selector) handler.selector = selector;

    if (el.addEventListener) {
      el.addEventListener(event, handler, false);
    } else if (el.attachEvent) {
      el.attachEvent('on' + event, handler);
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
  return callback === undefined &&
    (handler.selector === selector ||
      handler.realEvent === parts.ev ||
      handler.ns === parts.ns) ||
      callback._i === handler._i;
}

/**
 * Remove event to element, no support for undelegate yet.
 * Using removeEventListener or detachEvent (IE)
 *
 * @todo Remove delegated events
 *
 * @param {Object} el
 * @param {String} events
 * @param {Function} callback
 * @param {String} selector
 */

function removeEvent (el, events, callback, selector) {
  var id = getEventId(el);

  if (callback === undefined && tire.isFunction(selector)) {
    callback = selector;
    selector = undefined;
  }

  tire.each(events.split(/\s/), function (index, event) {
    var handlers = getEventHandlers(id, event)
      , parts = getEventParts(event);

    event = realEvent(parts.ev);

    for (var i = 0; i < handlers.length; i++) {
      if (testEventHandler(parts, callback, selector, handlers[i])) {
        event = (event || handlers[i].realEvent);
        if (el.removeEventListener) {
          el.removeEventListener(event, handlers[i], false);
        } else if (el.detachEvent) {
          var name = 'on' + event;
          if (tire.isString(el[name])) el[name] = null;
          el.detachEvent(name, handlers[i]);
          if (opcCache[el.nodeName]) { // Remove custom event handler on IE8.
            el.detachEvent('onpropertychange', opcHandler);
            delete opcCache[el.nodeName];
          }
        }

        c[id][event] = splice.call(c[id][event], i, 1);
        c[id][event].length = i < 0 ? c[id][event].length + 1 : i;
      }
    }
    if (c[id][event] && !c[id][event].length) delete c[id][event];
  });
  for (var k in c[id]) return;
  delete c[id];
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
    return this.each(function (index, el) {
      if (el === document && !el.dispatchEvent) el = document.documentElement;

      var event
        , createEvent = !!document.createEvent
        , parts = getEventParts(eventName);

      eventName = realEvent(parts.ev);

      if (createEvent) {
        event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, true, true);
      } else {
        event = document.createEventObject();
        event.cancelBubble = true;
      }

      event.data = data || {};
      event.eventName = eventName;

      if (tire.isString(event.data) && !tire.isString(data) && JSON.stringify) {
        event.data = JSON.stringify(data);
      }

      if (createEvent) {
        el.dispatchEvent(event);
      } else {
        try { // fire event in < IE 9
          el.fireEvent('on' + eventName, event);
        } catch (e) { // solution to trigger custom events in < IE 9
          if (!opcCache[el.nodeName]) {
            opcHandler = opcHandler || function (ev) {
              if (ev.eventName && ev.srcElement._eventId) {
                var handlers = getEventHandlers(ev.srcElement._eventId, ev.eventName);
                if (handlers.length) {
                  for (var i = 0, l = handlers.length; i < l; i++) {
                    if (tire.isFunction(handlers[i])) handlers[i](ev);
                  }
                }
              }
            };
            el.attachEvent('onpropertychange', opcHandler);
          }
          opcCache[el.nodeName] = opcCache[el.nodeName] || true;
          el.fireEvent('onpropertychange', event);
        }
      }
    });
  }

});