import React from "react";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { light } from "@pancakeswap-libs/uikit";

const ThemeContextProvider = ({ children }) => {
  return (
      <SCThemeProvider theme={ light }>
        {children}
      </SCThemeProvider>
  );
};

export { ThemeContextProvider };
