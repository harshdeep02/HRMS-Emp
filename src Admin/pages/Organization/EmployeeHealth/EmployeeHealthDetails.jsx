import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PencilLine } from "lucide-react";
import bannerImg from "../../../assets/Personal_health.svg";
import Loader from "../../../utils/common/Loader/Loader.jsx";
import StatusDropdown from "../../../utils/common/StatusDropdown/StatusDropdown.jsx";
import { UserProfileImageUpload } from "../../../utils/common/UserProfileImageUpload/UserProfileImageUpload.jsx";
import "../../EmployeeOnboarding/AddEmployee/AddEmloyee.scss";
import '../../EmployeeModule/Applicant/ApplicantDetails.scss'
import './EmployeeHealthDetails.scss'
import { useDispatch, useSelector } from "react-redux";
import { getEmpHealthDetails, updateEmpHealthStatus } from "../../../Redux/Actions/employeeHealthActions.js";
import { empHealthStatusOptions } from "../../../utils/Constant.js";
import EmpHealthForm from "./EmpHealthForm.jsx";
import { getEmployeeList } from "../../../Redux/Actions/employeeActions.js";
import ConfirmPopup from "../../../utils/common/ConfirmPopup.jsx";

export const EmployeeHealthDetails = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();

    //Data from redux
    const empHealthDetails = useSelector((state) => state?.empHealthDetails);
    const empHealthDetail = empHealthDetails?.data?.result || {};
    const empHealthDetailLoading = empHealthDetails?.loading || false;
    const updateStatus = useSelector((state) => state?.updateEmpHealthStatus);

    const employeeData = useSelector((state) => state?.employeeList);
    const employeeList = employeeData?.data?.result || [];

    const [viewMode, setViewMode] = useState("detail");
    const [formData, setFormData] = useState({
        user_id: "",
        user_image: "",
        department_id: "",
        contact_no: "",
        contact_name: "",
        gender: "",
        blood_group: "",
        weight: "",
        height: "",
        allergies: "",
        chronic_condition: "",
        current_medications: "",
        last_checkup_date: "",
        next_checkup_date: "",
        checkup_result: "",
        covid_affected: "",
        covid_status: "",
        attachment: "",
        notes: "",
        status: 1
    });

    // Fetch data based on current state
    const fetchDepartments = (search = "") => {
        const sendData = { status: 1 };
        if (search) {
            sendData["search"] = search;
        }
        // dispatch(getDepartmentList(sendData));
    };

    const fetchEmployees = (search = "") => {
        const sendData = { employee_status: 1 };
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
        if (path.includes('/add-new-employee-health') || path.includes('/edit-employee-health')) {
            // if (departmentList?.length === 0) 
            // fetchDepartments();
            // if (employeeList?.length === 0) 
            fetchEmployees();
        }
    }, [location.pathname]);

    useEffect(() => {
        const path = location.pathname;
        if (path.includes("/add-new-employee-health")) {
            setViewMode("add");
        } else if (id) {
            setViewMode(path.includes("/edit-employee-health") ? "edit" : "detail");
        }
    }, [location.pathname, id]);

    useEffect(() => {
        if (id && empHealthDetail?.id != id) {
            dispatch(getEmpHealthDetails({ id }));
        }
    }, [id]);

    useEffect(() => {
        if (id && empHealthDetail) {
            setFormData((prev) => ({
                ...prev,
                user_id: empHealthDetail?.user_id || "",
                user: [empHealthDetail?.employee?.first_name, empHealthDetail?.employee?.last_name]?.filter(Boolean)?.join(" "),
                department_id: empHealthDetail?.department_id || "",
                department_name: empHealthDetail?.department ? empHealthDetail?.department?.department_name : "",
                contact_no: empHealthDetail?.contact_no || "",
                contact_name: empHealthDetail?.contact_name || "",
                gender: empHealthDetail?.gender || "",
                blood_group: empHealthDetail?.blood_group || "",
                weight: empHealthDetail?.weight || "",
                height: empHealthDetail?.height || "",
                allergies: empHealthDetail?.allergies || "",
                chronic_condition: empHealthDetail?.chronic_condition || "",
                current_medications: empHealthDetail?.current_medications || "",
                last_checkup_date: empHealthDetail?.last_checkup_date || "",
                next_checkup_date: empHealthDetail?.next_checkup_date || "",
                checkup_result: empHealthDetail?.checkup_result || "",
                covid_affected: empHealthDetail?.covid_affected || "",
                covid_status: empHealthDetail?.covid_status || "",
                attachment: empHealthDetail?.attachment ? JSON.parse(empHealthDetail?.attachment) : "",
                // attachment: empHealthDetail?.attachment,
                notes: empHealthDetail?.notes || "",
                status: empHealthDetail?.status,
                user_image: empHealthDetail?.employee?.image ? JSON.parse(empHealthDetail?.employee?.image) : ""
            }));
        }
    }, [empHealthDetail]);

    const handleEditClick = () => navigate(`/edit-employee-health/${id}`);

    //update status
    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const handleUpdateStatus = () => {
        const sendData = {
            id: id,
            status: selectedStatus,
        };
        dispatch(updateEmpHealthStatus(sendData))
            .then((res) => {
                if (res?.success) {
                    setShowModal(false);
                    dispatch(getEmpHealthDetails({ id }));
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

    const renderHeader = () =>
        viewMode === "add"
            ? "Add New Employee Health"
            : viewMode === "edit"
                ? "Edit Employee Health"
                : "Employee Health Details";
    const renderMark = () =>
        viewMode === "add" ? "Fill The Information" :
            viewMode === "edit"
                ? "Edit Information" : "Provided Details!";
    const renderHeaderInfo = () =>
        viewMode === "add"
            ? "You're just one step away from adding the new Employee Health!"
            : viewMode === "edit" ? "Here’s The Information About The Employee Health You’ve Filled. "
                : "Check Out Your Health Information!";


    if (empHealthDetailLoading)
        return (
            <div className="loading-state">
                <Loader />
            </div>
        );

    const isDetailView = viewMode === "detail";

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
            <div className="employeeHealthDetailMain">
                <button onClick={() => navigate(`${viewMode == 'edit' ? `/employee-health-details/${id}` : '/employee-health-list'}`)} className="close_nav header_close">Close</button>
                <div className="dept-page-container">
                    <h2 className="dept-page-main-heading">{renderHeader()}</h2>
                    <div className="dept-page-content-wrapper">
                        <div className="dept-page-left-panel">
                            <h3 className="dept-page-mark-text">{renderMark()}</h3>
                            <p className="dept-page-info-text">{renderHeaderInfo()}</p>
                            <div className="dept-page-illustration-box">
                                <img
                                    className=" "
                                    src={bannerImg}
                                    alt="Illustration"
                                />
                            </div>
                        </div>

                        <div className="dept-page-right-panel">
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
                                    options={empHealthStatusOptions?.filter((item) => item?.label !== "All")?.map((item) => ({
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
                                        {empHealthStatusOptions?.filter((item) => item.id == formData?.status)?.[0]?.label}
                                    </div>
                                </div>
                            } */}
                            </div>

                            {isDetailView && (
                                <button className="dept-page-edit-btn" onClick={handleEditClick}>
                                    <PencilLine size={16} /> Edit
                                </button>
                            )}

                            <EmpHealthForm
                                viewMode={viewMode}
                                formData={formData}
                                setFormData={setFormData}
                                handleSearch={handleSearch}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
