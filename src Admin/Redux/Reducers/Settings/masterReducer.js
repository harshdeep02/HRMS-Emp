import { ADD_NEW_MASTER_FAILURE, ADD_NEW_MASTER_REQUEST, ADD_NEW_MASTER_SUCCESS, EDIT_MASTER_FAILURE, EDIT_MASTER_REQUEST, EDIT_MASTER_SUCCESS, GET_MASTER_LIST_FAILURE, GET_MASTER_LIST_REQUEST, GET_MASTER_LIST_SUCCESS } from "../../Constants/Settings/masterConstants";

const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const createUpdateMasterReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_NEW_MASTER_REQUEST:
            return { ...state, loading: true, error: null };
        case ADD_NEW_MASTER_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case ADD_NEW_MASTER_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const masterListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_MASTER_LIST_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_MASTER_LIST_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_MASTER_LIST_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const editMasterReducer = (state = initialState, action) => {
    switch (action.type) {
        case EDIT_MASTER_REQUEST:
            return { ...state, loading: true, error: null };
        case EDIT_MASTER_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case EDIT_MASTER_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}
