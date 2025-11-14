import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';

const AddTopic = ({ forumID, auth_data, getTopics, forumTitle }) => {
    const [form, setForm] = useState({ title: '', tags: '', notify: false });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const editorRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.title.trim()) newErrors.title = 'Required';
        else if (form.title.length > 80) newErrors.title = 'Max 80 characters';
        if (!editorRef.current?.getContent({ format: 'text' }).trim()) newErrors.description = 'Required';
        if (!form.tags.trim()) newErrors.tags = 'Required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        const data = {
            forum_id: forumID,
            user_id: auth_data.id,
            title: form.title,
            description: editorRef.current.getContent(),
            tags: form.tags,
            notify: form.notify ? 1 : 0
        };
        try {
            setLoading(true);
            await axios.post('https://buzzinguniverse.com/backend/api/post-topic-request', data,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            getTopics(forumID, 1);
            setForm({ title: '', tags: '', notify: false });
            editorRef.current.setContent('');
            setErrors({});
        } catch (err) {
            console.log('Error submitting!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='add_topic-form'>
            <div className='tile-fom'>Create New Topic in “{forumTitle}”</div>

            <div className='field-wraps'>
                <label>Topic Title (Max 80):</label>
                <input name="title" value={form.title} onChange={handleChange} />
                {errors.title && <div className="error">{errors.title}</div>}
            </div>

            <div className='text--editor'>
                <Editor
                    apiKey='jjoezv7zjhdqr8rlsyfxlcrfp36kxt1fx0aaeboyoucksasy'
                    onInit={(e, editor) => editorRef.current = editor}
                    initialValue=""
                    init={{ height: 300, menubar: false, plugins: 'link image code', toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code' }}
                />
                {errors.description && <div className="error">{errors.description}</div>}
            </div>

            <div className='field-wraps'>
                <label>Topic Tags:</label>
                <input name="tags" value={form.tags} onChange={handleChange} />
                {errors.tags && <div className="error">{errors.tags}</div>}
            </div>

            <div className='field-wraps-checkbox'>
                <input type='checkbox' name="notify" checked={form.notify} onChange={handleChange} />
                <label>Notify me of follow-up replies via email</label>
            </div>

            <button onClick={handleSubmit} className={loading && 'loadin'} disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
        </div>
    );
};

export default AddTopic;
