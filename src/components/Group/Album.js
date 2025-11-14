import React from 'react'

const Album = ({ handleSubmit, handleChange, loading, group }) => {
    return (
        <div className="group-settings-container">
            <h2 className="group-settings-header mb-2">Album Creation Control</h2>
            <p>Who can create Albums in this group?</p>
            <div className="group-settings-section mt-4">
                <h3 className="group-settings-title">Group Invitations</h3>
                <label className="group-settings-option">
                    <input type="radio" onClick={handleChange} checked={group.album_setting === 'enabled'} value="enabled" name="album_setting" className="group-settings-radio" defaultChecked />
                    All Group Members
                </label>
                <label className="group-settings-option">
                    <input type="radio" onClick={handleChange} checked={group.album_setting === 'admins_mods'} value="admins_mods" name="album_setting" className="group-settings-radio" />
                    Group admins and mods only
                </label>
                <label className="group-settings-option">
                    <input type="radio" onClick={handleChange} checked={group.album_setting === 'admin_only'} value="admin_only" name="album_setting" className="group-settings-radio" />
                    Group admins only
                </label>
            </div>
            <button onClick={handleSubmit} className='btncs px-5'>{loading ? 'Saving...' : 'Save'}</button>
        </div>
    )
}

export default Album
