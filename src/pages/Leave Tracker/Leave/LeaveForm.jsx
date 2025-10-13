import {
    User,
    BookPlus,
    Proportions,
    CalendarClock,
    CalendarFold
} from 'lucide-react';
// import './DepartmentDetail.scss';
import SelectDropdown from '../../../utils/common/SelectDropdown/SelectDropdown.jsx';
import { useDispatch, useSelector } from 'react-redux';
import TextAreaWithLimit from '../../../utils/common/TextAreaWithLimit.jsx';
import FormDatePicker from '../../../utils/common/FormDatePicker.jsx';
import { useMemo, useRef, useState } from 'react';
import SaveBtn from '../../../utils/common/SaveBtn.jsx';
import { toast } from 'react-toastify';
import { calculateDuration, handleFormError } from '../../../utils/helper.js';
import { createNewLeave, getLeaveDetails } from '../../../Redux/Actions/leaveActions.js';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserData } from '../../../services/login.js';
import StatusDropdown from '../../../utils/common/StatusDropdown/StatusDropdown.jsx';
import { leavesStatusOptions } from '../../../utils/Constant.js';

export const LeaveForm = ({ viewMode, formData, setFormData, handleSearch }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const { id } = useParams();
    const { id } = getUserData()
    

    // Redux 
    const createLeave = useSelector((state) => state?.createLeave);
    const employeeData = useSelector((state) => state?.employeeList);
    const employeeLists = employeeData?.data?.result;

    const leaveMasterData = useSelector((state) => state?.leaveMasterList);
    const leaveMasterList = leaveMasterData?.data?.result || [];
    const leaveLoading = leaveMasterData?.loading || false;

    const leaveTypeOptions = useMemo(
        () => leaveMasterList?.map(e => ({
            id: e?.id, label: e?.leave_name,
        })),
        [leaveMasterList]
    );

    const leave_type_ref = useRef(null);
    const type_of_leave_ref = useRef(null);

    const [errors, setErrors] = useState({
        leave_type_id: false,
        type_of_leave: false,
        from_date: false,
        to_date: false
    });

    const basicRequiredFields = [
        {
            key: "leave_type_id",
            label: "Please Select Leave Type",
            required: true,
            ref: leave_type_ref,
        },
        {
            key: "type_of_leave",
            label: "Please Select Type Of Leave",
            required: true,
            ref: type_of_leave_ref,
        },
        {
            key: "from_date",
            label: "Please Select Start Date",
            required: true,
        },
        {
            key: "to_date",
            label: "Please Select End Date",
            required: true,
        },
    ];

    const validateForm = () => {
        for (let field of basicRequiredFields) {
            const value = formData[field.key];
            if (
                field.required &&
                (!value || (typeof value === "string" && !value.trim()))
            ) {
                setErrors((prev) => ({ ...prev, [field.key]: field.label }));
                toast.error(field.label);
                if (field?.ref) handleFormError(field?.ref);
                return false;
            }
        }
        return true;
    };

    const handleSelect = (name, item) => {
        setFormData((prevData) => {
            const updatedData = { ...prevData };
            switch (name) {
                case "user_id":
                    updatedData.user_name = item?.label;
                    updatedData[name] = item?.id;
                    break;

                case "leave_type_id":
                    updatedData.leave_type_name = item?.label;
                    updatedData[name] = item?.id;
                    break;

                case "type_of_leave":
                    updatedData[name] = item?.label;
                    if (item?.label === "Half Day" && prevData?.from_date) {
                        updatedData.to_date = prevData.from_date;
                    }
                    break;

                default:
                    updatedData[name] = item?.id;
                    break;
            }
            return updatedData;
        });
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
        setErrors((prevState) => ({
            ...prevState,
            [name]: false, // Clear error for this field
        }));
    };

    const handleDateChange = (name, date) => {
        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: date };

            if (name === "from_date" && prevData?.type_of_leave === "Half Day") {
                updatedData.to_date = date;
            }

            return updatedData;
        });

        setErrors((prevState) => ({ ...prevState, [name]: false }));
    };

      const countDay = (fromDate, toDate) => {
        // Parse DD-MM-YYYY format
        const parseCustomDate = (dateStr) => {
            if (!dateStr) return;

            const parts = dateStr.split('-');
            if (parts.length !== 3) return;

            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JavaScript
            const year = parseInt(parts[2], 10);

            return new Date(year, month, day);
        };

        const startDate = parseCustomDate(fromDate);
        const endDate = parseCustomDate(toDate);

        // Check if dates are valid
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error('Invalid date format. Expected DD-MM-YYYY');
            return 0;
        }

        // Set both dates to start of day
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        const timeDifference = endDate.getTime() - startDate.getTime();
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1;

        return formData?.from_date === formData?.to_date && formData?.type_of_leave === "Half Day" ? 0.5 : Math.max(1, daysDifference);
    }

    const typeOfLeaveOptions = [
        { id: 1, label: "Full Day" },
        { id: 2, label: "Half Day" }
    ]

    const isDetailView = viewMode === "detail";

    const handleSaveOrUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const dataToSubmit = {
            user_id: id,
            leave_type_id: formData?.leave_type_id,
            from_date: formData?.from_date,
            to_date: formData?.to_date,
            reason: formData?.reason,
            type_of_leave: formData?.type_of_leave,
            status:2
            };
        try {
            const res = await dispatch(createNewLeave(dataToSubmit))
            if (res?.status === 200) {
                navigate(`/leave-list`);
            }
        }
        catch (error) {
            console.log("error-", error);
        };
    };

    return (
        <>
            <div className="leaveFormMain">
                <div className="dept-page-basic-info-section">
                    <div className="detWrapper">
                    <div className="detWrapperHead">
                    <h3>Basic Information</h3>
                    <p className="dept-page-subtitle">{viewMode !== "detail"? "Please Provide" :''} Leaves Basic Details Below</p>
                    </div>
                    {viewMode === "detail" &&(
                     <div className="dept-page-cover-section dept-page-cover-section_2" style={{ marginTop: "0", marginLeft:"30px"}}>
                                <StatusDropdown
                                    options={leavesStatusOptions?.filter((item) => item?.label !== "All")?.map((item) => ({
                                        value: item?.id,
                                        label: item?.label,
                                        icon: item?.icon,

                                    }))}
                                    defaultValue={formData?.status}
                                    disabled={true}
                                />
                            </div>
                        )}
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"><BookPlus size={20} strokeWidth={1.5} /></div>
                        <label className={!isDetailView ? "color_red" : ""}>Leave Type{!isDetailView ? <span>*</span> : ''}</label>
                        <SelectDropdown
                            ref={leave_type_ref}
                            selectedValue={formData?.leave_type_id}
                            options={leaveTypeOptions}
                            onSelect={handleSelect}
                            searchPlaceholder="Search Leave Type"
                            handleSearch={handleSearch}
                            type="leave_type_id"
                            loading={leaveLoading}
                            showSearchBar={true}
                            disabled={isDetailView}
                            selectedName={formData?.leave_type_name}
                        />
                    </div>

                     <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"  >
                            <CalendarFold size={20} strokeWidth={1.25} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}>Start Date{!isDetailView ? <span>*</span> : ''}</label>
                        <FormDatePicker label="Start date" onDateChange={handleDateChange} initialDate={formData?.from_date} type="from_date" required={true} restrict={true} disabled={isDetailView} />
                    </div>

                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"  >
                            <CalendarFold size={20} strokeWidth={1.25} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}>End Date{!isDetailView ? <span>*</span> : ''}</label>
                        <FormDatePicker label="End date" onDateChange={handleDateChange} initialDate={formData?.to_date} type="to_date" required={true} disabled={formData?.type_of_leave === "Half Day" ? true : isDetailView} restrict={true} fromDate={formData?.from_date} />
                    </div>
                      <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"><CalendarFold size={20} strokeWidth={1.5} /></div>
                        <label>Days</label>
                       <input
                            type="text"
                            name='duration'
                            value={
                                !isDetailView? formData?.from_date && formData?.to_date ? countDay(formData?.from_date, formData?.to_date):'': formData?.duration }
                            disabled
                        />
                    </div>

                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"><CalendarClock size={20} strokeWidth={1.5} /></div>
                        <label className={!isDetailView ? "color_red" : ""}>Full Day/Half Day{!isDetailView ? <span>*</span> : ''}</label>
                        <SelectDropdown
                            ref={type_of_leave_ref}
                            selectedValue={formData?.type_of_leave}
                            options={typeOfLeaveOptions}
                            onSelect={handleSelect}
                            type="type_of_leave"
                            disabled={isDetailView}
                        />
                    </div>

                    <div className="dept-page-input-group attachment_form   ">
                        <div className="dept-page-icon-wrapper"><Proportions size={20} strokeWidth={1.5} /></div>

                        <label>Reason for leave</label>
                        <TextAreaWithLimit
                            name="reason"
                            value={formData?.reason}
                            formsValues={{ handleChange: handleChange, form: formData }}
                            disabled={isDetailView}
                        />
                    </div>
                </div>
            </div>

            {(viewMode === "add") && (
                <SaveBtn
                    handleSubmit={handleSaveOrUpdate}
                    viewMode={viewMode}
                    loading={createLeave?.loading}
                    color="#fff"
                />
            )}

        </>
    )
}
