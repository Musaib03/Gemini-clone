import { createContext } from 'react';
import { askGemini } from '../config/gemini-cli';
export const Context = createContext();

const ContextProvider = (props) => {

  const onSent = async (prompt) => {
    try {
      const response = await askGemini(prompt);
      return response;
    } catch (error) {
      console.error('Error getting response from Gemini:', error);
    }
  }

  const contextValue = {
    onSent
  }

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  )
}
export default ContextProvider;