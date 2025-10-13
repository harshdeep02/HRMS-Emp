import { fetchWorkCalSummary, updateWorkCalStatusApi } from "../../../services/settings/leave";
import { GET_WORK_CALENDAR_SUMMARY_FAILURE, GET_WORK_CALENDAR_SUMMARY_REQUEST, GET_WORK_CALENDAR_SUMMARY_SUCCESS, UPDATE_WORK_CALENDAR_STATUS_FAILURE, UPDATE_WORK_CALENDAR_STATUS_REQUEST, UPDATE_WORK_CALENDAR_STATUS_SUCCESS } from "../../Constants/Settings/leaveConstant";
import { toast } from "react-toastify";


export const getWorkCalSummary = (params) => async (dispatch) => {
    dispatch({ type: GET_WORK_CALENDAR_SUMMARY_REQUEST });
    try {
        const response = await fetchWorkCalSummary(params);
        dispatch({ type: GET_WORK_CALENDAR_SUMMARY_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_WORK_CALENDAR_SUMMARY_FAILURE, payload: error.message });
    }
};


export const updateWorkCalStatus = (params) => async (dispatch) => {
    dispatch({ type: UPDATE_WORK_CALENDAR_STATUS_REQUEST });
    try {
        const response = await updateWorkCalStatusApi(params);
        dispatch({ type: UPDATE_WORK_CALENDAR_STATUS_SUCCESS, payload: response.data });
        if(response?.data?.success)return response?.data
    } catch (error) {
        dispatch({ type: UPDATE_WORK_CALENDAR_STATUS_FAILURE, payload: error.message });
    }
};