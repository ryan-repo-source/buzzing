import React, { useEffect, useState } from 'react';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

const EmailSetting = () => {
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
    const userId = auth.id;

    const [notifications, setNotifications] = useState({
        comment_reply: false,
        friend_accept: false,
        friend_request: false,
        group_invite: false,
        group_promotion: false,
        group_request: false,
        group_request_response: false,
        group_update: false,
        membership_accept: false,
        mention: false,
        new_message: false
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        axios.get(`https://buzzinguniverse.com/backend/api/get-email-notification-request?user_id=${userId}`)
            .then(res => {
                if (res.data.code === 200 && res.data.notifications) {
                    setNotifications(res.data.notifications);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (key, value) => {
        setNotifications(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSubmit = () => {
        setSaving(true);
        axios.post('https://buzzinguniverse.com/backend/api/update-email-notification-request', {
            user_id: userId,
            notifications
        }).finally(() => setSaving(false));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="email-settings py-4">
            <h4>Email Notifications</h4>
            <div className="email-settings-description">
                Set your email notification preferences.
            </div>

            {/* Activity Section */}
            <Section title="Activity">
                <SettingRow label='A member mentions you in an update using "@buxx"' name="mention" value={notifications.mention} onChange={handleChange} />
                <SettingRow label="A member replies to an update or comment you've posted" name="comment_reply" value={notifications.comment_reply} onChange={handleChange} />
            </Section>

            {/* Messages Section */}
            <Section title="Messages">
                <SettingRow label="A member sends you a new message" name="new_message" value={notifications.new_message} onChange={handleChange} />
            </Section>

            {/* Members Section */}
            <Section title="Members">
                <SettingRow label="Someone accepts your membership invitation" name="membership_accept" value={notifications.membership_accept} onChange={handleChange} />
            </Section>

            {/* Friends Section */}
            <Section title="Friends">
                <SettingRow label="A member sends you a friendship request" name="friend_request" value={notifications.friend_request} onChange={handleChange} />
                <SettingRow label="A member accepts your friendship request" name="friend_accept" value={notifications.friend_accept} onChange={handleChange} />
            </Section>

            {/* Groups Section */}
            <Section title="Groups">
                <SettingRow label="A member invites you to join a group" name="group_invite" value={notifications.group_invite} onChange={handleChange} />
                <SettingRow label="Group information is updated" name="group_update" value={notifications.group_update} onChange={handleChange} />
                <SettingRow label="You are promoted to a group administrator or moderator" name="group_promotion" value={notifications.group_promotion} onChange={handleChange} />
                <SettingRow label="A member requests to join a private group for which you are an admin" name="group_request" value={notifications.group_request} onChange={handleChange} />
                <SettingRow label="Your request to join a group has been approved or denied" name="group_request_response" value={notifications.group_request_response} onChange={handleChange} />
            </Section>

            <button className="btncs" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    );
};

const Section = ({ title, children }) => (
    <div className="email-section">
        <div className="email-section-heading">{title}</div>
        {children}
    </div>
);

const SettingRow = ({ label, name, value, onChange }) => (
    <div className="email-setting-row">
        <div className="email-setting-label">{label}</div>
        <div className="email-radio-group">
            <div className="custom-radio">
                <input
                    type="radio"
                    name={name}
                    checked={value === true}
                    onChange={() => onChange(name, true)}
                />
                <label>Yes</label>
            </div>
            <div className="custom-radio">
                <input
                    type="radio"
                    name={name}
                    checked={value === false}
                    onChange={() => onChange(name, false)}
                />
                <label>No</label>
            </div>
        </div>
    </div>
);

export default EmailSetting;
