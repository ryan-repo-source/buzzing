import React, { useState, useEffect, useRef } from 'react';
import { usePostContext } from '../context/PostContext';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const CommentBox = ({ post, setShowCommentBox, comment_id, GetPoost }) => {
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
    const { addCommentToPost } = usePostContext();
    const { myFreinds, Notify } = useUserContext();
    const [comment, setComment] = useState('');
    const [tagIds, setTagIds] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        const mentionIds = [...inputRef.current.querySelectorAll('.mention')].map((el) => parseInt(el.getAttribute('nav_id')));
        setTagIds(mentionIds);
    }, [comment]);

    const emojiPickerRef = useRef(null);
    const emojiButtonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target) &&
                !emojiButtonRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const insertEmoji = (emoji) => {
        const el = inputRef.current;
        el.focus();

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const emojiNode = document.createTextNode(emoji.native);
        range.deleteContents();
        range.insertNode(emojiNode);

        // Move the cursor after the inserted emoji
        range.setStartAfter(emojiNode);
        range.setEndAfter(emojiNode);
        selection.removeAllRanges();
        selection.addRange(range);

        setComment(el.innerHTML);
    };

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

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return alert('Comment cannot be empty');

        setLoading(true);
        try {
            const response = await axios.post('https://buzzinguniverse.com/backend/api/comment-request', {
                post_id: post.post_data.id,
                user_id: auth?.id,
                message: comment,
                comment_id: comment_id || null,
                tag_ids: tagIds.join(','),
            });
            if (response.status === 200) {
                setComment('');
                Notify(post.post_data.user_id, `${auth.fname} commented on your post`, `/member/${auth.id}/profile/post/${post.post_data.id}`);
                inputRef.current.innerHTML = '';
                setTagIds([]);
                addCommentToPost(post.post_data.id, response.data.data);
                GetPoost && GetPoost();
                setShowCommentBox(false);
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="activity-all-memeber-link-comment-boxs">
            <form onSubmit={handleCommentSubmit}>
                <ul className="comment-box-form">
                    <li><img src={auth ? auth?.photo : "/images/activity-all-memeber-6.png"} alt="img" /></li>
                    <li>
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
                    </li>
                </ul>
                <ul className="comment-box-btn">
                    <li>
                        <button type="submit" className="activity-post" disabled={loading}>
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </li>
                    <li>
                        <a href="javascript:;" className="activity-cancel" onClick={(e) => { e.preventDefault(); setShowCommentBox(false); }}>Cancel</a>
                    </li>
                    <li>
                        <button type="button" ref={emojiButtonRef} className="emoji-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
                        {showEmojiPicker && (
                            <div className="emoji-picker-container" ref={emojiPickerRef}>
                                <Picker data={data} onEmojiSelect={insertEmoji} />
                            </div>
                        )}
                    </li>
                </ul>
            </form>
        </div>
    );
};

export default CommentBox;
