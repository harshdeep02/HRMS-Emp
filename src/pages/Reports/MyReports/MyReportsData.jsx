import { Calendar, Calendar1, CalendarClock, CalendarDays, FolderClock, GalleryVerticalEnd, MoveRight, SquareChartGantt, Trophy } from 'lucide-react'
import React, { useState } from 'react'
import { FaCalendar, FaTrophy } from "react-icons/fa";
import { BiSolidCalendarEdit } from "react-icons/bi";
import { useNavigate } from 'react-router-dom'
import SearchBox from '../../../utils/common/SearchBox'
import ListDataNotFound from '../../../utils/common/ListDataNotFound';
import '../Reports.scss' // import the shared scss file
import './LeaveReport/LeaveReport.scss'

export const MyReportsData = () => {
    const Navigate = useNavigate()

    const reportsCardData = [
        { name: 'Leave Report', icon: <CalendarDays strokeWidth={2} size={24} />, submenu:
        [{bodyText: 'Leave Booked & Balance', icon: <Calendar size={24} strokeWidth={1}/>, nextbtn: <MoveRight size={20} />, url: "/my-reports/leave-balance" },{bodyText: 'Leave Summary', icon: <GalleryVerticalEnd size={24} strokeWidth={1}/>, nextbtn: <MoveRight size={20} />, url: "/my-reports/leave-summary" }]},

        { name: 'Attendance Report', icon: <CalendarClock strokeWidth={2} size={24} />, submenu:
        [{bodyText: 'Monthly Attendance Report', icon: <Calendar1 size={24} strokeWidth={1}/>, nextbtn: <MoveRight size={20} />, url: "/my-reports/attendance-report"},
            // {bodyText: 'Monthly attendance report', icon: <Calendar1 size={24} strokeWidth={1}/>, nextbtn: <MoveRight size={20} />, url: "/my-reports/employee-attrition-board"}
        ]},
        
        { name: 'Performance', icon: <Trophy  strokeWidth={2} size={24} />, submenu:
        [{bodyText: 'Appraisal History', icon: <FolderClock size={24} strokeWidth={1}/>, nextbtn: <MoveRight size={20} />, url: "/my-reports/appraisal-history" },
        {bodyText: 'Performance Review',icon: <SquareChartGantt  size={24} strokeWidth={1}/>, nextbtn: <MoveRight size={20} />, url: "/my-reports/rerformance-review" 
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
                            <h1>My Reports</h1>
                            <p>See All Your Report Below</p>
                        </div>
                    </div>
                    <div className="header-right header_rightMain">
                        <div className="toolbar">
                            <SearchBox
                                onSearch={handleSearchChange}
                                value={searchTerm}
                                placeholder="Search Reports..."
                            />
                        </div>
                    </div>
                </header>
            </div>
            <div className="reportsBodyMain">
                <div className="reportsCardSectionMain">
                    {filteredData.length > 0 ? (
                        filteredData.map((data, index) => (
                            <div className='box_main_div' key={data?.name}>
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
                </div>
            </div>
        </div>
    )
}