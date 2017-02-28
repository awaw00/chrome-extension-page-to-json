const logLevel = process.env.LOG_LEVEL || 0;

(function (global) {
  function _log ({title, msg, type = 'log', raw = false}) {
    type = type.toLowerCase();
    let level = ['log', 'info', 'warn', 'error'].indexOf(type);
    if (level === -1) {
      type = 'log';
      level = 0;
    }

    if (title && typeof msg === 'undefined') {
      msg = title;
      title = '';
    }
    if (title) {
      title = `[${title}]`;
    }

    if (level < +logLevel) {
      return;
    }

    const logMethod = console[type];
    logMethod(raw ? msg : `> [${new Date().format('yyyy-MM-dd hh:mm:ss')}]${title}: ${msg}`);
  }
  const log = function (title, msg) {
    _log({title, msg});
  };
  log.info = function (title, msg) {
    _log({title, msg, type: 'info'});
  };
  log.warn = function (title, msg) {
    _log({title, msg, type: 'warn'});
  };
  log.error = function (title, msg) {
    _log({title, msg, type: 'error'});
  };
  log.raw = function (msg, type = 'log') {
    _log({msg, type, raw: true});
  };

  global.log = log;
})(global || window);
