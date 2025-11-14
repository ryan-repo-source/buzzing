import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaWifi } from 'react-icons/fa6';
import { Link } from 'react-router-dom'
import AddPost from '../../components/AddPost';
import { usePostContext } from '../../context/PostContext';
import PostBox1 from '../../helpers/PostBox1';
import SharedPostBox from '../../helpers/SharedPostBox';
import SinglePost from '../../components/SinglePost';
import secureLocalStorage from 'react-secure-storage';
import GroupPost from '../../helpers/GroupPost';

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

function Home({ usrAuth, groupId }) {
    const { group_posts, getGroupPosts, hasMore } = usePostContext();
    const [loading, setLoading] = useState(false);
    const [paGe, setPage] = useState(1);
    const [single_Post, setSinlgePost] = useState(null);

    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));

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
        FetchPosts(paGe);
    }, [paGe]);

    useEffect(() => {
        if (!single_Post) return;
        const updated = group_posts?.find(p => p.post_data.id === single_Post.post_data.id);
        setSinlgePost(updated);
    }, [group_posts]);

    const FetchPosts = async (page) => {
        await getGroupPosts(groupId, page);
        setLoading(false);
    }

    return (
        <div className="personal_right_box">
            {usrAuth && <AddPost groupId={groupId} FetchPosts={FetchPosts} />}
            <div className="tab-content" id="pills-tabContent">
                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                    <div className="wifi_box">
                        <Link href className="wifi">
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
                    <div className="personal_des_box_main">
                        {group_posts.length > 0 ? <PostRenderer posts={group_posts} usrAuth={usrAuth} setSinlgePost={setSinlgePost} /> : (!loading && <div className="sorry-activity-found activity-all-memeber">
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

export default Home
