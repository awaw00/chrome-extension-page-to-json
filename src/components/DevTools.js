import React from 'react';

import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

const DevTools = createDevTools(
  <DockMonitor
    fluid
    defaultSize={1}
    changePositionKey='ctrl-q'
    toggleVisibilityKey='ctrl-h'
    defaultIsVisible={false}
  >
    <LogMonitor theme='tomorrow'/>
  </DockMonitor>
);

export default DevTools;
