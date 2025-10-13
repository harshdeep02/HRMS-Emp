import { fetchEmployeeAttritionApi, fetchLeaveTrackerReport } from "../../../../services/report/organizationalReport/organizationReport";
import { GET_EMPLOYEE_ATTRITION_FAILURE, GET_EMPLOYEE_ATTRITION_REQUEST, GET_EMPLOYEE_ATTRITION_SUCCESS, GET_LEAVE_TRACKER_FAILURE, GET_LEAVE_TRACKER_REQUEST, GET_LEAVE_TRACKER_SUCCESS } from "../../../Constants/report/organizationalReport/organizationConstant";

export const getLeaveTracker = (params) => async (dispatch) => {
    dispatch({ type: GET_LEAVE_TRACKER_REQUEST });
    try {
        const response = await fetchLeaveTrackerReport(params);
        dispatch({ type: GET_LEAVE_TRACKER_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_LEAVE_TRACKER_FAILURE, payload: error.message });
    }
};
export const getEmployeeAttrition = (params) => async (dispatch) => {
    dispatch({ type: GET_EMPLOYEE_ATTRITION_REQUEST });
    try {
        const response = await fetchEmployeeAttritionApi(params);
        dispatch({ type: GET_EMPLOYEE_ATTRITION_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_EMPLOYEE_ATTRITION_FAILURE, payload: error.message });
    }
};