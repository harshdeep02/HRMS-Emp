import React, { useRef, useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import profileIcon from "../../../assets/userpicImg.png";
import { cloudinaryConfig } from "../../../configs/cloudinaryConfig";
import "./UserProfileImageUpload.scss";

export const UserProfileImageUpload = ({
  formData,
  setFormData,
  fieldName,
  setError,
  isEditMode
}) => {

  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(formData?.[fieldName] || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setPreviewUrl(formData?.[fieldName] || null);
  }, [formData, fieldName]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tempPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(tempPreviewUrl);
    setUploading(true);
    setProgress(0);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", cloudinaryConfig.uploadPreset);

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          setFormData((prev) => ({ ...prev, [fieldName]: result.secure_url }));
          setPreviewUrl(result.secure_url);
        } else {
          if (setError) setError({ [fieldName]: "Upload failed" });
          console.error("Upload failed:", xhr.responseText);
          setPreviewUrl(formData?.[fieldName] || null);
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        if (setError) setError({ [fieldName]: "Upload failed" });
        setPreviewUrl(formData?.[fieldName] || null);
      };

      xhr.send(data);
    } catch (err) {
      setUploading(false);
      console.error("Upload Error:", err);
      if (setError) setError({ [fieldName]: "Upload failed" });
      setPreviewUrl(formData?.[fieldName] || null);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setFormData((prev) => ({ ...prev, [fieldName]: null }));
  };
  const isEditPage = location.pathname.includes("edit-employee");


  return (
    // We use a fragment <> to avoid adding extra divs that might break layout
    <>
      <div className="profile-avatar">
        <div className={`avatar-wrapper ${previewUrl ? 'has-image' : ''}`}>
          {uploading && (
            <svg className="progress-ring" width="120" height="120">
              <circle className="progress-ring-bg" cx="60" cy="60" r="54" strokeWidth="6" />
              <circle
                className="progress-ring-bar"
                cx="60" cy="60" r="54" strokeWidth="10"
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={2 * Math.PI * 54 - (progress / 100) * (2 * Math.PI * 54)}
              />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="progress-text">
                {progress}%
              </text>
            </svg>
          )}

          <img
            src={previewUrl || profileIcon}
            alt="Profile"
            className="avatar-img"
          />

          {/* Pencil Icon Button is restored */}
          {isEditMode &&
            <button
              type="button"
              className="edit-btn"
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
            >
              <Pencil size={16} />
            </button>
          }
          {previewUrl && !uploading && isEditPage && (
            <button
              type="button"
              className="remove-btn"
             
            >
            <span className="remoBtn"  onClick={handleRemove}>
              Remove
            </span>
            </button>
          )}
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      {/* Action Buttons are added below, only visible when there's a previewUrl */}

    </>
  );
};