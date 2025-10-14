import { useState, useEffect, useRef, useCallback } from "react";
import { MoreVertical, TrendingUp, UserPlus, X, SquareMenu } from "lucide-react";
import "../../EmployeeOnboarding/EmployeeList/EmployeeList.scss";
import { useNavigate } from "react-router-dom";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import { holidayStatusOptions } from "../../../utils/Constant.js";
import { getHolidayList } from "../../../Redux/Actions/holidayActions.js";
import './HolidayList.scss'
import ImportList from "../../../utils/common/Import/ImportList.jsx";
import ExportList from "../../../utils/common/Export/ExportList.jsx";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import DatePicker from "../../../utils/common/DatePicker/DatePicker.jsx";
import { formatDate, formatDate3 } from "../../../utils/common/DateTimeFormat.js";
import EllipsisSpan from "../../../utils/EllipsisSpan.jsx";
const INITIAL_VISIBLE_COUNT = 4;

export const HolidayList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Data from redux
    const holidayData = useSelector((state) => state?.holidayList);
    const holidayList = holidayData?.data?.result || [];
    const totalHolidays = holidayData?.data?.count || 0;
    const holidaysLoading = holidayData?.loading || false;
    const metaData = holidayData?.data?.metadata || {}

    const [searchTerm, setSearchTerm] = useState("");
    const searchBoxRef = useRef();
    const [statusFilter, setStatusFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState(null);
    const [sortBy, setSortBy] = useState("");
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

    const fetchHolidayList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");

            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(searchTerm && { search: searchTerm }),
                ...(sortBy && { sort_by: sortBy }),
                ...(dateFilter && { custom_date: formatDate3(new Date(dateFilter)) }),
            };
            const res = await dispatch(getHolidayList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching holiday list:", error);
            setShowMoreLess(false);
        }
    }, [dispatch, searchTerm, statusFilter, sortBy, visibleCount, currentPage, dateFilter]);

    useEffect(() => {
        fetchHolidayList();
    }, [searchTerm, statusFilter, sortBy, visibleCount, currentPage, dateFilter]);

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setSortBy("recent");
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

    const exportHeaders = [
        { label: 'Holiday Name', key: (item) => item?.holiday_name || 'N/A' },
        { label: 'Start Date', key: (item) => formatDate(item?.from_date) || 'N/A' },
        { label: 'End Date', key: (item) => formatDate(item?.to_date) || 'N/A' },
        { label: 'Day', key: (item) => item?.duration || 'N/A' },
        { label: 'Description', key: (item) => item?.description || 'N/A' },
    ];

    const handleImportRow = async (row) => {
        const payload = {
            holiday_name: row['Holiday Name'],
            from_date: row['Start Date'],
            to_date: row['End Date'],
            duration: row['Day'],
            description: row['Description'],
        };
        // return dispatch(createNewHoliday(payload));
    };

    const countDay = (fromDate, toDate) => {
        // Parse DD-MM-YYYY format
        const parseCustomDate = (dateStr) => {
            if (!dateStr) return;

            const parts = dateStr.split('-');
            if (parts.length !== 3) return;

            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JavaScript
            const year = parseInt(parts[2], 10);

            return new Date(year, month, day);
        };

        const startDate = parseCustomDate(fromDate);
        const endDate = parseCustomDate(toDate);

        // Check if dates are valid
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error('Invalid date format. Expected DD-MM-YYYY');
            return 0;
        }

        // Set both dates to start of day
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        const timeDifference = endDate.getTime() - startDate.getTime();
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1;

        return Math.max(1, daysDifference);
    }

    const dummyData = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        name: "",
        email: "",
        mobile_no: " ",
        department: "",
        status: " "
    }));

    // ❗ 2 new loding
    const ListData = (holidaysLoading && !showMoreLess) ? dummyData : holidayList;

    return (
        <div className="holidayListMain">
            <div className="employee-dashboard-list job_list jobListMain">
                <div className="dashboard-sticky-header">
                    <header className="top-header">
                        <div className="header-left">
                            {/* <button className="header-icon-btn"><img src={userlistsvg} /></button> */}
                            <div>
                                <h1>All Holiday list
                                    <span className="total-count"> <TrendingUp size={16} className="TrendingUp" />
                                        {metaData?.all}</span>
                                </h1>
                                <p>See all holiday list below</p>
                            </div>
                        </div>
                        <div className="header-right header_rightMain">
                            <div className="toolbar">
                                <SearchBox
                                    onSearch={handleSearch}
                                    placeholder="Search Holiday..."
                                    ref={searchBoxRef}
                                />
                                <div className="toolbar-actions">
                                    <DatePicker
                                        label=""
                                        onDateChange={handleDateFilter}
                                        initialDate={dateFilter}
                                    />
                                </div>
                            </div>
                            <Tooltips
                                title='Add New Holiday'
                                placement="top" arrow={true}
                            >
                                <button className="add-employee-btn" onClick={() => navigate("/add-holiday-details")}><UserPlus size={16} /> </button>
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
                                                // fetchHolidayList();
                                                setOpen(false);
                                            }}
                                        />
                                        <ExportList
                                            data={holidayList}
                                            headers={exportHeaders}
                                            filename="holidays.csv"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>
                </div>

                <main className="dashboard-content">
                    <>
                        <aside className="filters-sidebar">
                            <div>
                                <ul>
                                    {holidayStatusOptions?.map(status => {
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
                                                <span className="counts">({String(count).padStart(2, '0')})</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <div className="clearBTN">
                                    {(dateFilter !== null) && (
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
                                            <th>Holiday name</th>
                                            <th>Start date</th>
                                            <th>End date</th>
                                            <th>Day</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    {(holidaysLoading || holidayList?.length > 0) ? (
                                        <tbody className={`${holidaysLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                            {ListData?.map(item => {
                                                return (
                                                    <tr
                                                        key={item?.id}
                                                        className="employee-row"
                                                        onClick={() => navigate(`/holiday-details/${item?.id}`)}
                                                    >
                                                        <td className="">
                                                            <div className="department Semi_Bold loadingtd">{item?.holiday_name}</div>
                                                        </td>
                                                        <td className="">
                                                            <div className="department loadingtd">{formatDate(item?.from_date)}</div>
                                                        </td>
                                                        <td className="">
                                                            <div className="contact-info loadingtd">
                                                                <div>{formatDate(item?.to_date)}</div>                                         </div>
                                                        </td>
                                                        <td className="">
                                                            <div className="department loadingtd">{item?.duration}</div>
                                                        </td>
                                                        <td className="loadingtd td_2line " style={{ minWidth: '290px' }}>
                                                            <div className="department ">
                                                                <EllipsisSpan text={item?.description} wordsToShow={21} />
                                                            </div>

                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    ) : (
                                        <tbody className="table_not_found">
                                            <tr>
                                                <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                                                    {(!holidaysLoading && holidayList?.length === 0) && (
                                                        <ListDataNotFound module="Holiday" handleReset={resetFilters} />
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    )}
                                </table>
                                {/* {!holidaysLoading && holidayList?.length === 0 && */}
                                {(!holidaysLoading || showMoreLess) &&
                                    <div className="load-more-container">
                                        {/* Show More button if not all jobs loaded */}
                                        {(visibleCount < totalHolidays) && (
                                            <button onClick={handleLoadMore} className="load-more-btn">
                                                {(holidaysLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                            </button>
                                        )}
                                        {/* Show Less button if all jobs are loaded */}
                                        {(visibleCount >= totalHolidays && totalHolidays > INITIAL_VISIBLE_COUNT) && (
                                            <button onClick={handleShowLess} className="load-more-btn">
                                                {(holidaysLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                            </button>
                                        )}
                                    </div>
                                }
                                {/* } */}
                            </div>
                        )}
                    </>
                </main>

            </div>
        </div>
    )
}
