import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isPinkBackground, setIsPinkBackground] = useState(false);

  const toggleBackground = () => {
    setIsPinkBackground((prev) => !prev);
  };

  const theme = {
    isPinkBackground,
    toggleBackground,
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  return useContext(ThemeContext);
};