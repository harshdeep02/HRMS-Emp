import { GET_WORK_CALENDAR_SUMMARY_FAILURE, GET_WORK_CALENDAR_SUMMARY_REQUEST, GET_WORK_CALENDAR_SUMMARY_SUCCESS, UPDATE_WORK_CALENDAR_STATUS_FAILURE, UPDATE_WORK_CALENDAR_STATUS_REQUEST, UPDATE_WORK_CALENDAR_STATUS_SUCCESS } from "../../Constants/Settings/leaveConstant";
const initialState = {
    loading: false,
    data: null,
    error: null,
};


export const workCalSummaryReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_WORK_CALENDAR_SUMMARY_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_WORK_CALENDAR_SUMMARY_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_WORK_CALENDAR_SUMMARY_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const workCalStatusReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_WORK_CALENDAR_STATUS_REQUEST:
            return { ...state, loading: true, error: null };
        case UPDATE_WORK_CALENDAR_STATUS_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case UPDATE_WORK_CALENDAR_STATUS_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}