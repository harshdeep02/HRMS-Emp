import React, { useCallback, useEffect, useRef, useState } from 'react';
import { User, Download, ChevronLeft, ChevronRight, ChevronDown, Search } from 'lucide-react';
import ExportList from '../../../../utils/common/Export/ExportList';
import MonthlyDailyAttendanceReportCalender from './MonthlyDailyAttendanceReportCalender';
import DynamicFilter from '../../../../utils/common/DynamicFilter';
import './DailyAttendanceReportCalender.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAttendanceSummary } from '../../../../Redux/Actions/attendanceActions';
import { getEmployeeList } from '../../../../Redux/Actions/employeeActions';
import defaultImage from "../../../../assets/default-user.png";
import { TableViewSkeletonDropdown } from '../../../../utils/common/TableViewSkeleton';
import '../../../Attendance/Attendance/AttendanceDetail.scss'


const DUMMY_LEAVE_HISTORY = [
    { employeeName: 'Mr. Akash Shinde', department: 'Engineering', totalAllottedLeaves: 20, leavesUsed: 10, remainingLeaves: 10 },
    { employeeName: 'Ms. Priya Sharma', department: 'HR', totalAllottedLeaves: 15, leavesUsed: 5, remainingLeaves: 10 },
    { employeeName: 'Mr. Rahul Verma', department: 'Sales', totalAllottedLeaves: 25, leavesUsed: 15, remainingLeaves: 10 },
];

const exportHeaders = [
    { label: 'Employee Name', key: 'employeeName' },
    { label: 'Department', key: 'department' },
    { label: 'Total Allotted Leaves', key: 'totalAllottedLeaves' },
    { label: 'Leaves Used', key: 'leavesUsed' },
    { label: 'Remaining Leaves', key: 'remainingLeaves' }
];


const EmployeeFilter = ({searchTerm,  selectedEmployee, onSelectEmployee, filteredEmployees, setSearchTerm }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const dropdown = useRef(null);
    const inputRef = useRef(null);
     const employeeData = useSelector((state) => state?.employees);


     const handleSearchItem=(e)=>{
        setSearchTerm(e.target.value)
     }

    const handleSelect = (employee) => {
        onSelectEmployee(employee);
        setIsOpen(false);
    };

        useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdown.current && !dropdown.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('')
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const applicantImage = (img) => img
        ? (() => {
            try {
                return JSON.parse(img);
            } catch {
                return img;
            }
        })()
        : defaultImage;

    return (
        <div className="filter-item employee-filter" 
        onClick={() =>  setIsOpen(!isOpen)} ref={dropdown}>
            {!selectedEmployee ? 
            <div>Select Employee</div>
            :
            <>
            <img src={applicantImage(selectedEmployee?.employee?.image)} alt={selectedEmployee?.employee?.first_name} className="avatar" />
            <span>{[selectedEmployee?.employee?.first_name, selectedEmployee?.employee?.last_name].filter(Boolean).join(" ")}</span>
             </>
        }
            <ChevronDown size={20} />
            {isOpen && (
                <>
                <ul className="dropdown-menu" style={{height:'200px', overflowY:'scroll', scrollbarWidth:'none'}}>
                <Search className='Search_icon' size={20} strokeWidth={1.5} style={{ top: "18px", left: "15px"}}/>
                <input
                id='searchDepartmentHead'
                  type="search"
                  className="search22"
                  placeholder="Search Employee..."
                  value={searchTerm}
                  onChange={handleSearchItem}
                  autoComplete="off"
                  ref={inputRef}
                  onClick={(e) => e.stopPropagation()}
                />
                    {employeeData?.loading ? <TableViewSkeletonDropdown/> :
                    filteredEmployees.map(emp => (
                        <li key={emp.id} onClick={() => handleSelect(emp)}>
                            <img src={applicantImage(emp?.employee?.image)} alt={emp?.employee?.first_name} className="avatar" />
                            <span>{[emp?.employee?.first_name, emp?.employee?.last_name].filter(Boolean).join(" ")}</span>
                        </li>   
                    ))
                }
                </ul>
                </>
            )}
        </div>
    );
};

const DailyAttendanceReportCalender = () => {
        	const navigate = useNavigate();
            const pickerRef = useRef(null);
                
    //redux
    const employeeData = useSelector((state) => state?.employeeList);
    const employees = employeeData?.data?.result || [];
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [isNavigatingMonth, setIsNavigatingMonth] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
    const [searchTerm, setSearchTerm] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState("All");

    const departmentEmployees = employees?.filter(emp => {
    if (departmentFilter === "All") return true;
    return emp?.employee?.department?.id === departmentFilter; 
    });

    const filteredEmployees = departmentEmployees?.filter(emp => {
    const first = emp?.employee?.first_name?.toLowerCase() || '';
    const last = emp?.employee?.last_name?.toLowerCase() || '';
    const fullName = `${first} ${last}`;
    return fullName?.includes(searchTerm?.toLowerCase());
  });


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowMonthYearPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDepartmentFilter = (newFilter) => {
    setDepartmentFilter(newFilter);
     setSelectedEmployee('');
    };


    const dispatch = useDispatch()  

    const attendanceDetails = useSelector((state) => state?.attendanceSummary);
    const attendanceData = attendanceDetails?.data?.attendance;
    const holidayData = attendanceDetails?.data?.holidays;
    const attendanceLoading = attendanceDetails?.loading || false;
    const [attendanceList, setAttendanceList] = useState([]);
    const currDate = new Date();
    const [getYear, setGetYear] = useState({ month: currDate.getMonth() + 1, year: currDate.getFullYear() })


    const setYearData = useCallback((data) => {
        setGetYear({ month: data.month, year: data.year });
    }, []);


    const fetchEmployees = () => {
            // const sendData = { employee_status: "1,5" };
            dispatch(getEmployeeList());
        };

        
    useEffect(() => {
        fetchEmployees();
    }, []);
    
    useEffect(() => {
        const fetchAttendanceSummary = async () => {
            try {
                const sendData = {
                    user_id: selectedEmployee?.id,
                    month: getYear.month,
                    year: getYear.year
                };
                await selectedEmployee?.id ?dispatch(getAttendanceSummary(sendData)):'';
            } catch (error) {
                console.error("Error fetching Attendance Summary:", error);
            }
        };

        fetchAttendanceSummary();
    }, [dispatch, selectedEmployee, getYear]);

    useEffect(() => {
        // if (attendanceList?.length === 0) 
        setAttendanceList(attendanceData);
    }, [attendanceData]);


        const handlePreviousMonth = async () => {
        setSelectedDate(new Date(selectedYear, selectedMonth - 1, 1))
        
        if(!selectedEmployee) return
        setIsNavigatingMonth(true);
        setYearData({ month: selectedMonth, year: selectedYear })

    };
    const handleNextMonth = async () => {
        setSelectedDate(new Date(selectedYear, selectedMonth + 1, 1))

        if(!selectedEmployee) return
        setIsNavigatingMonth(true);
        setYearData({ month: selectedMonth + 2, year: selectedYear })
    };

     const handleSelectedMonth = (e) => {
        setSelectedDate(new Date(selectedYear, parseInt(e.target.value), 1))
        if(!selectedEmployee) return
        setYearData({ month: parseInt(e.target.value) + 1, year: selectedYear })
    }
    const handleSelectedYear = (e) => {
        setSelectedDate(new Date(parseInt(e.target.value), selectedMonth, 1))
        if(!selectedEmployee) return
        setYearData({ month: selectedMonth + 1, year: parseInt(e.target.value) })
    }

    useEffect(() => {
        if (!attendanceLoading) {
            setIsNavigatingMonth(false);
        }
    }, [attendanceLoading]);

        useEffect(() => {
        if (!attendanceLoading && attendanceData?.length > 0) {
            setShowMonthYearPicker(false);
        }
    }, [attendanceLoading, attendanceData]);

    return (
        <div className="dailyAttRepCal">
        <div className="leave-report-page">
            <button onClick={() => navigate(`/organisation-reports`)} className="close_nav header_close">Close</button>

            <div className="leave-dashboard-header bhr">
                <header className="leave-top-header">
                    <div className="header-left">
                        <h1>Employee Present / Absent Status</h1>
                    </div>
                    <div className="header-right export-button-main">
                        <ExportList
                            data={DUMMY_LEAVE_HISTORY}
                            headers={exportHeaders}
                            filename="daily_attendance_history.csv"
                        />
                    </div>
                </header>
            </div>

            {/* Filters */}
            <div className="filter_bar filter-bar calendar-header-att" style={{border:'none', marginBottom:0}}>
                 <div className="toolbar-actions" style={{display:"flex"}}>
                <DynamicFilter
                    filterBy="department"
                    filterValue={departmentFilter}
                    onChange={handleDepartmentFilter}
                />
                    <EmployeeFilter
                        selectedEmployee={selectedEmployee}
                        onSelectEmployee={setSelectedEmployee}
                        filteredEmployees={filteredEmployees}
                        setSearchTerm={setSearchTerm}
                        searchTerm={searchTerm}
                    />
                </div>
                <div className='filter-bar'>
                </div>

                    <div className="month-year-container" ref={pickerRef}>
                        <div className="heade_right">
                            <div className="arrow_l_r">
                                <button className="nav-arrow" onClick={handlePreviousMonth}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    
                                </button>
                                <button className="nav-arrow" onClick={handleNextMonth}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLincap="round" strokeLinejoin="round" /></svg>
                                </button>
                            </div>
                            <div className="month-year-selector" onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}>
                                <span>{selectedDate.toLocaleString("default", { month: "long" })} {selectedYear}</span>
                                <ChevronDown size={20} />
                            </div>
                        </div>
                        {showMonthYearPicker && (
                            <div className="month-year-picker-dropdown">
                                <select value={selectedMonth} onChange={(e) => handleSelectedMonth(e)}>
                                    {Array.from({ length: 12 }).map((_, i) => <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
                                </select>
                                <select value={selectedYear} onChange={(e) => handleSelectedYear(e)}>
                                    {Array.from({ length: 10 }).map((_, i) => <option key={2022 + i} value={2022 + i}>{2022 + i}</option>)}
                                </select>
                                {/* } */}
                            </div>
                        )}
                    </div>


                </div>

            {/* </div> */}

            {/* Calendar */}
            <MonthlyDailyAttendanceReportCalender selectedEmployee={selectedEmployee} selectedMonth={selectedMonth} selectedYear={selectedYear} isNavigatingMonth={isNavigatingMonth}/>
        </div>
        </div>
    );
};

export default DailyAttendanceReportCalender;
