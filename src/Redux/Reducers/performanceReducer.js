import { ADD_PERFORMANCE_FAILURE, ADD_PERFORMANCE_REQUEST, ADD_PERFORMANCE_SUCCESS, DELETE_PERFORMANCE_FAILURE, DELETE_PERFORMANCE_REQUEST, DELETE_PERFORMANCE_SUCCESS, GET_PERFORMANCE_DETAIL_FAILURE, GET_PERFORMANCE_DETAIL_REQUEST, GET_PERFORMANCE_DETAIL_SUCCESS, GET_PERFORMANCE_LIST_FAILURE, GET_PERFORMANCE_LIST_REQUEST, GET_PERFORMANCE_LIST_SUCCESS, SEND_FOR_APPROVAL_FAILURE, SEND_FOR_APPROVAL_REQUEST, SEND_FOR_APPROVAL_SUCCESS, UPDATE_PERFORMANCE_STATUS_FAILURE, UPDATE_PERFORMANCE_STATUS_REQUEST, UPDATE_PERFORMANCE_STATUS_SUCCESS } from "../Constants/performanceConstants";


const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const createPerformanceReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PERFORMANCE_REQUEST:
            return { ...state, loading: true, error: null };
        case ADD_PERFORMANCE_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case ADD_PERFORMANCE_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}
export const performanceListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PERFORMANCE_LIST_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_PERFORMANCE_LIST_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_PERFORMANCE_LIST_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const performanceDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PERFORMANCE_DETAIL_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_PERFORMANCE_DETAIL_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_PERFORMANCE_DETAIL_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const updatePerformanceStatusReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PERFORMANCE_STATUS_REQUEST:
            return { ...state, loading: true, error: null };
        case UPDATE_PERFORMANCE_STATUS_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case UPDATE_PERFORMANCE_STATUS_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const deletePerformanceReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_PERFORMANCE_REQUEST:
            return { ...state, loading: true, error: null };
        case DELETE_PERFORMANCE_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case DELETE_PERFORMANCE_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}


export const sendForApprovalReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEND_FOR_APPROVAL_REQUEST:
            return { ...state, loading: true, error: null };
        case SEND_FOR_APPROVAL_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case SEND_FOR_APPROVAL_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}