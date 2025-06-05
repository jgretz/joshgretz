import React from 'react';
import {Switch, Route} from 'react-router';

import {About} from '../../about/components';
import {Blog} from '../../blog/components';
import {Resume} from '../../resume/components';
import NotFound from './notFound';

import {ROUTES} from '../constants';

export default () => (
  <Switch>
    <Route path={ROUTES.about.route} component={About} />
    <Route path={ROUTES.resume.route} component={Resume} />
    <Route path={ROUTES.home.route} component={Blog} />

    <Route component={NotFound} />
  </Switch>
);
