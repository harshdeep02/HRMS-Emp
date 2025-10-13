import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home, Briefcase, FileText as OrganizationIcon, Users, Calendar, CheckSquare,
    BarChart2, Plus, ChevronsLeft, ChevronRight, Files as FilesIcon, Award,
    LayoutDashboard,
    ChevronDown,
    Database,
    Wallet,
    IdCardLanyard,
    Bell,
    CircleQuestionMark,
    Settings,
    Building2,
    CalendarMinus
} from 'lucide-react';
import './Sidebar.scss'; // SCSS file alag se import ki gayi hai
import logo from '../../assets/logo_hrms.svg'
import user from '../../assets/user.svg'
import Tooltip from '@mui/material/Tooltip';
import Tooltips from '../../utils/common/Tooltip/Tooltips';
// Sidebar Component: Naya Design + Aapki Original Functionality

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
            { label: 'Job', path: '/job-list', detail: '/job-details', add: '/add-job', edit: '/edit-job' },
            { label: 'Applicant', path: '/applicant-list', detail: '/applicant-details', add: '/add-applicant', edit: '/edit-applicant' },
            { label: 'Employee', path: '/employee-list', detail: '/employee-details', add: '/add-employee', edit: '/edit-employee' },
        ]
    },
    {
        id: 'organization', label: 'Organization', icon: Building2, path: '/department-list', submenu: [
            { label: 'Department', path: '/department-list', detail: '/department-details', add: '/add-department', edit: '/edit-department' },
            { label: 'Designation', path: '/designation-list', detail: '/designation-details', add: '/add-designation', edit: '/edit-designation' },
            { label: 'Employee Health', path: '/employee-health-list', detail: '/employeehealth-details', add: '/add-employee-health', edit: '/edit-employee-health' },
            { label: 'Birthday', path: '/birthday-list' },
            { label: 'Announcement', path: '/announcement-list', detail: '/announcement-details', add: '/add-announcement', edit: '/edit-announcement' },
        ]
    },
    {
        id: 'attendance', label: 'Attendance', icon: Calendar, path: '/attendance-list', submenu: [
            { label: 'Holiday', path: '/holiday-list', detail: '/holiday-details', add: '/add-holiday', edit: 'edit-holiday' },
            { label: 'Shift', path: '/shift-list', detail: '/shift-details', add: '/add-shift', edit: 'edit-shift' },
            { label: 'Assign Shift', path: '/assign-shift-list' },
            { label: 'Attendance', path: '/attendance-list', detail: '/attendance-details', add: '/add-attendance', edit: '/edit-attendance' },
        ]
    },
    {
        id: 'leave', label: 'Leave Tracker', icon: CalendarMinus, path: '/leave-list', submenu: [
            { label: 'Leave', path: '/leave-list', detail: '/leave-details', add: '/add-leave', edit: '/edit-leave' },
            { label: 'Leave Type', path: '/leave-type', detail: '/leave-type-details', add: '/add-leave-type', edit: '/edit-leave-type' },
            { label: 'Travel', path: '/travel-list', detail: '/travel-details', add: '/add-travel', edit: '/edit-travel' },
        ]
    },

    {
        id: 'work', label: 'Work', icon: Briefcase, path: '/ticket-list', submenu: [
            { label: 'Ticket', path: '/ticket-list', detail: '/ticket-details', add: '/add-ticket' },
            { label: 'Trainer', path: '/trainer-list', detail: '/trainer-details', add: '/add-trainer' },
            { label: 'Training', path: '/training-list', detail: '/training-details', add: '/new-training' },
            { label: 'Project', path: '/project-list', detail: '/project-details', add: '/add-project' },
            { label: 'Client', path: '/client-list', detail: '/client-details', add: '/new-client' },
        ]
    }
];
const Sidebar = ({ isExpanded, setIsExpanded }) => {
    const navigate = useNavigate();

    // Aapke original code se menu data, naye icons ke saath


    const moreItems = [
        { id: 'files', label: 'Files', icon: FilesIcon, path: '/files' },
        { id: 'performance', label: 'Performance', icon: Award, path: '/performance' },
        { id: 'reports', label: 'Reports', icon: BarChart2, path: '/reports' }
    ];

    const allItems = [...menuItems, ...moreItems];

    const [activeParentId, setActiveParentId] = useState(null);
    const [openSubmenuId, setOpenSubmenuId] = useState(null);

    // URL ke hisab se active item set karne ka logic
    useEffect(() => {
        const currentPath = window.location.pathname;
        let foundParentId = null;

        for (const item of allItems) {
            if (item.submenu) {
                for (const sub of item.submenu) {
                    const currentBase = currentPath.split('/')[1];
                    const pathBase = sub.path?.split('/')[1];
                    const detailBase = sub.detail?.split('/')[1];
                    const addBase = sub.add?.split('/')[1];

                    if (currentBase && (currentBase === pathBase || currentBase === detailBase || currentBase === addBase)) {
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
        setOpenSubmenuId(foundParentId); // Active parent ka submenu by default khol do
    }, [window.location.pathname]); // Yeh URL change hone par re-run hoga

    // Nav Item ko render karne ka component
    const NavItem = ({ item }) => {
        const hasSubmenu = !!item.submenu;
        const isActive = activeParentId === item.id;
        const isSubmenuOpen = openSubmenuId === item.id;


        const handleParentClick = () => {
            if (!isExpanded) setIsExpanded(true);

            const willOpen = isSubmenuOpen ? null : item.id;
            setOpenSubmenuId(willOpen);

            const currentPath = window.location.pathname;

            if (!hasSubmenu) {
                navigate(item.path);
            } else if (willOpen && !item.submenu.some(sub => sub.path === currentPath)) {
                // Agar submenu open ho raha hai aur current path submenu me nahi hai
                navigate(item.submenu[0].path);
            }
        };


        return (
            <li className="nav-item">
                <Tooltip
                    title={!isExpanded ? item.label : ''}
                    placement="right"
                    componentsProps={{
                        tooltip: {
                            sx: {
                                backgroundColor: '#322f35',
                                color: '#fff',
                                fontSize: '13px',
                                fontWeight: 500,
                                borderRadius: '6px',
                                padding: '6px 12px',
                            },
                        },
                    }}
                >
                    <div className={`nav-link ${isActive ? 'active' : ''}`} onClick={handleParentClick}>
                        <item.icon size={20} className="nav-icon" />

                        {isExpanded && <span className="nav-text">{item.label}</span>}

                        {hasSubmenu && isExpanded && <ChevronRight size={16} className={`chevron-icon ${isSubmenuOpen ? 'open' : ''}`} />}
                    </div>
                </Tooltip>
                {hasSubmenu && isExpanded && (
                    <ul className={`submenu ${isSubmenuOpen ? 'open' : ''}`}>
                        {item.submenu.map(subItem => {
                            const currentPath = window.location.pathname;
                            const subIsActive = currentPath === subItem.path ||
                                (subItem.detail && currentPath.startsWith(subItem.detail)) ||
                                (subItem.add && currentPath.startsWith(subItem.add));
                            return (
                                <span key={subItem.path}>
                                    <div className={`submenu-link ${subIsActive ? 'active' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); navigate(subItem.path); }}>
                                        {subItem.label}
                                    </div>
                                </span>
                            );
                        })}
                    </ul>
                )}
            </li>
        );
    };

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="sidebar-header">

                <div className="dropdown-container" ref={dropdownRef}>
                    <button className="sidebar-logo" onClick={() => setIsOpen(!isOpen)}>
                        <img src={logo} alt="HRMS Logo" className="sidebar-logo-icon" />
                        <span className="sidebar-logo-text">HRMS</span>
                        <ChevronDown className={`chevron-icon ${isOpen ? 'open' : ''}`} size={22} />
                    </button>

                    {isOpen && (
                        <ul className="dropdown-menu">
                            <li className="dropdown-item">
                                <Database size={20} />
                                <span>CMS</span>
                            </li>
                            <li className="dropdown-item">
                                <Wallet size={20} />
                                <span>Payroll</span>
                            </li>
                        </ul>
                    )}
                </div>
                <button className="sidebar-toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
                    <ChevronsLeft size={20} />
                </button>
            </div>
            {/* <div className='top_Border'></div> */}

            <nav className="sidebar-nav">
                {/* <h3 className="nav-section-title">Main</h3> */}
                <ul>{menuItems.map(item => <NavItem key={item.id} item={item} />)}</ul>

                <h3 className="nav-section-title">More</h3>
                <ul>{moreItems.map(item => <NavItem key={item.id} item={item} />)}</ul>
            </nav>

            <div className="sidebar-actions">
                {isExpanded &&
                    <>

                        <Tooltips
                            title="Notifications"
                            placement="top"
                            arrow={false}
                        >


                            <button className="add-btn ">
                                <Bell size={20} />
                            </button>
                        </Tooltips>
                        <Tooltips
                            title="Help"
                            placement="top"
                            arrow={false}
                        >

                            <button className="add-btn">
                                <CircleQuestionMark size={20} />
                            </button>
                        </Tooltips>
                        <Tooltips
                            title="Settings"
                            placement="top"
                            arrow={false}
                        >

                            <button className="add-btn">
                                <Settings size={20} />
                            </button>
                        </Tooltips>
                    </>}
                <Tooltips
                    title="Add Shortcut"
                    placement="top"
                    arrow={false}
                >

                    <button className="add-btn">
                        <Plus size={20} />
                    </button>
                </Tooltips>
            </div>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <img src={user} alt="User Avatar" className="user-avatar" />
                    <div className="user-info">
                        <div className="user-name">Codesquarry</div>
                        {/* <div className="user-email">Codesquarry@gmail.com</div> */}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
