import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

const ComposeMessage = ({ sendMessage, setSendMessage, setActiveTab, GetConversation }) => {
    const editorRef = useRef(null);
    const { myFreinds, Notify } = useUserContext();

    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));


    const [search, setSearch] = useState(sendMessage ? `@${sendMessage?.fname} ${sendMessage?.lname}` : '');
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [toUser, setToUser] = useState(sendMessage || null);
    const [subject, setSubject] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!toUser) newErrors.toUser = 'Please select a recipient.';
        if (!subject.trim()) newErrors.subject = 'Subject is required.';
        if (!editorRef.current || !editorRef.current.getContent().trim())
            newErrors.message = 'Message cannot be empty.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        if (value.startsWith('@') && !toUser) {
            const query = value.slice(1).toLowerCase();
            const filtered = myFreinds.filter(f =>
                f.user_data.first_name.toLowerCase().includes(query) ||
                f.user_data.last_name.toLowerCase().includes(query)
            );
            setFilteredFriends(filtered);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleSelectUser = (user) => {
        setToUser(user.user_data);
        setSearch(`@${user.user_data.first_name}${user.user_data.last_name}`);
        setShowDropdown(false);
        setErrors(prev => ({ ...prev, toUser: null }));
    };

    const handleSend = async (e) => {
        if (!validateForm()) return;

        const payload = {
            from_id: auth.id,
            to_id: toUser.id,
            subject,
            message: editorRef.current.getContent()
        };

        try {
            await axios.post('https://buzzinguniverse.com/backend/api/conversation-start', payload);
            Notify(toUser.id, `${toUser.fname} send you a message`, `/member/${auth.id}/profile`);
            handleReset(e);
            setActiveTab('sent');
            GetConversation();
        } catch (err) {
            console.error(err);
        }
    };

    const handleReset = (e) => {
        e.preventDefault();
        setSearch('');
        setFilteredFriends([]);
        setToUser(null);
        setSubject('');
        setShowDropdown(false);
        setErrors({});
        if (editorRef.current) editorRef.current.setContent('');
    };

    return (
        <div className='register-main-form composeBox'>
            <div className="mb-3 position-relative">
                <label className="form-label">Send @Username</label>
                <input
                    className="form-control"
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    readOnly={!!toUser}
                    placeholder="@username"
                />
                <button onClick={() => {
                    setSendMessage(null);
                    setToUser(null);
                    setSearch('');
                }}>x</button>
                {errors.toUser && <div className="text-danger mt-1">{errors.toUser}</div>}
                {showDropdown && (
                    <ul className="dropdown-menu show" style={{ width: '100%', maxHeight: '200px', overflowY: 'auto' }}>
                        {filteredFriends.map(friend => (
                            <li key={friend.id}>
                                <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => handleSelectUser(friend)}
                                >
                                    {friend.user_data.first_name} {friend.user_data.last_name}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mb-3">
                <label className="form-label">Subject</label>
                <input
                    className="form-control"
                    type="text"
                    value={subject}
                    onChange={(e) => {
                        setSubject(e.target.value);
                        setErrors(prev => ({ ...prev, subject: null }));
                    }}
                />
                {errors.subject && <div className="text-danger mt-1">{errors.subject}</div>}
            </div>

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
            <a href="#" onClick={handleReset} style={{ color: '#2d407f' }} className='ms-4'>Reset</a>
        </div>
    );
};

export default ComposeMessage;
