import React, { useState, useEffect } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import useRealTimeChat from './useRealTimeChat';
import './ChatApp.css';

// Convert US server time to local time
// Convert US server time to local time
// Convert US server time to local time
const convertToLocalTime = (usTimestamp) => {
  if (!usTimestamp) return null;
  
  try {
    let serverDate;
    
    if (typeof usTimestamp === 'string') {
      // Clean the timestamp and standardize format for Safari compatibility
      let cleanTimestamp = usTimestamp.replace(/\s*(UTC|GMT)[+-]\d+/i, '');
      
      // Convert space-separated to ISO format for Safari
      if (!cleanTimestamp.includes('T') && cleanTimestamp.includes(' ')) {
        cleanTimestamp = cleanTimestamp.replace(' ', 'T');
      }
      
      // Parse the timestamp and explicitly treat it as Eastern Time
      // by adding the Eastern timezone offset to the parsed local time
      const parsedDate = new Date(cleanTimestamp);
      
      if (isNaN(parsedDate.getTime())) {
        console.warn('Invalid timestamp:', usTimestamp);
        return usTimestamp;
      }
      
      // Get current date to determine if we're in DST
      const now = new Date();
      const isWinter = now.getMonth() < 2 || now.getMonth() > 10; // Rough DST check
      const easternOffset = isWinter ? 5 : 4; // EST = UTC-5, EDT = UTC-4
      
      // Convert from user's local timezone to Eastern Time
      const userTimezoneOffset = parsedDate.getTimezoneOffset(); // in minutes
      const easternTimezoneOffset = easternOffset * 60; // in minutes
      
      // Calculate the adjustment needed
      const offsetDiff = easternTimezoneOffset - userTimezoneOffset;
      serverDate = new Date(parsedDate.getTime() + (offsetDiff * 60 * 1000));
      
    } else {
      serverDate = new Date(usTimestamp);
    }
    
    return serverDate.toISOString();
    
  } catch (error) {
    console.error('Error converting timestamp:', error);
    return usTimestamp;
  }
};


const ChatApp = ({ userId, chatID, setChatID }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    fetchChatList();
  }, [userId]);

  // Auto-refresh chat list every 5 seconds to update read status
  useEffect(() => {
    if (!userId) return;
    
    const interval = setInterval(() => {
      fetchChatList();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [userId]);

  // Real-time chat functionality
  useRealTimeChat(
    userId,
    (data) => {
      // Handle new message notification
      console.log('New message received:', data);
    },
    () => {
      // Refresh chat list when there are updates
      fetchChatList();
    }
  );

  useEffect(() => {
    if (chatID) {
      const chat = chats.find(c => c.chat_id === chatID);
      if (chat) {
        setSelectedChat(chat);
      }
    }
  }, [chatID, chats]);

  const fetchChatList = async () => {
    try {
      const response = await fetch(`https://buzzinguniverse.com/backend/api/get-chat-list?myid=${userId}`);
      const data = await response.json();
      const chatsWithLocalTime = (data.data || []).map(chat => ({
        ...chat,
        last_time: chat.last_time ? convertToLocalTime(chat.last_time) : null
      }));
      setChats(chatsWithLocalTime);
    } catch (error) {
      console.error('Error fetching chat list:', error);
    }
  };
  const handleChatSelect = (chat) => {
    setChatID(null);
    setSelectedChat(chat);
    setChats(prevChats =>
      prevChats.map(c =>
        c.chat_id === chat.chat_id
          ? { ...c, unread_count: 0 }
          : c
      )
    );
  };

  return (
    <div className={`chat-app ${isFullscreen ? 'fullscreen' : ''}`} id='pills-tabContent'>
      <button 
        className="fullscreen-btn" 
        onClick={() => setIsFullscreen(!isFullscreen)}
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        {isFullscreen ? '⤓' : '⤢'}
      </button>
      <div className="chat-sidebar">
        <ChatList
          chats={chats}
          currentUser={userId}
          onChatSelect={handleChatSelect}
          selectedChat={selectedChat}
        />
      </div>
      <div className="chat-main">
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            currentUser={userId}
            onRefreshChats={fetchChatList}
          />
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-content">
              <h3>Select a chat to start messaging</h3>
              <p>Choose from your existing conversations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;