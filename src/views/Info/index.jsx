import React from 'react';
import styles from './index.module.css';
import { useTheme } from '../../ThemeContext.jsx';

function Info() {
  

  return (
    <div>
      <h2>Info and FAQ</h2>
      <section>
        <h3>About this site</h3>
        <p>What is this site and how to use</p>
        <p>npm run build, firebase deploy</p>
        {/* Add more details as needed */}
      </section>
              <section>
          <h3>Home</h3>
          <p>The Timeline feature displays a chronological list of diary entries, allowing users to track and manage their daily activities and thoughts.</p>
          <p>Key features of the Timeline:</p>
          <ul>
            <li>View diary entries organized by date in a vertical timeline format.</li>
            <li>Each entry includes a title, date, mood indicator, and content snippet.</li>
            <li>Clicking on an entry expands it to display more details in a modal.</li>
            <li>Modal shows the full title, date, mood, and content of the selected diary entry.</li>
            
          </ul>
          <p>The Timeline offers a convenient way to reflect on past experiences.</p>
        </section>
      <section>
        <h3>Calendar</h3>
        <p>Explanation of the calendar feature and how to use it.</p>
        {/* Add more details as needed */}
      </section>
      <section>
        <h3>Chatbot</h3>
        <p>Information about sentiment analysis and how it's utilized in the site.</p>
        {/* Add more details as needed */}
      </section>
      <section>
        <h3>Sentiment Analysis</h3>
        <p>Information about sentiment analysis and how it's utilized in the site.</p>
        {/* Add more details as needed */}
      </section>
      {/* Add more sections for other features */}
    </div>
  );
}

export default Info;