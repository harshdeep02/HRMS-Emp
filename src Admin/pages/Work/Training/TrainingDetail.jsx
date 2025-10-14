import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    Pencil,
    User
} from "lucide-react";
import bannerImg from "../../../assets/Document_1.svg";
import StatusDropdown from "../../../utils/common/StatusDropdown/StatusDropdown";
import Loader from "../../../utils/common/Loader/Loader";
import '../../EmployeeOnboarding/AddEmployee/AddEmloyee.scss'
import { useDispatch, useSelector } from "react-redux";
import { getTrainingDetails } from "../../../Redux/Actions/trainingActions";
import { trainingStatusOptions } from "../../../utils/Constant";
import { getEmployeeList } from "../../../Redux/Actions/employeeActions";
import { getTrainerList } from "../../../Redux/Actions/trainerActions";
import TrainingForm from "./TrainingForm";

export const TrainingDetail = () => {

    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Data from redux
    const trainingDetails = useSelector((state) => state?.trainingDetails);
    const trainingDetail = trainingDetails?.data?.result;
    const trainingDetailLoading = trainingDetails?.loading || false;
    const trainingDelete = useSelector((state) => state?.trainingDelete);

    const employeeData = useSelector((state) => state?.employeeList);
    const employeeLists = employeeData?.data?.result || [];

    const trainerData = useSelector((state) => state?.trainerList);
    const trainerLists = trainerData?.data?.result || [];

    const fetchTrainers = (search = "") => {
        const sendData = { status: 1 };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getTrainerList(sendData));
    };

    const fetchEmployees = async (search = "") => {
        const sendData = {};
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getEmployeeList(sendData));
    };

    const handleSearch = (query, type) => {
        if (type === "trainer_id") fetchTrainers(query);
        if (type === "employee") fetchEmployees(query);
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/add-training') || path.includes('/edit-training')) {
            if (employeeLists?.length === 0) fetchEmployees();
            if (trainerLists?.length === 0) fetchTrainers();
        }
    }, [location]);

    const [viewMode, setViewMode] = useState("");
    const [formData, setFormData] = useState({
        trainer_id: "",
        employees: [],
        training_type: "",
        training_cost: "",
        start_date: "",
        end_date: "",
        duration: "",
        description: "",
        status: 3
    });

    // Detect view mode from URL
    useEffect(() => {
        if (location.pathname.includes("add-training")) {
            setViewMode("add");
        } else if (location.pathname.includes("edit-training")) {
            setViewMode("edit");
        } else if (location.pathname.includes("training-details")) {
            setViewMode("detail");
        }
    }, [location]);

    useEffect(() => {
        if (id && trainingDetail?.id != id) {
            const queryParams = {
                id: id,
            };
            dispatch(getTrainingDetails(queryParams));
        }
    }, [id]);

    useEffect(() => {
        if (id && trainingDetail) {
            setFormData((prev) => ({
                ...prev,
                trainer_id: trainingDetail?.trainer_id || "",
                training_type: trainingDetail?.training_type || "",
                trainer_name: trainingDetail?.trainer_name || "",
                training_cost: trainingDetail?.training_cost || "",
                employees: trainingDetail?.employees ? JSON.parse(trainingDetail?.employees) : [],
                start_date: trainingDetail?.start_date || "",
                end_date: trainingDetail?.end_date || "",
                duration: trainingDetail?.duration || "",
                description: trainingDetail?.description ? trainingDetail?.description : "",
            }));
        }
    }, [trainingDetail]);

    const renderHeader = () => {
        switch (viewMode) {
            case "add":
                return "Add New Training";
            case "edit":
                return "Edit Training";
            case "detail":
            default:
                return "Training Details";
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
                return "You're just one step away from adding the new Training!";
            case "edit":
                return "Here's the Information About The Training Details You've Filled.";
            case "detail":
            default:
                return "Here’s the information about the Training you’ve filled.";
        }
    };

    const handleStatus = (val) => {
        setFormData((prev) => ({ ...prev, status: val }));
    };

    const handleEditClick = () => {
        navigate(`/edit-training/${id}`);
    };

    const isDetailView = viewMode === "detail";

    if (trainingDetailLoading) {
        return (
            <div className="loading-state">
                <Loader />
            </div>
        );
    }

    return (
        <div className="trainingDetailsMain">
            <button
                onClick={() =>
                    navigate(
                        viewMode === "edit" ? `/training-details/${id}` : "/training-list"
                    )
                }
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
                                className="imgBlackedWhite"
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
                                <p className="dept-page-subtitle">
                                    {viewMode !== "detail" ? "Please Provide" : ''} Trainings Basic Details Below.
                                </p>                            </div>
                            <StatusDropdown
                                options={trainingStatusOptions?.filter((item) => item?.label !== "All")?.map((item) => ({
                                    value: item?.id,
                                    label: item?.label,
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

                        <TrainingForm
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
