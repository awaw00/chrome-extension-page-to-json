import qs from 'qs';

export function getUrlQuery () {
  const {search, hash} = window.location;
  let searchStr = search || hash;
  searchStr = searchStr.replace(/^(.*?\?)/, '');

  return qs.parse(searchStr);
}

export function concatUrlAndQuery (baseUrl, query) {
  if (typeof query === 'object') {
    query = qs.stringify(query);
  } else if (typeof query !== 'string' || !query) {
    return baseUrl;
  }

  if (/\?/.test(baseUrl)) {
    baseUrl += '&';
  } else {
    baseUrl += '?';
  }

  return baseUrl + query;
}
