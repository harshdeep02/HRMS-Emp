import { useState, useEffect, useRef, useCallback } from "react";
import { List, Mail, Phone, MoreVertical, XCircle, TrendingUp, UserPlus, Warehouse, Grid2x2, X, SquareMenu } from "lucide-react";
import "../../EmployeeOnboarding/EmployeeList/EmployeeList.scss";
import { useNavigate } from "react-router-dom";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import DynamicFilter from "../../../utils/common/DynamicFilter.jsx";
import SortFilter from "../../../utils/common/SortFilter.jsx";
import { getApplicantList } from "../../../Redux/Actions/applicantActions.js";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import { applicantStatusOptions } from "../../../utils/Constant.js";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import defaultImage from "../../../assets/default-user.png";
import ImportList from "../../../utils/common/Import/ImportList.jsx";
import ExportList from "../../../utils/common/Export/ExportList.jsx";
import { getJobList } from "../../../Redux/Actions/jobActions.js";
const INITIAL_VISIBLE_COUNT = 9;

const ApplicantList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const applicantData = useSelector((state) => state?.applicantList);
    const applicantList = applicantData?.data?.result || [];
    const totalApplicants = applicantData?.data?.count || 0; // This is the count for the CURRENT filter
    const applicantLoading = applicantData?.loading || false;
    const metaData = applicantData?.data?.metadata || {};
    const jobData = useSelector((state) => state?.jobList);
    const jobList = jobData?.data?.job_opening || [];

    useEffect(() => {
        // if (jobList?.length === 0) 
        dispatch(getJobList());
    }, [])

    const statusConfig = applicantStatusOptions?.reduce((acc, status) => {
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

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [jobRoleFilter, setJobRoleFilter] = useState("All");
    const [sortBy, setSortBy] = useState("recent");
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [view, setView] = useState('list');
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [open, setOpen] = useState(false);
    const searchBoxRef = useRef();
    const menuRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const fetchApplicantList = useCallback(async () => {
        try {
            const sendData = {
                noofrec: visibleCount,
                currentpage: currentPage, // Assuming pagination is handled by 'noofrec' for now
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(jobRoleFilter && jobRoleFilter !== "All" && { job_opening_id: jobRoleFilter }),
                ...(searchTerm && { search: searchTerm }),
                ...(sortBy && { sort_by: sortBy }),
            };
            const res = await dispatch(getApplicantList(sendData));

        } catch (error) {
            console.error("Error fetching applicant list:", error);
        } finally {
            setShowMoreLess(false);
        }
    }, [searchTerm, statusFilter, jobRoleFilter, sortBy, visibleCount]);

    useEffect(() => {
        fetchApplicantList();
    }, [searchTerm, statusFilter, jobRoleFilter, sortBy, visibleCount]);

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setJobRoleFilter("All");
        setSortBy("recent");
        setShowMoreLess(false);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        if (searchBoxRef.current) searchBoxRef.current?.clearInput();
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

    const handleJobRoleFilter = (newFilter) => {
        setJobRoleFilter(newFilter);
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

    const applicantImage = (img) => img
        ? (() => {
            try {
                return JSON.parse(img);
            } catch {
                return img;
            }
        })()
        : defaultImage;

    const exportHeaders = [
        { label: "Name", key: (applicant) => [applicant?.first_name, applicant?.last_name].filter(Boolean).join(" ") || "N/A" },
        { label: "Job Title", key: (applicant) => applicant?.job_opening?.job_title || "N/A" },
        { label: "Email", key: (applicant) => applicant?.email || "N/A" },
        { label: "Mobile No", key: (applicant) => applicant?.mobile_no || "N/A" },
        { label: "Status", key: (applicant) => statusConfig[applicant?.status]?.label || "N/A" },
    ];

    const handleImportRow = (row) => {
        return {
            first_name: row?.Name?.split(" ")?.[0] || "",
            last_name: row?.Name?.split(" ")?.slice(1).join(" ") || "",
            job_opening: { job_title: row?.["Job Title"] || "" },
            email: row?.Email || "",
            mobile_no: row?.["Mobile No"] || "",
            status: Object.keys(statusConfig).find(
                (key) => statusConfig[key]?.label === row?.Status
            ) || "",
        };
    };

    // ❗ 1 new loding
    // ✅ Table ke hisaab se dummy loading rows
    const dummyData = Array.from({ length: INITIAL_VISIBLE_COUNT }, (_, i) => ({
        id: i,
        first_name: "",
        last_name: "",
        job_opening: { job_title: "" },
        email: "",
        mobile_no: "",
        status: "",
        user_image: null,
    }));


    const ListData = (applicantLoading && !showMoreLess) ? dummyData : applicantList;

    return (
        <div className="employee-dashboard-list app_List">
            <div className="dashboard-sticky-header">
                <header className="top-header">
                    <div className="header-left">
                        <div>
                            <h1>All Applicants List
                                <span className="total-count">
                                    <TrendingUp size={16} className="TrendingUp" />
                                    {metaData?.all}
                                </span>
                            </h1>
                            <p>Complete List Of Applicants Applied</p>
                        </div>
                    </div>
                    <div className="header-right header_rightMain">
                        <div className="toolbar">
                            <SearchBox
                                onSearch={handleSearch}
                                placeholder="Search Applicant..."
                                ref={searchBoxRef}
                            />
                            <div className="toolbar-actions">
                                <div className="view-toggle">
                                    <Tooltips title='Table View' placement="top" arrow>
                                        <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}><List size={20} /></button>
                                    </Tooltips>
                                    <Tooltips title='Card View' placement="top" arrow>
                                        <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}><Grid2x2 size={20} strokeWidth={1.5} /></button>
                                    </Tooltips>
                                </div>
                                {/* Job Role filter */}
                                <DynamicFilter
                                    filterBy="job_role"
                                    filterValue={jobRoleFilter}
                                    onChange={handleJobRoleFilter}
                                />
                                <SortFilter
                                    sortBy={sortBy}
                                    onChange={handleSortChange}
                                />
                            </div>
                        </div>
                        <Tooltips title='Add New Applicant' placement="top" arrow>
                            <button className="add-employee-btn" onClick={() => navigate('/add-applicant')}><UserPlus size={16} /></button>
                        </Tooltips>
                        <div className="relative" ref={menuRef}>
                            <Tooltips title="Import & Export" placement="top" arrow>
                                <button className="menu-btn" onClick={() => setOpen((prev) => !prev)}>
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
                                        data={applicantList}
                                        headers={exportHeaders}
                                        filename="applicants.csv"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            </div>

            <main className="dashboard-content">
                <aside className="filters-sidebar">
                    <div>
                        <ul>
                            {applicantStatusOptions?.map((status, index) => {
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
                                        <span className="counts">({String(count)?.padStart(2, '0')})</span>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="clearBTN">
                            {(jobRoleFilter !== 'All') &&
                                ((!applicantLoading) &&
                                    <button className="clear-filters-btn" onClick={resetFilters}>
                                        <span>Clear filter</span><X size={14} />
                                    </button>

                                )}
                        </div>
                    </div>
                </aside>

                {view === 'list' && (
                    <div className="employee-table-wrapper">
                        <table className="employee-table emp-t-4">
                            <thead>
                                <tr>
                                    <th>Applicant</th>
                                    <th>Job Opening</th>
                                    <th>Contacts</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            {/* // ❗ 3 new loding */}
                            {(applicantLoading || applicantList?.length > 0) ? (
                                    <tbody className={`${applicantLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                        {ListData?.map(item => {
                                            const StatusIcon = statusConfig[item?.status]?.icon || XCircle;
                                            const statusClassName = statusConfig[item?.status]?.className;
                                            return (
                                                <tr key={item?.id} className="employee-row" onClick={() => navigate(`/applicant-details/${item?.id}`)}>
                                                    <td>
                                                        <div className="info_img">
                                                            <div className="loadingImg">
                                                                <img className="avatar" src={applicantImage(item?.user_image)} alt={item?.first_name} />
                                                            </div>
                                                            <div className=" name loadingtdsmall Semi_Bold">{[item?.first_name, item?.last_name].filter(Boolean).join(" ")}</div>
                                                        </div>
                                                    </td>
                                                    <td className="loadingtd"><div className="department ">{item?.job_opening?.job_title || ''}</div></td>
                                                    <td className="td ">
                                                        <div className="contact-info  ">
                                                            <div className="loadingtdTOP"><Mail size={14} /> <span>{item?.email || '-'}</span></div>
                                                            <div className="loadingtdBOTTOM gap_2 "><Phone size={14} /> <span className="phone Bold ">{item?.mobile_no || '-'}</span></div>
                                                        </div>
                                                    </td>
                                                    <td className="loadingtd ">
                                                        <div className={`status-badge ${statusClassName}`}>
                                                            <StatusIcon size={16} />
                                                            <span>{statusConfig[item?.status]?.label || ''}</span>
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
                                            {(!applicantLoading && applicantList?.length === 0) && (
                                                <ListDataNotFound module="applicants" handleReset={resetFilters} />
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                        {(!applicantLoading || showMoreLess) &&
                            <div className="load-more-container">
                                {(visibleCount < totalApplicants) && (
                                    <button onClick={handleLoadMore} className="load-more-btn">
                                        {(applicantLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                    </button>
                                )}
                                {(visibleCount >= totalApplicants && totalApplicants > INITIAL_VISIBLE_COUNT) && (
                                    <button onClick={handleShowLess} className="load-more-btn">
                                        {(applicantLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                    </button>
                                )}
                            </div>
                        }
                    </div>
                )}

                <div className="content_box_auto">
                    {view === "grid" && (
                        <div className="grid_cards">
                            {applicantLoading || applicantList?.length > 0 ? (
                                <section className={`employee-list-section ${view}-view  ${applicantLoading && !showMoreLess ? 'grid_cards_loading' : ''}`}>
                                    {ListData?.map((item) => {
                                        const StatusIcon = statusConfig[item?.status]?.icon || XCircle;
                                        const statusClassName = statusConfig[item?.status]?.className;

                                        return (
                                            <div
                                                key={item?.id}
                                                className="employee-card"
                                                onClick={() => navigate(`/applicant-details/${item?.id}`)}
                                            >
                                                <div className="top_info">
                                                    <div className="employee-info info_img">
                                                        <img
                                                            src={applicantImage(item?.user_image)}
                                                            alt={item?.first_name}
                                                            className="avatar"
                                                        />
                                                    </div>
                                                    <div className="employee-info">
                                                        <div className="name">
                                                            {[item?.first_name, item?.last_name]
                                                                .filter(Boolean)
                                                                .join(" ")}
                                                        </div>
                                                        <div className="status_">
                                                            <div className={`status-badge ${statusClassName}`}>
                                                                <StatusIcon size={16} />
                                                                <span>{statusConfig[item?.status]?.label || ""}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="contact-info">
                                                    <div>
                                                        <Warehouse size={16} strokeWidth={1.5} />
                                                        {item?.job_opening?.job_title || ""}
                                                    </div>
                                                    <div>
                                                        <Mail size={16} strokeWidth={1.5} />{" "}
                                                        <span>{item?.email || ""}</span>
                                                    </div>
                                                    <div>
                                                        <Phone size={16} strokeWidth={1.5} />{" "}
                                                        <span className="phone">{item?.mobile_no || ""}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </section>
                            ) : (!applicantLoading && applicantList?.length === 0 && (
                                <ListDataNotFound module="applicants" handleReset={resetFilters} />
                            )
                            )}
                            {(!applicantLoading || showMoreLess) &&
                                <div className="load-more-container">
                                    {(visibleCount < totalApplicants) && (
                                        <button onClick={handleLoadMore} className="load-more-btn">
                                            {(applicantLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                        </button>
                                    )}
                                    {(visibleCount >= totalApplicants && totalApplicants > INITIAL_VISIBLE_COUNT) && (
                                        <button onClick={handleShowLess} className="load-more-btn">
                                            {(applicantLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                        </button>
                                    )}
                                </div>
                            }
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default ApplicantList;