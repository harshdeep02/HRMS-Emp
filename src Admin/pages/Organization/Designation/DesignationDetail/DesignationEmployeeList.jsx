import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../../Department/DepartmentDetail/DepartmentDetail.scss';
import LoadingDots from '../../../../utils/common/LoadingDots/LoadingDots';
import ListDataNotFound from '../../../../utils/common/ListDataNotFound';
import SearchBox from '../../../../utils/common/SearchBox.jsx';
import DynamicFilter from '../../../../utils/common/DynamicFilter.jsx';
import { Mail, Phone, XCircle } from 'lucide-react';
import defaultUserImage from "../../../../assets/default-user.png";
import { getEmpDesignationDetails } from '../../../../Redux/Actions/designationActions';
import { employeeStatusOptions } from '../../../../utils/Constant.js';

const DesignationEmployeeList = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    // Data from redux, using the correct state slice for designation
    const employeeData = useSelector((state) => state?.empDesignationDetails);
    const employeeList = employeeData?.data?.employees || [];
    const totalEmployees = employeeData?.data?.count || 0;
    const employeeLoading = employeeData?.loading;

    // State for managing the number of visible employees
    const INITIAL_VISIBLE_COUNT = 8;
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [searchTerm, setSearchTerm] = useState("");
    const searchBoxRef = useRef();
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("recent");
    const [view, setView] = useState('list');
    const [statusFilter, setStatusFilter] = useState("All");

    const statusConfig = employeeStatusOptions?.reduce((acc, status) => {
        if (!status?.id) return acc; // skip undefined values
        acc[status?.id] = {
            label: status?.label,
            icon: status?.icon,
            className: status?.label.replace(/\s+/g, "-").toLowerCase()
        };
        return acc;
    }, {});

    // Fetch employees logic using the correct API for designation
    const fetchEmployees = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");
            const sendData = {
                fy,
                noofrec: visibleCount,
                currentpage: currentPage,
                designation_id: id,
                ...(searchTerm && { search: searchTerm }),
                ...(sortBy && { sort_by: sortBy }),
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
            };
            await dispatch(getEmpDesignationDetails(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching employees:", error);
            setShowMoreLess(false);
        }
    }, [id, searchTerm, visibleCount, currentPage, sortBy, statusFilter]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // Handlers from the original code
    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter("All");
        setSortBy("recent");
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();
        }
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 5);
        setShowMoreLess(true);
    };

    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    };

    const employeeImage = (img) => img
        ? (() => {
            try {
                return JSON.parse(img);
            } catch {
                return img;
            }
        })()
        : defaultUserImage;

    const dummyData = Array.from({ length: INITIAL_VISIBLE_COUNT }, (_, i) => ({

    }));

    const ListData = (employeeLoading && !showMoreLess) ? dummyData : employeeList;

    return (
        <>

            <>
                <div className="detail-table-wrapper">
                    <div className="box_head">
                        <h2>Employees In Designation</h2>
                        <div className="toolbar_d">
                            <SearchBox onSearch={handleSearch} placeholder="Search Employee..." ref={searchBoxRef} />
                            <div className="toolbar-actions">
                                <div className="border_box">
                                    <DynamicFilter
                                        filterBy="status"
                                        filterValue={statusFilter}
                                        onChange={handleStatusFilter}
                                        options={employeeStatusOptions?.filter((item) => item?.label !== "All")?.map((item) => ({
                                            value: item?.id,
                                            label: item?.label,
                                        })) || []}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="detail-table emp-t-5 project-history-table empProject">
                        <thead>
                            <th>Employee</th>
                            <th>Contacts</th>
                            <th>Status</th>
                        </thead>
                        {(employeeLoading || employeeList?.length > 0) ? (
                            <tbody className={`${employeeLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                {ListData?.map(employee => {
                                    const StatusIcon = statusConfig[employee?.employee_status]?.icon || XCircle;
                                    const statusClassName = statusConfig[employee?.employee_status]?.className;
                                    return (
                                        <tr key={employee?.id} className="detail_tr_row employee-row">
                                            <td className="td">
                                                <div className="info_img">
                                                    <div className="loadingImg">
                                                        <img
                                                            src={employeeImage(employee?.image)}
                                                            alt={employee?.first_name}
                                                            className="avatar"
                                                        />
                                                    </div>
                                                    <span className='loadingtdsmall purplle Bold'>{[employee?.first_name, employee?.last_name].filter(Boolean).join(" ")}</span>
                                                </div>
                                            </td>
                                            <td className="td">
                                                    <div className="contact-info ">
                                                        <div className="loadingtdTOP blackPhone"><Mail size={14} /> <span>{employee?.email}</span></div>
                                                        <div className="loadingtdBOTTOM "><Phone size={14} />
                                                            <span className="purplle Semi_Bold">{employee?.mobile_no}</span></div>
                                                    </div>
                                                </td>
                                            <td className="loadingtd ">
                                                <div className={`status-badge ${statusClassName}`}>
                                                    <StatusIcon size={16} />
                                                    <span>{statusConfig[employee?.employee_status]?.label}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        ) : (

                            <tbody className="table_not_found">
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', paddingLeft: '20px' }}>
                                        {(!employeeLoading && employeeList?.length === 0) && (
                                            <ListDataNotFound module="Employees" handleReset={resetFilters} />
                                        )}

                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
                {(!employeeLoading || showMoreLess) &&
                    <div className="load-more-container">
                        {visibleCount < totalEmployees && (
                            <button onClick={handleLoadMore} className="load-more-btn">
                                {(employeeLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                            </button>
                        )}
                        {visibleCount >= totalEmployees && totalEmployees > INITIAL_VISIBLE_COUNT && (
                            <button onClick={handleShowLess} className="load-more-btn">
                                {(employeeLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show Less"}
                            </button>
                        )}
                    </div>
                }
            </>

        </>
    );
};

export default DesignationEmployeeList;