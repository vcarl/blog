import React from 'react';
import styled from 'styled-components';

import { Container } from '../basics/Layout';
import { Link } from '../basics/Link';
import { Title } from '../basics/Text';

const El = styled.div`
  color: #eee;
  background: #922724;
`;

const TitleEl = styled(Title)`
  margin: 0;
`;
const LinkEl = styled(Link)`
  color: #eee;
`;

const Header = () => (
  <El>
    <Container>
      <LinkEl to="/">
        <TitleEl>~vcarl</TitleEl>
      </LinkEl>
    </Container>
  </El>
);

export default Header;
