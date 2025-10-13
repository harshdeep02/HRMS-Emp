import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import bannerImg from '../../../assets/Bookyourcampaign.svg';
import Loader from '../../../utils/common/Loader/Loader.jsx';
import { leavesStatusOptions } from '../../../utils/Constant.js';
import { LeaveForm } from './LeaveForm.jsx';
import StatusDropdown from '../../../utils/common/StatusDropdown/StatusDropdown.jsx';
import { getLeaveTypeList } from '../../../Redux/Actions/leaveMasterActions.js';
import { getLeaveDetails } from '../../../Redux/Actions/leaveActions.js';
import { UserProfileImageUpload } from '../../../utils/common/UserProfileImageUpload/UserProfileImageUpload.jsx';

const texts = {
    add: {
        header: "Add New Leave",
        mark: "Fill The Information",
        info: "You're Just One Step Away From Adding The New Leave!",
    },
    detail: {
        header: "leave Details",
        mark: "Provided Details!",
        info: "Check out your leave information!",
    },
};

export const LeaveDetail = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();

    const [viewMode, setViewMode] = useState('detail');
    const [formData, setFormData] = useState({
        leave_type_id: '',
        leave_type_name: '',
        type_of_leave: '',
        from_date: '',
        to_date: '',
        reason: '',
        status: 2,
        duration: ''
    });

    const leaveMasterData = useSelector((state) => state?.leaveMasterList);
    const leaveMasterLists = leaveMasterData?.data?.result || [];

    const leaveData = useSelector((state) => state?.leaveDetails);
    const leaveDetails = leaveData?.data?.leave || {};

    useEffect(() => {
        if (id && leaveDetails?.id !== id) {
            dispatch(getLeaveDetails({ id }))
        }
    }, [id]);

    // Update formData when Redux state for leave details
    useEffect(() => {
        if (id && leaveDetails) {
            setFormData((prev) => ({
                ...prev,
                leave_type_id: leaveDetails?.leave_type_id || '',
                leave_type_name: leaveDetails?.leave_type?.leave_type || '',
                type_of_leave: leaveDetails?.type_of_leave || '',
                from_date: leaveDetails?.from_date || '',
                to_date: leaveDetails?.to_date || '',
                reason: leaveDetails?.reason || '',
                status: leaveDetails?.status || 2,
                duration: leaveDetails?.duration
            }));
        }
    }, [leaveDetails?.id]);


    const fetchLeaveTypes = (search = "") => {
        const sendData = { status: 1 };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getLeaveTypeList(sendData));
    };

    const handleSearch = (query, type) => {
        if (type === "leave_type_id") fetchLeaveTypes(query)
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/add-new-leave')) {
            if (leaveMasterLists?.length === 0) fetchLeaveTypes();
        }
    }, [location.pathname]);

    // useEffect to manage view mode and data fetching
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/add-new-leave')) {
            setViewMode('add');
        }else {
            setViewMode('detail');
        }
    }, [location.pathname]);

    if (leaveData?.loading) {
        return <div className="loading-state"> <Loader /> </div>;
    }

    return (
        <div className="leaveDetailsMain">
            <div className="dept-page-container">
                <button onClick={() => navigate(`/leave-list`)} className="close_nav header_close">Close</button>
                <h2 className="dept-page-main-heading">{texts[viewMode].header}</h2>
                <div className="dept-page-content-wrapper">
                        <div className="dept-page-left-panel">
                            <h3 className="dept-page-mark-text">{texts[viewMode].mark}</h3>
                            <p className="dept-page-info-text">{texts[viewMode].info}</p>
                            <div className="dept-page-illustration-box">
                                <img className=' ' src={bannerImg} alt="Illustration" />
                            </div>
                        </div>
                        <div className="dept-page-right-panel ">
                            <LeaveForm
                                viewMode={viewMode}
                                formData={formData}
                                setFormData={setFormData}
                                handleSearch={handleSearch}
                            />
                        </div>
                </div>

            </div>
        </div>
    )
}
