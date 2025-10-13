// src/components/ProfileImageUpload/ProfileImageUpload.jsx

import React, { useState, useEffect, useRef } from "react";
import { Eye, Trash2 } from "lucide-react";
import "./ProfileImageUpload.scss";
import profilePlaceholder from "../../../assets/profile-upload-icon.png";
import pdfIcon from "../../../assets/pdf.png";
import { cloudinaryConfig } from "../../../configs/cloudinaryConfig";
import FileViewer from "../FileViewer/FileViewer";

export const ProfileImageUpload = ({
    formData,
    setFormData,
    fieldName,
    setError,
}) => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(formData?.[fieldName]?.url || null);
    const [progress, setProgress] = useState(0);
    const [localError, setLocalError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [opens, setOpens] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState(null);

    useEffect(() => {
        setPreviewUrl(formData?.[fieldName]?.url || null);
    }, [formData, fieldName]);

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setLocalError("");
        if (setError) setError((prev) => ({ ...prev, [fieldName]: null }));

        if (selectedFile.size > 2 * 1024 * 1024) {
            setLocalError("File size should be below 2MB");
            if (setError)
                setError((prev) => ({ ...prev, [fieldName]: "File size should be below 2MB" }));
            setFile(null);
            return;
        }

        setFile(selectedFile);

        // Local preview
        if (selectedFile.type.startsWith("image/")) {
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setPreviewUrl(pdfIcon); // PDF icon
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setLocalError("Please select a file first.");
            return;
        }

        setIsUploading(true);
        setProgress(0);
        setLocalError("");

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", cloudinaryConfig.uploadPreset);

        const endpoint = file.type.startsWith("image/") ? "image/upload" : "raw/upload";

        const xhr = new XMLHttpRequest();
        xhr.open(
            "POST",
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${endpoint}`
        );

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded * 100) / event.total);
                setProgress(percent);
            }
        };

        xhr.onload = () => {
            setIsUploading(false);
            if (xhr.status === 200) {
                const result = JSON.parse(xhr.responseText);
                setFile(null);

                const type = file.type.startsWith("image/") ? "image" : "pdf";

                setFormData((prevData) => ({
                    ...prevData,
                    [fieldName]: {
                        url: result.secure_url,
                        type: type,
                    },
                }));

                setPreviewUrl(type === "image" ? result.secure_url : pdfIcon);
            } else {
                console.error("Upload failed:", xhr.responseText);
                setLocalError("Upload failed.");
                if (setError)
                    setError((prev) => ({ ...prev, [fieldName]: "Upload failed" }));
            }
        };

        xhr.onerror = () => {
            setIsUploading(false);
            setLocalError("Upload failed.");
            if (setError)
                setError((prev) => ({ ...prev, [fieldName]: "Upload failed" }));
        };

        xhr.send(data);
    };

    const handleDelete = () => {
        setFormData((prevData) => ({ ...prevData, [fieldName]: null }));
        setPreviewUrl(null);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setProgress(0);
    };

    const currentFileUrl = formData?.[fieldName]?.url || null;
    const currentFileType = formData?.[fieldName]?.type || "image";

    const handleView = (docUrl, type) => {
        setSelectedFiles({
            name: "Uploaded File",
            url: docUrl,
            type: type === "image" ? "image/jpeg" : "application/pdf",
        });
        setOpens(true);
    };

    return (
        <div className="profile-uploader">
            <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileSelect}
                ref={fileInputRef}
                style={{ display: "none" }}
                id={`profile-file-input-${fieldName}`}
                autoComplete="off"
            />

            <div className="preview-section">
                {isUploading ? (
                    <div
                        className="progress-circle"
                        style={{
                            background: `conic-gradient(#00b894 ${progress}%, #e0e0e0 ${progress}%)`,
                        }}
                    >
                        <span className="progress-text">{progress}%</span>
                    </div>
                ) : (
                    <div className="image-preview">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" />
                        ) : (
                            <img className="icon" src={profilePlaceholder} alt="Placeholder" />
                        )}
                    </div>
                )}
            </div>

            <div className="info-section">
                {!file && (
                    <>
                        <h4>Upload Profile Picture / PDF</h4>
                        <p>File size should be below 2MB</p>
                    </>
                )}
                {localError && <p className="error-text">{localError}</p>}
            </div>

            <div className="action-section">
                {!file && !isUploading && !currentFileUrl && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="upload-btn"
                    >
                        Choose File
                    </button>
                )}

                {file && !isUploading && (
                    <>
                        <button type="button" onClick={handleUpload} className="upload-btn">
                            Upload Now
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setFile(null);
                                setPreviewUrl(null);
                                setLocalError("");
                            }}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                    </>
                )}

                {currentFileUrl && !isUploading && (
                    <div className="icon-buttons">
                        <button
                            type="button"
                            onClick={() => handleView(currentFileUrl, currentFileType)}
                            className="icon-btn"
                            title="View"
                        >
                            <Eye size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="icon-btn"
                            title="Delete"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                )}
            </div>

            <FileViewer
                isOpen={opens}
                onClose={() => setOpens(false)}
                file={selectedFiles}
            />
        </div>
    );
};
