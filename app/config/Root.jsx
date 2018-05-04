import React from 'react';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { HashRouter as Router } from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import routes from './Routes';

const Root = () => (
  <MuiThemeProvider>
    <Router>
      { renderRoutes(routes) }
    </Router>
  </MuiThemeProvider>
);

export default Root;
