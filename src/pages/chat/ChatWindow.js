import React, { useState, useEffect, useRef } from 'react';
import { IoAttach, IoCall, IoVideocam } from 'react-icons/io5';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

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


const ChatWindow = ({ chat, currentUser, onRefreshChats }) => {
  const [messages, setMessages] = useState([]);
  const [mL, setMessagesLength] = useState(0);
  const [chatId, setChatId] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chat?.chat_id) {
      fetchChatMessages();
      setChatId(chat?.chat_id)
    }
  }, [chat?.chat_id]);

  // Auto-refresh messages every 2 seconds when chat is active
  useEffect(() => {
    if (!chat?.chat_id || !chatId) return;
    
    const interval = setInterval(() => {
      // Only fetch if no pending messages
      const hasPendingMessages = messages.some(msg => msg.sending || msg.failed);
      if (!hasPendingMessages) {
        fetchChatMessages();
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [chat?.chat_id, chatId, messages]);

  // Auto-retry failed messages when online
  useEffect(() => {
    const handleOnline = () => {
      const failedMessages = messages.filter(msg => msg.failed && msg.sender_id === currentUser);
      failedMessages.forEach(msg => {
        resendMessage(msg);
      });
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [messages, currentUser]);

  useEffect(() => {
    if(messages.length === mL) return;
    setMessagesLength(messages.length);
    scrollToBottom();
    // Mark as read only when messages are loaded and visible
    if (messages.length > 0 && chat?.chat_id) {
      markAsRead();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatMessages = async (preservePending = true) => {
    try {
      const response = await fetch('https://buzzinguniverse.com/backend/api/get-chat-form-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_id: chat.chat_id, myid: currentUser })
      });
      const data = await response.json();
      
      const serverMessages = (data.data || []).map(msg => ({
        ...msg,
        created_at: convertToLocalTime(msg.created_at)
      }));
      
      if (preservePending) {
        // Preserve pending/failed messages
        setMessages(prev => {
          const pendingMessages = prev.filter(msg => msg.sending || msg.failed);
          return [...serverMessages, ...pendingMessages];
        });
      } else {
        setMessages(serverMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markAsRead = async () => {
    if (!chatId) return;
    try {
      await fetch('https://buzzinguniverse.com/backend/api/mark-chat-as-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, myid: currentUser })
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const sendMessage = async (messageText, attachedFile = null) => {
    if (!chat.chat_id || (!messageText.trim() && !attachedFile)) return;
    
    // Use special message for file-only uploads
    const finalMessage = attachedFile && !messageText.trim() ? 'QmtsoYltwVw' : messageText;
    
    const tempMessage = {
      id: Date.now(),
      message: finalMessage || '',
      sender_id: currentUser,
      created_at: new Date().toISOString(),
      sending: true,
      uploadProgress: attachedFile ? 0 : undefined,
      attachments: attachedFile ? [{
        name: attachedFile.name,
        type: attachedFile.type,
        size: attachedFile.size,
        preview: attachedFile.preview
      }] : []
    };

    setMessages(prev => [...prev, tempMessage]);
    
    try {
      if (attachedFile) {
        // Send message with file using FormData with progress tracking
        const formData = new FormData();
        formData.append('chat_id', chat.chat_id);
        formData.append('sender_id', currentUser);
        formData.append('message', finalMessage);
        formData.append('file', attachedFile.file);

        const xhr = new XMLHttpRequest();
        
        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            setMessages(prev => prev.map(msg => 
              msg.id === tempMessage.id ? { ...msg, uploadProgress: percentComplete } : msg
            ));
          }
        });

        // Handle completion
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            setMessages(prev => prev.map(msg => 
              msg.id === tempMessage.id ? { ...msg, sending: false, uploadProgress: undefined } : msg
            ));
            onRefreshChats();
          } else {
            setMessages(prev => prev.map(msg => 
              msg.id === tempMessage.id ? { ...msg, sending: false, failed: true, uploadProgress: undefined } : msg
            ));
          }
        });

        // Handle errors
        xhr.addEventListener('error', () => {
          setMessages(prev => prev.map(msg => 
            msg.id === tempMessage.id ? { ...msg, sending: false, failed: true, uploadProgress: undefined } : msg
          ));
        });

        xhr.open('POST', 'https://buzzinguniverse.com/backend/api/send-message');
        xhr.send(formData);

      } else {
        // Send text-only message
        const response = await fetch('https://buzzinguniverse.com/backend/api/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chat.chat_id,
            sender_id: currentUser,
            message: messageText
          })
        });

        if (response.ok) {
          setMessages(prev => prev.map(msg => 
            msg.id === tempMessage.id ? { ...msg, sending: false } : msg
          ));
          onRefreshChats();
        } else {
          setMessages(prev => prev.map(msg => 
            msg.id === tempMessage.id ? { ...msg, sending: false, failed: true } : msg
          ));
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id ? { ...msg, sending: false, failed: true, uploadProgress: undefined } : msg
      ));
    }
  };

  const createGoogleMeetSession = async (isVideoCall = false) => {
    try {
      // Create Google Meet using your backend API
      const response = await fetch('https://buzzinguniverse.com/backend/api/create-google-meet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: `${isVideoCall ? 'Video' : 'Audio'} Call`,
          description: 'Meeting created from chat',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
        })
      });
      
      const meetingData = await response.json();
      
      if (meetingData.success && meetingData.meetLink) {
        const callType = isVideoCall ? 'Video Call' : 'Audio Call';
        const messageText = `${isVideoCall ? '📹' : '📞'} ${callType} Invitation\n\nJoin Google Meet: ${meetingData.meetLink}\n\nMeeting ID: ${meetingData.meetingId || 'N/A'}`;
        
        await sendMessage(messageText);
        window.open(meetingData.meetLink, '_blank');
      } else {
        // Fallback to Google Meet new meeting
        const meetingUrl = 'https://meet.google.com/new';
        window.open(meetingUrl, '_blank');
      }
      
    } catch (error) {
      console.error('Error creating Google Meet session:', error);
      // Fallback to Google Meet new meeting
      const meetingUrl = 'https://meet.google.com/new';
      const callType = isVideoCall ? 'Video Call' : 'Audio Call';
      const messageText = `${isVideoCall ? '📹' : '📞'} ${callType} Invitation\n\nJoin Google Meet: ${meetingUrl}`;
      
      await sendMessage(messageText);
      window.open(meetingUrl, '_blank');
    }
  };

  const resendMessage = async (failedMessage) => {
    setMessages(prev => prev.map(msg => 
      msg.id === failedMessage.id ? { ...msg, sending: true, failed: false } : msg
    ));
    
    try {
      const response = await fetch('https://buzzinguniverse.com/backend/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chat.chat_id,
          sender_id: currentUser,
          message: failedMessage.message
        })
      });

      if (response.ok) {
        setMessages(prev => prev.map(msg => 
          msg.id === failedMessage.id ? { ...msg, sending: false, failed: false } : msg
        ));
        // Refresh messages after successful send
        setTimeout(() => fetchChatMessages(false), 1000);
        onRefreshChats();
      } else {
        setMessages(prev => prev.map(msg => 
          msg.id === failedMessage.id ? { ...msg, sending: false, failed: true } : msg
        ));
      }
    } catch (error) {
      console.error('Error resending message:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === failedMessage.id ? { ...msg, sending: false, failed: true } : msg
      ));
    }
  };

  // Drag and drop handlers for entire chat window
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!chatWindowRef.current?.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Trigger file selection in MessageInput
      const fileEvent = new Event('fileDropped');
      fileEvent.file = files[0];
      window.dispatchEvent(fileEvent);
    }
  };

  return (
    <div 
      className={`chat-window ${isDragOver ? 'drag-over' : ''}`}
      ref={chatWindowRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar-header">
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
          <div>
            <h3>{`${chat.user?.first_name || ''} ${chat.user?.last_name || ''}`.trim() || 'Unknown User'}</h3>
            <span className="online-status">Online</span>
          </div>
        </div>
        <div className="chat-header-actions">
          <button 
            className="call-btn audio-call" 
            onClick={() => createGoogleMeetSession(false)}
            title="Start Audio Call"
          >
            <IoCall size={20} />
          </button>
          <button 
            className="call-btn video-call" 
            onClick={() => createGoogleMeetSession(true)}
            title="Start Video Call"
          >
            <IoVideocam size={20} />
          </button>
        </div>
      </div>

      <div className="messages-container">
        <MessageList 
          messages={messages}
          currentUser={currentUser}
          onResendMessage={resendMessage}
        />
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={sendMessage} />

      {/* Drag and Drop Overlay for entire chat window */}
      {isDragOver && (
        <div className="chat-drag-overlay">
          <div className="drag-content">
            <IoAttach size={64} />
            <h3>Drop file to send</h3>
            <p>Release to attach file</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;