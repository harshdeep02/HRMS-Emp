import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { MoreVertical, XCircle, Clock, TrendingUp, UserPlus, X, Rows4, CalendarCog, SquareMenu } from "lucide-react";
import "../../EmployeeOnboarding/EmployeeList/EmployeeList.scss";
import { useNavigate } from "react-router-dom";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import DynamicLoader from "../../../utils/common/DynamicLoader/DynamicLoader.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import { leavesStatusOptions } from "../../../utils/Constant.js";
import { getLeaveList } from "../../../Redux/Actions/leaveActions.js";
const INITIAL_VISIBLE_COUNT = 9;
import './LeaveList.scss'
import defaultImage from "../../../assets/default-user.png";
import ImportList from "../../../utils/common/Import/ImportList.jsx";
import ExportList from "../../../utils/common/Export/ExportList.jsx";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import { formatDate, formatDate3 } from "../../../utils/common/DateTimeFormat.js";
import DatePicker from "../../../utils/common/DatePicker/DatePicker.jsx";
import DynamicFilter from "../../../utils/common/DynamicFilter.jsx";
import { getLeaveTypeList } from "../../../Redux/Actions/leaveMasterActions.js";

export const LeaveList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const leaveListData = useSelector((state) => state?.leaveList);
    const leaveList = leaveListData?.data?.result || [];
    const totalLeave = leaveListData?.data?.count || 0; // This is the count for the CURRENT filter
    const leaveLoading = leaveListData?.loading || false;
    const metaData = leaveListData?.data?.metadata || {};

    const leaveMasterData = useSelector((state) => state?.leaveMasterList);
    const leaveMasterList = leaveMasterData?.data?.result || [];

    const leaveTypeFilterOptions = useMemo(
        () => leaveMasterList?.map(e => ({
            value: e?.id, label: e?.leave_name,
        })),
        [leaveMasterList]
    );

    useEffect(() => {
        if (leaveMasterList?.length === 0) dispatch(getLeaveTypeList());
    }, [])

    const statusConfig = leavesStatusOptions?.reduce((acc, status) => {
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

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState(null); // State for date filter
    const [leaveTypeFilter, setLeaveTypeFilter] = useState("All")
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [open, setOpen] = useState(false);
    const searchBoxRef = useRef();
    const menuRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const fetchLeaveList = useCallback(async () => {
        try {
            const sendData = {
                noofrec: visibleCount,
                currentpage: currentPage, // Assuming pagination is handled by 'noofrec' for now
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(searchTerm && { search: searchTerm }),
                ...(dateFilter && { custom_date: formatDate3(new Date(dateFilter)) }),
                ...(leaveTypeFilter && leaveTypeFilter !== "All" && { leave_type_id: leaveTypeFilter }),
            };
            const res = await dispatch(getLeaveList(sendData));

        } catch (error) {
            console.error("Error fetching Leave list:", error);
        } finally {
            setShowMoreLess(false);
        }
    }, [dispatch, searchTerm, statusFilter, visibleCount, dateFilter, leaveTypeFilter]);

    useEffect(() => {
        fetchLeaveList();
    }, [searchTerm, statusFilter, visibleCount, dateFilter, leaveTypeFilter]);

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setLeaveTypeFilter("All");
        setDateFilter(null); // Reset date filter
        setShowMoreLess(false);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();
        }
        // Clear date input manually if needed
        const dateInput = document.getElementById('date-filter-input');
        if (dateInput) dateInput.value = '';
    };

    const handleDateFilter = (date) => {
        setCurrentPage(1);
        setDateFilter(date);
        setVisibleCount(INITIAL_VISIBLE_COUNT)
    };

    const handleLeaveTypeFilter = (newFilter) => {
        setLeaveTypeFilter(newFilter);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
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

    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    // --- Export Headers for Leave Table ---
    const exportHeaders = [
        {
            label: 'Employee Name',
            key: (item) =>
                [item?.employee?.first_name, item?.employee?.last_name].filter(Boolean).join(" ") || 'N/A'
        },
        {
            label: 'Employee Avatar',
            key: (item) => item?.employee?.image || 'N/A'
        },
        {
            label: 'From Date',
            key: (item) => item?.from_date ? formatDate(item?.from_date) : 'N/A'
        },
        {
            label: 'To Date',
            key: (item) => item?.to_date ? formatDate(item?.to_date) : 'N/A'
        },
        {
            label: 'Date Of Request',
            key: (item) => item?.created_at ? formatDate(item?.created_at) : 'N/A'
        },
        {
            label: 'Leave Type Name',
            key: (item) => item?.leave_master?.leave_name || 'N/A'
        },
        {
            label: 'Type Of Leave',
            key: (item) => item?.type_of_leave || 'N/A'
        },
        {
            label: 'Status',
            key: (item) => statusConfig[item?.status]?.label || 'Unknown'
        }
    ];

    const handleImportRow = async (row) => {
        const payload = {
            employee: {
                name: row['Employee Name'],
                image: row['Employee Avatar'],
            },
            from_date: row['From Date'],
            to_date: row['To Date'],
            created_at: row['Date Of Request'],
            leave_master: {
                leave_name: row['Leave Type Name']
            },
            type_of_leave: row['Type Of Leave'],
            status: row['Status'],
        };
        // return dispatch(createNewLeave(payload));
    };

    const employeeImage = (img) => img
        ? (() => {
            try {
                return JSON.parse(img);
            } catch {
                return img;
            }
        })()
        : defaultImage;

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


    const ListData = (leaveLoading && !showMoreLess) ? dummyData : leaveList;

    return (
        <div className="leaveListMain">
            <div className="employee-dashboard-list app_List">
                <div className="dashboard-sticky-header">
                    <header className="top-header">
                        <div className="header-left">
                            <div>
                                <h1>All Leaves List
                                    <span className="total-count">
                                        <TrendingUp size={16} className="TrendingUp" />
                                        {metaData?.all}
                                    </span>
                                </h1>
                                <p>See all Leaves List Below</p>
                            </div>
                        </div>
                        <div className="header-right header_rightMain">
                            <div className="toolbar">
                                <SearchBox
                                    onSearch={handleSearch}
                                    placeholder="Search Leave..."
                                    ref={searchBoxRef}
                                />
                                <div className="toolbar-actions">
                                    <DynamicFilter
                                        filterBy="leave_type"
                                        filterValue={leaveTypeFilter}
                                        onChange={handleLeaveTypeFilter}
                                        options={leaveTypeFilterOptions}
                                    />
                                    <DatePicker
                                        label=""
                                        onDateChange={handleDateFilter}
                                        initialDate={dateFilter}
                                    />
                                </div>
                            </div>
                            <Tooltips title='Add New Leave' placement="top" arrow>
                                <button className="add-employee-btn" onClick={() => navigate('/add-new-leave')}><UserPlus size={16} /></button>
                            </Tooltips>
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
                                            apiFunction={handleImportRow}
                                            onImportSuccess={() => {
                                                // fetchLeaveList();
                                                setOpen(false);
                                            }}
                                        />
                                        <ExportList
                                            data={leaveList}
                                            headers={exportHeaders}
                                            filename="leave.csv"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>
                </div>

                <main className="dashboard-content">
                    <aside className="filters-sidebar">
                        <div>
                            <ul>
                                {leavesStatusOptions?.map((status) => {
                                    const Icon = status?.icon || SquareMenu; // Fallback icon
                                    let count = 0;
                                    if (status?.label === "All") {
                                        count = metaData?.all ?? 0;
                                    } else {
                                        count = metaData?.[status?.label?.toLowerCase().replace(" ", "")] ?? 0;
                                    }
                                    return (
                                        <li key={status.id} className={statusFilter == status?.id ? "active" : ""} onClick={() => handleStatusFilter(status?.id)}>
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
                            <div className="clearBTN">
                                {(dateFilter !== null || leaveTypeFilter !== "All") && (
                                    (!leaveLoading && !showMoreLess) &&
                                    <button className="clear-filters-btn" onClick={resetFilters}>
                                        <span>Clear filter</span><X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </aside>

                    <div className="content_box_auto">
                        <div className="employee-table-wrapper">
                            <table className="employee-table emp-t-5">
                                <thead>
                                    <tr>
                                        <th>Employee name</th>
                                        <th>leave period</th>
                                        <th>Date of request</th>
                                        <th>Leave type</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                {(leaveLoading || leaveList?.length > 0) ? (
                                    <tbody className={`${leaveLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                        {ListData?.map(item => {
                                            const StatusIcon = statusConfig[item?.status]?.icon || XCircle;
                                            const statusClassName = statusConfig[item?.status]?.className;
                                            return (
                                                <tr key={item?.id} className="employee-row" onClick={() => navigate(`/leave-details/${item?.id}`)}>
                                                    <td>
                                                        {(leaveLoading && !showMoreLess) ?
                                                            <div style={{ marginTop: '-9px' }}>
                                                                <div className="loadingImg"></div>
                                                                <div className="loadingtdsmall name"></div>
                                                            </div>
                                                            :
                                                            <>
                                                                <div className="info_img">
                                                                    <img
                                                                        src={employeeImage(item?.employee?.image)}
                                                                        alt={[item?.employee?.first_name, item?.employee?.last_name].filter(Boolean).join(" ")}
                                                                        className="avatar"
                                                                    />
                                                                    <div className="name Semi_Bold">{[item?.employee?.first_name, item?.employee?.last_name].filter(Boolean).join(" ")}</div>
                                                                </div>
                                                            </>
                                                        }
                                                    </td>
                                                    <td className="loadingtd"><div className="department">{formatDate(item?.from_date) || '-'} To {formatDate(item?.to_date) || '-'}</div></td>
                                                    <td className="loadingtd samllTD" style={{ maxWidth: '80px' }}><div className="department">{formatDate(item?.created_at) || '-'}</div></td>
                                                    <td style={{ minWidth: '160px' }}>
                                                        <div className="contact-info">
                                                            <div className="loadingtd"><CalendarCog size={14} /> <span>{item?.leave_master?.leave_name || '-'}</span></div>
                                                            <div className="loadingtd gap_3"><Clock size={14} /> <span className="phone">{item?.type_of_leave || '-'}</span></div>
                                                        </div>
                                                    </td>
                                                    <td className="loadingtd">
                                                        <div className={`status-badge ${statusClassName}`}>
                                                            <StatusIcon size={16} />
                                                            <span>{statusConfig[item?.status]?.label || 'Unknown'}</span>
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
                                                {(!leaveLoading && leaveList?.length === 0) && (
                                                    <ListDataNotFound module="Leave" handleReset={resetFilters} />
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>

                            {(!leaveLoading || showMoreLess) &&
                                <div className="load-more-container">
                                    {(visibleCount < totalLeave) && (
                                        <button onClick={handleLoadMore} className="load-more-btn">
                                            {(leaveLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                        </button>
                                    )}
                                    {(visibleCount >= totalLeave && totalLeave > INITIAL_VISIBLE_COUNT) && (
                                        <button onClick={handleShowLess} className="load-more-btn">
                                            {(leaveLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                        </button>
                                    )}
                                </div>
                            }
                        </div>
                    </div>
                </main>

            </div>
        </div>
    )
}
