import React from 'react';
import styled from 'styled-components';

import { Image } from './Text';

const El = styled(Image)`
  max-width: 110rem;
  width: 100vw;
`;

const CoverImage = props => <El {...props} />;

export default CoverImage;
