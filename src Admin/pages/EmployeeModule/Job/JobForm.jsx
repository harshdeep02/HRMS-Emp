import {
    Phone,
    IdCard,
    MapPinHouse,
    School,
    Warehouse,
    ShieldUser,
    CalendarCheck2,
    GraduationCap,
    Proportions,
    AArrowUp,
    CalendarFold,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useRef, useState } from 'react';
import { toast } from "react-toastify";
import { handleFormError, showMasterData } from "../../../utils/helper.js";
import { useNavigate, useParams } from 'react-router-dom';
import { createNewJob, getJobDetails } from '../../../Redux/Actions/jobActions.js';
import SaveBtn from '../../../utils/common/SaveBtn.jsx';
import SelectDropdown from '../../../utils/common/SelectDropdown/SelectDropdown.jsx';
import SelectDropdownMultiple from '../../../utils/common/SelectDropdownMultiple/SelectDropdownMultiple.jsx';
import TextAreaWithLimit from '../../../utils/common/TextAreaWithLimit.jsx';
import { AddMasterValuePopup } from '../../Master/AddMasterValuePopup.jsx';

const JobForm = ({ viewMode, formData, setFormData, handleSearch }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    //Data from redux
    const createUpdateJob = useSelector((state) => state?.createJob);
    const jobData = useSelector((state) => state?.jobDetails);
    const jobDetail = jobData?.data?.jobOpening;

    const designationData = useSelector((state) => state?.designationList);
    const designationList = designationData?.data?.designation || [];

    const departmentData = useSelector((state) => state?.departmentList);
    const departmentList = departmentData?.data?.department || [];

    const job_location_options = showMasterData("3");
    const employment_options = showMasterData("1");
    const joining_date_options = showMasterData("12");
    const qualification_options = showMasterData("13");
    const skills_options = showMasterData("14");
    const experience_level_options = showMasterData("15");

    const departmentOptions = useMemo(
        () => departmentList?.map(d => ({ id: d?.id, label: d?.department_name })),
        [departmentList]
    );

    const designationOptions = useMemo(
        () => designationList?.map(des => ({
            id: des?.id,
            label: des?.designation_name
        })),
        [designationList]
    );

    const job_title_ref = useRef(null);
    const department_ref = useRef(null);
    const designation_ref = useRef(null);
    const job_location_ref = useRef(null);
    const employment_type_ref = useRef(null);
    const experience_level_ref = useRef(null);
    const experience_required_ref = useRef(null);
    const qualification_ref = useRef(null);
    const required_skills_ref = useRef(null);

    const [errors, setErrors] = useState({
        job_title: false,
        department: false,
        designation: false,
        job_location: false,
        employment_type: false,
        experience_level: false,
        experience_required: false,
        qualification: false,
        required_skills: false,
    });

    const basicRequiredFields = [
        {
            key: "job_title",
            label: "Please fill job title",
            required: true,
            ref: job_title_ref,
        },
        {
            key: "department",
            label: "Please select department",
            required: true,
            ref: department_ref,
        },
        {
            key: "designation",
            label: "Please select designation",
            required: true,
            ref: designation_ref,
        },
        {
            key: "job_location",
            label: "Please select Job Location",
            required: true,
            ref: job_location_ref,
        },
        {
            key: "employment_type",
            label: "Please select Employment Type",
            required: true,
            ref: employment_type_ref,
        },
        {
            key: "experience_level",
            label: "Please select Experience Level",
            required: true,
            ref: experience_level_ref,
        },
        {
            key: "experience_required",
            label: "Please fill Experience in Years",
            required: true,
            ref: experience_required_ref,
        },
        {
            key: "qualification",
            label: "Please select Qualification",
            required: true,
            ref: qualification_ref,
        },
        {
            key: "required_skills",
            label: "Please select Required Skills",
            required: true,
            ref: required_skills_ref,
        },
    ];

    const validateForm = () => {
        for (let field of basicRequiredFields) {
            const value = formData[field.key];

            let isEmpty = false;

            if (Array.isArray(value)) {
                // ✅ Array must not be empty
                isEmpty = value.length === 0;
            } else if (typeof value === "string") {
                // ✅ String must not be empty/whitespace
                isEmpty = !value.trim();
            } else if (typeof value === "number") {
                // ✅ Number must not be null, undefined, or NaN
                isEmpty = value === null || value === undefined || isNaN(value);
            } else {
                // ✅ Covers null, undefined, empty object
                isEmpty = !value;
            }

            if (field.required && isEmpty) {
                setErrors((prev) => ({ ...prev, [field.key]: field.label }));
                toast.error(field.label);
                handleFormError(field?.ref);
                return false; // stop at the first error
            }
        }

        return true;
    };

    const handleSelect = (name, item) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: item?.id,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: false,
        }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Update only basicDetails errors
        setErrors((prevState) => ({
            ...prevState,
            [name]: false, // Clear error for this field
        }));
    };

    const handleSkillsChange = (selectedSkillIds) => {
        setFormData((prev) => ({
            ...prev,
            required_skills: selectedSkillIds,
        }));
    };

    const handleSaveOrUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSubmit = {
            ...formData,
            required_skills: formData?.required_skills?.length > 0 ? JSON.stringify(formData?.required_skills) : "",
        };
        if (viewMode === "edit") {
            formDataToSubmit["id"] = id;
        }
        dispatch(createNewJob(formDataToSubmit))
            .then((res) => {
                if (res?.status === 200) {
                    navigate(id ? `/job-details/${id}` : `/job-list`);
                    if (id) dispatch(getJobDetails({ id }));
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });
    };

    const [showMasterPopUp, setShowMasterPopUp] = useState(false)
    const [masterValue, setMasterValue] = useState({});
    const handleAddMasterValue = (id, name) => {
        setMasterValue({ id: id, label: name })
        setShowMasterPopUp(true);
    };

    const isDetailView = viewMode === "detail";

    return (
        <>
            {showMasterPopUp &&
                <AddMasterValuePopup
                    field={masterValue?.label}
                    id={masterValue?.id}
                    setShowMasterPopUp={setShowMasterPopUp} />
            }

            <div className={`dept-page-basic-info-section ${viewMode === "edit" ? "isEditPage" : ""}`}>
                <div className="form-grid-layout">
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <IdCard size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}> Job Title{!isDetailView ? <span>*</span> : ''}</label>
                        <input
                            ref={job_title_ref}
                            type="text"
                            name="job_title"
                            value={formData?.job_title}
                            onChange={handleChange}
                            disabled={isDetailView}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <MapPinHouse size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}> Department{!isDetailView ? <span>*</span> : ''}</label>

                        <SelectDropdown
                            ref={department_ref}
                            selectedValue={formData?.department}
                            options={departmentOptions}
                            onSelect={handleSelect}
                            searchPlaceholder="Search department"
                            handleSearch={handleSearch}
                            type="department"
                            loading={departmentData?.loading}
                            showSearchBar={true}
                            disabled={isDetailView}
                            selectedName={formData?.department_name ?? ""}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <School size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}> Designation{!isDetailView ? <span>*</span> : ''}</label>
                        <SelectDropdown
                            ref={designation_ref}
                            selectedValue={formData?.designation}
                            options={designationOptions}
                            onSelect={handleSelect}
                            searchPlaceholder="Search designation"
                            handleSearch={handleSearch}
                            type="designation"
                            loading={designationData?.loading}
                            showSearchBar={true}
                            disabled={isDetailView}
                            selectedName={formData?.designation_name ?? ""}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <MapPinHouse size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}> Job Location{!isDetailView ? <span>*</span> : ''}</label>
                        <SelectDropdown
                            ref={job_location_ref}
                            selectedValue={formData?.job_location}
                            options={job_location_options}
                            // placeholder="Select Job Location"
                            onSelect={handleSelect}
                            type="job_location"
                            disabled={isDetailView}
                            selectedName={job_location_options?.find(item => item?.id == formData?.job_location)?.label || ""}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <Phone size={20} strokeWidth={1.5} />
                        </div>
                        <label>No. of positions</label>
                        <input
                            type="text"
                            name="no_of_position"
                            value={formData?.no_of_position}
                            onChange={handleChange}
                            disabled={isDetailView}
                        />
                    </div>
                </div>
            </div>
            <hr className="hr_line" />

            <div className={`dept-page-basic-info-section ${viewMode === "edit" ? "isEditPage" : ""}`}>
                <h3>Company Information</h3>
                <p className="dept-page-subtitle">
                    Essential organizational information
                </p>
                <div className="form-grid-layout">
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <Warehouse size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}> Employment Type{!isDetailView ? <span>*</span> : ''}</label>
                        <SelectDropdown
                            ref={employment_type_ref}
                            selectedValue={formData?.employment_type}
                            options={employment_options}
                            // placeholder="Select Employment Type"
                            onSelect={handleSelect}
                            type="employment_type"
                            disabled={isDetailView}
                            selectedName={employment_options?.find(item => item?.id == formData?.employment_type)?.label || ""}
                            showAddButton={true}
                            onAddClick={() => handleAddMasterValue(1, "Employment Type")}
                            addBtnText="Employment Type"
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <ShieldUser size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}> Experience Level{!isDetailView ? <span>*</span> : ''}</label>
                        <SelectDropdown
                            ref={experience_level_ref}
                            selectedValue={formData?.experience_level}
                            options={experience_level_options}
                            // placeholder="Select Experience Level"
                            onSelect={handleSelect}
                            type="experience_level"
                            disabled={isDetailView}
                            selectedName={experience_level_options?.find(item => item?.id == formData?.experience_level)?.label || ""}
                            onAddClick={() => handleAddMasterValue(15, "Experience Level")}
                            showAddButton={true}
                            addBtnText="Experience Level"
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <CalendarCheck2 size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}>Experience Required (In years){!isDetailView ? <span>*</span> : ''}</label>
                        <input
                            ref={experience_required_ref}
                            type="number"
                            name="experience_required"
                            value={formData?.experience_required}
                            onChange={handleChange}
                            disabled={isDetailView}

                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <GraduationCap size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}> Qualification{!isDetailView ? <span>*</span> : ''}</label>

                        <SelectDropdown
                            ref={qualification_ref}
                            selectedValue={formData?.qualification}
                            options={qualification_options}
                            // placeholder="Select Qualification"
                            onSelect={handleSelect}
                            type="qualification"
                            disabled={isDetailView}
                            selectedName={qualification_options?.find(item => item?.id == formData?.qualification)?.label || ""}
                            showAddButton={true}
                            onAddClick={() => handleAddMasterValue(13, "Qualifications")}
                            addBtnText="New Qualification"
                        />
                    </div>
                    <div className="dept-page-input-group ">
                        <div className="dept-page-icon-wrapper">
                            <AArrowUp size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}> Required Skills{!isDetailView ? <span>*</span> : ''}</label>

                        <SelectDropdownMultiple
                            ref={required_skills_ref}
                            placeholder=""
                            selectedValue={formData?.required_skills}
                            options={skills_options}
                            onSelect={handleSkillsChange}
                            // handleSearch={handleSkillSearch}
                            showSearchBar={true}
                            disabled={isDetailView}
                            multiple={true}
                            type="skills"
                            showAddButton={true}
                            addBtnText="New Skills"
                            selectedName={skills_options?.find(item => item?.id == formData?.skills)?.label || ""}
                            onAddClick={() => handleAddMasterValue(14, "Skills")}
                        />
                    </div>
                    <div className="dept-page-input-group ">
                        <div className="dept-page-icon-wrapper">
                            <CalendarFold size={20} strokeWidth={1.5} />
                        </div>
                        <label>Joining Date</label>
                        <SelectDropdown
                            selectedValue={formData?.joining_date}
                            options={joining_date_options}
                            // placeholder="Select Joining Date"
                            onSelect={handleSelect}
                            type="joining_date"
                            disabled={isDetailView}
                            selectedName={joining_date_options?.find(item => item?.id == formData?.joining_date)?.label || ""}
                            showAddButton={true}
                            onAddClick={() => handleAddMasterValue(12, "Joining Date")}
                            addBtnText="New"
                        />
                    </div>
                    <div className="dept-page-input-group full-width">
                        <div className="dept-page-icon-wrapper">
                            <Proportions size={20} strokeWidth={1.5} />
                        </div>
                        <label>Description</label>
                        <TextAreaWithLimit
                            name="description"
                            value={formData?.description}
                            formsValues={{ handleChange: handleChange, form: formData }}
                            disabled={isDetailView}
                        />
                    </div>
                </div>
            </div>

            {(viewMode === "add" || viewMode === "edit") && (
                <SaveBtn
                    handleSubmit={handleSaveOrUpdate}
                    viewMode={viewMode}
                    loading={createUpdateJob?.loading}
                    color="#fff"
                />
            )}
        </>
    );
};

export default JobForm;