import { createContext, useState, useEffect } from 'react';
import { askGemini } from '../config/gemini-cli';
export const Context = createContext();

const ContextProvider = (props) => {
  const [recentPrompts, setRecentPrompts] = useState(() => {
    const savedPrompts = localStorage.getItem('recentPrompts');
    return savedPrompts ? JSON.parse(savedPrompts) : [];
  });

  const [conversations, setConversations] = useState(() => {
    const savedConversations = localStorage.getItem('conversations');
    return savedConversations ? JSON.parse(savedConversations) : {};
  });

  const [currentChat, setCurrentChat] = useState([]);

  useEffect(() => {
    localStorage.setItem('recentPrompts', JSON.stringify(recentPrompts));
  }, [recentPrompts]);

  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  const onSent = async (prompt) => {
    try {
      setRecentPrompts(prev => {
        const filteredPrompts = prev.filter(item => item !== prompt);
        return [prompt, ...filteredPrompts].slice(0, 10);
      });

      const response = await askGemini(prompt);

      setConversations(prev => ({
        ...prev,
        [prompt]: response
      }));

      setCurrentChat([
        { role: 'user', content: prompt },
        { role: 'gemini', content: response }
      ]);

      return response;
    } catch (error) {
      console.error('Error getting response from Gemini:', error);
    }
  }

  const loadConversation = (prompt) => {
    if (conversations[prompt]) {
      setCurrentChat([
        { role: 'user', content: prompt },
        { role: 'gemini', content: conversations[prompt] }
      ]);
    }
  }

  const contextValue = {
    onSent,
    recentPrompts,
    conversations,
    currentChat,
    setCurrentChat,
    loadConversation
  }

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  )
}
export default ContextProvider;