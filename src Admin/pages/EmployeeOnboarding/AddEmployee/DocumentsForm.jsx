import { useState, useEffect } from "react";
import "./AddEmloyee.scss";
import "./NavbarForm.scss";
import { toast } from "react-toastify";
import { CreditCard, FolderPen, IdCard, Pencil, Trash2, Eye, X, CirclePlus, Calendar } from "lucide-react";
import { DocumentUpload } from "../../../utils/common/DocumentUpload/DocumentUpload.jsx";
import SelectDropdown from "../../../utils/common/SelectDropdown/SelectDropdown.jsx";
import { showMasterData, showMastersValue } from "../../../utils/helper.js";
import FormDatePicker from "../../../utils/common/FormDatePicker.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SaveButton from '../../../utils/common/SaveButton.jsx';
import ConfirmPopup from '../../../utils/common/ConfirmPopup.jsx';
import { addEmpDocument, removeEmpDocument } from "../../../Redux/Actions/employeeActions.js";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";

const initialDocumentState = {
    document_type: '',
    document_no: '',
    expiry_date: '',
    issued_date: '',
    front_side_attachment: null,
    back_side_attachment: null
}

const DocumentsForm = ({ isEditPage, isEditMode, setIsEditMode, formData, setFormData, id }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addUpdateDocument = useSelector((state) => state?.addEmpDocument);
    const deleteDocument = useSelector((state) => state?.deleteEmpDocument);

    const [currentDocument, setCurrentDocument] = useState(initialDocumentState);
    const [editingIndex, setEditingIndex] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedDocId, setSelectedDocId] = useState(null);

    const document_type_options = showMasterData("6");
    const masterData = useSelector(state => state?.masterData?.data);

    useEffect(() => {
        if (editingIndex !== null) {
            setCurrentDocument(formData?.documents[editingIndex]);
            window.scrollTo(0, 0);
        }
    }, [editingIndex, formData?.documents]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentDocument((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelect = (name, value) => {
        setCurrentDocument((prev) => ({ ...prev, [name]: String(value?.id) }));
    };

    const handleDateChange = (name, date) => {
        const { issued_date, expiry_date } = currentDocument;
        const parsedDate = new Date(date.split('-').reverse().join('-'));
        const parsedIssuedDate = issued_date ? new Date(issued_date.split('-').reverse().join('-')) : null;
        const parsedExpiryDate = expiry_date ? new Date(expiry_date.split('-').reverse().join('-')) : null;

        if (name === "issued_date" && parsedExpiryDate && parsedDate > parsedExpiryDate) {
            toast.error("Issued date cannot be later than the expiry date.");
            return;
        }
        if (name === "expiry_date" && parsedIssuedDate && parsedDate < parsedIssuedDate) {
            toast.error("Expiry date cannot be earlier than the issued date.");
            return;
        }
        setCurrentDocument(prev => ({ ...prev, [name]: date }));
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setCurrentDocument(formData?.documents[index]);
        setShowPopup(true);
        setIsEditMode(true);
        navigate(`/edit-employee/${id}`);
    };

    const handleNew = () => {
        setCurrentDocument(initialDocumentState);
        setShowPopup(true);
        setIsEditMode(true);
    };

    const handleView = (index) => {
        setEditingIndex(index);
        setCurrentDocument(formData?.documents[index]);
        setShowPopup(true);
    };

    const handleDeleteClick = (doc_id) => {
        setSelectedDocId(doc_id);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedDocId) return;
        const sendData = { user_id: id, document_id: selectedDocId };
        dispatch(removeEmpDocument(sendData)).then((res) => {
            if (res?.success) {
                const filteredDocuments = (res?.documents?.length > 0) ? res?.documents?.map((item) => ({
                    id: item?.id,
                    document_type: item?.document_type ? item?.document_type : "",
                    document_no: item?.document_no ? item?.document_no : "",
                    expiry_date: item?.expiry_date ? item?.expiry_date : "",
                    issued_date: item?.issued_date ? item?.issued_date : "",
                    front_side_attachment: JSON.parse(item?.front_side_attachment || null),
                    back_side_attachment: JSON.parse(item?.back_side_attachment || null)
                })) : [];
                setFormData(prev => ({ ...prev, documents: filteredDocuments }));
                setShowModal(false);
                setSelectedDocId(null);
            }
        });
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setCurrentDocument(initialDocumentState);
        setShowPopup(false);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!currentDocument?.document_type || !currentDocument?.document_no) {
            toast.error("Document Name and Document ID are required.");
            return;
        }
        const formDataToSubmit = {
            user_id: id,
            documents: [{
                ...currentDocument,
                front_side_attachment: typeof currentDocument?.front_side_attachment === "string"
                    ? currentDocument?.front_side_attachment
                    : currentDocument?.front_side_attachment
                        ? JSON.stringify(currentDocument?.front_side_attachment)
                        : null,
                back_side_attachment:
                    typeof currentDocument?.back_side_attachment === "string"
                        ? currentDocument?.back_side_attachment
                        : currentDocument?.back_side_attachment
                            ? JSON.stringify(currentDocument?.back_side_attachment)
                            : null
            }]
        };
        dispatch(addEmpDocument(formDataToSubmit)).then((res) => {
            if (res?.success) {
                navigate(`/employee-details/${id}`);
                const filteredDocuments = (res?.documents?.length > 0) ? res?.documents?.map((item) => ({
                    id: item?.id,
                    document_type: item?.document_type ? item?.document_type : "",
                    document_no: item?.document_no ? item?.document_no : "",
                    expiry_date: item?.expiry_date ? item?.expiry_date : "",
                    issued_date: item?.issued_date ? item?.issued_date : "",
                    front_side_attachment: JSON.parse(item?.front_side_attachment || null),
                    back_side_attachment: JSON.parse(item?.back_side_attachment || null)
                })) : [];
                setFormData(prev => ({
                    ...prev,
                    documents: filteredDocuments
                }));
                handleCancel();
            }
        });
    };

    const savedDocumentTypes = formData?.documents?.map((doc) => String(doc?.document_type));

    return (
        <div
            id="Document_form_container"
            className={` ${isEditPage ? 'isEditPage' : ''} ${showPopup ? "popup-overlay" : "Dcumnet_forms"} ${showPopup ? "active" : ""}`}
        >
            <ConfirmPopup
                open={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmDelete}
                type="delete"
                module="Document"
                loading={deleteDocument?.loading}
            />
            <div className={`${showPopup ? 'popup-content' : ''}`}>
                <div id="form" className="bEdit">
                    <div className='div_heading head_pop'>
                        <div>
                            <h2>Document Details</h2>
                            <p className='ppp'>Basic document overview</p>
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
                                    <label>
                                        <FolderPen size={20} /> Document Name
                                    </label>
                                    <SelectDropdown
                                        selectedValue={currentDocument?.document_type}
                                        options={document_type_options}
                                        onSelect={handleSelect}
                                        type="document_type"
                                        itemClassName={(item) =>
                                            savedDocumentTypes.includes(String(item.id)) && String(item.id) !== String(currentDocument?.document_type)
                                                ? "disabled"
                                                : ""
                                        }
                                        disabled={!isEditMode}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>
                                        <IdCard size={20} /> Document ID
                                    </label>
                                    <input
                                        type="text"
                                        name="document_no"
                                        value={currentDocument?.document_no}
                                        onChange={handleChange}
                                        disabled={!isEditMode}
                                    />
                                </div>
                                <div className="form-group">
                                    <label> <Calendar size={20} strokeWidth={1.25} /> <p>Issued Date</p></label>
                                    <FormDatePicker
                                        label="Issued Date"
                                        onDateChange={handleDateChange}
                                        initialDate={currentDocument?.issued_date}
                                        type="issued_date"
                                        disabled={!isEditMode}
                                        toDate={currentDocument?.expiry_date}
                                    />
                                </div>
                                <div className="form-group">
                                    <label> <Calendar size={20} strokeWidth={1.25} /> <p>Expiry Date</p></label>
                                    <FormDatePicker
                                        label="Expiry Date"
                                        onDateChange={handleDateChange}
                                        initialDate={currentDocument?.expiry_date}
                                        type="expiry_date"
                                        disabled={!isEditMode}
                                        fromDate={currentDocument?.issued_date}
                                    />
                                </div>
                                <div className="attachment_adth ">
                                    <div className="form-group attachment_form">
                                        <label>
                                            <CreditCard size={20} /> Upload Attachments
                                        </label>
                                        <div className=" column2">
                                            <DocumentUpload
                                                formData={{ documents: [currentDocument] }}
                                                setFormData={(data) => setCurrentDocument(data?.documents[0])}
                                                loading={imageUploading}
                                                setLoading={setImageUploading}
                                                section="documents"
                                                index={0}
                                                fieldName="front_side_attachment"
                                                fileName="Front Side"
                                                className='half'
                                                isEditPage={!isEditPage}
                                                disabled={!isEditMode}
                                            />
                                            <DocumentUpload
                                                formData={{ documents: [currentDocument] }}
                                                setFormData={(data) => setCurrentDocument(data?.documents[0])}
                                                loading={imageUploading}
                                                setLoading={setImageUploading}
                                                section="documents"
                                                index={0}
                                                fieldName="back_side_attachment"
                                                fileName="Back Side"
                                                className='half'
                                                isEditPage={!isEditPage}
                                                disabled={!isEditMode}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group attachment_form">
                                    </div>
                                </div>
                            </div>
                            {isEditMode &&
                                <div className="form-actions-footer">
                                    <SaveButton
                                        loading={addUpdateDocument?.loading}
                                        editingIndex={editingIndex}
                                        handleSubmit={handleSave}
                                        handleCancel={handleCancel}
                                    />
                                </div>
                            }
                        </>
                    }
                </div>

                {!showPopup && (
                    <>
                        <hr style={{ marginBottom: '0px' }} className='hr_line' />
                        {formData?.documents?.length > 0 &&
                            formData?.documents?.map((doc, index) => (
                                doc?.document_type && doc?.document_no && (
                                    <div className="saved-list-container" key={doc?.id || index}>
                                        <div className={`saved-experience-item ${!isEditMode ? 'isEditMode_card_item' : ''}`}>
                                            <div className="item-details">
                                                <p className="item-company">{showMastersValue(masterData, "6", doc?.document_type)}</p>
                                                <p className="item-role-dates">{doc?.document_no}</p>
                                            </div>
                                            <div className="item-actions">
                                                {isEditMode ?
                                                    <>
                                                        <div onClick={() => handleEdit(index)} className="action-btn edit-btn">
                                                            Edit
                                                        </div>
                                                        <div onClick={() => handleDeleteClick(doc?.id)} className="action-btn delete-btn">
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
                                )
                            ))}
                    </>
                )}
            </div>

            {formData?.experiences?.length === 0 && !showModal && !showPopup && (
                <ListDataNotFound module="Document" form={true} />
            )}
        </div>
    );
};

export default DocumentsForm;