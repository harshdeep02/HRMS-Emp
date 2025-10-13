import {
    CalendarMinus,
    Proportions,
    Calendar
} from 'lucide-react';
import FormDatePicker from '../../../utils/common/FormDatePicker';

const HolidayForm = ({formData }) => {

    return (
        <>
            <div className={`dept-page-basic-info-section`}>
                {/* <h3>Basic Information</h3>
                <p className="dept-page-subtitle">Please Provide Holiday Basic Details Below.</p> */}
                <div className="form-grid-layout">

                    <div className={`dept-page-input-group`}>
                        <div className={`dept-page-icon-wrapper`}><CalendarMinus size={20} strokeWidth={1.5} /></div>
                        <label>Holiday Name</label>
                        <input
                            type="text"
                            name='holiday_name'
                            value={formData?.holiday_name}
                            disabled
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"  >
                            <Calendar size={20} strokeWidth={1.25} />
                        </div>
                        <label >From Date</label>
                        <FormDatePicker
                            label="From Date"
                            initialDate={formData?.from_date}
                            type="from_date"
                            disabled={true}
                            toDate={formData?.to_date}
                        />
                    </div>
                    <div className="dept-page-input-group">
                        <div className="dept-page-icon-wrapper"  >
                            <Calendar size={20} strokeWidth={1.25} />
                        </div>
                        <label >To Date</label>
                        <FormDatePicker
                            label="To Date"
                            initialDate={formData?.to_date}
                            type="to_date"
                            disabled={true}
                            fromDate={formData?.from_date}
                        />
                    </div>
                    <div className={`dept-page-input-group  attachment_form`}>
                        <div className="dept-page-icon-wrapper"><Proportions size={20} strokeWidth={1.5} /></div>
                        <label >Description</label>
                        <textarea
                            value={formData?.description}
                            disabled
                            className="text-area-disabled"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default HolidayForm;