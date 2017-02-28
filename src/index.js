import 'utils/storage';
import 'utils/contentScripts';
import React from 'react';
import { render } from 'react-dom';
import { hashHistory } from 'react-router';
import createStore from './createStore';
import App from './App';

if (__DEV__) {
  require('inferno-devtools');
}

const {store} = createStore(window.__INITIAL_STATE__, hashHistory);

function bootstrap (App) {
  render(<App store={store} history={hashHistory}/>, document.getElementById('root'));
}

bootstrap(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    bootstrap(require('./App'));
  });
}
