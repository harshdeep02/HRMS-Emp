import { useState, useEffect } from "react";
import "./AddEmloyee.scss";
import "./NavbarForm.scss";
import { toast } from "react-toastify";
import { Pencil, Trash2, FolderPen, School, Briefcase, Info, LucideUploadCloud, Eye, X, CirclePlus, Calendar } from "lucide-react";
import { calculateDuration, showMasterData, showMastersValue } from "../../../utils/helper.js";
import FormDatePicker from "../../../utils/common/FormDatePicker.jsx";
import TextAreaWithLimit from "../../../utils/common/TextAreaWithLimit.jsx";
import { DocumentUpload } from "../../../utils/common/DocumentUpload/DocumentUpload.jsx";
import SelectDropdown from "../../../utils/common/SelectDropdown/SelectDropdown.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addEmpExperience, removeEmpExperience } from "../../../Redux/Actions/employeeActions.js";
import SaveButton from "../../../utils/common/SaveButton.jsx";
import ConfirmPopup from "../../../utils/common/ConfirmPopup.jsx";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import { AddMasterValuePopup } from '../../Master/AddMasterValuePopup.jsx';

const initialExperienceState = {
    company_name: "",
    industry: "",
    job_title: "",
    duration: null,
    from_date: null,
    to_date: null,
    description: "",
    experience_letter: null,
};

const ExperienceForm = ({ isEditPage, isEditMode, setIsEditMode, formData, setFormData, id }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const addUpdateExperience = useSelector((state) => state?.addEmpExperience);
    const deleteExperience = useSelector((state) => state?.deleteEmpExperience);
    const masterData = useSelector((state) => state?.masterData?.data);

    const [currentExperience, setCurrentExperience] = useState(initialExperienceState);
    const [editingIndex, setEditingIndex] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedExpId, setSelectedExpId] = useState(null);

    // ✅ FIX: Added new state to manage the popup's mode (edit/view) independently.
    const [isPopupEditable, setIsPopupEditable] = useState(false);

    const job_title_options = showMasterData("7");

    // Autofill on edit
    useEffect(() => {
        if (editingIndex !== null) {
            setCurrentExperience(formData?.experiences[editingIndex]);
            window.scrollTo(0, 0);
        }
    }, [editingIndex, formData?.experiences]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCurrentExperience((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelect = (name, value) => {
        setCurrentExperience((prev) => ({ ...prev, [name]: value?.id }));
    };

    const handleDateChange = (name, date) => {
        const { from_date, to_date } = currentExperience;

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

        setCurrentExperience((prev) => ({
            ...prev,
            [name]: date,
            duration: calculateDuration(newFromDate, newToDate),
        }));
    };

    // ✅ FIX: Now correctly sets the popup to be editable.
    const handleEdit = (index) => {
        setEditingIndex(index);
        setCurrentExperience(formData?.experiences[index]);
        setIsPopupEditable(true);
        setShowPopup(true);
        setIsEditMode(true);
        navigate(`/edit-employee/${id}`);
    };

    // ✅ FIX: Now correctly sets the popup to be editable for a new entry.
    const handleNew = () => {
        setEditingIndex(null);
        setCurrentExperience(initialExperienceState);
        setIsPopupEditable(true);
        setShowPopup(true);
        setIsEditMode(true);
    };

    // ✅ FIX: Now correctly sets the popup to be non-editable (view-only).
    const handleView = (index) => {
        setEditingIndex(index);
        setCurrentExperience(formData?.experiences[index]);
        setIsPopupEditable(false);
        setShowPopup(true);
    };

    const handleDeleteClick = (exp_id) => {
        setSelectedExpId(exp_id);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedExpId) return;
        const sendData = { user_id: id, experience_id: selectedExpId };
        dispatch(removeEmpExperience(sendData)).then((res) => {
            if (res?.success) {
                setFormData((prev) => ({ ...prev, experiences: res?.experiences }));
                setShowModal(false);
                setSelectedExpId(null);
            }
        });
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setCurrentExperience(initialExperienceState);
        setShowPopup(false);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!currentExperience?.company_name || !currentExperience?.job_title) {
            toast.error("Company Name and Job Title are required.");
            return;
        }
        const formDataToSubmit = {
            user_id: id,
            experiences: [{
                ...currentExperience,
                experience_letter: typeof currentExperience?.experience_letter === "string" ? currentExperience?.experience_letter : currentExperience?.experience_letter ? JSON.stringify(currentExperience?.experience_letter) : null
            }]
        };
        dispatch(addEmpExperience(formDataToSubmit)).then((res) => {
            if (res?.success) {
                navigate(`/employee-details/${id}`);
                setFormData((prev) => ({ ...prev, experiences: res?.experiences }));
                handleCancel();
            }
        });
    };

    const [showMasterPopUp, setShowMasterPopUp] = useState(false)
    const [masterValue, setMasterValue] = useState({});
    const handleAddNewOption = (id, name) => {
        setMasterValue({ id: id, label: name })
        setShowMasterPopUp(true);
        // You can also add more complex logic here, like opening a modal or API calls.
    };

    return (
        <>
            {showMasterPopUp && <AddMasterValuePopup field={masterValue?.label} id={masterValue?.id} setShowMasterPopUp={setShowMasterPopUp} />}
            {showModal &&
                <ConfirmPopup
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleConfirmDelete}
                    type="delete"
                    module="Experience"
                    loading={deleteExperience?.loading}
                />
            }
            <div id="Experience_form_container" className={` ${isEditPage ? 'isEditPage' : ''}  ${showPopup ? "popup-overlay " : "Dcumnet_forms"} ${showPopup ? "active" : ""}`}>
                <div className={`${showPopup ? "popup-content" : ""}`} >
                    <div id="form" className="bEdit">
                        <div className="div_heading head_pop">
                            <div>
                                <h2>Experience Details</h2>
                                <p className="ppp">Basic employment overview</p>
                            </div>
                            {showPopup &&
                                <div
                                    onClick={handleCancel}
                                    className="action-btn close-btn">
                                    <X size={22} />
                                </div>
                            }
                            {isEditMode && !showPopup &&
                                <div
                                    onClick={() => handleNew()}
                                    className="action-btn add-btn">
                                    <CirclePlus size={20} /> Add
                                </div>
                            }
                        </div>
                        {!showPopup && !isEditMode && (
                            <div className="header-actions">
                                <button
                                    className="action-btn edit_btn"
                                    onClick={() => {
                                        setIsEditMode(true);
                                        navigate(`/edit-employee/${id}`);
                                    }}>
                                    Edit
                                </button>
                            </div>
                        )}
                        {showPopup &&
                            <>
                                <div className="from1">
                                    <div className="form-group">
                                        <label>
                                            <FolderPen size={20} />
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            name="company_name"
                                            value={currentExperience?.company_name}
                                            onChange={handleChange}
                                            // ✅ FIX: Changed to use isPopupEditable
                                            disabled={!isPopupEditable}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <School size={20} />
                                            Industry
                                        </label>
                                        <input
                                            type="text"
                                            name="industry"
                                            value={currentExperience?.industry}
                                            onChange={handleChange}
                                            // ✅ FIX: Changed to use isPopupEditable
                                            disabled={!isPopupEditable}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <Briefcase size={20} />
                                            Job Title
                                        </label>
                                        <SelectDropdown
                                            selectedValue={currentExperience?.job_title}
                                            options={job_title_options}
                                            onSelect={handleSelect}
                                            type="job_title"
                                            // ✅ FIX: Changed to use isPopupEditable
                                            disabled={!isPopupEditable}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label> <Calendar size={20} strokeWidth={1.25} /> <p>From Date</p></label>

                                        <FormDatePicker
                                            label="From Date"
                                            onDateChange={handleDateChange}
                                            initialDate={currentExperience?.from_date}
                                            type="from_date"
                                            // ✅ FIX: Changed to use isPopupEditable
                                            disabled={!isPopupEditable}
                                            toDate={currentExperience?.to_date}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label> <Calendar size={20} strokeWidth={1.25} /> <p>To Date</p></label>
                                        <FormDatePicker
                                            label="To Date"
                                            onDateChange={handleDateChange}
                                            initialDate={currentExperience?.to_date}
                                            type="to_date"
                                            // ✅ FIX: Changed to use isPopupEditable
                                            disabled={!isPopupEditable}
                                            fromDate={currentExperience?.from_date}
                                        />
                                    </div>

                                    <div className="form-group attachment_form">
                                        <label>
                                            <Info size={20} />
                                            Description
                                        </label>
                                        <TextAreaWithLimit
                                            name="description"
                                            value={currentExperience?.description}
                                            formsValues={{
                                                handleChange: handleChange,
                                                form: currentExperience,
                                            }}
                                            // ✅ FIX: Changed to use isPopupEditable
                                            disabled={!isPopupEditable}
                                        />
                                    </div>

                                    <div className="form-group attachment_form">
                                        <label>
                                            <LucideUploadCloud size={20} />
                                            Upload Experience Certificate
                                        </label>
                                        <DocumentUpload
                                            formData={{ experiences: [currentExperience] }}
                                            setFormData={(data) =>
                                                setCurrentExperience(data?.experiences[0])
                                            }
                                            loading={imageUploading}
                                            setLoading={setImageUploading}
                                            section="experiences"
                                            index={0}
                                            fieldName="experience_letter"
                                            fileName="Upload Document"
                                            className="full_w"
                                            // ✅ FIX: Removed redundant prop. The disabled prop now controls everything.
                                            // isEditPage={isEditPage}
                                            // ✅ FIX: Changed to use isPopupEditable for correct behavior
                                            disabled={!isPopupEditable}
                                        />
                                    </div>
                                </div>

                                {/* ✅ FIX: Changed to use isPopupEditable to show save/cancel buttons */}
                                {isPopupEditable &&
                                    <div className="form-actions-footer">
                                        <SaveButton
                                            loading={addUpdateExperience?.loading}
                                            editingIndex={editingIndex}
                                            handleSubmit={handleSave}
                                            handleCancel={handleCancel}
                                            class="btn_submit_fix"
                                        />
                                    </div>
                                }
                            </>
                        }
                    </div>

                    {!showPopup && (
                        <>
                            <hr style={{ marginBottom: '0px' }} className='hr_line' />
                            {formData?.experiences?.length > 0 &&
                                formData?.experiences?.map((exp, index) => (
                                    <div className="saved-list-container" key={index}>
                                        <div className={`saved-experience-item ${!isEditMode ? 'isEditMode_card_item' : ''}`}>
                                            <div className="item-details">
                                                <p className="item-company">{exp?.company_name}</p>
                                                <p className="item-role-dates">
                                                    {showMastersValue(masterData, "7", exp?.job_title)}
                                                    {(exp?.from_date || exp?.to_date) ? (
                                                        <> | {exp?.from_date || "---"} To {exp?.to_date || "---"}</>
                                                    ) : null}
                                                </p>
                                            </div>
                                            <div className="item-actions">
                                                {isEditMode ?
                                                    <>
                                                        <div
                                                            onClick={() => handleEdit(index)}
                                                            className="action-btn edit-btn">
                                                            Edit
                                                        </div>
                                                        <div
                                                            onClick={() => handleDeleteClick(exp?.id)}
                                                            className="action-btn delete-btn">
                                                            <Trash2 size={16} /> Delete
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <div
                                                            onClick={() => handleView(index)}
                                                            className="action-btn edit-btn">
                                                            <Eye size={16} /> View
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </>
                    )}
                </div>
                {formData?.experiences?.length === 0 && !showModal && !showPopup && (
                    <ListDataNotFound module="Experience" form={true} />
                )}

            </div>
        </>
    );
};

export default ExperienceForm;