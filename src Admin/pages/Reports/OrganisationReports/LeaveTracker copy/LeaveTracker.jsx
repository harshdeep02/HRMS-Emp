import React, { useState, useEffect, useRef } from 'react';
import LoadingDots from '../../../../utils/common/LoadingDots/LoadingDots';
import SearchBox from '../../../../utils/common/SearchBox.jsx';
import ListDataNotFound from '../../../../utils/common/ListDataNotFound.jsx';
import DynamicFilter from '../../../../utils/common/DynamicFilter.jsx';
import DatePicker from '../../../../utils/common/DatePicker/DatePicker.jsx';
import ExportList from '../../../../utils/common/Export/ExportList.jsx';
import { User, TrendingUp, Calendar, CheckCircle2, RefreshCcw, SquareMenu, X, ShieldX, Clock } from "lucide-react";
import { useNavigate } from 'react-router-dom';
// import './LeaveReport.scss';
// import './AppraisalHistory.scss';

const INITIAL_VISIBLE_COUNT = 5;

// Dummy data for the Leave Tracker table
const DUMMY_LEAVE_HISTORY = [
    { id: 1, employeeName: 'Arjun Patel', employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-e6950c3d6110?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvcnRyYWl0JTIwYXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', department: 'Human Resources', totalAllottedLeaves: 20, leavesUsed: 6, remainingLeaves: 14 },
    { id: 2, employeeName: 'Ethan Kim', employeeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHBvcnRyYWl0JTIwYXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', department: 'Customer Support', totalAllottedLeaves: 20, leavesUsed: 6, remainingLeaves: 14 },
    { id: 3, employeeName: 'Liam O\'Connor', employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHBvcnRyYWl0JTIwYXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', department: 'Finance', totalAllottedLeaves: 20, leavesUsed: 6, remainingLeaves: 14 },
    { id: 4, employeeName: 'Zara Ali', employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHBvcnRyYWl0JTIwYXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', department: 'Sales', totalAllottedLeaves: 20, leavesUsed: 6, remainingLeaves: 14 },
    { id: 5, employeeName: 'M. S. Subramaniam', employeeAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fHBvcnRyYWl0JTIwYXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', department: 'Development', totalAllottedLeaves: 20, leavesUsed: 6, remainingLeaves: 14 },
    { id: 6, employeeName: 'Nina Rodriguez', employeeAvatar: 'https://images.unsplash.com/photo-1519085360753-af029168c872?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fHBvcnRyYWl0JTIwYXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', department: 'Research And Development', totalAllottedLeaves: 20, leavesUsed: 6, remainingLeaves: 14 },
    { id: 7, employeeName: 'Sofia Chen', employeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fHBvcnRyYWl0JTIwYXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', department: 'Marketing', totalAllottedLeaves: 20, leavesUsed: 6, remainingLeaves: 14 },
    { id: 8, employeeName: 'Rajesh Kumar', employeeAvatar: 'https://images.unsplash.com/photo-1547425260-76bc45649c0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fHBvcnRyYWl0JTIwYXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', department: 'IT Services', totalAllottedLeaves: 20, leavesUsed: 6, remainingLeaves: 14 },
];

// Status options for the filter
const LeaveStatusOptions = [
    { id: 1, label: "Approved", icon: CheckCircle2 },
    { id: 2, label: "Pending", icon: Clock },
    { id: 3, label: "Rejected", icon: ShieldX },
];

// Department options for the filter
const DepartmentOptions = [
    { id: 0, label: "All" },
    { id: 1, label: "Human Resources" },
    { id: 2, label: "Customer Support" },
    { id: 3, label: "Finance" },
    { id: 4, label: "Sales" },
    { id: 5, label: "Development" },
    { id: 6, label: "Research And Development" },
    { id: 7, label: "Marketing" },
    { id: 8, label: "IT Services" },
];

const LeaveTracker = () => {
        const navigate = useNavigate();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [departmentFilter, setDepartmentFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState(null);
    const [filteredHistory, setFilteredHistory] = useState(DUMMY_LEAVE_HISTORY);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const searchBoxRef = useRef();

    const exportHeaders = [
        { label: 'Employee Name', key: 'employeeName' },
        { label: 'Department', key: 'department' },
        { label: 'Total Allotted Leaves', key: 'totalAllottedLeaves' },
        { label: 'Leaves Used', key: 'leavesUsed' },
        { label: 'Remaining Leaves', key: 'remainingLeaves' }
    ];

    // Static data from the provided image
    const leaveOverviewData = [
        { title: 'Total Employees on leave', value: 12, change: '+12.9%' },
        { title: 'On Casual leave', value: 6, change: '+12.9%' },
        { title: 'On Sick leave', value: 2, change: '+12.9%' },
        { title: 'On Annual Leave', value: 4, change: '+12.9%' },
    ];

    useEffect(() => {
        let filtered = DUMMY_LEAVE_HISTORY.filter(item =>
            item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.department.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (statusFilter !== 'All') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        if (departmentFilter !== 'All') {
            filtered = filtered.filter(item => item.department === departmentFilter);
        }

        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            filtered = filtered.filter(item => {
                // This logic needs to be updated if the data includes dates, but for now, we'll keep it simple as per the image
                return true; 
            });
        }

        setFilteredHistory(filtered);
    }, [searchTerm, statusFilter, departmentFilter, dateFilter]);

    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handleStatusFilter = (newFilter) => {
        setStatusFilter(newFilter);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handleDepartmentFilter = (newFilter) => {
        setDepartmentFilter(newFilter);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handleDateFilter = (date) => {
        setDateFilter(date);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleCount(prev => prev + 5);
            setIsLoadingMore(false);
        }, 500);
    };

    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('All');
        setDepartmentFilter('All');
        setDateFilter(null);
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();
        }
    };

    const hasActiveFilters = searchTerm || statusFilter !== 'All' || departmentFilter !== 'All' || dateFilter;

    return (
        <div className="leave-report-page">
                        			<button onClick={() => navigate(`/organisation-reports`)} className="close_nav header_close">Close</button>

            <div className="leave-dashboard-header">
                <header className="leave-top-header">
                    <div className="header-left">
                        <h1>Overview</h1>
                    </div>
                    <div className="header-right export-button-main">
                        <ExportList
                            data={DUMMY_LEAVE_HISTORY}
                            headers={exportHeaders}
                            filename="leave_tracker_history.csv"
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
                                <div className="overview-card-value">{card.value}</div>
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

            <div className="appraisal-history-page">
                <div className="detail-table-wrapper table3types">
                    <div className="box_head">
                        <div className="toolbar_d">
                            <SearchBox onSearch={handleSearch} placeholder="Search Leaves..." ref={searchBoxRef} />
                            <div className="toolbar-actions">
                                <div className="border_box">
                                    <DynamicFilter
                                        label="Leave Type"
                                        filterBy="leaveType"
                                        options={[{ value: "all", label: "All" }, { value: "Casual Leave", label: "Casual Leave" }, { value: "Sick Leave", label: "Sick Leave" }, { value: "Annual Leave", label: "Annual Leave" }]}
                                        filterValue={statusFilter}
                                        onChange={(value) => handleStatusFilter(value)}
                                    />
                                </div>
                                <div className="border_box">
                                    <DynamicFilter
                                        label="Department"
                                        filterBy="department"
                                        options={DepartmentOptions.map(option => ({ value: option.label, label: option.label }))}
                                        filterValue={departmentFilter}
                                        onChange={(value) => handleDepartmentFilter(value)}
                                    />
                                </div>
                            </div>
                            <DatePicker
                                label="Date"
                                onDateChange={handleDateFilter}
                                initialDate={dateFilter}
                            />
                        </div>
                    </div>
                    {filteredHistory.length > 0 ? (
                        <div className="employee-table-wrapper">
                            <table className="employee-table emp-t-5">
                                <thead>
                                    <tr className='table-h eader'>
                                        <th>EMPLOYEE</th>
                                        <th>DEPARTMENT</th>
                                        <th>TOTAL ALLOTTED LEAVES</th>
                                        <th>LEAVES USED</th>
                                        <th>REMAINING LEAVES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredHistory.slice(0, visibleCount).map((item) => {
                                        return (
                                            <tr key={item.id} className=" employee-row" onClick={() => navigate(`/organisation-reports/leave-tracker-list/`)}>
                                                <td className="td">
                                                    <div className="info_img">
                                                        <img src={item.employeeAvatar} alt={item.employeeName} className="avatar" />
                                                        <div>{item.employeeName}</div>
                                                    </div>
                                                </td>
                                                <td>{item.department}</td>
                                                <td>{item.totalAllottedLeaves}</td>
                                                <td>{item.leavesUsed}</td>
                                                <td>{item.remainingLeaves}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <ListDataNotFound module="Leave History" handleReset={resetFilters} />
                    )}
                </div>
            </div>
            <div className="load-more-container">
                {visibleCount < filteredHistory.length ? (
                    <button onClick={handleLoadMore} className="load-more-btn">
                        {isLoadingMore ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                    </button>
                ) : (
                    visibleCount >= INITIAL_VISIBLE_COUNT && filteredHistory.length > INITIAL_VISIBLE_COUNT && (
                        <button onClick={handleShowLess} className="load-more-btn">
                            Show Less
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default LeaveTracker;