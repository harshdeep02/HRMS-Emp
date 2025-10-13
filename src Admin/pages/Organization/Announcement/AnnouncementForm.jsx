import {
    BookA,
    BellRing,
    FileUp,
    MailIcon,
    Proportions,
    Calendar,
    AppWindowMac,
    Bell
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useRef, useState } from 'react';
import { handleFormError } from "../../../utils/helper.js";
import { useNavigate, useParams } from 'react-router-dom';
import SaveBtn from '../../../utils/common/SaveBtn.jsx';
import FormDatePicker from '../../../utils/common/FormDatePicker';
import { UploadFile } from '../../../utils/common/UploadFile/UploadFile';
import { createNewAnnouncement, getAnnouncementDetails } from '../../../Redux/Actions/announcementActions';
import { toast } from 'react-toastify';
import TextAreaWithLimit from '../../../utils/common/TextAreaWithLimit.jsx';
import SelectDropdown from '../../../utils/common/SelectDropdown/SelectDropdown.jsx';


const AnnouncementForm = ({ viewMode, formData, setFormData, handleSearch }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    //Data from redux
    const createAnnouncement = useSelector((state) => state?.createAnnouncement);
    const announcementData = useSelector((state) => state?.announcementDetails);
    const announcementDetails = announcementData?.data?.announcement;

    const departmentData = useSelector((state) => state?.departmentList);
    const departmentLists = departmentData?.data?.department || [];

    const departmentOptions = useMemo(
        () => departmentLists?.map(d => ({ id: d.id, label: d.department_name })),
        [departmentLists]
    );
    const subject_ref = useRef(null);
    const department_ref = useRef(null);
    const notify_other_ref = useRef(null);

    const [errors, setErrors] = useState({
        subject: false,
        notify_any_others: false,
    });

    const validateEmails = (emails) => {
        if (!emails) return true; // empty is allowed, required check handles emptiness
        const emailArray = emails.split(',').map((email) => email.trim());
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailArray.every((email) => emailRegex.test(email));
    };

    const basicRequiredFields = [
        { key: "subject", label: "Please fill Subject", required: true, ref: subject_ref },
        { key: "notify_any_others", label: "Please enter valid emails", required: false, ref: notify_other_ref },
    ];

    const validateForm = () => {
        // loop for required checks
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

        // extra check for email validity
        if (formData?.notify_any_others && !validateEmails(formData?.notify_any_others)) {
            setErrors((prev) => ({
                ...prev,
                notify_any_others: true,
            }));
            toast.error("Please enter valid emails (comma separated)");
            handleFormError(notify_other_ref);
            return false;
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
        setFormData(prevData => ({
            ...prevData,
            [name]: item?.id,
        }));
        setErrors(prev => ({
            ...prev,
            [name]: false,
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

        const formDataToSubmit = {
            ...formData,
            attachment: formData?.attachment?.length > 0 ? JSON.stringify(formData?.attachment) : "",
            notify_any_others: formData?.notify_any_others ? JSON.stringify(formData?.notify_any_others) : "",
        };

        if (viewMode === 'edit') {
            formDataToSubmit["id"] = id;
        }

        dispatch(createNewAnnouncement(formDataToSubmit))
            .then((res) => {
                if (res?.status === 200) {
                    navigate(id ? `/announcement-details/${id}` : `/announcement-list`);
                    if (id) dispatch(getAnnouncementDetails({ id }));
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });
    };

    const isDetailView = viewMode === "detail";

    const notifyAllOptions = [
        { id: 1, label: "Yes" },
        { id: 2, label: "No" },
    ]

    return (
        <>
            <div className={`dept-page-basic-info-section ${viewMode === "edit" ? "isEditPage" : ""}`}>
                {/* <h3>Basic Information</h3>
                <p className="dept-page-subtitle">Please provide employees basic details below.</p> */}
                <div className="form-grid-layout">

                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"><AppWindowMac size={20} strokeWidth={1.5} /></div>
                        <label className={viewMode !== "detail" ? 'color_red' : ""}>Department{viewMode !== "detail" && <b className='color_red'>*</b>}</label>
                        <SelectDropdown
                            ref={department_ref}
                            selectedValue={formData?.department_id}
                            options={departmentOptions}
                            onSelect={handleSelect}
                            searchPlaceholder="Search department"
                            handleSearch={handleSearch}
                            type="department_id"
                            loading={departmentData?.loading}
                            showSearchBar={true}
                            disabled={viewMode === 'detail'}
                            selectedName={formData?.department_name ?? ""}
                        />
                    </div>

                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"><BookA size={20} strokeWidth={1.5} /></div>
                        <label className={viewMode !== "detail" ? "color_red" : ''}>Subject{viewMode !== "detail" && <b className='color_red'>*</b>}</label>
                        <input
                            type="text"
                            name='subject'
                            value={formData?.subject}
                            onChange={(e) => handleChange(e)}
                            disabled={isDetailView}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"  >
                            <Calendar size={20} strokeWidth={1.25} />
                        </div>
                        <label >Expiry Date</label>
                        <FormDatePicker label="Expiry date" onDateChange={handleDateChange} initialDate={formData?.expiry} type="expiry" disabled={isDetailView} />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <BellRing size={20} strokeWidth={1.5} />
                        </div>
                        <label>
                            Notify All Employees</label>
                        <SelectDropdown
                            selectedValue={formData?.notify_all}
                            options={notifyAllOptions}
                            onSelect={handleSelect}
                            type="notify_all"
                            disabled={isDetailView}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"><MailIcon size={20} strokeWidth={1.5} /></div>

                        <label>Notify Other Email ID </label>
                        <input
                            ref={notify_other_ref}
                            name='notify_any_others'
                            value={formData?.notify_any_others}
                            onChange={(e) => handleChange(e)}
                            disabled={isDetailView}
                            className="text-area-disabled"
                        />
                    </div>
                    {/* <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"><Proportions size={20} strokeWidth={1.5} /></div>
                        <label >Description</label>
                        <textarea
                            cols={20}
                            rows={10}
                            name='description'
                            value={formData?.description}
                            disabled={isDetailView}
                            onChange={(e) => handleChange(e)}
                            className="text-area-disabled"
                        />

                    </div> */}
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"><Proportions size={20} strokeWidth={1.5} /></div>
                        <label>Description</label>
                        {viewMode === 'detail' ? (
                            <textarea
                                value={formData?.description || '-'}
                                disabled
                                className="text-area-disabled"
                            />
                        ) : (
                            <TextAreaWithLimit
                                name="description"
                                value={formData?.description}
                                formsValues={{
                                    handleChange: handleChange,
                                    form: formData
                                }}
                            />
                        )}
                    </div>
                    <div className="dept-page-input-group attachment_form">
                        <div className="dept-page-icon-wrapper"><FileUp size={20} strokeWidth={1.5} /></div>
                        <label>Attachment</label>
                        <UploadFile
                            formData={formData}
                            setFormData={setFormData}
                            fieldName="attachment"
                            multiple={false}
                            isDetailView={isDetailView}
                        />

                    </div>
                </div>
            </div>

            {(viewMode === "add" || viewMode === "edit") && (
                <SaveBtn
                    handleSubmit={handleSaveOrUpdate}
                    viewMode={viewMode}
                    loading={createAnnouncement?.loading}
                    color="#fff"
                />
            )}
        </>
    );
};

export default AnnouncementForm;