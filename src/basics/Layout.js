import styled from 'styled-components';

import { DIMENSIONS, MEDIA } from '../constants/styles';

export const Container = styled.div`
  width: ${DIMENSIONS.centerColumn};
  max-width: 100%;
  padding: 1em;
  margin: 0 auto;
  font-size: 1.2em;

  ${MEDIA.mobile} {
    font-size: 1em;
  }
`;
