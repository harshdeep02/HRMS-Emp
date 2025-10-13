import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bannerImg from '../../../assets/Image_text_1.svg';
import '../Announcement/UserDetails.scss'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../utils/common/Loader/Loader';
import './HolidayDetails.scss'
import { getHolidayDetails } from '../../../Redux/Actions/holidayActions';
import { formatDate3 } from '../../../utils/common/DateTimeFormat';
import HolidayForm from './HolidayForm';

export const HolidayDetails = () => {

    const { id } = useParams()
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const holidayDetails = useSelector((state) => state?.holidayDetails);
    const holidayDetail = holidayDetails?.data?.result;
    const holidayDetailsLoading = holidayDetails?.loading;

    const [formData, setFormData] = useState({
        holiday_name: "",
        from_date: "",
        to_date: "",
        description: "",
    });

    useEffect(() => {
        if (id && holidayDetail?.id != id) {
            const queryParams = {
                id: id,
            };
            dispatch(getHolidayDetails(queryParams));
        }
    }, [id]);


    useEffect(() => {
        if (id && holidayDetail) {
            setFormData((prev) => ({
                ...prev,
                id: holidayDetail?.id,
                holiday_name: holidayDetail?.holiday_name,
                from_date: formatDate3(holidayDetail?.from_date),
                to_date: formatDate3(holidayDetail?.to_date),
                description: holidayDetail?.description,
            }))
        }
    }, [holidayDetail]);

    if (holidayDetailsLoading) {
        return <div className="loading-state"> <Loader /> </div>;
    }

    return (
        <div className="dept-page-container">
            <button onClick={() => navigate(`/holiday-list`)} className="close_nav header_close">Close</button>

            <div className="dept-page-container">
                <h2 className="dept-page-main-heading">Holiday Details</h2>
                <div className="dept-page-content-wrapper">
                    <div className="dept-page-left-panel">
                        <h3 className="dept-page-mark-text">Provided Details!</h3>
                        <p className="dept-page-info-text">Check out your holiday information! </p>
                        <div className="dept-page-illustration-box">
                            <img src={bannerImg} alt="Illustration" />
                        </div>
                    </div>
                    <div className="dept-page-right-panel seeting_form_1">
                        <div className="dept-page-cover-section">
                            <div className="dept-page-basic-info-section ">
                                <h3>Basic Information</h3>
                                <p className="dept-page-subtitle">Holiday Basic Details Below.</p>
                            </div>

                        </div>

                        <HolidayForm
                            formData={formData}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
