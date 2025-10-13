import { toast } from "react-toastify";
import { createNewMaster, fetchMasterstList, updateMasterOption } from "../../../services/settings/masters";
import { ADD_NEW_MASTER_FAILURE, ADD_NEW_MASTER_REQUEST, ADD_NEW_MASTER_SUCCESS, EDIT_MASTER_FAILURE, EDIT_MASTER_REQUEST, EDIT_MASTER_SUCCESS, GET_MASTER_LIST_FAILURE, GET_MASTER_LIST_REQUEST, GET_MASTER_LIST_SUCCESS } from "../../Constants/Settings/masterConstants";

export const createUpdateMaster = (params) => async (dispatch) => {
    try {
        dispatch({ type: ADD_NEW_MASTER_REQUEST });
        const { data } = await createNewMaster(params);
        const { message, status, success } = data;
        dispatch({
            type: ADD_NEW_MASTER_SUCCESS,
            payload: data,
        });
        if (success) {
            toast.success(message || "Created successfully.", {
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
            toast.error(message || "Error during Create", {
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
        dispatch({ type: ADD_NEW_MASTER_FAILURE, payload: error.message });
    }
};

export const getMasterList = (params) => async (dispatch) => {
    dispatch({ type: GET_MASTER_LIST_REQUEST });
    try {
        const response = await fetchMasterstList(params);
        dispatch({ type: GET_MASTER_LIST_SUCCESS, payload: response?.data });
        return response.data;
    } catch (error) {
        dispatch({ type: GET_MASTER_LIST_FAILURE, payload: error.message });
        throw error; 
    }
};

export const editMasterOption = (params) => async (dispatch) => {
    dispatch({ type: EDIT_MASTER_REQUEST });
    try {
        const response = await updateMasterOption(params);
        const { message, status, success } = response.data;      
        dispatch({
            type: EDIT_MASTER_SUCCESS,
            payload: response.data,
        });
        if (success) {
            toast.success(message);
            return response.data;
        } else {
            toast.error(message);
        }
    } catch (error) {
        dispatch({ type: EDIT_MASTER_FAILURE, payload: error.message });
    }
};