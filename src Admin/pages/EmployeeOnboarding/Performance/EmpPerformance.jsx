import { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import './EmpPerformance.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getPerformanceDetails } from '../../../Redux/Actions/performanceActions';
import { useParams } from 'react-router-dom';
import ListDataNotFound from '../../../utils/common/ListDataNotFound';
import Loader from '../../../utils/common/Loader/Loader';

// --- DATA OBJECT ---
// const performanceData = {
//     Technical: [
//         { name: 'Customer Experience', expected: 90, achieved: 75 },
//         { name: 'Marketing', expected: 80, achieved: 50 },
//         { name: 'Management', expected: 85, achieved: 70 },
//         { name: 'Administration', expected: 90, achieved: 60 },
//         { name: 'Presentation', expected: 75, achieved: 65 },
//         { name: 'Production Quality', expected: 95, achieved: 60 },
//         { name: 'Efficiency', expected: 88, achieved: 45 },
//     ],
//     Organizational: [
//         { name: 'Team Collaboration', expected: 95, achieved: 85 },
//         { name: 'Communication', expected: 90, achieved: 70 },
//         { name: 'Problem Solving', expected: 80, achieved: 75 },
//         { name: 'Leadership', expected: 75, achieved: 60 },
//         { name: 'Adaptability', expected: 90, achieved: 80 },
//         { name: 'Punctuality', expected: 100, achieved: 95 },
//     ],
// };

export const EmpPerformance = () => {
    const dispatch = useDispatch();
    const { id } = useParams();

    const performanceDetailsData = useSelector((state) => state?.performanceDetails);
    const performanceDetails = performanceDetailsData?.data?.result;
    const performanceloading = performanceDetailsData?.data?.loading;
    useEffect(() => {
        if (id && performanceDetails?.id != id) {
            dispatch(getPerformanceDetails({ user_id: id}));
        }
    }, [id]);


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

    // const currentData = performanceData[activeTab];

    // console.log('performanceloading', performanceloading)
    // --- State for the custom date dropdown ---
    const [selectedDate, setSelectedDate] = useState(new Date('2025-07-01')); // Set initial to July 2025
    const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
    const pickerRef = useRef(null);

    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

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
    const handlePrevMonth = () => {
        setSelectedDate(current => new Date(current.getFullYear(), current.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setSelectedDate(current => new Date(current.getFullYear(), current.getMonth() + 1, 1));
    };


    if (performanceloading) {
        return <div className="loading-state"><Loader /></div>;
    }

    return (
        <div className="performance-container otherDetailPageSroll">
            {/* --- Performance Summary Card --- */}
            <div className="card_headers">
                <h2>Performance Summary</h2>
                <div className=' performance-summary-card'>
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
                        <span className="rating-text">Excellent</span>
                    </div>
                </div>
            </div>

            {/* --- Performance Stats Card --- */}
            <div className="card performance-stats-card">
                <div className="stats-header">
                    <h2> Performance Stats</h2>

                    {/* --- UPDATED NAVIGATION CONTROLS --- */}
                    <div className="nav-controls" ref={pickerRef}>
                        <button className="arrow-btn" onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
                        <button className="arrow-btn" onClick={handleNextMonth}><ChevronRight size={20} /></button>

                        <div className="date-select-wrapper">
                            <button className="date-select-btn" onClick={() => setShowMonthYearPicker(prev => !prev)}>
                                <span>{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                                <ChevronDown size={16} />
                            </button>

                            {showMonthYearPicker && (
                                <div className="month-year-picker-dropdown">
                                    <select value={selectedMonth} onChange={(e) => setSelectedDate(new Date(selectedYear, parseInt(e.target.value), 1))}>
                                        {Array.from({ length: 12 }).map((_, i) => <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
                                    </select>
                                    <select value={selectedYear} onChange={(e) => setSelectedDate(new Date(parseInt(e.target.value), selectedMonth, 1))}>
                                        {Array.from({ length: 5 }).map((_, i) => <option key={2023 + i} value={2023 + i}>{2023 + i}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {!performanceloading && currentData?.length === 0 ? (
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

                                {currentData.map((item, index) => (
                                    <div className="competency-row" key={index}>
                                        <span className="competency-name">{item.name}</span>
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