import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const Navigation = ({ usrData, setTabb }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navigate = useNavigate();

    // Helper function to validate image source
    const checkImageSource = (src) => {
        return src !== "https://buzzinguniverse.com/backend/" ? src : null;
    };

    const ChaNgeTab = (val) => {
        setTabb(val); setIsOpen(false);
        navigate(`/member/${usrData.id}/profile`);
    }

    const Logout = (e) => {
        e.preventDefault();
        secureLocalStorage.removeItem('auth_data');
        window.location.href = "/"
    }

    return (
        <div className="navigation text-start">
            <button className="nav-btn" onClick={toggleDropdown}>
                <img
                    src={checkImageSource(usrData.photo) ? usrData.photo : "/images/b.png"}
                    alt="User"
                    className="user-img"
                />
                <h3 className="user-name">{usrData.fname}</h3>
            </button>

            {isOpen && (
                <div className="navigate-dropdown" ref={dropdownRef}>
                    <ul>
                        <li onClick={() => { ChaNgeTab('activity'); }}>Profile</li>
                        <li onClick={() => { ChaNgeTab('friends'); }}>Friends</li>
                        <li onClick={() => { ChaNgeTab('groups'); }}>Groups</li>
                        <li><Link to="#">Adverts</Link></li>
                        <li onClick={() => { ChaNgeTab('forums'); }}>Forums</li>
                        <li onClick={() => { ChaNgeTab('notifications'); }}>Notifications</li>
                        <li onClick={() => { ChaNgeTab('messages'); }}>Messages</li>
                        <li onClick={() => { ChaNgeTab('settings'); }}>Settings</li>
                        <li><Link to="#" onClick={Logout}>Log Out</Link></li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navigation;
