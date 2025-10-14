import { toast } from "react-toastify";
import { attendancePunchApi, fetchTodayAttendance, loginApi, setUserData } from "../../services/login";
import { ADD_ATTENDANCE_PUNCH_FAILURE, ADD_ATTENDANCE_PUNCH_REQUEST, ADD_ATTENDANCE_PUNCH_SUCCESS, GET_TODAY_ATTENDANCE_DETAIL_FAILURE, GET_TODAY_ATTENDANCE_DETAIL_REQUEST, GET_TODAY_ATTENDANCE_DETAIL_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS } from "../Constants/loginConstants";


export const login = (params) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST });
        const response = await loginApi(params);
        
        const { error, message, status } = response.data;
        dispatch({
            type: LOGIN_SUCCESS,
            payload: response.data.result,
        });
        if (response?.status === 200 && !response?.data?.error) {
            // toast.success(message, {
            //     position: "top-right",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "light",
            // });
            localStorage.setItem('AccessToken', response.data.access_token);
            localStorage.setItem('UserData', response.data.user);
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('loggedInORG', response?.data?.result?.organisation && JSON.stringify(response?.data?.result?.organisation));

            await setUserData(response.data.user);
            return response?.data
        }
        else {
            // toast.error(message || "Something went wrong.", {
            //     position: "top-right",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "light",
            // });
            return { success: false }
        }
    } catch (error) {
        const message = error?.response?.data?.message;
        toast.error(message || "Something went wrong.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        dispatch({ type: LOGIN_FAILURE, payload: error?.response?.data?.message });
        return { success: false }
    }
};

export const addAttendancePunch = (params) => async (dispatch) => {
    try {
        dispatch({ type: ADD_ATTENDANCE_PUNCH_REQUEST });
        const { data } = await attendancePunchApi(params);
        const { message, status } = data;
        dispatch({
            type: ADD_ATTENDANCE_PUNCH_SUCCESS,
            payload: data.result,
        });
        if (status === 200) {
            toast.success(message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return { success: true }
        }
        else {
            toast.error(message || "Something went wrong.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return { success: false }
        }
    } catch (error) {
        console.log("error", error);
        const message = error.response.data.message;
        toast.error(error.message);
        dispatch({ type: ADD_ATTENDANCE_PUNCH_FAILURE, payload: error.message });
        return { success: false }
    }
};

export const getTodayAttendanceDetails = (params) => async (dispatch) => {
    dispatch({ type: GET_TODAY_ATTENDANCE_DETAIL_REQUEST });
    try {
        const response = await fetchTodayAttendance(params);
        dispatch({ type: GET_TODAY_ATTENDANCE_DETAIL_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_TODAY_ATTENDANCE_DETAIL_FAILURE, payload: error.message });
    }
};