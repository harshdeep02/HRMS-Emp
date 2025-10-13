import { toast } from "react-toastify";
import { GET_ORG_SET_FAILURE, GET_ORG_SET_REQUEST, GET_ORG_SET_SUCCESS, UPDATE_ORG_SETT_FAILURE, UPDATE_ORG_SETT_REQUEST, UPDATE_ORG_SETT_SUCCESS } from "../../Constants/Settings/attendance";
import { getAttendanceMethodsApi, updateAttendanceMethodsApi } from "../../../services/settings/attendance";

export const updateOrgSett = (params) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_ORG_SETT_REQUEST });
        const { data } = await updateAttendanceMethodsApi(params)
        const { message, success } = data;
        dispatch({
            type: UPDATE_ORG_SETT_SUCCESS,
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
            return data;
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
        dispatch({ type: UPDATE_ORG_SETT_FAILURE, payload: error.message });
    }
};


export const getOrgSett = (params) => async (dispatch) => {
    try {
        dispatch({ type: GET_ORG_SET_REQUEST });
        const { data } = await getAttendanceMethodsApi(params)
        const { message, success } = data;
        dispatch({
            type: GET_ORG_SET_SUCCESS,
            payload: data
        });
        if (success) {
            return data;
        }
        else {
            return { success: false };
        }
    } catch (error) {
        toast.error(error.message)
        dispatch({ type: GET_ORG_SET_FAILURE, payload: error.message });
    }
};