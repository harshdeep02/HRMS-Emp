import { Calendar1, CalendarArrowUp, CalendarClock, CalendarDays, DatabaseBackup, FolderClock, GalleryVerticalEnd, Gauge, Layers, MoveRight, SquareChartGantt, Trophy } from 'lucide-react'
import React, { useState } from 'react'
import { FaUserCog, FaBuilding, FaCalendar, FaTrophy } from "react-icons/fa";
import { BiSolidCalendarEdit } from "react-icons/bi";
import { useNavigate } from 'react-router-dom'
import SearchBox from '../../../utils/common/SearchBox'
import ListDataNotFound from '../../../utils/common/ListDataNotFound';
import '../Reports.scss' // import the shared scss file

export const OrganisationReportsData = () => {
    const Navigate = useNavigate()

    // const reportsCardData = [
    //     {
    //         section: 'Employee Information',
    //         items: [
    //             { name: 'Dashboard', bodyText: 'All The Details Related To Dashboard', icon: <FaUserCog fill='#494949' size={38} />, nextbtn: <MoveRight size={20} />, url: "/organisation-reports/dashboard-reports" },
    //             { name: 'Employee Attrition Trend', bodyText: 'All The Details Related To Organization', icon: <FaBuilding fill='#494949' size={38} />, nextbtn: <MoveRight size={20} />, url: "/organisation-reports/employee-attrition-trend" },
    //         ]
    //     },
    //     {
    //         section: 'Leave Tracker',
    //         items: [
    //             { name: 'Leave Report', bodyText: 'All The Settings Related To Leave', icon: <FaCalendar fill='#494949' size={38} />, nextbtn: <MoveRight size={20} />, url: "/organisation-reports/leave-report" },
    //             { name: 'Leave Summary', bodyText: 'All The Settings Related To Travels', icon: <FaCalendar fill='#494949' size={38} />, nextbtn: <MoveRight size={20} />, url: "/organisation-reports/leave-report/leave-summary" },
    //         ]
    //     },
    //     {
    //         section: 'Attendance',
    //         items: [
    //             { name: 'Daily Attendance Report', bodyText: 'All The Settings Related To Performance', icon: <FaTrophy fill='#494949' size={38} />, nextbtn: <MoveRight size={20} />, url: "/organisation-reports/daily-attendance" },
    //             { name: 'Employee Present/Absent Status', bodyText: 'All The Settings Related To Travels', icon: <BiSolidCalendarEdit fill='#494949' size={38} />, nextbtn: <MoveRight size={20} />, url: "/organisation-reports/calender-present-absent" },
    //         ]
    //     },
    //     {
    //         section: 'Performance',
    //         items: [
    //             { name: 'Performance Review', bodyText: 'All The Settings Related To Performance', icon: <FaTrophy fill='#494949' size={38} />, nextbtn: <MoveRight size={20} />, url: "/organisation-reports/performance-review" },
    //             { name: 'Appraisal History', bodyText: 'All The Settings Related To Travels', icon: <FaCalendar fill='#494949' size={38} />, nextbtn: <MoveRight size={20} />, url: "/organisation-reports/appraisal-history" },
    //         ]
    //     }
    // ];

        const reportsCardData = [
            { name: 'Employee Information', icon: <DatabaseBackup strokeWidth={2} size={24} />, submenu:
            [{bodyText: 'Dashboard', icon: <Gauge  size={24} strokeWidth={1}/>, nextbtn: <MoveRight size={20} />, url: "/organisation-reports/dashboard-reports" },
             {bodyText: 'Employee Attrition Trend', icon: <Layers  size={24} strokeWidth={1}/>, nextbtn: <MoveRight size={20} />, url: "/organisation-reports/employee-attrition-trend" }]},

            { name: 'Leave Report', icon: <CalendarDays strokeWidth={2} size={24} />, submenu:
            [{bodyText: 'Leave Tracker', icon: <GalleryVerticalEnd size={24} strokeWidth={1}/>, nextbtn: <MoveRight size={20} />, url: "/organisation-reports/leave-tracker-list" }]}, 

            { name: 'Attendance', icon: <CalendarClock strokeWidth={2} size={24} />, submenu:
            [{bodyText: 'Daily Attendance Report', icon: <Calendar1 size={24} strokeWidth={1}/>, nextbtn: <MoveRight size={20} />, url: "/organisation-reports/daily-attendance"},
             {bodyText: 'Employee Present/Absent Status', icon: <CalendarClock size={24} strokeWidth={1}/>, nextbtn: <MoveRight size={20} />, url: "/organisation-reports/calender-present-absent"},
             {bodyText: 'Monthly Attendance', icon: <CalendarArrowUp size={24} strokeWidth={1}/>, nextbtn: <MoveRight size={20} />, url: "/organisation-reports/calender-present-absent"},
            ]},
            
            { name: 'Performance', icon: <Trophy  strokeWidth={2} size={24} />, submenu:
            [{bodyText: 'Appraisal History', icon: <FolderClock size={24} strokeWidth={1}/>, nextbtn: <MoveRight size={20} />, url: "/organisation-reports/appraisal-history" },
             {bodyText: 'Performance Review',icon: <SquareChartGantt  size={24} strokeWidth={1}/>, nextbtn: <MoveRight size={20} />, url: "/organisation-reports/performance-review" 
            }]},
        ]  

    const [searchTerm, setSearchTerm] = useState('');
    const [activeId, setActiveId] = useState('');

    const handleSearchChange = (valueOrEvent) => {
        const value = typeof valueOrEvent === "string"
            ? valueOrEvent
            : valueOrEvent?.target?.value || '';
        setSearchTerm(value.toLowerCase());
    };

    // const filteredSections = reportsCardData.map(section => ({
    //     ...section,
    //     items: section.items.filter(item =>
    //         item.name.toLowerCase().includes(searchTerm) ||
    //         item.bodyText.toLowerCase().includes(searchTerm)
    //     )
    // })).filter(section => section.items.length > 0);

        const filteredData = reportsCardData.filter((data) => {
        if (!searchTerm) return true;
        return (
            data.name.toLowerCase().includes(searchTerm) ||
            data.bodyText.toLowerCase().includes(searchTerm)
        );
    });

    return (
        <div className="reportsSection">
            <div className="dashboard-sticky-header">
                <header className="top-header">
                    <div className="header-left">
                        <div>
                            <h1>Organisational Reports</h1>
                            <p>See Employees Performance File List Below</p>
                        </div>
                    </div>
                    <div className="header-right header_rightMain">
                        <div className="toolbar">
                            <SearchBox
                                onSearch={handleSearchChange}
                                value={searchTerm}
                                placeholder="Search Reports"
                            />
                        </div>
                    </div>
                </header>
            </div>
            <div className="reportsBodyMain">
                {/* <div className="reportsCardSectionMain"> */}

                    {/* {filteredSections.length > 0 ? (
                        filteredSections.map((section, sectionIndex) => (
                            <div className="reportsSubSection" key={sectionIndex}>
                                <div className="reportsSubSectionTitle">{section.section}</div>
                                <div className="reportsSubSectionCards">
                                    {section.items.map((data, index) => (
                                        <div
                                            className={`reportsCard ${activeId === `${sectionIndex}-${index}` ? 'active' : ''}`}
                                            onClick={() => { Navigate(data?.url); setActiveId(`${sectionIndex}-${index}`) }}
                                            key={index}
                                        >
                                            <div className="cardIcon">{data?.icon}</div>
                                            <div className="cardBottomMain">
                                                <div className="cardTextMain">
                                                    <div className="cardText">{data?.name}</div>
                                                    <div className="cardText2">{data?.bodyText}</div>
                                                </div>
                                                <div className="cardNextIcon">{data?.nextbtn}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <ListDataNotFound module="reports" />
                    )} */}
                    {filteredData.length > 0 ? (
                        filteredData.map((data, index) => (
                            <div className='box_main_div'>
                                <div className="box_card_head">
                                <div className="setCardIcon">{data?.icon}</div>
                                <h3>{data?.name}</h3>
                                </div>
                                <div className="cardBodyWrapper">
                                {data?.submenu?.map((item, )=>
                               (<div className='box_main_r'>

                                    <div
                                        className={`reportsCard`}
                                        onClick={() => { Navigate(item?.url) }}
                                        key={index}
                                    >
                                        <div className="cardBottomMain">
                                        <div className="cardDisFlex">  
                                        <div className="cardIcon">{item?.icon}</div>
                                            <div className="cardTextMain">
                                                <div className="cardText">{item?.bodyText}</div>
                                            </div>
                                            </div> 
                                            <div className="cardNextIcon">{item?.nextbtn}</div>
                                        </div>
                                    </div>
                                </div>))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <ListDataNotFound module="reports" />
                    )}
                {/* </div> */}
            </div>
        </div>
    )
}