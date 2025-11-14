const API_BASE_URL = 'https://buzzinguniverse.com/backend/api';

const apiCall = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

export const chatAPI = {
  getRoomId: (myid, userid) => apiCall('get-room-id', { myid, userid }),
  getChatFromId: (room_id) => apiCall('get-chat-form-id', { room_id }),
  sendMessage: (chat_id, sender_id, message) => apiCall('send-message', { chat_id, sender_id, message }),
  markChatAsRead: (chat_id, myid) => apiCall('mark-chat-as-read', { chat_id, myid }),
  getChatNotification: (user_id) => apiCall('chat-notification', { user_id }),
  getChatList: (myid) => apiCall('get-chat-list', { myid }),
};