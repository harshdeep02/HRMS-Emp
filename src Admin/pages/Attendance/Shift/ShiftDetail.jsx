import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Pencil, ArrowUpRightFromSquare, CalendarDays, Timer, Clock } from 'lucide-react';
import bannerImg from '../../../assets/adddShift.svg'; // Make sure this path is correct
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
import './ShiftDetails.scss'


export const ShiftDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Initial state for a new shift form
    const emptyData = {
        shift_name: '',
        start_time: '',
        end_time: '',
        break_time: '',
        extra_hours: '',
        status: 1
    };

    const [formData, setFormData] = useState(emptyData);
    const [viewMode, setViewMode] = useState('detail');
    const [calculatedDuration, setCalculatedDuration] = useState('');


    //redux
    const createShift = useSelector((state) => state?.createShift);
    const shiftDetails = useSelector((state) => state?.shiftMasterDetails);
    const shiftDetail = shiftDetails?.data?.result;
    const shiftLoading = shiftDetails?.loading || false;

    useEffect(() => {
        if (id && shiftDetail?.id !== id) {
            dispatch(getShiftMasterDetails({ id }));
        }
    }, [id]);

    // Update formData when Redux state for shiftDetail details changes
    useEffect(() => {
        if (id && shiftDetail) {
            setFormData((prev) => ({
                ...prev,
                shift_name: shiftDetail?.shift_name || '',
                start_time: shiftDetail?.start_time || '',
                end_time: shiftDetail?.end_time || '',
                break_time: shiftDetail?.break_time || '',
                extra_hours: shiftDetail?.extra_hours || '',
                status: shiftDetail?.status || 1
            }));
        }
    }, [viewMode, shiftDetail]);


    // --- Dynamic Header Texts ---
    const renderHeader = () => {
        switch (viewMode) {
            case 'add': return 'Add New Shift';
            case 'edit': return 'Edit Shift Details';
            default: return 'Shift Details';
        }
    };

    const renderMark = () => {
        switch (viewMode) {
            case 'add': return 'Fill The Information';
            case 'edit': return 'Edit The details';
            default: return 'Provided Information';
        }
    };

    const renderHeaderInfo = () => {
        switch (viewMode) {
            case 'add': return "You're Just One Step Away From Adding The New Shift!";
            case 'edit': return "Here’s The Information About The Travel Details You’ve Filled.";
            default: return "Check Out Your Shift Information!";
        }
    };

    // --- View Mode Logic based on URL ---
    useEffect(() => {
        const path = location.pathname;
        if (path.includes("add-shift")) {
            setFormData(emptyData);
            setViewMode('add');
        } else if (path.includes("edit-shift")) {
            setViewMode('edit');
        } else if (path.includes("shift-details")) {
            setViewMode('detail');
        }
    }, [location]);

    // --- Automatic Duration Calculation ---
    // useEffect(() => {
    //     const { startTime, endTime, breakTime } = formData;
    //     if (startTime && endTime) {
    //         const format = 'hh:mm A';
    //         let start = dayjs(startTime, format);
    //         let end = dayjs(endTime, format);
    //         if (end.isBefore(start)) {
    //             end = end.add(1, 'day');
    //         }
    //         const totalShiftMinutes = end.diff(start, 'minute');
    //         const breakMinutes = parseInt(breakTime, 10) || 0;
    //         const netMinutes = totalShiftMinutes - breakMinutes;

    //         if (netMinutes < 0) {
    //             setCalculatedDuration('Invalid Input');
    //             return;
    //         }
    //         const hours = Math.floor(netMinutes / 60);
    //         const minutes = netMinutes % 60;
    //         let durationString = '';
    //         if (hours > 0) durationString += `${hours} Hr${hours > 1 ? 's' : ''} `;
    //         if (minutes > 0) durationString += `${minutes} Min${minutes > 1 ? 's' : ''}`;
    //         setCalculatedDuration(durationString.trim() || '0 Mins');
    //     } else {
    //         setCalculatedDuration('');
    //     }
    // }, [formData.start_time, formData.end_time, formData.break_time]);

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

    // --- Event Handlers ---
    const handleEditClick = () => navigate(`/edit-shift/${id}`);

    const handleSaveOrUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSubmit = {
            ...formData,
        };
        if (viewMode === 'edit') {
            formDataToSubmit["id"] = id;
        }
        try {
            const res = await dispatch(createNewShift(formDataToSubmit))

            if (res?.status === 200) {
                if (viewMode === 'edit') {
                    dispatch(getShiftMasterDetails({ id }));
                }
                navigate(viewMode === 'add' ? '/shift-list' : `/shift-details/${id}`);
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
    const handleStatus = (val) => {
        setFormData(prevData => ({
            ...prevData,
            status: val,
        }));
    }

    // const checkDisabled = viewMode === 'detail';
    const isDetailView = viewMode === "detail";

    if (shiftLoading) {
        return <div className="loading-state"> <Loader /> </div>;
    }

    return (
        <div className="">
            <button onClick={() => navigate(`${viewMode == 'edit' ? `/shift-details/${id}` : '/shift-list'}`)} className="close_nav header_close">Close</button>
            <div className="dept-page-container">
                <h2 className="dept-page-main-heading">{renderHeader()}</h2>
                <div className="dept-page-content-wrapper">
                    <div className="dept-page-left-panel">
                        <h3 className="dept-page-mark-text">{renderMark()}</h3>
                        <p className="dept-page-info-text">{renderHeaderInfo()}</p>
                        <div className="dept-page-illustration-box">
                            <img className=' ' src={bannerImg} alt="Illustration" />
                        </div>
                    </div>
                    <div className="dept-page-right-panel">
                        <div className="dept-page-cover-section">
                            <div className="dept-page-basic-info-section dept-page-basic-info-section_2">
                                <h3>Basic Information</h3>
                                <p className="dept-page-subtitle">{viewMode !== "detail" ? "Please Provide" : ''} Shift Basic Details Below.</p>
                            </div>
                            <StatusDropdown
                                options={shiftStatusOption?.filter((item) => item?.label !== "All")?.map((item) => ({
                                    value: item?.id,
                                    label: item?.label,
                                    icon: item?.icon,
                                }))}
                                defaultValue={formData?.status}
                                onChange={(val) => handleStatus(val)}
                                viewMode={viewMode !== "detail"}
                            />
                            {/* :
                                <div className="status-dropdown">
                                    <div className={`status-label dropdown-trigger`}>
                                        {shiftStatusOption?.filter((item) => item.id == formData?.status)?.[0]?.label}
                                    </div>
                                </div>
                            } */}
                        </div>
                        {viewMode === 'detail' && (
                            <button className="dept-page-edit-btn" onClick={handleEditClick}>
                                {/* */}
                                Edit</button>
                        )}
                        <div className={`dept-page-basic-info-section ${viewMode === "edit" ? "isEditPage" : ""}`}>

                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"><ArrowUpRightFromSquare size={20} strokeWidth={1.5} /></div>
                                <label className={!isDetailView ? "redCol" : ''}>Shift Name{!isDetailView ? <span>*</span> : ''}</label>
                                <input type="text" name='shift_name' value={formData.shift_name} onChange={handleChange} disabled={isDetailView} ref={shift_name_ref} />
                            </div>

                            {/* <div className="dept-page-input-group ">
                                <FormTimePicker label="Start Time" type="start_time" initialTime={formData.start_time} onTimeChange={handleTimeChange} disabled={isDetailView} required={!isDetailView} ampm={true} ref={start_time_ref} />
                            </div> */}
                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"  >
                                    <Clock size={20} strokeWidth={1.25} />
                                </div>
                                <label >Start Time</label>
                                <FormTimePicker label="Start Time" type="start_time" initialTime={formData.start_time} onTimeChange={handleTimeChange} disabled={isDetailView} required={!isDetailView} ampm={true} ref={start_time_ref} />
                            </div>


                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"  >
                                    <Clock size={20} strokeWidth={1.25} />
                                </div>
                                <label >End Time</label>
                                <FormTimePicker label="End Time" type="end_time" initialTime={formData.end_time} onTimeChange={handleTimeChange} disabled={isDetailView} required={!isDetailView} ampm={true} ref={end_time_ref} />
                            </div>

                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"  >
                                    <Clock size={20} strokeWidth={1.25} />
                                </div>
                                <label >Break Time</label>
                                <FormTimePicker label="Break Time" type="break_time" initialTime={formData.break_time} onTimeChange={handleTimeChange} disabled={isDetailView} ampm={false} showOnlyMinutes={true} />
                            </div>


                            <div className="dept-page-input-group">
                                <div className="dept-page-icon-wrapper"  >
                                    <Clock size={20} strokeWidth={1.25} />
                                </div>
                                <label >Extra Time</label>
                                <FormTimePicker label="Extra Hours" type="extra_hours" initialTime={formData.extra_hours} onTimeChange={handleTimeChange} disabled={isDetailView} ampm={false} />
                            </div>

                        </div>
                        {(viewMode === "add" || viewMode === "edit") && (
                            <SaveBtn handleSubmit={handleSaveOrUpdate} viewMode={viewMode} loading={createShift?.loading} color='#fff' btntype='buttom_fix_btn'
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};