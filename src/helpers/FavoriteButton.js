import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

const FavoriteButton = ({ post, auth, GetPoost }) => {
    const [favAnimating, setFavAnimating] = useState(false);
    const [favorited, setFavorited] = useState(post.is_fav);
    const [favId, setFavId] = useState(post.is_fav ? post.is_fav.id : null);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const dropdownRef = useRef(null);

    const handleFavorite = async () => {
        setFavAnimating(true);
        try {
            if (favorited) {
                if (!favId) return;
                const response = await axios.post('https://buzzinguniverse.com/backend/api/disfav-request', {
                    id: favId,
                    post_id: post.post_data.id,
                    user_id: auth.id
                });
                if (response.data.code === 200) {
                    setFavorited(false);
                    setFavId(null);
                }
            } else {
                const response = await axios.post('https://buzzinguniverse.com/backend/api/fav-request', {
                    post_id: post.post_data.id,
                    user_id: auth.id
                });
                if (response.data.code === 200) {
                    setFavorited(true);
                    setFavId(response.data.data.id);
                }
            }
        } catch (error) {
            console.error("Error favoriting/unfavoriting post:", error);
            alert(error.response?.data?.message || "Failed to process request");
        } finally {
            setTimeout(() => setFavAnimating(false), 500);
            GetPoost && GetPoost();
        }
    };

    const handleDelete = async (e) => {
        try {
            const container = e.target.closest('.personal_des_box');
            const confirmDelete = window.confirm("Are you sure you want to delete this post?");
            if (!confirmDelete) return;

            const response = await axios.post('https://buzzinguniverse.com/backend/api/delete/post', {
                post_id: post.post_data.id,
                user_id: auth.id
            });

            if (response.data.code === 200) {
                console.log(container)
                if (container) {
                    container.remove();
                }
                GetPoost && GetPoost();
            } else {
                alert(response.data.message || "Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert(error.response?.data?.message || "Failed to delete post");
        }
    };

    const handleOutsideClick = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div className="fav-btn-dropdown" ref={dropdownRef}>
            <button
                className="fav-btn-dropdown-toggle"
                onClick={() => setDropdownVisible(!dropdownVisible)}
            >
                <i className="fas fa-ellipsis-v"></i>
            </button>

            {dropdownVisible && (
                <div className="fav-btn-dropdown-menu">
                    <button onClick={() => { handleFavorite(); setDropdownVisible(false); }} className="fav-btn-dropdown-item">
                        {favorited ? 'Unmark as Favorite' : 'Mark as Favorite'}
                    </button>
                    {auth.id === post.post_data.user.id && (
                        <button onClick={(e) => { handleDelete(e); setDropdownVisible(false); }} className="fav-btn-dropdown-item">
                            Delete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default FavoriteButton;
