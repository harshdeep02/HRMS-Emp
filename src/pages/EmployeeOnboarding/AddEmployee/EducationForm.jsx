import { useState, useEffect } from 'react';
import './AddEmloyee.scss';
import './NavbarForm.scss';
import { toast } from "react-toastify";
import { FolderPen, Pencil, School, ScrollText, Wallpaper, Trash2, FileUp, Eye, X, CirclePlus, Calendar } from 'lucide-react';
import FormDatePicker from '../../../utils/common/FormDatePicker';
import { DocumentUpload } from '../../../utils/common/DocumentUpload/DocumentUpload';
import { showMasterData, showMastersValue } from '../../../utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import SelectDropdown from '../../../utils/common/SelectDropdown/SelectDropdown';
import SaveButton from '../../../utils/common/SaveButton.jsx';
import ConfirmPopup from '../../../utils/common/ConfirmPopup.jsx';
import { useNavigate } from 'react-router-dom';
import { addEmpEducation, removeEmpEducation } from '../../../Redux/Actions/employeeActions.js';
import ListDataNotFound from '../../../utils/common/ListDataNotFound.jsx';

const initialEducationState = {
    institute_name: "",
    education_level: "",
    degree: "",
    specialization: "",
    certificate_attachment: null,
    date_of_completion: null,
    from_date: null,
    to_date: null
};

const EducationForm = ({ isEditPage, isEditMode, setIsEditMode, formData, setFormData, id }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [currentEducation, setCurrentEducation] = useState(initialEducationState);
    const [editingIndex, setEditingIndex] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedEduId, setSelectedEduId] = useState(null);


    const [isPopupEditable, setIsPopupEditable] = useState(false);

    const edu_level_options = showMasterData("8");
    const degree_options = showMasterData("9");
    const specialization_options = showMasterData("10");
    const masterData = useSelector(state => state?.masterData?.data);

    const addUpdateEducation = useSelector((state) => state?.addEmpEducation);
    const deleteEducation = useSelector((state) => state?.deleteEmpEducation);

    useEffect(() => {
        if (editingIndex !== null) {
            setCurrentEducation(formData?.educations[editingIndex]);
            window.scrollTo(0, 0);
        }
    }, [editingIndex, formData?.educations]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentEducation(prev => ({ ...prev, [name]: value }));
    };

    const handleSelect = (name, value) => {
        setCurrentEducation((prev) => ({ ...prev, [name]: value?.id }));
    };

    const handleDateChange = (name, date) => {
        const { from_date, to_date } = currentEducation;
        const parsedDate = new Date(date.split('-').reverse().join('-'));
        const parsedFromDate = from_date ? new Date(from_date.split('-').reverse().join('-')) : null;
        const parsedToDate = to_date ? new Date(to_date.split('-').reverse().join('-')) : null;

        if (name === "from_date" && parsedToDate && parsedDate > parsedToDate) {
            toast.error("From date cannot be later than the to date.");
            return;
        }
        if (name === "to_date" && parsedFromDate && parsedDate < parsedFromDate) {
            toast.error("To date cannot be earlier than the from date.");
            return;
        }
        setCurrentEducation(prev => ({ ...prev, [name]: date }));
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setCurrentEducation(formData?.educations[index]);
        setIsPopupEditable(true); // Set popup to editable
        setShowPopup(true);
        setIsEditMode(true);
        navigate(`/edit-employee/${id}`);
    };

    const handleNew = () => {
        setEditingIndex(null);
        setCurrentEducation(initialEducationState);
        setIsPopupEditable(true); // Set popup to editable
        setShowPopup(true);
        setIsEditMode(true);
    };

    const handleView = (index) => {
        setEditingIndex(index);
        setCurrentEducation(formData?.educations[index]);
        setIsPopupEditable(false); // Set popup to view-only
        setShowPopup(true);
    };

    const handleDeleteClick = (edu_id) => {
        setSelectedEduId(edu_id);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedEduId) return;
        const sendData = { user_id: id, education_id: selectedEduId };
        dispatch(removeEmpEducation(sendData)).then((res) => {
            if (res?.success) {
                setFormData(prev => ({ ...prev, educations: res?.educations }));
                setShowModal(false);
                setSelectedEduId(null);
            }
        });
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setCurrentEducation(initialEducationState);
        setShowPopup(false);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!currentEducation?.institute_name || !currentEducation?.degree) {
            toast.error("Institute Name and Degree are required.");
            return;
        }
        const formDataToSubmit = {
            user_id: id,
            educations: [{
                ...currentEducation,
                certificate_attachment:
                    typeof currentEducation.certificate_attachment === "string"
                        ? currentEducation.certificate_attachment
                        : currentEducation.certificate_attachment
                            ? JSON.stringify(currentEducation.certificate_attachment)
                            : null
            }]
        };
        dispatch(addEmpEducation(formDataToSubmit)).then((res) => {
            if (res?.success) {
                navigate(`/employee-details/${id}`);
                setFormData(prev => ({
                    ...prev,
                    educations: res?.educations
                }));
                handleCancel();
            }
        });
    };

    const [showMasterPopUp, setShowMasterPopUp] = useState(false)
    const [masterValue, setMasterValue] = useState({});
    const handleAddNewValue = (id, name) => {
        setMasterValue({ id: id, label: name })
        setShowMasterPopUp(true);
        // You can also add more complex logic here, like opening a modal or API calls.
    };

    return (
        <>
            {showModal &&
                <ConfirmPopup
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleConfirmDelete}
                    type="delete"
                    module="Education"
                    loading={deleteEducation?.loading}
                />
            }
            <div
                id="Education_form_container"
                className={` ${isEditPage ? 'isEditPage' : ''}  ${showPopup ? "popup-overlay " : "Dcumnet_forms"} ${showPopup ? "active" : ""}`}
            >
                <div className={`${showPopup ? 'popup-content' : ''}`}>
                    <div id='form' className='bEdit'>
                        <div className='div_heading head_pop'>
                            <div>
                                <h2>Education Details</h2>
                                <p className='ppp'>Basic education overview</p>
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
                                <button className="action-btn edit_btn" onClick={() => { setIsEditMode(true); navigate(`/edit-employee/${id}`) }}>
                                    Edit
                                </button>
                            </div>
                        )}

                        {showPopup &&
                            <>
                                <div className="from1">
                                    <div className="form-group">
                                        <label><School size={20} />Education Level</label>
                                        <SelectDropdown
                                            selectedValue={currentEducation?.education_level}
                                            options={edu_level_options}
                                            onSelect={handleSelect}
                                            type="education_level"
                                            disabled={!isPopupEditable}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><ScrollText size={20} />Degree</label>
                                        <SelectDropdown
                                            selectedValue={currentEducation?.degree}
                                            options={degree_options}
                                            onSelect={handleSelect}
                                            type="degree"
                                            disabled={!isPopupEditable}
                                            onAddClick={() => handleAddNewValue(9, "Degree")}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><Wallpaper size={20} />Specialization</label>
                                        <SelectDropdown
                                            selectedValue={currentEducation?.specialization}
                                            options={specialization_options}
                                            onSelect={handleSelect}
                                            type="specialization"
                                            disabled={!isPopupEditable}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><FolderPen size={20} />Institute Name</label>
                                        <input
                                            type="text"
                                            name="institute_name"
                                            value={currentEducation?.institute_name}
                                            onChange={handleChange}
                                            disabled={!isPopupEditable}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label> <Calendar size={20} strokeWidth={1.25} /> <p>From Date</p></label>
                                        <FormDatePicker
                                            label="From Date"
                                            onDateChange={handleDateChange}
                                            initialDate={currentEducation?.from_date}
                                            type="from_date"
                                            disabled={!isPopupEditable}
                                            toDate={currentEducation?.to_date}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label> <Calendar size={20} strokeWidth={1.25} /> <p>To Date</p></label>
                                        <FormDatePicker
                                            label="To Date"
                                            onDateChange={handleDateChange}
                                            initialDate={currentEducation?.to_date}
                                            type="to_date"
                                            disabled={!isPopupEditable}
                                            fromDate={currentEducation?.from_date}
                                        />
                                    </div>
                                    <div className="form-group attachment_form">
                                        <label><FileUp size={20} /> Upload Certificate</label>
                                        <DocumentUpload
                                            formData={{ educations: [currentEducation] }}
                                            setFormData={(data) => setCurrentEducation(data?.educations[0])}
                                            loading={imageUploading}
                                            setLoading={setImageUploading}
                                            section="educations"
                                            index={0}
                                            fieldName="certificate_attachment"
                                            fileName="Upload Document"
                                            className='full_w'
                                            disabled={!isPopupEditable}
                                        />
                                    </div>
                                </div>

                                {isPopupEditable &&
                                    <div className="form-actions-footer">
                                        <SaveButton
                                            loading={addUpdateEducation?.loading}
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
                            {formData?.educations?.length > 0 &&
                                formData?.educations?.map((edu, index) => (
                                    <div className="saved-list-container" key={index}>
                                        <div className={`saved-experience-item ${!isEditMode ? 'isEditMode_card_item' : ''}`}>
                                            <div className="item-details">
                                                <p className="item-company">{edu?.institute_name}</p>
                                                <p className="item-role-dates">
                                                    {showMastersValue(masterData, "9", edu?.degree)}
                                                    {(edu?.from_date || edu?.to_date) ? (
                                                        <> | {edu?.from_date || "---"} To {edu?.to_date || "---"}</>
                                                    ) : null}
                                                </p>

                                            </div>
                                            <div className="item-actions">
                                                {isEditMode ?
                                                    <>
                                                        <div onClick={() => handleEdit(index)} className="action-btn edit-btn">
                                                            <Pencil size={16} /> Edit
                                                        </div>
                                                        <div onClick={() => handleDeleteClick(edu?.id)} className="action-btn delete-btn">
                                                            <Trash2 size={16} /> Delete
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <div onClick={() => handleView(index)} className="action-btn edit-btn">
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
                    <ListDataNotFound module="Education" form={true} />
                )}
            </div>
        </>

    );
};

export default EducationForm;