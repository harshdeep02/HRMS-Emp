// src/utils/common/ImportList.jsx

import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { Download, Upload } from 'lucide-react';
import LoadingDots from '../LoadingDots/LoadingDots';

const ImportListCopy = ({ apiFunction, onImportSuccess, children }) => {
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setIsLoading(true);
            setError('');

            Papa.parse(file, {
                header: true, // Assumes the first row of the CSV is headers
                skipEmptyLines: true,
                complete: async (results) => {
                    console.log("Parsed CSV data:", results.data);
                    
                    try {
                        // Process each row from the CSV
                        // Promise.all allows all API calls to run in parallel
                        await Promise.all(results.data.map(row => apiFunction(row)));
                        
                        // If all successful, call the success callback to refresh the list
                        if (onImportSuccess) {
                            onImportSuccess();
                        }
                        alert('Import successful!');

                    } catch (err) {
                        console.error("Error during import API call:", err);
                        setError('An error occurred during import. Please check the console.');
                        alert('An error occurred during import. Please check your data and try again.');
                    } finally {
                        setIsLoading(false);
                    }
                },
                error: (err) => {
                    console.error("PapaParse error:", err);
                    setError('Failed to parse CSV file.');
                    setIsLoading(false);
                }
            });
        }
        // Reset the file input so the user can upload the same file again if needed
        event.target.value = null; 
    };

    const handleButtonClick = () => {
        // Trigger the hidden file input
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
                accept=".csv"
            />
            {/* The visible button */}
            <button className="menu-item" onClick={handleButtonClick} disabled={isLoading}>
                {isLoading ? <LoadingDots color="#000" size={6} /> : (
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

export default ImportListCopy;

// // --- Placeholder Components for Import/Export ---
// const ImportList = ({ apiFunction, onImportSuccess }) => {
//     const handleImport = () => {
//         alert("Import functionality would go here.");
//         // Simulate an API call
//         setTimeout(() => {
//             onImportSuccess();
//         }, 500);
//     };
//     return <button onClick={handleImport} className="menu-item">Import</button>;
// };
