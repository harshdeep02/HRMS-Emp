import React, { useState } from 'react';
import '../Organization/OrganizationAddDetails/Organization.scss';
import { Building, FileText, Briefcase, XCircle, BookUser, User } from 'lucide-react';
import { WorkCalender } from './WorkCalender.jsx';
import { LeavePolicy } from './LeavePolicy.jsx';
import './LeaveDetails.scss'
import { useNavigate } from 'react-router-dom';

export const SettingLeaveDetails = () => {
    // Sirf active tab ko manage karne ke liye state
    const navigate = useNavigate();
    const [activeFormIndex, setActiveFormIndex] = useState(0);

    // Sidebar navigation ke liye items
    const navItems = [
        { name: "Leave Policy", icon: BookUser },
        { name: "Work Calendar", icon: User },
    ];

    // Active component ko render karne ke liye function
    const renderActiveComponent = () => {
        switch (activeFormIndex) {
            case 0:
                return <LeavePolicy />;
            case 1:
                return <WorkCalender />;
        }
    };

    return (
        // Aapka diya gaya main layout structure
        <div className="LeaveDetailsMain">
            <button onClick={() => navigate(`/settings`)} className="close_nav header_close">Close</button>

            <div className='form_page_'>
                <div className="top-bar">
                    Leaves
                </div>

                <div className={`employee-form`}>

                    <div className='employee_form_header'>
                        <div className='header_emp'>
                            <div className="navbar-container">
                                <div className="navbar-items">
                                    {navItems.map((item, index) => (
                                        <span
                                            key={item.name}
                                            className={`${index === activeFormIndex ? 'active' : ''}`}
                                            onClick={() => setActiveFormIndex(index)}
                                        >
                                            <item.icon size={20} strokeWidth={1.5} />
                                            <p>{item.name}</p>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className='form-content'> */}
                    <div className="settingLeaveDetailMain">
                        {/* Yahan active component render hoga */}
                        {renderActiveComponent()}
                    </div>
                    {/* </div> */}
                </div>
            </div>
        </div>
    );
}
