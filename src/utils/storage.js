(function () {
  function get (key) {
    return new Promise(resolve => {
      chrome.storage.sync.get(key, function (item) {
        resolve(item[key]);
      });
    });
  }

  function set (key, value) {
    return new Promise(resolve => {
      chrome.storage.sync.set({[key]: value}, function () {
        resolve();
      });
    });
  }

  window.storage = {
    get,
    set
  };
})();
