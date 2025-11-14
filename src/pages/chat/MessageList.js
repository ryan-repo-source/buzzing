import React from 'react';
import { IoChatbubbleEllipsesOutline, IoCheckmark, IoCheckmarkDone, IoTime, IoRefresh, IoDownload, IoCamera, IoVideocam } from 'react-icons/io5';

const MessageList = ({ messages, currentUser, onResendMessage }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = formatDate(message.created_at);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const renderAttachments = (message) => {
    // Check if message has file attachment from server or is uploading
    const hasServerFile = message.file;
    const hasUploadingFile = message.attachments && message.attachments.length > 0;
    
    if (!hasServerFile && !hasUploadingFile) return null;

    // Handle uploading files (temporary attachments)
    if (hasUploadingFile && !hasServerFile) {
      const attachment = message.attachments[0];
      const isImage = attachment.type === 'image';
      const isVideo = attachment.type === 'video';
      const isAudio = attachment.type === 'audio';

      return (
        <div className="message-file-attachment uploading">
          {isImage && attachment.preview ? (
            <div className="message-image-container">
              <img 
                src={attachment.preview} 
                alt={attachment.name}
                className="message-image uploading"
              />
              {message.uploadProgress !== undefined && (
                <div className="upload-progress-overlay">
                  <div className="progress-circle">
                    <div className="progress-text">{message.uploadProgress}%</div>
                    <svg className="progress-ring" width="60" height="60">
                      <circle
                        className="progress-ring-circle"
                        stroke="white"
                        strokeWidth="3"
                        fill="transparent"
                        r="26"
                        cx="30"
                        cy="30"
                        style={{
                          strokeDasharray: `${2 * Math.PI * 26}`,
                          strokeDashoffset: `${2 * Math.PI * 26 * (1 - message.uploadProgress / 100)}`,
                        }}
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="message-document uploading">
              <div className="document-icon">
                {isVideo && <IoVideocam size={24} />}
                {isAudio && <span style={{fontSize: '24px'}}>🎵</span>}
                {!isVideo && !isAudio && <IoCamera size={24} />}
              </div>
              <div className="document-details">
                <span className="document-name">{attachment.name}</span>
                <span className="document-type">{attachment.type?.toUpperCase()} file</span>
              </div>
              {message.uploadProgress !== undefined && (
                <div className="upload-progress-bar">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${message.uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="progress-percentage">{message.uploadProgress}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // Handle server files (completed uploads)
    const fileUrl = `https://buzzinguniverse.com/backend/${message.file}`;
    const fileName = message.file.split('/').pop();
    const fileType = message.file_type?.toLowerCase();
    
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType);
    const isVideo = ['mp4', 'mkv', 'avi', 'mov', 'wmv'].includes(fileType);
    const isAudio = ['mp3', 'wav', 'ogg', 'aac'].includes(fileType);

    return (
      <div className="message-file-attachment">
        {isImage ? (
          <div className="message-image-container">
            <img 
              src={fileUrl} 
              alt={fileName}
              className="message-image"
              onClick={() => window.open(fileUrl, '_blank')}
            />
            <div className="image-download-overlay">
              <a 
                href={fileUrl} 
                download={fileName}
                className="download-btn"
                title="Download image"
                onClick={(e) => e.stopPropagation()}
              >
                <IoDownload size={16} />
              </a>
            </div>
          </div>
        ) : isVideo ? (
          <div className="message-video-container">
            <video 
              src={fileUrl}
              className="message-video"
              controls
              preload="metadata"
            />
            <div className="video-info">
              <span className="file-name">{fileName}</span>
              <a 
                href={fileUrl} 
                download={fileName}
                className="download-link"
                title="Download video"
              >
                <IoDownload size={14} />
              </a>
            </div>
          </div>
        ) : (
          <div className="message-document">
            <div className="document-icon">
              {isAudio ? (
                <span style={{fontSize: '24px'}}>🎵</span>
              ) : (
                <IoCamera size={24} />
              )}
            </div>
            <div className="document-details">
              <span className="document-name">{fileName}</span>
              <span className="document-type">{fileType?.toUpperCase()} file</span>
            </div>
            <a 
              href={fileUrl} 
              download={fileName}
              className="document-download"
              title="Download file"
            >
              <IoDownload size={16} />
            </a>
          </div>
        )}
      </div>
    );
  };

  const messageGroups = groupMessagesByDate(messages);

  if (messages.length === 0) {
    return (
      <div className="no-messages">
        <div className="no-messages-content">
          <div className="no-messages-icon">
            <IoChatbubbleEllipsesOutline size={64} />
          </div>
          <h3>Start chatting now</h3>
          <p>Send a message to start the conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-list">
      {Object.entries(messageGroups).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="date-separator">
            <span>{date}</span>
          </div>
          {dateMessages.map((message, index) => {
            const isOwn = parseInt(message.sender_id) === currentUser;
            const showAvatar = !isOwn && (
              index === 0 || 
              dateMessages[index - 1].sender_id !== message.sender_id
            );

            return (
              <div
                key={message.id}
                className={`message ${isOwn ? 'own' : 'other'}`}
              >
                {showAvatar && (
                  <div className="message-avatar">
                    {message.user?.photo ? (
                      <img 
                        src={`https://buzzinguniverse.com/backend/${message.user.photo}`} 
                        alt="Avatar" 
                        className="avatar-img"
                      />
                    ) : (
                      message.user?.first_name?.charAt(0) || 'U'
                    )}
                  </div>
                )}
                <div className={`message-content ${!showAvatar && !isOwn ? 'no-avatar' : ''}`}>
                  <div className={`message-bubble ${message.failed ? 'failed' : ''} ${message.file ? 'has-attachment' : ''}`}>
                    {/* Render file attachment first */}
                    {renderAttachments(message)}
                    
                    {/* Render text message if exists and not the special file-only message */}
                    {message.message && message.message !== 'QmtsoYltwVw' && (
                      <div className="message-text">
                        <p>{message.message}</p>
                      </div>
                    )}
                    
                    <div className="message-time">
                      {formatTime(message.created_at)}
                      {message.sending && (
                        <span className="sending">
                          <IoTime size={12} />
                        </span>
                      )}
                      {message.failed && (
                        <button 
                          className="resend-btn" 
                          onClick={() => onResendMessage(message)}
                          title="Tap to retry"
                        >
                          <IoRefresh size={12} />
                        </button>
                      )}
                      {isOwn && !message.sending && !message.failed && (
                        <span className="read-status">
                          {message.is_read === '1' ? (
                            <IoCheckmarkDone size={14} />
                          ) : (
                            <IoCheckmark size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MessageList;