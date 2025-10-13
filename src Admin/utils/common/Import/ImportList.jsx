// src/utils/common/ImportList.jsx
import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import LoadingDots from '../LoadingDots/LoadingDots';

const ImportList = ({ onFileSelect, loading, children }) => {
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);

        try {
            await onFileSelect(file);   // delegate to parent
        } finally {
            setIsLoading(false);
            event.target.value = null; // reset input so same file can be reuploaded
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".csv,.xlsx"
            />

            {/* The visible button */}
            <button
                className="menu-item"
                onClick={handleButtonClick}
                disabled={isLoading || loading}
            >
                {(isLoading || loading) ? (
                    <LoadingDots color="#000" size={6} />
                ) : (
                    children ? children : (
                        <>
                            <Upload size={20} />
                            <span>Import</span>
                        </>
                    )
                )}
            </button>

            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
        </>
    );
};

export default ImportList;
