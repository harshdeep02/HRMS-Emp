import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    PencilLine,
    User,
    Plane,
} from 'lucide-react';
import bannerImg from '../../../assets/Position.svg';
import Loader from '../../../utils/common/Loader/Loader.jsx';
import EmployeTravelForm from './EmployeTravelForm.jsx';
import TravelHistory from './TravelHistory.jsx'; // TravelHistory कंपोनेंट को इंपोर्ट करें
import { getEmployeeList } from '../../../Redux/Actions/employeeActions.js';
import { getTravelDetails } from '../../../Redux/Actions/travelActions.js';

const texts = {
    add: {
        header: "Add New Travel",
        mark: "Fill The Information",
        info: "You're Just One Step Away From Adding New Travel Details!",
    },
    edit: {
        header: "Edit Travel Details",
        mark: "Edit The Information",
        info: "You're Just One Step Away From Making The Changes In Travel Details!",
    },
    detail: {
        header: "Employee Travel Detail",
        mark: "Provided Details!",
        info: "Check out the employee's travel history!",
    },
};

const EmployeTravelDetail = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();

    //Data from redux
    const travelDetails = useSelector((state) => state?.travelDetails);
    const travelDetail = travelDetails?.data?.travel || {};
    const travelDetailLoading = travelDetails?.loading || false;

    const employeeData = useSelector((state) => state?.employeeList);
    const employeeList = employeeData?.data?.result || [];

    const [activeFormIndex, setActiveFormIndex] = useState(0);
    const [viewMode, setViewMode] = useState('detail');
    const [formData, setFormData] = useState({
        user_id: '',
        user_image: "",
        department_id: '',
        purpose_of_visit: '',
        place_of_visit: '',
        expected_date_of_arrival: '',
        expected_date_of_departure: '',
        expected_duration_in_days: '',
        is_billable_to_customer: '',
        customer_name: '',
        status: 2,
    });

    const navItems = [
        { name: 'Basic Information', icon: User },
        { name: 'Travel History', icon: Plane },
    ];

    const fetchEmployees = (search = "") => {
        const sendData = { employee_status: "1,5" };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getEmployeeList(sendData));
    };

    const handleSearch = (query, type) => {
        // if (type === "department_id") fetchDepartments(query);
        if (type === "user_id") fetchEmployees(query)
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/add-new-travel') || path.includes('/edit-travel')) {
            // if (departmentList?.length === 0) fetchDepartments();
            if (employeeList?.length === 0) fetchEmployees();
        }
    }, [location.pathname]);

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/add-new-travel')) {
            setViewMode('add');
        } else if (path.includes('/edit-travel')) {
            setViewMode('edit');
        } else {
            setViewMode('detail');
        }
    }, [location.pathname, id]);

    useEffect(() => {
        if (id && travelDetail?.id != id) {
            dispatch(getTravelDetails({ id }));
        }
    }, [id]);

    useEffect(() => {
        if (id && travelDetail) {
            setFormData((prev) => ({
                ...prev,
                user_id: travelDetail?.user_id || "",
                user_image: travelDetail?.employee?.image ? JSON.parse(travelDetail?.employee?.image) : "",
                department_id: travelDetail?.department_id || "",
                purpose_of_visit: travelDetail?.purpose_of_visit || "",
                place_of_visit: travelDetail?.place_of_visit || "",
                expected_date_of_arrival: travelDetail?.expected_date_of_arrival || "",
                expected_date_of_departure: travelDetail?.expected_date_of_departure || "",
                expected_duration_in_days: travelDetail?.expected_duration_in_days || "",
                is_billable_to_customer: travelDetail?.is_billable_to_customer || "",
                customer_name: travelDetail?.customer_name || "",
                status: travelDetail?.status || 2
            }));
        }
    }, [viewMode, travelDetail?.id]);

    const handleEditClick = () => {
        navigate(`/edit-travel/${id}`);
    };

    if (travelDetailLoading) {
        return <div className="loading-state"><Loader /></div>;
    }

    return (
        <div className="dept-page-container">
            <button onClick={() => navigate(`${viewMode == 'edit' ? `/travel-details/${id}` : '/travel-list'}`)} className="close_nav header_close">Close</button>
            <h2 className="dept-page-main-heading">{texts[viewMode].header}</h2>
            <div className="dept-page-content-wrapper">
                {viewMode === 'add' ? (
                    <div className="dept-page-left-panel">
                        <h3 className="dept-page-mark-text">{texts[viewMode].mark}</h3>
                        <p className="dept-page-info-text">{texts[viewMode].info}</p>
                        <div className="dept-page-illustration-box">
                            <img className=' ' src={bannerImg} alt="Illustration" />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="navbar-container">
                            <div className="navbar-items">
                                {navItems?.map((item, index) => (
                                    <span
                                        key={index}
                                        className={`${index === activeFormIndex ? 'active' : ''}`}
                                        onClick={() => setActiveFormIndex(index)}
                                    >
                                        <item.icon size={20} strokeWidth={1.5} />
                                        <p>{item?.name}</p>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {activeFormIndex === 0 && (
                    <div className="dept-page-right-panel">
                        {viewMode === 'detail' && (
                            <div className="dept-page-cover-section ">

                                <button className="dept-page-edit-btn" onClick={handleEditClick}>
                                    {/* /<PencilLine size={16} /> */}
                                    Edit
                                </button>
                            </div>
                        )}
                        <EmployeTravelForm
                            viewMode={viewMode}
                            formData={formData}
                            setFormData={setFormData}
                            handleSearch={handleSearch}
                        />
                    </div>
                )}

                {viewMode === 'detail' && activeFormIndex === 1 && (
                    <div className="dept-page-table">
                        <TravelHistory />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeTravelDetail;