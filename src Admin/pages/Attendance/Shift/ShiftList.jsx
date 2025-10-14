import { useState, useEffect, useRef, useCallback } from "react";
import { List, MoreVertical, X, UserPlus, TrendingUp, XCircle } from "lucide-react";
import "../../EmployeeOnboarding/EmployeeList/EmployeeList.scss"; // Using the same stylesheet
import { useNavigate } from "react-router-dom";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import DynamicLoader from "../../../utils/common/DynamicLoader/DynamicLoader.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import { useDispatch, useSelector } from "react-redux";
import { shiftStatusOption } from "../../../utils/Constant.js";
import { getShiftList } from "../../../Redux/Actions/shiftActions.js";
import ExportList from "../../../utils/common/Export/ExportList.jsx";
import ImportList from "../../../utils/common/Import/ImportList.jsx";
import './ShiftList.scss'
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";

// 1. Dummy Data based on the image provided

const INITIAL_VISIBLE_COUNT = 6;

const ShiftList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();


    // Redux 
    const shiftData = useSelector((state) => state?.shiftList);
    const shiftList = shiftData?.data?.result || [];
    const totalShift = shiftData?.data?.count || 0;
    const metaData = shiftData?.data?.metadata || {};
    const shiftLoading = shiftData?.loading || false;


    const statusConfig = shiftStatusOption?.reduce((acc, status) => {
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
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [sortBy, setSortBy] = useState("recent");
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


    const fetchShiftList = useCallback(async () => {
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
            await dispatch(getShiftList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching Shift list:", error);
            setShowMoreLess(false);
        }
    }, [dispatch, searchTerm, statusFilter, visibleCount, currentPage]);


    useEffect(() => {
        fetchShiftList();
    }, [fetchShiftList]);

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
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

    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };


    const exportHeaders = [
        { label: 'SHIFT NAME', key: (shift) => shift?.shift_name || 'N/A' },
        { label: 'START TIME', key: (shift) => shift?.start_time || 'N/A' },
        { label: 'END TIME', key: (shift) => shift?.end_time || 'N/A' },
        { label: 'EXTRA HOURS', key: (shift) => shift?.extra_hours || 'N/A' },
        { label: 'BREAK TIME(IN MIN)', key: (shift) => shift?.break_time || 'N/A' },
        { label: 'STATUS', key: (shift) => statusConfig[shift?.status]?.label || 'N/A' }
    ];

    const handleImportRow = async (row) => {

        const payload = {
            shift_name: row['SHIFT NAME'],
            start_time: row['START TIME'],
            end_time: row['END TIME'],
            extra_hours: row['EXTRA HOURS'],
            break_time: row['BREAK TIME'],
            status: row['STATUS'],
        };
        // return dispatch(createNewDepartment(payload));
    };

    const dummyData = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        name: "",
        email: "",
        mobile_no: " ",
        department: "",
        status: " "
    }));

    // ❗ 2 new loding
    const ListData = (shiftLoading && !showMoreLess) ? dummyData : shiftList;


    return (
        <div className="shiftListMain">
            <div className="employee-dashboard-list app_List">
                <div className="dashboard-sticky-header">
                    <header className="top-header">
                        <div className="header-left">
                            <div>
                                <h1>Shift List
                                    <span className="total-count">
                                        <TrendingUp size={16} className="TrendingUp" />
                                        {metaData?.all}
                                    </span>
                                </h1>
                                <p>See All Shift List Below</p>
                            </div>
                        </div>
                        <div className="header-right header_rightMain">
                            <div className="toolbar">
                                <SearchBox
                                    onSearch={handleSearch}
                                    placeholder="Search shift..."
                                    ref={searchBoxRef}
                                />
                            </div>
                            <Tooltips title='Add New Shift' placement="top" arrow>
                                <button className="add-employee-btn"
                                    onClick={() => navigate(`/add-shift`)}
                                >
                                    <UserPlus size={16} />
                                </button>
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
                                            apiFunction={handleImportRow}
                                            onImportSuccess={() => {
                                                fetchShiftList();
                                                setOpen(false);
                                            }}
                                        />
                                        <ExportList
                                            data={shiftList}
                                            headers={exportHeaders}
                                            filename="shift.csv"
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
                                {shiftStatusOption?.map(status => {
                                    const Icon = status?.icon || List; // fallback icon
                                    let count = 0;
                                    if (status.label === "All") {
                                        count = metaData?.all ?? 0;
                                    } else {
                                        count = metaData?.[status?.label.toLowerCase().replace(" ", "")] ?? 0;
                                    }
                                    return (
                                        <li
                                            key={status.id}
                                            className={statusFilter === status.id ? "active" : ""}
                                            onClick={() => handleStatusFilter(status.id)}
                                        >
                                            <div className="status-label">
                                                <Icon size={16} strokeWidth={1.5} />
                                                <span>{status.label}</span>
                                            </div>
                                            <span className="counts">({String(count).padStart(2, '0')})</span>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="clearBTN">
                                {/* { (
                                    <button className="clear-filters-btn" onClick={resetFilters}>
                                        <span>Clear filter</span><X size={14} />
                                    </button>
                                )} */}
                            </div>
                        </div>
                    </aside>

                    <div className="content_box_auto">
                        <>
                            <div className="employee-table-wrapper">
                                <table className="employee-table emp-t-6">
                                    <thead>
                                        <tr>
                                            <th>SHIFT NAME</th>
                                            <th>START TIME</th>
                                            <th>END TIME</th>
                                            <th>EXTRA HOURS</th>
                                            <th>BREAK TIME(IN MIN)</th>
                                            <th>STATUS</th>
                                        </tr>
                                    </thead>
                                    {(shiftLoading || shiftList?.length > 0) ? (

                                        <tbody className={`${shiftLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                            {ListData?.map(item => {
                                                const StatusIcon = statusConfig[item?.status]?.icon || XCircle;
                                                const statusClassName = statusConfig[item?.status]?.label;
                                                return (
                                                    <tr
                                                        key={item?.id}
                                                        className="employee-row"
                                                        onClick={() => navigate(`/shift-details/${item?.id}`)}
                                                    >
                                                        <td className="">
                                                            <div className="department loadingtd Semi_Bold Semi_Bold">{item?.shift_name}</div>
                                                        </td>
                                                        <td className="loadingtd">
                                                            <div className="department ">{item?.start_time}</div>
                                                        </td>
                                                        <td className="">
                                                            <div className="department loadingtd">{item?.end_time}</div>
                                                        </td>
                                                        <td className="">
                                                            <div className="department loadingtd">{item?.extra_hours || "-"}</div>
                                                        </td>
                                                        <td className="">
                                                            <div className="department loadingtd ">{item?.break_time}</div>
                                                        </td>
                                                        <td className="loadingtd">
                                                            <div className={`status-badge ${statusClassName}`}>
                                                                <StatusIcon size={16} />
                                                                <span>{statusConfig[item?.status]?.label}</span>
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
                                                <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                                                    {(!shiftLoading && shiftList?.length === 0) && (
                                                        <ListDataNotFound module="shift" handleReset={resetFilters} />
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    )}
                                </table>
                            </div>
                        </>
                        {(!shiftLoading || showMoreLess) &&
                            <div className="load-more-container">
                                {(visibleCount < totalShift) && (
                                    <button onClick={handleLoadMore} className="load-more-btn">
                                        {shiftLoading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                    </button>
                                )}
                                {(visibleCount >= totalShift && totalShift > INITIAL_VISIBLE_COUNT) && (
                                    <button onClick={handleShowLess} className="load-more-btn">
                                        {shiftLoading && showMoreLess ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                    </button>
                                )}
                            </div>
                        }

                    </div>
                </main>

            </div>
        </div>
    );
};

export default ShiftList;