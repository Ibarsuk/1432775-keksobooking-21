'use strict';

(() => {
  const DEBOUNCE_TIME = 500;

  let timeout;
  window.debounce = (cb) => {
    if (timeout) {
      window.clearTimeout(timeout);
    }
    timeout = window.setTimeout(cb, DEBOUNCE_TIME);
  };
})();
