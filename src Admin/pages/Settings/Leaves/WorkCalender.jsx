import { useLocation, useNavigate, useParams } from 'react-router-dom';
import bannerImg from '../../../assets/Document_3.svg';
import '../../Attendance/Attendance/AttendanceDetail.scss'
// import './AttendanceDetail.scss'
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { getAttendanceSummary } from '../../../Redux/Actions/attendanceActions';
import MonthlyCalendar from './MonthlyCalendar';
import { getWorkCalSummary } from '../../../Redux/Actions/Settings/leaveActions';

export const WorkCalender = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation()
  const { employee_name } = location.state || {}
  const employeeFirstName = employee_name?.split(' ')[0]
  const dispatch = useDispatch()

    //redux
    const WorkCalendarDetail = useSelector((state) => state?.WorkCalendar);
    const CalendarData = WorkCalendarDetail?.data?.calendar;
    const holidayData = WorkCalendarDetail?.data?.holidays;
    const CalendarLoading = WorkCalendarDetail?.loading || false;
    const [CalendarList, setCalendarList] = useState([]);
    const currDate = new Date();
    const [getYear, setGetYear] = useState({ month: currDate.getMonth() + 1, year: currDate.getFullYear() })

    const setYearData = useCallback((data) => {
        setGetYear({ month: data.month, year: data.year });
    }, []);
    useEffect(() => {
        const fetchWorkCalSummary = async () => {
            try {
                const sendData = {
                    month: getYear.month,
                    year: getYear.year
                };
                await dispatch(getWorkCalSummary(sendData));
            } catch (error) {
                console.error("Error Fetching Work Calendar Summary:", error);
            }
        };

        fetchWorkCalSummary();
    }, [dispatch, id, getYear]);

    useEffect(() => {
        // if (CalendarList?.length === 0) 
        setCalendarList(CalendarData);
    }, [CalendarData])

    useEffect(() => {
        // if (CalendarList?.length === 0) 
        setCalendarList(CalendarData);
    }, [CalendarData])

  return (
    <div className='workCalnederMain'>
      <div className="">
        <div className="workCalTextMain">
          <div className="workCalTextUpper">
            Work Calendar
          </div>
          <div className="workCalTextBottom">
            Define the work days, weekends, year, and statutory weekends for your organization. Set up multiple calendar settings for each geographical location within your organization
          </div>
        </div>
      </div>

      <MonthlyCalendar CalendarLoading={CalendarLoading} getYear={getYear} holidayData={holidayData} CalendarData={CalendarList} setCalendarList={setCalendarList} setYearData={setYearData}/>
    </div>
  )
}
