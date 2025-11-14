import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FaRegEye } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';
import classNames from 'classnames';
import secureLocalStorage from 'react-secure-storage';
import TimeAgo from '../helpers/TimeAgo';

const Notification = () => {
  const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
  const userId = auth?.id;

  const [notifications, setNotifications] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');

  // Keep latest notifications for unmount handler
  const notificationsRef = useRef([]);
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://buzzinguniverse.com/backend/api/get-notifications-request?user_id=${userId}`);
      setNotifications(res.data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark all as read when visiting the page
  useEffect(() => {
    const markAllAsReadOnVisit = async () => {
      if (notifications.length === 0) return;
      
      const unreadIds = notifications.filter((n) => n.is_read === '0').map((n) => n.id);
      if (unreadIds.length === 0) return;
      
      try {
        await axios.post('https://buzzinguniverse.com/backend/api/bulk-mark-notification-read-request', {
          notification_ids: unreadIds,
        });
        // Update local state to reflect read status
        setNotifications((prev) => prev.map((n) => (unreadIds.includes(n.id) ? { ...n, is_read: '1' } : n)));
      } catch (err) {
        console.error('Error marking all as read on visit:', err);
      }
    };

    // Only run after notifications are loaded
    if (notifications.length > 0) {
      markAllAsReadOnVisit();
    }
  }, [notifications.length]); // Run when notifications are first loaded

  const handleMarkAsRead = async (id) => {
    try {
      await axios.get(`https://buzzinguniverse.com/backend/api/mark-notification-read-request?notification_id=${id}`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: '1' } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (ids) => {
    try {
      await axios.post('https://buzzinguniverse.com/backend/api/delete-notification-request', { notification_ids: ids });
      setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)));
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;

    if (action === 'read') {
      try {
        await axios.post('https://buzzinguniverse.com/backend/api/bulk-mark-notification-read-request', {
          notification_ids: selectedIds,
        });
        setNotifications((prev) => prev.map((n) => (selectedIds.includes(n.id) ? { ...n, is_read: '1' } : n)));
      } catch (err) {
        console.error(err);
      }
    } else if (action === 'delete') {
      await handleDelete(selectedIds);
    }

    setSelectedIds([]);
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((_id) => _id !== id) : [...prev, id]));
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Show unread first, then read; inside each group sort by date
  const sortedNotifications = [...notifications].sort((a, b) => {
    const aUnread = a.is_read === '0';
    const bUnread = b.is_read === '0';

    if (aUnread !== bUnread) return aUnread ? -1 : 1; // unread first

    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Mark all as read on page leave/unmount
  useEffect(() => {
    const markAllAsRead = async () => {
      const unreadIds = notificationsRef.current.filter((n) => n.is_read === '0').map((n) => n.id);
      if (unreadIds.length === 0) return;
      try {
        await axios.post('https://buzzinguniverse.com/backend/api/bulk-mark-notification-read-request', {
          notification_ids: unreadIds,
        });
      } catch (err) {
        console.error('Error marking all as read on leave:', err);
      }
    };

    // On unmount
    return () => {
      markAllAsRead();
    };
  }, []);

  return (
    <div className="personal_right_box">
      {/* Removed tabs; showing all notifications with unread emphasized */}

      <div className="tab-content" id="pills-tabContent">
        {loading ? (
          <div className="loader_post_wrap mt-5">
            <div className="loader_Post"></div>
          </div>
        ) : sortedNotifications.length === 0 ? (
          <div className="sorry-activity-found p-4" style={{ width: '75%' }}>
            <ul className="m-0">
              <li>
                <i className="fas fa-info" />
              </li>
              <li>
                <p>No notifications found.</p>
              </li>
            </ul>
          </div>
        ) : (
          <div className="notification-container">
            <table className="notification-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        sortedNotifications.length > 0 &&
                        sortedNotifications.every((n) => selectedIds.includes(n.id))
                      }
                      onChange={(e) =>
                        setSelectedIds(e.target.checked ? sortedNotifications.map((n) => n.id) : [])
                      }
                    />
                  </th>
                  <th>Notification</th>
                  <th onClick={toggleSortOrder} style={{ cursor: 'pointer' }}>
                    Date Received <span className="sort-arrow">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedNotifications.map((notification) => (
                  <tr
                    key={notification.id}
                    className={classNames({ unread: notification.is_read === '0' })}
                    style={{ 
                      fontWeight: notification.is_read === '0' ? 600 : 400,
                      backgroundColor: notification.is_read === '0' ? '#f8f9ff' : 'transparent',
                      borderLeft: notification.is_read === '0' ? '4px solid #007bff' : '4px solid transparent'
                    }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(notification.id)}
                        onChange={() => handleCheckboxChange(notification.id)}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {notification.is_read === '0' && (
                          <span 
                            style={{ 
                              width: '8px', 
                              height: '8px', 
                              backgroundColor: '#007bff', 
                              borderRadius: '50%',
                              flexShrink: 0
                            }}
                            title="Unread"
                          />
                        )}
                        <a href={notification.notification_link || '#'}>{notification.notification_text}</a>
                      </div>
                    </td>
                    <td>
                      <TimeAgo date={notification.created_at} />
                    </td>
                    <td>
                      <span className="icon" title="Delete" onClick={() => handleDelete([notification.id])}>
                        <FaTimes />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bulk-actions">
              <select onChange={(e) => handleBulkAction(e.target.value)} value="">
                <option value="">Bulk Actions</option>
                <option value="read">Mark as Read</option>
                <option value="delete">Delete</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;