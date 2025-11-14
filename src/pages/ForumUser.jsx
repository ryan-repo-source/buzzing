import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useForumContext } from '../context/ForumContext';
import { Link, useParams } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import RenderHtml from "../helpers/RenderHtml";
import TimeAgo from '../helpers/TimeAgo';
import highlightText from '../helpers/highlightText';
import formatDateTime from '../helpers/formatDateTime';

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

const Skelton2 = ({ length }) => {
    return Array.from({ length }).map((_, index) => (
        <div id="reply-1473" key={index} className='skelton_reply'>
            <div className="forum-meta"><span>April 10, 2025 at 9:46 pm</span> <span className="forum-reply-link">
                <span>Edit</span> | <span> Reply </span>
                <a href="/forums/1/topics/16" data-discover="true">#1473</a>
            </span>
            </div>
            <div className="forum-post-row" style={{ gap: 20 }}>
                <div className="forum-user-section">
                    <img alt="Avatar" className="forum-avatar" />
                    <a className="forum-username" href="/member/50/profile" data-discover="true">Ryan</a>
                    <div className="forum-role">Participant</div>
                </div>
                <div className="forum-content-section">
                    <div className="forum-post-body">
                        <div>
                            <p>e qui exceQuia maxime qui exceQuia maxime qui exceQuia maxime qui exceQuia maxime qui exceQuia maxime qui exceQuia maxime qui exceQuia maxime qui exceQuia maxime qui exceQui</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ));
}

const ForumUser = ({ usrAuth, userId }) => {

    const { userTopic, getUserTopics, getUserReplies, userReplies, getEngagedTopics, userEngaged, getSubscribeTopics, userSubscribe } = useForumContext();
    const { auth_data } = useUserContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [tabss, setTabss] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    useEffect(() => {
        setLoading(true);
        FetchForum(tabss, currentPage);
    }, [currentPage]);

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const SearchClick = (e) => {
        e.preventDefault();
        setLoading(true)
        FetchForum(tabss, 1);
    }

    const ScrollToo = (target) => {
        window.scrollTo({
            top: document.querySelector(target)?.offsetTop,
            left: 0,
            behavior: 'smooth'
        });
    }

    useEffect(() => {
        setLoading(true);
        FetchForum(tabss, 1);
    }, [tabss])

    useEffect(() => {
        setPagein(tabss);
    }, [userReplies, userTopic, userEngaged])

    const setPagein = (_TB) => {
        switch (_TB) {
            case 1:
                setTotalPages(Math.ceil(userTopic?.total / 15) || 0);
                break;
            case 2:
                setTotalPages(Math.ceil(userReplies?.total / 15) || 0);
                break;
            case 3:
                setTotalPages(Math.ceil(userEngaged?.total / 15) || 0);
                break;
            default:
                break;
        }
    }

    const FetchForum = (_TB, page) => {
        switch (_TB) {
            case 1:
                getUserTopics(userId, page, search).finally(() => {
                    setLoading(false);
                });
                break;
            case 2:
                getUserReplies(userId, page, search).finally(() => {
                    setLoading(false);
                });
                break;
            case 3:
                getEngagedTopics(userId, page, search).finally(() => {
                    setLoading(false);
                });
                break;
            case 5:
                getSubscribeTopics(userId, page, search).finally(() => {
                    setLoading(false);
                });
                break;

            default:
                break;
        }
    }

    return (
        <div className="personal_right_box col-lg-9">
            <ul className="nav nav-pills pb-0" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className={`nav-link ${tabss === 1 && 'active'}`} onClick={() => setTabss(1)}>Topics Started</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className={`nav-link ${tabss === 2 && 'active'}`} onClick={() => setTabss(2)}>Replies Created</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className={`nav-link ${tabss === 3 && 'active'}`} onClick={() => setTabss(3)}>Engagements</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className={`nav-link ${tabss === 4 && 'active'}`} onClick={() => setTabss(4)}>Favorites</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className={`nav-link ${tabss === 5 && 'active'}`} onClick={() => setTabss(5)}>Subscriptions</button>
                </li>
            </ul>
            <div className="tab-content" id="pills-tabContent">
                {tabss === 1 && <div className="tab-pane fade show active">
                    <div className='forum-container pb-3'>
                        <div className="col-lg-5 col-md-6 col-12">
                            <div className="search-groups-box">
                                <form>
                                    <input type="text" placeholder="Search Topics..." onChange={(e) => { setSearch(e.target.value) }} />
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
                                {!loading && userTopic.data.length ? userTopic.data.map((fr, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <Link to={`/forums/${fr.topics_data.forum_id}/topics/${fr.topics_data.id}`} className="forum-info">
                                                <div className="icon"><i className="far fa-comment-dots"></i></div>
                                                <div>
                                                    <div className="title">{fr.topics_data.title}</div>
                                                    <div className="desc">
                                                        Started by: <Link to={`/member/${fr.user.id}/profile`}>{fr.user.first_name}</Link>
                                                        <br /> in: <Link to={`/forums/${fr.forum_data.id}/topics`}>{fr.forum_data.title}</Link>
                                                    </div>
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
                    </div>
                </div>}
                {tabss === 2 && <div className="tab-pane fade show active">
                    <div className='forum-topic-container pb-3 pt-3'>
                        <div className="col-lg-5 col-md-6 col-12 pb-3">
                            <div className="search-groups-box">
                                <form>
                                    <input type="text" placeholder="Search Topics..." onChange={(e) => { setSearch(e.target.value) }} />
                                    <div className="search-groups-box-icon">
                                        <button type="submit" onClick={SearchClick}><FaSearch /></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {
                            userReplies?.data.length && !loading ? userReplies.data.map((reply) => (
                                <div id={`reply-${reply.reply_data.id}`}>
                                    <div className="forum-meta">
                                        {formatDateTime(reply.reply_data.created_at)}
                                        <span className="forum-reply-link">
                                            <Link onClick={(e) => { e.preventDefault(); ScrollToo(`#reply-${reply.reply_data.id}`) }}>#{reply.reply_data.id}</Link>
                                        </span>
                                    </div>
                                    {reply.reply_data.reply_data && (
                                        <Link onClick={(e) => { e.preventDefault(); ScrollToo(`#reply-${reply.reply_data.reply_data.id}`) }} className="forum-parent-preview">
                                            <div className="forum-parent-user">
                                                <div>
                                                    <img src={`https://buzzinguniverse.com/backend/${reply.reply_data.reply_data.user.photo}`} alt="Avatar" className="forum-avatar-small" />
                                                    <span className="forum-parent-name">{reply.reply_data.reply_data.user.first_name} said:</span>
                                                </div>
                                                <b>#{reply.reply_data.reply_data.id}</b>
                                            </div>
                                            <div className="forum-parent-snippet">
                                                {RenderHtml(
                                                    reply.reply_data.reply_data.comment.length > 180
                                                        ? reply.reply_data.reply_data.comment.slice(0, 180) + '...'
                                                        : reply.reply_data.reply_data.comment
                                                )}
                                            </div>
                                        </Link>
                                    )}
                                    <div className="forum-post-row">
                                        <div className="forum-user-section">
                                            <img src={`https://buzzinguniverse.com/backend/${reply.user.photo}`} alt="Avatar" className="forum-avatar" />
                                            <Link to={`/member/${reply.reply_data.user.id}/profile`} className="forum-username">{reply.user.first_name}</Link>
                                            <div className="forum-role">Participant</div>
                                        </div>
                                        <div className="forum-content-section">
                                            <div className="forum-post-body">
                                                {RenderHtml(highlightText(reply.reply_data.comment, search))}
                                                {
                                                    reply.reply_data.created_at !== reply.reply_data.updated_at ?
                                                        <div className="forum-edited-note">This reply was modified <TimeAgo date={reply.reply_data.created_at} /> by <Link to={`/member/${reply.reply_data.user.id}/profile`}>{reply.reply_data.user.first_name}</Link>.</div> : false
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (loading ? false : <div className="bbp-template-notice info">There is no reply found.</div>)
                        }

                        {loading && <Skelton2 length={6} />}
                    </div>
                </div>}
                {tabss === 3 && <div className="tab-pane fade show active">
                    <div className='forum-container pb-3'>
                        <div className="col-lg-5 col-md-6 col-12">
                            <div className="search-groups-box">
                                <form>
                                    <input type="text" placeholder="Search Topics..." onChange={(e) => { setSearch(e.target.value) }} />
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
                                {!loading && userEngaged && userEngaged.data.length ? userEngaged.data.map((fr, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <Link to={`/forums/${fr.topics_data.forum_id}/topics/${fr.topics_data.id}`} className="forum-info">
                                                <div className="icon"><i className="far fa-comment-dots"></i></div>
                                                <div>
                                                    <div className="title">{fr.topics_data.title}</div>
                                                    <div className="desc">
                                                        Started by: <Link to={`/member/${fr.user.id}/profile`}>{fr.user.first_name}</Link>
                                                        <br /> in: <Link to={`/forums/${fr.forum_data.id}/topics`}>{fr.forum_data.title}</Link>
                                                    </div>
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
                    </div>
                </div>}
                {tabss === 4 && <div className="tab-pane fade show active">
                    ...
                </div>}
                {tabss === 5 && <div className="tab-pane fade show active">
                    <div className='forum-container pb-3'>
                        <div className="col-lg-5 col-md-6 col-12">
                            <div className="search-groups-box">
                                <form>
                                    <input type="text" placeholder="Search Topics..." onChange={(e) => { setSearch(e.target.value) }} />
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
                            {console.log(userSubscribe)}
                            <tbody>
                                {!loading && userSubscribe?.data.sub_forums.length ? userSubscribe.data.sub_forums.map((fr, idx) => (
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
                                        <td className="no-topics">{fr.lastpost?.user ? <>
                                            <Link to={`/member/${fr.lastpost.user.id}/profile`}>{fr.lastpost.user.first_name}</Link>
                                            <TimeAgo date={fr.lastpost.post.created_at} />
                                        </> : "No Topics"}</td>
                                    </tr>
                                )) : <td colSpan={4}>
                                    {!loading && <div className="bbp-template-notice info">This forums are empty.</div>}
                                </td>}
                            </tbody>
                        </table>
                        {loading && <Skelton length={3} />}
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
                                {!loading && userSubscribe?.data.sub_topics.length ? userSubscribe.data.sub_topics.map((fr, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <Link to={`/forums/${fr.topics_data.forum_id}/topics/${fr.topics_data.id}`} className="forum-info">
                                                <div className="icon"><i className="far fa-comment-dots"></i></div>
                                                <div>
                                                    <div className="title">{fr.topics_data.title}</div>
                                                    <div className="desc">
                                                        Started by: <Link to={`/member/${fr.user.id}/profile`}>{fr.user.first_name}</Link>
                                                        <br /> in: <Link to={`/forums/${fr.forum_data.id}/topics`}>{fr.forum_data.title}</Link>
                                                    </div>
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
                                    {!loading && <div className="bbp-template-notice info">This topics are empty.</div>}
                                </td>}
                            </tbody>
                        </table>
                        {loading && <Skelton length={3} />}

                    </div>
                </div>}
                {tabss !== 5 && totalPages && totalPages > 1 ? <div className="search-groups-pages-number mt-3">
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
            </div>
        </div>
    )
}

export default ForumUser
