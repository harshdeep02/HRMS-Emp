// DocumentUpload.jsx
import { useRef, useState, useEffect } from "react";
import { Trash2, Eye, Upload, Paperclip } from "lucide-react";
import { cloudinaryConfig } from "../../../configs/cloudinaryConfig";
import "./DocumentUpload.scss";
import FileViewer from "../FileViewer/FileViewer";
import pdfIcon from '../../../assets/pdf.png';
import imgIcon from '../../../assets/profile-upload-icon.png';
import { toast } from "react-toastify";

const UploadedFileItem = ({ file, onView, onRemove, isDetailView }) => {
    if (!file || !file.url) {
        return null;
    }
    const isImage = file.type?.startsWith("image/");
    return (
        <div className={`uploaded-item ${isDetailView ? 'detail-view' : ''}`}>
            <div className="item-icon">
                <img src={isImage ? imgIcon : pdfIcon} alt={isImage ? "Image" : "PDF"} />
            </div>
            <div className="item-details">
                <div className="item-main-title">{file.name}</div>
            </div>
            <div className="item-actions">
                <button type="button" className="view-btn" onClick={() => onView(file)}>
                    {/* <Eye size={16} />  */}
                    View
                </button>
                {/* ✅ FIX: Delete button now shows when not in detail view */}
                {!isDetailView && (
                    <button type="button" className="delete-btn" onClick={() => onRemove(file)}>
                        {/* <Trash2 size={16} /> */}
                         Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export const DocumentUpload = ({
    formData,
    setFormData,
    fieldName,
    section,
    index,
    setLoading,
    className,
    isEditPage, // This prop is used to control the read-only state
    fileName,
    disabled = false,
}) => {
    const fileInputRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [viewingFile, setViewingFile] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);

    useEffect(() => {
        let rawData = formData?.[section]?.[index]?.[fieldName] || null;

        // ✅ FIX: More robust data normalization to prevent garbled text
        if (rawData) {
            if (typeof rawData === 'string') {
                try {
                    // First, check if it's a stringified JSON object
                    const parsed = JSON.parse(rawData);
                    if (typeof parsed === 'object' && parsed.url) {
                        rawData = parsed;
                    }
                } catch (e) {
                    // If parsing fails, it's just a URL string
                    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(rawData);
                    rawData = {
                        name: rawData.substring(rawData.lastIndexOf('/') + 1) || 'Uploaded File',
                        url: rawData,
                        type: isImage ? 'image/jpeg' : 'application/pdf',
                    };
                }
            }
            setCurrentFile(rawData);
        } else {
            setCurrentFile(null);
        }
    }, [formData, section, index, fieldName]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Only PDF, JPG, or PNG files are allowed.");
            return;
        }

        if (file.size > 1 * 1024 * 1024) { // 1MB limit
            toast.error(`File size must be less than 1MB.`);
            return;
        }

        setProgress(1); // Start progress at 1 to show the bar immediately
        if (setLoading) setLoading(true);

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", cloudinaryConfig.uploadPreset);

        const endpoint = file.type.startsWith("image/") ? "image/upload" : "raw/upload";
        const url = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${endpoint}`;

        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setProgress(percent);
            }
        };

        xhr.onload = () => {
            if (setLoading) setLoading(false);
            setProgress(0); // Hide progress bar on completion

            if (xhr.status === 200) {
                const result = JSON.parse(xhr.responseText);
                const newFileObject = {
                    name: file.name,
                    url: result.secure_url,
                    type: file.type,
                };

                const newFormData = JSON.parse(JSON.stringify(formData));
                if (!newFormData[section]) newFormData[section] = [];
                if (!newFormData[section][index]) newFormData[section][index] = {};
                newFormData[section][index][fieldName] = newFileObject;

                setFormData(newFormData);
                toast.success(`Uploaded: ${file.name}`);
            } else {
                toast.error(`Upload failed for ${file.name}`);
            }
        };

        xhr.onerror = () => {
            if (setLoading) setLoading(false);
            setProgress(0);
            toast.error(`A network error occurred during the upload.`);
        };

        xhr.send(data);
    };

    const handleRemove = () => {
        const newFormData = JSON.parse(JSON.stringify(formData));
        if (newFormData[section]?.[index]) {
            newFormData[section][index][fieldName] = null;
        }
        setFormData(newFormData);
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    // A simple flag to determine if the component is in a read-only state.
    const isDetailView = disabled || isEditPage;

    return (
        <div className={`document-upload-container ${className}`}>
            {currentFile && currentFile.url ? (
                <UploadedFileItem
                    file={currentFile}
                    onView={setViewingFile}
                    onRemove={handleRemove}
                    isDetailView={isDetailView}
                />
            ) : (
                // ✅ FIX: UI now stays visible during upload
                <div
                    className={`upload-box ${isDetailView ? 'disabled' : ''} ${progress > 0 ? 'uploading' : ''}`}
                    onClick={() => !isDetailView && progress === 0 && fileInputRef.current.click()}
                >
                    {progress > 0 ? (
                        <div className="progress-bar-item">
                            <Paperclip size={16} />
                            <span className="file-name">Uploading...</span>
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${progress}%` }} />
                            </div>
                            <span className="progress-percent">{progress}%</span>
                        </div>
                    ) : (
                        <>
                            <Upload size={26} />
                            <p>{fileName || "Upload Document"}</p>
                            <span>File Size Should Be Below 1 MB</span>
                        </>
                    )}
                </div>
            )}

            <input
                type="file"
                accept="image/*,.pdf"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileSelect}
                disabled={isDetailView || progress > 0}
            />

            <FileViewer
                isOpen={!!viewingFile}
                onClose={() => setViewingFile(null)}
                file={viewingFile}
            />
        </div>
    );
};