// MonthlyDailyAttendanceReportCalender.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import "./MonthlyDailyAttendanceReportCalender.scss"; // same SCSS use hoga
import ExportList from "../../../../utils/common/Export/ExportList";
import StatusBadgeSkeleton from "../../../../utils/CalendarSkeletonLoader/StatusBadgeSkeleton";
import { formatDate3 } from "../../../../utils/common/DateTimeFormat";
import { useSelector } from "react-redux";


const MonthlyDailyAttendanceReportCalender = ({selectedYear,selectedMonth, selectedEmployee, isNavigatingMonth}) => {

    //redux
    const attendanceDetails = useSelector((state) => state?.attendanceSummary);
    const attendanceData = attendanceDetails?.data?.attendance;
    const holidayData = attendanceDetails?.data?.holidays;
    const weeklyOff = attendanceDetails?.data?.weekly_off;
    const attendanceLoading = attendanceDetails?.loading || false;

    const [hoverDay, setHoverDay] = useState(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDayOfMonth = getFirstDayOfMonth(selectedMonth, selectedYear);

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

            
    const getDayType = (day) => {
        const dateKey = `${String(day).padStart(2, "0")}-${String(selectedMonth + 1).padStart(2, "0")}-${selectedYear}`;
        const dayDate = new Date(selectedYear, selectedMonth, day);
        const shift = selectedEmployee? mergedAttendance?.find((s) => formatDate3(s?.date) === dateKey):'';
        const weekday = dayDate.getDay();

        // Attendance / Holiday logic
        if (shift) {
            if (shift.status === "0") {
                return { type: "Weekly Off" };
            }
            if (shift.status === "2") {
                return { type: "Absent" };
            }
            if (shift.status === "4") {
                   return { type: "Holiday", holiday_name: shift.holiday_name || "" };
           }
            const status = { "1": "Present", "3": "Half day"}[shift.status];
            return { type: status, shift };
        }
        if (!attendanceLoading && dayDate > today) return { type: "" };

        return !attendanceLoading && { type: "" };
    };

    return (

          <div className="leave-report-page">
       <div className="calendar otherDetailPageSroll reportCalen">

            <div className="calendar-grid">
                {["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map(day => (
                    <div key={day} className="day_name_attendance">{day}</div>
                ))}

                {Array.from({ length: firstDayOfMonth }).map((_, index) => <div key={`empty-${index}`} className="empty-cell"></div>)}

                {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    const { type, shift } = getDayType(day);

                    return (
                        <div key={day} className={`day ${type ? type.toLowerCase().replace(" ", "-") : 'empty'}`}
                         onMouseEnter={() => shift && setHoverDay({ day, ...shift })}
                         onMouseLeave={() => setHoverDay(null)}
                       >
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

                                                        <button style={{cursor:"default",padding: '6px 11px'}} className={`status-badge ${type ? type.toLowerCase().replace(" ", "-") : ''}`}>
                                                            {type !== "Holiday" &&
                                                                <div className="dot"></div>
                                                            }
                                                            {type ? type.replace("-", " ") : ''}
                                                        </button>   
                                                    </>}
                                            </div>
                                        </div>
                                    )}
                                </>}
                                {hoverDay && hoverDay.day === day && (
                                    <div className="attendance-popover">
                                        <p><strong>{new Date(selectedYear, selectedMonth, day).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "long", year: "numeric" })}</strong></p>
                                        {hoverDay.punch_in && (
                                            <>
                                                 <div className="checkBody">
                                                <div className="checkTime">
                                                    <div className="checkInTime">
                                                    <div className="checkText">Check-in time</div>
                                                    <div className="checkTime">{hoverDay?.punch_in}</div>
                                                    </div>
                                                    <div className="checkOutTime">
                                                    <div className="checkText">Check-out time</div>
                                                    <div className="checkTime">{hoverDay?.punch_out}</div>
                                                    </div>
                                                </div>
                                                <div className="checkWorkHour">
                                                    <div className="checkText">Total worked Hours</div>
                                                    <div className="checkTime">{hoverDay?.total_hours_worked}</div>
                                                </div>
                                                </div>
                                            </>
                                        )}
                                        {!hoverDay.punch_in && <p>No records available</p>}
                                    </div>
                                )}
                        </div>
                    );
                })}
            </div>
        </div>


        <div className="attendanceValues dailyAttenValues">
            <div className="status-badge present"><div className="dot"></div>Present</div>
            <div className="status-badge absent"><div className="dot"></div>Absent</div>
            <div className="status-badge half-day"><div className="dot"></div>Half Day</div>
            <div className="status-badge holiday"><div className="dot"></div>Holiday</div>
        </div>
    </div>
    );
};

export default MonthlyDailyAttendanceReportCalender;
