import React from 'react';

import { Block } from '../basics/Text';
import { Link } from '../basics/Link';

const PageNav = () => (
  <Block>
    <Link to="/about">new blog who dis?</Link>
    {' – '}
    <Link to="/motivation">but why?</Link>
  </Block>
);

export default PageNav;
