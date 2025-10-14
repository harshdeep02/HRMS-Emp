// PerformanceDetails.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import bannerImg from "../../../assets/Comment_rivew.svg";
import Loader from "../../../utils/common/Loader/Loader.jsx";
import StatusDropdown from "../../../utils/common/StatusDropdown/StatusDropdown.jsx";
import { PerformanceForm } from "./PerformanceForm.jsx";
import { UserProfileImageUpload } from "../../../utils/common/UserProfileImageUpload/UserProfileImageUpload.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeList } from "../../../Redux/Actions/employeeActions.js";
import { performanceStatusOptions } from "../../../utils/Constant.js";
import { getPerformanceDetails, SendApproval } from "../../../Redux/Actions/performanceActions.js";
import { showMasterData } from "../../../utils/helper.js";
import ConfirmPopup from "../../../utils/common/ConfirmPopup.jsx";

export const PerformanceDetails = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();

    const technical_competency = showMasterData("24");
    const org_competency = showMasterData("26");

    const buildCompetencyArray = (competencyOptions) => {
        if (!competencyOptions || !Array.isArray(competencyOptions)) return [];

        return competencyOptions.map(option => ({
            label: option?.label,  // adjust based on what showMasterData gives
            id: option?.id,
            expected_value: 3,
            achieved_value: "",
        }));
    };

    const [disableBtn, setDisableBtn] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [viewMode, setViewMode] = useState("detail");
    const [formData, setFormData] = useState({
        user: '',
        user_id: "",
        user_image: '',
        department_id: "",
        designation_id: "",
        appraisal_date: null,
        status: 2,
        technical: buildCompetencyArray(technical_competency),
        organisation: buildCompetencyArray(org_competency)
    });


    const sendForApproval = useSelector((state) => state?.sendForApproval);
    const employeeData = useSelector((state) => state?.employeeList);
    const employeeList = employeeData?.data || [];

    const performanceData = useSelector((state) => state?.performanceDetails);
    const performanceDetails = performanceData?.data?.result;

    const fetchEmployee = (search = "") => {
        const sendData = {
            employee_status: 1
        };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getEmployeeList(sendData));
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/add-performance') || path.includes('/edit-performance')) {
            // if (employeeList?.length === 0) 
            fetchEmployee("");
        }
    }, [location]);

    useEffect(() => {
        if (id) {
            dispatch(getPerformanceDetails({ id }));
        }
    }, [id]);

    const handleEmployeeSearch = (query, type) => {
        fetchEmployee(query);
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.includes("/add-performance")) {
            setViewMode("add");
        } else if (path.includes("/edit-performance")) {
            setViewMode("edit");
        } else if (path.includes("/performance-details")) {
            setViewMode("detail");
        }
    }, [location.pathname, id]);

    useEffect(() => {
        if (id && performanceDetails) {
            const technicalDetails = JSON.parse(performanceDetails?.technical)
            const organisationDetails = JSON.parse(performanceDetails?.organisation)
            setFormData((prev) => ({
                ...prev,
                // user: [performanceDetails?.employee?.first_name, performanceDetails?.employee?.last_name]?.filter(Boolean)?.join(" "),
                user: performanceDetails?.employee?.employee_id,
                user_id: performanceDetails?.user_id,
                user_image: performanceDetails?.employee?.image?.length > 0 ? JSON.parse(performanceDetails?.employee?.image) : '',
                appraisal_date: performanceDetails?.appraisal_date,
                department_id: performanceDetails?.department_id,
                department: performanceDetails?.employee?.department?.department_name,
                designation_id: performanceDetails?.designation_id,
                designation: performanceDetails?.employee?.designation?.designation_name,
                status: performanceDetails?.status,
                technical: technicalDetails,
                organisation: organisationDetails
            }));
        }

    }, [viewMode, performanceDetails]);

    const handleEditClick = () => navigate(`/edit-performance/${id}`);

    const renderHeader = () => {
        switch (viewMode) {
            case "add": return "Add New Performance";
            case "edit": return "Edit Performance";
            default: return "Performance Details";
        }
    };

    const renderMark = () => {
        switch (viewMode) {
            case "add": return "Fill The Information";
            case "edit": return "Edit Information";
            default: return "Provided Details";
        }
    };

    const renderHeaderInfo = () => {
        switch (viewMode) {
            case "add": return "You're just one step away from adding the new performance details!";
            case "edit": return "Here’s the information about the performance details you’ve filled.";
            default: return "Check Out Performance Information!";
        }
    };

    useEffect(() => {
        if (formData?.status === 4) {
            setDisableBtn(true)
        }
    }, [formData?.status])

    const handleStatus = (val) => {
        setFormData((prevData) => ({
            ...prevData,
            status: val,
        }));
    };

    const handleSendForApproval = async () => {
        try {
            const dataToSend = {
                id,
                status: 4
            }
            const res = await dispatch(SendApproval(dataToSend))
            if (res?.data?.status) {
                setShowModal(false);
                dispatch(getPerformanceDetails({ id }));
                setDisableBtn(true)
                // setFormData((prev)=>({...prev, status:2}))
            }
        }
        catch (error) {
            setShowModal(false);
            console.log("error-", error);
        };
    }

    if (performanceData?.loading) {
        return <div className="loading-state"><Loader /></div>;
    }

    return (
        <div className="performanceDetailMain">
            <ConfirmPopup
                open={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleSendForApproval}
                type="Sent"
                module="for Approval"
                loading={sendForApproval?.loading}
            />
            <button onClick={() => navigate(viewMode === 'edit' ? `/performance-details/${id}` : '/performance-list')} className="close_nav header_close">
                Close
            </button>
            <div className="dept-page-container">
                <h2 className="dept-page-main-heading">{renderHeader()}</h2>
                <div className="dept-page-content-wrapper">
                    <div className="dept-page-left-panel">
                        <h3 className="dept-page-mark-text">{renderMark()}</h3>
                        <p className="dept-page-info-text">{renderHeaderInfo()}</p>
                        <div className="dept-page-illustration-box">
                            <img
                                className="imgB lackedWhite"
                                src={bannerImg}
                                alt="Illustration"
                            />
                        </div>
                    </div>

                    <div className="dept-page-right-panel">
                        <div className="dept-page-cover-section dept-page-cover-section_2">
                            <UserProfileImageUpload
                                formData={formData}
                                setFormData={setFormData}
                                fieldName="user_image"
                                isEditMode={false}
                            />
                            {/* {viewMode !== "detail" ? ( */}
                            <StatusDropdown
                                options={performanceStatusOptions
                                    ?.filter((item) => item?.label !== "All")
                                    ?.map((item) => ({
                                        value: item?.id,
                                        label: item?.label,
                                        icon: item?.icon,
                                    }))}
                                defaultValue={formData?.status}
                                onChange={(val) => handleStatus(val)}
                                disabled={true}
                            // viewMode={viewMode !== "detail"}
                            />

                            {formData?.status != 1 && viewMode !== "add" &&
                                (<div class="approvalHeadRight" style={{ position: "absolute", top: "30px", right: "115px" }}>
                                    <button disabled={disableBtn} style={disableBtn ? { cursor: "default" } : {}} onClick={() => setShowModal(!showModal)} class="approvedBtn status-label status-approved">
                                        {formData?.status != 4 ? "Sent For Approval" : "Waiting For Approval"}</button>
                                </div>)
                            }
                            {formData?.status == 3 || viewMode === 'detail' && formData?.status == 2 ? (
                                <button className="dept-page-edit-btn" onClick={handleEditClick}>
                                    Edit
                                </button>
                            ) : ''}
                        </div>

                        <PerformanceForm
                            viewMode={viewMode}
                            formData={formData}
                            setFormData={setFormData}
                            handleSearch={handleEmployeeSearch}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};