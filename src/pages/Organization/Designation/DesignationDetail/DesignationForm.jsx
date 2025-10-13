import {
    Warehouse,
    AppWindowMac,
    Proportions
} from 'lucide-react';


const DesignationForm = ({ formData}) => {
    return (
        <>
            <div className={`dept-page-basic-info-section`}>
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Warehouse size={20} strokeWidth={1.5} /></div>
                    <label >Designation Name</label>
                    <input
                        type="text"
                        name="designation_name"
                        value={formData?.designation_name}
                        disabled={true}
                    />
                </div>

                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><AppWindowMac size={20} strokeWidth={1.5} /></div>
                    <label>Department</label>
                     <input
                        type="text"
                        name="designation_name"
                        value={formData?.department_name}
                        disabled={true}
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
            </div>
        </>
    );
};

export default DesignationForm;