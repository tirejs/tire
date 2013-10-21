var _eventId = 1
  , c = window.c = {}
  , returnTrue = function () { return true; }
  , returnFalse = function () { return false; }
  , ignoreProperties = /^([A-Z]|layer[XY]$)/
  , sepcialExp = /click|mouse/
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
  , opcCache = {}
  , createEvent = !!document.createEvent;

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
 * Check if ns or event allreday is in the handlers array.
 *
 * @param {Object} parts
 * @param {Array} handlers
 *
 * @return {Boolean}
 */

function inHandlers (parts, handlers) {
  for (var i = 0; i < handlers.length; i++) {
    if (handlers[i].realEvent === realEvent(parts.ev) || handlers[i].ns === parts.ns) {
      return true;
    }
  }
  return false;
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
    , handlers = []
    , tmp
    , ns;

  event = realEvent(parts.ev);
  ns = parts.ns;

  if (!event.length && !parts.ns.length) {
    return handlers;
  }

  c[id] = c[id] || {};

  if (event.length) {
    handlers = c[id][event] = c[id][event] || [];
  }

  if (parts.ns.length) {
    for (event in c[id]) {
      tmp = c[id][event];
      for (var i = 0, l = tmp.length; i < l; i++) {
        if (tmp[i] && ns.length && tmp[i].ns.length && tire.inArray(ns, tmp[i].ns.split(' ')) !== -1) {
          handlers.push(tmp[i]);
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
    , cb = callback || _callback;

  var fn = function (event) {
    if (!event.liveTarget) event.liveTarget = event.target || event.srcElement;
    var data = event.data;
    if (tire.isString(data) && /^[\[\{]/.test(data)) data = tire.parseJSON(event.data);
    var result = cb.apply(el, [event].concat(data));
    if (result === false) {
      if (event.stopPropagation) event.stopPropagation();
      if (event.preventDefault) event.preventDefault();
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
        this[eventMethods[name]] = returnTrue;
        return event[name].apply(event, arguments);
      };
      proxy[eventMethods[name]] = returnFalse;
    }
  }

  return proxy;
}

/**
 * Add event to element.
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
          var match = tire(el).find(e.target || e.srcElement);
          
          if (match.is(selector)) {
            var event = tire.extend(createProxy(e), {
              currentTarget: match.get(0)
            });
            console.log('x', el);

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
 * Remove event to element.
 * Using removeEventListener or detachEvent (IE)
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
    if (c[id] && c[id][event] && !c[id][event].length) delete c[id][event];
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
   * @param {Object|String} eventName The event to trigger or event object
   * @param {Object} data JSON Object to use as the event's `data` property
   * @return {Object}
   */

  trigger: function (event, data, _el) {
    return this.each(function (i, el) {
      if (el === document && !el.dispatchEvent) el = document.documentElement;

      var parts = getEventParts(event.type || event);

      event = tire.Event(event)
      event.data = data || {};

      if (tire.isString(event.data) && !tire.isString(data) && JSON.stringify) {
        event.data = JSON.stringify(data);
      }

      if (createEvent) {
        el.dispatchEvent(event);
      } else {
        if (el._eventId > 0) {
          try { // fire event in < IE 9
            el.fireEvent('on' + event.type, event);
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
      }

      if (!event.isPropagationStopped()) {
        var parent = el.parentNode || el.ownerDocument;
        if (parent && parent._eventId > 0) {
          // Tire use `liveTarget` instead of creating a own Event object that modifies `target` property.
          event.liveTarget = el;
          tire(parent).trigger(event, data);
        } else {
          event.stopPropagation();
        }
      }
    });
  }

});

/**
 * Create a event object
 *
 * @param {String|Object} type
 * @param {Object} props
 *
 * @return {Object}
 */

tire.Event = function (type, props) {
  if (!tire.isString(type)) {
    if (type.type) return type;
    props = type;
    type = props.type;
  }

  var event;

  if (createEvent) {
    event = document.createEvent((sepcialExp.test(type) ? 'Mouse' : '') + 'Events');
    event.initEvent(realEvent(type), true, true, null, null, null, null, null, null, null, null, null, null, null, null);
  } else {
    event = document.createEventObject();
    event.cancelBubble = true;
  }

  if (props !== undefined) {
    for (var name in props) {
      (name === 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
    }
  }

  event.isPropagationStopped = returnFalse;
  event.stopPropagation = function () {
    this.isPropagationStopped = returnTrue;
    var e = this.originalEvent;
    if(!e) return;
    if (e.stopPropagation) e.stopPropagation();
    e.returnValue = false;
  };

  event.isDefaultPrevented = returnTrue;
  event.preventDefault = function () {
    this.isDefaultPrevented = returnTrue;
    var e = this.originalEvent;
    if(!e) return;
    if (e.preventDefault) e.preventDefault();
    e.returnValue = false;
  };

  if (!event.type.length) {
    event.type = realEvent(type);
  }

  // IE8
  event.eventName = event.type;

  return event;
};
