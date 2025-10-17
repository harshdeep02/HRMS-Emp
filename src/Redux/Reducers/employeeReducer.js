import { ADD_EMPLOYEE_FAILURE, ADD_EMPLOYEE_REQUEST, ADD_EMPLOYEE_SUCCESS, DELETE_EMPLOYEE_FAILURE, DELETE_EMPLOYEE_REQUEST, DELETE_EMPLOYEE_SUCCESS, GET_EMPLOYEE_LIST_FAILURE, GET_EMPLOYEE_LIST_REQUEST, GET_EMPLOYEE_LIST_SUCCESS, UPDATE_EMPLOYEE_STATUS_FAILURE, UPDATE_EMPLOYEE_STATUS_REQUEST, UPDATE_EMPLOYEE_STATUS_SUCCESS, GET_EMPLOYEE_DETAIL_FAILURE, GET_EMPLOYEE_DETAIL_REQUEST, GET_EMPLOYEE_DETAIL_SUCCESS, ADD_EMP_ADDRESS_REQUEST, ADD_EMP_ADDRESS_SUCCESS, ADD_EMP_ADDRESS_FAILURE, ADD_EMP_EXPERIENCE_REQUEST, ADD_EMP_EXPERIENCE_SUCCESS, ADD_EMP_EXPERIENCE_FAILURE, DELETE_EMP_EXPERIENCE_REQUEST, DELETE_EMP_EXPERIENCE_FAILURE, DELETE_EMP_EXPERIENCE_SUCCESS, DELETE_EMP_EDUCATION_REQUEST, DELETE_EMP_EDUCATION_SUCCESS, DELETE_EMP_EDUCATION_FAILURE, DELETE_EMP_DOCUMENT_REQUEST, DELETE_EMP_DOCUMENT_FAILURE, DELETE_EMP_DOCUMENT_SUCCESS, DELETE_EMP_REMARK_REQUEST, DELETE_EMP_REMARK_FAILURE, DELETE_EMP_REMARK_SUCCESS, ADD_EMP_EDUCATION_REQUEST, ADD_EMP_EDUCATION_FAILURE, ADD_EMP_EDUCATION_SUCCESS, ADD_EMP_DOCUMENT_REQUEST, ADD_EMP_DOCUMENT_SUCCESS, ADD_EMP_DOCUMENT_FAILURE, ADD_EMP_REMARK_REQUEST, ADD_EMP_REMARK_SUCCESS, ADD_EMP_REMARK_FAILURE, GET_EMP_BIRTHDAY_LIST_REQUEST, GET_EMP_BIRTHDAY_LIST_SUCCESS, GET_EMP_BIRTHDAY_LIST_FAILURE, IMPORT_EMP_DATA_REQUEST, IMPORT_EMP_DATA_SUCCESS, IMPORT_EMP_DATA_FAILURE, GET_REMARK_LIST_REQUEST, GET_REMARK_LIST_SUCCESS, GET_REMARK_LIST_FAILURE } from "../Constants/employeeConstants";

const initialState = {
    loading: false,
    data: null,
    error: null,
};

export const createEmployeeReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_EMPLOYEE_REQUEST:
            return { ...state, loading: true, error: null };
        case ADD_EMPLOYEE_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case ADD_EMPLOYEE_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const createEmpAddressReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_EMP_ADDRESS_REQUEST:
            return { ...state, loading: true, error: null };
        case ADD_EMP_ADDRESS_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case ADD_EMP_ADDRESS_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const createEmpExperienceReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_EMP_EXPERIENCE_REQUEST:
            return { ...state, loading: true, error: null };
        case ADD_EMP_EXPERIENCE_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case ADD_EMP_EXPERIENCE_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const createEmpEducationReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_EMP_EDUCATION_REQUEST:
            return { ...state, loading: true, error: null };
        case ADD_EMP_EDUCATION_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case ADD_EMP_EDUCATION_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const createEmpDocumentReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_EMP_DOCUMENT_REQUEST:
            return { ...state, loading: true, error: null };
        case ADD_EMP_DOCUMENT_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case ADD_EMP_DOCUMENT_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const createEmpRemarkReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_EMP_REMARK_REQUEST:
            return { ...state, loading: true, error: null };
        case ADD_EMP_REMARK_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case ADD_EMP_REMARK_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const employeeListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EMPLOYEE_LIST_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_EMPLOYEE_LIST_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_EMPLOYEE_LIST_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}
export const remarkListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_REMARK_LIST_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_REMARK_LIST_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_REMARK_LIST_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const empBirthdayListReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EMP_BIRTHDAY_LIST_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_EMP_BIRTHDAY_LIST_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_EMP_BIRTHDAY_LIST_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const updateEmployeeStatusReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_EMPLOYEE_STATUS_REQUEST:
            return { ...state, loading: true, error: null };
        case UPDATE_EMPLOYEE_STATUS_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case UPDATE_EMPLOYEE_STATUS_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const deleteEmployeeReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_EMPLOYEE_REQUEST:
            return { ...state, loading: true, error: null };
        case DELETE_EMPLOYEE_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case DELETE_EMPLOYEE_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const deleteEmpExperienceReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_EMP_EXPERIENCE_REQUEST:
            return { ...state, loading: true, error: null };
        case DELETE_EMP_EXPERIENCE_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case DELETE_EMP_EXPERIENCE_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const deleteEmpEducationReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_EMP_EDUCATION_REQUEST:
            return { ...state, loading: true, error: null };
        case DELETE_EMP_EDUCATION_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case DELETE_EMP_EDUCATION_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const deleteEmpDocReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_EMP_DOCUMENT_REQUEST:
            return { ...state, loading: true, error: null };
        case DELETE_EMP_DOCUMENT_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case DELETE_EMP_DOCUMENT_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const deleteEmpRemarkReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_EMP_REMARK_REQUEST:
            return { ...state, loading: true, error: null };
        case DELETE_EMP_REMARK_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case DELETE_EMP_REMARK_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const employeeDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EMPLOYEE_DETAIL_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_EMPLOYEE_DETAIL_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case GET_EMPLOYEE_DETAIL_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}

export const importEmpReducer = (state = initialState, action) => {
    switch (action.type) {
        case IMPORT_EMP_DATA_REQUEST:
            return { ...state, loading: true, error: null };
        case IMPORT_EMP_DATA_SUCCESS:
            return { ...state, loading: false, error: null, data: action.payload }
        case IMPORT_EMP_DATA_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default: return state;
    }
}