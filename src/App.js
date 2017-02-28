import React from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import routes from 'routes';
import './App.less';

function App ({
  store,
  history
}) {
  return (
    <Provider store={store}>
      <Router history={history} routes={routes}/>
    </Provider>
  );
}

export default App;
