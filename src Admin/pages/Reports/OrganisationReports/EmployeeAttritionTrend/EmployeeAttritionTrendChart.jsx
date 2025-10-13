import React, { useState, useEffect, useCallback } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot, MarkPlot, lineElementClasses, markElementClasses } from '@mui/x-charts/LineChart';
import { axisClasses, ChartsGrid, ChartsTooltip, ChartsXAxis, ChartsYAxis } from '@mui/x-charts';
import ExportList from "../../../../utils/common/Export/ExportList";
import './DailyAttendanceReport.scss';
import DynamicFilter from "../../../../utils/common/DynamicFilter";
import { Label } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeAttrition } from "../../../../Redux/Actions/report/organizationalReport/organizationReportAction";
import { getOrgAttritionTrend } from "../../../../Redux/Actions/organizationActions";
import Loader from "../../../../utils/common/Loader/Loader";

// Dummy data for the chart, mimicking your attrition data
const DUMMY_ATTRITION_DATA = [
    { label: 'Jan', attrition_count: 2, percentage: 2.5 },
    { label: 'Feb', attrition_count: 4, percentage: 4.2 },
    { label: 'Mar', attrition_count: 3, percentage: 3.8 },
    { label: 'Apr', attrition_count: 5, percentage: 5.1 },
    { label: 'May', attrition_count: 1, percentage: 1.8 },
    { label: 'Jun', attrition_count: 2, percentage: 2.9 },
    { label: 'Jul', attrition_count: 4, percentage: 4.5 },
    { label: 'Aug', attrition_count: 3, percentage: 3.9 },
    { label: 'Sep', attrition_count: 5, percentage: 5 },
    { label: 'Oct', attrition_count: 2, percentage: 2.7 },
    { label: 'Nov', attrition_count: 3, percentage: 3.6 },
    { label: 'Dec', attrition_count: 4, percentage: 4.8 },
];

const EmployeeAttritionTrendChart = () => {
    const navigate = useNavigate();

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [timeRange, setTimeRange] = useState('This-Year');


        const dispatch = useDispatch();
    
        const employeeAttritionData = useSelector((state) => state?.orgAttritionTrend);
        const attritionList = employeeAttritionData?.data?.data || [];
        const attritionLoading = employeeAttritionData?.loading || false

        
        const fetchAttritionTrend = useCallback(async () => {
            try {
                const sendData = {
                    ...(timeRange && { timeRange: timeRange }),
                };
                const res = await dispatch(getOrgAttritionTrend(sendData));
    
            } catch (error) {
                console.error("Error fetching Employee Attrition Trend:", error);
            }
        }, [dispatch, timeRange]);
    
        useEffect(() => {
            fetchAttritionTrend();
        }, [fetchAttritionTrend]);

        const handleTimeRangeFilter= (newFilter) => {
        setTimeRange(newFilter);
    };

    // This effect handles window resizing for chart responsiveness
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Function to filter data based on the selected time range
    // const filterData = () => {
    //     const ranges = {
    //         'This Year': 12,
    //         'Last Six Months': 6,
    //         'Last Three Months': 3,
    //     };
    //     return ranges[timeRange]
    //         ? attritionList?.slice(-ranges[timeRange])
    //         : attritionList;
    // };

    // const filteredData = filterData();

    // Data for the DynamicFilter component
    const timeFilterOptions = [
        { id: '1', label: "This Year", value: "This-Year" },
        { id: '2', label: "Last Three Months", value: "Last-Three-Months" },
        { id: '3', label: "Last Six Months", value: "Last-Six-Months" },
        // { id: '4', label: "Quarterly", value: "Quarterly" },
    ];

    // Export data and headers for the ExportList component
    const exportData = attritionList.map(item => ({
        Month: item.label,
        'Attrition Count': item.attrition_count,
        'Attrition Percentage': item.percentage
    }));
    const exportHeaders = ['Month', 'Attrition Count', 'Attrition Percentage'];

    if (attritionLoading && !attritionList) {
            return <div className="loading-state"><Loader /></div>;
        }

    return (

        <div className="leave-report-page">
            <button onClick={() => navigate(`/organisation-reports`)} className="close_nav header_close">Close</button>

            <div className="leave-dashboard-header">
                <header className="leave-top-header">
                    <div className="header-left">
                        <h1>Employee Attrition Trend</h1>
                    </div>
                    <div className="header-right export-button-main">
                        <ExportList
                            data={exportData}
                            headers={exportHeaders}
                            filename={`employee_attrition_report.csv`}
                        />
                    </div>
                </header>
            </div>
            <div className="box-chart-container">


                <div className="table-header">
                    <h2>Attrition Trend</h2>
                    <div className="filters">
                        <div className="">
                            <DynamicFilter
                                filterBy="filter"
                                options={timeFilterOptions}
                                filterValue={timeRange}
                                onChange={handleTimeRangeFilter}
                            />
                        </div>
                    </div>
                </div>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        width: '100%',
                    }}
                >
                    <div
                    // style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}
                    >
                        <ChartContainer
                            width={screenWidth - 300}
                            height={450}
                            series={[
                                {
                                    type: 'bar',
                                    data: attritionList?.map(item => item?.attrition_count),
                                    label: 'Count',
                                    color: '#DD6389',
                                },
                                {
                                    type: 'line',
                                    data: attritionList?.map(item => item?.percentage),
                                    label: 'Percentage',
                                    color: '#B66DF1',
                                },
                            ]}

                            // xAxis={[{
                            //     scaleType: 'band',
                            //     data: filteredData?.map(item => item?.label),
                            //     id: 'x-axis-months',
                            //     tickPlacement: 'middle',
                            // }]}
                            xAxis={[{
                                scaleType: 'band',
                                data: attritionList?.map(item => item?.label), // 👈 yahi months show karega
                                id: 'x-axis-months',
                                tickPlacement: 'middle',
                            }]}
                            yAxis={[
                                {
                                    id: 'y-axis-count',
                                    scaleType: 'linear',
                                    min: 0,
                                    max: 6,
                                },
                            ]}
                            sx={{
                                '.MuiBarElement-root': {
                                    fill: '#B66DF1',
                                },
                                [`& .${lineElementClasses.root}`]: {
                                    stroke: '#769000',
                                    strokeWidth: 2,
                                },
                                [`& .${markElementClasses.root}`]: {
                                    stroke: '#6c63ff',
                                    fill: '#6c63ff',
                                    strokeWidth: 12,
                                },
                                // left axis label agar hide karna hai to rehne de
                                [`& .${axisClasses.left} .${axisClasses.label}`]: {
                                    display: 'none',
                                },
                                // ❌ isko hata do / comment kar do
                                // [`& .${axisClasses.bottom} .${axisClasses.label}`]: {
                                //   display: 'none',
                                // },
                                [`& .${axisClasses.line}`]: {
                                    stroke: '#e0e0e0',
                                    strokeWidth: 1,
                                },
                                [`& .${axisClasses.tickLabel}`]: {
                                    fill: '#6b7280',   // ✅ yehi month label ka color hoga
                                    fontSize: 12,
                                },
                            }}

                        >
                            <BarPlot />
                            <LinePlot />
                            <MarkPlot />
                            <ChartsTooltip
                                trigger="label"
                                strokeOpacity={0.3}
                                slotProps={{
                                    popper: {
                                        sx: {
                                            // backgroundColor: "rgba(0,0,0,0.5)", // 👈 yaha 0.5 opacity
                                            color: "#fff",
                                            borderRadius: "6px",
                                            padding: "4px 8px",
                                        }
                                    }
                                }}
                            />

                            <ChartsGrid vertical={true} horizontal={true}
                                sx={{
                                    [`& .${axisClasses.line}`]: {
                                        stroke: '#e0e0e0',
                                        strokeWidth: 1,
                                    },
                                    [`& .${axisClasses.tick}`]: {
                                        stroke: '#e0e0e0',
                                    },
                                    [`& .${axisClasses.tickLabel}`]: {
                                        fill: '#6b7280',
                                        fontSize: 12,
                                    },
                                    // 👇 Grid lines opacity control
                                    "& .MuiChartsGrid-line": {
                                        strokeOpacity: 0.3,   // 30% visible
                                    },
                                }}
                            />
                            <ChartsYAxis axisId="y-axis-count" />
                            <ChartsXAxis axisId="x-axis-months" />

                        </ChartContainer>
                        <div className="legend-list" style={{ marginTop: '20px', textAlign: 'center' }}>
                            <span className="s_count" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginRight: '20px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#6c63ff' }}></div>
                                Count
                            </span>
                            <span className="s_Percentage" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#B66DF1' }}></div>
                                Percentage
                            </span>
                        </div>
                    </div>
                </Box>

            </div>
        </div>
    );
};

export default EmployeeAttritionTrendChart;
//