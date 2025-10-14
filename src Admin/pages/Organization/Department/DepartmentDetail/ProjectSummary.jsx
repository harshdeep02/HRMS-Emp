import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './DepartmentDetail.scss';
import LoadingDots from '../../../../utils/common/LoadingDots/LoadingDots';
import ListDataNotFound from '../../../../utils/common/ListDataNotFound';
import { formatDate } from '../../../../utils/common/DateTimeFormat';
import SearchBox from '../../../../utils/common/SearchBox.jsx';
import DynamicFilter from '../../../../utils/common/DynamicFilter.jsx';
import { getProjectDepartmentDetails } from '../../../../Redux/Actions/departmentActions';
import DynamicLoader from '../../../../utils/common/DynamicLoader/DynamicLoader.jsx';
import { showMasterData, showMastersValue } from '../../../../utils/helper.js';
import { ProjectStatusOptions } from '../../../../utils/Constant.js';
import EllipsisSpan from '../../../../utils/EllipsisSpan.jsx';
import { CalendarArrowDown, CalendarArrowUp } from 'lucide-react';

const ProjectSummary = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    // Data from redux
    const projectsState = useSelector((state) => state.projectDepartmentDetails);
    const projectList = projectsState?.data?.projects || [];
    const totalProjects = projectsState?.data?.count || 0;
    const projectLoading = projectsState?.loading;
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [view, setView] = useState('list');
    const priority_options = showMasterData("20");
    const masterData = useSelector(state => state?.masterData?.data);
    console.log(priority_options)

    // State for managing UI interactions
    const INITIAL_VISIBLE_COUNT = 8;
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [dateFilter, setDateFilter] = useState(null);
    const searchBoxRef = useRef();

    const statusConfig = ProjectStatusOptions?.reduce((acc, status) => {
        if (!status?.id) return acc; // skip undefined values
        acc[status?.id] = {
            label: status?.label,
            icon: status?.icon,
            className: status?.label.replace(/\s+/g, "-").toLowerCase()
        };
        return acc;
    }, {});


    // Fetch projects from the API
    const fetchProjects = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");
            const sendData = {
                fy,
                noofrec: visibleCount,
                department_id: id,
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(priorityFilter && priorityFilter !== "All" && { priority: priorityFilter }),
            };
            await dispatch(getProjectDepartmentDetails(sendData));
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
        finally {
            setIsLoadingMore(false);
        }
    }, [dispatch, visibleCount, searchTerm, statusFilter, priorityFilter]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Handlers
    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('All');
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setPriorityFilter("All");
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();
        }
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + INITIAL_VISIBLE_COUNT);
        setIsLoadingMore(true);
    };

    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setIsLoadingMore(true);
    };

    const handlePriorityFilter = (newFilter) => {
        setPriorityFilter(newFilter);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    const dummyData = Array.from({ length: INITIAL_VISIBLE_COUNT }, (_, i) => ({}));

    const ListData = (projectLoading && !isLoadingMore) ? dummyData : projectList;


    return (
        <>
            <div className="detail-table-wrapper ">
                <div className="box_head">
                    <h2>Projects In Department</h2>
                    <div className="toolbar_d">
                        <SearchBox onSearch={handleSearch} placeholder="Search project..." ref={searchBoxRef} />
                        <div className="toolbar-actions">
                            <div className="border_box">
                                <DynamicFilter
                                    filterBy="priority"
                                    filterValue={priorityFilter}
                                    onChange={handlePriorityFilter}
                                    options={priority_options?.map((item) => ({
                                        value: item?.id,
                                        label: item?.label,
                                    })) || []}
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
                        <th>CLIENT NAME</th>
                        <th>PRIORITY</th>
                        <th>START&END DATE</th>
                        <th className='status-badge'>Status</th>
                    </thead>
                    {(projectLoading || projectList?.length > 0) ? (
                        <tbody className={`${projectLoading && !isLoadingMore ? 'LoadingList' : ''}`}>
                            {ListData?.map(item => {
                                const StatusIcon = statusConfig[item?.status]?.icon;
                                const statusClassName = statusConfig[item?.status]?.className || '';
                                return (
                                    <tr key={item?.id} className="detail_tr_row employee-row">
                                        <td className=' '>
                                            <div className='loadingtd purplle Bold'>
                                                <EllipsisSpan text={item?.project_name} wordsToShow={10} />
                                            </div>

                                        </td>
                                        <td className='loadingtd'>{item?.client?.client_name}</td>
                                        <td className='loadingtd'>{showMastersValue(masterData, "20", item?.priority)}</td>
                                          <td>
                                                <div className="date-range ">
                                                    <div className="date-item loadingtdTOP"><CalendarArrowUp size={14} /><span>{formatDate(item?.start_date)}</span></div>
                                                    <div className="date-item loadingtdBOTTOM  purplle Bold"><CalendarArrowDown size={14} /><span>{formatDate(item?.end_date)}</span></div>
                                                </div>
                                            </td>
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
                                <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                                    {(!projectLoading && projectList?.length === 0) && (
                                        <ListDataNotFound module="Project Summary" handleReset={resetFilters} />
                                    )}

                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>
            {(!projectLoading || isLoadingMore) &&

                <div className="load-more-container">
                    {visibleCount < totalProjects && (
                        <button onClick={handleLoadMore} className="load-more-btn">
                            {(projectLoading && isLoadingMore) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                        </button>
                    )}
                    {visibleCount >= totalProjects && totalProjects > INITIAL_VISIBLE_COUNT && (
                        <button onClick={handleShowLess} className="load-more-btn">
                            {(projectLoading && isLoadingMore) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}

                        </button>
                    )}
                </div>
            }
        </>
    );
};

export default ProjectSummary;