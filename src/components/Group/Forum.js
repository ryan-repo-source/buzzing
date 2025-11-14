import React from 'react';

const Forum = ({ handleSubmit, handleChange, loading, group }) => {
    return (
        <div className="group-settings-container">
            <h2 className="group-settings-header mb-3">Group Forum Settings</h2>
            <div className="group-settings-section p-0 border-0 mb-2">
                <p>
                    Create a discussion forum to allow members of this group to communicate
                    in a structured, bulletin-board style fashion.
                </p>
                <label className="group-settings-option">
                    <input
                        type="checkbox"
                        name="forum_enabled"
                        className="group-settings-checkbox me-2"
                        checked={group.forum_enabled == 1}
                        onChange={(e) => handleChange({
                            target: {
                                name: 'forum_enabled',
                                value: e.target.checked ? 1 : 0
                            }
                        })}
                    />
                    Yes. I want this group to have a forum.
                </label>
                <p>Saying no will not delete existing forum content.</p>
            </div>
            <button onClick={handleSubmit} className='btncs px-5'>
                {loading ? 'Saving...' : 'Save'}
            </button>
        </div>
    );
};

export default Forum;
