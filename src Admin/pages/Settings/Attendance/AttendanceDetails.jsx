import React, { useState } from 'react';
import '../Organization/OrganizationAddDetails/Organization.scss';
import { BookA, BookUser, CalendarCheck2 } from 'lucide-react';
import '../Leaves/LeaveDetails.scss'
import { AttendanceMethods } from './AttendanceMethods.jsx';
import { AttendancePolicy } from './AttendancePolicy.jsx';
import { useNavigate } from 'react-router-dom';

export const AttendanceDetails = () => {
        const navigate = useNavigate();

     // Sirf active tab ko manage karne ke liye state
        const [activeFormIndex, setActiveFormIndex] = useState(0);
    
        // Sidebar navigation ke liye items
        const navItems = [
            { name: "Attendance Methods", icon: CalendarCheck2 },
            { name: "Attendance Policy", icon: BookA},
        ];
    
        // Active component ko render karne ke liye function
        const renderActiveComponent = () => {
            switch (activeFormIndex) {
                case 0:
                     return <AttendanceMethods />;
                case 1:
                    return <AttendancePolicy />;
            }
        };

 return (

        // Aapka diya gaya main layout structure
        <div className="attendanceDetailsMain">
                    <button onClick={() => navigate(`/settings`)} className="close_nav header_close">Close</button>

        <div className='form_page_'>
            <div className="top-bar">
                Attendance
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
