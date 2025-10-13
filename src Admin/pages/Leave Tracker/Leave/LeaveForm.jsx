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

export const LeaveForm = ({ viewMode, formData, setFormData, handleSearch }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams();

    // Redux 
    const createLeave = useSelector((state) => state?.createLeave);
    const employeeData = useSelector((state) => state?.employeeList);
    const employeeLists = employeeData?.data?.result;

    const employeeOptions = useMemo(
        () => employeeLists?.map(e => ({
            id: e?.employee?.user_id, label: [e?.employee?.first_name, e?.employee?.last_name]
                .filter(Boolean)
                .join(" "),
        })),
        [employeeLists]
    );

    const leaveMasterData = useSelector((state) => state?.leaveMasterList);
    const leaveMasterList = leaveMasterData?.data?.result || [];
    const leaveLoading = leaveMasterData?.loading || false;

    const leaveTypeOptions = useMemo(
        () => leaveMasterList?.map(e => ({
            id: e?.id, label: e?.leave_name,
        })),
        [leaveMasterList]
    );

    const user_ref = useRef(null);
    const leave_type_ref = useRef(null);
    const type_of_leave_ref = useRef(null);

    const [errors, setErrors] = useState({
        user_id: false,
        leave_type_id: false,
        type_of_leave: false,
        from_date: false,
        to_date: false
    });

    const basicRequiredFields = [
        {
            key: "user_id",
            label: "Please Select Employee",
            required: true,
            ref: user_ref,
        },
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

    const typeOfLeaveOptions = [
        { id: 1, label: "Full Day" },
        { id: 2, label: "Half Day" }
    ]

    const isDetailView = viewMode === "detail";

    const handleSaveOrUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const calculatedDays = calculateDuration(formData?.from_date, formData?.to_date)
        const dataToSubmit = {
            user_id: formData?.user_id,
            leave_type_id: formData?.leave_type_id,
            from_date: formData?.from_date,
            to_date: formData?.to_date,
            // duration: calculatedDays,
            reason: formData?.reason,
            type_of_leave: formData?.type_of_leave,
            status: formData?.status
        };
        if (viewMode === "edit") {
            dataToSubmit["id"] = id;
        }
        try {
            const res = await dispatch(createNewLeave(dataToSubmit))
            if (res?.status === 200) {
                navigate(id ? `/leave-details/${id}` : `/leave-list`);
                if (id) dispatch(getLeaveDetails({ id }));
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
                    <h3>Basic Information</h3>
                    <p className="dept-page-subtitle">{viewMode !== "detail"? "Please Provide" :''} Leaves Basic Details Below</p>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"><User size={20} strokeWidth={1.5} /></div>
                        <label className={!isDetailView ? "color_red" : ""}>Employee{!isDetailView ? <span>*</span> : ''}</label>
                        <SelectDropdown
                            ref={user_ref}
                            selectedValue={formData?.user_id}
                            options={employeeOptions}
                            onSelect={handleSelect}
                            searchPlaceholder="Search Employee"
                            handleSearch={handleSearch}
                            type="user_id"
                            loading={employeeData?.loading}
                            showSearchBar={true}
                            disabled={isDetailView}
                            selectedName={formData?.user_name}
                        />
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

            {(viewMode === "add" || viewMode === "edit") && (
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
