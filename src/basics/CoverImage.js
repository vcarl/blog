import React from 'react';
import styled from 'styled-components';

import { Image } from './Text';

const El = styled(Image)`
  max-width: 80em;
  width: 100vw;
`;

const CoverImage = props => <El {...props} />;

export default CoverImage;
