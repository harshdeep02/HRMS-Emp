// ─── Core React & Libraries ──────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

// ─── Global Styles ──────────────────────────────────────────────────────
import './styles/App.scss';

// ─── Common Components ──────────────────────────────────────────────────
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import MainContainer from './components/MainContainer/MainContainer';
import Loader from './utils/common/Loader/Loader.jsx';
import _404 from "./components/Error/_404.jsx";

// ─── Global Redux Actions / APIs ────────────────────────────────────────
import { fetchAllDepartments } from './Redux/Actions/globalActions.js';
import { getCountryList } from './Redux/Actions/locationActions.js';
import { getMasterList } from './Redux/Actions/Settings/masterActions.js';

// ─── Pages ──────────────────────────────────────────────────────────────

// Dashboards
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';

//profile
import AddEmployee from './pages/EmployeeOnboarding/AddEmployee/AddEmloyee.jsx';

{/* ─── Organization Module ──────────────────────────────────────────────── */}
import EmployeeList from './pages/Organization/EmployeeList/EmployeeList.jsx';
import DepartmentList from './pages/Organization/Department/DepartmentList.jsx';
import DepartmentDetail from './pages/Organization/Department/DepartmentDetail/DepartmentDetail.jsx';
import DesignationList from './pages/Organization/Designation/DesignationList.jsx';
import DesignationDetails from './pages/Organization/Designation/DesignationDetail/DesignationDetails.jsx';
import { AnnouncementList } from './pages/Organization/Announcement/AnnouncementList.jsx';
import { AnnouncementDetails } from './pages/Organization/Announcement/AnnouncementDetails.jsx';
import { HolidayList } from './pages/Organization/Holiday/HolidayList.jsx';
import { HolidayDetails } from './pages/Organization/Holiday/HolidayDetails.jsx';

// ─── Leave Tracker Module ───────────────────────────────────────────────
import { LeaveList } from './pages/Leave Tracker/Leave/LeaveList.jsx';
import { LeaveDetail } from './pages/Leave Tracker/Leave/LeaveDetail.jsx';





// ─── Authentication ─────────────────────────────────────────────────────
import Login from './components/Auth/login/Login.jsx';


function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const dispatch = useDispatch();
  

  // 🔹 Global API calls when app loads

  useEffect(() => {
     if (isLoggedIn) {
      dispatch(fetchAllDepartments());
      dispatch(getMasterList());
      dispatch(getCountryList());
     }
  }, [isLoggedIn]);

    useEffect(() => {
    setLoading(true); //  route change ho

    const handleLoad = () => setLoading(false);

    if (document.readyState === "complete") {
      // Agar page already load ho chuka hai
      setLoading(false);
    } else {
      // Slow network / pending assets case
      window.addEventListener("load", handleLoad);

      // Safety fallback - max 15s
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 15000);

      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(timeout);
      };
    }
  }, [location]);

  if (!isLoggedIn && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }


  return (
      <div className={`${isLoggedIn ? 'app-layout' : ''} ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
         {isLoggedIn && location.pathname !== "/login" && (
        <>
          <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
          <Header />
        </>
        )}
        <MainContainer  islogin={isLoggedIn}>
           {loading ? <Loader /> :
            <Routes>

              {/* Auth */}
             <Route path="/login" element={<Login />} />

             {isLoggedIn ? (
              <>
                {/* Default */}
                <Route path="/" element={<Navigate to="/employee-dashboard" replace />} />

                {/* ================= Dashboard ================= */}
                <Route path="/employee-dashboard" element={<AdminDashboard />} />

                {/* ================= Profile Module ================= */}
                <Route path="/profile" element={<AddEmployee />} />

                {/* ================= Organization Module ================= */}
                <Route path="/employee-list" element={<EmployeeList />} />
                <Route path="/department-list" element={<DepartmentList />} />
                <Route path="/department-details/:id" element={<DepartmentDetail />} />
                <Route path="/designation-list" element={<DesignationList />} />
                <Route path="/designation-details/:id" element={<DesignationDetails />} />
                <Route path="/announcement-list" element={<AnnouncementList />} />
                <Route path="/announcement-details/:id" element={<AnnouncementDetails />} />
                <Route path="/holiday-list" element={<HolidayList />} />
                <Route path="/holiday-details/:id" element={<HolidayDetails />} />

                {/* ================= Leave Tracker ================= */}
                {/* Leave */}
                <Route path="/leave-list" element={<LeaveList />} />
                <Route path="/add-new-leave" element={<LeaveDetail />} />
                <Route path="/leave-details/:id" element={<LeaveDetail />} />


              </>
              ) : null}

              {/* 404 */}
              <Route path="/*" element={<_404 />} />
            </Routes>

          }

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />  
        </MainContainer>

      </div>
  )
}

export default App
