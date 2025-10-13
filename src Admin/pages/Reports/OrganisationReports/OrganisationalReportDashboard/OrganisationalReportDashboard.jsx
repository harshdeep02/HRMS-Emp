import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { User, TrendingUp } from 'lucide-react';
import OrganisationalReportDashboardCharts from './OrganisationalReportDashboardCharts';
import './OrganisationalReportDashboard.scss';
import ExportList from '../../../../utils/common/Export/ExportList';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeestatsSummary } from '../../../../Redux/Actions/organizationActions';
import Loader from '../../../../utils/common/Loader/Loader';
import StatusBadgeSkeleton from '../../../../utils/CalendarSkeletonLoader/StatusBadgeSkeleton';


const formatDataForExport = (apiData) => {
    if (!apiData) return [];

    const summary = apiData.summaryData || [];
    const gender = apiData.genderChartData || [];
    const designation = apiData.designationSummaryData || [];
    const ageGroup = apiData.ageGroupChartData || [];

    const exportBase = {
        'Total Employees': summary.find(d => d.title === 'Total Employees')?.value || 0,
        'New Employees': summary.find(d => d.title === 'New Employees')?.value || 0,
        'Active Employees': summary.find(d => d.title === 'Active Employees')?.value || 0,
        'Inactive Employees': summary.find(d => d.title === 'Inactive Employees')?.value || 0,
        'Change (%)': summary.find(d => d.title === 'Total Employees')?.change || 'N/A',
    };


    const exportData = [];

    designation.forEach(d => {
        exportData.push({
            ...exportBase,
            'Report Type': 'Designation Summary',
            'Category/Month': d.name,
            'Male Count': '',
            'Female Count': '',
            'Total Count': d.value,
            'Age Range': '',
        });
    });
    
    ageGroup.forEach(d => {
        exportData.push({
            ...exportBase,
            'Report Type': 'Age Group Summary',
            'Category/Month': d.name,
            'Male Count': '',
            'Female Count': '',
            'Total Count': d.value,
            'Age Range': d.name,
        });
    });

    gender.forEach(d => {
        exportData.push({
            ...exportBase,
            'Report Type': 'Gender Trend',
            'Category/Month': d.month,
            'Male Count': d.male,
            'Female Count': d.female,
            'Total Count': d.male + d.female,
            'Age Range': '',
        });
    });

    return exportData;
};

const exportHeaders = [
    { label: 'Report Type', key: 'Report Type' },
    { label: 'Category/Month', key: 'Category/Month' },
    { label: 'Total Employees (Overall)', key: 'Total Employees' },
    { label: 'Total Count (Category)', key: 'Total Count' },
    { label: 'Male Count', key: 'Male Count' },
    { label: 'Female Count', key: 'Female Count' },
    { label: 'Age Range', key: 'Age Range' },
    { label: 'New Employees', key: 'New Employees' },
    { label: 'Active Employees', key: 'Active Employees' },
];


const OrganisationalReportDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state
    const orgempData = useSelector((state) => state?.EmployeestatsSummary);
    const orgempDataList = orgempData?.data;
    const orgempDataLoading = orgempData?.loading;
    const [departmentFilter, setDepartmentFilter] = useState("All");

        // Local state for filters (unchanged)
    const [selectedYear, setSelectedYear] = useState({
        age_group:'2025',
        designation_summary:'2025',
        gender:'2025'
    });
    const currYear = new Date().getFullYear()
    const years = Array.from({ length: 10 }, (_, i) => ({id:i, label:currYear - i, }));
    

    const fetchEmployee = useCallback(async () => {
        try {
            const sendData = {
                ...(departmentFilter && departmentFilter !== "All" && { department_id: departmentFilter }),
                ...(selectedYear?.designation_summary && {designation_summary_year:selectedYear?.designation_summary}),
                ...(selectedYear?.age_group && {age_group_year:selectedYear?.age_group}),
                ...(selectedYear?.gender && {gender_chart_year:selectedYear?.gender})
            };
            const res = await dispatch(getEmployeestatsSummary(sendData));
        } catch (error) {
            console.error("Error fetching Dashboard Data:", error);
        }
    }, [dispatch, departmentFilter, selectedYear]);

    // Fetch data on mount if not already available
    useEffect(() => {
        fetchEmployee();
    }, [fetchEmployee]);

    // Data extraction for charts and summaries
    const {
        summaryData,
        genderChartData,
        designationSummaryData,
        ageGroupChartData,
    } = useMemo(() => {
        if (orgempDataList) {
            return {
                summaryData: orgempDataList.summaryData || [],
                genderChartData: orgempDataList.genderChartData || [],
                designationSummaryData: orgempDataList.designationSummaryData || [],
                ageGroupChartData: orgempDataList.ageGroupChartData || [],
            };
        }
        return {
            summaryData: [],
            genderChartData: [],
            designationSummaryData: [],
            ageGroupChartData: [],
        };
    }, [orgempDataList]);

    // Data formatted for CSV export
    const dataToExport = useMemo(() => {
        return formatDataForExport(orgempDataList);
    }, [orgempDataList]);


    if (orgempDataLoading && !orgempDataList) {
        return <div className="loading-state"><Loader /></div>;
    }
    
    return (
        <div className="dashboard-container leave-report-page orgDashboardMain">
            <button onClick={() => navigate(`/organisation-reports`)} className="close_nav header_close">Close</button>

            {/* Header and Export */}
            <div className="leave-dashboard-header">
                <header className="leave-top-header">
                    <div className="header-left">
                        <h1>Overview</h1>
                    </div>
                    <div className="header-right export-button-main">
                        <ExportList
                            data={dataToExport} 
                            headers={exportHeaders}
                            filename="organizational_full_report.csv" 
                        />
                    </div>
                </header>
            </div>
            
            <div className="overview-card-container">
                {summaryData.map((card, index) => (
                    <div key={index} className="overview-card">
                        <div className="overview-card-header">
                            <div className='left_side_title'>
                                <span className="overview-card-title">{card.title}</span>
                                <div className="overview-card-value">{orgempDataLoading ? <StatusBadgeSkeleton/> : card.value}</div>
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

            <div className="dashboard-charts-row orgChartMain">
                <OrganisationalReportDashboardCharts
                    genderChartData={genderChartData}
                    designationSummaryData={designationSummaryData}
                    ageGroupChartData={ageGroupChartData}
                    ageGroupLegendData={ageGroupChartData} 
                    years={years}
                    departmentFilter={departmentFilter}
                    setDepartmentFilter={setDepartmentFilter}
                    setSelectedYear={setSelectedYear}
                    selectedYear={selectedYear}
                />
            </div>
        </div>
    );
};

export default OrganisationalReportDashboard;