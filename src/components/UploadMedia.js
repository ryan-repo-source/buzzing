import React, { useRef, useState } from 'react';
import axios from 'axios';

const UploadMedia = ({ albums, user_id, getAlbums, setUploadMedia, fetchData, groupId }) => {
    const fileInputRef = useRef(null);
    const [uploadItems, setUploadItems] = useState([]);
    const [dragOver, setDragOver] = useState(false);
    const [albumID, setAlbumId] = useState(null);
    const [message, setMessage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const uploadQueueRef = useRef([]);

    function generateUniqueString() {
        const timestamp = Date.now();
        const randomPart = Math.random().toString(36).substring(2, 10);
        return `${timestamp}-${randomPart}`;
    }

    const handleFiles = (selectedFiles) => {
        if (!albumID) {
            setMessage("Select Album Before Upload");
            return;
        }

        const uniqueKey = generateUniqueString();
        const newItems = Array.from(selectedFiles).map(file => {
            const newItem = {
                file,
                progress: 0,
                cancelToken: axios.CancelToken.source(),
                unique_key: uniqueKey,
                uploading: false,
                status: 'Pending',
            };
            uploadQueueRef.current.push(newItem); // add to upload queue
            return newItem;
        });

        setUploadItems(prev => [...prev, ...newItems]);

        if (!isUploading) {
            uploadNextFile();
        }
    };

    const uploadNextFile = async () => {
        const item = uploadQueueRef.current.shift(); // Get first from queue

        if (!item) {
            setIsUploading(false);
            return;
        }

        setIsUploading(true);
        updateItem(item.file, { uploading: true, status: 'Uploading' });

        await uploadFile(item);

        uploadNextFile(); // Call next after upload
    };

    const uploadFile = async (item) => {
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('user_id', user_id);
        formData.append('album_id', albumID);
        groupId && formData.append('group_id', groupId);
        formData.append('unique_key', item.unique_key);

        try {
            await axios.post('https://buzzinguniverse.com/backend/api/post-media-request', formData, {
                cancelToken: item.cancelToken.token,
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    updateItem(item.file, { progress: percent });
                },
            });

            updateItem(item.file, { uploading: false, status: 'Completed', progress: 100 });
            getAlbums(user_id);
            fetchData();
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Upload canceled:', item.file.name);
            } else {
                updateItem(item.file, { uploading: false, status: 'Failed' });
                console.error('Upload failed:', error);
            }
        }
    };

    const updateItem = (file, changes) => {
        setUploadItems(prev =>
            prev.map(i => (i.file === file ? { ...i, ...changes } : i))
        );
    };

    const cancelUpload = (file) => {
        setUploadItems(prev => {
            const updatedItems = prev.map(i => {
                if (i.file === file) {
                    if (i.cancelToken) {
                        i.cancelToken.cancel();
                    }
                    return {
                        ...i,
                        uploading: false,
                        status: 'Cancelled',
                    };
                }
                return i;
            });
            uploadQueueRef.current = uploadQueueRef.current.filter(i => i.file !== file);
            return updatedItems;
        });
    };


    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
    };

    const CloseMedia = () => {
        setUploadMedia(false);
        setUploadItems([]);
        setAlbumId(null);
        setMessage(null);
        uploadQueueRef.current = [];
        setIsUploading(false);
    }

    return (
        <div
            className={`upload-box-unique ${dragOver ? 'dragover' : ''}`}
            onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
        >
            <span className='closeMedia' onClick={CloseMedia}>x</span>
            <div className="rowf">
                <label>
                    <i className="fas fa-images"></i> Album:
                    <select onChange={(e) => setAlbumId(e.target.value)}>
                        <option hidden selected>Select Album</option>
                        {albums && albums.map((alb) => (
                            <option key={alb.id} value={alb.albums.id}>{alb.albums.title}</option>
                        ))}
                    </select>
                </label>
                <label>
                    <i className="fas fa-eye"></i> Privacy:
                    <select>
                        <option>Public</option>
                        <option>Friends</option>
                        <option>Private</option>
                    </select>
                </label>
            </div>

            <div className="upload-controls">
                <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
                    Select your files
                </button>
                <span>or</span>
                <span>Drop your files here</span>
                <span className="info-icon">
                    <i className="fas fa-info"></i>
                </span>
            </div>

            {message && <p className='error'>{message}</p>}

            <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => handleFiles(e.target.files)}
            />
            <br />
            {uploadItems.map((item, idx) => {
                const { name, type, size } = item.file;
                const fileSizeKB = (size / 1024).toFixed(2);
                const uploadedSizeKB = ((item.progress / 100) * size / 1024).toFixed(2);
                const fileExt = name.split('.').pop().toUpperCase();
                const isImage = type.startsWith("image/");
                const isVideo = type.startsWith("video/");
                const isAudio = type.startsWith("audio/");

                let preview;
                if (isImage) {
                    preview = <img src={URL.createObjectURL(item.file)} alt={name} className="file-thumbnail" />;
                } else if (isVideo) {
                    preview = <img src="/images/video_thumb.png" alt="video" className="file-thumbnail" />;
                } else if (isAudio) {
                    preview = <img src="/images/audio_thumb.png" alt="audio" className="file-thumbnail" />;
                } else {
                    preview = <div className="file-icon">{fileExt}</div>;
                }

                return (
                    <div key={idx} className="file-bar">
                        <div className="file-preview">{preview}</div>
                        <div className="file-details">
                            <div className="file-name">{name}</div>
                            <div className="file-meta">
                                <span>{uploadedSizeKB} KB / {fileSizeKB} KB</span>
                                {item.status === 'Completed' && <span className="status completed">• Completed</span>}
                                {item.status === 'Failed' && <span className="status failed">• Failed</span>}
                                {item.status === 'Pending' && <span className="status pending">• Pending</span>}
                                {item.status === 'Cancelled' && <span className="status cancelled">• Cancelled</span>}
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar" style={{ width: `${item.progress}%` }} />
                            </div>
                        </div>
                        {item.uploading && item.progress < 100 && (
                            <button onClick={() => cancelUpload(item.file)} className="cancel-btn">×</button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default UploadMedia;
