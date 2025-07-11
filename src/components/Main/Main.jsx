import React, { useState, useContext, useRef, useEffect } from 'react';
import './Main.css';
import {assets} from '../../assets/assets';
import { Context } from '../../context/context';

const Main = () => {
  // States for handling the chat functionality
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const { onSent } = useContext(Context);
  const bottomRef = useRef(null);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!prompt.trim()) return;

    try {
      // Add user message to chat
      const userMessage = { role: 'user', content: prompt };
      setChatMessages(prev => [...prev, userMessage]);

      // Start loading state
      setIsLoading(true);

      // Send to Gemini and get response
      const response = await onSent(prompt);

      // Add Gemini response to chat
      setChatMessages(prev => [...prev, { role: 'gemini', content: response }]);
    } catch (error) {
      console.error("Error getting response:", error);
      setChatMessages(prev => [...prev, { role: 'gemini', content: "Sorry, I encountered an error. Please try again later." }]);
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Function to handle card clicks - prefill input with card text
  const handleCardClick = (text) => {
    setPrompt(text);
  };

  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">
        {chatMessages.length === 0 ? (
          <>
            <div className="greet">
              <p><span>Hello, DEV.</span></p>
              <p>How can I help you today?</p>
            </div>
            <div className="cards">
              <div className="card" onClick={() => handleCardClick("Suggest beautiful roads to see on an upcoming road trip")}>
                <p>Suggest beautiful roads to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt=""/>
              </div>
              <div className="card" onClick={() => handleCardClick("Briefly summarize the concept of urban planning")}>
                <p>Briefly summarize the concept of urban planning</p>
                <img src={assets.bulb_icon} alt=""/>
              </div>
              <div className="card" onClick={() => handleCardClick("Brainstorm team bonding activities for our work retreat")}>
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt=""/>
              </div>
              <div className="card" onClick={() => handleCardClick("Improve the readability of the following code")}>
                <p>Improve the readability of the following code</p>
                <img src={assets.code_icon} alt=""/>
              </div>
            </div>
          </>
        ) : (
          <div className="chat-container">
            {chatMessages.map((message, index) => (
              <div key={index} className={`chat-message ${message.role}`}>
                <div className="message-icon">
                  {message.role === 'user' ?
                    <img src={assets.user_icon} alt="User" /> :
                    <img src={assets.gemini_icon} alt="Gemini" />
                  }
                </div>
                <div className="message-content">
                  <pre>{message.content}</pre>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message gemini">
                <div className="message-icon">
                  <img src={assets.gemini_icon} alt="Gemini" />
                </div>
                <div className="message-content loading">
                  <div className="loading-animation">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        <div className="main-bottom">
          <form onSubmit={handleSubmit} className="search-box">
            <input
              type="text"
              placeholder="Enter a prompt here"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              <button type="submit" className="send-btn">
                <img src={assets.send_icon} alt="Send" />
              </button>
            </div>
          </form>
          {chatMessages.length === 0 && (
            <p className="bottom-info">
              Gemini is a large multimodal model that can accept images and text as input, and generate text as output. It is designed to be helpful, honest, and harmless.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Main;
