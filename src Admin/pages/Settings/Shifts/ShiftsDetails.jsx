import React, { useEffect, useState } from 'react';
import '../Organization/OrganizationAddDetails/Organization.scss';
import { BookUser, User } from 'lucide-react';
import '../Leaves/LeaveDetails.scss'
import { GeneralSetting } from './GeneralSetting.jsx';
import { ShiftPolicy } from './ShiftPolicy.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShiftList } from './ShiftList.jsx';

export const ShiftsDetails = () => {
    // Sirf active tab ko manage karne ke liye state
    const [activeFormIndex, setActiveFormIndex] = useState("shifts");
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        if (location?.state?.activeIndex == "manage-shifts") setActiveFormIndex("manage-shifts")
    }, [location.state])

    // Sidebar navigation ke liye items
    const navItems = [
        { name: "General", icon: BookUser, navi: "shifts" },
        { name: "Shift Policy", icon: User, navi: "shift-policy" },
        { name: "Manage Shifts", icon: User, navi: "manage-shifts" },
    ];

    // Active component ko render karne ke liye function
    const renderActiveComponent = () => {
        switch (activeFormIndex) {
            case "shifts":
                return <GeneralSetting />;
            case "shift-policy":
                return <ShiftPolicy />;
            case "manage-shifts":
                return <ShiftList />;
        }
    };
    useEffect(() => {
        if (location?.state?.activeIndex) {
            setActiveFormIndex(location.state.activeIndex);
        } else {
            // URL se bhi nikal lo
            const lastSegment = location.pathname.split("/").pop();
            if (["shifts", "shift-policy", "manage-shifts"].includes(lastSegment)) {
                setActiveFormIndex(lastSegment);
            }
        }
    }, [location]);
    return (
        // Aapka diya gaya main layout structure
        <div className="LeaveDetailsMain setLeaveDetailMain">
            <button onClick={() => navigate(`/settings`)} className="close_nav header_close">Close</button>

            <div className='form_page_'>
                <div className="top-bar">
                    Shifts
                </div>

                <div className={`employee-form`}>

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
                                                navigate(`/settings/${item.navi}`)
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

                    {/* <div className='form-content'> */}
                    <div className="">
                        {/* Yahan active component render hoga */}
                        {renderActiveComponent()}
                    </div>
                    {/* </div> */}
                </div>
            </div>
        </div>
    );
}
