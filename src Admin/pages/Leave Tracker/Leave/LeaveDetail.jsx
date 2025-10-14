import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    User,
    BookUser,
    Pencil
} from 'lucide-react';
import bannerImg from '../../../assets/Bookyourcampaign.svg';
import Loader from '../../../utils/common/Loader/Loader.jsx';
import { leavesStatusOptions } from '../../../utils/Constant.js';
import { LeaveForm } from './LeaveForm.jsx';
import StatusDropdown from '../../../utils/common/StatusDropdown/StatusDropdown.jsx';
import { getEmployeeList } from '../../../Redux/Actions/employeeActions.js';
import { getLeaveTypeList } from '../../../Redux/Actions/leaveMasterActions.js';
import { getLeaveDetails, updateLeaveStatus } from '../../../Redux/Actions/leaveActions.js';
import { LeaveSummary } from './LeaveSummary.jsx';
import { UserProfileImageUpload } from '../../../utils/common/UserProfileImageUpload/UserProfileImageUpload.jsx';
import ConfirmPopup from '../../../utils/common/ConfirmPopup.jsx';

const texts = {
    add: {
        header: "Add New Leave",
        mark: "Fill The Information",
        info: "You're Just One Step Away From Adding The New Leave!",
    },
    edit: {
        header: "Edit Leave",
        mark: "Edit Information",
        info: "Here’s The Information About The Leave Details You’ve Filled. ",
    },
    detail: {
        header: "leave Details",
        mark: "Provided Details!",
        info: "Check out your leave information!",
    },
};

export const LeaveDetail = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();

    const [viewMode, setViewMode] = useState('detail');
    const [formData, setFormData] = useState({
        user_id: '',
        user_name: '',
        leave_type_id: '',
        leave_type_name: '',
        type_of_leave: '',
        from_date: '',
        to_date: '',
        reason: '',
        status: 2
    });

    // Fetch data from Redux state using useSelector
    const employeeData = useSelector((state) => state?.employeeList);
    const employeeLists = employeeData?.data?.result;

    const leaveMasterData = useSelector((state) => state?.leaveMasterList);
    const leaveMasterLists = leaveMasterData?.data?.result || [];

    const leaveData = useSelector((state) => state?.leaveDetails);
    const leaveDetails = leaveData?.data?.leave || {};

    const updateStatus = useSelector((state) => state?.updateLeaveStatus);

    const [activeFormIndex, setActiveFormIndex] = useState(0);
    const navItems = [
        { name: 'Basic Information', icon: BookUser },
        { name: 'Leave Summary', icon: User },

    ];
    const [filledForms, setFilledForms] = useState({
        'Basic Information': false,
        'Leave Summary': false,
    });

    useEffect(() => {
        if (id && leaveDetails?.id !== id) {
            dispatch(getLeaveDetails({ id }))
        }
    }, [id]);

    // Update formData when Redux state for leave details
    useEffect(() => {
        if (id && leaveDetails) {
            setFormData((prev) => ({
                ...prev,
                user_id: leaveDetails?.user_id || '',
                user_name: [leaveDetails?.employee?.first_name, leaveDetails?.employee?.last_name]
                    .filter(Boolean)
                    .join(" "),
                user_image: leaveDetails?.employee?.image ? JSON.parse(leaveDetails?.employee?.image) : "",
                leave_type_id: leaveDetails?.leave_type_id || '',
                leave_type_name: leaveDetails?.leave_type?.leave_type || '',
                type_of_leave: leaveDetails?.type_of_leave || '',
                from_date: leaveDetails?.from_date || '',
                to_date: leaveDetails?.to_date || '',
                reason: leaveDetails?.reason || '',
                status: leaveDetails?.status || 2
            }));
        }
    }, [leaveDetails?.id]);

    // Fetch data based on current state
    const fetchEmployees = (search = "") => {
        const sendData = { employee_status: "1,5" };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getEmployeeList(sendData));
    };

    const fetchLeaveTypes = (search = "") => {
        const sendData = { status: 1 };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getLeaveTypeList(sendData));
    };

    const handleSearch = (query, type) => {
        if (type === "user_id") fetchEmployees(query)
        if (type === "leave_type_id") fetchLeaveTypes(query)
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/add-new-leave') || path.includes('/edit-leave-details')) {
            // if (!employeeLists || employeeLists?.length === 0) 
            fetchEmployees();
            // if (leaveMasterLists?.length === 0) 
            fetchLeaveTypes();
        }
    }, [location.pathname]);

    // useEffect to manage view mode and data fetching
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/add-new-leave')) {
            setViewMode('add');
        } else if (path.includes('/edit-leave-details')) {
            setViewMode('edit');
        } else {
            setViewMode('detail');
        }
    }, [location.pathname]);


    const handleEditClick = () => {
        navigate(`/edit-leave-details/${id}`);
    };

    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");

    const handleUpdateStatus = () => {
        const sendData = {
            id: id,   // applicant ke liye job_id nahi applicant_id bhejna hai
            status: selectedStatus,
        };
        dispatch(updateLeaveStatus(sendData))
            .then((res) => {
                if (res?.success) {
                    setShowModal(false);
                    dispatch(getLeaveDetails({ id }));
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

    if (leaveData?.loading) {
        return <div className="loading-state"> <Loader /> </div>;
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
            <div className="leaveDetailsMain">
                <div className="dept-page-container">
                    <button onClick={() => navigate(`${viewMode == 'edit' ? `/leave-details/${id}` : '/leave-list'}`)} className="close_nav header_close">Close</button>
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
                                <div className="navbar-container"> {/* Ek wrapper div add karein */}
                                    <div className="navbar-items">
                                        {navItems?.map((item, index) => {
                                            // Logic to determine if a tab should be clickable
                                            const isFirstTab = index === 0;
                                            // ✅ First tab always clickable
                                            const isClickable = isFirstTab || Boolean(id);
                                            return (
                                                <span
                                                    key={index}
                                                    className={`${index === activeFormIndex ? 'active' : ''} ${filledForms[item?.name] ? 'filled' : ''} ${!isClickable ? 'disabled' : ''}`}
                                                    onClick={() => {
                                                        if (isClickable) setActiveFormIndex(index);
                                                    }}
                                                >
                                                    <item.icon size={20} strokeWidth={1.5} /> {/* Icon render karein */}
                                                    <p>{item?.name}</p> {/* Text render karein */}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                        {activeFormIndex == 0 &&
                            <div className="dept-page-right-panel ">
                                <div className="dept-page-cover-section dept-page-cover-section_2">
                                    <div className="profile_pic_head">
                                        <UserProfileImageUpload
                                        formData={formData}
                                        setFormData={setFormData}
                                        fieldName="user_image"
                                        isEditMode={false}
                                    />
                                    </div>
                                    {/* {viewMode !== "detail" ? */}
                                    <StatusDropdown
                                        options={leavesStatusOptions?.filter((item) => item?.label !== "All")?.map((item) => ({
                                            value: item?.id,
                                            label: item?.label,
                                            icon: item?.icon,

                                        }))}
                                        defaultValue={formData?.status}
                                        onChange={(val) => handleStatus(val)}
                                        viewMode={viewMode !== "detail"}
                                    />
                                    {/* : */}
                                    {/* <div className="status-dropdown">
                                        <div className={`status-label dropdown-trigger`}>
                                            {leavesStatusOptions?.filter((item) => item.id == formData?.status)?.[0]?.label}
                                        </div>
                                    </div>
                                } */}
                                </div>
                                {viewMode === 'detail' && (
                                    <button className="dept-page-edit-btn" onClick={handleEditClick}>
                                        Edit
                                    </button>
                                )}
                                <LeaveForm
                                    viewMode={viewMode}
                                    formData={formData}
                                    setFormData={setFormData}
                                    handleSearch={handleSearch}
                                />
                            </div>
                        }
                        {activeFormIndex == 1 &&
                            <LeaveSummary emp_id={leaveDetails?.user_id} />
                        }
                    </div>

                </div>
            </div>
        </>
    )
}
