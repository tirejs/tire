var _eventId = 1
  , c = {};

/**
 * Get tire event id
 *
 * @param {Object} element The element to get tire event id from
 * @return {Integer}
 */

function getEventId (element) {
  return element._eventId || (element._eventId = _eventId++);
}

/** 
 * Get event handlers
 *
 * @param {Integer} id
 * @param {String} eventName
 * @return {Array}
 */

function getEventHandlers (id, eventName) {
  c[id] = c[id] || {};
  return c[id][eventName] = c[id][eventName] || [];
}

/**
 * Create event handler
 *
 * @param {Object} element
 * @param {String} eventName
 * @param {Function} callback
 */

function createEventHandler (element, eventName, callback) {
  var id = getEventId(element)
    , handlers = getEventHandlers(id, eventName);
  
  var fn = function (event) {
    if (callback.call(element, event) === false) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  
  fn.guid = callback.guid = callback.guid || ++_eventId;
  handlers.push(fn);
  return fn;
}

/**
 * Add event to element, no support for delegate yet.
 * Using addEventListener or attachEvent (IE)
 *
 * @param {Object} element
 * @param {String} eventName
 * @param {Function} callback
 */

function addEvent (element, eventName, callback) {
  var handler = createEventHandler(element, eventName, callback);
  
  if (element.addEventListener) {
    element.addEventListener(eventName, handler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + eventName, handler);
  }
}

/**
 * Remove event to element, no support for undelegate yet.
 * Using removeEventListener or detachEvent (IE)
 *
 * @param {Object} element
 * @param {String} eventName
 * @param {Function} callback (optional)
 */

function removeEvent (element, eventName, callback) {
  var id = getEventId(element)
    , handlers = getEventHandlers(id, eventName);
    
  for (var i = 0; i < handlers.length; i++) {
    if (callback === undefined || callback.guid === handlers[i].guid) {
      if (element.removeEventListener) {
        element.removeEventListener(eventName, handlers[i], false);
      } else if (element.detachEvent) {
        var name = 'on' + eventName;
        if (tire.isStr(element[name])) element[name] = null;
        element.detachEvent(name, handlers[i]);
      }
      c[id][eventName].remove(i, 1);
    }
  }
  
  delete c[id];
}

/**
 * Run callback for each event name
 *
 * @param {String} eventName
 * @param {Function} callback
 */

function eachEvent(eventName, callback) {
  eventName.split(' ').forEach(function (name) {
    callback(name);
  });
}

tire.events = tire.events || {};

tire.fn.extend({
  
  /**
   * Add event to element
   *
   * @param {String} eventName
   * @param {Function} callback
   * @return {Object}
   */
  
  on: function (eventName, callback) {
    return this.each(function () {
      var self = this;
      eachEvent(eventName, function (name) {
        addEvent(self, name, callback);
      });
    });
  },
  
  /**
   * Remove event from element
   *
   * @param {String} eventName
   * @param {Function} callback (optional)
   * @return {Object}
   */
  
  off: function (eventName, callback) {
    return this.each(function () {
      var self = this;
      eachEvent(eventName, function (name) {
        removeEvent(self, name, callback);
      });
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
    return this.each(function (elm) {
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
        elm.dispatchEvent(event)
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