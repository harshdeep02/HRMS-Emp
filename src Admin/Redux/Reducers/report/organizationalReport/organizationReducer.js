import { GET_EMPLOYEE_ATTRITION_FAILURE, GET_EMPLOYEE_ATTRITION_REQUEST, GET_EMPLOYEE_ATTRITION_SUCCESS, GET_LEAVE_TRACKER_FAILURE, GET_LEAVE_TRACKER_REQUEST, GET_LEAVE_TRACKER_SUCCESS } from "../../../Constants/report/organizationalReport/organizationConstant";

const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const LeaveTrackerReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_LEAVE_TRACKER_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_LEAVE_TRACKER_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_LEAVE_TRACKER_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}
export const EmployeeAttritionReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EMPLOYEE_ATTRITION_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_EMPLOYEE_ATTRITION_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_EMPLOYEE_ATTRITION_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}