import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TimeAgo from './TimeAgo';
import LikeComment from './LikeComment';
import Comments from './Comments';
import secureLocalStorage from 'react-secure-storage';
import renderHTML from './RenderHtml';
import { FaPlus } from 'react-icons/fa';
import SinglePost from '../components/SinglePost';
const formatDateTime = (date) =>
    new Date(date).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });

const GroupPost = ({ postsN, usrAuth }) => {
    const [loading, setLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [single_Post, setSinlgePost] = useState(null);
    const [posts, setPosts] = useState(postsN);
    const navigate = useNavigate();
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));

    const handleNextPost = () => {
        if (!single_Post) return;
        const currentIndex = posts.findIndex(p => p.post_data.id === single_Post.post_data.id);
        if (currentIndex < posts.length - 1) {
            setSinlgePost(posts[currentIndex + 1]);
        }
    };

    const handlePrevPost = () => {
        if (!single_Post) return;
        const currentIndex = posts.findIndex(p => p.post_data.id === single_Post.post_data.id);
        if (currentIndex > 0) {
            setSinlgePost(posts[currentIndex - 1]);
        }
    };

    const post = posts[0];

    const isValidUrl = (url) =>
        url !== "https://buzzinguniverse.com/backend/" && url;

    useEffect(() => {
        if (posts) {
            setTimeout(() => setLoading(false), 1000);
        }
    }, [posts]);

    useEffect(() => {
        document.querySelectorAll('[nav_id]').forEach((el) => {
            el.addEventListener('click', () => {
                navigate(`/member/${el.getAttribute('nav_id')}/profile`);
            });
        });
    }, []);

    const handleImageLoad = () => setImageLoaded(true);

    const GetPoost = async () => {
        const currentIndex = posts.findIndex(p => p.post_data.id === single_Post.post_data.id);
        setPosts(prevItems => {
            const newItems = [...prevItems];
            newItems[currentIndex] = single_Post;
            console.log(newItems)
            return newItems;
        });
    }

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
                <li>
                    <img
                        src={
                            isValidUrl(post.post_data.user.photo)
                                ? `https://buzzinguniverse.com/backend/${post.post_data.user.photo}`
                                : '/images/b.png'
                        }
                        alt="img"
                    />
                </li>
                <li>
                    <Link to={`/member/${post.post_data.user.id}/profile`}>
                        {post.post_data.user.first_name} {post.post_data.user.last_name}
                    </Link>
                    <p>{post.post_data.title}</p>
                </li>
                <li>
                    <strong>{formatDateTime(post.post_data.created_at)}</strong>
                </li>
            </ul>

            {post.post_data.details && <p>{renderHTML(post.post_data.details)}</p>}

            <div className={`collageWrap collageCount-${Math.min(posts.length, 6)}`}>
                <div className="collageGrid">
                    {posts.slice(0, 6).map((pst, idx) => {
                        const fileUrl = `https://buzzinguniverse.com/backend/${pst.post_data.file}`;
                        const isLastVisible = idx === 5 && posts.length > 6;

                        return (
                            <div
                                className="collageItem"
                                key={pst.id || idx}
                                onClick={() => setSinlgePost(pst)}
                                style={{ cursor: 'pointer', position: 'relative' }}
                            >
                                {!imageLoaded && <div className="skeleton-image"></div>}

                                {['jpg', 'png', 'gif', 'jpeg', 'webp'].includes(pst.post_data.file_type) && (
                                    <img
                                        src={fileUrl}
                                        alt="img"
                                        className="personal_des_box_image"
                                        onLoad={handleImageLoad}
                                        style={{ display: imageLoaded ? 'block' : 'none' }}
                                    />
                                )}

                                {['mp4', 'mov', 'webm'].includes(pst.post_data.file_type) && (
                                    <video
                                        src={fileUrl}
                                        className="personal_des_box_image"
                                        onLoadedData={handleImageLoad}
                                        style={{ display: imageLoaded ? 'block' : 'none' }}
                                    />
                                )}

                                {['mp3', 'wav', 'ogg'].includes(pst.post_data.file_type) && (
                                    <audio
                                        src={fileUrl}
                                        className="personal_des_box_audio"
                                        onLoadedData={handleImageLoad}
                                        style={{ display: imageLoaded ? 'block' : 'none' }}
                                        controls
                                    />
                                )}

                                {isLastVisible && (
                                    <div className="overlayMore">
                                        <FaPlus />{posts.length - 6}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {auth && <LikeComment post={post} />}
            <div className="commentScroll1">
                <Comments post={post} auth={auth} loadmore={true} />
            </div>

            {single_Post && (
                <SinglePost
                    setSinlgePost={setSinlgePost}
                    auth={auth}
                    post={single_Post}
                    onNext={handleNextPost}
                    onPrev={handlePrevPost}
                    GetPoost={GetPoost}
                />
            )}
        </div>
    );
};

export default GroupPost;
