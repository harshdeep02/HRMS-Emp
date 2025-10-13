// BasicInformation.js (Corrected Code)

import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    Users, Building2,
    Mail, Phone, MapPin, FolderPen, Contact,
    Link,
    Crosshair,
    MapPinned,
    Calendar1
} from 'lucide-react';

// Make sure this path is correct in your project
// import './BasicInformation.scss'; 

// Step 1: Import the SelectDropdown component
import bannerImg from '../../../../assets/LoginMobile.svg';
import { UserProfileImageUpload } from '../../../../utils/common/UserProfileImageUpload/UserProfileImageUpload';
import StatusDropdown from '../../../../utils/common/StatusDropdown/StatusDropdown';
import SelectDropdown from '../../../../utils/common/SelectDropdown/SelectDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { handleFormError, showMasterData } from '../../../../utils/helper';
import SaveBtn from '../../../../utils/common/SaveBtn';
import { getCityList, getStateList } from '../../../../Redux/Actions/locationActions';
import { updateOrgStatus, createNewOrganization, getOrganizationDetails } from '../../../../Redux/Actions/Settings/organizationActions';
import { organizationStatusOptions } from '../../../../utils/Constant';
import Loader from '../../../../utils/common/Loader/Loader';
import SelectDropdownMultiple from '../../../../utils/common/SelectDropdownMultiple/SelectDropdownMultiple';
import ConfirmPopup from "../../../../utils/common/ConfirmPopup.jsx";



const BasicInformation = ({ viewMode, setViewMode }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { id } = useParams();
    const [formData, setFormData] = useState({
        company_logo: '',
        organisation_name: '',
        email: '',
        contactPerson: '',
        mobile_no: '',
        // organization: '',
        organization_type: '',
        no_of_employees: '',
        weekly_off: '',
        website_url: '',
        street1: '',
        street2: '',
        country_id: '',
        state_id: '',
        city_id: '',
        zipcode: '',
        status: 1
    });

    //Redux
    const updateStatus = useSelector((state) => state?.organizationStatus);
    const createUpdateOrg = useSelector((state) => state?.createOrganization);
    const organizationDetailData = useSelector((state) => state?.organizationDetail);
    const organizationDetail = organizationDetailData?.data?.data || {};

    const countryData = useSelector((state) => state?.countryList);
    const countryLists = countryData?.data?.country || [];

    const stateData = useSelector((state) => state?.stateList);
    const stateLists = stateData?.data?.country || [];

    const cityData = useSelector((state) => state?.cityList);
    const cityLists = cityData?.data?.country || [];

    const organizationType_options = showMasterData("23");

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

    const organisation_name_ref = useRef(null);
    const email_ref = useRef(null);

    const [errors, setErrors] = useState({
        organisation_name: false,
        email: false
    });

    const basicRequiredFields = [
        {
            key: "organisation_name",
            label: "Please Fill Organisation Name",
            required: true,
            ref: organisation_name_ref,
        },
        {
            key: "email",
            label: "Please Fill Email",
            required: true,
            ref: email_ref,
        }
    ];

    const handleEditClick = () => {
        navigate(`/settings/edit-organization-details/${id}`);
    };

    const fetchState = (search = "", id = "") => {
        const sendData = {
            country_id: id
        };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getStateList(sendData));
    };

    const fetchCity = (search = "", id = "") => {
        const sendData = {
            state_id: id,
        };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getCityList(sendData));
    };

    useEffect(() => {
        if (id && organizationDetail?.id != id) {
            dispatch(getOrganizationDetails({ id }));
        }
    }, [id]);
    useEffect(() => {
        if (id && organizationDetail?.id == id) {
            setFormData((prev) => ({
                ...prev,
                company_logo: organizationDetail?.company_logo?.length > 0 ? JSON.parse(organizationDetail?.company_logo) : '',
                organisation_name: organizationDetail?.organisation_name || "",
                email: organizationDetail?.email || "",
                contactPerson: organizationDetail?.contactPerson || "",
                mobile_no: organizationDetail?.mobile_no || "",
                organization_type: organizationDetail?.organization_type || "",
                no_of_employees: organizationDetail?.no_of_employees || "",
                weekly_off: organizationDetail?.weekly_off?.length > 0 ? JSON.parse(organizationDetail?.weekly_off) : '',
                website_url: organizationDetail?.website_url || "",
                street1: organizationDetail?.street1 || "",
                street2: organizationDetail?.street2 || "",
                country_id: organizationDetail?.country_id || "",
                state_id: organizationDetail?.state_id || "",
                city_id: organizationDetail?.city_id || "",
                zipcode: organizationDetail?.zipcode || "",
                status: organizationDetail?.status || 1
            }));

            if (organizationDetail?.country_id) fetchState("", organizationDetail?.country_id)
            if (organizationDetail?.state_id) fetchCity("", organizationDetail?.state_id)
        }
    }, [id, organizationDetail]);

    const handleSelect = (name, item) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: item?.id,
        }));
        if (name === "country_id") fetchState("", item?.id);
        if (name === "state_id") fetchCity("", item?.id);
        setErrors((prev) => ({
            ...prev,
            [name]: false,
        }));
    };

    const validateForm = () => {
        for (let field of basicRequiredFields) {
            const value = formData[field.key];
            if (
                field.required &&
                (!value || (typeof value === "string" && !value.trim()))
            ) {
                setErrors((prev) => ({ ...prev, [field.key]: field.label }));
                toast.error(field?.label);
                handleFormError(field?.ref);
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
            organization_type: viewMode === "edit" ? organizationDetail?.organization_type : formData?.organization_type,
            company_logo: formData?.company_logo?.length > 0 ? JSON.stringify(formData?.company_logo) : "",
            weekly_off: formData?.weekly_off?.length > 0 ? JSON.stringify(formData?.weekly_off) : '',
        };
        if (viewMode === "edit") {
            formDataToSubmit["id"] = id;
        }
        try {
            const res = await dispatch(createNewOrganization(formDataToSubmit))
            if (res?.success) {
                navigate(id ? `/settings/organization-details/${id}` : `/settings/all-organization-list`);
                if (id) dispatch(getOrganizationDetails({ id }))
            }
        }
        catch (error) {
            console.log("error-", error);
        };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const renderHeader = () => {
        switch (viewMode) {
            case 'add': return 'Add New Organization';
            // case 'edit': return 'Edit Organization Details';
            default: return;
        }
    };
    const renderMark = () => {
        switch (viewMode) {
            case 'add': return 'Fill The Information';
            case 'edit': return 'Edit The Information';
            default: return 'Provided Details!';
        }
    };

    //update status in list
    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const handleUpdateStatus = () => {
        const sendData = {
            organisation_id: id,
            status: selectedStatus,
        };
        dispatch(updateOrgStatus(sendData))
            .then((res) => {
                if (res?.success) {
                    setShowModal(false);
                    setFormData((prevData) => ({
                        ...prevData,
                        status: selectedStatus,
                    }));
                    dispatch(getOrganizationDetails({ id }));
                }
            })
            .catch((error) => {
                setShowModal(false);
                console.log("error-", error);
            });
    };

    const handleStatus = (val) => {
        if (viewMode === "add") {
            setFormData((prevData) => ({
                ...prevData,
                status: val,
            }));
        }
        else {
            setShowModal(true);
            setSelectedStatus(val);
        }
    };

    if (organizationDetailData?.loading)
        return (
            <div className="loading-state">
                <Loader />
            </div>
        );
    const isDetailView = viewMode === "detail";

    const handleWeeklyOffChange = (selectedWeekly_off) => {
        setFormData((prev) => ({ ...prev, weekly_off: selectedWeekly_off }));
    };
    const WeekOptions = [
        { id: 0, label: "SUNDAY" },
        { id: 1, label: "MONDAY" },
        { id: 2, label: "TUESDAY" },
        { id: 3, label: "WEDNESDAY" },
        { id: 4, label: "THURSDAY" },
        { id: 5, label: "FRIDAY" },
        { id: 6, label: "SATURDAY" }
    ]

    return (
        <div className="dept-page-container org_page_container">
            <ConfirmPopup
                open={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleUpdateStatus}
                type="update"
                module="Status"
                loading={updateStatus?.loading}
            />
            {/* <h2 className="dept-page-main-heading" style={viewMode === 'add'?{marginBottom:"10"}:{marginBottom:"0px"}}>{renderHeader()}</h2> */}
            <div className={`dept-page-content-wrapper ${viewMode === 'detail' ? 'detail-mode' : ''}`}>

                {/* Left Panel */}
                {viewMode !== 'detail' && viewMode !== 'edit' && (
                    <div className="dept-page-left-panel">
                        <h3 className="dept-page-mark-text">{renderMark()}</h3>
                        <p className="dept-page-info-text">Manage your organization's information seamlessly.</p>
                        <div className="dept-page-illustration-box">
                            <img className=' ' src={bannerImg} alt="Illustration" />
                        </div>
                    </div>
                )}

                {/* Right Panel */}
                <div className="dept-page-right-panel seeting _form_1">
                    <div className="dept-page-cover-section  dept-page-cover-section_2 custom-header">
                        <div className="profile-avatar-wrapper">
                            <UserProfileImageUpload
                                formData={formData}
                                setFormData={setFormData}
                                fieldName="company_logo"
                                isEditMode={viewMode === 'edit' || viewMode === 'add'}
                            />
                        </div>
                        <StatusDropdown
                            options={organizationStatusOptions
                                ?.filter((item) => item?.label !== "All")
                                ?.map((item) => ({
                                    value: item?.id,
                                    label: item?.label,
                                    icon: item?.icon,
                                }))}
                            defaultValue={formData?.status}
                            onChange={(val) => handleStatus(val)}
                            viewMode={viewMode !== "detail"}
                        />
                    </div>

                    {viewMode === 'detail' && (
                        <button className="dept-page-edit-btn" onClick={handleEditClick}>
                            {/* <Edit size={16} /> */}
                            Edit
                        </button>
                    )}

                    {/* Basic Information Section */}
                    <div className="dept-page-basic-info-section" style={{ marginTop: '0px' }}>
                        <h3>Basic Information</h3>
                        <p className="dept-page-subtitle">{viewMode !== "detail" ? "Please Provide" : ''} Organization Basic Details Below.</p>

                        <div className="info-grid-layout">
                            {/* Simple text inputs */}
                            <InputGroup icon={<FolderPen size={20} />} label="Organization Name" ref={organisation_name_ref} name="organisation_name" value={formData?.organisation_name} onChange={handleChange} disabled={isDetailView} required={!isDetailView ? <span>*</span> : ''} requiredClass={!isDetailView ? "color_red" : ""} />

                            <InputGroup icon={<Mail size={20} />} label="Email Address" ref={email_ref} name="email" value={formData?.email} onChange={handleChange} disabled={isDetailView} required={!isDetailView ? <span>*</span> : ''} requiredClass={!isDetailView ? "color_red" : ""} />

                            <InputGroup icon={<Contact size={20} />} label="Contact Person" name="contactPerson" value={formData?.contactPerson} onChange={handleChange} disabled={isDetailView} />

                            <InputGroup icon={<Phone size={20} />} label="Contact Number" name="mobile_no" value={formData?.mobile_no} onChange={handleChange} disabled={isDetailView} />

                            {/* Step 4: Replace InputGroup with SelectDropdown for Organization Type */}
                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"><Building2 size={20} /></div>
                                <label>Organization Type</label>
                                <SelectDropdown
                                    selectedValue={formData?.organization_type}
                                    options={organizationType_options}
                                    onSelect={handleSelect}
                                    type="organization_type"
                                    // searchPlaceholder="Search Type..."
                                    disabled={isDetailView}
                                    showSearchBar={true}
                                    searchMode={"local"}
                                    selectedName={organizationType_options?.find(item => item?.id == formData?.organization_type)?.label || ""}
                                />
                            </div>

                            <InputGroup icon={<Users size={20} />} label="No. Of Employees" name="no_of_employees" value={formData.no_of_employees} onChange={handleChange} disabled={isDetailView} />
                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper">
                                    <Calendar1 size={20} strokeWidth={1.5} />
                                </div>
                                <label>Weekly Off</label>
                                <SelectDropdownMultiple
                                    selectedValue={formData?.weekly_off}
                                    options={WeekOptions}
                                    onSelect={handleWeeklyOffChange}
                                    disabled={isDetailView}
                                    multiple={true}
                                    type="weekly_off"
                                    needLabel={true}
                                />
                            </div>
                            <InputGroup icon={<Link size={20} />} label="Website URL" name="website_url" value={formData?.website_url} onChange={handleChange} disabled={isDetailView} />
                        </div>
                    </div>

                    {/* Primary Address Section */}
                    <div className="dept-page-basic-info-section">
                        <h3>Primary Address</h3>
                        <p className="dept-page-subtitle">{viewMode !== "detail" ? "Please Provide" : ''} Organization's Address Details Below.</p>
                        <div className="info-grid-layout">
                            <InputGroup icon={<FolderPen size={20} />} label="Street 1" name="street1" value={formData.street1} onChange={handleChange} disabled={isDetailView} />
                            <InputGroup icon={<FolderPen size={20} />} label="Street 2" name="street2" value={formData.street2} onChange={handleChange} disabled={isDetailView} />

                            {/* Step 4: Replace InputGroup with SelectDropdown for Country */}
                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"><MapPin size={20} /></div>
                                <label>Country/Region</label>
                                <SelectDropdown
                                    selectedValue={formData?.country_id}
                                    options={countryOptions}
                                    onSelect={(name, value) => handleSelect(name, value)}
                                    searchPlaceholder="Search Country"
                                    type="country_id"
                                    loading={countryData?.loading}
                                    showSearchBar={true}
                                    disabled={isDetailView}
                                    searchMode="local"
                                />
                            </div>

                            {/* Step 4: Replace InputGroup with SelectDropdown for State */}
                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"><MapPin size={20} /></div>
                                <label>State</label>
                                <SelectDropdown
                                    selectedValue={formData?.state_id}
                                    options={stateOptions}
                                    onSelect={(name, value) => handleSelect(name, value)}
                                    searchPlaceholder="Search state"
                                    type="state_id"
                                    loading={stateData?.loading}
                                    showSearchBar={true}
                                    disabled={isDetailView}
                                    searchMode="local"
                                />
                            </div>
                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"><Crosshair size={20} /></div>
                                <label>City</label>
                                <SelectDropdown
                                    selectedValue={formData?.city_id}
                                    options={cityOptions}
                                    onSelect={(name, value) => handleSelect(name, value)}
                                    searchPlaceholder="Search City"
                                    type="city_id"
                                    loading={cityData?.loading}
                                    showSearchBar={true}
                                    disabled={isDetailView}
                                    searchMode="local"
                                />
                            </div>

                            <InputGroup icon={<MapPinned size={20} />} label="Pin Code" name="zipcode" value={formData.zipcode} onChange={handleChange} disabled={isDetailView} />
                        </div>
                    </div>
                    {/* Save/Update Button */}
                    {!isDetailView && (
                        <SaveBtn
                            handleSubmit={handleSaveOrUpdate}
                            viewMode={viewMode}
                            loading={createUpdateOrg?.loading}
                            color='#fff' />
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper component for inputs to keep the JSX clean
const InputGroup = ({ icon, label, ref, required, requiredClass, ...props }) => (
    <div className="dept-page-input-group">
        <div className="dept-page-icon-wrapper">{icon}</div>
        <label className={requiredClass && requiredClass}>{label}{required}</label>
        <input type="text" {...props} />
    </div>
);

export default BasicInformation;