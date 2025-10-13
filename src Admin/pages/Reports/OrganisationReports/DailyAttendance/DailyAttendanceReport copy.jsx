import React, { useEffect, useState } from 'react';
import { User, Download, TrendingUp } from 'lucide-react';
import DailyAttendanceReportChart from './DailyAttendanceReportChart';
import ExportList from '../../../../utils/common/Export/ExportList';
import DynamicFilter from '../../../../utils/common/DynamicFilter';
import './DailyAttendanceReport.scss';
import DatePicker from '../../../../utils/common/DatePicker/DatePicker';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDailyAttendance } from '../../../../Redux/Actions/organizationActions';

// Dummy data for the summary cards
const summaryData = [
    { title: 'Total Employees', value: 315, change: '+12.9%' },
    { title: 'Today Present', value: 100, change: '+12.9%' },
    { title: 'Today Absent', value: 150, change: '+12.9%' },
    { title: 'Halfday', value: 50, change: '+12.9%' },
];

// Dummy data for the chart based on the image
const attendanceData = {
    present: 270,
    absent: 30,
    halfDay: 15,
};

// Dummy data for the export functionality
const exportHeaders = [
    { label: 'Attendance Type', key: 'type' },
    { label: 'Count', key: 'value' },
];

const DailyAttendanceReport = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const PerformanceData = useSelector((state) => state?.DailyAttendanceData);
    // const PerformanceDataList = PerformanceData?.data;
    // const PerformanceLoading = PerformanceData?.loading;
    console.log('PerformanceData',PerformanceData)
//     data
// : 
// chart_data
// : 
// absent
// : 
// 1
// halfDay
// : 
// 0
// present
// : 
// 0
// [[Prototype]]
// : 
// Object
// message
// : 
// "Attendance summary retrieved successfully."
// success
// : 
// true
// summary_cards
// : 
// Array(4)
// 0
// : 
// {title: 'Total Employees', value: 19, from_last_month: '0%'}
// 1
// : 
// {title: 'Today Present', value: 0, from_last_month: '0%'}
// 2
// : 
// {title: 'Today Absent', value: 1, from_last_month: '+100%'}
// 3
// : 
// {title: 'Halfday', value: 0, from_last_month: '0%'}
// length
// : 
// 4
// [[Prototype]]
// : 
// Array(0)
// [[Prototype]]
// : 
// Object
// error
// : 
// null
// loading
// : 
// false

    // API call function
    useEffect(() => {
        const sendData = {
            filter: "today", //Default to "today" & week ,month
            user_id: ''
        }
        dispatch(getDailyAttendance(sendData));
    }, [dispatch]);

    // Initial fetch and fetch on year change
    

    const [departmentFilter, setDepartmentFilter] = useState('All');

    // Options for the department filter
    const departmentOptions = [
        { id: 0, label: "All Departments", value: "All" },
        { id: 1, label: "Engineering", value: "Engineering" },
        { id: 2, label: "Sales", value: "Sales" },
        { id: 3, label: "Marketing", value: "Marketing" },
        { id: 4, label: "Human Resources", value: "Human Resources" },
    ];

    // Data for the export list
    const exportData = [
        { type: 'Present', value: attendanceData.present },
        { type: 'Absent', value: attendanceData.absent },
        { type: 'Half Day', value: attendanceData.halfDay },
    ];

    // if (PerformanceLoading && !PerformanceDataList) {
    //     return <div className="loading-state"><Loader /></div>;
    // }

    return (
        <div className="employee-attrition-page leave-report-page">
            <button onClick={() => navigate(`/organisation-reports`)} className="close_nav header_close">Close</button>

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

            <div className="overview-card-container">
                {summaryData.map((card, index) => (
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

            <div className="appraisal-history">
                <div className="table-header">
                    <h2>EMPLOYEE ATTENDANCE STATUS</h2>
                    <div className="filters">
                        <div >
                            <DynamicFilter
                                label="Department"
                                filterBy="department"
                                options={departmentOptions}
                                filterValue={departmentFilter}
                                onChange={(value) => setDepartmentFilter(value)}
                            />
                        </div>
                      
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