import { useState, useEffect, useRef, useCallback } from "react";
import { MoreVertical, X, PlaneTakeoff, PlaneLanding, UserPlus } from "lucide-react";
import "../../EmployeeOnboarding/EmployeeList/EmployeeList.scss"; // Use the same SCSS file
import { useNavigate } from "react-router-dom";
import Tooltips from "../../../utils/common/Tooltip/Tooltips.jsx";
import SearchBox from "../../../utils/common/SearchBox.jsx";
import DynamicLoader from "../../../utils/common/DynamicLoader/DynamicLoader.jsx";
import LoadingDots from "../../../utils/common/LoadingDots/LoadingDots.jsx";
import DatePicker from "../../../utils/common/DatePicker/DatePicker.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getTravelList } from "../../../Redux/Actions/travelActions.js";
import { travelStatusOptions } from "../../../utils/Constant.js";
import defaultImage from "../../../assets/default-user.png";
import { formatDate, formatDate3 } from "../../../utils/common/DateTimeFormat.js";
import './TravelList.scss'
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import EllipsisSpan from "../../../utils/EllipsisSpan.jsx";
const INITIAL_VISIBLE_COUNT = 8;

export const TravelList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Data from Redux
    const travelData = useSelector((state) => state?.travelList);
    const travelLists = travelData?.data?.travel || [];
    const totalTravels = travelData?.data?.count || 0;
    const travelLoading = travelData?.loading || false;
    const metaData = travelData?.data?.metadata || {};

    const [searchTerm, setSearchTerm] = useState("");
    const searchBoxRef = useRef();
    const [statusFilter, setStatusFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState(null); // State for date filter
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [view, setView] = useState('list');

    // Function to simulate fetching data (currently filters dummy data)
    const fetchTravelList = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");
            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
                ...(searchTerm && { search: searchTerm }),
                ...(dateFilter && { custom_date: formatDate3(new Date(dateFilter)) }),
            };
            const res = await dispatch(getTravelList(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching travel list:", error);
            setShowMoreLess(false);
        }
    }, [searchTerm, statusFilter, visibleCount, dateFilter]);

    useEffect(() => {
        fetchTravelList();
    }, [searchTerm, statusFilter, visibleCount, dateFilter]);

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setDateFilter(null); // Reset date filter
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();
        }
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
        setShowMoreLess(true); // To show loading dots on the button
        setVisibleCount(prev => prev + 6);
    };

    const handleShowLess = () => {
        setShowMoreLess(true);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handleStatusFilter = (newFilter) => {
        setStatusFilter(newFilter);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
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

    const dummyData = Array.from({ length: 7 }, (_, i) => ({
        id: i,
        first_name: "",
        last_name: "",
        job_opening: { job_title: "" },
        email: "",
        mobile_no: "",
        status: "",
        user_image: null,
    }));


    const ListData = (travelLoading && (!showMoreLess || travelLists?.length === 0)) ? dummyData : travelLists;

    return (
        <div className="travelListMain">
            <div className="employee-dashboard-list app_List">
                <div className="dashboard-sticky-header">
                    <header className="top-header">
                        <div className="header-left">
                            <div>
                                <h1>Travel List
                                    <span className="total-count">{String(metaData.all).padStart(2, '0')}</span>
                                </h1>
                                <p>See All Travel List Below</p>
                            </div>
                        </div>
                        <div className="header-right header_rightMain">
                            <div className="toolbar">
                                <SearchBox
                                    onSearch={handleSearch}
                                    placeholder="Search Employee..."
                                    ref={searchBoxRef}
                                />
                                {/* Simple Date Picker */}
                                <div className="date-filter-wrapper">
                                    <DatePicker
                                        label=""
                                        onDateChange={handleDateFilter}
                                        initialDate={dateFilter}
                                    />
                                </div>
                            </div>
                            <Tooltips title="Add New Travel Request" placement="top" arrow>
                                <button className="add-employee-btn" onClick={() => navigate('/add-new-travel')}>
                                    <UserPlus size={16} />
                                </button>
                            </Tooltips>
                            <div className="relative">
                                <Tooltips title="More Actions" placement="top" arrow={true}>
                                    <button className="menu-btn">
                                        <MoreVertical size={24} />
                                    </button>
                                </Tooltips>
                            </div>
                        </div>
                    </header>
                </div>

                <main className="dashboard-content">
                    <aside className="filters-sidebar">
                        <div>
                            <ul>
                                {travelStatusOptions?.map((status) => {
                                    const Icon = status?.icon || List; // fallback icon
                                    let count = 0;
                                    if (status.label === "All") {
                                        count = metaData?.all ?? 0;
                                    } else {
                                        count = metaData?.[status?.label.toLowerCase().replace(" ", "")] ?? 0;
                                    }
                                    return (
                                        <li key={status?.id} className={statusFilter === status?.id ? "active" : ""} onClick={() => handleStatusFilter(status?.id)}>
                                            <div className="status-label">
                                                <status.icon size={16} strokeWidth={1.5} />
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
                                        <span>Clear filter</span><X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </aside>

                    <div className="content_box_auto">
                        <div className="employee-table-wrapper">
                            <table className="employee-table emp-t-5">
                                <thead>
                                    <tr>
                                        <th>EMPLOYEE NAME</th>
                                        <th>DEPARTMENT</th>
                                        <th>PLACE OF VISIT</th>
                                        <th>DEPARTURE & ARRIVAL</th>
                                        <th>PURPOSE</th>
                                    </tr>
                                </thead>
                                {(travelLoading || travelLists?.length > 0) ? (
                                    <tbody className={`${travelLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                        {ListData?.map(item => (
                                            <tr key={item.id} className="employee-row" onClick={() => navigate(`/travel-details/${item.id}`)}>
                                                <td>

                                                    <>
                                                        <div className="info_img loadingImg">
                                                            <img
                                                                src={employeeImage(item?.employee?.image)}
                                                                alt={[item?.employee?.first_name, item?.employee?.last_name].filter(Boolean).join(" ")}
                                                                className="avatar"
                                                            />
                                                            <div className="name loadingtdsmall Semi_Bold">{[item?.employee?.first_name, item?.employee?.last_name].filter(Boolean).join(" ")}</div>
                                                        </div>
                                                    </>


                                                </td>
                                                <td className="loadingtd"><div className="department">{item?.employee?.department?.department_name}</div></td>
                                                <td className="loadingtd"><div className="department">{item?.place_of_visit}</div></td>
                                                <td>
                                                    <div className="contact-info">
                                                        <div className="loadingtd loadingtdTOP"><PlaneTakeoff size={14} /> <span>{formatDate(item?.expected_date_of_departure)}</span></div>
                                                        <div className="loadingtd gap_3 Bold loadingtdBOTTOM"><PlaneLanding size={14} /> <span className="phone">{formatDate(item?.expected_date_of_arrival)}</span></div>
                                                    </div>
                                                </td>
                                                <td className="loadingtd"><div className="department">
                                                    <EllipsisSpan text={item?.purpose_of_visit} wordsToShow={8} />

                                                </div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                ) : (
                                    <tbody className="table_not_found">
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                                                {(!travelLoading && travelLists?.length === 0) && (
                                                    <ListDataNotFound module="Travel" handleReset={resetFilters} />
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}

                            </table>

                            {!travelLoading &&
                                <div className="load-more-container">
                                    {(visibleCount < totalTravels) && (
                                        <button onClick={handleLoadMore} className="load-more-btn">
                                            {(travelLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                                        </button>
                                    )}
                                    {((visibleCount >= totalTravels) && totalTravels > INITIAL_VISIBLE_COUNT) && (
                                        <button onClick={handleShowLess} className="load-more-btn">
                                            {(travelLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                                        </button>
                                    )}
                                </div>
                            }
                        </div>
                    </div>
                </main>

            </div>
        </div>
    );
};