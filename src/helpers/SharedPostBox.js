import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TimeAgo from './TimeAgo';
import LikeComment from './LikeComment';
import Comments from './Comments';
import secureLocalStorage from 'react-secure-storage';
import renderHTML from "./RenderHtml";
const formatDateTime = (date) =>
    new Date(date).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });

const SharedPostBox = ({ post, usrAuth }) => {
    const [loading, setLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const taggedUsers = post.shared.tagged_users;

    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));

    const chekStrg = (strg) => {
        if (strg == "https://buzzinguniverse.com/backend/") {
            return null;
        } else {
            return strg
        }
    }

    useEffect(() => {
        if (post) {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    }, [post]);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    if (loading) {
        return (
            <div className="skeleton">
                <div className="header">
                    <div className="profile-pic"></div>
                    <div>
                        <div className="text"></div>
                        <div className="timestamp"></div>
                    </div>
                </div>
                <div className="image"></div>
            </div>
        );
    }
    return (
        <div className="personal_des_box activity-all-memeber-boxs">
            <ul>
                <li data-user-online={auth?.id == post.post_data.user.id}>
                    <img
                        src={chekStrg(post.post_data.user.photo) ? `https://buzzinguniverse.com/backend/${post.post_data.user.photo}` : '/images/b.png'}
                        alt="img"
                    />
                </li>
                <li>
                    <Link to={`/member/${post.post_data.user.id}/profile`}>{post.post_data.user.first_name} {post.post_data.user.last_name}</Link>
                    <p>{post.post_data.title}</p>
                </li>
                <li><strong>{formatDateTime(post.post_data.created_at)}</strong></li>
            </ul>
            {post.post_data.details && <p>{renderHTML(post.post_data.details)}</p>}
            <div className="personal_des_box activity-all-memeber-boxs shared">
                <ul>
                    <li>
                        <img
                            src={chekStrg(post.shared.user.photo) ? `https://buzzinguniverse.com/backend/${post.shared.user.photo}` : '/images/b.png'}
                            alt="img"
                        />
                    </li>
                    <li>
                        <Link to={`/member/${post.shared.user.id}/profile`}>{post.shared.user.first_name} {post.shared.user.last_name}</Link>
                        {taggedUsers.length > 0 ? (
                            <div className="tf-tagged-users">
                                is with
                                {taggedUsers.slice(0, 2).map((u, index) => (
                                    <span key={u.id} className="tf-tag-badge ms-1">
                                        {u.first_name} {u.last_name}
                                        {index < Math.min(1, taggedUsers.length - 1) && ','}
                                    </span>
                                ))}
                                {taggedUsers.length > 2 && (
                                    <span className="tf-tag-badge ms-1 cursor-pointer" onClick={() => setShowPopup(true)}>
                                        and {taggedUsers.length - 2} others
                                    </span>
                                )}
                            </div>
                        ) : <p>{post.shared.title}</p>}
                    </li>
                    <li><strong>{formatDateTime(post.post_data.created_at)}</strong></li>
                </ul>
                {post.shared.type == 3 ?
                    <div className="search-groups-boxs">
                        <div className="search-groups-box-back" style={{ backgroundImage: `url(${chekStrg(post.shared.user.cover_photo) ? `https://buzzinguniverse.com/backend/${post.shared.user.cover_photo}` : ''})` }} />
                        <ul className="profile_upd">
                            <li>
                                <span><img src={chekStrg(post.shared.user.photo) ? `https://buzzinguniverse.com/backend/${post.shared.user.photo}` : '/images/b.png'} alt="img" /></span>
                            </li>
                            <li>
                                <h5><a href="#">{post.shared.user.first_name} {post.shared.user.last_name}</a>@{post.shared.user.first_name}{post.shared.user.last_name}</h5>
                            </li>
                        </ul>
                    </div>

                    : <>{post.shared.details && <p>{renderHTML(post.shared.details)}</p>}
                        {post.shared.file_type === 'jpeg' || post.shared.file_type === 'webp' || post.shared.file_type === 'jpg' || post.shared.file_type === 'png' || post.shared.file_type === 'gif' ? (
                            <div className="image-container">
                                {!imageLoaded && <div className="skeleton">
                                    <div className="image"></div>
                                </div>}
                                <img
                                    src={`https://buzzinguniverse.com/backend/${post.shared.file}`}
                                    alt="img"
                                    className="personal_des_box_image"
                                    onLoad={handleImageLoad}
                                    style={{ display: imageLoaded ? 'block' : 'none' }}
                                />
                            </div>
                        ) : null}
                        {post.shared.file_type === 'mp4' || post.shared.file_type === 'mov' || post.shared.file_type === 'webm' ? (
                            <div className="image-container">
                                {!imageLoaded && <div className="skeleton">
                                    <div className="image"></div>
                                </div>}
                                <video
                                    src={`https://buzzinguniverse.com/backend/${post.shared.file}`}
                                    className="personal_des_box_image"
                                    onLoadedData={handleImageLoad}
                                    style={{ display: imageLoaded ? 'block' : 'none' }}
                                    controls
                                ></video>
                            </div>
                        ) : null}
                        {post.shared.file_type === 'mp3' || post.shared.file_type === 'wav' || post.shared.file_type === 'ogg' ? (
                            <div className="image-container">
                                {!imageLoaded && <div className="skeleton">
                                    <div className="image"></div>
                                </div>}
                                <audio
                                    src={`https://buzzinguniverse.com/backend/${post.shared.file}`}
                                    className="personal_des_box_audio"
                                    onLoadedData={handleImageLoad}
                                    style={{ display: imageLoaded ? 'block' : 'none' }}
                                    controls
                                ></audio>
                            </div>
                        ) : null}</>
                }
            </div>
            {auth && <LikeComment post={post} />}
            <Comments post={post} auth={auth} />
            {showPopup && (
                <div className="tf-popup-overlay" onClick={() => setShowPopup(false)}>
                    <div className="tf-popup" onClick={(e) => e.stopPropagation()}>
                        <h3 className="tf-title">Tagged Friends</h3>
                        <ul className="tf-user-list">
                            {taggedUsers.map((user) => {
                                return (
                                    <li
                                        key={user.id}
                                        className={`tf-user-item`}
                                    >
                                        <div>
                                            <img src={(user.photo && "https://buzzinguniverse.com/backend/" + user.photo) || "/images/b.png"} alt="profile" className='me-2' />
                                            <span>{user.first_name} {user.last_name}</span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <button className="tf-done-btn bg-danger" onClick={() => setShowPopup(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SharedPostBox;
