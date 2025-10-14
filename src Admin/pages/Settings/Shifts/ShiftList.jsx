import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Frame, TrendingUp, UserPlus, XCircle } from 'lucide-react';
// import './Organization.scss'
import { useDispatch, useSelector } from 'react-redux';
import LoadingDots from '../../../utils/common/LoadingDots/LoadingDots';
import './ShiftList.scss'
import { getShiftList } from '../../../Redux/Actions/shiftActions';
import { shiftStatusOption } from '../../../utils/Constant';
import ListDataNotFound from '../../../utils/common/ListDataNotFound';
const INITIAL_VISIBLE_COUNT = 5;

export const ShiftList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux
    const shiftData = useSelector((state) => state?.shiftList);
    const shiftList = shiftData?.data?.result || [];
    const totalShift = shiftData?.data?.count || 0;
    const shiftLoading = shiftData?.loading || false;

    const statusConfig = shiftStatusOption?.reduce((acc, status) => {
        if (!status?.id) return acc; // skip undefined values

        const label = status?.label || "All";
        const icon = status.icon || List; // fallback to Users if no mapping exists

        acc[status?.id] = {
            label,
            icon,
            className: label.replace(/\s+/g, "-").toLowerCase()
        };
        return acc;
    }, {});

    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [view, setView] = useState('list');
    const [showMoreLess, setShowMoreLess] = useState(false);


    const fetchShiftList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");
            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
            };
            await dispatch(getShiftList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching Shift list:", error);
            setShowMoreLess(false);
        }
    }, [dispatch, visibleCount, currentPage]);

    useEffect(() => {
        fetchShiftList();
    }, [fetchShiftList]);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
        setShowMoreLess(true);
    };;

    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    };
    const dummData = Array.from({ length: INITIAL_VISIBLE_COUNT }, (_, i) => ({}));

    const ListData = (shiftLoading && !showMoreLess) ? dummData : shiftList;


    return (
        <div className="settingShiftListMain">
            <div className="employee-dashboard-list depatmentListMain">
                <header className=" headerUpper top-header">
                    <div className="header-left">
                        <h1 className='headerTopH1'>
                            Manage Shifts
                        </h1>
                        <div className="headerTextBottom setRow1Body" style={{}}>
                            Select the methods that you commonly use in your organization
                            <div>
                                to track your employee shift times
                            </div>
                        </div>
                    </div>
                </header>


                <div className="top-header" style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0'
                }}>
                    <div className="header-left">
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            All Shifts
                            <span className="total-count" style={{ fontSize: '14px', fontWeight: 'normal', alignItems: "flex-end" }}>
                                <TrendingUp size={16} className="TrendingUp" style={{ marginRight: '4px' }} />
                                Total no: {String(totalShift).padStart(2, '0')}
                            </span>
                        </h1>
                    </div>
                    <div className="header-right">
                        <button className="add-dp-org-btn" onClick={() => navigate('/settings/manage-shifts-list/add-shift')}

                        >
                            <UserPlus size={16} /> Add Shift
                        </button>
                    </div>
                </div>

                <div className="employee-table-wrapper decTabHeight">
                    <table className="employee-table emp-t-6">
                        <thead>
                            <tr>
                                <th>SHIFT</th>
                                <th>START TIME</th>
                                <th>END TIME</th>
                                <th>No. Of Employees</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        {(shiftLoading || shiftList?.length > 0) ? (

                            <tbody className={`  ${shiftLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                {ListData?.map(item => {
                                    const StatusIcon = statusConfig[item?.status]?.icon || XCircle;
                                    const statusClassName = statusConfig[item?.status]?.label;
                                    return (
                                        <tr
                                            key={item?.id}
                                            className="employee-row"
                                        >
                                            <td>
                                                <div className="department loadingtd">{item?.shift_name}</div>
                                            </td>
                                            <td>
                                                <div className="department loadingtd">{item?.start_time}</div>
                                            </td>
                                            <td>
                                                <div className="department loadingtd">{item?.end_time}</div>
                                            </td>
                                            <td>
                                                <div className="department loadingtd">{item?.employee_count || "-"}</div>
                                            </td>
                                            <td className='loadingtd'>
                                                <div className={`status-badge ${statusClassName}`}>
                                                    <StatusIcon size={16} />
                                                    <span>{statusConfig[item?.status]?.label}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                        ) : (

                            <tbody className="table_not_found">
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', paddingLeft: '150px' }}>
                                        {(!shiftLoading && shiftList?.length === 0) && (
                                            <ListDataNotFound module="Project Summary"  />
                                        )}

                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </table>

                    <div className="load-more-container" >
                        {(visibleCount < totalShift) && (
                            <button onClick={handleLoadMore} className="load-more-btn" style={{

                            }}>
                                {shiftLoading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                            </button>
                        )}
                        {(visibleCount >= totalShift && totalShift > INITIAL_VISIBLE_COUNT) && (
                            <button onClick={handleShowLess} className="load-more-btn" style={{

                            }}>
                                {shiftLoading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                            </button>
                        )}
                    </div>
                </div>


            </div>
        </div>
    )
}
