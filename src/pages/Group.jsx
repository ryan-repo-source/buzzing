import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { FaArrowRightLong } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import GlobalSearch from '../components/GlobalSearch'
import secureLocalStorage from 'react-secure-storage'
import axios from 'axios'


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



function Group() {
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
    const [groups, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const fetchGroup = async (page, e) => {
        e && e.preventDefault();
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/groups/get?search=${search}&page=${page}`);
            setGroup(res.data?.data || null);
            setCurrentPage(res.data?.data.current_page);
            setLastPage(res.data?.data.last_page);
        } catch (err) {
            console.error("Failed to fetch group:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroup(1);
    }, []);

    useEffect(() => {
        fetchGroup(currentPage);
        window.scrollTo(0, 100);
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


    return (
        <div>
            <GlobalSearch />

            <div className="inner-groups-pages-link-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-12">
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/faqs">FAQs </Link></li>
                                <li><Link to="/blogs">Blog</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <section>
                <div className="inner-groups-sec">
                    <div className="container">
                        <div className="row" style={{ justifyContent: 'center' }}>
                            <div className="col-lg-7 col-12">
                                <div className="inner-groups-box">
                                    <div className="all-groups">
                                        <ul>
                                            <li><p>All Groups</p></li>
                                            <li><span>{groups?.total}</span></li>
                                        </ul>
                                        {auth && <Link to="/create-group" className='btncs'>Create Group</Link>}
                                    </div>
                                    <div className="search-groups-row">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-12">
                                                <div className="search-groups-box">
                                                    <form onSubmit={(e) => fetchGroup(1, e)}>
                                                        <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder="Search Groups..." />
                                                        <div className="search-groups-box-icon">
                                                            <button type="submit"><FaSearch /></button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="search-groups-boxs-row">
                                        <div className="row">
                                            {loading ? (
                                                <Skeleton number={6} />
                                            ) : (groups.data.map((group) => (
                                                <div className="col-lg-6 col-md-6 col-12">
                                                    <div className="search-groups-boxs">
                                                        <div className="search-groups-box-back" style={{
                                                            backgroundImage: `url(https://buzzinguniverse.com/backend/${group.cover_photo}), radial-gradient(circle, rgb(153 153 153) 0%, rgba(0, 0, 0, 0.15) 58%, rgba(0, 0, 0, 0.3) 100%)`
                                                        }} />
                                                        <span>
                                                            <img
                                                                src={group.profile_picture
                                                                    ? `https://buzzinguniverse.com/backend/${group.profile_picture}`
                                                                    : "/images/mystery-group.png"}
                                                                alt={group.name}
                                                            />
                                                        </span>
                                                        <h2><Link to={`/group-detail/${group.id}`}>{group.name}</Link></h2>
                                                        <strong>Active 6 hours ago</strong>
                                                        <div className='adminslist-adf'>
                                                            {
                                                                group.admins && group.admins.map((admin, key) => (
                                                                    key < 10 && <Link to={`/member/${admin.user.id}/profile`}><img
                                                                        src={admin.user.photo
                                                                            ? `https://buzzinguniverse.com/backend/${admin.user.photo}`
                                                                            : "/images/b.png"} alt={admin.user.first_name} /></Link>
                                                                ))
                                                            }
                                                        </div>
                                                        <h4>Public Group / 1 member</h4>
                                                        <div className="search-groups-btn">
                                                            <Link to={`/group-detail/${group.id}`}>View Group</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            )))}
                                        </div>
                                    </div>
                                </div>
                                <div className="search-groups-pages-number mt-4 d-flex justify-content-center">
                                    {renderPagination()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



        </div>
    )
}

export default Group
