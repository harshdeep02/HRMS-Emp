import {
    Calendar,
    CalendarOff,
    Proportions,
    Rows4,
    User
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import { calculateDuration, handleFormError, showMasterData } from "../../../utils/helper.js";
import { useNavigate, useParams } from 'react-router-dom';
import SaveBtn from '../../../utils/common/SaveBtn.jsx';
import { createNewTraining, getTrainingDetails } from '../../../Redux/Actions/trainingActions.js';
import TextAreaWithLimit from '../../../utils/common/TextAreaWithLimit.jsx';
import SelectDropdownMultiple from '../../../utils/common/SelectDropdownMultiple/SelectDropdownMultiple.jsx';
import SelectDropdown from '../../../utils/common/SelectDropdown/SelectDropdown.jsx';
import FormDatePicker from '../../../utils/common/FormDatePicker.jsx';
import dayjs from "dayjs";

const TrainingForm = ({ viewMode, formData, setFormData, handleSearch }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    //Data from redux
    const createUpdateTraining = useSelector((state) => state?.createTraining);
    const training_type_options = showMasterData("22");

    const trainerData = useSelector((state) => state?.trainerList);
    const trainerLists = trainerData?.data?.result || [];

    const trainerOptions = useMemo(
        () => trainerLists?.map(e => ({
            id: e?.id, label: e?.trainer_name,
        })),
        [trainerLists]
    );

    //employees list from redux
    const employeeData = useSelector((state) => state?.employeeList);
    const employeeLists = employeeData?.data?.result || [];

    const employeeOptions = useMemo(
        () => employeeLists?.map(e => ({
            id: e?.user_id, label: [e?.first_name, e?.last_name]
                .filter(Boolean)
                .join(" "),
        })),
        [employeeLists]
    );

    const trainer_id_ref = useRef(null);
    const training_type_ref = useRef(null);
    const employees_ref = useRef(null);

    const [errors, setErrors] = useState({
        trainer_id: false,
        training_type: false,
        employees: false
    });

    const basicRequiredFields = [
        {
            key: "trainer_id",
            label: "Please select Trainer",
            required: true,
            ref: trainer_id_ref,
        },
        {
            key: "training_type",
            label: "Please select Training Type",
            required: true,
            ref: training_type_ref,
        },
        {
            key: "employees",
            label: "Please select Employees",
            required: true,
            ref: employees_ref,
        }
    ];

    const validateForm = () => {
        for (let field of basicRequiredFields) {
            const value = formData[field.key];

            let isEmpty = false;

            if (Array.isArray(value)) {
                // ✅ Array must not be empty
                isEmpty = value?.length === 0;
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
                setErrors((prev) => ({ ...prev, [field.key]: field?.label }));
                toast.error(field?.label);
                handleFormError(field?.ref);
                return false; // stop at the first error
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
        if (name === "trainer_id") {
            const selectedTrainer = trainerLists?.find((item) => item?.id == value?.id);
            setFormData((prevData) => ({
                ...prevData,
                [name]: value?.id,
                trainer_name: value?.label,
                training_type: selectedTrainer?.training_type
            }));
        }
    };

    const handleEmployeesChange = (selectedEmployeeIds) => {
        setFormData((prev) => ({ ...prev, employees: selectedEmployeeIds }));
    };

    // Helper function to update date
    const updateFormData = (name, date, calculatedDays) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: date,
            duration: calculatedDays,
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
            const duration = calculateDuration(date, end_date);
            updateFormData(name, date, duration);
        }

        if (name === "end_date") {
            if (parsedFromDate && parsedDate.isBefore(parsedFromDate)) {
                toast.error("End date cannot be earlier than the start date.");
                return;
            }
            const duration = calculateDuration(start_date, date);
            updateFormData(name, date, duration);
        }
    };


    const handleSaveOrUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSubmit = {
            ...formData,
            employees: JSON.stringify(formData?.employees)
        };
        if (viewMode === "edit") {
            formDataToSubmit["id"] = id;
        }
        dispatch(createNewTraining(formDataToSubmit))
            .then((res) => {
                if (res?.status === 200) {
                    navigate(id ? `/training-details/${id}` : `/training-list`);
                    if (id) dispatch(getTrainingDetails({ id }));
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
               
                {/* Trainer Assigned */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper">
                        <User size={20} strokeWidth={1.5} />
                    </div>
                    <label className={!isDetailView ? "color_red" : ''}>Trainer Assigned{!isDetailView ? <span>*</span> : ''}</label>
                    <SelectDropdown
                        ref={trainer_id_ref}
                        selectedValue={formData?.trainer_id}
                        options={trainerOptions}
                        onSelect={handleSelect}
                        searchPlaceholder="Search trainer"
                        handleSearch={handleSearch}
                        showSearchBar={true}
                        disabled={isDetailView}
                        type="trainer_id"
                        loading={trainerData?.loading}
                        selectedName={formData?.trainer_name}
                    />
                </div>

                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper">
                        <User size={20} strokeWidth={1.5} />
                    </div>
                    <label className={!isDetailView ? "color_red" : ""}>Employees{!isDetailView ? <span>*</span> : ''}</label>
                    <SelectDropdownMultiple
                        ref={employees_ref}
                        placeholder="Select Employees"
                        selectedValue={formData?.employees}
                        options={employeeOptions}
                        onSelect={handleEmployeesChange}
                        handleSearch={handleSearch}
                        showSearchBar={true}
                        disabled={isDetailView}
                        multiple={true}
                        type="employees"
                        loading={employeeData?.loading}
                    />
                </div>

                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper">
                        <Rows4 size={20} strokeWidth={1.5} />
                    </div>
                    <label className={!isDetailView ? "color_red" : ""}>Training Type{!isDetailView ? <span>*</span> : ''}</label>
                    <SelectDropdown
                        ref={training_type_ref}
                        selectedValue={formData?.training_type}
                        options={training_type_options}
                        onSelect={handleSelect}
                        type="training_type"
                        disabled={true}
                        selectedName={training_type_options?.find(item => item?.id == formData?.training_type)?.label || ""}
                    />
                </div>

                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"  >
                        <Calendar size={20} strokeWidth={1.25} />
                    </div>
                    <label >Start Date</label>
                    <FormDatePicker label="Start Date" onDateChange={handleDateChange} initialDate={formData?.start_date} type="start_date" disabled={isDetailView} toDate={formData?.end_date} />

                </div>

                {/* End Date */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"  >
                        <Calendar size={20} strokeWidth={1.25} />
                    </div>
                    <label >End Date</label>
                    <FormDatePicker label="End Date" onDateChange={handleDateChange} initialDate={formData?.end_date} type="end_date" disabled={isDetailView} fromDate={formData?.start_date} />
                </div>

                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper">
                        <CalendarOff size={20} strokeWidth={1.5} />
                    </div>
                    <label>Duration</label>
                    <input
                        type="text"
                        name="duration"
                        value={formData?.duration}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>

                {/* Description */}
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

            </div>
            {(viewMode === "add" || viewMode === "edit") && (
                <SaveBtn
                    handleSubmit={handleSaveOrUpdate}
                    viewMode={viewMode}
                    loading={createUpdateTraining?.loading}
                    color="#fff"
                />
            )}
        </>
    );
};

export default TrainingForm;