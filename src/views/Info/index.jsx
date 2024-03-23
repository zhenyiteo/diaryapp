import React from 'react';
import styles from './index.module.css';
import SystemArchitectureDiagram from '../../architecture.jpg'; 


function Info() {
  return (
    <div className={styles.infoContainer}>
      <h2>Info and FAQ</h2>

      <section>
        <h3>System & Architecture Diagram</h3>
        <p>Understand the underlying technology that powers Diaryapp with our system and architecture diagram. </p>
        <p>Take a look at our architecture diagram below:</p>
        <img src={SystemArchitectureDiagram} alt="System Architecture Diagram" className={styles.architectureDiagram} />
      </section>
      
      <section>
        <h3>About This Site</h3>
        <p>Welcome to Diaryapp, your personal space to capture and explore your thoughts and memories.</p>
        <p>To get started, create a new diary entry, browse through your past entries on the Timeline, or interact with our Chatbot to start your entries. </p>
      </section>

      <section>
        <h3>Home and Timeline</h3>
        <p>The Timeline feature is the heart of Diaryapp, offering a visually engaging and organized view of your diary entries. It's a place where your daily life becomes a story told in sequence.</p>
        <ul>
          <li>Entries are presented in a chronological order, allowing for easy navigation through time.</li>
          <li>Quick snippets from each entry provide a glimpse into the day's mood and key events.</li>
  
        </ul>
        <p>Reflect on your journey and rediscover your progress and patterns through the Timeline.</p>
      </section>

      <section>
        <h3>Calendar</h3>
        <p>Our Calendar integrates seamlessly with the Timeline, enabling you to select and view entries from specific dates. It serves as a navigational tool to pinpoint moments in time and the emotions associated with them.</p>
        <p>Use the Calendar to:</p>
        <ul>
          <li>Jump to specific dates to view corresponding diary entries.</li>
          <li>Identify and browse entries based on mood symbols.</li>
          
        </ul>
       
      </section>

      <section>
        <h3>Chatbot - Powered by AWS Lex V2</h3>
        <p>Our interactive Chatbot, integrated with AWS Lex V2.</p>
        <p>Here's how our Chatbot enhances your diary experience:</p>
        <ul>
          <li>Conversational Interface: Enjoy a natural, conversational experience as you write and reflect on your diary entries.</li>
          <li>Sentiment Analysis: Powered by machine learning, the Chatbot analyzes the emotional tone of your entries, helping you to understand your feelings.</li>
          
        </ul>
        
      </section>

      <section>
        <h3>Sentiment Analysis - Powered by AWS Comprehend</h3>
        <p>Sentiment Analysis is an automated process that detects the underlying tone in your diary entries. By analyzing the language and patterns in your text, our system identifies whether the sentiments are positive, negative, mixed or neutral.</p>
        <p>Understanding sentiment in your entries can help you:</p>
        <ul>
          <li>Gain insights into your subconscious feelings.</li>
          <li>Spot trends in your emotional well-being over time.</li>
          <li>Reflect and act upon areas of your life that may require attention or celebration.</li>
        </ul>
        <p>Explore the Sentiment Analysis feature to turn your entries into a roadmap for personal growth.</p>
      </section>

      {/* Add more sections for other features as needed */}
      
    </div>
  );
}

export default Info;
