import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home, Briefcase, Calendar, ChevronRight, Files as FilesIcon,
    ChevronDown, IdCardLanyard, Building2, CalendarMinus,
    PanelRight, BookCheck, FileChartColumnIncreasing,
    Bell, CircleQuestionMark, Settings, LogOut, Plus, Check
} from 'lucide-react';
import './Sidebar.scss';
import logo from '../../assets/logo_hrms.svg';
import logoAccounting from '../../assets/accounting.svg';
import logoPayroll from '../../assets/payroll.svg';
import user from '../../assets/user.svg';
import Tooltip from '@mui/material/Tooltip';
import useOutsideClick from '../common/hooks/useOutsideClick';

// Sidebar menu data
export const menuItems = [
    {
        id: 'home', label: 'Home', icon: Home, path: '/admin-dashboard', submenu: [
            { label: 'Admin Dashboard', path: '/admin-dashboard' },
            { label: 'Employee Dashboard', path: '/employee-dashboard' },
            { label: 'Profile', path: '/admin-profile' },
        ]
    },
    {
        id: 'employee', label: 'Employee', icon: IdCardLanyard, path: '/employee-list', submenu: [
            { label: 'Job', path: '/job-list', BreadL:'All Job list', detail: '/job-details', add: '/add-new-job',BreadA:'Add New Job ', edit: '/edit-job-details' },
            { label: 'Applicant', path: '/applicant-list', BreadL:'All Applicant list', detail: '/applicant-details', add: '/add-applicant',BreadA:"Add New Applicant", edit: '/edit-applicant' },
            { label: 'Employee Onboarding',BreadL:'All Employee list', path: '/employee-list', detail: '/employee-details', add: '/add-employee',BreadA:"Add New Employee", edit: '/edit-employee' },
        ]
    },
    {
        id: 'organization', label: 'Organization', icon: Building2, path: '/department-list', submenu: [
            { label: 'Department', path: '/department-list',BreadL:'All Department list', detail: '/department-details', add: '/add-department',BreadA:"Add New Department", edit: '/edit-department' },
            { label: 'Designation', path: '/designation-list', BreadL:'All Designation list', detail: '/designation-details', add: '/add-designation',BreadA:"Add New Designation", edit: '/edit-designation' },
            { label: 'Employee Health', path: '/employee-health-list', BreadL:'All Employee Health list', detail: '/employee-health-details', add: '/add-new-employee-health',BreadA:"Add New Employee Health", edit: '/edit-employee-health' },
            { label: 'Birthday', path: '/birthday-list', BreadL:'All Birthday list' },
            { label: 'Announcement', path: '/announcement-list', BreadL:'All Announcement list', detail: '/announcement-details', add: '/add-new-announcement',BreadA:"Add New Announcement", edit: '/edit-announcement' },
        ]
    },
    {
        id: 'attendance', label: 'Attendance', icon: Calendar, path: '/attendance-list', submenu: [
            { label: 'Holiday', path: '/holiday-list', BreadL:'All Holiday list', detail: '/holiday-details', add: '/add-holiday-details',BreadA:"Add New Holiday", edit: '/edit-holiday-details' },
            { label: 'Shift', path: '/shift-list', BreadL:'All Shift list', detail: '/shift-details', add: '/add-shift',BreadA:"Add New Shift", edit: '/edit-shift' },
            { label: 'Assign Shift', path: '/assign-shift-list', BreadL:'All Assign Shift list', add: '/assign-shift',BreadA:"Add New Assign Shift" },
            { label: 'Attendance', path: '/attendance-list', BreadL:'All Attendance list', detail: '/attendance-details', add: '/add-attendance',BreadA:"Add New Attendance", edit: '/edit-attendance' },
        ]
    },
    {
        id: 'leave', label: 'Leave Tracker', icon: CalendarMinus, path: '/leave-list', submenu: [
            { label: 'Leave', path: '/leave-list', BreadL:'All Leave list', detail: '/leave-details', add: '/add-new-leave',BreadA:"Add New Leave", edit: '/edit-leave-details' },
            { label: 'Leave Type', path: '/leave-type-list', BreadL:'All Leave Type list', detail: '/leave-type-details', add: '/add-leave-type',BreadA:"Add New Leave Type", edit: '/edit-leave-type' },
            { label: 'Travel', path: '/travel-list', BreadL:'All Travel list', detail: '/travel-details', add: '/add-new-travel',BreadA:"Add New Travel", edit: '/edit-travel' },
        ]
    },
    {
        id: 'work', label: 'Work', icon: Briefcase, path: '/ticket-list', submenu: [
            { label: 'Ticket', path: '/ticket-list', BreadL:'All Ticket list', detail: '/ticket-details', add: '/add-ticket',BreadA:"Add New Ticket", edit: '/edit-ticket' },
            { label: 'Trainer', path: '/trainer-list', BreadL:'All Trainer list', detail: '/trainer-details', add: '/add-trainer',BreadA:"Add New Trainer", edit: '/edit-trainer' },
            { label: 'Training', path: '/training-list', BreadL:'All Training list', detail: '/training-details', add: '/add-training',BreadA:"Add New Training", edit: '/edit-training' },
            { label: 'Project', path: '/project-list', BreadL:'All Project list', detail: '/project-details', add: '/add-project',BreadA:"Add New Project", edit: '/edit-project' },
            { label: 'Client', path: '/client-list', BreadL:'All Client list', detail: '/client-details', add: '/new-client',BreadA:"Add New Client", edit: '/edit-client' },
        ]
    },
];

const Sidebar = ({ isExpanded, setIsExpanded }) => {
    const navigate = useNavigate();
    const location = useLocation(); // <- React Router hook
    const moreItems = [
        { id: 'files', label: 'Files', icon: FilesIcon, path: '/file-list' },
        { id: 'performance', label: 'Performance', icon: BookCheck, path: '/performance-list' },
        { id: 'reports', label: 'Reports', icon: FileChartColumnIncreasing, path: '/report-list' }
    ];
    const allItems = [...menuItems, ...moreItems];

    const [activeParentId, setActiveParentId] = useState(null);
    const [openSubmenuId, setOpenSubmenuId] = useState(null);

    // ------------------ Active parent/submenu detection ------------------
    useEffect(() => {
        const currentPath = location.pathname;
        let foundParentId = null;
        let longestMatchPath = ""; 

        for (const item of allItems) {
            if (item.submenu) {
                for (const sub of item.submenu) {
                    if (
                        currentPath === sub.path ||
                        (sub.detail && currentPath.startsWith(sub.detail)) ||
                        (sub.add && currentPath.startsWith(sub.add)) ||
                        (sub.edit && currentPath.startsWith(sub.edit)) // <- fix here
                    ) {
                        foundParentId = item.id;
                        break;
                    }
                }
            } else if (item.path === currentPath) {
                foundParentId = item.id;
            }
            if (foundParentId) break;
        }

        setActiveParentId(foundParentId);
        setOpenSubmenuId(foundParentId); // Active parent submenu open by default
    }, [location.pathname]);

    // ------------------ NavItem Component ------------------
    const NavItem = ({ item }) => {
        const hasSubmenu = !!item.submenu;
        const isActive = activeParentId === item.id;
        const isSubmenuOpen = openSubmenuId === item.id;

        const handleParentClick = () => {
            if (!isExpanded) setIsExpanded(true);
            const willOpen = isSubmenuOpen ? null : item.id;
            setOpenSubmenuId(willOpen);

            if (!hasSubmenu) {
                navigate(item.path);
            } else if (willOpen && !item.submenu.some(sub =>
                location.pathname === sub.path ||
                (sub.detail && location.pathname.startsWith(sub.detail)) ||
                (sub.add && location.pathname.startsWith(sub.add)) ||
                (sub.edit && location.pathname.startsWith(sub.edit)) // <- fix here
            )) {
                navigate(item.submenu[0].path);
            }
        };


        return (
            <li className="nav-item">
                <Tooltip
                    title={!isExpanded ? item.label : ''}
                    placement="right"
                    componentsProps={{ tooltip: { sx: { backgroundColor: '#322f35', color: '#fff', fontSize: '13px', fontWeight: 500, borderRadius: '6px', padding: '6px 12px' } } }}
                >
                    <div className={`nav-link ${isActive ? 'active' : ''}`} onClick={handleParentClick}>
                        <item.icon size={20} className="nav-icon" />
                        {isExpanded && <span className="nav-text">{item.label}</span>}
                        {hasSubmenu && isExpanded && <ChevronRight size={16} className={`chevron-icon ${isSubmenuOpen ? 'open' : ''}`} />}
                    </div>
                </Tooltip>

                {hasSubmenu && isExpanded && (
                    <ul className={`submenu ${isSubmenuOpen ? 'open' : ''} submenu_${item.submenu.length}`}>
                        {item.submenu.map(subItem => {
                            const subIsActive =
                                location.pathname === subItem.path ||
                                (subItem.detail && location.pathname.startsWith(subItem.detail)) ||
                                (subItem.add && location.pathname.startsWith(subItem.add)) ||
                                (subItem.edit && location.pathname.startsWith(subItem.edit)); // <- fix here

                            return (
                                <div key={subItem.path} className={`submenu-link ${subIsActive ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); navigate(subItem.path); }}>
                                    {subItem.label}
                                </div>
                            );
                        })}
                    </ul>
                )}
            </li>
        );
    };

    // ------------------ Dropdown logic ------------------
    const [showSetting, setShowSetting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);   // top HRMS dropdown
    const settingRef = useRef(null);    // bottom setting popup

    useOutsideClick(dropdownRef, () => setIsOpen(false));
    useOutsideClick(settingRef, () => setShowSetting(false));


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavgation = (path) => {
        setShowSetting(false);
        navigate(`/${path}`);
    };

    // ------------------ Sidebar JSX ------------------
    return (
        <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`} ref={settingRef}>
            <div className="sidebar-header" >
                <div className="dropdown-container" ref={dropdownRef} >
                    <button className="sidebar-logo" onClick={(e) => {
                        e.stopPropagation(); // prevent outside trigger
                        setIsOpen(!isOpen);
                    }}>
                        <img src={logo} alt="HRMS Logo" className="sidebar-logo-icon" />
                        <span className="sidebar-logo-text">HRMS</span>
                        <ChevronDown className={`chevron-icon ${isOpen ? 'open' : ''}`} size={22} />
                    </button>

                    {isOpen && (
                        <ul className="side-dropdown-menu">
                            <li className="dropdown-item active">
                                <div className="icon-wrap"><img src={logo} alt="HRMS Logo" /></div>
                                <div className="text-wrap"><span className="titles">HRMS</span><span className="subtitles">Human Resource</span></div>
                                <div className="check-icon"><Check /></div>
                            </li>
                            <li className="dropdown-item">
                                <div className="icon-wrap"><img src={logoAccounting} alt="Accounting" /></div>
                                <div className="text-wrap"><span className="titles">ACCOUNTING</span><span className="subtitles">Accounting Management</span></div>
                            </li>
                            <li className="dropdown-item">
                                <div className="icon-wrap"><img src={logoPayroll} alt="Payroll" /></div>
                                <div className="text-wrap"><span className="titles">PAYROLL</span><span className="subtitles">Employee Payroll Management</span></div>
                            </li>
                        </ul>
                    )}
                </div>
                <Tooltip
                    title={!isExpanded ? 'Open Sidebar' : 'Close Sidebar'}
                    placement="right"
                    componentsProps={{ tooltip: { sx: { backgroundColor: '#322f35', color: '#fff', fontSize: '13px', fontWeight: 500, borderRadius: '6px', padding: '6px 12px' } } }}
                >
                    <button className="sidebar-toggle-btn" onClick={() => setIsExpanded(!isExpanded)}><PanelRight size={20} /></button>
                </Tooltip>
            </div>

            <nav className="sidebar-nav" >
                <ul>{menuItems?.map(item => <NavItem key={item.id} item={item} />)}</ul>
                <h3 className="nav-section-title"><hr /></h3>
                <ul>{moreItems?.map(item => <NavItem key={item.id} item={item} />)}</ul>
            </nav>

            <div className={`settingTool ${showSetting ? 'showSettingPopup' : ''}`}>
                <div className="settingToolFlex">
                    <div className="sideAddbtn disFlex"><div className="settingToolIcon"><Plus size={20} /></div><div className="settingToolText">Add</div></div>
                    <div className="sideNotifi disFlex"><div className="settingToolIcon"><Bell size={20} /></div><div className="settingToolText">Notification</div></div>
                    <div className="sidehelp disFlex"><div className="settingToolIcon"><CircleQuestionMark size={20} /></div><div className="settingToolText">Help</div></div>
                    <div className="sideSetting disFlex" onClick={() => handleNavgation('settings')}><div className="settingToolIcon"><Settings size={20} /></div><div className="settingToolText">Settings</div></div>
                    <div className="sideLogout disFlex"><div className="settingToolIcon"><LogOut size={20} /></div><div className="settingToolText">Logout</div></div>
                </div>
            </div>

            <div className="sidebar-footer" onClick={(e) => {
                e.stopPropagation(); // prevent outside trigger
                setShowSetting(!showSetting);
            }}>
                <div className="user-profile">
                    <img src={user} alt="User Avatar" className="user-avatar" />
                    <div className="user-info"><div className="user-name">Codesquarry</div></div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
