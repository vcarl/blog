import React from 'react';

import { Block } from '../basics/Text';
import { Link } from '../basics/Link';

const PageNav = () => (
  <Block>
    <Link to="/about">who dis?</Link>
    {' – '}
    <Link to="/motivation">whazis?</Link>
  </Block>
);

export default PageNav;
