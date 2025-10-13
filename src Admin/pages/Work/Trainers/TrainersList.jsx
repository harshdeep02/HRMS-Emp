import {
    useState,
    useEffect,
    useRef,
    useCallback,
} from "react";
import {
    MoreVertical,
    X,
    TrendingUp,
    UserPlus,
    Phone,
    Mail,
    SquareMenu,
    XCircle, // New icon for sorting
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import DynamicLoader from "../../../utils/common/DynamicLoader/DynamicLoader.jsx";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import SortFilter from "../../../utils/common/SortFilter.jsx"; // Assuming this component exists
import { useDispatch, useSelector } from "react-redux";
import { getTrainerList } from "../../../Redux/Actions/trainerActions.js";
import { trainerStatusOptions } from "../../../utils/Constant.js";
import ImportList from "../../../utils/common/Import/ImportList.jsx";
import ExportList from "../../../utils/common/Export/ExportList.jsx";
import { showMastersValue } from "../../../utils/helper.js";

const INITIAL_VISIBLE_COUNT = 9;

const TrainersList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Data from redux
    const trainerData = useSelector((state) => state?.trainerList);
    const trainerLists = trainerData?.data?.result || [];
    const totalTrainers = trainerData?.data?.count || 0;
    const trainerListLoading = trainerData?.loading || false;
    const metaData = trainerData?.data?.metadata || {};
    const masterData = useSelector(state => state?.masterData?.data);

    // --- State Management ---
    const [searchTerm, setSearchTerm] = useState("");
    const searchBoxRef = useRef();
    const [statusFilter, setStatusFilter] = useState("All");
    const [itemsPerPage, setItemsPerPage] = useState(INITIAL_VISIBLE_COUNT);
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [showMoreLess, setShowMoreLess] = useState(false);
    const menuRef = useRef(null);
    const [sortBy, setSortBy] = useState("recent"); // New state for sorting

    const statusConfig = trainerStatusOptions?.reduce((acc, status) => {
        if (!status?.id) return acc; // skip undefined values

        const label = status?.label || "All";
        const icon = status?.icon || SquareMenu; // fallback to Users if no mapping exists

        acc[status?.id] = {
            label,
            icon,
            className: label.replace(/\s+/g, "-").toLowerCase()
        };
        return acc;
    }, {});

    const fetchTrainerList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");

            const sendData = {
                fy,
                noofrec: itemsPerPage,
                currentpage: currentPage,
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(searchTerm && { search: searchTerm }),
                ...(sortBy && { sort_by: sortBy }), // backend should handle sort
            };
            const res = await dispatch(getTrainerList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching Trainer list:", error);
            setShowMoreLess(false);
        }
    }, [searchTerm, sortBy, statusFilter, itemsPerPage]);

    useEffect(() => {
        fetchTrainerList();
    }, [searchTerm, sortBy, statusFilter, itemsPerPage]);


    // --- Handlers ---
    const handleSearch = (query) => {
        setSearchTerm(query);
        setCurrentPage(1);
        setItemsPerPage(INITIAL_VISIBLE_COUNT);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        setCurrentPage(1);
        setItemsPerPage(INITIAL_VISIBLE_COUNT);
    };

    const handleStatusFilter = (newFilter) => {
        setStatusFilter(newFilter);
        setCurrentPage(1);
        setItemsPerPage(INITIAL_VISIBLE_COUNT); // reset count
    };

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setSortBy("recent");
        setCurrentPage(1);
        setItemsPerPage(INITIAL_VISIBLE_COUNT);
        if (searchBoxRef.current) searchBoxRef.current.clearInput();
    };

    const handleLoadMore = () => {
        setItemsPerPage(prev => prev + INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    };

    const handleShowLess = () => {
        setItemsPerPage(INITIAL_VISIBLE_COUNT);
        setCurrentPage(1);
        setShowMoreLess(true);
    };

    const exportHeaders = [
        { label: "Trainer Name", key: (item) => item?.trainer_name || "N/A" },
        { label: "Training Type", key: (item) => showMastersValue(masterData, "22", item?.training_type) || "N/A" },
        { label: "Email", key: (item) => item?.email || "N/A" },
        { label: "Phone", key: (item) => item?.contact_no || "N/A" },
        { label: "Status", key: (item) => statusConfig[item?.status]?.label || "N/A" },
    ];

    const handleImportRow = async (row) => {
        const payload = {
            trainer_name: row["Trainer Name"],
            training_type: row["Training Type"],
            email: row["Email"],
            contact_no: row["Phone"],
            status: row["Status"], // you may need to map back from label -> status code
        };
        // return dispatch(createNewTrainer(payload));
    };

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


    const ListData = (trainerListLoading && (!showMoreLess || trainerLists?.length === 0)) ? dummData : trainerLists;


    return (
        <div className="attendanceListMain">
            <div className="employee-dashboard-list empListMain">
                <div className="dashboard-sticky-header">
                    <header className="top-header">
                        <div className="header-left">
                            <div>
                                <h1>
                                    Trainers list
                                    <span className="total-count">
                                        <TrendingUp size={16} className="TrendingUp" />
                                        {metaData?.all}
                                    </span>
                                </h1>
                                <p>See all trainers list below</p>
                            </div>
                        </div>
                        <div className="header-right header_rightMain">
                            <div className="toolbar">
                                <SearchBox
                                    onSearch={handleSearch}
                                    placeholder="Search Trainer, Email..."
                                    ref={searchBoxRef}
                                />
                                <div className="toolbar-actions">
                                    <SortFilter
                                        sortBy={sortBy}
                                        onChange={handleSortChange}
                                    />
                                    <Tooltips title='Add New Trainer' placement="top" arrow={true}>
                                        <button className="add-employee-btn" onClick={() => navigate('/add-trainer')}><UserPlus size={16} /> </button>
                                    </Tooltips>
                                    <div className="relative" ref={menuRef}>
                                        <Tooltips
                                            title="Import & Export"
                                            placement="top"
                                            arrow={true}>
                                            <button
                                                className="menu-btn"
                                                onClick={() => setOpen((prev) => !prev)}>
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
                                                    data={trainerLists} // Use the filtered list for export
                                                    headers={exportHeaders}
                                                    filename="trainers.csv"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>


                <main className={`dashboard-content`}>
                    <aside className="filters-sidebar">
                        <div>
                            <ul>
                                {trainerStatusOptions?.map((status, index) => {
                                    const Icon = status?.icon || SquareMenu;
                                    let count = 0;
                                    if (status?.label === "All") {
                                        count = metaData?.all ?? 0;
                                    } else {
                                        count = metaData?.[status?.label?.toLowerCase()?.replace(" ", "")] ?? 0;
                                    }
                                    return (
                                        <li key={index}
                                            className={statusFilter === status?.id ? "active" : ""}
                                            onClick={() => handleStatusFilter(status?.id)}>
                                            <div className="status-label">
                                                <Icon size={16} strokeWidth={1.5} />
                                                <span>{status?.label}</span>
                                            </div>
                                            <span className="counts">({String(count).padStart(2, '0')})</span>
                                        </li>
                                    );
                                })}
                            </ul>
                            {(statusFilter !== "All") && (
                                <div className="clearBTN">
                                    <button className="clear-filters-btn" onClick={resetFilters}>
                                        <span>Clear filter</span>
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </aside>
                    <div className="content_box_auto">
                        <div className="employee-table-wrapper">
                            <table className="employee-table emp-t-5">
                                <thead>
                                    <tr>
                                        <th>TRAINER NAME</th>
                                        <th>TRAINING TYPE</th>
                                        <th>CONTACTS</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                {(trainerListLoading || trainerLists?.length > 0) ? (

                                    <tbody className={`${trainerListLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                        {ListData?.map((item) => {
                                            const StatusIcon = statusConfig[item?.status]?.icon || XCircle;
                                            const statusClassName = statusConfig[item?.status]?.className;

                                            return (
                                                <tr key={item?.id} className="employee-row"
                                                    onClick={() => navigate(`/trainer-details/${item?.id}`)}
                                                >
                                                    <td className="">
                                                        <div className="info_img loadingtd">
                                                            <div className="name loadingtd Semi_Bold">{item?.trainer_name}</div>
                                                        </div>
                                                    </td>
                                                    <td className="loadingtd">{showMastersValue(masterData, "22", item?.training_type)}</td>
                                                    <td>
                                                        <div className="contact-info">
                                                            <div className="loadingtd"><Mail size={14} /> <span>{item?.email}</span></div>
                                                            <div className="loadingtd gap_3"><Phone size={14} /> <span className="phone">{item?.contact_no}</span></div>
                                                        </div>
                                                    </td>
                                                    <td className="loadingtd">
                                                        <div className={`status-badge ${statusClassName}`}>
                                                            <StatusIcon size={14} style={{ marginRight: "6px" }} />
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
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                                                {(!trainerListLoading && trainerLists?.length === 0) && (
                                                    <ListDataNotFound module="job" handleReset={resetFilters} />
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>

                            <div className="load-more-container">
                                {itemsPerPage < totalTrainers && (
                                    <button onClick={handleLoadMore} className="load-more-btn">
                                        {(trainerListLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                    </button>
                                )}
                                {itemsPerPage >= totalTrainers &&
                                    totalTrainers > INITIAL_VISIBLE_COUNT && (
                                        <button onClick={handleShowLess} className="load-more-btn">
                                            {(trainerListLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                        </button>
                                    )}
                            </div>
                        </div>
                    </div>
                </main>

            </div>
        </div>
    );
};

export default TrainersList;