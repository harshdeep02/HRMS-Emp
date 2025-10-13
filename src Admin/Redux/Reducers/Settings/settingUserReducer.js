import { GET_USER_LIST_FAILURE, GET_USER_LIST_REQUEST, GET_USER_LIST_SUCCESS, SET_LOGIN_FAILURE, SET_LOGIN_REQUEST, SET_LOGIN_SUCCESS, SET_USER_ROLE_FAILURE, SET_USER_ROLE_REQUEST, SET_USER_ROLE_SUCCESS, UPDATE_USER_STATUS_FAILURE, UPDATE_USER_STATUS_REQUEST, UPDATE_USER_STATUS_SUCCESS } from "../../Constants/Settings/userConstant";

const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const setLoginReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOGIN_REQUEST:
            return { ...state, loading: true, error: null };
        case SET_LOGIN_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case SET_LOGIN_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const userListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USER_LIST_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_USER_LIST_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_USER_LIST_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const setUserRoleReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_ROLE_REQUEST:
            return { ...state, loading: true, error: null };
        case SET_USER_ROLE_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case SET_USER_ROLE_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const updateUserStatusReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_USER_STATUS_REQUEST:
            return { ...state, loading: true, error: null };
        case UPDATE_USER_STATUS_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case UPDATE_USER_STATUS_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}