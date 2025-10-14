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
import { getTravelDetails, updateTravelStatus } from '../../../Redux/Actions/travelActions.js';
import ConfirmPopup from '../../../utils/common/ConfirmPopup.jsx';
import { travelStatusOptions } from '../../../utils/Constant.js';
import StatusDropdown from '../../../utils/common/StatusDropdown/StatusDropdown.jsx';
import { UserProfileImageUpload } from '../../../utils/common/UserProfileImageUpload/UserProfileImageUpload.jsx';

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

    const updateStatus = useSelector((state) => state?.updateTravelStatus);


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
        if (type === "user_id") fetchEmployees(query)
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/add-new-travel') || path.includes('/edit-travel')) {
            // if (employeeList?.length === 0) 
            fetchEmployees();
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
        if (id ) {
            dispatch(getTravelDetails({ id }));
        }
    }, [id]);

    useEffect(() => {
        if (id && travelDetail) {
            setFormData((prev) => ({
                ...prev,
                user_id: travelDetail?.user_id || "",
                user_name: [travelDetail?.employee?.first_name, travelDetail?.employee?.last_name]
                    .filter(Boolean)
                    .join(" "),
                user_image: travelDetail?.employee?.image ? JSON.parse(travelDetail?.employee?.image) : "",
                department_id: travelDetail?.employee?.department_id || "",
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


    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");

    const handleUpdateStatus = () => {
        const sendData = {
            id: id,   // applicant ke liye job_id nahi applicant_id bhejna hai
            status: selectedStatus,
        };
        dispatch(updateTravelStatus(sendData))
            .then((res) => {
                if (res?.success) {
                    setShowModal(false);
                    dispatch(getTravelDetails({ id }));
                    setFormData((prevData) => ({
                        ...prevData,
                        status: selectedStatus,
                    }));
                }
            })
            .catch((error) => {
                setShowModal(false);
                console.log("error-", error);
            });
    };

    const handleStatus = (val) => {
        if (viewMode === "add") {
            setFormData((prevData) => ({
                ...prevData,
                status: val,
            }));
        }
        else {
            setShowModal(true);
            setSelectedStatus(val);
        }
    };

    if (travelDetailLoading) {
        return <div className="loading-state"><Loader /></div>;
    }

    return (
        <>
            <ConfirmPopup
                open={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleUpdateStatus}
                type="update"
                module="Status"
                loading={updateStatus?.loading}
            />
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

                            <div className="dept-page-cover-section">
                                <div className="profile_pic_head">
                                    <UserProfileImageUpload
                                        formData={formData}
                                        setFormData={setFormData}
                                        fieldName="user_image"
                                        isEditMode={false}
                                    />
                                </div>
                                <StatusDropdown
                                    options={travelStatusOptions?.filter((item) => item?.label !== "All")?.map((item) => ({
                                        value: item?.id,
                                        label: item?.label,
                                        icon: item?.icon,

                                    }))}
                                    defaultValue={formData?.status}
                                    onChange={(val) => handleStatus(val)}
                                    viewMode={viewMode !== "detail"}
                                />
                            </div>
                            {viewMode === 'detail' && (
                                <button className="dept-page-edit-btn" onClick={handleEditClick}>
                                    {/* /<PencilLine size={16} /> */}
                                    Edit
                                </button>
                            )}
                            <EmployeTravelForm
                                viewMode={viewMode}
                                formData={formData}
                                setFormData={setFormData}
                                handleSearch={handleSearch}
                            />
                        </div>
                    )}

                    {activeFormIndex == 1 &&
                        <TravelHistory />
                    }
                </div>
            </div>
        </>
    );
};

export default EmployeTravelDetail;