import React from 'react';
import PropTypes from 'prop-types';

import GlobalStyles from '../basics/GlobalStyles';

import Header from './header';
import Footer from './Footer';

const Layout = ({ children, title }) => (
  <>
    <GlobalStyles />
    <Header siteTitle={title} />
    {children}
    <Footer />
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
