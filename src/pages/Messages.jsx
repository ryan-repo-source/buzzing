import React, { useEffect, useState } from 'react';
import ComposeMessage from '../helpers/ComposeMessage';
import ConversationList from '../helpers/ConversationList';
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';

const Messages = ({ sendMessage, setSendMessage }) => {
    const [conversations, setConversations] = useState([]);
    const [activeTab, setActiveTab] = useState(sendMessage ? 'compose' : 'inbox');
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));

    const GetConversation = async () => {
        const res = await axios.get(`https://buzzinguniverse.com/backend/api/conversation/list?user_id=${auth.id}`);
        setConversations(res.data.conversations || []);
    };

    const filterConversations = (type) => {
        if (!conversations || conversations.length === 0) return [];

        return conversations.filter((conv) => {
            const isSender = conv.user_one_id == auth.id;
            const isReceiver = conv.user_two_id == auth.id;
            const isStarred = conv.is_starred == 1;

            switch (type) {
                case 'inbox':
                    return isReceiver;
                case 'sent':
                    return isSender;
                case 'starred':
                    return isStarred;
                default:
                    return false;
            }
        });
    };

    useEffect(() => {
        GetConversation();
    }, []);

    return (
        <div className="personal_right_box">
            <ul className="nav nav-pills mb-0" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === 'inbox' ? 'active' : ''}`}
                        onClick={() => setActiveTab('inbox')}
                        type="button"
                    >
                        Inbox
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === 'starred' ? 'active' : ''}`}
                        onClick={() => setActiveTab('starred')}
                        type="button"
                    >
                        Starred
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === 'sent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sent')}
                        type="button"
                    >
                        Sent
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === 'compose' ? 'active' : ''}`}
                        onClick={() => setActiveTab('compose')}
                        type="button"
                    >
                        Compose
                    </button>
                </li>
            </ul>

            <div className="tab-content" id="pills-tabContent">
                {activeTab === 'inbox' && (
                    <div className="tab-pane fade show active">
                        <ConversationList conversations={filterConversations('inbox')} GetConversation={GetConversation} setConversations={setConversations} />
                    </div>
                )}
                {activeTab === 'starred' && (
                    <div className="tab-pane fade show active">
                        <ConversationList conversations={filterConversations('starred')} GetConversation={GetConversation} setConversations={setConversations} />
                    </div>
                )}
                {activeTab === 'sent' && (
                    <div className="tab-pane fade show active">
                        <ConversationList conversations={filterConversations('sent')} GetConversation={GetConversation} setConversations={setConversations} />
                    </div>
                )}
                {activeTab === 'compose' && (
                    <div className="tab-pane fade show active">
                        <ComposeMessage sendMessage={sendMessage} GetConversation={GetConversation} setActiveTab={setActiveTab} setSendMessage={setSendMessage} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
