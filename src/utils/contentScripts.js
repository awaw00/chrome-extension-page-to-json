(function (global) {
  function callContentFunction (fnName, ...params) {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {name: fnName, params}, response => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      });
    });
  }

  window.contentScripts = new Proxy({}, {
    get (target, key) {
      return callContentFunction.bind(null, key);
    }
  });

})();
