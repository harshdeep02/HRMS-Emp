// EmployeeAttritionBoardChart  
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Chart as ChartJS, registerables } from 'chart.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './EmployeeAttrition.scss';

ChartJS.register(...registerables);

const DUMMY_ATTENDANCE_DATA = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Employee Present',
            data: [100, 160, 105, 45, 165, 100, 95, 160, 155, 110, 145, 100],
            backgroundColor: '#496DEE',
            stack: 'stack1',
            barPercentage: 0.6,
            // categoryPercentage: 0.6,
            borderRadius: {
                topLeft: 0,
                topRight: 0,
                bottomLeft: 8,
                bottomRight: 8,
            },
            borderColor: '#496DEE',
            borderWidth: 2,
            borderSkipped: false,
        },
        {
            label: 'Employee Absent',
            data: [20, 15, 20, 10, 25, 10, 15, 20, 25, 15, 20, 10],
            backgroundColor: '#F6EDFD',
            stack: 'stack1',
            barPercentage: 0.6,
            // categoryPercentage: 0.6,
            borderRadius: {
                topLeft: 8,
                topRight: 8,
                bottomLeft: 0,
                bottomRight: 0,
            },
            borderColor: '#496DEE',
            borderWidth: 2,
            borderSkipped: false,
        },
    ],
};

const EmployeeAttritionBoardChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: DUMMY_ATTENDANCE_DATA,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: true,
                        //         external: (context) => {
                        //             let tooltipEl = document.getElementById('chartjs-tooltip');

                        //             if (!tooltipEl) {
                        //                 tooltipEl = document.createElement('div');
                        //                 tooltipEl.id = 'chartjs-tooltip';
                        //                 tooltipEl.className = 'tooltip';
                        //                 document.body.appendChild(tooltipEl);
                        //             }

                        //             const tooltipModel = context.tooltip;
                        //             if (tooltipModel.opacity === 0) {
                        //                 tooltipEl.style.opacity = 0;
                        //                 return;
                        //             }

                        //             if (tooltipModel.body && tooltipModel.dataPoints.length > 0) {
                        //                 const dataIndex = tooltipModel.dataPoints[0].dataIndex;
                        //                 const month = DUMMY_ATTENDANCE_DATA.labels[dataIndex];
                        //                 const valuePresent = DUMMY_ATTENDANCE_DATA.datasets[0].data[dataIndex];
                        //                 const valueAbsent = DUMMY_ATTENDANCE_DATA.datasets[1].data[dataIndex];

                        //                 const dummyDate = `23 ${month} 2024`;

                        //                 tooltipEl.innerHTML = `
                        //   <div class="tooltip-title">${dummyDate}</div>
                        //   <div class="tooltip-item">
                        //     <span class="tooltip-dot" style="background-color: #496DEE;"></span>
                        //     <span>Employee Present : ${valuePresent}</span>
                        //   </div>
                        //   <div class="tooltip-item">
                        //     <span class="tooltip-dot" style="background-color: #F6EDFD;"></span>
                        //     <span>Employee Absent : ${valueAbsent}</span>
                        //   </div>
                        // `;
                        //             }

                        //             const chartRect = chartRef.current.getBoundingClientRect();
                        //             tooltipEl.style.opacity = 1;
                        //             tooltipEl.style.position = 'absolute';
                        //             tooltipEl.style.left = chartRect.left + window.scrollX + tooltipModel.caretX + 'px';
                        //             tooltipEl.style.top = chartRect.top + window.scrollY + tooltipModel.caretY + 'px';
                        //             tooltipEl.style.transform = 'translate(-50%, -100%)';
                        //         },
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: '#6B7280',
                        },
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        grid: {
                            color: '#E5E7EB',
                            drawBorder: false,
                        },
                        ticks: {
                            color: '#6B7280',
                            stepSize: 50,
                        },
                    },
                },
            },
        });
    }, []);

    return (
        <div className="chart-section">
            <div className="chart-header">
                <div className="chart-title-container">
                    <h3 className="chart-title">ATTENDANCE REPORT</h3>
                    <div className="legend-container">
                        <div className="legend-item">
                            <span className="legend-dot present-dot"></span>
                            <span>Employee Present</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot absent-dot"></span>
                            <span>Employee Absent</span>
                        </div>
                    </div>
                </div>
                <div className="chart-actions">
                    <div className="chart-nav-button">
                        <ChevronLeft size={16} color="#6B7280" />
                    </div>
                    <span className="date-range-display">01-June-2024 to 30-June-2024</span>
                    <div className="chart-nav-button">
                        <ChevronRight size={16} color="#6B7280" />
                    </div>
                </div>
            </div>
            <div style={{ position: 'relative', height: '300px' }}>
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};

export default EmployeeAttritionBoardChart;