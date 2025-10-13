// Header.jsx
import React, { useEffect, useState } from 'react';
import {Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.scss';
import { getBreadcrumbs } from '../../utils/getBreadcrumbs';
import { menuItems } from '../Sidebar/Sidebar';
import { ChevronRight, CircleX, Home } from 'lucide-react';

export const menuItemsExtra = [
    {
        id: 'Settings', label: 'Settings', icon: Home, path: '/settings', submenu: [
            { label: 'masters', path: '/masters',detail: '/masters-details', add: '/add-masters', edit: '/edit-masters' },
            { label: 'Applicant', path: '/applicant-list', detail: '/applicant-details', add: '/add-applicant', edit: '/edit-applicant' },

        ]
    },
]
const allMenuItems = [...menuItems, ...menuItemsExtra];

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const breadcrumbs = getBreadcrumbs(allMenuItems, location.pathname)  

    useEffect(() => {
        if (breadcrumbs.length < 2) {
            document.documentElement.style.setProperty('--header-height', '10px');
            document.documentElement.style.setProperty('--main-br', '6px');
        } else {
            document.documentElement.style.setProperty('--header-height', '50px');
            document.documentElement.style.setProperty('--main-br', '0px 0px 6px 6px');
        }
    }, [breadcrumbs]);

    const[employDetailhead, setEmployDetailHead] = useState(false)
    useEffect(()=>{
        if(location.pathname.includes("/employee-details")){
            setEmployDetailHead(true)
        }

    },[location.pathname])
    return (
        <header className={`topheader ${breadcrumbs.length < 2 ? 'has-breadcrumbs' : ''}  ${employDetailhead? 'employDetailhead':''}`}>
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
                                    // fontWeight: i === breadcrumbs.length - 1 ? 500 : 400
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
            <Link
                onClick={() => navigate(-1)}  // -1 means previous page in history
                className="close_nav header_close"
            >
                {/* <CircleX size={24} strokeWidth={1.25} /> */}
                Close
            </Link>
        </header>
    );
};

export default Header;
// 