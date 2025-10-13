import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    User,
    BookPlus,
    Pencil
} from 'lucide-react';
import bannerImg from '../../../../assets/Comments.svg';
import StatusDropdown from '../../../../utils/common/StatusDropdown/StatusDropdown.jsx';
import { getDepartmentList } from '../../../../Redux/Actions/departmentActions.js';
import { getDesignationDetails } from '../../../../Redux/Actions/designationActions.js';
import Loader from '../../../../utils/common/Loader/Loader.jsx';
import { designationStatusOptions } from '../../../../utils/Constant.js';
import DesignationForm from './DesignationForm.jsx';
import { FaUserTag } from "react-icons/fa";
import DesignationEmployeeList from './DesignationEmployeeList.jsx';


const texts = {
    add: {
        header: "Add New Designation",
        mark: "Fill The Information",
        info: "You're Just One Step Away From Adding The New Designation!",
    },
    edit: {
        header: "Edit Designation Details",
        mark: "Edit The Information",
        info: "You're Just One Step Away From Making The Changes In Defined Designation!",
    },
    detail: {
        header: "Designation Details",
        mark: "Provided Details!",
        info: "Check out your Designation information!",
    },
};

const DesignationDetails = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();

    const [viewMode, setViewMode] = useState('detail');
    const [formData, setFormData] = useState({
        designation_name: '',
        department_id: '',
        description: '',
        status: 1
    });

    // Fetch data from Redux state using useSelector
    const designationDetails = useSelector((state) => state?.designationDetails);
    const designationDetail = designationDetails?.data?.designation;
    const designationLoading = designationDetails?.loading || false;

    const departmentData = useSelector((state) => state?.departmentList);
    const departmentLists = departmentData?.data?.department || [];

    const [activeFormIndex, setActiveFormIndex] = useState(0);

    const navItems = [
        { name: 'Basic Information', icon: BookPlus },
        { name: 'Employee Summary', icon: User },

    ];
    const [filledForms, setFilledForms] = useState({
        'Basic Information': false,
        'Employee Summary': false,
    });

    // Fetch data based on current state
    const fetchDepartments = (search = "") => {
        const sendData = { status: 1 };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getDepartmentList(sendData));
    };

    const handleSearch = (query, type) => {
        if (type === "department_id") {
            fetchDepartments(query);
        }
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/add-designation') || path.includes('/edit-designation')) {
            if (departmentLists?.length === 0) fetchDepartments();
        }
    }, [location.pathname]);

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/add-designation')) {
            setViewMode('add');
        } else if (path.includes('/edit-designation')) {
            setViewMode('edit');
        } else {
            setViewMode('detail');
        }
    }, [location.pathname, id, dispatch]);

    useEffect(() => {
        if (id && designationDetail?.id != id) {
            dispatch(getDesignationDetails({ id }));
        }
    }, [id]);

    useEffect(() => {
        if (id && designationDetail) {
            setFormData((prev) => ({
                ...prev,
                designation_name: designationDetail?.designation_name || '',
                department_id: designationDetail?.department?.id || '',
                description: designationDetail?.description || '',
                status: designationDetail?.status || 1
            }));
        }
    }, [viewMode, designationDetail]);

    const handleEditClick = () => {
        navigate(`/edit-designation/${id}`);
    };

    const handleStatus = (val) => {
        setFormData(prevData => ({
            ...prevData,
            status: val,
        }));
    }

    if (designationLoading) {
        return <div className="loading-state"> <Loader /> </div>;
    }

    return (
        <div className="dept-page-container">
            <button onClick={() => navigate(`${viewMode == 'edit' ? `/designation-details/${id}` : '/designation-list'}`)} className="close_nav header_close">Close</button>

            <h2 className="dept-page-main-heading">{texts[viewMode].header}</h2>
            <div className="dept-page-content-wrapper">
                {viewMode === 'add' && (
                    <div className="dept-page-left-panel">
                        <h3 className="dept-page-mark-text">{texts[viewMode].mark}</h3>
                        <p className="dept-page-info-text">{texts[viewMode].info}</p>
                        <div className="dept-page-illustration-box">
                            <img className=' ' src={bannerImg} alt="Illustration" />
                        </div>
                    </div>
                )}
                {viewMode !== 'add' && (
                    <>
                        <div className="navbar-container">
                            <div className="navbar-items">
                                {navItems?.map((item, index) => {
                                    const isFirstTab = index === 0;
                                    const isClickable = isFirstTab || Boolean(id);
                                    return (
                                        <span
                                            key={index}
                                            className={`${index === activeFormIndex ? 'active' : ''} ${filledForms[item.name] ? 'filled' : ''} ${!isClickable ? 'disabled' : ''}`}
                                            onClick={() => {
                                                if (isClickable) setActiveFormIndex(index);
                                            }}
                                        >
                                            <item.icon size={20} strokeWidth={1.5} />
                                            <p>{item?.name}</p>
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
                {activeFormIndex == 0 &&
                    <div className="dept-page-right-panel">
                        <div className="dept-page-cover-section ">
                            <div className="dept-page-basic-info-section dept-page-basic-info-section_2">
                                <h3>Basic Information</h3>
                                <p className="dept-page-subtitle">Basic profile overview</p>
                            </div>
                            {/* {viewMode !== "detail" ? */}
                            <StatusDropdown
                                options={designationStatusOptions?.filter((item) => item?.label !== "All")?.map((item) => ({
                                    value: item?.id,
                                    label: item?.label,
                                    icon: item?.icon,
                                }))}
                                defaultValue={formData?.status}
                                onChange={(val) => handleStatus(val)}
                                viewMode={viewMode !== "detail"}

                            />
                            {/* :
                                <div className="status-dropdown">
                                    <div className={`status-label dropdown-trigger`}>
                                        {designationStatusOptions?.filter((item) => item.id == formData?.status)?.[0]?.label}
                                    </div>
                                </div>
                            } */}
                        </div>
                        {viewMode === 'detail' && (
                            <button className="dept-page-edit-btn" onClick={handleEditClick}>
                                {/* */}
                                Edit
                            </button>
                        )}

                        <DesignationForm
                            viewMode={viewMode}
                            formData={formData}
                            setFormData={setFormData}
                            handleSearch={handleSearch}
                        />
                    </div>
                }
                {viewMode === 'detail' && (
                    <>
                        {activeFormIndex == 1 &&
                            <div className="dept_page_table">
                                <div className="dept-page">
                                    <DesignationEmployeeList />
                                </div>
                            </div>
                        }
                    </>
                )}
            </div>
        </div>
    );
};

export default DesignationDetails;