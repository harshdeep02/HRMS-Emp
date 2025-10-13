import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPinCheck, TrendingUp, XCircle } from 'lucide-react';
import './Organization.scss'
import { useDispatch, useSelector } from 'react-redux';
import './DepartmentList.scss'
import LoadingDots from '../../../../utils/common/LoadingDots/LoadingDots';
import './WorkLocationList.scss'
import { WorkLocationStatusOptions } from '../../../../utils/Constant';
import ListDataNotFound from '../../../../utils/common/ListDataNotFound';
import { getWorkLocList } from '../../../../Redux/Actions/Settings/organizationActions';

const INITIAL_VISIBLE_COUNT = 9;

export const WorkLocationList = () => {
    const { id } = useParams()
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux
    const WorkLocationData = useSelector((state) => state?.WorkLocList);
    const LocationsList = WorkLocationData?.data?.data || [];
    const totalLocations = WorkLocationData?.data?.count || 0;
    const locationsLoading = WorkLocationData?.loading || false;
    const organizationDetailData = useSelector((state) => state?.organizationDetail);
    const organizationDetail = organizationDetailData?.data?.data || {};

    const statusConfig = WorkLocationStatusOptions?.reduce((acc, status) => {
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


    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [showMoreLess, setShowMoreLess] = useState(false);


    const fetchLocationList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");
            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
                organisation_id: organizationDetail?.organisation_id
            };
            await dispatch(getWorkLocList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching work locations list:", error);
            setShowMoreLess(false);
        }
    }, [dispatch, visibleCount, currentPage]);

    useEffect(() => {
        fetchLocationList();
    }, [fetchLocationList]);

    const resetFilters = () => {
        setSearchTerm("");
        setShowMoreLess(false);
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();
        }
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
        setShowMoreLess(true);
    };;

    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    };

    // ❗ 1 new loding
    // ✅ Table ke hisaab se dummy loading rows
    const dummData = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        work_location_name: "",
        street_address1: "",
        street_address2: '',
        employee_count: "",
        status: ""
    }));


    const ListData = (locationsLoading && (!showMoreLess || LocationsList?.length === 0)) ? dummData : LocationsList;

    return (
        <div className="settingWorkLocListMain">
            <div className="employee-dashboard-list depatmentListMain">
                <header className="top-header" style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px'
                }}>
                    <div className="header-left">
                        <h1 style={{ display: 'flex', alignItems: 'flexEnd', gap: '12px', fontSize: "20px" }}>
                            Work Locations
                            <span className="total-count" style={{ display: 'flex', alignItems: 'flexEnd', fontSize: '12px', fontWeight: 'normal' }}>
                                <TrendingUp size={16} className="TrendingUp" style={{ marginRight: '4px' }} />
                                Total no: {!locationsLoading && String(totalLocations).padStart(2, '0')}
                            </span>
                        </h1>
                    </div>
                    <div className="header-right">
                        <button className="add-dp-org-btn" onClick={() => navigate('/settings/add-work-location', { state: { orgId: id } })}
                        >
                            <MapPinCheck size={16} /> Add New Worklocations
                        </button>
                    </div>
                </header>

                <div className="employee-table-wrapper">
                    <table className="employee-table emp-t-4">
                        <thead>
                            <tr>
                                <th>LOCATION NAME</th>
                                <th>ADDRESS</th>
                                <th>NO. OF EMPLOYEES</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        {(locationsLoading || LocationsList?.length > 0) ? (
                            <>
                                <tbody className={`${locationsLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                    {ListData?.map(item => {
                                        const StatusIcon = statusConfig[item?.status]?.icon || XCircle;
                                        const statusClassName = statusConfig[item?.status]?.className;

                                        return (
                                            <tr
                                                key={item?.id}
                                                className="employee-row"
                                                onClick={() => navigate(`/settings/work-location-details/${item?.id}`, { state: { orgId: id } })}
                                            >
                                                <td>
                                                    <div className="loadingtd name">{item?.work_location_name}</div>
                                                </td>
                                                <td>
                                                    <div className="loadingtd department">{[item?.street_address1, item?.street_address2, item?.city, item?.state]?.filter(Boolean)?.join(', ')}</div>
                                                </td>
                                                <td>
                                                    <div className=" loadingtd department">{item?.employee_count}</div>
                                                </td>
                                                <td className="loadingtd ">
                                                    <div className={`status-badge ${statusClassName}`}>
                                                        <StatusIcon size={16} />
                                                        <span>{statusConfig[item?.status]?.label}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </>
                        ) : (
                            // ❗ 4 new loding
                            <tbody className="table_not_found">
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                                        {(!locationsLoading && LocationsList?.length === 0) && (
                                            <ListDataNotFound module="work location" handleReset={resetFilters} />
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                    {(!locationsLoading || showMoreLess) &&
                        <div className="load-more-container" >
                            {(visibleCount < totalLocations) && (
                                <button onClick={handleLoadMore} className="load-more-btn" style={{
                                }}>
                                    {locationsLoading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                </button>
                            )}
                            {(visibleCount >= totalLocations && totalLocations > INITIAL_VISIBLE_COUNT) && (
                                <button onClick={handleShowLess} className="load-more-btn" style={{
                                }}>
                                    {locationsLoading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                </button>
                            )}
                        </div>
                    }
                </div>

            </div>
        </div>
    )
}
