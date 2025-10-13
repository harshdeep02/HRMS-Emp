// DesignationEmployeeList.jsx

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../Department/DepartmentDetail/DepartmentDetail.scss';
import LoadingDots from '../../../../utils/common/LoadingDots/LoadingDots';
import ListDataNotFound from '../../../../utils/common/ListDataNotFound';
import SearchBox from '../../../../utils/common/SearchBox.jsx';
import DynamicFilter from '../../../../utils/common/DynamicFilter.jsx';
import { Phone } from 'lucide-react';
import defaultUserImage from "../../../../assets/default-user.png";

// Dummy data with designation and online image URLs
const DUMMY_DESIGNATION_EMPLOYEE_DATA = [
    { id: 'emp1', name: 'Priya Sharma', email: 'Priya.Sharma@Codesquarry.Com', phone: '+91 9876543210', image: 'https://i.pravatar.cc/150?u=priya', designation: 'Software Engineer' },
    { id: 'emp2', name: 'Anjali Singh', email: 'Anjali.Singh@Codesquarry.Com', phone: '+91 9988776655', image: 'https://i.pravatar.cc/150?u=anjali', designation: 'Project Manager' },
    { id: 'emp3', name: 'Rohan Gupta', email: 'Rohan.Gupta@Codesquarry.Com', phone: '+91 9123456789', image: 'https://i.pravatar.cc/150?u=rohan', designation: 'UX Designer' },
    { id: 'emp4', name: 'Sunita Rao', email: 'Sunita.Rao@Codesquarry.Com', phone: '+91 9632587410', image: 'https://i.pravatar.cc/150?u=sunita', designation: 'Software Engineer' },
    { id: 'emp5', name: 'Vikram Patel', email: 'Vikram.Patel@Codesquarry.Com', phone: '+91 9456123780', image: 'https://i.pravatar.cc/150?u=vikram', designation: 'Team Lead' },
    { id: 'emp6', name: 'Aisha Khan', email: 'Aisha.Khan@Techwave.Com', phone: '+91 9876543210', image: 'https://i.pravatar.cc/150?u=aisha', designation: 'UX Designer' },
    { id: 'emp7', name: 'Liam Johnson', email: 'Liam.Johnson@Creatify.Com', phone: '+1 202-555-0191', image: 'https://i.pravatar.cc/150?u=liam', designation: 'Software Engineer' },
    { id: 'emp8', name: 'Sofia Martinez', email: 'Sofia.Martinez@Designhub.Com', phone: '+34 612-345-678', image: 'https://i.pravatar.cc/150?u=sofia', designation: 'Team Lead' },
    { id: 'emp9', name: 'Tariq Ahmed', email: 'Tariq.Ahmed@Pixelpoint.Com', phone: '+44 20 7946 0958', image: 'https://i.pravatar.cc/150?u=tariq', designation: 'Project Manager' },
    { id: 'emp10', name: 'Emily Chen', email: 'Emily.Chen@Innovate.Com', phone: '+1 415-555-0199', image: 'https://i.pravatar.cc/150?u=emily', designation: 'UX Designer' },
];

const DesignationEmployeeList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [designationFilter, setDesignationFilter] = useState('All');
    const [filteredEmployees, setFilteredEmployees] = useState(DUMMY_DESIGNATION_EMPLOYEE_DATA);
    const [visibleCount, setVisibleCount] = useState(10); // Start with 10 visible items as per the screenshot
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const searchBoxRef = useRef();

    // Dynamically generate filter options from the dummy data
    const designationOptions = [
        { label: 'All', value: 'All' },
        ...[...new Set(DUMMY_DESIGNATION_EMPLOYEE_DATA.map(emp => emp.designation))].map(des => ({
            label: des,
            value: des
        }))
    ];

    useEffect(() => {
        let filtered = DUMMY_DESIGNATION_EMPLOYEE_DATA.filter(employee =>
            employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.phone.includes(searchTerm)
        );

        // Apply designation filter
        if (designationFilter !== 'All') {
            filtered = filtered.filter(employee => employee.designation === designationFilter);
        }

        setFilteredEmployees(filtered);
        setVisibleCount(10); // Reset visible count on filter/search change
    }, [searchTerm, designationFilter]);

    const handleSearch = (query) => {
        setSearchTerm(query);
    };

    const handleDesignationFilter = (value) => {
        setDesignationFilter(value);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setDesignationFilter('All');
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
        setVisibleCount(10);
    };

    const getEmployeeImage = (imagePath) => {
        return imagePath || defaultUserImage;
    };

    return (
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
                {filteredEmployees.length > 0 ? (
                    <table className="detail-table emp-t-3 project-history-table empProject">
                        <thead>
                            <tr className="visually-hidden">

                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.slice(0, visibleCount).map(employee => (
                                <tr key={employee.id} className="detail_tr_row employee-row">
                                    <td className="td">
                                        <div className="info_img">
                                            <img
                                                src={getEmployeeImage(employee.image)}
                                                alt={employee.name}
                                                className="avatar"
                                            />
                                            <span className=' '>{employee.name}</span>
                                        </div>
                                    </td>
                                    <td>{employee.email}</td>
                                    <td className="contact-info">
                                        <div>
                                            <Phone size={16} className="phone-icon" />
                                            {employee.phone}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <ListDataNotFound module="Employees" handleReset={resetFilters} />
                )}
            </div>
            <div className="load-more-container">
                {visibleCount < filteredEmployees.length && (
                    <button onClick={handleLoadMore} className="load-more-btn">
                        {isLoadingMore
                            ? <LoadingDots color="#8a3ffc" size={6} />
                            : "Show More"}
                    </button>
                )}
                {visibleCount >= filteredEmployees.length && DUMMY_DESIGNATION_EMPLOYEE_DATA.length > 10 && (
                    <button onClick={handleShowLess} className="load-more-btn">
                        Show Less
                    </button>
                )}
            </div>
        </>
    );
};

export default DesignationEmployeeList;