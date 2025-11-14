import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useForumContext } from '../context/ForumContext';
import { Link } from 'react-router-dom';
import SideBarPost from '../components/SideBarPost';
import TimeAgo from '../helpers/TimeAgo';

const Skelton = ({ length }) => {
    return Array.from({ length }).map((_, index) => (
        <div key={index} className="forum-skeleton__item">
            <div className="forum-skeleton__icon skeleton--pulse"></div>
            <div className="forum-skeleton__content">
                <div className="forum-skeleton__line forum-skeleton__line--long skeleton--pulse"></div>
                <div className="forum-skeleton__line forum-skeleton__line--medium skeleton--pulse"></div>
            </div>
            <div className="forum-skeleton__stats">
                <div className="forum-skeleton__stat skeleton--pulse"></div>
            </div>
            <div className="forum-skeleton__meta">
                <div className="forum-skeleton__meta-line skeleton--pulse"></div>
                <div className="forum-skeleton__meta-line skeleton--pulse"></div>
            </div>
        </div>
    ));
};

const Forums = () => {
    const { forums, getForums } = useForumContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const totalPages = Math.ceil(forums?.total / 15);

    useEffect(() => {
        setLoading(true);
        getForums(currentPage)
            .finally(() => {
                setLoading(false)
                window.scrollTo(0, 0);
            });
    }, [currentPage]);

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const SearchClick = (e) => {
        e.preventDefault();
        setLoading(true)
        getForums(1, search).finally(() => {
            setLoading(false)
            window.scrollTo(0, 0);
        });
    }

    return (
        <div className="forum-container">
            <div className='container'>
                <div className='row justify-content-end align-items-start'>
                    <div className='col-md-7'>
                        <div className="col-lg-5 col-md-6 col-12">
                            <div className="search-groups-box">
                                <form>
                                    <input type="text" placeholder="Search Forums..." onChange={(e) => { setSearch(e.target.value) }} />
                                    <div className="search-groups-box-icon">
                                        <button type="submit" onClick={SearchClick}><FaSearch /></button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Forum</th>
                                    <th>Topics</th>
                                    <th>Posts</th>
                                    <th>Last Post</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading && forums.data && forums.data.map((fr, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <Link to={`/forums/${fr.forum_data.id}/topics/`} className="forum-info">
                                                <div className="icon"><i className="far fa-comments" /></div>
                                                <div>
                                                    <div className="title">{fr.forum_data.title}</div>
                                                    <div className="desc">{fr.forum_data.description}</div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td>{fr.topic}</td>
                                        <td>{fr.post}</td>
                                        <td className="no-topics">{fr.lastpost.user ? <>
                                            <Link to={`/member/${fr.lastpost.user.id}/profile`}>{fr.lastpost.user.first_name}</Link>
                                            <TimeAgo date={fr.lastpost.post.created_at} />
                                        </> : "No Topics"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {loading && <Skelton length={6} />}
                        {totalPages && totalPages > 1 && <div className="search-groups-pages-number mt-3">
                            <div className="row">
                                <div className="col-12">
                                    <ul className="pagination">
                                        {currentPage > 1 && (
                                            <li onClick={(e) => { e.preventDefault(); handlePageClick(currentPage - 1) }}>
                                                <a href="#">&laquo;</a>
                                            </li>
                                        )}

                                        {[...Array(totalPages)].map((_, idx) => {
                                            const page = idx + 1;
                                            return (
                                                <li key={page} className={page === currentPage ? 'active' : ''}>
                                                    <a href="#" onClick={(e) => {
                                                        e.preventDefault();
                                                        handlePageClick(page);
                                                    }}>
                                                        {page}
                                                    </a>
                                                </li>
                                            );
                                        })}

                                        {currentPage < totalPages && (
                                            <li onClick={(e) => { e.preventDefault(); handlePageClick(currentPage + 1) }}>
                                                <a href="#">&raquo;</a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        }
                    </div>

                    {/* Sidebar */}
                    <div className='col-md-3' style={{ position: 'sticky', top: 0 }}>
                        <SideBarPost />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forums;
