import React from 'react';
import { Route, IndexRoute } from 'react-router';

export default [
  (
    <Route path="/" component={require('./layouts/Home')}>
      <IndexRoute component={require('./pages/Home/index')}/>
    </Route>
  ),
];
