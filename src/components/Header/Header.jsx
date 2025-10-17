import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import './Header.scss';
import { getBreadcrumbs } from '../../utils/getBreadcrumbs';
import { menuItems } from '../Sidebar/Sidebar';
import { BookCheck, ChevronRight, CircleX, ClipboardCheck, FileChartColumnIncreasing, FilesIcon, Home, SquareCheck } from 'lucide-react';



export const moreItems = [
 {
    id: 'reports',
    label: 'My Reports',
    icon: FileChartColumnIncreasing,
    path: '/my-reports', // parent link
    BreadL: 'My Reports',
    issubmenu : true,
    submenu: [
      { main: 'My Reports', label: 'Leave Balance', path: '/my-reports', list: '/my-reports/leave-balance' },
    //   { main: 'My Reports', label: 'Leave Summary', path: '/my-reports', list: '/my-reports/leave-summary' },
    //   { main: 'My Reports', label: 'Leave Summary', path: '/my-reports', list: '/my-reports/leave-summary' },
    //   { main: 'My Reports', label: 'Daily Attendance Report', path: '/my-reports', list: '/my-reports/attendance-report' },
    //   { main: 'My Reports', label: 'Performance Review', path: '/my-reports', list: '/my-reports/performance-review' },
    //   { main: 'My Reports', label: 'Appraisal History', path: '/my-reports', list: '/my-reports/appraisal-history' },
    ]
  }, 

   {
    id: 'policy',
    label: 'Policy',
    icon: ClipboardCheck ,
    BreadL: 'Policy',
      submenu: [
    { main: 'Policy', label: 'Attendance', path: '/attendance-policy', BreadL: 'Attendance Policy' },
    { main: 'Policy', label: 'Leaves', path: '/leaves-policy', BreadL: 'Leaves Policy' },
    { main: 'Policy', label: 'Shift', path: '/shift-policy', BreadL: 'Shift Policy' },
    { main: 'Policy', label: 'Performance', path: '/performance-policy', BreadL: 'Performance Policy' },
    { main: 'Policy', label: 'Travel', path: '/travel-policy', BreadL: 'Travel Policy' },
  ]
   }

   
];

export const menuItemsExtra = (id, Id, id2) => [
    {
        id: 'Settings', submenu: [
            { main: 'Settings', label: 'Organizations list', path: '/settings/organization-details', BreadL: 'Organization Details', BreadA: "Add New Work Location", add: '/settings/organization-details/add-work-location' },
            { main: 'Settings', label: 'Organizations list', path: '/settings/all-organization-list', BreadL: 'Organization List', detail: '/settings/organization-details', BreadD: "Organization", add: '/settings/add-organization-details', BreadA: "Add New Organization", BreadE: "Organization Details", edit: '/settings/edit-organization' },
            { main: 'Settings', label: 'Organizations list', path: '/settings/all-organization-list', BreadL: 'Organization List', detail: '/settings/organization-policy', BreadD: "Organization ", },
            { main: 'Settings', label: 'Organizations list', path: '/settings/all-organization-list', BreadL: 'Organization List', detail: '/settings/organization-work-locations', BreadD: "Organization ", },
            { main: 'Settings', label: 'Organizations list', path: '/settings/all-organoizatin-list', BreadL: 'Organization List', extra: '/settings/organization-details', BreadX: 'Organization Details', BreadE: "Basic Information", edit: '/settings/edit-organization-details' },
            { main: 'Settings', label: 'Organizations list', path: `/settings/all-organization-list`, BreadL: 'Organization List', add: '/settings/organization-department', BreadA: "Organization Details", },
            { main: 'Settings', label: 'Organizations list', path: `${id}`, BreadL: 'Organization Detail', add: '/settings/add-organization-department', BreadA: "Add New  Department", },
            { main: 'Settings', label: 'Organizations list', path: `${id}`, BreadL: 'Organization Detail', add: '/settings/add-work-location', BreadA: "Add New Work Location", },
            { main: 'Settings', label: 'Organizations list', path: `${id}`, BreadL: 'Organization Detail', detail: '/settings/work-location-details', BreadD: "Work Location " },
            { main: 'Settings', label: 'Organizations list', path: `${id2}`, BreadL: 'Organization Detail', edit: '/settings/edit-work-location', BreadE: "Work Location" },
            { main: 'Settings', label: 'Masters', path: '/master-list', detail: '/master-details', add: '/add-masters', edit: '/edit-masters' },
            { main: 'Settings', label: 'Users', path: '/settings/users-list', BreadL: 'User List', detail: '/settings/user-details', add: '/settings/assign-role', BreadA: "Assign Role", BreadE: "User Details", edit: '/settings/edit-user-details' },
            { main: 'Settings', label: 'Leaves', path: '/settings', list: '/settings/leaves' },
            { main: 'Settings', label: 'Attendance', path: '/settings', list: '/settings/attendance' },
            { main: 'Settings', label: 'Performance', path: '/settings', list: '/settings/performance' },
            { main: 'Settings', label: 'Travel', path: '/settings', list: '/settings/travel' },
            { main: 'Settings', label: 'Shifts', path: '/settings', list: '/settings/shifts' },
            { main: 'Settings', label: 'Shifts', path: '/settings', list: '/settings/shifts' },
            { main: 'Settings', label: 'Shifts', path: '/settings', list: '/settings/shift-policy', },
            { main: 'Settings', label: 'Shifts', path: '/settings', list: '/settings/manage-shifts' },
            { main: 'Settings', label: 'Shifts', path: '/settings/manage-shifts', list: '/settings/manage-shifts', BreadL: 'Manage Shifts', detail: '/settings/master-details', add: '/settings/manage-shifts-list/add-shift', BreadA: "Add Shift", },
            { main: 'Settings', label: `Master's`, path: '/settings/master-list', list: '/setti ngs/master-list', BreadL: `Master's List`, BreadE: "Master List", edit: '/settings/edit-master-list' },
        ],
    },
]

export const menuItemsReport = [
    {
        id: 'reports',  submenu: [
            { main: 'My Reports', label: 'Leave Balance', path: '/my-reports', list: '/my-reports/leave-balance' },
            { main: 'My Reports', label: 'Leave Summary', path: '/my-reports', list: '/my-reports/leave-summary' },
        //   { main: 'My Reports', label: 'Leave Summary', path: '/my-reports', list: '/my-reports/leave-summary' },
          { main: 'My Reports', label: 'Daily Attendance Report', path: '/my-reports', list: '/my-reports/attendance-report' },
          { main: 'My Reports', label: 'Performance Review', path: '/my-reports', list: '/my-reports/rerformance-review' },
          { main: 'My Reports', label: 'Appraisal History', path: '/my-reports', list: '/my-reports/appraisal-history' },
    ]
    },{
        id: 'policy',  submenu: [
            { main: 'Policy', label: 'Attendance Policy', path: '/attendance-policy', list: '/attendance-policy' },
            { main: 'Policy', label: 'Leaves', path: '/leaves-policy', list: '/leaves-policy' },
            { main: 'Policy', label: 'Shift', path: '/shift-policy', list: '/shift-policy' },
            { main: 'Policy', label: 'Performance', path: '/performance-policy', list: '/performance-policy' },
            { main: 'Policy', label: 'Travel', path: '/travel-policy', list: '/travel-policy'},
    ]
    },


]


const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // var { id } = useParams();
    // const dynamicId = id || 'default-id';
    // URL ka last part nikalna (id)
    const pathSegments = location.pathname.split('/'); // split by "/"
    const Id = pathSegments[pathSegments.length - 1]; // last segment

    const [historyStack, setHistoryStack] = useState([]);

    useEffect(() => {
        setHistoryStack(prev => [...prev, location.pathname]);
    }, [location.pathname]);

    const id = historyStack[historyStack.length - 2]
    const id2 = historyStack[historyStack.length - 3]
    // console.log('id', id)

    const allMenuItems = [...menuItems, ...menuItemsExtra(id, Id, id2), ...moreItems, ...menuItemsReport];

    const breadcrumbs = getBreadcrumbs(allMenuItems, location.pathname);


    useEffect(() => {
        if (breadcrumbs.length < 2) {
            document.documentElement.style.setProperty('--header-height', '10px');
            document.documentElement.style.setProperty('--main-br', '6px');
        } else {
            document.documentElement.style.setProperty('--header-height', '50px');
            document.documentElement.style.setProperty('--main-br', '0px 0px 6px 6px');
        }
    }, [breadcrumbs]);

    const [employDetailhead, setEmployDetailHead] = useState(false)
    useEffect(() => {
        if (location.pathname.includes("/employee-details")) {
            setEmployDetailHead(true)
        }
    }, [location.pathname])

    return (
        <header className={`topheader ${breadcrumbs.length < 2 ? 'has-breadcrumbs' : ''} ${employDetailhead ? 'employDetailhead' : ''}`}>
            <div>
                {breadcrumbs.length > 0 && (
                    <div className="breadcrumb">
                        {breadcrumbs.map((crumb, i) => (
                            <span
                                key={i}
                                onClick={() => crumb.path && navigate(crumb.path)}
                                className='breadcrumb-item'
                                style={{
                                    cursor: crumb.path ? 'pointer' : 'default',
                                    color: crumb.path ? '#6E7C87' : '#252C32',
                                    borderBottom: crumb.path ? '' : 'none',
                                }}
                            >
                                {crumb.label}
                                {i < breadcrumbs.length - 1 && (
                                    <ChevronRight className='icon' size={20} strokeWidth={1} />
                                )}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;