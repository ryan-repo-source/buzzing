import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const Freinds = ({ userId, usrAuth, AlterRequest }) => {

    const { GetFreindsRequests, freinds, request } = useUserContext();
    useEffect(() => {
        GetFreindsRequests(userId, 1);
        GetFreindsRequests(userId, 2);
    }, [userId, usrAuth]);

    return (
        <div className="personal_right_box">
            <ul className="nav nav-pills pb-0" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Friendships</button>
                </li>
                {usrAuth &&
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Requests</button>
                    </li>}
            </ul>
            <div className="tab-content" id="pills-tabContent">
                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                    <div className='row'>
                        {freinds?.length ? freinds.map((mem) => {
                            return <div className="col-lg-4 col-md-4 col-12">
                                <div className="search-groups-boxs">
                                    <div className="search-groups-box-back" style={{ backgroundImage: `url(https://buzzinguniverse.com/backend/${mem.user_data.cover_photo}), radial-gradient(circle, rgb(153 153 153) 0%, rgba(0, 0, 0, 0.15) 58%, rgba(0, 0, 0, 0.3) 100%)` }} />
                                    <span><img src={mem.user_data.photo ? `https://buzzinguniverse.com/backend/${mem.user_data.photo}` : '/images/b.png'} alt="img" /></span>
                                    <h2><Link to={`/member/${mem.user_data.id}/profile`}>{mem.user_data.first_name} {mem.user_data.last_name}</Link></h2>
                                    <strong>Active 7 hours, 27 minutes ago</strong>
                                    <div className="friend_line">
                                        <ul>
                                            <li>
                                                <h4>{mem.friend_count}</h4>
                                                <strong>Friends</strong>
                                            </li>
                                            <li>
                                                <h4>0</h4>
                                                <strong>Groups</strong>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="search-groups-btn">
                                        <Link to={`/member/${mem.user_data.id}/profile`}>View Profile</Link>
                                    </div>
                                </div>
                            </div>
                        }) : <div className='notfound'>No Requests Found</div>}
                        <div className='notfound'>No Requests Found</div>
                    </div>
                </div>
                {usrAuth && <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                    <div className='row'>
                        {request?.length ? request.map((mem) => {
                            if (mem.data.user_id_two == userId) {
                                return <div className="col-lg-4 col-md-4 col-12">
                                    <div className="search-groups-boxs">
                                        <div className="search-groups-box-back" style={{ backgroundImage: `url(${mem.user_data.cover_photo}), radial-gradient(circle, rgb(153 153 153) 0%, rgba(0, 0, 0, 0.15) 58%, rgba(0, 0, 0, 0.3) 100%)` }} />
                                        <span><img src={mem.user_data.photo ? `https://buzzinguniverse.com/backend/${mem.user_data.photo}` : '/images/b.png'} alt="img" /></span>
                                        <h2><Link to={`/member/${mem.user_data.id}/profile`}>{mem.user_data.first_name} {mem.user_data.last_name}</Link></h2>
                                        <strong>Active 7 hours, 27 minutes ago</strong>
                                        <div className="friend_line">
                                            <ul>
                                                <li>
                                                    <h4>{mem.friend_count}</h4>
                                                    <strong>Friends</strong>
                                                </li>
                                                <li>
                                                    <h4>0</h4>
                                                    <strong>Groups</strong>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="search-groups-btn">
                                            <button onClick={(e) => { AlterRequest(e, 2, mem.data.id); GetFreindsRequests(userId, 1); GetFreindsRequests(userId, 2) }}>Accept</button>
                                            <button onClick={(e) => { AlterRequest(e, 3, mem.data.id); GetFreindsRequests(userId, 1); GetFreindsRequests(userId, 2) }}>Reject</button>
                                        </div>
                                    </div>
                                </div>
                            }
                        }) : <div className='notfound'>No Requests Found</div>}
                        <div className='notfound'>No Requests Found</div>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default Freinds
