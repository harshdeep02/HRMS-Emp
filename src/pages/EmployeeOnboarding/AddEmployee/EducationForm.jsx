import { useState, useEffect } from 'react';
import './AddEmloyee.scss';
import './NavbarForm.scss';
import { FolderPen, School, ScrollText, Wallpaper, FileUp, X, Calendar, University } from 'lucide-react';
import FormDatePicker from '../../../utils/common/FormDatePicker';
import { DocumentUpload } from '../../../utils/common/DocumentUpload/DocumentUpload';
import { showMasterData, showMastersValue } from '../../../utils/helper';
import { useSelector } from 'react-redux';
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

const EducationForm = ({formData }) => {

    const [currentEducation, setCurrentEducation] = useState(initialEducationState);
    const [showPopup, setShowPopup] = useState(false);

    const edu_level_options = showMasterData("8");
    const degree_options = showMasterData("9");
    const specialization_options = showMasterData("10");
    const masterData = useSelector(state => state?.masterData?.data);


    const handleView = (index) => {
        setCurrentEducation(formData?.educations[index]);
        setShowPopup(true);
    };

    const handleCancel = () => {
        setCurrentEducation(initialEducationState);
        setShowPopup(false);
    };


    return (
        <>
            <div
                id="Education_form_container"
                className={` ${showPopup ? "popup-overlay " : "Dcumnet_forms"} ${showPopup ? "active" : ""}`}
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
                        </div>
                        
                        {showPopup &&
                            <>
                                <div className="from1">
                                    <div className="form-group">
                                        <label><School size={20} />Education Level</label>
                                         <input
                                            type="text"
                                            name="degree"
                                            value={edu_level_options?.find((item)=>item?.id == currentEducation?.education_level)?.label}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><ScrollText size={20} />Degree</label>
                                        <input
                                            type="text"
                                            name="degree"
                                            value={degree_options?.find((item)=>item?.id == currentEducation?.degree)?.label}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><Wallpaper size={20} />Specialization</label>
                                        <input
                                            type="text"
                                            name="specialization"
                                            value={specialization_options?.find((item)=>item?.id == currentEducation?.specialization)?.label}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><FolderPen size={20} />Institute Name</label>
                                        <input
                                            type="text"
                                            name="institute_name"
                                            value={currentEducation?.institute_name}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label> <Calendar size={20} strokeWidth={1.25} /> <p>From Date</p></label>
                                        <FormDatePicker
                                            label="From Date"
                                            initialDate={currentEducation?.from_date}
                                            type="from_date"
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label> <Calendar size={20} strokeWidth={1.25} /> <p>To Date</p></label>
                                        <FormDatePicker
                                            label="To Date"
                                            initialDate={currentEducation?.to_date}
                                            type="to_date"
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="form-group attachment_form">
                                        <label><FileUp size={20} /> Upload Certificate</label>
                                        <DocumentUpload
                                            formData={{ educations: [currentEducation] }}
                                            section="educations"
                                            index={0}
                                            fieldName="certificate_attachment"
                                            fileName="Upload Document"
                                            className='full_w'
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                    {!showPopup && (
                        <>
                            {formData?.educations?.length > 0 &&
                                formData?.educations?.map((edu, index) => (
                                    <div className="saved-list-container" key={index}>

                                         <div className={`saved-experience-item`} style={{backgroundColor:"unset", border:"none", padding:0}}>
                                            <div className="item-details expDisFlex">
                                                <div className="compLogo"><University strokeWidth={1.5} color="#494949"/> </div>
                                                <div className="">
                                                    <div className="item-CompanyName">{edu?.institute_name}</div>
                                                    <div className="item-CompanyProfile">{showMastersValue(masterData, "9", edu?.degree)}</div>
                                                </div>
                                            </div>
                                            <div className="empExpDate">
                                                <p className="item-role-dates empExDate">
                                                    {(edu?.from_date || edu?.to_date) ? (
                                                        <>{edu?.from_date || "---"} <span>To</span> {edu?.to_date || "---"}</>
                                                    ) : null}
                                                </p>
                                                </div>
                                            <div className="item-actions">
                                                        <div
                                                            onClick={() => handleView(index)}
                                                            className="action-btn edit-btn empViewBtn">
                                                            View
                                                        </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </>
                    )}
                </div>
                {formData?.experiences?.length === 0 && !showPopup && (
                    <ListDataNotFound module="Education" form={true} />
                )}
            </div>
        </>

    );
};

export default EducationForm;