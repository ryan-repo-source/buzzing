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
            <div className='col-lg-6 col-md-6 col-12'>
                <div class="skeleton-card">
                    <div class="skeletonasd avatar-skeleton"></div>
                    <div class="skeletonasd text-skeleton short"></div>
                    <div class="skeletonasd text-skeleton medium"></div>
                    <div class="skeletonasd text-skeleton full"></div>
                    <div class="skeletonasd text-skeleton full"></div>
                    <div class="skeletonasd btn-skeleton"></div>
                </div>
            </div>
        ))
    );
};
const Member = ({ group }) => {
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

    return (
        <div className="group-settings-container" style={{ width: '70%' }}>
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
            <div className="search-groups-boxs-row">
                <div className="row">
                    {loading ? (
                        <Skeleton number={6} />
                    ) : (
                        members.map((mem) => (
                            <div className="col-lg-6 col-md-6 col-12" key={mem.user.id}>
                                <div className="search-groups-boxs">
                                    <div className="search-groups-box-back" style={{
                                        backgroundImage: `url(https://buzzinguniverse.com/backend/${mem.user.cover_photo}), radial-gradient(circle, rgb(153 153 153) 0%, rgba(0, 0, 0, 0.15) 58%, rgba(0, 0, 0, 0.3) 100%)`
                                    }} />
                                    <span>
                                        <img src={mem.user.photo ? `https://buzzinguniverse.com/backend/${mem.user.photo}` : '/images/b.png'} alt="img" />
                                    </span>
                                    <h2>
                                        <Link to={`/member/${mem.user.id}/profile`}>
                                            {mem.user.first_name} {mem.user.last_name}
                                        </Link>
                                    </h2>
                                    <strong>Active 7 hours, 27 minutes ago</strong>
                                    <div className="friend_line">
                                        <ul>
                                            <li><h4>0</h4><strong>Friends</strong></li>
                                            <li><h4>169</h4><strong>Groups</strong></li>
                                        </ul>
                                    </div>
                                    <div className="search-groups-btn">
                                        <Link to={`/member/${mem.user.id}/profile`}>View Profile</Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="search-groups-pages-number mt-4 d-flex justify-content-center">
                {renderPagination()}
            </div>


        </div>
    );
};
export default Member
