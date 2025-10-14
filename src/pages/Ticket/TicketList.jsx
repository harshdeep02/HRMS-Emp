import { useState, useEffect, useRef, useCallback } from "react";
// UPDATED: Added new icons
import { MoreVertical, SquareMenu, TrendingUp, UserPlus, X, XCircle } from "lucide-react";
import '../Organization/EmployeeList/EmployeeList.scss'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DynamicFilter from "../../utils/common/DynamicFilter.jsx";
import Tooltips from "../../utils/common/Tooltip/Tooltips.jsx";
import SearchBox from "../../utils/common/SearchBox.jsx";
import LoadingDots from "../../utils/common/LoadingDots/LoadingDots.jsx";
import ExportList from "../../utils/common/Export/ExportList.jsx";
import ListDataNotFound from "../../utils/common/ListDataNotFound.jsx";
import SortFilter from "../../utils/common/SortFilter.jsx";
import { ticketStatusOptions } from "../../utils/Constant.js";
import { getTicketList } from "../../Redux/Actions/ticketActions.js";
import { formatDate } from "../../utils/common/DateTimeFormat.js";
import { showMasterData, showMastersValue } from "../../utils/helper.js";
import './TicketList.scss'
const INITIAL_VISIBLE_COUNT = 9;

export const TicketList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Data from redux
    const ticketListData = useSelector((state) => state?.ticketList);
    const ticketList = ticketListData?.data?.result;
    const ticketListLoading = ticketListData?.loading || false;
    const totalTicket = ticketListData?.data?.count || 0;
    const metaData = ticketListData?.data?.metadata || {};
    const masterData = useSelector(state => state?.masterData?.data);

    const [searchTerm, setSearchTerm] = useState("");
    const searchBoxRef = useRef();
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [sortBy, setSortBy] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [view, setView] = useState('list');
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const priority_options = showMasterData("20");

    const statusConfig = ticketStatusOptions?.reduce((acc, status) => {
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

    const fetchTicketList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");

            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(priorityFilter && priorityFilter !== "All" && { priority: priorityFilter }),
                ...(searchTerm && { search: searchTerm }),
                ...(sortBy && { sort_by: sortBy }), // backend should handle sort
            };
            const res = await dispatch(getTicketList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching Ticket list:", error);
            setShowMoreLess(false);
        }
    }, [searchTerm, sortBy, statusFilter, priorityFilter, visibleCount]);

    useEffect(() => {
        fetchTicketList();
    }, [searchTerm, sortBy, statusFilter, priorityFilter, visibleCount]);

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setPriorityFilter("All");
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

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    const handleStatusFilter = (newFilter) => {
        setStatusFilter(newFilter);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    const handlePriorityFilter = (newFilter) => {
        setPriorityFilter(newFilter);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    const exportHeaders = [
        {
            label: 'Employee Name',
            key: (item) => [item?.user?.first_name, item?.user?.last_name].filter(Boolean).join(" ") || 'N/A'
        },
        {
            label: 'Requested To',
            key: (item) => [item?.requested_to?.first_name, item?.requested_to?.last_name].filter(Boolean).join(" ") || 'N/A'
        },
        {
            label: 'Priority',
            key: (item) => showMastersValue(masterData, "20", item?.priority) || 'N/A'
        },
        {
            label: 'Creation Date',
            key: (item) => formatDate(item?.created_at) || 'N/A'
        },
        {
            label: 'Status',
            key: (item) => statusConfig[item?.status]?.label || 'N/A'
        },
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


    const ListData = (ticketListLoading && (!showMoreLess || ticketList?.length === 0)) ? dummData : ticketList;

    return (
        <div className="ticketListMain">
            <div className="employee-dashboard-list designationListMain">
                <div className="dashboard-sticky-header">
                    <header className="top-header">
                        <div className="header-left">
                            {/* <button className="header-icon-btn">
                                    <Warehouse size={30} strokeWidth={1.5} />
                                </button> */}
                            <div>
                                <h1>Ticket List
                                    <span className="total-count"> <TrendingUp size={16} className="TrendingUp" />
                                        {metaData?.all}</span>
                                </h1>
                                <p>See All Tickets List Below</p>
                            </div>
                        </div>
                        <div className="header-right">
                            <div className="toolbar">
                                <SearchBox
                                    onSearch={handleSearch}
                                    placeholder="Search Requested To..."
                                    ref={searchBoxRef}
                                />
                                <div className="toolbar-actions">
                                    <DynamicFilter
                                        filterBy="priority"
                                        filterValue={priorityFilter}
                                        onChange={handlePriorityFilter}
                                        options={priority_options?.map((item) => ({
                                            value: item?.id,
                                            label: item?.label,
                                        })) || []}
                                    />
                                </div>

                            </div>
                            <SortFilter
                                sortBy={sortBy}
                                onChange={handleSortChange}

                            />
                            <Tooltips
                                title='Add Ticket'
                                placement="top" arrow={true}
                            >
                                <button className="add-employee-btn" onClick={() => navigate('/add-ticket')}><UserPlus size={16} /> </button>
                            </Tooltips>
                                <div className="relative" ref={menuRef}>
                                    <Tooltips title="Export" placement="top" arrow={true}>
                                        <button
                                            className="menu-btn"
                                            onClick={() => setOpen((prev) => !prev)}
                                        >
                                            <MoreVertical size={24} />
                                        </button>
                                    </Tooltips>
                                    {open && (
                                        <div className="menu-popup">
                                            <ExportList
                                                data={ticketList}
                                                headers={exportHeaders}
                                                filename="Ticket.csv"
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
                                    {ticketStatusOptions?.map(status => {
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
                                    {(statusFilter !== 'All' || priorityFilter !== 'All') && (
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
                        <div className="content_box_auto">
                            <div className="employee-table-wrapper">
                                <table className="employee-table emp-t-6">
                                    <thead>
                                        <tr>
                                            <th>Subject</th>
                                            <th>Requested To</th>
                                            <th>Priority</th>
                                            <th>Creation Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    {(ticketListLoading || ticketList?.length > 0) ? (
                                        <tbody className={`${ticketListLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                            {ListData?.map(item => {
                                                const StatusIcon = statusConfig[item?.status]?.icon || XCircle;
                                                const statusClassName = statusConfig[item?.status]?.className;
                                                return (
                                                    <tr
                                                        key={item?.id}
                                                        className="employee-row"
                                                        onClick={() => navigate(`/ticket-details/${item.id}`)}
                                                    >
                                                        <td className="loadingtd">
                                                            <div className="department">{item?.subject}</div>
                                                        </td>
                                                        <td className="loadingtd">
                                                            <div className="department">{[item?.requested_to?.first_name, item?.requested_to?.last_name].filter(Boolean).join(" ")}</div>
                                                        </td>
                                                        <td className="loadingtd">
                                                            <div className="department">{showMastersValue(masterData, "20", item?.priority)}</div>
                                                        </td>
                                                        <td className="loadingtd">
                                                            <div className="department">{formatDate(item?.created_at)}</div>
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
                                        <tbody className="table_not_found">
                                            <tr>
                                                <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                                                    {(!ticketListLoading && ticketList?.length === 0) && (
                                                        <ListDataNotFound module="ticket" handleReset={resetFilters} />
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    )}

                                </table>

                                {(!ticketListLoading || showMoreLess) &&
                                    <div className="load-more-container">
                                        {(visibleCount < totalTicket) && (
                                            <button onClick={handleLoadMore} className="load-more-btn">
                                                {(ticketListLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                            </button>
                                        )}
                                        {/* Show Less button if all jobs are loaded */}
                                        {(visibleCount >= totalTicket && totalTicket > INITIAL_VISIBLE_COUNT) && (
                                            <button onClick={handleShowLess} className="load-more-btn">
                                                {(ticketListLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                            </button>
                                        )}
                                    </div>
                                }
                            </div>
                        </div>
                    </>
                </main>
            </div>
        </div >
    )
}
