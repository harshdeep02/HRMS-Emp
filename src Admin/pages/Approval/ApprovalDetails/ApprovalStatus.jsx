import { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import '../../Performance/PerformanceDetails/PerformanceDetails.scss';
import { useSelector } from 'react-redux';

export const ApprovalStatus = () => {

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

    const performanceDetailsData = useSelector((state) => state?.performanceDetails);
    const performanceDetails = performanceDetailsData?.data?.result;

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
            console.log(organisation)

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


    return (
        <div className="performance-container">
            {/* --- Performance Stats Card --- */}
            <div className="ca_rd performance-stats-card">

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
                        <h4 className="statistics-title">CURRENT VALUE</h4>
                    </div>

                    <div className="competency-list">
                        {currentData?.map((item, index) => (
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
            </div>
        </div>
    );
};