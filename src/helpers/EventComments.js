import React, { useState, useEffect } from 'react';
import TimeAgo from './TimeAgo';
import renderHTML from './RenderHtml';
import AddCommentEvents from './AddCommentEvents';

const EventComments = ({ event, auth, getEvents }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (Array.isArray(event.comments)) {
            setComments(restructureComments(event.comments));
        }
    }, [event.comments]);

    function restructureComments(comments) {
        let commentMap = new Map();
        let topLevelComments = [];

        comments.forEach(comment => {
            comment.replies = [];
            commentMap.set(comment.id, comment);
        });

        comments.forEach(comment => {
            if (comment.comment_id !== null) {
                const parent = commentMap.get(comment.comment_id);
                if (parent) parent.replies.push(comment);
            } else {
                topLevelComments.push(comment);
            }
        });

        return topLevelComments;
    }

    const CommentItem = ({ comment, level = 1 }) => {
        const [showReplies, setShowReplies] = useState(false);
        const [showCommentBox, setShowCommentBox] = useState(false);

        return (
            <div className="event-comment">
                <div className="user-avatar">
                    <img
                        src={comment.user?.photo ? `https://buzzinguniverse.com/backend/${comment.user.photo}` : '/images/b.png'}
                        alt="User"
                    />
                </div>
                <div className="comment-body">
                    <div className="user-info">
                        <strong>{comment.user?.first_name} {comment.user?.last_name}</strong> says:
                        <div className="comment-time">
                            <TimeAgo date={comment.created_at} />
                        </div>
                    </div>
                    <div className="comment-message">{renderHTML(comment.message)}</div>
                    <div className="comment-actions">
                        {auth && level < 3 && (
                            <button onClick={() => setShowCommentBox(!showCommentBox)}>Reply</button>
                        )}
                        {comment.replies.length > 0 && (
                            <button onClick={() => setShowReplies(!showReplies)}>
                                {showReplies ? 'Hide Replies' : `View Replies (${comment.replies.length})`}
                            </button>
                        )}
                    </div>
                    {showCommentBox && (
                        <AddCommentEvents
                            event={event}
                            auth={auth}
                            getEvents={getEvents}
                            comment_id={comment.id}
                            setShowCommentBox={setShowCommentBox}
                        />
                    )}
                    {showReplies && (
                        <div className="replies">
                            {comment.replies.map(reply => (
                                <CommentItem key={reply.id} comment={reply} level={level + 1} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="event-comments-container">
            {comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
            ))}
        </div>
    );
};

export default EventComments;
