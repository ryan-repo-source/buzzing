import axios from "axios";
import { createContext, useContext, useEffect, useReducer, useState } from "react";
import secureLocalStorage from "react-secure-storage";

const ForumContext = createContext();


const ForumProvider = ({ children }) => {
    const [forums, setForum] = useState(null);
    const [topics, setTopics] = useState(null);
    const [TopicReplies, setTopicReplies] = useState(null);
    const [userTopic, setUserTopic] = useState(null);
    const [userReplies, setUserReplies] = useState(null);
    const [userEngaged, setEngagedReplies] = useState(null);
    const [userSubscribe, setSubscribeReplies] = useState(null);
    

    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'))
    const getForums = async (page, search) => {
        try {
            const res = await axios.post(`https://buzzinguniverse.com/backend/api/get-forums-request`, {
                user_id: auth?.id,
                page: page,
                search: search || '',
            });
            const products = await res.data;
            setForum(products);
        } catch (error) {
            console.log(error)
        }
    };

    const getTopics = async (id, page, search) => {
        try {
            const res = await axios.post(`https://buzzinguniverse.com/backend/api/get-topic-request`, {
                forum_id: id,
                user_id: auth?.id,
                page: page,
                search: search || '',
            });
            const products = await res.data;
            setTopics(products);
        } catch (error) {
            console.log(error)
        }
    };

    const getTopicReplies = async (id, page, search) => {
        try {
            const res = await axios.post(`https://buzzinguniverse.com/backend/api/get-forum-reply-request`, {
                topic_id: id,
                user_id: auth?.id,
                page: page,
                search: search || '',
            });
            const products = await res.data;
            setTopicReplies(products);
        } catch (error) {
            console.log(error)
        }
    };

    const subscribe = async (type, target_id) => {
        try {
            const res = await axios.post(`https://buzzinguniverse.com/backend/api/subscribe-request`, {
                type,
                user_id: auth?.id,
                target_id,
            });
            return res.data;
        } catch (error) {
            console.error("Subscribe Error:", error);
        }
    };

    const unsubscribe = async (id, target_id) => {
        try {
            const res = await axios.post(`https://buzzinguniverse.com/backend/api/unsubscribe-request`, {
                id,
                user_id: auth?.id,
                target_id,
            });
            return res.data;
        } catch (error) {
            console.error("Unsubscribe Error:", error);
        }
    };

    const getUserTopics = async (user_id, page, search) => {
        try {
            const res = await axios.post(`https://buzzinguniverse.com/backend/api/get-topic-tab-request`, {
                user_id: user_id,
                page: page,
                search: search || '',
            });
            const products = await res.data;
            setUserTopic(products);
        } catch (error) {
            console.log(error)
        }
    }

    const getUserReplies = async (user_id, page, search) => {
        try {
            const res = await axios.post(`https://buzzinguniverse.com/backend/api/get-replies-tab-request`, {
                user_id: user_id,
                page: page,
                search: search || '',
            });
            const products = await res.data;
            setUserReplies(products);
        } catch (error) {
            console.log(error)
        }
    }

    const getEngagedTopics = async (user_id, page, search) => {
        try {
            const res = await axios.post(`https://buzzinguniverse.com/backend/api/get-engaged-tab-request`, {
                user_id: user_id,
                page: page,
                search: search || '',
            });
            const products = await res.data;
            setEngagedReplies(products);
        } catch (error) {
            console.log(error)
        }
    }

    const getSubscribeTopics = async (user_id, page, search) => {
        try {
            const res = await axios.post(`https://buzzinguniverse.com/backend/api/get-subscribe-tab-request`, {
                user_id: user_id,
                page: page,
                search: search || '',
            });
            const products = await res.data;
            setSubscribeReplies(products);
        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        getForums(1);
        auth && getUserTopics(auth?.id);
    }, [])

    return <ForumContext.Provider value={{ forums, getForums, getTopics, topics, subscribe, unsubscribe, getTopicReplies, TopicReplies, userTopic, getUserTopics, getUserReplies, userReplies, getEngagedTopics, userEngaged, getSubscribeTopics, userSubscribe }} > {children} </ForumContext.Provider>
};

const useForumContext = () => {
    return useContext(ForumContext);
}
export { ForumProvider, ForumContext, useForumContext };
