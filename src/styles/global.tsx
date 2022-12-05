import { Global, css } from "@emotion/react";
import { GlobalStyles } from "twin.macro";

const globalCss = css`
  @media (prefers-color-scheme: dark) {
    html {
      color-scheme: dark;
    }
    body {
      color: white;
      background: black;
    }
  }
`;

export const UserGlobalStyles = (): JSX.Element => (
  <>
    <GlobalStyles />
    <Global styles={globalCss} />
  </>
);
