import React from 'react';
import {Link} from 'react-router-dom';

import logo from '../../../images/logo.png';
import {ROUTES} from '../../shared/constants';

export default () => (
  <div className="bar">
    <Link to={ROUTES.about.route}>
      <div>About</div>
    </Link>
    <Link to={ROUTES.home.route}>
      <img src={logo} />
    </Link>
    <Link to={ROUTES.resume.route}>
      <div>Resume</div>
    </Link>
  </div>
);
