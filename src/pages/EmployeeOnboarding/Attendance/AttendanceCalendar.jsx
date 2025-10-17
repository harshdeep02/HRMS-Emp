import { useState, useEffect, useCallback } from "react";
import "./AttendanceCalendar.scss";
import MonthlyAttendance from "../../Attendance/MonthlyAttendance";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAttendanceSummary } from "../../../Redux/Actions/attendanceActions";
import { getUserData } from "../../../services/login";

const AttendanceCalendar = ({ }) => {

    const { id } = getUserData();
    const dispatch = useDispatch()

    //redux
    const attendanceDetails = useSelector((state) => state?.attendanceSummary);
    const attendanceData = attendanceDetails?.data?.attendance;
    const holidayData = attendanceDetails?.data?.holidays;
    const weeklyOff = attendanceDetails?.data?.weekly_off;
    const attendanceLoading = attendanceDetails?.loading || false;

    const [attendanceList, setAttendanceList] = useState([]);
    const currDate = new Date();
    const [getYear, setGetYear] = useState({ month: currDate.getMonth() + 1, year: currDate.getFullYear() })

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

    return (
        <>
        <MonthlyAttendance
            attendanceLoading={attendanceLoading}
            holidayData={holidayData}
            attendanceData={attendanceList}
            setAttendanceList={setAttendanceList}
            setYearData={setYearData}
            weeklyOff={weeklyOff}
        />
        </>
    );
};

export default AttendanceCalendar;