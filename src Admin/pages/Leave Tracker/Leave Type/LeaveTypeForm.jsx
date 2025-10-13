import {
    Calendar1,
    CalendarMinus,
    Proportions
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import { toast } from "react-toastify";
import { handleFormError, showMasterData } from "../../../utils/helper.js";
import { useNavigate, useParams } from 'react-router-dom';
import SaveBtn from '../../../utils/common/SaveBtn.jsx';
import { createNewLeaveType, getLeaveTypeDetails } from '../../../Redux/Actions/leaveMasterActions.js';
import SelectDropdown from '../../../utils/common/SelectDropdown/SelectDropdown.jsx';
import TextAreaWithLimit from '../../../utils/common/TextAreaWithLimit.jsx';

const LeaveTypeForm = ({ viewMode, formData, setFormData }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    //Data from redux
    const createLeaveMaster = useSelector((state) => state?.createLeaveMaster);
    const leave_type_options = showMasterData("21");

    const leave_name_ref = useRef(null);
    const leave_type_ref = useRef(null);
    const available_days_ref = useRef(null);

    const [errors, setErrors] = useState({
        leave_name: false,
        leave_type: false,
        available_days: false
    });

    const basicRequiredFields = [
        { key: "leave_name", label: "Please fill Leave Name", required: true, ref: leave_name_ref },
        { key: "leave_type", label: "Please select Leave Type", required: true, ref: leave_type_ref },
        { key: "available_days", label: "Please fill Available Days", required: true, ref: available_days_ref },
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

    const handleSelect = (name, item) => {
        setFormData((prevState) => ({ ...prevState, [name]: item?.label })
        );
    };

    const handleSaveOrUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSubmit = {
            ...formData,
        };
        if (viewMode === "edit") {
            formDataToSubmit["id"] = id;
        }
        dispatch(createNewLeaveType(formDataToSubmit))
            .then((res) => {
                if (res?.status === 200) {
                    navigate(id ? `/leave-type-details/${id}` : `/leave-type-list`);
                    if (id) dispatch(getLeaveTypeDetails({ id }));
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });
    };

    const isDetailView = viewMode === "detail";

    return (
        <>
            <div className={`dept-page-basic-info-section`}>
                {/* <h3>Basic Information</h3>
                <p className="dept-page-subtitle">Please provide leave type basic details below.</p> */}
                <div className={`dept-page-input-group ${viewMode === "edit" && "disableBackground"}`}>
                    <div className={`dept-page-icon-wrapper`}><CalendarMinus size={20} strokeWidth={1.5} /></div>
                    <label className={!isDetailView && "redCol"}>Leave Type Name{!isDetailView && <span className='redCol mandat'>*</span>}</label>
                    <input
                        type="text"
                        name='leave_name'
                        value={formData?.leave_name}
                        onChange={(e) => handleChange(e)}
                        disabled={isDetailView}
                        ref={leave_name_ref}
                    />
                </div>
                <div className={`dept-page-input-group ${viewMode === "edit" && "disableBackground"}`}>
                    <div className={`dept-page-icon-wrapper`}><CalendarMinus size={20} strokeWidth={1.5} /></div>
                    <label className={!isDetailView && "redCol"}>Leave Type{!isDetailView && <span className='redCol mandat'>*</span>}</label>
                    <SelectDropdown
                        ref={leave_type_ref}
                        selectedValue={formData?.leave_type}
                        options={leave_type_options}
                        onSelect={handleSelect}
                        type="leave_type"
                        disabled={isDetailView}
                        selectedName={leave_type_options?.find(item => item?.label === formData?.leave_type)?.label || ""}
                    />
                </div>
                <div className={`dept-page-input-group ${viewMode === "edit" && "disableBackground"}`}>
                    <div className={`dept-page-icon-wrapper`}><Calendar1 size={20} strokeWidth={1.5} /></div>
                    <label className={!isDetailView && "redCol"}>Available Days{!isDetailView && <span className='redCol mandat'>*</span>}</label>
                    <input
                        type="text"
                        name='available_days'
                        value={formData?.available_days}
                        onChange={(e) => handleChange(e)}
                        disabled={isDetailView}
                        ref={available_days_ref}
                    />
                </div>
                <div className={`dept-page-input-group attachment_form ${viewMode === "edit" && "disableBackground"}`}>
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

            {(viewMode === "add" || viewMode === "edit") && (
                <SaveBtn
                    handleSubmit={handleSaveOrUpdate}
                    viewMode={viewMode}
                    loading={createLeaveMaster?.loading}
                    color="#fff"
                    btntype='buttom_fix_btn'
                />
            )}
        </>
    );
};

export default LeaveTypeForm;