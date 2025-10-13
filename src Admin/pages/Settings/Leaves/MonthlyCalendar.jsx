import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Plus, Clock, PlusCircle } from "lucide-react";
import '../../Attendance/Attendance/MonthlyAttendance.scss'
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatDate3 } from "../../../utils/common/DateTimeFormat";
import StatusBadgeSkeleton from "../../../utils/CalendarSkeletonLoader/StatusBadgeSkeleton";
import { getWorkCalSummary, updateWorkCalStatus } from "../../../Redux/Actions/Settings/leaveActions";
// === Main Component ===
const MonthlyCalendar = ({ CalendarLoading,  CalendarData, setCalendarList, setYearData }) => {
    //redux
    // console.log("CalendarData", CalendarData)
    const workCalStatus = useSelector((state) => state.workCalStatus)
    const [isStatusChanging, setIsStatusChanging] = useState(false);
    const [isNavigatingMonth, setIsNavigatingMonth] = useState(false);
    const [selectedDateDay, setSelectedDateDay] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    // const [CalendarData, setAttendanceData] = useState(attendanceDetail);
    const [openDropdownDay, setOpenDropdownDay] = useState(null);
    const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);


    useEffect(() => {
        if (!CalendarLoading && CalendarData?.length > 0) {
            setShowMonthYearPicker(false);
        }
    }, [CalendarLoading, CalendarData]);

    const dropdownRef = useRef(null);
    const pickerRef = useRef(null);
    const popupRef = useRef(null);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { id } = useParams();
    const dispatch = useDispatch()

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

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const handleToggleDropdown = (day) => {
        setOpenDropdownDay(prev => (prev === day ? null : day));
    };

    const getDayType = (day) => {
        const dateKey = `${String(day).padStart(2, "0")}-${String(selectedMonth + 1).padStart(2, "0")}-${selectedYear}`;
        const dayDate = new Date(selectedYear, selectedMonth, day);
        const shift = CalendarData?.find((s) => formatDate3(s?.date) === dateKey);
            const weekday = dayDate.getDay();
if (shift) {
    const status = { "WORKING_DAY": "Work Day", "HOLIDAY": "Holiday", "WEEKLY_OFF": "Weekly Off"}[shift.type];
    return { type: status };
}
    if (!CalendarLoading &&  dayDate > today) return { type: "" };

        return !CalendarLoading &&{ type: "" };
    };

    const handleStatusChange = async (day, newStatus) => {
        const dateKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const statusMap = { "Work Day": "WORKING_DAY", "Holiday": "HOLIDAY"};
        setSelectedDateDay(day);
        setIsStatusChanging(true);
        const dataToSubmit = {
            date: dateKey,
            type: statusMap[newStatus],

        };


        try {
            setOpenDropdownDay(null)
            const res = await dispatch(updateWorkCalStatus(dataToSubmit))
            if (res?.success) {
                setCalendarList((prev) =>
                    prev.map((item) =>
                        // console.log(item)
                        item?.date == res?.data?.date
                            ? {
                                ...item,
                                date: res?.data?.date,
                                type: res?.data?.type,
                            }
                            : item
                    )
                );

                //  const sendData = {
                //     month:selectedMonth+1,
                //     year: selectedYear
                // };
                // dispatch(getWorkCalSummary(sendData));
            }
        } catch (error) {
            console.log("error-", error);
        } finally {
            // Reset the loading states for this action
            setSelectedDateDay(null);
            setIsStatusChanging(false);
            setOpenDropdownDay(null);
        }
    };
    const handlePreviousMonth = async () => {
        setIsNavigatingMonth(true);

        setSelectedDate(new Date(selectedYear, selectedMonth - 1, 1))
        const dataToSubmit = {
            month: selectedMonth,
            year: selectedYear
        }
        setYearData({ month: selectedMonth, year: selectedYear })
        //  const res = getAttendenceSummery(dataToSubmit) 

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

        const dataToSubmit = {
            month: selectedMonth,
            year: e?.target?.value
        }
        setYearData({ month: selectedMonth + 1, year: parseInt(e.target.value) })
    }
    useEffect(() => {
        if (!CalendarLoading) {
            setIsNavigatingMonth(false);
        }
    }, [CalendarLoading]);


    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDayOfMonth = getFirstDayOfMonth(selectedMonth, selectedYear);
    const isCurrentMonth = selectedYear === today.getFullYear() && selectedMonth === today.getMonth();

  return (
   <div className="calendar calMain">
            <div className="calendar-header-att">
                <div className="header-controls">
                    <h2>Calender</h2></div>
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

                    // Logic to check if a day can be modified (only past/future days of the CURRENT month)
                        const isFutureMonth = new Date(selectedYear, selectedMonth) > new Date(today.getFullYear(), today.getMonth());
                        const isModifiable = (isCurrentMonth || isFutureMonth) && type !== "Weekly Off";
                    const showDayLoader = isStatusChanging && selectedDateDay === day;
                    return (
                        <div key={day} className={`day ${type ? type.toLowerCase().replace(" ", "-") : 'empty'}`}>
                            <div className="day-header">
                                <span className="day-number">{day}</span></div>
                            {isNavigatingMonth || CalendarLoading ?
                            <StatusBadgeSkeleton />
                            : <>
                                {/* FIX: Add icon is now correctly shown only on empty, modifiable days */}
                                {type === "Weekly Off" && <div className="weekly-off-text">Weekly Off</div>}

                                {type && type !== "Weekly Off" && (
                                    <div className="day-footer">
                                        <div className="status-container" ref={openDropdownDay == day ? dropdownRef : null}>
                                            {showDayLoader || CalendarLoading ?
                                                <StatusBadgeSkeleton />
                                                : <>

                                                    <button style={!isModifiable?{cursor:"default"}:{}} className={`status-badge ${type ? type.toLowerCase().replace(" ", "-") : ''}`} onClick={() => isModifiable && handleToggleDropdown(day)}>
                                                        {/* {type !== "Holiday" && */}
                                                            <div className="dot"></div>
                                                        {/* } */}
                                                        {type ? type.replace("-", " ") : ''}
                                                            {isModifiable && <ChevronDown size={16} />}
                                                    </button>

                                                    {openDropdownDay === day && (
                                                        <div className="status-dropdown_at">
                                                            {/* {[type?"Work Day", "Holiday"].map(status => ( */}
                                                                <div className="dropdown_-_option" onClick={() => handleStatusChange(day, type === "Work Day"?"Holiday":"Work Day")}>
                                                                    {type === "Work Day"?"Holiday":"Work Day"}
                                                                </div>
                                                            {/* ))} */}
                                                        </div>
                                                    )}
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

export default MonthlyCalendar;
