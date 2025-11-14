import React, { useState, useEffect, useRef } from 'react';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

const AddCommentEvents = ({ event, comment_id, getEvents }) => {
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
    const { myFreinds } = useUserContext();
    const [comment, setComment] = useState('');
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    const inputRef = useRef(null);

    const handleInputChange = (e) => {
        const newHtml = e.target.innerHTML;
        const newText = e.target.textContent;
        setComment(newHtml);

        const lastWord = newText.split(/\s+/).pop();
        if (lastWord.startsWith('@')) {
            const searchQuery = lastWord.slice(1).toLowerCase();
            setFilteredFriends(
                myFreinds.filter(
                    (friend) =>
                        friend.user_data.first_name.toLowerCase().includes(searchQuery) ||
                        friend.user_data.last_name.toLowerCase().includes(searchQuery)
                )
            );
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleMentionClick = (friend) => {
        const textBeforeMention = comment.substring(0, comment.lastIndexOf('@'));
        const mentionHTML = `<span class="mention" nav_id="${friend.id}">@${friend.first_name} ${friend.last_name}</span>&nbsp;`;
        const updatedComment = `${textBeforeMention}${mentionHTML}`;
        inputRef.current.innerHTML = updatedComment;
        setComment(updatedComment);
        setShowDropdown(false);

        setTimeout(() => {
            const el = inputRef.current;
            el.focus();
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(el);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }, 0);
    };
    console.log(event)
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return alert('Comment cannot be empty');

        setLoading(true);
        try {
            const response = await axios.post('https://buzzinguniverse.com/backend/api/add-article-comment', {
                event_id: event.id,
                user_id: auth?.id,
                message: comment,
                comment_id: comment_id || null,
            });
            if (response.status === 200) {
                setComment('');
                getEvents();
                inputRef.current.innerHTML = '';
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='addComentevntsFomr'>
                <label>Comment *</label>
                <div
                    ref={inputRef}
                    className="open_div"
                    contentEditable
                    onInput={handleInputChange}
                    placeholder="Write a comment..."
                />
                {showDropdown && (
                    <ul className="friends-dropdown">
                        {filteredFriends.map((friend) => (
                            <li key={friend.id} onClick={() => handleMentionClick(friend.user_data)}>
                                {friend.user_data.first_name} {friend.user_data.last_name}
                            </li>
                        ))}
                    </ul>
                )}
                <button onClick={handleCommentSubmit} className='btncs' disabled={loading}>{loading ? 'Posting...' : 'Post Comment'}</button>
            </div>
        </>

    );
};

export default AddCommentEvents
