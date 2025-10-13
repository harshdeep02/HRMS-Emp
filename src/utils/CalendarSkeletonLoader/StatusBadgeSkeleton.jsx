import React from 'react';
import './StatusBadgeSkeleton.scss';

const StatusBadgeSkeleton = ({ hasDot = true }) => {
  return (
    <div className="Status-badge-Skeleton">
      {hasDot && <div className="Skeleton-dot"></div>}
      <div className="Skeleton-text"></div>
    </div>
  );
};

export default StatusBadgeSkeleton;