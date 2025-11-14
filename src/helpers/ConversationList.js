import React, { useState } from 'react';
import secureLocalStorage from 'react-secure-storage';
import TimeAgo from './TimeAgo';
import { FaInfo } from 'react-icons/fa';
import axios from 'axios';
import SendMessage from './SendMessage';


const ConversationSkeleton = ({number}) => {
    return (
      <div className="conv-ui-message-list">
        {[...Array(number)].map((_, index) => (
          <div key={index} className="conv-ui-message-item skeletons">
            <div className="conv-skel-left">
              <div className="conv-skel-avatar"></div>
              <div className="conv-skel-name"></div>
            </div>
            <div className="conv-skel-subject"></div>
            <div className="conv-skel-date"></div>
          </div>
        ))}
      </div>
    );
  };

const ConversationList = ({ conversations, setConversations, GetConversation }) => {
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
    const [activeConversation, setActiveConversation] = useState(conversations[0] || null);
    const [visibleCount, setVisibleCount] = useState(5);
    const [reply, setReply] = useState(null);

    const getUserName = (conversation, currentUserId = auth.id) => {
        const user = conversation.user_one_id == currentUserId ? conversation.user_two : conversation.user_one;
        return user?.first_name || 'Unknown';
    };

    const chekStrg = (strg) => {
        if (strg == "https://buzzinguniverse.com/backend/") {
            return null;
        } else {
            return strg
        }
    }

    const getUserAvatar = (conversation, currentUserId = auth.id) => {
        const user = conversation.user_one_id == currentUserId ? conversation.user_two : conversation.user_one;
        return user.photo ? 'https://buzzinguniverse.com/backend/' + user?.photo : "images/activity-all-memeber-6.png";
    };

    const handleConversationClick = (conversation) => {
        setActiveConversation(conversation);
    };

    const handleShowMore = () => {
        setVisibleCount(prevCount => prevCount + 10);
    };

    const handleDeleteConversation = async (conversationId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this conversation?");
        if (!isConfirmed) return;

        try {
            const response = await axios.get('https://buzzinguniverse.com/backend/api/conversation/delete', {
                params: {
                    conversation_id: conversationId,
                    user_id: auth.id,
                }
            });
            setConversations(prevConversations => prevConversations.filter(conv => conv.id !== conversationId));
            GetConversation();
            setActiveConversation(null);
        } catch (error) {
            console.error('Error deleting conversation:', error);
        }
    };

    const handleStarConversation = async (conversationId, isStarred) => {
        try {
            const response = await axios.get('https://buzzinguniverse.com/backend/api/conversation/star', {
                params: {
                    conversation_id: conversationId,
                    user_id: auth.id,
                    is_starred: isStarred ? 0 : 1,
                }
            });
            setActiveConversation(prevConv => ({
                ...prevConv,
                is_starred: isStarred ? 0 : 1,
            }));
            GetConversation();
        } catch (error) {
            console.error('Error starring conversation:', error);
        }
    };

    if (!conversations) return <ConversationSkeleton number={4}/>;
    if (conversations.length < 1) {
        return <div className="sorry-activity-found activity-all-memeber" style={{ width: "55%" }}>
            <ul>
                <li><FaInfo /></li>
                <li>
                    <p>Sorry, no messages were found.</p>
                </li>
            </ul>
        </div>
    }
    return (
        <div style={{ width: '60%' }}>
            {
                reply ? <SendMessage activeConversation={activeConversation} GetConversation={GetConversation} handleDeleteConversation={handleDeleteConversation} handleStarConversation={handleStarConversation} getUserAvatar={getUserAvatar} /> : <>
                    <div className="conv-ui-message-list">
                        {conversations.slice(0, visibleCount).map((conv) => {
                            const latestMessage = conv.messages?.[conv.messages.length - 1];
                            const unreadCount = conv.messages?.filter(m => m.is_read === 0).length || 0;

                            return (
                                <div key={conv.id} className="conv-ui-message-item" onClick={() => handleConversationClick(conv)}>
                                    <div>
                                        <input type="checkbox" className="conv-ui-checkbox" />
                                        <img src={getUserAvatar(conv)} className="conv-ui-avatar" alt="User" />
                                        <span className="conv-ui-username">{getUserName(conv)}</span>
                                    </div>
                                    <div>
                                        {unreadCount > 0 && <span className="conv-ui-msg-count">({unreadCount})</span>}
                                        <a className="conv-ui-msg-link">{conv.subject}</a>
                                    </div>
                                    <span className="conv-ui-msg-date"><TimeAgo date={conv.created_at} /></span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Show More Button */}
                    {visibleCount < conversations.length && (
                        <button className="conv-ui-show-more-btn" onClick={handleShowMore}>
                            Show More
                        </button>
                    )}

                    {activeConversation && (
                        <div className="conv-ui-active-conversation">
                            <h3 className="conv-ui-heading">
                                Active conversation: <span className="conv-ui-subject">{activeConversation.subject}</span>
                            </h3>
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
                                    <button title="Reply" className="conv-ui-action-btn" onClick={() => { setReply(activeConversation) }}><i className="fa-solid fa-pen-to-square"></i></button>
                                </div>
                            </div>
                            <div className="conv-ui-message-text" dangerouslySetInnerHTML={{ __html: activeConversation?.messages[0]?.message }} />
                        </div>
                    )}
                </>
            }
        </div>
    );
};

export default ConversationList;
