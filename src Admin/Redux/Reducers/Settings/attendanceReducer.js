import {GET_ORG_SET_FAILURE, GET_ORG_SET_REQUEST, GET_ORG_SET_SUCCESS, UPDATE_ORG_SETT_FAILURE, UPDATE_ORG_SETT_REQUEST, UPDATE_ORG_SETT_SUCCESS } from "../../Constants/Settings/attendance";

const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const updateOrgSettReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ORG_SETT_REQUEST:
            return { ...state, loading: true, error: null };
        case UPDATE_ORG_SETT_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case UPDATE_ORG_SETT_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const orgSettDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORG_SET_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_ORG_SET_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_ORG_SET_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}