import React, { useEffect, useRef, useState } from 'react';

const UserTabs = ({ setTabb, usrAuth, requestCount, groupCount }) => {
    const [showMore, setShowMore] = useState(false);
    const [alertt, setAlertt] = useState(requestCount > 0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setAlertt(requestCount > 0);
    }, [requestCount]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        setShowMore((prev) => !prev);
    };

    return (
       <ul>
            <li><a onClick={() => setTabb('activity')}>Activity</a></li>
            <li><a onClick={() => setTabb('profile')}>Profile</a></li>
            <li className={alertt && 'alertt'}><a onClick={() => { setTabb('friends'); setAlertt(false); }}>Friends
                {
                    // usrAuth && <span className='bedge'> {requestCount || 0}</span>
                }
            </a></li>
            <li><a onClick={() => setTabb('groups')}>Groups
                {
                    // usrAuth && <span className='bedge'> {groupCount}</span>
                }
            </a></li>
            <li><a onClick={() => { setTabb('groups') }}>Companies</a></li>
            <li><a onClick={() => setTabb('adverts')}>Adverts</a></li>
            {usrAuth && (<li style={{ position: 'relative' }} ref={dropdownRef}>
                <a onClick={toggleMore}>More ▾</a>
                {showMore && (
                    <ul className='navDropList'>
                        <li><a onClick={(e) => { toggleMore(e); setTabb('media') }}>Media</a></li>
                        <li><a onClick={(e) => { toggleMore(e); setTabb('notifications') }}>Notifications</a></li>
                        <li><a onClick={(e) => { toggleMore(e); setTabb('forums') }}>Forums</a></li>
                        <li><a onClick={(e) => { toggleMore(e); setTabb('messages') }}>Messages</a></li>
                        <li><a onClick={(e) => { toggleMore(e); setTabb('activity-log') }}>Activity Logs</a></li>
                        <li><a onClick={(e) => { toggleMore(e); setTabb('settings') }}>Settings</a></li>
                    </ul>
                )}
            </li>)}
        </ul>
    );
};

export default UserTabs;
