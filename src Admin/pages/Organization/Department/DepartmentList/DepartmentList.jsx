import { useState, useEffect, useRef, useCallback } from "react";
// UPDATED: Added new icons
import { MoreVertical, TrendingUp, UserPlus, Frame, X, SquareMenu, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDepartmentList } from "../../../../Redux/Actions/departmentActions.js";
import SearchBox from "../../../../utils/common/SearchBox.jsx";
import SortFilter from "../../../../utils/common/SortFilter.jsx";
import Tooltips from "../../../../utils/common/Tooltip/Tooltips.jsx";
import LoadingDots from "../../../../utils/common/LoadingDots/LoadingDots.jsx";
import ExportList from "../../../../utils/common/Export/ExportList.jsx";
import ImportList from "../../../../utils/common/Import/ImportList.jsx";
import { departmentStatusOptions } from "../../../../utils/Constant.js";
import ListDataNotFound from "../../../../utils/common/ListDataNotFound.jsx";
const INITIAL_VISIBLE_COUNT = 9;

const DepartmentList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux 
    const departmentData = useSelector((state) => state?.departmentList);
    const departmentList = departmentData?.data?.department || [];
    const totalDepartments = departmentData?.data?.count || 0;
    const metaData = departmentData?.data?.metadata || {};
    const departmentLoading = departmentData?.loading || false;
    // const departmentLoading = true;

    const allDepartmentData = useSelector((state) => state?.allDepartments);
    const allDepartmentList = allDepartmentData?.data?.department || [];

    // ✅ (id + name)
    // const parentDepartments = [
    //     { value: "All", label: "All" },
    //     ...Array.from(
    //         new Map(
    //             allDepartmentList?.filter(d => d?.parent_department)?.map(d => [
    //                 d?.parent_department?.id, // 
    //                 { value: d?.parent_department?.id, label: d?.parent_department?.department_name }
    //             ])
    //         ).values()
    //     )
    // ];

    const statusConfig = departmentStatusOptions?.reduce((acc, status) => {
        if (!status?.id) return acc; // skip undefined values
        const label = status?.label || "All";
        const icon = status.icon || SquareMenu; // fallback to Users if no mapping exists
        acc[status?.id] = {
            icon,
            label,
            className: label.replace(/\s+/g, "-").toLowerCase()
        };
        return acc;
    }, {});

    const [searchTerm, setSearchTerm] = useState("");
    const searchBoxRef = useRef();
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("recent");
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [view, setView] = useState('list');
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [open, setOpen] = useState(false);
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

    const fetchDepartmentList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");
            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(sortBy && { sort_by: sortBy }),
                ...(searchTerm && { search: searchTerm }),
            };
            await dispatch(getDepartmentList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching department list", error);
            setShowMoreLess(false);
        }
    }, [dispatch, searchTerm, statusFilter, sortBy, visibleCount, currentPage]);

    useEffect(() => {
        fetchDepartmentList();
    }, [fetchDepartmentList]);

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setSortBy("recent");
        setShowMoreLess(false);
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();
        }
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
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    // const departmentsList = ["All", ...new Set(allDepartment.map(d => d.department))];
    // const departmentOptions = departments?.map(d => ({ value: d, label: d === 'All' ? 'All Departments' : d }));

    const departmentExportHeaders = [
        { label: "Department Name", key: (item) => item?.department_name || "N/A" },
        { label: "Parent Department", key: (item) => item?.parent_department?.department_name || "N/A" },
        { label: "Department Head", key: (item) => [item?.department_head?.first_name, item?.department_head?.last_name]?.filter(Boolean)?.join(" ") || "N/A" },
        { label: "Status", key: (item) => statusConfig[item?.status]?.label || "N/A" },
    ];

    const handleDepartmentImportRow = async (row) => {
        const payload = {
            department_name: row["Department Name"] || "",
            parent_department_id: row["Parent Department"] || "",  // might need to resolve to ID
            department_head_id: row["Department Head"] || "",      // might need to resolve to ID
            status: row['Status'],
        };

        // Example: dispatch to create department
        // return dispatch(createNewDepartment(payload));
        //   return payload; // if you just want the transformed data
    };

    // ❗ 1 new loding
    // ✅ Table ke hisaab se dummy loading rows
    const dummyData = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        department_name: "",
        department_head: { first_name: "", last_name: "" },
        parent_department: { department_name: "" },
        status: ""
    }));

    const ListData = (departmentLoading && !showMoreLess) ? dummyData : departmentList;

    return (
        <div className="employee-dashboard-list depatmentListMain">
            <div className="dashboard-sticky-header">
                <header className="top-header">
                    <div className="header-left">
                        <div>
                            <h1>Department list
                                <span className="total-count"> <TrendingUp size={16} className="TrendingUp" />
                                    {metaData?.all}</span>
                            </h1>
                            <p>See All Departments Details Below</p>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="toolbar">
                            <SearchBox
                                onSearch={handleSearch}
                                placeholder="Search Department..."
                                ref={searchBoxRef}
                            />
                            <div className="toolbar-actions">
                                <SortFilter
                                    sortBy={sortBy}
                                    onChange={handleSortChange}
                                />
                            </div>
                        </div>
                        <Tooltips title='Add New Department' placement="top" arrow={true}>
                            <button className="add-employee-btn" onClick={() => navigate('/add-department')}><UserPlus size={16} /> </button>
                        </Tooltips>

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
                                        apiFunction={handleDepartmentImportRow}
                                        onImportSuccess={() => {
                                            // fetchDepartmentList();
                                            setOpen(false);
                                        }}
                                    />
                                    <ExportList
                                        data={departmentList}
                                        headers={departmentExportHeaders}
                                        filename="departments.csv"
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
                                {departmentStatusOptions?.map(status => {
                                    const Icon = status?.icon || SquareMenu; // fallback icon
                                    let count = 0;
                                    if (status?.label === "All") {
                                        count = metaData?.all ?? 0;
                                    } else {
                                        count = metaData?.[status?.label?.toLowerCase()?.replace(" ", "")] ?? 0;
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
                            {/* <div className="clearBTN">
                                {(statusFilter !== 'All') && (
                                    <button className="clear-filters-btn" onClick={resetFilters}>
                                        <span>Clear filter</span>
                                        <X size={14} />
                                    </button>
                                )}
                            </div> */}
                        </div>
                    </aside>
                    <div className="employee-table-wrapper">
                        <table className="employee-table emp-t-3">
                            <thead>
                                <tr>
                                    <th>Department</th>
                                    <th>Parent Department</th>
                                    <th>Department head</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            {(departmentLoading || departmentList?.length > 0) ? (
                                <>
                                    <tbody className={`${departmentLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                        {ListData?.map(dep => {
                                            const StatusIcon = statusConfig[dep?.status]?.icon || XCircle;
                                            const statusClassName = statusConfig[dep?.status]?.className;                                           
                                            return (
                                                <tr
                                                    key={dep?.id}
                                                    className="employee-row"
                                                    onClick={() => navigate(`/department-details/${dep?.id}`)}
                                                >
                                                    <td className="">
                                                        <div className="employee-info info_img loadingtd">
                                                            <div className="avatar-icon">
                                                                <Frame size={16} strokeWidth={1.5} />
                                                            </div>
                                                            <div className="name Semi_Bold">{dep?.department_name}</div>
                                                        </div>
                                                    </td>
                                                    <td className="loadingtd">
                                                        <div className=" department">{dep?.parent_department?.department_name || ''}</div>
                                                    </td>
                                                    <td className="td loadingtd" >
                                                        <div className="contact-info ">
                                                            <span>{[dep?.department_head?.first_name, dep?.department_head?.last_name].filter(Boolean).join(" ") || ''}</span>
                                                        </div>
                                                    </td>
                                                    <td className="loadingtd">
                                                        <div className={`status-badge  ${statusClassName}`}>
                                                            <StatusIcon size={16} />
                                                            <span>{statusConfig[dep?.status]?.label}</span>
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
                                            {(!departmentLoading && departmentList?.length === 0) && (
                                                <ListDataNotFound module="department" handleReset={resetFilters} />
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                        {/* {!departmentLoading && departmentList?.length === 0 && */}
                        {(!departmentLoading || showMoreLess) &&
                            <div className="load-more-container">
                                {(visibleCount < totalDepartments) && (
                                    <button onClick={handleLoadMore} className="load-more-btn">
                                        {departmentLoading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                    </button>
                                )}
                                {(visibleCount >= totalDepartments && totalDepartments > INITIAL_VISIBLE_COUNT) && (
                                    <button onClick={handleShowLess} className="load-more-btn">
                                        {departmentLoading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                    </button>
                                )}
                            </div>
                        }
                    </div>
                </>
            </main>
        </div>
    );
};

export default DepartmentList;