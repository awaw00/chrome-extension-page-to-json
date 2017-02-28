import * as types from 'types';
import { put, take, fork, select, spawn, join, cancel, race, call, apply, cps, takeLatest } from 'redux-saga/effects';
import { setDocumentTitle } from 'utils';


function *updateViewConfig (action) {
  const {payload: {documentTitle}} = action;
  if (documentTitle) {
    setDocumentTitle(documentTitle);
  }
}

export default function * () {
  yield takeLatest(types.SET_VIEW_CONFIGS, updateViewConfig);
}
