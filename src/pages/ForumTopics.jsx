import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useForumContext } from '../context/ForumContext';
import { Link, useParams } from 'react-router-dom';
import SideBarPost from '../components/SideBarPost';
import AddTopic from '../components/AddTopic';
import { useUserContext } from '../context/UserContext';
import renderHTML from "../helpers/RenderHtml";
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

const ForumTopics = () => {
    const { topics, getTopics, subscribe, unsubscribe } = useForumContext();
    const { auth_data } = useUserContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const totalPages = Math.ceil(topics?.total / 15) || 0;
    const [isSub, setIsSub] = useState(null);
    const forumID = useParams().id;


    useEffect(() => {
        setLoading(true);
        getTopics(forumID, currentPage, search)
            .finally(() => {
                setLoading(false)
                window.scrollTo(0, 0);
            });
    }, [currentPage]);


    useEffect(() => {
        getTopics(forumID, 1);
        setCurrentPage(1);
    }, [forumID])

    useEffect(() => {
        setIsSub(topics?.is_sub);
    }, [topics]);

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const SearchClick = (e) => {
        e.preventDefault();
        setLoading(true)
        getTopics(forumID, 1, search).finally(() => {
            setLoading(false)
            window.scrollTo(0, 0);
        });
    }

    const handleSubscribe = async (e) => {
        e.target.classList.add('blink-animation');
        if(!isSub){
            const res = await subscribe(1, forumID); 
            setIsSub(res.data);
        }else{
            await unsubscribe(isSub.id, forumID);
            setIsSub(null);
        }
        e.target.classList.remove('blink-animation');
    };

    return (
        <div className="forum-container">
            <div className='container'>
                <div className='row justify-content-end align-items-start'>
                    <div className='col-md-7'>
                        <div className='forum-Data'>
                            <h3>{topics?.forum_data?.title}</h3>
                            {Object.keys(auth_data).length ? <span className='btn-subscribe' onClick={handleSubscribe}><i>{!isSub ? "+" : '-'}</i>{!isSub ? " Subscribe" : " Unsubscribe"} </span> : false}
                        </div>
                        <div className="col-lg-5 col-md-6 col-12">
                            <div className="search-groups-box">
                                <form>
                                    <input type="text" placeholder="Search Topics..." onChange={(e) => {setSearch(e.target.value)}} />
                                    <div className="search-groups-box-icon">
                                        <button type="submit" onClick={SearchClick}><FaSearch /></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Topic</th>
                                    <th>Voices</th>
                                    <th>Posts</th>
                                    <th>Last Post</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading && topics.data.length ? topics.data.map((fr, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <Link to={`/forums/${forumID}/topics/${fr.topics_data.id}`} className="forum-info">
                                                <div className="icon"><i className="far fa-comment-dots"></i></div>
                                                <div>
                                                    <div className="title">{fr.topics_data.title}</div>
                                                    <div className="desc">{renderHTML(fr.topics_data.description)}</div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td>{fr.voices}</td>
                                        <td>{fr.post}</td>
                                        <td className="no-topics">{fr.lastpost?.user ? <>
                                            <Link to={`/member/${fr.lastpost.user.id}/profile`}>{fr.lastpost.user.first_name}</Link>
                                            <TimeAgo date={fr.lastpost.post.created_at} />
                                        </> : "No Topics"}</td>
                                    </tr>
                                )) : <td colSpan={4}>
                                    {!loading && <div className="bbp-template-notice info">This forum is empty.</div>}
                                </td>}
                            </tbody>
                        </table>


                        {loading && <Skelton length={6} />}
                        {totalPages && totalPages > 1 ? <div className="search-groups-pages-number mt-3">
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
                        </div> : false
                        }

                        {Object.keys(auth_data).length ? <AddTopic auth_data={auth_data} forumID={forumID} forumTitle={topics?.forum_data?.title} getTopics={getTopics} /> : false}

                    </div>

                    {/* Sidebar */}
                    <div className='col-md-3' style={{ position: 'sticky', top: 0 }}>
                        <SideBarPost />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForumTopics
