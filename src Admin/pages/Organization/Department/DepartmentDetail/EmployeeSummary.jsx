import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './DepartmentDetail.scss';
import LoadingDots from '../../../../utils/common/LoadingDots/LoadingDots';
import ListDataNotFound from '../../../../utils/common/ListDataNotFound';
import SearchBox from '../../../../utils/common/SearchBox.jsx';
import { Mail, Phone, XCircle } from 'lucide-react';
import defaultUserImage from '../../../../assets/default-user.png';
import { getEmpDepartmentDetails } from '../../../../Redux/Actions/departmentActions';
import { employeeStatusOptions } from '../../../../utils/Constant.js';
import DynamicFilter from '../../../../utils/common/DynamicFilter.jsx';

const EmployeeSummary = () => {

    const dispatch = useDispatch();
    const { id } = useParams();

    const employeeData = useSelector((state) => state?.empDepartmentDetails);
    const employeeList = employeeData?.data?.employees || [];
    const totalEmployees = employeeData?.data?.count || 0;
    const employeeLoading =  employeeData?.loading;

    // State for managing the number of visible employees, search, and sort
    const INITIAL_VISIBLE_COUNT = 8;
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [searchTerm, setSearchTerm] = useState("");
    const searchBoxRef = useRef();
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [sortBy, setSortBy] = useState("recent");
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("All");
    const [view, setView] = useState('list');

    const statusConfig = employeeStatusOptions?.reduce((acc, status) => {
        if (!status?.id) return acc; // skip undefined values
        acc[status?.id] = {
            label: status?.label,
            icon: status?.icon,
            className: status?.label.replace(/\s+/g, "-").toLowerCase()
        };
        return acc;
    }, {});

    const fetchEmployees = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");
            const sendData = {
                fy,
                noofrec: visibleCount,
                department_id: id,
                currentpage: currentPage,
                ...(searchTerm && { search: searchTerm }),
                ...(sortBy && { sort_by: sortBy }), // backend should handle sort
                ...(statusFilter && statusFilter !== "All" && { status: statusFilter }),
            };
            await dispatch(getEmpDepartmentDetails(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching employees:", error);
            setShowMoreLess(false);
        }
    }, [dispatch, searchTerm, sortBy, visibleCount, currentPage, statusFilter]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // Handlers
    const handleLoadMore = () => {
        setVisibleCount(prev => prev + INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    };

    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setShowMoreLess(true);
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT); // reset count
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const resetFilters = () => {
        setSearchTerm("");
        setSortBy("recent");
        setStatusFilter("All");
        setShowMoreLess(false);
        if (searchBoxRef.current) {
            searchBoxRef.current.clearInput();
        }
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

    const dummData = Array.from({ length: INITIAL_VISIBLE_COUNT }, (_, i) => ({

    }));

    const ListData = (employeeLoading && !showMoreLess) ? dummData : employeeList;

    return (
        <>
            {/* <div className="dept-page-table-section"> */}
            <div className="detail-table-wrapper">
                <div className="box_head">
                    <h2>Employees in Department</h2>
                    <div className="toolbar_d">
                        <SearchBox onSearch={handleSearch} placeholder="Search employee..." ref={searchBoxRef} />
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
                        <th>Name</th>
                        <th>Contacts</th>
                        <th>Status</th>
                    </thead>
                    {(employeeLoading || employeeList?.length > 0) ? (
                        <tbody className={`${employeeLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                            {ListData?.map((employee) => {
                                const StatusIcon = statusConfig[employee?.employee_status]?.icon || XCircle;
                                const statusClassName = statusConfig[employee?.employee_status]?.className;
                                return (
                                    <tr key={employee?.id} className="detail_tr_row employee-row">
                                        <td className="td">
                                            <div className='info_img'>
                                                <div className="loadingImg">
                                                    <img
                                                        src={employeeImage(employee?.image)}
                                                        alt={employee?.first_name}
                                                        className="avatar"
                                                    />
                                                </div>
                                                <span className='loadingtdsmall  purplle Bold'>
                                                    {[employee?.first_name, employee?.last_name]
                                                        .filter(Boolean)
                                                        .join(" ")}
                                                </span>
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
                                );
                            })}
                        </tbody>
                    ) : (

                        <tbody className="table_not_found">
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
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
    );
};

export default EmployeeSummary;