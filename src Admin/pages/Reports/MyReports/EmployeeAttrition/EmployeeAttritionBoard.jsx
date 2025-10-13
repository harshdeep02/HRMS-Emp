// EmployeeAttritionBoard
import React from 'react';
import { User, TrendingUp } from 'lucide-react';
import EmployeeAttritionBoardChart from './EmployeeAttritionBoardChart';
import ExportList from '../../../../utils/common/Export/ExportList'; // Path check karein
import './EmployeeAttrition.scss';
import { useNavigate } from 'react-router-dom';

const leaveOverviewData = [
    { title: 'Total Leave', value: 3, change: '+12.9%' },
    { title: 'Approved Leave', value: 3, change: '+12.9%' },
    { title: 'Pending Leave', value: 5, change: '+12.9%' },
    { title: 'Rejected Leave', value: 50, change: '+12.9%' },
];

const DUMMY_ATTENDANCE_DATA = [
    { id: 1, month: 'Jan', present: 100, absent: 20 },
    { id: 2, month: 'Feb', present: 160, absent: 15 },
];

const exportHeaders = [
    { label: 'Month', key: 'month' },
    { label: 'Present', key: 'present' },
    { label: 'Absent', key: 'absent' },
];

const EmployeeAttritionBoard = () => {
            const navigate = useNavigate();
    
    return (
        <div className="employee-attrition-page leave-report-page">
                			<button onClick={() => navigate(`/my-reports`)} className="close_nav header_close">Close</button>

          
            <div className="leave-dashboard-header">
                <header className="leave-top-header">
                    <div className="header-left">
                        <h1>Employee Attendance</h1>
                    </div>
                    <div className="header-right  export-button-main">
                        <ExportList
                            data={DUMMY_ATTENDANCE_DATA}
                            headers={exportHeaders}
                            filename="attendance_report.csv"
                        />

                    </div>
                </header>
            </div>

            <div className="overview-card-container">
                {leaveOverviewData.map((card, index) => (
                    <div key={index} className="overview-card">
                        <div className="overview-card-header">
                            <div className='left_side_title'>
                                <span className="overview-card-title">{card.title}</span>
                                <div className="overview-card-value">{card.value}</div>
                            </div>
                            <div className="overview-card-icon">
                                <User size={24} />
                            </div>
                        </div>
                        <div className="overview-card-footer">
                            <span className="overview-card-footer-text">From Last Month</span>
                            <div className='dreadUpbox'>
                                <TrendingUp size={14} />
                                <span className="overview-card-footer-text">{card.change}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <EmployeeAttritionBoardChart />
        </div>
    );
};

export default EmployeeAttritionBoard;