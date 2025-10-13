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
    CalendarArrowUp,
    CalendarArrowDown,
    SquareMenu,
    XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import DynamicLoader from "../../../utils/common/DynamicLoader/DynamicLoader.jsx";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import SortFilter from "../../../utils/common/SortFilter.jsx";
import ImportList from "../../../utils/common/Import/ImportList.jsx";
import ExportList from "../../../utils/common/Export/ExportList.jsx";
import { useDispatch, useSelector } from "react-redux";
import { trainingStatusOptions } from "../../../utils/Constant.js";
import { getTrainingList } from "../../../Redux/Actions/trainingActions.js";
import { formatDate } from "../../../utils/common/DateTimeFormat.js";
import { showMastersValue } from "../../../utils/helper.js";

const INITIAL_VISIBLE_COUNT = 7;


const TrainingList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const trainingData = useSelector((state) => state?.trainingList);
    const trainingLists = trainingData?.data?.result || [];
    const totalTrainings = trainingData?.data?.count || 0;
    const trainingListLoading = trainingData?.loading || false;
    const updateStatus = useSelector((state) => state?.updateTrainingStatus);
    const metaData = trainingData?.data?.metadata || {};
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

    const statusConfig = trainingStatusOptions?.reduce((acc, status) => {
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

    const fetchTrainingList = useCallback(async () => {
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
            const res = await dispatch(getTrainingList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching Training list:", error);
            setShowMoreLess(false);
        }
    }, [searchTerm, sortBy, statusFilter, itemsPerPage]);

    useEffect(() => {
        fetchTrainingList();
    }, [searchTerm, sortBy, statusFilter, itemsPerPage]);


    // --- Handlers ---
    const handleSearch = (query) => {
        setSearchTerm(query);
        setCurrentPage(1);
        setItemsPerPage(INITIAL_VISIBLE_COUNT);
    };

    const handleStatusFilter = (newValue) => {
        setStatusFilter(newValue);
        setCurrentPage(1);
        setItemsPerPage(INITIAL_VISIBLE_COUNT);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        setCurrentPage(1);
        setItemsPerPage(INITIAL_VISIBLE_COUNT);
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

    // --- Corrected headers for ExportList ---
    const exportHeaders = [
        { label: "Training Type", key: (item) => showMastersValue(masterData, "22", item?.training_type) || "N/A" },
        { label: "Trainer Name", key: (item) => item?.trainer?.trainer_name || "N/A" },
        { label: "Training Cost", key: (item) => item?.training_cost || "N/A" },
        { label: "Start Date", key: (item) => formatDate(item?.start_date) || "N/A" },
        { label: "End Date", key: (item) => formatDate(item?.end_date) || "N/A" },
        { label: "Status", key: (item) => statusConfig[item?.status]?.label || "N/A" },
    ];

    // --- Handlers for mock import/export ---
    const handleImportRow = async (row) => {
        const payload = {
            training_type: row["Training Type"],
            trainer_name: row["Trainer Name"],
            training_cost: row["Training Cost"],
            start_date: row["Start Date"],
            end_date: row["End Date"],
            status: row["Status"],
        };

        // return dispatch(createNewTraining(payload)); // if you hook into Redux/Backend
    };

    const fetchTrainings = () => {
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


    const ListData = (trainingListLoading && (!showMoreLess || trainingLists?.length === 0)) ? dummData : trainingLists;

    return (
        <div className="attendanceListMain">
            <div className="employee-dashboard-list empListMain">
                <div className="dashboard-sticky-header">
                    <header className="top-header">
                        <div className="header-left">
                            <div>
                                <h1>
                                    Training list
                                    <span className="total-count">
                                        <TrendingUp size={16} className="TrendingUp" />
                                        {metaData?.all}
                                    </span>
                                </h1>
                                <p>See all trainings list below</p>
                            </div>
                        </div>
                        <div className="header-right header_rightMain">
                            <div className="toolbar">
                                <SearchBox
                                    onSearch={handleSearch}
                                    placeholder="Search Training..."
                                    ref={searchBoxRef}
                                />
                                <div className="toolbar-actions">
                                    <SortFilter
                                        sortBy={sortBy}
                                        onChange={handleSortChange}
                                    />
                                    <Tooltips title='Add New Training' placement="top" arrow={true}>
                                        <button className="add-employee-btn" onClick={() => navigate('/add-training')}><UserPlus size={16} /> </button>
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
                                                        fetchTrainings();
                                                        setOpen(false);
                                                    }}
                                                />
                                                <ExportList
                                                    data={trainingLists}
                                                    headers={exportHeaders}
                                                    filename="trainings.csv"
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
                                {trainingStatusOptions?.map((status, index) => {
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
                                            <span className="counts">({String(count)?.padStart(2, '0')})</span>
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
                                        <th>TRAINING TYPE</th>
                                        <th>TRAINER NAME</th>
                                        <th>TRAINING COST</th>
                                        <th>START & END DATE</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                {(trainingListLoading || trainingLists?.length > 0) ? (
                                    <tbody className={`${trainingListLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                        {ListData?.map((item) => {
                                            const StatusIcon = statusConfig[item?.status]?.icon || XCircle;
                                            const statusClassName = statusConfig[item?.status]?.className;
                                            return (
                                                <tr key={item?.id} className="employee-row" onClick={() => navigate(`/training-details/${item?.id}`)}>
                                                    <td className="">
                                                        <div className="info_img loadingtd">
                                                            <div className="name Semi_Bold">{showMastersValue(masterData, "22", item?.training_type)}</div>
                                                        </div>
                                                    </td>
                                                    <td className="loadingtd">{item?.trainer?.trainer_name}</td>
                                                    <td className="loadingtd">{item?.training_cost}</td>
                                                    <td className="">
                                                        <div className="contact-info">
                                                            <div className="loadingtd"><CalendarArrowUp size={14} /> <span>{formatDate(item?.start_date)}</span></div>
                                                            <div className="loadingtd gap_3"><CalendarArrowDown size={14} /> <span className="phone">{formatDate(item?.end_date)}</span></div>
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
                                                {(!trainingListLoading && trainingLists?.length === 0) && (
                                                    <ListDataNotFound module="Trainings" handleReset={resetFilters} />
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                                <div className="load-more-container">
                                    {itemsPerPage < totalTrainings && (
                                        <button onClick={handleLoadMore} className="load-more-btn">
                                            {(trainingListLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                        </button>
                                    )}
                                    {itemsPerPage >= totalTrainings &&
                                        totalTrainings > INITIAL_VISIBLE_COUNT && (
                                            <button onClick={handleShowLess} className="load-more-btn">
                                                {(trainingListLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                            </button>
                                        )}
                                </div>
                            
                        </div>
                    </div>
                </main>

            </div>
        </div>
    )
};
export default TrainingList;