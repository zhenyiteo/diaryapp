import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // State for pink background
  const [isPinkBackground, setIsPinkBackground] = useState(false);
  // State for light/dark theme
  const [theme, setTheme] = useState('light'); 

  // Function to toggle pink background
  const toggleBackground = () => {
    setIsPinkBackground((prev) => !prev);
  };

  // Function to toggle light/dark theme
  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  // Combined theme object to pass to the provider
  const combinedTheme = {
    isPinkBackground,
    toggleBackground,
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={combinedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);