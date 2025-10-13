import {
    Briefcase,
    Calendar,
    CalendarOff,
    DollarSign,
    FileUp,
    Proportions,
    Rows4,
    ShieldCheck,
    Tag,
    User,
    Users
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import { handleFormError, showMasterData } from "../../../utils/helper.js";
import { useNavigate, useParams } from 'react-router-dom';
import SaveBtn from '../../../utils/common/SaveBtn.jsx';
import TextAreaWithLimit from '../../../utils/common/TextAreaWithLimit.jsx';
import SelectDropdownMultiple from '../../../utils/common/SelectDropdownMultiple/SelectDropdownMultiple.jsx';
import SelectDropdown from '../../../utils/common/SelectDropdown/SelectDropdown.jsx';
import FormDatePicker from '../../../utils/common/FormDatePicker.jsx';
import dayjs from "dayjs";
import { createNewProject, getProjectDetails } from '../../../Redux/Actions/projectActions.js';
import { UploadFile } from '../../../utils/common/UploadFile/UploadFile.jsx';

const ProjectForm = ({ viewMode, formData, setFormData, handleSearch }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    //Data from redux
    const projectDetails = useSelector((state) => state?.projectDetails);
    const projectDetail = projectDetails?.data?.result;

    const createUpdateProject = useSelector((state) => state?.createProject);
    const priority_options = showMasterData("20");

    const clientData = useSelector((state) => state?.clientList);
    const clientLists = clientData?.data?.result || [];

    const clientOptions = useMemo(
        () => clientLists?.map(c => ({
            id: c?.id, label: c?.client_name,
        })),
        [clientLists]
    );

    //employees list from redux
    const employeeData = useSelector((state) => state?.employeeList);
    const employeeLists = employeeData?.data?.result || [];

    const employeeOptions = useMemo(
        () => employeeLists?.map(e => ({
            id: e?.employee?.user_id, label: [e?.employee?.first_name, e?.employee?.last_name]
                .filter(Boolean)
                .join(" "),
        })),
        [employeeLists]
    );

    const departmentData = useSelector((state) => state?.departmentList);
    const departmentLists = departmentData?.data?.department || [];

    const departmentOptions = useMemo(
        () => departmentLists?.map(d => ({
            id: d?.id, label: d?.department_name,
        })),
        [departmentLists]
    );


    const project_name_ref = useRef(null);
    const client_ref = useRef(null);

    const [errors, setErrors] = useState({
        project_name: false,
        client_id: false,
    });

    const basicRequiredFields = [
        {
            key: "project_name",
            label: "Please fill Project Name",
            required: true,
            ref: project_name_ref,
        },
        {
            key: "client_id",
            label: "Please select Client",
            required: true,
            ref: client_ref,
        }
    ];

    const validateForm = () => {
        for (let field of basicRequiredFields) {
            const value = formData[field.key];
            if (
                field.required &&
                (!value || (typeof value === "string" && !value.trim()))
            ) {
                setErrors((prev) => ({ ...prev, [field.key]: field.label }));
                toast.error(field.label);
                handleFormError(field?.ref);
                return false;
            }
        }
        return true;
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

    const handleSelect = async (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value?.id,
        }));
        if (name === "project_leader_id") {
            setFormData((prevData) => ({
                ...prevData,
                project_leader: value?.label,
            }));
        }
        setErrors((prevState) => ({
            ...prevState,
            [name]: false, // Clear error for this field
        }));
    };

    const handleEmployeesChange = (selectedEmployeeIds) => {
        setFormData((prev) => ({ ...prev, team_members: selectedEmployeeIds }));
    };

    // Helper function to update date
    const updateFormData = (name, date) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: date,
        }));
    };


    const handleDateChange = (name, date) => {
        const { start_date, end_date } = formData;

        // Parse safely using dayjs with explicit format
        const parsedDate = date ? dayjs(date, "DD-MM-YYYY") : null;
        const parsedFromDate = start_date ? dayjs(start_date, "DD-MM-YYYY") : null;
        const parsedToDate = end_date ? dayjs(end_date, "DD-MM-YYYY") : null;

        if (!parsedDate || !parsedDate.isValid()) {
            toast.error("Invalid date format. Please use DD-MM-YYYY.");
            return;
        }

        if (name === "start_date") {
            if (parsedToDate && parsedDate.isAfter(parsedToDate)) {
                toast.error("Start date cannot be later than the end date.");
                return;
            }
            updateFormData(name, date);
        }

        if (name === "end_date") {
            if (parsedFromDate && parsedDate.isBefore(parsedFromDate)) {
                toast.error("End date cannot be earlier than the start date.");
                return;
            }
            updateFormData(name, date);
        }
    };


    const handleSaveOrUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSubmit = {
            ...formData,
            team_members: JSON.stringify(formData?.team_members),
            attachments: formData?.attachments?.length > 0 ? JSON.stringify(formData?.attachments) : "",
        };
        if (viewMode === "edit") {
            formDataToSubmit["id"] = id;
        }
        dispatch(createNewProject(formDataToSubmit))
            .then((res) => {
                if (res?.status === 200) {
                    navigate(id ? `/project-details/${id}` : `/project-list`);
                    if (id) dispatch(getProjectDetails({ id }));
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });
    };

    const isDetailView = viewMode === "detail";

    return (
        <>
            <div className={`dept-page-basic-info-section ${viewMode === "edit" ? "isEditPage" : ""}`}>
              
                {/* Project Name */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Proportions size={20} strokeWidth={1.5} /></div>
                    <label className={!isDetailView ? "color_red" : ""}>Project Name *</label>
                    <input
                        ref={project_name_ref}
                        type="text"
                        name="project_name"
                        value={formData?.project_name}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>

                {/* Client */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><User size={20} strokeWidth={1.5} /></div>
                    <label className={!isDetailView ? "color_red" : ""}>Client{!isDetailView ? <span>*</span> : ''}</label>

                    <SelectDropdown
                        ref={client_ref}
                        selectedValue={formData?.client_id}
                        options={clientOptions}
                        onSelect={handleSelect}
                        searchPlaceholder="Search client"
                        handleSearch={handleSearch}
                        showSearchBar={true}
                        disabled={isDetailView}
                        type="client_id"
                        loading={clientData?.loading}
                        selectedName={isDetailView ? projectDetail?.client?.client_name : ""}
                    />
                </div>

                {/* Priority */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><ShieldCheck size={20} strokeWidth={1.5} /></div>
                    <label>Priority</label>
                    <SelectDropdown
                        selectedValue={formData?.priority}
                        options={priority_options}
                        onSelect={handleSelect}
                        type="priority"
                        disabled={isDetailView}
                        selectedName={priority_options?.find(item => item?.id == formData?.priority)?.label || ""}
                    />
                </div>

                {/* Budget Of Project */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><DollarSign size={20} strokeWidth={1.5} /></div>
                    <label>Budget Of Project</label>
                    <input
                        type="text"
                        name="rate"
                        value={formData?.rate}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>

                {/* Start Date */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"  >
                        <Calendar size={20} strokeWidth={1.25} />
                    </div>
                    <label>Start Date</label>
                    <FormDatePicker
                        label="Start Date"
                        onDateChange={handleDateChange}
                        initialDate={formData?.start_date}
                        type="start_date"
                        disabled={isDetailView}
                        toDate={formData?.end_date}
                    />
                </div>

                {/* Deadline */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"  >
                        <Calendar size={20} strokeWidth={1.25} />
                    </div>
                    <label>Deadline</label>
                    <FormDatePicker
                        label="Deadline"
                        onDateChange={handleDateChange}
                        initialDate={formData?.end_date}
                        type="end_date"
                        disabled={isDetailView}
                        fromDate={formData?.start_date}
                    />
                </div>

                {/* Department */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Tag size={20} strokeWidth={1.5} /></div>
                    <label>Department</label>
                    <SelectDropdown
                        selectedValue={formData?.department_id}
                        options={departmentOptions}
                        onSelect={handleSelect}
                        searchPlaceholder="Search department"
                        handleSearch={handleSearch}
                        type="department_id"
                        loading={departmentData?.loading}
                        showSearchBar={true}
                        disabled={isDetailView}
                        selectedName={isDetailView ? projectDetail?.department?.department_name : ""}
                    />
                </div>

                {/* Project Leader */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Briefcase size={20} strokeWidth={1.5} /></div>
                    <label>Project Leader</label>
                    <SelectDropdown
                        selectedValue={formData?.project_leader_id}
                        options={employeeOptions}
                        onSelect={(name, item) => handleSelect("project_leader_id", item)}
                        searchPlaceholder="Search employee"
                        handleSearch={handleSearch}
                        type="employee"
                        loading={employeeData?.loading}
                        showSearchBar={true}
                        disabled={isDetailView}
                        // selectedName={isDetailView ? [projectDetail?.employee?.first_name, projectDetail?.employee?.last_name].filter(Boolean).join(" ") : ""}
                        selectedName={formData?.project_leader}
                    />
                </div>

                {/* Team Members */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Users size={20} strokeWidth={1.5} /></div>
                    <label>Add Team</label>
                    <SelectDropdownMultiple
                        placeholder="Select Employees"
                        selectedValue={formData?.team_members}
                        options={employeeOptions}
                        onSelect={handleEmployeesChange}
                        handleSearch={handleSearch}
                        showSearchBar={true}
                        disabled={isDetailView}
                        multiple={true}
                        type="employee"
                        loading={employeeData?.loading}
                    />
                </div>

                {/* Description */}
                <div className="dept-page-input-group attachment_form">
                    <div className="dept-page-icon-wrapper"><Rows4 size={20} strokeWidth={1.5} /></div>
                    <label>Description</label>

                    <TextAreaWithLimit
                        name="description"
                        value={formData?.description}
                        formsValues={{ handleChange: handleChange, form: formData }}
                        disabled={isDetailView}
                    />
                </div>

                {/* Attachment */}
                <div className="dept-page-input-group attachment_form">
                    <div className="dept-page-icon-wrapper"><FileUp size={20} strokeWidth={1.5} /></div>
                    <label>Attachment</label>
                    <UploadFile
                        formData={formData}
                        setFormData={setFormData}
                        fieldName="attachments"
                        multiple={false}
                        isDetailView={isDetailView}
                    />
                </div>
            </div>
            {(viewMode === "add" || viewMode === "edit") && (
                <SaveBtn
                    handleSubmit={handleSaveOrUpdate}
                    viewMode={viewMode}
                    loading={createUpdateProject?.loading}
                    color="#fff"
                />
            )}
        </>
    );
};

export default ProjectForm;