import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import SinglePost from '../components/SinglePost';
import { Link } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';

const Gallery = () => {
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
    const [media, setMedia] = useState([]);
    const [allMedia, setAllMedia] = useState([]); // stores all fetched media
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [single_Post, setSinlgePost] = useState(null);

    const [hasMore, setHasMore] = useState(true);
    const BASE_URL = 'https://buzzinguniverse.com/backend/';

    const fetchMedia = useCallback(async (page) => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}api/get-media?page=${page}`);
            const newMedia = response.data.data.data;

            setAllMedia(prev => [...prev, ...newMedia]);
            setCurrentPage(response.data.data.current_page);
            setHasMore(response.data.data.current_page < response.data.data.last_page);
        } catch (err) {
            setError('Failed to load media');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMedia(1);
    }, [fetchMedia]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const innerHeight = window.innerHeight;
            const offsetHeight = document.documentElement.offsetHeight;

            if (scrollY + innerHeight >= offsetHeight - 100 && hasMore && !loading) {
                fetchMedia(currentPage + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentPage, hasMore, loading, fetchMedia]);

    useEffect(() => {
        // Filter when search term changes
        if (searchTerm.trim() === '') {
            setMedia(allMedia);
        } else {
            const filtered = allMedia.filter((item) => {
                const fullName = `${item.user?.first_name || ''} ${item.user?.last_name || ''}`.toLowerCase();
                return fullName.includes(searchTerm.toLowerCase());
            });
            setMedia(filtered);
        }
    }, [searchTerm, allMedia]);

    return (
        <section>
            <div className="inner-groups-sec gallery">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-8 col-12 offset-md-2">
                            <div className="inner-groups-box">
                                <div className="all-groups">
                                    <ul>
                                        <li>
                                            <p>All Media</p>
                                        </li>
                                    </ul>
                                </div>

                                <div className="search-groups-row">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-12">
                                            <div className="search-groups-box">
                                                <form onSubmit={(e) => e.preventDefault()}>
                                                    <input
                                                        type="text"
                                                        placeholder="Search by user name..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                    <div className="search-groups-box-icon">
                                                        <button type="submit">
                                                            <i className="fas fa-search" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="gall-wrap">
                                                {error && <p className="text-danger">{error}</p>}

                                                <div className="row">
                                                    {media.map((item, key) => (
                                                        <div className="col-md-4 mb-4" key={key}>
                                                            <div className="gall-box" onClick={() => { setSinlgePost(item) }}>
                                                                <div className="gall-img">
                                                                    <a>
                                                                        <img
                                                                            src={`${BASE_URL}${item.file}`}
                                                                            alt="media"
                                                                            className="img-fluid"
                                                                        />
                                                                    </a>
                                                                </div>
                                                                <div className="gall-person">
                                                                    <ul>
                                                                        <li>
                                                                            <Link to={`/member/${item.user.id}/profile`}>
                                                                                <img
                                                                                    src={`${BASE_URL}${item.user?.photo}`}
                                                                                    alt={item.user?.first_name}
                                                                                    style={{
                                                                                        width: 40,
                                                                                        height: 40,
                                                                                        borderRadius: '50%',
                                                                                        objectFit: 'cover'
                                                                                    }}
                                                                                />
                                                                            </Link>
                                                                        </li>
                                                                        <li>
                                                                            <Link to={`/member/${item.user.id}/profile`}>
                                                                                <h3>{item.user?.first_name} {item.user?.last_name}</h3>
                                                                            </Link>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {media.length === 0 && !loading && (
                                                        <div className="col-12">
                                                            <p>No media found.</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {loading && <div className='loader_Post' />}
                                                {/* {single_Post && <SinglePost setSinlgePost={setSinlgePost} auth={auth} post={
                                                    {
                                                        post_data:{...single_Post.post, user: single_Post.user}
                                                    }
                                                } />} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {console.log(single_Post)}
        </section>
    );
};

export default Gallery;
