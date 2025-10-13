import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../../Department/DepartmentDetail/DepartmentDetail.scss';
import LoadingDots from '../../../../utils/common/LoadingDots/LoadingDots';
import ListDataNotFound from '../../../../utils/common/ListDataNotFound';
import SearchBox from '../../../../utils/common/SearchBox.jsx';
import DynamicFilter from '../../../../utils/common/DynamicFilter.jsx';
import { Phone } from 'lucide-react';
import defaultUserImage from "../../../../assets/default-user.png";
import { getEmpDesignationDetails } from '../../../../Redux/Actions/designationActions';
import DynamicLoader from '../../../../utils/common/DynamicLoader/DynamicLoader.jsx';

const DesignationEmployeeList = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    // Data from redux, using the correct state slice for designation
    const employeeData = useSelector((state) => state?.empDesignationDetails);
    const employeeList = employeeData?.data?.getDesignationEmp || [];
    const totalEmployees = employeeData?.data?.count || 0;
    const employeeLoading = employeeData?.loading;

    // State for managing the number of visible employees
    const INITIAL_VISIBLE_COUNT = 10;
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [searchTerm, setSearchTerm] = useState("");
    const searchBoxRef = useRef();
    const [showMoreLess, setShowMoreLess] = useState(false);
    const [designationFilter, setDesignationFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("recent");
    const [view, setView] = useState('list');
    const [statusFilter, setStatusFilter] = useState("All");


    // Fetch employees logic using the correct API for designation
    const fetchEmployees = useCallback(async () => {
        try {
            const fy = localStorage.getItem("FinancialYear");
            const sendData = {
                fy,
                noofrec: visibleCount,
                designation_id: id,
                currentpage: currentPage,
                ...(searchTerm && { search: searchTerm }),
                ...(sortBy && { sort_by: sortBy }),
            };
            await dispatch(getEmpDesignationDetails(sendData));
            setShowMoreLess(false);
        } catch (error) {
            console.error("Error fetching employee list:", error);
            setShowMoreLess(false);
        }
    }, [dispatch, id, searchTerm, visibleCount, currentPage, sortBy]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // Handlers from the original code
    const handleSearch = (query) => {
        setSearchTerm(query);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const handleDesignationFilter = (value) => {
        setDesignationFilter(value);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setDesignationFilter('All');
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

    const getEmployeeImage = (img) => {
        try {
            const parsedImage = JSON.parse(img);
            return parsedImage;
        } catch (e) {
            return img || defaultUserImage;
        }
    };

    const designationOptions = [
        { label: 'All', value: 'All' },
        ...[...new Set(employeeList.map(emp => emp?.designation_name))].map(des => ({
            label: des,
            value: des
        }))
    ];
    const dummData = Array.from({ length: INITIAL_VISIBLE_COUNT }, (_, i) => ({

    }));

    const ListData = (employeeLoading && !showMoreLess) ? dummData : employeeList;

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
                                        filterBy="Designation"
                                        filterValue={designationFilter}
                                        onChange={handleDesignationFilter}
                                        options={designationOptions}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="detail-table emp-t-3 project-history-table empProject">
                        <thead>
                            <th>Employee</th>
                            <th> Email</th>
                            <th>Mobile</th>
                        </thead>
                        {(employeeLoading || employeeList?.length > 0) ? (

                            <tbody className={`${employeeLoading && !showMoreLess ? 'LoadingList' : ''}`}>
                                {ListData.slice(0, visibleCount).map(employee => (
                                    <tr key={employee.id} className="detail_tr_row employee-row">
                                        <td className="td">
                                            <div className="info_img">
                                                <div className="loadingImg">
                                                    <img
                                                        src={getEmployeeImage(employee?.image)}
                                                        alt={employee?.first_name}
                                                        className="avatar"
                                                    />
                                                </div>
                                                <span className='loadingtdsmall '>{[employee?.first_name, employee?.last_name].filter(Boolean).join(" ")}</span>
                                            </div>
                                        </td>
                                        <td className='loadingtd'>{employee?.email}</td>
                                        <td className="contact-info loadingtd">
                                            <div>
                                                <Phone size={16} className="phone-icon" />
                                                {employee?.mobile_no}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (

                            <tbody className="table_not_found">
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', paddingLeft: '150px' }}>
                                        {(!employeeLoading && employeeList?.length === 0) && (
                                            <ListDataNotFound module="Employees" handleReset={resetFilters} />
                                        )}

                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </table>

                </div>
                <div className="load-more-container">
                    {visibleCount < totalEmployees && (
                        <button onClick={handleLoadMore} className="load-more-btn">
                            {(employeeLoading && showMoreLess) ? <LoadingDots color="#8a3ffc" size={6} /> : "Show More"}
                        </button>
                    )}
                    {visibleCount >= totalEmployees && totalEmployees > INITIAL_VISIBLE_COUNT && (
                        <button onClick={handleShowLess} className="load-more-btn">
                            Show Less
                        </button>
                    )}
                </div>
            </>

        </>
    );
};

export default DesignationEmployeeList;