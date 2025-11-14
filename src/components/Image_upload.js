import React, { useRef, useState, useEffect, useCallback } from "react";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import Cropper from "react-easy-crop";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { useUserContext } from "../context/UserContext";

const ImageUpload = ({ fetchUser }) => {

    const { getAuth } = useUserContext();

    const [file, setFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const fileInputRef = useRef(null);
    const storedUser = JSON.parse(secureLocalStorage.getItem("auth_data")) || {};
    const userId = storedUser?.id || "";
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, []);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewImage(URL.createObjectURL(selectedFile));
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
        canvas.toBlob((blob) => setCroppedImage(blob), "image/jpeg");
    };

    const handleUpload = async (e) => {
        e.target.classList.add("loadin");
        if (!croppedImage) {
            setMessage("Please crop and confirm the image first!");
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
        formData.append("photo", croppedImage, "profile.jpg");
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
                getAuth();
                fetchUser();
                setMessage("Image uploaded successfully!");
                setMessageType("success");
            } else {
                throw new Error("Unexpected API response");
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
                            <h5 className="mb-2">Upload your profile picture</h5>
                        </div>
                    </label>
                </div>
            )}
            {previewImage && !croppedImage && (
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
                        setFile(null);
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
                    <button onClick={handleUpload}>Set Profile Picture</button>
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

export default ImageUpload;