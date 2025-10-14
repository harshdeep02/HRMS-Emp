// src/components/EmployeTravel/EmployeTravelForm.jsx

import {
    Users,
    Building2,
    Calendar,
    Clock,
    ClipboardList,
    Plane,
    Proportions,
    User
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMemo, useRef, useState } from 'react';
import TextAreaWithLimit from '../../../utils/common/TextAreaWithLimit.jsx';
import SaveBtn from '../../../utils/common/SaveBtn.jsx';
import { calculateDuration, handleFormError } from "../../../utils/helper.js";
import FormDatePicker from '../../../utils/common/FormDatePicker.jsx';
import SelectDropdown from '../../../utils/common/SelectDropdown/SelectDropdown.jsx';
import { createNewTravel, getTravelDetails } from '../../../Redux/Actions/travelActions.js';

const EmployeTravelForm = ({ viewMode, formData, setFormData, handleSearch }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    //Data from redux
    const createUpdateTravel = useSelector((state) => state?.createTravel);
    const travelDetails = useSelector((state) => state?.travelDetails);
    const travelDetail = travelDetails?.data?.travel || {};

    const departmentData = useSelector((state) => state?.allDepartments);
    const departmentList = departmentData?.data?.department || [];
    const employeeData = useSelector((state) => state?.employeeList);
    const employeeList = employeeData?.data?.result || [];

    const departmentOptions = useMemo(
        () => departmentList?.map(d => ({ id: d?.id, label: d?.department_name })),
        [departmentList]
    );

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

    const user_id_ref = useRef(null);
    const department_ref = useRef(null);
    const customer_name_ref = useRef(null);
    const place_of_visit_ref = useRef(null);
    const expected_date_of_arrival_ref = useRef(null);
    const expected_date_of_departure_ref = useRef(null);

    const visuallyRequiredFields = {
        user_id: true,
        department_id: true,
        place_of_visit: true,
        expected_date_of_departure: true,
        expected_date_of_arrival: true,
        customer_name: true,
    };

    const [errors, setErrors] = useState({
        user_id: false,
        department_id: false,
        place_of_visit: false,
        expected_date_of_departure: false,
        expected_date_of_arrival: false,
        customer_name: false,
    });

    const basicRequiredFields = [
        {
            key: "user_id",
            label: "Please select employee",
            required: true,
            ref: user_id_ref,
        },
        {
            key: "department_id",
            label: "Please select Department",
            required: true,
            ref: department_ref,
        },
        {
            key: "place_of_visit",
            label: "Please fill Place Of Visit",
            required: true,
            ref: place_of_visit_ref,
        },
        {
            key: "expected_date_of_departure",
            label: "Please fill Expected Date Of Departure",
            required: true,
            ref: expected_date_of_departure_ref,
        },
        {
            key: "expected_date_of_arrival",
            label: "Please fill Expected Date Of Arrival",
            required: true,
            ref: expected_date_of_arrival_ref,
        },
        {
            key: "customer_name",
            label: "Please fill Customer Name",
            required: true,
            ref: customer_name_ref,
        },
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

    const handleSelect = (name, item) => {
        setFormData((prevData) => {
            let updates = {};

            if (name === "user_id") {
                const selectedEmployee = employeeList?.find(emp => emp?.user_id === item?.id);
                updates = {
                    [name]: item?.id,
                    department_id: selectedEmployee?.department_id,
                    user_image: selectedEmployee?.image ? JSON?.parse(selectedEmployee?.image) : "",
                };
            } else if (name === "is_billable_to_customer") {
                updates = { [name]: item?.label };
            } else {
                updates = { [name]: item?.id };
            }

            return { ...prevData, ...updates };
        });

        setErrors((prev) => ({ ...prev, [name]: false }));
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

    // Helper function to update date
    const updateFormData = (name, date, calculatedDays) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: date,
            expected_duration_in_days: calculatedDays,
        }));
    };

    const handleDateChange = (name, date) => {
        const { expected_date_of_departure: from_date, expected_date_of_arrival: to_date } = formData;

        // Parse the input date and existing form dates into valid Date objects
        const parsedDate = new Date(date.split('-').reverse().join('-')); // Convert DD-MM-YYYY to YYYY-MM-DD
        const parsedFromDate = from_date ? new Date(from_date.split('-').reverse().join('-')) : null;
        const parsedToDate = to_date ? new Date(to_date.split('-').reverse().join('-')) : null;

        if (name === "expected_date_of_departure") {
            if (parsedToDate && parsedDate > parsedToDate) {
                toast.error("Departure date cannot be later than the arrival date.");
                return;
            }
            const calculateDate = calculateDuration(date, to_date);
            updateFormData(name, date, calculateDate);
        }
        if (name === "expected_date_of_arrival") {
            if (parsedFromDate && parsedDate < parsedFromDate) {
                toast.error("Arrival date cannot be earlier than the departure date.");
                return;
            }
            const calculateDate = calculateDuration(from_date, date);
            updateFormData(name, date, calculateDate);
        }
    };

    const handleSaveOrUpdate = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSubmit = {
            ...formData,
            // user_image: formData?.user_image ? JSON.stringify(formData?.user_image) : ""
            user_id: formData?.user_id,
            purpose_of_visit: formData?.purpose_of_visit,
            place_of_visit: formData?.place_of_visit,
            expected_date_of_arrival: formData?.expected_date_of_arrival,
            expected_date_of_departure: formData?.expected_date_of_departure,
            expected_duration_in_days: formData?.expected_duration_in_days,
            is_billable_to_customer: formData?.is_billable_to_customer,
            customer_name: formData?.customer_name,
            status: formData?.status,
        };
        if (viewMode === 'edit') {
            formDataToSubmit["id"] = id;
        }

        dispatch(createNewTravel(formDataToSubmit))
            .then((res) => {
                if (res?.status === 200) {
                    navigate(id ? `/travel-details/${id}` : `/travel-list`);
                    if (id) dispatch(getTravelDetails({ id }));
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });
    };

    const isAddOrEdit = viewMode === 'add' || viewMode === 'edit';
    const isDetailView = viewMode === "detail";

    return (
        <>
            <div className={`dept-page-basic-info-section ${viewMode === "edit" ? "isEditPage" : ""}`} style={{ marginTop: '0px' }}>
                <h3>Basic Information</h3>
                <p className="dept-page-subtitle">{viewMode !== "detail" ? "Please Provide" : ''} Travel Basic Details Below.</p>

                {/* Employee Name */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Users size={20} strokeWidth={1.5} /></div>
                    <label className={isAddOrEdit && visuallyRequiredFields?.user_id ? 'color_red' : ""}>Employee{isAddOrEdit && visuallyRequiredFields?.user_id && <b className='color_red'>*</b>}</label>
                    <SelectDropdown
                        ref={user_id_ref}
                        selectedValue={formData?.user_id}
                        options={employeeOptions}
                        onSelect={handleSelect}
                        searchPlaceholder="Search employee"
                        handleSearch={handleSearch}
                        type="user_id"
                        loading={employeeData?.loading}
                        showSearchBar={true}
                        disabled={isDetailView}
                        selectedName={formData?.user_name ?? ""}
                    />
                </div>

                {/* Department */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Building2 size={20} strokeWidth={1.5} /></div>
                    <label className={isAddOrEdit && visuallyRequiredFields?.department_id ? 'color_red' : ""}>Department{isAddOrEdit && visuallyRequiredFields?.department_id && <b className='color_red'>*</b>}</label>
                    <SelectDropdown
                        selectedValue={formData?.department_id}
                        options={departmentOptions}
                        onSelect={handleSelect}
                        searchPlaceholder="Search department"
                        handleSearch={handleSearch}
                        type="department_id"
                        loading={departmentData?.loading}
                        showSearchBar={false}
                        disabled={true}
                    />
                </div>

                {/* Place of Visit */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Plane size={20} strokeWidth={1.5} /></div>
                    <label className={!isDetailView ? 'color_red' : ""}>Place Of Visit{!isDetailView ? <span>*</span> : ''}</label>
                    <input
                        ref={place_of_visit_ref}
                        type="text"
                        name="place_of_visit"
                        value={formData?.place_of_visit}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>

                {/* Expected Date of Departure */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"  >
                        <Calendar size={20} strokeWidth={1.25} />
                    </div>
                    <label className={!isDetailView ? 'color_red' : ""}>Expected Date Of Departure{!isDetailView ? <span>*</span> : ''}</label>
                    <FormDatePicker
                    ref={expected_date_of_arrival_ref}
                        label="Expected Date Of Departure"
                        onDateChange={handleDateChange}
                        initialDate={formData?.expected_date_of_departure}
                        type="expected_date_of_departure"
                        disabled={isDetailView}
                        toDate={formData?.expected_date_of_arrival}
                    />
                </div>

                {/* Expected Date of Arrival */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"  >
                        <Calendar size={20} strokeWidth={1.25} />
                    </div>
                    <label className={!isDetailView ? 'color_red' : ""}>Expected Date Of Arrival{!isDetailView ? <span>*</span> : ''}</label>
                    <FormDatePicker
                    ref={expected_date_of_departure_ref}
                        label="Expected Date Of Arrival"
                        onDateChange={handleDateChange}
                        initialDate={formData?.expected_date_of_arrival}
                        type="expected_date_of_arrival"
                        disabled={isDetailView}
                        fromDate={formData?.expected_date_of_departure}
                    />
                </div>

                {/* Expected Duration in Days */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Clock size={20} strokeWidth={1.5} /></div>
                    <label>Expected Duration In Days</label>
                    <input
                        type="text"
                        name="expected_duration_in_days"
                        value={formData?.expected_duration_in_days}
                        onChange={handleChange}
                        disabled = {true}
                    />
                </div>



                {/* Customer Name */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><User size={20} strokeWidth={1.5} /></div>
                    <label className={isAddOrEdit && visuallyRequiredFields?.customer_name ? 'color_red' : ""}>Customer Name{isAddOrEdit && visuallyRequiredFields?.customer_name && <b className='color_red'>*</b>}</label>
                    <input
                        ref={customer_name_ref}
                        type="text"
                        name="customer_name"
                        value={formData?.customer_name}
                        onChange={handleChange}
                        disabled={isDetailView} />

                </div>

                {/* Is Billable to Customer */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Proportions size={20} strokeWidth={1.5} /></div>
                    <label>Is Billable To Customer</label>
                    <SelectDropdown
                        selectedValue={formData?.is_billable_to_customer}
                        options={[{ id: 1, label: 'Yes' }, { id: 2, label: 'No' }]}
                        onSelect={handleSelect}
                        type="is_billable_to_customer"
                        disabled={isDetailView}
                    />
                </div>
                {/* Purpose of Visit */}
                <div className="dept-page-input-group attachment_form">
                    <div className="dept-page-icon-wrapper"><ClipboardList size={20} strokeWidth={1.5} /></div>
                    <label>Purpose Of Visit</label>
                    <TextAreaWithLimit
                        name="purpose_of_visit"
                        value={formData?.purpose_of_visit}
                        formsValues={{
                            handleChange: handleChange,
                            form: formData
                        }}
                        disabled={isDetailView}
                    />
                </div>
            </div>

            {(viewMode === "add" || viewMode === "edit") && (
                <SaveBtn handleSubmit={handleSaveOrUpdate} viewMode={viewMode} loading={createUpdateTravel?.loading} color='#fff' />
            )}
        </>
    );
};

export default EmployeTravelForm;