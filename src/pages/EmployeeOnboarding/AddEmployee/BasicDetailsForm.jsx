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

const BasicDetailsForm = ({ formData}) => {

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

    return (
        <>
            <div id='form' className={`formB bEdit`}>
                <div className="page-header">
                    <h1>Profile Picture</h1>
                </div>
                <div className='profile_pic_head'>
                    <div className="form-group attachment_form">
                        <UserProfileImageUpload
                            formData={formData}
                            fieldName="image"
                            isEditMode={false}
                        />
                    </div>
                    <StatusDropdown
                        options={employeeStatusOptions
                            ?.filter((item) => item?.label !== "All")
                            ?.map((item) => ({
                                value: item?.id,
                                label: item?.label,
                                icon: item?.icon,
                            }))}
                        defaultValue={formData?.employee_status}   // status ki jagah employee_status
                        disabled={true}
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
                        <label>
                            <FolderPen size={20} strokeWidth={1.25} /> <p> First Name</p></label>
                        <div>
                            <input
                                type="text"
                                name="first_name"
                                value={formData?.first_name}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>
                            <FolderPen size={20} strokeWidth={1.25} /> <p>Last Name</p>
                        </label>
                        <div>
                            <input
                                type="text"
                                name="last_name"
                                value={formData?.last_name}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>
                            <IdCard size={20} strokeWidth={1.25} /> <p>Email ID</p>
                        </label>
                        <div>
                            <input
                                type="text"
                                name="email"
                                value={formData?.email}
                                disabled={true}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>
                            <FolderPen size={20} strokeWidth={1.25} /> <p>Display Name</p></label>
                        <input
                            type="text"
                            name="display_name"
                            value={formData?.display_name}
                            disabled={true}
                        />
                    </div>
                    <div className="form-group">
                        <label><Phone size={20} strokeWidth={1.25} /> <p>Contact Number</p></label>
                        <input
                            type="text"
                            name="mobile_no"
                            value={formData?.mobile_no}
                            disabled={true}
                        />
                    </div>
                    <div className="form-group">
                        <label><Calendar size={20} strokeWidth={1.25} /> <p>Date of Birth</p></label>
                        <FormDatePicker label="Date of Birth" initialDate={formData?.date_of_birth} type="date_of_birth" disabled={true} />
                    </div>
                    <div className="form-group">
                        <label><AArrowUp size={20} strokeWidth={1.25} /> <p>Age</p></label>
                        <input
                            type="text"
                            name="age"
                            value={formData?.age}
                            disabled={true}
                        />
                    </div>
                    {/* Gender Dropdown */}
                    <div className="form-group">
                        <label><MarsStroke size={20} strokeWidth={1.25} /><p>Gender</p></label>
                         <input
                            type="text"
                            name="gender"
                            value={formData?.gender}
                            disabled={true}
                        />
                    </div>

                    <div className="form-group">
                        <label><Book size={20} strokeWidth={1.25} /><p>PAN Number</p></label>
                        <input
                            type="text"
                            name="pan"
                            value={formData?.pan}
                            disabled={true}
                        />
                    </div>
                </div>
            </div>
            <hr className='hr_line' />
            <div id='form' className={`form_last formB`}>
                <div className='div_heading'>
                    <h2>Company Information</h2>
                    <p className='ppp'>Essential organization information</p>
                </div>
                <div className="from1 form2 ">
                    {/* Department Dropdown */}
                    <div className="form-group ">
                        <label>
                            <SquaresExclude size={20} strokeWidth={1.25} /> <p>Department</p></label>
                        <>
                            <input
                            type="text"
                            name="department"
                            value={formData?.department}
                            disabled={true}
                        />
                        </>
                    </div>
                    {/* <div className="form-group "></div> */}
                    <div className="form-group">
                        <label><User size={20} strokeWidth={1.25} /> <p>Employment Type</p></label>
                         <input
                            type="text"
                            name="employment_type"
                            value={formData?.employment_type}
                            disabled={true}
                        />
                    </div>
                    <div className="form-group" >
                        <label> <AppWindowMac size={20} strokeWidth={1.25} /> <p>Designation</p> </label>
                         <input
                            type="text"
                            name="designation"
                            value={formData?.designation}
                            disabled={true}
                        />
                    </div>

                    <div className="form-group">
                        <label> <UserRoundCheck size={20} strokeWidth={1.25} /><p>Role</p> </label>
                         <input
                            type="text"
                            name="role"
                            value={formData?.role}
                            disabled={true}
                        />
                    </div>

                    <div className="form-group">
                        <label> <ArrowBigUp size={20} strokeWidth={1.25} /><p>Shift</p> <b className=''></b></label>
                        <>
                             <input
                            type="text"
                            name="shift"
                            value={formData?.shift}
                            disabled={true}
                        />
                        </>
                    </div>

                    <div className="form-group">
                        <label> <MapPinHouseIcon size={20} strokeWidth={1.25} /><p>Work Location</p> <b className=''></b></label>
                        <>
                             <input
                            type="text"
                            name="work_location"
                            value={formData?.work_location}
                            disabled={true}
                            />
                        </>
                    </div>

                    <div className="form-group">
                        <label><MapPinCheckInside size={20} strokeWidth={1.25} /><p>Job Type</p></label>
                          <input
                            type="text"
                            name="job_location"
                            value={formData?.job_location}
                            disabled={true}
                            />
                    </div>

                    {/* Marital Status Dropdown */}
                    <div className="form-group">
                        <label> <AArrowUp size={20} strokeWidth={1.25} /><p>Marital Status</p> </label>
                         <input
                            type="text"
                            name="marital"
                            value={formData?.marital}
                            disabled={true}
                            />
                    </div>
                    <div className="form-group">
                        <label> <Calendar size={20} strokeWidth={1.25} /> <p>Date of Joining</p></label>
                         <input
                            type="text"
                            name="joining_date"
                            value={formData?.joining_date}
                            disabled={true}
                            />
                    </div>

                    <div className="form-group">
                        <label> <Calendar size={20} strokeWidth={1.25} /> <p>Date of Exit</p></label>

                        <FormDatePicker label="Date of Exit" initialDate={formData?.date_of_exit} type="date_of_exit" disabled={true} fromDate={formData?.joining_date} />
                    </div>

                    {/* Employee Status Dropdown */}

                    {/* Differently Abled Type Dropdown */}
                    <div className="form-group">
                        <label> <Accessibility size={20} strokeWidth={1.25} /><p>Differently Abled Type</p></label>

                         <input
                            type="text"
                            name="differently_abled_type"
                            value={formData?.differently_abled_type}
                            disabled={true}
                            />
                    </div>
                    <div className="form-group">
                        <label><TrainFront size={20} strokeWidth={1.25} /><p> Metro/Non-Metro</p></label>
                         <input
                            type="text"
                            name="is_metro"
                            value={formData?.is_metro}
                            disabled={true}
                            />
                    </div>

                    <p className='pp'>Select employee source of hiring from the list to enhance team collaboration.</p>
                    <div className="form-group attachment_form fomr_h">
                    </div>

                    <div className="form-group" style={{ marginTop: '-25px' }}>
                        <label> <SquareCode size={20} strokeWidth={1.25} /> <p>Source of Hire</p></label>
                         <input
                            type="text"
                            name="source_of_hire"
                            value={formData?.source_of_hire}
                            disabled={true}
                            />
                    </div>
                </div>
            </div>

        </>
    );
};
export default BasicDetailsForm;