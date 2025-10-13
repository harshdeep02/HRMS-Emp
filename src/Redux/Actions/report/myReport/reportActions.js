
import {  fetchMyLeaveReport, fetchMyLeaveReportYearly, fetchMyLeaveSummary } from "../../../../services/report/MyReport/leaveReports";
import {  GET_MY_LEAVE_REPORT_FAILURE, GET_MY_LEAVE_REPORT_REQUEST, GET_MY_LEAVE_REPORT_SUCCESS, GET_MY_LEAVE_REPORT_YEARLY_FAILURE, GET_MY_LEAVE_REPORT_YEARLY_REQUEST, GET_MY_LEAVE_REPORT_YEARLY_SUCCESS, GET_MY_LEAVE_SUMMARY_FAILURE, GET_MY_LEAVE_SUMMARY_REQUEST, GET_MY_LEAVE_SUMMARY_SUCCESS } from "../../../Constants/report/myReport/reportsConstants";

export const getMyLeaveReport = (params) => async (dispatch) => {
    dispatch({ type: GET_MY_LEAVE_REPORT_REQUEST });
    try {
        const response = await fetchMyLeaveReport(params);
        dispatch({ type: GET_MY_LEAVE_REPORT_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_MY_LEAVE_REPORT_FAILURE, payload: error.message });
    }
};

export const getMyLeaveReportYearly = (params) => async (dispatch) => {
    dispatch({ type: GET_MY_LEAVE_REPORT_YEARLY_REQUEST });
    try {
        const response = await fetchMyLeaveReportYearly(params);
        dispatch({ type: GET_MY_LEAVE_REPORT_YEARLY_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_MY_LEAVE_REPORT_YEARLY_FAILURE, payload: error.message });
    }
};

export const getMyLeaveSummary = (params) => async (dispatch) => {
    dispatch({ type: GET_MY_LEAVE_SUMMARY_REQUEST });
    try {
        const response = await fetchMyLeaveSummary(params);
        dispatch({ type: GET_MY_LEAVE_SUMMARY_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_MY_LEAVE_SUMMARY_FAILURE, payload: error.message });
    }
};