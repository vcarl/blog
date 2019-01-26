/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import React from 'react';

import Providers from './src/components/Providers';

export const wrapRootElement = ({ element }) => (
  <Providers>{element}</Providers>
);
