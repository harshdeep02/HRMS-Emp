import {
    Proportions,
    Contact,
    Calendar,
    File,
    Bell,
    Mail,
    Users,
    Paperclip,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useRef, useState } from 'react';
import { toast } from "react-toastify";
import { handleFormError } from "../../../utils/helper.js";
import { useNavigate, useParams } from 'react-router-dom';
import SaveBtn from '../../../utils/common/SaveBtn.jsx';
import SelectDropdown from '../../../utils/common/SelectDropdown/SelectDropdown.jsx';
import FormDatePicker from '../../../utils/common/FormDatePicker.jsx';
import { UploadFile } from '../../../utils/common/UploadFile/UploadFile.jsx';
import TextAreaWithLimit from '../../../utils/common/TextAreaWithLimit.jsx';
import { createNewFile, getFileDetails } from '../../../Redux/Actions/fileActions.js';
import SelectDropdownMultiple from '../../../utils/common/SelectDropdownMultiple/SelectDropdownMultiple.jsx';

export const FileForm = ({ viewMode, formData, setFormData, handleSearch }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    //Data from redux
    const createFile = useSelector((state) => state?.createFile);
    const employeeData = useSelector((state) => state?.employeeList);
    const employeeList = employeeData?.data?.result;

    const [documentUpload, setDocumentUpload] = useState(false);

    const file_name_ref = useRef(null);
    const notify_all_ref = useRef(null);
    const employees_ref = useRef(null);

    const [errors, setErrors] = useState({
        file_name: false,
        notify_all: false,
        employees:false
    });

    const basicRequiredFields = [
        {
            key: "file_name",
            label: "Please Fill File Name",
            required: true,
            ref: file_name_ref,
        },
        {
            key: "notify_all",
            label: "Please Select Notify All",
            required: true,
            ref: notify_all_ref,
        },
        {
            key: "employees",
            label: "Please Select Employees",
            required: true,
            ref: employees_ref,
        },
    ];


     const validateForm = () => {
        for (let field of basicRequiredFields) {
            const value = formData[field.key];

            const isEmpty =
            !value ||
            (Array.isArray(value) && value.length === 0) || // ✅ handle arrays
            (typeof value === "string" && !value.trim());

            if (field.required && isEmpty) {
            setErrors((prev) => ({ ...prev, [field.key]: field.label }));
            toast.error(field.label);
            handleFormError(field?.ref);
            return false;
            }
        }
        return true;
        };
    const handleEmployeesChange = (selectedEmployeeIds) => {
        setFormData((prev) => ({ ...prev, employees: selectedEmployeeIds }));
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

    const handleDateChange = (name, date) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: date,
        }));
    };

    const validateEmails = (emails) => {
        const emailArray = emails?.length > 0 ? emails?.split(',')?.map((email) => email?.trim()) : [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailArray?.every((email) => emailRegex?.test(email));
    };

    const handleSaveOrUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (formData?.attachment?.length <= 0) {
            return toast.error("Please fill Attachments Field")
        }

        if (!validateEmails(formData?.notify_any_others)) {
            return toast.error("Please fill Valid Email")
        }
        const dataToSubmit = {
            ...formData,
            employees: JSON.stringify(formData?.employees),
            file_type: "employee",
            notify_any_others: formData?.notify_any_others?.length > 0 ? JSON.stringify(formData?.notify_any_others) : "",
            attachment: formData?.attachment?.length > 0 ? JSON.stringify(formData?.attachment) : "",
        };

        if (viewMode === "edit") {
            dataToSubmit["id"] = id;
        }
        try {
            const res = await dispatch(createNewFile(dataToSubmit))
            if (res?.status === 200) {
                navigate(id ? `/employee-file-details/${res?.myfile?.id}` : `/employee-file-list`);
                if (id) dispatch(getFileDetails({ id }));
            }
        }
        catch (error) {
            console.log("error-", error);
        };
    };

    const employeeOptions = useMemo(
        () =>
            employeeList?.map((e) => ({
                id: e?.user_id,
                label: [e?.first_name, e?.last_name]
                    .filter(Boolean)
                    .join(" "),
            })),
        [employeeList]
    );

    const notifyAllOptions = [
        { id: 1, label: "Yes" },
        { id: 2, label: "No" },
    ]

    const isDetailView = viewMode === "detail";

    // return (
    //     <>
    //         <div className={`dept-page-basic-info-section ${viewMode === "edit" ? "isEditPage" : ""}`}>
    //             <h3>Basic Information</h3>
    //             <p className="dept-page-subtitle">Please Provide Files Basic Details Below.</p>
    return (
        <>
            <div className={`dept-page-basic-info-section ${viewMode === "edit" ? "isEditPage" : ""}`}>

                <div className="form-grid-layout">
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <File size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}>File Name{!isDetailView ? <span>*</span> : ''}</label>
                        <input
                            ref={file_name_ref}
                            type="text"
                            name="file_name"
                            value={formData?.file_name}
                            onChange={handleChange}
                            disabled={isDetailView}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <Calendar size={20} strokeWidth={1.5} />
                        </div>
                        <label>Deadline</label>
                        <FormDatePicker
                            label="Deadline"
                            onDateChange={handleDateChange}
                            initialDate={formData?.deadline}
                            type="deadline"
                            disabled={isDetailView}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <Bell size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}>
                            Notify All{!isDetailView ? <span>*</span> : ''}</label>
                        <SelectDropdown
                            ref={notify_all_ref}
                            selectedValue={formData?.notify_all}
                            options={notifyAllOptions}
                            onSelect={handleSelect}
                            type="notify_all"
                            disabled={isDetailView}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <Mail size={20} strokeWidth={1.5} />
                        </div>
                        <label>Notify Any Others On Email</label>
                        <input
                            type="text"
                            name="notify_any_others"
                            value={formData?.notify_any_others}
                            onChange={handleChange}
                            disabled={isDetailView}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <Users size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}>
                            Add Employee{!isDetailView ? <span>*</span> : ''}</label>
                        <SelectDropdownMultiple
                            ref={employees_ref}
                            placeholder="Select Employees"
                            selectedValue={formData?.employees}
                            options={employeeOptions}
                            onSelect={handleEmployeesChange}
                            searchPlaceholder="Select Employees"
                            handleSearch={handleSearch}
                            type="employees"
                            loading={employeeData?.loading}
                            showSearchBar={true}
                            disabled={isDetailView}
                            selectedName={formData?.employees}
                            multiple={true}
                        />
                    </div>
                    <div className="dept-page-input-group attachment_form">
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
                    <div className="dept-page-input-group attachment_form">
                        <div className="dept-page-icon-wrapper">
                            <Paperclip size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}>Upload Attachments{!isDetailView ? <span>*</span> : ''}</label>
                        <UploadFile
                            formData={formData}
                            setFormData={setFormData}
                            fieldName="attachment"
                            multiple={true}
                            isDetailView={isDetailView}
                            setDocumentUpload={setDocumentUpload}


                        />
                    </div>
                </div>
            </div>

            {(viewMode === "add" || viewMode === "edit") && (
                <SaveBtn
                    handleSubmit={handleSaveOrUpdate}
                    viewMode={viewMode}
                    loading={createFile?.loading}
                    color="#fff"
                    isDisabled={documentUpload}
                />
            )}
        </>
    )
}
