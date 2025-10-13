import { useState, useEffect, useCallback } from "react";
// Icons used in the component
import {
    XCircle,
    Calendar,
} from "lucide-react";
// UPDATED: Added necessary imports for the new toolbar
import DynamicFilter from "../../../utils/common/DynamicFilter.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
// This component uses the same SCSS file
// import "../Leaves/tableDetail.scss";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ProjectStatusOptions } from "../../../utils/Constant.js";
import { getProjectList } from "../../../Redux/Actions/projectActions.js";
import { showMasterData, showMastersValue } from "../../../utils/helper.js";
import { formatDate } from "../../../utils/common/DateTimeFormat.js";

export const EmpProject = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    // Data from redux
    const projectData = useSelector((state) => state?.projectList);
    const projectLists = projectData?.data?.result || [];
    const totalProjects = projectData?.data?.count || 0;
    const projectListLoading = true//projectData?.loading || false;
    const priority_options = showMasterData("20");
    const masterData = useSelector(state => state?.masterData?.data);

    // State for managing UI interactions
    const INITIAL_VISIBLE_COUNT = 10;
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [dateFilter, setDateFilter] = useState(null);
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

    const fetchProjects = useCallback(async () => {
        try {
            const sendData = {
                noofrec: visibleCount,
                currentpage: 1, // Assuming pagination is handled by 'noofrec' for now
                user_id: id,
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(priorityFilter && priorityFilter !== "All" && { priority: priorityFilter }),
            };
            const res = await dispatch(getProjectList(sendData));

        } catch (error) {
            console.error("Error fetching project list:", error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [statusFilter, visibleCount, priorityFilter]);

    useEffect(() => {
        fetchProjects();
    }, [statusFilter, visibleCount, priorityFilter]);


    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const resetFilters = () => {
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

    // --- RENDER ---
    const dummData = Array.from({ length: INITIAL_VISIBLE_COUNT }, (_, i) => ({

    }));

    const ListData = (projectListLoading && !isLoadingMore) ? dummData : projectLists;

    return (
        <>
            <div className="otherDetailPageSroll">
                <div className="detail-table-wrapper">
                    <div className="box_head">
                        <h2>Projects History</h2>
                        <div className="toolbar_d">
                            {/* --- THIS ENTIRE BLOCK IS UPDATED --- */}
                            <div className="toolbar-actions">
                                <div className=" ">
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
                                <div className=" ">
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

                    <table className="detail-table emp-t-5 project-table empProject">
                        <thead>
                            <tr>
                                <th>PROJECT NAME</th>
                                <th>CLIENT NAME</th>
                                <th>PRIORITY</th>
                                <th>START&END DATE</th>
                                <th className="status-badge">STATUS</th>
                            </tr>
                        </thead>
                        {(projectListLoading || projectLists?.length > 0) ? (

                            <tbody className={`${projectListLoading && !isLoadingMore ? 'LoadingList' : ''}`}>
                                {ListData?.map((item) => {
                                    const StatusIcon = statusConfig[item?.status]?.icon || XCircle;
                                    const statusClassName = statusConfig[item?.status]?.className || 'default';
                                    return (
                                        <tr key={item?.id} className="employee-row  detail_tr_row">
                                            <td><div className="project-name loadingtd  purplle Semi_Bold">{item?.project_name}</div></td>
                                            <td><div className="client-name loadingtd">{item?.client?.client_name}</div></td>
                                            <td><div className={`priority-badge priority- loadingtd`}>{showMastersValue(masterData, "20", item?.priority)}</div></td>
                                            <td>
                                                <div className="date-range ">
                                                    <div className="date-item loadingtdTOP"><Calendar size={14} /><span>{formatDate(item?.start_date)}</span></div>
                                                    <div className="date-item loadingtdBOTTOM  purplle Bold"><Calendar size={14} /><span>{formatDate(item?.end_date)}</span></div>
                                                </div>
                                            </td>
                                            <td className="loadingtdbig">
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
                                        {(!projectListLoading && projectLists?.length === 0) && (
                                            <ListDataNotFound module="Project" handleReset={resetFilters} />
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                    {/* } */}
                </div>
                {(!projectListLoading || isLoadingMore) &&
                    <div className="load-more-container" style={{ marginTop: '-1px' }}>
                        {visibleCount < totalProjects && (
                            <button onClick={handleLoadMore} className="load-more-btn">
                                {(projectListLoading && isLoadingMore) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                            </button>
                        )}
                        {visibleCount >= totalProjects && totalProjects > INITIAL_VISIBLE_COUNT && (
                            <button onClick={handleShowLess} className="load-more-btn">
                                {(projectListLoading && isLoadingMore) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                            </button>
                        )}
                    </div>
                }
            </div>
        </>

    );
};
