import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import NavBarr from './Comp/NavBarr';
import { FaSearch, FaSlidersH, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

const jobTypes = ['Freelance', 'Full Time', 'Internship', 'Part Time', 'Temporary'];

const Mannage = () => {
    const { auth_data } = useUserContext();
    const auth = auth_data;

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [selectedTypes, setSelectedTypes] = useState(new Set(jobTypes));
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, last_page: 1 });
    const [showFilters, setShowFilters] = useState(false);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = {
                user_id: auth?.id || 1,
                keyword,
                page,
                per_page: 6,
            };

            const res = await axios.get(
                'https://buzzinguniverse.com/backend/api/job/listing',
                { params }
            );

            if (res.data.status) {
                const all = res.data.data.data;
                const filtered = all.filter(job => selectedTypes.has(job.job_type));
                setJobs(filtered);
                setPagination({
                    total: res.data.data.total,
                    last_page: res.data.data.last_page,
                });
            }
        } catch (err) {
            console.error('Failed fetching jobs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [keyword, page, selectedTypes]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchJobs();
    };

    const toggleJobType = (type) => {
        const newSet = new Set(selectedTypes);
        newSet.has(type) ? newSet.delete(type) : newSet.add(type);
        setSelectedTypes(newSet);
        setPage(1);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        try {
            await axios.get(`https://buzzinguniverse.com/backend/api/job/delete/${id}`);
            fetchJobs(); // refresh
        } catch (err) {
            alert('Failed to delete job. Please try again later.');
        }
    };

    return (
        <div className='container py-5'>
            <motion.div
                className='jobWrpert col-lg-9'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <NavBarr />

                <form className="search-filter" onSubmit={handleSearch}>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Location or job title"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button type="submit"><FaSearch /></button>
                    </div>
                    <button type="button" className="filter-btn" onClick={() => setShowFilters(!showFilters)}>
                        <FaSlidersH /> Filter
                    </button>
                </form>

                {showFilters && (
                    <section className="job-types">
                        {jobTypes.map((type, i) => (
                            <label key={i}>
                                <input
                                    type="checkbox"
                                    checked={selectedTypes.has(type)}
                                    onChange={() => toggleJobType(type)}
                                /> {type}
                            </label>
                        ))}
                    </section>
                )}

                <div className="listing-container">
                    {loading
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="job-card skeleton">
                                <div className="logo-skel" />
                                <div style={{ flex: 1 }}>
                                    <div className="text-skel long" />
                                    <div className="text-skel short mt-2" />
                                </div>
                                <div className="badge-skel" />
                                <div className="badge-skel" />
                            </div>
                        ))
                        : jobs.length > 0 ? jobs.map(job => (
                            <div key={job.id} className="job-card">
                                <img
                                    src={`https://buzzinguniverse.com/backend/${job.company_logo}`}
                                    alt={job.company_name}
                                    className="job-logo"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/b.png';
                                    }}
                                />
                                <Link to={`/job-detail/${job.id}`} className="job-info">
                                    <h3 className="job-title">{job.job_title}</h3>
                                    <p className="job-location">
                                        {job.location} {job.is_remote ? '• Remote' : ''}
                                    </p>
                                    <span className="job-company">{job.company_name}</span>
                                </Link>
                                <div>
                                    <span className={`job-badge ${job.job_type.toLowerCase().replace(/\s+/g, '-')}`}>
                                        {job.job_type}
                                    </span>

                                    <div className="job-actions">
                                        <Link to={`/job-edit/${job.id}`} className="jb-edit-btn"><FaEdit /></Link>
                                        <button onClick={() => handleDelete(job.id)} className="jb-delete-btn"><FaTrash /></button>
                                    </div>
                                </div>
                            </div>
                        )) : <p>No jobs found.</p>}
                </div>

                <div className="paginationJb">
                    {pagination.last_page > 1 && Array.from({ length: pagination.last_page }, (_, i) => (
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

export default Mannage;
