import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Search } from 'lucide-react';
import PerformanceReviewChart from './PerformanceReviewChart';
import ExportList from '../../../../utils/common/Export/ExportList';
import './PerformanceReview.scss';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DynamicFilter from '../../../../utils/common/DynamicFilter';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPerformance } from '../../../../Redux/Actions/organizationActions'; // Chart Data API
import Loader from '../../../../utils/common/Loader/Loader';
import { getPerformanceList } from '../../../../Redux/Actions/performanceActions'; // Employee List API
import { getEmployeeList } from '../../../../Redux/Actions/employeeActions';
import defaultImage from '../../../../assets/default-user.png'

const processApiDataForChart = (apiData) => {
    if (!apiData || !apiData.data || apiData.data.length === 0) {
        return { Technical: {}, Organizational: {} };
    }
    
    const latestRecord = apiData?.data?.data[0];
    const technicalData = latestRecord?.technical || {};
    const organisationalData = latestRecord?.organisation || {}; 
    // console.log('technicalData', apiData?.data?.data[0])

    const transform = (data) => {
        const transformed = {};
        for (const [key, value] of Object.entries(data)) {
            // API keys: expected_value, achieved_value
            // Target keys: 'Expected Value', 'Achieved Value'
            transformed[key] = {
                'Achieved Value': value.achieved_value,
                'Expected Value': value.expected_value,
            };
        }
        return transformed;
    };

    return {
        Technical: transform(technicalData),
        Organizational: transform(organisationalData),
    };
};


// ------------------------------------------------------------------------------------------------
// *** UTILITY FUNCTION TO CONVERT SIMPLIFIED DATA FOR CHART/EXPORT ***
// ------------------------------------------------------------------------------------------------
const getChartDataFromSimplified = (simplifiedData) => {
    const labels = Object.keys(simplifiedData);
    const achievedData = labels.map(key => simplifiedData[key]['Achieved Value']);
    const expectedData = labels.map(key => simplifiedData[key]['Expected Value']);

    return {
        labels: labels,
        datasets: [
            { label: 'Achieved Value', data: achievedData }, // Index 0
            { label: 'Expected Value', data: expectedData }  // Index 1
        ]
    };
};

// ------------------------------------------------------------------------------------------------
// *** UPDATED getOverallRating TO USE CONVERTED DATA ***
// ------------------------------------------------------------------------------------------------
const getOverallRating = (simplifiedData) => {
    if (Object.keys(simplifiedData).length === 0) return 'N/A';

    const chartData = getChartDataFromSimplified(simplifiedData);

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

// ------------------------------------------------------------------------------------------------
// *** EMPLOYEE FILTER COMPONENT *** (Uses actual employee structure from API)
// ------------------------------------------------------------------------------------------------
const EmployeeFilter = ({searchTerm,  selectedEmployee, onSelectEmployee, filteredEmployees, setSearchTerm }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const dropdown = useRef(null);
    const inputRef = useRef(null);
     const employeeData = useSelector((state) => state?.employees);


     const handleSearchItem=(e)=>{
        setSearchTerm(e.target.value)
     }

    const handleSelect = (employee) => {
        onSelectEmployee(employee);
        setIsOpen(false);
    };

        useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdown.current && !dropdown.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('')
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const applicantImage = (img) => img
        ? (() => {
            try {
                return JSON.parse(img);
            } catch {
                return img;
            }
        })()
        : defaultImage;

    return (
        <div className="filter-item employee-filter" 
        onClick={() =>  setIsOpen(!isOpen)} ref={dropdown}>
            {!selectedEmployee ? 
            <div>Select Employee</div>
            :
            <>
            <img src={applicantImage(selectedEmployee?.employee?.image)} alt={selectedEmployee?.employee?.first_name} className="avatar" />
            <span>{[selectedEmployee?.employee?.first_name, selectedEmployee?.employee?.last_name].filter(Boolean).join(" ")}</span>
             </>
        }
            <ChevronDown size={20} />
            {isOpen && (
                <>
                <ul className="dropdown-menu" style={{height:'200px', overflowY:'scroll', scrollbarWidth:'none'}}>
                <Search className='Search_icon' size={20} strokeWidth={1.5} style={{ top: "18px", left: "15px"}}/>
                <input
                id='searchDepartmentHead'
                  type="search"
                  className="search22"
                  placeholder="Search Employee..."
                  value={searchTerm}
                  onChange={handleSearchItem}
                  autoComplete="off"
                  ref={inputRef}
                  onClick={(e) => e.stopPropagation()}
                />
                    {employeeData?.loading ? <TableViewSkeletonDropdown/> :
                    filteredEmployees.map(emp => (
                        <li key={emp.id} onClick={() => handleSelect(emp)}>
                            <img src={applicantImage(emp?.employee?.image)} alt={emp?.employee?.first_name} className="avatar" />
                            <span>{[emp?.employee?.first_name, emp?.employee?.last_name].filter(Boolean).join(" ")}</span>
                        </li>   
                    ))
                }
                </ul>
                </>
            )}
        </div>
    );
};


// ------------------------------------------------------------------------------------------------
// *** PerformanceReview Component (FIXED) ***
// ------------------------------------------------------------------------------------------------
const PerformanceReview = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // State for employee and year selection
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [activeTab, setActiveTab] = useState('Technical');
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    const pickerRef = useRef(null);
    const currDate = new Date();
    const [getYear, setGetYear] = useState({ month: currDate.getMonth() + 1, year: currDate.getFullYear() })

    const setYearData = useCallback((data) => {
        setGetYear({ month: data.month, year: data.year });
    }, []);

    // **Redux State Selectors**
    // Performance Data (Chart Data)
    const PerformanceData = useSelector((state) => state?.PerformanceData);
    const PerformanceDataList = PerformanceData; 
    const PerformanceLoading = PerformanceData?.loading;

    // Performance List (Employee List)
    // const performanceListState = useSelector((state) => state?.performanceList);
    // You provided console log data, so using the path: performanceListState?.data?.result
    // const performanceList = performanceListState?.data?.result || []; 
    // const performanceListLoading = performanceListState?.loading;


    // --- API Fetch Logic ---

    // // API 1: Fetch Employee List
    // useEffect(() => {
    //     // Employee List fetch करें
    //     if (performanceList.length === 0 && !performanceListLoading) {
    //         console.log('API CALL: Fetching Employee List (getPerformanceList)');
    //         dispatch(getPerformanceList());
    //     }
    // }, [performanceList.length, performanceListLoading, dispatch]);



    // API 2: Fetch Chart Data (when Employee or Year changes)
    const fetchPerformance = useCallback(() => {
        if (!selectedEmployee) return;

        // **FIXED PAYLOAD: Use dynamic user_id**
        const sendData = {
            user_id: selectedEmployee?.employee?.user_id, // Selected Employee  user_id
             month: getYear.month,
            year: getYear.year
        }
        // console.log('API CALL: Fetching Performance Data (getPerformance) with:', sendData);
        dispatch(getPerformance(sendData));
    }, [dispatch, selectedEmployee, getYear]);

    // Trigger chart data fetch when dependencies change
    useEffect(() => {
        fetchPerformance();
    }, [fetchPerformance]);


    const employeeData = useSelector((state) => state?.employeeList);
    const employees = employeeData?.data?.result || [];

    const filteredEmployees = employees?.filter(emp => {
    const first = emp?.employee?.first_name?.toLowerCase() || '';
    const last = emp?.employee?.last_name?.toLowerCase() || '';
    const fullName = `${first} ${last}`;
    return fullName?.includes(searchTerm?.toLowerCase());
  });

      const fetchEmployees = () => {
                // const sendData = { employee_status: "1,5" };
                dispatch(getEmployeeList());
            };
    
            
        useEffect(() => {
            fetchEmployees();
        }, []);


        // Set initial selected employee after list is fetched
    useEffect(() => {
        if (!selectedEmployee && employees.length > 0) {
            setSelectedEmployee(employees[0]);
        }
    }, [employees, selectedEmployee]);    


    // --- Data Processing (useMemo) ---
    const processedData = useMemo(() => {
        return processApiDataForChart(PerformanceDataList);
    }, [PerformanceDataList]);

    const activeSimplifiedData = processedData[activeTab] || {};
    const chartData = useMemo(() => {
        return getChartDataFromSimplified(activeSimplifiedData);
        }, [activeSimplifiedData]);

    const exportData = chartData.labels.map((label, index) => ({
        category: label,
        expected: chartData.datasets[1].data[index],
        achieved: chartData.datasets[0].data[index],
    }));


    // --- Handlers ---
       //month picker
    const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowMonthYearPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePreviousMonth = async () => {

        setSelectedDate(new Date(selectedYear, selectedMonth - 1, 1))
        setYearData({ month: selectedMonth, year: selectedYear })
        //  const res = getAttendenceSummery(dataToSubmit) 

    };
    const handleNextMonth = async () => {

        setSelectedDate(new Date(selectedYear, selectedMonth + 1, 1))
        setYearData({ month: selectedMonth + 2, year: selectedYear })
    };

    const handleSelectedMonth = (e) => {
    setSelectedDate(new Date(selectedYear, parseInt(e.target.value), 1))
    setYearData({ month: parseInt(e.target.value) + 1, year: selectedYear })
    }
    const handleSelectedYear = (e) => {
        setSelectedDate(new Date(parseInt(e.target.value), selectedMonth, 1))
        setYearData({ month: selectedMonth + 1, year: parseInt(e.target.value) })
    }
    
    const handleStatusFilter = (value) => setStatusFilter(value);

    const AppraisalStatusOptions = [
        { id: 0, label: "All", value: "All" },
        { id: 1, label: "Completed", value: "Completed" },
        { id: 2, label: "In Progress", value: "In Progress" },
    ];
    
    // --- Loading State Check ---
    if (PerformanceLoading && !selectedEmployee) {
        return <div className="loading-state"><Loader /></div>;
    }

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
                            filename={`performance_review_${activeTab.toLowerCase().replace(/\s/g, '_')}_${selectedEmployee?.employee?.first_name}_${selectedYear}.csv`}
                        />
                    </div>
                </header>
            </div>

            <div className="filter-bar">
                {/* 1. Employee Filter (Dynamic) */}
               <EmployeeFilter
                        selectedEmployee={selectedEmployee}
                        onSelectEmployee={setSelectedEmployee}
                        filteredEmployees={filteredEmployees}
                        setSearchTerm={setSearchTerm}
                        searchTerm={searchTerm}
                    />

                {/* 2. Status Filter */}
                {/* <div className='filter-'>
                    <DynamicFilter
                        label="Filters"
                        filterBy="filter"
                        options={AppraisalStatusOptions}
                        filterValue={statusFilter}
                        onChange={handleStatusFilter}
                        rightSideDropdwon={true}
                    />
                </div> */}
                
                {/* 3. Year Navigation (Fixed to Year, not Month) */}
                <div className="calendar-header-att perfromanceCal">
                            <div className="month-year-container" ref={pickerRef}>
                                <div className="heade_right">
                                    <div className="arrow_l_r">
                                        <button className="nav-arrow" onClick={handlePreviousMonth}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            
                                        </button>
                                        <button className="nav-arrow" onClick={handleNextMonth}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLincap="round" strokeLinejoin="round" /></svg>
                                        </button>
                                    </div>
                                    <div className="month-year-selector" onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}>
                                        <span>{selectedDate.toLocaleString("default", { month: "long" })} {selectedYear}</span>
                                        <ChevronDown size={20} />
                                    </div>
                                </div>
                                {showMonthYearPicker && (
                                    <div className="month-year-picker-dropdown">
                                        <select value={selectedMonth} onChange={(e) => handleSelectedMonth(e)}>
                                            {Array.from({ length: 12 }).map((_, i) => <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
                                        </select>
                                        <select value={selectedYear} onChange={(e) => handleSelectedYear(e)}>
                                            {Array.from({ length: 10 }).map((_, i) => <option key={2022 + i} value={2022 + i}>{2022 + i}</option>)}
                                        </select>
                                        {/* } */}
                                    </div>
                                )}
                               </div>
                               </div>
            </div>

            <PerformanceReviewChart
                data={chartData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                overallRating={getOverallRating(activeSimplifiedData)}
                PerformanceLoading={PerformanceLoading}
            />
        </div>
    );
};

export default PerformanceReview;