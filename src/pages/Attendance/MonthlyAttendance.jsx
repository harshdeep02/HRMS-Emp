import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import './MonthlyAttendance.scss'; // Make sure you have this SCSS file
import { useParams } from "react-router-dom";
import { formatDate3 } from "../../utils/common/DateTimeFormat";
import StatusBadgeSkeleton from "../../utils/CalendarSkeletonLoader/StatusBadgeSkeleton";

const MonthlyAttendance = ({weeklyOff, attendanceLoading, attendanceData, setAttendanceList, numberOfWeeklyOffDays = 1, setYearData, holidayData }) => {
    //redux
    // console.log(attendanceData, holidayData)
    const [isNavigatingMonth, setIsNavigatingMonth] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);



    const mergeAttendanceAndHoliday = (attendanceData = [], holidayData = [], weeklyOff=[]) => {
             // Convert leave into a map for quick lookup
             const attendanceMap = attendanceData.reduce((acc, entry) => {
               acc[entry.date] = entry;
               return acc;
             }, {});
             // Merge holidays with leave
             const mergedHolidays = holidayData.map(h => {
               if (attendanceMap[h.date]) {
                 // Update existing attendance entry to holiday
                 return {
                   ...attendanceMap[h.date],
                   status: "4",
                   label: "holiday"
                 };
               } else {
                 // Create a new holiday entry if no attendance exists
                 return {
                   date: h.date,
                   status: "4",
                   label: "holiday"
                 };
               }
             });

             const mergedWeeklyOff = weeklyOff.map(h => {
               if (attendanceMap[h.date]) {
                 // Update existing attendance entry to Weekly off
                 return {
                   ...attendanceMap[h.date],
                   status: "0",
                   label: `Weekly Off`
                 };
               } else {
                 // Create a new weekly_off entry if no leave exists
                 return {
                   date: h.date,
                   status: "0",
                   label: "Weekly Off"
                 };
               }
             });
           
             // Add back leave entries that are NOT holidays
             const holidayWithoutWeeklyOff = mergedHolidays.filter(a => !weeklyOff.find(w => w.date === a.date));
             const nonHolidayLeave = attendanceData.filter(a => !holidayData.find(h => h.date === a.date));
             const nonWeeklyOffLeave = nonHolidayLeave.filter(a => !weeklyOff.find(h => h.date === a.date));
             return [...holidayWithoutWeeklyOff, ...nonWeeklyOffLeave, ...mergedWeeklyOff];
    };
           
        const mergedAttendance = useMemo(() => {
            return mergeAttendanceAndHoliday(attendanceData, holidayData, weeklyOff);
        }, [attendanceData, holidayData, weeklyOff]);

    useEffect(() => {
        if (!attendanceLoading && attendanceData?.length > 0) {
            setShowMonthYearPicker(false);
        }
    }, [attendanceLoading, attendanceData]);

    const pickerRef = useRef(null);
    const popupRef = useRef(null);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { id } = useParams();

    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();


    useEffect(() => {
        const handleClickOutside = (event) => {

            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowMonthYearPicker(false);
            }
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target) &&
                !event.target.closest(".MuiPopper-root")
            ) {
                setPopup(p => ({ ...p, isOpen: false }));
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();


    const getDayType = (day) => {
        const dateKey = `${String(day).padStart(2, "0")}-${String(selectedMonth + 1).padStart(2, "0")}-${selectedYear}`;
        const dayDate = new Date(selectedYear, selectedMonth, day);
        const shift = mergedAttendance?.find((s) => formatDate3(s?.date) === dateKey);
        const weekday = dayDate.getDay();

        // Attendance / Holiday logic
        if (shift) {
            if (shift.status === "4") {
                return { type: "Holiday", holiday_name: shift.holiday_name || "" };
            }
            const status = { "0": "Weekly Off", "1": "Present", "2": "Absent", "3": "Half day" }[shift.status];
            return { type: status };
        }
        if (!attendanceLoading && dayDate > today) return { type: "" };

        return { type: "" };
    };


    const handlePreviousMonth = async () => {
        setIsNavigatingMonth(true);

        setSelectedDate(new Date(selectedYear, selectedMonth - 1, 1))
        setYearData({ month: selectedMonth, year: selectedYear })

    };
    const handleNextMonth = async () => {
        setIsNavigatingMonth(true);

        setSelectedDate(new Date(selectedYear, selectedMonth + 1, 1))
        setYearData({ month: selectedMonth + 2, year: selectedYear })
    };

    const handleSelectedMonth = (e) => {
        setSelectedDate(new Date(selectedYear, parseInt(e.target.value), 1))

        setYearData({ month: parseInt(e.target.value) + 1, year: selectedYear })
    }
    const handleSelectedYear = (e) => {
        setSelectedDate(new Date(parseInt(e.target.value), selectedMonth, 1))

        setYearData({ month: selectedMonth + 1, year: parseInt(e.target.value) })
    }
    useEffect(() => {
        if (!attendanceLoading) {
            setIsNavigatingMonth(false);
        }
    }, [attendanceLoading]);


    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDayOfMonth = getFirstDayOfMonth(selectedMonth, selectedYear);
    const isCurrentMonth = selectedYear === today.getFullYear() && selectedMonth === today.getMonth();

    return (
        <div className="calendar otherDetailPageSroll reportCalen calMain">
            <div className="calendar-header-att" style={{justifyContent:"space-between"}}>
                <div className="header-controls">
                    <h2>Attendance Summary</h2></div>
                <div className="month-year-container" ref={pickerRef}>
                    <div className="heade_right">
                        <div className="arrow_l_r">
                            <button type="button" className="nav-arrow" onClick={handlePreviousMonth}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>

                            </button>
                            <button type="button" className="nav-arrow" onClick={handleNextMonth}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLincap="round" strokeLinejoin="round" /></svg>
                            </button>
                        </div>
                        <div className="month-year-selector" onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}>
                            <span>{selectedDate.toLocaleString("default", { month: "long" })} {selectedYear}</span>
                            <ChevronDown size={20} />
                        </div>
                    </div>
                    {showMonthYearPicker && (
                        <div className="month-year-picker-dropdown">
                            <select value={selectedMonth} onChange={(e) => handleSelectedMonth(e)}>
                                {Array.from({ length: 12 }).map((_, i) => <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
                            </select>
                            <select value={selectedYear} onChange={(e) => handleSelectedYear(e)}>
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

                    return (
                        <div key={day} className={`day ${type ? type.toLowerCase().replace(" ", "-") : 'empty'}`}>
                            <div className="day-header">
                                <span className="day-number">{day}</span></div>
                            {isNavigatingMonth || attendanceLoading ?
                                <StatusBadgeSkeleton />
                                : <>

                                    {type === "Weekly Off" && <div className="weekly-off-text">Weekly Off</div>}

                                    {type && type !== "Weekly Off" && (
                                        <div className="day-footer">
                                            <div className="status-container">
                                                {attendanceLoading ?
                                                    <StatusBadgeSkeleton />
                                                    : <>

                                                        <button type="button" style={{cursor:"default"}} className={`status-badge ${type ? type.toLowerCase().replace(" ", "-") : ''}`}>
                                                                <div className="dot"></div>
                                                            {type ? type.replace("-", " ") : ''}
                                                        </button>
                                                    </>}
                                            </div>
                                        </div>
                                    )}
                                </>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default React.memo(MonthlyAttendance);