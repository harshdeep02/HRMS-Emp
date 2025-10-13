import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    PencilLine, Users, Building2 as OrganizationTypeIcon, User as UserIcon,
    Mail, UserCheck, Phone, Globe, MapPin, Edit
} from 'lucide-react';

// Make sure this path is correct in your project
// You can copy the styles from DepartmentDetail.scss into this file
// import './BasicInformation.scss'; 

// This is a dummy image path, replace it with your actual path
import bannerImg from '../../../../assets/detail_man.png';
import { UserProfileImageUpload } from '../../../../utils/common/UserProfileImageUpload/UserProfileImageUpload';
import StatusDropdown from '../../../../utils/common/StatusDropdown/StatusDropdown';
const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Pending", value: "pending" },
    { label: "Draft", value: "draft" },
    { label: "Partially completed", value: "partially-completed" },
];
const BasicInformation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams(); // To get the ID from the URL, e.g., /organization-details/1

    // 1. STATE MANAGEMENT - Just like your DepartmentDetail component
    const [isUploading, setIsUploading] = useState(false);

    const [viewMode, setViewMode] = useState('detail');
    const [formData, setFormData] = useState({
        // Form fields initialized for 'add' mode
        firstName: '', email: '', contactPerson: '', contactNumber: '',
        orgType: '', employees: '', website: '', street1: '', street2: '',
        country: '', state: '', city: '', pincode: ''
    });

    // This is our mock database/API response for a specific organization
    const organizationDetails = {
        id: '1',
        firstName: "Dell.Inc", email: "Dell152@Gmail.Com", contactPerson: "Akash Singh",
        contactNumber: "+91-9764310125", orgType: "Information Technology", employees: "20",
        website: "Dellmccf.Com", street1: "602 Das Colony Road", street2: "Gajanana Nilkayama Sanrth",
        country: "India", state: "Karnataka", city: "Bengalore", pincode: "415002"
    };

    // 2. USEEFFECT - To control the viewMode and pre-fill data
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/add-organization')) {
            setViewMode('add');
            // Clear form for new entry
            setFormData({
                firstName: '', email: '', contactPerson: '', contactNumber: '', orgType: '',
                employees: '', website: '', street1: '', street2: '', country: '',
                state: '', city: '', pincode: ''
            });
        } else if (path.includes('/edit-organization/')) {
            setViewMode('edit');
            // Pre-fill form with existing data for editing
            setFormData(organizationDetails);
        } else {
            setViewMode('detail');
        }
    }, [location.pathname]);

    // 3. HANDLERS - To make the component interactive
    const handleEditClick = () => {
        // Navigate to the edit page for the current organization
        navigate(`/edit-organization/${id}`);
    };

    const handleSaveOrUpdate = () => {
        if (viewMode === 'add') {
            // After saving, navigate to the detail page of the new entry
            // In a real app, you'd get a new ID from the backend
            navigate(`/organization-details/new-id`);
        } else if (viewMode === 'edit') {
            // After updating, navigate back to the detail page
            navigate(`/organization-details/${id}`);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Header text rendering logic from your template
    const renderHeader = () => {
        switch (viewMode) {
            case 'add': return 'Add New Organization';
            case 'edit': return 'Edit Organization Details';
            default: return 'Organization Details';
        }
    };
    const renderMark = () => {
        switch (viewMode) {
            case 'add': return 'Fill The Information';
            case 'edit': return 'Edit The Information';
            default: return 'Provided Details!';
        }
    };

    return (
        <div className="dept-page-container org_page_container">
            <div className={`dept-page-content-wrapper ${viewMode === 'detail' ? 'detail-mode' : ''}`}>
                {viewMode !== 'detail' && viewMode !== 'edit' && (
                    <div className="dept-page-left-panel">
                        <h2 className="dept-page-main-heading">{renderHeader()}</h2>
                        <h3 className="dept-page-mark-text">{renderMark()}</h3>
                        <p className="dept-page-info-text">Manage your organization's information seamlessly.</p>
                        <div className="dept-page-illustration-box">
                            <img className='imgBlackedWhite' src={bannerImg} alt="Illustration" />
                        </div>
                    </div>
                )}


                <div className="dept-page-right-panel org_dept">
                    <div className="dept-page-cover-section custom-header">
                        <div className="profile-avatar-wrapper">
                            <UserProfileImageUpload
                                formData={viewMode === 'detail' ? organizationDetails : formData}
                                setFormData={setFormData}
                                fieldName="image"
                                isUploading={isUploading}
                                setIsUploading={setIsUploading}
                                isEditMode={viewMode === 'edit' || viewMode === 'add'}
                            />
                        </div>
                        <StatusDropdown
                            options={statusOptions}
                            defaultValue="active"
                            onChange={(val) => console.log("Selected:", val)}
                        />
                    </div>

                    {viewMode === 'detail' && (
                        <button className="dept-page-edit-btn" onClick={handleEditClick}>
                            <Edit size={16} /> Edit
                        </button>
                    )}

                    <div className="dept-page-basic-info-section">
                        <h3>Basic Information</h3>
                        <div className="info-grid-layout">
                            {/* Each input is now a controlled component */}
                            <InputGroup icon={<UserIcon size={20} />} label="First Name" name="firstName" value={viewMode === 'detail' ? organizationDetails.firstName : formData.firstName} onChange={handleChange} disabled={viewMode === 'detail'} />
                            <InputGroup icon={<Mail size={20} />} label="Email Address" name="email" value={viewMode === 'detail' ? organizationDetails.email : formData.email} onChange={handleChange} disabled={viewMode === 'detail'} />
                            <InputGroup icon={<UserCheck size={20} />} label="Contact Person" name="contactPerson" value={viewMode === 'detail' ? organizationDetails.contactPerson : formData.contactPerson} onChange={handleChange} disabled={viewMode === 'detail'} />
                            <InputGroup icon={<Phone size={20} />} label="Contact Number" name="contactNumber" value={viewMode === 'detail' ? organizationDetails.contactNumber : formData.contactNumber} onChange={handleChange} disabled={viewMode === 'detail'} />
                            <InputGroup icon={<OrganizationTypeIcon size={20} />} label="Organization Type" name="orgType" value={viewMode === 'detail' ? organizationDetails.orgType : formData.orgType} onChange={handleChange} disabled={viewMode === 'detail'} />
                            <InputGroup icon={<Users size={20} />} label="No. Of Employees" name="employees" value={viewMode === 'detail' ? organizationDetails.employees : formData.employees} onChange={handleChange} disabled={viewMode === 'detail'} />
                            <InputGroup icon={<Globe size={20} />} label="Website URL" name="website" value={viewMode === 'detail' ? organizationDetails.website : formData.website} onChange={handleChange} disabled={viewMode === 'detail'} />
                        </div>
                    </div>

                    <div className="dept-page-basic-info-section">
                        <h3>Primary Address</h3>
                        <div className="info-grid-layout">
                            <InputGroup icon={<MapPin size={20} />} label="Street 1" name="street1" value={viewMode === 'detail' ? organizationDetails.street1 : formData.street1} onChange={handleChange} disabled={viewMode === 'detail'} />
                            <InputGroup icon={<MapPin size={20} />} label="Street 2" name="street2" value={viewMode === 'detail' ? organizationDetails.street2 : formData.street2} onChange={handleChange} disabled={viewMode === 'detail'} />
                            <InputGroup icon={<MapPin size={20} />} label="Country/Region" name="country" value={viewMode === 'detail' ? organizationDetails.country : formData.country} onChange={handleChange} disabled={viewMode === 'detail'} />
                            <InputGroup icon={<MapPin size={20} />} label="State" name="state" value={viewMode === 'detail' ? organizationDetails.state : formData.state} onChange={handleChange} disabled={viewMode === 'detail'} />
                            <InputGroup icon={<MapPin size={20} />} label="City" name="city" value={viewMode === 'detail' ? organizationDetails.city : formData.city} onChange={handleChange} disabled={viewMode === 'detail'} />
                            <InputGroup icon={<MapPin size={20} />} label="Pin Code" name="pincode" value={viewMode === 'detail' ? organizationDetails.pincode : formData.pincode} onChange={handleChange} disabled={viewMode === 'detail'} />
                        </div>
                    </div>

                    {/* Conditionally render Save/Update button */}
                    {(viewMode === 'add' || viewMode === 'edit') && (
                        <button className="dept-page-action-btn" onClick={handleSaveOrUpdate}>
                            {viewMode === 'add' ? 'SAVE' : 'UPDATE'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper component for inputs to keep the JSX clean
const InputGroup = ({ icon, label, ...props }) => (
    <div className="dept-page-input-group">
        <div className="dept-page-icon-wrapper">{icon}</div>
        <label>{label}</label>
        <input type="text" {...props} />
    </div>
);

export default BasicInformation;