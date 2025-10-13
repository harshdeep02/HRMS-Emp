import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Pencil, ArrowUpRightFromSquare, CalendarDays, Timer, Clock } from 'lucide-react';
import bannerImg from '../../../assets/detail_man.png'; // Make sure this path is correct
import StatusDropdown from '../../../utils/common/StatusDropdown/StatusDropdown';
import '../../Settings/Users/UserDetails.scss'; // Make sure this path is correct
import Loader from '../../../utils/common/Loader/Loader';
import { toast } from 'react-toastify';
import FormTimePicker from '../../../utils/common/FormTimePicker/FormTimePicker';
import { useDispatch, useSelector } from 'react-redux';
import { createNewShift, getShiftMasterDetails } from '../../../Redux/Actions/shiftActions';
import { shiftStatusOption } from '../../../utils/Constant';
import { handleFormError } from '../../../utils/helper';
import SaveBtn from '../../../utils/common/SaveBtn';
import { BiSolidCalendarStar } from "react-icons/bi";
import '../../Attendance/Shift/ShiftDetails.scss'
import '../../Settings/Users/UserDetails.scss';

export const AddShift = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        shift_name: '',
        start_time: '',
        end_time: '',
        break_time: '',
        extra_hours: '',
    });
    const createShift = useSelector((state) => state?.createShift);

    const shift_name_ref = useRef(null);
    const start_time_ref = useRef(null);
    const end_time_ref = useRef(null);

    const [errors, setErrors] = useState({
        shift_name: false,
        start_time: false,
        end_time: false,
    });

    const basicRequiredFields = [
        { key: "shift_name", label: "Please fill shift name", required: true, ref: shift_name_ref },
        { key: "start_time", label: "Please select start time", required: true, ref: start_time_ref },
        { key: "end_time", label: "Please select end time", required: true, ref: end_time_ref },
    ];

    // --- Form Validation ---
    const validateForm = () => {
        for (let field of basicRequiredFields) {
            const value = formData[field.key];
            if (field.required && (!value || (typeof value === "string" && !value.trim()))) {
                setErrors(prev => ({ ...prev, [field.key]: field.label }));
                toast.error(field.label);
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
        };

        try {
            const res = await dispatch(createNewShift(formDataToSubmit))

            if (res?.status === 200) {
                navigate('/settings/manage-shifts', { state: { activeIndex: "manage-shifts" } });
            }
        } catch (error) {
            console.log("error-", error);
        }
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTimeChange = (name, time) => {
        setFormData((prevState) => ({ ...prevState, [name]: time }));
    };


    return (
        <div className=" ">
            <button onClick={() => navigate("/settings/manage-shifts")} className="close_nav header_close">Close</button>

            <div className="dept-page-container">
                <h2 className="dept-page-main-heading">Add New Shift</h2>
                <div className="dept-page-content-wrapper">
                    <div className="dept-page-left-panel">
                        <h3 className="dept-page-mark-text">Fill The Information</h3>
                        <p className="dept-page-info-text">You're Just One Step Away From Adding The New Shift!</p>
                        <div className="dept-page-illustration-box">
                            <img className='imgBlackedWhite' src={bannerImg} alt="Illustration" />
                        </div>
                    </div>
                    <div className="dept-page-right-panel">

                        <div className={`dept-page-basic-info-section`}>
                            <h3>Basic Information</h3>
                            <p className="dept-page-subtitle">Please Provide Shift Basic Details Below.</p>

                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"><ArrowUpRightFromSquare size={20} strokeWidth={1.5} /></div>
                                <label className="redCol">Shift Name*</label>
                                <input type="text" name='shift_name' value={formData.shift_name} onChange={handleChange} ref={shift_name_ref} />
                            </div>


                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"  >
                                    <Clock size={20} strokeWidth={1.25} />
                                </div>
                                <label >Start Time</label>
                                <FormTimePicker label="Start Time" type="start_time" initialTime={formData.start_time} onTimeChange={handleTimeChange} required="true" ampm={true} ref={start_time_ref} />
                            </div>

                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"  >
                                    <Clock size={20} strokeWidth={1.25} />
                                </div>
                                <label >End Time</label>
                                <FormTimePicker label="End Time" type="end_time" initialTime={formData.end_time} onTimeChange={handleTimeChange} ampm={true} required="true" ref={end_time_ref} />
                            </div>


                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"  >
                                    <Clock size={20} strokeWidth={1.25} />
                                </div>
                                <label >Break Time</label>
                                <FormTimePicker label="Break Time" type="break_time" initialTime={formData.break_time} onTimeChange={handleTimeChange} ampm={false} showOnlyMinutes={true} />
                            </div>


                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"  >
                                    <Clock size={20} strokeWidth={1.25} />
                                </div>
                                <label >Extra Time</label>
                                <FormTimePicker label="Extra Hours" type="extra_hours" initialTime={formData.extra_hours} onTimeChange={handleTimeChange} ampm={false} />
                            </div>
                        </div>

                        <SaveBtn btntype='buttom_fix_btn'
                            handleSubmit={handleSaveOrUpdate} viewMode={"add"} loading={createShift?.loading} color='#fff' />

                    </div>
                </div>
            </div>
        </div>
    )
}
