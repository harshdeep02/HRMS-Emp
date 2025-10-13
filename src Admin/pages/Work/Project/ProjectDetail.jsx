import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    Pencil,
    User,
} from "lucide-react";
import bannerImg from "../../../assets/Kanban_board.svg";
import StatusDropdown from "../../../utils/common/StatusDropdown/StatusDropdown";
import { useDispatch, useSelector } from "react-redux";
import { getClientList } from "../../../Redux/Actions/clientActions";
import Loader from "../../../utils/common/Loader/Loader";
import { getEmployeeList } from "../../../Redux/Actions/employeeActions";
import { getDepartmentList } from "../../../Redux/Actions/departmentActions";
import { ProjectStatusOptions } from "../../../utils/Constant";
import ProjectForm from "./ProjectForm";
import { getProjectDetails } from "../../../Redux/Actions/projectActions";

export const ProjectDetail = () => {

    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Data from redux
    const projectDetails = useSelector((state) => state?.projectDetails);
    const projectDetail = projectDetails?.data?.result;
    const projectDetailLoading = projectDetails?.loading || false;
    const projectDelete = useSelector((state) => state?.projectDelete);

    const employeeData = useSelector((state) => state?.employeeList);
    const employeeLists = employeeData?.data?.result || [];

    const clientData = useSelector((state) => state?.clientList);
    const clientLists = clientData?.data?.result || [];

    const departmentData = useSelector((state) => state?.departmentList);
    const departmentLists = departmentData?.data?.department || [];

    const fetchClients = (search = "") => {
        const sendData = { status: 1 };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getClientList(sendData));
    };

    const fetchEmployees = async (search = "") => {
        const sendData = {};
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getEmployeeList(sendData));
    };

    const fetchDepartments = async (search = "") => {
        const sendData = {};
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getDepartmentList(sendData));
    };

    const handleSearch = (query, type) => {
        console.log({ query, type });

        if (type === "client_id") fetchClients(query);
        if (type === "employee") fetchEmployees(query);
        if (type === "department_id") fetchDepartments(query);
    };

    useEffect(() => {
        const path = location.pathname;
        if (employeeLists?.length === 0) fetchEmployees();
        if (path.includes('/add-project') || path.includes('/edit-project')) {
            if (clientLists?.length === 0) fetchClients();
            if (departmentLists?.length === 0) fetchDepartments();
        }
    }, [location.pathname]);

    const [viewMode, setViewMode] = useState("");
    const [formData, setFormData] = useState({
        project_name: "",
        client_id: '',
        rate: "",
        priority: "",
        start_date: "",
        end_date: "",
        project_leader_id: "",
        department_id: "",
        team_members: [],
        attachments: "",
        description: "",
        status: 1,
    });

    const isDetailView = viewMode === "detail";

    useEffect(() => {
        const path = location.pathname;
        if (path.includes("add-project")) {
            setViewMode("add");
        } else if (path.includes("edit-project")) {
            setViewMode("edit");
        } else if (path.includes("project-details")) {
            setViewMode("detail");
        }
    }, [location]);

    useEffect(() => {
        if (id && projectDetail?.id != id) {
            const queryParams = {
                id: id,
            };
            dispatch(getProjectDetails(queryParams));
        }
    }, [id]);

    useEffect(() => {
        if (id && projectDetail) {
            setFormData((prev) => ({
                ...prev,
                project_name: projectDetail?.project_name || "",
                client_id: projectDetail?.client_id || "",
                rate: projectDetail?.client_id || "",
                priority: projectDetail?.priority || "",
                start_date: projectDetail?.start_date || "",
                end_date: projectDetail?.end_date || "",
                project_leader_id: projectDetail?.project_leader_id || "",
                project_leader: projectDetail?.project_leader ? [projectDetail?.project_leader?.first_name, projectDetail?.project_leader?.last_name].filter(Boolean).join(" ") : "",
                department_id: projectDetail?.department_id || "",
                team_members: projectDetail?.team_members ? JSON.parse(projectDetail?.team_members) : [],
                attachments: projectDetail?.attachments ? JSON.parse(projectDetail?.attachments) : "",
                description: projectDetail?.description || "",
                status: projectDetail?.status || 1,
            }));
        }
    }, [projectDetail]);

    const renderHeader = () => {
        switch (viewMode) {
            case "add":
                return "Add New Project";
            case "edit":
                return "Edit Project";
            case "detail":
            default:
                return "Project Details";
        }
    };

    const renderMark = () => {
        switch (viewMode) {
            case "add":
                return "Fill The Information";
            case "edit":
                return "Edit Information";
            case "detail":
            default:
                return "Provided Details";
        }
    };

    const renderHeaderInfo = () => {
        switch (viewMode) {
            case "add":
                return "You're just one step away from adding a new project!";
            case "edit":
                return "Here's the Information About The Project You've Filled.";
            case "detail":
            default:
                return "Here’s the information about the project you’ve filled.";
        }
    };

    const handleStatus = (val) => {
        setFormData((prev) => ({ ...prev, status: val }));
    };

    const handleEditClick = () => {
        navigate(`/edit-project/${id || "dummy-id"}`);
    };


    if (projectDetailLoading) {
        return (
            <div className="loading-state">
                <Loader />
            </div>
        );
    }

    return (
        <div className="projectDetailsMain">
            <button
                onClick={() => navigate(viewMode === "edit" ? `/project-details/${id}` : "/project-list")}
                className="close_nav header_close"
            >
                Close
            </button>

            <div className="dept-page-container">
                <h2 className="dept-page-main-heading">{renderHeader()}</h2>
                <div className="dept-page-content-wrapper">
                    {/* Left Panel */}
                    <div className="dept-page-left-panel">
                        <h3 className="dept-page-mark-text">{renderMark()}</h3>
                        <p className="dept-page-info-text">{renderHeaderInfo()}</p>
                        <div className="dept-page-illustration-box">
                            <img
                                className="imgBlacked White"
                                src={bannerImg}
                                alt="Illustration"
                            />
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="dept-page-right-panel">
                        <div className="dept-page-cover-section">
                            <div className="dept-page-basic-info-section dept-page-basic-info-section_2">
                                <h3>Basic Information</h3>
                                <p className="dept-page-subtitle">{viewMode !== "detail" ? "Please Provide" : ''} Project Basic Details Below.</p>
                            </div>
                            <StatusDropdown
                                options={ProjectStatusOptions?.map((item) => ({
                                    value: item?.id,
                                    label: item?.label,
                                    icon: item?.icon,

                                }))}
                                defaultValue={formData?.status}
                                onChange={(val) => handleStatus(val)}
                                isDisabled={isDetailView}
                                viewMode={viewMode !== "detail"}
                            />
                        </div>

                        {viewMode === "detail" && (
                            <button className="dept-page-edit-btn" onClick={handleEditClick}>
                                Edit
                            </button>
                        )}

                        <ProjectForm
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
};