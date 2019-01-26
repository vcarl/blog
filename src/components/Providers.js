import React from 'react';
import { ThemeProvider } from 'styled-components';

import { PALETTE } from '../constants/styles';

const Providers = ({ children }) => (
  <ThemeProvider theme={PALETTE}>{children}</ThemeProvider>
);

export default Providers;
