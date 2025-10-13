import { Brain, Building, Calendar, CalendarCheck, Clock, MoveRight, Rocket, Sparkles, UserRoundCog } from 'lucide-react'
import React, { useState } from 'react'
import { FaUserCog, FaBuilding, FaCalendar, FaTrophy, FaBrain } from "react-icons/fa";
import { BiSolidCalendarEdit } from "react-icons/bi";
import { AiFillClockCircle } from "react-icons/ai";
import { useNavigate } from 'react-router-dom'
import SearchBox from '../../utils/common/SearchBox'
import ListDataNotFound from '../../utils/common/ListDataNotFound';

export const SettingsData = () => {
  const Navigate = useNavigate()

  // const settingsCardData = [
  //   { name: 'User Roles', bodyText: 'All the Settings related to User Roles', icon: <FaUserCog fill='#494949' color='#fff' size={38} />, nextbtn: <MoveRight size={20} />, url: "/settings/users-list" },
  //   { name: 'Organization', bodyText: 'All the Settings related to Organization', icon: <FaBuilding fill='#494949' color='#fff' size={38} />, nextbtn: <MoveRight size={20} />, url: "/settings/all-organization-list" },
  //   { name: 'Leaves', bodyText: 'All the Settings related to Leaves', icon: <FaCalendar fill='#494949' color='#fff' size={38} />, nextbtn: <MoveRight size={20} />, url: "/settings/leaves" },
  //   { name: 'Attendance', bodyText: 'All the Settings related to Attendance', icon: <BiSolidCalendarEdit fill='#494949' color='#fff' size={38} />, nextbtn: <MoveRight size={20} />, url: "/settings/attendance" },
  //   { name: 'Performance', bodyText: 'All the Settings related to Performance', icon: <FaTrophy fill='#494949' color='#fff' size={38} />, nextbtn: <MoveRight size={20} />, url: "/settings/performance" },
  //   { name: 'Travel', bodyText: 'All the Settings related to Travel', icon: <FaCalendar fill='#494949' color='#fff' size={38} />, nextbtn: <MoveRight size={20} />, url: "/settings/travel" },
  //   { name: 'Masters', bodyText: 'All the Settings related to Masters', icon: <FaBrain fill='#494949' color='#fff' size={38} />, nextbtn: <MoveRight size={20} />, url: "/settings/master-list" },
  //   { name: 'Shifts', bodyText: 'All the Settings related to Shifts', icon: <AiFillClockCircle fill='#494949' color='#fff' size={38} />, nextbtn: <MoveRight size={20} />, url: "/settings/shifts" },
  // ]
    const settingsCardData = [
    { name: 'User Roles', bodyText: 'All the Settings related to User Roles', icon: <UserRoundCog/>, nextbtn: <MoveRight size={20} />, url: "/settings/users-list" },
    { name: 'Organization', bodyText: 'All the Settings related to Organization', icon: <Building />, nextbtn: <MoveRight size={20} />, url: "/settings/all-organization-list" },
    { name: 'Leaves', bodyText: 'All the Settings related to Leaves', icon: <Calendar/>, nextbtn: <MoveRight size={20} />, url: "/settings/leaves" },
    { name: 'Attendance', bodyText: 'All the Settings related to Attendance', icon: <CalendarCheck />, nextbtn: <MoveRight size={20} />, url: "/settings/attendance" },
    { name: 'Performance', bodyText: 'All the Settings related to Performance', icon: <Sparkles />, nextbtn: <MoveRight size={20} />, url: "/settings/performance" },
    { name: 'Travel', bodyText: 'All the Settings related to Travel', icon: <Rocket />, nextbtn: <MoveRight size={20} />, url: "/settings/travel" },
    { name: 'Masters', bodyText: 'All the Settings related to Masters', icon: <Brain />, nextbtn: <MoveRight size={20} />, url: "/settings/master-list" },
    { name: 'Shifts', bodyText: 'All the Settings related to Shifts', icon: <Clock />, nextbtn: <MoveRight size={20} />, url: "/settings/shifts" },
  ]

  const [searchTerm, setSearchTerm] = useState('');
  const [activeId, setActiveId] = useState('');

  // search handle
  const handleSearchChange = (valueOrEvent) => {
    const value = typeof valueOrEvent === "string"
      ? valueOrEvent
      : valueOrEvent?.target?.value || '';
    setSearchTerm(value.toLowerCase());
  };

  // filter data based on search
  const filteredData = settingsCardData.filter((data) => {
    if (!searchTerm) return true; // empty search → sab dikhao
    return (
      data.name.toLowerCase().includes(searchTerm) ||
      data.bodyText.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="settingSection">

      <div className="dashboard-sticky-header">
        <header className="top-header">
          <div className="header-left">
            <div>
              <h1>All Settings</h1>
              <p>See all settings list below</p>
            </div>
          </div>

          <div className="header-right header_rightMain">
            <div className="toolbar">
              <SearchBox
                onSearch={handleSearchChange}   // ✅ fixed
                value={searchTerm}
                placeholder="Search Settings"
              />
            </div>
          </div>
        </header>
      </div>

      <div className="settingBodyMain">
        <div className="settingCardSectionMain">
          {filteredData.length > 0 ? (
            filteredData.map((data, index) => (
              // <div
              //   className={`settingCard ${activeId === index ? 'active' : ''}`}
              //   onClick={() => { Navigate(data?.url); setActiveId(index) }}
              //   key={index}
              // >
              //   <div className="cardIcon">{data?.icon}</div>
              //   <div className="settingCardBottomMain">
              //     <div className="cardTextMain">
              //       <div className="cardText">{data?.name}</div>
              //       <div className="cardText2">{data?.bodyText}</div>
              //     </div>
              //     <div className="cardNextIcon">{data?.nextbtn}</div>
              //   </div>
              // </div>


            <div className="cardBodyWrapper">
              <div className='box_main_r'>

                  <div
                      className={`reportsCard`}
                       onClick={() => { Navigate(data?.url); setActiveId(index) }}
                      key={index}
                  >
                      <div className="cardBottomMain">
                      <div className="cardDisFlex">  
                      <div className="cardIcon">{data?.icon}</div>
                          <div className="cardTextMain">
                              <div className="cardText">{data?.name}</div>
                          </div>
                          </div> 
                          <div className="cardNextIcon">{data?.nextbtn}</div>
                      </div>
                  </div>
              </div>
              </div>
            ))
          ) : (
            <ListDataNotFound module="settings" />

          )}
        </div>
      </div>
    </div>
  )
}
