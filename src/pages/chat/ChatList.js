import React, { useState } from 'react';
import { IoCheckmark, IoCheckmarkDone, IoCamera, IoVideocam, IoDocument, IoMusicalNotes } from 'react-icons/io5';

const ChatList = ({ chats, onChatSelect, selectedChat, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to render last message with media indicators
  const renderLastMessage = (chat) => {
    const lastMessage = chat.last_message;
    
    // Check if it's our special empty message indicator
    if (lastMessage === 'QmtsoYltwVw') {
      // Try to determine file type from chat data if available
      const fileType = chat.file_type?.toLowerCase();
      
      if (fileType) {
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType);
        const isVideo = ['mp4', 'mkv', 'avi', 'mov', 'wmv'].includes(fileType);
        const isAudio = ['mp3', 'wav', 'ogg', 'aac'].includes(fileType);
        
        if (isImage) {
          return (
            <span className="media-message">
              <IoCamera size={14} className="media-icon" />
              Photo
            </span>
          );
        } else if (isVideo) {
          return (
            <span className="media-message">
              <IoVideocam size={14} className="media-icon" />
              Video
            </span>
          );
        } else if (isAudio) {
          return (
            <span className="media-message">
              <IoMusicalNotes size={14} className="media-icon" />
              Audio
            </span>
          );
        } else {
          return (
            <span className="media-message">
              <IoDocument size={14} className="media-icon" />
              Document
            </span>
          );
        }
      } else {
        // Fallback when file type is not available
        return (
          <span className="media-message">
            <IoCamera size={14} className="media-icon" />
            Media
          </span>
        );
      }
    }
    
    // Return normal message or fallback
    return lastMessage || 'No messages yet';
  };

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h2>Messages</h2>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="chat-items">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.chat_id}
              className={`chat-item ${selectedChat?.chat_id === chat.chat_id ? 'active' : ''}`}
              onClick={() => onChatSelect(chat)}
            >
              <div className="chat-avatar">
                {chat.user?.photo ? (
                  <img 
                    src={`https://buzzinguniverse.com/backend/${chat.user.photo}`} 
                    alt="Avatar" 
                    className="avatar-img"
                  />
                ) : (
                  chat.user?.first_name?.charAt(0) || 'U'
                )}
              </div>
              <div className="chat-info">
                <div className="chat-name">{`${chat.user?.first_name || ''} ${chat.user?.last_name || ''}`.trim() || 'Unknown User'}</div>
                <div className="chat-last-message">
                  {parseInt(chat?.sender?.id) === currentUser && (
                    <span className="message-status">
                      {chat.seen === '1' ? (
                        <IoCheckmarkDone size={12} />
                      ) : (
                        <IoCheckmark size={12} />
                      )}
                    </span>
                  )}
                  {renderLastMessage(chat)}
                </div>
              </div>
              <div className="chat-meta">
                <div className="chat-time">
                  {chat.last_time ? new Date(chat.last_time).toLocaleTimeString([], {
                    hour: '2-digit', 
                    minute:'2-digit'
                  }) : ''}
                </div>
                {chat.unread_count > 0 && (
                  <div className="unread-badge">{chat.unread_count}</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-chats">
            <p>No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;