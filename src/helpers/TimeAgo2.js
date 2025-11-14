// components/TimeAgo.jsx
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const formatDetailedTimeAgo = (timestamp) => {
    const now = dayjs();
    const target = dayjs(timestamp);
    const diffInMinutes = now.diff(target, 'minute');

    if (diffInMinutes < 1) return null; 

    const days = Math.floor(diffInMinutes / 1440);
    const hours = Math.floor((diffInMinutes % 1440) / 60);
    const minutes = diffInMinutes % 60;

    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''}${hours > 0 ? `, ${hours} hour${hours > 1 ? 's' : ''} ago` : ' ago'}`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? `, ${minutes} minute${minutes > 1 ? 's' : ''} ago` : ' ago'}`;
    } else {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
};

const TimeAgo2 = ({ timestamp }) => {
    const formatted = formatDetailedTimeAgo(timestamp);
    if (!formatted) return null;

    return <span>{formatted}</span>;
};

export default TimeAgo2;
