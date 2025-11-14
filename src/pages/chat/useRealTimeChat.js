import { useEffect, useCallback } from 'react';

const useRealTimeChat = (currentUser, onNewMessage, onChatUpdate) => {
  const checkForNotifications = useCallback(async () => {
    try {
      const response = await fetch('https://buzzinguniverse.com/backend/api/chat-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser })
      });
      const data = await response.json();
      
      if (data.data.length) {
        onNewMessage && onNewMessage(data);
        onChatUpdate && onChatUpdate();
      }
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  }, [currentUser, onNewMessage, onChatUpdate]);

  useEffect(() => {
    // Poll for notifications every 3 seconds
    const interval = setInterval(checkForNotifications, 3000);
    
    return () => clearInterval(interval);
  }, [checkForNotifications]);

  return { checkForNotifications };
};

export default useRealTimeChat;