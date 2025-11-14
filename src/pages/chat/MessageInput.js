import React, { useState, useRef, useEffect } from 'react';
import { IoSend, IoAttach, IoCamera, IoVideocam, IoHappyOutline, IoClose } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Allowed file extensions
  const allowedExtensions = {
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    video: ['mp4', 'mkv', 'avi', 'mov', 'wmv'],
    audio: ['mp3', 'wav', 'ogg', 'aac']
  };

  // Get file type based on extension
  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    for (const [type, extensions] of Object.entries(allowedExtensions)) {
      if (extensions.includes(extension)) {
        return type;
      }
    }
    return null;
  };

  // Validate file
  const validateFile = (file) => {
    const fileType = getFileType(file.name);
    if (!fileType) {
      alert(`File type not supported. Allowed types: ${Object.values(allowedExtensions).flat().join(', ')}`);
      return false;
    }
    
    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('File size too large. Maximum size is 50MB.');
      return false;
    }
    
    return true;
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    if (validateFile(file)) {
      const fileType = getFileType(file.name);
      const fileData = {
        file,
        name: file.name,
        size: file.size,
        type: fileType,
        preview: null
      };
      
      // Create preview for images
      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachedFile(prev => ({ ...prev, preview: e.target.result }));
        };
        reader.readAsDataURL(file);
      }
      
      setAttachedFile(fileData);
    }
  };

  // Remove attached file
  const removeFile = () => {
    setAttachedFile(null);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || attachedFile) {
      onSendMessage(message.trim(), attachedFile);
      setMessage('');
      setAttachedFile(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  // Listen for file drop events from chat window
  useEffect(() => {
    const handleFileDropped = (event) => {
      if (event.file) {
        handleFileSelect(event.file);
      }
    };

    window.addEventListener('fileDropped', handleFileDropped);
    return () => window.removeEventListener('fileDropped', handleFileDropped);
  }, []);

  const handleEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };



  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="message-input-container">
      {/* WhatsApp-like File Preview */}
      {attachedFile && (
        <div className="file-preview-container">
          <div className="file-preview-content">
            {attachedFile.type === 'image' && attachedFile.preview ? (
              <div className="image-preview">
                <img src={attachedFile.preview} alt={attachedFile.name} className="preview-image" />
                <div className="image-overlay">
                  <div className="file-info">
                    <span className="file-name">{attachedFile.name}</span>
                    <span className="file-size">{formatFileSize(attachedFile.size)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="document-preview">
                <div className="document-icon">
                  {attachedFile.type === 'video' && <IoVideocam size={48} />}
                  {attachedFile.type === 'audio' && <span style={{fontSize: '48px'}}>🎵</span>}
                  {attachedFile.type === 'image' && <IoCamera size={48} />}
                </div>
                <div className="document-info">
                  <div className="file-name">{attachedFile.name}</div>
                  <div className="file-size">{formatFileSize(attachedFile.size)}</div>
                </div>
              </div>
            )}
            <button
              type="button"
              className="remove-preview-btn"
              onClick={removeFile}
              title="Remove file"
            >
              <IoClose size={20} />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="message-form">
        <div className="input-wrapper">
          <button 
            type="button" 
            className="action-btn attach-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
          >
            <IoAttach size={18} />
          </button>
          <button 
            type="button" 
            className="emoji-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Add emoji"
          >
            <IoHappyOutline size={20} />
          </button>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={attachedFile ? "Add a caption..." : "Type a message..."}
            className="message-textarea"
            rows="1"
          />
          <button
            type="submit"
            className={`send-button ${(message.trim() || attachedFile) ? 'active' : ''}`}
            disabled={!(message.trim() || attachedFile)}
          >
            <IoSend size={18} />
          </button>
        </div>

        {showEmojiPicker && (
          <div className="emoji-picker-containers">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width={320}
              height={400}
              theme="light"
              searchDisabled={false}
              skinTonesDisabled={false}
              previewConfig={{
                showPreview: false
              }}
            />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.mkv,.avi,.mov,.wmv,.mp3,.wav,.ogg,.aac"
          onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
          style={{ display: 'none' }}
        />
      </form>
    </div>
  );
};

export default MessageInput;