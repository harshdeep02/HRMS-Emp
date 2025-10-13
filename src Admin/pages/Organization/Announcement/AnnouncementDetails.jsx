import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import bannerImg from '../../../assets/Loudspeaker.svg';
import StatusDropdown from '../../../utils/common/StatusDropdown/StatusDropdown';
import '../../Settings/Users/UserDetails.scss'
import { useDispatch, useSelector } from 'react-redux';
import { getAnnouncementDetails } from '../../../Redux/Actions/announcementActions';
import Loader from '../../../utils/common/Loader/Loader';
import './AnnouncementDetails.scss'
import imgIcon from "../../../assets/profile-upload-icon.png";
import pdfIcon from "../../../assets/pdf.png"; // Added Icon
import FileViewer from '../../../utils/common/FileViewer/FileViewer';
import { announcementStatusOptions } from '../../../utils/Constant';
import AnnouncementForm from './AnnouncementForm';
import { getDepartmentList } from '../../../Redux/Actions/departmentActions';

export const AnnouncementDetails = () => {

    const { id } = useParams()
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const renderHeader = () => {
        switch (viewMode) {
            case 'add': return 'Add New Announcement';
            case 'edit': return 'Edit Announcement';
            case 'detail': default: return 'Announcement Details';
        }
    };
    const renderMark = () => {
        switch (viewMode) {
            case 'add': return 'Fill The Information';
            case 'edit': return 'Edit User Details';
            case 'detail': default: return 'Provided Details!';
        }
    };

    const renderHeaderInfo = () => {
        switch (viewMode) {
            case 'add': return "You're just one step away from adding the new Announcement! ";
            case 'edit': return "Check out your Announcement information! ";
            case 'detail': default: return "Here’s the information about the Announcement you’ve filled. ";
        }
    };

    const [viewMode, setViewMode] = useState('');
    const [formData, setFormData] = useState({
        subject: '',
        expiry: '',
        department_id: '',
        notify_all: '',
        notify_any_others: '',
        description: '',
        attachment: '',
        status: 1
    });
    const [isFileViewerOpen, setFileViewerOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const announcementData = useSelector((state) => state?.announcementDetails);
    const announcementDetails = announcementData?.data?.announcement;
    const announcementLoading = announcementData?.loading || false;

    const departmentData = useSelector((state) => state?.departmentList);
    const departmentLists = departmentData?.data?.department || [];

    // Fetch data based on current state
    const fetchDepartments = (search = "") => {
        const sendData = { status: 1 };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getDepartmentList(sendData));
    };

    const handleSearch = (query, type) => {
        if (type === "department_id") {
            fetchDepartments(query);
        }
    };

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('add-new-announcement') || path.includes('edit-announcement')) {
            // if (departmentLists?.length === 0) 
            fetchDepartments();
        }
    }, [location.pathname]);


    useEffect(() => {
        if (id && announcementDetails?.id !== id) {
            dispatch(getAnnouncementDetails({ id }));
        }
    }, [id]);

    useEffect(() => {
        if (announcementDetails && id) {
            const attachement_url = announcementDetails?.attachment ? JSON.parse(announcementDetails.attachment) : ''
            setFormData((prev) => ({
                ...prev,
                subject: announcementDetails?.subject ? announcementDetails?.subject : '',
                department_id: announcementDetails?.department_id ? announcementDetails?.department_id : '',
                department_name: announcementDetails?.department?.department_name ?? "",
                expiry: announcementDetails?.expiry ? announcementDetails?.expiry : '',
                notify_all: announcementDetails?.notify_all ? announcementDetails?.notify_all : '',
                notify_any_others: announcementDetails?.notify_any_others ? JSON.parse(announcementDetails?.notify_any_others) : '',
                description: announcementDetails?.description ? announcementDetails?.description : '',
                attachment: attachement_url ? attachement_url : '',
                status: announcementDetails?.status ? announcementDetails?.status : 1,
            }));
        }
    }, [announcementDetails])


    useEffect(() => {
        if (location.pathname.includes("add-new-announcement")) {
            setViewMode('add')
        }
        else if (location.pathname.includes("edit-announcement")) {
            setViewMode('edit')
        }
        else if (location.pathname.includes("announcement-details")) {
            setViewMode('detail')
        }
    }, [location])


    const handleEditClick = () => {
        navigate(`/edit-announcement/${id}`)
        // setViewMode("edit")
    };

    const handleStatus = (val) => {
        setFormData(prevData => ({
            ...prevData,
            status: val,
        }));
    }

    const handleViewFile = (file) => {
        if (file && file.url) {
            setSelectedFile(file);
            setFileViewerOpen(true);
        }
    };

    // Helper component to display a document in detail view
    const DocumentDetailItem = ({ document, onWebView }) => {
        if (!document) {
            return <div className="no-document-text">No Document Uploaded</div>;
        }
        const isImage = document.type?.startsWith("image/");
        return (
            <div className="list-item">
                <div className="item-icon" onClick={() => onWebView(document)}>
                    <img
                        src={isImage ? imgIcon : pdfIcon}
                        alt={isImage ? "Image" : "PDF"}
                    />
                </div>
                <div className="item-details">
                    <div className="item-main-title">{document.name}</div>
                    <div className="item-sub-title">Click to Preview</div>
                </div>
                <div
                    className="item-action view_btn"
                    onClick={() => onWebView(document)}>
                    <button>View</button>
                </div>
            </div>
        );
    };


    if (announcementLoading) {
        return <div className="loading-state"> <Loader /> </div>;
    }

    return (
        <div className="dept-page-container">
            <button onClick={() => navigate(`${viewMode == 'edit' ? `/announcement-details/${id}` : '/announcement-list'}`)} className="close_nav header_close">Close</button>
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
                                <p className="dept-page-subtitle">{viewMode !== "detail" ? "Please Provide" : ''} Announcement Basic Details Below.</p>
                            </div>
                            {/* {viewMode !== "detail" ? */}
                            <StatusDropdown
                                options={announcementStatusOptions?.filter((item) => item?.label !== "All")?.map((item) => ({
                                    value: item?.id,
                                    label: item?.label,
                                    icon: item?.icon,
                                }))}
                                defaultValue={formData?.status}
                                onChange={(val) => handleStatus(val)}
                                disabled={true}
                            />
                            {/* :
                                <div className="status-dropdown">
                                    <div className={`status-label dropdown-trigger`}>
                                        {announcementStatusOptions?.filter((item) => item.id == formData?.status)?.[0]?.label}
                                    </div>
                                </div>
                            } */}
                        </div>
                        {viewMode === 'detail' && (
                            <button className="dept-page-edit-btn" onClick={handleEditClick}>
                                {/*  */}
                                Edit
                            </button>
                        )}
                        <AnnouncementForm
                            viewMode={viewMode}
                            formData={formData}
                            setFormData={setFormData}
                            handleSearch={handleSearch}
                        />
                    </div>
                </div>
            </div>

            <FileViewer
                isOpen={isFileViewerOpen}
                onClose={() => setFileViewerOpen(false)}
                file={selectedFile}
            />
        </div>
    )
}
