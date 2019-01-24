import { createGlobalStyle } from 'styled-components'
import styledNormalize from 'styled-normalize'

const FONTS = {
  FontName: [
    // {
    //   name: "font"
    //   filename: "FontName",
    //   weight: FONT_WEIGHT.regular,
    //   style: "normal",
    // },
  ],
}

const GlobalStyles = createGlobalStyle`
  body,
  html,
  input,
  textarea,
  button {
    color: #333;
  }

  body {
    background: #eee;
  }

  /* stylelint-disable */
  ${Object.entries(FONTS).map(
    ([name, { filename, weight, style }]) =>
      `
    @font-face {
      font-family: ${name};
      src: url("/fonts/${name}/${filename}.eot");
      src: url("/fonts/${name}/${filename}.eot?#iefix")
          format("embedded-opentype"),
        url("/fonts/${name}/${filename}.woff2") format("woff2"),
        url("/fonts/${name}/${filename}.woff") format("woff");
      font-weight: ${weight};
      font-style: ${style};
    }
  `,
  )}
  /* stylelint-enable */

  ${styledNormalize}

  body,
  html,
  input,
  textarea,
  button {
    font-size: 16px;
    font-weight: 400;
    font-family: sans-serif;
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
`

export default GlobalStyles
