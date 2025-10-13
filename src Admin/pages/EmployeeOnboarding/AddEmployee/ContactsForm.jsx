import { useState, useEffect } from 'react';
import './AddEmloyee.scss';
import './NavbarForm.scss';
import { useDispatch, useSelector } from 'react-redux';
import SelectDropdown from '../../../utils/common/SelectDropdown/SelectDropdown.jsx';
import { Binary, Building2, Earth, Map, Pencil, Route } from 'lucide-react';
import SubmitButton from '../../../utils/common/SubmitButton.jsx';
import { addEmpAddress, getEmployeeDetails } from '../../../Redux/Actions/employeeActions.js';
import { useNavigate } from 'react-router-dom';

const ContactsForm = ({ isEditPage, isEditMode, setIsEditMode, formData, setFormData, id, handleSearch, handleState, handleCity }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addUpdateAddress = useSelector((state) => state?.addEmpAddress);

    const countryData = useSelector((state) => state?.countryList);
    const countryLists = countryData?.data?.country || [];

    const stateData = useSelector((state) => state?.stateList);
    const stateLists = stateData?.data?.country || [];

    const cityData = useSelector((state) => state?.cityList);
    const cityLists = cityData?.data?.country || [];

    const [sameAsPresent, setSameAsPresent] = useState(false);

    useEffect(() => {
        if (sameAsPresent) {
            setFormData((prevData) => {
                // Find Present and Permanent addresses
                const presentAddress = prevData.contacts.find(
                    (contact) => contact.address_type === "Present"
                );
                const permanentAddressIndex = prevData.contacts.findIndex(
                    (contact) => contact.address_type === "Permanent"
                );
                if (!presentAddress || permanentAddressIndex === -1) {
                    console.error("Present or Permanent address not found");
                    return prevData;
                }
                // Update only the Permanent address while keeping address_type and is_present_address unchanged
                const updatedContacts = prevData.contacts.map((contact, index) =>
                    index === permanentAddressIndex
                        ? {
                            ...contact,
                            street_1: presentAddress?.street_1,
                            street_2: presentAddress?.street_2,
                            zip_code: presentAddress?.zip_code,
                            city_id: presentAddress?.city_id,
                            city_name: presentAddress?.city_name,
                            state_id: presentAddress?.state_id,
                            state_name: presentAddress?.state_name,
                            country_id: presentAddress?.country_id,
                            country_name: presentAddress?.country_name,
                            personal_contact_no: presentAddress?.personal_contact_no,
                            emergency_contact_no: presentAddress?.emergency_contact_no,
                            personal_email_id: presentAddress?.personal_email_id,
                            address_type: contact?.address_type, // Keep the original
                            is_present_address: contact?.is_present_address, // Keep the original
                        }
                        : contact
                );
                return {
                    ...prevData,
                    contacts: updatedContacts,
                };
            });
        }
    }, [sameAsPresent]);

    // Helper function to update form data
    const updateContactField = (index, field, value) => {

        if (field === "country_id") {
            setFormData((prevData) => ({
                ...prevData,
                contacts: prevData.contacts.map((contact, i) =>
                    i === index ? { ...contact, country_id: value.id, country_name: value.label, state_id: "", state_name: "", city_id: "", city_name: "" } : contact
                )
            }));
        }
        else if (field === "state_id") {
            setFormData((prevData) => ({
                ...prevData,
                contacts: prevData.contacts.map((contact, i) =>
                    i === index ? { ...contact, state_id: value.id, state_name: value.label, city_id: "", city_name: "" } : contact
                )
            }));
        }
        else if (field === "city_id") {
            setFormData((prevData) => ({
                ...prevData,
                contacts: prevData.contacts.map((contact, i) =>
                    i === index ? { ...contact, city_id: value.id, city_name: value.label } : contact
                )
            }));
        }
        else {
            setFormData((prevData) => ({
                ...prevData,
                contacts: prevData.contacts.map((contact, i) =>
                    i === index ? { ...contact, [field]: value } : contact
                )
            }));
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        // Determine if updating Present (index 0) or Permanent (index 1) address
        const isPermanent = name.startsWith("permanent");
        const field = isPermanent ? name.replace("permanent_", "").toLowerCase() : name;

        const index = isPermanent ? 1 : 0;
        if (name === "contact_name" || name === "emergency_contact_no" || name === "personal_email_id" || name === "employee_relation") {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
        else {
            updateContactField(index, field, value);
        }
    };

    const handleSelect = (name, value) => {
        const isPermanent = name.startsWith("permanent");
        const field = isPermanent ? name.replace("permanent_", "").toLowerCase() : name;
        const index = isPermanent ? 1 : 0;

        updateContactField(index, field, value);
        // Trigger state or city list fetch if necessary
        if (field === "country_id") handleState("", value?.id);
        if (field === "state_id") handleCity("", value?.id);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // if (!validateForm()) return;

        const formDataToSubmit = {
            user_id: id,
            contact_name: formData?.contact_name,
            emergency_contact_no: formData?.emergency_contact_no,
            personal_email_id: formData?.personal_email_id,
            employee_relation: formData?.employee_relation,
            contacts: formData?.contacts

        };
        dispatch(addEmpAddress(formDataToSubmit))
            .then((res) => {
                if (res?.status === 200) {
                    setTimeout(() => {
                        navigate(`/employee-details/${id}`);
                        setIsEditMode(false);
                        dispatch(getEmployeeDetails({ id }));
                    }, 1500);
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });
    };

    return (
        <>
            <div id='form' className={`formB bEdit  ${isEditPage ? 'isEditPage' : ''}`}>
                <div className="page-header">

                    <div className='div_heading'>
                        <h2>Present Address</h2>
                        <p className='ppp'> Basic address overview</p>
                    </div>
                    {!isEditMode &&
                        <div className="header-actions">
                            <button className="action-btn edit_btn" onClick={() => { setIsEditMode(true); navigate(`/edit-employee/${id}`) }}>
                                Edit
                            </button>
                        </div>
                    }
                </div>
                <div className="from1">
                    <div className="form-group">
                        <label><Earth size={20} strokeWidth={1.25} /> Country/Region</label>
                        <SelectDropdown
                            selectedValue={formData?.contacts[0]?.country_id}
                            options={countryLists?.map((item) => ({
                                id: item?.id,
                                label: item?.name,
                            }))}
                            // placeholder="Select Country"
                            onSelect={(name, value) => handleSelect(name, value)}
                            searchPlaceholder="Search Country"
                            // handleSearch={(value, name) => handleSearch(value, name)}
                            type="country_id"
                            loading={countryData?.loading}
                            showSearchBar={true}
                            selectedName={formData?.contacts[0]?.country_name}
                            disabled={!isEditMode}
                            searchMode="local"
                        />
                    </div>
                    <div className="form-group">
                        <label><Map size={20} strokeWidth={1.25} />State</label>
                        <SelectDropdown
                            selectedValue={formData?.contacts[0]?.state_id}
                            options={stateLists?.map((item) => ({
                                id: item?.id,
                                label: item?.name,
                            }))}
                            // placeholder="Select State"
                            onSelect={(name, value) => handleSelect(name, value)}
                            searchPlaceholder="Search state"
                            // handleSearch={(value, name) => handleSearch(value, name, formData?.contacts[0]?.country_id)}
                            type="state_id"
                            loading={stateData?.loading}
                            showSearchBar={true}
                            selectedName={formData?.contacts[0]?.state_name}
                            disabled={!isEditMode}
                            searchMode="local"
                        />
                    </div>
                    <div className="form-group">
                        <label><Building2 size={20} strokeWidth={1.25} />City</label>
                        <SelectDropdown
                            selectedValue={formData?.contacts[0]?.city_id}
                            options={cityLists?.map((item) => ({
                                id: item?.id,
                                label: item?.name,
                            }))}
                            // placeholder="Select City"
                            onSelect={(name, value) => handleSelect(name, value)}
                            searchPlaceholder="Search City"
                            // handleSearch={(value, name) => handleSearch(value, name, formData?.contacts[0]?.state_id)}
                            type="city_id"
                            loading={cityData?.loading}
                            showSearchBar={true}
                            selectedName={formData?.contacts[0]?.city_name}
                            disabled={!isEditMode}
                            searchMode="local"
                        />
                    </div>

                    <div className="form-group">
                        <label><Route size={20} strokeWidth={1.25} />Street 1</label>
                        <input
                            type="text"
                            // placeholder="Enter street 1"
                            name="street_1"
                            value={formData?.contacts[0]?.street_1}
                            onChange={handleChange}
                            disabled={!isEditMode}
                        />
                    </div>

                    <div className="form-group">
                        <label><Route size={20} strokeWidth={1.25} />Street 2</label>
                        <input
                            type="text"
                            // placeholder="Enter street 2"
                            name="street_2"
                            value={formData?.contacts[0]?.street_2}
                            onChange={handleChange}
                            disabled={!isEditMode}
                        />
                    </div>

                    <div className="form-group">
                        <label><Binary size={20} strokeWidth={1.25} />Pin Code</label>
                        <input
                            type="text"
                            // placeholder="Enter zip code"
                            name="zip_code"
                            value={formData?.contacts[0]?.zip_code}
                            onChange={handleChange}
                            disabled={!isEditMode}
                        />
                    </div>
                </div>
            </div>
            <hr className='hr_line' />
            <div id='form' className={`formB bEdit  ${isEditPage ? 'isEditPage' : ''}`}>
                <div className='div_heading' id='div_headingBit'>
                    <div className='div_heading_copy'>
                        <h2>Permanent Address</h2>
                        <p className='ppp'>Permanent address overview</p>
                    </div>
                    {isEditMode &&
                        <div className="address-container">
                            <p>Copy Same As Present Address</p>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={sameAsPresent}
                                    onChange={() => setSameAsPresent(prev => !prev)}
                                    disabled={!isEditMode}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    }
                </div>

                <div className="from1">
                    <div className="form-group">
                        <label> <Earth size={20} strokeWidth={1.25} />Country/Region</label>
                        <SelectDropdown
                            selectedValue={formData?.contacts[1]?.country_id}
                            options={countryLists?.map((item) => ({
                                id: item?.id,
                                label: item?.name,
                            }))}
                            onSelect={(name, value) => handleSelect("permanent_country_id", value)}
                            searchPlaceholder="Search Country"
                            // handleSearch={(value, name) => handleSearch(value, name)}
                            type="country_id"
                            loading={countryData?.loading}
                            showSearchBar={true}
                            disabled={!isEditMode || sameAsPresent}
                            selectedName={formData?.contacts[1]?.country_name}
                            searchMode="local"
                        />
                    </div>

                    <div className="form-group">
                        <label><Map size={20} strokeWidth={1.25} />State</label>
                        <SelectDropdown
                            selectedValue={formData?.contacts[1]?.state_id}
                            options={stateLists?.map((item) => ({
                                id: item?.id,
                                label: item?.name,
                            }))}
                            // // placeholder="Select State"
                            onSelect={(name, value) => handleSelect("permanent_state_id", value)}
                            searchPlaceholder="Search State"
                            // handleSearch={(value, name) => handleSearch(value, name, formData?.contacts[1]?.country_id)}
                            type="state_id"
                            loading={stateData?.loading}
                            showSearchBar={true}
                            className={""}
                            disabled={!isEditMode || sameAsPresent}
                            selectedName={formData?.contacts[1]?.state_name}
                            searchMode="local"
                        />
                    </div>
                    <div className="form-group">
                        <label><Building2 size={20} strokeWidth={1.25} />City</label>
                        <SelectDropdown
                            selectedValue={formData?.contacts[1]?.city_id}
                            options={cityLists?.map((item) => ({
                                id: item?.id,
                                label: item?.name,
                            }))}
                            // placeholder="Select City"
                            onSelect={(name, value) => handleSelect("permanent_city_id", value)}
                            searchPlaceholder="Search City"
                            // handleSearch={(value, name) => handleSearch(value, name, formData?.contacts[1]?.state_id)}
                            type="city_id"
                            loading={cityData?.loading}
                            showSearchBar={true}
                            disabled={!isEditMode || sameAsPresent}
                            selectedName={formData?.contacts[1]?.city_name}
                            searchMode="local"
                        />
                    </div>
                    <div className="form-group">
                        <label><Route size={20} strokeWidth={1.25} />Street 1</label>
                        <input
                            type="text"
                            // placeholder="Enter street 1"
                            name="permanent_street_1"
                            value={formData?.contacts[1]?.street_1}
                            onChange={handleChange}
                            disabled={!isEditMode || sameAsPresent}
                        />
                    </div>
                    <div className="form-group">
                        <label><Route size={20} strokeWidth={1.25} />Street 2</label>
                        <input
                            type="text"
                            // placeholder="Enter street 2"
                            name="permanent_street_2"
                            value={formData?.contacts[1]?.street_2}
                            onChange={handleChange}
                            disabled={!isEditMode || sameAsPresent}
                        />
                    </div>
                    <div className="form-group">
                        <label><Binary size={20} strokeWidth={1.25} />Pin Code</label>
                        <input
                            type="text"
                            //placeholder="Enter zip code"
                            name="permanent_zip_code"
                            value={formData?.contacts[1]?.zip_code}
                            onChange={handleChange}
                            disabled={!isEditMode || sameAsPresent}
                        />
                    </div>
                </div>
            </div>
            <hr className='hr_line' />
            <div id='form' className={`form_last formB  ${isEditPage ? 'isEditPage' : ''}`}>
                <div className='div_heading' id='div_headingBit'>
                    <div className='div_heading_copy'>
                        <h2>Contact Details</h2>
                        {isEditMode &&
                            <p>Please Provide Employee’s Emergency Contact Details Below.</p>
                        }
                    </div>
                </div>
                <div className="from1">
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            // placeholder="Enter personal contact number"
                            name="contact_name"
                            value={formData?.contact_name}
                            onChange={handleChange}
                            disabled={!isEditMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>Emergency Contact </label>
                        <input
                            type="text"
                            // placeholder="Enter emergency contact number"
                            name="emergency_contact_no"
                            value={formData?.emergency_contact_no}
                            onChange={handleChange}
                            disabled={!isEditMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>Personal Email ID</label>
                        <input
                            type="email"
                            // placeholder="Enter personal email ID"
                            name="personal_email_id"
                            value={formData?.personal_email_id}
                            onChange={handleChange}
                            disabled={!isEditMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>Relation To employee </label>
                        <input
                            type="text"
                            // placeholder="Enter emergency contact number"
                            name="employee_relation"
                            value={formData?.employee_relation}
                            onChange={handleChange}
                            disabled={!isEditMode}
                        />
                    </div>
                </div>
            </div>
            {isEditMode &&
                <div className='submit-button-container' style={{ marginTop: '-20px' }}>

                    <SubmitButton
                        loading={addUpdateAddress?.loading}
                        id={id}
                        handleSubmit={handleSubmit}
                    />
                </div>
            }
        </>
    );
};

export default ContactsForm;
