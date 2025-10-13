// AllOrganizationList.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    List,
    Mail,
    Phone,
    MoreVertical,
    XCircle,
    CheckCircle2,
    Clock,
    TrendingUp,
    UserPlus,
    CircleStop,
    Warehouse,
    Grid2x2,
    X,
    Ban,
    ShieldX,
    ShieldEllipsis,
    Download,
    Upload,
} from "lucide-react";
// import "./AllOrganizationList.scss"; //style
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import { getOrganizationList } from "../../../Redux/Actions/organizationActions.js";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import SortFilter from "../../../utils/common/SortFilter.jsx";
import { ShowMasterData } from "../../../utils/helper.js";
import DynamicLoader from "../../../utils/common/DynamicLoader/DynamicLoader.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import DatePicker from "../../../utils/common/DatePicker/DatePicker.jsx";
import DynamicFilter from "../../../utils/common/DynamicFilter.jsx";

const INITIAL_VISIBLE_COUNT = 9;

const AllOrganizationListApiData = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux data
    const organizationData = useSelector((state) => state?.organizationList);
    const organizationList = organizationData?.data?.result || [];
    const totalOrganizations = organizationData?.data?.count || 0;
    const organizationLoading = organizationData?.loading || false;
    const org_status = ShowMasterData("55");

    const statusOptions = [
        { id: "All", label: "All" },
        ...(org_status?.map((item) => ({
            id: item?.labelid,
            label: item?.label,
        })) || []),
    ];
    const orgTypeOptions = [
        { id: "All", label: "All" },
        { id: "Non-Profit Organization", label: "Non-Profit Organization" },
        { id: "Educational Institution", label: "Educational Institution" },
        { id: "Healthcare Provider", label: "Healthcare Provider" },
        { id: "Government Agency", label: "Government Agency" },
        { id: "Social Enterprise", label: "Social Enterprise" },
    ];
    const [typeFilter, setTypeFilter] = useState("All");

    const handleTypeFilter = (newType) => {
        setTypeFilter(newType);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };


    const iconMapping = {
        All: List,
        Active: CheckCircle2,
        "On Hold": CircleStop,
        "In Active": ShieldX,
        Terminated: ShieldEllipsis,
        "Notice period": Clock,
        Resigned: Ban,
    };

    const statusConfig = statusOptions?.reduce((acc, status) => {
        if (!status?.id) return acc;
        const label = status?.label || "All";
        const icon = iconMapping[label] || List;
        acc[status?.id] = {
            icon,
            className: label.replace(/\s+/g, "-").toLowerCase(),
        };
        return acc;
    }, {});

    const [searchTerm, setSearchTerm] = useState("");
    const searchBoxRef = useRef();
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [view, setView] = useState("list");
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    const getStatusById = (id) =>
        org_status?.find((item) => item.labelid === id)?.label || "";

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

    const fetchOrganizationList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");
            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(typeFilter && typeFilter !== "All" && { organization_type: typeFilter }),
                ...(searchTerm && { search: searchTerm }),
                ...(sortBy && { sort_by: sortBy }),
            };
            await dispatch(getOrganizationList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching organization list:", error);
            setShowMoreLess(false);
        }
    }, [searchTerm, statusFilter, sortBy, visibleCount]);

    useEffect(() => {
        fetchOrganizationList();
    }, [searchTerm, statusFilter, sortBy, visibleCount]);

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setSortBy("recent");
        setShowMoreLess(false);
        searchBoxRef.current?.clearInput();
    };

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 6);
        setShowMoreLess(true);
    };

    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    };

    const clearFilters = () => {
        setStatusFilter("All");
    };

    const handleStatusFilter = (newFilter) => {
        setStatusFilter(newFilter);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    return (
        <div className="employee-dashboard-list empListMain">
            <div className="dashboard-sticky-header">
                <header className="top-header">
                    <div className="header-left">
                        <div>
                            <h1>
                                All Organizations List
                                <span className="total-count">
                                    {" "}
                                    <TrendingUp size={16} className="TrendingUp" />
                                    {totalOrganizations}
                                </span>
                            </h1>
                            <p>Complete List Of Available Organizations</p>
                        </div>
                    </div>

                    <div className="header-right header_rightMain">

                        <div className="toolbar">
                            <SearchBox
                                onSearch={handleSearch}
                                placeholder="Search Organization..."
                                ref={searchBoxRef}
                            />

                            <div className="toolbar-actions">
                                <DynamicFilter
                                    filterBy=""
                                    filterValue={typeFilter}
                                    onChange={handleTypeFilter}
                                />
                                <SortFilter sortBy={sortBy} onChange={handleSortChange} />
                            </div>
                        </div>

                        <DatePicker />
                        <Tooltips title="Add New Organization" placement="top" arrow={true}>
                            <button
                                className="add-employee-btn"
                                onClick={() => navigate("/add-organization")}
                            >
                                <UserPlus size={16} />{" "}
                            </button>
                        </Tooltips>

                        <div className="relative" ref={menuRef}>
                            <button
                                className="menu-btn"
                                onClick={() => setOpen((prev) => !prev)}
                            >
                                <MoreVertical size={24} />
                            </button>

                            {open && (
                                <div className="menu-popup">
                                    <button className="menu-item">
                                        <Download size={20} />
                                        <span>Import</span>
                                    </button>
                                    <button className="menu-item">
                                        <Upload size={20} />
                                        <span>Export</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            </div>

            {organizationLoading && !showMoreLess ? (
                <DynamicLoader
                    listType="org"
                    type={view}
                    count={9}
                    closeBtnValue={statusFilter !== "All" ? 73 : ""}
                />
            ) : (
                <main className={`dashboard-content`} >
                    <>
                        {/* {organizationList?.length > 0 ? */}
                        <aside className="filters-sidebar">
                            <div>
                                <ul>
                                    {statusOptions?.map((status) => {
                                        const count =
                                            status.id === "All"
                                                ? totalOrganizations
                                                : organizationList?.filter(
                                                    (e) => e?.organization?.status === status.id
                                                )?.length;
                                        const Icon = statusConfig[status.id]?.icon || List;
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
                                                <span className="counts">
                                                    ({String(count).padStart(2, "0")})
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <div className="clearBTN">
                                    {statusFilter !== "All" && (
                                        <button className="clear-filters-btn" onClick={clearFilters}>
                                            <span>Clear Filter</span>
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </aside>
                        {/* :
                            <div className="filters-sidebar-404"></div>
                        } */}

                        {view === "list" && (
                            <div className="employee-table-wrapper">
                                {organizationList?.length > 0 ? (
                                    <table className="employee-table emp-t-4">
                                        <thead>
                                            <tr>
                                                <th>Organization</th>
                                                <th>Organization Type</th>
                                                <th>Contacts</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {organizationList?.map((org) => {
                                                const StatusIcon =
                                                    statusConfig[getStatusById(org?.organization?.status)]
                                                        ?.icon || XCircle;
                                                const statusClassName = (
                                                    getStatusById(org?.organization?.status) || ""
                                                )
                                                    .toLowerCase()
                                                    .replace(" ", "-");

                                                return (
                                                    <tr
                                                        key={org?.id}
                                                        className="organization-row"
                                                        onClick={() =>
                                                            navigate(`/organization-details/${org?.id}`)
                                                        }
                                                    >
                                                        <td>
                                                            <div className="info_img">
                                                                <img
                                                                    src={
                                                                        JSON.parse(
                                                                            org?.organization?.logo || "[]"
                                                                        )?.[0]?.url || ""
                                                                    }
                                                                    alt={org?.organization?.name || "-"}
                                                                    className="avatar"
                                                                />
                                                                <div className="name">
                                                                    {org?.organization?.name}
                                                                </div>
                                                                <div className="email">
                                                                    {org?.organization?.email}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="department">
                                                                {org?.organization?.type}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="contact-info">
                                                                {org?.organization?.contact_person && (
                                                                    <div>
                                                                        {org?.organization?.contact_person}
                                                                    </div>
                                                                )}
                                                                {org?.organization?.contact_number && (
                                                                    <div>
                                                                        <Phone size={14} />{" "}
                                                                        <span className="phone">
                                                                            {org?.organization?.contact_number}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div
                                                                className={`status-badge ${statusClassName}`}
                                                            >
                                                                <StatusIcon size={16} />
                                                                <span>
                                                                    {getStatusById(org?.organization?.status)}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <>
                                        {!organizationLoading &&
                                            organizationList?.length === 0 && (
                                                <div className="no-results-container">
                                                    <div className="no-results-animation">
                                                        <iframe
                                                            src="https://lottie.host/embed/4a834d37-85a4-4cb7-b357-21123d50c03a/JV0IcupZ9W.json"
                                                            frameBorder="0"
                                                            style={{ width: "100%", height: "250px" }}
                                                        ></iframe>
                                                    </div>
                                                    <h2 className="no-results-title">
                                                        No Organizations Found
                                                    </h2>
                                                    <p className="no-results-text">
                                                        We couldn't find any organizations matching your
                                                        criteria. Try adjusting your filters or search term.
                                                    </p>
                                                    <button
                                                        className="reset-filters-btn"
                                                        onClick={resetFilters}
                                                    >
                                                        Reset Filters
                                                    </button>
                                                </div>
                                            )}
                                    </>
                                )}

                                <div className="load-more-container">
                                    {visibleCount < totalOrganizations && (
                                        <button onClick={handleLoadMore} className="load-more-btn">
                                            {organizationLoading && showMoreLess ? (
                                                <LoadingDots color="#8a3ffc" size={6} />
                                            ) : (
                                                "Show More"
                                            )}
                                        </button>
                                    )}
                                    {visibleCount >= totalOrganizations &&
                                        totalOrganizations > INITIAL_VISIBLE_COUNT && (
                                            <button onClick={handleShowLess} className="load-more-btn">
                                                {organizationLoading && showMoreLess ? (
                                                    <LoadingDots color="#8a3ffc" size={6} />
                                                ) : (
                                                    "Show Less"
                                                )}
                                            </button>
                                        )}
                                </div>
                            </div>
                        )}
                    </>
                </main>
            )}
        </div>
    );
};

export default AllOrganizationListApiData;
