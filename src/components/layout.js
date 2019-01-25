import React from 'react';
import PropTypes from 'prop-types';

import GlobalStyles from '../basics/GlobalStyles';
import { Container } from '../basics/Layout';

import Header from './header';

const Layout = ({ children, title }) => (
  <>
    <GlobalStyles />
    <Header siteTitle={title} />
    <Container>
      {children}
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </footer>
    </Container>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
