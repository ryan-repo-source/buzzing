import React, { useState } from 'react';
import axios from 'axios';
import { usePostContext } from '../context/PostContext';
import { useUserContext } from '../context/UserContext';

const SharePopup = ({ setSharePopup, auth, post }) => {
    const { getPosts } = usePostContext();
    const { Notify } = useUserContext();
    const [details, setDetails] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('Post shared successfully! 🎉');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!auth?.id) {
            setError("User not authenticated.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("user_id", auth.id);
        formData.append("type", 1);
        formData.append("post_id", post.post_data.id);
        formData.append("title", "Shared this post");
        if (details) formData.append("details", details);

        try {
            const response = await axios.post(
                "https://buzzinguniverse.com/backend/api/post-request",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.status === 200) {
                setDetails("");
                setSuccessMessage("Post shared successfully! 🎉");
                Notify(post.post_data.user_id, `${auth.fname} shared your post`, `/member/${auth.id}/profile/post/${post.post_data.id}`);
                // Hide success message after 3 seconds and close popup
                setTimeout(() => {
                    setSuccessMessage(null);
                    setSharePopup(false);
                }, 3000);
            } else {
                throw new Error(response.data.message || "Something went wrong.");
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="share-popup-overlay">
            <div className="share-popup-container">
                <button className="close-btn" onClick={() => setSharePopup(false)}>×</button>
                <h2 className="share-title">Share this post</h2>

                {error && <p className="error-message">{error}</p>}

                <textarea
                    className="share-textarea"
                    placeholder="Write something about this post..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                ></textarea>

                <button className="share-btn" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Sharing..." : "Share"}
                </button>

                {successMessage && (
                    <div className="success-popup">
                        <p>{successMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SharePopup;
