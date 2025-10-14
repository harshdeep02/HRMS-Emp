import { useLocation, useNavigate, useParams } from 'react-router-dom';
import bannerImg from '../../../assets/Document_3.svg';
import MonthlyAttendance from './MonthlyAttendance';
import './AttendanceDetail.scss'
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { getAttendanceSummary } from '../../../Redux/Actions/attendanceActions';

const AttendanceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation()
    const { employee_name } = location.state || {}
    const employeeFirstName = employee_name?.split(' ')[0]
    const dispatch = useDispatch()  

    //redux
    const attendanceDetails = useSelector((state) => state?.attendanceSummary);
    const attendanceData = attendanceDetails?.data?.attendance;
    const holidayData = attendanceDetails?.data?.holidays;
    const weeklyOff = attendanceDetails?.data?.weekly_off;
    const attendanceLoading = attendanceDetails?.loading || false;
    console.log(attendanceDetails)
    const [attendanceList, setAttendanceList] = useState([]);
    const currDate = new Date();
    const [getYear, setGetYear] = useState({ month: currDate.getMonth() + 1, year: currDate.getFullYear() })

    const currYear = currDate.getFullYear();
    const currMonth = currDate.getMonth() + 1;

    const setYearData = useCallback((data) => {
        setGetYear({ month: data.month, year: data.year });
    }, []);

    useEffect(() => {
        const fetchAttendanceSummary = async () => {
            try {
                const sendData = {
                    user_id: id,
                    month: getYear.month,
                    year: getYear.year
                };
                await dispatch(getAttendanceSummary(sendData));
            } catch (error) {
                console.error("Error fetching Attendance Summary:", error);
            }
        };

        fetchAttendanceSummary();
    }, [dispatch, id, getYear]);

    useEffect(() => {
        // if (attendanceList?.length === 0) 
        setAttendanceList(attendanceData);
    }, [attendanceData]);

    // if (attendanceLoading && attendanceList?.length === 0) {
    //     return <div className="loading-state"><Loader /></div>;
    // }

    return (
        <div className="attendanceDetailMain otherDetailPageSroll calenMain">
            <div className="dept-page-container">
                <button onClick={() => navigate('/attendance-list')} className="close_nav header_close">Close</button>

                <h2 className="dept-page-main-heading"><span>{employeeFirstName}</span>’s Attendance Summary</h2>
                <div className="dept-page-content-wrapper">

                    <div className="dept-page-left-panel">
                        <h3 className="dept-page-mark-text">Provided Details</h3>
                        <p className="dept-page-info-text">See monthly attendance of {employee_name}</p>
                        <div className="dept-page-illustration-box">
                            <img className=' ' src={bannerImg} alt="Illustration" />
                        </div>
                    </div>
                    <div className="dept_page_table  ">
                        {/*  */}
                     
                            <MonthlyAttendance weeklyOff={weeklyOff} attendanceLoading={attendanceLoading} holidayData={holidayData} attendanceData={attendanceList} setAttendanceList={setAttendanceList} setYearData={setYearData} />
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AttendanceDetail;
