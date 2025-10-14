// ticket form 
import {
    School,
    Proportions,
    User,
    BookType,
    Contact,
    Calendar,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useRef, useState } from 'react';
import { toast } from "react-toastify";
import { handleFormError, showMasterData } from "../../utils/helper.js";
import { useNavigate, useParams } from 'react-router-dom';
import SaveBtn from '../../utils/common/SaveBtn.jsx';
import SelectDropdown from '../../utils/common/SelectDropdown/SelectDropdown.jsx';
import FormDatePicker from '../../utils/common/FormDatePicker.jsx';
import { UploadFile } from '../../utils/common/UploadFile/UploadFile.jsx';
import TextAreaWithLimit from '../../utils/common/TextAreaWithLimit.jsx';
import { createNewTicket } from '../../Redux/Actions/ticketActions.js';

export const TicketForm = ({ viewMode, formData, setFormData, handleSearch }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [documentUpload, setDocumentUpload] = useState(false);


    //Data from redux
    const createTicket = useSelector((state) => state?.createTicket);
    const employeeData = useSelector((state) => state?.employeeList);
    const employeeList = employeeData?.data?.result;

    const requested_to_ref = useRef(null);
    const priority_ref = useRef(null);

    const priority_options = showMasterData("20");

    const [errors, setErrors] = useState({
        requested_to: false,
        priority: false,
    });

    const basicRequiredFields = [
        {
            key: "requested_to",
            label: "Please Select Requested To",
            required: true,
            ref: requested_to_ref,
        },
        {
            key: "priority",
            label: "Please Select Priority",
            required: true,
            ref: priority_ref,
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
                handleFormError(field?.ref);
                return false;
            }
        }
        return true;
    };

    const handleSelect = (name, item) => {
        if (name === "requested_to_id") {
            setFormData((prevData) => ({
                ...prevData,
                requested_to: item?.label,
                [name]: item?.id,
            }));
        }
        else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: item?.id,
            }));
        }
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
        // Update only basicDetails errors
        setErrors((prevState) => ({
            ...prevState,
            [name]: false, // Clear error for this field
        }));
    };

    const handleDateChange = (name, date) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: date,
        }));
    };

    const handleSaveOrUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const dataToSubmit = {
            requested_to_id: formData?.requested_to_id,
            priority: formData?.priority,
            subject: formData?.subject,
            date: formData?.date,
            description: formData?.description,
            status: 1,
            attachment: formData?.attachment?.length > 0 ? JSON.stringify(formData?.attachment) : "",
        };
        try {
            const res = await dispatch(createNewTicket(dataToSubmit))
            if (res?.status === 200) {
                navigate(`/ticket-list`);
            }
        }
        catch (error) {
            console.log("error-", error);
        };
    };

    const employeeOptions = useMemo(
        () =>
            employeeList?.map((e) => ({
                id: e?.user_id,
                label: [e?.first_name, e?.last_name]
                    .filter(Boolean)
                    .join(" "),
            })),
        [employeeList]
    );

    const isDetailView = viewMode === "detail";

    return (
        <>
            <div className={`dept-page-basic-info-section ${viewMode === "edit" ? "isEditPage" : ""}`}>
               
                <div className="form-grid-layout">
                      <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <BookType size={20} strokeWidth={1.5} />
                        </div>
                        <label>Subject</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData?.subject}
                            onChange={handleChange}
                            disabled={isDetailView}
                        />
                    </div>

                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <User size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}>Requested To
                            {!isDetailView ? <span>*</span> : ''}</label>
                        <SelectDropdown
                            ref={requested_to_ref}
                            selectedValue={formData?.requested_to_id}
                            options={employeeOptions}
                            onSelect={(name, item) => handleSelect("requested_to_id", item)}
                            searchPlaceholder="Search employee"
                            handleSearch={handleSearch}
                            type="user_id"
                            loading={employeeData?.loading}
                            showSearchBar={true}
                            disabled={isDetailView}
                            selectedName={formData?.requested_to ?? ""}
                        />

                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <School size={20} strokeWidth={1.5} />
                        </div>
                        <label className={!isDetailView ? "color_red" : ""}>Priority{!isDetailView ? <span>*</span> : ''}</label>
                        <SelectDropdown
                            ref={priority_ref}
                            selectedValue={formData?.priority}
                            options={priority_options}
                            onSelect={handleSelect}
                            type="priority"
                            disabled={isDetailView}
                            selectedName={priority_options?.find(item => item?.id == formData?.priority)?.label || ""}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <Calendar size={20} strokeWidth={1.5} />
                        </div>
                        <label>Date</label>
                        <FormDatePicker
                            label="Date"
                            onDateChange={handleDateChange}
                            initialDate={formData?.date}
                            type="date"
                            disabled={isDetailView}
                            restrict={true}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <Proportions size={20} strokeWidth={1.5} />
                        </div>
                        <label>Description</label>
                        <TextAreaWithLimit
                            name="description"
                            value={formData?.description}
                            formsValues={{ handleChange: handleChange, form: formData }}
                            disabled={isDetailView}
                        />
                    </div>
                    <div className="dept-page-input-group attachment_form">
                        <div className="dept-page-icon-wrapper">
                            <Contact size={20} strokeWidth={1.5} />
                        </div>
                        <label>Attachments</label>
                        <UploadFile
                            formData={formData}
                            setFormData={setFormData}
                            fieldName="attachment"
                            multiple={false}
                            isDetailView={isDetailView}
                            setDocumentUpload={setDocumentUpload}

                        />
                    </div>
                </div>
            </div>

            {(viewMode === "add") && (
                <SaveBtn
                    handleSubmit={handleSaveOrUpdate}
                    viewMode={viewMode}
                    loading={createTicket?.loading}
                    color="#fff"
                    isDisabled={documentUpload}
                />
            )}
        </>
    )
}
