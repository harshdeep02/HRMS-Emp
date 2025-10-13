import { createPerformance, deletePerformance, fetchPerformanceDetails, fetchPerformanceList, sendApprovalApi, updateStatus } from "../../services/performance";
import { ADD_PERFORMANCE_FAILURE, ADD_PERFORMANCE_REQUEST, ADD_PERFORMANCE_SUCCESS, DELETE_PERFORMANCE_FAILURE, DELETE_PERFORMANCE_REQUEST, DELETE_PERFORMANCE_SUCCESS, GET_PERFORMANCE_DETAIL_FAILURE, GET_PERFORMANCE_DETAIL_REQUEST, GET_PERFORMANCE_DETAIL_SUCCESS, GET_PERFORMANCE_LIST_FAILURE, GET_PERFORMANCE_LIST_REQUEST, GET_PERFORMANCE_LIST_SUCCESS, SEND_FOR_APPROVAL_FAILURE, SEND_FOR_APPROVAL_REQUEST, SEND_FOR_APPROVAL_SUCCESS, UPDATE_PERFORMANCE_STATUS_FAILURE, UPDATE_PERFORMANCE_STATUS_REQUEST, UPDATE_PERFORMANCE_STATUS_SUCCESS } from "../Constants/performanceConstants";
import { toast } from "react-toastify";

export const createNewPerformance = (params) => async (dispatch) => {
    try {
        dispatch({ type: ADD_PERFORMANCE_REQUEST });
        const { data } = await createPerformance(params);
        const { message, status } = data;
        dispatch({
            type: ADD_PERFORMANCE_SUCCESS,
            payload: data,
        });
        console.log("data", data)
        if (status === 200) {
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
            return data
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
        dispatch({ type: ADD_PERFORMANCE_FAILURE, payload: error.message });
    }
};

export const getPerformanceList = (params) => async (dispatch) => {
    dispatch({ type: GET_PERFORMANCE_LIST_REQUEST });
    try {
        const response = await fetchPerformanceList(params);
        dispatch({ type: GET_PERFORMANCE_LIST_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        dispatch({ type: GET_PERFORMANCE_LIST_FAILURE, payload: error.message });
        throw error; 
    }
};

export const getPerformanceDetails = (params) => async (dispatch) => {
    dispatch({ type: GET_PERFORMANCE_DETAIL_REQUEST });
    try {
        const response = await fetchPerformanceDetails(params);
        dispatch({ type: GET_PERFORMANCE_DETAIL_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_PERFORMANCE_DETAIL_FAILURE, payload: error.message });
    }
};

export const deleteperformance = (params, navigate) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_PERFORMANCE_REQUEST });
        const { data } = await deletePerformance(params);
        const { message, success } = data;
        dispatch({
            type: DELETE_PERFORMANCE_SUCCESS,
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
            setTimeout(() => {
                navigate("/performance");
            }, 1500);
            return { success: true }
        } else {
            toast.error(message || "Error during Delete", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            // return { success: false }
        }
    } catch (error) {
        toast.error(error.message);
        dispatch({ type: DELETE_PERFORMANCE_FAILURE, payload: error.message });
    }
};

export const updatePerformanceStatus = (params) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PERFORMANCE_STATUS_REQUEST });
        const { data } = await updateStatus(params)
        const { message, success } = data;
        dispatch({
            type: UPDATE_PERFORMANCE_STATUS_SUCCESS,
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
        dispatch({ type: UPDATE_PERFORMANCE_STATUS_FAILURE, payload: error.message });
    }
};


export const SendApproval = (params) => async (dispatch) => {
    dispatch({ type: SEND_FOR_APPROVAL_REQUEST });
    try {
        const response = await sendApprovalApi(params);
        dispatch({ type: SEND_FOR_APPROVAL_SUCCESS, payload: response.data });
        console.log(response)
        if(response?.status){
            return response?.data
        }
    } catch (error) {
        dispatch({ type: SEND_FOR_APPROVAL_FAILURE, payload: error.message });
    }
};