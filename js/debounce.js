'use strict';


const DEBOUNCE_TIME = 500;

window.debounce = (cb) => {
  let timeout = null;

  return () => {
    if (timeout) {
      window.clearTimeout(timeout);
    }
    timeout = window.setTimeout(function () {
      cb();
    }, DEBOUNCE_TIME);
  };
};

