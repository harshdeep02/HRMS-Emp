import React, { useState, useEffect, useRef, useCallback } from "react";
// UPDATED: Added new icons
import { List, MoreVertical, TrendingUp, UserPlus, X, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import DynamicLoader from "../../../utils/common/DynamicLoader/DynamicLoader.jsx";
import ExportList from "../../../utils/common/Export/ExportList.jsx";
import ImportList from "../../../utils/common/Import/ImportList.jsx";
import { leavesTypesStatusOptions } from "../../../utils/Constant.js";
import { createNewLeaveType, getLeaveTypeList } from "../../../Redux/Actions/leaveMasterActions.js";
import './LeaveTypeList.scss'
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
const INITIAL_VISIBLE_COUNT = 9;

export const LeaveTypeList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux 
    const leaveMasterData = useSelector((state) => state?.leaveMasterList);
    const leaveMasterList = leaveMasterData?.data?.result || [];
    const totalLeaves = leaveMasterData?.data?.count || 0;
    const metaData = leaveMasterData?.data?.metadata || {};
    const leaveTypeLoading = leaveMasterData?.loading || false;

    const statusConfig = leavesTypesStatusOptions?.reduce((acc, status) => {
        if (!status?.id) return acc; // skip undefined values

        const label = status?.label || "All";
        const icon = status.icon || List; // fallback to Users if no mapping exists

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
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [view, setView] = useState('list');
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [open, setOpen] = useState(false);
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

    const fetchLeaveTypesList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");
            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(searchTerm && { search: searchTerm }),
            };
            await dispatch(getLeaveTypeList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error Fetching Leaves Types List:", error);
            setShowMoreLess(false);
        }
    }, [dispatch, searchTerm, statusFilter, visibleCount, currentPage]);

    useEffect(() => {
        fetchLeaveTypesList();
    }, [fetchLeaveTypesList]);

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setShowMoreLess(false);
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();
        }
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
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const exportHeaders = [
        { label: 'Leave Type', key: (dep) => dep?.leave_name || 'N/A' },
        { label: 'Type', key: (dep) => dep?.leave_type || 'N/A' },
        { label: 'Days', key: (dep) => dep?.available_days || 'N/A' },
        { label: 'Status', key: (dep) => dep?.status || 'N/A' }
    ];

    const handleImportRow = async (row) => {

        const payload = {
            leave_type: row['Leave Type'],
            type_of_leave: row['Type'],
            available_days: row['Days'],
            status: row['Status'],
        };
        return dispatch(createNewLeaveType(payload));
    };
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


    const ListData = (leaveTypeLoading && (!showMoreLess || leaveMasterList?.length === 0)) ? dummData : leaveMasterList;

    return (
        <div className="leaveTypeListMain">
            <div className="employee-dashboard-list depatmentListMain">
                <div className="dashboard-sticky-header">
                    <header className="top-header">
                        <div className="header-left">
                            <div>
                                <h1>All Leave Type List
                                    <span className="total-count"> <TrendingUp size={16} className="TrendingUp" />
                                        {metaData?.all}</span>
                                </h1>
                                <p>See Leaves Type All List Below</p>
                            </div>
                        </div>
                        <div className="header-right">
                            <div className="toolbar">
                                <SearchBox
                                    onSearch={handleSearch}
                                    placeholder="Search Leave Type..."
                                    ref={searchBoxRef}
                                />
                                <div className="toolbar-actions">
                                </div>
                            </div>
                            <Tooltips title='Add Leave Type' placement="top" arrow={true}>
                                <button className="add-employee-btn" onClick={() => navigate('/add-leave-type')}><UserPlus size={16} /> </button>
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
                                                fetchLeaveTypesList();
                                                setOpen(false);
                                            }}
                                        />
                                        <ExportList
                                            data={leaveMasterList}
                                            headers={exportHeaders}
                                            filename="LeaveType.csv"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>
                </div>

                <main className={`dashboard-content`} >
                    <>
                        <aside className="filters-sidebar">
                            <div>
                                <ul>
                                    {leavesTypesStatusOptions?.map(status => {
                                        const Icon = status?.icon || List; // fallback icon
                                        let count = 0;

                                        if (status.label === "All") {
                                            count = metaData?.all ?? 0;
                                        } else {
                                            count = metaData?.[status?.label.toLowerCase().replace(" ", "")] ?? 0;
                                        }

                                        return (
                                            <li
                                                key={status?.id}
                                                className={statusFilter === status?.id ? "active" : ""}
                                                onClick={() => handleStatusFilter(status?.id)}
                                            >
                                                <div className="status-label">
                                                    <Icon size={16} strokeWidth={1.5} />
                                                    <span>{status?.label}</span>
                                                </div>
                                                <span className="counts">({String(count)?.padStart(2, '0')})</span>
                                            </li>
                                        );
                                    })}

                                </ul>
                                <div className="clearBTN">
                                    {(statusFilter !== 'All') && (
                                        <button className="clear-filters-btn" onClick={resetFilters}>
                                            <span>Clear filters</span>
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </aside>
                        <div className="employee-table-wrapper">
                            <table className="employee-table emp-t-4">
                                <thead>
                                    <tr>
                                        <th>Leave Type</th>
                                        <th>Type</th>
                                        <th>Days</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                {(leaveTypeLoading || leaveMasterList?.length > 0) ? (

                                    <tbody className={`${leaveTypeLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                        {ListData?.map(item => {
                                            const StatusIcon = statusConfig[item?.status]?.icon || XCircle;
                                            const statusClassName = statusConfig[item?.status]?.className;
                                            return (
                                                <tr
                                                    key={item?.id}
                                                    className="employee-row"
                                                    onClick={() => navigate(`/leave-type-details/${item?.id}`)}
                                                >
                                                    <td className="">
                                                        <div className="department loadingtd Semi_Bold">{item?.leave_name}</div>
                                                    </td>
                                                    <td className="loadingtd">
                                                        <div className="department">{item?.leave_type || '-'}</div>
                                                    </td>
                                                    <td className="loadingtd">
                                                        <div className="department">{item?.available_days || '-'} Days</div>
                                                    </td>
                                                    <td className="loadingtd">
                                                        <div className={`status-badge ${statusClassName}`}>
                                                            <StatusIcon size={16} />
                                                            <span>{statusConfig[item?.status]?.label || 'Unmatched'}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        )}
                                    </tbody>
                                ) : (
                                    <tbody className="table_not_found">
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                                                {(!leaveTypeLoading && leaveMasterList?.length === 0) && (
                                                    <ListDataNotFound module="applicants" handleReset={resetFilters} />
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}

                            </table>
                                <div className="load-more-container">
                                    {(visibleCount < totalLeaves) && (
                                        <button onClick={handleLoadMore} className="load-more-btn">
                                            {(leaveTypeLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                        </button>
                                    )}
                                    {(visibleCount >= totalLeaves && totalLeaves > INITIAL_VISIBLE_COUNT) && (
                                        <button onClick={handleShowLess} className="load-more-btn">
                                            {(leaveTypeLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                        </button>
                                    )}
                                </div>
                            
                        </div>
                    </>
                </main>

            </div>
        </div>
    )
}
