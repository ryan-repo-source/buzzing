import React from 'react'

const Setting = ({ handleSubmit, handleChange, loading, group }) => {
    return (
        <div className="group-settings-container">
            <h2 className="group-settings-header">Change Group Settings</h2>
            <div className="group-settings-section">
                <h3 className="group-settings-title">Privacy Options</h3>
                <label className="group-settings-option">
                    <input type="radio" onClick={handleChange} name="privacy" value="public" className="group-settings-radio" checked={group.privacy === 'public'} />
                    This is a public group
                    <ul className="group-settings-details">
                        <li>Any site member can join this group.</li>
                        <li>This group will be listed in the groups directory and in search results.</li>
                        <li>Group content and activity will be visible to any site member.</li>
                    </ul>
                </label>
                <label className="group-settings-option">
                    <input type="radio" onClick={handleChange} name="privacy" value="private" className="group-settings-radio" checked={group.privacy === 'private'} />
                    This is a private group
                    <ul className="group-settings-details">
                        <li>Only people who request membership and are accepted can join the group.</li>
                        <li>This group will be listed in the groups directory and in search results.</li>
                        <li>Group content and activity will only be visible to members of the group.</li>
                    </ul>
                </label>
                <label className="group-settings-option">
                    <input type="radio" onClick={handleChange} name="privacy" value="hidden" className="group-settings-radio" checked={group.privacy === 'hidden'}/>
                    This is a hidden group
                    <ul className="group-settings-details">
                        <li>Only people who are invited can join the group.</li>
                        <li>This group will not be listed in the groups directory or search results.</li>
                        <li>Group content and activity will only be visible to members of the group.</li>
                    </ul>
                </label>
            </div>
            <div className="group-settings-section">
                <h3 className="group-settings-title">Group Invitations</h3>
                <label className="group-settings-option">
                    <input type="radio" onClick={handleChange} checked={group.invitation === 'anyone'} value="anyone" name="invitation" className="group-settings-radio" defaultChecked />
                    All group members
                </label>
                <label className="group-settings-option">
                    <input type="radio" onClick={handleChange} checked={group.invitation === 'invite_only'} value="invite_only" name="invitation" className="group-settings-radio" />
                    Group admins and mods only
                </label>
                <label className="group-settings-option">
                    <input type="radio" onClick={handleChange} checked={group.invitation === 'admin_only'} value="admin_only" name="invitation" className="group-settings-radio" />
                    Group admins only
                </label>
            </div>
            <button onClick={handleSubmit} className='btncs px-5'>{loading ? 'Saving...' : 'Save'}</button>
        </div>
    )
}

export default Setting
