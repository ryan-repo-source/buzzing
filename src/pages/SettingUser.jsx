import React, { useEffect, useRef, useState } from 'react';
import General from '../components/Setting/General'
import EmailSetting from '../components/Setting/EmailSetting'
import ProfileVisibility from '../components/Setting/ProfileVisibility'
import DefaultPrivacy from '../components/Setting/DefaultPrivacy'
import GroupInvites from '../components/Setting/GroupInvites'
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

const SettingUser = ({ userId, defaultPrivacy }) => {

    const Logout = () => {
        secureLocalStorage.removeItem('auth_data');
        window.location.href = "/"
    }

    const [showMore, setShowMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingX, setLoadingX] = useState(false);
    const [messageX, setMessageX] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const handleDelete = async () => {
        setLoading(true);
        try {

            const response = await axios.post("https://buzzinguniverse.com/backend/api/delete/profile",
                { id: userId },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response) {
                Logout();
            }

        } catch (error) {
            console.log(error)
            alert('Error deleting account');
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    const exportUserData = async (e) => {
        setLoadingX(true);
        try {
            const response = await axios.post("https://buzzinguniverse.com/backend/api/export/data",
                { id: userId },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            toggleMore(e)
            setMessageX('Your resquest for exporting your profile data is submitted.');
            setTimeout(function(){
                setMessageX('');
            },5000)
        } catch (error) {
            alert('Error exporting account');
        } finally {
            setLoadingX(false);
        }
    };

    const dropdownRef = useRef(null);

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setShowMore(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMore = (e) => {
        e.preventDefault();
        setShowMore(prev => !prev)
    }

    return (
        <div className="personal_right_box">
            <ul className="nav nav-pills mb-0" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">General</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Email</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Profile Visibility</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-friends-tab" data-bs-toggle="pill" data-bs-target="#pills-friends" type="button" role="tab" aria-controls="pills-friends" aria-selected="false">Group Invites</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-Groups-tab" data-bs-toggle="pill" data-bs-target="#pills-Groups" type="button" role="tab" aria-controls="pills-Groups" aria-selected="false">Privacy</button>
                </li>

                <li className='right-item' style={{ position: 'relative' }} ref={dropdownRef}>
                    <a onClick={toggleMore}>•••</a>
                    {showMore && (
                        <ul className='navDropList'>
                            <li><a className={loadingX && 'loadin'} onClick={(e) => { exportUserData(e); }}>Export Data</a></li>
                            <li><a onClick={() => setShowConfirm(true)}>Delete Account</a></li>
                        </ul>
                    )}
                </li>

            </ul>

            {/* 🔒 Confirmation Modal */}
            {showConfirm && (
                <div className="custom-confirm-popup">
                    <div className="popup-content">
                        <p>Are you sure you want to delete this account?</p>
                        <button onClick={handleDelete} disabled={loading}>
                            {loading ? "Deleting..." : "Yes, Delete"}
                        </button>
                        <button onClick={() => setShowConfirm(false)} style={{ backgroundColor: '#e15050', color: '#fff' }}>Cancel</button>
                    </div>
                </div>
            )}
            {messageX && <p className='message success-message mx-0'>{messageX}</p>}
            <div className="tab-content" id="pills-tabContent">
                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                    <General />
                </div>
                <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                    <EmailSetting />
                </div>
                <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-friends-tab">
                    <ProfileVisibility />
                </div>
                <div className="tab-pane fade" id="pills-friends" role="tabpanel" aria-labelledby="pills-friends-tab">
                    <GroupInvites />
                </div>
                <div className="tab-pane fade" id="pills-Groups" role="tabpanel" aria-labelledby="pills-Groups-tab">
                    <DefaultPrivacy defaultPrivacy={defaultPrivacy} />
                </div>
                <div className="tab-pane fade" id="pills-Groups" role="tabpanel" aria-labelledby="pills-Groups-tab">
                    <DefaultPrivacy defaultPrivacy={defaultPrivacy} />
                </div>
            </div>
        </div>
    )
}

export default SettingUser
