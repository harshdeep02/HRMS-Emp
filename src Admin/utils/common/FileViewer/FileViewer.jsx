import React, { useRef } from "react";
import "./FileViewer.scss";
import { CircleX } from "lucide-react";
import { pdfjs } from "react-pdf";

// Worker path set karo
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FileViewer = ({ isOpen, onClose, file }) => {
    const overlayRef = useRef(null);

    if (!isOpen || !file) return null;

    const isImage = file?.type?.startsWith("image");
    const isPDF = file?.type === "application/pdf";
    console.log('file')
    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    return (
        <div
            className="file-viewer-overlay"
            ref={overlayRef}
            onClick={handleOverlayClick}
        >
            <div className="file-viewer">
                <div className="file-viewer-header">
                    <span className="file-title">{file.name}</span>
                    {/* <span className="file-type">
                        {isImage ? "Image" : isPDF ? "PDF Document" : file.type}
                    </span> */}
                    <button className="close-btn" onClick={onClose}><CircleX strokeWidth={1.5} /></button>
                </div>
                <div className="file-viewer-content">
                    {isImage && (
                        <img src={file.url} alt={file.name} className="viewer-media" />
                    )}
                    {isPDF && (
                        <iframe
                            src={`https://docs.google.com/viewer?url=${file.url}&embedded=true`}
                            className="viewer-media"
                            title="PDF Viewer"
                        ></iframe>
                    )}
                    {!isImage && !isPDF && <p>Preview not available.</p>}
                </div>
            </div>
        </div>
    );
};

export default FileViewer;
