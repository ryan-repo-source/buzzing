import React, { useRef, useState, useEffect, useCallback } from "react";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import Cropper from "react-easy-crop";

const ProfilePicture = ({ handleSubmit, handleFileChange, loading, type }) => {

    const [previewImage, setPreviewImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const fileInputRef = useRef(null);

    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, []);

    const handleFileChangeIN = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;
    
        const previewURL = URL.createObjectURL(selectedFile);
        setPreviewImage(previewURL);
    
        if (type !== "profile_picture") {
            const fakeEvent = {
                target: {
                    name: type,
                    files: [selectedFile]
                }
            };
            handleFileChange(fakeEvent);
            setCroppedImage(selectedFile);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const generateCroppedImage = async () => {
        if (!previewImage || !croppedAreaPixels) return;

        const image = new Image();
        image.src = previewImage;
        await image.decode();

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
        );

        canvas.toBlob((blob) => {
            if (blob) {
                setCroppedImage(blob);
                const fakeEvent = {
                    target: {
                        name: type,
                        files: [new File([blob], "cropped.jpg", { type: "image/jpeg" })]
                    }
                };
                handleFileChange(fakeEvent);
            }
        }, "image/jpeg");
    };

    const handleUpload = async (e) => {
        e.target.classList.add("loadin");
        if (!croppedImage) {
            setMessage("Please crop and confirm the image first!");
            setMessageType("error");
            e.target.classList.remove("loadin");
            return;
        }
        await handleSubmit(e);
        setMessage("Image uploaded successfully!");
        setMessageType("success");
        e.target.classList.remove("loadin");
        setCroppedImage(null);
        setPreviewImage(null);
    };

    return (
        <div className="image-upload-container mt-3">
            <h2 className="group-settings-header mb-3">Group {type == "profile_picture" ? "Profile Photo" : "Cover Photo"}</h2>
            {type == "profile_picture" && <p>Add an image to use as a profile photo for this group. The image will be shown on the main group page, and in search results.</p>}
            {!previewImage && (
                <div className="file-upload-wrapper">
                    <label className="file-upload-box mb-0">
                        <input
                            type="file"
                            accept=".png, .jpeg, .jpg, .webp"
                            ref={fileInputRef}
                            onChange={handleFileChangeIN}
                            className="hidden"
                            hidden
                        />
                        <div className="upload-content">
                            <FaCloudUploadAlt className="upload-icon" />
                            <h5 className="mb-2">Upload your {type == "profile_picture" ? "Profile Photo" : "Cover Photo"}</h5>
                        </div>
                    </label>
                </div>
            )}
            {previewImage && !croppedImage && type === "profile_picture" && (
                <div className="cropper-container">
                    <div className="cropper-wrapper">
                        <Cropper
                            image={previewImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                    <button onClick={generateCroppedImage}>Crop Image</button>
                    <button onClick={() => {
                        setPreviewImage(null);
                        setMessage(null);
                    }}>
                        <FaTimes /> Remove
                    </button>
                </div>
            )}

            {croppedImage && (
                <div className="profile-image-preview mt-4 text-center">
                    <img src={URL.createObjectURL(croppedImage)} alt="Cropped Preview" />
                    <button onClick={handleUpload}>{loading ? 'Saving...' : `Set ${type == "profile_picture" ? 'Profile Picture' : 'Cover Photo'}`}</button>
                    <button onClick={() => {
                        setCroppedImage(null);
                        setPreviewImage(null);
                        setMessage(null);
                    }}>
                        <FaTimes /> Remove
                    </button>
                    {message && (
                        <p className={`message ${messageType === "success" ? "success-message" : "error-message"}`}>{message}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfilePicture
