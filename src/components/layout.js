import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { DIMENSIONS } from '../constants/styles';

import GlobalStyles from '../basics/GlobalStyles';

import Header from './header';

const El = styled.div`
  display: grid;
  grid-template: 1fr / 1fr ${DIMENSIONS.centerColumn} 1fr;
  padding: 1rem 0;
`;

const Layout = ({ children, title }) => (
  <>
    <GlobalStyles />
    <Header siteTitle={title} />
    <El>
      <div />
      <div>
        {children}
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </div>
    </El>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
