import { useState, useEffect, useRef, useCallback } from "react";
import {
    Phone,
    MoreVertical,
    XCircle,
    TrendingUp,
    UserPlus,
    X,
    Download,
    Upload,
    SquareMenu,
    UserPen,
} from "lucide-react";
// import "./AllOrganizationList.scss";
import { useNavigate } from "react-router-dom";
import Tooltips from "../../../../utils/common/Tooltip/Tooltips.jsx";
import SearchBox from "../../../../utils/common/SearchBox.jsx";
import SortFilter from "../../../../utils/common/SortFilter.jsx";
import DynamicFilter from "../../../../utils/common/DynamicFilter.jsx";
import '../../../EmployeeOnboarding/EmployeeList/EmployeeList.scss'
import { useDispatch, useSelector } from "react-redux";
import { showMasterData, showMastersValue } from "../../../../utils/helper.js";
import { organizationStatusOptions } from "../../../../utils/Constant.js";
import { getOrganizationList } from "../../../../Redux/Actions/Settings/organizationActions.js";
import LoadingDots from "../../../../utils/common/LoadingDots/LoadingDots.jsx";
import ListDataNotFound from "../../../../utils/common/ListDataNotFound.jsx";
import '../OrganizationAddDetails/Organization.scss'
import defaultImage from "../../../../assets/default-user.png";
const INITIAL_VISIBLE_COUNT = 9;

const AllOrganizationList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux data
    const organizationData = useSelector((state) => state?.organizationList);
    const organizationList = organizationData?.data?.organisations || [];
    const metaData = organizationData?.data?.metadata || {};
    const totalOrganizations = organizationData?.data?.count || 0;
    const organizationLoading = organizationData?.loading || false;
    const masterData = useSelector(state => state?.masterData?.data);
    const org_type_options = showMasterData("23");

    const statusConfig = organizationStatusOptions?.reduce((acc, status) => {
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
    const [statusFilter, setStatusFilter] = useState("All");
    const [orgTypeFilter, setOrgTypeFilter] = useState("All");
    const [sortBy, setSortBy] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

    const searchBoxRef = useRef();
    const [view, setView] = useState("list");
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
        

    const fetchOrganizationList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");
            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(sortBy && { sort_by: sortBy }),
                ...(searchTerm && { search: searchTerm }),
                ...(orgTypeFilter && orgTypeFilter !== "All" && { org_type: orgTypeFilter }),
            };
            await dispatch(getOrganizationList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching organization list:", error);
            setShowMoreLess(false);
        }
    }, [dispatch, searchTerm, statusFilter, sortBy, visibleCount, currentPage, orgTypeFilter]);

    useEffect(() => {
        fetchOrganizationList();
    }, [dispatch, searchTerm, statusFilter, currentPage, sortBy, visibleCount, orgTypeFilter]);

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setSortBy("recent");
        setShowMoreLess(false);
        setOrgTypeFilter("All");
        if (searchBoxRef.current) searchBoxRef?.current?.clearInput();
    };

    const handleOrgTypeFilter = (newFilter) => {
        setOrgTypeFilter(newFilter);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 6);
        setShowMoreLess(true);
    }
    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    }

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

    const getOrgLogo = (img) => img
        ? (() => {
            try {
                return JSON.parse(img);
            } catch {
                return img;
            }
        })()
        : defaultImage;

    const dummData = Array.from({ length: INITIAL_VISIBLE_COUNT }, (_, i) => ({

    }));


    const ListData = (organizationLoading && !showMoreLess) ? dummData : organizationList;

    return (
        <div className="settingOrganizationListMain">
            <div className="employee-dashboard-list empListMain">
                <div className="dashboard-sticky-header">
                    <header className="top-header">
                        <div className="header-left">
                            <div>
                                <h1>
                                    All Organizations List
                                    <span className="total-count">
                                        <TrendingUp size={16} className="TrendingUp" />
                                        {metaData?.all}
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
                                        filterBy="org_type"
                                        filterValue={orgTypeFilter}
                                        onChange={handleOrgTypeFilter}
                                        options={org_type_options?.map((item) => ({
                                            value: item?.id,
                                            label: item?.label,
                                        })) || []}
                                    />
                                    <SortFilter
                                        sortBy={sortBy}
                                        onChange={handleSortChange}
                                    />
                                </div>
                            </div>
                            <Tooltips title="Add New Organization" placement="top" arrow={true}>
                                <button
                                    className="add-employee-btn"
                                    onClick={() => navigate("/settings/add-organization-details")}
                                >
                                    <UserPlus size={16} />
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
                                        <button className="menu-item"><Download size={20} /><span>Import</span></button>
                                        <button className="menu-item"><Upload size={20} /><span>Export</span></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>
                </div>

                <main className={`dashboard-content`} >
                    <aside className="filters-sidebar">
                        <div>
                            <ul>
                                {organizationStatusOptions?.map((status, index) => {
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
                                {(statusFilter !== "All" || orgTypeFilter !== "All") && (
                                    (!organizationLoading && !showMoreLess) &&
                                    <button className="clear-filters-btn" onClick={resetFilters}>
                                        <span>Clear filter</span>
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </aside>

                    <div className="employee-table-wrapper">
                        <table className="employee-table Organization-4 emp-t-4">
                            <thead>
                                <tr>
                                    <th>Organization</th>
                                    <th>Organization Type</th>
                                    <th>Contacts</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            {(organizationLoading || organizationList?.length > 0) ? (
                                <tbody className={`${organizationLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                    {ListData?.map((org) => {
                                        const StatusIcon = statusConfig[org?.status]?.icon || XCircle;
                                        const statusClassName = statusConfig[org?.status]?.className;

                                        return (
                                            <tr
                                                key={org?.id}
                                                className="employee-row"
                                                onClick={() => navigate(`/settings/organization-details/${org?.id}`)}
                                            >
                                                <td className="smalltd">
                                                    {/* Original HTML structure without extra wrappers */}
                                                    <div className="info_img">
                                                        <div className="loadingImg">
                                                            <img
                                                                src={getOrgLogo(org?.company_logo)} alt={org?.organisation_name}
                                                                className="avatar"
                                                            />
                                                        </div>
                                                        <div className="contact-info">
                                                            <div className="name Semi_Bold loadingtdTOP">
                                                                {org?.organisation_name}
                                                            </div>
                                                            <div className="emailS loadingtdBOTTOM">
                                                                {org?.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="department loadingtd">
                                                        {showMastersValue(masterData, "23", org?.organization_type)}
                                                    </div>
                                                </td>
                                                <td className=" ">
                                                    <div className="contact-info ">
                                                        <div className=" loadingtdTOP">
                                                            {org?.contactPerson && (
                                                                <>
                                                                    <UserPen size={14} />{" "}
                                                                    {org?.contactPerson}
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="loadingtdBOTTOM ">
                                                            {org?.mobile_no && (
                                                                <>
                                                                    <Phone size={14} />{" "}
                                                                    <span className="phone  ">
                                                                        {org?.mobile_no}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="loadingtd">
                                                    <div className={`status-badge ${statusClassName}`}>
                                                        <StatusIcon size={16} />
                                                        <span>{statusConfig[org?.status]?.label || ''}</span>
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
                                            {(!organizationLoading && organizationList?.length === 0) && (
                                                <ListDataNotFound module="organizations" handleReset={resetFilters} />
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>

                        {(!organizationLoading || showMoreLess) &&
                            <div className="load-more-container">
                                {(visibleCount < totalOrganizations) && (
                                    <button onClick={handleLoadMore} className="load-more-btn">
                                        {(organizationLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                    </button>
                                )}
                                {(visibleCount >= totalOrganizations && totalOrganizations > INITIAL_VISIBLE_COUNT) && (
                                    <button onClick={handleShowLess} className="load-more-btn">
                                        {(organizationLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
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

export default AllOrganizationList;