// src/components/Organization/AddOrganization.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Organization.scss';
import { User, Mail, UserCheck, Phone, Briefcase, Users, Globe, MapPin, PlusCircle } from 'lucide-react';

const AddOrganization = () => {
    
    const navigate = useNavigate();
    // TODO: Add state management for form fields
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        contactPerson: '',
        contactNumber: '',
        // ... add other fields here
    });

    const handleSave = (e) => {
        e.preventDefault();
        // TODO: Add API call logic here to save the organization
        // navigate('/organization-details'); // Navigate after saving
    };

    return (
        <div className="add-page">
             <div className="page-header">
                <div className="breadcrumbs">
                    <span>Settings</span> &gt; <span>Organization</span> &gt; <span>Add new Organization</span>
                </div>
                <button className="close-button" onClick={() => navigate(-1)}>Close</button>
            </div>
            <div className="add-page-body">
                <div className="left-panel">
                    <h3>Add New Organization</h3>
                    <h4>Fill The Information</h4>
                    <p>You're Just One Step Away From Adding The New Organization!</p>
                    <img src="https://i.imgur.com/gYf2pGz.png" alt="Illustration" className="illustration" />
                </div>

                <form className="right-panel-form" onSubmit={handleSave}>
                     <div className="profile-header-form">
                        <div className="profile-avatar-form">
                           {/* Add logic to upload and display image */}
                           <div className="edit-icon">
                               <Edit size={14} />
                           </div>
                        </div>
                        <select className="status-dropdown" defaultValue="active">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="info-section">
                        <h4>Basic Information</h4>
                        <p>Please Provide Organization Basic Details Below.</p>
                        <div className="form-grid">
                            <FormInput icon={<User size={20} />} label="First Name*" name="firstName" />
                            <FormInput icon={<Mail size={20} />} label="Email Address*" name="email" />
                            <FormInput icon={<UserCheck size={20} />} label="Contact Person" name="contactPerson" />
                            <FormInput icon={<Phone size={20} />} label="Contact Number" name="contactNumber" />
                            <FormInput icon={<Briefcase size={20} />} label="Organization Type" name="orgType" hasPlus />
                            <FormInput icon={<Users size={20} />} label="No. Of Employees" name="numEmployees" />
                            <FormInput icon={<Globe size={20} />} label="Website URL" name="website" />
                        </div>
                    </div>

                    <div className="info-section">
                        <h4>Primary Address</h4>
                        <p>Please Provide Organization's Address Details Below.</p>
                         <div className="form-grid">
                            <FormInput icon={<MapPin size={20} />} label="Street 1" name="street1" />
                            <FormInput icon={<MapPin size={20} />} label="Street 2" name="street2" />
                            <FormInput icon={<MapPin size={20} />} label="Country/Region" name="country" hasPlus />
                            <FormInput icon={<MapPin size={20} />} label="State" name="state" hasPlus />
                            <FormInput icon={<MapPin size={20} />} label="City" name="city" />
                            <FormInput icon={<MapPin size={20} />} label="Pin Code" name="pincode" />
                         </div>
                    </div>
                    <button type="submit" className="save-button">SAVE</button>
                </form>
            </div>
        </div>
    );
};

// Helper component for form inputs
const FormInput = ({ icon, label, name, hasPlus = false }) => (
    <div className="form-input-group">
        {icon}
        <input type="text" placeholder={label} name={name} />
        {hasPlus && <PlusCircle size={18} className="plus-icon" />}
    </div>
);

export default AddOrganization;