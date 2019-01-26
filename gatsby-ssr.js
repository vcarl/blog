/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */
import React from 'react';

import Providers from './src/components/Providers';

export const wrapRootElement = ({ element }) => (
  <Providers>{element}</Providers>
);
