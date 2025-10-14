import React, { useState, useEffect, useRef, useCallback } from "react";
// UPDATED: Added new icons
import { List, Mail, Phone, Rows4, SquareMenu, TrendingUp, X } from "lucide-react";
import "../EmployeeOnboarding/EmployeeList/EmployeeList.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "../../utils/common/SearchBox.jsx";
import DynamicFilter from "../../utils/common/DynamicFilter.jsx";
import DynamicLoader from "../../utils/common/DynamicLoader/DynamicLoader.jsx";
import SortFilter from "../../utils/common/SortFilter.jsx";
import LoadingDots from "../../utils/common/LoadingDots/LoadingDots.jsx";
import { getEmpBirthdayList, getEmployeeList } from "../../Redux/Actions/employeeActions.js";
import { formatDate } from "../../utils/common/DateTimeFormat.js";
import { birthDayStatusOptions } from "../../utils/Constant.js";
import defaultImage from "../../assets/default-user.png";
import ListDataNotFound from "../../utils/common/ListDataNotFound.jsx";
const INITIAL_VISIBLE_COUNT = 9;

const BirthdayList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Data from redux
    const birthdayData = useSelector((state) => state?.empBirthdayList);
    const birthdayList = birthdayData?.data?.result || [];
    const totalBirthdays = birthdayData?.data?.count || 0;
    const birthdayLoading = birthdayData?.loading || false;
    // const birthdayLoading = true;
    const metaData = birthdayData?.data?.metadata || {};

    const statusConfig = birthDayStatusOptions?.reduce((acc, status) => {
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
    const getStatusById = (id) => emp_status?.find(item => item.labelid === id)?.label || '';
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

    const fetchEmpBirthdayList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");

            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
                employee_status: 1,
                ...(statusFilter && statusFilter !== "All" && { filter_by_birth: statusFilter }),
                ...(departmentFilter && departmentFilter !== "All" && { department_id: departmentFilter }),
                ...(searchTerm && { search: searchTerm }),
                ...(sortBy && { sort_by: sortBy }), // backend should handle sort
            };
            const res = await dispatch(getEmpBirthdayList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching birthday list:", error);
            setShowMoreLess(false);
        }
    }, [searchTerm, statusFilter, departmentFilter, sortBy, visibleCount]);

    useEffect(() => {
        fetchEmpBirthdayList();
    }, [searchTerm, statusFilter, departmentFilter, sortBy, visibleCount]);

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setDepartmentFilter("All");
        setSortBy("recent");
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

    // ❗ 1 new loding
    // ✅ Table ke hisaab se dummy loading rows
    const dummData = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        display_name: "",
        department: { department_name: "" },
        email: "",
        mobile_no: "-",
        date_of_birth: "",
        image: null,
    }));

    const ListData = (birthdayLoading && (!showMoreLess || birthdayList?.length === 0)) ? dummData : birthdayList;

    return (
        <div className="employee-dashboard-list BirthdayListMain">
            <div className="dashboard-sticky-header">
                <header className="top-header">
                    <div className="header-left">
                        {/* <button className="header-icon-btn"><img src={userlistsvg} /></button> */}
                        <div>
                            <h1>All Birthday List
                                <span className="total-count"> <TrendingUp size={16} className="TrendingUp" />
                                    {metaData?.all}</span>
                            </h1>
                            <p>List Of Employee's Birthdate</p>
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
                    </div>
                </header>
            </div>
            <main className={`dashboard-content`} >
                <>
                    <aside className="filters-sidebar">
                        <div>
                            <ul>
                                {birthDayStatusOptions?.map(status => {
                                    const Icon = statusConfig[status?.id]?.icon || SquareMenu; // Fallback icon
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
                                            <span className="counts">({String(count)?.padStart(2, '0')})</span>
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
                            <table className="employee-table emp-t-4">
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Department Name</th>
                                        <th>Contacts</th>
                                        <th>Date Of Birth</th>
                                    </tr>
                                </thead>
                                {/* // ❗ 3 new loding */}
                                {(birthdayLoading || birthdayList?.length > 0) ? (
                                    <>
                                        <tbody className={`${birthdayLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                            {ListData?.map(emp => {
                                                return (
                                                    <tr
                                                        key={emp?.id}
                                                        className="employee-row not_Detail"
                                                    >
                                                        <td>
                                                            <div className="info_img">
                                                                <div className="loadingImg">

                                                                    <img className="avatar" src={employeeImage(emp?.image)} alt={emp?.display_name || [emp?.first_name, emp?.last_name].filter(Boolean).join(" ") || "-"} />
                                                                </div>

                                                                <div className="name Semi_Bold loadingtdsmall">{emp?.display_name || [emp?.first_name, emp?.last_name].filter(Boolean).join(" ") || "-"}</div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="department loadingtd">{emp?.department?.department_name}</div>
                                                        </td>
                                                        <td className="td ">
                                                            <div className="contact-info  ">
                                                                <div className="loadingtdTOP"><Mail size={14} /> <span>{emp?.email}</span></div>
                                                                {emp?.mobile_no && <div className="loadingtdbigx7 Bold loadingtdBOTTOM "><Phone size={14} /> <span className="phone">{emp?.mobile_no}</span></div>}
                                                            </div>
                                                        </td>
                                                        <td className="loadingtd">
                                                            <div className="department ">{formatDate(emp?.date_of_birth)}</div>
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
                                                {(!birthdayLoading && birthdayList?.length === 0) && (
                                                    <ListDataNotFound module="birthday" handleReset={resetFilters} />
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}

                            </table>
                            {(!birthdayLoading || showMoreLess) &&
                                <div className="load-more-container">
                                    {/* Show More button if not all jobs loaded */}
                                    {(visibleCount < totalBirthdays) && (
                                        <button onClick={handleLoadMore} className="load-more-btn">
                                            {(birthdayLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                        </button>
                                    )}
                                    {/* Show Less button if all jobs are loaded */}
                                    {(visibleCount >= totalBirthdays && totalBirthdays > INITIAL_VISIBLE_COUNT) && (
                                        <button onClick={handleShowLess} className="load-more-btn">
                                            {(birthdayLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
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

export default BirthdayList;