import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Frame, Proportions, TrendingUp, UserPlus } from 'lucide-react';
import './Organization.scss'
import { useDispatch, useSelector } from 'react-redux';
import { getDepartmentList } from '../../../../Redux/Actions/departmentActions';
import DynamicLoader from '../../../../utils/common/DynamicLoader/DynamicLoader';
import './DepartmentList.scss'
import LoadingDots from '../../../../utils/common/LoadingDots/LoadingDots';
import ListDataNotFound from '../../../../utils/common/ListDataNotFound';

const INITIAL_VISIBLE_COUNT = 8;

const DepartmentList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { id } = useParams()

    // Redux
    const departmentData = useSelector((state) => state?.departmentList);
    const departmentList = departmentData?.data?.department || [];
    const totalDepartments = departmentData?.data?.count || 0;
    const departmentLoading = departmentData?.loading || false;
    const organizationDetailData = useSelector((state) => state?.organizationDetail);
    const organizationDetail = organizationDetailData?.data?.data || {};

    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [view, setView] = useState('list');
    const [showMoreLess, setShowMoreLess] = useState(false);


    const fetchDepartmentList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");
            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
                organisation_id: organizationDetail?.organisation_id
            };
            await dispatch(getDepartmentList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching department list:", error);
            setShowMoreLess(false);
        }
    }, [dispatch, visibleCount, currentPage]);

    useEffect(() => {
        fetchDepartmentList();
    }, [fetchDepartmentList]);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
        setShowMoreLess(true);
    };;

    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    };
    const dummData = Array.from({ length: INITIAL_VISIBLE_COUNT }, (_, i) => ({}));

    const ListData = (departmentLoading && !showMoreLess) ? dummData : departmentList;

    return (
        <div className="settingDepartmentListMain">
            <div className="employee-dashboard-list depatmentListMain">
                <header className="top-header" style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px'
                }}>
                    <div className="header-left" style={{ margin: "0" }}>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: "20px" }}>
                            All Department
                            <span className="total-count" style={{ fontSize: '12px' }}>
                                <TrendingUp size={16} className="TrendingUp" style={{ marginRight: '4px' }} />
                                Total no: {!departmentLoading && String(totalDepartments).padStart(2, '0')}
                            </span>
                        </h1>
                    </div>
                    <div className="header-right">
                        <button className="add-dp-org-btn" onClick={() => navigate('/settings/add-organization-department', { state: { orgId: id } })}>
                            <Proportions size={16} /> Add New Department
                        </button>
                    </div>
                </header>

                <div className="employee-table-wrapper">
                    <table className="employee-table emp-t-3">
                        <thead>
                            <tr>
                                <th>DEPARTMENT</th>
                                <th>PARENT DEPARTMENT</th>
                                <th>DEPARTMENT HEAD</th>
                            </tr>
                        </thead>
                        {(departmentLoading || departmentList?.length > 0) ? (
                            <tbody className={`${departmentLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                {ListData?.map(dep => (
                                    <tr
                                        key={dep?.id}
                                        className="employee-row"
                                    >
                                        <td className=''>
                                            <div className="employee-info info_img loadingtd">
                                                <div className="name">{dep?.department_name}</div>
                                            </div>
                                        </td>
                                        <td className='loadingtd'>
                                            <div className="department">{dep?.parent_department?.department_name || '-'}</div>
                                        </td>
                                        <td className="td loadingtd" >
                                            <div className="contact-info ">
                                                <span>{[dep?.department_head?.first_name, dep?.department_head?.last_name].filter(Boolean).join(" ") || '-'}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (

                            <tbody className="table_not_found">
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', paddingLeft: '150px' }}>
                                        {(!departmentLoading && departmentList?.length === 0) && (
                                            <ListDataNotFound module="department" />
                                        )}

                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </table>

                    {(!departmentLoading || showMoreLess) &&
                        <div className="load-more-container" >
                            {(visibleCount < totalDepartments) && (
                                <button onClick={handleLoadMore} className="load-more-btn" style={{
                                }}>
                                    {departmentLoading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                </button>
                            )}
                            {(visibleCount >= totalDepartments && totalDepartments > INITIAL_VISIBLE_COUNT) && (
                                <button onClick={handleShowLess} className="load-more-btn" style={{
                                }}>
                                    {departmentLoading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                </button>
                            )}
                        </div>
                    }
                </div>

            </div>
        </div>
    );
};

export default DepartmentList;