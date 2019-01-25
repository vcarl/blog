import { Link as GatsbyLink } from 'gatsby';
import styled from 'styled-components';

export const BlankLink = styled.a`
  text-decoration: none;
  color: #93261f;
`;

export const Link = styled(BlankLink).attrs({ as: GatsbyLink })`
  text-decoration: none;
  color: #93261f;
`;
