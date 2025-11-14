import React, { useState, useEffect } from 'react';
import { useMediaContext } from '../context/MediaContext';

const EditAlbum = ({ userId, getAlbums, EditData, setEdit }) => {
    const { updateAlbum } = useMediaContext();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (EditData) {
            setTitle(EditData.albums.title || '');
            setDescription(EditData.albums.description || '');
        }
    }, [EditData]);

    const handleSubmit = async () => {
        if (!title.trim()) {
            alert('Title is required');
            return;
        }
        setLoading(true);
        const res = await updateAlbum(EditData.albums.id, title, description);
        setMessage(res.message);
        setLoading(false);
        getAlbums(userId);
    };

    return (
        <div className='album_add_popup editForm'>
            <h4>Edit Album</h4>
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
            <button onClick={handleSubmit} className={loading ? 'loadin' : ''}>
                Update Album
            </button>
            <button onClick={() => setEdit(false)} className='bg-danger text-white border-0 ms-3'>
                Cancel
            </button>
        </div>
    );
};

export default EditAlbum;
