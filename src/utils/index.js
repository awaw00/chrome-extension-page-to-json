export function iconCode2Str (iconCode) {
  return String.fromCharCode(iconCode.replace(/^&#(.*);$/, '0$1'));
}

export function setDocumentTitle (title) {
  document.title = title;
  let ua = navigator.userAgent.toLowerCase();
  // IPHONE版无法监听TITLE 需要IFRAME触发
  if (ua.indexOf('iphone') > -1) {
    let iframe = document.createElement('iframe');
    iframe.src = '/static/ok.txt';
    iframe.width = 0;
    iframe.height = 0;
    iframe.frameBorder = 0;
    iframe.onload = function () {
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 0);
    };
    document.body.appendChild(iframe);
  }
}


