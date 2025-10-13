import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import LoadingDots from '../../../../utils/common/LoadingDots/LoadingDots';
import SearchBox from '../../../../utils/common/SearchBox.jsx';
import ListDataNotFound from '../../../../utils/common/ListDataNotFound.jsx';
import { User, TrendingUp } from "lucide-react";
import './LeaveReport.scss'; // Import the new SCSS file
import ExportList from '../../../../utils/common/Export/ExportList.jsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../../../../services/login.js';
import DynamicFilter from '../../../../utils/common/DynamicFilter.jsx';
import { getLeaveTracker } from '../../../../Redux/Actions/report/organizationalReport/organizationReportAction.js';
import defaultImage from "../../../../assets/default-user.png";
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

const INITIAL_VISIBLE_COUNT = 9;

const LeaveTracker = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = getUserData()

    const leaveTrackerData = useSelector((state) => state?.leaveTracker);
    const leaveList = leaveTrackerData?.data?.emp_leaves || [];
    const LeaveReportLoading = leaveTrackerData?.loading || false
    const leaveBalnceData = leaveTrackerData?.data?.leave_summary || []
    const totalLeave = leaveTrackerData?.data?.count

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [leaveTypeFilter, setLeaveTypeFilter] = useState("All")
    const [dateFilter, setDateFilter] = useState(null);
    const [departmentFilter, setDepartmentFilter] = useState("All");
    const searchBoxRef = useRef();
    
    const fetchLeaveList = useCallback(async () => {
        try {
            const sendData = {
                noofrec: visibleCount,
                currentpage: currentPage, // Assuming pagination is handled by 'noofrec' for now
                // ...(leaveTypeFilter && leaveTypeFilter !== "All" && { leave_type_id: leaveTypeFilter }),
                // ...(dateFilter && { custom_date: formatDate3(new Date(dateFilter)) }),
                ...(departmentFilter && departmentFilter !== "All" && { department_id: departmentFilter }),
                ...(searchTerm && { search: searchTerm }),
            };
            const res = await dispatch(getLeaveTracker(sendData));

        } catch (error) {
            console.error("Error fetching Leave list:", error);
        } finally {
            setShowMoreLess(false);
        }
    }, [dispatch, searchTerm, dateFilter, departmentFilter, visibleCount, leaveTypeFilter]);

    useEffect(() => {
        fetchLeaveList();
    }, [fetchLeaveList]);

    const exportHeaders = [
        { label: 'Leave Type', key: 'type' },
        { label: 'Start Date', key: 'startDate' },
        { label: 'End Date', key: 'endDate' },
        { label: 'Reason', key: 'reason' },
        { label: 'Status', key: 'status' }
    ];

    const leaveOverviewData = [
        { title: 'Total Employees on leave', value: leaveBalnceData?.[0]?.value, change: leaveBalnceData?.[0]?.change },
        { title: 'On Casual leave', value: leaveBalnceData?.[2]?.value, change: leaveBalnceData?.[2]?.change },
        { title: 'On Sick leave', value: leaveBalnceData?.[1]?.value, change: leaveBalnceData?.[1]?.change },
        { title: 'On Annual Leave', value: leaveBalnceData?.[3]?.value, change: leaveBalnceData?.[3]?.change },
    ];

    const handleSearch = (query) => {
        setSearchTerm(query);
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

    const handleLeaveTypeFilter = (newFilter) => {
        setLeaveTypeFilter(newFilter);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    const resetFilters = () => {
        setSearchTerm('');
        setShowMoreLess(false);
        setLeaveTypeFilter("All");
        setDateFilter(null);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();
        }
    };

    const handleDateFilter = (date) => {
        setCurrentPage(1);
        setDateFilter(date);
        setVisibleCount(INITIAL_VISIBLE_COUNT)
    };

    const handleDepartmentFilter = (newFilter) => {
        setDepartmentFilter(newFilter);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
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
    const ListData = (LeaveReportLoading && (!showMoreLess || leaveList?.length === 0)) ? dummData : leaveList;

    const applicantImage = (img) => img
        ? (() => {
            try {
                return JSON.parse(img);
            } catch {
                return img;
            }
        })()
        : defaultImage;

    const finYearData = `APR-${new Date().getFullYear()} To MAR-${new Date().getFullYear() + 1}`

    return (
        <div className="leaveTrackerMain">
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
                                    <div className="overview-card-value">{LeaveReportLoading && !leaveBalnceData ? <StatusBadgeSkeleton /> : card.value}</div>
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
                <div className="detail-table-wrapper detail_table_wrapper_B_none" style={{ overflow: "visible" }}>
                    <div className="box_head">
                        <div className="toolbar_d">
                            <div className="finYearData">{finYearData}</div>

                            <div className="toolbar-actions">
                                <SearchBox
                                    ref={searchBoxRef}
                                    onSearch={handleSearch}
                                    placeholder="Search Employee..."
                                />
                                <DynamicFilter
                                    filterBy="department"
                                    filterValue={departmentFilter}
                                    onChange={handleDepartmentFilter}
                                />
                                {/* 
                            <DatePicker
                                label=""
                            onDateChange={handleDateFilter}
                            initialDate={dateFilter}
                            /> */}
                            </div>
                        </div>
                    </div>

                </div>
                {/* <div className="content_box_auto"> */}
                <div className="employee-table-wrapper">
                    <table className="employee-table emp-t-5">
                        <thead>
                            <tr>
                                <th >Employee</th>
                                <th>Department</th>
                                <th>Total allotted leaves</th>
                                <th>leaves used</th>
                                <th>Remaining leaves </th>
                            </tr>
                        </thead>
                        {(LeaveReportLoading || leaveList?.length > 0) ? (
                            <tbody className={`${LeaveReportLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                {ListData?.map(item => {
                                    return (
                                        <tr key={item?.id} className="employee-row decT ablHeight" onClick={() => navigate(`/organisation-reports/leave-tracker-detail/${item?.user_id}`)}>
                                            <td className="td " >
                                                <div className="info_img ">
                                                    <div className="loadingImg">

                                                        <img src={applicantImage(item?.image)} alt={item?.employee_name} className="avatar" />
                                                    </div>
                                                    <div className="name Semi_Bold loadingtdsmall ">{item?.employee_name}</div>
                                                </div>
                                            </td>
                                            <td className="loadingtd"><div className="department">{item?.department}</div></td>
                                            <td className="loadingtd samllTD" style={{ maxWidth: '80px' }}><div className="department">{item?.total_leaves}</div></td>
                                            <td className="loadingtd samllTD" style={{ maxWidth: '80px' }}><div className="department">{item?.taken_leaves}</div></td>
                                            <td className="loadingtd samllTD" style={{ maxWidth: '80px' }}><div className="department">{item?.balance_leaves}</div></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        ) : (
                            <tbody className="table_not_found">
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                                        {(!LeaveReportLoading && leaveList?.length === 0) && (
                                            <ListDataNotFound module="Leave" handleReset={resetFilters} />
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </table>

                    {(!LeaveReportLoading || showMoreLess) &&
                        <div className="load-more-container">
                            {(visibleCount < totalLeave) && (
                                <button onClick={handleLoadMore} className="load-more-btn">
                                    {(LeaveReportLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                </button>
                            )}
                            {(visibleCount >= totalLeave && totalLeave > INITIAL_VISIBLE_COUNT) && (
                                <button onClick={handleShowLess} className="load-more-btn">
                                    {(LeaveReportLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                </button>
                            )}
                        </div>
                    }
                </div>
                {/* </div> */}

            </div>
        </div>
    );
};

export default LeaveTracker;