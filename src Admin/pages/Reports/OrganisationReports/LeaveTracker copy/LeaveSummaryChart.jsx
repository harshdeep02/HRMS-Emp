import React, { useRef } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
// import './LeaveSummary.scss';

const LeaveSummaryChart = ({ leaveData }) => {
    const { totalLeaves, sickLeaves, casualLeaves, earnedLeaves, totalSickLeaves, totalCasualLeaves, totalEarnedLeaves } = leaveData;
    const printRef = useRef(null);

    // Custom legend component
    const renderLegend = (props) => {
        const { payload } = props;
        return (
            <ul className="legend-list">
                {payload.map((entry, index) => (
                    <li key={`item-${index}`} className="legend-item">
                        <span className="legend-dot" style={{ backgroundColor: entry.color }}></span>
                        <span className="legend-label">{entry.value}</span>
                    </li>
                ))}
            </ul>
        );
    };

    const TotalLeavesData = [
        { name: 'Remaining Leaves', value: totalLeaves.used, fill: '#320B57' },
        { name: 'Remaining Leaves', value: totalLeaves.available, fill: '#BFB3CB' },
    ];

    const SickLeavesData = [
        { name: 'Remaining sick Leaves', value: sickLeaves.used, fill: '#320B57' },
        { name: 'Sick Leaves Taken', value: sickLeaves.available, fill: '#BFB3CB' },
    ];

    const CasualLeavesData = [
        { name: 'Remaining Casual Leaves', value: casualLeaves.used, fill: '#320B57' },
        { name: 'Casual Leaves Taken', value: casualLeaves.available, fill: '#BFB3CB' },
    ];

    const EarnedLeavesData = [
        { name: 'Remaining Earned Leaves', value: earnedLeaves.used, fill: '#320B57' },
        { name: 'Earned Leaves Taken', value: earnedLeaves.available, fill: '#BFB3CB' },
    ];

    return (
        <div className="leavebalanceCartPie" ref={printRef}>
            <div className="TotalLeaves">
                <div className="total-leaves">
                    <p>Total Leaves: ({totalLeaves.used + totalLeaves.available})</p>
                </div>
                <div className="pieChart">
                    <ResponsiveContainer>
                        <PieChart>
                            <Legend content={renderLegend} />
                            <Pie
                                data={TotalLeavesData}
                                dataKey="value"
                                isAnimationActive={false}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                innerRadius={40}
                                label
                            >
                                {TotalLeavesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" color="#4a4a4a" fill="none">
                <path d="M4 8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M4 16H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="piechats">
                <div className="title_totale_leave">
                    Total Leaves ({totalLeaves.used + totalLeaves.available}) = Sick Leave ({totalSickLeaves}) + Casual Leave ({totalCasualLeaves}) + Earned Leaves({totalEarnedLeaves})
                </div>
                <div className="otherLeaves">
                    <div className="pieChart">
                        <div className="total-leaves">
                            <p>Sick Leaves: ({totalSickLeaves})</p>
                        </div>
                        <ResponsiveContainer>
                            <PieChart>
                                <Legend content={renderLegend} />
                                <Pie
                                    data={SickLeavesData}
                                    dataKey="value"
                                    isAnimationActive={false}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={40}
                                    label
                                >
                                    {SickLeavesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" color="#4a4a4a" fill="none">
                            <path d="M12 4V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="pieChart">
                        <div className="total-leaves">
                            <p>Casual Leaves: ({totalCasualLeaves})</p>
                        </div>
                        <ResponsiveContainer>
                            <PieChart>
                                <Legend content={renderLegend} />
                                <Pie
                                    data={CasualLeavesData}
                                    dataKey="value"
                                    isAnimationActive={false}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={40}
                                    label
                                >
                                    {CasualLeavesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" color="#4a4a4a" fill="none">
                            <path d="M12 4V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="pieChart">
                        <div className="total-leaves">
                            <p>Earned Leaves: ({totalEarnedLeaves})</p>
                        </div>
                        <ResponsiveContainer>
                            <PieChart>
                                <Legend content={renderLegend} />
                                <Pie
                                    data={EarnedLeavesData}
                                    dataKey="value"
                                    isAnimationActive={false}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={40}
                                    label
                                >
                                    {EarnedLeavesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveSummaryChart;