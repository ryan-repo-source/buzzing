import React, { useEffect, useRef, useState } from 'react'
import SideBarPost from '../components/SideBarPost'
import { Link, useParams } from 'react-router-dom'
import { useForumContext } from '../context/ForumContext';
import AddReply from '../components/AddReply';
import { useUserContext } from '../context/UserContext';
import formatDateTime from '../helpers/formatDateTime';
import RenderHtml from '../helpers/RenderHtml';
import TimeAgo from '../helpers/TimeAgo';
import { FaSearch } from 'react-icons/fa';
import EditReply from '../components/EditReply';
import highlightText from '../helpers/highlightText';


const Skelton = ({length}) => {
    return Array.from({ length }).map((_, index) => (
        <div id="reply-1473" key={index} className='skelton_reply'>
            <div className="forum-meta"><span>April 10, 2025 at 9:46 pm</span> <span className="forum-reply-link">
                <span>Edit</span> | <span> Reply </span>
                <a href="/forums/1/topics/16" data-discover="true">#1473</a>
            </span>
            </div>
            <div className="forum-post-row">
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


const TopicReplies = () => {
    const topicID = useParams().topicID;
    const forumID = useParams().id;
    const { auth_data } = useUserContext();
    const { getTopicReplies, TopicReplies, subscribe, unsubscribe } = useForumContext();

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(TopicReplies?.total / 15) || 0;
    const [isSub, setIsSub] = useState(null);
    const [replyData, setReplyData] = useState(null);
    const [editData, setEditData] = useState(null);


    const FormElement = useRef();

    useEffect(() => {
        setLoading(true);
        getTopicReplies(topicID, currentPage, search)
            .finally(() => {
                setLoading(false)
                window.scrollTo(0, 0);
            });
    }, [currentPage]);

    const SearchClick = (e) => {
        e.preventDefault();
        setLoading(true)
        getTopicReplies(topicID, 1, search).finally(() => {
            setLoading(false);
            setCurrentPage(1);
            window.scrollTo(0, 0);
        });
    }

    useEffect(() => {
        window.scrollTo({
            top: FormElement?.current?.offsetTop,
            left: 0,
            behavior: 'smooth'
        });
    }, [replyData])

    useEffect(() => {
        setIsSub(TopicReplies?.is_sub);
    }, [TopicReplies]);

    const onSuccess = () => {
        window.scrollTo(0, 0);
        getTopicReplies(topicID, 1);
        setCurrentPage(1);
        setEditData(null)
    }

    useEffect(() => {
        setLoading(true);
        setSearch('');
        getTopicReplies(topicID, 1).finally(() => {
            setLoading(false);
            setCurrentPage(1);
            window.scrollTo(0, 0);
        });
    }, [forumID, topicID])

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const ScrollToo = (target) => {
        window.scrollTo({
            top: document.querySelector(target)?.offsetTop,
            left: 0,
            behavior: 'smooth'
        });
    }

    const handleSubscribe = async (e) => {
        e.preventDefault();
        e.target.classList.add('blink-animation');
        if (!isSub) {
            const res = await subscribe(2, topicID);
            setIsSub(res.data);
        } else {
            await unsubscribe(isSub.id, topicID);
            setIsSub(null);
        }
        e.target.classList.remove('blink-animation');
    };

    return (
        <div className="forum-container">
            <div className='container'>
                <div className='row justify-content-end align-items-start'>
                    <div className='col-md-7'>
                        {editData ? <EditReply reply={editData} auth_data={auth_data} setEditData={setEditData} onSuccess={onSuccess} /> :
                            <>
                                <div className='forum-Data'>
                                    <h3>{TopicReplies?.topics_data?.title}</h3>
                                </div>
                                <div className="col-lg-5 col-md-6 col-12">
                                    <div className="search-groups-box">
                                        <form>
                                            <input type="text" value={search} placeholder="Search Replies..." onChange={(e) => { setSearch(e.target.value) }} />
                                            <div className="search-groups-box-icon">
                                                <button type="submit" onClick={SearchClick}><FaSearch /></button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="forum-topic-container">
                                    <div className="forum-topic-header">
                                        <span className="forum-author-title">Author</span>
                                        <span className="forum-posts-title">Posts</span>
                                        {Object.keys(auth_data)?.length ? <a href="#" onClick={handleSubscribe} className="forum-subscribe"> | {!isSub ? " Subscribe" : " Unsubscribe"}</a> : false}
                                    </div>
                                    {
                                        TopicReplies?.data.length && !loading ? TopicReplies.data.map((reply) => (
                                            <div id={`reply-${reply.reply_data.id}`}>
                                                <div className="forum-meta">
                                                    {formatDateTime(reply.reply_data.created_at)}
                                                    <span className="forum-reply-link">
                                                        {Object.keys(auth_data)?.length ? <>
                                                            {auth_data.id == reply.reply_data.user.id && <><span onClick={() => setEditData(reply.reply_data)}>Edit</span> |</>}
                                                            <span onClick={() => setReplyData(reply.reply_data)}> Reply </span>
                                                        </> : false}
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
                                                                reply.reply_data.reply_data.comment.length > 190
                                                                    ? reply.reply_data.reply_data.comment.slice(0, 190) + '...'
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

                                    {loading && <Skelton length={6} />}

                                </div>

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

                                {Object.keys(auth_data).length ? <AddReply FormElement={FormElement} auth_data={auth_data} topicID={parseInt(topicID)} tags={TopicReplies?.topics_data?.tags} forumID={forumID} replyData={replyData} setReplyData={setReplyData} forumTitle={TopicReplies?.topics_data?.title} getTopicReplies={getTopicReplies} /> : false}
                            </>
                        }

                    </div>

                    {/* Sidebar */}
                    <div className='col-md-3' style={{ position: 'sticky', top: 0 }}>
                        <SideBarPost />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopicReplies
