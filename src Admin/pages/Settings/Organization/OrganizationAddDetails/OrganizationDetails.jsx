// src/pages/Organization/OrganizationDetails.js
import { useEffect, useState } from 'react';
import './Organization.scss';
import { MapPinHouse, BookUser, BookAIcon, AppWindowMac } from 'lucide-react';
import '../../../Organization/Department/DepartmentDetail/DepartmentDetail.scss';
import '../../../EmployeeOnboarding/AddEmployee/AddEmloyee.scss'

// Har tab ke content ko uski apni file se import karein
import BasicInformation from './BasicInformation.jsx';
import Policy from './Policy.jsx';
import DepartmentList from './DepartmentList.jsx';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { WorkLocationList } from './WorkLocationList.jsx';

const OrganizationDetails = () => {

    // Sirf active tab ko manage karne ke liye state
    const [activeFormIndex, setActiveFormIndex] = useState(0);
    const [viewMode, setViewMode] = useState('detail');

    const navigate = useNavigate();
    const location = useLocation();
    // useEffect(()=>{
    //     if(location?.state?.selectedTab == "deparmentList")setActiveFormIndex(2)
    // },[location.state])

    const { id } = useParams();


    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/organization-details')) {
            setActiveFormIndex('details');
        } else if (path.includes('/organization-policy')) {
            setViewMode('detail')
            setActiveFormIndex('policy');
        } else if (path.includes('/organization-department')) {
            setViewMode('detail')
            setActiveFormIndex('department');
        } else if (path.includes('/organization-work-locations')) {
            setViewMode('detail')
            setActiveFormIndex('work locations');
        }
        else {
            setActiveFormIndex('details');
        }
    }, [location.pathname]);

    useEffect(() => {
        if (location.pathname.includes("/add-organization-details")) {
            // setFormData(emptyUser);
            setViewMode('add')
        }
        else if (location.pathname.includes("/edit-organization-details")) {
            setViewMode('edit');
        }
        else if (location.pathname.includes("/organization-details")) {
            setViewMode('detail');
        }
    }, [location])


    // Sidebar navigation ke liye items
    const navItems = [
        { name: "Basic Information", icon: BookUser, navi: 'details' },
        { name: "Policy", icon: BookAIcon, navi: 'policy' },
        { name: "Departments", icon: AppWindowMac, navi: 'department' },
        { name: "Work Locations", icon: MapPinHouse, navi: 'work locations' }
    ];
    const isAddMode = location.pathname.includes('/add-organization');

    // Active component ko render karne ke liye function
    const renderActiveComponent = () => {
        if (isAddMode) {
            return <BasicInformation viewMode={viewMode} />;
        }
        switch (activeFormIndex) {
            case 'details':
                return <BasicInformation viewMode={viewMode} setViewMode={setViewMode} />;
            case 'policy':
                return <Policy />;
            case 'department':
                return <DepartmentList />;
            case 'work locations':
                return <WorkLocationList />;
            default:
                return <BasicInformation viewMode={viewMode} setViewMode={setViewMode} />;
        }
    };

    const renderHeader = () => {
        switch (viewMode) {
            case 'add': return 'Add New Organization';
            case 'edit': return 'Edit Organization Details';
            default: return 'Organization Details';
        }
    };

    return (
        // Aapka diya gaya main layout structure
        <div className='form_page_'>
            <button
                onClick={() => navigate(`${viewMode == 'edit' ? `/settings/organization-details/${id}` : '/settings/all-organization-list'}`)}
                className="close_nav header_close"
            >
                Close
            </button>

            <div className="top-bar">
                <div className='left'>
                    {/* <h2>{isAddMode ? "Add New Organization" : "Organization Details"}</h2> */}
                </div>
                {/* <button className="close_nav">
                    <XCircle size={24} strokeWidth={1.25} />
                </button> */}
            </div>
            <header className="top-header" style={{
                marginBottom: '10px'
            }}>
                <div className="header-left" style={{ marginLeft: "0" }}>
                    <h1 className="dept-page-main-heading" style={{ fontSize: '24px', fontWeight: "400", color: "#000" }}>{renderHeader()}</h1>
                </div>
            </header>

            <div className={` ${isAddMode ? 'no-sid ebar' : 'employee-form'}`}>
                {!isAddMode && (
                    <div className='employee_form_header'>

                        <div className='header_emp'>
                            <div className="navbar-container">
                                <div className="navbar-items">
                                    {navItems.map((item, index) => (
                                        <span
                                            key={item.name}
                                            className={`${item.navi === activeFormIndex ? 'active' : ''}`}
                                            onClick={() => {
                                                setActiveFormIndex(item.navi)
                                                navigate(`/settings/organization-${item.navi?.split(" ")?.join("-")}/${id}`, { state: { orgId: id } })
                                            }}
                                        >
                                            <item.icon size={20} strokeWidth={1.5} />
                                            <p>{item.name}</p>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* <div className='form-content'> */}
                <div className="">
                    {/* Yahan active component render hoga */}
                    {renderActiveComponent()}
                </div>
                {/* </div> */}
            </div>
        </div>
    );
};

export default OrganizationDetails;