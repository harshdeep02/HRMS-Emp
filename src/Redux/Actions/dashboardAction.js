import { createQuickLink, deleteQuickLinkApi, fetchEmpAttendanceOverview, fetchEmployeeStats, fetchLeaveReport, fetchQuickLinkDetails, fetchQuickLinkList } from "../../services/dashboard";
import { fetchEmployeeList } from "../../services/employee";
import { ADD_QUICK_LINK_FAILURE, ADD_QUICK_LINK_REQUEST, ADD_QUICK_LINK_SUCCESS, DELETE_QUICK_LINK_FAILURE, DELETE_QUICK_LINK_REQUEST, DELETE_QUICK_LINK_SUCCESS, GET_EMP_ATTENDANCE_OVERVIEW_FAILURE, GET_EMP_ATTENDANCE_OVERVIEW_REQUEST, GET_EMP_ATTENDANCE_OVERVIEW_SUCCESS, GET_EMPLOYEE_STATS_FAILURE, GET_EMPLOYEE_STATS_REQUEST, GET_EMPLOYEE_STATS_SUCCESS, GET_LEAVE_REPORT_FAILURE, GET_LEAVE_REPORT_REQUEST, GET_LEAVE_REPORT_SUCCESS, GET_NEW_EMP_LIST_FAILURE, GET_NEW_EMP_LIST_REQUEST, GET_NEW_EMP_LIST_SUCCESS, GET_QUICK_LINK_DETAIL_FAILURE, GET_QUICK_LINK_DETAIL_REQUEST, GET_QUICK_LINK_DETAIL_SUCCESS, GET_QUICK_LINK_LIST_FAILURE, GET_QUICK_LINK_LIST_REQUEST, GET_QUICK_LINK_LIST_SUCCESS } from "../Constants/dashboardConstant";
import { toast } from "react-toastify";


export const getEmployeeStats = (params) => async dispatch => {
    dispatch({ type: GET_EMPLOYEE_STATS_REQUEST });
    try {
        const response = await fetchEmployeeStats(params);       
        dispatch({ type: GET_EMPLOYEE_STATS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_EMPLOYEE_STATS_FAILURE, payload: error.message });
    }
};

export const getEmpAttendanceOverview = (params) => async dispatch => {
    dispatch({ type: GET_EMP_ATTENDANCE_OVERVIEW_REQUEST });
    try {
        const response = await fetchEmpAttendanceOverview(params);       
        dispatch({ type: GET_EMP_ATTENDANCE_OVERVIEW_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_EMP_ATTENDANCE_OVERVIEW_FAILURE, payload: error.message });
    }
};

export const getNewEmployeeList = (params) => async dispatch => {
    dispatch({ type: GET_NEW_EMP_LIST_REQUEST });
    try {
        const response = await fetchEmployeeList(params);       
        dispatch({ type: GET_NEW_EMP_LIST_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_NEW_EMP_LIST_FAILURE, payload: error.message });
    }
};

export const getLeaveReport = () => async (dispatch) => {
    dispatch({ type: GET_LEAVE_REPORT_REQUEST });
    try {
        const response = await fetchLeaveReport();
        dispatch({ type: GET_LEAVE_REPORT_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_LEAVE_REPORT_FAILURE, payload: error.message });
    }
};

export const addQuickLink = (params) => async (dispatch) => {
    try {
        dispatch({ type: ADD_QUICK_LINK_REQUEST });
        const { data } = await createQuickLink(params);
        const { message, status } = data;
        dispatch({
            type: ADD_QUICK_LINK_SUCCESS,
            payload: data,
        });
        if (status === 200) {
             toast.success(message || "Created successfully.", {
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
            // setTimeout(() => {
            //     navigate("/");
            // }, 1500);
        } else {
            toast.error(message || "Error during Create", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    } catch (error) {
        toast.error(error.message);
        dispatch({ type: ADD_QUICK_LINK_FAILURE, payload: error.message });
    }
};

export const getQuickLinksList = (params) => async (dispatch) => {
    dispatch({ type: GET_QUICK_LINK_LIST_REQUEST });
    try {
        const response = await fetchQuickLinkList(params);
        dispatch({ type: GET_QUICK_LINK_LIST_SUCCESS, payload: response.data });
        
    } catch (error) {
        dispatch({ type: GET_QUICK_LINK_LIST_FAILURE, payload: error.message });
    }
};

export const getQuickLinkDetails = (params) => async (dispatch) => {
    dispatch({ type: GET_QUICK_LINK_DETAIL_REQUEST });
    try {
        const response = await fetchQuickLinkDetails(params);
        dispatch({ type: GET_QUICK_LINK_DETAIL_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_QUICK_LINK_DETAIL_FAILURE, payload: error.message });
    }
};

export const deleteQuickLink = (params) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_QUICK_LINK_REQUEST });
        const { data } = await deleteQuickLinkApi(params);
        const { message, success } = data;
        dispatch({
            type: DELETE_QUICK_LINK_SUCCESS,
            payload: data,
        });
        if (success) {
            toast.success(message || "Created successfully.", {
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
        } else {
            toast.error(message || "Error during Delete", {
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
        toast.error(error.message);
        dispatch({ type: DELETE_QUICK_LINK_FAILURE, payload: error.message });
    }
};