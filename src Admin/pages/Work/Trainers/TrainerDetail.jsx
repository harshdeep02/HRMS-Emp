import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    Pencil,
    User,
} from 'lucide-react';
import bannerImg from '../../../assets/Personalinfo.svg';
import StatusDropdown from '../../../utils/common/StatusDropdown/StatusDropdown';
import Loader from '../../../utils/common/Loader/Loader';
import { getTrainerDetails } from '../../../Redux/Actions/trainerActions';
import TrainerForm from './TrainerForm';
import { trainerStatusOptions } from '../../../utils/Constant';
import { useDispatch, useSelector } from 'react-redux';

export const TrainerDetail = () => {

    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Data from redux
    const trainerDetails = useSelector((state) => state?.trainerDetails);
    const trainerDetail = trainerDetails?.data?.result || {};
    const trainerDetailLoading = trainerDetails?.loading || false;

    // State to manage the form data and UI mode
    const [viewMode, setViewMode] = useState('');
    const [formData, setFormData] = useState({
        trainer_name: '',
        training_type: '',
        email: '',
        contact_no: '',
        description: '',
        status: 1,
    });


    // Hook to determine the current view mode from the URL
    useEffect(() => {
        if (location.pathname.includes("add-trainer")) {
            setViewMode('add');
        } else if (location.pathname.includes("edit-trainer")) {
            setViewMode('edit');
        } else if (location.pathname.includes("trainer-details")) {
            setViewMode('detail');
        }
    }, [location]);

    useEffect(() => {
        if (id && trainerDetail?.id != id) {
            const queryParams = {
                id: id,
            };
            dispatch(getTrainerDetails(queryParams));
        }
    }, [id]);

    useEffect(() => {
        if (id && trainerDetail) {
            setFormData((prev) => ({
                ...prev,
                trainer_name: trainerDetail?.trainer_name || "",
                training_type: trainerDetail?.training_type || "",
                email: trainerDetail?.email || "",
                contact_no: trainerDetail?.contact_no || "",
                description: trainerDetail?.description || "",
                status: trainerDetail?.status || 1,
            }));
        }
    }, [viewMode, trainerDetail?.id]);

    // Helper functions for UI
    const renderHeader = () => {
        switch (viewMode) {
            case 'add': return 'Add New Trainer';
            case 'edit': return 'Edit Trainer Details';
            case 'detail': default: return 'Trainer Details';
        }
    };

    const renderMark = () => {
        switch (viewMode) {
            case 'add': return 'Fill The Information';
            case 'edit': return 'Edit Details';
            case 'detail': default: return 'Provided Details';
        }
    };

    const renderHeaderInfo = () => {
        switch (viewMode) {
            case 'add': return "You're just one step away from adding the new Trainer!";
            case 'edit': return "Here's the Information About The Trainer Details You've Filled.";
            case 'detail': default: return "Check Out Your Trainer Information!";
        }
    };

    // Handlers
    const handleEditClick = () => {
        navigate(`/edit-trainer/${id}`);
    };

    const handleStatus = (val) => {
        setFormData(prevData => ({
            ...prevData,
            status: val,
        }));
    };

    if (trainerDetailLoading) {
        return <div className="loading-state"><Loader /></div>;
    }

    return (
        <div className="trainerDetailMain">
            <button onClick={() => navigate(viewMode === 'edit' ? `/trainer-details/${id}` : '/trainer-list')} className="close_nav header_close">Close</button>
            <div className="dept-page-container">
                <h2 className="dept-page-main-heading">{renderHeader()}</h2>
                <div className="dept-page-content-wrapper">
                    <div className="dept-page-left-panel">
                        <h3 className="dept-page-mark-text">{renderMark()}</h3>
                        <p className="dept-page-info-text">{renderHeaderInfo()}</p>
                        <div className="dept-page-illustration-box">
                            <img className='imgBlackedWhite' src={bannerImg} alt="Illustration" />
                        </div>
                    </div>
                    <div className="dept-page-right-panel">
                        <div className="dept-page-cover-section">
                            <div className="dept-page-basic-info-section dept-page-basic-info-section_2">
                                <h3>Basic Information</h3>
                                <p className="dept-page-subtitle">{viewMode !== "detail" ? "Please Provide" : ''} Trainer Basic Details Below.</p>
                            </div>
                            <StatusDropdown
                                options={trainerStatusOptions?.filter((item) => item?.label !== "All")?.map((item) => ({
                                    value: item?.id,
                                    label: item?.label,
                                    icon: item?.icon,

                                }))}
                                defaultValue={formData?.status}
                                onChange={(val) => handleStatus(val)}
                                viewMode={viewMode !== 'detail'}
                            />
                        </div>
                        {viewMode === 'detail' && (
                            <button className="dept-page-edit-btn" onClick={handleEditClick}>
                                Edit
                            </button>
                        )}

                        <TrainerForm
                            viewMode={viewMode}
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};