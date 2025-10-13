import React, { useState, useEffect, useRef } from 'react';
import { Clock, ArrowRight, MoreHorizontal, Mic, Plus, ChevronDown, Sparkles, ArrowUp01, ArrowUp10, ArrowRightCircle, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts'; // Aapke code ke anusaar Recharts ka istemal
import './AdminDashboard.scss';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import AskAnything from './AskAnything/AskAnything';
import userImg from '../../assets/user.svg'

// ==========================================================================
// Chote Components (Aapke code ke anusaar alag-alag components)
// ==========================================================================

// Welcome Card Component
const AdminNavbar = () => {
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);

    // Dummy user data
    const user_info = { display_name: "Akash" };

    const formatTime = (date) => {
        if (!date) return null;
        return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    };

    const handleCheckInOut = () => {
        const now = new Date();
        if (!checkInTime) {
            setCheckInTime(now);
            setCheckOutTime(null);
        } else if (!checkOutTime) {
            setCheckOutTime(now);
        }
    };

    return (
        <div className="welcome-card">
            <div className="user-greeting">
                <img src={userImg} alt={user_info.display_name} className="user-avatar header_img_rounded" />
                <div className="user-text">
                    <h2>Hello {user_info.display_name}!</h2>
                    <p>Welcome back, Track your team progress here</p>
                </div>
            </div>
            <div className="time-tracker">
                <div className='time_box'>
                    <span>CHECK IN TIME</span>
                    <div className="time-display">
                        <Clock size={20} />
                        <span>{checkInTime ? formatTime(checkInTime) : '12:50PM'}</span>
                    </div>
                </div>
                <div className='time_box'>

                    <span>CHECK OUT TIME</span>
                    {checkOutTime ? (
                        <div className="time-display checked-out">
                            <span>{formatTime(checkOutTime)}</span>
                        </div>
                    ) : (
                        <button className="checkout-btn" onClick={handleCheckInOut}>
                            {checkInTime ? 'Check Out' : 'Check In'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Attendance Overview Component (Aapke code aur design ke anusaar)
const AttendanceOverview = () => {
    const [filter, setFilter] = useState('Today');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const pieData = [
        { name: "Present", value: 150 },
        { name: "Absent", value: 16 },
        { name: "Half Day", value: 25 },
    ];
    const COLORS = ['#8A3FFC', '#FF5630', '#FFAB00'];

    return (
        <div className="dashboard-card attendance-card">
            <div className="card-header">
                <h3>Attendance Overview</h3>
                <div className="filter-dropdown">
                    <button className="filter-btn" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                        {filter} <ChevronDown size={16} className={isFilterOpen ? 'open' : ''} />
                    </button>
                    {isFilterOpen && (
                        <div className="dropdown-menu">
                            <div onClick={() => { setFilter('Today'); setIsFilterOpen(false); }}>Today</div>
                            <div onClick={() => { setFilter('Week'); setIsFilterOpen(false); }}>Week</div>
                            <div onClick={() => { setFilter('Month'); setIsFilterOpen(false); }}>Month</div>
                        </div>
                    )}
                </div>
            </div>
            <div className="chart-container">
                <div className="donut-chart-wrapper">
                    <PieChart width={250} height={250}>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={90}
                            outerRadius={120}
                            startAngle={180}
                            endAngle={0}
                            paddingAngle={5}
                            dataKey="value"
                            cornerRadius={1} // Rounded corners for chart segments
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" style={{ filter: `drop-shadow(0px 4px 10px ${COLORS[index % COLORS.length]}57)` }} />
                            ))}
                        </Pie>
                    </PieChart>
                    <div className="chart-center-text">
                        <span className="total-label">Total Employees</span>
                        <span className="total-count">256</span>
                    </div>
                </div>
            </div>
            <div className="chart-legend">
                <div className="legend-item present">Present <span>150</span></div>
                <div className="legend-item absent">Absent <span>16</span></div>
                <div className="legend-item half-day">Half Day</div>
            </div>
        </div>
    );
};

// All Employees Component
const AllEmployees = () => {
    // Dummy data for bars, matching the image pattern
    const barData = [
        ...Array(30).fill({ height: 100, color: '#A448EE' }), // Permenant
        ...Array(15).fill({ height: 100, color: '#CD8EFF' }),  // Part Time
        ...Array(9).fill({ height: 100, color: '#E5C4FF' }),   // Contract
        ...Array(6).fill({ height: 100, color: '#D9D9D9' })    // Trainee
    ];

    return (
        <div className="employees-card">
            <div className='employees-card-chart'>
                <div className="card-header">
                    <h3>All Employees</h3>
                    <button className="arrow-btn">
                        <ArrowRight size={20} />

                    </button>
                </div>
                <div className="employee-count">
                    <span className="count">210</span>
                    <div className="percentage-change">
                        <TrendingUp size={14} className='TrendingUp' />

                        <span>2%</span>
                    </div>
                </div>
                <div className="bar-chart-container">
                    {barData.map((bar, index) => (
                        <div key={index} className="bar" style={{ height: `${bar.height}%`, backgroundColor: bar.color }}></div>
                    ))}
                </div>
            </div>
            <div className="chart-legend">
                <div className="legend-item permanent">
                    <div className="legend-info">
                        <span className="type">Permenant</span>
                        <span className="count">150</span>
                    </div>
                </div>
                <div className="legend-item part-time">
                    <div className="legend-info">
                        <span className="type">Part Time</span>
                        <span className="count">40</span>
                    </div>
                </div>
                <div className="legend-item contract">
                    <div className="legend-info">
                        <span className="type">Contract</span>
                        <span className="count">15</span>
                    </div>
                </div>
                <div className="legend-item trainee">
                    <div className="legend-info">
                        <span className="type">Trainee</span>
                        <span className="count">05</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// // Ask Anything Component
// const AskAnything = () => (
//     <div className="ask-anything-card">
//         <div className="card-header">
//             <h3>Ask Anything</h3>
//         </div>
//         <div className="ai-input-wrapper">
//             <Sparkles size={20} className="ai-icon" />
//             <button className="ai-model-selector">HRMS <ChevronDown size={16} /></button>
//             <input type="text" placeholder="Ask anything to HRMS AI..." />
//             <div className="input-actions">
//                 <button><Mic size={18} /></button>
//                 <button><MoreHorizontal size={18} /></button>
//                 <button className="add-btn"><Plus size={18} /></button>
//             </div>
//         </div>
//         <div className="suggestion-chips">
//             <button>Create Onboarding</button>
//             <button>Create Employee Report</button>
//             <button>Check Employee List</button>
//             <button>Review Performance</button>
//         </div>
//     </div>
// );

// Main Dashboard Component jo sabko assemble karta hai
const AdminDashboard = () => {
    return (
       <div className='AdminDashboard'>
         <div className="dashboard-page">
            <h1 className="dashboard-title">Dashboard</h1>
            <AdminNavbar />
            <div className="dashboard-grid">
                <AttendanceOverview />
                <AllEmployees />
            </div>
            <AskAnything />
        </div>
       </div>
    );
};

export default AdminDashboard;
