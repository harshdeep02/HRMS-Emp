
import { fetchOrgDepartmentSummary, fetchOrgDesignationSummary, fetchOrgGender, fetchOrgAgeGroup, fetchOrgDashboardOverview, fetchOrgAttritionTrend, fetchOrgAdditionTrend, fetchOrgHeadcount, fetchOrgEmployeestatsSummary, fetchPerformance, fetchDailyAttendance } from "../../services/organization";
import { GET_EMPLOYEESTATS_SUMMARY_REQUEST, GET_EMPLOYEESTATS_SUMMARY_SUCCESS, GET_EMPLOYEESTATS_SUMMARY_FAILURE, GET_ORGANIZATION_DEPARTMENT_SUMMARY_FAILURE, GET_ORGANIZATION_DEPARTMENT_SUMMARY_SUCCESS, GET_ORGANIZATION_DEPARTMENT_SUMMARY_REQUEST, GET_ORGANIZATION_ADDITION_TREND_REQUEST, GET_ORGANIZATION_ADDITION_TREND_SUCCESS, GET_ORGANIZATION_ADDITION_TREND_FAILURE, GET_ORGANIZATION_HEADCOUNT_SUCCESS, GET_ORGANIZATION_HEADCOUNT_REQUEST, GET_ORGANIZATION_HEADCOUNT_FAILURE, GET_PERFORMANCE_REQUEST, GET_PERFORMANCE_SUCCESS, GET_PERFORMANCE_FAILURE, GET_DAILYATTENDANCE_REQUEST, GET_DAILYATTENDANCE_SUCCESS, GET_DAILYATTENDANCE_FAILURE } from "../Constants/organizationConstants";
// ///////// old
import { GET_ORGANIZATION_DESIGNATION_SUMMARY_FAILURE, GET_ORGANIZATION_DESIGNATION_SUMMARY_SUCCESS, GET_ORGANIZATION_DESIGNATION_SUMMARY_REQUEST } from "../Constants/organizationConstants";
import { GET_ORGANIZATION_GENDER_REQUEST, GET_ORGANIZATION_GENDER_SUCCESS, GET_ORGANIZATION_GENDER_FAILURE } from "../Constants/organizationConstants";
import { GET_ORGANIZATION_AGE_GROUP_REQUEST, GET_ORGANIZATION_AGE_GROUP_SUCCESS, GET_ORGANIZATION_AGE_GROUP_FAILURE } from "../Constants/organizationConstants";
import { GET_ORGANIZATION_DashboardOverview_REQUEST, GET_ORGANIZATION_DashboardOverview_SUCCESS, GET_ORGANIZATION_DashboardOverview_FAILURE } from "../Constants/organizationConstants";
import { GET_ORGANIZATION_ATTRITION_TREND_REQUEST, GET_ORGANIZATION_ATTRITION_TREND_SUCCESS, GET_ORGANIZATION_ATTRITION_TREND_FAILURE } from "../Constants/organizationConstants";

export const getEmployeestatsSummary = (params) => async (dispatch) => {
    dispatch({ type: GET_EMPLOYEESTATS_SUMMARY_REQUEST });
    try {
        const response = await fetchOrgEmployeestatsSummary(params);
        dispatch({ type: GET_EMPLOYEESTATS_SUMMARY_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_EMPLOYEESTATS_SUMMARY_FAILURE, payload: error.message });
    }
};

export const getPerformance = (params) => async (dispatch) => {
    dispatch({ type: GET_PERFORMANCE_REQUEST });
    try {
        const response = await fetchPerformance(params);
        dispatch({ type: GET_PERFORMANCE_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_PERFORMANCE_FAILURE, payload: error.message });
    }
};

export const getDailyAttendance = (params) => async (dispatch) => {
    dispatch({ type: GET_DAILYATTENDANCE_REQUEST });
    try {
        const response = await fetchDailyAttendance(params);
        dispatch({ type: GET_DAILYATTENDANCE_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_DAILYATTENDANCE_FAILURE, payload: error.message });
    }
};

////////////////////////////old ///////////////////////////////////////
export const getOrgDepartmentSummary = (params) => async (dispatch) => {
    dispatch({ type: GET_ORGANIZATION_DEPARTMENT_SUMMARY_REQUEST });
    try {
        const response = await fetchOrgDepartmentSummary(params);
        dispatch({ type: GET_ORGANIZATION_DEPARTMENT_SUMMARY_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_ORGANIZATION_DEPARTMENT_SUMMARY_FAILURE, payload: error.message });
    }
};
export const getOrgDesignationSummary = (params) => async (dispatch) => {
    dispatch({ type: GET_ORGANIZATION_DESIGNATION_SUMMARY_REQUEST });
    try {
        const response = await fetchOrgDesignationSummary(params);
        dispatch({ type: GET_ORGANIZATION_DESIGNATION_SUMMARY_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_ORGANIZATION_DESIGNATION_SUMMARY_FAILURE, payload: error.message });
    }
};
export const getOrgGender = (params) => async (dispatch) => {
    dispatch({ type: GET_ORGANIZATION_GENDER_REQUEST });
    try {
        const response = await fetchOrgGender(params);
        dispatch({ type: GET_ORGANIZATION_GENDER_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_ORGANIZATION_GENDER_FAILURE, payload: error.message });
    }
};
export const getOrgAgeGroup = (params) => async (dispatch) => {
    dispatch({ type: GET_ORGANIZATION_AGE_GROUP_REQUEST });
    try {
        const response = await fetchOrgAgeGroup(params);
        dispatch({ type: GET_ORGANIZATION_AGE_GROUP_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_ORGANIZATION_AGE_GROUP_FAILURE, payload: error.message });
    }
};
export const getOrgDashboardOverview = (params) => async (dispatch) => {
    dispatch({ type: GET_ORGANIZATION_DashboardOverview_REQUEST });
    try {
        const response = await fetchOrgDashboardOverview(params);
        dispatch({ type: GET_ORGANIZATION_DashboardOverview_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_ORGANIZATION_DashboardOverview_FAILURE, payload: error.message });
    }
};

// 
export const getOrgAttritionTrend = (params) => async (dispatch) => {
    dispatch({ type: GET_ORGANIZATION_ATTRITION_TREND_REQUEST });
    try {
        const response = await fetchOrgAttritionTrend(params);
        dispatch({ type: GET_ORGANIZATION_ATTRITION_TREND_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_ORGANIZATION_ATTRITION_TREND_FAILURE, payload: error.message });
    }
};

export const getOrgAdditionTrend = (params) => async (dispatch) => {
    dispatch({ type: GET_ORGANIZATION_ADDITION_TREND_REQUEST });
    try {
        const response = await fetchOrgAdditionTrend(params);
        dispatch({ type: GET_ORGANIZATION_ADDITION_TREND_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_ORGANIZATION_ADDITION_TREND_FAILURE, payload: error.message });
    }
};

export const getOrgHeadcount = (params) => async (dispatch) => {
    dispatch({ type: GET_ORGANIZATION_HEADCOUNT_REQUEST });
    try {
        const response = await fetchOrgHeadcount(params);
        dispatch({ type: GET_ORGANIZATION_HEADCOUNT_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_ORGANIZATION_HEADCOUNT_FAILURE, payload: error.message });
    }
};
export const getOrganizationList = (params) => async (dispatch) => {
    dispatch({ type: GET_ORGANIZATION_HEADCOUNT_REQUEST });
    try {
        const response = await fetchOrgHeadcount(params);
        dispatch({ type: GET_ORGANIZATION_HEADCOUNT_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_ORGANIZATION_HEADCOUNT_FAILURE, payload: error.message });
    }
};
