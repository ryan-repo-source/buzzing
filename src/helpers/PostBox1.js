import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const PostBox1 = ({ post, usrAuth, setSinlgePost }) => {
    const [loading, setLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const taggedUsers = post.tagged_users || [];

    const navigate = useNavigate();

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

    useEffect(() => {
        document.querySelectorAll('[nav_id]').forEach((men) => {
            men.addEventListener('click', function () {
                navigate(`/member/${men.getAttribute('nav_id')}/profile`);
            })
        })
    })

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

    const group = post.group_data || null;

    return (
        <div className="personal_des_box activity-all-memeber-boxs">
            <ul className='personal_des_list'>
                <li data-user-online={auth?.id == post.post_data.user.id}>
                    <Link to={`/member/${post.post_data.user.id}/profile`}>
                        <img
                            src={chekStrg(post.post_data.user?.photo) ? `https://buzzinguniverse.com/backend/${post.post_data.user.photo}` : '/images/b.png'}
                            alt="img"
                        />
                    </Link>
                </li>
                <li>
                    <Link to={`/member/${post.post_data.user.id}/profile`}>{post.post_data.user.first_name} {post.post_data.user.last_name}</Link>
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
                    ) : <p>{post.post_data.title}</p>}

                </li>
                {group && <li>
                    <Link className='groupNbgh'>
                        in
                        <img
                            src={chekStrg(group.profile_picture) ? `https://buzzinguniverse.com/backend/${group.profile_picture}` : '/images/b.png'}
                            alt="img"
                        />
                        {group.name}
                    </Link>
                </li>}
                <li><strong>{formatDateTime(post.post_data.created_at)}</strong></li>
            </ul>
            {post.post_data.type == 3 ? (() => {
                const usrt = JSON.parse(post.post_data.profile_data);
                return usrt && <div className="search-groups-boxs">
                    <div className="search-groups-box-back" style={{ backgroundImage: `url(${chekStrg(usrt.cover_photo) ? `https://buzzinguniverse.com/backend/${usrt.cover_photo}` : ''})` }} />
                    <ul className="profile_upd">
                        <li>
                            <span><img src={chekStrg(usrt.photo) ? `https://buzzinguniverse.com/backend/${usrt.photo}` : '/images/b.png'} alt="img" /></span>
                        </li>
                        <li>
                            <h5><Link to={`/member/${usrt.id}/profile`}>{usrt.first_name} {usrt.last_name}</Link>@{usrt.first_name}{usrt.last_name}</h5>
                        </li>
                    </ul>
                </div>
            })()
                : <>{post.post_data.details != 'null' && <p>{renderHTML(post.post_data.details)}</p>}
                    <div onClick={() => setSinlgePost(post)} style={{ cursor: 'pointer' }}>
                        {post.post_data.file_type === 'jpg' || post.post_data.file_type === 'png' || post.post_data.file_type === 'gif' ? (
                            <div className="image-container">
                                {!imageLoaded && <div className="skeleton">
                                    <div className="image"></div>
                                </div>}
                                <img
                                    src={`https://buzzinguniverse.com/backend/${post.post_data.file}`}
                                    alt="img"
                                    className="personal_des_box_image"
                                    onLoad={handleImageLoad}
                                    style={{ display: imageLoaded ? 'block' : 'none' }}
                                />
                            </div>
                        ) : null}
                        {post.post_data.file_type === 'mp4' || post.post_data.file_type === 'mov' || post.post_data.file_type === 'webm' ? (
                            <div className="image-container">
                                {!imageLoaded && <div className="skeleton">
                                    <div className="image"></div>
                                </div>}
                                <video
                                    src={`https://buzzinguniverse.com/backend/${post.post_data.file}`}
                                    className="personal_des_box_image"
                                    onLoadedData={handleImageLoad}
                                    style={{ display: imageLoaded ? 'block' : 'none' }}
                                    controls
                                ></video>
                            </div>
                        ) : null}
                        {post.post_data.file_type === 'mp3' || post.post_data.file_type === 'wav' || post.post_data.file_type === 'ogg' ? (
                            <div className="image-container">
                                {!imageLoaded && <div className="skeleton">
                                    <div className="image"></div>
                                </div>}
                                <audio
                                    src={`https://buzzinguniverse.com/backend/${post.post_data.file}`}
                                    className="personal_des_box_audio"
                                    onLoadedData={handleImageLoad}
                                    style={{ display: imageLoaded ? 'block' : 'none' }}
                                    controls
                                ></audio>
                            </div>
                        ) : null}</div></>
            }
            {auth && <LikeComment post={post} />}
            <div className='commentScroll1'>
                <Comments post={post} auth={auth} loadmore={true} />
            </div>
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

export default PostBox1;
