// src/components/EmployeTravel/TravelHistory.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import LoadingDots from '../../../utils/common/LoadingDots/LoadingDots';
import SearchBox from '../../../utils/common/SearchBox.jsx';
import "../../EmployeeOnboarding/Leaves/tableDetail.scss";
import ListDataNotFound from '../../../utils/common/ListDataNotFound.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getTravelList } from '../../../Redux/Actions/travelActions.js';
import { formatDate } from '../../../utils/common/DateTimeFormat.js';
import { travelStatusOptions } from '../../../utils/Constant.js';
import DynamicFilter from '../../../utils/common/DynamicFilter.jsx';

// Initial number of travel history items to display
const INITIAL_VISIBLE_COUNT = 6;


const TravelHistory = () => {

    const dispatch = useDispatch();

    const travelHistoryData = useSelector((state) => state?.travelList);
    const travelList = travelHistoryData?.data?.travel || [];
    const totalTravels = travelHistoryData?.data?.count || 0;
    const travelLoading = travelHistoryData?.loading;

    const travelDetails = useSelector((state) => state?.travelDetails?.data?.travel);

    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [searchTerm, setSearchTerm] = useState("");
    const searchBoxRef = useRef();
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [sortBy, setSortBy] = useState("recent");
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("All");
    const [view, setView] = useState('list');

    const statusConfig = travelStatusOptions?.reduce((acc, status) => {
        if (!status?.id) return acc; // skip undefined values
        acc[status?.id] = {
            label: status?.label,
            icon: status?.icon,
            className: status?.label.replace(/\s+/g, "-").toLowerCase()
        };
        return acc;
    }, {});

    const fetchTravels = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");
            const sendData = {
                fy,
                noofrec: visibleCount,
                user_id: travelDetails?.user_id,
                currentpage: currentPage,
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
            };
            await dispatch(getTravelList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching travel list:", error);
            setShowMoreLess(false);
        }
    }, [dispatch, searchTerm, sortBy, visibleCount, currentPage, statusFilter]);

    useEffect(() => {
        fetchTravels();
    }, [fetchTravels]);

    // Handlers
    const handleLoadMore = () => {
        setVisibleCount(prev => prev + INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    };

    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const resetFilters = () => {
        setSearchTerm("");
        setSortBy("recent");
        setStatusFilter("All")
        setShowMoreLess(false);
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();
        }
    };
    const dummData = Array.from({ length: INITIAL_VISIBLE_COUNT }, (_, i) => ({

    }));

    const ListData = (travelLoading && !showMoreLess) ? dummData : travelList;

    return (
        <>
            <div className="detail-table-wrapper">
                <div className="box_head">
                    <h2>Travel History</h2>
                    <div className="toolbar_d">
                        <SearchBox onSearch={handleSearch} placeholder="Search destination..." ref={searchBoxRef} />
                        <div className="toolbar-actions">
                            <div className="border_box">
                                <DynamicFilter
                                    filterBy="status"
                                    filterValue={statusFilter}
                                    onChange={handleStatusFilter}
                                    options={travelStatusOptions?.filter((item) => item?.label !== "All")?.map((item) => ({
                                        value: item?.id,
                                        label: item?.label,
                                    })) || []}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <table className="detail-table emp-t-5 project-table empProject">
                    <thead>
                        <th>Place of Visit</th>
                        <th>Departure Date</th>
                        <th>Arrival Date</th>
                        <th>Purpose</th>
                        <th>Status</th>
                    </thead>
                    {(travelLoading || travelList?.length > 0) ? (
                        <tbody className={`${travelLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                            {ListData?.map(item => {
                                const StatusIcon = statusConfig[item?.status]?.icon;
                                const statusClassName = statusConfig[item?.status]?.className;
                                return (
                                    <tr key={item?.id} className="employee-row detail_tr_row">
                                        <td className=''><div className=" loadingtd">{item?.place_of_visit}</div></td>
                                        <td className='loadingtd'><div className="">{formatDate(item?.expected_date_of_departure)}</div></td>
                                        <td className='loadingtd'><div className="">{formatDate(item?.expected_date_of_arrival)}</div></td>
                                        <td className='loadingtd'><div className="">{item?.purpose_of_visit}</div></td>
                                        <td className='loadingtd'>
                                            <div className={`status-badge ${statusClassName}`}>
                                                {StatusIcon && <StatusIcon size={16} />}
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
                                    {(!travelLoading && travelList?.length === 0) && (
                                        <ListDataNotFound module="Travel History" handleReset={resetFilters} />
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>

            {(!travelLoading || showMoreLess) &&
                <div className="load-more-container">
                    {(visibleCount < totalTravels) && (
                        <button onClick={handleLoadMore} className="load-more-btn">
                            {(travelLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                        </button>
                    )}
                    {((visibleCount >= totalTravels) && totalTravels > INITIAL_VISIBLE_COUNT) && (
                        <button onClick={handleShowLess} className="load-more-btn">
                            {(travelLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                        </button>
                    )}
                </div>
            }
        </>
    );
};

export default TravelHistory;