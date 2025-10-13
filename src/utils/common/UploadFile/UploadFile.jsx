import { useRef, useState } from "react";
import { Trash2, Eye, Upload, Paperclip } from "lucide-react";
import { cloudinaryConfig } from "../../../configs/cloudinaryConfig";
import "./DocumentUpload.scss";
import FileViewer from "../FileViewer/FileViewer";
import pdfIcon from '../../../assets/pdf.png';
import { toast } from "react-toastify";

const UploadedFileItem = ({ file, onView, onRemove, isDetailView }) => {
    if (!file || !file.url) return null;
    const isImage = file.type?.startsWith("image/");
    return (
        <div className={`uploaded-item ${isDetailView ? 'detail-view' : ''}`}>
            <div className="item-icon">
                {isImage ? <img src={file.url} alt={file.name} className="uploaded-image" /> : <img src={pdfIcon} alt="PDF" />}
            </div>
            <div className="item-details">
                <div className="item-main-title">{file.name}</div>
                {!isDetailView && <div className="item-sub-title">Click to Preview</div>}
            </div>
            <div className="item-actions">
                <button type="button" className="view-btn" onClick={() => onView(file)}>
                    <Eye size={16} /> View
                </button>
                {!isDetailView && (
                    <button type="button" className="delete-btn" onClick={() => onRemove(file)}>
                        <Trash2 size={16} /> Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export const UploadFile = ({
    formData,
    setFormData,
    fieldName,
    multiple = false,
    isDetailView = false,
    className
}) => {
    const fileInputRef = useRef(null);
    const [uploadProgress, setUploadProgress] = useState({});
    const [viewingFile, setViewingFile] = useState(null);

    // Safe parse attachments from formData
    const files = formData?.[fieldName] || [];
    const fileArray = Array.isArray(files)
        ? files.map(f => (typeof f === 'string' ? JSON.parse(f) : f)).filter(Boolean)
        : [];

    const uploadFile = (file) => {
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
            toast.error(`Invalid file type: ${file.name}`);
            return;
        }
        if (file.size > 1 * 1024 * 1024) {
            toast.error(`File size > 1MB: ${file.name}`);
            return;
        }

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", cloudinaryConfig.uploadPreset);
        const endpoint = file.type.startsWith("image/") ? "image/upload" : "raw/upload";
        const xhr = new XMLHttpRequest();
        const url = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${endpoint}`;
        xhr.open("POST", url, true);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(prev => ({ ...prev, [file.name]: percent }));
            }
        };

        xhr.onload = () => {
            setUploadProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[file.name];
                return newProgress;
            });

            if (xhr.status === 200) {
                const result = JSON.parse(xhr.responseText);
                const newFileObject = { name: file.name, url: result.secure_url, type: file.type };

                setFormData(current => {
                    const existingFiles = current[fieldName] || [];
                    const updatedFiles = multiple ? [...existingFiles, newFileObject] : [newFileObject];
                    return { ...current, [fieldName]: updatedFiles };
                });
                toast.success(`Uploaded: ${file.name}`);
            } else {
                toast.error(`Upload failed for ${file.name}`);
            }
        };

        xhr.onerror = () => {
            toast.error(`Network error during upload of ${file.name}`);
            setUploadProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[file.name];
                return newProgress;
            });
        };

        xhr.send(data);
    };

    const handleFileSelect = (e) => {
        const selected = Array.from(e.target.files);
        selected.forEach(uploadFile);
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    const handleRemove = (fileToRemove) => {
        const updatedFiles = fileArray.filter(file => file.url !== fileToRemove.url);
        setFormData(prev => ({ ...prev, [fieldName]: updatedFiles }));
    };

    const handleView = (file) => setViewingFile(file);

    const showUploadBox = !isDetailView && (!fileArray.length || multiple);

    return (
        <div className={`document-upload-container ${className}`}>
            {fileArray.length > 0 && (
                <div className="uploaded-files-list">
                    {fileArray.map((file, idx) => (
                        <UploadedFileItem
                            key={idx}
                            file={file}
                            onView={handleView}
                            onRemove={handleRemove}
                            isDetailView={isDetailView}
                        />
                    ))}
                </div>
            )}

            {Object.keys(uploadProgress).length > 0 && (
                <div className="progress-list">
                    {Object.entries(uploadProgress).map(([name, percent]) => (
                        <div key={name} className="progress-bar-item">
                            <Paperclip size={16} />
                            <span className="file-name">{name}</span>
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${percent}%` }} />
                            </div>
                            <span className="progress-percent">{percent}%</span>
                        </div>
                    ))}
                </div>
            )}

            {showUploadBox && (
                <div className="upload-box" onClick={() => fileInputRef.current.click()}>
                    <Upload size={26} />
                    {/* <p>Upload {fieldName.replace('_', ' ')}</p> */}
                    <p>Upload Document</p>
                    <span>File Size Should Be Below 1 MB</span>
                </div>
            )}

            {fileArray.length === 0 && isDetailView && (
                <div className="no-document-text">No Document Uploaded</div>
            )}

            <input
                type="file"
                accept="image/*,.pdf"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileSelect}
                multiple={multiple}
            />

            <FileViewer isOpen={!!viewingFile} onClose={() => setViewingFile(null)} file={viewingFile} />
        </div>
    );
};