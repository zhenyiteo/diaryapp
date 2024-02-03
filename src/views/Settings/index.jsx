import React, { useState } from 'react';
import styles from './index.module.css';

function Setting() {
  const [isPinkBackground, setIsPinkBackground] = useState(false);

  const handleToggleBackground = () => {
    setIsPinkBackground(!isPinkBackground);
  };

  return (
    <div className={`${styles.settingContainer} ${isPinkBackground ? styles.pinkBackground : ''}`}>
      <h2>Settings</h2>
      <p>Toggle background color:</p>
      <button onClick={handleToggleBackground}>
        {isPinkBackground ? 'Set Default Background' : 'Set Pink Background'}
      </button>
    </div>
  );
}

export default Setting;