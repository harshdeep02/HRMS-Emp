import { GET_APPRAISAL_LIST_FAILURE, GET_APPRAISAL_LIST_REQUEST, GET_APPRAISAL_LIST_SUCCESS, GET_MY_LEAVE_REPORT_FAILURE, GET_MY_LEAVE_REPORT_REQUEST, GET_MY_LEAVE_REPORT_SUCCESS, GET_MY_LEAVE_REPORT_YEARLY_FAILURE, GET_MY_LEAVE_REPORT_YEARLY_REQUEST, GET_MY_LEAVE_REPORT_YEARLY_SUCCESS, GET_MY_LEAVE_SUMMARY_FAILURE, GET_MY_LEAVE_SUMMARY_REQUEST, GET_MY_LEAVE_SUMMARY_SUCCESS } from "../../../Constants/report/myReport/reportsConstants";

const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const myLeaveReportReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_MY_LEAVE_REPORT_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_MY_LEAVE_REPORT_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_MY_LEAVE_REPORT_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const myLeaveReportYearlyReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_MY_LEAVE_REPORT_YEARLY_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_MY_LEAVE_REPORT_YEARLY_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_MY_LEAVE_REPORT_YEARLY_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const myLeaveSummaryReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_MY_LEAVE_SUMMARY_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_MY_LEAVE_SUMMARY_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_MY_LEAVE_SUMMARY_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const appraisalListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_APPRAISAL_LIST_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_APPRAISAL_LIST_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_APPRAISAL_LIST_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}