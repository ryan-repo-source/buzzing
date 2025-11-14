import axios from "axios";
import { createContext, useContext, useEffect, useReducer, useState } from "react";
import secureLocalStorage from "react-secure-storage";

const PostContext = createContext();


const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [group_posts, setGroupPosts] = useState([]);
    const [group_posts_user, setGroupPostsUser] = useState([]);
    const [mention_posts, setMentionPosts] = useState([]);
    const [freinds_posts, setFreindsPosts] = useState([]);
    const [favourite_posts, setFavouritePosts] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));


    const addCommentToPost = (post_id, newComment) => {
        const updateComments = (postArraySetter, postArray) => {
            let hasUpdated = false;
    
            const updated = postArray.map(post => {
                if (post.post_data.id === post_id) {
                    hasUpdated = true;
                    return {
                        ...post,
                        comments: [...post.comments, newComment]
                    };
                }
                return post;
            });
    
            if (hasUpdated) postArraySetter(updated);
        };
    
        updateComments(setPosts, posts);
        updateComments(setMentionPosts, mention_posts);
        updateComments(setFreindsPosts, freinds_posts);
        updateComments(setFavouritePosts, favourite_posts);
    };

    const getPosts = async (user_id, page, type) => {
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/get-post-request?${user_id && `userid=${user_id}`}${type && `&type=${type}`}${auth?.id && `&visitor_id=${auth.id}`}&page=${page}`);
            const products = (res.data.data || []).filter(item => item !== null);
            if (res.data.code == 200) {
                if (page === 1) {
                    setPosts(products);
                    console.log('a')
                } else {
                    setPosts(prev => [...prev, ...products]);
                    console.log('b')
                }
                const count = page * 25;
                res.data.total > count ? setHasMore(true) : setHasMore(false);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const getSinlgePosts = async (post_id) => {
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/get-sinlge-post-request?post_id=${post_id}`);
            const products = await res.data.data;
            if (res.data.code == 200) {
                return products;
            }
        } catch (error) {
            console.log(error)
        }
    };

    

    const getMentionPost = async (user_id, page) => {
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/get-mention-post-request?user_id=${user_id}${auth?.id && `&visitor_id=${auth.id}`}&page=${page}`);
            const products = await res.data.data;
            if (res.data.code == 200) {
                if (page === 1) {
                    setMentionPosts(products);
                } else {
                    setMentionPosts(prev => [...prev, ...products]);
                }
                const count = page * 15;
                res.data.total > count ? setHasMore(true) : setHasMore(false);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const getFreindsPost = async (user_id, page) => {
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/get-friends-post-request?userid=${user_id}${auth?.id && `&visitor_id=${auth.id}`}&page=${page}`);
            const products = await res.data.data;
            if (res.data.code == 200) {
                if (page === 1) {
                    setFreindsPosts(products);
                } else {
                    setFreindsPosts(prev => [...prev, ...products]);
                }
                const count = page * 15;
                res.data.total > count ? setHasMore(true) : setHasMore(false);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const getFavouritePost = async (user_id, page) => {
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/get-favourite-post-request?user_id=${user_id}${auth?.id && `&visitor_id=${auth.id}`}&page=${page}`);
            const products = await res.data.data;
            if (res.data.code == 200) {
                if (page === 1) {
                    setFavouritePosts(products);
                } else {
                    setFavouritePosts(prev => [...prev, ...products]);
                }
                const count = page * 15;
                res.data.total > count ? setHasMore(true) : setHasMore(false);
            }
        } catch (error) {
            console.log(error)
        }
    };


    const getGroupPosts = async (group_id, page) => {
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/get-post-request?${auth?.id && `&visitor_id=${auth.id}`}&group_id=${group_id}&page=${page}`);
            const products = (res.data.data || []).filter(item => item !== null);
            if (res.data.code == 200) {
                if (page === 1) {
                    setGroupPosts(products);
                } else {
                    setGroupPosts(prev => [...prev, ...products]);
                }
                const count = page * 20;
                res.data.total > count ? setHasMore(true) : setHasMore(false);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const getGroupPostsByUser = async (user_id, page) => {
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/groups/getPostByUser?user_id=${user_id}&page=${page}`);
            const products = (res.data.data || []).filter(item => item !== null);
            if (res.data.code == 200) {
                if (page === 1) {
                    setGroupPostsUser(products);
                } else {
                    setGroupPostsUser(prev => [...prev, ...products]);
                }
                const count = page * 25;
                res.data.total > count ? setHasMore(true) : setHasMore(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return <PostContext.Provider value={{ posts, getPosts, mention_posts, getMentionPost, getFreindsPost, freinds_posts, favourite_posts, getFavouritePost, hasMore, addCommentToPost, getSinlgePosts, group_posts, getGroupPosts, getGroupPostsByUser, group_posts_user }} > {children} </PostContext.Provider>
};

const usePostContext = () => {
    return useContext(PostContext);
}
export { PostProvider, PostContext, usePostContext };
