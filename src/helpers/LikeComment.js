import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import CommentBox from './CommentBox';
import SharePopup from './SharePopup';
import { usePostContext } from '../context/PostContext';
import FavoriteButton from './FavoriteButton'; // Import the new FavoriteButton component
import { useUserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

const LikeComment = ({ post, defaultShow, GetPoost }) => {

    const [showCommentBox, setShowCommentBox] = useState(false);
    const [showSharePopup, setSharePopup] = useState(false);
    const [showLikesPopup, setShowLikesPopup] = useState(false);
    const [likeAnimating, setLikeAnimating] = useState(false);
    const likesPopupRef = useRef(null);

    const { Notify } = useUserContext();

    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
    const [likes, setLikes] = useState(null);
    let userLike = null;
    const [liked, setLiked] = useState(null);
    const [likeId, setLikeId] = useState(null);

    useEffect(() => {
        console.log(post.likes);
        setLikes(post.likes.length);
        userLike = post.likes.find(like => like.user_id == auth.id);
        setLiked(!!userLike);
        setLikeId(userLike ? userLike.id : null);
    }, [post])

    // Handle click outside popup
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (likesPopupRef.current && !likesPopupRef.current.contains(event.target)) {
                setShowLikesPopup(false);
            }
        };

        if (showLikesPopup) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLikesPopup]);

    const handleShowLikes = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (likes > 0) {
            setShowLikesPopup(true);
        }
    };






    const handleLike = async () => {
        setLikeAnimating(true);
        try {
            if (liked) {
                if (!likeId) return;
                const response = await axios.post('https://buzzinguniverse.com/backend/api/dislike-request', {
                    id: likeId,
                    post_id: post.post_data.id,
                    user_id: auth.id
                });
                if (response.data.code === 200) {
                    Notify(post.post_data.user_id, `${auth.fname} unliked your post`, `/member/${auth.id}/profile/post/${post.post_data.id}`);
                    setLiked(false);
                    setLikes(likes - 1);
                    setLikeId(null);
                }
            } else {
                const response = await axios.post('https://buzzinguniverse.com/backend/api/like-request', {
                    post_id: post.post_data.id,
                    user_id: auth.id
                });
                if (response.data.code === 200) {
                    setLiked(true);
                    console.log(auth)
                    Notify(post.post_data.user_id, `${auth.fname} liked your post`, `/member/${auth.id}/profile/post/${post.post_data.id}`);
                    setLikes(likes + 1);
                    setLikeId(response.data.data.id);
                }
            }
        } catch (error) {
            console.error("Error liking/disliking post:", error);
            alert(error.response?.data?.message || "Failed to process request");
        } finally {
            setTimeout(() => setLikeAnimating(false), 500);
            GetPoost && GetPoost();
        }
    };

    return (
        <>
            <div className="activity-all-memeber-link-comment">
                <ul>
                    <li>
                        <a
                            href="javascript:;"
                            className={`${liked ? 'liked' : ''} ${likeAnimating ? 'like-animating' : ''}`}
                            onClick={(e) => { e.preventDefault(); handleLike(); }}
                        >
                            <i className="fas fa-thumbs-up" /> {liked ? 'Unlike' : 'Like'}
                            <span
                                className={`like-count ${likes > 0 ? 'clickable' : ''}`}
                                onClick={handleShowLikes}
                            >
                                ({likes})
                            </span>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:;" className="activity-comment" onClick={(e) => { e.preventDefault(); setShowCommentBox(!showCommentBox); }}>
                            Comment <span>{post.comments.length}</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); setSharePopup(!showSharePopup); }}>
                            Share <i className="fas fa-plus" />
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); }}>
                            {post.post_data.views} Views <i className="fas fa-eye" />
                        </a>
                    </li>
                </ul>
                <FavoriteButton post={post} auth={auth} GetPoost={GetPoost} />
            </div>

            {(showCommentBox || defaultShow) && (
                <CommentBox post={post} auth={auth} GetPoost={GetPoost} setShowCommentBox={setShowCommentBox} />
            )}
            {showSharePopup && <SharePopup setSharePopup={setSharePopup} post={post} auth={auth} />}

            {/* Likes Popup */}
            {showLikesPopup && (
                <div className="likes-popup-overlay">
                    <div className="likes-popup" ref={likesPopupRef}>
                        <div className="likes-popup-header">
                            <h3>People who liked this post</h3>
                            <button
                                className="likes-popup-close"
                                onClick={() => setShowLikesPopup(false)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="likes-popup-content">
                            {post.likes && post.likes.length > 0 ? (
                                <div className="likes-list">
                                    {post.likes.map((like) => (
                                        <Link key={like.id} to={`/member/${like.user.id}/profile`} className="like-item">
                                            <div className="like-user-avatar">
                                                <img
                                                    src={like.user.photo ? `https://buzzinguniverse.com/backend/${like.user.photo}` : '/default-avatar.png'}
                                                    alt={`${like.user.first_name} ${like.user.last_name}`}
                                                    onError={(e) => {
                                                        e.target.src = '/default-avatar.png';
                                                    }}
                                                />
                                            </div>
                                            <div className="like-user-info">
                                                <div className="like-user-name">
                                                    {like.user.first_name} {like.user.last_name}
                                                </div>
                                                <div className="like-user-username">
                                                    @{like.user.username}
                                                </div>
                                            </div>
                                            <div className="like-timestamp">
                                                {new Date(like.created_at).toLocaleDateString()}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-likes">
                                    <p>No likes yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .like-count.clickable {
                    cursor: pointer;
                    color: #79a5e2;
                    transition: color 0.2s ease;
                    margin-left: 4px;
                }

                .likes-popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.2s ease-out;
                }

                .likes-popup {
                    background: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                    width: 90%;
                    max-width: 480px;
                    max-height: 80vh;
                    overflow: hidden;
                    animation: slideUp 0.3s ease-out;
                    position: relative;
                }

                .likes-popup-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 24px;
                    border-bottom: 1px solid #e9ecef;
                    background: #f8f9fa;
                }

                .likes-popup-header h3 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #212529;
                }

                .likes-popup-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    color: #6c757d;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                }

                .likes-popup-close:hover {
                    background: #e9ecef;
                    color: #495057;
                }

                .likes-popup-content .likes-list {
                    max-height: calc(80vh - 80px);
                    overflow-y: auto;
                    padding: 0;
                }

                .likes-list {
                    padding: 0;
                }

                .like-item {
                    display: flex !important;
                    align-items: center !important;
                    padding: 16px 24px !important;
                    border-bottom: 1px solid #f1f3f4 !important;
                    transition: background-color 0.2s ease !important;
                }

                .like-item:hover {
                    background: #f8f9fa;
                }

                .like-item:last-child {
                    border-bottom: none;
                }

                .like-user-avatar {
                    margin-right: 16px;
                    flex-shrink: 0;
                }

                .like-user-avatar img {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid #e9ecef;
                }

                .like-user-info {
                    flex: 1;
                    min-width: 0;
                }

                .like-user-name {
                    font-weight: 600;
                    font-size: 15px;
                    color: #212529;
                    margin-bottom: 2px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .like-user-username {
                    font-size: 13px;
                    color: #6c757d;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .like-timestamp {
                    font-size: 12px;
                    color: #adb5bd;
                    margin-left: 12px;
                    flex-shrink: 0;
                }

                .no-likes {
                    padding: 40px 24px;
                    text-align: center;
                }

                .no-likes p {
                    margin: 0;
                    color: #6c757d;
                    font-size: 16px;
                }

                /* Custom scrollbar */
                .likes-popup-content::-webkit-scrollbar {
                    width: 6px;
                }

                .likes-popup-content::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }

                .likes-popup-content::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 3px;
                }

                .likes-popup-content::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }

                /* Animations */
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                /* Responsive design */
                @media (max-width: 768px) {
                    .likes-popup {
                        width: 95%;
                        max-height: 85vh;
                        margin: 0 10px;
                    }

                    .likes-popup-header {
                        padding: 16px 20px;
                    }

                    .likes-popup-header h3 {
                        font-size: 16px;
                    }

                    .like-item {
                        padding: 12px 20px;
                    }

                    .like-user-avatar img {
                        width: 40px;
                        height: 40px;
                    }

                    .like-user-avatar {
                        margin-right: 12px;
                    }

                    .like-user-name {
                        font-size: 14px;
                    }

                    .like-user-username {
                        font-size: 12px;
                    }

                    .like-timestamp {
                        font-size: 11px;
                        margin-left: 8px;
                    }
                }
            `}</style>
        </>
    );
};

export default LikeComment;
