import { useState, useEffect } from 'react';
import './AddEmloyee.scss';
import './NavbarForm.scss';
import { Binary, Building2, Earth, Map, Pencil, Route } from 'lucide-react';
const ContactsForm = ({ formData }) => {

    return (
        <>
            <div id='form' className={`formB bEdit`}>
                <div className="page-header">

                    <div className='div_heading'>
                        <h2>Present Address</h2>
                        <p className='ppp'> Basic address overview</p>
                    </div>
                </div>
                <div className="from1">
                    <div className="form-group">
                        <label><Earth size={20} strokeWidth={1.25} /> Country/Region</label>
                         <input
                            type="text"
                            name="country"
                            value={formData?.contacts[0]?.country_name}
                            disabled={true}
                            />
                    </div>
                    <div className="form-group">
                        <label><Map size={20} strokeWidth={1.25} />State</label>
                         <input
                            type="text"
                            name="state_name"
                            value={formData?.contacts[0]?.state_name}
                            disabled={true}
                            />
                    </div>
                    <div className="form-group">
                        <label><Building2 size={20} strokeWidth={1.25} />City</label>
                         <input
                            type="text"
                            name="city_name"
                            value={formData?.contacts[0]?.city_name}
                            disabled={true}
                            />
                    </div>

                    <div className="form-group">
                        <label><Route size={20} strokeWidth={1.25} />Street 1</label>
                        <input
                            type="text"
                            name="street_1"
                            value={formData?.contacts[0]?.street_1}
                            disabled={true}
                        />
                    </div>

                    <div className="form-group">
                        <label><Route size={20} strokeWidth={1.25} />Street 2</label>
                        <input
                            type="text"
                            name="street_2"
                            value={formData?.contacts[0]?.street_2}
                            disabled={true}
                        />
                    </div>

                    <div className="form-group">
                        <label><Binary size={20} strokeWidth={1.25} />Pin Code</label>
                        <input
                            type="text"
                            name="zip_code"
                            value={formData?.contacts[0]?.zip_code}
                            disabled={true}
                        />
                    </div>
                </div>
            </div>
            <hr className='hr_line' />
            <div id='form' className={`formB bEdit`}>
                <div className='div_heading' id='div_headingBit'>
                    <div className='div_heading_copy'>
                        <h2>Permanent Address</h2>
                        <p className='ppp'>Permanent address overview</p>
                    </div>
                </div>

                <div className="from1">
                    <div className="form-group">
                        <label> <Earth size={20} strokeWidth={1.25} />Country/Region</label>
                        <input
                            type="text"
                            name="country_name"
                            value={formData?.contacts[1]?.country_name}
                            disabled={true}
                        />
                    </div>

                    <div className="form-group">
                        <label><Map size={20} strokeWidth={1.25} />State</label>
                         <input
                            type="text"
                            name="state_name"
                            value={formData?.contacts[1]?.state_name}
                            disabled={true}
                        />
                    </div>
                    <div className="form-group">
                        <label><Building2 size={20} strokeWidth={1.25} />City</label>
                        <input
                            type="text"
                            name="city_name"
                            value={formData?.contacts[1]?.city_name}
                            disabled={true}
                        />
                    </div>
                    <div className="form-group">
                        <label><Route size={20} strokeWidth={1.25} />Street 1</label>
                        <input
                            type="text"
                            name="permanent_street_1"
                            value={formData?.contacts[1]?.street_1}
                            disabled={true}
                        />
                    </div>
                    <div className="form-group">
                        <label><Route size={20} strokeWidth={1.25} />Street 2</label>
                        <input
                            type="text"
                            name="permanent_street_2"
                            value={formData?.contacts[1]?.street_2}
                            disabled={true}
                        />
                    </div>
                    <div className="form-group">
                        <label><Binary size={20} strokeWidth={1.25} />Pin Code</label>
                        <input
                            type="text"
                            //placeholder="Enter zip code"
                            name="permanent_zip_code"
                            value={formData?.contacts[1]?.zip_code}
                            disabled={true}
                        />
                    </div>
                </div>
            </div>
            <hr className='hr_line' />
            <div id='form' className={`form_last formB`}>
                <div className='div_heading' id='div_headingBit'>
                    <div className='div_heading_copy'>
                        <h2>Contact Details</h2>
                    </div>
                </div>
                <div className="from1">
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="contact_name"
                            value={formData?.contact_name}
                            disabled={true}
                        />
                    </div>
                    <div className="form-group">
                        <label>Emergency Contact </label>
                        <input
                            type="text"
                            name="emergency_contact_no"
                            value={formData?.emergency_contact_no}
                            disabled={true}
                        />
                    </div>
                    <div className="form-group">
                        <label>Personal Email ID</label>
                        <input
                            type="email"
                            name="personal_email_id"
                            value={formData?.personal_email_id}
                            disabled={true}
                        />
                    </div>
                    <div className="form-group">
                        <label>Relation To employee </label>
                        <input
                            type="text"
                            name="employee_relation"
                            value={formData?.employee_relation}
                            disabled={true}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactsForm;
