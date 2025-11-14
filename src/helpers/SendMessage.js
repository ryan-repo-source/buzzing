import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import TimeAgo from './TimeAgo';

const SendMessage = ({ activeConversation, GetConversation, getUserAvatar, handleDeleteConversation, handleStarConversation }) => {
    const editorRef = useRef(null);
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
    const { Notify } = useUserContext();
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!editorRef.current || !editorRef.current.getContent().trim())
            newErrors.message = 'Message cannot be empty.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const chekStrg = (strg) => {
        if (strg == "https://buzzinguniverse.com/backend/") {
            return null;
        } else {
            return strg
        }
    }

    const handleSend = async () => {
        if (!validateForm()) return;

        const payload = {
            conversation_id: activeConversation.id,
            sender_id: auth.id,
            message: editorRef.current.getContent()
        };

        try {
            await axios.post('https://buzzinguniverse.com/backend/api/conversation-send-message', payload);
            const user = activeConversation.user_one_id == auth.id ? activeConversation.user_two : activeConversation.user_one;
            Notify(user.id, `${user.fname} send you a message`, `/member/${auth.id}/profile`);
            GetConversation();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <div className="conv-ui-message-header">
                <img src={getUserAvatar(activeConversation)} className="conv-ui-avatar" alt="User" />
                <img src={chekStrg(auth.photo) ? auth.photo : '/images/b.png'} className="conv-ui-avatar" alt="Device" />
                <div className="conv-ui-message-actions">
                    <button title="Delete" className="conv-ui-action-btn" onClick={() => handleDeleteConversation(activeConversation.id)}>
                        <i className="fa-solid fa-trash"></i>
                    </button>
                    <button title="Star" className="conv-ui-action-btn"
                        style={{ color: activeConversation.is_starred === 1 && '#f1a12e' }}
                        onClick={() => handleStarConversation(activeConversation.id, activeConversation.is_starred)}
                    >
                        <i className="fa-solid fa-star"></i>
                    </button>
                </div>
            </div>
            {activeConversation.messages?.map((msg) => {
                const isSenderOne = msg.sender_id == activeConversation.user_one.id;
                const sender = isSenderOne ? activeConversation.user_one : activeConversation.user_two;

                return (
                    <div className="chat-message" key={msg.id}>
                        <img
                            src={sender.photo ? `https://buzzinguniverse.com/backend/${sender.photo}` : '/images/b.png'}
                            className="avatar"
                            alt={sender.first_name}
                        />
                        <div className="message-content">
                            <div className="message-header">
                                {sender.first_name} <span className="timestamp">Sent <TimeAgo date={msg.created_at}/></span>
                            </div>
                            <div className={`message-text ${!isSenderOne && 'quote'}`} dangerouslySetInnerHTML={{ __html: msg.message }} />
                        </div>
                    </div>
                );
            })}

            <div className='register-main-form composeBox' style={{ width: '100%' }}>
                <div className='text--editor mb-3'>
                    <label className="form-label">Message</label>
                    <Editor
                        apiKey='jjoezv7zjhdqr8rlsyfxlcrfp36kxt1fx0aaeboyoucksasy'
                        onInit={(e, editor) => editorRef.current = editor}
                        initialValue=""
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: 'link image code',
                            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
                        }}
                        onEditorChange={() => setErrors(prev => ({ ...prev, message: null }))}
                    />
                    {errors.message && <div className="text-danger mt-1">{errors.message}</div>}
                </div>

                <button
                    onClick={handleSend}
                    style={{ padding: '8px 20px', color: '#fff', background: '#2d407f' }}
                >
                    Send
                </button>
            </div>
        </>

    );
}

export default SendMessage
