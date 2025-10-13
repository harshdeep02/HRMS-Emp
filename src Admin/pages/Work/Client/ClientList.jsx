// ClientList.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { List, Mail, Phone, MoreVertical, Grid2x2, X, TrendingUp, UserPlus, XCircle, Check, CheckCircle2, SquareMenu } from "lucide-react";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import SortFilter from "../../../utils/common/SortFilter.jsx";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import defaultImage from "../../../assets/default-user.png";
import ImportList from "../../../utils/common/Import/ImportList.jsx";
import ExportList from "../../../utils/common/Export/ExportList.jsx";
import { useNavigate } from "react-router-dom";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getClientList } from "../../../Redux/Actions/clientActions.js";
import DynamicLoader from "../../../utils/common/DynamicLoader/DynamicLoader.jsx";
import { clientStatusOptions } from "../../../utils/Constant.js";
const INITIAL_VISIBLE_COUNT = 9;

const ClientList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const clientData = useSelector((state) => state?.clientList);
    const clientLists = clientData?.data?.result || [];
    const totalClients = clientData?.data?.count || 0;
    const clientListLoading = clientData?.loading || false;
    const updateStatus = useSelector((state) => state?.updateClientStatus);
    const metaData = clientData?.data?.metadata;

    const statusConfig = clientStatusOptions?.reduce((acc, status) => {
        if (!status?.id) return acc; // skip undefined values
        acc[status?.id] = {
            label: status?.label,
            icon: status?.icon,
            className: status?.label.replace(/\s+/g, "-").toLowerCase()
        };
        return acc;
    }, {});

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("recent");
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [view, setView] = useState('list');
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [open, setOpen] = useState(false);
    const searchBoxRef = useRef();
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

    const fetchClientList = useCallback(async () => {
        try {
            const sendData = {
                noofrec: visibleCount,
                currentpage: currentPage, // Assuming pagination is handled by 'noofrec' for now
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(searchTerm && { search: searchTerm }),
                ...(sortBy && { sort_by: sortBy }),
            };
            const res = await dispatch(getClientList(sendData));

        } catch (error) {
            console.error("Error fetching client list:", error);
        } finally {
            setShowMoreLess(false);
        }
    }, [searchTerm, statusFilter, sortBy, visibleCount]);

    useEffect(() => {
        fetchClientList();
    }, [searchTerm, statusFilter, sortBy, visibleCount]);


    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setSortBy("recent");
        setShowMoreLess(false);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        searchBoxRef.current?.clearInput();
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

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    // --- Export Headers for Client Table ---
    const exportHeaders = [
        {
            label: "Client Name",
            key: (item) => item?.client_name || "N/A",
        },
        {
            label: "Client Image",
            key: (item) => item?.client_image || "N/A",
        },
        {
            label: "Company Name",
            key: (item) => item?.company_name || "N/A",
        },
        {
            label: "Email",
            key: (item) => item?.email || "N/A",
        },
        {
            label: "Mobile No",
            key: (item) => item?.mobile_no || "N/A",
        },
        {
            label: "Status",
            key: (item) => statusConfig[item?.status]?.label || "Unknown",
        },
    ];

    const handleImportRow = async (row) => {
        const payload = {
            client_name: row["Client Name"],
            client_image: row["Client Image"],
            company_name: row["Company Name"],
            email: row["Email"],
            mobile_no: row["Mobile No"],
            status: row["Status"], // might need reverse mapping if API expects raw value, not label
        };
        // return dispatch(createNewClient(payload));
    };


    const clientImage = (img) => img
        ? (() => {
            try {
                return JSON.parse(img);
            } catch {
                return img;
            }
        })()
        : defaultImage;


    const dummData = Array.from({ length: INITIAL_VISIBLE_COUNT }, (_, i) => ({
        id: i,
        first_name: "",
        last_name: "",
        job_opening: { job_title: "" },
        email: "",
        mobile_no: "",
        status: "",
        user_image: null,
    }));


    const ListData = (clientListLoading && (!showMoreLess || clientLists?.length === 0)) ? dummData : clientLists;

    return (
        <div className="employee-dashboard-list clientListMain">
            <div className="dashboard-sticky-header">
                <header className="top-header">
                    <div className="header-left">
                        <div>
                            <h1>Clients List
                                <span className="total-count">
                                    <TrendingUp size={16} className="TrendingUp" />
                                    {metaData?.all}
                                </span>
                            </h1>
                            <p>See All Clients List Below</p>
                        </div>
                    </div>
                    <div className="header-right header_rightMain">
                        <div className="toolbar">
                            <SearchBox
                                onSearch={handleSearch}
                                placeholder="Search Client..."
                                ref={searchBoxRef}
                            />
                            <div className="toolbar-actions">
                                <div className="view-toggle">
                                    <Tooltips
                                        title='Table View'
                                        placement="top" arrow={true}
                                    >
                                        <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}><List size={20} /></button>
                                    </Tooltips>
                                    <Tooltips
                                        title='Card View'
                                        placement="top" arrow={true}
                                    >
                                        <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}><Grid2x2 size={20} strokeWidth={1.5} /></button>
                                    </Tooltips>
                                </div>
                                <SortFilter
                                    sortBy={sortBy}
                                    onChange={handleSortChange}
                                />
                            </div>
                        </div>
                        <Tooltips
                            title='Add New Client'
                            placement="top" arrow={true}
                        >
                            <button className="add-employee-btn"><UserPlus size={16} onClick={() => navigate('/add-client')} /></button>
                        </Tooltips>

                        <div className="relative" ref={menuRef}>
                            <button className="menu-btn" onClick={() => setOpen((prev) => !prev)}><MoreVertical size={24} /></button>
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
                                        data={clientLists}
                                        headers={exportHeaders}
                                        filename="clients.csv"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            </div>


            <main className={`dashboard-content`}>
                <aside className="filters-sidebar">
                    <div>
                        <ul>
                            {clientStatusOptions?.map((status, index) => {
                                const Icon = statusConfig[status.id]?.icon || SquareMenu;
                                let count = 0;
                                if (status?.label === "All") {
                                    count = metaData?.all ?? 0;
                                } else {
                                    count = metaData?.[status?.label.toLowerCase().replace(" ", "")] ?? 0;
                                }
                                return (
                                    <li key={index} className={statusFilter === status?.id ? "active" : ""} onClick={() => handleStatusFilter(status?.id)}>
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

                {view === 'list' && (
                    <div className="employee-table-wrapper">
                        <table className="employee-table emp-t-4">
                            <thead>
                                <tr>
                                    <th>Client Name</th>
                                    <th>Company Name</th>
                                    <th>Contacts</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            {(clientListLoading || clientLists?.length > 0) ? (
                                <tbody className={`${clientListLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                    {ListData?.map(client => {
                                        const StatusIcon = statusConfig[client?.status]?.icon || XCircle;
                                        const statusClassName = statusConfig[client?.status]?.className;
                                        return (
                                            <tr key={client?.id} className="employee-row"
                                                onClick={() => navigate(`/client-details/${client?.id}`)}
                                            >
                                                <td className="td">

                                                    <div className="info_img loadingImg">
                                                        <img src={clientImage(client?.client_image)} alt={client?.client_name} className="avatar" />
                                                        <div className="name Semi_Bold loadingtdsmall">{client?.client_name}</div>
                                                    </div>



                                                </td>
                                                <td className="loadingtd">
                                                    <div className="department ">{client?.company_name}</div>
                                                </td>
                                                <td className="td">
                                                    <div className="contact-info ">
                                                        <div className="loadingtdbig"><Mail size={14} /> <span>{client?.email}</span></div>
                                                        <div className="loadingtdbig gap_3 "><Phone size={14} /> <span className="phone">{client?.mobile_no}</span></div>
                                                    </div>
                                                </td>
                                                <td className="loadingtd td">
                                                    <div className={`status-badge ${statusClassName}`}>
                                                        <StatusIcon size={16} />
                                                        <span>{statusConfig[client?.status]?.label || ''}</span>
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
                                            {(!clientListLoading && clientLists?.length === 0) && (
                                                <ListDataNotFound module="clients" handleReset={resetFilters} />
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>

                        <div className="load-more-container">
                            {visibleCount < totalClients && (
                                <button onClick={handleLoadMore} className="load-more-btn">
                                    {(clientListLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                </button>
                            )}
                            {(visibleCount >= totalClients && totalClients > INITIAL_VISIBLE_COUNT) && (
                                <button onClick={handleShowLess} className="load-more-btn">
                                    {(clientListLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="content_box_auto">
                    {view === 'grid' && (
                        <div className="grid_cards">
                            {(clientListLoading || clientLists?.length > 0) ? (
                                <section className={`employee-list-section ${view}-view  ${clientListLoading && !showMoreLess ? 'grid_cards_loading' : ''}`}>
                                    {ListData?.map(client => {
                                        const StatusIcon = statusConfig[client?.status]?.icon || XCircle;
                                        const statusClassName = statusConfig[client?.status]?.className;
                                        return (
                                            <div key={client?.id} className="employee-card" onClick={() => navigate(`/client-details/${client?.id}`)}>
                                                <div className="top_info">
                                                    <div className="employee-info info_img">
                                                        <img src={clientImage(client?.client_image)} alt={client?.client_name} className="avatar" />
                                                    </div>
                                                    <div className="employee-info">
                                                        <div className="name">{client?.client_name}</div>
                                                        <div className="status_">
                                                            <div className={`status-badge ${statusClassName}`}>
                                                                <StatusIcon size={16} />
                                                                <span>{statusConfig[client?.status]?.label || ""}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="contact-info">
                                                    <div><Mail size={16} strokeWidth={1.5} /> <span>{client?.company_name}</span></div>
                                                    <div><Mail size={16} strokeWidth={1.5} /> <span>{client?.email}</span></div>
                                                    <div><Phone size={16} strokeWidth={1.5} /> <span>{client.mobile_no}</span></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </section>
                            ) : (
                                <>
                                    {!clientListLoading && clientLists?.length === 0 && (
                                        <ListDataNotFound module="clients" handleReset={resetFilters} />
                                    )}
                                </>
                            )}

                            {(!clientListLoading || showMoreLess) &&
                                <div className="load-more-container">
                                    {visibleCount < totalClients && (
                                        <button onClick={handleLoadMore} className="load-more-btn">
                                            {(clientListLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                        </button>
                                    )}
                                    {(visibleCount >= totalClients && totalClients > INITIAL_VISIBLE_COUNT) && (
                                        <button onClick={handleShowLess} className="load-more-btn">
                                            {(clientListLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                        </button>
                                    )}
                                </div>
                            }
                        </div>
                    )}
                </div>
            </main>

        </div>
    );
};

export default ClientList;