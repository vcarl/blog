import React from 'react';
import styled from 'styled-components';

const El = styled.div`
  height: 60vh;
  max-width: 140vh; // Don't stretch beyond 21:9
  background-image: url("${props => props.src}");
  background-size: cover;
  background-position: center;
  margin: auto;
`;

const CoverImage = props => <El src={props.src} {...props} />;

export default CoverImage;
