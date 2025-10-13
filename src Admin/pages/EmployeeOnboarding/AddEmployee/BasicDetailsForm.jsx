import { useState, useRef } from 'react';
import './AddEmloyee.scss';
import './NavbarForm.scss';
import FormDatePicker from '../../../utils/common/FormDatePicker.jsx';
import { genderOptions, maritalStatus, employeeStatusOptions, metroOptions } from '../../../utils/Constant.js';
import SelectDropdown from '../../../utils/common/SelectDropdown/SelectDropdown.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { handleFormError, showMasterData } from '../../../utils/helper.js';
import { AArrowUp, Accessibility, AppWindowMac, ArrowBigUp, Book, Calendar, FolderPen, IdCard, MapPinCheckInside, MapPinHouseIcon, MarsStroke, Pencil, Phone, SquareCode, SquaresExclude, TrainFront, User, UserRoundCheck } from 'lucide-react';
import { UserProfileImageUpload } from '../../../utils/common/UserProfileImageUpload/UserProfileImageUpload.jsx';
import { useNavigate } from 'react-router-dom';
import StatusDropdown from '../../../utils/common/StatusDropdown/StatusDropdown.jsx';
import SubmitButton from '../../../utils/common/SubmitButton.jsx';
import { createNewEmployee, getEmployeeDetails, updateEmployeeStatus } from '../../../Redux/Actions/employeeActions.js';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import ConfirmPopup from '../../../utils/common/ConfirmPopup.jsx';
import { AddMasterValuePopup } from '../../Master/AddMasterValuePopup.jsx';

const BasicDetailsForm = ({ isEditPage, setIsEditMode, isEditMode, formData, setFormData, id, handleSearch }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const createUpdateEmployee = useSelector((state) => state?.createEmployee);
    const employeeDetails = useSelector((state) => state?.employeeDetails);
    const employeeDetail = employeeDetails?.data?.result;

    const employment_options = showMasterData("1");
    const role_options = showMasterData("2");
    const job_location_options = showMasterData("3");
    const diff_abled_options = showMasterData("4");
    const source_of_hire_options = showMasterData("5");

    // Store refs for each input field
    const first_name_ref = useRef(null);
    const last_name_ref = useRef(null);
    const email_ref = useRef(null);
    const department_ref = useRef(null);

    const [errors, setErrors] = useState({
        first_name: false,
        last_name: false,
        email: false,
        department_id: false
    });

    const departmentData = useSelector((state) => state?.departmentList);
    const departmentLists = departmentData?.data?.department || [];

    const designationData = useSelector((state) => state?.designationList);
    const designationLists = designationData?.data?.designation || [];

    const employeeData = useSelector((state) => state?.employeeList);
    const employeeLists = employeeData?.data?.result || [];

    const shiftData = useSelector((state) => state?.shiftList);
    const shiftLists = shiftData?.data?.result || [];

    const workLocationData = useSelector((state) => state?.WorkLocList);
    const workLocationLists = workLocationData?.data?.data || [];
    const updateStatus = useSelector((state) => state?.updateEmployeeStatus);

    const workLocationOptions = workLocationLists?.map((item) => {
        const addressParts = [
            item?.street_address1,
            item?.street_address2 || null,
            item?.city || null,
            item?.state,
            item?.zip_code ? `-${item.zip_code}` : null,
        ].filter(Boolean); // removes falsy values like null, undefined, ''

        return {
            id: item?.id,
            label: `${item?.work_location_name} ( ${addressParts.join(', ')} )`,
        };
    });

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleDateChange = (name, date) => {
        const format = "DD-MM-YYYY";
        let updatedData = { [name]: date };

        if (name === "date_of_birth") {
            const parsed = dayjs(date, format, true); // strict parsing with known format
            if (!parsed.isValid()) {
                toast.error("Invalid date format!");
                return;
            }

            const currentDate = dayjs();
            const age = currentDate.diff(parsed, "year");

            if (age < 18) {
                toast.error("Age should be 18 or above!");
                return;
            }

            updatedData.age = currentDate.diff(parsed, "year");
        }

        setFormData((prevState) => ({
            ...prevState,
            ...updatedData,
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

    const handlePANChange = (e) => {
        const { name, value } = e.target;
        const raw = e.target.value.toUpperCase().replace(/\s+/g, "");

        let result = "";

        // First 5 letters
        const first5 = raw.slice(0, 5).replace(/[^A-Z]/g, "");
        result += first5;

        // Next 4 digits
        const next4 = raw.slice(5, 9).replace(/[^0-9]/g, "");
        result += next4;

        // Last 1 letter
        const last1 = raw.slice(9, 10).replace(/[^A-Z]/g, "");
        result += last1;

        setFormData(prevState => ({
            ...prevState,
            [name]: result
        }));
        setErrors((prevState) => ({
            ...prevState,
            basicDetails: {
                ...prevState.basicDetails,
                [name]: false, // Clear error for this field
            },
        }));
    };

    const handleSelect = (name, item) => {
        setFormData((prevState) => {
            let updatedData = { ...prevState }
            if (name === "role" || name === "department_id" || name === "designation_id" || name === "shift_id" || name === "employee_status" || name === "job_location_id" || name === "source_of_hire" || name === "employment_type" || name === "differently_abled_type" || name === "work_location_id") {
                updatedData[name] = item?.id;
            }
            else if (name === "gender" || name === "marital" || name === "is_metro") {
                updatedData = { ...prevState, [name]: item?.label };
            }
            return updatedData;
        });

        if (["shift_id", "work_location_id", "is_metro"].includes(name)) {
            setErrors((prevState) => ({
                ...prevState,
                [name]: false,
            }));
        }
    };
    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const handleUpdateStatus = () => {
        const sendData = {
            employee_id: id,
            employee_status: selectedStatus,
        };

        dispatch(updateEmployeeStatus(sendData))
            .then((res) => {
                if (res?.success) {
                    setShowModal(false);
                    setFormData((prev) => ({
                        ...prev,
                        employee_status: selectedStatus,
                    }));
                    dispatch(getEmployeeDetails({ id }));
                }
            })
            .catch((error) => {
                setShowModal(false);
                console.log("error-", error);
            });
    };

    const handleStatus = (val) => {
        if (location.pathname.includes("add-employee")) {
            setFormData((prevData) => ({
                ...prevData,
                employee_status: val,
            }));
        }
        else {
            setShowModal(true);
            setSelectedStatus(val);
        }
    };

    const requiredFields = [
        { key: "first_name", label: "Please fill name", required: true, ref: first_name_ref },
        { key: "last_name", label: "Please fill last name", required: true, ref: last_name_ref },
        { key: "email", label: "Please fill email", required: true, ref: email_ref },
        { key: "department_id", label: "Please select department", required: true, ref: department_ref },
    ];

    const validateForm = () => {
        const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple email validation
        let valid = true;

        for (let field of requiredFields) {
            const value = formData[field.key];

            // --- Check empty required fields
            if (field.required && (!value || (typeof value === "string" && !value.trim()))) {
                setErrors(prev => ({ ...prev, [field.key]: field.label }));
                toast.error(field.label);
                handleFormError(field?.ref);
                valid = false;
                break; // stop at first error
            }

            // --- Extra validation: PAN format
            if (field.key === "pan" && value) {
                if (!PAN_REGEX.test(value.toString().toUpperCase())) {
                    setErrors(prev => ({ ...prev, [field.key]: "Invalid PAN format" }));
                    toast.error("Invalid PAN format");
                    handleFormError(field?.ref);
                    valid = false;
                    break;
                }
            }
            // Extra check: Email format validation
            if (field.key === "email" && !emailRegex.test(value)) {
                setErrors((prev) => ({ ...prev, [field.key]: "Please fill valid Email" }));
                toast.error("Please fill valid Email");
                handleFormError(field.ref);
                valid = false;
                break;
            }
        }

        return valid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const image = formData?.image ? JSON.stringify(formData?.image) : "";

        const formDataToSubmit = {
            first_name: formData?.first_name,
            last_name: formData?.last_name,
            display_name: formData?.display_name,
            email: formData?.email,
            mobile_no: formData?.mobile_no,
            pan: formData?.pan,
            date_of_birth: formData?.date_of_birth,
            age: formData?.age,
            marital: formData?.marital,
            gender: formData?.gender,
            joining_date: formData?.joining_date,
            designation_id: formData?.designation_id,
            // password: formData?.password,
            // user_expiry_date: dayjs().format('DD-MM-YYYY'),
            shift_id: formData?.shift_id,
            role: formData?.role,
            department_id: formData?.department_id,
            // reporting_manager_id: formData?.reporting_manager_id,
            date_of_exit: formData?.date_of_exit,
            job_location_id: formData?.job_location_id,
            work_location_id: formData?.work_location_id,
            differently_abled_type: formData?.differently_abled_type,
            is_metro: formData?.is_metro,
            employment_type: formData?.employment_type,
            employee_status: formData?.employee_status,
            source_of_hire: formData?.source_of_hire,
            image: image, //
        };
        if (id) formDataToSubmit['id'] = employeeDetail?.id

        dispatch(createNewEmployee(formDataToSubmit))
            .then((res) => {
                if (res?.status === 200) {
                    setTimeout(() => {
                        navigate(`/employee-details/${res?.result?.user_id}`);
                        dispatch(getEmployeeDetails({ id: res?.result?.user_id }));
                        setIsEditMode(false);
                    }, 1500);
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

    return (
        <>
            {showMasterPopUp &&
                <AddMasterValuePopup
                    field={masterValue?.label}
                    id={masterValue?.id}
                    setShowMasterPopUp={setShowMasterPopUp} />
            }
            <ConfirmPopup
                open={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleUpdateStatus}
                type="update"
                module="Status"
                loading={updateStatus?.loading}
            />
            <div id='form' className={`formB bEdit ${isEditPage ? 'isEditPage' : ''}`}>
                <div className="page-header">
                    <h1>Profile Picture</h1>
                    {!isEditMode &&
                        <div className="header-actions">
                            <button className="action-btn edit_btn" onClick={() => { setIsEditMode(true); navigate(`/edit-employee/${id}`) }}>
                                Edit
                            </button>
                        </div>
                    }
                </div>
                <div className='profile_pic_head'>
                    <div className="form-group attachment_form">
                        <UserProfileImageUpload
                            formData={formData}
                            setFormData={setFormData}
                            fieldName="image"
                            isEditMode={isEditMode}
                        />
                    </div>
                    {/* {!isEditPage && */}
                    {/* <StatusDropdown
                        options={employeeStatusOptions?.filter((item) => item?.label !== "All")?.map((item) => ({
                            value: item?.id,
                            label: item?.label,
                            icon: item?.icon,
                        }))}
                        defaultValue={formData?.status}
                        onChange={(val) => handleStatus(val)}
                    /> */}
                    <StatusDropdown
                        options={employeeStatusOptions
                            ?.filter((item) => item?.label !== "All")
                            ?.map((item) => ({
                                value: item?.id,
                                label: item?.label,
                                icon: item?.icon,
                            }))}
                        defaultValue={formData?.employee_status}   // status ki jagah employee_status
                        onChange={(val) => handleStatus(val)}
                    // viewMode={!isEditMode}
                    />
                    {/* } */}
                </div>
                <br />
                <div className='div_heading'>
                    <h2>Basic Information</h2>
                    <p className='ppp'>Basic profile overview</p>
                </div>
                <div className="from1">
                    <div className={`form-group`}>
                        <label className={isEditMode ? 'color_red' : ""} style={{ color: errors?.first_name ? "red" : "inherit" }}>
                            <FolderPen size={20} strokeWidth={1.25} /> <p> First Name{isEditMode && <b className=''>*</b>}</p></label>
                        <div>
                            <input
                                ref={first_name_ref}
                                type="text"
                                // placeholder="Enter first name"
                                name="first_name"
                                value={formData?.first_name}
                                onChange={handleChange}
                                disabled={!isEditMode}
                                autoComplete="off"
                            // style={{ border: errors?.first_name ? "1px solid red" : "", }}
                            />
                            {/* {errors?.first_name && (
                                <p className="error_message" style={{ whiteSpace: "nowrap" }}>
                                    {otherIcons.error_svg}
                                    Please Fill First Name
                                </p>
                            )} */}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className={isEditMode ? 'color_red' : ""} style={{ color: errors?.last_name ? "red" : "inherit" }}>
                            <FolderPen size={20} strokeWidth={1.25} /> <p>Last Name{isEditMode && <b className=''>*</b>}</p>
                        </label>
                        <div>
                            <input
                                ref={last_name_ref}
                                type="text"
                                // placeholder="Enter last name"
                                name="last_name"
                                value={formData?.last_name}
                                onChange={handleChange}
                                disabled={!isEditMode}
                                autoComplete="off"
                            // style={{ border: errors?.last_name ? "1px solid red" : "" }}
                            />
                            {/* {errors?.last_name && (
                                <p className="error_message" style={{ whiteSpace: "nowrap" }}>
                                    {otherIcons.error_svg}
                                    Please Fill Last Name
                                </p>
                            )} */}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className={isEditMode ? 'color_red' : ""} style={{ color: errors?.email ? "red" : "inherit" }}>
                            <IdCard size={20} strokeWidth={1.25} /> <p>Email ID{isEditMode && <b className=''>*</b>}</p>
                        </label>
                        <div>
                            <input
                                ref={email_ref}
                                type="email"
                                // placeholder="Enter email id"
                                name="email"
                                value={formData?.email}
                                onChange={handleChange}
                                disabled={!isEditMode}
                                autoComplete="off"
                            // style={{ border: errors?.email ? "1px solid red" : "" }}
                            />
                            {/* {errors?.email && (
                                <p className="error_message" style={{ whiteSpace: "nowrap" }}>
                                    {otherIcons.error_svg}
                                    Please Fill Email
                                </p>
                            )} */}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>
                            <FolderPen size={20} strokeWidth={1.25} /> <p>Display Name</p><b className='color_red'></b></label>
                        <input
                            type="text"
                            // placeholder="Enter display name"
                            name="display_name"
                            value={formData?.display_name}
                            disabled={!isEditMode}
                            autoComplete="off"
                            onChange={handleChange}
                        // style={{ border: errors?.display_name ? "1px solid red" : "" }}
                        />
                        {/* {errors?.display_name && (
                            <p className="error_message" style={{ whiteSpace: "nowrap" }}>
                                {otherIcons.error_svg}
                                Please Fill Display Name
                            </p>
                        )} */}
                    </div>
                    <div className="form-group">
                        <label><Phone size={20} strokeWidth={1.25} /> <p>Contact Number</p><b className=''></b></label>
                        <input
                            type="number"
                            // placeholder="Enter contact number"
                            name="mobile_no"
                            value={formData?.mobile_no}
                            disabled={!isEditMode}
                            onChange={handleChange}
                            autoComplete="off"
                        // style={{ border: errors?.mobile_no ? "1px solid red" : "" }}
                        />
                        {/* {errors?.mobile_no && (
                            <p className="error_message" style={{ whiteSpace: "nowrap" }}>
                                {otherIcons.error_svg}
                                Please Fill Contact Number
                            </p>
                        )} */}
                    </div>
                    <div className="form-group">
                        <label><Calendar size={20} strokeWidth={1.25} /> <p>Date of Birth</p></label>
                        <FormDatePicker label="Date of Birth" onDateChange={handleDateChange} initialDate={formData?.date_of_birth} type="date_of_birth" disabled={!isEditMode} />
                    </div>
                    <div className="form-group">
                        <label><AArrowUp size={20} strokeWidth={1.25} /> <p>Age</p></label>
                        <input
                            type="text"
                            // placeholder={formData?.age == null ? 'Select Date of Birth' : formData?.age}
                            name="age"
                            value={formData?.age > 0 ? formData?.age + ' Year Old' : ''}
                            onChange={handleChange}
                            disabled={true}
                        />
                    </div>
                    {/* Gender Dropdown */}
                    <div className="form-group">
                        <label><MarsStroke size={20} strokeWidth={1.25} /><p>Gender</p></label>
                        <SelectDropdown
                            selectedValue={formData?.gender}
                            options={genderOptions}
                            // placeholder="Select Gender"
                            onSelect={handleSelect}
                            type="gender"
                            disabled={!isEditMode}
                            selectedName={genderOptions?.find(item => item?.label == formData?.gender)?.label || ""}
                        />
                    </div>

                    <div className="form-group">
                        <label><Book size={20} strokeWidth={1.25} /><p>PAN Number</p> <b className=''></b></label>
                        <input
                            // ref={pan_ref}
                            type="text"
                            // placeholder="Enter PAN Number"
                            name="pan"
                            value={formData?.pan}
                            onChange={handlePANChange}
                            disabled={!isEditMode}
                        // style={{ border: errors?.pan ? "1px solid red" : "" }}
                        />
                        {/* {errors?.pan && (
                            <p className="error_message" style={{ whiteSpace: "nowrap" }}>
                                {otherIcons.error_svg}
                                {formData?.pan ? "Enter a valid pan." : errors?.pan ? "PAN is required." : ""}
                            </p>
                        )} */}
                    </div>
                </div>
            </div>
            <hr className='hr_line' />
            <div id='form' className={`form_last formB ${isEditPage ? 'isEditPage' : ''}`}>
                <div className='div_heading'>
                    <h2>Company Information</h2>
                    <p className='ppp'>Essential organization information</p>
                </div>
                <div className="from1 form2 ">
                    {/* Department Dropdown */}
                    <div className="form-group ">
                        <label className={isEditMode ? 'color_red' : ""} style={{ color: errors?.department_id ? "red" : "inherit" }}>
                            <SquaresExclude size={20} strokeWidth={1.25} /> <p>Department{isEditMode && <b className=''>*</b>}</p></label>
                        <>
                            <SelectDropdown
                                ref={department_ref}
                                selectedValue={formData?.department_id}
                                options={departmentLists?.map((item) => ({
                                    id: item?.id,
                                    label: item?.department_name,
                                }))}
                                // placeholder="Select Department"
                                onSelect={handleSelect}
                                searchPlaceholder="Search Department"
                                handleSearch={handleSearch}
                                type="department_id"
                                loading={departmentData?.loading}
                                showSearchBar={true}
                                // className={errors?.department_id ? "select-dropdown-error" : ""}
                                disabled={!isEditMode}
                                selectedName={formData?.department_name ?? ""}
                            // selectedName={employeeDetail?.department?.department_name || departmentLists?.find(item => item?.id == formData?.department_id)?.department_name}
                            />

                            {/* {errors?.department_id && (
                                <p className="error_message" style={{ whiteSpace: "nowrap" }}>
                                    {otherIcons.error_svg}
                                    Please select a department
                                </p>
                            )} */}
                        </>
                    </div>
                    {/* <div className="form-group "></div> */}
                    <div className="form-group">
                        <label><User size={20} strokeWidth={1.25} /> <p>Employment Type</p></label>
                        <SelectDropdown
                            selectedValue={formData?.employment_type}
                            options={employment_options}
                            // placeholder="Select Employment Type"
                            onSelect={handleSelect}
                            type="employment_type"
                            disabled={!isEditMode}
                            selectedName={employment_options?.find(item => item?.id == formData?.employment_type)?.label || ""}
                            showAddButton={true}
                            onAddClick={() => handleAddMasterValue(1, "Employment Type")}
                            addBtnText="Employment Type"
                        />
                    </div>
                    <div className="form-group" >
                        <label> <AppWindowMac size={20} strokeWidth={1.25} /> <p>Designation</p> </label>
                        <SelectDropdown
                            selectedValue={formData?.designation_id}
                            options={designationLists?.map((item) => ({
                                id: item?.id,
                                label: item?.designation_name,
                            }))}
                            // placeholder="Select Designation"
                            onSelect={handleSelect}
                            searchPlaceholder="Search Designation"
                            handleSearch={handleSearch}
                            type="designation_id"
                            loading={designationData?.loading}
                            showSearchBar={true}
                            disabled={!isEditMode}
                            selectedName={formData?.designation_name ?? ""}
                        // selectedName={id ? employeeDetail?.designation?.designation_name : designationLists?.find(item => item?.id == formData?.designation_id)?.designation_name}
                        />
                    </div>

                    <div className="form-group">
                        <label> <UserRoundCheck size={20} strokeWidth={1.25} /><p>Role</p> </label>
                        <SelectDropdown
                            selectedValue={formData?.role}
                            options={role_options}
                            // placeholder="Select Role"
                            onSelect={handleSelect}
                            type="role"
                            disabled={!isEditMode}
                            selectedName={role_options?.find(item => item?.id == formData?.role)?.label || ""}
                            showAddButton={true}
                            onAddClick={() => handleAddMasterValue(2, "Role")}
                            addBtnText="New Role"
                        />
                    </div>

                    <div className="form-group">
                        <label> <ArrowBigUp size={20} strokeWidth={1.25} /><p>Shift</p> <b className=''></b></label>
                        <>
                            <SelectDropdown
                                // ref={shift_id_ref}
                                selectedValue={formData?.shift_id}
                                options={shiftLists?.map((item) => ({
                                    id: item?.id,
                                    label: item?.shift_name,
                                }))}
                                // placeholder="Select Shift"
                                onSelect={handleSelect}
                                searchPlaceholder="Search Shift"
                                handleSearch={handleSearch}
                                type="shift_id"
                                loading={shiftData?.loading}
                                showSearchBar={true}
                                disabled={!isEditMode}
                                // selectedName={!isEditMode ? employeeDetail?.shift?.shift_name : shiftLists?.find(item => item?.id == formData?.shift_id)?.shift_name}
                                selectedName={formData?.shift_name ?? ""}
                            />
                            {/* {errors?.shift_id && (
                                    <p className="error_message" style={{ whiteSpace: "nowrap" }}>
                                        {otherIcons.error_svg}
                                        Please Select Shift
                                    </p>
                                )} */}
                        </>
                    </div>

                    <div className="form-group">
                        <label> <MapPinHouseIcon size={20} strokeWidth={1.25} /><p>Work Location</p> <b className=''></b></label>
                        <>
                            <SelectDropdown
                                // ref={shift_id_ref}
                                selectedValue={formData?.work_location_id}
                                options={workLocationOptions}
                                // placeholder="Select Work Location"
                                onSelect={handleSelect}
                                searchPlaceholder="Search Work Location"
                                handleSearch={handleSearch}
                                type="work_location_id"
                                loading={workLocationData?.loading}
                                showSearchBar={true}
                                disabled={!isEditMode}
                                selectedName={formData?.work_location ?? ""}
                            />
                            {/* {errors?.shift_id && (
                                    <p className="error_message" style={{ whiteSpace: "nowrap" }}>
                                        {otherIcons.error_svg}
                                        Please Select Shift
                                    </p>
                                )} */}
                        </>
                    </div>

                    <div className="form-group">
                        <label><MapPinCheckInside size={20} strokeWidth={1.25} /><p>Job Type</p> <b className=''></b></label>
                        <SelectDropdown
                            selectedValue={formData?.job_location_id}
                            options={job_location_options}
                            // placeholder="Select Job Location"
                            onSelect={handleSelect}
                            type="job_location_id"
                            disabled={!isEditMode}
                            selectedName={job_location_options?.find(item => item?.id == formData?.job_location_id)?.label || ""}
                        />
                    </div>

                    {/* Marital Status Dropdown */}
                    <div className="form-group">
                        <label> <AArrowUp size={20} strokeWidth={1.25} /><p>Marital Status</p> </label>
                        <SelectDropdown
                            selectedValue={formData?.marital}
                            options={maritalStatus}
                            // placeholder="Select Marital Status"
                            onSelect={handleSelect}
                            type="marital"
                            disabled={!isEditMode}
                            selectedName={maritalStatus?.find(item => item?.label === formData?.marital)?.label || ""}
                        />
                    </div>
                    <div className="form-group">
                        <label> <Calendar size={20} strokeWidth={1.25} /> <p>Date of Joining</p></label>

                        <FormDatePicker
                            label="Date of Joining"
                            onDateChange={handleDateChange}
                            initialDate={formData?.joining_date}
                            type="joining_date"
                            disabled={!isEditMode}
                            toDate={formData?.date_of_exit}
                        />
                    </div>

                    <div className="form-group">
                        <label> <Calendar size={20} strokeWidth={1.25} /> <p>Date of Exit</p></label>

                        <FormDatePicker label="Date of Exit" onDateChange={handleDateChange} initialDate={formData?.date_of_exit} type="date_of_exit" disabled={!isEditMode} fromDate={formData?.joining_date} />
                    </div>

                    {/* Employee Status Dropdown */}

                    {/* Differently Abled Type Dropdown */}
                    <div className="form-group">
                        <label> <Accessibility size={20} strokeWidth={1.25} /><p>Differently Abled Type</p></label>
                        <SelectDropdown
                            selectedValue={formData?.differently_abled_type}
                            options={diff_abled_options}
                            // placeholder="Select Type"
                            onSelect={handleSelect}
                            type="differently_abled_type"
                            disabled={!isEditMode}
                            selectedName={diff_abled_options?.find(item => item?.id == formData?.differently_abled_type)?.label || ""}
                        />
                    </div>
                    <div className="form-group">
                        <label><TrainFront size={20} strokeWidth={1.25} /><p> Metro/Non-Metro</p><b className=''></b></label>
                        <>
                            <SelectDropdown
                                // ref={is_metro_ref}
                                selectedValue={formData?.is_metro}
                                options={metroOptions}
                                // placeholder="Select Type"
                                onSelect={handleSelect}
                                type="is_metro"
                                disabled={!isEditMode}
                                selectedName={metroOptions?.find(item => item?.label === formData?.is_metro)?.label || ""}
                            // className={errors?.is_metro ? "select-dropdown-error" : ""}
                            />
                            {/* {errors?.is_metro && (
                                    <p className="error_message" style={{ whiteSpace: "nowrap" }}>
                                        {otherIcons.error_svg}
                                        Please select either Metro or Non-Metro
                                    </p>
                                )} */}
                        </>
                    </div>

                    {/* 
                    <div className="form-group">
                        <label>Password<b className=''></b></label>
                        <div
                            style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", position: "relative" }}
                        >
                            <input
                                ref={password_ref}
                                type={!showPassword ? "password" : "text"}
                                // placeholder="Enter password"
                                name="password"
                                value={formData?.password}
                                onChange={handleChange}
                            // style={{ border: errors?.password ? "1px solid red" : "" }}
                            />
                            <span className="eyeicon" onClick={togglePasswordVisibility}>
                                {showPassword ?
                                    otherIcons.show_password_svg
                                    :
                                    otherIcons.hide_password_svg
                                }
                            </span>
                        </div>
                        {errors?.password && (
                            <p className="error_message" style={{ whiteSpace: "nowrap" }}>
                                {otherIcons.error_svg}
                                Please Fill Password
                            </p>
                        )}
                    </div> */}

                    <p className='pp'>Select employee source of hiring from the list to enhance team collaboration.</p>
                    <div className="form-group attachment_form fomr_h">
                    </div>

                    <div className="form-group" style={{ marginTop: '-25px' }}>
                        <label> <SquareCode size={20} strokeWidth={1.25} /> <p>Source of Hire</p></label>
                        <SelectDropdown
                            selectedValue={formData?.source_of_hire}
                            options={source_of_hire_options}
                            // placeholder="Select Source"
                            onSelect={handleSelect}
                            type="source_of_hire"
                            disabled={!isEditMode}
                            selectedName={source_of_hire_options?.find(item => item?.id == formData?.source_of_hire)?.label || ""}
                            showAddButton={true}
                            onAddClick={() => handleAddMasterValue(5, "Role")}
                            addBtnText="New"
                        />
                    </div>
                </div>
                {isEditMode &&
                    <div className='submit-bu tton-container'>
                        <SubmitButton
                            loading={createUpdateEmployee?.loading}
                            id={id}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                }
            </div>

        </>
    );
};
export default BasicDetailsForm;
// 