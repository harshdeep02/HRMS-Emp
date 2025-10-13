import { ADD_QUICK_LINK_FAILURE, ADD_QUICK_LINK_REQUEST, ADD_QUICK_LINK_SUCCESS, DELETE_QUICK_LINK_FAILURE, DELETE_QUICK_LINK_REQUEST, DELETE_QUICK_LINK_SUCCESS, GET_EMP_ATTENDANCE_OVERVIEW_FAILURE, GET_EMP_ATTENDANCE_OVERVIEW_REQUEST, GET_EMP_ATTENDANCE_OVERVIEW_SUCCESS, GET_EMPLOYEE_STATS_FAILURE, GET_EMPLOYEE_STATS_REQUEST, GET_EMPLOYEE_STATS_SUCCESS, GET_LEAVE_REPORT_FAILURE, GET_LEAVE_REPORT_REQUEST, GET_LEAVE_REPORT_SUCCESS, GET_NEW_EMP_LIST_FAILURE, GET_NEW_EMP_LIST_REQUEST, GET_NEW_EMP_LIST_SUCCESS, GET_QUICK_LINK_DETAIL_FAILURE, GET_QUICK_LINK_DETAIL_REQUEST, GET_QUICK_LINK_DETAIL_SUCCESS, GET_QUICK_LINK_LIST_FAILURE, GET_QUICK_LINK_LIST_REQUEST, GET_QUICK_LINK_LIST_SUCCESS } from "../Constants/dashboardConstant";

const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const employeeStatsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EMPLOYEE_STATS_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_EMPLOYEE_STATS_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_EMPLOYEE_STATS_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const empAttendanceOverviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EMP_ATTENDANCE_OVERVIEW_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_EMP_ATTENDANCE_OVERVIEW_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_EMP_ATTENDANCE_OVERVIEW_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const newEmployeeListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_NEW_EMP_LIST_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_NEW_EMP_LIST_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_NEW_EMP_LIST_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const leaveReportReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_LEAVE_REPORT_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_LEAVE_REPORT_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_LEAVE_REPORT_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const createQuickLinkReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_QUICK_LINK_REQUEST:
            return { ...state, loading: true, error: null };
        case ADD_QUICK_LINK_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case ADD_QUICK_LINK_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}
export const quickLinksListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_QUICK_LINK_LIST_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_QUICK_LINK_LIST_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_QUICK_LINK_LIST_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const quickLinkDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_QUICK_LINK_DETAIL_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_QUICK_LINK_DETAIL_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_QUICK_LINK_DETAIL_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const deleteQuickLinkReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_QUICK_LINK_REQUEST:
            return { ...state, loading: true, error: null };
        case DELETE_QUICK_LINK_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case DELETE_QUICK_LINK_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}