import React, { useState, useEffect, useRef, useCallback } from "react";
// UPDATED: Added new icons
import { List, Mail, Phone, MoreVertical, XCircle, TrendingUp, UserPlus, Warehouse, Grid2x2, X, Download, Upload, SquareMenu } from "lucide-react";
import "./EmployeeList.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import { getEmployeeList, importEmployees } from "../../../Redux/Actions/employeeActions.js";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import DynamicFilter from "../../../utils/common/DynamicFilter.jsx";
import SortFilter from "../../../utils/common/SortFilter.jsx";
import DynamicLoader from "../../../utils/common/DynamicLoader/DynamicLoader.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import { employeeStatusOptions } from "../../../utils/Constant.js";
import defaultImage from "../../../assets/default-user.png";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import ImportList from "../../../utils/common/Import/ImportList.jsx";
import ExportList from "../../../utils/common/Export/ExportList.jsx";
const INITIAL_VISIBLE_COUNT = 9;

const EmployeeList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Data from redux
    const employeeData = useSelector((state) => state?.employeeList);
    const employeeList = employeeData?.data?.result || [];
    const totalEmployees = employeeData?.data?.count || 0;
    const employeeLoading = employeeData?.loading || false;
    const metaData = employeeData?.data?.metadata || {};

    const importEmp = useSelector((state) => state?.importEmpData);

    // const statusOptions = [
    //     { id: "All", label: "All" }, // default option
    //     ...(emp_status?.map((item) => ({
    //         id: item?.labelid,
    //         label: item?.label,
    //     })) || [])
    // ];

    const statusConfig = employeeStatusOptions?.reduce((acc, status) => {
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

    const fetchEmployeeList = useCallback(async () => {
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
            const res = await dispatch(getEmployeeList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching employee list:", error);
            setShowMoreLess(false);
        }
    }, [searchTerm, statusFilter, departmentFilter, sortBy, visibleCount]);

    useEffect(() => {
        fetchEmployeeList();
    }, [searchTerm, statusFilter, departmentFilter, sortBy, visibleCount]);

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setDepartmentFilter("All");
        setSortBy("recent");
        setShowMoreLess(false);
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

    const employeeImage = (img) => img
        ? (() => {
            try {
                return JSON.parse(img);
            } catch {
                return img;
            }
        })()
        : defaultImage;

    const employeeExportHeaders = [
        {
            label: "Employee",
            key: (emp) =>
                emp?.employee?.display_name ||
                [emp?.employee?.first_name, emp?.employee?.last_name].filter(Boolean).join(" ") ||
                "N/A",
        },
        {
            label: "Department",
            key: (emp) => emp?.employee?.department?.department_name || "N/A",
        },
        {
            label: "Email",
            key: (emp) => emp?.employee?.email || "N/A",
        },
        {
            label: "Mobile No",
            key: (emp) => emp?.employee?.mobile_no || "N/A",
        },
        {
            label: "Status",
            key: (emp) =>
                statusConfig[emp?.employee?.employee_status]?.label || "N/A",
        },
    ];

    // const handleEmployeeImportRow = (row) => {
    //     return {
    //         employee: {
    //             display_name: row?.Employee || "",
    //             first_name: row?.Employee?.split(" ")?.[0] || "",
    //             last_name: row?.Employee?.split(" ")?.slice(1).join(" ") || "",
    //             department: { department_name: row?.Department || "" },
    //             email: row?.Email || "",
    //             mobile_no: row?.["Mobile No"] || "",
    //             employee_status:
    //                 Object.keys(statusConfig).find(
    //                     (key) => statusConfig[key]?.label === row?.Status
    //                 ) || "",
    //         },
    //     };
    // };

    const handleEmployeeImport = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        // dispatch redux action
        await dispatch(importEmployees(file))
            .then((res) => {
                if (res?.status) {
                    // close popup after success
                    fetchEmployeeList();
                    setOpen(false);
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });

    };


    // ❗ 1 new loding
    // ✅ Table ke hisaab se dummy loading rows
    const dummData = Array.from({ length: 7 }, (_, i) => ({
        employee: {
            id: i,
            display_name: "",
            department: { department_name: "" },
            email: "aa",
            mobile_no: "99",
            employee_status: "",
            image: null,
        }
    }));


    const ListData = (employeeLoading && (!showMoreLess || employeeList?.length === 0)) ? dummData : employeeList;

    return (
        <div className="employee-dashboard-list empListMain">
            <div className="dashboard-sticky-header">
                <header className="top-header">
                    <div className="header-left">
                        {/* <button className="header-icon-btn"><img src={userlistsvg} /></button> */}
                        <div>
                            <h1>All Employee List
                                <span className="total-count"> <TrendingUp size={16} className="TrendingUp" />
                                    {metaData?.all}</span>
                            </h1>
                            <p>See Employees All Details Below</p>
                        </div>
                    </div>
                    <div className="header-right header_rightMain">
                        <div className="toolbar">
                            <SearchBox
                                onSearcho={handleSearch}
                                placeholder="Search Employee..."
                                ref={searchBoxRef}
                            />
                            <div className="toolbar-actions">
                                <div className="view-toggle">
                                    <Tooltips
                                        title='Table View'
                                        placement="top" arrow={true}
                                    >
                                        <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}><List size={20} /></button>
                                    </Tooltips>
                                    <Tooltips
                                        title='Card View'
                                        placement="top" arrow={true}
                                    >
                                        <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}><Grid2x2 size={20} strokeWidth={1.5} /></button>
                                    </Tooltips>
                                </div>
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
                        {/* <DatePicker /> */}
                        <Tooltips
                            title='Add New Employee'
                            placement="top" arrow={true}
                        >
                            <button className="add-employee-btn" onClick={() => navigate('/add-employee')}><UserPlus size={16} /> </button>
                        </Tooltips>

                        <Tooltips
                            title='Import & Export'
                            placement="top" arrow={true}
                        >
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
                                        <ImportList onFileSelect={handleEmployeeImport} loading={importEmp?.loading} />
                                        <ExportList
                                            data={employeeList}
                                            headers={employeeExportHeaders}
                                            filename="employees.csv"
                                        />
                                    </div>
                                )}
                            </div>
                        </Tooltips>
                    </div>
                </header>
            </div>


            <main className={`dashboard-content`} >
                <aside className="filters-sidebar">
                    <div>
                        <ul>
                            {employeeStatusOptions?.map((status, index) => {
                                const Icon = statusConfig[status?.id]?.icon || SquareMenu; // Fallback icon
                                let count = 0;
                                if (status?.label === "All") {
                                    count = metaData?.all ?? 0;
                                } else {
                                    count = metaData?.[status?.label.toLowerCase().replace(" ", "")] ?? 0;
                                }
                                return (
                                    <li key={index} className={statusFilter == status?.id ? "active" : ""} onClick={() => handleStatusFilter(status?.id)}>
                                        {/* UPDATED: Grouped icon and text */}
                                        <div className="status-label">
                                            <Icon size={16} strokeWidth={1.5} />
                                            <span>{status?.label}</span>
                                        </div>
                                        <span className="counts">({String(count).padStart(2, '0')})</span>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="clearBTN">
                            {(statusFilter !== 'All' || departmentFilter !== 'All') && (
                                (!employeeLoading && !showMoreLess) &&

                                <button className="clear-filters-btn" onClick={resetFilters}>
                                    <span>
                                        Clear filter
                                    </span>
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="sidebar-stats-box">
                        {/* Top 5 Avatars */}
                        <div className="avatars">
                            {employeeList?.slice(0, 7)?.map((emp, idx) => {

                                return (
                                    <img key={idx} src={employeeImage(emp?.employee?.image)} alt={emp?.employee?.display_name || [emp?.employee?.first_name, emp?.employee?.last_name].filter(Boolean).join(" ") || "-"} />
                                )
                            })}
                        </div>
                        {/* Total Employees */}
                        <div className="stats-row">
                            <span>Total Employees</span>
                            <span className="count blue">{metaData?.all}</span>
                        </div>

                        {/* Remote / In Office Counts */}
                        <div className="stats-row two-cols">
                            <div>
                                <span className="label">Remote</span>
                                <span className="count green mt-5">
                                    {metaData?.remote}
                                </span>
                            </div>
                            <div>
                                <span className="label">In office</span>
                                <span className="count green mt-5">
                                    {metaData?.onsite}
                                </span>
                            </div>
                        </div>

                        <div className="dashed-line"></div>

                        {/* Total Designations */}
                        <div className="stats-row">
                            <span>Total Designation</span>
                            <span className="count orange">
                                {metaData?.designation}
                            </span>
                        </div>

                        {/* Total Departments */}
                        <div className="stats-row">
                            <span>Total Department</span>
                            <span className="count green">
                                {metaData?.department}
                            </span>
                        </div>
                    </div>
                </aside>

                {view === 'list' && (
                    <div className="employee-table-wrapper">
                        <table className="employee-table emp-t-4">
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Department</th>
                                    <th>Contacts</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            {/* // ❗ 3 new loding */}
                            {(employeeLoading || employeeList?.length > 0) ? (
                                <tbody className={`${employeeLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                    {ListData?.map(emp => {
                                        const StatusIcon = statusConfig[emp?.employee?.employee_status]?.icon || XCircle;
                                        const statusClassName = statusConfig[emp?.employee?.employee_status]?.className;
                                        return (
                                            <tr
                                                key={emp?.id}
                                                className="employee-row"
                                                onClick={() => navigate(`/employee-details/${emp?.id}`)}
                                            >
                                                <td className="td">

                                                    <>
                                                        <div className="info_img">
                                                            <div className="loadingImg">
                                                                <img src={employeeImage(emp?.employee?.image)} alt={emp?.employee?.display_name || [emp?.employee?.first_name, emp?.employee?.last_name].filter(Boolean).join(" ") || "-"} className="avatar" />
                                                            </div>
                                                            <div className="name loadingtdsmall Semi_Bold ">{emp?.employee?.display_name || [emp?.employee?.first_name, emp?.employee?.last_name].filter(Boolean).join(" ") || "-"}</div>
                                                        </div>
                                                    </>

                                                </td>
                                                <td>
                                                    <div className="department loadingtd">{emp?.employee?.department?.department_name}</div>
                                                </td>
                                                <td className="td">
                                                    <div className="contact-info ">
                                                        <div className="loadingtdTOP"><Mail size={14} /> <span>{emp?.employee?.email}</span></div>
                                                        {emp?.employee?.mobile_no && <div className="loadingtdBOTTOM "><Phone size={14} />
                                                            <span className="phone Bold">{emp?.employee?.mobile_no}</span></div>}
                                                    </div>
                                                </td>
                                                <td className="loadingtd ">
                                                    <div className={`status-badge ${statusClassName}`}>
                                                        <StatusIcon size={16} />
                                                        <span>{statusConfig[emp?.employee?.employee_status]?.label}</span>
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
                                            {(!employeeLoading && employeeList?.length === 0) && (
                                                <ListDataNotFound module="employees" handleReset={resetFilters} />
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                        {(!employeeLoading || showMoreLess) &&

                            <div className="load-more-container">
                                {/* Show More button if not all employee loaded */}
                                {(visibleCount < totalEmployees) && (
                                    <button onClick={handleLoadMore} className="load-more-btn">
                                        {(employeeLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                    </button>
                                )}
                                {/* Show Less button if all employee are loaded */}
                                {(visibleCount >= totalEmployees && totalEmployees > INITIAL_VISIBLE_COUNT) && (
                                    <button onClick={handleShowLess} className="load-more-btn">
                                        {(employeeLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                    </button>
                                )}
                            </div>
                        }
                    </div>
                )}

                <div className="content_box_auto">
                    {view === 'grid' &&
                        <div className="grid_cards">
                            {employeeList?.length > 0 ? (
                                <section className={`employee-list-section ${view}-view`}>
                                    {
                                        employeeList?.map(emp => {
                                            const StatusIcon = statusConfig[emp?.employee?.employee_status]?.icon || XCircle;
                                            const statusClassName = statusConfig[emp?.employee?.employee_status]?.className;
                                            return (
                                                <div key={emp?.id} className="employee-card" onClick={() => navigate(`/employee-details/${emp?.id}`)}>
                                                    <div className="top_info">
                                                        <div className="employee-info info_img">
                                                            <img src={employeeImage(emp?.employee?.image)} alt={emp?.employee?.display_name || [emp?.employee?.first_name, emp?.employee?.last_name].filter(Boolean).join(" ") || "-"} className="avatar" />
                                                        </div>
                                                        <div className="employee-info">
                                                            <div className="name">{emp?.employee?.display_name || [emp?.employee?.first_name, emp?.employee?.last_name].filter(Boolean).join(" ") || "-"}</div>
                                                            <div className={`status-badge ${statusClassName}`}>
                                                                <StatusIcon size={16} />
                                                                <span>{statusConfig[emp?.employee?.employee_status]?.label}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="contact-info">
                                                        <div className=""><Warehouse size={16} strokeWidth={1.5} />{emp?.employee?.department?.department_name}</div>
                                                        <div><Mail size={16} strokeWidth={1.5} /> <span>{emp?.employee?.email}</span></div>
                                                        <div><Phone size={16} strokeWidth={1.5} /> <span className="phone">{emp?.employee?.mobile_no}</span></div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                </section>
                            ) : (
                                <>
                                    {(!employeeLoading && employeeList?.length === 0) && (
                                        <ListDataNotFound module="employees" handleReset={resetFilters} />
                                    )}
                                </>
                            )}
                            {employeeLoading && employeeList?.length === 0 &&
                                <div className="load-more-container">
                                    {/* Show More button if not all employees loaded */}
                                    {(visibleCount < totalEmployees) && (
                                        <button onClick={handleLoadMore} className="load-more-btn">
                                            {(employeeLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}

                                        </button>
                                    )}
                                    {/* Show Less button if all employee are loaded */}
                                    {(visibleCount >= totalEmployees && totalEmployees > INITIAL_VISIBLE_COUNT) && (
                                        <button onClick={handleShowLess} className="load-more-btn">
                                            {(employeeLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                        </button>
                                    )}
                                </div>
                            }
                        </div>
                    }
                </div>
            </main>
        </div>
    );
};

export default EmployeeList;
