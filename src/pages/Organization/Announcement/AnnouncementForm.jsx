import {
    BookA,
    BellRing,
    FileUp,
    MailIcon,
    Proportions,
    Calendar,
    AppWindowMac,
} from 'lucide-react';
import FormDatePicker from '../../../utils/common/FormDatePicker';
import { UploadFile } from '../../../utils/common/UploadFile/UploadFile';

const AnnouncementForm = ({formData }) => {

     const notifyAllOptions = {
        1: "Yes",
        2: "No",
     }

    return (
        <>
            <div className={`dept-page-basic-info-section`}>
                <div className="form-grid-layout">

                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"><AppWindowMac size={20} strokeWidth={1.5} /></div>
                        <label>Department</label>
                        <input
							type="text"
							name="department_name"
							value={formData?.department_name}
							disabled
						/>
                    </div>

                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"><BookA size={20} strokeWidth={1.5} /></div>
                        <label>Subject</label>
                        <input
                            type="text"
                            name='subject'
                            value={formData?.subject}
                            disabled
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"  >
                            <Calendar size={20} strokeWidth={1.25} />
                        </div>
                        <label >Expiry Date</label>
                        <FormDatePicker label="Expiry date" initialDate={formData?.expiry} type="expiry" disabled={true} />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper">
                            <BellRing size={20} strokeWidth={1.5} />
                        </div>
                        <label>
                            Notify All Employees</label>

                            <input
                            type="text"
                            name='notify_all'
                            value={notifyAllOptions[formData?.notify_all]}
                            disabled
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"><MailIcon size={20} strokeWidth={1.5} /></div>

                        <label>Notify Other Email ID </label>
                        <input
                            type="text"
                            name='notify_any_others'
                            value={formData?.notify_any_others}
                            disabled
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"><Proportions size={20} strokeWidth={1.5} /></div>
                        <label>Description</label>
                            <textarea
                                value={formData?.description}
                                disabled
                                className="text-area-disabled"
                            />
                    </div>
                    <div className="dept-page-input-group attachment_form">
                        <div className="dept-page-icon-wrapper"><FileUp size={20} strokeWidth={1.5} /></div>
                        <label>Attachment</label>
                        <UploadFile
                            formData={formData}
                            fieldName="attachment"
                            multiple={false}
                            isDetailView={true}
                        />

                    </div>
                </div>
            </div>
        </>
    );
};

export default AnnouncementForm;