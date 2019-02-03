/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */
import React from 'react';

import Providers from './src/components/Providers';
import { SsrStyles } from './src/basics/GlobalStyles';

export const wrapRootElement = ({ element }) => (
  <Providers>
    <>
      <SsrStyles />
      {element}
    </>
  </Providers>
);
