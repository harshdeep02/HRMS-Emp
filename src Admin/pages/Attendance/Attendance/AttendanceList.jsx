import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    List,
    MoreVertical,
    X,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    Rows4,
    CircleCheck,
    ShieldX,
    ShieldMinus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import DynamicFilter from "../../../utils/common/DynamicFilter.jsx";
import DynamicLoader from "../../../utils/common/DynamicLoader/DynamicLoader.jsx";
import defaultImage from "../../../assets/default-user.png";
import SortFilter from "../../../utils/common/SortFilter.jsx";
import DatePicker from "../../../utils/common/DatePicker/DatePicker.jsx";
import ImportList from "../../../utils/common/Import/ImportList.jsx";
import ExportList from "../../../utils/common/Export/ExportList.jsx";
import { getAttendanceList } from "../../../Redux/Actions/attendanceActions.js";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import './AttendanceList.scss'
import { createAttendance } from "../../../services/attendance.js";
import { formatDate, formatDate3 } from "../../../utils/common/DateTimeFormat.js";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
const INITIAL_VISIBLE_COUNT = 10;

const AttendanceList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // --- Redux ---
    const attendanceData = useSelector((state) => state?.attendanceList);
    const attendanceLists = attendanceData?.data?.result || [];
    const totalItems = attendanceData?.data?.metadata?.today_all || 0;
    const metaData = attendanceData?.data?.metadata || {};
    const loading = attendanceData?.loading || false;

    // --- useState ---
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All"); // Default is empty for "All"
    const [departmentFilter, setDepartmentFilter] = useState("All");
    const [sortBy, setSortBy] = useState("today");
    const [dateFilter, setDateFilter] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(INITIAL_VISIBLE_COUNT);
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [showMoreLess, setShowMoreLess] = useState(false);
    const searchBoxRef = useRef();
    const menuRef = useRef(null);

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
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(departmentFilter && departmentFilter !== "All" && { department_id: departmentFilter }),
                ...(searchTerm && { search: searchTerm }),
                ...(sortBy && { sort_by: sortBy }),
                ...(dateFilter && { custom_date: formatDate3(new Date(dateFilter)) }),
            };
            const res = await dispatch(getAttendanceList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching attendence list:", error);
            setShowMoreLess(false);
        }
    }, [searchTerm, statusFilter, dateFilter, departmentFilter, sortBy, currentPage, itemsPerPage]);

    useEffect(() => {
        fetchAttendanceList();
    }, [fetchAttendanceList]);

    // --- Handlers ---
    const handleSearch = (query) => {
        setCurrentPage(1);
        setItemsPerPage(INITIAL_VISIBLE_COUNT);
        setSearchTerm(query);
    };
    const handleStatusFilter = (newValue) => {
        setCurrentPage(1);
        setStatusFilter(newValue);
        setItemsPerPage(INITIAL_VISIBLE_COUNT);
    };

    const handleSortChange = (newSort) => {
        setCurrentPage(1);
        setItemsPerPage(INITIAL_VISIBLE_COUNT)
        setSortBy(newSort);
    };

    const handleDateFilter = (date) => {
        setCurrentPage(1);
        setDateFilter(date);
        setItemsPerPage(INITIAL_VISIBLE_COUNT)
    };

    const handleDepartmentFilter = (newFilter) => {
        setDepartmentFilter(newFilter);
        setItemsPerPage(INITIAL_VISIBLE_COUNT); // reset count
    };

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("");
        setDepartmentFilter("All");
        setSortBy("recent");
        setDateFilter(null);
        setCurrentPage(1);
        setShowMoreLess(false);
        if (searchBoxRef.current) searchBoxRef.current.clearInput();
        // Clear date input manually if needed
        const dateInput = document.getElementById('date-filter-input');
        if (dateInput) dateInput.value = '';
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

    const dummData = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        first_name: "",
        last_name: "",
        job_opening: { job_title: "" },
        email: "",
        mobile_no: "",
        status: "",
        user_image: null,
    }));


    const ListData = (loading && (!showMoreLess || attendanceLists?.length === 0)) ? dummData : attendanceLists;

    return (
        <div className="attendanceListMain">
            <div className="employee-dashboard-list empListMain">
                <div className="dashboard-sticky-header">
                    {/* ... Header JSX is unchanged ... */}
                    <header className="top-header">
                        <div className="header-left">
                            <div>
                                <h1>
                                    All Attendance List
                                    <span className="total-count">
                                        <TrendingUp size={16} className="TrendingUp" />
                                        {totalItems}
                                    </span>
                                </h1>
                                <p>Human Resource Management</p>
                            </div>
                        </div>
                        <div className="header-right header_rightMain">
                            <div className="toolbar">
                                <SearchBox
                                    onSearch={handleSearch}
                                    placeholder="Search employee..."
                                    ref={searchBoxRef}
                                />
                                <div className="toolbar-actions">
                                    <DynamicFilter
                                        filterBy="department"
                                        filterValue={departmentFilter}
                                        onChange={handleDepartmentFilter}
                                    />
                                    <SortFilter sortBy={sortBy} onChange={handleSortChange} options={sortOptions} />
                                    <DatePicker
                                        label=""
                                        onDateChange={handleDateFilter}
                                        initialDate={dateFilter}
                                    />
                                    <div className="relative" ref={menuRef}>
                                        <Tooltips
                                            title="Import & Export"
                                            placement="top"
                                            arrow={true}>
                                            <button
                                                className="menu-btn"
                                                onClick={() => setOpen((prev) => !prev)}>
                                                <MoreVertical size={24} />
                                            </button>
                                        </Tooltips>
                                        {open && (
                                            <div className="menu-popup">
                                                <ImportList
                                                    apiFunction={handleImportRow}
                                                    onImportSuccess={() => {
                                                        fetchDepartmentList();
                                                        setOpen(false);
                                                    }}
                                                />
                                                <ExportList
                                                    data={attendanceLists}
                                                    headers={exportHeaders}
                                                    filename="attendence.csv"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="relative" ref={menuRef}>
                                {/* ... More options popup ... */}
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
                                        count = metaData?.[status?.key?.toLowerCase()?.replace(" ", "")] ?? 0;
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
                            {(statusFilter !== "All" || dateFilter !== null || departmentFilter !== "All") && (
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
                                        <th>EMPLOYEE NAME</th>
                                        <th>DATE</th>
                                        <th>SHIFT</th>
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
                                                    <td>
                                                        {loading ?
                                                            <>
                                                                <div className="loadingImg"></div>
                                                                <div className="loadingtdsmall name"></div>
                                                            </>
                                                            :
                                                            <>
                                                                <div className="info_img loadingImg">
                                                                    <img
                                                                        src={employeeImage(item?.employee?.image)}
                                                                        alt={[item?.employee?.first_name, item?.employee?.last_name].filter(Boolean).join(" ")}
                                                                        className="avatar"
                                                                    />
                                                                    <div className="name loadingtdsmall Semi_Boldv ">{[item?.employee?.first_name, item?.employee?.last_name].filter(Boolean).join(" ")}</div>
                                                                </div>
                                                            </>
                                                        }

                                                    </td>
                                                    <td className="loadingtd">{formatDate(item?.date)}</td>
                                                    <td className="loadingtd">{item?.shift_name}</td>
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
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                                                {(!loading && attendanceLists?.length === 0) && (
                                                    <ListDataNotFound module="attendance" handleReset={clearFilters} />
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                                <div className="load-more-container">
                                    {itemsPerPage < totalItems && (
                                        <button onClick={handleLoadMore} className="load-more-btn">
                                            {loading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}

                                        </button>
                                    )}
                                    {itemsPerPage >= totalItems &&
                                        totalItems > INITIAL_VISIBLE_COUNT && (
                                            <button onClick={handleShowLess} className="load-more-btn">
                                                {loading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                            </button>
                                        )}
                                </div>
                            

                        </div>
                    </div>
                </main>

            </div>
        </div>
    );
};

export default AttendanceList;
