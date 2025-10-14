import React, { useState, useEffect, useRef, useCallback } from "react";
// UPDATED: Added new icons
import { List, MoreVertical, XCircle, TrendingUp, UserPlus, X, Download, Upload } from "lucide-react";
import '../../EmployeeOnboarding/EmployeeList/EmployeeList.scss'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import DynamicFilter from "../../../utils/common/DynamicFilter.jsx";
import SortFilter from "../../../utils/common/SortFilter.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import { userStatusOption } from "../../../utils/Constant.js";
import './UsersList.scss'
import ConfirmPopup from "../../../utils/common/ConfirmPopup.jsx";
import { getUserList, uerLoginEnableDisable } from "../../../Redux/Actions/Settings/userAction.js";
import defaultImage from "../../../assets/default-user.png";
import ExportList from "../../../utils/common/Export/ExportList.jsx";
import ImportList from "../../../utils/common/Import/ImportList.jsx";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";

const INITIAL_VISIBLE_COUNT = 9;

export const UsersList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Data from redux 
    const userData = useSelector((state) => state?.userList);
    const userList = userData?.data?.result || [];
    const totalUser = userData?.data?.count || 0;
    const userLoading = userData?.loading || false;
    const metaData = userData?.data?.metadata || {};
    const logindata = useSelector((state) => state?.userLogin);
    const loginLoading = logindata?.loading || false;

    const statusConfig = userStatusOption?.reduce((acc, status) => {
        // ✅ Skip only if ID is null or undefined — not 0
        if (status?.id === undefined || status?.id === null) return acc;

        const label = status?.label || "All";
        const icon = status.icon;

        acc[status.id] = {
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
    const [sortBy, setSortBy] = useState("recent");
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [view, setView] = useState('list');
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [open, setOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [confirmPopupType, setConfirmPopupType] = useState("disable")
    const [employId, setEmployId] = useState(false)
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

    const fetchUserList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");
            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
                employee_status: 1,
                ...(statusFilter !== "All" && { is_disabled: statusFilter }),
                ...(departmentFilter && departmentFilter !== "All" && { department_id: departmentFilter }),
                ...(searchTerm && { search: searchTerm }),
                ...(sortBy && { sort_by: sortBy }), // backend should handle sort
            };
            const res = await dispatch(getUserList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching user list:", error);
            setShowMoreLess(false);
        }
    }, [searchTerm, statusFilter, departmentFilter, sortBy, visibleCount]);

    useEffect(() => {
        fetchUserList();
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

    const clearFilters = () => {
        setStatusFilter("All");
        setDepartmentFilter("All");
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

    const handleConfirmDelete = () => {
        if (!employId) return;
        const sendData = { user_id: employId };
        dispatch(uerLoginEnableDisable(sendData))
            .then((res) => {
                if (res?.success) {
                    fetchUserList()
                    setShowModal(false);
                    setEmployId(null);
                }
            })
            .catch((error) => {
                console.error("Error updating login", error);
                setShowMoreLess(false);
            })
    };

    const handleCheckbox = (id) => {
        if (id) {
            const user = userList?.find(user => user.id === id);
            if (user) {
                const isDisabled = parseInt(user?.is_disabled) === 1;
                setConfirmPopupType(isDisabled ? "disable" : "enable");
                setShowModal(true);
                setEmployId(id);
            }
        }
    };

    const handleExport = [
        {
            label: "User",
            key: (emp) =>
                emp?.employee?.display_name ||
                [emp?.employee?.first_name, emp?.employee?.last_name].filter(Boolean).join(" ") ||
                "",
        },
        {
            label: "Email",
            key: (emp) => emp?.employee?.email || "",
        },
        {
            label: "Role",
            key: (emp) => row?.role_id === 1 ? "Employee" : row?.role_id === 2 ? "Admin" : "", // adjust based on your data
        },
        // {
        //     label: "Admin Login",
        //     key: (emp) =>
        //         emp?.employee?.is_disabled === 1 ? "Login Enabled" : "Login Disabled",
        // },
        {
            label: "Login",
            key: (emp) => statusConfig[emp?.is_disabled]?.label || "N/A",
        },
    ];

    const handleImport = (row) => {
        return {
            employee: {
                display_name: row?.User || "",
                first_name: row?.User?.split(" ")?.[0] || "",
                last_name: row?.User?.split(" ")?.slice(1).join(" ") || "",
                email: row?.Email || "",
                is_disabled: row?.["Admin Login"] === "Login Enabled" ? 0 : 1,
                employee_status:
                    Object.keys(statusConfig).find(
                        (key) => statusConfig[key]?.label === row?.Status
                    ) || "",
            },
            role_id: {
                name: row?.role_id === 1 ? "Employee" : row?.role_id === 2 ? "Admin" : "",
            },
        };
    };
    const dummData = Array.from({ length: 7 }, (_, i) => ({
    }));

    const ListData = (userLoading && !showMoreLess) ? dummData : userList;

    return (
        <div className="usersListMain">
            <div className="employee-dashboard-list empListMain">
                <div className="dashboard-sticky-header">
                    <header className="top-header">
                        <div className="header-left">
                            {/* <button className="header-icon-btn"><img src={userlistsvg} /></button> */}
                            <div>
                                <h1>All Users List
                                    <span className="total-count"> <TrendingUp size={16} className="TrendingUp" />
                                        {metaData?.all}</span>
                                </h1>
                                <p>Complete List Of Available Users</p>
                            </div>
                        </div>

                        <div className="header-right header_rightMain">
                            <div className="toolbar">
                                <SearchBox
                                    onSearch={handleSearch}
                                    placeholder="Search User..."
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
                            <button className="add-employee-btn" onClick={() => navigate('/settings/assign-role')}><UserPlus size={16} /> </button>

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
                                            <ImportList
                                                apiFunction={handleImport}
                                                onImportSuccess={() => {
                                                    // fetchDepartmentList();
                                                    setOpen(false);
                                                }}
                                            />
                                            <ExportList
                                                data={userList}
                                                headers={handleExport}
                                                filename="user.csv"
                                            />
                                        </div>
                                    )}
                                </div>
                            </Tooltips>
                        </div>
                    </header>
                </div>
                <main className="dashboard-content">
                    <>
                        <aside className="filters-sidebar">
                            <div>
                                <ul>
                                    {userStatusOption?.map((status, index) => {
                                        const Icon = statusConfig[status?.id]?.icon || List; // Fallback icon
                                        let count = 0;
                                        if (status?.label === "All") {
                                            count = metaData?.all ?? 0;
                                        } else {
                                            count = metaData?.[status?.label?.split(" ")[1]?.toLowerCase()] ?? 0;
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
                                    {(departmentFilter !== 'All') && (
                                        <button className="clear-filters-btn" onClick={clearFilters}>
                                            <span>
                                                Clear filters
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
                                        <th>USERS</th>
                                        <th>ROLE</th>
                                        {/* <th>ADMIN LOGIN</th> */}
                                        <th>LOGIN</th>
                                    </tr>
                                </thead>
                                {(userLoading || userList?.length > 0) ? (
                                    <tbody className={`${(userLoading && !showMoreLess) ? 'LoadingList' : ''}`}>
                                        {
                                            ListData?.map((emp, i) => {
                                                const StatusIcon = statusConfig[emp?.is_disabled]?.icon || XCircle;
                                                const statusClassName = statusConfig[emp?.is_disabled]?.className;
                                                return (
                                                    <tr
                                                        key={emp?.id}
                                                        className="employee-row"
                                                        onClick={() => navigate(`/settings/user-details/${emp?.id}`)}
                                                    >
                                                        <td className="smalltd">
                                                            <div className="info_img">
                                                                <div className="loadingImg">
                                                                    <img src={employeeImage(emp?.employee?.image)} alt={emp?.employee?.display_name || [emp?.employee?.first_name, emp?.employee?.last_name].filter(Boolean).join(" ") || ""} className="avatar" />
                                                                </div>
                                                                <div className="userListDet">
                                                                    <div className="name loadingtdTOP">{emp?.employee?.display_name || [emp?.employee?.first_name, emp?.employee?.last_name].filter(Boolean).join(" ") || ""}</div>
                                                                    <div className="emailS loadingtdBOTTOM">{emp?.employee?.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="role loadingtd">{emp?.role_id === 1 ? "Employee" : emp?.role_id === 2 ? "Admin" : ""}</div>
                                                        </td>
                                                        {/* <td className="loadingtd">
                                                            <div className="address-container">
                                                                <p>{emp?.employee?.is_disabled === 1 ? "Login Enabled" : "Login Disabled"}</p>
                                                            </div>
                                                        </td> */}
                                                        <td className="loadingtd">
                                                            <div style={{ width: "175px" }} className={`status-badge ${statusClassName}`}>
                                                                <StatusIcon size={16} />
                                                                <span>{statusConfig[emp?.is_disabled]?.label}</span>
                                                                {/* <span>{emp?.employee?.is_disabled === 0 ? "Login Disabled" : "Login Enabled"}</span> */}
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
                                                {(!userLoading && userList?.length === 0) && (
                                                    <ListDataNotFound module="users" handleReset={resetFilters} />
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>

                            {(!userLoading || showMoreLess) &&
                                <div className="load-more-container">
                                    {/* Show More button if not all employee loaded */}
                                    {(visibleCount < totalUser) && (
                                        <button onClick={handleLoadMore} className="load-more-btn">
                                            {(userLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                        </button>
                                    )}
                                    {/* Show Less button if all employee are loaded */}
                                    {(visibleCount >= totalUser && totalUser > INITIAL_VISIBLE_COUNT) && (
                                        <button onClick={handleShowLess} className="load-more-btn">
                                            {(userLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                        </button>
                                    )}
                                </div>
                            }
                        </div>
                    </>
                </main>
            </div>

            <ConfirmPopup
                open={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmDelete}
                type={confirmPopupType}
                loading={loginLoading}
            />
        </div>
    )
}
