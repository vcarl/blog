import { createGlobalStyle } from 'styled-components';
import styledNormalize from 'styled-normalize';

import charissilBoldWoff from '../fonts/charissilb.woff';
import charissilBoldWoff2 from '../fonts/charissilb.woff2';
import charissilBoldItalicWoff from '../fonts/charissilbi.woff';
import charissilBoldItalicWoff2 from '../fonts/charissilbi.woff2';
import charissilItalicWoff from '../fonts/charissili.woff';
import charissilItalicWoff2 from '../fonts/charissili.woff2';
import charissilRegularWoff from '../fonts/charissilr.woff';
import charissilRegularWoff2 from '../fonts/charissilr.woff2';
import latoWoff from '../fonts/lato.woff';
import latoWoff2 from '../fonts/lato.woff2';

const GlobalStyles = createGlobalStyle`
  body,
  html,
  input,
  textarea,
  button {
    color: ${({ theme }) => theme.text};
  }

  body {
    background: ${({ theme }) => theme.background};
  }

  @font-face {
    font-family: charissil;
    src: url("${charissilBoldWoff2}") format("woff2"),
      url("${charissilBoldWoff}") format("woff");
    font-weight: bold;
    font-style: regular;
  }
  }
  @font-face {
    font-family: charissil;
    src: url("${charissilBoldItalicWoff2}") format("woff2"),
      url("${charissilBoldItalicWoff}") format("woff");
    font-weight: bold;
    font-style: italic;
  }
  }
  @font-face {
    font-family: charissil;
    src: url("${charissilItalicWoff2}") format("woff2"),
      url("${charissilItalicWoff}") format("woff");
    font-weight: regular;
    font-style: italic;
  }
  }
  @font-face {
    font-family: charissil;
    src: url("${charissilRegularWoff2}") format("woff2"),
      url("${charissilRegularWoff}") format("woff");
    font-weight: regular;
    font-style: regular;
  }
  }
  @font-face {
    font-family: lato;
    src: url("${latoWoff2}") format("woff2"),
      url("${latoWoff}") format("woff");
    font-weight: regular;
    font-style: regular;
  }

  ${styledNormalize}

  body,
  html,
  input,
  textarea,
  button {
    font-size: 16px;
    font-weight: 400;
    font-family: 'charissil', 'Georgia', serif;
  }

  /* http://tachyons.io/docs/layout/box-sizing/ */
  body * {
    box-sizing: border-box;
  }

  body {
    min-height: 100vh;
    padding: 0;
    margin: 0;
  }

  twitter-widget {
    margin: auto;
  }
`;

export default GlobalStyles;
