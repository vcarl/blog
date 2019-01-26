import React from 'react';
import styled from 'styled-components';

import { Container } from '../basics/Layout';
import { Link } from '../basics/Link';
import { Title } from '../basics/Text';

const El = styled.div`
  color: #eee;
  background: ${({ theme }) => theme.primary};
`;

const TitleEl = styled(Title)`
  font-family: monospace;
  margin: 0;
`;
const LinkEl = styled(Link)`
  color: ${({ theme }) => theme.textContrast};
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
