// PerformanceForm.jsx
import { useState, useMemo, useRef } from "react";
import {
    CreditCard,
    User,
    Briefcase,
    Calendar,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SaveBtn from "../../../utils/common/SaveBtn.jsx";
import SelectDropdown from "../../../utils/common/SelectDropdown/SelectDropdown.jsx";
import FormDatePicker from "../../../utils/common/FormDatePicker.jsx";
import { handleFormError } from "../../../utils/helper.js";
import CompetencySelector from "./CompetencySelector.jsx";
import { ApprovalStatus } from "./ApprovalStatus.jsx";
import { createNewPerformance, getPerformanceDetails } from "../../../Redux/Actions/performanceActions.js";

export const ApprovalForm = ({
    viewMode,
    formData,
    setFormData,
    handleSearch
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("technical");

    const employeeData = useSelector((state) => state?.employeeList);
    const employeeList = employeeData?.data?.result;
    const createPerformance = useSelector((state) => state.createPerformance); // Placeholder for redux state

    const user_ref = useRef(null);

    const [errors, setErrors] = useState({});

    const basicRequiredFields = [
        { key: "user_id", label: "Please Select Employee", ref: user_ref },
    ];

    const validateForm = () => {
        for (let field of basicRequiredFields) {
            const value = formData[field.key];
            if (!value || (typeof value === "string" && !value.trim())) {
                setErrors((prev) => ({ ...prev, [field.key]: field.label }));
                toast.error(field.label);
                handleFormError(field?.ref);
                return false;
            }
        }
        return true;
    };

    const handleSelect = (name, item) => {
        if (name === "user_id") {
            setFormData((prevData) => ({
                ...prevData,
                user: item?.label,
                [name]: item?.id,
            }));
        }
        else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: item?.id,
            }));
        }
        setErrors((prev) => ({
            ...prev,
            [name]: false,
        }));
    };


    const handleDateChange = (type, date) => {
        setFormData((prev) => ({ ...prev, [type]: date }));
    };

    const handleCompetencyChange = (type, index, field, value) => {

        setFormData(prev => {
            const updated = [...prev[type]];
            updated[index][field] = value?.id;
            return { ...prev, [type]: updated };
        });
    };

    const handleSaveOrUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const dataToSubmit = {
            user_id: formData?.user_id,
            department_id: formData?.department_id,
            designation_id: formData?.designation_id,
            status: formData?.status,
            appraisal_date: formData?.appraisal_date,
            technical: JSON.stringify(formData?.technical),
            organisation: JSON.stringify(formData?.organisation),
            overall_rating: overallRating?.overall?.achievedAvg
        };
        if (viewMode === "edit") {
            dataToSubmit["id"] = id;
        }
        try {
            const res = await dispatch(createNewPerformance(dataToSubmit))
            if (res?.status === 200) {
                navigate(id ? `/performance-details/${id}` : `/performance-list`);
                if (id) dispatch(getPerformanceDetails({ id }));
            }
        }
        catch (error) {
            console.log("error-", error);
        };
    };

    const isDetailView = viewMode === "detail";
    const competencies = activeTab === "technical" ? formData?.technical : formData?.organisation;
    const employeeOptions = useMemo(
        () =>
            employeeList?.map((e) => {
                const fullName = [e?.first_name, e?.last_name]
                    .filter(Boolean)
                    .join(" ");
                return {
                    id: e?.user_id,
                    label: `${fullName} (${e?.employee_id})`,
                };
            }),
        [employeeList]
    );

    const handleChange = (event) => {
    };

    return (
        <div className={`dept-page-basic-info-section ${viewMode === "edit" ? "isEditPage" : ""}`} style={{ marginTop: '0px' }}>
            <h3>Basic Information</h3>
            <p className="dept-page-subtitle">{viewMode !== "detail" ? "Please Provide" : ''} Approval Basic Details Below.</p>
            <div className="form-grid-layout">
                {/* Employee ID */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper">
                        <CreditCard size={20} strokeWidth={1.5} />
                    </div>
                    <label className={!isDetailView ? "color_red" : ""}>Employee{!isDetailView && <span>*</span>}</label>
                    <SelectDropdown
                        ref={user_ref}
                        selectedValue={formData?.user_id}
                        options={employeeOptions}
                        onSelect={handleSelect}
                        searchPlaceholder="Search employee"
                        handleSearch={handleSearch}
                        type="user_id"
                        loading={employeeData?.loading}
                        showSearchBar={true}
                        disabled={isDetailView}
                        selectedName={formData?.user}
                    />
                </div>
                {/* Department */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper">
                        <Briefcase size={20} strokeWidth={1.5} />
                    </div>
                    <label>Department</label>
                    <input type="text" value={formData?.department} onChange={handleChange} disabled={true} />
                </div>
                {/* Designation */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper">
                        <User size={20} strokeWidth={1.5} />
                    </div>
                    <label>Designation</label>
                    <input type="text" value={formData?.designation} onChange={handleChange} disabled={true} />

                </div>
                {/* Appraisal Date */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper">
                        <Calendar size={20} strokeWidth={1.5} />
                    </div>
                    <label>Appraisal Date</label>
                    <FormDatePicker
                            label="Appraisal Date"
                            onDateChange={handleDateChange}
                            initialDate={formData?.appraisal_date}
                            type="appraisal_date"
                            disabled={isDetailView}
                            restrict={true}
                        />
                </div>
            </div>

            <hr className="hr_line" />
            {viewMode !== "detail" ?
                <div className=" isCompetencies ca_rd performance-stats-card">
                    <div className="tabs-container">
                        <button
                            className={`tab ${activeTab === "technical" ? "active" : ""}`}
                            onClick={() => setActiveTab("technical")}
                            disabled={isDetailView}
                        >
                            Technical
                        </button>
                        <button
                            className={`tab ${activeTab === "organisation" ? "active" : ""}`}
                            onClick={() => setActiveTab("organisation")}
                            disabled={isDetailView}
                        >
                            Organizational
                        </button>
                    </div>
                    <div className="stats-body">
                            <div className="stats-title-row">
                                <h4 className="competencies-title">COMPETENCIES</h4>
                                <h4 className="statistics-title">CURRENT VALUE</h4>
                                <h4 className="statistics-title meritDes_title">MERIT DESCRIPTION</h4>
                            </div>
                            <div className="competencies-list">
                                {competencies?.map((item, index) => {
                                    return (
                                        <div className="competency-row content_3_row" key={index}>
                                            <div className="chart-container">
                                                <CompetencySelector
                                                    name={item?.label}
                                                    value={item?.achieved_value}
                                                    onSelect={(name, selectedValue) => handleCompetencyChange(activeTab, index, "achieved_value", selectedValue)}
                                                    disabled={isDetailView}
                                                    label={item?.label}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                </div>
                :
                <>
                    <ApprovalStatus />
                </>
            }
            <br />
            <div>
                {(viewMode === "add" || viewMode === "edit") && (
                    <SaveBtn
                        handleSubmit={handleSaveOrUpdate}
                        viewMode={viewMode}
                        loading={createPerformance?.loading}
                        color="#fff"
                    />
                )}
            </div>
        </div>
    )
}
