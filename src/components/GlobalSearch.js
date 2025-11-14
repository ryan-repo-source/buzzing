import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import secureLocalStorage from 'react-secure-storage';
import { useUserContext } from '../context/UserContext';
import useRealTimeChat from '../pages/chat/useRealTimeChat';

const GlobalSearch = () => {
    const [keyword, setKeyword] = useState('');
    const { setTabb, tabb } = useUserContext();
    const [results, setResults] = useState({ users: [], forums: [] });
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const [notfic, setNotific] = useState(0);
    const [unreadNoti, setUnreadNoty] = useState(0);

    useRealTimeChat(
        auth?.id,
        (data) => {
            setUnreadNoty(data.data.length || 0);
        }
    );


    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/get-notifications-request?user_id=${auth.id}`);
            const arr = res.data.data;
            const unread = arr.filter(n => n.is_read == 0);
            setNotific(unread);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const navigate = useNavigate();
    const ChaNgeTab = (val) => {
        setTabb(val);
        navigate(`/member/${auth.id}/profile`);
    }

    useEffect(() => {
        if (keyword.length >= 1) {
            setLoading(true);
            axios.get(`https://buzzinguniverse.com/backend/api/search?keyword=${keyword}`)
                .then(res => {
                    setResults(res.data.data);
                    setShowDropdown(true);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setResults({ users: [], forums: [] });
                });
        } else {
            setShowDropdown(false);
        }
    }, [keyword]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`inner-groups-search-box sticky ${(location.pathname.includes("/profile") || location.pathname.includes("/activity")) && 'fixedHeader'}`} ref={dropdownRef} style={{ zIndex: 9999 }}>
            <div className="container-fluid px-4">
                <div className="row justify-content-between">
                    <div className="col-md-4 col-12">
                        <div className='d-flex align-items-center gap-5'>
                            <Link to={auth ? "/activity" : '/'}> <img src="images/b.png" style={{ borderRadius: '50%' }} height={35} alt="img" /> </Link>
                            <div className="inner-groups-search-form" style={{ flex: 1 }}>
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="search..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                                {showDropdown && (
                                    <div className="search-dropdown">
                                        {results.users.length > 0 && (
                                            <div className="section">
                                                <div className="title">Members</div>
                                                {results.users.map((u, idx) => (
                                                    <Link to={`/member/${u.id}/profile`} onClick={() => setShowDropdown(false)} className="item" key={idx}>
                                                        <img src={u.photo ? "https://buzzinguniverse.com/backend/" + u.photo : '/images/b.png'} alt={u.first_name} />
                                                        <span>{u.first_name}</span>
                                                    </Link>
                                                ))}
                                                <div className="view-all">View all <i class="fa-regular fa-circle-right"></i></div>
                                            </div>
                                        )}
                                        {results.forums.length > 0 && (
                                            <div className="section">
                                                <div className="title">Forums</div>
                                                {results.forums.map((fr, idx) => (
                                                    <Link to={`/forums/${fr.id}/topics/`} onClick={() => setShowDropdown(false)} className="item" key={idx}>
                                                        <img src='/images/b.png' />
                                                        <span>{fr.title}</span>
                                                    </Link>
                                                ))}
                                                <div className="view-all">View all <i class="fa-regular fa-circle-right"></i></div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {
                                    loading && <div className="spinner-container">
                                        <div className="spinner"></div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-4 col-12">
                        {auth?.id && (location.pathname.includes("/profile") || location.pathname.includes("/activity")) ? <div className='d-flex align-items-center pe-5 me-5'>
                            <div className='newUsernavBar'>
                                <div
                                    onClick={() => navigate('/activity')}
                                    className={tabb === 'activity' ? 'active' : ''}
                                >
                                    <img src='/images/icon1.png' width={25} />
                                </div>
                                <div
                                    onClick={() => ChaNgeTab('friends')}
                                    className={tabb === 'friends' ? 'active' : ''}
                                >
                                    <img src='/images/icon2.png' width={25} />
                                </div>
                                <div
                                    onClick={() => {ChaNgeTab('messages'); setUnreadNoty(0)}}
                                    className={tabb === 'messages' ? 'active' : ''}
                                >
                                    <img src='/images/icon3.png' width={25} />
                                    {unreadNoti > 0 ? <span>{unreadNoti}</span> : false}
                                </div>
                                <div
                                    onClick={() => ChaNgeTab('notifications')}
                                    className={tabb === 'notifications' ? 'active' : ''}
                                >
                                    <img src='/images/icon4.png' width={25} />
                                    {notfic.length > 0 ? <span>{notfic.length}</span> : false}
                                </div>
                            </div>
                            <Navigation usrData={auth} setTabb={setTabb} />
                        </div> : false}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalSearch;
