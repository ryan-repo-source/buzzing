import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';

const AlbumOptionsDropdown = ({ AlbumId, fetchData, setAlbumData, setAlbumId, setEdit }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const handleOutsideClick = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setDropdownVisible(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                'https://buzzinguniverse.com/backend/api/delete-album-request',
                {
                    id: AlbumId,
                }
            );

            const result = response.data;
            if (result.code == 200) {
                setShowConfirm(false);
                fetchData();
                setAlbumData(null);
                setAlbumId(null);
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
                    <button className="fav-btn-dropdown-item" onClick={() => {
                        setEdit(true);
                        setDropdownVisible(false);
                    }}>Edit Album</button>
                    <button className="fav-btn-dropdown-item" onClick={() => {
                        setShowConfirm(true);
                        setDropdownVisible(false);
                    }}>Delete Album</button>
                    <button className="fav-btn-dropdown-item">View Details</button>
                </div>
            )}

            {showConfirm && (
                <div className="custom-confirm-popup">
                    <div className="popup-content">
                        <p>Are you sure you want to delete this album?</p>
                        <button onClick={handleDelete} disabled={loading}>
                            {loading ? "Deleting..." : "Yes, Delete"}
                        </button>
                        <button onClick={() => setShowConfirm(false)} style={{ backgroundColor: '#e15050', color: '#fff' }}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlbumOptionsDropdown;
