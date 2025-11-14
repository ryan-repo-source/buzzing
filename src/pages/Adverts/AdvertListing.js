import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import RenderHtml from '../../helpers/RenderHtml';
import NavBarr from './Comp/NavBarr';
import { FaLock } from 'react-icons/fa6';

const AdvertListing = () => {
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

    useEffect(() => {
        fetchAdverts();
    }, [keyword, page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchAdverts();
    };

    return (
        <div className="container py-5">
            <motion.div
                className="jobWrpert col-lg-9"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <NavBarr />

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
                                <div className="adrt-content border-0">
                                    <span className="adrt-price">${ad.price}</span>
                                    <h3 className="adrt-title">{ad.title.slice(0, 55)}{ad.title.length > 55 && '...'}</h3>
                                    <p className="adrt-desc">{RenderHtml(ad.description.slice(0, 120))}</p>
                                    <span className="adrt-date">{new Date(ad.created_at).toLocaleDateString()}</span>
                                    <div className="adrt-lock"><FaLock /></div>
                                </div>
                                {/* <div className="adrt-dropdown">
                                    <button className="adrt-btn">Manage</button>
                                    <div className="adrt-menu">
                                        <Link to={`/advert/${ad.id}`}>👁 View</Link>
                                        <Link to={`/advert/edit/${ad.id}`}>✏️ Edit</Link>
                                        <button onClick={() => alert(`Delete ID: ${ad.id}`)}>🗑 Delete</button>
                                    </div>
                                </div> */}
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
    );
};

export default AdvertListing;
