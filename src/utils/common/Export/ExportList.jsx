// src/utils/common/ExportList.jsx

import React from 'react';
import { CSVLink } from 'react-csv';
import { Download, Import, Upload } from 'lucide-react'; // Using Upload icon for export as per your code

const ExportList = ({ data, headers, filename, children }) => {
    // This function prepares the data before exporting.
    // It uses the 'key' from each header to access the correct value,
    // including nested objects.
    const formatDataForExport = (dataToFormat) => {
        return dataToFormat.map(item => {
            const row = {};
            headers.forEach(header => {
                // If the key is a function, execute it to get the value
                if (typeof header.key === 'function') {
                    row[header.label] = header.key(item);
                } else {
                    // Simple key access (will not work for nested objects without custom logic)
                    // For simplicity, we primarily rely on the function-based key
                    row[header.label] = item[header.key];
                }
            });
            return row;
        });
    };           

    const formattedData = formatDataForExport(data);

    return (
        <CSVLink
            data={formattedData}
            // Headers are not needed here since we pre-format the data with labels as keys
            filename={filename}
            className="menu-item"
            target="_blank"
        >
            {/* You can customize what the button/link looks like */}
            {children ? children : (
                <>
                    <Import size={20} />
                    <span>Export</span>
                </>
            )}
        </CSVLink>
    );
};

export default ExportList;



// const ExportList = ({ data, headers, filename }) => {
//     const handleExport = () => {
//         // Simple CSV export logic for demonstration
//         const headerRow = headers.map(h => h.label).join(",");
//         const dataRows = data.map(row =>
//             headers.map(header => row[header.key]).join(",")
//         ).join("\n");
//         const csvString = `${headerRow}\n${dataRows}`;
//         const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
//         const link = document.createElement("a");
//         if (link.download !== undefined) {
//             const url = URL.createObjectURL(blob);
//             link.setAttribute("href", url);
//             link.setAttribute("download", filename);
//             link.style.visibility = 'hidden';
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         }
//         alert("Exporting data...");
//     };
//     return <button onClick={handleExport} className="menu-item">Export</button>;
// };