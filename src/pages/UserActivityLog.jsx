import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import RenderHtml from '../helpers/RenderHtml';

const ActivityCard = ({ activity }) => {
    const userName = `${activity.user?.first_name || ''} ${activity.user?.last_name || ''}`.trim();

    return (
        <div className="activity-card">
            <div className="activity-avatar">
                <img
                    src={activity.user?.photo ? `https://buzzinguniverse.com/backend/${activity.user.photo}` : '/default-avatar.png'}
                    alt="user avatar"
                />
            </div>
            <div className="activity-content">
                <div className="activity-header">
                    {activity.type === 'comment' ? (
                        <MessageCircle size={16} className="activity-icon" />
                    ) : (
                        <ThumbsUp size={16} className="activity-icon" />
                    )}
                    <span className="activity-user">
                        <strong>{userName}</strong>{' '}
                        {activity.type === 'comment' ? 'commented on' : 'liked'} a post
                    </span>
                    <span className="activity-time">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </span>
                </div>
                {activity.message && (
                    <p className="activity-message">{RenderHtml(activity.message)}</p>
                )}
                <div className="activity-post-title">
                    Post Title: {activity.post?.title || 'Untitled'}
                </div>
            </div>
        </div>
    );
};

const UserActivityLog = ({ userId }) => {
    const [activities, setActivities] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get(`https://buzzinguniverse.com/backend/api/get-activity-log?user_id=${userId}`);
                setActivities(response.data.data);
                setFiltered(response.data.data);
            } catch (err) {
                console.error('Error fetching activities:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [userId]);

    const handleFilter = () => {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        const results = activities.filter((item) => {
            const created = new Date(item.created_at);
            if (start && created < start) return false;
            if (end && created > end) return false;
            return true;
        });

        setFiltered(results);
    };

    if (loading) {
        return (
            <div className="activity-loading" id="pills-tabContent">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="activity-log" id="pills-tabContent">
            <h2 className="activity-title">User Activity Log</h2>

            <div className="activity-filters" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                    <label>From:</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                    <label>To:</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <button onClick={handleFilter} className='btncs' style={{ alignSelf: 'flex-end', padding: '0.5rem 1rem' }}>
                    Apply
                </button>
            </div>

            {filtered.length > 0 ? (
                filtered.map((activity) => (
                    <ActivityCard key={`${activity.type}-${activity.id}`} activity={activity} />
                ))
            ) : (
                <div className="activity-empty">No activity in selected range.</div>
            )}
        </div>
    );
};

export default UserActivityLog;
