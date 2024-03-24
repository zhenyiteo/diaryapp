import React, { useState, useEffect, useRef } from 'react';
import { LexRuntimeV2 } from '@aws-sdk/client-lex-runtime-v2';
import { v4 as uuidv4 } from 'uuid';
import './Chatbot.css'; // Make sure to style your chatbot accordingly

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setSessionId(uuidv4()); // Generate a new session ID on component mount
  }, []);

  // Lex V2 Client configuration
  // IMPORTANT: Do not hardcode credentials in production. Use environment variables or AWS IAM roles.
  const lexRuntimeV2 = new LexRuntimeV2({
    region: 'us-east-1',
    credentials: {
      accessKeyId: 'Aa',
      secretAccessKey: 'naa'
    }
  });

  const receiveMessage = (data) => {
    if (data && data.messages) {
      const botMessages = data.messages.map(message => ({ text: message.content, sender: 'bot' }));
      setMessages(prevMessages => [...prevMessages, ...botMessages]);

      // Check if any of the bot's messages indicate the session has ended
      const sessionEnded = botMessages.some(message => message.text.includes('Session ended.'));
      if (sessionEnded) {
        setTimeout(() => window.location.reload(), 15000); // Reload the page after 2 seconds
      }
    } else {
      console.error('Invalid response from Lex:', data);
      setMessages(prevMessages => [...prevMessages, { text: 'Sorry, I encountered an error. Please try again later.', sender: 'bot' }]);
    }
  };

  const sendMessageToLexV2 = async (message) => {
    const params = {
      botAliasId: 'TSTALIASID',
        botId: 'I7QYQOUFYC',
        localeId: 'en_GB',
        sessionId: sessionId,
        text: message
    };

    try {
      const data = await lexRuntimeV2.recognizeText(params);
      receiveMessage(data);
    } catch (error) {
      console.error('Error sending message to Lex V2:', error);
      setMessages(prevMessages => [...prevMessages, { text: 'Sorry, I encountered an error. Please try again later.', sender: 'bot' }]);
    }
  };

  // Function to handle user message input and sending it to Lex
  const handleUserInput = (event) => {
    const userInput = event.target.value;
    if (event.key === 'Enter' && userInput.trim()) {
      setMessages(prevMessages => [...prevMessages, { text: userInput, sender: 'user' }]);
      sendMessageToLexV2(userInput);
      event.target.value = ''; // Clear the input field
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
