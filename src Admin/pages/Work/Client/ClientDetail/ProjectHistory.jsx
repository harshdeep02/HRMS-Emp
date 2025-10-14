import { useState, useEffect, useRef, useCallback } from 'react';
import LoadingDots from '../../../../utils/common/LoadingDots/LoadingDots';
import SearchBox from '../../../../utils/common/SearchBox.jsx';
import ListDataNotFound from '../../../../utils/common/ListDataNotFound.jsx';
import SortFilter from '../../../../utils/common/SortFilter.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from '../../../../utils/common/DateTimeFormat.js';
import DynamicFilter from '../../../../utils/common/DynamicFilter.jsx';
import { ProjectStatusOptions } from '../../../../utils/Constant.js';
import { getClientProjectDetails } from '../../../../Redux/Actions/clientActions.js';

const INITIAL_VISIBLE_COUNT = 5;

const ProjectHistory = () => {

    const dispatch = useDispatch();

    const clientProject = useSelector((state) => state?.clientProject);
    const clientProjecList = clientProject?.data?.result || [];
    const totalProjects = clientProject?.data?.count || 0;
    const projectLoading = clientProject?.loading;

    const clientDetails = useSelector((state) => state?.clientDetails);
    const clientDetail = clientDetails?.data?.result || {};

    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [searchTerm, setSearchTerm] = useState("");
    const searchBoxRef = useRef();
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [sortBy, setSortBy] = useState("recent");
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("All");
    const [view, setView] = useState('list');

    const statusConfig = ProjectStatusOptions?.reduce((acc, status) => {
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
                client_id: clientDetail?.id,
                currentpage: currentPage,
                ...(sortBy && { sort_by: sortBy }),
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
            };
            await dispatch(getClientProjectDetails(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching project list:", error);
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

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
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
    const dummyData = Array.from({ length: INITIAL_VISIBLE_COUNT }, (_, i) => ({
    }));

    const ListData = (projectLoading && !showMoreLess) ? dummyData : clientProjecList;

    return (
        <>
            <div className="detail-table-wrapper">
                <div className="box_head">
                    <h2>Client Project History</h2>
                    <div className="toolbar_d">
                        <SearchBox onSearch={handleSearch} placeholder="Search Project..." ref={searchBoxRef} />
                        <div className="toolbar-actions">
                            <div className="border_box">
                                <SortFilter
                                    sortBy={sortBy}
                                    onChange={handleSortChange}
                                />
                            </div>
                            <div className="border_box">
                                <DynamicFilter
                                    filterBy="status"
                                    filterValue={statusFilter}
                                    onChange={handleStatusFilter}
                                    options={ProjectStatusOptions?.filter((item) => item?.label !== "All")?.map((item) => ({
                                        value: item?.id,
                                        label: item?.label,
                                    })) || []}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <table className="detail-table emp-t-5 project-history-table empProject">
                    <thead>
                        <th>Project Name</th>
                        <th>PROJECT LEADER</th>
                        <th>Start Date</th>
                        <th>Due Date</th>
                        <th className='status-badge'>Status</th>
                    </thead>
                    {(projectLoading || clientProjecList?.length > 0) ? (

                        <tbody className={`${projectLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                            {ListData?.map(item => {
                                const StatusIcon = statusConfig[item?.status]?.icon;
                                const statusClassName = statusConfig[item?.status]?.className || '';
                                return (
                                    <tr key={item?.id} className="detail_tr_row employee-row">
                                        <td className=''>
                                            <div className='loadingtd purplle Bold'>
                                                {item?.project_name}
                                            </div>
                                        </td>
                                        <td className='loadingtd '>{[item?.project_leader?.first_name, item?.project_leader?.last_name].filter(Boolean).join(" ")}</td>
                                        <td className='loadingtd'>{formatDate(item?.start_date)}</td>
                                        <td className='loadingtd'>{formatDate(item?.end_date)}</td>
                                        <td className='loadingtd pr10' >
                                            <div className={`status-badge  status-badge_2  ${statusClassName}`}>
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
                                    {(!projectLoading && clientProjecList?.length === 0) && (
                                        <ListDataNotFound module="Project" handleReset={resetFilters} />
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>


            </div>
            {(!projectLoading || showMoreLess) &&
                <div className="load-more-container">
                    {(visibleCount < totalProjects) && (
                        <button onClick={handleLoadMore} className="load-more-btn">
                            {(projectLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                        </button>
                    )}
                    {((visibleCount >= totalProjects) && totalProjects > INITIAL_VISIBLE_COUNT) && (
                        <button onClick={handleShowLess} className="load-more-btn">
                            {(projectLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                        </button>
                    )}
                </div>
            }
        </>
    );
};

export default ProjectHistory;