import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaWifi } from 'react-icons/fa6';
import { Link } from 'react-router-dom'
import AddPost from '../components/AddPost';
import { usePostContext } from '../context/PostContext';
import PostBox1 from '../helpers/PostBox1';
import SharedPostBox from '../helpers/SharedPostBox';
import SinglePost from '../components/SinglePost';
import secureLocalStorage from 'react-secure-storage';
import GroupPost from '../helpers/GroupPost';

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
                    <SharedPostBox key={post.id} post={post} usrAuth={usrAuth} />
                ) : (
                    <PostBox1
                        key={post.id}
                        setSinlgePost={setSinlgePost}
                        post={post}
                        usrAuth={usrAuth}
                    />
                )
            );
        }

        currentGroup = [];
        currentUniqueId = null;
    };

    posts.forEach((post, index) => {
        if (!post) {
            return null;
        }
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
                    <PostBox1
                        key={post.id}
                        setSinlgePost={setSinlgePost}
                        post={post}
                        usrAuth={usrAuth}
                    />
                )
            );
        }
        if (index === posts.length - 1) {
            renderCurrentGroup();
        }
    });

    return <>{elementsToRender}</>;
};

function Memberdetail({ usrAuth, userId, postId }) {
    const { posts, mention_posts, freinds_posts, favourite_posts, getPosts, getMentionPost, getFreindsPost, getFavouritePost, hasMore, getGroupPostsByUser, group_posts_user, getSinlgePosts } = usePostContext();
    const [tabss, setTabss] = useState(1);
    const [loading, setLoading] = useState(false);
    const [paGe, setPage] = useState(1);
    const [single_Post, setSinlgePost] = useState(null);
    const [single_Url, setSinlgeUrl] = useState(null);

    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));

    const GetPoost = async (post_id) => {
        const result = await getSinlgePosts(post_id);
        setSinlgeUrl(result);
    }

    useEffect(() => {
        if (postId) {
            GetPoost(postId);
        }
    }, [postId]);

    console.log(single_Post);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
                if (!loading && hasMore) {
                    setPage(prevPage => prevPage + 1);
                    setLoading(true);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loading]);

    useEffect(() => {
        single_Post ? document.body.classList.add('hidden') : document.body.classList.remove('hidden');
    }, [single_Post])

    useEffect(() => {
        setLoading(true);
        FetchPosts(tabss, 1);
        setPage(1);
    }, [tabss])

    useEffect(() => {
        setLoading(true);
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
                getPosts(userId, page).finally(() => {
                    setLoading(false);
                });
                break;
            case 2:
                getMentionPost(userId, page).finally(() => {
                    setLoading(false);
                });
                break;

            case 3:
                getFavouritePost(userId, page).finally(() => {
                    setLoading(false);
                });
                break;
            case 4:
                getFreindsPost(userId, page).finally(() => {
                    setLoading(false);
                });
                break;
            case 5:
                getGroupPostsByUser(userId, page).finally(() => setLoading(false));
                break;

            default:
                break;
        }
    }

    return (
        <div className="personal_right_box">
            {usrAuth && <AddPost />}
            <ul className="nav nav-pills mb-0" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true" onClick={() => setTabss(1)}>Personal</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false" onClick={() => setTabss(2)}>Mentions</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false" onClick={() => setTabss(3)}>Favourites</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-friends-tab" data-bs-toggle="pill" data-bs-target="#pills-friends" type="button" role="tab" aria-controls="pills-friends" aria-selected="false" onClick={() => setTabss(4)}>Friends</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-Groups-tab" data-bs-toggle="pill" data-bs-target="#pills-Groups" type="button" role="tab" aria-controls="pills-Groups" aria-selected="false" onClick={() => setTabss(5)}>Groups</button>
                </li>
            </ul>
            <div className="tab-content" id="pills-tabContent">
                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                    <div className="wifi_box justify-content-start gap-3">
                        <Link href className="wifi">
                            <FaWifi />
                        </Link>
                        <select className='px-3'>
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
                    <div className="personal_des_box_main">
                        {posts.length ? <>
                            {single_Url && <PostRenderer posts={[null, single_Url]} usrAuth={usrAuth} setSinlgePost={setSinlgePost} />}
                            <PostRenderer posts={posts} usrAuth={usrAuth} setSinlgePost={setSinlgePost} />
                        </> : (!loading && <div className="sorry-activity-found activity-all-memeber">
                            <ul>
                                <li><i className="fas fa-info" aria-hidden="true" /></li>
                                <li>
                                    <p>Sorry, there was no activity found. Please try a different filter.</p>
                                </li>
                            </ul>
                        </div>)}
                    </div>
                </div>
                <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                    <div className="personal_des_box_main">
                        {mention_posts.length ? <PostRenderer posts={mention_posts} usrAuth={usrAuth} setSinlgePost={setSinlgePost} /> : (!loading && <div className="sorry-activity-found activity-all-memeber">
                            <ul>
                                <li><i className="fas fa-info" aria-hidden="true" /></li>
                                <li>
                                    <p>Sorry, there was no activity found. Please try a different filter.</p>
                                </li>
                            </ul>
                        </div>)}
                    </div>
                </div>
                <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-friends-tab">
                    <div className="personal_des_box_main">
                        {favourite_posts.length ? <PostRenderer posts={favourite_posts} usrAuth={usrAuth} setSinlgePost={setSinlgePost} /> : (!loading && <div className="sorry-activity-found activity-all-memeber">
                            <ul>
                                <li><i className="fas fa-info" aria-hidden="true" /></li>
                                <li>
                                    <p>Sorry, there was no activity found. Please try a different filter.</p>
                                </li>
                            </ul>
                        </div>)}
                    </div>
                </div>
                <div className="tab-pane fade" id="pills-friends" role="tabpanel" aria-labelledby="pills-friends-tab">
                    <div className="personal_des_box_main">
                        {freinds_posts.length ? <PostRenderer posts={freinds_posts} usrAuth={usrAuth} setSinlgePost={setSinlgePost} /> : (!loading && <div className="sorry-activity-found activity-all-memeber">
                            <ul>
                                <li><i className="fas fa-info" aria-hidden="true" /></li>
                                <li>
                                    <p>Sorry, there was no activity found. Please try a different filter.</p>
                                </li>
                            </ul>
                        </div>)}
                    </div>
                </div>
                <div className="tab-pane fade" id="pills-Groups" role="tabpanel" aria-labelledby="pills-Groups-tab">
                    <div className="personal_des_box_main">
                        {group_posts_user.length ? <PostRenderer posts={group_posts_user} usrAuth={usrAuth} setSinlgePost={setSinlgePost} /> : (!loading && <div className="sorry-activity-found activity-all-memeber">
                            <ul>
                                <li><i className="fas fa-info" aria-hidden="true" /></li>
                                <li>
                                    <p>Sorry, there was no activity found. Please try a different filter.</p>
                                </li>
                            </ul>
                        </div>)}
                    </div>
                </div>
            </div>
            {(loading && hasMore) && <div className='loader_post_wrap mt-5'><div class="loader_Post"></div></div>}
            {(!hasMore && !loading) && <div className="sorry-activity-found activity-all-memeber" style={{ width: "75%" }}>
                <ul>
                    <li><i className="fas fa-info" aria-hidden="true" /></li>
                    <li>
                        <p>Sorry, there was no more activity found.</p>
                    </li>
                </ul>
            </div>}

            {single_Post && <SinglePost setSinlgePost={setSinlgePost} auth={auth} post={single_Post} />}

        </div>
    )
}

export default Memberdetail
