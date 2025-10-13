import { GET_WORK_LOCATION_LIST_FAILURE, GET_WORK_LOCATION_LIST_REQUEST, GET_WORK_LOCATION_LIST_SUCCESS } from "../../Constants/locationConstants";
import { ADD_ORGANIZATION_FAILURE, ADD_ORGANIZATION_POLICY_FAILURE, ADD_ORGANIZATION_POLICY_REQUEST, ADD_ORGANIZATION_POLICY_SUCCESS, ADD_ORGANIZATION_REQUEST, ADD_ORGANIZATION_SUCCESS, ADD_WORK_LOCATION_FAILURE, ADD_WORK_LOCATION_REQUEST, ADD_WORK_LOCATION_SUCCESS, GET_ORGANIZATION_DETAIL_FAILURE, GET_ORGANIZATION_DETAIL_REQUEST, GET_ORGANIZATION_DETAIL_SUCCESS, GET_ORGANIZATION_LIST_FAILURE, GET_ORGANIZATION_LIST_REQUEST, GET_ORGANIZATION_LIST_SUCCESS, GET_WORK_LOCATION_DETAIL_FAILURE, GET_WORK_LOCATION_DETAIL_REQUEST, GET_WORK_LOCATION_DETAIL_SUCCESS, UPDATE_ORG_STATUS_FAILURE, UPDATE_ORG_STATUS_REQUEST, UPDATE_ORG_STATUS_SUCCESS } from "../../Constants/Settings/organizationConstant";

const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const createOrganizationReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ORGANIZATION_REQUEST:
            return { ...state, loading: true, error: null };
        case ADD_ORGANIZATION_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case ADD_ORGANIZATION_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}
export const organizationDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORGANIZATION_DETAIL_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_ORGANIZATION_DETAIL_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_ORGANIZATION_DETAIL_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}
export const organizationListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORGANIZATION_LIST_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_ORGANIZATION_LIST_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_ORGANIZATION_LIST_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const createPolicyReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ORGANIZATION_POLICY_REQUEST:
            return { ...state, loading: true, error: null };
        case ADD_ORGANIZATION_POLICY_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case ADD_ORGANIZATION_POLICY_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}
export const WorkLocListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_WORK_LOCATION_LIST_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_WORK_LOCATION_LIST_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_WORK_LOCATION_LIST_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const WorkLocDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_WORK_LOCATION_DETAIL_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_WORK_LOCATION_DETAIL_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_WORK_LOCATION_DETAIL_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const createWorkLocReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_WORK_LOCATION_REQUEST:
            return { ...state, loading: true, error: null };
        case ADD_WORK_LOCATION_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case ADD_WORK_LOCATION_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const updateOrgStatusReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ORG_STATUS_REQUEST:
            return { ...state, loading: true, error: null };
        case UPDATE_ORG_STATUS_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case UPDATE_ORG_STATUS_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}