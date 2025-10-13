import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { User, TrendingUp, Download, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import PerformanceReviewChart from './PerformanceReviewChart';
import ExportList from '../../../../utils/common/Export/ExportList';
import './PerformanceReview.scss';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DynamicFilter from '../../../../utils/common/DynamicFilter';
import { useNavigate } from 'react-router-dom';
import { getPerformance } from '../../../../Redux/Actions/organizationActions';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../../utils/common/Loader/Loader';
import { DatePicker } from '@mui/x-date-pickers'; // DatePicker ki jagah YearPicker use karenge
import { getUserData } from '../../../../services/login';

// ------------------------------------------------------------------------------------------------
// *** UTILITY FUNCTION TO PROCESS API DATA ***
// API data ko chart ke liye suitable format mein badalta hai.
// ------------------------------------------------------------------------------------------------
const processApiDataForChart = (apiData) => {
    // API data se 'technical' aur 'organisation' keys ko nikaalo.
    // Agar data available nahi hai, toh khaali object return karo.

    if (!apiData || apiData.length === 0) {

        return {
            Technical: {},
            Organizational: {},
        };
    }

    // Pehle (latest) record ko use kar rahe hain
    const latestRecord = apiData?.data[0];
    const technicalData = latestRecord?.technical || {};
    const organisationalData = latestRecord?.organisation || {};

    const transform = (data) => {
        const transformed = {};
        for (const [key, value] of Object.entries(data)) {

            transformed[key] = {
                'Achieved Value': value.achieved_value,
                'Expected Value': value.expected_value,
            };
        }
        return transformed;
    };

    return {
        Technical: transform(technicalData),
        Organizational: transform(organisationalData), // Rename for consistency with original 'Organizational'
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
            { label: 'Expected Value', data: expectedData }  // Index 1
        ]
    };
};

// ------------------------------------------------------------------------------------------------
// *** UPDATED getOverallRating TO USE CONVERTED DATA ***
// ------------------------------------------------------------------------------------------------
const getOverallRating = (simplifiedData) => {
    if (Object.keys(simplifiedData).length === 0) return 'N/A';

    const chartData = getChartDataFromSimplified(simplifiedData);

    // Achieved Value datasets[0] par hai
    const totalAchieved = chartData.datasets[0].data.reduce((sum, value) => sum + value, 0);
    // Expected Value datasets[1] par hai
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


const MYPerformanceReview = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {id} = getUserData()

    // State for filtering by year (Current Year by default)
    const [activeTab, setActiveTab] = useState('Technical');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    const pickerRef = useRef(null);
    const currDate = new Date();
    const [getYear, setGetYear] = useState({ month: currDate.getMonth() + 1, year: currDate.getFullYear() })

    const setYearData = useCallback((data) => {
        setGetYear({ month: data.month, year: data.year });
    }, []);

    // Redux state
    const PerformanceData = useSelector((state) => state?.PerformanceData);
    const PerformanceDataList = PerformanceData?.data;
    const PerformanceLoading = PerformanceData?.loading;

    // Memoize the transformed data
    const processedData = useMemo(() => {
        return processApiDataForChart(PerformanceDataList);
    }, [PerformanceDataList]);
    
    const activeSimplifiedData = processedData[activeTab] || {};

    // API call function
    const fetchPerformance = useCallback(() => {
        const sendData = {
            user_id: id,
            month: getYear.month,
            year: getYear.year
        }
        dispatch(getPerformance(sendData));
    }, [dispatch, getYear]);

    // Initial fetch and fetch on year change
    useEffect(() => {
        // Jab component mount ho ya selectedYear change ho, tab data fetch karo
        fetchPerformance();
    }, [fetchPerformance]);


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


    const AppraisalStatusOptions = [
        { id: 0, label: "All", value: "All" },
        { id: 1, label: "Completed", value: "Completed" },
        { id: 2, label: "In Progress", value: "In Progress" },
    ];

    // Convert simplified data to ChartJS format
    const chartData = useMemo(() => {
        return getChartDataFromSimplified(activeSimplifiedData);
        }, [activeSimplifiedData]);

    // Prepare Export Data
    const exportData = chartData.labels.map((label, index) => ({
        category: label,
        // Achieved value index 0 par hai
        achieved: chartData.datasets[0].data[index],
        // Expected value index 1 par hai
        expected: chartData.datasets[1].data[index],
    }));

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
    };

    // Loading state check
    if (PerformanceLoading && !PerformanceDataList) {
        return <div className="loading-state"><Loader /></div>;
    }


    return (
        <div className="employee-attrition-page leave-report-page">
            <button onClick={() => navigate(`/my-reports`)} className="close_nav header_close">Close</button>

            <div className="leave-dashboard-header">
                <header className="leave-top-header">
                    <div className="header-left">
                        <h1>Performance Review</h1>
                    </div>
                    <div className="header-right export-button-main">
                        <ExportList
                            data={exportData}
                            headers={exportHeaders}
                            // filename mein year shamil karo
                            filename={`performance_review_${activeTab.toLowerCase().replace(/\s/g, '_')}_${selectedYear}.csv`}
                        />
                    </div>
                </header>
            </div>

            {/* <div className="filter-bar"> */}

                {/* <div className=''>

                    <DynamicFilter
                        label="Filters"
                        filterBy="filter"
                        options={AppraisalStatusOptions}
                        filterValue={statusFilter}
                        onChange={(value) => handleStatusFilter(value)}
                        rightSideDropdwon={true}
                    />
                </div> */}
                {/* Year Navigation Logic Start */}
               <div className="calendar-header-att">
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
            {/* </div> */}


            <PerformanceReviewChart
                data={chartData} // Achieved[0], Expected[1]
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                overallRating={getOverallRating(activeSimplifiedData)}
                PerformanceLoading={PerformanceLoading}
            />
        </div>
    );
};

export default MYPerformanceReview;