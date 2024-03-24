import React, { useState, useEffect, useRef } from 'react';
import { LexRuntimeV2 } from '@aws-sdk/client-lex-runtime-v2';
import { v4 as uuidv4 } from 'uuid';
import './Chatbot.css'; // Make sure to style your chatbot accordingly
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setSessionId(uuidv4()); // Generate a new session ID on component mount
  }, []);

  const receiveMessage = (response) => {
    // Parse the JSON response body from the backend
    const parsedBody = JSON.parse(response.body);
  
    // Check if the parsedBody has a messages array
    if (parsedBody && parsedBody.messages) {
      const botMessages = parsedBody.messages.map((message) => ({
        text: message.content,
        sender: 'bot'
      }));
      setMessages(prevMessages => [...prevMessages, ...botMessages]);
    } else {
      console.error('Invalid response:', response);
      setMessages(prevMessages => [...prevMessages, { text: 'Sorry, I encountered an error. Please try again later.', sender: 'bot' }]);
    }
  };

  const sendMessageToBackend = async (message) => {
    try {
      const { data } = await axios.post('https://7ns7gx2fni.execute-api.us-east-1.amazonaws.com/prod/resource', {
        message: message,
        sessionId: sessionId,
      });
      receiveMessage(data); // Pass the Axios response data to the receiveMessage function
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [...prevMessages, { text: 'Sorry, I encountered an error. Please try again later.', sender: 'bot' }]);
    }
  };

  
  const handleUserInput = (event) => {
    const userInput = event.target.value;
    if (event.key === 'Enter' && userInput.trim()) {
      setMessages(prevMessages => [...prevMessages, { text: userInput, sender: 'user' }]);
      sendMessageToBackend(userInput);
      event.target.value = ''; 
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            Hello, I am diaryapp Chatbot. Here are some commands to get you started:
            "I want to write a diary."
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.sender === 'user' ? (
                <div className="user-message">
                  <strong>You:</strong> {message.text}
                </div>
              ) : (
                <div className="bot-message">
                  <strong>Bot:</strong> {message.text}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        className="input-message"
        placeholder="Type your message here..."
        onKeyPress={handleUserInput}
      />
    </div>
  );
};

export default Chatbot;
