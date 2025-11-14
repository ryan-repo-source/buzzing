import React, { useEffect, useState, useMemo } from 'react';
import TimeAgo from './TimeAgo';
import { Link, useNavigate } from 'react-router-dom';
import CommentBox from './CommentBox';
import renderHTML from './RenderHtml';
import axios from 'axios';

const Comments = ({ post, auth, loadmore = false, GetPoost }) => {
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        if (Array.isArray(post.comments)) {
            setComments(restructureComments(post.comments));
        }
    }, [post.comments]);

    const structuredComments = useMemo(() => comments, [comments]);

    useEffect(() => {
        document.querySelectorAll('[nav_id]').forEach((men) => {
            men.addEventListener('click', function () {
                navigate(`/member/${men.getAttribute('nav_id')}/profile`);
            });
        });
    }, [navigate]);

    const handleDelete = async (id, e) => {
        try {
            const container = e.target.closest('.personal_des_box');
            const confirmDelete = window.confirm("Are you sure you want to delete this post?");
            if (!confirmDelete) return;

            const response = await axios.post('https://buzzinguniverse.com/backend/api/delete-comment-request', {
                post_id: post.post_data.id,
                user_id: auth.id,
                id: id,
            });

            if (response.data.code === 200) {
                if (container) {
                    container.remove();
                }
                GetPoost && GetPoost();
            } else {
                alert(response.data.message || "Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert(error.response?.data?.message || "Failed to delete post");
        }
    };

    function restructureComments(comments) {
        let commentMap = new Map();
        let topLevelComments = [];

        comments.forEach(comment => {
            comment.replies = [];
            commentMap.set(comment.id, comment);
        });

        comments.forEach(comment => {
            if (comment.comment_id !== null) {
                let parentComment = commentMap.get(comment.comment_id);
                if (parentComment) {
                    parentComment.replies.push(comment);
                }
            } else {
                topLevelComments.push(comment);
            }
        });

        return topLevelComments;
    }

    const CommentItem = ({ comment }) => {
        const [showReplies, setShowReplies] = useState(false);
        const [showCommentBox, setShowCommentBox] = useState(false);

        return (
            <div key={comment.id} className="personal_des_box comment_area">
                <ul>
                    <li>
                        <img
                            src={comment.user.photo ? `https://buzzinguniverse.com/backend/${comment.user.photo}` : '/images/b.png'}
                            alt="img"
                        />
                    </li>
                    <li>
                        <Link to="">{comment.user.first_name} {comment.user.last_name}</Link>
                        <p>commented</p>
                    </li>
                    <li><strong><TimeAgo date={comment.created_at} /></strong></li>
                </ul>
                <p>{renderHTML(comment.message)}</p>
                <div className="comment-actions">
                    {auth && <button onClick={() => setShowCommentBox(!showCommentBox)} className="view-replies-btn">
                        Reply
                    </button>}
                    {comment.replies.length > 0 && (
                        <button onClick={() => setShowReplies(!showReplies)} className="view-replies-btn">
                            {showReplies ? 'Hide Replies' : `View Replies (${comment.replies.length})`}
                        </button>
                    )}
                    {auth.id == comment.user_id && <button onClick={(e) => handleDelete(comment.id, e)} className="view-replies-btn text-danger">
                        Delete
                    </button>}
                </div>
                {showCommentBox && auth ? (
                    <CommentBox post={post} auth={auth} GetPoost={GetPoost} comment_id={comment.id} setShowCommentBox={setShowCommentBox} />
                ) : false}
                {showReplies && (
                    <div className="replies">
                        {comment.replies.map(reply => <CommentItem key={reply.id} comment={reply} />)}
                    </div>
                )}
            </div>
        );
    };

    const visibleComments = loadmore ? structuredComments.slice(0, visibleCount) : structuredComments;

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 5);
    };

    return (
        <>
            {visibleComments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
            ))}
            {loadmore && visibleCount < structuredComments.length && (
                <div className="mt-4">
                    <button className="load-more-btn" onClick={handleLoadMore}>
                        Load More
                    </button>
                </div>
            )}
        </>
    );
};

export default Comments;
