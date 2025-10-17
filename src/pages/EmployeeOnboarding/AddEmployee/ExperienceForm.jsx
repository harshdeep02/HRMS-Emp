import { useState, useEffect } from "react";
import "./AddEmloyee.scss";
import "./NavbarForm.scss";
import { FolderPen, School, Briefcase, Info, LucideUploadCloud, X, Calendar, Building2 } from "lucide-react";
import { showMasterData, showMastersValue } from "../../../utils/helper.js";
import FormDatePicker from "../../../utils/common/FormDatePicker.jsx";
import TextAreaWithLimit from "../../../utils/common/TextAreaWithLimit.jsx";
import { DocumentUpload } from "../../../utils/common/DocumentUpload/DocumentUpload.jsx";
import SelectDropdown from "../../../utils/common/SelectDropdown/SelectDropdown.jsx";
import ListDataNotFound from "../../../utils/common/ListDataNotFound.jsx";
import { useSelector } from "react-redux";

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

const ExperienceForm = ({ formData }) => {
        const masterData = useSelector((state) => state?.masterData?.data);
        const job_title_options = showMasterData("7");
        
        const [currentExperience, setCurrentExperience] = useState(initialExperienceState);
        const [showPopup, setShowPopup] = useState(false);


    const handleView = (index) => {
        setCurrentExperience(formData?.experiences[index]);
        setShowPopup(true);
    };

    const handleCancel = () => {
        setCurrentExperience(initialExperienceState);
        setShowPopup(false);
    };

    return (
        <>
            <div id="Experience_form_container" className={` ${showPopup ? "popup-overlay " : "Dcumnet_forms"} ${showPopup ? "active" : ""}`}>
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
                        </div>
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
                                            disabled={true}
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
                                            disabled={true}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            <Briefcase size={20} />
                                            Job Title
                                        </label>
                                         <input
                                            type="text"
                                            name="industry"
                                            value={job_title_options?.find((item)=>item?.id == currentExperience?.job_title)?.label}
                                            disabled={true}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label> <Calendar size={20} strokeWidth={1.25} /> <p>From Date</p></label>

                                        <FormDatePicker
                                            label="From Date"
                                            initialDate={currentExperience?.from_date}
                                            type="from_date"
                                            disabled={true}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label> <Calendar size={20} strokeWidth={1.25} /> <p>To Date</p></label>
                                        <FormDatePicker
                                            label="To Date"
                                            initialDate={currentExperience?.to_date}
                                            type="to_date"
                                            disabled={true}
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
                                            disabled={true}
                                            //  formsValues={{
                                            // handleChange: handleChange,
                                            //     form: currentExperience,
                                            // }}
                                        />
                                    </div>

                                    <div className="form-group attachment_form">
                                        <label>
                                            <LucideUploadCloud size={20} />
                                            Upload Experience Certificate
                                        </label>
                                        <DocumentUpload
                                            formData={{ experiences: [currentExperience] }}
                                            section="experiences"
                                            index={0}
                                            fieldName="experience_letter"
                                            fileName="Upload Document"
                                            className="full_w"
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                            </>
                        }
                    </div>

                    {!showPopup && (
                        <>
                            {/* <hr style={{ marginBottom: '0px' }} className='hr_line' /> */}
                            {formData?.experiences?.length > 0 &&
                                formData?.experiences?.map((exp, index) => (
                                    <div className="saved-list-container" key={index}>
                                        <div className={`saved-experience-item`} style={{backgroundColor:"unset", border:"none", padding:0}}>
                                            <div className="item-details expDisFlex">
                                                <div className="compLogo"><Building2 strokeWidth={1.5} color="#494949"/> </div>
                                                <div className="">
                                                    <div className="item-CompanyName">{exp?.company_name}</div>
                                                    <div className="item-CompanyProfile">{showMastersValue(masterData, "7", exp?.job_title)}</div>
                                                </div>
                                               
                                            </div>
                                             <div className="empExpDate">
                                                 <p className="item-role-dates empExDate">
                                                    {(exp?.from_date || exp?.to_date) ? (
                                                        <>{exp?.from_date || "---"} <span>To</span> {exp?.to_date || "---"}</>
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
                    <ListDataNotFound module="Experience" form={true} />
                )}

            </div>
        </>
    );
};

export default ExperienceForm;