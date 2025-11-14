import React, { useState } from 'react';
import { useMediaContext } from '../context/MediaContext';

const AddAlbum = ({ setAddPopup, userId, getAlbums, groupId }) => {
    const { createAlbums } = useMediaContext();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const Submit = async () => {
        if (!title.trim()) {
            alert('Title is required');
            return;
        }
        setLoading(true)
        const res = await createAlbums(userId, title, description, groupId || null);
        setMessage(res.message);
        setLoading(false)
        setTimeout(() => {
            getAlbums(groupId || userId);
            setAddPopup(false);
            setTitle('');
            setDescription('');
        }, 1000)
    };

    return (
        <div className='album_add_popup'>
            <h4>Create an Album</h4>
            <span onClick={() => setAddPopup(false)} style={{ cursor: 'pointer' }}>x</span>
            <div className='grp_inp'>
                <label>Title</label>
                <input 
                    type='text' 
                    name='title' 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                />
            </div>
            <div className='grp_inp'>
                <label>Description</label>
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                />
            </div>
            {message && <p>{message}</p>}
            <button onClick={Submit} className={loading && 'loadin'}>Create Album</button>
        </div>
    );
};

export default AddAlbum;
