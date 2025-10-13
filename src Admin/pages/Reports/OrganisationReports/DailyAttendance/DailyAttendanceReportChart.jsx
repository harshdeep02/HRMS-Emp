import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './DailyAttendanceReport.scss';

const DailyAttendanceReportChart = ({ attendanceData }) => {
    const { present, absent, halfDay } = attendanceData;

    // Data for the pie chart with colors matching the image
    const chartData = [
        { name: 'Present', value: present, color: '#496DEE' },
        { name: 'Absent', value: absent, color: '#9bb8fd' },
        { name: 'Half Day', value: halfDay, color: '#9b7efd' },
    ];

    return (
        <div className="daily-attendance-chart">
            <div className="chart-content">
                <ul className="legend-list">
                    {chartData.map((entry, index) => (
                        <li key={`legend-${index}`} className="legend-item">
                            <span className="legend-dot" style={{ backgroundColor: entry.color }}></span>
                            <span className="legend-label">{entry.name} - {entry.value}</span>
                        </li>
                    ))}
                </ul>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={120}
                                paddingAngle={5}
                                isAnimationActive={false}
                                label
                                
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DailyAttendanceReportChart;