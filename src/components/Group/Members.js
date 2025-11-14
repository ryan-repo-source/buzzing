import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaSearch, FaUserPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useUserContext } from '../../context/UserContext'
import secureLocalStorage from 'react-secure-storage'
import { Spinner, Toast, ToastContainer } from 'react-bootstrap'

const Skeleton = ({ number }) => {
    return (
        [...Array(number)].map((_, index) => (
            <div className='memberTile' key={index}>
                <div className='userPrty' style={{ display: 'flex', alignItems: 'center', width: '180px' }}>
                    <div className="skeletonasd avatar-skeleton mb-0 me-2" style={{ width: '35px', height: '35px' }}></div>
                    <div className="skeletonasd text-skeleton medium"></div>
                </div>
                <div className="skeletonasd btn-skeleton mt-0" style={{ width: '70px' }}></div>
            </div>
        ))
    );
};
const Members = ({ group }) => {
    const [members, setMembers] = useState([]);
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const getMembers = (page = 1) => {
        setLoading(true);
        axios.get(`https://buzzinguniverse.com/backend/api/groups/all-members?group_id=${group.id}&page=${page}&search=${search}`)
            .then((res) => {
                const response = res.data.data;
                setMembers(response.data);
                setCurrentPage(response.current_page);
                setLastPage(response.last_page);
            })
            .catch(err => {
                console.error("Error fetching members:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getMembers(currentPage);
        window.scrollTo(0, 800);
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page !== currentPage && page >= 1 && page <= lastPage) {
            setCurrentPage(page);
        }
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= lastPage; i++) {
            pages.push(
                <li key={i} className={i === currentPage ? "active" : ""}>
                    <button onClick={() => handlePageChange(i)}>{i}</button>
                </li>
            );
        }
        return <ul className="pagination">{pages}</ul>;
    };

    const ChangeRole = async (e, userid) => {
        e.preventDefault();
        e.target.classList.add('loadin');
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/groups/change-role?group_id=${group.id}&user_id=${userid}&role=${e.target.value}`);
            getMembers();
            e.target.classList.remove('loadin');
        } catch (err) {
            console.error("Failed to fetch group:", err);
        }
    };

    const LeaveGroup = async (e, user_id) => {
        e.preventDefault();
        e.target.classList.add('loadin');
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/groups/leave?group_id=${group.id}&user_id=${user_id}`);
            getMembers();
            e.target.classList.remove('loadin');
        } catch (err) {
            console.error("Failed to fetch group:", err);
        }
    };

    return (
        <div className="group-settings-container">
            <h2 className="group-settings-header mb-4">Group Members</h2>

            <div className="search-groups-box mb-3">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    getMembers();
                }} className="d-flex align-items-center">
                    <input
                        type="text"
                        className="form-control me-2"
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Members..."
                        style={{ maxWidth: 300 }}
                    />
                    <button type="submit" className="btn btn-primary">
                        <FaSearch />
                    </button>
                </form>
            </div>
            {/* Toast Message */}
            <ToastContainer className="my-3 position-relative w-100">
                <Toast className='w-100' show={showToast} onClose={() => setShowToast(false)} delay={4000} autohide bg="success">
                    <Toast.Header>
                        <strong className="me-auto">Invitation Sent</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
            <div className="memberTiles">
                {loading ? (
                    <Skeleton number={6} />
                ) : (
                    members.map((mem) => (
                        <div className="memberTile d-flex justify-content-between align-items-center p-2 border rounded mb-2" key={mem.user.id}>
                            <div className="userPrty d-flex align-items-center">
                                <img
                                    src={mem.user.photo ? `https://buzzinguniverse.com/backend/${mem.user.photo}` : '/images/b.png'}
                                    alt="avatar"
                                    className="rounded-circle me-2"
                                    style={{ width: 35, height: 35, objectFit: 'cover' }}
                                />
                                <Link to={`/member/${mem.user.id}/profile`} className="text-decoration-none fw-semibold">
                                    {mem.user.first_name} {mem.user.last_name}
                                </Link>
                            </div>
                            <div>
                                {
                                    group.membership.role == 'admin' ? <select onChange={(e) => { ChangeRole(e, mem.user.id) }} value={mem.role}>
                                        <option value="admin">admin</option>
                                        <option value="moderator">moderator</option>
                                        <option value="member">member</option>
                                    </select> : <i>{mem.role}</i>
                                }
                                {
                                    group.membership.role == 'admin' && <button className='p-0 border-0 ms-2' onClick={(e) => { LeaveGroup(e, mem.user.id) }}>
                                        <img src='images/trash.svg' width={30} />
                                    </button>
                                }
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="search-groups-pages-number mt-4 d-flex justify-content-center">
                {renderPagination()}
            </div>


        </div>
    );
};
export default Members
