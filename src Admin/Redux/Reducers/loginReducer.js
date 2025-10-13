import { ADD_ATTENDANCE_PUNCH_FAILURE, ADD_ATTENDANCE_PUNCH_REQUEST, ADD_ATTENDANCE_PUNCH_SUCCESS, GET_TODAY_ATTENDANCE_DETAIL_FAILURE, GET_TODAY_ATTENDANCE_DETAIL_REQUEST, GET_TODAY_ATTENDANCE_DETAIL_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS } from "../Constants/loginConstants";

const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return { ...state, loading: true, error: null };
        case LOGIN_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case LOGIN_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const attendancePunchReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ATTENDANCE_PUNCH_REQUEST:
            return { ...state, loading: true, error: null };
        case ADD_ATTENDANCE_PUNCH_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case ADD_ATTENDANCE_PUNCH_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const todayAttendanceDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_TODAY_ATTENDANCE_DETAIL_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_TODAY_ATTENDANCE_DETAIL_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_TODAY_ATTENDANCE_DETAIL_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}