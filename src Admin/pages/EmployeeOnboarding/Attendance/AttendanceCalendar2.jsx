import React, { useState, useRef, useEffect } from "react";
import "./AttendanceCalendar.scss";
import { ChevronDown } from "lucide-react";

const dummyAttendanceData = [
  { date: "01-09-2025", status: "0", shift_name: "Morning", punch_in: "09:02", punch_out: "18:01" },
  { date: "02-09-2025", status: "0", shift_name: "Morning", punch_in: "09:01", punch_out: "18:03" },
  { date: "03-09-2025", status: "1" },
  { date: "04-09-2025", status: "0", shift_name: "Morning", punch_in: "09:05", punch_out: "18:00" },
  { date: "05-09-2025", status: "0", shift_name: "Morning", punch_in: "08:55", punch_out: "17:58" },
  { date: "08-08-2025", status: "2", shift_name: "Morning", punch_in: "09:00", punch_out: "13:30" },
  { date: "08-08-2025", status: "0", shift_name: "Morning", punch_in: "08:59", punch_out: "18:05" },
  { date: "09-08-2025", status: "0", shift_name: "Morning", punch_in: "09:00", punch_out: "18:00" },
  { date: "10-08-2025", status: "1" },
  { date: "11-08-2025", status: "0", shift_name: "Morning", punch_in: "09:10", punch_out: "18:10" },
  { date: "12-08-2025", status: "0", shift_name: "Morning", punch_in: "09:00", punch_out: "18:00" },
  { date: "13-08-2025", status: "0", shift_name: "Morning", punch_in: "08:58", punch_out: "18:02" },
];

const AttendanceCalendar2 = ({ attendanceDetail = dummyAttendanceData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState(attendanceDetail);
  const [openDropdownDay, setOpenDropdownDay] = useState(null);
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);

  const dropdownRef = useRef(null);
  const pickerRef = useRef(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownDay(null);
      }
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowMonthYearPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- NEW HANDLER FUNCTION FOR TOGGLING ---
  const handleToggleDropdown = (day) => {
    // If the clicked day's dropdown is already open, close it (set to null).
    // Otherwise, open the clicked day's dropdown.
    setOpenDropdownDay(prevOpenDay => (prevOpenDay === day ? null : day));
  };

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const getDayType = (day) => {
    const dateKey = `${String(day).padStart(2, "0")}-${String(selectedMonth + 1).padStart(2, "0")}-${selectedYear}`;
    const dayDate = new Date(selectedYear, selectedMonth, day);
    const shift = attendanceData?.find((s) => s.date === dateKey);
    const weekday = dayDate.getDay();

    if (weekday === 0) return { type: "weekly-off" };
    if (dayDate > today) return { type: "" };

    let dayStatus = shift ? { "0": "Present", "1": "Absent", "2": "Half-Day" }[shift.status] || "Absent" : "Absent";
    return { type: dayStatus };
  };

  const handleStatusChange = (day, newStatus) => {
    const dateKey = `${String(day).padStart(2, "0")}-${String(selectedMonth + 1).padStart(2, "0")}-${selectedYear}`;
    const newAttendanceData = [...attendanceData];
    const existingEntryIndex = newAttendanceData.findIndex(entry => entry.date === dateKey);
    const statusMap = { "Present": "0", "Absent": "1", "Half-Day": "2" };

    if (existingEntryIndex > -1) {
      newAttendanceData[existingEntryIndex].status = statusMap[newStatus];
    } else {
      newAttendanceData.push({ date: dateKey, status: statusMap[newStatus] });
    }

    setAttendanceData(newAttendanceData);
    setOpenDropdownDay(null);
  };

  const handlePreviousMonth = () => setSelectedDate(new Date(selectedYear, selectedMonth - 1, 1));
  const handleNextMonth = () => setSelectedDate(new Date(selectedYear, selectedMonth + 1, 1));

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDayOfMonth = getFirstDayOfMonth(selectedMonth, selectedYear);

  const isToday = (day) => new Date(selectedYear, selectedMonth, day).getTime() === today.getTime();
  const isPastOrToday = (day) => new Date(selectedYear, selectedMonth, day) <= today;

  return (
    <div className="calendar">
      <div className="calendar-header-att">
        <div className="header-controls">
          <h2>Attendance Summary</h2>
        </div>
        <div className="month-year-container" ref={pickerRef}>
          <div className="heade_right">
            <div className="arrow_l_r">
              <button className="nav-arrow" onClick={handlePreviousMonth}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button className="nav-arrow" onClick={handleNextMonth}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
            <div className="month-year-selector" onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}>
              <span>{selectedDate.toLocaleString("default", { month: "long" })} {selectedYear}</span>
              <ChevronDown size={20} />
            </div>
          </div>
          {showMonthYearPicker && (
            <div className="month-year-picker-dropdown">
              <select value={selectedMonth} onChange={(e) => setSelectedDate(new Date(selectedYear, parseInt(e.target.value), 1))}>
                {Array.from({ length: 12 }).map((_, i) => <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
              </select>
              <select value={selectedYear} onChange={(e) => setSelectedDate(new Date(parseInt(e.target.value), selectedMonth, 1))}>
                {Array.from({ length: 10 }).map((_, i) => <option key={2022 + i} value={2022 + i}>{2022 + i}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="calendar-grid">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(day => (
          <div key={day} className="day_name_attendance">{day}</div>
        ))}

        {Array.from({ length: firstDayOfMonth }).map((_, index) => <div key={`empty-${index}`} className="empty-cell"></div>)}

        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
          const day = dayIndex + 1;
          const { type } = getDayType(day);
          const isCurrentDay = isToday(day);

          return (
            <div key={day} className={`day ${type.toLowerCase().replace(" ", "-")}`}>
              <div className="day-header">
                <span className="day-number">{day}</span>
              </div>

              {type === "weekly-off" && <div className="weekly-off-text">Weekly Off</div>}

              {type && type !== "weekly-off" && isPastOrToday(day) && (
                <div className="day-footer">
                  <div className="status-container" ref={openDropdownDay === day ? dropdownRef : null}>

                    {isCurrentDay ? (
                      <button 
                        className={`status-badge ${type.toLowerCase().replace(" ", "-")}`} 
                        onClick={() => handleToggleDropdown(day)} // <-- UPDATED CLICK HANDLER
                      >
                        <div className="dot"></div> {type.replace("-", " ")}
                        <ChevronDown size={16} />
                      </button>
                    ) : (
                      <span className={`status-badge static ${type.toLowerCase().replace(" ", "-")}`}>
                        <div className="dot"></div> {type.replace("-", " ")}
                      </span>
                    )}

                    {openDropdownDay === day && (
                      <div className="status-dropdown_at">
                        {["Present", "Absent", "Half-Day"].map(status => (
                          <div key={status} className="dropdown_-_option" onClick={() => handleStatusChange(day, status)}>
                            {status}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceCalendar2;