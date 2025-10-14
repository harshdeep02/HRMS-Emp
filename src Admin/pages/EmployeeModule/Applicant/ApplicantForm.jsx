import {
    Briefcase,
    Calendar,
    DollarSign,
    FileText,
    Globe,
    Mail,
    MapPin,
    Paperclip,
    Phone,
    User
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useRef, useState } from 'react';
import { toast } from "react-toastify";
import { handleFormError, showMasterData } from "../../../utils/helper.js";
import { useNavigate, useParams } from 'react-router-dom';
import SaveBtn from '../../../utils/common/SaveBtn.jsx';
import SelectDropdown from '../../../utils/common/SelectDropdown/SelectDropdown.jsx';
import { createNewApplicant, getApplicantDetails } from '../../../Redux/Actions/applicantActions.js';
import FormDatePicker from '../../../utils/common/FormDatePicker.jsx';
import TextAreaWithLimit from '../../../utils/common/TextAreaWithLimit.jsx';
import { UploadFile } from '../../../utils/common/UploadFile/UploadFile.jsx';
import { AddMasterValuePopup } from '../../Master/AddMasterValuePopup.jsx';

const ApplicantForm = ({ viewMode, formData, setFormData, handleSearch, handleState, handleCity }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    //Data from redux
    const createUpdateApplicant = useSelector((state) => state?.createApplicant);
    const applicantDetails = useSelector((state) => state?.applicantDetails);
    const applicantDetail = applicantDetails?.data?.result;

    const jobData = useSelector((state) => state?.jobList);
    const jobList = jobData?.data?.job_opening || [];

    const countryData = useSelector((state) => state?.countryList);
    const countryLists = countryData?.data?.country || [];

    const stateData = useSelector((state) => state?.stateList);
    const stateLists = stateData?.data?.country || [];

    const cityData = useSelector((state) => state?.cityList);
    const cityLists = cityData?.data?.country || [];

    const source_options = showMasterData("16");
    const expected_salary_options = showMasterData("17");

    const jobOpeningOptions = useMemo(
        () => jobList?.map(item => ({ id: item?.id, label: item?.job_title })),
        [jobList]
    );

    const countryOptions = useMemo(
        () => countryLists?.map(item => ({ id: item?.id, label: item?.name })),
        [countryLists]
    );

    const stateOptions = useMemo(
        () => stateLists?.map(item => ({ id: item?.id, label: item?.name })),
        [stateLists]
    );

    const cityOptions = useMemo(
        () => cityLists?.map(item => ({ id: item?.id, label: item?.name })),
        [cityLists]
    );

    const first_name_ref = useRef(null);
    const last_name_ref = useRef(null);
    const email_ref = useRef(null);

    const [errors, setErrors] = useState({
        first_name: false,
        last_name: false,
        email: false
    });

    const basicRequiredFields = [
        {
            key: "first_name",
            label: "Please fill First Name",
            required: true,
            ref: first_name_ref,
        },
        {
            key: "last_name",
            label: "Please fill Last Name",
            required: true,
            ref: last_name_ref,
        },
        {
            key: "email",
            label: "Please fill Email",
            required: true,
            ref: email_ref,
        }
    ];

    const [documentUpload, setDocumentUpload] = useState(false);
    console.log("documentUpload",documentUpload);

    const handleDateChange = (type, date) => {
        setFormData((prev) => ({ ...prev, [type]: date }));
    };

    const handleSelect = (name, item) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: item?.id,
        }));
        if (name === "country_id") handleState("", item?.id);
        if (name === "state_id") handleCity("", item?.id);
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

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple email validation
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
            // Extra check: Email format validation
            if (field.key === "email" && !emailRegex.test(value)) {
                setErrors((prev) => ({ ...prev, [field.key]: "Please fill valid Email" }));
                toast.error("Please fill valid Email");
                handleFormError(field.ref);
                return false;
            }
        }
        return true;
    };

    const handleSaveOrUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSubmit = {
            ...formData,
            user_image: formData?.user_image ? JSON.stringify(formData?.user_image) : "",
            resume: formData?.resume ? JSON.stringify(formData?.resume) : "",
            other_document: formData?.other_document ? JSON.stringify(formData?.other_document) : "",
        };
        if (viewMode === "edit") {
            formDataToSubmit["id"] = id;
        }
        dispatch(createNewApplicant(formDataToSubmit))
            .then((res) => {
                if (res?.status === 200) {
                    navigate(id ? `/applicant-details/${id}` : `/applicant-list`);
                    if (id) dispatch(getApplicantDetails({ id }))
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
            {showMasterPopUp && <AddMasterValuePopup field={masterValue?.label} id={masterValue?.id} setShowMasterPopUp={setShowMasterPopUp} />}
            <div className={`dept-page-basic-info-section ${viewMode === "edit" ? "isEditPage" : ""}`}>
                <h3 style={{ marginTop: "10px" }}>Basic Information</h3>
                <p className="dept-page-subtitle">Basic profile overview</p>
                <div className="form-grid-layout">
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <User size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}>First Name{!isDetailView ? <span>*</span> : ''}</label>
                        <input
                            ref={first_name_ref}
                            type="text"
                            name="first_name"
                            value={formData?.first_name}
                            onChange={handleChange}
                            disabled={isDetailView}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <User size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}>Last Name{!isDetailView ? <span>*</span> : ''}</label>
                        <input
                            ref={last_name_ref}
                            type="text"
                            name="last_name"
                            value={formData?.last_name}
                            onChange={handleChange}
                            disabled={isDetailView}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <Mail size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}>Email ID{!isDetailView ? <span>*</span> : ''}</label>
                        <input
                            ref={email_ref}
                            type="email"
                            name="email"
                            value={formData?.email}
                            onChange={handleChange}
                            disabled={isDetailView}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <Phone size={20} strokeWidth={1.5} />
                        </div>
                        <label>Contact Number</label>
                        <input
                            type="tel"
                            name="mobile_no"
                            value={formData?.mobile_no}
                            onChange={handleChange}
                            disabled={isDetailView}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <Globe size={20} strokeWidth={1.5} />
                        </div>
                        <label>Country/Region</label>
                        <SelectDropdown
                            selectedValue={formData?.country_id}
                            options={countryOptions}
                            // placeholder="Select Country"
                            onSelect={(name, value) => handleSelect(name, value)}
                            searchPlaceholder="Search Country"
                            // handleSearch={(value, name) => handleSearch(value, name)}
                            type="country_id"
                            loading={countryData?.loading}
                            showSearchBar={true}
                            // selectedName={formData?.country_name}
                            disabled={isDetailView}
                            searchMode="local"
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <MapPin size={20} strokeWidth={1.5} />
                        </div>
                        <label>State</label>
                        <SelectDropdown
                            selectedValue={formData?.state_id}
                            options={stateOptions}
                            // placeholder="Select State"
                            onSelect={(name, value) => handleSelect(name, value)}
                            searchPlaceholder="Search state"
                            // handleSearch={(value, name) => handleSearch(value, name, formData?.contacts[0]?.country_id)}
                            type="state_id"
                            loading={stateData?.loading}
                            showSearchBar={true}
                            // selectedName={formData?.state_name}
                            disabled={isDetailView}
                            searchMode="local"
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <MapPin size={20} strokeWidth={1.5} />
                        </div>
                        <label>City</label>
                        <SelectDropdown
                            selectedValue={formData?.city_id}
                            options={cityOptions}
                            // placeholder="Select City"
                            onSelect={(name, value) => handleSelect(name, value)}
                            searchPlaceholder="Search City"
                            // handleSearch={(value, name) => handleSearch(value, name, formData?.contacts[0]?.state_id)}
                            type="city_id"
                            loading={cityData?.loading}
                            showSearchBar={true}
                            // selectedName={formData?.city_name}
                            disabled={isDetailView}
                            searchMode="local"
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <MapPin size={20} strokeWidth={1.5} />
                        </div>
                        <label>Pin Code</label>
                        <input
                            type="text"
                            name="pin_code"
                            value={formData?.pin_code}
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
                    Essential organization information
                </p>
                <div className="form-grid-layout">
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <Briefcase size={20} strokeWidth={1.5} />
                        </div>
                        <label>Job Opening</label>
                        <SelectDropdown
                            selectedValue={formData?.job_opening_id}
                            options={jobOpeningOptions}
                            onSelect={handleSelect}
                            searchPlaceholder="Search Job Opening"
                            handleSearch={handleSearch}
                            type="job_opening_id"
                            loading={jobData?.loading}
                            showSearchBar={true}
                            disabled={isDetailView}
                            selectedName={formData?.job_title ?? ""}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <User size={20} strokeWidth={1.5} />
                        </div>
                        <label>Source</label>
                        <SelectDropdown
                            selectedValue={formData?.source}
                            options={source_options}
                            // placeholder="Select Source"
                            onSelect={handleSelect}
                            type="source"
                            disabled={isDetailView}
                            selectedName={source_options?.find(item => item?.id == formData?.source)?.label || ""}
                            showAddButton={true}
                            onAddClick={() => handleAddMasterValue(16, "Source")}
                            addBtnText="New Source"
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <DollarSign size={20} strokeWidth={1.5} />
                        </div>
                        <label>Expected Salary</label>
                        <SelectDropdown
                            selectedValue={formData?.expected_salary}
                            options={expected_salary_options}
                            // placeholder="Select Expected Salary"
                            onSelect={handleSelect}
                            type="expected_salary"
                            disabled={isDetailView}
                            selectedName={expected_salary_options?.find(item => item?.id == formData?.expected_salary)?.label || ""}
                            showAddButton={true}
                            onAddClick={() => handleAddMasterValue(17, "Expected Salary")}
                            addBtnText="New"
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"  >
                            <Calendar size={20} strokeWidth={1.25} />
                        </div>
                        <label >Availability Date</label>
                        <FormDatePicker
                            label="Availability Date"
                            onDateChange={handleDateChange}
                            initialDate={formData?.availability_date}
                            type="availability_date"
                            disabled={isDetailView}
                        />
                    </div>
                    <div className="dept-page-input-group full-width">
                        <div className="dept-page-icon-wrapper">
                            <FileText size={20} strokeWidth={1.5} />
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
            <hr className="hr_line" />

            <div className="dept-page-basic-info-section">
                <h3>Documents</h3>
                <p className="dept-page-subtitle">
                    Essential organization information
                </p>
                <div className="form-grid-layout">
                    <div className="dept-page-input-group dept_uplod document-container">
                        <div className="label-with-icon">
                            <FileText size={20} strokeWidth={1.5} />
                        </div>
                        <label>Resume</label>
                        <UploadFile
                            formData={formData}
                            setFormData={setFormData}
                            fieldName="resume"
                            multiple={false}
                            isDetailView={isDetailView}
                            setDocumentUpload={setDocumentUpload}
                        />
                    </div>
                    <div className="dept-page-input-group dept_uplod document-container">
                        <div className="label-with-icon">
                            <Paperclip size={20} strokeWidth={1.5} />
                        </div>
                        <label>Other Documents</label>
                        <UploadFile
                            formData={formData}
                            setFormData={setFormData}
                            fieldName="other_document"
                            multiple={true}
                            isDetailView={isDetailView}
                            setDocumentUpload={setDocumentUpload}
                        />
                    </div>
                </div>
            </div>

            {!isDetailView && (
                <SaveBtn handleSubmit={handleSaveOrUpdate} viewMode={viewMode} loading={createUpdateApplicant?.loading} isDisabled={documentUpload} color='#fff' />
            )}
        </>
    );
};

export default ApplicantForm;