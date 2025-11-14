import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import GlobalSearch from '../components/GlobalSearch';

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

function Members() {
    const [members, setMembers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const getMembers = (page = 1) => {
        setLoading(true);
        axios.get(`https://buzzinguniverse.com/backend/api/get-all-user?page=${page}&search=${search}`)
            .then((res) => {
                const response = res.data.data;
                setMembers(response.data);
                setCurrentPage(response.current_page);
                setTotal(response.total)
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
        window.scrollTo(0, 0)
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
        return (
            <ul>
                {pages}
            </ul>
        );
    };

    return (
        <div>
            <GlobalSearch />
            <section>
                <div className="inner-groups-sec member-groups-sec">
                    <div className="container">
                        <div className="row" style={{ justifyContent: 'end', alignItems: 'start' }}>
                            <div className="col-lg-7 col-md-7 col-12">
                                <div className="inner-groups-box">
                                    <div className="all-groups">
                                        <ul>
                                            <li><p>Active Members</p></li>
                                            <li><span>{total}</span></li>
                                        </ul>
                                    </div>
                                    <div className="search-groups-row">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-12">
                                                <div className="search-groups-box">
                                                    <form onSubmit={(e) => {
                                                        e.preventDefault();
                                                        getMembers();
                                                    }}>
                                                        <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder="Search Groups..." />
                                                        <div className="search-groups-box-icon">
                                                            <button type="submit"><FaSearch /></button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-12">
                                                <div className="search-groups-select">
                                                    <select name="members" id="members" className="form-select">
                                                        <option>Last Active</option>
                                                        <option>Most Members</option>
                                                        <option>Newly Created</option>
                                                        <option>Alphabetical</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="search-groups-boxs-row">
                                        <div className="row">
                                            {loading ? (
                                                <Skeleton number={6} />
                                            ) : (
                                                members.map((mem) => (
                                                    <div className="col-lg-6 col-md-6 col-12" key={mem.id}>
                                                        <div className="search-groups-boxs">
                                                            <div className="search-groups-box-back" />
                                                            <span>
                                                                <img src={mem.photo ? `https://buzzinguniverse.com/backend/${mem.photo}` : '/images/b.png'} alt="img" />
                                                            </span>
                                                            <h2>
                                                                <Link to={`/member/${mem.id}/profile`}>
                                                                    {mem.first_name} {mem.last_name}
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
                                                                <Link to={`/member/${mem.id}/profile`}>View Profile</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div className="search-groups-pages-number">
                                        <div className="row">
                                            <div className="col-lg-12 col-md-12 col-12">
                                                {renderPagination()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-3">
                                <div className="member-right-main-box">
                                    <div className="member-right-box">
                                        <div className="all-groups">
                                            <h3 className="widgettitle">Members</h3>
                                        </div>
                                        {[
                                            { name: 'Margart Kraker', time: '8 hours ago' },
                                            { name: 'RonaldJaw', time: '13 hours ago' },
                                            { name: 'Coder Mehedi', time: 'a day ago', img: 'images/mehdi.jpg' },
                                            { name: 'Bradley Summers', time: '3 days ago' },
                                            { name: 'Mizoraben', time: '5 days ago' },
                                        ].map((user, idx) => (
                                            <ul key={idx}>
                                                <li>
                                                    <img src={user.img || 'images/b.png'} alt="img" />
                                                </li>
                                                <li>
                                                    <Link to="">{user.name}</Link>
                                                    <strong>{user.time}</strong>
                                                </li>
                                            </ul>
                                        ))}
                                    </div>

                                    <div className="inner-groups-pages-link-sec inner-groups-pages-link-sec1">
                                        <ul>
                                            <li><Link to="/index">Home</Link></li>
                                            <li><Link to="/about-us">About Us</Link></li>
                                            <li><Link to="/faqs">FAQs</Link></li>
                                            <li><Link to="/blogs">Blog</Link></li>
                                            <li><Link to="/contact">Contact</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Members;
