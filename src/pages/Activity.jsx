import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { FaWifi } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import AddPost from '../components/AddPost';
import { usePostContext } from '../context/PostContext';
import PostBox1 from '../helpers/PostBox1';
import SharedPostBox from '../helpers/SharedPostBox';
import SinglePost from '../components/SinglePost';
import secureLocalStorage from 'react-secure-storage';
import GroupPost from '../helpers/GroupPost';
import GlobalSearch from '../components/GlobalSearch';

const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));

const Activity = () => {
    const {
        posts,
        mention_posts,
        freinds_posts,
        favourite_posts,
        getPosts,
        getMentionPost,
        getFreindsPost,
        getFavouritePost,
        hasMore,
        getGroupPostsByUser,
        group_posts_user
    } = usePostContext();

    const [tabss, setTabss] = useState(1);
    const [loading, setLoading] = useState(false);
    const loadingRef = useRef(false);
    const [paGe, setPage] = useState(1);
    const [single_Post, setSinlgePost] = useState(null);

    const userId = auth?.id || 0;
    let usrAuth;

    // Sync loadingRef with loading state
    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100
            ) {
                if (!loadingRef.current && hasMore) {
                    loadingRef.current = true;
                    setPage(prevPage => prevPage + 1);
                    setLoading(true);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    useEffect(() => {
        single_Post ? document.body.classList.add('hidden') : document.body.classList.remove('hidden');
    }, [single_Post]);

    useEffect(() => {
        setLoading(true);
        FetchPosts(tabss, 1);
        setPage(1);
    }, [tabss]);

    useEffect(() => {
        FetchPosts(tabss, paGe);
    }, [paGe]);

    useEffect(() => {
        if (!single_Post) return;
        const sources = [null, posts, mention_posts, favourite_posts, freinds_posts];
        const updated = sources[tabss]?.find(p => p.post_data.id === single_Post.post_data.id);
        setSinlgePost(updated);
    }, [posts, mention_posts, freinds_posts, favourite_posts]);

    const FetchPosts = (_TB, page) => {
        switch (_TB) {
            case 1:
                getPosts(null, page, 1).finally(() => setLoading(false));
                break;
            case 2:
                getMentionPost(userId, page).finally(() => setLoading(false));
                break;
            case 3:
                getFavouritePost(userId, page).finally(() => setLoading(false));
                break;
            case 4:
                getFreindsPost(userId, page).finally(() => setLoading(false));
                break;
            case 5:
                getGroupPostsByUser(userId, page).finally(() => setLoading(false));
                break;
            default:
                break;
        }
    };

    const PostRenderer = ({ posts, usrAuth, setSinlgePost }) => {
        const elementsToRender = [];
        let currentGroup = [];
        let currentUniqueId = null;

        const renderCurrentGroup = () => {
            if (currentGroup.length === 0) return;
            if (currentGroup.length > 1) {
                elementsToRender.push(
                    <GroupPost key={`group-${currentUniqueId}`} postsN={currentGroup} setSinlgePost={setSinlgePost} />
                );
            } else {
                const post = currentGroup[0];
                elementsToRender.push(
                    post.shared ? (
                        <SharedPostBox key={post.id} post={post} usrAuth={post.post_data.user.id === auth?.id} />
                    ) : (
                        <PostBox1
                            key={post.id}
                            setSinlgePost={setSinlgePost}
                            post={post}
                            usrAuth={post.post_data.user.id === auth?.id}
                        />
                    )
                );
            }

            currentGroup = [];
            currentUniqueId = null;
        };

        posts.forEach((post, index) => {
            console.log("post");
            const uniqueId = post.post_data?.unique_id ?? null;
            if (uniqueId !== null) {
                if (uniqueId === currentUniqueId) {
                    currentGroup.push(post);
                } else {
                    renderCurrentGroup();
                    currentUniqueId = uniqueId;
                    currentGroup.push(post);
                }
            } else {
                renderCurrentGroup();
                elementsToRender.push(
                    post.shared ? (
                        <SharedPostBox key={post.id} post={post} usrAuth={usrAuth} />
                    ) : (
                        <PostBox1 key={post.id} setSinlgePost={setSinlgePost} post={post} usrAuth={usrAuth} />
                    )
                );
            }

            if (index === posts.length - 1) {
                renderCurrentGroup();
            }
        });

        return <>{elementsToRender}</>;
    };

    return (
        <section>
            <GlobalSearch />
            <div className="personal_right_box py-5">
                <div className="container">
                    <div className="row" style={{ justifyContent: 'center' }}>
                        <div className="col-md-9">
                            {auth && <AddPost FetchPosts={FetchPosts} />}
                            <div className='tab-new' style={{marginRight: '-12%', marginLeft: '12%'}}>
                                <ul className="nav nav-pills mb-0" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className={`nav-link ${tabss == 1 && 'active'}`} onClick={(e) => { e.preventDefault(); setTabss(1) }}>All Members</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={`nav-link ${tabss == 3 && 'active'}`} onClick={(e) => { e.preventDefault(); setTabss(3) }}>My Favourites</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={`nav-link ${tabss == 4 && 'active'}`} onClick={(e) => { e.preventDefault(); setTabss(4) }}>My Friends</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={`nav-link ${tabss == 5 && 'active'}`} onClick={(e) => { e.preventDefault(); setTabss(5) }}>My Groups</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={`nav-link ${tabss == 2 && 'active'}`} onClick={(e) => { e.preventDefault(); setTabss(2) }}>Mentions</button>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    <div className={`tab-pane fade show active`}>
                                        <div className="wifi_box" style={{marginRight: '24%', paddingRight: '20%'}}>
                                            <Link to="#" className="wifi">
                                                <FaWifi />
                                            </Link>
                                            <select name id>
                                                <option>— Everything —</option>
                                                <option>Updates</option>
                                                <option>rtMedia Updates</option>
                                                <option>Friendships</option>
                                                <option>New Groups</option>
                                                <option>Group Memberships</option>
                                                <option>Group Updates</option>
                                                <option>Topics</option>
                                                <option>Replies</option>
                                                <option>Posts</option>
                                                <option>Comments</option>
                                            </select>
                                        </div>
                                        {tabss == 1 && <div className="personal_des_box_main">
                                            {posts.length ? (
                                                <PostRenderer posts={posts} usrAuth={usrAuth} setSinlgePost={setSinlgePost} />
                                            ) : (
                                                !loading && (
                                                    <div className="sorry-activity-found activity-all-memeber">
                                                        <ul>
                                                            <li><i className="fas fa-info" /></li>
                                                            <li><p>Sorry, there was no activity found. Please try a different filter.</p></li>
                                                        </ul>
                                                    </div>
                                                )
                                            )}
                                        </div>}
                                        {tabss == 2 && <div className="personal_des_box_main">
                                            {mention_posts.length ? <PostRenderer posts={mention_posts} usrAuth={usrAuth} setSinlgePost={setSinlgePost} /> : (!loading && <div className="sorry-activity-found activity-all-memeber">
                                                <ul>
                                                    <li><i className="fas fa-info" aria-hidden="true" /></li>
                                                    <li>
                                                        <p>Sorry, there was no activity found. Please try a different filter.</p>
                                                    </li>
                                                </ul>
                                            </div>)}
                                        </div>}
                                        {tabss == 3 && <div className="personal_des_box_main">
                                            {favourite_posts.length ? <PostRenderer posts={favourite_posts} usrAuth={usrAuth} setSinlgePost={setSinlgePost} /> : (!loading && <div className="sorry-activity-found activity-all-memeber">
                                                <ul>
                                                    <li><i className="fas fa-info" aria-hidden="true" /></li>
                                                    <li>
                                                        <p>Sorry, there was no activity found. Please try a different filter.</p>
                                                    </li>
                                                </ul>
                                            </div>)}
                                        </div>}
                                        {tabss == 4 && <div className="personal_des_box_main">
                                            {freinds_posts.length ? <PostRenderer posts={freinds_posts} usrAuth={usrAuth} setSinlgePost={setSinlgePost} /> : (!loading && <div className="sorry-activity-found activity-all-memeber">
                                                <ul>
                                                    <li><i className="fas fa-info" aria-hidden="true" /></li>
                                                    <li>
                                                        <p>Sorry, there was no activity found. Please try a different filter.</p>
                                                    </li>
                                                </ul>
                                            </div>)}
                                        </div>}
                                        {tabss == 5 && <div className="personal_des_box_main">
                                            {group_posts_user.length ? <PostRenderer posts={group_posts_user} usrAuth={usrAuth} setSinlgePost={setSinlgePost} /> : (!loading && <div className="sorry-activity-found activity-all-memeber">
                                                <ul>
                                                    <li><i className="fas fa-info" aria-hidden="true" /></li>
                                                    <li>
                                                        <p>Sorry, there was no activity found. Please try a different filter.</p>
                                                    </li>
                                                </ul>
                                            </div>)}
                                        </div>}
                                    </div>
                                </div>
                                {(loading && hasMore) && (
                                    <div className="loader_post_wrap mt-5">
                                        <div className="loader_Post"></div>
                                    </div>
                                )}
                                {(!hasMore && !loading) && (
                                    <div className="sorry-activity-found activity-all-memeber" style={{ width: "75%" }}>
                                        <ul>
                                            <li><i className="fas fa-info" /></li>
                                            <li><p>Sorry, there was no more activity found.</p></li>
                                        </ul>
                                    </div>
                                )}
                                {single_Post && (
                                    <SinglePost setSinlgePost={setSinlgePost} auth={auth} post={single_Post} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Activity;
