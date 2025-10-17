import React, { useState, useEffect, useRef, useCallback } from 'react';
import LoadingDots from '../../../../utils/common/LoadingDots/LoadingDots.jsx';
import ListDataNotFound from '../../../../utils/common/ListDataNotFound.jsx';
import DynamicFilter from '../../../../utils/common/DynamicFilter.jsx';
import ExportList from '../../../../utils/common/Export/ExportList.jsx';
import {SquareMenu, X, XCircle } from "lucide-react";
import './AppraisalHistory.scss';
import { useNavigate } from 'react-router-dom';
import { appraisalStatusOptions } from '../../../../utils/Constant.js';
import { useDispatch, useSelector } from 'react-redux';
import { getAppraisalList } from '../../../../Redux/Actions/report/myReport/performanceAction.js';
import { getUserData } from '../../../../services/login.js';

const INITIAL_VISIBLE_COUNT = 5;

// Dummy data mirroring the image
const DUMMY_APPRAISAL_HISTORY = [
    // { id: 1,  appraisalPeriod: 'Q1 2024', reviewerName: 'Puneet Omar', performanceRating: 'Expert', status: 'Completed', appraisalDate: '2024-03-30' }
    // ,
    { id: 2, employeeName: 'Lara Nguyen', employeeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHBvcnRyYWl0JTIwYXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', appraisalPeriod: 'Q2 2024', department: 'Software Engineering', reviewerName: 'Ravi Verma', performanceRating: 'Intermediate', status: 'In Progress', appraisalDate: '2024-06-15' },
    { id: 3, employeeName: 'Carlos Mendez', employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHBvcnRyYWl0JTIwYXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', appraisalPeriod: 'Q1 2024', department: 'Operations', reviewerName: 'Sara Khan', performanceRating: 'Advance', status: 'Completed', appraisalDate: '2024-03-25' },
    { id: 4, employeeName: 'Fatima Al-Hassan', employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHBvcnRyYWl0JTIwYXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', appraisalPeriod: 'Q3 2024', department: 'Data Science', reviewerName: 'Maya Lee', performanceRating: 'Intermediate', status: 'In Progress', appraisalDate: '2024-09-01' },
    { id: 5, employeeName: 'James Collins', employeeAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fHBvcnRyYWl0JTIwYXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', appraisalPeriod: 'Q4 2024', department: 'Design', reviewerName: 'Emily Carter', performanceRating: 'Advance', status: 'Completed', appraisalDate: '2024-12-10' },
    { id: 6, employeeName: 'Tariq Junaid', employeeAvatar: 'https://images.unsplash.com/photo-1519085360753-af029168c872?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fHBvcnRyYWl0JTIwYXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', appraisalPeriod: 'Q1 2024', department: 'IT Infrastructure', reviewerName: 'Omar Shah', performanceRating: 'Intermediate', status: 'In Progress', appraisalDate: '2024-03-05' },
    { id: 7, employeeName: 'Anita Rao', employeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fHBvcnRyYWl0JTIwYXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', appraisalPeriod: 'Q2 2024', department: 'Business Development', reviewerName: 'Nina Patel', performanceRating: 'Advance', status: 'Completed', appraisalDate: '2024-05-20' },
    { id: 8, employeeName: 'Gregory Smith', employeeAvatar: 'https://images.unsplash.com/photo-1547425260-76bc45649c0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fHBvcnRyYWl0JTIwYXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', appraisalPeriod: 'Q3 2024', department: 'Marketing', reviewerName: 'Tommy Brooks', performanceRating: 'Intermediate', status: 'In Progress', appraisalDate: '2024-07-22' },
];

// Helper to map status labels to icons and class names
    const statusConfig = appraisalStatusOptions?.reduce((acc, status) => {
        if (!status?.id) return acc; // skip undefined values

        const label = status?.label || "All";
        const icon = status.icon || SquareMenu; // fallback to Users if no mapping exists

        acc[status?.id] = {
            label,
            icon,
            className: label.replace(/\s+/g, "-").toLowerCase()
        };
        return acc;
    }, {});

export const MyAppraisalHistory = () => {

    
        const appraisalData = useSelector((state) => state?.appraisalList);
        const appraisalList = appraisalData?.data?.data || [];
        const totalAppraisal = appraisalData?.data?.count || 0;
        const appraisalLoading = appraisalData?.loading || false;
        // console.log(appraisalData)

        const navigate = useNavigate();
        const dispatch = useDispatch();
        const  {id} = getUserData()
        
    
        const [statusFilter, setStatusFilter] = useState('All');
        const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
        const [currentPage, setCurrentPage] = useState(1);
        const [showMoreLess, setShowMoreLess] = useState(false);
    
        const exportHeaders = [
            { label: 'Employee Name', key: 'employeeName' },
            { label: 'Appraisal Period', key: 'appraisalPeriod' },
            { label: 'Department', key: 'department' },
            { label: 'Reviewer Name', key: 'reviewerName' },
            { label: 'Performance Rating', key: 'performanceRating' },
            { label: 'Status', key: 'status' }
        ];

            const fetchAppraisalList = useCallback(async () => {
                try {
                    const fy = localStorage.getItem("FinancialYear");
        
                    const sendData = {
                        user_id:id,
                        fy,
                        noofrec: visibleCount,
                        currentpage: currentPage,
                        ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
        
                    };
                    const res = await dispatch(getAppraisalList(sendData));
                    setShowMoreLess(false);
                } catch (error) {
                    console.error("Error fetching Appraisal list:", error);
                    setShowMoreLess(false);
                }
            }, [dispatch, statusFilter, visibleCount, currentPage]);
        
        
            useEffect(() => {
                fetchAppraisalList();
            }, [fetchAppraisalList]);
    
        const handleStatusFilter = (newFilter) => {
            setStatusFilter(newFilter);
            setVisibleCount(INITIAL_VISIBLE_COUNT);
        };
    
    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
        setShowMoreLess(true);
    };
    
    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    };
    
        const resetFilters = () => {
            setVisibleCount(INITIAL_VISIBLE_COUNT);
            setStatusFilter('All');
        };


 const AppraisalStatusOptions = [
    { id: 1, label: "Approved"},
    { id: 2, label: "Pending"},
    { id: 3, label: "Declined"},
    { id: 4, label: "Approval Pending"},
];

    const dummData = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        first_name: "",
        last_name: "",
        job_opening: { job_title: "" },
        email: "",
        mobile_no: "",
        status: "",
    }));
    

const ListData = (appraisalLoading && (!showMoreLess || appraisalList?.length === 0)) ? dummData : appraisalList;




  return (
        <div className="appraisalHistoryMain">
        <div className="leave-report-page">
                <button onClick={() => navigate(`/my-reports`)} className="close_nav header_close">Close</button>

                <div className="leave-dashboard-header">
                    <header className="leave-top-header">
                        <div className="header-left">
                            <h1>Appraisal History</h1>
                        </div>
                        <div className="apraisallHeadRight" style={{display:"flex"}}>

                            <div className="toolbar-actions" style={{marginRight:"15px"}}>
                                    <div className="border_box">

                                        <DynamicFilter
                                            label="Status"
                                            filterBy='status'
                                            options={AppraisalStatusOptions.map(option => ({ value: option.id, label: option.label }))}
                                            filterValue={statusFilter}
                                            onChange={handleStatusFilter}
                                        />
                                    </div>
                                </div>
                        <div className="header-right export-button-main" style={{marginBottom: "24px", marginTop:0}}>
                            <ExportList
                                data={DUMMY_APPRAISAL_HISTORY}
                                headers={exportHeaders}
                                filename="appraisal_history.csv"
                            />
                        </div>
                        </div>
                    </header>
                </div>
                <div className="appraisal-history-page">

                    <div className="detail-table-wrapper table3types">
                        <div className="box_head">
                            <div className="toolbar_d">
                            </div>
                        </div>
                            <div className="employee-table-wrapper">

                                <table className="employee-table emp-t-4">
                                    <thead>
                                        <tr className='table- header'>
                                            <th>Date</th>
                                            <th>Reviewer Name</th>
                                            <th>Performance Rating</th>
                                            <th className='status-badge'>STATUS</th>
                                        </tr>
                                    </thead>
                                    {(appraisalLoading || appraisalList?.length > 0) ? (
                                    <tbody className={`${appraisalLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                        {ListData.map(item => {
                                            const StatusIcon = statusConfig[item.status]?.icon || XCircle;
                                            const statusClassName = statusConfig[item.status]?.className;
                                            return (
                                                <>
                                                    <tr key={item.id} className="employee-row">
                                                        <td>
                                                            <div className="designation loadingtd">{item?.appraisal_date}</div>
                                                        </td>
                                                        <td>
                                                            <div className="designation loadingtd">{[item?.approved_by_user?.first_name, item?.approved_by_user?.last_name]?.filter(Boolean)?.join(" ")}</div>
                                                        </td>
                                                        <td className="" >
                                                            <div className="date loadingtd">{item?.overall_rating}</div>
                                                        </td>
                                                        <td className="loadingtd">
                                                            <div className={`status-badge ${statusClassName}`}>
                                                                <StatusIcon size={16} />
                                                                <span>{statusConfig[item?.status]?.label}</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </>
                                            );
                                        })}
                                    </tbody>
                                ) : (
                                    // ❗ 4 new loding
                                    <tbody className="table_not_found">
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                                                {(!appraisalLoading && appraisalList?.length === 0) && (
                                                    <ListDataNotFound module="Appraisal" handleReset={resetFilters} />
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                                </table>

                                <div className="load-more-container">
                                {(visibleCount < totalAppraisal) && (
                                    <button onClick={handleLoadMore} className="load-more-btn">
                                        {(appraisalLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                    </button>
                                )}
                                {/* Show Less button if all jobs are loaded */}
                                {(visibleCount >= totalAppraisal && totalAppraisal > INITIAL_VISIBLE_COUNT) && (
                                    <button onClick={handleShowLess} className="load-more-btn">
                                        {(appraisalLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                    </button>
                                )}
                            </div>
                            </div>
                    </div>
                </div>
            </div>
            </div>
  )
}
