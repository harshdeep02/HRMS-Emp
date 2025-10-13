import {
    User,
    Mail,
    Briefcase,
    Users,
    Building,
    Phone,
    Globe,
    MapPin,
    FileText,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRef, useState } from 'react';
import SaveBtn from '../../../../utils/common/SaveBtn.jsx'; // Make sure path is correct
import { handleFormError } from "../../../../utils/helper.js"; // Make sure path is correct
import SelectDropdown from '../../../../utils/common/SelectDropdown/SelectDropdown.jsx'; // Use your custom dropdown
import StatusDropdown from '../../../../utils/common/StatusDropdown/StatusDropdown.jsx'; // Use your custom dropdown
import { UserProfileImageUpload } from '../../../../utils/common/UserProfileImageUpload/UserProfileImageUpload.jsx'; // Make sure path is correct
import { clientStatusOptions, genderOptions } from '../../../../utils/Constant.js';
import TextAreaWithLimit from '../../../../utils/common/TextAreaWithLimit.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { createNewClient, getClientDetails } from '../../../../Redux/Actions/clientActions.js';

const ClientForm = ({ viewMode, formData, setFormData }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [errors, setErrors] = useState({});

    //Data from redux
    const createUpdateClient = useSelector((state) => state?.createClient);

    const isAddOrEdit = viewMode === 'add' || viewMode === 'edit';
    const isDetailView = viewMode === "detail";

    // Refs for focusing on error fields
    const clientNameRef = useRef(null);
    const emailRef = useRef(null);
    const designationRef = useRef(null);

    // Required fields validation
    const requiredFields = [
        { key: "client_name", label: "Please fill Client Name", ref: clientNameRef },
        { key: "email", label: "Please fill Email ID", ref: emailRef },
        { key: "designation", label: "Please fill Designation", ref: designationRef },
    ];

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple email validation
        for (let field of requiredFields) {
            const value = formData[field.key]?.trim();
            // Empty check
            if (!value) {
                setErrors((prev) => ({ ...prev, [field.key]: true }));
                toast.error(field.label);
                handleFormError(field.ref);
                return false;
            }
            // Extra check: Email format validation
            if (field.key === "email" && !emailRegex.test(value)) {
                setErrors((prev) => ({ ...prev, [field.key]: true }));
                toast.error("Please fill valid Email");
                handleFormError(field.ref);
                return false;
            }
        }
        return true;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: false }));
    };

    const handleSelect = (name, item) => {
        setFormData((prevData) => {
            let updates = {};
            if (name === "gender") {
                updates = { [name]: item?.label };
            } else {
                updates = { [name]: item?.id };
            }
            return { ...prevData, ...updates };
        });

        setErrors((prev) => ({ ...prev, [name]: false }));
    };

    const handleStatus = (val) => {
        setFormData(prevData => ({ ...prevData, status: val }));
    };

    const handleSaveOrUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSubmit = {
            ...formData,
        };
        if (viewMode === "edit") {
            formDataToSubmit["id"] = id;
        }
        dispatch(createNewClient(formDataToSubmit))
            .then((res) => {
                if (res?.status === 200) {
                    navigate(id ? `/client-details/${id}` : `/client-list`);
                    if (id) dispatch(getClientDetails({ id }));
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });
    };

    return (
        <>
            <div className="dept-page-cover-section dept-page-cover-section_2">
                <div className="profile_pic_head">
                    <UserProfileImageUpload
                        formData={formData}
                        setFormData={setFormData}
                        fieldName="client_image"
                        isEditMode={isAddOrEdit}
                    />
                </div>

                {/* {!isDetailView ? */}
                <StatusDropdown
                    options={clientStatusOptions?.filter((item) => item?.label !== "All")?.map((item) => ({
                        value: item?.id,
                        label: item?.label,
                        icon: item?.icon,

                    }))}
                    defaultValue={formData?.status}
                    onChange={(val) => handleStatus(val)}
                    viewMode={viewMode === "edit"}
                />
                {/* // :
                    // <div className="status-dropdown">
                    //     <div className={`status-label dropdown-trigger Active`}>
                    //         {clientStatusOptions?.filter((item) => item?.id === formData?.status)?.label}
                    //     </div>
                    // </div>
                } */}
            </div>

            <div className={`dept-page-basic-info-section ${viewMode === "edit" ? "isEditPage" : ""}`}>
                <h3>Basic Information</h3>
                <p className="dept-page-subtitle">{viewMode !== "detail" ? "Please Provide" : ''} Client Basic Details Below.</p>

                {/* Client Name */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><User size={20} strokeWidth={1.5} /></div>
                    <label className={!isDetailView ? "color_red" : ""}>Client Name{!isDetailView ? <span>*</span> : ''}</label>
                    <input ref={clientNameRef}
                        type="text"
                        name="client_name"
                        value={formData?.client_name}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>

                {/* Email ID */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Mail size={20} strokeWidth={1.5} /></div>
                    <label className={!isDetailView ? "color_red" : ""}>Email ID{!isDetailView ? <span>*</span> : ''}</label>
                    <input
                        ref={emailRef}
                        type="email"
                        name="email"
                        value={formData?.email}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>

                {/* Designation */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Briefcase size={20} strokeWidth={1.5} /></div>
                    <label className={!isDetailView ? "color_red" : ""}>Designation{!isDetailView ? <span>*</span> : ''}</label>
                    <input
                        ref={designationRef}
                        type="text"
                        name="designation"
                        value={formData?.designation}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>

                {/* Gender */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Users size={20} strokeWidth={1.5} /></div>
                    <label>Gender</label>
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

                {/* Company Name */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Building size={20} strokeWidth={1.5} /></div>
                    <label>Company Name</label>
                    <input
                        type="text"
                        name="company_name"
                        value={formData?.company_name}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>

                {/* Client Phone Number */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Phone size={20} strokeWidth={1.5} /></div>
                    <label>Client Phone Number</label>
                    <input
                        type="tel"
                        name="mobile_no"
                        value={formData?.mobile_no}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>

                {/* Website */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Globe size={20} strokeWidth={1.5} /></div>
                    <label>Website</label>
                    <input
                        type="text"
                        name="website"
                        value={formData?.website}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>

                {/* Company Phone Number */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Phone size={20} strokeWidth={1.5} /></div>
                    <label>Company Phone Number</label>
                    <input
                        type="tel"
                        name="company_contact_no"
                        value={formData?.company_contact_no}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>

                {/* Client Address */}
                <div className="dept-page-input-group attachment_form" >
                    <div className="dept-page-icon-wrapper"><MapPin size={20} strokeWidth={1.5} /></div>
                    <label>Client Address</label>
                    <textarea
                        name="client_address"
                        value={formData?.client_address}
                        onChange={handleChange}
                        disabled={isDetailView}>
                    </textarea>
                </div>

                {/* Secondary Contact No. */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Phone size={20} strokeWidth={1.5} /></div>
                    <label>Secondary Contact Number</label>
                    <input
                        type="tel"
                        name="secondary_contact_no"
                        value={formData?.secondary_contact_no}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>

                {/* Description */}
                <div className="dept-page-input-group attachment_form">
                    <div className="dept-page-icon-wrapper"><FileText size={20} strokeWidth={1.5} /></div>
                    <label>Description</label>
                    <TextAreaWithLimit
                        name="description"
                        value={formData?.description}
                        formsValues={{ handleChange: handleChange, form: formData }}
                        disabled={isDetailView}
                    />
                </div>
            </div>

            {isAddOrEdit && (
                <SaveBtn
                    handleSubmit={handleSaveOrUpdate}
                    viewMode={viewMode}
                    loading={createUpdateClient?.loading}
                    color="#fff"
                />
            )}
        </>
    );
};

export default ClientForm;