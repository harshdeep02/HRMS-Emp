import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Plus, Clock, PlusCircle } from "lucide-react";
import './MonthlyAttendance.scss'; // Make sure you have this SCSS file
import FormTimePicker from "../../../utils/common/FormTimePicker/FormTimePicker";
import LoadingButton from "../../../utils/common/LoadingButton";
import SaveBtn from "../../../utils/common/SaveBtn";
import { getAttendanceSummary, updateAttendanceStatus } from "../../../Redux/Actions/attendanceActions";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatDate3 } from "../../../utils/common/DateTimeFormat";
import { mergeAttendanceAndHolidays } from "../../../utils/helper";
import StatusBadgeSkeleton from "../../../utils/CalendarSkeletonLoader/StatusBadgeSkeleton";

const MonthlyAttendance = ({weeklyOff, attendanceLoading, attendanceData, setAttendanceList, numberOfWeeklyOffDays = 1, setYearData, holidayData }) => {
    //redux
    // console.log(attendanceData, holidayData)
    const updateAttendanceData = useSelector((state) => state.updateAttendanceStatus)
    const [isStatusChanging, setIsStatusChanging] = useState(false);
    const [isNavigatingMonth, setIsNavigatingMonth] = useState(false);
    const [selectedDateDay, setSelectedDateDay] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    // const [attendanceData, setAttendanceData] = useState(attendanceDetail);
    const [openDropdownDay, setOpenDropdownDay] = useState(null);
    const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
    const [popup, setPopup] = useState({ isOpen: false, id: '', status: '', day: null, checkIn: '', checkOut: '', top: 0, left: 0 });
    const [loadingArea, setloadingArea] = useState('')

//       const mergeAttendanceAndHoliday = (attendanceData = [], holidayData = []) => {
//   // Convert attendance into a map for quick lookup
//   const attendanceMap = attendanceData.reduce((acc, entry) => {
//     acc[entry.date] = entry;
//     return acc;
//   }, {});

//   // Merge holidays with attendance
//   const merged = holidayData.map(h => {
//     if (attendanceMap[h.date]) {
//       // Update existing attendance entry to holiday
//       return {
//         ...attendanceMap[h.date],
//         status: "4",
//         holiday_name: h.name
//       };
//     } else {
//       // Create a new holiday entry if no attendance exists
//       return {
//         date: h.date,
//         status: "4",
//         holiday_name: h.name
//       };
//     }
//   });

//   // Add back attendance entries that are NOT holidays
//   const nonHolidayAttendance = attendanceData.filter(a => !holidayData.find(h => h.date === a.date));

//   return [...merged, ...nonHolidayAttendance];
// };
//     const mergedAttendance = useMemo(() => {
//         // return mergeAttendanceAndHolidays(attendanceData, holidayData);
//         return mergeAttendanceAndHoliday(attendanceData, holidayData);
//     }, [attendanceData, holidayData]);


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

    const dropdownRef = useRef(null);
    const pickerRef = useRef(null);
    const popupRef = useRef(null);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { id } = useParams();
    const dispatch = useDispatch()

    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    let monthSelected = new Date(selectedYear, selectedMonth - 1, 1)
    let yearSelected = new Date(selectedYear, selectedMonth - 1, 1)

    useEffect(() => {
        if (!attendanceLoading) setloadingArea('');
    }, [attendanceData]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownDay(null);
            }
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

    const handleToggleDropdown = (day) => {
        setOpenDropdownDay(prev => (prev === day ? null : day));
    };

    const getDayType = (day) => {
        const dateKey = `${String(day).padStart(2, "0")}-${String(selectedMonth + 1).padStart(2, "0")}-${selectedYear}`;
        const dayDate = new Date(selectedYear, selectedMonth, day);
        const shift = mergedAttendance?.find((s) => formatDate3(s?.date) === dateKey);
        const weekday = dayDate.getDay();

        // if (numberOfWeeklyOffDays === 1 && weekday === 0) {
        //     return { type: "Weekly Off" };
        // }
        // if (numberOfWeeklyOffDays === 2 && (weekday === 0 || weekday === 6)) {
        //     return { type: "Weekly Off" };
        // }

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

    const handleStatusChange = async (day, newStatus) => {
        const dateKey = `${String(day).padStart(2, "0")}-${String(selectedMonth + 1).padStart(2, "0")}-${selectedYear}`;
        const statusMap = { "Present": "1", "Absent": "2", "Half day": "3" };
        setSelectedDateDay(day);
        setIsStatusChanging(true);
        setPopup((prev) => ({ ...prev, status: statusMap[newStatus] }))
        const entry = mergedAttendance?.find(d => formatDate3(d?.date) === dateKey);
        const dataToSubmit = {
            id: entry?.id,
            status: statusMap[newStatus],
            punch_in: entry?.punch_in,
            punch_out: entry?.punch_out,
        };


        try {
            setOpenDropdownDay(null)
            const res = await dispatch(updateAttendanceStatus(dataToSubmit))
            if (res?.success) {
                setAttendanceList((prev) =>
                    prev.map((item) =>
                        item?.id === res?.result?.id
                            ? {
                                ...item,
                                status: res?.result?.status,
                                punch_in: res?.result?.punch_in,
                                punch_out: res?.result?.punch_out,
                            }
                            : item
                    )
                );
                // dispatch(getAttendanceSummary({user_id:id}));
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

    const openCheckInPopup = (day, e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const dateKey = `${String(day).padStart(2, "0")}-${String(selectedMonth + 1).padStart(2, "0")}-${selectedYear}`;
        const entry = mergedAttendance?.find(d => formatDate3(d?.date) === dateKey);
        setPopup({
            id: entry?.id,
            isOpen: true, day: day,
            status: entry?.status,
            checkIn: entry?.punch_in || '',
            checkOut: entry?.punch_out || '',
            top: rect.top + window.scrollY - 130, left: rect.left + window.scrollX - 40,
        });
    };

    const handleSavePopup = async () => {
        const dataToSubmit = {
            id: popup?.id,
            status: popup?.status,
            punch_in: popup?.checkIn,
            punch_out: popup?.checkOut,
        };

        try {
            const res = await dispatch(updateAttendanceStatus(dataToSubmit))
            if (res?.success) {
                dispatch(getAttendanceSummary({
                    user_id: id,
                    month: selectedMonth + 1,
                    year: selectedYear
                }));
            }
        } catch (error) {
            console.log("error-", error);
        }
        setPopup({ isOpen: false, id: '', status: '', day: null, checkIn: '', checkOut: '' });
    };

    // New handler for the time pickers inside the popup
    const handleTimeChangeInPopup = (type, time) => {
        setPopup(prevPopup => ({
            ...prevPopup,
            [type]: time, // 'checkIn' or 'checkOut'
        }));
    };
    const handlePreviousMonth = async () => {
        setloadingArea('previousButton')
        setIsNavigatingMonth(true);

        setSelectedDate(new Date(selectedYear, selectedMonth - 1, 1))
        const dataToSubmit = {
            id: id,
            month: selectedMonth,
            year: selectedYear
        }
        setYearData({ month: selectedMonth, year: selectedYear })
        //  const res = getAttendenceSummery(dataToSubmit) 

    };
    const handleNextMonth = async () => {
        setloadingArea('nextButton')
        setIsNavigatingMonth(true);

        setSelectedDate(new Date(selectedYear, selectedMonth + 1, 1))
        setYearData({ month: selectedMonth + 2, year: selectedYear })
    };

    const handleSelectedMonth = (e) => {
        setloadingArea('selectedMonth')
        setSelectedDate(new Date(selectedYear, parseInt(e.target.value), 1))

        setYearData({ month: parseInt(e.target.value) + 1, year: selectedYear })
    }
    const handleSelectedYear = (e) => {
        setloadingArea('selectedYear')
        setSelectedDate(new Date(parseInt(e.target.value), selectedMonth, 1))

        const dataToSubmit = {
            id: id,
            month: selectedMonth,
            year: e?.target?.value
        }
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
        <div className="calendar otherDetailPageSroll calMain">
            <div className="calendar-header-att">
                <div className="header-controls">
                    <h2>Attendance Summary</h2></div>
                <div className="month-year-container" ref={pickerRef}>
                    <div className="heade_right">
                        <div className="arrow_l_r">
                            <button className="nav-arrow" onClick={handlePreviousMonth}>
                                {/* {loadingArea === "previousButton" ?
                                    <LoadingButton loading={attendanceLoading} color={"#000"} />
                                    :
                                } */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>

                            </button>
                            <button className="nav-arrow" onClick={handleNextMonth}>
                                {/* {loadingArea === "nextButton" ?
                                    <LoadingButton loading={attendanceLoading} color={"#000"} />
                                    :
                                } */}
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
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(day => (
                    <div key={day} className="day_name_attendance">{day}</div>
                ))}

                {Array.from({ length: firstDayOfMonth }).map((_, index) => <div key={`empty-${index}`} className="empty-cell"></div>)}

                {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    const { type } = getDayType(day);

                    // Logic to check if a day can be modified (only past/present days of the CURRENT month)
                    const isModifiable =isCurrentMonth && new Date(selectedYear, selectedMonth, day) <= today && !(type === "Weekly Off" || type === "Holiday");
                    const showDayLoader = isStatusChanging && selectedDateDay === day;

                    return (
                        <div key={day} className={`day ${type ? type.toLowerCase().replace(" ", "-") : 'empty'}`}>
                            <div className="day-header">
                                <span className="day-number">{day}</span></div>
                            {isNavigatingMonth || attendanceLoading ?
                                <StatusBadgeSkeleton />
                                : <>
                                    {/* FIX: Add icon is now correctly shown only on empty, modifiable days */}
                                    {isModifiable && (
                                        <div className="day-body-center">
                                            <div className="add-attendance-icon-center" onClick={(e) => openCheckInPopup(day, e)}>
                                                <PlusCircle size={20} />
                                            </div>
                                        </div>
                                    )}

                                    {type === "Weekly Off" && <div className="weekly-off-text">Weekly Off</div>}

                                    {type && type !== "Weekly Off" && (
                                        <div className="day-footer">
                                            <div className="status-container" ref={openDropdownDay == day ? dropdownRef : null}>
                                                {showDayLoader || attendanceLoading ?
                                                    <StatusBadgeSkeleton />
                                                    : <>

                                                        <button style={type === "Holiday"?{cursor:"default"}:{}} className={`status-badge ${type ? type.toLowerCase().replace(" ", "-") : ''}`} onClick={() => isModifiable && handleToggleDropdown(day)}>
                                                            {type !== "Holiday" &&
                                                                <div className="dot"></div>
                                                            }
                                                            {type ? type.replace("-", " ") : ''}
                                                            {type !== "Holiday" &&
                                                                isModifiable && <ChevronDown size={16} />}
                                                        </button>

                                                        {openDropdownDay === day && (
                                                            <div className="status-dropdown_at">
                                                                {["Present", "Absent", "Half day"].map(status => (
                                                                    <div key={status} className="dropdown_-_option" onClick={() => handleStatusChange(day, status)}>
                                                                        {status}
                                                                    </div>
                                                                ))}
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

            {popup.isOpen && (
                <div className="attendance-popover Manth_small_popup" ref={popupRef} style={{ top: `${popup.top}px`, left: `${popup.left}px` }}>
                    {/* FIX: Using FormTimePicker instead of regular inputs */}
                    <FormTimePicker
                        label="Check In"
                        type="checkIn"
                        initialTime={popup.checkIn}
                        onTimeChange={handleTimeChangeInPopup}
                        ampm={true}
                        small={true}
                        lableShow={true}
                    />
                    <FormTimePicker
                        label="Check Out"
                        type="checkOut"
                        initialTime={popup.checkOut}
                        onTimeChange={handleTimeChangeInPopup}
                        ampm={true}
                        small={true}
                        lableShow={true}


                    />
                    <SaveBtn handleSubmit={handleSavePopup} viewMode='add' loading={updateAttendanceData.loading} color='#fff' />
                </div>
            )}
        </div>
    );
};
export default React.memo(MonthlyAttendance);