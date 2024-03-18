
import { LexRuntimeV2 } from '@aws-sdk/client-lex-runtime-v2';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect } from 'react';
import './Chatbot.css'; // Import your CSS file for styling
import { useRef } from 'react'; // Import useRef from 'react'


  
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null); 
  
  
  // Initialize AWS SDK with your region and credentials
  const config = {
    region: 'us-east-1',
    credentials: {
      accessKeyId: 'a',
      secretAccessKey: 'naa'
    }
  };

  useEffect(() => {
    setSessionId(uuidv4());
  }, []);
  
  const lexRuntimeV2 = new LexRuntimeV2(config);

  
  // Function to update state with received messages
  const receiveMessage = (data) => {
    if (data && data.messages) {
      const botMessages = data.messages.map(message => ({ text: message.content, sender: 'bot' }));
      setMessages(prevMessages => [...prevMessages, ...botMessages]);
    } else {
      console.error('Invalid response from Lex:', data);
      // Handle the case where the response from Lex is invalid or missing data
      receiveMessage({ messages: [{ content: 'Sorry, I encountered an error. Please try again later.' }] });
    }
  };

  // Function to handle sending a message to AWS Lex V2
  const sendMessageToLexV2 = async (message) => {
    try {
      const params = {
        botAliasId: 'TSTALIASID',
        botId: 'I7QYQOUFYC',
        localeId: 'en_GB',
        sessionId: sessionId,
        text: message
      };

      console.log('Sending message to Lex V2:', params); // Log the message being sent to Lex

      const data = await lexRuntimeV2.recognizeText(params);
      console.log('Received data from Lex V2:', data); // Log the data received from Lex
  
      if (data) {
        receiveMessage(data);
      } else {
        console.error('Invalid response from Lex:', data);
        receiveMessage({ messages: [{ content: 'Sorry, I encountered an error. Please try again later.' }] });
      }
    } catch (error) {
      console.error('Error sending message to Lex V2:', error);
      receiveMessage({ messages: [{ content: 'Sorry, I encountered an error. Please try again later.' }] });
    }
  };

  




// Function to handle user input
const handleUserInput = (inputMessage) => {
  setMessages(prevMessages => [...prevMessages, { text: inputMessage, sender: 'user' }]);
  sendMessageToLexV2(inputMessage);
};

return (
  <div className="chatbot-container">
    <div className="chatbot-messages">
      {messages.length === 0 ? (
        // Display a welcome message if there are no messages yet
        <div className="welcome-message" style={{ fontFamily: "'Roboto', sans-serif", fontSize: "18px", color: "#333", textAlign: "center", margin: "20px 0" }}>
  How can I help you today?
</div>
      ) : (
        // Once messages exist, display them instead of the welcome message
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
      onKeyPress={(event) => {
        if (event.key === 'Enter') {
          handleUserInput(event.target.value);
          event.target.value = '';
        }
      }}
    />
  </div>
);
};


export default Chatbot;