import {
    User,
    AppWindowMac,
    FolderEdit,
    CircleUser,
    MarsStroke,
    Syringe,
    Handbag,
    Ruler,
    Hourglass,
    VenusAndMars,
    Pill,
    ScanHeart,
    Proportions,
    ContactRound,
    Calendar,
} from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useRef, useState } from 'react';
import { toast } from "react-toastify";
import { handleFormError, showMasterData } from "../../../utils/helper.js";
import { useNavigate, useParams } from 'react-router-dom';
import SaveBtn from '../../../utils/common/SaveBtn.jsx';
import SelectDropdown from '../../../utils/common/SelectDropdown/SelectDropdown.jsx';
import FormDatePicker from "../../../utils/common/FormDatePicker.jsx";
import TextAreaWithLimit from "../../../utils/common/TextAreaWithLimit.jsx";
import { UploadFile } from "../../../utils/common/UploadFile/UploadFile.jsx";
import { createNewEmpHealth, getEmpHealthDetails } from "../../../Redux/Actions/employeeHealthActions.js";
import { covidAffectedOptions, genderOptions } from "../../../utils/Constant.js";

const EmpHealthForm = ({ viewMode, formData, setFormData, handleSearch }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();


    //Data from redux
    const createUpdateEmpHealth = useSelector((state) => state?.createEmpHealth);
    const empHealthDetails = useSelector((state) => state?.empHealthDetails);
    const empHealthDetail = empHealthDetails?.data?.result || [];
    const departmentData = useSelector((state) => state?.allDepartments);
    const departmentList = departmentData?.data?.department || [];
    const employeeData = useSelector((state) => state?.employeeList);
    const employeeList = employeeData?.data?.result || [];
    const blood_group_options = showMasterData("18");
    const covid_vaccination_options = showMasterData("19");

    const departmentOptions = useMemo(
        () => departmentList?.map(d => ({ id: d?.id, label: d?.department_name })),
        [departmentList]
    );

    const employeeOptions = useMemo(
        () =>
            employeeList?.map((e) => ({
                id: e?.employee?.user_id,
                label: [e?.employee?.first_name, e?.employee?.last_name]
                    .filter(Boolean)
                    .join(" "),
            })),
        [employeeList]
    );

    const user_id_ref = useRef(null);
    const blood_group_ref = useRef(null);
    const covid_affected_ref = useRef(null);
    const covid_status_ref = useRef(null);

    const [errors, setErrors] = useState({
        user_id: false,
        blood_group: false,
        covid_affected: false,
        covid_status: false,
    });

    const basicRequiredFields = [
        {
            key: "user_id",
            label: "Please select employee",
            required: true,
            ref: user_id_ref,
        },
        {
            key: "blood_group",
            label: "Please select blood group",
            required: true,
            ref: blood_group_ref,
        },
        {
            key: "covid_affected",
            label: "Please select covid affected or not?",
            required: true,
            ref: covid_affected_ref,
        },
        {
            key: "covid_status",
            label: "Please select vaccination status",
            required: true,
            ref: covid_status_ref,
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

    const handleSelect = (name, item) => {
        setFormData((prevData) => {
            let updates = {};

            if (["gender", "covid_affected"].includes(name)) {
                updates = { [name]: item?.label };
            } else if (name === "user_id") {
                const selectedEmployee = employeeList?.find(emp => emp?.id === item?.id);
                updates = {
                    [name]: item?.id,
                    department_id: selectedEmployee?.employee?.department_id,
                    user_image: selectedEmployee?.employee?.image
                        ? JSON.parse(selectedEmployee?.employee?.image)
                        : "",
                };
            } else {
                updates = { [name]: item?.id };
            }

            return { ...prevData, ...updates };
        });

        setErrors((prev) => ({ ...prev, [name]: false }));
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

    const handleDateChange = (type, date) => {
        setFormData((prev) => ({ ...prev, [type]: date }));
    };

    const handleSaveOrUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSubmit = {
            ...formData,
            attachment: formData?.attachment ? JSON.stringify(formData?.attachment) : "",
        };
        if (viewMode === "edit") {
            formDataToSubmit["id"] = id;
        }
        dispatch(createNewEmpHealth(formDataToSubmit))
            .then((res) => {
                if (res?.status === 200) {
                    navigate(id ? `/employee-health-details/${id}` : `/employee-health-list`);
                    if (id) dispatch(getEmpHealthDetails({ id }));
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

                <h3>Basic Information</h3>
                <p className="dept-page-subtitle">{viewMode !== "detail"? "Please Provide" :''} Employees Basic Details Below.</p>
                {/* <div className="form-grid-layout"> */}
                <div className="dept-page-input-group">
                    {/* <div className="empConUp"> */}
                    <div className="dept-page-icon-wrapper">
                        <User size={20} strokeWidth={1.5} />
                    </div>
                    <label>Employee</label>
                    {/* </div> */}
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
                        selectedName={isDetailView ? [empHealthDetail?.employee?.first_name, empHealthDetail?.employee?.last_name].filter(Boolean).join(" ") : ""}
                    />
                </div>
                <div className="dept-page-input-group">
                    {/* <div className="empConUp"> */}
                    <div className="dept-page-icon-wrapper">
                        <AppWindowMac size={20} strokeWidth={1.5} />
                    </div>
                    <label>Department</label>
                    {/* </div> */}
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
                        selectedName={isDetailView ? empHealthDetail?.department?.department_name : ""}
                    />
                </div>
                <div className="dept-page-input-group">
                    {/* <div className="empConUp"> */}
                    <div className="dept-page-icon-wrapper">
                        <FolderEdit size={20} strokeWidth={1.5} />
                    </div>
                    <label>Emergency Contact Name</label>
                    {/* </div> */}
                    <input
                        type="text"
                        name="contact_name"
                        value={formData?.contact_name}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>
                <div className="dept-page-input-group">
                    {/* <div className="empConUp"> */}
                    <div className="dept-page-icon-wrapper">
                        <CircleUser size={20} strokeWidth={1.5} />
                    </div>
                    <label>Emergency Contact Number</label>
                    {/* </div> */}
                    <input
                        type="tel"
                        name="contact_no"
                        value={formData?.contact_no}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>
                <div className="dept-page-input-group">
                    {/* <div className="empConUp"> */}
                    <div className="dept-page-icon-wrapper">
                        <MarsStroke size={20} strokeWidth={1.5} />
                    </div>
                    <label>Gender</label>
                    {/* </div> */}
                    <SelectDropdown
                        selectedValue={formData?.gender}
                        options={genderOptions}
                        // placeholder="Select Gender"
                        onSelect={handleSelect}
                        type="gender"
                        disabled={isDetailView}
                        selectedName={genderOptions?.find(item => item?.label == formData?.gender)?.label || ""}
                    />
                </div>
                {/* </div> */}
            </div>
            <hr className="hr_line" />

            <div className={`dept-page-basic-info-section ${viewMode === "edit" ? "isEditPage" : ""}`}>

                <h3>Health Information</h3>
                <p className="dept-page-subtitle">
                    Please Provide Employees Basic Details Below.
                </p>
                {/* <div className="form-grid-layout"> */}
                <div className="dept-page-input-group">
                    {/* <div className="empConUp"> */}
                    <div className="dept-page-icon-wrapper">
                        <Syringe size={20} strokeWidth={1.5} />
                    </div>
                    <label className={!isDetailView ? "color_red" : ""}>Blood group{!isDetailView && <span>*</span>}</label>
                    {/* </div> */}
                    <SelectDropdown
                        ref={blood_group_ref}
                        selectedValue={formData?.blood_group}
                        options={blood_group_options}
                        // placeholder="Select Job Location"
                        onSelect={handleSelect}
                        type="blood_group"
                        disabled={isDetailView}
                        selectedName={blood_group_options?.find(item => item?.id == formData?.blood_group)?.label || ""}
                    />
                </div>
                <div className="dept-page-input-group">
                    {/* <div className="empConUp"> */}
                    <div className="dept-page-icon-wrapper">
                        <Handbag size={20} strokeWidth={1.5} />
                    </div>
                    <label>Weight</label>
                    {/* </div> */}
                    <input
                        type="text"
                        name="weight"
                        value={formData?.weight}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>
                <div className="dept-page-input-group">
                    {/* <div className="empConUp"> */}
                    <div className="dept-page-icon-wrapper">
                        <Ruler size={20} strokeWidth={1.5} />
                    </div>
                    <label>Height</label>
                    {/* </div> */}
                    <input
                        type="text"
                        name="height"
                        value={formData?.height}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>
                <div className="dept-page-input-group">
                    {/* <div className="empConUp"> */}
                    <div className="dept-page-icon-wrapper">
                        <Hourglass size={20} strokeWidth={1.5} />
                    </div>
                    <label>Allergies</label>
                    {/* </div> */}
                    <input
                        type="text"
                        name="allergies"
                        value={formData?.allergies}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>
                <div className="dept-page-input-group">
                    {/* <div className="empConUp"> */}
                    <div className="dept-page-icon-wrapper">
                        <VenusAndMars size={20} strokeWidth={1.5} />
                    </div>
                    <label>Chronic Conditions</label>
                    {/* </div> */}
                    <input
                        type="text"
                        name="chronic_condition"
                        value={formData?.chronic_condition}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>
                <div className="dept-page-input-group">
                    {/* <div className="empConUp"> */}
                    <div className="dept-page-icon-wrapper">
                        <Pill size={20} strokeWidth={1.5} />
                    </div>
                    <label>Current Mdications</label>
                    {/* </div> */}
                    <input
                        type="text"
                        name="current_medications"
                        value={formData?.current_medications}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>

                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"  >
                        <Calendar size={20} strokeWidth={1.25} />
                    </div>
                    <label >Last Health Checkup Date</label>

                    <FormDatePicker
                        label="Last Health Checkup Date"
                        onDateChange={handleDateChange}
                        initialDate={formData?.last_checkup_date}
                        type="last_checkup_date"
                        disabled={isDetailView}
                        toDate={formData?.next_checkup_date}
                    />
                </div>
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"  >
                        <Calendar size={20} strokeWidth={1.25} />
                    </div>
                    <label >Next Health Checkup Date</label>
                    <FormDatePicker
                        label="Next Health Checkup Date"
                        onDateChange={handleDateChange}
                        initialDate={formData?.next_checkup_date}
                        type="next_checkup_date"
                        disabled={isDetailView}
                        fromDate={formData?.last_checkup_date}
                    />
                </div>
                <div className="dept-page-input-group">
                    {/* <div className="empConUp"> */}
                    <div className="dept-page-icon-wrapper">
                        <ScanHeart size={20} strokeWidth={1.5} />
                    </div>
                    <label className={!isDetailView && "redCol"}>Covid Affected{!isDetailView && <span>*</span>}</label>
                    {/* </div> */}
                    <SelectDropdown
                        ref={covid_affected_ref}
                        selectedValue={formData?.covid_affected}
                        options={covidAffectedOptions}
                        onSelect={handleSelect}
                        type="covid_affected"
                        disabled={isDetailView}
                        selectedName={covidAffectedOptions?.find(item => item?.label == formData?.covid_affected)?.label || ""}
                    />
                </div>
                <div className="dept-page-input-group">
                    {/* <div className="empConUp"> */}
                    <div className="dept-page-icon-wrapper">
                        <Syringe size={20} strokeWidth={1.5} />
                    </div>
                    <label className={!isDetailView && "redCol"}>Covid vaccination status{!isDetailView && <span>*</span>}</label>
                    {/* </div> */}
                    <SelectDropdown
                        ref={covid_status_ref}
                        selectedValue={formData?.covid_status}
                        options={covid_vaccination_options}
                        onSelect={handleSelect}
                        type="covid_status"
                        disabled={isDetailView}
                        selectedName={covid_vaccination_options?.find(item => item?.id == formData?.covid_status)?.label || ""}
                    />
                </div>
                <div className="dept-page-input-group full-width">
                    <div className="dept-page-icon-wrapper">
                        <Proportions size={20} strokeWidth={1.5} />
                    </div>
                    <label>Notes</label>
                    <TextAreaWithLimit
                        name="notes"
                        value={formData?.notes}
                        formsValues={{ handleChange: handleChange, form: formData }}
                        disabled={isDetailView}
                    />
                </div>
                <div className="dept-page-input-group attachment_form dept _uplod document-container">
                    {/* <div className="empConUp"> */}
                        <div className="dept-page-icon-wrapper">
                            <ContactRound size={20} strokeWidth={1.5} />
                        </div>
                        <label className="">
                        Vaccination Certificate
                        </label>
                    {/* </div> */}
                    <UploadFile
                        formData={formData}
                        setFormData={setFormData}
                        fieldName="attachment"
                        multiple={false}
                        isDetailView={isDetailView}
                    />
                </div>
                {/* </div> */}
            </div>

            {(viewMode === "add" || viewMode === "edit") && (
                <SaveBtn
                    handleSubmit={handleSaveOrUpdate}
                    viewMode={viewMode}
                    loading={createUpdateEmpHealth?.loading}
                    color="#fff"
                />
            )}
        </>
    );
};

export default EmpHealthForm;