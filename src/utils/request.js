import 'fetch-ie8';
import qs from 'qs';
import { API_ROOT } from 'constants';

async function request (method, url, body) {
  method = method.toLowerCase();

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include'
  };

  if (['get', 'jsonp'].indexOf(method) >= 0 && body) {
    url = url.replace(/\?$/, '');
    if (/\?/.test(url)) {
      url += '&';
    } else {
      url += '?';
    }
    url += qs.stringify(body);
  } else {
    options.body = body && JSON.stringify(body);
  }

  if (API_ROOT) {
    if (/^\//.test(url)) {
      url = API_ROOT + url;
    }
  }

  let res;
  res = await fetch(url, options);
  res = await res.json();

  return res;
}

function restApiRequest (method) {
  return request.bind(null, method);
}

export default request;
export const get = restApiRequest('get');
export const post = restApiRequest('post');
export const del = restApiRequest('delete');
export const put = restApiRequest('put');
