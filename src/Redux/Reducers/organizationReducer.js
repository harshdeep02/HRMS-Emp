import { GET_EMPLOYEESTATS_SUMMARY_REQUEST, GET_EMPLOYEESTATS_SUMMARY_SUCCESS, GET_EMPLOYEESTATS_SUMMARY_FAILURE, GET_ORGANIZATION_DEPARTMENT_SUMMARY_FAILURE, GET_ORGANIZATION_DEPARTMENT_SUMMARY_SUCCESS, GET_ORGANIZATION_DEPARTMENT_SUMMARY_REQUEST, GET_ORGANIZATION_ADDITION_TREND_REQUEST, GET_ORGANIZATION_ADDITION_TREND_SUCCESS, GET_ORGANIZATION_ADDITION_TREND_FAILURE, GET_ORGANIZATION_HEADCOUNT_REQUEST, GET_ORGANIZATION_HEADCOUNT_SUCCESS, GET_ORGANIZATION_HEADCOUNT_FAILURE, GET_PERFORMANCE_REQUEST, GET_PERFORMANCE_SUCCESS, GET_PERFORMANCE_FAILURE, GET_DAILYATTENDANCE_FAILURE, GET_DAILYATTENDANCE_SUCCESS, GET_DAILYATTENDANCE_REQUEST } from "../Constants/organizationConstants";
import { GET_ORGANIZATION_DESIGNATION_SUMMARY_FAILURE, GET_ORGANIZATION_DESIGNATION_SUMMARY_SUCCESS, GET_ORGANIZATION_DESIGNATION_SUMMARY_REQUEST } from "../Constants/organizationConstants";
import { GET_ORGANIZATION_GENDER_REQUEST, GET_ORGANIZATION_GENDER_SUCCESS, GET_ORGANIZATION_GENDER_FAILURE } from "../Constants/organizationConstants";
import { GET_ORGANIZATION_AGE_GROUP_REQUEST, GET_ORGANIZATION_AGE_GROUP_SUCCESS, GET_ORGANIZATION_AGE_GROUP_FAILURE } from "../Constants/organizationConstants";
import { GET_ORGANIZATION_DashboardOverview_REQUEST, GET_ORGANIZATION_DashboardOverview_SUCCESS, GET_ORGANIZATION_DashboardOverview_FAILURE } from "../Constants/organizationConstants";
import { GET_ORGANIZATION_ATTRITION_TREND_REQUEST, GET_ORGANIZATION_ATTRITION_TREND_SUCCESS, GET_ORGANIZATION_ATTRITION_TREND_FAILURE } from "../Constants/organizationConstants";

const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const orgEmployeestatsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EMPLOYEESTATS_SUMMARY_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_EMPLOYEESTATS_SUMMARY_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_EMPLOYEESTATS_SUMMARY_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const PerformanceReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PERFORMANCE_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_PERFORMANCE_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_PERFORMANCE_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}
export const DailyAttendanceReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DAILYATTENDANCE_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_DAILYATTENDANCE_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_DAILYATTENDANCE_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

// ///////OLD////////////////

export const orgDepartmentReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORGANIZATION_DEPARTMENT_SUMMARY_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_ORGANIZATION_DEPARTMENT_SUMMARY_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_ORGANIZATION_DEPARTMENT_SUMMARY_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const orgDesignationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORGANIZATION_DESIGNATION_SUMMARY_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_ORGANIZATION_DESIGNATION_SUMMARY_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_ORGANIZATION_DESIGNATION_SUMMARY_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const orgGenderReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORGANIZATION_GENDER_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_ORGANIZATION_GENDER_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_ORGANIZATION_GENDER_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const orgAgeGroupReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORGANIZATION_AGE_GROUP_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_ORGANIZATION_AGE_GROUP_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_ORGANIZATION_AGE_GROUP_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const orgDashboardOverviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORGANIZATION_DashboardOverview_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_ORGANIZATION_DashboardOverview_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_ORGANIZATION_DashboardOverview_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const orgAttritionTrendReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORGANIZATION_ATTRITION_TREND_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_ORGANIZATION_ATTRITION_TREND_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_ORGANIZATION_ATTRITION_TREND_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const orgAdditionTrendReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORGANIZATION_ADDITION_TREND_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_ORGANIZATION_ADDITION_TREND_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_ORGANIZATION_ADDITION_TREND_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const orgHeadcountReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORGANIZATION_HEADCOUNT_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_ORGANIZATION_HEADCOUNT_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_ORGANIZATION_HEADCOUNT_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}