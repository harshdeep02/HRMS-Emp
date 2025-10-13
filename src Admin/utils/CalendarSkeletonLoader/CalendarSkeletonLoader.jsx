import React from 'react';
import './CalendarSkeletonLoader.scss'; // SCSS file ko import karein

const CalendarSkeletonLoader = () => {
  // Calendar header ke liye skeleton
  const renderHeader = () => (
    <div className="skeleton-calendar-header">
      <div className="skeleton-placeholder-block-sm"></div> {/* "Attendance Summary" */}
      <div className="skeleton-header-right">
        <div className="skeleton-placeholder-circle"></div> {/* Left arrow */}
        <div className="skeleton-placeholder-circle"></div> {/* Right arrow */}
        <div className="skeleton-placeholder-block-md"></div> {/* "September 2025" */}
      </div>
    </div>
  );

  // Weekdays (SUN, MON, etc.) ke liye skeleton
  const renderWeekdays = () => (
    <div className="skeleton-weekdays-row">
      {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, index) => (
        <div key={index} className="skeleton-weekday-cell">
          <div className="skeleton-placeholder-block-sm"></div>
        </div>
      ))}
    </div>
  );

  // Calendar cells (dates) ke liye skeleton
  const renderCalendarCells = () => {
    const cells = [];
    const totalCells = 28; // 5 rows of 7 days
    for (let i = 0; i < totalCells; i++) {
      cells.push(
        <div key={i} className="skeleton-calendar-cell">
          <div className="skeleton-date-wrapper">
            <div className="skeleton-placeholder-circle-sm"></div> {/* Date number */}
          </div>
          {i % 3 === 0 && ( // Randomly add small tags to mimic the design
            <div className="skeleton-tag-wrapper">
              <div className="skeleton-placeholder-tag"></div>
            </div>
          )}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="skeleton-calendar-loader">
      {renderHeader()}
      {renderWeekdays()}
      <div className="skeleton-calendar-grid">
        {renderCalendarCells()}
      </div>
    </div>
  );
};

export default CalendarSkeletonLoader;