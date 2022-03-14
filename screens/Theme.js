import React from "react";

const ThemeContext = React.createContext();

const ThemeContextProvider = props => {
  const theme = {
    colors: {
      GREY: "#555",
      THEME: "#6761A8",
      ACCENT: "#00b4fc",
      SURFACE: "#eee",
      GREEN: "#2ecc71",
      RED: "#FF6347",
      WARNING: "#ffcc00",
    },
  };

  return <ThemeContext.Provider value={theme}>{props.children}</ThemeContext.Provider>;
};

export { ThemeContextProvider, ThemeContext };
