import React from 'react';
import styles from './index.module.css';
import { useTheme } from '../../ThemeContext.jsx';

function Setting() {
  const { isPinkBackground, toggleBackground } = useTheme(); // Use the theme context

  return (
    <div className={`${styles.settingContainer} ${isPinkBackground ? styles.pinkBackground : ''}`}>
      <h2>Settings</h2>
      <p>Toggle background color:</p>
      <button onClick={toggleBackground}>
        {isPinkBackground ? 'Set Default Background' : 'Set Pink Background'}
      </button>
    </div>
  );
}

export default Setting;