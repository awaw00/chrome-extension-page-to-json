import { fromJS } from 'immutable';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { fork, takeEvery } from 'redux-saga/effects';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';

import originModels from './models';

let models = originModels;

export default (initialState = {}, history) => {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];
  if (history) {
    middleware.push(routerMiddleware(history));
  }

  const enhancers = [];
  if (__DEV__) {
    const devToolsExtension = window.devToolsExtension;
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    } else {
      const DevTools = require('./components/DevTools');
      enhancers.push(DevTools.instrument());
    }
  }

  const store = createStore(
    models.reducers,
    fromJS(initialState),
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );

  store.runSaga = sagaMiddleware.run;
  store.close = () => {
    store.dispatch(END);
  };

  let rootSagaTask = null;

  function runRootSaga () {
    if (models && models.sagas) {
      store.runSaga(function * () {
        yield models.sagas.map(saga => fork(saga));
      }).done.catch(e => {
        console.error(e.message || e);
        runRootSaga();
      });
    }
  }

  store.runSaga(function * () {
    yield takeEvery('*', (action) => {
      console.info('[action] ' + action.type);
    });
  });
  runRootSaga();

  const historyRes = history ? syncHistoryWithStore(history, store, {
      selectLocationState (state) {
        return state.get('router').toObject();
      }
    }) : void 0;

  if (__DEV__ && module.hot) {
    module.hot.accept('./models', () => {
      models = require('./models');
      store.replaceReducer(models.reducers);

      store.close();
      runRootSaga();
    });
  }

  return {store, history: historyRes};
}
