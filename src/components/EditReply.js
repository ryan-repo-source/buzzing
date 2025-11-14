import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import RenderHtml from '../helpers/RenderHtml';

const EditReply = ({ reply, onSuccess, setEditData, auth_data }) => {
    const [content, setContent] = useState('');
    const [notify, setNotify] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (reply) {
            setContent(reply.comment || '');
            setNotify(Boolean(reply.notify));
        }
    }, [reply]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await axios.post('https://buzzinguniverse.com/backend/api/edit-forum-reply-request', {
                id: reply.id,
                user_id: auth_data.id,
                comment: content,
                notify: notify ? 1 : 0
            });
            onSuccess?.();
        } catch (err) {
            console.error(err);
            alert('Failed to update the reply.');
        } finally {
            setLoading(false);
        }
    };

    const ParentPreview = () =>
        reply?.reply_data && reply.reply_data !== 'false' && (
            <div className="forum-post-body">
                {RenderHtml(reply.reply_data.comment)}
            </div>
        );

    return (
        <div className="add_topic-form">
            <div className="tile-fom mb-4">Editing reply “#{reply?.id}”</div>
            <ParentPreview />
            <Editor
                apiKey="jjoezv7zjhdqr8rlsyfxlcrfp36kxt1fx0aaeboyoucksasy"
                value={content}
                onEditorChange={setContent}
                init={{
                    height: 300,
                    menubar: false,
                    plugins: 'link image code',
                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
                }}
            />
            <div className="field-wraps-checkbox mt-4">
                <label>
                    <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} />{' '}
                    Notify me of follow-up replies via email
                </label>
            </div>
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
            </button>

            <button onClick={() => setEditData(null)} className="btn bg-danger text-white ms-3 mt-0">
                Cancel
            </button>
        </div>
    );
};

export default EditReply;
