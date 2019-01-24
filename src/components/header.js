import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import styled from 'styled-components';

import { DIMENSIONS } from '../constants/styles';

import { Title } from '../basics/Text';

const El = styled.div`
  display: grid;
  grid-template: 1fr / 1fr ${DIMENSIONS.centerColumn} 1fr;
  color: #eee;
  background: #922724;
  padding: 1rem 0;
`;
const LeftEl = styled(Title)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0;
`;

const TitleEl = styled(Title)`
  margin: 0;
`;
const LinkEl = styled(Link)`
  color: #eee;
  text-decoration: none;
  padding: 0 1rem;
`;

const Header = ({ siteTitle }) => (
  <El>
    <LeftEl>
      <LinkEl to="/">/</LinkEl>
    </LeftEl>
    <TitleEl>{siteTitle}</TitleEl>
    <div />
  </El>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
