import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import bannerImg from "../../../assets/Folder.svg";
import Loader from "../../../utils/common/Loader/Loader.jsx";
import StatusDropdown from "../../../utils/common/StatusDropdown/StatusDropdown.jsx";
import "../../EmployeeOnboarding/AddEmployee/AddEmloyee.scss";
import "../../EmployeeModule/Applicant/ApplicantDetails.scss";
import '../../EmployeeModule/Job/JobDetails.scss';
import { FaFile } from "react-icons/fa6";
import { orgnisationFilesStatusOptions } from "../../../utils/Constant.js";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeList } from "../../../Redux/Actions/employeeActions.js";
import { getFileDetails } from "../../../Redux/Actions/fileActions.js";
import { OrganizationFileForm } from "./OrganizationFileForm.jsx";
export const OrganizationFileDetails = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();

    //Data from redux
    const employeeData = useSelector((state) => state?.employeeList);
    const employeeList = employeeData?.data?.result;

    const filesData = useSelector((state) => state?.fileDetails);
    const fileDetails = filesData?.data?.myfile;

    const [viewMode, setViewMode] = useState("detail");
    const [formData, setFormData] = useState({
        employees: [],
        deadline: "",
        description: "",
        file_name: '',
        notify_all: '',
        notify_any_others: '',
        attachment: [],
        status: 1
    });

    const fetchEmployee = (search = "") => {
        const sendData = {};
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getEmployeeList(sendData));
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/add-employee-file') || path.includes('/edit-organisation-file')) {
            if (!employeeList) fetchEmployee();
        }
    }, [location]);

    useEffect(() => {
        if (id && fileDetails?.id != id) {
            dispatch(getFileDetails({ id }));
        }
    }, [id]);

    const handleSearch = (query) => {
        fetchEmployee(query);
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.includes("/add-organisation-file")) {
            setViewMode("add");
        } else if (path.includes("/edit-organisation-file")) {
            setViewMode("edit");
        }
        else if (path.includes("/organisation-file-details")) {
            setViewMode("detail");
        }
    }, [location.pathname, id]);

    useEffect(() => {
        if (id && fileDetails) {
            setFormData((prev) => ({
                ...prev,
                employees: fileDetails?.employees ? JSON.parse(fileDetails?.employees) : [],
                deadline: fileDetails?.deadline,
                file_name: fileDetails?.file_name,
                notify_all: fileDetails?.notify_all,
                notify_any_others: fileDetails?.notify_any_others ? JSON.parse(fileDetails?.notify_any_others) : [],
                description: fileDetails?.description,
                status: fileDetails?.status,
                attachment: fileDetails?.attachment?.length > 0 ? JSON.parse(fileDetails?.attachment) : "",
            }));
        }
    }, [viewMode, fileDetails]);

    const handleEditClick = () => navigate(`/edit-organisation-file/${id}`);

    const handleStatus = (val) => {
        setFormData((prevData) => ({
            ...prevData,
            status: val,
        }));
    };

    const renderHeader = () =>
        viewMode === "add"
            ? "Add New Organization File"
            : viewMode === "edit"
                ? "Edit Organization Details"
                : "Organization File Details";
    const renderMark = () =>
        viewMode === "add" ? "Fill The Information" : viewMode === "edit"
            ? "Edit Information"
            : "Provided Details.";
    const renderHeaderInfo = () =>
        viewMode === "add"
            ? "You're just one step away from adding the New Organization Details!"
            : viewMode === "edit"
                ? "Here’s the information about the Organization Details you’ve filled."
                : "Check out Your Organization information!";

    if (filesData?.loading) {
        return (
            <div className="loading-state"> <Loader /> </div>
        )
    }

    return (
        <div className="organizationFileDeatilsMain">
            <button onClick={() => navigate(`${viewMode == 'edit' ? `/organisation-file-details/${id}` : '/organisation-file-list'}`)} className="close_nav header_close">Close</button>
            <div className="dept-page-container">
                <h2 className="dept-page-main-heading">{renderHeader()}</h2>
                <div className="dept-page-content-wrapper">
                    <div className="dept-page-left-panel">
                        <h3 className="dept-page-mark-text">{renderMark()}</h3>
                        <p className="dept-page-info-text">{renderHeaderInfo()}</p>
                        <div className="dept-page-illustration-box">
                            <img
                                className="img BlackedWhite"
                                src={bannerImg}
                                alt="Illustration"
                            />
                        </div>
                    </div>

                    <div className="dept-page-right-panel">
                        <div className="dept-page-cover-section">
                            {/* <div className="dept-page-image-placeholder">
                                <FaFile size={50} color="#494949" />
                            </div> */}
                            <div className="dept-page-basic-info-section dept-page-basic-info-section_2">
                                <h3>Basic Information</h3>
                                <p className="dept-page-subtitle">{viewMode !== "detail" ? "Please Provide" : ''} Organisation Basic Details Below.</p>
                            </div>
                            {/* {viewMode !== "detail" ? */}
                            <StatusDropdown
                                options={orgnisationFilesStatusOptions
                                    ?.filter((item) => item?.label !== "All")
                                    ?.map((item) => ({
                                        value: item?.id,
                                        label: item?.label,
                                        icon: item?.icon,

                                    }))}
                                defaultValue={formData?.status}
                                viewMode={viewMode !== "detail"}
                                onChange={(val) => handleStatus(val)}
                            />
                            {/* :
                                <div className="status-dropdown">
                                    <div className={`status-label dropdown-trigger`}>
                                        {orgnisationFilesStatusOptions?.filter((item) => item?.id == formData?.status)?.[0]?.label}
                                    </div>
                                </div>
                            } */}
                        </div>

                        {viewMode === 'detail' && (
                            <button className="dept-page-edit-btn" onClick={handleEditClick}>
                                Edit
                            </button>
                        )}

                        <OrganizationFileForm
                            viewMode={viewMode}
                            formData={formData}
                            setFormData={setFormData}
                            handleSearch={handleSearch}
                            employeeList={employeeList}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
