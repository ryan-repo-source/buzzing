import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const SideBarPost = () => {
    const [recent, setRecent] = useState(null);
    const getRecentTopics = () => {
        axios.get(`https://buzzinguniverse.com/backend/api/get-recent-topic-request`).then(function(res){
            setRecent(res.data.data);
        })
    }

    useEffect(() => {
        getRecentTopics()
    }, [])

    if(!recent){
        return false;
    }
    return (
        <>
            <div className="widget_display_topics">
                <h5 className="widget-title">Recent Topics</h5>
                <ul className="bbp-topics-widget newness">
                    {
                        recent.map((r) => (
                            <li><Link className="bbp-forum-title" to={`/forums/${r.forum_id}/topics/${r.id}`}>{r.title}</Link></li>
                        ))
                    }
                </ul>
            </div>
            <ul className="aside-navbar">
                <li><a href="#">Home</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </>
    )
}

export default SideBarPost
