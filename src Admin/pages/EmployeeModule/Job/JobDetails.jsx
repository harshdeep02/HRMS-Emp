import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import bannerImg from "../../../assets/Loginweb.svg";
import Loader from "../../../utils/common/Loader/Loader.jsx";
import StatusDropdown from "../../../utils/common/StatusDropdown/StatusDropdown.jsx";
import "../../EmployeeOnboarding/AddEmployee/AddEmloyee.scss";
import "../Applicant/ApplicantDetails.scss";
import './JobDetails.scss'
import JobForm from "./JobForm.jsx";
import { jobStatusOptions } from "../../../utils/Constant.js";
import { useDispatch, useSelector } from "react-redux";
import { getDepartmentList } from "../../../Redux/Actions/departmentActions.js";
import { getDesignationList } from "../../../Redux/Actions/designationActions.js";
import { getJobDetails, updateNewJobStatus } from "../../../Redux/Actions/jobActions.js";
import ConfirmPopup from "../../../utils/common/ConfirmPopup.jsx";

export const JobDetails = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();

    //Data from redux
    const jobData = useSelector((state) => state?.jobDetails);
    const jobDetail = jobData?.data?.jobOpening;
    const jobDetailLoading = jobData?.loading || false;
    const updateStatus = useSelector((state) => state?.updateJobStatus);
    const designationData = useSelector((state) => state?.designationList);
    const designationList = designationData?.data?.designation || [];

    const departmentData = useSelector((state) => state?.departmentList);
    const departmentList = departmentData?.data?.department || [];

    const [viewMode, setViewMode] = useState("detail");
    const [formData, setFormData] = useState({
        job_title: "",
        department: "",
        designation: "",
        job_location: "",
        job_status: 2,
        no_of_position: "",
        employment_type: "",
        experience_level: "",
        experience_required: "",
        qualification: "",
        required_skills: "",
        joining_date: "",
        description: "",
    });

    // Fetch data based on current state
    const fetchDepartments = (search = "") => {
        const sendData = { status: 1 };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getDepartmentList(sendData));
    };

    const fetchDesignations = (search = "") => {
        const sendData = { status: 1 };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getDesignationList(sendData));
    };

    const handleSearch = (query, type) => {
        if (type === "department") {
            fetchDepartments(query);
        }
        else if (type === "designation") {
            fetchDesignations(query)
        }
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/add-new-job') || path.includes('/edit-job-details')) {
            // if (departmentList?.length === 0) 
            fetchDepartments();
            // if (designationList?.length === 0) 
            fetchDesignations();
        }
    }, [location.pathname]);

    useEffect(() => {
        const path = location.pathname;
        if (path.includes("/add-new-job")) {
            setViewMode("add");
        } else if (path.includes("/edit-job-details")) {
            setViewMode("edit");
        }
        else if (path.includes("/job-details")) {
            setViewMode("detail");
        }
    }, [location.pathname, id]);

    useEffect(() => {
        if (id && jobDetail?.id != id) {
            dispatch(getJobDetails({ id }));
        }
    }, [id]);

    useEffect(() => {
        if (id && jobDetail) {
            setFormData((prev) => ({
                ...prev,
                job_title: jobDetail?.job_title || "",
                department: jobDetail?.department?.id || "",
                department_name: jobDetail?.department?.department_name || "",
                designation: jobDetail?.designation?.id || "",
                designation_name: jobDetail?.designation?.designation_name || "",
                job_location: jobDetail?.job_location || "",
                job_status: jobDetail?.job_status || 2,
                no_of_position: jobDetail?.no_of_position || "",
                employment_type: jobDetail?.employment_type || "",
                experience_level: jobDetail?.experience_level || "",
                experience_required: jobDetail?.experience_required || "",
                qualification: jobDetail?.qualification || "",
                required_skills: jobDetail?.required_skills ? JSON.parse(jobDetail?.required_skills) : "",
                joining_date: jobDetail?.joining_date || "",
                description: jobDetail?.description || "",
            }));
        }
    }, [viewMode, jobDetail]);

    const handleEditClick = () => navigate(`/edit-job-details/${id}`);

    //update status
    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const handleUpdateStatus = () => {
        const sendData = {
            job_id: id,
            job_status: selectedStatus,
        };
        dispatch(updateNewJobStatus(sendData))
            .then((res) => {
                if (res?.success) {
                    setShowModal(false);
                    dispatch(getJobDetails({ id }));
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
                job_status: val,
            }));
        }
        else {
            setShowModal(true);
            setSelectedStatus(val);
        }
    };

    const renderHeader = () =>
        viewMode === "add"
            ? "Add New Job Details"
            : viewMode === "edit"
                ? "Edit Job Post"
                : "Job Details";
    const renderMark = () =>
        viewMode === "add" ? "Fill The Information" : viewMode === "edit"
            ? "Edit The Information"
            : "Provided Details.";
    const renderHeaderInfo = () =>
        viewMode === "add"
            ? "You're just one step away from adding the new job posting!"
            : viewMode === "edit"
                ? "Here’s the information about the jobs details you’ve filled."
                : "Here’s the information about the job you’ve filled.";

    if (jobDetailLoading) {
        return (
            <div className="loading-state">
                {" "}
                <Loader />{" "}
            </div>
        );
    }

    return (
        <div className="jobDetailsMain">
            <ConfirmPopup
                open={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleUpdateStatus}
                type="update"
                module="Status"
                loading={updateStatus?.loading}
            />
            <button onClick={() => navigate(`${viewMode == 'edit' ? `/job-details/${id}` : '/job-list'}`)} className="close_nav header_close">Close</button>
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
                        <div className="dept-page-cover-section">
                            <div className="dept-page-basic-info-section dept-page-basic-info-section_3">
                                <h3>Basic Information</h3>
                                <p className="dept-page-subtitle">Basic profile overview</p>
                            </div>
                            {/* {viewMode !== "detail" ? */}
                            <StatusDropdown
                                options={jobStatusOptions
                                    ?.filter((item) => item?.label !== "All")
                                    ?.map((item) => ({
                                        value: item?.id,
                                        label: item?.label,
                                        icon: item?.icon,
                                    }))}
                                defaultValue={formData?.job_status}
                                onChange={(val) => handleStatus(val)}
                                viewMode={viewMode !== "detail"}
                            />
                            {/* :
                            <div className="status-dropdown">
                                <div className={`status-label dropdown-trigger`}>
                                    {jobStatusOptions?.filter((item) => item.id == formData?.job_status)?.[0]?.label}
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

                        <JobForm
                            viewMode={viewMode}
                            formData={formData}
                            setFormData={setFormData}
                            handleSearch={handleSearch}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
