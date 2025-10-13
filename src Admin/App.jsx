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

// ─── Employee Module ────────────────────────────────────────────────────
// Job
import JobList from './pages/EmployeeModule/Job/JobList.jsx';
import { JobDetails } from './pages/EmployeeModule/Job/JobDetails.jsx';
// Applicant
import ApplicantList from './pages/EmployeeModule/Applicant/ApplicantList.jsx';
import ApplicantDetails from './pages/EmployeeModule/Applicant/ApplicantDetails.jsx';
// Employee
import EmployeeList from './pages/EmployeeOnboarding/EmployeeList/EmployeeList.jsx';
import AddEmployee from './pages/EmployeeOnboarding/AddEmployee/AddEmloyee.jsx';

// ─── Organization Module ───────────────────────────────────────────────
// Department
import DepartmentList from './pages/Organization/Department/DepartmentList/DepartmentList.jsx';
import DepartmentDetail from './pages/Organization/Department/DepartmentDetail/DepartmentDetail.jsx';
// Designation
import DesignationList from './pages/Organization/Designation/DesignationList.jsx';
import DesignationDetails from './pages/Organization/Designation/DesignationDetail/DesignationDetails.jsx';
// Employee Health
import EmployeeHealthList from './pages/Organization/EmployeeHealth/EmployeeHealthList.jsx';
import { EmployeeHealthDetails } from './pages/Organization/EmployeeHealth/EmployeeHealthDetails.jsx';
// Birthday
import BirthdayList from './pages/Organization/BirthdayList.jsx';
// Announcement
import { AnnouncementList } from './pages/Organization/Announcement/AnnouncementList.jsx';
import { AnnouncementDetails } from './pages/Organization/Announcement/AnnouncementDetails.jsx';

// ─── Attendance Module ──────────────────────────────────────────────────
// Holiday
import { HolidayList } from './pages/Attendance/Holiday/HolidayList.jsx';
import { HolidayDetails } from './pages/Attendance/Holiday/HolidayDetails.jsx';
// Shift
import ShiftList from './pages/Attendance/Shift/ShiftList.jsx';
import { ShiftDetail } from './pages/Attendance/Shift/ShiftDetail.jsx';
// Assign Shift
import { AssignShiftList } from './pages/Attendance/Assign Shift/AssignShiftList.jsx';
import { AssignShiftDetails } from './pages/Attendance/Assign Shift/AssignShiftDetails.jsx';
// Attendance
import AttendanceList from './pages/Attendance/Attendance/AttendanceList.jsx';
import AttendanceDetail from './pages/Attendance/Attendance/AttendanceDetail.jsx';

// ─── Settings Module ────────────────────────────────────────────────────
import { Setting } from './pages/Settings/Setting.jsx';
// User Settings
import { UsersList } from './pages/Settings/Users/UsersList.jsx';
import { UserDetails } from './pages/Settings/Users/UserDetails.jsx';
// Organization Settings
import OrganizationDetails from './pages/Settings/Organization/OrganizationAddDetails/OrganizationDetails.jsx';
import AllOrganizationList from './pages/Settings/Organization/Allorganizationlist/Allorganizationlist.jsx';
import AddDepartment from './pages/Settings/Organization/OrganizationAddDetails/AddDepartment.jsx';
import { WorkLocationDetails } from './pages/Settings/Organization/OrganizationAddDetails/WorkLocationDetails.jsx';

// Leave Settings
import { SettingLeaveDetails } from './pages/Settings/Leaves/SettingLeaveDetails.jsx';
// Master Settings
import { MasterList } from './pages/Master/MasterList.jsx';
import { MasterDetails } from './pages/Master/MasterDetails.jsx';
// Attendance Settings
import { AttendanceDetails } from './pages/Settings/Attendance/AttendanceDetails.jsx';
// Performance Settings
import { SettingPerformance } from './pages/Settings/Performance/SettingPerformance.jsx';
// Travel Settings
import { TravelDetails } from './pages/Settings/Travel/TravelDetails.jsx';
// Shifts Settings
import { ShiftsDetails } from './pages/Settings/Shifts/ShiftsDetails.jsx';
import { AddShift } from './pages/Settings/Shifts/AddShift.jsx';

// ─── Leave Tracker Module ───────────────────────────────────────────────
import { LeaveTypeList } from './pages/Leave Tracker/Leave Type/LeaveTypeList.jsx';
import { LeaveTypeDetails } from './pages/Leave Tracker/Leave Type/LeaveTypeDetails.jsx';
import { LeaveList } from './pages/Leave Tracker/Leave/LeaveList.jsx';
import { LeaveDetail } from './pages/Leave Tracker/Leave/LeaveDetail.jsx';
import { TravelList } from './pages/Leave Tracker/Travel/TravelList.jsx';
import EmployeTravelDetail from './pages/Leave Tracker/Travel/EmployeTravelDetail.jsx';

// ─── Work Module ────────────────────────────────────────────────────────
import { TicketList } from './pages/Work/Ticket/TicketList.jsx';
import { TicketDetails } from './pages/Work/Ticket/TicketDetails.jsx';
import TrainersList from './pages/Work/Trainers/TrainersList.jsx';
import { TrainerDetail } from './pages/Work/Trainers/TrainerDetail.jsx';
import TrainingList from './pages/Work/Training/TrainingList.jsx';
import { TrainingDetail } from './pages/Work/Training/TrainingDetail.jsx';
import ProjectList from './pages/Work/Project/ProjectList.jsx';
import { ProjectDetail } from './pages/Work/Project/ProjectDetail.jsx';
import ClientList from './pages/Work/Client/ClientList.jsx';
import ClientDetail from './pages/Work/Client/ClientDetail/ClientDetail.jsx';

// ─── Performance Module ─────────────────────────────────────────────────
import PerformanceList from './pages/Performance/PerformanceList.jsx';
import { PerformanceDetails } from './pages/Performance/PerformanceDetails/PerformanceDetails.jsx';

// ─── Files Module ──────────────────────────────────────────────────────
import { EmployeeFilesList } from './pages/Files/EmployeeFiles/EmployeeFilesList.jsx';
import { FileDetails } from './pages/Files/EmployeeFiles/FileDetails.jsx';
import { OrganizationList } from './pages/Files/Organization/OrganizationList.jsx';
import { OrganizationFileDetails } from './pages/Files/Organization/OrganizationFileDetails.jsx';

// ─── Reports Module ────────────────────────────────────────────────────
import { MyReports } from './pages/Reports/MyReports/MyReports.jsx';
import LeaveReport from './pages/Reports/MyReports/LeaveReport/LeaveReport.jsx';
import EmployeeAttritionBoard from './pages/Reports/MyReports/EmployeeAttrition/EmployeeAttritionBoard.jsx';
import MYPerformanceReview from './pages/Reports/MyReports/PerformanceReview/MYPerformanceReview.jsx';

import { OrganisationReports } from './pages/Reports/OrganisationReports/OrganisationReports.jsx';
import AppraisalHistory from './pages/Reports/OrganisationReports/AppraisalHistory/AppraisalHistory.jsx';
import PerformanceReview from './pages/Reports/OrganisationReports/PerformanceReview/PerformanceReview.jsx';
import LeaveTracker from './pages/Reports/OrganisationReports/LeaveTracker/LeaveTracker.jsx';
// import LeaveSummaryReports from './pages/Reports/OrganisationReports/LeaveTracker/LeaveSummaryReports.jsx';
import DailyAttendanceReport from './pages/Reports/OrganisationReports/DailyAttendance/DailyAttendanceReport.jsx';
import DailyAttendanceReportCalender from './pages/Reports/OrganisationReports/DailyAttendanceReport/DailyAttendanceReportCalender.jsx';
import EmployeeAttritionTrendChart from './pages/Reports/OrganisationReports/EmployeeAttritionTrend/EmployeeAttritionTrendChart.jsx';
import OrganisationalReportDashboard from './pages/Reports/OrganisationReports/OrganisationalReportDashboard/OrganisationalReportDashboard.jsx';

// ─── Authentication ─────────────────────────────────────────────────────
import Login from './components/Auth/login/Login.jsx';
import { AttendanceReport } from './pages/Reports/MyReports/AttendanceReport/AttendanceReport.jsx';
import Policy from './pages/Settings/Organization/OrganizationAddDetails/Policy.jsx';
import { LeaveSummaryReport } from './pages/Reports/MyReports/LeaveReport/LeaveSummaryReport.jsx';
import { ApprovalList } from './pages/Approval/ApprovalList.jsx';
import { ApprovalDetails } from './pages/Approval/ApprovalDetails/ApprovalDetails.jsx';
import LeaveTrackerDetails from './pages/Reports/OrganisationReports/LeaveTracker/LeaveTrackerDetails.jsx';
import { MyAppraisalHistory } from './pages/Reports/MyReports/AppraisalHistory/MyAppraisalHistory.jsx';

function App() {

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔹 Global API calls when app loads

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchAllDepartments());
      dispatch(getMasterList());
      dispatch(getCountryList());
    }
  }, [isLoggedIn]);


  // / 🔹 Check token on first load
  // useEffect(() => {
  //   const token = localStorage.getItem("AccessToken");
  //   if (token) {
  //     setIsLoggedIn(true);
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  // }, [location.pathname]);

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

      <MainContainer islogin={isLoggedIn}>
        {loading ? <Loader /> :
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {isLoggedIn ? (
              <>
                {/* Default */}
                <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />

                {/* Dashboard */}
                <Route path="/admin-dashboard" element={<AdminDashboard />} />

                {/* ================= Employee Module ================= */}
                {/* Job */}
                <Route path="/job-list" element={<JobList />} />
                <Route path="/job-details/:id" element={<JobDetails />} />
                <Route path="/edit-job-details/:id" element={<JobDetails />} />
                <Route path="/add-new-job" element={<JobDetails />} />

                {/* Applicant */}
                <Route path="/applicant-list" element={<ApplicantList />} />
                <Route path="/add-applicant" element={<ApplicantDetails />} />
                <Route path="/applicant-details/:id" element={<ApplicantDetails />} />
                <Route path="/edit-applicant/:id" element={<ApplicantDetails />} />

                {/* Employee */}
                <Route path="/employee-list" element={<EmployeeList />} />
                <Route path="/add-employee" element={<AddEmployee />} />
                <Route path="/edit-employee/:id" element={<AddEmployee />} />
                <Route path="/employee-details/:id" element={<AddEmployee />} />

                {/* ================= Organization Module ================= */}
                {/* Department */}
                <Route path="/department-list" element={<DepartmentList />} />
                <Route path="/department-details/:id" element={<DepartmentDetail />} />
                <Route path="/add-department" element={<DepartmentDetail />} />
                <Route path="/edit-department/:id" element={<DepartmentDetail />} />

                {/* Designation */}
                <Route path="/designation-list" element={<DesignationList />} />
                <Route path="/designation-details/:id" element={<DesignationDetails />} />
                <Route path="/add-designation" element={<DesignationDetails />} />
                <Route path="/edit-designation/:id" element={<DesignationDetails />} />
                <Route path="/designation" element={<DesignationList />} />

                {/* Employee Health */}
                <Route path="/employee-health-list" element={<EmployeeHealthList />} />
                <Route path="/add-new-employee-health" element={<EmployeeHealthDetails />} />
                <Route path="/employee-health-Details/:id" element={<EmployeeHealthDetails />} />
                <Route path="/edit-employee-health/:id" element={<EmployeeHealthDetails />} />

                {/* Birthday */}
                <Route path="/birthday-list" element={<BirthdayList />} />

                {/* Announcement */}
                <Route path="/announcement-list" element={<AnnouncementList />} />
                <Route path="/announcement-details/:id" element={<AnnouncementDetails />} />
                <Route path="/edit-announcement/:id" element={<AnnouncementDetails />} />
                <Route path="/add-new-announcement" element={<AnnouncementDetails />} />

                {/* ================= Attendance Module ================= */}
                {/* Holiday */}
                <Route path="/holiday-list" element={<HolidayList />} />
                <Route path="/add-holiday-details" element={<HolidayDetails />} />
                <Route path="/holiday-details/:id" element={<HolidayDetails />} />
                <Route path="/edit-holiday-details/:id" element={<HolidayDetails />} />

                {/* Shift */}
                <Route path="/shift-list" element={<ShiftList />} />
                <Route path="/shift-details/:id" element={<ShiftDetail />} />
                <Route path="/edit-shift/:id" element={<ShiftDetail />} />
                <Route path="/add-shift" element={<ShiftDetail />} />

                {/* Assign Shift */}
                <Route path="/assign-shift-list" element={<AssignShiftList />} />
                <Route path="/assign-shift" element={<AssignShiftDetails />} />

                {/* Attendance */}
                <Route path="/attendance-list" element={<AttendanceList />} />
                <Route path="/attendance-details/:id" element={<AttendanceDetail />} />

                {/* ================= Settings ================= */}
                {/* General */}
                <Route path="/settings" element={<Setting />} />

                {/* Organization */}
                <Route path="/settings/all-organization-list" element={<AllOrganizationList />} />
                <Route path="/settings/organization-details/:id" element={<OrganizationDetails />} />
                <Route path="/settings/organization-basic-information/:id" element={<OrganizationDetails />} />
                <Route path="/settings/organization-policy/:id" element={<OrganizationDetails />} />
                <Route path="/settings/organization-department/:id" element={<OrganizationDetails />} />
                <Route path="/settings/organization-work-locations/:id" element={<OrganizationDetails />} />
                <Route path="/settings/edit-organization-details/:id" element={<OrganizationDetails />} />
                <Route path="/settings/add-organization-details" element={<OrganizationDetails />} />
                <Route path="/settings/add-organization-department" element={<AddDepartment />} />
                <Route path="/settings/add-work-location" element={<WorkLocationDetails />} />
                <Route path="/settings/edit-work-location/:id" element={<WorkLocationDetails />} />
                <Route path="/settings/work-location-details/:id" element={<WorkLocationDetails />} />

                {/* Masters */}
                <Route path="/settings/master-list" element={<MasterList />} />
                <Route path="/settings/edit-master-list/:id" element={<MasterDetails />} />
                <Route path="/settings/edit-master/:id" element={<MasterDetails />} />

                {/* Users */}
                <Route path="/settings/users-list" element={<UsersList />} />
                <Route path="/settings/user-details/:id" element={<UserDetails />} />
                <Route path="/settings/edit-user-details/:id" element={<UserDetails />} />
                <Route path="/settings/assign-role" element={<UserDetails />} />

                {/* Leaves */}
                <Route path="/settings/leaves" element={<SettingLeaveDetails />} />

                {/* Attendance */}
                <Route path="/settings/attendance" element={<AttendanceDetails />} />

                {/* Shifts */}
                <Route path="/settings/shifts" element={<ShiftsDetails />} />
                <Route path="/settings/shift-policy" element={<ShiftsDetails />} />
                <Route path="/settings/manage-shifts" element={<ShiftsDetails />} />
                <Route path="/settings/manage-shifts-list/add-shift" element={<AddShift />} />

                {/* Performance */}
                <Route path="/settings/performance" element={<SettingPerformance />} />

                {/* Travel */}
                <Route path="/settings/travel" element={<TravelDetails />} />

                {/* ================= Leave Tracker ================= */}
                {/* Leave */}
                <Route path="/leave-list" element={<LeaveList />} />
                <Route path="/add-new-leave" element={<LeaveDetail />} />
                <Route path="/leave-details/:id" element={<LeaveDetail />} />
                <Route path="/edit-leave-details/:id" element={<LeaveDetail />} />

                {/* Travel */}
                <Route path="/travel-list" element={<TravelList />} />
                <Route path="/travel-details/:id" element={<EmployeTravelDetail />} />
                <Route path="/edit-travel/:id" element={<EmployeTravelDetail />} />
                <Route path="/add-new-travel" element={<EmployeTravelDetail />} />

                {/* Leave Type */}
                <Route path="/leave-type-list" element={<LeaveTypeList />} />
                <Route path="/add-leave-type" element={<LeaveTypeDetails />} />
                <Route path="/leave-type-details/:id" element={<LeaveTypeDetails />} />
                <Route path="/edit-leave-type-details/:id" element={<LeaveTypeDetails />} />

                {/* ================= Work Module ================= */}
                {/* Trainer */}
                <Route path="/trainer-list" element={<TrainersList />} />
                <Route path="/trainer-details/:id" element={<TrainerDetail />} />
                <Route path="/edit-trainer/:id" element={<TrainerDetail />} />
                <Route path="/add-trainer" element={<TrainerDetail />} />

                {/* Training */}
                <Route path="/training-list" element={<TrainingList />} />
                <Route path="/training-details/:id" element={<TrainingDetail />} />
                <Route path="/edit-training/:id" element={<TrainingDetail />} />
                <Route path="/add-training" element={<TrainingDetail />} />

                {/* Project */}
                <Route path="/project-list" element={<ProjectList />} />
                <Route path="/project-details/:id" element={<ProjectDetail />} />
                <Route path="/edit-project/:id" element={<ProjectDetail />} />
                <Route path="/add-project" element={<ProjectDetail />} />

                {/* Client */}
                <Route path="/client-list" element={<ClientList />} />
                <Route path="/client-details/:id" element={<ClientDetail />} />
                <Route path="/edit-client/:id" element={<ClientDetail />} />
                <Route path="/add-client" element={<ClientDetail />} />

                {/* Ticket */}
                <Route path="/ticket-list" element={<TicketList />} />
                <Route path="/add-ticket" element={<TicketDetails />} />
                <Route path="/edit-ticket/:id" element={<TicketDetails />} />
                <Route path="/ticket-details/:id" element={<TicketDetails />} />

                {/* ================= Files ================= */}
                {/* Employee Files */}
                <Route path="/employee-file-list" element={<EmployeeFilesList />} />
                <Route path="/add-employee-file" element={<FileDetails />} />
                <Route path="/edit-employee-file/:id" element={<FileDetails />} />
                <Route path="/employee-file-details/:id" element={<FileDetails />} />

                {/* Organization Files */}
                <Route path="/organisation-file-list" element={<OrganizationList />} />
                <Route path="/add-organisation-file" element={<OrganizationFileDetails />} />
                <Route path="/edit-organisation-file/:id" element={<OrganizationFileDetails />} />
                <Route path="/organisation-file-details/:id" element={<OrganizationFileDetails />} />

                {/* ================= Performance ================= */}
                <Route path="/performance-list" element={<PerformanceList />} />
                <Route path="/performance-details/:id" element={<PerformanceDetails />} />
                <Route path="/edit-performance/:id" element={<PerformanceDetails />} />
                <Route path="/add-performance" element={<PerformanceDetails />} />

                {/* ================= Reports ================= */}
                {/* My Reports */}
                <Route path="/my-reports" element={<MyReports />} />
                <Route path="/my-reports/leave-balance" element={<LeaveReport />} />
                <Route path="/my-reports/leave-summary" element={<LeaveSummaryReport />} />
                <Route path="/my-reports/employee-attrition-board" element={<EmployeeAttritionBoard />} />
                <Route path="/my-reports/attendance-report" element={<AttendanceReport />} />
                <Route path="/my-reports/rerformance-review" element={<MYPerformanceReview />} />
                <Route path="/my-reports/appraisal-history" element={<MyAppraisalHistory />} />

                {/* Organisation Reports */}
                <Route path="/organisation-reports" element={<OrganisationReports />} />
                <Route path="/organisation-reports/appraisal-history" element={<AppraisalHistory />} />
                <Route path="/organisation-reports/performance-review" element={<PerformanceReview />} />
                <Route path="/organisation-reports/leave-tracker-list" element={<LeaveTracker />} />
                <Route path="/organisation-reports/leave-tracker-detail/:id" element={<LeaveTrackerDetails />} />
                {/* <Route path="/organisation-reports/leave-report/leave-summary" element={<LeaveSummaryReports />} /> */}
                <Route path="/organisation-reports/daily-attendance" element={<DailyAttendanceReport />} />
                <Route path="/organisation-reports/employee-attrition-trend" element={<EmployeeAttritionTrendChart />} />
                <Route path="/organisation-reports/dashboard-reports" element={<OrganisationalReportDashboard />} />
                <Route path="/organisation-reports/calender-present-absent" element={<DailyAttendanceReportCalender />} />

                {/* Approved */}
                <Route path="/approval-list" element={<ApprovalList />} />
                <Route path="/approval-details/:id" element={<ApprovalDetails />} />
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
    </div >

  );
}

export default App;
