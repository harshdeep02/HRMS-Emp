import React, { useState, useEffect, useRef } from "react";
// Icons used in the component
import {
    XCircle,
    CheckCircle2,
    Clock,
    LucideCalendarDays,
} from "lucide-react";
import SearchBox from "../../../utils/common/SearchBox.jsx";
// UPDATED: Re-added the DepartmentFilter import
import DynamicFilter from "../../../utils/common/DynamicFilter.jsx";
import DatePicker from "../../../utils/common/DatePicker/DatePicker.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import "./tableDetail.scss";
import DynamicLoader from "../../../utils/common/DynamicLoader/DynamicLoader.jsx";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";

// Initial number of leave history items to display
const INITIAL_VISIBLE_COUNT = 5;

export const EmpLeaves = () => {
    // --- STATE MANAGEMENT ---
    const [searchTerm, setSearchTerm] = useState("");
    const [leaveTypeFilter, setLeaveTypeFilter] = useState("All");
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const searchBoxRef = useRef();
    const leaveLoading = false
    const [view, setView] = useState('list');

    // --- DUMMY DATA & CONFIG ---

    const leaveSummaryData = [
        { id: "available", title: "Available Leaves", leaves: [{ type: "Casual leaves", count: 12 }, { type: "Sick leaves", count: 12 }, { type: "Earned leaves", count: 12 }] },
        { id: "booked", title: "Booked Leaves", leaves: [{ type: "Casual leaves", count: 8 }] },
        { id: "remaining", title: "Remaining Leaves", leaves: [{ type: "Casual leaves", count: 4 }, { type: "Sick leaves", count: 12 }, { type: "Earned leaves", count: 12 }] },
    ];

    const leaveHistoryData = [
        { id: 1, type: "Casual Leave", startDate: "02 Jun 2025", endDate: "03 Jun 2025", reason: "Some personal work in bank", status: "Approved" },
        { id: 2, type: "Sick Leave", startDate: "10 Jul 2025", endDate: "11 Jul 2025", reason: "Fever And Doctor's Appointment", status: "Approved" },
        { id: 3, type: "Maternity Leave", startDate: "01 Aug 2025", endDate: "31 Jan 2026", reason: "Childbirth And Recovery Period", status: "Approved" },
        { id: 4, type: "Annual Leave", startDate: "22 Dec 2025", endDate: "02 Jan 2026", reason: "Holiday Vacation With Family", status: "Declined" },
        { id: 5, type: "Sick Leave", startDate: "15 Jan 2026", endDate: "20 Jan 2026", reason: "Medical Recovery Period After Surgery", status: "Approved" },
        { id: 6, type: "Business Trip", startDate: "05 Feb 2026", endDate: "10 Feb 2026", reason: "Conference In New York", status: "Pending" },
        { id: 7, type: "Casual Leave", startDate: "15 Mar 2026", endDate: "15 Mar 2026", reason: "Family function", status: "Approved" },
        { id: 8, type: "Earned Leave", startDate: "01 Apr 2026", endDate: "10 Apr 2026", reason: "Extended vacation", status: "Pending" },
    ];

    // Data for the DepartmentFilter component, structured correctly for this page
    const leaveTypeOptions = [
        { label: "All Leave Types", value: "All" },
        { label: "Casual Leave", value: "Casual Leave" },
        { label: "Sick Leave", value: "Sick Leave" },
        { label: "Maternity Leave", value: "Maternity Leave" },
        { label: "Annual Leave", value: "Annual Leave" },
        { label: "Business Trip", value: "Business Trip" },
        { label: "Earned Leave", value: "Earned Leave" },
    ];

    const statusConfig = {
        Approved: { label: "Approved", icon: CheckCircle2, className: "approved" },
        Declined: { label: "Declined", icon: XCircle, className: "declined" },
        Pending: { label: "Pending", icon: Clock, className: "pending" },
    };

    // --- LOGIC FOR FILTERING ---

    useEffect(() => {
        let filtered = leaveHistoryData;

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.type.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (leaveTypeFilter !== "All") {
            filtered = filtered.filter(item => item.type === leaveTypeFilter);
        }

        if (selectedDate) {
            console.log("Date filtering logic would be applied here for:", selectedDate);
        }

        setFilteredLeaves(filtered);
    }, [searchTerm, leaveTypeFilter, selectedDate]);


    // --- HANDLER FUNCTIONS ---

    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    // UPDATED: The handler now expects the selected value directly from the custom component
    const handleLeaveTypeFilter = (selectedValue) => {
        setLeaveTypeFilter(selectedValue);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const resetFilters = () => {
        setSearchTerm("");
        setLeaveTypeFilter("All");
        setSelectedDate(null);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();
        }
    };

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleCount(prev => prev + 5);
            setIsLoadingMore(false);
        }, 500);
    };

    const handleShowLess = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleCount(INITIAL_VISIBLE_COUNT);
            setIsLoadingMore(false);
        }, 500);
    };

    const formatCount = (count) => {
        return count.toString().padStart(2, "0");
    };

    // --- RENDER ---
    return (
        <div className="otherDetailPageSroll  ">
            <div className="leave-summary-card">
                <h2 className="card-title">Leave Summary</h2>
                <div className="summary-content">
                    {leaveSummaryData.map((row) => (
                        <div className="leave-row" key={row.id}>
                            <div className="row-header">
                                <span className="icon"><LucideCalendarDays size={16} /></span>
                                <span className="row-title">{row.title}</span>
                            </div>
                            <div className="leaves-list">
                                {row?.leaves?.map((leave) => (
                                    <div className="leave-badge" key={leave.type}>
                                        <span className="leave-count">{formatCount(leave.count)}</span>
                                        <span className="leave-type">{leave.type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="detail-table-wrapper">
                <div className="box_head">
                    <h2>Leave History</h2>
                    <div className="toolbar_d">
                        <SearchBox
                            onSearch={handleSearch}
                            placeholder="Search by reason or type..."
                            ref={searchBoxRef}
                        />
                        <div className="toolbar-actions">
                            <div className="border_box">
                                {/* --- UPDATED PART --- */}
                                {/* Replaced the <select> element with the custom DepartmentFilter component */}
                                <DynamicFilter
                                    filterBy=""
                                    filterValue={leaveTypeFilter}
                                    onChange={handleLeaveTypeFilter}
                                    options={leaveTypeOptions}
                                />
                            </div>
                            <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                        </div>
                    </div>
                </div>
                {leaveLoading ? (
                    <>
                        <DynamicLoader mode='one' listType='emp-a-5' type={view} count={5} />

                    </>
                ) : filteredLeaves?.length > 0 ? (
                    <table className="detail-table emp-t-5">
                        <thead>
                            <tr></tr>
                        </thead>
                        <tbody>
                            {filteredLeaves?.slice(0, visibleCount).map((item) => {
                                const StatusIcon = statusConfig[item.status]?.icon || XCircle;
                                const statusClassName = statusConfig[item.status]?.className || 'default';
                                return (
                                    <tr key={item.id} className="detail_tr_row employee-row">
                                        <td><div className="department">{item.type}</div></td>
                                        <td><div className="department">{item.startDate}</div></td>
                                        <td><div className="department">{item.endDate}</div></td>
                                        <td><div className="contact-info"><span>{item.reason}</span></div></td>
                                        <td>
                                            <div className={`status-badge ${statusClassName}`}>
                                                <StatusIcon size={16} />
                                                <span>{statusConfig[item.status]?.label}</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (

                    <ListDataNotFound module="Leave Summary" handleReset={resetFilters} />

                )}
            </div>
            {!leaveLoading &&
                <div className="load-more-container">
                    {visibleCount < filteredLeaves.length && (
                        <button onClick={handleLoadMore} className="load-more-btn">
                            {isLoadingMore ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                        </button>
                    )}
                    {visibleCount >= filteredLeaves.length && filteredLeaves.length > INITIAL_VISIBLE_COUNT && (
                        <button onClick={handleShowLess} className="load-more-btn">
                            {isLoadingMore ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                        </button>
                    )}
                </div>
            }
        </div>
    );
};