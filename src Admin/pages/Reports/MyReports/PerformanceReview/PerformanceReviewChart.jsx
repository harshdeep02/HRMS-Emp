import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Chart as ChartJS, registerables } from 'chart.js';
import './PerformanceReview.scss';

ChartJS.register(...registerables);

const PerformanceReviewChart = ({ data, activeTab, setActiveTab, overallRating, PerformanceLoading }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if( PerformanceLoading)return
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: data.datasets[1].label,
                        data: data.datasets[1].data,
                        backgroundColor: '#F6EDFD',
                        stack: 'stack1',
                        barPercentage: 0.6,
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
                        label: data.datasets[0].label,
                        data: data.datasets[0].data,
                        backgroundColor: '#496DEE',
                        stack: 'stack1',
                        barPercentage: 0.6,
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
            },
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
                        max: 20, // Set maximum value to 20
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
                            stepSize: 4,
                        },
                    },
                },
            },
        });
    }, [data]);

    return (
        <div className="chart-section">
            <div className="chart-header">
                <div className="tabs-container">
                    <button
                        className={`tab ${activeTab === 'Technical' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Technical')}
                    >
                        Technical
                    </button>
                    <button
                        className={`tab ${activeTab === 'Organizational' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Organizational')}
                    >
                        Organizational
                    </button>
                </div>
                <div className="chart-actions">
                    <div className="overall-rating-box">
                        <span className="overall-rating-label">Overall Rating</span>
                        <span className="overall-rating-value">{overallRating}</span>
                    </div>
                </div>
            </div>
        
            <div style={{ position: 'relative', height: '300px' }}>
                <canvas ref={chartRef}></canvas>
            </div>
            
            <div className="legend-container lables_chart">
                <div className="legend-item">
                    <span className="legend-dot present-dot"></span>
                    <span>Expected Value</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot absent-dot"></span>
                    <span>Achieved Value</span>
                </div>
            </div>
        </div>
    );
};

export default PerformanceReviewChart;