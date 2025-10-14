import {
    CalendarMinus,
    Proportions,
    Calendar
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import { calculateDuration, handleFormError } from "../../../utils/helper.js";
import { useNavigate, useParams } from 'react-router-dom';
import SaveBtn from '../../../utils/common/SaveBtn.jsx';
import FormDatePicker from '../../../utils/common/FormDatePicker';
import { createNewHoliday, getHolidayDetails } from '../../../Redux/Actions/holidayActions.js';
import TextAreaWithLimit from '../../../utils/common/TextAreaWithLimit.jsx';
import { toast } from 'react-toastify';
import { formatDate2 } from '../../../utils/common/DateTimeFormat.js';

const HolidayForm = ({ viewMode, formData, setFormData }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    //Data from redux
    const createHoliday = useSelector((state) => state?.createHoliday);

    const holiday_ref = useRef(null);

    const [errors, setErrors] = useState({
        holiday_name: false,
    });

    const basicRequiredFields = [
        { key: "holiday_name", label: "Please Fill Holiday Name", required: true, ref: holiday_ref },
    ];

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


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Update only basicDetails errors
        setErrors((prevState) => ({
            ...prevState,
            [name]: false, // Clear error for this field
        }));
    };

    const handleDateChange = (name, date) => {
        const { from_date, to_date } = formData;

        const parsedDate = new Date(date.split("-").reverse().join("-"));
        const parsedFromDate = from_date
            ? new Date(from_date.split("-").reverse().join("-"))
            : null;
        const parsedToDate = to_date
            ? new Date(to_date.split("-").reverse().join("-"))
            : null;

        if (name === "from_date" && parsedToDate && parsedDate > parsedToDate) {
            toast.error("From date cannot be later than the to date.");
            return;
        }
        if (name === "to_date" && parsedFromDate && parsedDate < parsedFromDate) {
            toast.error("To date cannot be earlier than the from date.");
            return;
        }

        const newFromDate = name === "from_date" ? date : from_date;
        const newToDate = name === "to_date" ? date : to_date;

        setFormData((prev) => ({
            ...prev,
            [name]: date,
            duration: calculateDuration(newFromDate, newToDate),
        }));
    };

    const handleSaveOrUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSubmit = {
            ...formData,
            from_date: formatDate2(formData?.from_date),
            to_date: formatDate2(formData?.to_date),
        };
        if (viewMode === 'edit') {
            formDataToSubmit["id"] = id;
        }

        dispatch(createNewHoliday(formDataToSubmit))
            .then((res) => {
                if (res?.status === 200) {
                    navigate(id ? `/holiday-details/${id}` : `/holiday-list`);
                    if (id) dispatch(getHolidayDetails({ id }));
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });
    };

    const isDetailView = viewMode === "detail";

    return (
        <>
            <div className={`dept-page-basic-info-section ${viewMode === "edit" ? "isEditPage" : ""}`}>
                {/* <h3>Basic Information</h3>
                <p className="dept-page-subtitle">Please Provide Holiday Basic Details Below.</p> */}
                <div className="form-grid-layout">

                    <div className={`dept-page-input-group ${viewMode === "edit" && "disableBackground"}`}>
                        <div className={`dept-page-icon-wrapper`}><CalendarMinus size={20} strokeWidth={1.5} /></div>
                        <label className={!isDetailView ? "redCol" : ''}>Holiday Name{!isDetailView ? <span className='redCol mandat'> *</span> : ''}</label>
                        <input
                            type="text"
                            name='holiday_name'
                            value={formData?.holiday_name}
                            onChange={(e) => handleChange(e)}
                            disabled={isDetailView}
                            ref={holiday_ref}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"  >
                            <Calendar size={20} strokeWidth={1.25} />
                        </div>
                        <label >From Date</label>
                        <FormDatePicker
                            label="From Date"
                            onDateChange={handleDateChange}
                            initialDate={formData?.from_date}
                            type="from_date"
                            disabled={isDetailView}
                            toDate={formData?.to_date}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"  >
                            <Calendar size={20} strokeWidth={1.25} />
                        </div>
                        <label >To Date</label>
                        <FormDatePicker
                            label="To Date"
                            onDateChange={handleDateChange}
                            initialDate={formData?.to_date}
                            type="to_date"
                            disabled={isDetailView}
                            fromDate={formData?.from_date}
                        />
                    </div>
                    <div className={`dept-page-input-group  attachment_form ${viewMode === "edit" && "disableBackground"}`}>
                        <div className="dept-page-icon-wrapper"><Proportions size={20} strokeWidth={1.5} /></div>
                        <label >Description</label>
                        <TextAreaWithLimit
                            name="description"
                            value={formData?.description}
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
                    loading={createHoliday?.loading}
                    color="#fff"
                    btntype='buttom_fix_btn'

                />
            )}
        </>
    );
};

export default HolidayForm;