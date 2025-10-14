import { useCallback, useEffect, useRef, useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import './EmpPerformance.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getPerformanceDetails } from '../../../Redux/Actions/performanceActions';
import { useParams } from 'react-router-dom';
import ListDataNotFound from '../../../utils/common/ListDataNotFound';
import Loader from '../../../utils/common/Loader/Loader';

export const EmpPerformance = () => {
    const dispatch = useDispatch();
    const { id } = useParams();

    const performanceDetailsData = useSelector((state) => state?.performanceDetails);
    const performanceDetails = performanceDetailsData?.data?.result;
    const performanceLoading = performanceDetailsData?.loading;

        
    // --- State for the custom date dropdown ---
    const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    const pickerRef = useRef(null);
    const currDate = new Date();
    const [getYear, setGetYear] = useState({ month: currDate.getMonth() + 1, year: currDate.getFullYear() })

    const setYearData = useCallback((data) => {
        setGetYear({ month: data.month, year: data.year });
    }, []);


        const fetchPerformance = useCallback(() => {    
            const sendData = {
                user_id: id, // Selected Employee  user_id
                 month: getYear.month,
                year: getYear.year
            }
            if (id && performanceDetails?.id != id) {
            dispatch(getPerformanceDetails(sendData));
            }
        }, [id, getYear]);
    
        useEffect(() => {
            fetchPerformance();
        }, [fetchPerformance]);

    const levelMapping = {
        1: 33,
        2: 66,
        3: 100
    };

    const getLevelValue = (level) => levelMapping[level] || 0;

    const [activeTab, setActiveTab] = useState('technical');
    const [performanceData, setPerformanceData] = useState({
        technical: [],
        organisation: [],
    });
    const currentData = performanceData[activeTab];


    const findlabelValue = (data, name) => {
        const obj = data.find((item) => item.label === name)
        return getLevelValue(obj?.achieved_value)
    }

    useEffect(() => {
        if (performanceDetails) {
            const technical = JSON.parse(performanceDetails?.technical)
            const organisation = JSON.parse(performanceDetails?.organisation)
            // Update technicalData based on apiData
            const updatedTechnicalData = [
                { name: "Customer Experience", expected: 100, achieved: findlabelValue(technical, "Customer Experience") },
                { name: "Marketing", expected: 100, achieved: findlabelValue(technical, "Marketing") },
                { name: "Management", expected: 100, achieved: findlabelValue(technical, "Management") },
                { name: "Administration", expected: 100, achieved: findlabelValue(technical, "Administration") },
                { name: "Presentation", expected: 100, achieved: findlabelValue(technical, "Presentation") },
                { name: "Production Quality", expected: 100, achieved: findlabelValue(technical, "Production Quality") },
                { name: "Efficiency", expected: 100, achieved: findlabelValue(technical, "Efficiency") },
            ];

            // Update organizationalData based on apiData
            const updatedOrganizationalData = [
                { name: "Ability to meet Deadlines", expected: 100, achieved: findlabelValue(organisation, "Ability to meet Deadlines") },
                { name: "Conflict Management", expected: 100, achieved: findlabelValue(organisation, "Conflict Management") },
                { name: "Critical Thinking", expected: 100, achieved: findlabelValue(organisation, "Critical Thinking") },
                { name: "Integrity", expected: 100, achieved: findlabelValue(organisation, "Integrity") },
                { name: "Team Work", expected: 100, achieved: findlabelValue(organisation, "Team Work") },
                { name: "Professionalism", expected: 100, achieved: findlabelValue(organisation, "Professionalism") },
                { name: "Efficiency", expected: 100, achieved: findlabelValue(organisation, "Efficiency") },
            ];

            setPerformanceData({
                technical: updatedTechnicalData,
                organisation: updatedOrganizationalData,
            });
        }
    }, [performanceDetails]);

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowMonthYearPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- Handlers for date navigation ---

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

    if (performanceLoading) {
        return <div className="loading-state"><Loader /></div>;
    }

    return (
        <div className="performance-container otherDetailPageSroll">
            {/* --- Performance Summary Card --- */}
            <div className="card_headers">
                <h2>Performance Summary</h2>
                <div className='performance-summary-card'>
                    <div className="summary-item">
                        <label>Review Period :</label>
                        <span>Q1 2024</span>
                    </div>
                    <div className="summary-item">
                        <label>Last Review Date :</label>
                        <span>24 - 02 - 2024</span>
                    </div>
                    <div className="summary-item">
                        <label>Next Review Date :</label>
                        <span>24 - 02 - 2024</span>
                    </div>
                    <div className="summary-item rating">
                        <label>Overall Rating</label>
                        <span className="rating-text">{performanceDetails?.overall_rating}</span>
                    </div>
                </div>
            </div>

            {/* --- Performance Stats Card --- */}
            <div className="card performance-stats-card">
                <div className="stats-header">
                    <h2> Performance Stats</h2>

                    {/* --- UPDATED NAVIGATION CONTROLS --- */}
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
                {!performanceLoading && currentData?.length === 0 ? (
                    <ListDataNotFound module="employees" />
                ) : (
                    <>
                        <div className="tabs-container">
                            <button
                                className={`tab ${activeTab === 'technical' ? 'active' : ''}`}
                                onClick={() => setActiveTab('technical')}
                            >
                                Technical
                            </button>
                            <button
                                className={`tab ${activeTab === 'organisation' ? 'active' : ''}`}
                                onClick={() => setActiveTab('organisation')}
                            >
                                Organizational
                            </button>
                        </div>

                        <div className="stats-body">
                            <div className="stats-title-row">
                                <h4 className="competencies-title">COMPETENCIES</h4>
                                <h4 className="statistics-title">STATISTICS</h4>
                            </div>

                            <div className="competency-list">

                                {currentData?.map((item, index) => (
                                    <div className="competency-row" key={index}>
                                        <span className="competency-name">{item?.name}</span>
                                        <div className="chart-container">
                                            <ResponsiveContainer width="100%" height={38}>
                                                <BarChart
                                                    layout="vertical"
                                                    data={[item]}
                                                    margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                                                >
                                                    <XAxis type="number" domain={[0, 100]} hide />
                                                    <YAxis type="category" dataKey="name" hide />
                                                    <Bar dataKey="expected" fill="var(--expected-color)" barSize={10} radius={[5, 5, 5, 5]} />
                                                    <Bar dataKey="achieved" fill="var(--achieved-color)" m barSize={10} radius={[5, 5, 5, 5]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="chart-legend">
                            <div className="legend-item">
                                <div className="legend-color-box expected"></div>
                                <span>Expected Value</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color-box achieved"></div>
                                <span>Achieved Value</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};