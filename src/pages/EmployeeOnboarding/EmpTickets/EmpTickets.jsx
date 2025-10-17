import React, { useState, useEffect, useRef, useCallback } from "react";
// Icons used in the component
import {
    XCircle,
    Calendar,
} from "lucide-react";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import DynamicFilter from "../../../utils/common/DynamicFilter.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
// This component uses the same SCSS file
import "../Leaves/tableDetail.scss";
import SortFilter from "../../../utils/common/SortFilter.jsx";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showMasterData, showMastersValue } from "../../../utils/helper.js";
import { ticketStatusOptions } from "../../../utils/Constant.js";
import { getTicketList } from "../../../Redux/Actions/ticketActions.js";
import { formatDate } from "../../../utils/common/DateTimeFormat.js";
import { getUserData } from "../../../services/login.js";

// Initial number of items to display
const INITIAL_VISIBLE_COUNT = 6;

export const EmpTickets = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = getUserData();

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
    const [isLoadingMore, setIsLoadingMore] = useState(false);
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

    const fetchTicketList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");

            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
                user_id: id,
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(priorityFilter && priorityFilter !== "All" && { priority: priorityFilter }),
                ...(searchTerm && { search: searchTerm }),
                ...(sortBy && { sort_by: sortBy }), // backend should handle sort
            };
            const res = await dispatch(getTicketList(sendData));
            setIsLoadingMore(false);
        } catch (error) {
            console.error("Error fetching Ticket list:", error);
            setIsLoadingMore(false);
        }
    }, [searchTerm, sortBy, statusFilter, priorityFilter, visibleCount]);

    useEffect(() => {
        fetchTicketList();
    }, [searchTerm, sortBy, statusFilter, priorityFilter, visibleCount]);

    // --- HANDLER FUNCTIONS ---
    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handlePriorityFilter = (selectedValue) => {
        setPriorityFilter(selectedValue);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter('All');
        setPriorityFilter("All");
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();
        }
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + INITIAL_VISIBLE_COUNT);
        setIsLoadingMore(true);
    };

    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setIsLoadingMore(true);
    };


    // --- RENDER ---
    const dummData = Array.from({ length: INITIAL_VISIBLE_COUNT }, (_, i) => ({
        // id: i,
        // name: "",
        // email: "",
        // mobile_no: " ",
        // department: "",
        // status: " "
    }));

    // ❗ 2 new loding
    const ListData = (ticketListLoading && !isLoadingMore) ? dummData : ticketList;

    return (
        <>
            <div className="detail-table-wrapper">
                <div className="box_head">
                    {/* Updated Title */}
                    <h2>Tickets Summary</h2>
                    <div className="toolbar_d">
                        {/* Updated Search Placeholder */}
                        <SearchBox onSearch={handleSearch} placeholder="Search Requested To..." ref={searchBoxRef} />

                        <div className="toolbar-actions">
                            <div className="border_box">
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
                            <div className="border_box">
                                <DynamicFilter
                                    filterBy="status"
                                    filterValue={statusFilter}
                                    onChange={handleStatusFilter}
                                    options={ticketStatusOptions?.filter((item) => item?.label !== "All")?.map((item) => ({
                                        value: item?.id,
                                        label: item?.label,
                                    })) || []}
                                />
                            </div>
                            <div className="border_box">
                                {/* <SortFilter
                                    sortBy={sortBy}
                                // onChange={handleSortChange}
                                /> */}
                            </div>
                        </div>
                        {/* Added Filter Icon from Screenshot */}
                    </div>
                </div>
                {/* {ticketsLoading ? (
                    <>
                        <DynamicLoader mode='one' listType='emp-a-5' type={view} count={6} />
                    </>
                ) : */}
                {/* {filteredTickets?.length > 0 ? ( */}
                <table className="detail-table emp-t-5 project-table">
                    <thead>
                        <tr>
                            {/* Updated Table Headers */}
                            <th>SUBJECT</th>
                            <th>REQUESTED TO</th>
                            <th>PRIORITY</th>
                            <th>CREATION DATE</th>
                            <th className="status-badge">STATUS</th>
                        </tr>
                    </thead>
                    {(ticketListLoading || ticketList?.length > 0) ? (
                        <tbody className={`${ticketListLoading && !isLoadingMore ? 'LoadingList' : ''}`}>
                            {ListData?.map((item) => {
                                const StatusIcon = statusConfig[item?.status]?.icon || XCircle;
                                const statusClassName = statusConfig[item?.status]?.className || 'default';
                                return (
                                    <tr key={item?.id} className="employee-row detail_tr_row">
                                        {/* Updated Table Data */}
                                        <td><div className="subject-link loadingtd Semi_Bold purplle">{item?.subject}</div></td>
                                        <td><div className="text-secondary loadingtd">{[item?.requested_to?.first_name, item?.requested_to?.last_name].filter(Boolean).join(" ")}</div></td>
                                        <td><div className={`priority-badge loadingtd priority-`}>{showMastersValue(masterData, "20", item?.priority)}</div></td>
                                        <td>
                                            <div className="dat e-item date-range loadingtd">
                                                <div className="date-item">  <Calendar size={14} />
                                                    <span>{formatDate(item?.created_at)}</span></div>
                                            </div>
                                        </td>
                                        <td className="loadingtd" style={{ minWidth: '160px' }}>
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
                                <td colSpan={4} style={{ textAlign: 'center', paddingLeft: '160px' }}>
                                     {(!ticketListLoading && ticketList?.length === 0) && (
                                    <ListDataNotFound module="Tickets" handleReset={resetFilters} />
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>
            {(!ticketListLoading || isLoadingMore) &&
                <div className="load-more-container" style={{ marginTop: '-1px' }}>
                    {visibleCount < totalTicket && (
                        <button onClick={handleLoadMore} className="load-more-btn">
                            {(ticketListLoading || isLoadingMore) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                        </button>
                    )}
                    {visibleCount >= totalTicket && totalTicket > INITIAL_VISIBLE_COUNT && (
                        <button onClick={handleShowLess} className="load-more-btn">
                            {(ticketListLoading || isLoadingMore) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                        </button>
                    )}
                </div>
            }
        </>

    );
};