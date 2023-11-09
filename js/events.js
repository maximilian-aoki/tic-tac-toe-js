let Events = (function() {
  let events = {};
  
  // create a new function for a new or existing event name (doesn’t check duplicates) 
  function on(eventName, fn) {
    events[eventName] = events[eventName] || [];
    events[eventName].push(fn);
  };

  // emit a piece of data to all functions on one event name
  function emit(eventName, data) {
    if (events[eventName]) {
      events[eventName].forEach((fn) => {
        fn(data);
      });
    }
  };
  
  return {on, emit};
})();
