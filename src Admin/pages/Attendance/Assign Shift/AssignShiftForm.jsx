// src/components/EmployeTravel/EmployeTravelForm.jsx
import {
    AppWindowMac,
    User,
    CalendarPlus,
    Calendar,
} from 'lucide-react';
import { useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SelectDropdownMultiple from "../../../utils/common/SelectDropdownMultiple/SelectDropdownMultiple.jsx";
import SaveBtn from '../../../utils/common/SaveBtn.jsx';
import { handleFormError } from "../../../utils/helper.js";
import FormDatePicker from '../../../utils/common/FormDatePicker.jsx';
import SelectDropdown from '../../../utils/common/SelectDropdown/SelectDropdown.jsx';
import { assignNewShift } from '../../../Redux/Actions/shiftActions.js';

const AssignShiftForm = ({ viewMode, formData, setFormData, handleSearch, handleEmployees }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    //Data from redux
    const assignShift = useSelector((state) => state?.assignShift);

    const departmentData = useSelector((state) => state?.departmentList);
    const departmentLists = departmentData?.data?.department || [];

    const departmentOptions = useMemo(
        () => departmentLists?.map(d => ({ id: d?.id, label: d?.department_name })),
        [departmentLists]
    );

    //empDepartment list from redux
    const employeeData = useSelector((state) => state?.empDepartmentDetails);
    const employeeLists = employeeData?.data?.employees || [];

    const employeeOptions = useMemo(
        () => employeeLists?.map(e => ({
            id: e?.user_id, label: [e?.first_name, e?.last_name]
                .filter(Boolean)
                .join(" "),
        })),
        [employeeLists]
    );

    //shift list from redux
    const shiftData = useSelector((state) => state?.shiftList);
    const shiftLists = shiftData?.data?.result || [];

    const shiftOptions = useMemo(
        () => shiftLists?.map(d => ({ id: d?.id, label: d?.shift_name })),
        [shiftLists]
    );

    const department_name_ref = useRef(null);
    const employee_ref = useRef(null);
    const shift_ref = useRef(null);

    const [errors, setErrors] = useState({
        department_id: false,
        employees: false,
        shift_id: false
    });

    const basicRequiredFields = [
        { key: "department_id", label: "Please Select Department", required: true, ref: department_name_ref },
        { key: "employees", label: "Please Select Employees", required: true, ref: employee_ref },
        { key: "shift_id", label: "Please Select Shift", required: true, ref: shift_ref }
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
                setErrors((prev) => ({ ...prev, [field.key]: field.label }));
                toast.error(field.label);
                handleFormError(field?.ref);
                return false; // stop at the first error
            }
        }

        return true;
    };

    const handleSelect = async (name, value) => {
        if (name === "department_id") {
            setFormData((prevData) => ({
                ...prevData,
                department_name: value?.label,
                department_id: value?.id,
                employees: []
            }));
            handleEmployees("", value?.id)
        }
        if (name === "shift_id") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value?.id,
                shift_name: value?.name
            }));
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: false,
        }));
    };

    const handleEmployeesChange = (selectedEmployeeIds) => {
        setFormData((prev) => ({ ...prev, employees: selectedEmployeeIds }));
    };

    const handleDateChange = (name, date) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: date
        }));
    };

    const handleStatus = (val) => {
        setFormData(prevData => ({
            ...prevData,
            status: val
        }));
    };

    const handleSaveOrUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const dataToSubmit = {
            department_id: formData?.department_id,
            shift_id: formData?.shift_id,
            shift_name: formData?.shift_name,
            employees: formData?.employees,
            date: formData?.date,
        };

        try {
            const res = await dispatch(assignNewShift(dataToSubmit))
            if (res?.success === true) {
                navigate('/assign-shift-list');
            }
        } catch (error) {
            console.log("error-", error);
        }
    };

    const isDetailView = viewMode === "detail";

    return (
        <>
            <div className="dept-page-basic-info-section">
                <h3>Basic Information</h3>
                <p className="dept-page-subtitle">{viewMode !== "detail"? "Please Provide" :''} Shift Details Below.</p>
                <div className="form-grid-layout">
                    {/* Department Dropdown */}
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <AppWindowMac size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? 'color_red' : ""}>Department{!isDetailView ? <span>*</span> : ''}</label>
                        <SelectDropdown
                            ref={department_name_ref}
                            // placeholder="Select Department"
                            selectedValue={formData?.department_id}
                            options={departmentOptions}
                            onSelect={handleSelect}
                            disabled={isDetailView}
                            handleSearch={handleSearch}
                            showSearchBar={true}
                            type="department_id"
                            loading={departmentData?.loading}
                            selectedName={formData?.department_name}
                        />
                    </div>

                    {/* Employee Multi-Select Dropdown */}
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <User size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? 'color_red' : ""}>Employees{!isDetailView ? <span>*</span> : ''}</label>
                        <SelectDropdownMultiple
                            placeholder={!formData?.department_id ? "Select Department First" : ""}
                            selectedValue={formData?.employees}
                            options={employeeOptions}
                            onSelect={handleEmployeesChange}
                            handleSearch={handleSearch}
                            showSearchBar={true}
                            disabled={!formData?.department_id || isDetailView}
                            multiple={true}
                            type="employee"
                            ref={employee_ref}
                            loading={employeeData?.loading}
                        />
                    </div>

                    {/* Date Picker */}
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"  >
                            <Calendar size={20} strokeWidth={1.25} />
                        </div>
                        <label>Date</label>
                        <FormDatePicker
                            label="Date"
                            initialDate={formData.date}
                            onDateChange={handleDateChange}
                            placeholder="Select a date"
                            disabled={isDetailView}
                            restrict={true}
                        />
                    </div>

                    {/* Shift Dropdown */}
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <CalendarPlus size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? 'color_red' : ""}>Shift{!isDetailView ? <span>*</span> : ''}</label>
                        <SelectDropdown
                            ref={shift_ref}
                            // placeholder="Select Shift"
                            selectedValue={formData?.shift_id}
                            options={shiftOptions}
                            onSelect={handleSelect}
                            disabled={isDetailView}
                            handleSearch={handleSearch}
                            showSearchBar={true}
                            type="shift_id"
                            loading={shiftData?.loading}
                            selectedName={formData?.shift_name}
                        />
                    </div>
                </div>
            </div>

            {(viewMode === "add" || viewMode === "edit") && (
                <SaveBtn handleSubmit={handleSaveOrUpdate} viewMode={viewMode} loading={assignShift?.loading} color='#fff' btntype='buttom_fix_btn' />
            )}
        </>
    );
};

export default AssignShiftForm;