import React, { useEffect, useState } from 'react';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

const visibilityOptions = ['Everyone', 'Friends', 'Only Me', 'All Members'];

const fields = [
    { key: 'name', label: 'Name' },
    { key: 'dob', label: 'Date of Birth' },
    { key: 'email', label: 'Email' },
    { key: 'gender', label: 'Gender' },
    { key: 'city', label: 'City' },
    { key: 'country', label: 'Country' },
    { key: 'about', label: 'About' }
];

const ProfileVisibility = () => {
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
    const userId = auth.id;
    const [visibility, setVisibility] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        axios
            .post('https://buzzinguniverse.com/backend/api/get-profile-visibility-request', { user_id: userId })
            .then((res) => {
                setVisibility(res.data.visibility || {});
            })
            .catch((err) => {
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userId]);

    const handleChange = (key, value) => {
        setVisibility((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSubmit = () => {
        setSaving(true);
        axios
            .post('https://buzzinguniverse.com/backend/api/update-profile-visibility-request', {
                user_id: userId,
                visibility
            })
            .then(() => {
            })
            .catch(() => {
            })
            .finally(() => {
                setSaving(false);
            });
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="profile-visibility-settings py-4">
            <h4>Profile Visibility Settings</h4>
            <p>Select who may see your profile details.</p>
            <table className="table">
                <thead>
                    <tr>
                        <th>Field</th>
                        <th>Visibility</th>
                    </tr>
                </thead>
                <tbody>
                    {fields.map((field) => (
                        <tr key={field.key}>
                            <td>{field.label}</td>
                            <td>
                                {(field.key === 'name' || field.key === 'about') ? (
                                    "Everyone"
                                ) : (
                                    <select
                                        value={visibility[field.key] || ''}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        {visibilityOptions.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                onClick={handleSubmit}
                className="btncs"
                disabled={saving}
            >
                {saving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    );
};

export default ProfileVisibility;
