import React, { useContext } from 'react'
import './Sidebar.css'
import {assets} from '../../assets/assets'
import { Context } from '../../context/context'

const Sidebar = () => {
    const [extended, setExtended] = React.useState(false);
    const { recentPrompts, loadConversation, setCurrentChat } = useContext(Context);

    const truncatePrompt = (text, maxLength = 25) => {
      return text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const handlePromptClick = (prompt) => {
      loadConversation(prompt);
    };

    const handleNewChat = () => {
      setCurrentChat([]);
    };

  return (
    <div className="sidebar">
      <div className="top">
        <img onClick = {()=>setExtended(prev=>!prev)} className="menu" src={assets.menu_icon} alt=""/>
        <div className="new-chat" onClick={handleNewChat}>
          <img src={assets.plus_icon} alt=""/>
          {extended?<p>New Chat</p>:null}
        </div>

        {extended && recentPrompts.length > 0 ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {recentPrompts.map((prompt, index) => (
              <div
                key={index}
                className="recent-entry"
                onClick={() => handlePromptClick(prompt)}
              >
                <img src={assets.message_icon} alt=""/>
                <p>{truncatePrompt(prompt)}</p>
              </div>
            ))}
          </div>
        ) : null}

      </div>

      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt=""/>
          {extended?<p>Help</p>:null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt=""/>
          {extended?<p>Activity</p>:null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt=""/>
          {extended?<p>Settings</p>:null}
        </div>

      </div>
    </div>
  )
}

export default Sidebar
