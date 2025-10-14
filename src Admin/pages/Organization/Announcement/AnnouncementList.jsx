import React, { useState, useEffect, useRef, useCallback } from "react";
// UPDATED: Added new icons
import { List, MoreVertical, XCircle, TrendingUp, UserPlus, X, SquareMenu } from "lucide-react";
import "../../EmployeeOnboarding/EmployeeList/EmployeeList.scss";
import { useNavigate } from "react-router-dom";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getAnnouncementList } from "../../../Redux/Actions/announcementActions.js";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import DynamicFilter from "../../../utils/common/DynamicFilter.jsx";
import DynamicLoader from "../../../utils/common/DynamicLoader/DynamicLoader.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import { announcementStatusOptions } from "../../../utils/Constant.js";
import { formatDate, formatDate3 } from '../../../utils/common/DateTimeFormat.js'
import DatePicker from "../../../utils/common/DatePicker/DatePicker.jsx";
import ImportList from "../../../utils/common/Import/ImportList.jsx";
import ExportList from "../../../utils/common/Export/ExportList.jsx";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
const INITIAL_VISIBLE_COUNT = 9;

export const AnnouncementList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Data from redux
    const announcementData = useSelector((state) => state?.announcementList);
    const announcementLists = announcementData?.data?.announcement || [];
    const totalAnnouncements = announcementData?.data?.count || 0;
    const announcementLoading = announcementData?.loading || false;
    // const announcementLoading = true;
    const metaData = announcementData?.data?.metadata || {}

    const statusConfig = announcementStatusOptions?.reduce((acc, status) => {
        if (!status?.id) return acc; // skip undefined values

        const label = status?.label || "All";
        const icon = status.icon || SquareMenu; // fallback to Users if no mapping exists

        acc[status?.id] = {
            label,
            icon,
            className: label.replace(/\s+/g, "-").toLowerCase()
        };
        return acc;
    }, {});

    const [searchTerm, setSearchTerm] = useState("");
    const searchBoxRef = useRef();
    const [statusFilter, setStatusFilter] = useState("All");
    const [departmentFilter, setDepartmentFilter] = useState("All");
    const [sortBy, setSortBy] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [view, setView] = useState('list');
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const [dateFilter, setDateFilter] = useState(null);

    // Close menu on outside click
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const fetchAnnouncementList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");
            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(departmentFilter && departmentFilter !== "All" && { department_id: departmentFilter }),
                ...(searchTerm && { search: searchTerm }),
                ...(sortBy && { sort_by: sortBy }), // backend should handle sort
                ...(dateFilter && { custom_date: formatDate3(new Date(dateFilter)) }),
            };
            const res = await dispatch(getAnnouncementList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching announcement list:", error);
            setShowMoreLess(false);
        }
    }, [searchTerm, statusFilter, departmentFilter, sortBy, visibleCount, dateFilter]);

    useEffect(() => {
        fetchAnnouncementList();
    }, [searchTerm, statusFilter, departmentFilter, sortBy, visibleCount, dateFilter]);

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setDepartmentFilter("All");
        setSortBy("recent");
        setShowMoreLess(false);
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();
        }
        setDateFilter(null);
        // Clear date input manually if needed
        const dateInput = document.getElementById('date-filter-input');
        if (dateInput) dateInput.value = '';
    };

    const handleDateFilter = (date) => {
        setCurrentPage(1);
        setDateFilter(date);
        setVisibleCount(INITIAL_VISIBLE_COUNT)
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
        setShowMoreLess(true);
    };

    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    };

    const handleStatusFilter = (newFilter) => {
        setStatusFilter(newFilter);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    const handleDepartmentFilter = (newFilter) => {
        setDepartmentFilter(newFilter);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };


    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    const announcementExportHeaders = [
        { label: "Subject", key: (item) => item?.subject || "N/A" },
        { label: "Created At Date", key: (item) => (item?.created_at ? formatDate(item?.created_at) : "N/A") },
        { label: "Expiry Date", key: (item) => (item?.expiry ? formatDate(item?.expiry) : "N/A") },
        { label: "Status", key: (item) => statusConfig[item?.status]?.label || "N/A" },
    ];

    const handleAnnouncementImportRow = async (row) => {
        const payload = {
            subject: row["Subject"] || "",
            created_at: row["Created At Date"] || "",
            expiry: row["Expiry Date"] || "",
            status: Object.keys(statusConfig).find(
                (key) => statusConfig[key]?.label === row["Status"]
            ) || "",
        };

        // Example: dispatch to create announcement
        // return dispatch(createNewAnnouncement(payload));

        //   return payload; // if you just want to return the parsed row
    };

    // ❗ 1 new loding
    // ✅ Table ke hisaab se dummy loading rows
    const dummyData = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        subject: "",
        created_at: "",
        expiry: "",
        status: "",
    }));


    const ListData = (announcementLoading && (!showMoreLess || announcementLists?.length === 0)) ? dummyData : announcementLists;
    return (
        <div className="employee-dashboard-list job_list jobListMain">
            <div className="dashboard-sticky-header">
                <header className="top-header">
                    <div className="header-left">
                        {/* <button className="header-icon-btn"><img src={userlistsvg} /></button> */}
                        <div>
                            <h1>All Announcement list
                                <span className="total-count"> <TrendingUp size={16} className="TrendingUp" />
                                    {metaData?.all}</span>
                            </h1>
                            <p>See Announcements All List below</p>
                        </div>
                    </div>
                    <div className="header-right header_rightMain">
                        <div className="toolbar">
                            <SearchBox
                                onSearch={handleSearch}
                                placeholder="Search Announcement..."
                                ref={searchBoxRef}
                            />
                            <div className="toolbar-actions">
                                <DynamicFilter
                                    filterBy="department"
                                    filterValue={departmentFilter}
                                    onChange={handleDepartmentFilter}
                                />
                                <DatePicker
                                    label=""
                                    onDateChange={handleDateFilter}
                                    initialDate={dateFilter}
                                />
                                {/* <SortFilter
                                    sortBy={sortBy}
                                    onChange={handleSortChange}
                                /> */}
                            </div>
                        </div>
                        <Tooltips
                            title='Add New Announcement'
                            placement="top" arrow={true}
                        >
                            <button className="add-employee-btn" onClick={() => navigate('/add-new-announcement')}><UserPlus size={16} /> </button>
                        </Tooltips>

                        {/* <button className="menu-btn"><MoreVertical size={24} /></button> */}
                        <div className="relative" ref={menuRef}>
                            <Tooltips title="Import & Export" placement="top" arrow={true}>
                                <button
                                    className="menu-btn"
                                    onClick={() => setOpen((prev) => !prev)}
                                >
                                    <MoreVertical size={24} />
                                </button>
                            </Tooltips>

                            {open && (
                                <div className="menu-popup">
                                    <ImportList
                                        apiFunction={handleAnnouncementImportRow}
                                        onImportSuccess={() => {
                                            // fetchDepartmentList();
                                            setOpen(false);
                                        }}
                                    />
                                    <ExportList
                                        data={announcementLists}
                                        headers={announcementExportHeaders}
                                        filename="Announcement.csv"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            </div>
            <main className="dashboard-content">
                <>
                    <aside className="filters-sidebar">
                        <div>
                            <ul>
                                {announcementStatusOptions?.map((status, index) => {
                                    const Icon = statusConfig[status?.id]?.icon || SquareMenu; // Fallback icon
                                    let count = 0;
                                    if (status?.label === "All") {
                                        count = metaData?.all ?? 0;
                                    } else {
                                        count = metaData?.[status?.label.toLowerCase().replace(" ", "")] ?? 0;
                                    }
                                    return (
                                        <li key={index} className={statusFilter == status?.id ? "active" : ""} onClick={() => handleStatusFilter(status?.id)}>
                                            {/* UPDATED: Grouped icon and text */}
                                            <div className="status-label">
                                                <Icon size={16} strokeWidth={1.5} />
                                                <span>{status?.label}</span>
                                            </div>
                                            <span className="count">({String(count)?.padStart(2, '0')})</span>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="clearBTN">
                                {(departmentFilter !== 'All' || dateFilter !== null) && (
                                    <button className="clear-filters-btn" onClick={resetFilters}>
                                        <span>
                                            Clear filter
                                        </span>
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </aside>

                    {view === 'list' && (
                        <div className="employee-table-wrapper">

                            <table className="employee-table emp-t-4">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Department</th>
                                        <th>Created At Date</th>
                                        <th>Expiry Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                {/* // ❗ 3 new loding */}
                                {(announcementLoading || announcementLists?.length > 0) ? (
                                    <>
                                        <tbody className={`${announcementLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                            {ListData?.map(item => {
                                                const StatusIcon = statusConfig[item?.status]?.icon || XCircle;
                                                const statusClassName = statusConfig[item?.status]?.className;
                                                return (
                                                    <tr
                                                        key={item?.id}
                                                        className="employee-row"
                                                        onClick={() => navigate(`/announcement-details/${item?.id}`)}
                                                    >
                                                        <td>
                                                            <div className="loadingtd department Semi_Bold">{item?.subject}</div>
                                                        </td>
                                                        <td>
                                                            <div className="loadingtd department">{item?.department?.department_name}</div>
                                                        </td>
                                                        <td>
                                                            <div className="loadingtd department">{formatDate(item?.created_at)}</div>
                                                        </td>
                                                        <td>
                                                            <div className="loadingtd contact-info">
                                                                <div><span>{formatDate(item?.expiry)}</span></div>
                                                            </div>
                                                        </td>
                                                        <td className="loadingtd ">
                                                            <div className={`status-badge ${statusClassName}`}>
                                                                <StatusIcon size={16} />
                                                                <span>{statusConfig[item?.status]?.label}</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>

                                    </>
                                ) : (
                                    // ❗ 4 new loding
                                    <tbody className="table_not_found">
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                                                {(!announcementLoading && announcementLists?.length === 0) && (
                                                    <ListDataNotFound module="announcement" handleReset={resetFilters} />
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}

                            </table>
                            {(!announcementLoading || showMoreLess) &&
                                <div className="load-more-container">
                                    {/* Show More button if not all jobs loaded */}
                                    {(visibleCount < totalAnnouncements) && (
                                        <button onClick={handleLoadMore} className="load-more-btn">
                                            {(announcementLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                        </button>
                                    )}
                                    {/* Show Less button if all jobs are loaded */}
                                    {(visibleCount >= totalAnnouncements && totalAnnouncements > INITIAL_VISIBLE_COUNT) && (
                                        <button onClick={handleShowLess} className="load-more-btn">
                                            {(announcementLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                        </button>
                                    )}
                                </div>
                            }
                        </div>
                    )}
                </>
            </main>
        </div >
    )
}
