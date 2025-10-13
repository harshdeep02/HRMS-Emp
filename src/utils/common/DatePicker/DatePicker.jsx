import React, { useState, useEffect, useRef } from 'react';
import './DatePicker.scss';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import useOutsideClick from '../../../components/common/hooks/useOutsideClick';

// Helper function to format a Date object into "DD Mon YYYY" string
const formatDate = (date, months) => {
    if (!date) return null;
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month.substring(0, 3)} ${year}`; // e.g., "22 Aug 2025"
};

const DatePicker = ({ onDateChange, initialDate }) => {
    // Helper function to parse a string like "22 Aug 2025" into a Date object
    const parseInitialDate = (dateStr) => {
        if (dateStr && new Date(dateStr).toString() !== 'Invalid Date') {
            return new Date(dateStr);
        }
        return null; // Return null if no valid initial date
    };

    const [showPicker, setShowPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(parseInitialDate(initialDate));
    const [currentViewDate, setCurrentViewDate] = useState(parseInitialDate(initialDate) || new Date());

    const dropdownRef = useRef(null);
    useOutsideClick(dropdownRef, () => setShowPicker(false));

    useEffect(() => {
        const newDate = parseInitialDate(initialDate);
        setSelectedDate(newDate);
        setCurrentViewDate(newDate || new Date());
    }, [initialDate]);

    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 2 + i);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => (new Date(year, month, 1).getDay() + 6) % 7;

    const renderDays = () => {
        const year = currentViewDate.getFullYear();
        const month = currentViewDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayIndex = getFirstDayOfMonth(year, month);
        const days = [];

        const prevMonthDays = getDaysInMonth(year, month - 1);
        for (let i = firstDayIndex; i > 0; i--) {
            days.push(<div key={`prev-${i}`} className="dayS outside-month">{prevMonthDays - i + 1}</div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const isSelected = selectedDate && selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === i;
            days.push(
                <div key={i} className={`dayS ${isSelected ? 'selected' : ''}`} onClick={() => setSelectedDate(new Date(year, month, i))}>
                    {i}
                </div>
            );
        }

        const nextDays = 42 - days.length;
        for (let i = 1; i <= nextDays; i++) {
            days.push(<div key={`next-${i}`} className="dayS outside-month">{i}</div>);
        }
        return days;
    };

    const handleYearSelect = (year) => {
        setCurrentViewDate(new Date(year, currentViewDate.getMonth(), 1));
    };

    const handlePrevMonth = () => {
        setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handleAccept = () => {
        onDateChange(selectedDate);
        setShowPicker(false);
    };

    // UPDATED: This button now clears the date
    const handleCancel = () => {
        onDateChange(null); // Clear the date in the parent component
        setSelectedDate(null);      // Clear the internal selected state
        setShowPicker(false);     // Close the picker
    };

    return (
        <div className="date-picker-container" ref={dropdownRef}>
            {/* UPDATED: The icon is now simple again, as you requested */}
            <div className="date-picker-icon-box" onClick={() => setShowPicker(!showPicker)}>
                <Calendar 
                 color={selectedDate ? "#9542D9" : "#000"} 
                className='calendar-icon' size={20} strokeWidth={1.5} />
            </div>

            {showPicker && (
                <div className="date-picker-popup">
                    <div className="date-picker-left">
                        <div className="year-title">Year</div>
                        <div className="year-list">
                            {years.map(year => (
                                <div key={year} className={`year-item ${currentViewDate.getFullYear() === year ? 'selected' : ''}`} onClick={() => handleYearSelect(year)}>
                                    {year}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="date-picker-right">
                        <div className="header">
                            <span className="arrow" onClick={handlePrevMonth}><ChevronLeft size={20} /></span>
                            <span className="month-year">{months[currentViewDate.getMonth()]} {currentViewDate.getFullYear()}</span>
                            <span className="arrow" onClick={handleNextMonth}><ChevronRight size={20} /></span>
                        </div>
                        <div className="week-days">
                            {daysOfWeek.map(day => <div key={day} className="week-day">{day}</div>)}
                        </div>
                        <div className="days-grid">
                            {renderDays()}
                        </div>
                        <div className="actions">
                            <button className="cancel-button" onClick={handleCancel}>Clear</button>
                            <button className="accept-button" onClick={handleAccept}>Accept</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;