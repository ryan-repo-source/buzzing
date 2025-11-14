import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';

const Delete = ({ groupId, onDeleteSuccess }) => {
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    const handleDelete = async () => {
        const confirm = window.confirm(
            'Are you sure you want to permanently delete this group? This action cannot be undone.'
        );
        if (!confirm) return;

        try {
            setLoading(true);
            setError(null);
            await axios.get(`https://buzzinguniverse.com/backend/api/groups/delete?group_id=${groupId}`);
            setLoading(false);
            window.location.replace('/groups');
        } catch (err) {
            setLoading(false);
            setError('Failed to delete group. Please try again.');
        }
    };

    return (
        <div className="group-delete-warning-box">
            <h2 className="group-settings-header mb-2">Delete this group</h2>
            <div className="group-warning-message">
                <span className="group-warning-icon"><FaInfoCircle /></span>
                <span className="group-warning-text">
                    <strong>WARNING:</strong> Deleting this group will completely remove ALL content associated with it.
                    There is no way back. Please be careful with this option.
                </span>
            </div>

            <div className="group-confirmation">
                <input
                    type="checkbox"
                    id="group-confirm-checkbox"
                    className="group-confirm-checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                />
                <label htmlFor="group-confirm-checkbox" className="group-confirm-label">
                    I understand the consequences of deleting this group.
                </label>
            </div>

            {error && <p className="group-error-message">{error}</p>}

            <button
                className="group-delete-button"
                onClick={handleDelete}
                disabled={!isChecked || loading}
            >
                {loading ? 'Deleting...' : 'Delete Group'}
            </button>
        </div>
    );
};

export default Delete;
