import { combineReducers } from "redux";
import jobReducer from "../../slices/jobSlice"; // Import the job slice reducer
import userReducer from "../../slices/userSlice";
import {
  announcementDetailReducer,
  announcementListReducer,
  createAnnouncementReducer,
  deleteAnnouncementReducer,
} from "./announcementReducer";
import {
  applicantDetailReducer,
  applicantListReducer,
  createApplicantReducer,
  deleteApplicantReducer,
  updateApplicantStatusReducer,
} from "./applicantReducer";
import {
  attendanceDetailReducer,
  attendanceListReducer,
  attendanceSummaryReducer,
  createAttendanceReducer,
  deleteAttendanceReducer,
  updateAttendanceStatusReducer,
} from "./attendanceReducer";
import {
  clientDetailProjectReducer,
  clientDetailReducer,
  clientListReducer,
  createClientReducer,
  deleteClientReducer,
  updateClientStatusReducer,
} from "./clientReducer";

import {
  createDepartmentReducer,
  deleteDepartmentReducer,
  departmentDetailReducer,
  departmentListReducer,
  empDepartmentDetailReducer,
  projectDepartmentDetailReducer,
  updateDeptStatusReducer,
} from "./departmentReducer";

import {
  createDesignationReducer,
  deleteDesignationReducer,
  designationDetailReducer,
  designationListReducer,
  empDesignationDetailReducer,
  updateDesgnStatusReducer,
} from "./designationReducer";

import {
  createEmpHealthReducer,
  deleteEmpHealthReducer,
  empHealthDetailReducer,
  empHealthListReducer,
  updateEmpHealthStatusReducer,
} from "./employeeHealthReducer";

import {
  createEmpAddressReducer,
  createEmpDocumentReducer,
  createEmpEducationReducer,
  createEmpExperienceReducer,
  createEmployeeReducer,
  createEmpRemarkReducer,
  deleteEmpDocReducer,
  deleteEmpEducationReducer,
  deleteEmpExperienceReducer,
  deleteEmployeeReducer,
  deleteEmpRemarkReducer,
  empBirthdayListReducer,
  employeeDetailReducer,
  employeeListReducer,
  importEmpReducer,
  remarkListReducer,
  updateEmployeeStatusReducer,
} from "./employeeReducer";

import { allDepartmentListReducer, getUserByIdReducer } from "./globalReducers";

import {
  createHolidayReducer,
  deleteHolidayReducer,
  holidayDetailReducer,
  holidayListReducer,
  updateHolidayStatusReducer,
} from "./holidayReducer";

import {
  createJobReducer,
  deleteJobReducer,
  jobDetailReducer,
  jobListReducer,
  updateJobStatusReducer,
} from "./jobReducer";

import {
  createLeaveTypeReducer,
  deleteLeaveTypeReducer,
  leaveTypeDetailReducer,
  leaveTypeListReducer,
  updateLeaveTypeStatusReducer,
} from "./leaveMasterReducer";

import {
  createLeaveReducer,
  deleteLeaveReducer,
  empLeaveDetailReducer,
  leaveDetailReducer,
  leaveListReducer,
  leaveSummaryDetailReducer,
  updateLeaveStatusReducer,
} from "./leaveReducer";

import {
  cityListReducer,
  countryListReducer,
  stateListReducer,
  workLocationListReducer,
} from "./locationReducer";

import {
  createPerformanceReducer,
  deletePerformanceReducer,
  performanceDetailReducer,
  performanceListReducer,
  sendForApprovalReducer,
  updatePerformanceStatusReducer,
} from "./performanceReducer";

import {
  createProjectReducer,
  deleteProjectReducer,
  projectDetailReducer,
  projectListReducer,
  updateProjectStatusReducer,
} from "./projectReducer";

import {
  assignShiftListReducer,
  assignShiftReducer,
  asssignshiftDetailReducer,
  createShiftReducer,
  deleteAssignShiftReducer,
  deleteShiftReducer,
  shiftDetailReducer,
  shiftListReducer,
  updateShiftStatusReducer,
} from "./shiftReducer";

import {
  createTicketReducer,
  deleteTicketReducer,
  ticketDetailReducer,
  ticketListReducer,
  updateTicketStatusReducer,
} from "./ticketReducer";

import {
  createTrainerReducer,
  deleteTrainerReducer,
  trainerDetailReducer,
  trainerListReducer,
  trainerHistoryDetailsReducer,
  updateTrainerStatusReducer,
} from "./trainerReducer";

import {
  createTrainingReducer,
  deleteTrainingReducer,
  trainingDetailReducer,
  trainingListReducer,
  updateTrainingStatusReducer,
} from "./trainingReducer";

import {
  createTravelReducer,
  deleteTravelReducer,
  travelDetailReducer,
  travelHistoryReducer,
  travelListReducer,
} from "./travelReducer";

import {
  createFileReducer,
  deleteFileReducer,
  fileDetailReducer,
  fileListReducer,
} from "./fileReducer";

import {
  attendancePunchReducer,
  loginReducer,
  todayAttendanceDetailReducer,
} from "./loginReducer";

import {
  createQuickLinkReducer,
  deleteQuickLinkReducer,
  empAttendanceOverviewReducer,
  employeeStatsReducer,
  leaveReportReducer,
  newEmployeeListReducer,
  quickLinkDetailReducer,
  quickLinksListReducer,
} from "./dashboardReducer";

import {
  DailyAttendanceReducer,
  orgAdditionTrendReducer,
  orgAgeGroupReducer,
  orgAttritionTrendReducer,
  orgDashboardOverviewReducer,
  orgDepartmentReducer,
  orgDesignationReducer,
  orgEmployeestatsReducer,
  orgGenderReducer,
  orgHeadcountReducer,
  PerformanceReducer,
} from "./organizationReducer";

import {
  appraisalListReducer,
  myLeaveReportReducer,
  myLeaveReportYearlyReducer,
  myLeaveSummaryReducer,
} from "./report/myreport/reportsReducer.js";
import { setLoginReducer, userListReducer, setUserRoleReducer, updateUserStatusReducer } from "./Settings/settingUserReducer.js";
import { createPolicyReducer, createOrganizationReducer, organizationDetailReducer, organizationListReducer, WorkLocListReducer, WorkLocDetailReducer, createWorkLocReducer, updateOrgStatusReducer } from "./Settings/organizationReducer.js";
import { createUpdateMasterReducer, editMasterReducer, masterListReducer } from "./Settings/masterReducer.js";
import { orgSettDetailReducer, updateOrgSettReducer } from "./Settings/attendanceReducer.js";
import { workCalStatusReducer, workCalSummaryReducer } from "./Settings/leaveReducer.js";
import { EmployeeAttritionReducer, LeaveTrackerReducer } from "./report/organizationalReport/organizationReducer.js";

const reducer = combineReducers({
  job: jobReducer, // Add the job slice reducer here
  user: userReducer,

  //dashboard
  employeeStats: employeeStatsReducer,
  empAttendanceOverview: empAttendanceOverviewReducer,
  newEmpList: newEmployeeListReducer,
  leaveTypeReport: leaveReportReducer,
  createQuickLink: createQuickLinkReducer,
  quickLinkList: quickLinksListReducer,
  quickLinkDetail: quickLinkDetailReducer,
  deleteQuickLink: deleteQuickLinkReducer,

  //reports
  myLeaveReport: myLeaveReportReducer,
  myLeaveReportYearly: myLeaveReportYearlyReducer,
  myLeaveSummary: myLeaveSummaryReducer,
  leaveTracker: LeaveTrackerReducer,
  appraisalList :appraisalListReducer,

  //organization
  orgDepartmentSummary: orgDepartmentReducer,
  orgDesignationSummary: orgDesignationReducer,
  orgGender: orgGenderReducer,
  orgAgeGroup: orgAgeGroupReducer,
  orgDashboardOverview: orgDashboardOverviewReducer,
  orgAttritionTrend: orgAttritionTrendReducer,
  orgAdditionTrend: orgAdditionTrendReducer,
  orgHeadcount: orgHeadcountReducer,
  employeeAttrition : EmployeeAttritionReducer,

  //shift
  createShift: createShiftReducer,
  assignShift: assignShiftReducer,
  shiftList: shiftListReducer,
  assignShiftList: assignShiftListReducer,
  assignShiftDelete: deleteAssignShiftReducer,
  assignShiftDetail: asssignshiftDetailReducer,
  shiftMasterDelete: deleteShiftReducer,
  updateShiftStatus: updateShiftStatusReducer,
  shiftMasterDetails: shiftDetailReducer,

  //department
  departmentList: departmentListReducer,
  createDepartment: createDepartmentReducer,
  departmentDelete: deleteDepartmentReducer,
  departmentDetails: departmentDetailReducer,
  empDepartmentDetails: empDepartmentDetailReducer,
  projectDepartmentDetails: projectDepartmentDetailReducer,
  updateDeptStatus: updateDeptStatusReducer,

  //designation
  designationList: designationListReducer,
  createDesignation: createDesignationReducer,
  designationDelete: deleteDesignationReducer,
  designationDetails: designationDetailReducer,
  empDesignationDetails: empDesignationDetailReducer,
  updateDesgnStatus: updateDesgnStatusReducer,

  //employee
  createEmployee: createEmployeeReducer,
  employeeList: employeeListReducer,
  empBirthdayList: empBirthdayListReducer,
  updateEmployeeStatus: updateEmployeeStatusReducer,
  employeeDelete: deleteEmployeeReducer,
  employeeDetails: employeeDetailReducer,
  addEmpAddress: createEmpAddressReducer,
  addEmpExperience: createEmpExperienceReducer,
  addEmpEducation: createEmpEducationReducer,
  addEmpDocument: createEmpDocumentReducer,
  addEmpRemark: createEmpRemarkReducer,
  deleteEmpExperience: deleteEmpExperienceReducer,
  deleteEmpEducation: deleteEmpEducationReducer,
  deleteEmpDocument: deleteEmpDocReducer,
  deleteEmpRemark: deleteEmpRemarkReducer,
  importEmpData: importEmpReducer,
  remarkList : remarkListReducer,

  //job
  createJob: createJobReducer,
  jobList: jobListReducer,
  updateJobStatus: updateJobStatusReducer,
  jobDetails: jobDetailReducer,
  jobDelete: deleteJobReducer,

  //project
  createProject: createProjectReducer,
  projectList: projectListReducer,
  updateProjectStatus: updateProjectStatusReducer,
  projectDetails: projectDetailReducer,
  projectDelete: deleteProjectReducer,

  //client
  createClient: createClientReducer,
  clientList: clientListReducer,
  updateClientStatus: updateClientStatusReducer,
  clientDetails: clientDetailReducer,
  clientDelete: deleteClientReducer,
  clientProject: clientDetailProjectReducer,

  //holiday
  createHoliday: createHolidayReducer,
  holidayList: holidayListReducer,
  holidayDetails: holidayDetailReducer,
  updateHolidayStatus: updateHolidayStatusReducer,
  holidayDelete: deleteHolidayReducer,

  //applicant
  createApplicant: createApplicantReducer,
  applicantList: applicantListReducer,
  updateApplicantStatus: updateApplicantStatusReducer,
  applicantDelete: deleteApplicantReducer,
  applicantDetails: applicantDetailReducer,

  //attendance
  createAttendance: createAttendanceReducer,
  attendanceList: attendanceListReducer,
  updateAttendanceStatus: updateAttendanceStatusReducer,
  attendanceDelete: deleteAttendanceReducer,
  attendanceDetails: attendanceDetailReducer,
  attendanceSummary: attendanceSummaryReducer,

  //location
  countryList: countryListReducer,
  stateList: stateListReducer,
  cityList: cityListReducer,
  workLocationList: workLocationListReducer,

  //employee health
  createEmpHealth: createEmpHealthReducer,
  empHealthList: empHealthListReducer,
  updateEmpHealthStatus: updateEmpHealthStatusReducer,
  empHealthDetails: empHealthDetailReducer,
  empHealthDelete: deleteEmpHealthReducer,

  //leave
  createLeave: createLeaveReducer,
  leaveList: leaveListReducer,
  updateLeaveStatus: updateLeaveStatusReducer,
  leaveDetails: leaveDetailReducer,
  empLeaveDetails: empLeaveDetailReducer,
  leaveDelete: deleteLeaveReducer,
  leaveSummaryDetails: leaveSummaryDetailReducer,

  //leave type
  createLeaveMaster: createLeaveTypeReducer,
  leaveMasterList: leaveTypeListReducer,
  updateLeaveTypeStatus: updateLeaveTypeStatusReducer,
  leaveTypeDetails: leaveTypeDetailReducer,
  leaveTypeDelete: deleteLeaveTypeReducer,

  //travel
  createTravel: createTravelReducer,
  travelList: travelListReducer,
  travelDetails: travelDetailReducer,
  travelDelete: deleteTravelReducer,
  travelHistory: travelHistoryReducer,

  //announcements
  createAnnouncement: createAnnouncementReducer,
  announcementList: announcementListReducer,
  announcementDetails: announcementDetailReducer,
  announcementDelete: deleteAnnouncementReducer,

  //global reducers
  getUserById: getUserByIdReducer,
  allDepartments: allDepartmentListReducer,

  //performance
  createPerformance: createPerformanceReducer,
  performanceList: performanceListReducer,
  updatePerformanceStatus: updatePerformanceStatusReducer,
  performanceDetails: performanceDetailReducer,
  performanceDelete: deletePerformanceReducer,
  sendForApproval : sendForApprovalReducer,

  // training
  createTraining: createTrainingReducer,
  trainingList: trainingListReducer,
  trainingDetails: trainingDetailReducer,
  updateTrainingStatus: updateTrainingStatusReducer,
  trainingDelete: deleteTrainingReducer,

  // ticket
  createTicket: createTicketReducer,
  ticketList: ticketListReducer,
  ticketDetails: ticketDetailReducer,
  updateTicketStatus: updateTicketStatusReducer,
  ticketDelete: deleteTicketReducer,

  // trainers
  createTrainer: createTrainerReducer,
  trainerList: trainerListReducer,
  trainerDetails: trainerDetailReducer,
  updateTrainerStatus: updateTrainerStatusReducer,
  trainerDelete: deleteTrainerReducer,
  trainerHistoryDetail: trainerHistoryDetailsReducer,

  //file
  createFile: createFileReducer,
  fileList: fileListReducer,
  fileDetails: fileDetailReducer,
  fileDelete: deleteFileReducer,

  //login
  login: loginReducer,
  todayAttendance: todayAttendanceDetailReducer,
  attendancePunch: attendancePunchReducer,

  //Settings Modules Start
  //user
  userLogin: setLoginReducer,
  userList: userListReducer,
  userRole: setUserRoleReducer,
  userStatus: updateUserStatusReducer,

  //organization PER..
  PerformanceData: PerformanceReducer,
  EmployeestatsSummary: orgEmployeestatsReducer,
  DailyAttendanceData: DailyAttendanceReducer,

  createOrganization: createOrganizationReducer,
  organizationDetail: organizationDetailReducer,
  organizationList: organizationListReducer,
  addPolicy: createPolicyReducer,
  WorkLocList: WorkLocListReducer,
  WorkLocDetail: WorkLocDetailReducer,
  addWorkLocation: createWorkLocReducer,
  organizationStatus: updateOrgStatusReducer,

  //master
  createMaster: createUpdateMasterReducer,
  masterData: masterListReducer,
  editMaster: editMasterReducer,

  //attendance
  updateOrgSett: updateOrgSettReducer,
  orgSettings: orgSettDetailReducer,

  //leave
  WorkCalendar: workCalSummaryReducer,
  workCalStatus: workCalStatusReducer
});

export default reducer;
