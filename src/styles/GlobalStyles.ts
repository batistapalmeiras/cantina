// Libs
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.bodyMd.fontSize};
    font-weight: ${({ theme }) => theme.typography.bodyMd.fontWeight};
    line-height: ${({ theme }) => theme.typography.bodyMd.lineHeight};
    color: ${({ theme }) => theme.colors.ink};
    background-color: ${({ theme }) => theme.colors.canvas};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  img {
    display: block;
    max-width: 100%;
  }

  input, textarea, select {
    font-family: inherit;
  }

  ul, ol {
    list-style: none;
  }
`;

export default GlobalStyles;
