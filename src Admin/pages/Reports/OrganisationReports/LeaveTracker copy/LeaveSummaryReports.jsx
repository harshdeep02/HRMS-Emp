import React, { useState } from 'react';
import { User, Download, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import LeaveSummaryChart from './LeaveSummaryChart';
import ExportList from '../../../../utils/common/Export/ExportList';
import './LeaveSummary.scss';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DynamicFilter from '../../../../utils/common/DynamicFilter';
import { useNavigate } from 'react-router-dom';

// Dummy data for the leave summary
const leaveData = {
    totalLeaves: { used: 15, available: 15 },
    sickLeaves: { used: 3, available: 7 },
    casualLeaves: { used: 5, available: 5 },
    earnedLeaves: { used: 7, available: 3 },
};

const DUMMY_EMPLOYEES = [
    { id: 1, name: 'Mr. Akash Shinde', avatar: 'https://images.unsplash.com/photo-1507003211169-e6950c3d6110?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvcnRyYWl0JTIwYXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60' },
    { id: 2, name: 'Ms. Priya Sharma', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
    { id: 3, name: 'Mr. Rahul Verma', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60' },
];

const exportHeaders = [
    { label: 'Leave Type', key: 'leaveType' },
    { label: 'Used Leaves', key: 'used' },
    { label: 'Available Leaves', key: 'available' },
];

const EmployeeFilter = ({ employees, selectedEmployee, onSelectEmployee }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (employee) => {
        onSelectEmployee(employee);
        setIsOpen(false);
    };

    return (
        <div className="filter-item employee-filter" onClick={() => setIsOpen(!isOpen)}>
            <img src={selectedEmployee.avatar} alt="Employee" className="avatar" />
            <span>{selectedEmployee.name}</span>
            <ChevronDown size={20} />
            {isOpen && (
                <ul className="dropdown-menu">
                    {employees.map(employee => (
                        <li key={employee.id} onClick={() => handleSelect(employee)}>
                            <img src={employee.avatar} alt="Employee" className="avatar" />
                            <span>{employee.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const LeaveSummaryReports = () => {
        	const navigate = useNavigate();

    const [selectedDateFilter, setSelectedDateFilter] = useState(dayjs());
    const [selectedEmployee, setSelectedEmployee] = useState(DUMMY_EMPLOYEES[1]);
    const [leaveTypeFilter, setLeaveTypeFilter] = useState('All');

    const leaveTypeOptions = [
     { id: 0, label: "This Month", value: "This Month" },
    { id: 1, label: "Last Month", value: "Last Month" },
    { id: 2, label: "Today", value: "Today" },
    { id: 3, label: "This Week", value: "This Week" },
    { id: 4, label: "Last Week", value: "Last Week" },
    ];

    const handlePreviousMonth = () => {
        setSelectedDateFilter(prev => prev.subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setSelectedDateFilter(prev => prev.add(1, 'month'));
    };

    const formattedDate = selectedDateFilter.format('MMM YYYY');
    
    // Prepare data for export
    const exportData = [
        { leaveType: 'Total Leaves', used: leaveData.totalLeaves.used, available: leaveData.totalLeaves.available },
        { leaveType: 'Sick Leaves', used: leaveData.sickLeaves.used, available: leaveData.sickLeaves.available },
        { leaveType: 'Casual Leaves', used: leaveData.casualLeaves.used, available: leaveData.casualLeaves.available },
        { leaveType: 'Earned Leaves', used: leaveData.earnedLeaves.used, available: leaveData.earnedLeaves.available },
    ];

    const totalSickLeaves = leaveData.sickLeaves.used + leaveData.sickLeaves.available;
    const totalCasualLeaves = leaveData.casualLeaves.used + leaveData.casualLeaves.available;
    const totalEarnedLeaves = leaveData.earnedLeaves.used + leaveData.earnedLeaves.available;
    const totalLeaves = totalSickLeaves + totalCasualLeaves + totalEarnedLeaves;

    const chartData = {
        totalLeaves: {
            used: totalLeaves - (leaveData.sickLeaves.available + leaveData.casualLeaves.available + leaveData.earnedLeaves.available),
            available: leaveData.sickLeaves.available + leaveData.casualLeaves.available + leaveData.earnedLeaves.available
        },
        sickLeaves: { used: leaveData.sickLeaves.used, available: leaveData.sickLeaves.available },
        casualLeaves: { used: leaveData.casualLeaves.used, available: leaveData.casualLeaves.available },
        earnedLeaves: { used: leaveData.earnedLeaves.used, available: leaveData.earnedLeaves.available },
        totalSickLeaves,
        totalCasualLeaves,
        totalEarnedLeaves,
    };

    return (
        <div className="employee-attrition-page leave-report-page">
                        			<button onClick={() => navigate(`/organisation-reports`)} className="close_nav header_close">Close</button>

            <div className="leave-dashboard-header bhr">
                <header className="leave-top-header">
                    <div className="header-left">
                        <h1>Leave Summary</h1>
                    </div>
                    <div className="header-right export-button-main">
                        <ExportList
                            data={exportData}
                            headers={exportHeaders}
                            filename={`leave_summary_${selectedEmployee.name.replace(/\s/g, '_')}.csv`}
                        />
                    </div>
                </header>
            </div>

            <div className="filter-bar">
                <EmployeeFilter
                    employees={DUMMY_EMPLOYEES}
                    selectedEmployee={selectedEmployee}
                    onSelectEmployee={setSelectedEmployee}
                />
                <div className='filter-item'>
                    <DynamicFilter
                        label="Filter"
                        filterBy="filter"
                        options={leaveTypeOptions}
                        filterValue={leaveTypeFilter}
                        onChange={(value) => setLeaveTypeFilter(value)}
                    />
                </div>
                <div className="date-navigation">
                    <div className="date_left_filter filter-item">
                        <div className={'date-filter__button'} onClick={handlePreviousMonth}>
                            <ChevronLeft size={20} />
                        </div>
                        <div className="date-box">
                            <div className="date_icon_container">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#9b9b9b" fill="none">
                                    <path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M11.9955 13H12.0045M11.9955 17H12.0045M15.991 13H16M8 13H8.00897M8 17H8.00897" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3.5 8H20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="hidentPickdate">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    {/* Mui DatePicker is commented out as it was in your original code */}
                                </LocalizationProvider>
                            </div>
                        </div>
                        <div className={'date-filter__button'} onClick={handleNextMonth}>
                            <ChevronRight size={20} />
                        </div>
                    </div>
                    <div className="selected-date-display">
                        {formattedDate}
                    </div>
                </div>
            </div>

            <LeaveSummaryChart leaveData={chartData} />
        </div>
    );
};

export default LeaveSummaryReports;