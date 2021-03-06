'use strict';

const functions = (function () {
  function getLocation (callback) {
    return function () {
      callback(Object.assign({}, window.location));
    };
  }

  function getJson (callback) {
    return function (rule) {
      callback(rule);
    }
  }

  return {
    getLocation,
    getJson
  };
})();

chrome.runtime.onMessage.addListener(
  function (request, sender, callback) {
    const name = request.name;
    if (functions[name]) {
      functions[name](callback).apply(null, request.params);
      return true;
    }

    if (window[name] && typeof window[name] === 'function') {
      window[name].apply(null, request.params);
    }
  }
);
