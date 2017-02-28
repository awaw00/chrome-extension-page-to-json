import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = fromJS({
  locationBeforeTransitions: null
});

// 该reducer切勿修改
export function router (state = initialState, {type, payload}) {
  if (type === LOCATION_CHANGE) {
    return state.set('locationBeforeTransitions', payload);
  }

  return state;
}
