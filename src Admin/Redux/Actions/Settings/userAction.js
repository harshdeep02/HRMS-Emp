import { toast } from "react-toastify";
import { SET_LOGIN_REQUEST, SET_LOGIN_SUCCESS, SET_LOGIN_FAILURE, GET_USER_LIST_REQUEST, GET_USER_LIST_SUCCESS, GET_USER_LIST_FAILURE, SET_USER_ROLE_REQUEST, SET_USER_ROLE_SUCCESS, SET_USER_ROLE_FAILURE, UPDATE_USER_STATUS_REQUEST, UPDATE_USER_STATUS_SUCCESS, UPDATE_USER_STATUS_FAILURE } from "../../Constants/Settings/userConstant";
import { fetchUserList, loginEnableDisable, setUserLoginRole, updateUserStatusApi } from "../../../services/settings/user";

export const uerLoginEnableDisable = (params) => async (dispatch) => {
    try {
        dispatch({ type: SET_LOGIN_REQUEST });
        const { data } = await loginEnableDisable(params);
        const { message, status } = data;
        dispatch({
            type: SET_LOGIN_SUCCESS,
            payload: data,
        });
        if (status === 200) {
            toast.success(message || "Set login successfully.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return data;
        } else {
            toast.error(message || "Error during Set Login", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    } catch (error) {
        toast.error(error.message);
        dispatch({ type: SET_LOGIN_FAILURE, payload: error.message });
    }
};

export const getUserList = (params) => async (dispatch) => {
    dispatch({ type: GET_USER_LIST_REQUEST });
    try {
        const response = await fetchUserList(params);
        dispatch({ type: GET_USER_LIST_SUCCESS, payload: response.data });
        return response.data; // 👈 return response so caller can await it
    } catch (error) {
        dispatch({ type: GET_USER_LIST_FAILURE, payload: error.message });
        throw error; // 👈 throw so caller can catch it
    }
};

export const setUserRole = (params) => async (dispatch) => {
    try {
        dispatch({ type: SET_USER_ROLE_REQUEST });
        const { data } = await setUserLoginRole(params);
        const { message, status } = data;
        dispatch({
            type: SET_USER_ROLE_SUCCESS,
            payload: data,
        });
        if (status === 200) {
            toast.success(message || "Set Admin login successfully.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return data;
        } else {
            toast.error(message || "Error during Set Login", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    } catch (error) {
        toast.error(error.message);
        dispatch({ type: SET_USER_ROLE_FAILURE, payload: error.message });
    }
};



export const updateUserStatus = (params) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_USER_STATUS_REQUEST });
        const { data } = await updateUserStatusApi(params)
        const { message, success } = data;
        dispatch({
            type: UPDATE_USER_STATUS_SUCCESS,
            payload: data
        });
        if (success) {
            toast.success(message || 'Created successfully.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return { success: true };
        }
        else {
            toast.error(message || 'Error during create', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return { success: false };
        }
    } catch (error) {
        toast.error(error.message)
        dispatch({ type: UPDATE_USER_STATUS_FAILURE, payload: error.message });
    }
};