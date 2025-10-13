import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bannerImg from '../../../assets/Loudspeaker.svg';
import StatusDropdown from '../../../utils/common/StatusDropdown/StatusDropdown';
import './UserDetails.scss'
import { useDispatch, useSelector } from 'react-redux';
import { getAnnouncementDetails } from '../../../Redux/Actions/announcementActions';
import Loader from '../../../utils/common/Loader/Loader';
import './AnnouncementDetails.scss'
import FileViewer from '../../../utils/common/FileViewer/FileViewer';
import { announcementStatusOptions } from '../../../utils/Constant';
import AnnouncementForm from './AnnouncementForm';
import { IoMegaphoneOutline } from "react-icons/io5";


export const AnnouncementDetails = () => {

    const { id } = useParams()
    const navigate = useNavigate();
    const dispatch = useDispatch()

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



    if (announcementLoading) {
        return <div className="loading-state"> <Loader /> </div>;
    }

    return (
        <div className="dept-page-container">
            <button onClick={() => navigate(`/announcement-list`)} className="close_nav header_close">Close</button>
            <div className="dept-page-container">
                <h2 className="dept-page-main-heading">Announcement Details</h2>
                <div className="dept-page-content-wrapper">
                    <div className="dept-page-left-panel">
                        <h3 className="dept-page-mark-text">Provided Details!</h3>
                        <p className="dept-page-info-text">Here’s the information about the Announcement you’ve filled. </p>
                        <div className="dept-page-illustration-box">
                            <img className=' ' src={bannerImg} alt="Illustration" />
                        </div>
                    </div>
                    <div className="dept-page-right-panel">

                         <div className="detailHeadMain">
                            <div className="detailheadUpper">
                               <IoMegaphoneOutline />
                            </div>
                        <div className="detailHeadBelow">
                       <StatusDropdown
                                options={announcementStatusOptions?.filter((item) => item?.label !== "All")?.map((item) => ({
                                    value: item?.id,
                                    label: item?.label,
                                    icon: item?.icon,
                                }))}
                                defaultValue={formData?.status}
                                disabled={true}
                            />
                        </div>
                        </div>

                        <div className="dept-page-cover-section">
                            <div className="dept-page-basic-info-section dept-page-basic-info-section_2">
                                <h3>Basic Information</h3>
                                <p className="dept-page-subtitle">Announcement Basic Details Below.</p>
                            </div>
                        </div>
                        <AnnouncementForm
                            formData={formData}
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
