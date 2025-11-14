import React, { useState } from 'react';

const TagFriends = ({ myFreinds, setTaggedUsers, taggedUsers }) => {
    const USERS = myFreinds || [];
    const [showPopup, setShowPopup] = useState(false);
    const [search, setSearch] = useState('');

    const toggleUser = (user) => {
        const isAlreadyTagged = taggedUsers.some((u) => u.user_data.id === user.user_data.id);
        setTaggedUsers((prev) =>
            isAlreadyTagged
                ? prev.filter((u) => u.user_data.id !== user.user_data.id)
                : [...prev, user]
        );
    };

    const filteredUsers = USERS.filter((user) =>
        user.user_data.first_name.toLowerCase().includes(search.toLowerCase()) ||
        user.user_data.last_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="tf-wrapper">
            <button className="tf-btn" type="button" onClick={() => setShowPopup(true)}>
                <i className="fa-solid fa-user-plus"></i> Tag Friends
            </button>

            {showPopup && (
                <div className="tf-popup-overlay" onClick={() => setShowPopup(false)}>
                    <div className="tf-popup" onClick={(e) => e.stopPropagation()}>
                        <h3 className="tf-title">Tag Friends</h3>
                        <input
                            className="tf-search"
                            type="text"
                            placeholder="Search friends..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <ul className="tf-user-list">
                            {filteredUsers.map((user) => {
                                const isTagged = taggedUsers.some((u) => u.user_data.id === user.user_data.id);
                                return (
                                    <li
                                        key={user.user_data.id}
                                        className={`tf-user-item ${isTagged ? 'tf-tagged' : ''}`}
                                        onClick={() => toggleUser(user)}
                                    >
                                        <div>
                                            <img src={(user.user_data.photo && "https://buzzinguniverse.com/backend/"+user.user_data.photo) || "/images/b.png"} alt="profile" className='me-2' />
                                            <span>{user.user_data.first_name} {user.user_data.last_name}</span>
                                        </div>
                                        {isTagged && <span className="tf-check">✓</span>}
                                    </li>
                                );
                            })}
                            {filteredUsers.length === 0 && (
                                <li className="tf-no-user">No friends found</li>
                            )}
                        </ul>
                        <button className="tf-done-btn" onClick={() => setShowPopup(false)}>
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagFriends;
