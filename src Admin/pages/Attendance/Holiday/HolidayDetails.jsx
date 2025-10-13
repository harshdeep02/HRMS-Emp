import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    Pencil
} from 'lucide-react';
import bannerImg from '../../../assets/Image_text_1.svg';
import '../../Settings/Users/UserDetails.scss'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../utils/common/Loader/Loader';
import { BiSolidCalendarStar } from 'react-icons/bi';
import './HolidayDetails.scss'
import { getHolidayDetails } from '../../../Redux/Actions/holidayActions';
import { formatDate3 } from '../../../utils/common/DateTimeFormat';
import dayjs from 'dayjs';
import HolidayForm from './HolidayForm';

export const HolidayDetails = () => {

    const { id } = useParams()
    const location = useLocation();
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

    const [viewMode, setViewMode] = useState('');

    useEffect(() => {
        if (location.pathname.includes("add-holiday-details")) {
            // setFormData(emptyUser);
            setViewMode('add')
        }
        else if (location.pathname.includes("edit-holiday-details")) {
            setViewMode('edit');
        }
        else if (location.pathname.includes("holiday-details")) {
            setViewMode('detail');
        }
    }, [location])

    const handleEditClick = () => {
        navigate(`/edit-holiday-details/${id}`)
        setViewMode("edit");
    };

    const renderHeader = () => {
        switch (viewMode) {
            case 'add': return 'Add New Holiday';
            case 'edit': return 'Edit Holiday';
            case 'detail': default: return 'Holiday Details';
        }
    };
    const renderMark = () => {
        switch (viewMode) {
            case 'add': return 'Fill The Information';
            case 'edit': return 'Edit Information';
            case 'detail': default: return 'Provided Details!';
        }
    };

    const renderHeaderInfo = () => {
        switch (viewMode) {
            case 'add': return "You're just one step away from adding the new holiday! ";
            case 'edit': return "Here’s the information about the Holiday details you’ve filled. ";
            case 'detail': default: return "Check out your holiday information! ";
        }
    };


    if (holidayDetailsLoading) {
        return <div className="loading-state"> <Loader /> </div>;
    }

    return (
        <div className="dept-page-container">
            <button onClick={() => navigate(`${viewMode == 'edit' ? `/holiday-details/${id}` : '/holiday-list'}`)} className="close_nav header_close">Close</button>

            <div className="dept-page-container">
                <h2 className="dept-page-main-heading">{renderHeader()}</h2>
                <div className="dept-page-content-wrapper">
                    <div className="dept-page-left-panel">
                        <h3 className="dept-page-mark-text">{renderMark()}</h3>
                        <p className="dept-page-info-text">{renderHeaderInfo()}</p>
                        <div className="dept-page-illustration-box">
                            <img className=' ' src={bannerImg} alt="Illustration" />
                        </div>
                    </div>
                    <div className="dept-page-right-panel seeting_form_1">
                        <div className="dept-page-cover-section">
                            <div className="dept-page-basic-info-section ">
                                <h3>Basic Information</h3>
                                <p className="dept-page-subtitle">{viewMode !== "detail" ? "Please Provide" : ''} Holiday Basic Details Below.</p>
                            </div>

                        </div>
                        {viewMode === 'detail' && (
                            <button className="dept-page-edit-btn" onClick={handleEditClick}>
                                {/* */}
                                Edit
                            </button>
                        )}

                        <HolidayForm
                            viewMode={viewMode}
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
