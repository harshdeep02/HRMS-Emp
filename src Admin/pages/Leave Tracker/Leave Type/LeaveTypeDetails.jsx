import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    Pencil
} from 'lucide-react';
import bannerImg from '../../../assets/Bookyourcampaign.svg';
import '../../Settings/Users/UserDetails.scss'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../utils/common/Loader/Loader';
import { BiSolidCalendarStar } from 'react-icons/bi';
import '../../Attendance/Holiday/HolidayDetails.scss'
import { getLeaveTypeDetails } from '../../../Redux/Actions/leaveMasterActions';
import './LeaveTypeDetails.scss'
import StatusDropdown from '../../../utils/common/StatusDropdown/StatusDropdown';
import LeaveTypeForm from './LeaveTypeForm';
import { leavesTypesStatusOptions } from '../../../utils/Constant';


export const LeaveTypeDetails = () => {

    const { id } = useParams()
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //states
    const leaveTypeDetails = useSelector((state) => state?.leaveTypeDetails);
    const leaveTypeDetail = leaveTypeDetails?.data?.result;
    const leaveTypeDetailsLoading = leaveTypeDetails?.loading;

    // State to manage the form data and UI mode
    const [viewMode, setViewMode] = useState('');
    const [formData, setFormData] = useState({
        leave_name: "",
        leave_type: '',
        available_days: '',
        description: "",
        status: 1
    });

    // Hook to determine the current view mode from the URL
    useEffect(() => {
        if (location.pathname.includes("add-leave-type")) {
            // setFormData(emptyUser);
            setViewMode('add')
        }
        else if (location.pathname.includes("edit-leave-type-details")) {
            setViewMode('edit');
        }
        else if (location.pathname.includes("leave-type-details")) {
            setViewMode('detail');
        }
    }, [location])

    useEffect(() => {
        if (id && leaveTypeDetail?.id != id) {
            const queryParams = {
                id: id,
            };
            dispatch(getLeaveTypeDetails(queryParams));
        }
    }, [id]);


    useEffect(() => {
        if (id && leaveTypeDetail) {
            setFormData((prev) => ({
                ...prev,
                leave_name: leaveTypeDetail?.leave_name || "",
                leave_type: leaveTypeDetail?.leave_type || "",
                available_days: leaveTypeDetail?.available_days || "",
                description: leaveTypeDetail?.description || "",
                status: leaveTypeDetail?.status || 1
            }))
        }
    }, [leaveTypeDetail]);

    const handleEditClick = () => {
        navigate(`/edit-leave-type-details/${id}`)
        setViewMode("edit");
    };

    const handleStatus = (val) => {
        setFormData(prevData => ({
            ...prevData,
            status: val,
        }));
    }

    const renderHeader = () => {
        switch (viewMode) {
            case 'add': return 'Add New Leave Type';
            case 'edit': return 'Edit Leave Type';
            case 'detail': default: return 'Leave Type Details';
        }
    };
    const renderMark = () => {
        switch (viewMode) {
            case 'add': return 'Fill The Information';
            case 'edit': return 'Edit The Information!';
            case 'detail': default: return 'Provided Details!';
        }
    };

    const renderHeaderInfo = () => {
        switch (viewMode) {
            case 'add': return "You're just one step away from adding the new Leave Type! ";
            case 'edit': return "Here’s the information about the Leave Type details you’ve filled. Make sure to review your profile for any updates! ";
            case 'detail': default: return "Check out your Leave Type information! ";
        }
    };

    const editExist = viewMode === 'edit' ? true : false

    if (leaveTypeDetailsLoading) {
        return <div className="loading-state"> <Loader /> </div>;
    }
    return (
        <div className="leaveTypeDetailsMain">
            <button onClick={() => navigate(`${viewMode == 'edit' ? `/leave-type-details/${id}` : '/leave-type-list'}`)} className="close_nav header_close">Close</button>
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
                    <div className="dept-page-right-panel">
                        <div className="dept-page-cover-section">
                            <div className="dept-page-basic-info-section dept-page-basic-info-section_2">
                                <h3>Basic Information</h3>
                                <p className="dept-page-subtitle">{viewMode !== "detail" ? "Please Provide" : ''} Leave Type Basic Details Below</p>
                            </div>
                            {/* {viewMode !== "detail" ? */}
                            <StatusDropdown
                                options={leavesTypesStatusOptions?.filter((item) => item?.label !== "All")?.map((item) => ({
                                    value: item?.id,
                                    label: item?.label,
                                    icon: item?.icon,
                                }))}
                                defaultValue={formData?.status}
                                onChange={(val) => handleStatus(val)}
                                viewMode={viewMode !== "detail"}
                            />
                            {/* :
                                <div className="status-dropdown">
                                    <div className={`status-label dropdown-trigger`}>
                                        {leavesTypesStatusOptions?.filter((item) => item.id == formData?.status)?.[0]?.label}
                                    </div>
                                </div>
                            } */}
                        </div>
                        {viewMode === 'detail' && (
                            <button className="dept-page-edit-btn" onClick={handleEditClick}>
                                Edit
                            </button>
                        )}
                        <LeaveTypeForm
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