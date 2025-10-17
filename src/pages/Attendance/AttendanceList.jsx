import {
    useState,
    useEffect,
    useRef,
    useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {X,Clock,TrendingUp,Rows4,CircleCheck,ShieldX,ShieldMinus, ChevronDown,} from "lucide-react";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../assets/default-user.png";
import ExportList from "../../utils/common/Export/ExportList.jsx";
import { getAttendanceList } from "../../Redux/Actions/attendanceActions.js";
import ListDataNotFound from "../../utils/common/ListDataNotFound.jsx";
import './AttendanceList.scss'
import { createAttendance } from "../../services/attendance.js";
import { formatDate } from "../../utils/common/DateTimeFormat.js";
import LoadingDots from "../../utils/common/LoadingDots/LoadingDots.jsx";
import { getUserData } from "../../services/login.js";
const INITIAL_VISIBLE_COUNT = 5;

const AttendanceList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {id} = getUserData()

    // --- Redux ---
    const attendanceData = useSelector((state) => state?.attendanceList);
    const attendanceLists = attendanceData?.data?.result || [];
    const totalItems = attendanceData?.data?.count || 0;
    const metaData = attendanceData?.data?.metadata || {};
    const loading = attendanceData?.loading || false;

    // --- useState ---
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All"); // Default is empty for "All"
    const [departmentFilter, setDepartmentFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(INITIAL_VISIBLE_COUNT);
    const [currentPage, setCurrentPage] = useState(1);
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
    const currDate = new Date();
    const [getYear, setGetYear] = useState({ month: currDate.getMonth() + 1, year: currDate.getFullYear() })

    const setYearData = useCallback((data) => {
        setGetYear({ month: data.month, year: data.year });
    }, []);

    const dropdownRef = useRef(null);
        const pickerRef = useRef(null);
    
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

    const attendanceStatusOptions = [
        { id: 0, label: "All", key: "today_all", icon: Rows4 },
        { id: 1, label: "Present", key: "today_present", icon: CircleCheck },
        { id: 2, label: "Absent", key: "today_absent", icon: ShieldX },
        { id: 3, label: "Halfday", key: "today_halfday", icon: ShieldMinus },
    ];

    const statusConfig = attendanceStatusOptions?.reduce((acc, status) => {
        if (!status?.id) return acc; // skip undefined values

        const label = status?.label || "All";
        const icon = status.icon || Rows4; // fallback to Users if no mapping exists

        acc[status?.id] = {
            label,
            icon,
            className: label.replace(/\s+/g, "-").toLowerCase()
        };
        return acc;
    }, {});

    // --- API Call Function ---;
    const fetchAttendanceList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");

            const sendData = {
                fy,
                noofrec: itemsPerPage,
                currentpage: currentPage,
                user_id: id,
                month: getYear.month,
                year: getYear.year,
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),

            };
            const res = await dispatch(getAttendanceList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching attendance list:", error);
            setShowMoreLess(false);
        }
    }, [currentPage,statusFilter, itemsPerPage, getYear]);

    useEffect(() => {
        fetchAttendanceList();
    }, [fetchAttendanceList]);

        const handlePreviousMonth = async () => {

        setSelectedDate(new Date(selectedYear, selectedMonth - 1, 1))
        setYearData({ month: selectedMonth, year: selectedYear })

    };
    const handleNextMonth = async () => {

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

    // --- Handlers ---
    const handleStatusFilter = (newValue) => {
        setCurrentPage(1);
        setStatusFilter(newValue);
        setItemsPerPage(INITIAL_VISIBLE_COUNT);
    };

    const clearFilters = () => {
        setStatusFilter("All");
        setCurrentPage(1);
        setShowMoreLess(false);
        setSelectedDate(new Date())
        setYearData({ month: currDate.getMonth() + 1, year: currDate.getFullYear() })
    };

    const handleLoadMore = () => {
        setItemsPerPage(prev => prev + 6);
        setShowMoreLess(true);
    };

    const handleShowLess = () => {
        setItemsPerPage(INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    };

    const getStatusDetails = (statusValue) => {
        return statusConfig[String(statusValue)] || { icon: Clock, label: "N/A" };
    };

    const exportHeaders = [
        {
            label: "Employee Name", key: (item) => item?.display_name || "N/A",
        },
        {
            label: "DATE",
            key: (item) => formatDate(item?.date) || "N/A",
        },
        { label: "SHIFT", key: (item) => item?.shift_name || "N/A" },
        { label: "CHECK-IN", key: (item) => item?.punch_in || "N/A" },
        { label: "CHECK-OUT", key: (item) => item?.punch_out || "N/A" },
        { label: "STATUS", key: (item) => statusConfig[item?.status]?.className || "N/A" },
    ];

    const handleImportRow = async (row) => {
        const payload = {
            display_name: row["Employee Name"],
            date: row['DATE'],
            shift_name: row['SHIFT'],
            punch_in: row['CHECK IN'],
            punch_out: row["CHECK-OUT"],
            status: row['STATUS'],
        };
        return dispatch(createAttendance(payload));
    };

    const sortOptions = [
        { value: 'today', label: 'Today' },
        { value: 'yesterday', label: 'Yesterday' },
        { value: 'last-7-days', label: 'Last 7 days' },
        { value: 'last-month', label: 'Last Month' },
        { value: 'custom', label: 'Custom Range' },
    ];

    const employeeImage = (img) => img
        ? (() => {
            try {
                return JSON.parse(img);
            } catch {
                return img;
            }
        })()
        : defaultImage;

    useEffect(() => {
        if (!loading) {
            setShowMonthYearPicker(false);
        }
    }, [loading]);

    const dummyData = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        first_name: "",
        last_name: "",
        job_opening: { job_title: "" },
        email: "",
        mobile_no: "",
        status: "",
        user_image: null,
    }));
    
    const ListData = (loading && !showMoreLess) ? dummyData : attendanceLists;

    return (
        <div className="attendanceListMain">
            <div className="employee-dashboard-list empListMain">
                <div className="dashboard-sticky-header">
                    {/* ... Header JSX is unchanged ... */}
                    <header className="top-header">
                        <div className="header-left">
                            <div>
                                <h1>
                                    Attendance History
                                    <span className="total-count">
                                        <TrendingUp size={16} className="TrendingUp" />
                                        {totalItems}
                                    </span>
                                </h1>
                                <p>Human Resource Management</p>
                            </div>
                        </div>
                        <div className="header-right header_rightMain">
                            <div className="toolbar" style={{ padding: "13px 0"}}>
                                <div className="toolbar-actions">
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
                                    <button className="nav-arrow" onClick={handleNextMonth}>
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
                                    {/* } */}
                                </div>
                            )}

                        </div>
                    </div>
                                      <ExportList
                                        data={attendanceLists}
                                        headers={exportHeaders}
                                        filename="attendence.csv"
                                    />
                                </div>
                            </div>
                        </div>
                    </header>
                </div>


                <main className={`dashboard-content`}>
                    <aside className="filters-sidebar">
                        <div>
                            <ul>
                                {attendanceStatusOptions?.map((status, index) => {
                                    const Icon = statusConfig[status?.id]?.icon || Rows4; // Fallback icon
                                    let count = 0;
                                    if (status?.label === "All") {
                                        count = totalItems ?? 0;
                                    } else {
                                        count = metaData?.[status?.label?.toLowerCase()?.replace(" ", "")] ?? 0;
                                    }
                                    return (
                                        <li key={index} className={statusFilter == status?.id ? "active" : ""} onClick={() => handleStatusFilter(status?.id)}>
                                            {/* UPDATED: Grouped icon and text */}
                                            <div className="status-label">
                                                <Icon size={16} strokeWidth={1.5} />
                                                <span>{status?.label}</span>
                                            </div>
                                            <span className="counts">({String(count).padStart(2, '0')})</span>
                                        </li>
                                    );
                                })}
                            </ul>
                            {(statusFilter !== "All") && (
                                <div className="clearBTN">
                                    <button className="clear-filters-btn" onClick={clearFilters}>
                                        <span>Clear filter</span>
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </aside>
                    <div className="content_box_auto">
                        <div className="employee-table-wrapper">
                            <table className="employee-table emp-t-5">
                                <thead>
                                    <tr>
                                        <th>DATE</th>
                                        <th>SHIFT</th>
                                        <th>TOTAL HOURS</th>
                                        <th>CHECK IN-CHECK-OUT</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                {(loading || attendanceLists?.length > 0) ? (
                                    <tbody className={`${loading && !showMoreLess ? 'LoadingList' : ''}`}>
                                        {ListData?.map((item) => {
                                            const statusInfo = getStatusDetails(item?.status);
                                            const StatusIcon = statusInfo?.icon;
                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="employee-row"
                                                    onClick={() => navigate(`/attendance-details/${item?.user_id}`,
                                                        { state: { employee_name: item?.user_name } }
                                                    )}>
                                                    <td><div className="department loadingtd Semi_Bold">{formatDate(item?.date)}</div></td>
                                                    <td className="loadingtd">{item?.shift_name}</td>
                                                    <td className="loadingtd">{item?.total_hours_worked}</td>
                                                    <td>
                                                        <div className="check-in-out">
                                                            <div className="loadingtdTOP">{item?.punch_in || "-"}</div>
                                                            <div className="loadingtdBOTTOM"> {item?.punch_out || "-"}</div>
                                                        </div>
                                                    </td>
                                                    <td className="loadingtd">
                                                        <div className={`status-badge `}>
                                                            <StatusIcon
                                                                size={14}
                                                                style={{ marginRight: "6px" }}
                                                            />
                                                            <span>{statusInfo.label}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                ) : (
                                    <tbody className="table_not_found">
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                                                {(!loading && attendanceLists?.length === 0) && (
                                                    <ListDataNotFound module="attendance" handleReset={clearFilters} />
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                            {(!loading || showMoreLess) &&
                                <div className="load-more-container">
                                    {itemsPerPage < totalItems && (
                                        <button onClick={handleLoadMore} className="load-more-btn">
                                            {(loading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                        </button>
                                    )}
                                    {itemsPerPage >= totalItems &&
                                        totalItems > INITIAL_VISIBLE_COUNT && (
                                            <button onClick={handleShowLess} className="load-more-btn">
                                                {loading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                            </button>
                                        )}
                                </div>
                            }
                        </div>
                    </div>
                </main>

            </div>
        </div>
    );
};

export default AttendanceList;
