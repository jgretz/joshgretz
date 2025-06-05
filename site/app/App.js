import React, {Fragment} from 'react';
import {withRouter} from 'react-router';

import {Header} from './features/header/components';
import {Routes} from './features/shared/components';

const App = () => (
  <Fragment>
    <Header />
    <div className="content">
      <Routes />
    </div>
  </Fragment>
);

export default withRouter(App);
