import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import TimeAgo from '../helpers/TimeAgo';
import LikeComment from '../helpers/LikeComment';
import Comments from '../helpers/Comments';

const SinglePost = ({ post, setSinlgePost, auth, GetPoost, onNext, onPrev }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const chekStrg = (strg) => {
        if (strg == "https://buzzinguniverse.com/backend/") {
            return null;
        } else {
            return strg
        }
    }

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    return (
        <div className='singlePost personal_des_box'>
            <div className='leftPart'>
                {(onPrev && onNext) && <div className='arrowChange'>
                    <span onClick={onPrev}><i className="fas fa-caret-left"></i></span>
                    <span onClick={onNext}><i className="fas fa-caret-right"></i></span>
                </div>}
                {post.post_data.file_type === 'webp' || post.post_data.file_type === 'jpeg' || post.post_data.file_type === 'jpg' || post.post_data.file_type === 'png' || post.post_data.file_type === 'gif' ? (
                    <div className="media-contain">
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
                    <div className="media-contain">
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
                    <div className="media-contain">
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
                ) : null}
            </div>
            <div className='rightPart'>
                <span onClick={() => setSinlgePost(null)}>x</span>
                <ul className="profile_sINGLE">
                    <li>
                        <span><img src={chekStrg(post.post_data.user.photo) ? `https://buzzinguniverse.com/backend/${post.post_data.user.photo}` : '/images/b.png'} alt="img" /></span>
                    </li>
                    <li>
                        <Link to={`/member/${post.post_data.user.id}/profile`}>{post.post_data.user.first_name}</Link><TimeAgo date={post.post_data.created_at} />
                    </li>
                </ul>
                <div className='sider-flec'>
                    {auth && <LikeComment post={post} GetPoost={GetPoost} defaultShow={true} />}
                    <div className='commentScroll'>
                        <Comments post={post} GetPoost={GetPoost} auth={auth} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SinglePost;
