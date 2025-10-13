import { Aperture, Ban, CalendarCheck2, CalendarCheck2Icon, CalendarClock, CalendarClockIcon, CalendarPlus, CalendarPlus2, CheckCircle2, CheckCircle2Icon, CircleCheck, CircleStop, Clock, SquareMenu, Moon, Rows3, ShieldAlert, ShieldAlertIcon, ShieldEllipsis, ShieldMinus, ShieldX, ShieldXIcon, Sun, UserPlus, List, CircleDotDashed, CalendarDays, CircleDashed, CircleStopIcon, CircleAlert, RepeatIcon, Settings2, ClockFading, ClipboardClock, Disc, PlayCircle, ExternalLink } from "lucide-react";

//Job Status
export const jobStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Draft", icon: ShieldX },
  { id: 2, label: "Open", icon: ExternalLink },
  { id: 3, label: "On Hold", icon: CircleStop },
  { id: 4, label: "Filled", icon: CheckCircle2 },
  { id: 5, label: "Cancelled", icon: Ban }
];

//Applicant Status
export const applicantStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "New", icon: List },
  { id: 2, label: "Scheduled", icon: Clock },
  { id: 3, label: "Interviewed", icon: CheckCircle2 },
  { id: 4, label: "On Hold", icon: CircleStop },
  { id: 5, label: "Hired", icon: UserPlus },
  { id: 6, label: "Rejected", icon: Ban }
];

//leave Status
export const leavesStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Approved", icon: CircleCheck },
  { id: 2, label: "Pending", icon: ShieldMinus },
  { id: 3, label: "Declined", icon: ShieldX },
];

//leave type Status
export const leavesTypesStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Active", icon: CheckCircle2 },
  { id: 2, label: "Inactive", icon: ShieldX },
];

//holiday Status
export const holidayStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Past", icon: CalendarCheck2Icon },
  { id: 2, label: "Ongoing", icon: CalendarClockIcon },
  { id: 3, label: "Upcoming", icon: CalendarPlus },
];

//ticket Status
export const ticketStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Open", icon: CircleCheck },
  { id: 2, label: "In Progress", icon: CircleAlert },
  { id: 3, label: "On Hold", icon: CircleStopIcon },
  { id: 4, label: "Closed", icon: ShieldX },
];

export const userStatusOption = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 0, label: "Login Enabled", icon: CheckCircle2 },
  { id: 1, label: "Login Disabled", icon: ShieldX },
];

// shift status
export const shiftStatusOption = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Active", icon: CheckCircle2Icon },
  { id: 2, label: "Inactive", icon: ShieldXIcon },
];

//Employee Status
export const employeeStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Active", icon: CheckCircle2 },
  { id: 2, label: "Inactive", icon: ShieldX },
  { id: 3, label: "On hold", icon: CircleStop },
  { id: 4, label: "Terminated", icon: ShieldEllipsis },
  { id: 5, label: "Notice period", icon: Clock },
  { id: 6, label: "Resigned", icon: Ban }
];

//Employee Status
export const birthDayStatusOptions = [
  { id: 0, label: "All", icon: SquareMenu },
  { id: "week", label: "This Week", icon: CheckCircle2 },
  { id: "month", label: "This Month", icon: ShieldX }
];

//Department Status
export const departmentStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Active", icon: CheckCircle2 },
  { id: 2, label: "Inactive", icon: ShieldX },
];

//performance Status
export const performanceStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Approved", icon: CheckCircle2 },
  { id: 2, label: "Pending", icon: CircleDotDashed },
  { id: 3, label: "Declined", icon: ShieldX },
  { id: 4, label: "Approval Pending", icon: Clock },
];
//performance Status
export const appraisalStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Approved", icon: CheckCircle2 },
  { id: 2, label: "Pending", icon: CircleDotDashed },
  { id: 3, label: "Declined", icon: ShieldX },
  { id: 4, label: "Approval Pending", icon: Clock },
];


//Employee File Status
export const employeeFilesStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Ongoing", icon: CheckCircle2 },
  { id: 2, label: "Expired", icon: ShieldX },
];
//Orgnisation Files Status
export const orgnisationFilesStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Ongoing", icon: CheckCircle2 },
  { id: 2, label: "Expired", icon: ShieldX },
];

//Designation Status
export const designationStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Active", icon: CheckCircle2 },
  { id: 2, label: "Inactive", icon: ShieldX },
];

//Work Location Status
export const WorkLocationStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Active", icon: CheckCircle2 },
  { id: 2, label: "Inactive", icon: ShieldX },
];

//Announcement Status
export const announcementStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 2, label: "Expired", icon: ShieldXIcon },
  { id: 1, label: "Ongoing", icon: ShieldAlertIcon },
];

//EmployeeHealth Status
export const empHealthStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Healthy", icon: CheckCircle2Icon },
  { id: 2, label: "Unhealthy", icon: ShieldXIcon },
];

//Travel Status
export const travelStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Approved", icon: CheckCircle2Icon },
  { id: 2, label: "Pending", icon: ShieldXIcon },
  { id: 3, label: "Declined", icon: ShieldXIcon },
];

//gender options
export const genderOptions = [
  { id: 1, label: "Male" },
  { id: 2, label: "Female" }
];

//marital status
export const maritalStatus = [
  { id: 1, label: "Married" },
  { id: 2, label: "Unmarried" }
];

//metro options
export const metroOptions = [
  { id: 1, label: "Metro" },
  { id: 2, label: "Non-Metro" }
];

//covid affected options
export const covidAffectedOptions = [
  { id: 1, label: "Yes" },
  { id: 2, label: "No" },
  { id: 3, label: "Not Sure" },
];

//trainer status
export const trainerStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Active", icon: CheckCircle2 },
  { id: 2, label: "Inactive", icon: ShieldX },
];

//organization status options
export const organizationStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Active", icon: CheckCircle2 },
  { id: 2, label: "Inactive", icon: ShieldX },
];

//training status options
export const trainingStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Completed", icon: CircleCheck },
  { id: 2, label: "Ongoing", icon: ClipboardClock },
  { id: 3, label: "Planned", icon: CalendarDays },
  { id: 4, label: "Cancelled", icon: ShieldX },
];

//client status
export const clientStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Active", icon: CheckCircle2 },
  { id: 2, label: "Inactive", icon: ShieldX },
];
// projectStatus
export const ProjectStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Ongoing", icon: PlayCircle },
  { id: 2, label: "Completed", icon: CircleCheck },
  { id: 3, label: "On Hold", icon: ShieldMinus },
  { id: 4, label: "Not Started", icon: ShieldAlertIcon },
  { id: 5, label: "Cancelled", icon: Ban },
];

export const LeaveReportStatusOptions = [
  { id: "All", label: "All", icon: SquareMenu },
  { id: 1, label: "Approved", icon: CheckCircle2 },
  { id: 2, label: "Pending", icon: Clock },
  { id: 3, label: "Rejected", icon: ShieldX },
];
// const projectStatusOptions = [
//   { id: "All", label: "All", key: "all", count: allProjectsData.length, icon: Rows4 },
//   { id: "Completed", label: "Completed", key: "completed" icon: CircleCheck },
//   { id: "Ongoing", label: "Ongoing", key: "ongoing", icon: CircleDashed },
//   { id: "On hold", label: "On hold", key: "onhold", icon: CalendarDays }, // Updated label
//   { id: "Cancelled", label: "Cancelled", key: "cancelled", icon: ShieldX },
//   { id: "Not started", label: "Not started", key: "notstarted", icon: Disc }, // New label
// ];

export const ProjectPriorityOptions = ['High', 'Medium', 'Low'];
export const TicketPriorityOptions = ['High', 'Medium', 'Low', 'Urgent'];
export const FileTypeOptions = ['Organization', 'Employee'];

//Differently Abled Type 
export const differentlyAbledOptions = ['None', 'Visual', 'Hearing', 'Speech', 'Mobility', 'Other'];

//employee dummy Image
export const dummyImageUrl = "https://www.pngitem.com/pimgs/m/80-800194_transparent-users-icon-png-flat-user-icon-png.png";

//applicantStatus
export const applicantStatus = ['New', 'Schedule', 'Interviewed', 'Hired', 'On Hold', 'Rejected'];

//document options
export const documentOptions = ['Aadhaar', 'PAN', 'UAN', 'Other'];

//attendanceStatus
export const attendanceStatus = [{ label: "Present", value: "0" }, { label: "Absent", value: "1" }, { label: "Half Day", value: "2" },];

//status options
export const statusOptions = [{ label: "Active", value: "0" }, { label: "Inactive", value: "1" }];

//shift options
export const shiftOptions = ['Morning', 'Evening', 'Night'];

//department options
export const departmentOptions = ['Management', 'HR', 'Sales', 'IT'];

//employee health
export const employeeHealthStatus = ['Fully Vaccinated ', 'Partially Vaccinated', 'Not Vaccinated'];

//blood group options
export const bloodGroupOptions = ['A+', 'A-', 'B+', ' B-', 'O+', 'O-', 'AB+', 'AB-'];

//health check options
export const healthCheckOptions = ['Healthy', 'UnHealthy'];

//covid vacination status
export const covidVacinationOptions = ['Fully Vaccinated', 'Partially Vaccinated', 'Not Vaccinated'];


//leave type options
export const leaveTypeOptions = ['Paid', 'Unpaid', 'On Duty'];

//leave options
export const leaveOptions = ['Half Day', 'Full Day'];

//leaves status options
export const leaveStatusOptions = ['Pending', 'Approved', 'Declined'];

//travel billable options
export const travelBillableOptions = ["Yes", "No"];

// file notify_all
export const file_notify_allOptions = ["Yes", "No"];

//performance technical skill status
export const performanceSkillStatus = ["None", "Beginner", "Intermediate", "Advanced", "Expert"]

//performance status
export const performanceStatuOptions = ['Approved', 'Declined', 'Pending'];

//performance technical skills 
export const performanceTechnicalSkill = [
  { name: "Customer Experience", level: "Intermediate", field: "customer_experience" },
  { name: "Marketing", level: "Advanced", field: "marketing" },
  { name: "Management", level: "Advanced", field: "management" },
  { name: "Administration", level: "Advanced", field: "administration" },
  { name: "Presentation Skill", level: "Expert / Leader", field: "presentation_skill" },
  { name: "Quality Of Work", level: "Expert / Leader", field: "quality_of_work" },
  { name: "Efficiency", level: "Expert / Leader", field: "Efficiency" }
];

//performance organizational skills
export const performanceOrganizational = [
  { name: "Team Work", level: "Intermediate", field: "team_work" },
  { name: "Integrity", level: "Beginner", field: "integrity" },
  { name: "Professionalism", level: "Beginner", field: "professionalism" },
  { name: "Critical Thinking", level: "Advanced", field: "critical_thinking" },
  { name: "Conflict Management", level: "Intermediate", field: "conflict_management" },
  { name: "Attendance", level: "Intermediate", field: "attendance" },
  { name: "Ability To Meet Deadline", level: "Advanced", field: "ability_to_meet_deadline" },
  // Add more skills as needed
];

export const COLORS = ["#A448EE", "#a348eebe", "#a348ee77"];