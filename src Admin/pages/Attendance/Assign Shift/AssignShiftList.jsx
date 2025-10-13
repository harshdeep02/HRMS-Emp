import { useState, useEffect, useRef, useCallback } from "react";
// UPDATED: Added new icons
import { Aperture, List, Moon, MoreVertical, Sun, TrendingUp, UserPlus, X, XCircle } from "lucide-react";
import "../../EmployeeOnboarding/EmployeeList/EmployeeList.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DynamicFilter from "../../../utils/common/DynamicFilter.jsx";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import { getAssignShiftList } from "../../../Redux/Actions/shiftActions.js";
import './AssignShiftList.scss'
import ImportList from "../../../utils/common/Import/ImportList.jsx";
import ExportList from "../../../utils/common/Export/ExportList.jsx";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import { formatDate } from "../../../utils/common/DateTimeFormat.js";
import defaultImage from "../../../assets/default-user.png";

const INITIAL_VISIBLE_COUNT = 8;

export const AssignShiftList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Data from redux
    const assignShiftData = useSelector((state) => state?.assignShiftList);
    const assignShiftList = assignShiftData?.data?.data;
    const assignShiftLoading = assignShiftData?.loading || false;
    const totalAssignShift = assignShiftData?.data?.count || 0;
    const metaData = assignShiftData?.data?.metadata || {};
    const shiftsOptions = assignShiftData?.data?.shifts || [];

    // ✅ function to choose icon based on label text
    const getIconForLabel = (label = "") => {
        const lower = label.toLowerCase();

        if (lower.includes("general")) return Aperture;
        if (lower.includes("afternoon") || lower.includes("morning")) return Sun;
        if (lower.includes("night")) return Moon;

        return List; // default
    };

    const statusConfig = shiftsOptions?.reduce((acc, status) => {
        if (!status?.id) return acc;

        const label = status?.label || "All";
        const icon = getIconForLabel(label);

        acc[status?.id] = {
            label,
            icon,
            className: label.replace(/\s+/g, "-").toLowerCase(),
        };

        return acc;
    }, {});


    const [searchTerm, setSearchTerm] = useState("");
    const searchBoxRef = useRef();
    const [statusFilter, setStatusFilter] = useState("All");
    const [departmentFilter, setDepartmentFilter] = useState("All");
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

    const fetchAssignShiftList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");

            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
                ...(statusFilter && statusFilter !== "All" && { shift_id: statusFilter }),
                ...(departmentFilter && departmentFilter !== "All" && { department_id: departmentFilter }),
                ...(searchTerm && { search: searchTerm }),
            };
            const res = await dispatch(getAssignShiftList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching Assign Shift list:", error);
            setShowMoreLess(false);
        }
    }, [searchTerm, statusFilter, departmentFilter, visibleCount]);

    useEffect(() => {
        fetchAssignShiftList();
    }, [searchTerm, statusFilter, departmentFilter, visibleCount]);

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setDepartmentFilter("All");
        setShowMoreLess(false);
        searchBoxRef.current?.clearInput(); // 👈 clear input field
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


    const exportHeaders = [
        { label: 'Employee Name', key: (item) => item?.employee?.first_name + " " + [item?.employee?.first_name, item?.employee?.last_name].filter(Boolean).join(" ") || 'N/A' },
        { label: 'Department', key: (item) => item?.department?.name || 'N/A' },
        { label: 'Date', key: (item) => formatDate(item?.date) || 'N/A' },
        { label: 'Shift', key: (item) => item?.shift?.name || 'N/A' },
    ];

    const handleImportRow = async (row) => {

        const payload = {

        };
        return dispatch(createNewDepartment(payload));
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


    const ListData = (assignShiftLoading && (!showMoreLess || assignShiftList?.length === 0)) ? dummData : assignShiftList;

    return (
        <div className="assignShiftMain">

            <div className="employee-dashboard-list designationListMain">
                <div className="dashboard-sticky-header">
                    <header className="top-header">
                        <div className="header-left">
                            {/* <button className="header-icon-btn">
                                    <Warehouse size={30} strokeWidth={1.5} />
                                </button> */}
                            <div>
                                <h1>Daily Scheduling List
                                    <span className="total-count"> <TrendingUp size={16} className="TrendingUp" />
                                        {metaData?.count}</span>
                                </h1>
                                <p>See All Daily Scheduling List Below</p>
                            </div>
                        </div>
                        <div className="header-right">
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
                                </div>
                            </div>
                            <Tooltips
                                title='Assign Shift'
                                placement="top" arrow={true}
                            >
                                <button className="add-employee-btn" onClick={() => navigate('/assign-shift')}><UserPlus size={16} /> </button>
                            </Tooltips>
                            {/* <button className="menu-btn"><MoreVertical size={20} /></button> */}

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
                                                fetchDepartmentList();
                                                setOpen(false);
                                            }}
                                        />
                                        <ExportList
                                            data={assignShiftList}
                                            headers={exportHeaders}
                                            filename="assign shift.csv"
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
                                    {shiftsOptions?.map((status, index) => {
                                        const Icon = statusConfig[status?.id]?.icon || List; // Fallback icon
                                        return (
                                            <li key={index} className={statusFilter == status?.id ? "active" : ""} onClick={() => handleStatusFilter(status?.id)}>
                                                {/* UPDATED: Grouped icon and text */}
                                                <div className="status-label">
                                                    <Icon size={16} strokeWidth={1.5} />
                                                    <span>{status?.label}</span>
                                                </div>
                                                <span className="counts">({String(status?.count).padStart(2, '0')})</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <div className="clearBTN">
                                    {(statusFilter !== 'All' || departmentFilter !== 'All') && (
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
                        <div className="employee-table-wrapper">
                            <table className="employee-table emp-t-4">
                                <thead>
                                    <tr>
                                        <th>Employee Name</th>
                                        <th>Department</th>
                                        <th>Date</th>
                                        <th>Shift</th>
                                    </tr>
                                </thead>
                                {(assignShiftLoading || assignShiftList?.length > 0) ? (
                                    <tbody className={`${assignShiftLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                        {ListData?.map(item => {
                                            return (
                                                <tr
                                                    key={item?.id}
                                                    className="employee-row"
                                                >
                                                    <td>
                                                        <div className="employee-info info_img">
                                                            <div className="avatar-icon loadingImg">
                                                                <img className="avatar" src={employeeImage(item?.employee?.image)} alt={[item?.employee?.first_name, item?.employee?.last_name].filter(Boolean).join(" ")} />
                                                            </div>
                                                            <div className="name loadingtdsmall Semi_Bold">{[item?.employee?.first_name, item?.employee?.last_name].filter(Boolean).join(" ")}</div>
                                                        </div>
                                                    </td>
                                                    <td className="">
                                                        <div className="loadingtd ">{item?.department?.name}</div>
                                                    </td>
                                                    <td className="">
                                                        <div className="department loadingtd">{formatDate(item?.date)}</div>
                                                    </td>
                                                    <td className="loadingtd">
                                                        <div className="department">{item?.shift?.name}</div>
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
                                                {(!assignShiftLoading && assignShiftList?.length === 0) && (
                                                    <ListDataNotFound module="assign shift" handleReset={resetFilters} />
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                            {(!assignShiftLoading || showMoreLess) &&
                                <div className="load-more-container">
                                    {/* Show More button if not all jobs loaded */}
                                    {(visibleCount < totalAssignShift) && (
                                        <button onClick={handleLoadMore} className="load-more-btn">
                                            {assignShiftLoading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                        </button>
                                    )}
                                    {/* Show Less button if all jobs are loaded */}
                                    {(visibleCount >= totalAssignShift && totalAssignShift > INITIAL_VISIBLE_COUNT) && (
                                        <button onClick={handleShowLess} className="load-more-btn">
                                            {assignShiftLoading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                        </button>
                                    )}
                                </div>
                            }
                        </div>
                    </>
                </main>

            </div>
        </div>
    )
}
