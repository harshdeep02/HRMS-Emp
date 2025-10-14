import { useState, useEffect, useRef, useCallback } from "react";
// UPDATED: Added new icons
import { MoreVertical, XCircle, TrendingUp, UserPlus, X, SquareMenu } from "lucide-react";
import "../../EmployeeOnboarding/EmployeeList/EmployeeList.scss";
import { useNavigate } from "react-router-dom";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import DynamicFilter from "../../../utils/common/DynamicFilter.jsx";
import DynamicLoader from "../../../utils/common/DynamicLoader/DynamicLoader.jsx";
import SortFilter from "../../../utils/common/SortFilter.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import { getEmpHealthList } from "../../../Redux/Actions/employeeHealthActions.js";
import { formatDate } from "../../../utils/common/DateTimeFormat.js";
import ImportList from "../../../utils/common/Import/ImportList.jsx";
import ExportList from "../../../utils/common/Export/ExportList.jsx";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import { empHealthStatusOptions } from "../../../utils/Constant.js";
import './EmployeeHealthList.scss'
const INITIAL_VISIBLE_COUNT = 9;

const EmployeeHealthList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Data from redux
    const empHealthData = useSelector((state) => state?.empHealthList);
    const empHealthList = empHealthData?.data?.result || [];
    const totalEmpHealths = empHealthData?.data?.count || 0;
    const empHealthLoading = empHealthData?.loading || false;
    const metaData = empHealthData?.data?.metadata || {};

    const statusConfig = empHealthStatusOptions?.reduce((acc, status) => {
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

    const fetchEmpHealthList = useCallback(async () => {
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
            const res = await dispatch(getEmpHealthList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching empHealth list", error);
            setShowMoreLess(false);
        }
    }, [searchTerm, statusFilter, departmentFilter, sortBy, visibleCount]);

    useEffect(() => {
        fetchEmpHealthList();
    }, [searchTerm, statusFilter, departmentFilter, sortBy, visibleCount]);

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setDepartmentFilter("All");
        setSortBy("recent");
        setShowMoreLess(false);
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();
        } // 👈 clear input field
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
        {
            label: 'Employee Name',
            key: (item) => [item?.employee?.first_name, item?.employee?.last_name].filter(Boolean).join(" ") || 'N/A'
        },
        {
            label: 'Department Name',
            key: (item) => item?.department?.department_name || 'N/A'
        },
        {
            label: 'Last Check Date',
            key: (item) => formatDate(item?.last_checkup_date) || 'N/A'
        },
        {
            label: 'Last Check Results',
            key: (item) => {
                const results = [];
                if (statusConfig[item?.status]?.label) results?.push(`Health Check: ${statusConfig[item?.status]?.label}`);
                if (item?.allergies) results?.push(`Allergies: ${item?.allergies}`);
                return results?.length > 0 ? results?.join(" | ") : 'N/A';
            }
        },
        {
            label: 'Status',
            key: (item) => statusConfig[item?.status]?.label || 'N/A'
        },
    ];

    const handleImportRow = async (row) => {
        const payload = {
            employee_id: row['Employee Name'],      // likely needs mapping from employee name → ID
            department_id: row['Department Name'], // likely needs mapping from department name → ID
            last_checkup_date: row['Last Check Date'],
            checkup_result: row['Last Check Results'],
            status: row['Status'], // should map back to valid status key (not label)
        };
        // return dispatch(createNewEmployeeHealth(payload));
    };

    const dummyData = Array.from({ length: 7 }, (_, i) => ({
        employee: {
            id: i,
            first_name: "",
            last_name: "",
            department: { department_name: "" },
            last_checkup_date: '',
            allergies: "",
            status: "",
        }
    }));

    const ListData = (empHealthLoading && !showMoreLess) ? dummyData : empHealthList;

    return (
        <div className="employeeHealthListMain">
            <div className="employee-dashboard-list empHealthListMain">
                <div className="dashboard-sticky-header">
                    <header className="top-header">
                        <div className="header-left">
                            {/* <button className="header-icon-btn"><img src={userlistsvg} /></button> */}
                            <div>
                                <h1>All Employee Health List
                                    <span className="total-count"> <TrendingUp size={16} className="TrendingUp" />
                                        {metaData?.all}</span>
                                </h1>
                                <p>See All Employee Health Details Below</p>
                            </div>
                        </div>
                        <div className="header-right header_rightMain">
                            <div className="toolbar">
                                <SearchBox
                                    onSearch={handleSearch}
                                    placeholder="Search Employee..."
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
                                title='Add New Employee Health'
                                placement="top" arrow={true}
                            >
                                <button className="add-employee-btn" onClick={() => navigate('/add-new-employee-health')}><UserPlus size={16} /> </button>
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
                                            data={empHealthList}
                                            headers={exportHeaders}
                                            filename="Employee Health.csv"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>
                </div>
                <main className={`dashboard-content`} >
                    <>
                        <aside className="filters-sidebar">
                            <div>
                                <ul>
                                    {empHealthStatusOptions?.map(status => {
                                        const Icon = status?.icon || SquareMenu; // Fallback icon
                                        let count = 0;
                                        if (status?.label === "All") {
                                            count = metaData?.all ?? 0;
                                        } else {
                                            count = metaData?.[status?.label.toLowerCase().replace(" ", "")] ?? 0;
                                        }
                                        return (
                                            <li key={status?.id} className={statusFilter === status?.id ? "active" : ""} onClick={() => handleStatusFilter(status?.id)}>
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
                                <table className="employee-table emp-t-5">
                                    <thead>
                                        <tr>
                                            <th>Employee Name</th>
                                            <th>Department Name</th>
                                            <th>Last Check Date</th>
                                            <th>Last Check Results</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    {/* // ❗ 3 new loding */}
                                    {(empHealthLoading || empHealthList?.length > 0) ? (
                                        <>
                                            <tbody className={`${empHealthLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                                {ListData?.map(item => {
                                                    const StatusIcon = statusConfig[item?.status]?.icon || XCircle;
                                                    const statusClassName = statusConfig[item?.status]?.className;
                                                    return (
                                                        <tr
                                                            key={item?.id}
                                                            className="employee-row"
                                                            onClick={() => navigate(`/employee-health-details/${item?.id}`)}
                                                        >
                                                            <td>
                                                                <div className="loadingtd  Semi_Bold department">{[item?.employee?.first_name, item?.employee?.last_name].filter(Boolean).join(" ")}</div>
                                                            </td>
                                                            <td>
                                                                <div className="loadingtd department">{item?.department?.department_name}</div>
                                                            </td>
                                                            <td>
                                                                <div className="loadingtd department">{formatDate(item?.last_checkup_date)}</div>
                                                            </td>
                                                            <td className="td ">
                                                                <div className="contact-info loadingtd">
                                                                    <div><span>Health Check: {statusConfig[item?.status]?.label}</span></div>
                                                                    {item?.allergies && <div className="loadingtd Bold gap_2"><span className="phone">Allergies: {item?.allergies}</span></div>}
                                                                </div>
                                                            </td>
                                                            <td className="loadingtd ">
                                                                <div className={`status-badge ${statusClassName}`}>
                                                                    <StatusIcon size={16} />
                                                                    <span>{statusConfig[item?.status]?.label}</span>
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
                                                <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                                                    {(!empHealthLoading && empHealthList?.length === 0) && (
                                                        <ListDataNotFound module="employee health" handleReset={resetFilters} />
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    )}
                                </table>
                                {(!empHealthLoading || showMoreLess) &&
                                    <div className="load-more-container">
                                        {/* Show More button if not all jobs loaded */}
                                        {(visibleCount < totalEmpHealths) && (
                                            <button onClick={handleLoadMore} className="load-more-btn">
                                                {(empHealthLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                            </button>
                                        )}
                                        {/* Show Less button if all jobs are loaded */}
                                        {(visibleCount >= totalEmpHealths && totalEmpHealths > INITIAL_VISIBLE_COUNT) && (
                                            <button onClick={handleShowLess} className="load-more-btn">
                                                {(empHealthLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                            </button>
                                        )}
                                    </div>
                                }
                            </div>
                        )}
                    </>
                </main>
            </div >
        </div>
    );
};

export default EmployeeHealthList;