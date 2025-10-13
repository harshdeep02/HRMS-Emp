import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
// Icons used in the component
import {
    XCircle,
    CheckCircle2,
    CalendarMinus,
} from "lucide-react";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import '../../EmployeeOnboarding/Leaves/tableDetail.scss'
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import DynamicLoader from "../../../utils/common/DynamicLoader/DynamicLoader.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getLeaveSummaryDetails } from "../../../Redux/Actions/leaveActions.js";
import { leavesStatusOptions } from "../../../utils/Constant.js";
import DynamicFilter from "../../../utils/common/DynamicFilter.jsx";
import DatePicker from "../../../utils/common/DatePicker/DatePicker.jsx";
import { getLeaveTypeList } from "../../../Redux/Actions/leaveMasterActions.js";
import { formatDate3 } from "../../../utils/common/DateTimeFormat.js";
import EllipsisSpan from "../../../utils/EllipsisSpan.jsx";

export const LeaveSummary = ({ emp_id }) => {

    const dispatch = useDispatch();

    const leaveSummaryData = useSelector((state) => state?.leaveSummaryDetails);
    const leaveSummmary = leaveSummaryData?.data?.leave_summary || [];

    const leaveList = leaveSummaryData?.data?.leaves || [];
    const totalCount = leaveSummaryData?.data?.count || 0;
    const totalLeaves = leaveSummaryData?.data?.all || 0;
    const leaveLoading = leaveSummaryData?.loading;

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

    const INITIAL_VISIBLE_COUNT = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [leaveTypeFilter, setLeaveTypeFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState(null); // State for date filter
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [view, setView] = useState('list');

    const showSummaryData = [
        {
            id: "available",
            title: "Available Leaves",
            leaves: leaveSummmary?.map((l) => ({ type: l?.leave_name, count: l?.available_days })),
        },
        {
            id: "booked",
            title: "Booked Leaves",
            leaves: leaveSummmary?.map((l) => ({ type: l?.leave_name, count: l?.booked })),
        },
        {
            id: "remaining",
            title: "Remaining Leaves",
            leaves: leaveSummmary?.map((l) => ({ type: l?.leave_name, count: l?.remaining })),
        },
    ];

    const fetchEmpLeaves = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");
            const sendData = {
                fy,
                noofrec: visibleCount,
                user_id: emp_id,
                currentpage: currentPage,
                ...(dateFilter && { custom_date: formatDate3(new Date(dateFilter)) }),
                ...(leaveTypeFilter && leaveTypeFilter !== "All" && { leave_type_id: leaveTypeFilter }),
                // ...(searchTerm && { search: searchTerm }),
                // ...(sortBy && { sort_by: sortBy }), // backend should handle sort
                // ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
            };
            await dispatch(getLeaveSummaryDetails(sendData));
            setIsLoadingMore(false);
        } catch (error) {
            console.error("Error fetching leave list:", error);
            setIsLoadingMore(false);
        }
    }, [visibleCount, currentPage, dateFilter, leaveTypeFilter]);

    useEffect(() => {
        fetchEmpLeaves();
    }, [visibleCount, currentPage, dateFilter, leaveTypeFilter]);

    // Data for the DepartmentFilter component, structured correctly for this page
    // const leaveTypeOptions = [
    //     { label: "All Leave Types", value: "All" },
    //     { label: "Casual Leave", value: "Casual Leave" },
    //     { label: "Sick Leave", value: "Sick Leave" },
    //     { label: "Maternity Leave", value: "Maternity Leave" },
    //     { label: "Annual Leave", value: "Annual Leave" },
    //     { label: "Business Trip", value: "Business Trip" },
    //     { label: "Earned Leave", value: "Earned Leave" },
    // ];

    // const statusConfig = {
    //     Approved: { label: "Approved", icon: CheckCircle2, className: "approved" },
    //     Declined: { label: "Declined", icon: XCircle, className: "declined" },
    //     Pending: { label: "Pending", icon: Clock, className: "pending" },
    // };

    const statusConfig = leavesStatusOptions?.reduce((acc, status) => {
        if (!status?.id) return acc; // skip undefined values
        acc[status?.id] = {
            label: status?.label,
            icon: status?.icon,
            className: status?.label.replace(/\s+/g, "-").toLowerCase()
        };
        return acc;
    }, {});

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + INITIAL_VISIBLE_COUNT);
        setIsLoadingMore(true);
    };

    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setIsLoadingMore(true);
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

    const resetFilters = () => {
        setLeaveTypeFilter("All");
        setDateFilter(null); // Reset date filter
        // Clear date input manually if needed
        const dateInput = document.getElementById('date-filter-input');
        if (dateInput) dateInput.value = '';
    };

    const formatCount = (count) => {
        return count.toString().padStart(2, "0");
    };
    const dummData = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        name: "",
        email: "",
        mobile_no: " ",
        department: "",
        status: " "
    }));

    // ❗ 2 new loding
    const ListData = (leaveLoading && (!isLoadingMore || leaveList?.length === 0)) ? dummData : leaveList;


    return (
        <div className="otherDetailPageSroll leavesummPageSroll">
            <div className="leave-summary-card">
                <h2 className="card-title">Leave Summary</h2>
                <div className="summary-content">
                    {leaveSummmary?.length > 0 &&
                        showSummaryData?.map((row) => (
                            <div className="leave-row" key={row?.id}>
                                <div className="row-header">
                                    <span className="icon"><CalendarMinus size={16} /></span>
                                    <span className="row-title">{row?.title}</span>
                                </div>
                                <div className="leaves-list">
                                    {row?.leaves?.map((leave) => (
                                        <div className="leave-badge" key={leave?.type}>
                                            <span className="leave-count">{formatCount(leave?.count)}</span>
                                            <span className="leave-type">{leave?.type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div className="detail-table-wrapper">
                <div className="box_head">
                    <h2>Leave History</h2>
                    <div className="toolbar_d">
                        <div className="toolbar-actions">
                            <div className=" ">
                                <DynamicFilter
                                    filterBy="leave_type"
                                    filterValue={leaveTypeFilter}
                                    onChange={handleLeaveTypeFilter}
                                    options={leaveTypeFilterOptions}
                                />
                            </div>
                            <DatePicker
                                label=""
                                onDateChange={handleDateFilter}
                                initialDate={dateFilter}
                            />
                        </div>
                    </div>
                </div>
                {/* {(leaveLoading && !isLoadingMore) ? (
                    <div style={{ padding: '0px', textAlign: 'center' }}>
                        <DynamicLoader mode='one' listType='emp-a-5' type={view} count={6} />
                    </div>
                ) : */}
                {/* {leaveList?.length > 0 ? ( */}
                <table className="detail-table emp-t-5 project-history-table empProject">
                    <thead>
                        {/* <tr className="visually-hidden"></tr> */}
                        <tr>
                            <th>Leave Master</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>Reason</th>
                            <th className="status-badge">STATUS</th>
                        </tr>
                    </thead>
                    {(leaveLoading || leaveList?.length > 0) ? (

                        <tbody className={`${leaveLoading && !isLoadingMore ? 'LoadingList' : ''}`}>
                            {ListData?.map((item) => {
                                const StatusIcon = statusConfig[item.status]?.icon || XCircle;
                                const statusClassName = statusConfig[item.status]?.className || 'default';
                                return (
                                    <tr key={item.id} className="employee-row detail_tr_row ">
                                        <td><div className="department purplle Semi_Bold loadingtd">{item?.leave_master?.leave_name}</div></td>
                                        <td><div className="department loadingtd">{item?.from_date}</div></td>
                                        <td><div className="department loadingtd">{item?.to_date}</div></td>
                                        <td><div className="contact-info loadingtd">
                                            <EllipsisSpan text={item?.reason} wordsToShow={7} />
                                        </div>
                                        </td>
                                        <td className="loadingtdbig">
                                            <div className={`status-badge ${statusClassName}`}>
                                                <StatusIcon size={16} />
                                                <span>{statusConfig[item.status]?.label}</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    ) : (

                        <tbody className="table_not_found">
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', paddingLeft: '120px' }}>
                                    {(!leaveLoading && leaveList?.length === 0) && (
                                        <ListDataNotFound module="Leaves" handleReset={resetFilters} />
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    )}

                </table>
                {/* ) : (!leaveLoading && leaveList?.length === 0) && (
                    <ListDataNotFound module="Leave Summary" handleReset={resetFilters} />

                )} */}
            </div>
            <div className="load-more-container">
                {visibleCount < totalCount && (
                    <button onClick={handleLoadMore} className="load-more-btn">
                        {(leaveLoading && isLoadingMore) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                    </button>
                )}
                {visibleCount >= totalCount && totalCount > INITIAL_VISIBLE_COUNT && (
                    <button onClick={handleShowLess} className="load-more-btn">
                        {(leaveLoading && isLoadingMore) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                    </button>
                )}
            </div>
        </div>
    )
}
