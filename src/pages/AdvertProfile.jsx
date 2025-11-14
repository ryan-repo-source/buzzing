import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPencilAlt, FaSearch, FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import RenderHtml from '../helpers/RenderHtml';
import { FaEye, FaLock } from 'react-icons/fa6';

const AdvertProfile = ({userId}) => {
    const [adverts, setAdverts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, last_page: 1 });

    const fetchAdverts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                'https://buzzinguniverse.com/backend/api/advert/listing',
                {
                    params: {
                        user_id: userId || 1,
                        keyword,
                        page,
                        per_page: 6,
                    },
                }
            );

            if (res.data.status) {
                setAdverts(res.data.data.data);
                setPagination({
                    total: res.data.data.total,
                    last_page: res.data.data.last_page,
                });
            }
        } catch (err) {
            console.error('Failed to fetch adverts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this advert?')) return;
        try {
            await axios.get(`https://buzzinguniverse.com/backend/api/advert/delete/${id}`);
            setAdverts(prev => prev.filter(ad => ad.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete advert.');
        }
    };

    useEffect(() => {
        fetchAdverts();
    }, [keyword, page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchAdverts();
    };

    return (
        <div className="personal_right_box col-lg-9">
            <ul className="nav nav-pills pb-0" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className={`nav-link active`}>Mannage Ads</button>
                </li>
            </ul>
            <div className="tab-content" id="pills-tabContent">
                <div className="tab-pane fade show active">
                    <motion.div
                        className="jobWrpert col-lg-12 p-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <form className="search-filter" onSubmit={handleSearch}>
                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="Search adverts"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                                <button type="submit"><FaSearch /></button>
                            </div>
                        </form>

                        {/* Listing */}
                        <div className="listing-container">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="adrt skeleton">
                                        <div className="adrt-img-skel" />
                                        <div className="adrt-content-skel">
                                            <div className="text-skel long" />
                                            <div className="text-skel short mt-2" />
                                        </div>
                                    </div>
                                ))
                            ) : adverts.length > 0 ? (
                                adverts.map((ad) => (
                                    <Link to={`/advert/${ad.id}/view`} key={ad.id} className="adrt">
                                        <img
                                            src={`https://buzzinguniverse.com/backend/${ad.gallery?.[0] || 'images/b.png'}`}
                                            alt={ad.title}
                                            className="adrt-img"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/b.png';
                                            }}
                                        />
                                        <div className="adrt-content">
                                            <span className="adrt-price">${ad.price}</span>
                                            <h3 className="adrt-title">{ad.title.slice(0, 45)}{ad.title.length > 45 && '...'}</h3>
                                            <p className="adrt-desc">{RenderHtml(ad.description.slice(0, 95))}</p>
                                            <span className="adrt-date">{new Date(ad.created_at).toLocaleDateString()}</span>
                                            <div className="adrt-lock"><FaLock /></div>
                                        </div>
                                        <div className="adrt-dropdown">
                                            <button className="adrt-btn">Manage</button>
                                            <div className="adrt-menu">
                                                <Link to={`/advert/${ad.id}/view`}><FaEye /> View</Link>
                                                <Link to={`/advert/${ad.id}/edit`}><FaPencilAlt /> Edit</Link>
                                                <button onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDelete(ad.id);
                                                }}>
                                                    <FaTrashAlt /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p>No adverts found.</p>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="paginationJb">
                            {pagination.last_page > 1 &&
                                Array.from({ length: pagination.last_page }, (_, i) => (
                                    <button
                                        key={i}
                                        className={page === i + 1 ? 'active' : ''}
                                        onClick={() => setPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default AdvertProfile
