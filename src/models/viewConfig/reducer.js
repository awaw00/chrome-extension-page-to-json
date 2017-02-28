import * as types from 'types';
import { fromJS, List, Map } from 'immutable';

export function documentTitle (state = '群推荐', {type, payload = {}}) {
  switch (type) {
    case types.SET_VIEW_CONFIGS:
      return payload.documentTitle || state;
    default:
      return state;
  }
}

const initialShareData = fromJS({
  title: '群聊社区',
  desc: '精品微信群推荐',
  link: window.location.href,
  imgUrl: 'http://7xo7ol.com2.z0.glb.qiniucdn.com/wechat-group-logo.png'
});

export function shareData (state = initialShareData, {type, payload}) {
  switch (type) {
    case types.SET_VIEW_CONFIGS: {
      if (payload.shareData) {
        if (payload.shareData === 'initial') {
          return initialShareData;
        }
        return state.merge(payload.shareData);
      }
      return state;
    }
    default:
      return state;
  }
}
