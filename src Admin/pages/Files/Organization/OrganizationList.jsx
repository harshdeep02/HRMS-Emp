import React, { useState, useEffect, useRef, useCallback } from "react";
// UPDATED: Added new icons
import { MoreVertical, TrendingUp, UserPlus, Frame, X, SquareMenu, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import DynamicLoader from "../../../utils/common/DynamicLoader/DynamicLoader.jsx";
import ImportList from "../../../utils/common/Import/ImportList.jsx";
import { orgnisationFilesStatusOptions } from "../../../utils/Constant.js";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import DatePicker from "../../../utils/common/DatePicker/DatePicker.jsx";
import { getFileList } from "../../../Redux/Actions/fileActions.js";
import './OrganizationList.scss'
import { formatDate3 } from "../../../utils/common/DateTimeFormat.js";
import { getEmployeeList } from "../../../Redux/Actions/employeeActions.js";
import { getDepartmentList } from "../../../Redux/Actions/departmentActions.js";
const INITIAL_VISIBLE_COUNT = 9;

export const OrganizationList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux

    const fileData = useSelector((state) => state?.fileList);
    const filesList = fileData?.data?.myfile || [];
    const totalFiles = fileData?.data?.count || 0;
    const metaData = fileData?.data?.metadata || {};
    const fileListLoading = fileData?.loading || false;
    const employeeData = useSelector((state) => state?.employeeList);
    const employeeList = employeeData?.data?.result;
    const departmentData = useSelector((state) => state?.departmentList);
    const departmentLists = departmentData?.data?.department || [];
    const fetchDepartments = () => {
        dispatch(getDepartmentList());
    };

    useEffect(() => {
        if (!departmentLists) fetchDepartments();

    }, []);
    const findDepartment = (departments) => {
        return departments?.map((item) => departmentLists?.find((dep) => dep.id === item))

    }

    const [searchTerm, setSearchTerm] = useState("");
    const searchBoxRef = useRef();
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [view, setView] = useState('list');
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [open, setOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState(null);
    const menuRef = useRef(null);

    const statusConfig = orgnisationFilesStatusOptions?.reduce((acc, status) => {
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

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const fetchOrganizationFilesList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");
            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
                 file_type: "organization",
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(searchTerm && { search: searchTerm }),
                ...(dateFilter && { custom_date: formatDate3(new Date(dateFilter)) }),
            };
            await dispatch(getFileList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching Organization Files list:", error);
            setShowMoreLess(false);
        }
    }, [dispatch, searchTerm, statusFilter, dateFilter, visibleCount, currentPage]);

    useEffect(() => {
        fetchOrganizationFilesList();
    }, [fetchOrganizationFilesList]);

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setShowMoreLess(false);
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();
        }
        setDateFilter(null);
        // Clear date input manually if needed
        const dateInput = document.getElementById('date-filter-input');
        if (dateInput) dateInput.value = '';
    };
    const handleDateFilter = (date) => {
        setCurrentPage(1);
        setDateFilter(date);
        setVisibleCount(INITIAL_VISIBLE_COUNT)
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

    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };


    const handleImportRow = async (row) => {
    };

    const dummData = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        first_name: "",
        map: "",
        deadline: "",
        email: "",
        status: "",
        user_image: null,
    }));


    const ListData = (fileListLoading && (!showMoreLess || filesList?.length === 0)) ? dummData : filesList;


    return (
        <div className="organizationListMain">
            <div className="employee-dashboard-list depatmentListMain">
                <div className="dashboard-sticky-header">
                    <header className="top-header">
                        <div className="header-left">
                            <div>
                                <h1>Orgnisation Files List
                                    <span className="total-count"> <TrendingUp size={16} className="TrendingUp" />
                                        {metaData?.all}</span>
                                </h1>
                                <p>See All Orgnisation File List Below</p>
                            </div>
                        </div>
                        <div className="header-right">
                            <div className="toolbar">
                                <SearchBox
                                    onSearch={handleSearch}
                                    placeholder="Search File Name..."
                                    ref={searchBoxRef}
                                />
                            </div>
                            <div className="toolbar-actions">
                                <DatePicker
                                    label=""
                                    onDateChange={handleDateFilter}
                                    initialDate={dateFilter}
                                />
                            </div>
                            <Tooltips title='Add New File' placement="top" arrow={true}>
                                <button className="add-employee-btn" onClick={() => navigate('/add-organisation-file')}><UserPlus size={16} /> </button>
                            </Tooltips>

                            <div className="relative" ref={menuRef}>
                                <Tooltips title="Import" placement="top" arrow={true}>
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
                                                setOpen(false);
                                            }}
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
                                    {orgnisationFilesStatusOptions?.map(status => {
                                        const Icon = status?.icon || SquareMenu; // fallback icon
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
                                                <span className="counts">({String(count).padStart(2, '0')})</span>
                                            </li>
                                        );
                                    })}

                                </ul>
                                <div className="clearBTN">
                                    {(statusFilter !== 'All' || dateFilter !== null) && (
                                        <button className="clear-filters-btn" onClick={resetFilters}>
                                            <span>Clear filter</span>
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </aside>
                        <div className="employee-table-wrapper">

                            <table className="employee-table emp-t-5">
                                <thead>
                                    <tr>
                                        <th>File Name</th>
                                        <th>Share With</th>
                                        <th>Deadline</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                {(fileListLoading || filesList?.length > 0) ? (

                                    <tbody className={`${fileListLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                        {ListData?.map(item => {
                                            const StatusIcon = statusConfig[item?.status]?.icon || XCircle;
                                            const statusClassName = statusConfig[item?.status]?.className;
                                            const paersedDepartments = item?.departments?.length > 0 ? JSON.parse(item?.departments) : []
                                            const findedDepartment = findDepartment(paersedDepartments)?.map((dep) => dep?.department_name)

                                             return (
                                            <tr
                                                    key={item?.id}
                                                    className="employee-row"
                                                    onClick={() => navigate(`/organisation-file-details/${item?.id}`)}
                                                >
                                                    <td><div className="department loadingtd Semi_Bold">{item?.file_name}</div></td>
                                                    <td><div className="department loadingtd">{findedDepartment?.map((emp, i) => <span>{`${emp}${i<findedDepartment?.length-1 ? ",":''}`} </span>)}</div></td>
                                                    <td><div className="department loadingtd">{item?.deadline}</div></td>
                                                    <td className="loadingtd">
                                                        <div className={`status-badge ${statusClassName}`}>
                                                            <StatusIcon size={16} />
                                                            <span>{statusConfig[item?.status]?.label}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>

                                ) : (
                                    <tbody className="table_not_found">
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                                                {(!fileListLoading && filesList?.length === 0) && (
                                                    <ListDataNotFound module="Orgnisation Files" handleReset={resetFilters} />
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                                <div className="load-more-container">
                                    {(visibleCount < totalFiles) && (
                                        <button onClick={handleLoadMore} className="load-more-btn">
                                            {fileListLoading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                        </button>
                                    )}
                                    {(visibleCount > totalFiles && totalFiles > INITIAL_VISIBLE_COUNT) && (
                                        <button onClick={handleShowLess} className="load-more-btn">
                                            {fileListLoading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                        </button>
                                    )}
                                </div>
                            
                        </div>
                    </>
                </main>

            </div>
        </div >
    )
}
