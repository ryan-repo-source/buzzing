import React from 'react'

const Detail = ({handleSubmit, handleChange, loading, group}) => {
    return (
        <div className='detailGroup my-3'>
            <h4 className="group-settings-header mb-2">Group Name & Description</h4>
            <div className="grp_inp">
                <label>Group Name (required)</label>
                <input type="name" name="name" onChange={handleChange} value={group?.name || ''} />
            </div>
            <div className="grp_inp">
                <label>Group Description (required)</label>
                <textarea name='description' onChange={handleChange} defaultValue={group?.description || ''} />
            </div>
            <button onClick={handleSubmit} className='btncs px-5'>{loading ? 'Saving...' : 'Save'}</button>
        </div>
    )
}

export default Detail
