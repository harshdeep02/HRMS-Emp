import {
    useState,
    useEffect,
    useRef,
    useCallback,
} from "react";
import {
    MoreVertical,
    X,
    TrendingUp,
    UserPlus,
    CalendarArrowUp,
    CalendarArrowDown,
    SquareMenu,
    XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import SortFilter from "../../../utils/common/SortFilter.jsx";
import DatePicker from "../../../utils/common/DatePicker/DatePicker.jsx";
import DynamicFilter from "../../../utils/common/DynamicFilter.jsx";
import { useDispatch, useSelector } from "react-redux";
import { ProjectStatusOptions } from "../../../utils/Constant.js";
import { formatDate, formatDate3 } from "../../../utils/common/DateTimeFormat.js";
import { showMasterData, showMastersValue } from "../../../utils/helper.js";
import { getProjectList } from "../../../Redux/Actions/projectActions.js";
const INITIAL_VISIBLE_COUNT = 7;

const ProjectList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const projectData = useSelector((state) => state?.projectList);
    const projectLists = projectData?.data?.result || [];
    const totalProjects = projectData?.data?.count || 0;
    const projectListLoading = projectData?.loading || false;
    const metaData = projectData?.data?.metadata;
    const priority_options = showMasterData("20");
    const masterData = useSelector(state => state?.masterData?.data);

    const statusConfig = ProjectStatusOptions?.reduce((acc, status) => {
        if (!status?.id) return acc; // skip undefined values
        acc[status?.id] = {
            label: status?.label,
            icon: status?.icon,
            className: status?.label.replace(/\s+/g, "-").toLowerCase()
        };
        return acc;
    }, {});

    // --- State Management for Project List ---
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const searchBoxRef = useRef();
    const menuRef = useRef(null);
    const [sortBy, setSortBy] = useState("recent");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState(null);
    const [showMoreLess, setShowMoreLess] = useState(false);

    // Close menu on outside click
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const fetchProjectList = useCallback(async () => {
        try {
            const sendData = {
                noofrec: visibleCount,
                currentpage: currentPage, // Assuming pagination is handled by 'noofrec' for now
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(searchTerm && { search: searchTerm }),
                ...(sortBy && { sort_by: sortBy }),
                ...(priorityFilter && priorityFilter !== "All" && { priority: priorityFilter }),
                ...(dateFilter && { custom_date: formatDate3(new Date(dateFilter)) }),
            };
            const res = await dispatch(getProjectList(sendData));

        } catch (error) {
            console.error("Error fetching project list:", error);
        } finally {
            setShowMoreLess(false);
        }
    }, [searchTerm, statusFilter, sortBy, visibleCount, dateFilter, priorityFilter]);

    useEffect(() => {
        fetchProjectList();
    }, [searchTerm, statusFilter, sortBy, visibleCount, dateFilter, priorityFilter]);


    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setSortBy("recent");
        setShowMoreLess(false);
        setPriorityFilter("All");
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setDateFilter(null);
        // Clear date input manually if needed
        const dateInput = document.getElementById('date-filter-input');
        if (dateInput) dateInput.value = '';
        if (searchBoxRef.current) searchBoxRef.current.clearInput();
    };

    const handleDateFilter = (date) => {
        setCurrentPage(1);
        setDateFilter(date);
        setVisibleCount(INITIAL_VISIBLE_COUNT)
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    };

    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    };

    const handlePriorityFilter = (newFilter) => {
        setPriorityFilter(newFilter);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    const handleStatusFilter = (newFilter) => {
        setStatusFilter(newFilter);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    // --- Export Headers for Project List ---
    const exportHeaders = [
        { label: "Project Name", key: (p) => p?.project_name || "N/A" },
        { label: "Client Name", key: (p) => p?.client?.client_name || "N/A" },
        { label: "Priority", key: (p) => showMastersValue(masterData, "20", p?.priority) || "N/A" },
        { label: "Start Date", key: (p) => formatDate(p?.start_date) || "N/A" },
        { label: "End Date", key: (p) => formatDate(p?.end_date) || "N/A" },
        { label: "Assigned To", key: (p) => p?.assigned_to || "N/A" },
        { label: "Status", key: (p) => statusConfig[p?.status]?.label || "N/A" },
    ];

    // --- Import Row Handler for Project List ---
    const handleImportRow = async (row) => {
        const payload = {
            project_name: row["Project Name"],
            client_name: row["Client Name"],
            priority: row["Priority"],
            start_date: row["Start Date"],
            end_date: row["End Date"],
            assigned_to: row["Assigned To"],
            status: row["Status"],
        };
        // Example: dispatch to backend
        // return dispatch(createNewProject(payload));
    };

    const dummData = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        first_name: "",
        last_name: "",
        job_opening: { job_title: "" },
        email: "",
        mobile_no: "",
        status: "",
        user_image: null,
    }));


    const ListData = (projectListLoading && (!showMoreLess || projectLists?.length === 0)) ? dummData : projectLists;

    return (
        <div className="attendanceListMain">
            <div className="employee-dashboard-list empListMain">
                <div className="dashboard-sticky-header">
                    <header className="top-header">
                        <div className="header-left">
                            <div>
                                <h1>
                                    Project List
                                    <span className="total-count">
                                        <TrendingUp size={16} className="TrendingUp" />
                                        {metaData?.all}
                                    </span>
                                </h1>
                                <p>List Of All Projects</p>
                            </div>
                        </div>
                        <div className="header-right header_rightMain">
                            <div className="toolbar">
                                <SearchBox
                                    onSearch={handleSearch}
                                    placeholder="Search project..."
                                    ref={searchBoxRef}
                                />
                                <div className="toolbar-actions">
                                    {/* Additional filters from the image */}
                                    <div className="filter-dropdown">
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
                                    <div className="filter-dropdown">
                                        <DatePicker
                                            label=""
                                            onDateChange={handleDateFilter}
                                            initialDate={dateFilter}
                                        />
                                    </div>
                                    <SortFilter
                                        sortBy={sortBy}
                                        onChange={handleSortChange}
                                    />
                                    <Tooltips title='Add New Project' placement="top" arrow={true}>
                                        <button className="add-employee-btn" onClick={() => navigate('/add-project')}><UserPlus size={16} /> </button>
                                    </Tooltips>
                                    <div className="relative" ref={menuRef}>
                                        <Tooltips
                                            title="Import & Export"
                                            placement="top"
                                            arrow={true}>
                                            <button
                                                className="menu-btn"
                                                onClick={() => setOpen((prev) => !prev)}>
                                                <MoreVertical size={24} />
                                            </button>
                                        </Tooltips>
                                        {open && (
                                            <div className="menu-popup">
                                                <ImportList
                                                    apiFunction={handleImportRow}
                                                    onImportSuccess={() => {
                                                        // Refresh project list if needed
                                                        setOpen(false);
                                                    }}
                                                />
                                                <ExportList
                                                    data={projectLists}
                                                    headers={exportHeaders}
                                                    filename="projects.csv"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>

                <main className={`dashboard-content`}>
                    <aside className="filters-sidebar">
                        <div>
                            <ul>
                                {ProjectStatusOptions?.map((status, index) => {
                                    const Icon = status.icon || SquareMenu;
                                    let count = 0;
                                    if (status?.label === "All") {
                                        count = metaData?.all ?? 0;
                                    } else {
                                        count = metaData?.[status?.label.toLowerCase().replace(" ", "")] ?? 0;
                                    }
                                    return (
                                        <li
                                            key={status?.id}
                                            className={statusFilter === status?.id ? "active" : ""}
                                            onClick={() => handleStatusFilter(status?.id)}
                                        >
                                            <div className="status-label">
                                                <Icon size={16} strokeWidth={1.5} />
                                                <span>{status?.label}</span>
                                            </div>
                                            <span className="counts">({String(count)?.padStart(2, '0')})</span>
                                        </li>
                                    );
                                })}
                            </ul>
                            {(statusFilter !== "All" || dateFilter !== null || priorityFilter !== "All") && (
                                <div className="clearBTN">
                                    <button className="clear-filters-btn" onClick={resetFilters}>
                                        <span>Clear filter</span>
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </aside>
                    <div className="content_box_auto">
                        <div className="employee-table-wrapper">
                            <table className="employee-table emp-t-5">
                                <thead>
                                    <tr>
                                        <th>PROJECT NAME</th>
                                        <th>CLIENT NAME</th>
                                        <th>PRIORITY</th>
                                        <th>START & END DATE</th>
                                        <th>ASSIGNED TO</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                {(projectListLoading || projectLists?.length > 0) ? (

                                    <tbody className={`${projectListLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                        {ListData?.map((item) => {
                                            const StatusIcon = statusConfig[item?.status]?.icon || XCircle;
                                            const statusClassName = statusConfig[item?.status]?.className;
                                            return (
                                                <tr key={item?.id} className="employee-row"
                                                    onClick={() => navigate(`/project-details/${item?.id}`)}
                                                >
                                                    <td className="">
                                                        <div className="info_img loadingtd" >
                                                            <div className="name Semi_Bold">{item?.project_name}</div>
                                                        </div>
                                                    </td>
                                                    <td className="loadingtd">{item?.client?.client_name}</td>
                                                    <td className="loadingtd">{showMastersValue(masterData, "20", item?.priority)}</td>
                                                    <td>
                                                        <div className="contact-info">
                                                            <div className="loadingtd loadingtdTOP"><CalendarArrowUp size={14} /> <span>{formatDate(item?.start_date)}</span></div>
                                                            <div className="loadingtd gap_3 Bold Bold loadingtdBOTTOM"><CalendarArrowDown size={14} /> <span className="phone">{formatDate(item?.end_date)}</span></div>
                                                        </div>
                                                    </td>
                                                    <td className="loadingtd">{[item?.project_leader?.first_name, item?.project_leader?.last_name].filter(Boolean).join(" ")}</td>
                                                    <td className="loadingtd">
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
                                    // ❗ 4 new loding
                                    <tbody className="table_not_found">
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                                                {(!projectListLoading && projectLists?.length === 0) && (
                                                    <ListDataNotFound module="projectLists" handleReset={resetFilters} />
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                            {(!projectListLoading || showMoreLess) &&
                                <div className="load-more-container">
                                    {visibleCount < totalProjects && (
                                        <button onClick={handleLoadMore} className="load-more-btn">
                                            {(projectListLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                        </button>
                                    )}
                                    {visibleCount >= totalProjects &&
                                        totalProjects > INITIAL_VISIBLE_COUNT && (
                                            <button onClick={handleShowLess} className="load-more-btn">
                                                {(projectListLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                            </button>
                                        )}
                                </div>
                            }
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
export default ProjectList;