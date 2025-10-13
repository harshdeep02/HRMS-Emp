import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    User,
    BookPlus,
    Pencil
} from 'lucide-react';
import StatusDropdown from '../../../../utils/common/StatusDropdown/StatusDropdown.jsx';
import { getDesignationDetails } from '../../../../Redux/Actions/designationActions.js';
import Loader from '../../../../utils/common/Loader/Loader.jsx';
import { designationStatusOptions } from '../../../../utils/Constant.js';
import DesignationForm from './DesignationForm.jsx';
import { FaUserTag } from "react-icons/fa";
import DesignationEmployeeList from './DesignationEmployeeList.jsx';
import './DesignationDetails.scss'


const texts = {
        header: "Designation Details",
        mark: "Provided Details!",
        info: "Check out your Designation information!",
};

const DesignationDetails = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        designation_name: '',
        department_name: '',
        description: '',
        status: 1
    });

    // Fetch data from Redux state using useSelector
    const designationDetails = useSelector((state) => state?.designationDetails);
    const designationDetail = designationDetails?.data?.designation;
    const designationLoading = designationDetails?.loading || false;

    const [activeFormIndex, setActiveFormIndex] = useState(0);

    const navItems = [
        { name: 'Basic Information', icon: BookPlus },
        { name: 'Employee Summary', icon: User },

    ];

    useEffect(() => {
        if (id && designationDetail?.id != id) {
            dispatch(getDesignationDetails({ id }));
        }
    }, [id]);

    useEffect(() => {
        if (id && designationDetail) {
            setFormData((prev) => ({
                ...prev,
                designation_name: designationDetail?.designation_name || '',
                department_name: designationDetail?.department?.department_name || '',
                description: designationDetail?.description || '',
                status: designationDetail?.status || 1
            }));
        }
    }, [designationDetail]);


    if (designationLoading) {
        return <div className="loading-state"> <Loader /> </div>;
    }

    return (
        <div className="dept-page-container">
            <button onClick={() => navigate('/designation-list')} className="close_nav header_close">Close</button>

            <h2 className="dept-page-main-heading">{texts.header}</h2>
            <div className="dept-page-content-wrapper">
                    <>
                        <div className="navbar-container">
                            <div className="navbar-items">
                                {navItems?.map((item, index) => {
                                    return (
                                        <span
                                            key={index}
                                            className={`${index === activeFormIndex ? 'active' : ''} `}
                                            onClick={() => {
                                               setActiveFormIndex(index);
                                            }}
                                        >
                                            <item.icon size={20} strokeWidth={1.5} />
                                            <p>{item?.name}</p>
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                {activeFormIndex == 0 && (
                <>
                    <div className="dept-page-right-panel">

                        <div className="detailHeadMain">
                                <div className="detailheadUpper">
                                    <FaUserTag />
                                </div>
                            <div className="detailHeadBelow">
                            <StatusDropdown
                                options={designationStatusOptions?.filter((item) => item?.label !== "All")?.map((item) => ({
                                    value: item?.id,
                                    label: item?.label,
                                    icon: item?.icon,
                                }))}
                                defaultValue={formData?.status}
                                disabled={true}
                            />
                            </div>
                            </div>

                        <div className="dept-page-cover-section ">
                            <div className="dept-page-basic-info-section dept-page-basic-info-section_2">
                                <h3>Basic Information</h3>
                                <p className="dept-page-subtitle">Basic profile overview</p>
                            </div>
                        </div>

                        <DesignationForm
                            formData={formData}
                        />
                    </div>
                    </>
                )
                }
                    <>
                        {activeFormIndex == 1 &&
                            <div className="dept_page_table">
                                <div className="dept-page">
                                    <DesignationEmployeeList />
                                </div>
                            </div>
                        }
                    </>
            </div>
        </div>
    );
};

export default DesignationDetails;