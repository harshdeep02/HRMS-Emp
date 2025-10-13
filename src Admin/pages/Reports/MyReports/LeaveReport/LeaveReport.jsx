import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import LoadingDots from '../../../../utils/common/LoadingDots/LoadingDots';
import ListDataNotFound from '../../../../utils/common/ListDataNotFound.jsx';
import { User, TrendingUp, XCircle } from "lucide-react";
import './LeaveReport.scss'; // Import the new SCSS file
import ExportList from '../../../../utils/common/Export/ExportList.jsx';
import { LeaveReportStatusOptions } from '../../../../utils/Constant.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getLeaveList } from '../../../../Redux/Actions/leaveActions.js';
import { getUserData } from '../../../../services/login.js';
import { getMyLeaveReport } from '../../../../Redux/Actions/report/myReport/reportActions.js';
import { formatDate } from '../../../../utils/common/DateTimeFormat.js';
import DynamicFilter from '../../../../utils/common/DynamicFilter.jsx';
import { getLeaveTypeList } from '../../../../Redux/Actions/leaveMasterActions.js';
import EllipsisSpan from '../../../../utils/EllipsisSpan.jsx';
import StatusBadgeSkeleton from '../../../../utils/CalendarSkeletonLoader/StatusBadgeSkeleton.jsx';

const DUMMY_LEAVE_HISTORY = [
    { type: 'Casual Leave', startDate: '02 Jun 2025', endDate: '03 Jun 2025', reason: 'Some personal work in bank', status: 'Approved' },
    { type: 'Sick Leave', startDate: '10 Jul 2025', endDate: '11 Jul 2025', reason: 'Fever And Doctor\'s Appointment', status: 'Approved' },
    { type: 'Maternity Leave', startDate: '01 Aug 2025', endDate: '31 Jan 2026', reason: 'Childbirth And Recovery...', status: 'Approved' },
    { type: 'Annual Leave', startDate: '22 Dec 2025', endDate: '02 Jan 2026', reason: 'Holiday Vacation With Family', status: 'Rejected' },
    { type: 'Casual Leave', startDate: '25 Jan 2026', endDate: '26 Jan 2026', reason: 'Emergency at home', status: 'Pending' },
    { type: 'Sick Leave', startDate: '05 Feb 2026', endDate: '06 Feb 2026', reason: 'Severe cold and cough', status: 'Approved' },
    { type: 'Annual Leave', startDate: '15 Mar 2026', endDate: '20 Mar 2026', reason: 'Trip to the mountains', status: 'Approved' },
    { type: 'Casual Leave', startDate: '10 Apr 2026', endDate: '12 Apr 2026', reason: 'Personal errands', status: 'Rejected' },
];

const INITIAL_VISIBLE_COUNT = 2;
const INITIAL_VISIBLE_COUNT2 = 5;

const statusConfig = LeaveReportStatusOptions?.reduce((acc, status) => {
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

const LeaveReport = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = getUserData()

    const myLeaveReport = useSelector((state) => state?.myLeaveReport);
    const LeaveReport = myLeaveReport?.data?.leave_overview_data || [];
    const LeaveReportLoading = myLeaveReport?.loading || false
    const leaveBalnceData = myLeaveReport?.data?.leave || []
    const totalLeaveBal = myLeaveReport?.data?.count || 0
    const leaveListData = useSelector((state) => state?.leaveList);
    const leaveList = leaveListData?.data?.result || [];
    const totalLeave = leaveListData?.data?.count || 0; // This is the count for the CURRENT filter
    const leaveLoading = leaveListData?.loading || false;

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

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [visibleCount2, setVisibleCount2] = useState(INITIAL_VISIBLE_COUNT2);
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [showMoreLess2, setShowMoreLess2] = useState(false);
    const [leaveTypeFilter, setLeaveTypeFilter] = useState("All")
    const [statusFilter, setStatusFilter] = useState("All");
    const searchBoxRef = useRef();
    const fetchLeaveList = useCallback(async () => {
        try {
            const sendData = {
                user_id: id,
                noofrec: visibleCount2,
                currentpage: currentPage, // Assuming pagination is handled by 'noofrec' for now
                ...(leaveTypeFilter && leaveTypeFilter !== "All" && { leave_type_id: leaveTypeFilter }),
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
            };
            const res = await dispatch(getLeaveList(sendData));

        } catch (error) {
            console.error("Error fetching Leave list:", error);
        } finally {
            setShowMoreLess2(false);
        }
    }, [dispatch, statusFilter, visibleCount2, leaveTypeFilter]);

    const fetchLeaveReport = useCallback(async () => {
        try {
            const sendData = {
                noofrec: visibleCount,
                currentpage: currentPage, // Assuming pagination is handled by 'noofrec' for now
            };
            const res = await dispatch(getMyLeaveReport(sendData));

        } catch (error) {
            console.error("Error fetching Leave report:", error);
        }
        finally {
            setShowMoreLess(false);
        }
    }, [dispatch, searchTerm, visibleCount]);

    useEffect(() => {
        fetchLeaveList();
    }, [dispatch, statusFilter, visibleCount2, leaveTypeFilter]);

    useEffect(() => {
        fetchLeaveReport();
    }, [dispatch, visibleCount]);

    const exportHeaders = [
        { label: 'Leave Type', key: 'type' },
        { label: 'Start Date', key: 'startDate' },
        { label: 'End Date', key: 'endDate' },
        { label: 'Reason', key: 'reason' },
        { label: 'Status', key: 'status' }
    ];

    const leaveOverviewData = [
        { title: 'Total Leave', value: LeaveReport?.[0]?.value, change: LeaveReport?.[0]?.change },
        { title: 'Approved Leave', value: LeaveReport?.[1]?.value, change: LeaveReport?.[1]?.change },
        { title: 'Pending Leave', value: LeaveReport?.[2]?.value, change: LeaveReport?.[2]?.change },
        { title: 'Rejected Leave', value: LeaveReport?.[3]?.value, change: LeaveReport?.[3]?.change },
    ];

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
        setShowMoreLess(true);
    };
    const handleLoadMore2 = () => {
        setVisibleCount2(prev => prev + 6);
        setShowMoreLess2(true);
    };

    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    };
    const handleShowLess2 = () => {
        setVisibleCount2(INITIAL_VISIBLE_COUNT2);
        setShowMoreLess2(true);
    };
    const handleLeaveTypeFilter = (newFilter) => {
        setLeaveTypeFilter(newFilter);
        setVisibleCount2(INITIAL_VISIBLE_COUNT2); // reset count
    };

    const handleStatusFilter = (newFilter) => {
        setStatusFilter(newFilter);
        setVisibleCount2(INITIAL_VISIBLE_COUNT2); // reset count
    };

    const resetFilters = () => {
        setStatusFilter("All");
        setSearchTerm('');
        setShowMoreLess2(false);
        setShowMoreLess(false);
        setLeaveTypeFilter("All");
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setVisibleCount2(INITIAL_VISIBLE_COUNT2);
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();
        }
    };

    const dummData = Array.from({ length: 3 }, (_, i) => ({
        id: i,
        first_name: "",
        last_name: "",
        job_opening: { job_title: "" },
        email: "",
        mobile_no: "",
        status: "",
        user_image: null,
    }));
    const ListData = (leaveLoading && (!showMoreLess2 || leaveList?.length === 0)) ? dummData : leaveList;
    const leaveBalnceListData = (LeaveReportLoading && (!showMoreLess || leaveBalnceData?.length === 0)) ? dummData : leaveBalnceData;
    //leave Status
    const leaveStatusOptions = [
        { value: 1, label: "Approved" },
        { value: 2, label: "Pending" },
        { value: 3, label: "Rejected" },
    ];
        const finYearData = `APR-${new Date().getFullYear()} To MAR-${new Date().getFullYear() + 1}`


    return (
        <div className="leaveBalMain">
            <div className="leave-report-page">
                <button onClick={() => navigate(`/my-reports`)} className="close_nav header_close">Close</button>

                <div className="leave-dashboard-header">
                    <header className="leave-top-header">
                        <div className="header-left">
                            <h1>Overview</h1>
                        </div>
                        <div className="header-right export-button-main">
                            <ExportList
                                data={DUMMY_LEAVE_HISTORY}
                                headers={exportHeaders}
                                filename="leave_report.csv"
                            />
                        </div>
                    </header>
                </div>

                <div className="overview-card-container">
                    {leaveOverviewData.map((card, index) => (
                        <div key={index} className="overview-card">
                            <div className="overview-card-header">
                                <div className='left_side_title'>
                                    <span className="overview-card-title">{card.title}</span>
                                    <div className="overview-card-value">{(LeaveReportLoading && !showMoreLess) ? <StatusBadgeSkeleton /> : card.value}</div>
                                </div>
                                <div className="overview-card-icon">
                                    <User size={24} />
                                </div>
                            </div>
                            <div className="overview-card-footer">
                                <span className="overview-card-footer-text">From Last Month</span>
                                <div className='dreadUpbox'>
                                    <TrendingUp size={14} />
                                    <span className="overview-card-footer-text">{card.change}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="content_box_auto" style={{ marginBottom: "37px" }}>
                    <div className="employee-table-wrapper">
                        <table className="employee-table emp-t-4">
                            <thead>
                                <tr>
                                    <th>Leave Type</th>
                                    <th>ALLOTED</th>
                                    <th>TAKEN</th>
                                    <th>Balance</th>
                                </tr>
                            </thead>
                            {(LeaveReportLoading || leaveBalnceData?.length > 0) ? (
                                <tbody className={`${LeaveReportLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                    {leaveBalnceListData?.map(item => {
                                        return (
                                            <tr key={item?.id} className="employee-row">
                                                <td className=" Semi_Bold"><div className="loadingtd name">{item?.leave_name}</div></td>
                                                <td className="loadingtd"><div className="department">{item?.total_leaves}</div></td>
                                                <td className="loadingtd samllTD" style={{ maxWidth: '80px' }}><div className="department">{item?.taken_leaves}</div></td>
                                                <td className="loadingtd samllTD"><div className="department">{item?.balance_leaves}</div></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            ) : (
                                <tbody className="table_not_found">
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                                            {(!LeaveReportLoading && leaveBalnceData?.length === 0) && (
                                                <ListDataNotFound module="Leave" handleReset={resetFilters} />
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>

                        {(!LeaveReportLoading || showMoreLess) &&
                            <div className="load-more-container">
                                {(visibleCount < totalLeaveBal) && (
                                    <button onClick={handleLoadMore} className="load-more-btn">
                                        {(LeaveReportLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                    </button>
                                )}
                                {(visibleCount >= totalLeaveBal && totalLeaveBal > INITIAL_VISIBLE_COUNT) && (
                                    <button onClick={handleShowLess} className="load-more-btn">
                                        {(LeaveReportLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                    </button>
                                )}
                            </div>
                        }
                    </div>
                </div>

                <div className="detail-table-wrapper" style={{ overflow: "visible" }}>
                    <div className="box_head">
                        <h2>Leave History</h2>
                        <div className="toolbar_d">
                            <div className="finYearData">{finYearData}</div>

                            <div className="toolbar-actions">
                                <DynamicFilter
                                    filterBy="leave_type"
                                    filterValue={leaveTypeFilter}
                                    onChange={handleLeaveTypeFilter}
                                    options={leaveTypeFilterOptions}
                                />
                                <DynamicFilter
                                    filterBy="status"
                                    filterValue={statusFilter}
                                    onChange={handleStatusFilter}
                                    options={leaveStatusOptions}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="content_box_auto">
                    <div className="employee-table-wrapper">
                        <table className="employee-table emp-t-5">
                            <thead>
                                <tr>
                                    <th style={{ paddingLeft: "10px !important" }}>Leave Type</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            {(leaveLoading || leaveList?.length > 0) ? (
                                <tbody className={`${leaveLoading && !showMoreLess2 ? 'LoadingList' : ''}`}>
                                    {ListData?.map(item => {
                                        const StatusIcon = statusConfig[item?.status]?.icon || XCircle;
                                        const statusClassName = statusConfig[item?.status]?.className;
                                        return (
                                            <tr key={item?.id} className="employee-row decTablHeight">
                                                <td className=" Semi_Bold"><div className="loadingtd name">{item?.leave_master?.leave_name}</div></td>
                                                <td className=""><div className="loadingtd department">{formatDate(item?.from_date)}</div></td>
                                                <td className="loadingtd samllTD" style={{ maxWidth: '80px' }}><div className="department">{formatDate(item?.to_date)}</div></td>
                                                <td className="loadingtd samllTD">
                                                    <div className="department ">
                                                        <EllipsisSpan text={item?.reason} wordsToShow={5} />
                                                    </div>
                                                    {/* <div className="department">{item?.reason}</div> */}
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

                        {(!leaveLoading || showMoreLess2) &&
                            <div className="load-more-container">
                                {(visibleCount2 < totalLeave) && (
                                    <button onClick={handleLoadMore2} className="load-more-btn">
                                        {(leaveLoading && showMoreLess2) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                    </button>
                                )}
                                {(visibleCount2 >= totalLeave && totalLeave > INITIAL_VISIBLE_COUNT2) && (
                                    <button onClick={handleShowLess2} className="load-more-btn">
                                        {(leaveLoading && showMoreLess2) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                    </button>
                                )}
                            </div>
                        }
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LeaveReport;