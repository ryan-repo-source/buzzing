import React, { useState } from 'react';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

const PRIVACY_OPTIONS = [
    { value: 1, label: 'Private - Visible only to the user' },
    { value: 2, label: "Friends - Visible to user's friends" },
    { value: 3, label: 'Logged in Users - Visible to registered users' },
    { value: 4, label: 'Public - Visible to the world' },
];

const DefaultPrivacy = ({ defaultPrivacy }) => {
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
    const [selectedPrivacy, setSelectedPrivacy] = useState(defaultPrivacy);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (value) => {
        setSelectedPrivacy(value);
        setMessage(null);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const response = await axios.get(
                `https://buzzinguniverse.com/backend/api/privacy/update?default_privacy=${selectedPrivacy}&user_id=${auth.id}`
            );
            setMessage({ type: 'success', text: 'Privacy setting updated successfully.' });
        } catch (error) {
            console.error('Error updating privacy:', error);
            setMessage({ type: 'error', text: 'Failed to update privacy setting.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='defaultprivacy py-4'>
            <h4 className='py-2 mb-3 border-bottom'>Default Privacy</h4>

            {PRIVACY_OPTIONS.map(option => (
                <div className="custom-radio mb-2" key={option.value}>
                    <input
                        type="radio"
                        id={`privacy-${option.value}`}
                        name="privacy"
                        checked={selectedPrivacy === option.value}
                        onChange={() => handleChange(option.value)}
                    />
                    <label htmlFor={`privacy-${option.value}`} className="ms-2">
                        {option.label}
                    </label>
                </div>
            ))}

            <div className="d-flex gap-2 mt-3">
                <button
                    type="button"
                    className="btncs"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

export default DefaultPrivacy;
