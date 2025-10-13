import { fetchDepartmentList } from "../../services/department";
import { getUserByIdApi } from "../../services/globalApi";
import { GET_USER_BY_ID_FAILURE, GET_USER_BY_ID_REQUEST, GET_USER_BY_ID_SUCCESS, FETCH_ALL_DEPARTMENT_LIST_REQUEST, FETCH_ALL_DEPARTMENT_LIST_SUCCESS, FETCH_ALL_DEPARTMENT_LIST_FAILURE } from "../Constants/globalConstants";

export const getUserById = (params) => async (dispatch) => {
    dispatch({ type: GET_USER_BY_ID_REQUEST });
    try {
        const response = await getUserByIdApi(params);
        dispatch({ type: GET_USER_BY_ID_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_USER_BY_ID_FAILURE, payload: error.message });
    }
};

export const fetchAllDepartments = () => {
    return async (dispatch) => {
        dispatch({ type: FETCH_ALL_DEPARTMENT_LIST_REQUEST });
        try {
            const response = await fetchDepartmentList();
            dispatch({ type: FETCH_ALL_DEPARTMENT_LIST_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: FETCH_ALL_DEPARTMENT_LIST_FAILURE, payload: error.message });
        }
    };
};