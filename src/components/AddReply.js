import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import RenderHtml from '../helpers/RenderHtml';

const AddReply = ({ topicID, forumID, replyData, auth_data, forumTitle, getTopicReplies, tags, setReplyData, FormElement }) => {
    const [form, setForm] = useState({ notify: false });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const editorRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!editorRef.current?.getContent({ format: 'text' }).trim()) newErrors.comment = 'Required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        const data = {
            topic_id: topicID,
            forum_id: forumID,
            user_id: auth_data.id,
            reply_id: replyData?.id || 0,
            reply_data: replyData,
            comment: editorRef.current.getContent(),
            tags: tags,
            notify: form.notify ? 1 : 0
        };
        try {
            setLoading(true);
            await axios.post('https://buzzinguniverse.com/backend/api/post-forum-reply-request', data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            getTopicReplies(topicID, 1);
            setForm({ tags: '', notify: false });
            editorRef.current.setContent('');
            setErrors({});
        } catch (err) {
            console.log('Error submitting!', err);
        } finally {
            setLoading(false);
            setReplyData(null);
        }
    };


    return (
        <div className='add_topic-form' ref={FormElement}>
            <div className='tile-fom mb-4'>{replyData ? `Reply To: Reply #${replyData.id} in ${forumTitle}` : `Replying in “${forumTitle}”`}</div>
            {replyData && <div className="forum-post-body">
                <span className='removeReply' onClick={() => setReplyData(null)}>x</span>
                {RenderHtml(replyData.comment)}
            </div>}

            <div className='text--editor'>
                <Editor
                    apiKey='jjoezv7zjhdqr8rlsyfxlcrfp36kxt1fx0aaeboyoucksasy'
                    onInit={(e, editor) => editorRef.current = editor}
                    initialValue=""
                    init={{ height: 300, menubar: false, plugins: 'link image code', toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code' }}
                />
                {errors.comment && <div className="error">{errors.comment}</div>}
            </div>

            {/* <div className='field-wraps'>
                <label>Tags:</label>
                <input name="tags" defaultValue={form.tags} onChange={handleChange} />
                {errors.tags && <div className="error">{errors.tags}</div>}
            </div> */}

            <div className='field-wraps-checkbox mt-4'>
                <input type='checkbox' name="notify" checked={form.notify} onChange={handleChange} />
                <label>Notify me of follow-up replies via email</label>
            </div>

            <button onClick={handleSubmit} className={loading ? 'loadin' : ''} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
            </button>
        </div>
    );
};

export default AddReply;
