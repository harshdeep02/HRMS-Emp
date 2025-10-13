import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PencilLine, User, ListChecks } from 'lucide-react';
import bannerImg from '../../../../assets/Comment-3.svg'; // Make sure this path is correct in your project
import Loader from '../../../../utils/common/Loader/Loader.jsx'; // Make sure this path is correct
import ClientForm from './ClientForm.jsx';
import ProjectHistory from './ProjectHistory.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getClientDetails } from '../../../../Redux/Actions/clientActions.js';


const texts = {
    add: {
        header: "Add New Client",
        mark: "Fill The Information",
        info: "You're Just One Step Away From Adding The New Client!",
    },
    edit: {
        header: "Edit Client",
        mark: "Edit The Information",
        info: "Here's The Information About The Client Details You've Filled.",
    },
    detail: {
        header: "Client Details Page",
        mark: "Provided Details!",
        info: "Check out the client's basic information and project history!",
    },
};

const ClientDetail = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();

    //Data from redux
    const clientDetails = useSelector((state) => state?.clientDetails);
    const clientDetail = clientDetails?.data?.result || {};
    const clientDetailLoading = clientDetails?.loading || false;
    const clientDelete = useSelector((state) => state?.clientDelete);

    const navItems = [
        { name: 'Basic Information', icon: User },
        { name: 'Project History', icon: ListChecks },
    ];

    const [activeFormIndex, setActiveFormIndex] = useState(0);
    const [viewMode, setViewMode] = useState('detail');
    const [formData, setFormData] = useState({
        client_name: "",
        company_name: "",
        email: "",
        designation: "",
        gender: "",
        mobile_no: "",
        company_contact_no: "",
        website: "",
        client_address: "",
        description: "",
        client_image: "",
        secondary_contact_no: "",
        status: 1
    });

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/add-client')) {
            setViewMode('add');
        } else if (path.includes('/edit-client')) {
            setViewMode('edit');
        } else {
            setViewMode('detail');
        }
    }, [location.pathname, id]);

    useEffect(() => {
        if (id && clientDetail?.id != id) {
            const queryParams = {
                id: id,
            };
            dispatch(getClientDetails(queryParams));
            //   dispatch(getClientProjectDetails(sendData2));
        }
    }, [id]);

    useEffect(() => {
        if (id && clientDetail) {
            setFormData((prev) => ({
                ...prev,
                client_name: clientDetail?.client_name || "",
                company_name: clientDetail?.company_name || "",
                email: clientDetail?.email || "",
                designation: clientDetail?.designation || "",
                gender: clientDetail?.gender || "",
                mobile_no: clientDetail?.mobile_no || "",
                company_contact_no: clientDetail?.company_contact_no || "",
                website: clientDetail?.website || "",
                client_address: clientDetail?.client_address || "",
                description: clientDetail?.description || "",
                client_image: clientDetail?.client_image ? JSON.parse(clientDetail?.client_image) : "",
                secondary_contact_no: clientDetail?.secondary_contact_no || "",
                status: clientDetail?.status || 1
            }));
        }
    }, [viewMode, clientDetail]);


    const handleEditClick = () => {
        navigate(`/edit-client/${id}`);
    };


    if (clientDetailLoading) {
        return <div className="loading-state"><Loader /></div>;
    }

    return (
        <div className="dept-page-container">
            {/* The close button logic might need adjustment based on your routing */}
            <button onClick={() => navigate(`${viewMode === 'edit' ? `/client-details/${id}` : '/client-list'}`)} className="close_nav header_close">Close</button>
            <h2 className="dept-page-main-heading">{texts[viewMode].header}</h2>
            <div className="dept-page-content-wrapper">
                {viewMode === 'add' ? (
                    <div className="dept-page-left-panel">
                        <h3 className="dept-page-mark-text">{texts[viewMode].mark}</h3>
                        <p className="dept-page-info-text">{texts[viewMode].info}</p>
                        <div className="dept-page-illustration-box">
                            <img className=' ' src={bannerImg} alt="Illustration" />
                        </div>
                    </div>
                ) : (
                    <div className="navbar-container">
                        <div className="navbar-items">
                            {navItems?.map((item, index) => (
                                <span
                                    key={index}
                                    className={`${index === activeFormIndex ? 'active' : ''}`}
                                    onClick={() => setActiveFormIndex(index)}
                                >
                                    <item.icon size={20} strokeWidth={1.5} />
                                    <p>{item?.name}</p>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {activeFormIndex === 0 && (
                    <div className="dept-page-right-panel">
                        {viewMode === 'detail' && (
                            <div className="dept-page-cover-section">
                                <button className="dept-page-edit-btn" onClick={handleEditClick}>
                                     Edit
                                </button>
                            </div>
                        )}
                        <ClientForm
                            viewMode={viewMode}
                            formData={formData}
                            setFormData={setFormData}
                            handleEditClick={handleEditClick}
                        />
                    </div>
                )}

                {viewMode === 'detail' && activeFormIndex === 1 && (
                    <div className="dept-page-table">
                        <ProjectHistory />
                        {/* <CalendarSkeletonLoader/> */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientDetail;