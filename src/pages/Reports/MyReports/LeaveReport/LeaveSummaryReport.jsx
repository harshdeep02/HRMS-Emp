import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { ChevronDown } from "lucide-react";
// import './MonthlyAttendance.scss'; // Make sure you have this SCSS file
import '../../../Attendance/MonthlyAttendance.scss'
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {formatDate3 } from "../../../../utils/common/DateTimeFormat";
import StatusBadgeSkeleton from "../../../../utils/CalendarSkeletonLoader/StatusBadgeSkeleton";
import { getUserData } from "../../../../services/login";
import ExportList from "../../../../utils/common/Export/ExportList";
import '../AttendanceReport/AttendanceReport.scss'
import { getMyLeaveSummary } from "../../../../Redux/Actions/report/myReport/reportActions";
import './LeaveSummary.scss'
import '../../../Attendance/AttendanceCalendar.scss'

export const LeaveSummaryReport = () => {

    const { id } = getUserData();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    //redux
    const LeaveSummaryData = useSelector((state) => state?.myLeaveSummary);
    const leaveData = LeaveSummaryData?.data?.approved_leaves;
    const holidayData = LeaveSummaryData?.data?.holidays;
    const weeklyOff = LeaveSummaryData?.data?.weekly_offs;
    const LeaveSummaryLoading = LeaveSummaryData?.loading || false;
    const currDate = new Date();
    const [getYear, setGetYear] = useState({ month: currDate.getMonth() + 1, year: currDate.getFullYear() })

    const setYearData = useCallback((data) => {
        setGetYear({ month: data.month, year: data.year });
    }, []);

    useEffect(() => {
        const fetchLeaveSummary = async () => {
            try {
                const sendData = {
                    month: getYear.month,
                    year: getYear.year
                };
                await dispatch(getMyLeaveSummary(sendData));
            } catch (error) {
                console.error("Error fetching Leave Summary:", error);
            }
        };
        fetchLeaveSummary();
    }, [dispatch, id, getYear]);

    //redux
    const [isStatusChanging, setIsStatusChanging] = useState(false);
    const [isNavigatingMonth, setIsNavigatingMonth] = useState(false);
    const [selectedDateDay, setSelectedDateDay] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [openDropdownDay, setOpenDropdownDay] = useState(null);
    const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);

    const mergeAttendanceAndHoliday = (leaveData = [], holidayData = [], weeklyOff = []) => {
        // Convert leave into a map for quick lookup
        const attendanceMap = leaveData.reduce((acc, entry) => {
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
        const nonHolidayLeave = leaveData.filter(a => !holidayData.find(h => h.date === a.date));
        const nonWeeklyOffLeave = nonHolidayLeave.filter(a => !weeklyOff.find(h => h.date === a.date));
        return [...holidayWithoutWeeklyOff, ...nonWeeklyOffLeave, ...mergedWeeklyOff];
    };

    const mergedAttendance = useMemo(() => {
        // return mergeAttendanceAndHolidays(leaveData, holidayData);
        return mergeAttendanceAndHoliday(leaveData, holidayData, weeklyOff);
    }, [leaveData, holidayData, weeklyOff]);

    useEffect(() => {
        if (!LeaveSummaryLoading && leaveData?.length > 0) {
            setShowMonthYearPicker(false);
        }
    }, [LeaveSummaryLoading, leaveData]);

    const dropdownRef = useRef(null);
    const pickerRef = useRef(null);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowMonthYearPicker(false);
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


        // label logic
        if (shift) {
            const status = {
                "Weekly Off": "Weekly Off", "holiday": "Holiday", "Sick Leave": "Sick Leave",
                "Annual Leave": "Annual Leave", "Casual Leave": "Casual Leave"
            }[shift.label || shift?.leave_name];
            return { type: status };
        }

        if (!LeaveSummaryLoading && dayDate > today) return { type: "" };
        return !LeaveSummaryLoading && { type: "" };
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
        if (!LeaveSummaryLoading) {
            setIsNavigatingMonth(false);
        }
    }, [LeaveSummaryLoading]);


    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDayOfMonth = getFirstDayOfMonth(selectedMonth, selectedYear);
    const isCurrentMonth = selectedYear === today.getFullYear() && selectedMonth === today.getMonth();

    const exportHeaders = [
        { label: 'Leave Type', key: 'type' },
        { label: 'Start Date', key: 'startDate' },
        { label: 'End Date', key: 'endDate' },
        { label: 'Reason', key: 'reason' },
        { label: 'Status', key: 'status' }
    ];

    return (
        <div className="leaveReportSummaryMain">
            <div className="leave-report-page">
                <button onClick={() => navigate(`/my-reports`)} className="close_nav header_close">Close</button>

                <div className="leave-dashboard-header">
                    <header className="leave-top-header">
                        <div className="header-left">
                            <h1>Leave Summary</h1>
                        </div>
                        <div className="header-right export-button-main">
                            <ExportList
                                data={mergedAttendance}
                                headers={exportHeaders}
                                filename="attendance_report.csv"
                            />
                        </div>
                    </header>
                </div>
                <div className="calendar otherDetailPageSroll reportCalen">
                    <div className="calendar-header-att">
                        <div className="header-controls">
                            {/* <h2>Attendance Summary</h2> */}
                        </div>
                        <div className="month-year-container" ref={pickerRef}>
                            <div className="heade_right">
                                <div className="arrow_l_r">
                                    <button className="nav-arrow" onClick={handlePreviousMonth}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>

                                    </button>
                                    {/* <button className="nav-arrow" onClick={handleNextMonth} disabled={selectedMonth+1 > today.getMonth()}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLincap="round" strokeLinejoin="round" /></svg>
                        </button> */}
                                    <button className="nav-arrow" onClick={handleNextMonth}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLincap="round" strokeLinejoin="round" /></svg>
                                    </button>
                                </div>
                                <div className="month-year-selector" onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}>
                                    <span>{selectedDate.toLocaleString("default", { month: "long" })} {selectedYear}</span>
                                    <ChevronDown size={20} />
                                </div>
                            </div>

                            {/* {showMonthYearPicker && (
                    <div className="month-year-picker-dropdown">
                        <select value={selectedMonth} onChange={(e) => handleSelectedMonth(e)}>
                            {Array.from({ length: selectedYear < today.getFullYear()? 12 : today.getMonth()+1 }).map((_, i) => {
                                return (<option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)})}
                        </select>
                        <select value={selectedYear} onChange={(e) => handleSelectedYear(e)}>
                            {Array.from({ length: 10 }).map((_, i) => {
                                const year = today?.getFullYear() - 9 + i
                            return (<option key={year} value={year}>{year}</option>)})}
                        </select>
                    </div>
                )} */}

                            {showMonthYearPicker && (
                                <div className="month-year-picker-dropdown">
                                    {/* {loadingArea === "selectedMonth" ?
                                <div className="monthLoader">
                                    <LoadingButton loading={attendanceLoading} color={"#000"} />
                                </div>
                                : */}
                                    <select value={selectedMonth} onChange={(e) => handleSelectedMonth(e)}>
                                        {Array.from({ length: 12 }).map((_, i) => <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
                                    </select>
                                    {/* } */}
                                    {/* {loadingArea === "selectedYear" ?
                                <div className="yearLoader">
                                    <LoadingButton loading={attendanceLoading} color={"#000"} />
                                </div>
                                : */}
                                    <select value={selectedYear} onChange={(e) => handleSelectedYear(e)}>
                                        {Array.from({ length: 10 }).map((_, i) => <option key={2022 + i} value={2022 + i}>{2022 + i}</option>)}
                                    </select>
                                    {/* } */}
                                </div>
                            )}

                        </div>
                    </div>

                    <div className="calendar-grid">
                        {["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map(day => (
                            <div key={day} className="day_name_attendance">{day}</div>
                        ))}

                        {Array.from({ length: firstDayOfMonth }).map((_, index) => <div key={`empty-${index}`} className="empty-cell"></div>)}

                        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                            const day = dayIndex + 1;
                            let { type } = getDayType(day);
                            if (!type && !LeaveSummaryLoading) {
                                if (isCurrentMonth) {
                                    if (day <= today?.getDate()) {
                                        type = "Work Day"
                                    }
                                }
                                else {
                                    type = "Work Day"
                                }
                            }
                            // Logic to check if a day can be modified (only past/present days of the CURRENT month)
                            const showDayLoader = isStatusChanging && selectedDateDay === day;

                            return (
                                <div key={day} className={`day ${type && !LeaveSummaryLoading ? type.toLowerCase().replace(" ", "-") : 'empty'}`}
                                >
                                    <div className="day-header">
                                        <span className="day-number">{day}</span></div>
                                    {isNavigatingMonth || LeaveSummaryLoading ?
                                        <StatusBadgeSkeleton />
                                        : <>

                                            {type === "Weekly Off" && <div className="weekly-off-text">Weekly Off</div>}

                                            {type && type !== "Weekly Off" && (
                                                <div className="day-footer">
                                                    <div className="status-container" ref={openDropdownDay == day ? dropdownRef : null}>
                                                        {showDayLoader || LeaveSummaryLoading ?
                                                            <StatusBadgeSkeleton />
                                                            : <>

                                                                <button style={{ cursor: "default", padding: '6px 11px' }} className={`status-badge ${type && !LeaveSummaryLoading ? type.toLowerCase().replace(" ", "-") : ''}`}>
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
                                </div>
                            );
                        })}
                    </div>
                </div>


                <div className="attendanceValues">
                    <div className="status-badge sick-leave"><div className="dot"></div>Sick Leave</div>
                    <div className="status-badge casual-leave"><div className="dot"></div>Casual Leave</div>
                    <div className="status-badge annual-leave"><div className="dot"></div>Annual Leave</div>
                    <div className="status-badge holiday"><div className="dot"></div>Holiday</div>
                </div>
            </div>
        </div>
    )
}
