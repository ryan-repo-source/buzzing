import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { usePostContext } from "../context/PostContext";
import { useUserContext } from "../context/UserContext";
import TagFriends from "./TagFriends";

const AddPost = ({ FetchPosts, groupId }) => {
    const [content, setContent] = useState("");
    const [taggedUsers, setTaggedUsers] = useState([]);
    const [file, setFile] = useState(null);
    const [linkPreview, setLinkPreview] = useState('');
    const [mentIds, setMentIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loadingLinkPreview, setLoadingLinkPreview] = useState(false);

    const inputRef = useRef(null);
    const { getPosts } = usePostContext();
    const { myFreinds } = useUserContext();
    const { auth_data } = useUserContext();
    const auth = auth_data;

    const chekStrg = (strg) => {
        if (strg == "https://buzzinguniverse.com/backend/") {
            return null;
        } else {
            return strg
        }
    }


    useEffect(() => {
        const mentionIds = [...inputRef.current.querySelectorAll(".mention")].map((el) => parseInt(el.getAttribute("nav_id")));
        setMentIds(mentionIds);
    }, [content]);


    const extractURL = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const match = text.match(urlRegex);
        return match ? match[0] : null;
    };

    const fetchLinkPreview = async (url) => {
        setLoadingLinkPreview(true);
        try {
            const response = await axios.get(`https://buzzinguniverse.com/backend/api/get-meta-data?url=${encodeURIComponent(url)}`);
            setLinkPreview({ ...response.data, url: url });
        } catch (err) {
            console.error("Error fetching link preview:", err);
            setLinkPreview('');
        } finally {
            setLoadingLinkPreview(false);
        }
    };

    const handleInputChange = (e) => {
        const newHtml = e.target.innerHTML;
        const newText = e.target.textContent;
        setContent(newHtml);

        const lastWord = newText.split(/\s+/).pop();
        if (lastWord.startsWith("@")) {
            const searchQuery = lastWord.slice(1).toLowerCase();
            setFilteredFriends(
                myFreinds.filter(
                    (friend) =>
                        friend.user_data.first_name.toLowerCase().includes(searchQuery) ||
                        friend.user_data.last_name.toLowerCase().includes(searchQuery)
                )
            );
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }

        const detectedURL = extractURL(newText);
        if (detectedURL && !content.includes(`<a href="${detectedURL}"`)) {
            fetchLinkPreview(detectedURL);
            const updatedContent = newText.replace(
                detectedURL,
                `<a href="${detectedURL}" target="_blank">${detectedURL}</a>&nbsp;`
            );

            setContent(updatedContent);
            inputRef.current.innerHTML = updatedContent;

            setTimeout(() => {
                const el = inputRef.current;
                el.focus();
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(el);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            }, 0);
        }
    };

    const handleMentionClick = (friend) => {
        const textBeforeMention = content.substring(0, content.lastIndexOf("@"));
        const mentionHTML = `<span class="mention" nav_id="${friend.id}">@${friend.first_name} ${friend.last_name}</span>&nbsp;`;
        const updatedContent = `${textBeforeMention}${mentionHTML}`;
        inputRef.current.innerHTML = updatedContent;
        setContent(updatedContent);
        setShowDropdown(false);

        setTimeout(() => {
            const el = inputRef.current;
            el.focus();
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(el);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }, 0);
    };

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile && uploadedFile.size <= 512 * 1024 * 1024) {
            setFile(uploadedFile);
            setUploadProgress(0);
        } else {
            setError("File size exceeds the maximum limit of 512MB.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!auth?.id || (!content && !file)) {
            setError("Please enter details or upload a file.");
            return;
        }

        setLoading(true);
        setError(null);
        const taggedUserIds = taggedUsers.map(user => user.user_data.id);

        const formData = new FormData();
        formData.append("user_id", auth?.id);
        formData.append("type", 1);
        formData.append("tag_ids", mentIds);
        formData.append("tagged_ids", taggedUserIds);
        groupId && formData.append("group_id", groupId);
        formData.append("title", "posted an update");
        const live_prv = document.querySelector('#linkPRV');
        formData.append("details", content + (live_prv ? live_prv.innerHTML : ''));
        if (file) formData.append("file", file);
        try {
            const response = await axios.post(
                "https://buzzinguniverse.com/backend/api/post-request",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    },
                }
            );

            if (response.status === 200) {
                setContent("");
                setLinkPreview('');
                setFile(null);
                setUploadProgress(0);
                FetchPosts ? FetchPosts(1, 1) : getPosts(auth?.id)
                inputRef.current.innerHTML = "";
                setMentIds([]);
                setShowForm(false);
            } else {
                throw new Error(response.data.message || "Something went wrong.");
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="what-new-bejan-box">
            <form>
                <ul>
                    <li>
                        <Link to={`/member/${auth?.id}/profile`}>
                            <img src={chekStrg(auth.photo) || "/images/b.png"} alt="profile" />
                        </Link>
                    </li>
                    <li>
                        <div
                            ref={inputRef}
                            className="open_div"
                            contentEditable
                            onInput={handleInputChange}
                            onClick={() => setShowForm(true)}
                        />
                        {!showForm && <div className="placeholder_div">What's New, {auth.fname}?</div>}
                        {showDropdown && (
                            <ul className="friends-dropdown">
                                {filteredFriends.map((friend) => (
                                    <li key={friend.id} onClick={() => handleMentionClick(friend.user_data)}>
                                        {friend.user_data.first_name} {friend.user_data.last_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {linkPreview && !loadingLinkPreview && linkPreview.image && linkPreview.title && linkPreview.description && (
                            <>
                                <span className="btn-removeLink" onClick={() => setLinkPreview('')}>x</span>
                                <div id="linkPRV">
                                    <a href={linkPreview.url} target="_blank">
                                        <div className="link-preview">
                                            <img src={linkPreview.image} alt={linkPreview.title} className="link-preview-image" />
                                            <div className="link-preview-content">
                                                <h4 className="link-preview-title">{linkPreview.title}</h4>
                                                <p className="link-preview-description">{linkPreview.description}</p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </>
                        )}
                        {loadingLinkPreview && (
                            <div className="loadin m-4">
                                {/* <span>Loading preview...</span> */}
                            </div>
                        )}
                    </li>
                </ul>
                {showForm && (
                    <div className="what-new-bejan-box-add-media">
                        <ul className="max-file-size-box">
                            <li>
                                <input type="file" className="form-control" onChange={handleFileChange} />
                                {file && uploadProgress > 0 && (
                                    <div className="progress-bar-container">
                                        <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                )}
                            </li>
                            <li><span>Max. File Size: 512MB</span></li>
                            <li>
                                <select className="form-select" defaultValue={20}>
                                    <option value={60}>Private</option>
                                    <option value={40}>Friends</option>
                                    <option value={20}>Logged in Users</option>
                                    <option value={0}>Public</option>
                                </select>
                            </li>
                            <TagFriends myFreinds={myFreinds} setTaggedUsers={setTaggedUsers} taggedUsers={taggedUsers} />
                        </ul>
                        {taggedUsers.length > 0 && (
                            <div className="tf-tagged-users">
                                <strong>{auth.fname}</strong> is with&nbsp;
                                {taggedUsers.slice(0, 3).map((u, index) => (
                                    <span key={u.user_data.id} className="tf-tag-badge ms-1">
                                        {u.user_data.first_name} {u.user_data.last_name}
                                        {index < Math.min(2, taggedUsers.length - 1) && ','}
                                    </span>
                                ))}
                                {taggedUsers.length > 3 && (
                                    <span className="tf-tag-badge ms-1">
                                        and {taggedUsers.length - 3} others
                                    </span>
                                )}
                            </div>
                        )}

                        <ul className="post-in-profile">
                            <li>
                                <select name="whats-new-post-in" className="form-select">
                                    <option value="profile">Post in: Profile</option>
                                    <option value="group">Post in: Group</option>
                                </select>
                            </li>
                            <li>
                                <a onClick={() => setShowForm(false)} className="activity-canel">Cancel</a>
                                <a onClick={handleSubmit} className={`activity-post ${loading && "loadin"}`} disabled={loading}>
                                    {loading ? "Posting" : "Post Update"}
                                </a>
                            </li>
                        </ul>
                        {error && <p className="error-message">{error}</p>}
                    </div>
                )}
            </form>
        </div>
    );
};

export default AddPost;
