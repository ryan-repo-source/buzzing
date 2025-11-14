import React, { useRef, useState, useEffect } from "react";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

const Cover_photo = () => {
    const [file, setFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    const storedUser = JSON.parse(secureLocalStorage.getItem("auth_data")) || {};
    const userId = storedUser.id || "";

    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }

            setPreviewImage(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async (e) => {
        e.target.classList.add("loadin");
        if (!file) {
            setMessage("Please select an image first!");
            setMessageType("error");
            e.target.classList.remove("loadin");
            return;
        }

        if (!userId) {
            setMessage("User ID not found. Please log in again.");
            setMessageType("error");
            e.target.classList.remove("loadin");
            return;
        }

        const formData = new FormData();
        formData.append("id", userId);
        formData.append("cover_photo", file);

        try {
            const response = await axios.post(
                "https://buzzinguniverse.com/backend/api/update-user",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                window.location.reload();
                setMessage("Image uploaded successfully!");
                setMessageType("success");
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error("Upload failed:", error);
            setMessage("Failed to upload image.");
            setMessageType("error");
        }
        e.target.classList.remove("loadin");
    };

    return (
        <div className="image-upload-container">
            {!previewImage && (
                <div className="file-upload-wrapper">
                    <label className="file-upload-box mb-0">
                        <input
                            type="file"
                            accept=".png, .jpeg, .jpg, .webp"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            hidden
                        />
                        <div className="upload-content">
                            <FaCloudUploadAlt className="upload-icon" />
                            <h5 className="mb-2">Upload your Cover picture</h5>
                        </div>
                    </label>
                </div>
            )}
            {previewImage && (
                <div className="profile-image-preview mt-4 text-center">
                    <img
                        src={previewImage}
                        alt="Profile Preview"
                    />
                    <button
                        onClick={handleUpload}
                    >
                        Set Cover Picture
                    </button>
                    <button
                        onClick={() => {
                            setFile(null);
                            setPreviewImage(null);
                            setMessage(null);
                        }}
                    >
                        <FaTimes /> Remove
                    </button>
                    {message && (
                        <p className={`message ${messageType === "success" ? "success-message" : "error-message"}`}>
                            {message}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Cover_photo;
