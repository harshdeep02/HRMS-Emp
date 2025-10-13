import React, { useEffect, useState } from 'react';
import { User, TrendingUp, Download, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import PerformanceReviewChart from './PerformanceReviewChart';
import ExportList from '../../../../utils/common/Export/ExportList';
import './PerformanceReview.scss';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DynamicFilter from '../../../../utils/common/DynamicFilter';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPerformance } from '../../../../Redux/Actions/organizationActions';
import Loader from '../../../../utils/common/Loader/Loader';
import { getPerformanceList } from '../../../../Redux/Actions/performanceActions';
import { fetchPerformanceList } from '../../../../services/performance';

// ------------------------------------------------------------------------------------------------
//  *** 1. SIMPLIFIED DATA STRUCTURE ***
// ------------------------------------------------------------------------------------------------
const performanceData = {
    Technical: {
        Attendance: { 'Achieved Value': 6, 'Expected Value': 15 },
        'Conflict Management': { 'Achieved Value': 12, 'Expected Value': 15 },
        Integrity: { 'Achieved Value': 10, 'Expected Value': 15 },
        'Team Work': { 'Achieved Value': 7, 'Expected Value': 15 },
        'Critical Thinking': { 'Achieved Value': 12, 'Expected Value': 15 },
        Professionalism: { 'Achieved Value': 14, 'Expected Value': 15 },
        'Ability to meet Deadlines': { 'Achieved Value': 4, 'Expected Value': 15 }
    },
    Organizational: {
        Efficiency: { 'Achieved Value': 10, 'Expected Value': 15 },
        'Production Quality': { 'Achieved Value': 8, 'Expected Value': 15 },
        Presentation: { 'Achieved Value': 12, 'Expected Value': 15 },
        Marketing: { 'Achieved Value': 12, 'Expected Value': 15 },
        Administration: { 'Achieved Value': 10, 'Expected Value': 15 },
        Management: { 'Achieved Value': 24, 'Expected Value': 11 },
        'Customer Experience': { 'Achieved Value': 2, 'Expected Value': 1 }
    }
};

const DUMMY_EMPLOYEES = [
    { id: 1, name: 'Mr. Akash Shinde', avatar: 'https://images.unsplash.com/photo-1507003211169-e6950c3d6110?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvcnRyYWl0JTIwYXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60' },
    { id: 2, name: 'Ms. Priya Sharma', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
    { id: 3, name: 'Mr. Rahul Verma', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60' },
];

// ------------------------------------------------------------------------------------------------
//  *** 2. NEW UTILITY FUNCTION TO CONVERT SIMPLIFIED DATA FOR CHART/EXPORT ***
// ------------------------------------------------------------------------------------------------
const getChartDataFromSimplified = (simplifiedData) => {
    // Labels are the keys of the simplified data object (e.g., 'Attendance', 'Integrity')
    const labels = Object.keys(simplifiedData);

    // Extract data values in the correct order for the chart (datasets[0] Achieved, datasets[1] Expected)
    const achievedData = labels.map(key => simplifiedData[key]['Achieved Value']);
    const expectedData = labels.map(key => simplifiedData[key]['Expected Value']);

    return {
        labels: labels,
        datasets: [
            { label: 'Achieved Value', data: achievedData }, // Index 0 (Top Bar)
            { label: 'Expected Value', data: expectedData }  // Index 1 (Bottom Bar)
        ]
    };
};

// ------------------------------------------------------------------------------------------------
//  *** 3. UPDATED getOverallRating TO USE SIMPLIFIED DATA ***
// ------------------------------------------------------------------------------------------------
// Ab yeh function simplified data object leta hai
const getOverallRating = (simplifiedData) => {
    const chartData = getChartDataFromSimplified(simplifiedData); // Chart format mein convert karo

    // Calculations remain the same, using datasets[0] for Achieved and datasets[1] for Expected
    const totalAchieved = chartData.datasets[0].data.reduce((sum, value) => sum + value, 0);
    const totalExpected = chartData.datasets[1].data.reduce((sum, value) => sum + value, 0);

    if (totalExpected === 0) return 'N/A';

    const averagePercentage = (totalAchieved / totalExpected) * 100;

    if (averagePercentage >= 90) return 'Excellent';
    if (averagePercentage >= 75) return 'Good';
    if (averagePercentage >= 50) return 'Satisfactory';
    return 'Needs Improvement';
};

const exportHeaders = [
    { label: 'Category', key: 'category' },
    { label: 'Expected Value', key: 'expected' },
    { label: 'Achieved Value', key: 'achieved' },
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


const PerformanceReview = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux state
    const PerformanceData = useSelector((state) => state?.PerformanceData);
    const PerformanceDataList = PerformanceData?.data;
    const PerformanceLoading = PerformanceData?.loading;
    const performanceList = useSelector((state) => state?.performanceList?.data?.result);
    if (PerformanceLoading && !PerformanceDataList) {
        return <div className="loading-state"><Loader /></div>;
    }
    // Fetching action
    const fetchPerformance = () => {
        const sendData = {
            user_id: 822,
            year: ""
        }
        dispatch(getPerformance(sendData));
        dispatch(getPerformanceList())
    };

    // Fetch data on mount if not already available
    useEffect(() => {
        if (!PerformanceDataList) fetchPerformance();
        fetchPerformanceList();

    }, [PerformanceDataList]);

    console.log('PerformanceDataList', PerformanceDataList)
    console.log('performanceList', performanceList)


    const [selectedDateFilter, setSelectedDateFilter] = useState(dayjs());
    const [activeTab, setActiveTab] = useState('Technical');
    const [selectedEmployee, setSelectedEmployee] = useState(DUMMY_EMPLOYEES[1]);

    const [statusFilter, setStatusFilter] = useState('All');

    const AppraisalStatusOptions = [
        { id: 0, label: "All", value: "All" },
        { id: 1, label: "Completed", value: "Completed" },
        { id: 2, label: "In Progress", value: "In Progress" },
    ];

    const handlePreviousMonth = () => {
        setSelectedDateFilter(prev => prev.subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setSelectedDateFilter(prev => prev.add(1, 'month'));
    };

    const formattedDate = selectedDateFilter.format('MMM YYYY');

    // 1. Get the simplified data for the active tab
    const activeSimplifiedData = performanceData[activeTab];

    // 2. Convert the simplified data into ChartJS/Export format
    const chartData = getChartDataFromSimplified(activeSimplifiedData);

    // 3. Prepare Export Data (using the converted chartData)
    const exportData = chartData.labels.map((label, index) => ({
        category: label,
        // Datasets[1] Expected Value hai (Index 1)
        expected: chartData.datasets[1].data[index],
        // Datasets[0] Achieved Value hai (Index 0)
        achieved: chartData.datasets[0].data[index],
    }));

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
    };

    return (
        <div className="employee-attrition-page leave-report-page">
            <button onClick={() => navigate(`/organisation-reports`)} className="close_nav header_close">Close</button>

            <div className="leave-dashboard-header">
                <header className="leave-top-header">
                    <div className="header-left">
                        <h1>Performance Review</h1>
                    </div>
                    <div className="header-right export-button-main">
                        <ExportList
                            data={exportData}
                            headers={exportHeaders}
                            filename={`performance_review_${activeTab.toLowerCase()}_${selectedEmployee.name.replace(/\s/g, '_')}.csv`}
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
                <div className='filter- item'>
                    <DynamicFilter
                        label="Filters"
                        filterBy="status"
                        options={AppraisalStatusOptions}
                        filterValue={statusFilter}
                        onChange={(value) => handleStatusFilter(value)}
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

            {/* chartData is now in the correct original format: datasets[0] Achieved, datasets[1] Expected */}
            <PerformanceReviewChart
                data={chartData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                overallRating={getOverallRating(activeSimplifiedData)} // Simplified data object is passed to rating function
            />
        </div>
    );
};

export default PerformanceReview;