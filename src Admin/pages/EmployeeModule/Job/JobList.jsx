import { useState, useEffect, useRef, useCallback } from "react";
// UPDATED: Added new icons
import { List, MoreVertical, XCircle, TrendingUp, UserPlus, X, SquareMenu } from "lucide-react";
import "../../EmployeeOnboarding/EmployeeList/EmployeeList.scss";
import { useNavigate } from "react-router-dom";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getJobList } from "../../../Redux/Actions/jobActions.js";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import SortFilter from "../../../utils/common/SortFilter.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import { jobStatusOptions } from "../../../utils/Constant.js";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import ImportList from "../../../utils/common/Import/ImportList.jsx";
import ExportList from "../../../utils/common/Export/ExportList.jsx";
import DynamicFilter from "../../../utils/common/DynamicFilter.jsx";
import { showMasterData, showMastersValue } from "../../../utils/helper.js";
const INITIAL_VISIBLE_COUNT = 9;

const JobList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Data from redux
    const jobData = useSelector((state) => state?.jobList);
    const jobList = jobData?.data?.job_opening || [];
    const totalJobs = jobData?.data?.count || 0;
    const jobLoading = jobData?.loading || false;
    const metaData = jobData?.data?.metadata || {}
    const skills_options = showMasterData("14");
    const masterData = useSelector(state => state?.masterData?.data);

    const statusConfig = jobStatusOptions?.reduce((acc, status) => {
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

    const [searchTerm, setSearchTerm] = useState("");
    const searchBoxRef = useRef();
    const [statusFilter, setStatusFilter] = useState("All");
    const [departmentFilter, setDepartmentFilter] = useState("All");
    const [sortBy, setSortBy] = useState("recent");
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [view, setView] = useState('list');
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

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

    const fetchJobList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");

            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(departmentFilter && departmentFilter !== "All" && { department_id: departmentFilter }),
                ...(searchTerm && { search: searchTerm }),
                ...(sortBy && { sort_by: sortBy }), // backend should handle sort
            };
            const res = await dispatch(getJobList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching job list:", error);
            setShowMoreLess(false);
        }
    }, [searchTerm, statusFilter, departmentFilter, sortBy, visibleCount]);

    useEffect(() => {
        fetchJobList();
    }, [searchTerm, statusFilter, departmentFilter, sortBy, visibleCount]);

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setDepartmentFilter("All");
        setSortBy("recent");
        setShowMoreLess(false);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        if (searchBoxRef.current) searchBoxRef.current?.clearInput(); // 👈 clear input field
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
        setShowMoreLess(true);
    };

    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    };

    const handleStatusFilter = (newFilter) => {
        setStatusFilter(newFilter);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    const handleDepartmentFilter = (newFilter) => {
        setDepartmentFilter(newFilter);
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

    const exportHeaders = [
        { label: "Job Title", key: (job) => job?.job_title || "N/A" },
        { label: "Positions", key: (job) => job?.no_of_position || "N/A" },
        {
            label: "Skills - Experience Required",
            key: (job) => {
                const skillIds = job?.required_skills
                    ? JSON.parse(job?.required_skills || "[]")
                    : [];

                const skillLabels = skillIds
                    ?.map((id) => skills_options?.find((skill) => skill?.id == id)?.label)
                    ?.filter(Boolean);

                const experienceLabel = showMastersValue(
                    masterData,
                    "15",
                    job?.experience_level
                );

                return `${skillLabels?.join(", ") || "N/A"} - ${experienceLabel || "N/A"
                    }`;
            },
        },
        {
            label: "Status",
            key: (job) => statusConfig[job?.job_status]?.label || "N/A",
        },
    ];

    const handleImportRow = async (row) => {
        const payload = {
            job_title: row['Job Title'],
            no_of_position: row['Positions'],
            skills: row['Skills-Experienced Required'],
            job_status: row['Status'],
        };
        // return dispatch(createNewDepartment(payload));
    };
    // ❗ 1 new loding
    const dummyData = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        name: "",
        email: "",
        mobile_no: " ",
        department: "",
        status: " "
    }));

    // ❗ 2 new loding
    const ListData = (jobLoading && !showMoreLess) ? dummyData : jobList;


    return (
        <div className="employee-dashboard-list job_list jobListMain">
            <div className="dashboard-sticky-header">
                <header className="top-header">
                    <div className="header-left">
                        {/* <button className="header-icon-btn"><img src={userlistsvg} /></button> */}
                        <div>
                            <h1>Job List
                                <span className="total-count"> <TrendingUp size={16} className="TrendingUp" />
                                    {metaData?.all}
                                </span>
                            </h1>
                            <p>Complete List of Available Positions</p>
                        </div>
                    </div>
                    <div className="header-right header_rightMain">
                        <div className="toolbar">
                            <SearchBox
                                onSearch={handleSearch}
                                placeholder="Search Job Title..."
                                ref={searchBoxRef}
                            />
                            <div className="toolbar-actions">
                                <DynamicFilter
                                    filterBy="department"
                                    filterValue={departmentFilter}
                                    onChange={handleDepartmentFilter}
                                />
                                <SortFilter
                                    sortBy={sortBy}
                                    onChange={handleSortChange}
                                />
                            </div>
                        </div>
                        <Tooltips
                            title='Add New Job'
                            placement="top" arrow={true}
                        >
                            <button className="add-employee-btn" onClick={() => navigate('/add-new-job')}><UserPlus size={16} /> </button>
                        </Tooltips>

                        {/* <button className="menu-btn"><MoreVertical size={24} /></button> */}
                        <div className="relative" ref={menuRef}>
                            <Tooltips title="Import & Export" placement="top" arrow={true}>
                                <button
                                    className="menu-btn"
                                    onClick={() => setOpen((prev) => !prev)}
                                >
                                    <MoreVertical size={24} />
                                </button>
                            </Tooltips>

                            {open && (
                                <div className="menu-popup">
                                    <ImportList
                                        apiFunction={handleImportRow}
                                        onImportSuccess={() => {
                                            // fetchDepartmentList();
                                            setOpen(false);
                                        }}
                                    />
                                    <ExportList
                                        data={jobList}
                                        headers={exportHeaders}
                                        filename="jobs.csv"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            </div>

            <main className="dashboard-content">
                <>
                    <aside className="filters-sidebar">
                        <div>
                            <ul>
                                {jobStatusOptions?.map((status, index) => {
                                    const Icon = statusConfig[status?.id]?.icon || SquareMenu; // Fallback icon
                                    let count = 0;
                                    if (status?.label === "All") {
                                        count = metaData?.all ?? 0;
                                    } else {
                                        count = metaData?.[status?.label?.toLowerCase()?.replace(" ", "")] ?? 0;
                                    }
                                    return (
                                        <li key={index} className={statusFilter == status?.id ? "active" : ""} onClick={() => handleStatusFilter(status?.id)}>
                                            {/* UPDATED: Grouped icon and text */}
                                            <div className="status-label">
                                                <Icon size={16} strokeWidth={1.5} />
                                                <span>{status?.label}</span>
                                            </div>
                                            <span className="count">({String(count)?.padStart(2, '0')})</span>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="clearBTN">
                                {(departmentFilter !== 'All') && (
                                    (!jobLoading) &&
                                    <button className="clear-filters-btn" onClick={resetFilters}>
                                        <span>
                                            Clear filter
                                        </span>
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </aside>

                    {view === 'list' && (
                        <div className="employee-table-wrapper">
                            <table className="employee-table emp-t-4 ">
                                <thead>
                                    <tr>
                                        <th>Job Title</th>
                                        <th>Positions</th>
                                        <th>Skills-Experienced Required</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                {/* // ❗ 3 new loding */}
                                {(jobLoading || jobList?.length > 0) ? (
                                    <>
                                        <tbody className={`${jobLoading && !showMoreLess ? 'LoadingList' : ''}`}>

                                            {ListData?.map(item => {
                                                const StatusIcon = statusConfig[item?.job_status]?.icon || XCircle;
                                                const statusClassName = statusConfig[item?.job_status]?.className;
                                                const skillIds = item?.required_skills ? JSON.parse(item?.required_skills || "[]") : []; // e.g. [2,5]

                                                const skillLabels = skillIds?.map(id => skills_options?.find(skill => skill?.id == id)?.label)?.filter(Boolean); // remove invalid ids
                                                return (
                                                    <tr
                                                        key={item?.id}
                                                        className="employee-row "
                                                        onClick={() => navigate(`/job-details/${item?.id}`)}
                                                    >
                                                        <td className="">
                                                            {/* <div className="loadingImg"></div> */}
                                                            <div className="department loadingtd Semi_Bold">{item?.job_title}</div>
                                                        </td>
                                                        <td className="">
                                                            <div className="department loadingtd ">{item?.no_of_position}</div>
                                                        </td>
                                                        <td className="td ">
                                                            <div className="contact-info ">
                                                                <div className="loadingtdTOP gap_-4"><span>{skillLabels?.join(", ")}</span></div>
                                                                <div className="gap_4 loadingtdBOTTOM"><span className="phone Bold ">{showMastersValue(masterData, "15", item?.experience_level)}</span></div>
                                                            </div>
                                                        </td>
                                                        <td className="loadingtd">
                                                            <div className={`status-badge  ${statusClassName}`}>
                                                                <StatusIcon size={16} />
                                                                <span>{statusConfig[item?.job_status]?.label}</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </>
                                ) : (
                                    // ❗ 4 new loding
                                    <tbody className="table_not_found">
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                                                {(!jobLoading && jobList?.length === 0) && (
                                                    <ListDataNotFound module="job" handleReset={resetFilters} />
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                            {(!jobLoading || showMoreLess) &&
                                <div className="load-more-container">
                                    {/* Show More button if not all jobs loaded */}
                                    {(visibleCount < totalJobs) && (
                                        <button onClick={handleLoadMore} className="load-more-btn">
                                            {(jobLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                        </button>
                                    )}
                                    {/* Show Less button if all jobs are loaded */}
                                    {(visibleCount >= totalJobs && totalJobs > INITIAL_VISIBLE_COUNT) && (
                                        <button onClick={handleShowLess} className="load-more-btn">
                                            {(jobLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                        </button>
                                    )}
                                </div>
                            }
                        </div>
                    )}
                </>
            </main>
        </div>
    );
};

export default JobList;
// /old 