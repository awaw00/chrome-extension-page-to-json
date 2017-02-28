import p from 'platform';

let platform = p;

export function setUserAgent (ua) {
  platform = p.parse(ua);
}

export default platform;
