import { useState, useEffect, useRef, useCallback } from "react";
// UPDATED: Added new icons
import { MoreVertical, TrendingUp, UserPlus, Frame, SquareMenu, X } from "lucide-react";
import "../../EmployeeOnboarding/EmployeeList/EmployeeList.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DynamicFilter from "../../../utils/common/DynamicFilter.jsx";
import SortFilter from "../../../utils/common/SortFilter.jsx";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import { getDesignationList } from "../../../Redux/Actions/designationActions.js";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import DynamicLoader from "../../../utils/common/DynamicLoader/DynamicLoader.jsx";
import { designationStatusOptions } from "../../../utils/Constant.js";
import ImportList from "../../../utils/common/Import/ImportList.jsx";
import ExportList from "../../../utils/common/Export/ExportList.jsx";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
const INITIAL_VISIBLE_COUNT = 8;

const DesignationList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Data from redux
    const designationData = useSelector((state) => state?.designationList);
    const designationList = designationData?.data?.designation || [];
    const designationLoading = designationData?.loading || false;
    // const designationLoading = true;
    const totalDesignations = designationData?.data?.count || 0;
    const metaData = designationData?.data?.metadata || {}

    const statusConfig = designationStatusOptions?.reduce((acc, status) => {
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

    const fetchDesignationList = useCallback(async () => {
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
            const res = await dispatch(getDesignationList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching designation list:", error);
            setShowMoreLess(false);
        }
    }, [searchTerm, statusFilter, departmentFilter, sortBy, visibleCount]);

    useEffect(() => {
        fetchDesignationList();
    }, [searchTerm, statusFilter, departmentFilter, sortBy, visibleCount]);

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setDepartmentFilter("All");
        setSortBy("recent");
        setShowMoreLess(false);
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();// 👈 clear input field
        };
    }

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
        { label: 'Designation', key: (item) => item?.designation_name || 'N/A' },
        { label: 'Department', key: (item) => item?.department?.department_name || 'N/A' },
        { label: 'Description', key: (item) => item?.description || 'N/A' },
    ];

    const handleImportRow = async (row) => {
        const payload = {
            designation_name: row['Designation'],
            department_id: row['Department'], // expects department_id in import (you may need to map department name → id before dispatch)
            description: row['Description'],
        };

        // return dispatch(createNewDesignation(payload));
    };

    // ❗ 1 new loding
    // ✅ Table ke hisaab se dummy loading rows
    const dummData = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        designation_name: "",
        department: { department_name: "" },
        description: "",
    }));


    const ListData = (designationLoading && (!showMoreLess || designationList?.length === 0)) ? dummData : designationList;


    return (
        <div className="employee-dashboard-list designationListMain">
            <div className="dashboard-sticky-header">
                <header className="top-header">
                    <div className="header-left">
                        <div>
                            <h1>Designation list
                                <span className="total-count"> <TrendingUp size={16} className="TrendingUp" />
                                    {metaData?.all}</span>
                            </h1>
                            <p>See Designations All Details Below</p>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="toolbar">
                            <SearchBox
                                onSearch={handleSearch}
                                placeholder="Search Designation..."
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
                            title='Add New Designation'
                            placement="top" arrow={true}
                        >
                            <button className="add-employee-btn" onClick={() => navigate('/add-designation')}><UserPlus size={16} /> </button>
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
                                            // fetchDepartmentList();
                                            setOpen(false);
                                        }}
                                    />
                                    <ExportList
                                        data={designationList}
                                        headers={exportHeaders}
                                        filename="designation.csv"
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
                                {designationStatusOptions?.map((status, index) => {
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
                                    <button className="clear-filters-btn" onClick={resetFilters}>
                                        Clear filter
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
                                    <th>Designation</th>
                                    <th>Department</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            {/* // ❗ 3 new loding */}
                            {(designationLoading || designationList?.length > 0) ? (
                                <>
                                    <tbody className={`${designationLoading && !showMoreLess ? 'LoadingList' : ''}`}>                             {console.log(ListData)}
                                        {ListData?.map(item => {
                                            return (
                                                <tr
                                                    key={item?.id}
                                                    className="employee-row"
                                                    onClick={() => navigate(`/designation-details/${item?.id}`)}
                                                >
                                                    <td>
                                                        <div className="employee-info info_img loadingtd">
                                                            <div className="avatar-icon">
                                                                <Frame size={16} strokeWidth={1.5} />
                                                            </div>
                                                            <div className="name Semi_Bold">{item?.designation_name}</div>
                                                        </div>


                                                    </td>
                                                    <td className="loadingtd">
                                                        <div className="department ">{item?.department?.department_name}</div>
                                                    </td>
                                                    <td className="td loadingtd">
                                                        <div className="contact-info ">
                                                            <div><span>{item?.description}</span></div>
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
                                            {(!designationLoading && designationList?.length === 0) && (
                                                <ListDataNotFound module="designation" handleReset={resetFilters} />
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                        {(!designationLoading || showMoreLess) &&
                            <div className="load-more-container">
                                {/* Show More button if not all jobs loaded */}
                                {(visibleCount < totalDesignations) && (
                                    <button onClick={handleLoadMore} className="load-more-btn">
                                        {designationLoading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                    </button>
                                )}
                                {/* Show Less button if all jobs are loaded */}
                                {(visibleCount >= totalDesignations && totalDesignations > INITIAL_VISIBLE_COUNT) && (
                                    <button onClick={handleShowLess} className="load-more-btn">
                                        {designationLoading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
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

export default DesignationList;