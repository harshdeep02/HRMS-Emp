import React, { useEffect, useState } from 'react';
import { User, Download, TrendingUp } from 'lucide-react';
import DailyAttendanceReportChart from './DailyAttendanceReportChart';
import ExportList from '../../../../utils/common/Export/ExportList';
import DynamicFilter from '../../../../utils/common/DynamicFilter';
import './DailyAttendanceReport.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDailyAttendance } from '../../../../Redux/Actions/organizationActions';
import Loader from '../../../../utils/common/Loader/Loader';

const exportHeaders = [
    { label: 'Attendance Type', key: 'type' },
    { label: 'Count', key: 'value' },
];

const DailyAttendanceReport = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const DailyAttendanceData = useSelector((state) => state?.DailyAttendanceData);
    const summaryCards = DailyAttendanceData?.data?.summary_cards || [];
    const attendanceData = DailyAttendanceData?.data?.chart_data || {};
    const PerformanceLoading = DailyAttendanceData?.loading;

    // Filters
    const [departmentFilter, setDepartmentFilter] = useState("All");
    const [timeFilter, setTimeFilter] = useState('today'); // today | week | month

    // API Call
    useEffect(() => {
        const sendData = {
            filter: timeFilter, // today / week / month
            user_id: '',
            department: departmentFilter !== "All" ? departmentFilter : "",
        };
        dispatch(getDailyAttendance(sendData));
    }, [dispatch, timeFilter, departmentFilter]);

    // Department options
    const departmentOptions = [
        { id: 0, label: "All Departments", value: "All" },
        { id: 1, label: "Engineering", value: "Engineering" },
        { id: 2, label: "Sales", value: "Sales" },
        { id: 3, label: "Marketing", value: "Marketing" },
        { id: 4, label: "Human Resources", value: "Human Resources" },
    ];

    // Time filter options
    const timeOptions = [
        { id: 1, label: "Today", value: "today" },
        { id: 2, label: "This Week", value: "week" },
        { id: 3, label: "This Month", value: "month" },
        { id: 4, label: "Last Month", value: "last_month" },
    ];

    // Export data banayenge API ke chart_data se
    const exportData = [
        { type: 'Present', value: attendanceData.present || 0 },
        { type: 'Absent', value: attendanceData.absent || 0 },
        { type: 'Half Day', value: attendanceData.halfDay || 0 },
    ];
    const handleDepartmentFilter = (newFilter) => {
        setDepartmentFilter(newFilter);
    };

    if (PerformanceLoading && !attendanceData) {
        return <div className="loading-state"><Loader /></div>;
    }

    return (
        <div className="employee-attrition-page leave-report-page orgDailyAttMain">
            <button
                onClick={() => navigate(`/organisation-reports`)}
                className="close_nav header_close"
            >
                Close
            </button>

            <div className="leave-dashboard-header">
                <header className="leave-top-header">
                    <div className="header-left">
                        <h1>Overview</h1>
                    </div>
                    <div className="header-right export-button-main">
                        <ExportList
                            data={exportData}
                            headers={exportHeaders}
                            filename={`daily_attendance_report.csv`}
                        />
                    </div>
                </header>
            </div>

            {/* Summary Cards */}
            <div className="overview-card-container">
                {summaryCards.map((card, index) => (
                    <div key={index} className="overview-card">
                        <div className="overview-card-header">
                            <div className="left_side_title">
                                <span className="overview-card-title">{card.title}</span>
                                <div className="overview-card-value">{card.value}</div>
                            </div>
                            <div className="overview-card-icon">
                                <User size={24} />
                            </div>
                        </div>
                        <div className="overview-card-footer">
                            <span className="overview-card-footer-text">From Last Month</span>
                            <div className="dreadUpbox">
                                <TrendingUp size={14} />
                                <span className="overview-card-footer-text">{card.from_last_month}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart + Filters */}
            <div className="appraisal-history">
                <div className="table-header">
                    <h2>EMPLOYEE ATTENDANCE STATUS</h2>
                    <div className="filters">

                        <DynamicFilter
                            filterBy="department"
                            filterValue={departmentFilter}
                            onChange={(value) => setDepartmentFilter(value)}
                        // onChange={handleDepartmentFilter}
                        />
                        <DynamicFilter
                            label="Time"
                            filterBy="filter"
                            options={timeOptions}
                            filterValue={timeFilter}
                            onChange={(value) => setTimeFilter(value)}
                        />
                    </div>
                </div>

                <div className="attendance-chart-container">
                    <DailyAttendanceReportChart attendanceData={attendanceData} />
                </div>
            </div>
        </div>
    );
};

export default DailyAttendanceReport;
