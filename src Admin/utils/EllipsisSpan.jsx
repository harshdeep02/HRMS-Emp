import React from 'react';
import Tooltips from './common/Tooltip/Tooltips';

export default function EllipsisSpan({ text, wordsToShow = 5 }) {
    const safeText = text || '';
    const words = safeText.split(' ');
    const isTruncated = words.length > wordsToShow;

    const displayText = isTruncated
        ? words.slice(0, wordsToShow).join(' ') + '...'
        : safeText;

    // Agar truncate hua hai to tooltip show karo, warna simple span
    if (isTruncated) {
        return (
            <Tooltips title={safeText} placement="top" arrow={true}>
                <span>{displayText}</span>
            </Tooltips>
        );
    }

    return <span>{displayText}</span>;
}
