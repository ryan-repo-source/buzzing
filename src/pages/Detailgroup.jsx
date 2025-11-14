import React, { useEffect, useState } from 'react';
import { FaSearch, FaWifi } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import GlobalSearch from '../components/GlobalSearch';
import GroupForm from '../components/GroupForm';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { useUserContext } from '../context/UserContext';
import Home from './GroupPages/Home';
import Member from './GroupPages/Member';
import Media from './GroupPages/Media';
import Invites from '../components/Group/Invites';

function Detailgroup() {
    const { id } = useParams();
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
    const [group, setGroup] = useState(null);
    const { groupTab, setGroupTab } = useUserContext();
    const [showFullDescription, setShowFullDescription] = useState(false);

    const fetchGroup = async () => {
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/groups/get?group_id=${id}${auth?.id ? `&user_id=${auth?.id}` : ''}`);
            setGroup(res.data?.data || null);
            if(!res.data?.data){
                window.location.replace('/groups');
            }
        } catch (err) {
            console.error("Failed to fetch group:", err);
        }
    };

    const JoinGroup = async (e) => {
        e.preventDefault();
        e.target.classList.add('loadin');
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/groups/join?group_id=${id}&user_id=${auth.id}`);
            fetchGroup();
            e.target.classList.remove('loadin');
        } catch (err) {
            console.error("Failed to fetch group:", err);
        }
    };

    const LeaveGroup = async (e) => {
        e.preventDefault();
        e.target.classList.add('loadin');
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/groups/leave?group_id=${id}&user_id=${auth.id}`);
            fetchGroup();
            e.target.classList.remove('loadin');
        } catch (err) {
            console.error("Failed to fetch group:", err);
        }
    };

    useEffect(() => {
        fetchGroup();
    }, [id]);

    if (!group) return <div className="loading" />;

    const toggleDescription = () => {
        setShowFullDescription(prev => !prev);
    };

    const truncatedDescription = group?.description?.length > 90
        ? group.description.slice(0, 90) + '...'
        : group.description;


    return (
        <div>
            <GlobalSearch />

            <section className="public-group">
                <div className="container-fluid">
                    <div
                        className="admin-top"
                        style={{
                            backgroundImage: `url(https://buzzinguniverse.com/backend/${group.cover_photo}), radial-gradient(circle, rgb(153 153 153) 0%, rgba(0, 0, 0, 0.15) 58%, rgba(0, 0, 0, 0.3) 100%)`
                        }}
                    >
                        <div className="group-admin">
                            <span>Group Administrators</span>
                            <div>
                                {
                                    group.admins && group.admins.map((admin, key) => (
                                        key < 10 && <Link to={`/member/${admin.user.id}/profile`}><img
                                            src={admin.user.photo
                                                ? `https://buzzinguniverse.com/backend/${admin.user.photo}`
                                                : "/images/b.png"} alt={admin.user.first_name} /></Link>
                                    ))
                                }
                            </div>
                        </div>
                        {
                            auth && (group.user_id != auth?.id &&
                                (group.membership ? <button className='joinGroupBtn' onClick={LeaveGroup}>Leave Group</button> :
                                    <button className='joinGroupBtn' onClick={JoinGroup}>Join Group</button>))
                        }

                    </div>
                </div>

                <div className="group-detail chg">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-3">
                                <div className="grp-img">
                                    <img
                                        src={group.profile_picture
                                            ? `https://buzzinguniverse.com/backend/${group.profile_picture}`
                                            : "/images/mystery-group.png"}
                                        alt={group.name}
                                    />
                                    <h3>{group.name}</h3>
                                </div>
                            </div>
                            <div className="col-md-9">
                                <h4> {group.privacy} Group <span>Active 8 hours ago</span> </h4>
                                <ul className="group-nav">
                                    <li onClick={() => setGroupTab('home')}>Home</li>
                                    <li onClick={() => setGroupTab('members')}>Members</li>
                                    <li onClick={() => setGroupTab('media')}>Media</li>
                                    {
                                        group.membership?.role == 'admin' && <>
                                            <li onClick={() => setGroupTab('invites')}>Invite</li>
                                            <li onClick={() => setGroupTab('manage')}>Manage</li>
                                        </>
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="group-detail-sec">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 col-md-3">
                                <div className="group-detail-left">
                                    <div className="group-detail-about-group mb-4">
                                        <h2>About Group</h2>
                                        <p>
                                            {showFullDescription ? group.description : truncatedDescription}
                                            <br />
                                            {group.description?.length > 200 && (
                                                <button
                                                    className="btn p-0 ms-2"
                                                    onClick={toggleDescription}
                                                    style={{ fontSize: '0.9rem', fontWeight: '500' }}
                                                >
                                                    {showFullDescription ? 'Read Less' : 'Read More'}
                                                </button>
                                            )}
                                        </p>
                                    </div>

                                    <div className="group-detail-about-group">
                                        <h2>Newest Members</h2>
                                        <img src="/images/search-groups-boxs-doller.png" alt="Newest members" />
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-9 col-md-9">
                                <div className="group-detail-right mt-5">
                                    {groupTab == 'home' && <Home group={group} groupId={group.id} usrAuth={group.membership ? true : false} />}
                                    {groupTab == 'members' && <Member group={group} />}
                                    {groupTab == 'media' && <Media group={group} UserAuth={group.membership?.role == 'admin' ? true : false} groupId={group.id} />}
                                    {groupTab == 'invites' && <Invites group={group} />}
                                    {groupTab == 'manage' && <GroupForm group={group} fetchGroup={fetchGroup} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Detailgroup;
