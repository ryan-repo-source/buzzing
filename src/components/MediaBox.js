import React, { useState } from 'react';
import axios from 'axios';
import { usePostContext } from '../context/PostContext';
import secureLocalStorage from 'react-secure-storage';
import SinglePost from './SinglePost';

const MediaBox = ({ media, userId, fetchData }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [single_Post, setSinlgePost] = useState(null);
    const videoExt = ['mp4', 'mkv', 'avi', 'mov', 'wmv'];

    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));

    const { getSinlgePosts } = usePostContext();

    const GetImage = () => {
        const videoExtensions = ['mp4', 'mkv', 'avi', 'mov', 'wmv'];
        const audioExtensions = ['mp3', 'wav', 'ogg', 'aac'];

        let image = `https://buzzinguniverse.com/backend/${media.file}`;

        if (videoExtensions.includes(media.type)) {
            image = `https://buzzinguniverse.com/backend/${media.file}`;
        } else if (audioExtensions.includes(media.type)) {
            image = "/images/audio_thumb.png";
        }

        return image;
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                'https://buzzinguniverse.com/backend/api/delete-media-request',
                {
                    user_id: userId,
                    id: media.id,
                }
            );

            const result = response.data;
            if (result.code == 200) {
                setShowConfirm(false);
                fetchData();
            } else {
                alert(result.message || "Failed to delete media.");
            }
        } catch (error) {
            console.error("Error deleting media:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const GetPoost = async () => {
        const result = await getSinlgePosts(media.post_id);
        setSinlgePost(result);
    }

    return (
        <div className='mediaBox'>
            <div className='btnActionMedia'>
                {media.user_id == auth?.id && <button onClick={() => setShowConfirm(true)}><i className='fas fa-trash'></i>Delete</button>}
            </div>
            {
                videoExt.includes(media.type) ? <><i className='fas fa-play icoon' /><video src={GetImage()} onClick={GetPoost}></video></> : <img src={GetImage()} alt="Media Preview" onClick={GetPoost} />
            }

            {showConfirm && (
                <div className="custom-confirm-popup">
                    <div className="popup-content">
                        <p>Are you sure you want to delete this media?</p>
                        <button onClick={handleDelete} disabled={loading}>
                            {loading ? "Deleting..." : "Yes, Delete"}
                        </button>
                        <button onClick={() => setShowConfirm(false)} style={{ backgroundColor: '#e15050', color: '#fff' }}>Cancel</button>
                    </div>
                </div>
            )}
            {single_Post && <SinglePost setSinlgePost={setSinlgePost} GetPoost={GetPoost} auth={auth} post={single_Post} />}
        </div>
    );
};

export default MediaBox;
