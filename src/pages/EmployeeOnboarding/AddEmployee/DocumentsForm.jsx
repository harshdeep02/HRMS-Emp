import { useState } from "react";
import "./AddEmloyee.scss";
import "./NavbarForm.scss";
import { CreditCard, FolderPen, IdCard, X, Calendar } from "lucide-react";
import { DocumentUpload } from "../../../utils/common/DocumentUpload/DocumentUpload.jsx";
import { showMasterData, showMastersValue } from "../../../utils/helper.js";
import FormDatePicker from "../../../utils/common/FormDatePicker.jsx";
import { useSelector } from 'react-redux';
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import pdfIcon from '../../../assets/pdf.png';
import imgIcon from '../../../assets/profile-upload-icon.png';

const initialDocumentState = {
    document_type: '',
    document_no: '',
    expiry_date: '',
    issued_date: '',
    front_side_attachment: null,
    back_side_attachment: null
}

const DocumentsForm = ({formData}) => {

    const [currentDocument, setCurrentDocument] = useState(initialDocumentState);
    const [showPopup, setShowPopup] = useState(false);

    const document_type_options = showMasterData("6");
    const masterData = useSelector(state => state?.masterData?.data);


    const handleView = (index) => {
        setCurrentDocument(formData?.documents[index]);
        setShowPopup(true);
    };

    const handleCancel = () => {
        setCurrentDocument(initialDocumentState);
        setShowPopup(false);
    };


    return (
        <div
            id="Document_form_container"
            className={`${showPopup ? "popup-overlay" : "Dcumnet_forms"} ${showPopup ? "active" : ""}`}
        >
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
                    </div>

                    {showPopup &&
                        <>
                            <div className="from1">
                                <div className="form-group">
                                    <label>
                                        <FolderPen size={20} /> Document Name
                                    </label>
                                    <input
                                        type="text"
                                        name="document_type"
                                        value={document_type_options?.find((item)=>item?.id == currentDocument?.document_type)?.label}
                                        disabled={true}
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
                                        disabled={true}
                                    />
                                </div>
                                <div className="form-group">
                                    <label> <Calendar size={20} strokeWidth={1.25} /> <p>Issued Date</p></label>
                                    <FormDatePicker
                                        label="Issued Date"
                                        initialDate={currentDocument?.issued_date}
                                        type="issued_date"
                                        disabled={true}
                                    />
                                </div>
                                <div className="form-group">
                                    <label> <Calendar size={20} strokeWidth={1.25} /> <p>Expiry Date</p></label>
                                    <FormDatePicker
                                        label="Expiry Date"
                                        initialDate={currentDocument?.expiry_date}
                                        type="expiry_date"
                                        disabled={true}
                                    />
                                </div>
                                <div className="attachment_adth ">
                                    <div className="form-group attachment_form">
                                        <label>
                                            <CreditCard size={20} /> Upload Attachments
                                        </label>
                                        <div className=" column2">
                                            {currentDocument?.front_side_attachment &&
                                            <DocumentUpload
                                                formData={{ documents: [currentDocument] }}
                                                section="documents"
                                                index={0}
                                                fieldName="front_side_attachment"
                                                fileName="Front Side"
                                                className='half'
                                                disabled={true}
                                            />
                                            }
                                            {currentDocument?.back_side_attachment &&
                                            <DocumentUpload
                                                formData={{ documents: [currentDocument] }}
                                                section="documents"
                                                index={0}
                                                fieldName="back_side_attachment"
                                                fileName="Back Side"
                                                className='half'
                                                disabled={true}
                                            />
                                            }
                                        </div>
                                    </div>

                                    <div className="form-group attachment_form">
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>

                {!showPopup && (
                    <>
                        {formData?.documents?.length > 0 &&
                            formData?.documents?.map((doc, index) => (
                                doc?.document_type && doc?.document_no && (
                                    <div className="saved-list-container" key={doc?.id || index}>
                                        <div className={`saved-experience-item`} style={{backgroundColor:"unset", border:"none", padding:0}}>
                                            <div className="item-details expDisFlex">
                                                <div className="doc-item-icon">
                                                    <img src={ doc?.front_side_attachment || doc?.back_side_attachment ? JSON.parse(doc?.front_side_attachment || doc?.back_side_attachment)?.type === "image/jpeg"? imgIcon : pdfIcon : ''} />
                                                     </div>
                                                <div className="">
                                                    <div className="item-CompanyName">{showMastersValue(masterData, "6", doc?.document_type)}</div>
                                                    <div className="item-CompanyProfile">{doc?.document_no}</div>
                                                </div>
                                            </div>
                                            <div className="item-actions">
                                                    <>
                                                        <div onClick={() => handleView(index)} className="action-btn edit-btn">
                                                         View
                                                        </div>
                                                    </>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))}
                    </>
                )}
            </div>

            {formData?.experiences?.length === 0 && !showPopup && (
                <ListDataNotFound module="Document" form={true} />
            )}
        </div>
    );
};

export default DocumentsForm;