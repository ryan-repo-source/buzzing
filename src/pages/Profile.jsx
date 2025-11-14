import axios from 'axios';
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Image_upload from '../components/Image_upload';
import Cover_photo from '../components/Cover_photo';
import UserTabs from '../components/UserTabs';
import Freinds from './Freinds';
import Memberdetail from './Memberdetail';
import secureLocalStorage from "react-secure-storage";
import { useUserContext } from '../context/UserContext';
import { usePostContext } from '../context/PostContext';
import ForumUser from './ForumUser';
import { useForumContext } from '../context/ForumContext';
import MediaUser from './MediaUser';
import MyPhotos from '../components/MyPhotos';
import SettingUser from './SettingUser';
import Notification from './Notification';
import Messages from './Messages';
import GlobalSearch from '../components/GlobalSearch';
import UserGroups from './UserGroups';
import ManageAdverts from './Adverts/ManageAdverts';
import AdvertProfile from './AdvertProfile';
import UserActivityLog from './UserActivityLog';
import TimeAgo2 from '../helpers/TimeAgo2';
import ChatApp from './chat/ChatApp';

function Profile() {
    const { userId } = useParams();
    const { postId } = useParams();
    const { auth_data, Notify, GetFreindsRequests, request } = useUserContext();
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [usrData, setUsrData] = useState({});
    const [usrAuth, setAuth] = useState(false);
    const [sender, setSender] = useState(false);
    const [links, setLinks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [chatID, setChatID] = useState(null);

    const handleLinkChange = (index, event) => {
        const newLinks = [...links];
        newLinks[index] = event.target.value;
        setLinks(newLinks);
    };

    const addLinkField = () => {
        setLinks([...links, ""]);
    };

    // Remove input field by index
    const removeLinkField = (index) => {
        const newLinks = links.filter((_, i) => i !== index);
        setLinks(newLinks);
    };

    const { getPosts } = usePostContext();
    const { getUserTopics } = useForumContext();
    const { tabb, setTabb } = useUserContext();

    const storedUser = auth_data || null;


    const [user, setUser] = useState({});
    const setVal = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: name === "links" ? value.split(",").map((link) => link.trim()) : value,
        }));
    };

    const setGender = (e) => {
        setUser((prev) => ({
            ...prev,
            gender: e.target.value,
        }));
    };
    const updateUser = async (e) => {
        e.preventDefault();
        e.target.classList.add("loadin");
        try {
            const response = await axios.post("https://buzzinguniverse.com/backend/api/update-user",
                { ...user, id: userId, links: links || user.links },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                const updatedUser = response.data.data;
                secureLocalStorage.setItem("auth_data", JSON.stringify(updatedUser));
                getUsr();
                setMessage("User updated successfully!");
                setMessageType("success");
                getPosts(userId, 1);
            } else {
                setMessage("Something went wrong. Please try again.");
                setMessageType("error");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            setMessage("Failed to update user. Please check your connection or try again later.");
            setMessageType("error");
        } finally {
            e.target.classList.remove("loadin");
        }
    };

    const SendRequest = async (e) => {
        e.preventDefault();
        e.target.classList.add("loadin");
        try {
            const response = await axios.post("https://buzzinguniverse.com/backend/api/send-request",
                { sender_id: storedUser?.id, receiver_id: userId },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            Notify(userId, `${storedUser.fname} send you a freind request`, `/member/${storedUser.id}/profile`);
            retriveRequest();
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {
            e.target.classList.remove("loadin");
        }
    };

    const [reqCheck, setReqCheck] = useState(null);
    const retriveRequest = async () => {
        try {
            const response = await axios.post("https://buzzinguniverse.com/backend/api/retrive-request",
                { user_one: storedUser?.id, user_two: userId },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.status === 200) {
                setReqCheck(response.data.data);
                console.log(response.data.data)
                if (response.data.data.user_id_two == storedUser?.id && response.data.data.user_id_one == userId) {
                    setSender(true);
                } else {
                    setSender(false);
                }
            } else {

            }
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {

        }
    };


    const AlterRequest = async (e, type, id = reqCheck?.id) => {
        e.preventDefault();
        e.target.classList.add("loadin");
        try {
            const response = await axios.post("https://buzzinguniverse.com/backend/api/change-request",
                { id: id, type: type },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (type == 1) {
                Notify(userId, `${storedUser.fname} send you a freind request`, `/member/${storedUser.id}/profile`);
            }
            retriveRequest();
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {
            e.target.classList.remove("loadin");
        }
    };
    const navigate = useNavigate();
    const ChaNgeTab = (val) => {
        navigate(`/member/${storedUser.id}/profile`);
        setTabb(val);
    }


    const getUsr = async () => {
        if (!userId) return;

        try {
            const response = await axios.get(
                `https://buzzinguniverse.com/backend/api/get-user-data/${userId}`
            );
            setUsrData(response.data.data?.data || {});
            setUser(response.data.data?.data || {});
            setLinks(response.data.data.data?.links || [])
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const chekStrg = (strg) => {
        if (strg == "https://buzzinguniverse.com/backend/") {
            return null;
        } else {
            return strg
        }
    }

    useEffect(() => {
        document.getElementById('pills-tabContent').scrollIntoView({ behavior: 'smooth' });
        // getPosts(userId, 1);
    }, [tabb])

    useEffect(() => {
        if (userId == JSON.parse(secureLocalStorage.getItem('auth_data'))?.id) {
            setAuth(true);
            setTabb(tabb || 'profile');
        } else {
            setAuth(false);
            setTabb('profile');
        }
        getUsr();
        if (storedUser) {
            retriveRequest();
        }
        getUserTopics(userId);
        GetFreindsRequests(userId, 1);
        fetchGroup(1);
    }, [userId]);
    const [visibility, setVisibility] = useState({});
    useEffect(() => {
        axios
            .post('https://buzzinguniverse.com/backend/api/get-profile-visibility-request', { user_id: userId })
            .then((res) => {
                setVisibility(res.data.visibility || {});
            })
    }, [userId]);

    const [groupCount, setGroupCount] = useState(0);

    const fetchGroup = async (page, e) => {
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/groups/getByUser?user_id=${userId}&page=${page}`);
            setGroupCount(res.data?.data.total || 0);
        } catch (err) {
            console.error("Failed to fetch group:", err);
        } finally {
        }
    };


    return (
        <div>
            {showModal && (
                <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="modal-image" onClick={(e) => e.stopPropagation()}>
                        <img src={chekStrg(usrData.photo) ? usrData.photo : '/images/b.png'} alt="Enlarged" />
                        <span className="close-btn" onClick={() => setShowModal(false)}>&times;</span>
                    </div>
                </div>
            )}
            <GlobalSearch />
            <section className="public-group">
                <div className="container-fluid">
                    <div className="admin-top" style={{ backgroundImage: `url(${usrData.cover_photo}), radial-gradient(circle, rgb(153 153 153) 0%, rgba(0, 0, 0, 0.15) 58%, rgba(0, 0, 0, 0.3) 100%)` }}>
                        {auth_data.id == userId && <span onClick={(e) => {
                            setTabb('profile');
                            setTimeout(function () {
                                document.querySelector('#pills-friends-tab').click();
                            }, 1);
                        }}><i class="fas fa-images"></i></span>}
                        <div style={{
                            position: 'absolute',
                            height: '100%',
                            width: '50%',
                            top: 0,
                            right: 0,
                            zIndex: 1,
                            cursor: 'pointer',
                        }} onClick={() => {
                            window.location.replace('/questions')
                        }} ></div>
                    </div>
                </div>
                <div className="group-detail group-detail1">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="grp-img" data-online="true">
                                    {auth_data.id == userId && <span onClick={(e) => {
                                        setTabb('profile');
                                        setTimeout(function () {
                                            document.querySelector('#pills-contact-tab').click();
                                        }, 1);
                                    }}><i class="fas fa-images"></i></span>}
                                    <img src={chekStrg(usrData.photo) ? usrData.photo : '/images/b.png'} onClick={() => setShowModal(true)} alt="img" />
                                    <h3>{usrData.fname} {usrData.lname}</h3>
                                </div>
                            </div>
                            <div className="col-md-9">
                                <div className="group-detail-text">
                                    {(!usrAuth && storedUser && Object.keys(auth_data).length) ? <div className='side-button'>
                                        <button onClick={async () => {
                                            const response = await axios.post("https://buzzinguniverse.com/backend/api/get-room-id",
                                                { myid: storedUser?.id, userid: userId },
                                                {
                                                    headers: {
                                                        "Content-Type": "multipart/form-data",
                                                    },
                                                }
                                            );
                                            setChatID(response.data.data.chat.id);
                                            ChaNgeTab('messages', usrData)
                                        }}>Message
                                            <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                                                <path d="M10 9H17M10 13H17M7 9H7.01M7 13H7.01M21 20L17.6757 18.3378C17.4237 18.2118 17.2977 18.1488 17.1656 18.1044C17.0484 18.065 16.9277 18.0365 16.8052 18.0193C16.6672 18 16.5263 18 16.2446 18H6.2C5.07989 18 4.51984 18 4.09202 17.782C3.71569 17.5903 3.40973 17.2843 3.21799 16.908C3 16.4802 3 15.9201 3 14.8V7.2C3 6.07989 3 5.51984 3.21799 5.09202C3.40973 4.71569 3.71569 4.40973 4.09202 4.21799C4.51984 4 5.0799 4 6.2 4H17.8C18.9201 4 19.4802 4 19.908 4.21799C20.2843 4.40973 20.5903 4.71569 20.782 5.09202C21 5.51984 21 6.0799 21 7.2V20Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <script xmlns="" /><link xmlns="" /></svg>
                                        </button>
                                        {reqCheck?.type == 1 && <button onClick={(e) => { AlterRequest(e, !sender ? 3 : 2) }}>
                                            {!sender ? "Cancel Request" : "Accept Request"}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" id="delete-user-circle-left" data-name="Line Color" className="icon line-color">
                                                <line id="secondary" x1={6} y1="7.5" x2={3} y2="10.5" style={{ fill: 'none', stroke: 'rgb(44, 169, 188)', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2 }} />
                                                <line id="secondary-2" data-name="secondary" x1={3} y1="7.5" x2={6} y2="10.5" style={{ fill: 'none', stroke: 'rgb(44, 169, 188)', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2 }} />
                                                <path id="secondary-3" data-name="secondary" d="M7,19.5a9,9,0,0,0,9.94,0A5,5,0,0,0,7,19.5Z" style={{ fill: 'none', stroke: 'rgb(44, 169, 188)', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2 }} />
                                                <path id="secondary-4" data-name="secondary" d="M9,13.64A4,4,0,1,0,12,7a4.09,4.09,0,0,0-2,.53" style={{ fill: 'none', stroke: 'rgb(44, 169, 188)', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2 }} />
                                                <path id="primary" d="M9,3.52A8.8,8.8,0,0,1,12,3,9,9,0,1,1,5.64,18.36,8.86,8.86,0,0,1,3.52,15" style={{ fill: 'none', stroke: 'rgb(0, 0, 0)', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2 }} />
                                            </svg>
                                        </button>}
                                        {reqCheck?.type == 2 && <>
                                            <button onClick={(e) => { AlterRequest(e, 3) }}>
                                                UnFriend
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" id="delete-user-circle-left" data-name="Line Color" className="icon line-color">
                                                    <line id="secondary" x1={6} y1="7.5" x2={3} y2="10.5" style={{ fill: 'none', stroke: 'rgb(44, 169, 188)', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2 }} />
                                                    <line id="secondary-2" data-name="secondary" x1={3} y1="7.5" x2={6} y2="10.5" style={{ fill: 'none', stroke: 'rgb(44, 169, 188)', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2 }} />
                                                    <path id="secondary-3" data-name="secondary" d="M7,19.5a9,9,0,0,0,9.94,0A5,5,0,0,0,7,19.5Z" style={{ fill: 'none', stroke: 'rgb(44, 169, 188)', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2 }} />
                                                    <path id="secondary-4" data-name="secondary" d="M9,13.64A4,4,0,1,0,12,7a4.09,4.09,0,0,0-2,.53" style={{ fill: 'none', stroke: 'rgb(44, 169, 188)', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2 }} />
                                                    <path id="primary" d="M9,3.52A8.8,8.8,0,0,1,12,3,9,9,0,1,1,5.64,18.36,8.86,8.86,0,0,1,3.52,15" style={{ fill: 'none', stroke: 'rgb(0, 0, 0)', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2 }} />
                                                </svg>
                                            </button>
                                        </>}
                                        {!reqCheck?.type || reqCheck?.type == 3 ? <button onClick={(e) => { !reqCheck?.type ? SendRequest(e) : AlterRequest(e, 1) }}>
                                            Add Friend
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="30px" height="30px" viewBox="0 0 24 24" id="add-user-left-3" data-name="Flat Color" className="icon flat-color">
                                                <path id="secondary" d="M5,8A1,1,0,0,0,6,7V6H7A1,1,0,0,0,7,4H6V3A1,1,0,0,0,4,3V4H3A1,1,0,0,0,3,6H4V7A1,1,0,0,0,5,8Z" style={{ fill: 'rgb(44, 169, 188)' }} />
                                                <path id="primary" d="M7.54,13.37A6.86,6.86,0,0,1,6.08,9.88a5,5,0,0,0,3.46-7,7,7,0,0,1,8.92,10.45A8,8,0,0,1,22,20a2,2,0,0,1-2,2H6a2,2,0,0,1-2-2A8,8,0,0,1,7.54,13.37Z" style={{ fill: 'rgb(0, 0, 0)' }} />
                                            </svg>
                                        </button> : false}
                                    </div> : false}
                                    <h4> @{usrData.fname}{usrData.lname} <span>Active <TimeAgo2 timestamp={usrData.updated_at} /> </span> </h4>
                                    <UserTabs setTabb={setTabb} usrAuth={usrAuth} requestCount={request?.filter(r => r.data.user_id_two == userId).length} groupCount={groupCount} />
                                    <p>{usrData.about}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='edit_profile_secc'>
                <div className='container'>
                    <div className='row'>
                        <div class="col-lg-3 col-md-4">
                            <ul className='left_wrpr'>
                                <li>
                                    <span>{usrData.friend_count || '0'}</span>
                                    <p>Friends</p>
                                </li>
                                {/* <li>
                                    <span>0</span>
                                    <p>Groups</p>
                                </li> */}
                            </ul>
                            <MyPhotos userId={userId} userName={usrData.fname} />
                        </div>
                        <div className='col-lg-9 col-md-8'>
                            {tabb == "profile" && <div className="personal_right_box">
                                <ul className="nav nav-pills pb-0" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">View</button>
                                    </li>
                                    {usrAuth && <>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Edit</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Change Profile Photo</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="pills-friends-tab" data-bs-toggle="pill" data-bs-target="#pills-friends" type="button" role="tab" aria-controls="pills-friends" aria-selected="false">Change Cover Photo</button>
                                        </li>
                                    </>
                                    }
                                </ul>
                                <div className="tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                        <div className='view_prof_dlt'>
                                            <h3>View Profile</h3>
                                            <span>Base</span>
                                            <table>
                                                <tr>
                                                    <th>Name</th>
                                                    <td>{usrData.fname}</td>
                                                </tr>
                                                {
                                                    usrData.gender && <tr>
                                                        <th>Gender</th>
                                                        <td>{usrData.gender}</td>
                                                    </tr>
                                                }
                                                {console.log(usrData)}
                                                {
                                                    usrData.dob && (usrAuth || visibility.dob === "Everyone") ? <tr>
                                                        <th>Date of birth</th>
                                                        <td>{new Date(usrData?.dob?.replaceAll('-', '/')).toLocaleDateString("en-US")}</td>
                                                    </tr> : false
                                                }
                                                {
                                                    usrData.city && (usrAuth || visibility.city === "Everyone") ? <tr>
                                                        <th>City</th>
                                                        <td>{usrData.city}</td>
                                                    </tr> : false
                                                }
                                                {
                                                    usrData.country && (usrAuth || visibility.country === "Everyone") ? <tr>
                                                        <th>Country</th>
                                                        <td>{usrData.country}</td>
                                                    </tr> : false
                                                }
                                                {
                                                    usrData.email && (usrAuth || visibility.email === "Everyone") ? <tr>
                                                        <th>Email</th>
                                                        <td>{usrData.email}</td>
                                                    </tr> : false
                                                }
                                                {
                                                    links.length > 0 && <tr>
                                                        <th>Links</th>
                                                        <td>
                                                            {links?.map((link, i) => {
                                                                const url = /^https?:\/\//.test(link) ? link : `https://${link}`;
                                                                return <div key={i}><a href={url} target="_blank" rel="noopener noreferrer">{link}</a></div>;
                                                            })}
                                                        </td>
                                                    </tr>
                                                }
                                            </table>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                        <div className='view_prof_dlt'>
                                            <h3>Edit Profile</h3>
                                            <span>Editing "Base" Profile Group</span>
                                            <form>
                                                <div className='grp_inp'>
                                                    <label>First Name</label>
                                                    <input type='text' name='fname' defaultValue={user.fname} onChange={setVal} />
                                                </div>
                                                <div className='grp_inp'>
                                                    <label>Last Name</label>
                                                    <input type='text' name='lname' defaultValue={user.lname} onChange={setVal} />
                                                </div>
                                                <div className='grp_inp'>
                                                    <label>Date of Birth</label>
                                                    <input type="date" name="dob" defaultValue={user.dob} onChange={setVal} />
                                                </div>
                                                <div className='grp_inp'>
                                                    <label>Gender</label>
                                                    <div className='rad_btn'>
                                                        <label className="radio-button">
                                                            <input type="radio" name="gender" defaultValue="Male" checked={user.gender === "Male"} onChange={setGender} />
                                                            <span className="radio" />
                                                            Male
                                                        </label>
                                                        <label className="radio-button">
                                                            <input type="radio" name="gender" defaultValue="Female" checked={user.gender === "Female"} onChange={setGender} />
                                                            <span className="radio" />
                                                            Female
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className='grp_inp'>
                                                    <label>City</label>
                                                    <input type="text" name="city" defaultValue={user.city} onChange={setVal} />
                                                </div>
                                                <div className='grp_inp'>
                                                    <label>Country</label>
                                                    <select name="country" className='form-select' onChange={setVal}>
                                                        <option value="" hidden>{user.country ? user.country : '----'}</option>
                                                        <option value="Afghanistan">Afghanistan</option>
                                                        <option value="Albania">Albania</option>
                                                        <option value="Algeria">Algeria</option>
                                                        <option value="Andorra">Andorra</option>
                                                        <option value="Angola">Angola</option>
                                                        <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                                        <option value="Argentina">Argentina</option>
                                                        <option value="Armenia">Armenia</option>
                                                        <option value="Australia">Australia</option>
                                                        <option value="Austria">Austria</option>
                                                        <option value="Azerbaijan">Azerbaijan</option>
                                                        <option value="Bahamas">Bahamas</option>
                                                        <option value="Bahrain">Bahrain</option>
                                                        <option value="Bangladesh">Bangladesh</option>
                                                        <option value="Barbados">Barbados</option>
                                                        <option value="Belarus">Belarus</option>
                                                        <option value="Belgium">Belgium</option>
                                                        <option value="Belize">Belize</option>
                                                        <option value="Benin">Benin</option>
                                                        <option value="Bhutan">Bhutan</option>
                                                        <option value="Bolivia">Bolivia</option>
                                                        <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                                        <option value="Botswana">Botswana</option>
                                                        <option value="Brazil">Brazil</option>
                                                        <option value="Brunei">Brunei</option>
                                                        <option value="Bulgaria">Bulgaria</option>
                                                        <option value="Burkina Faso">Burkina Faso</option>
                                                        <option value="Burundi">Burundi</option>
                                                        <option value="Cambodia">Cambodia</option>
                                                        <option value="Cameroon">Cameroon</option>
                                                        <option value="Canada">Canada</option>
                                                        <option value="Cape Verde">Cape Verde</option>
                                                        <option value="Central African Republic">Central African Republic</option>
                                                        <option value="Chad">Chad</option>
                                                        <option value="Chile">Chile</option>
                                                        <option value="China">China</option>
                                                        <option value="Colombi">Colombi</option>
                                                        <option value="Comoros">Comoros</option>
                                                        <option value="Congo (Brazzaville)">Congo (Brazzaville)</option>
                                                        <option value="Congo">Congo</option>
                                                        <option value="Costa Rica">Costa Rica</option>
                                                        <option value="Cote d'Ivoire">Cote d'Ivoire</option>
                                                        <option value="Croatia">Croatia</option>
                                                        <option value="Cuba">Cuba</option>
                                                        <option value="Cyprus">Cyprus</option>
                                                        <option value="Czech Republic">Czech Republic</option>
                                                        <option value="Denmark">Denmark</option>
                                                        <option value="Djibouti">Djibouti</option>
                                                        <option value="Dominica">Dominica</option>
                                                        <option value="Dominican Republic">Dominican Republic</option>
                                                        <option value="East Timor (Timor Timur)">East Timor (Timor Timur)</option>
                                                        <option value="Ecuador">Ecuador</option>
                                                        <option value="Egypt">Egypt</option>
                                                        <option value="El Salvador">El Salvador</option>
                                                        <option value="Equatorial Guinea">Equatorial Guinea</option>
                                                        <option value="Eritrea">Eritrea</option>
                                                        <option value="Estonia">Estonia</option>
                                                        <option value="Ethiopia">Ethiopia</option>
                                                        <option value="Fiji">Fiji</option>
                                                        <option value="Finland">Finland</option>
                                                        <option value="France">France</option>
                                                        <option value="Gabon">Gabon</option>
                                                        <option value="Gambia, The">Gambia, The</option>
                                                        <option value="Georgia">Georgia</option>
                                                        <option value="Germany">Germany</option>
                                                        <option value="Ghana">Ghana</option>
                                                        <option value="Greece">Greece</option>
                                                        <option value="Grenada">Grenada</option>
                                                        <option value="Guatemala">Guatemala</option>
                                                        <option value="Guinea">Guinea</option>
                                                        <option value="Guinea-Bissau">Guinea-Bissau</option>
                                                        <option value="Guyana">Guyana</option>
                                                        <option value="Haiti">Haiti</option>
                                                        <option value="Honduras">Honduras</option>
                                                        <option value="Hungary">Hungary</option>
                                                        <option value="Iceland">Iceland</option>
                                                        <option value="India">India</option>
                                                        <option value="Indonesia">Indonesia</option>
                                                        <option value="Iran">Iran</option>
                                                        <option value="Iraq">Iraq</option>
                                                        <option value="Ireland">Ireland</option>
                                                        <option value="Israel">Israel</option>
                                                        <option value="Italy">Italy</option>
                                                        <option value="Jamaica">Jamaica</option>
                                                        <option value="Japan">Japan</option>
                                                        <option value="Jordan">Jordan</option>
                                                        <option value="Kazakhstan">Kazakhstan</option>
                                                        <option value="Kenya">Kenya</option>
                                                        <option value="Kiribati">Kiribati</option>
                                                        <option value="Korea, North">Korea, North</option>
                                                        <option value="Korea, South">Korea, South</option>
                                                        <option value="Kuwait">Kuwait</option>
                                                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                                                        <option value="Laos">Laos</option>
                                                        <option value="Latvia">Latvia</option>
                                                        <option value="Lebanon">Lebanon</option>
                                                        <option value="Lesotho">Lesotho</option>
                                                        <option value="Liberia">Liberia</option>
                                                        <option value="Libya">Libya</option>
                                                        <option value="Liechtenstein">Liechtenstein</option>
                                                        <option value="Lithuania">Lithuania</option>
                                                        <option value="Luxembourg">Luxembourg</option>
                                                        <option value="Macedonia">Macedonia</option>
                                                        <option value="Madagascar">Madagascar</option>
                                                        <option value="Malawi">Malawi</option>
                                                        <option value="Malaysia">Malaysia</option>
                                                        <option value="Maldives">Maldives</option>
                                                        <option value="Mali">Mali</option>
                                                        <option value="Malta">Malta</option>
                                                        <option value="Marshall Islands">Marshall Islands</option>
                                                        <option value="Mauritania">Mauritania</option>
                                                        <option value="Mauritius">Mauritius</option>
                                                        <option value="Mexico">Mexico</option>
                                                        <option value="Micronesia">Micronesia</option>
                                                        <option value="Moldova">Moldova</option>
                                                        <option value="Monaco">Monaco</option>
                                                        <option value="Mongolia">Mongolia</option>
                                                        <option value="Morocco">Morocco</option>
                                                        <option value="Mozambique">Mozambique</option>
                                                        <option value="Myanmar">Myanmar</option>
                                                        <option value="Namibia">Namibia</option>
                                                        <option value="Nauru">Nauru</option>
                                                        <option value="Nepal">Nepal</option>
                                                        <option value="Netherlands">Netherlands</option>
                                                        <option value="New Zealand">New Zealand</option>
                                                        <option value="Nicaragua">Nicaragua</option>
                                                        <option value="Niger">Niger</option>
                                                        <option value="Nigeria">Nigeria</option>
                                                        <option value="Norway">Norway</option>
                                                        <option value="Oman">Oman</option>
                                                        <option value="Pakistan">Pakistan</option>
                                                        <option value="Palau">Palau</option>
                                                        <option value="Panama">Panama</option>
                                                        <option value="Papua New Guinea">Papua New Guinea</option>
                                                        <option value="Paraguay">Paraguay</option>
                                                        <option value="Peru">Peru</option>
                                                        <option value="Philippines">Philippines</option>
                                                        <option value="Poland">Poland</option>
                                                        <option value="Portugal">Portugal</option>
                                                        <option value="Qatar">Qatar</option>
                                                        <option value="Romania">Romania</option>
                                                        <option value="Russia">Russia</option>
                                                        <option value="Rwanda">Rwanda</option>
                                                        <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                                        <option value="Saint Lucia">Saint Lucia</option>
                                                        <option value="Saint Vincent">Saint Vincent</option>
                                                        <option value="Samoa">Samoa</option>
                                                        <option value="San Marino">San Marino</option>
                                                        <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                                        <option value="Saudi Arabia">Saudi Arabia</option>
                                                        <option value="Senegal">Senegal</option>
                                                        <option value="Serbia and Montenegro">Serbia and Montenegro</option>
                                                        <option value="Seychelles">Seychelles</option>
                                                        <option value="Sierra Leone">Sierra Leone</option>
                                                        <option value="Singapore">Singapore</option>
                                                        <option value="Slovakia">Slovakia</option>
                                                        <option value="Slovenia">Slovenia</option>
                                                        <option value="Solomon Islands">Solomon Islands</option>
                                                        <option value="Somalia">Somalia</option>
                                                        <option value="South Africa">South Africa</option>
                                                        <option value="Spain">Spain</option>
                                                        <option value="Sri Lanka">Sri Lanka</option>
                                                        <option value="Sudan">Sudan</option>
                                                        <option value="Suriname">Suriname</option>
                                                        <option value="Swaziland">Swaziland</option>
                                                        <option value="Sweden">Sweden</option>
                                                        <option value="Switzerland">Switzerland</option>
                                                        <option value="Syria">Syria</option>
                                                        <option value="Taiwan">Taiwan</option>
                                                        <option value="Tajikistan">Tajikistan</option>
                                                        <option value="Tanzania">Tanzania</option>
                                                        <option value="Thailand">Thailand</option>
                                                        <option value="Togo">Togo</option>
                                                        <option value="Tonga">Tonga</option>
                                                        <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                                                        <option value="Tunisia">Tunisia</option>
                                                        <option value="Turkey">Turkey</option>
                                                        <option value="Turkmenistan">Turkmenistan</option>
                                                        <option value="Tuvalu">Tuvalu</option>
                                                        <option value="Uganda">Uganda</option>
                                                        <option value="Ukraine">Ukraine</option>
                                                        <option value="United Arab Emirates">United Arab Emirates</option>
                                                        <option value="United Kingdom">United Kingdom</option>
                                                        <option value="United States">United States</option>
                                                        <option value="Uruguay">Uruguay</option>
                                                        <option value="Uzbekistan">Uzbekistan</option>
                                                        <option value="Vanuatu">Vanuatu</option>
                                                        <option value="Vatican City">Vatican City</option>
                                                        <option value="Venezuela">Venezuela</option>
                                                        <option value="Vietnam">Vietnam</option>
                                                        <option value="Yemen">Yemen</option>
                                                        <option value="Zambia">Zambia</option>
                                                        <option value="Zimbabwe">Zimbabwe</option>
                                                    </select>
                                                </div>
                                                <div className='grp_inp'>
                                                    <label>About</label>
                                                    <textarea name='about' defaultValue={user.about} onChange={setVal}></textarea>
                                                </div>
                                                <div className='grp_inp' style={{ alignItems: 'baseline' }}>
                                                    <label>Links</label>
                                                    <div style={{ flex: 1 }}>
                                                        {links.map((link, index) => (
                                                            <div key={index} className="link-input-wrapper">
                                                                <input
                                                                    type="text"
                                                                    name={`link-${index}`}
                                                                    value={link}
                                                                    onChange={(event) => handleLinkChange(index, event)}
                                                                    placeholder={`Link ${index + 1}`}
                                                                />
                                                                {index !== 0 ? <button type="button" onClick={() => removeLinkField(index)}>-</button> : false}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button type="button" className='btn-addlinks' onClick={addLinkField}>+</button>
                                                </div>
                                                <button type='submit' onClick={updateUser}>Save Changes</button>
                                                {message && (
                                                    <p className={`message ${messageType === "success" ? 'success-message' : 'error-message'}`}>
                                                        {message}
                                                    </p>
                                                )}
                                            </form>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-friends-tab">
                                        <div className='view_prof_dlt'>
                                            <h3>Change Profile Photo</h3>
                                            <div className='view_prof_xx'>
                                                <p>Your profile photo will be used on your profile and throughout the site. If there is a Gravatar associated with your account email we will use that, or you can upload an image from your computer.</p>
                                            </div>
                                            <Image_upload fetchUser={getUsr} />
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="pills-friends" role="tabpanel" aria-labelledby="pills-friends-tab">
                                        <div className='view_prof_dlt'>
                                            <h3>Change Cover Photo</h3>
                                            <div className='view_prof_xx'>
                                                <p>Your Cover photo will be used on your Cover and throughout the site. If there is a Gravatar associated with your account email we will use that, or you can upload an image from your computer.</p>
                                            </div>
                                            <Cover_photo />
                                        </div>
                                    </div>
                                </div>
                            </div>}
                            {tabb == "friends" && <Freinds userId={userId} usrAuth={usrAuth} AlterRequest={AlterRequest} />}
                            {tabb == "activity" && <Memberdetail userId={userId} usrAuth={usrAuth} postId={postId} />}
                            {tabb == "forums" && <ForumUser userId={userId} usrAuth={usrAuth} />}
                            {tabb == "media" && <MediaUser userId={userId} usrAuth={usrAuth} />}
                            {tabb == "settings" && <SettingUser userId={userId} usrAuth={usrAuth} defaultPrivacy={user.default_privacy || 1} />}
                            {tabb == "notifications" && <Notification userId={userId} usrAuth={usrAuth} />}
                            {/* {tabb == "messages" && <Cha userId={userId} usrAuth={usrAuth} sendMessage={sendMessage} setSendMessage={setSendMessage} />} */}
                            {tabb == "messages" && <ChatApp userId={storedUser?.id || userId} usrAuth={usrAuth} chatID={chatID} setChatID={setChatID} />}
                            {tabb == "groups" && <UserGroups userId={userId} usrAuth={usrAuth} />}
                            {tabb == "adverts" && <AdvertProfile userId={userId} usrAuth={usrAuth} />}
                            {tabb == "activity-log" && <UserActivityLog userId={userId} usrAuth={usrAuth} />}
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default Profile
