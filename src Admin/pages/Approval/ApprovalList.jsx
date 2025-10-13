import { useState, useEffect, useRef, useCallback } from "react";
import { List, MoreVertical, X, XCircle, CheckCircle2, UserPlus, CircleDot, TrendingUp } from "lucide-react";
import Tooltips from "../../utils/common/Tooltip/Tooltips.jsx";
import SearchBox from "../../utils/common/SearchBox.jsx";
import ListDataNotFound from "../../utils/common/ListDataNotFound.jsx";
import defaultImage from "../../assets/default-user.png";
import ImportList from "../../utils/common/Import/ImportList.jsx";
import ExportList from "../../utils/common/Export/ExportList.jsx";
import { useNavigate } from "react-router-dom";
import DatePicker from "../../utils/common/DatePicker/DatePicker.jsx";
import { useDispatch, useSelector } from "react-redux";
import { performanceStatusOptions } from "../../utils/Constant.js";
import { formatDate, formatDate3 } from "../../utils/common/DateTimeFormat.js";
import { getPerformanceList } from "../../Redux/Actions/performanceActions.js";
import DynamicLoader from "../../utils/common/DynamicLoader/DynamicLoader.jsx";
import LoadingDots from "../../utils/common/LoadingDots/LoadingDots.jsx";

export const ApprovalList = () => {
 
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const performanceData = useSelector((state) => state?.performanceList);
    const performanceList = performanceData?.data?.result || [];
    const totalPerformance = performanceData?.data?.count || 0;
    const metaData = performanceData?.data?.metadata || {};
    const performanceLoading = performanceData?.loading || false;

    const statusConfig = performanceStatusOptions?.reduce((acc, status) => {
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

    const INITIAL_VISIBLE_COUNT = 5;

    const searchBoxRef = useRef();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const [dateFilter, setDateFilter] = useState(null);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

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

    const fetchPerformanceList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");

            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
                is_send_for_approval: 1,
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(searchTerm && { search: searchTerm }),
                ...(dateFilter && { custom_date: formatDate3(new Date(dateFilter)) }),
            };
            const res = await dispatch(getPerformanceList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching Performance list:", error);
            setShowMoreLess(false);
        }
    }, [dispatch, searchTerm, dateFilter, statusFilter, visibleCount, currentPage]);


    useEffect(() => {
        fetchPerformanceList();
    }, [fetchPerformanceList]);

    // const filteredEmployees = DUMMY_PERFORMANCE.filter(employee => {
    //     const matchesSearch = searchTerm === "" ||
    //         employee.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         employee.designation.toLowerCase().includes(searchTerm.toLowerCase());

    //     const matchesStatus = statusFilter === "All" || employee.status === statusFilter;

    //     // Date filter logic can be added here once the date picker is integrated.
    //     // For now, it will always return true.
    //     const matchesDate = true; // Placeholder for date filter

    //     return matchesSearch && matchesStatus && matchesDate;
    // });

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

    // const employeesToDisplay = filteredEmployees.slice(0, visibleCount);

    const exportHeaders = [
        { label: 'Employee Name', key: 'employee_name' },
        { label: 'Department', key: 'department' },
        { label: 'Designation', key: 'designation' },
        { label: 'Appraisal Date', key: 'appraisal_date' },
        { label: 'Status', key: 'status' }
    ];

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


    const ListData = (performanceLoading && (!showMoreLess || performanceList?.length === 0)) ? dummData : performanceList;


    return (
        <div className="performanceListMain">
            <div className="employee-dashboard-list performanceListMain">
                <div className="dashboard-sticky-header">
                    <header className="top-header">
                        <div className="header-left">
                            <div>
                                <h1>Approval List
                                    <span className="total-count">
                                        <TrendingUp size={16} className="TrendingUp" />
                                        {metaData?.all}
                                    </span>
                                </h1>
                                <p>See Approval File List Below</p>
                            </div>
                        </div>
                        <div className="header-right header_rightMain">
                            <div className="toolbar">
                                <SearchBox
                                    ref={searchBoxRef}
                                    onSearch={handleSearch}
                                    placeholder="Search Employee..."
                                />
                                {/* Placeholder for Date Picker */}
                                <DatePicker
                                    label=""
                                    onDateChange={handleDateFilter}
                                    initialDate={dateFilter}
                                />
                            </div>
                            {/* <Tooltips
                                title='Add New Approved'
                                placement="top" arrow={true}
                            >
                                <button
                                    onClick={() => navigate(`/add-performance`)}

                                    className="add-employee-btn"><UserPlus size={16} /></button>
                            </Tooltips> */}
                            <Tooltips
                                title='Import'
                                placement="top" arrow={true}
                            >
                                <div className="relative" ref={menuRef}>
                                    <button className="menu-btn" onClick={() => setOpen((prev) => !prev)}><MoreVertical size={24} /></button>
                                    {open && (
                                        <div className="menu-popup">
                                            <ImportList
                                            // handleImportRow={handleImportRow}
                                            />
                                            {/* <ExportList
                                            data={DUMMY_PERFORMANCE}
                                            headers={exportHeaders}
                                            filename="employee_performance.csv"
                                        /> */}
                                        </div>
                                    )}
                                </div>
                            </Tooltips>
                        </div>
                    </header>
                </div>
                {/* {(performanceLoading && !showMoreLess) ? (
                    <DynamicLoader avatar="yas" type={'list'} count={9} listType="emp-a-5" closeBtnValue={statusFilter !== 'All' ? 81 : ''} />
                ) : ( */}
                <main className={`dashboard-content`}>
                    <aside className="filters-sidebar">
                        <div>
                            <ul>
                                {performanceStatusOptions?.map(status => {
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
                                            <span className="counts">({String(count)?.padStart(2, '0')})</span>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="clearBTN">
                                {statusFilter !== 'All' && (
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
                                    <th>Employee</th>
                                    <th>Department</th>
                                    <th>Designation</th>
                                    <th>Appraisal Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            {(performanceLoading || performanceList?.length > 0) ? (
                                <tbody className={`${performanceLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                    {ListData.map(item => {
                                        const StatusIcon = statusConfig[item.status]?.icon || XCircle;
                                        const statusClassName = statusConfig[item.status]?.className;
                                        return (
                                            <>
                                                <tr key={item.id} className="employee-row"
                                                    onClick={() => navigate(`/approval-details/${item?.id}`)}
                                                >
                                                    <td className="td " >
                                                       
                                                                <div className="info_img ">
                                                                                                                                    <div className="loadingImg">

                                                                    <img src={employeeImage(item?.employee?.image)} alt={item?.employee?.first_name || item?.employee?.last_name || "-"} className="avatar" />
                                                                       </div>
                                                                    <div className="name Semi_Bold loadingtdsmall ">{[item?.employee?.first_name, item?.employee?.last_name].filter(Boolean).join(" ")}</div>
                                                                </div>
                                                        
                                                        

                                                    </td>
                                                    <td className="">
                                                        <div className="department loadingtd ">{item?.employee?.department?.department_name}</div>
                                                    </td>
                                                    <td className="" >
                                                        <div className="designation loadingtd">{item?.employee?.designation?.designation_name}</div>
                                                    </td>
                                                    <td className="" >
                                                        <div className="date loadingtd">{formatDate(item?.appraisal_date)}</div>
                                                    </td>
                                                    <td className="loadingtd">
                                                        <div className={`status-badge ${statusClassName}`}>
                                                            <StatusIcon size={16} />
                                                            <span>{statusConfig[item?.status]?.label}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </>
                                        );
                                    })}
                                </tbody>
                            ) : (
                                // ❗ 4 new loding
                                <tbody className="table_not_found">
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                                            {(!performanceLoading && performanceList?.length === 0) && (
                                                <ListDataNotFound module="approval" handleReset={resetFilters} />
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>


                        <div className="load-more-container">
                            {(visibleCount < totalPerformance) && (
                                <button onClick={handleLoadMore} className="load-more-btn">
                                    {(performanceLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                </button>
                            )}
                            {/* Show Less button if all jobs are loaded */}
                            {(visibleCount >= totalPerformance && totalPerformance > INITIAL_VISIBLE_COUNT) && (
                                <button onClick={handleShowLess} className="load-more-btn">
                                    {(performanceLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                </button>
                            )}
                        </div>
                    </div>
                </main>
                {/* )} */}
            </div>
        </div>
    );
};