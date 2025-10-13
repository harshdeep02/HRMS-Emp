import { toast } from "react-toastify";
import { ADD_ORGANIZATION_FAILURE, ADD_ORGANIZATION_POLICY_FAILURE, ADD_ORGANIZATION_POLICY_REQUEST, ADD_ORGANIZATION_POLICY_SUCCESS, ADD_ORGANIZATION_REQUEST, ADD_ORGANIZATION_SUCCESS, ADD_WORK_LOCATION_FAILURE, ADD_WORK_LOCATION_REQUEST, ADD_WORK_LOCATION_SUCCESS, GET_ORGANIZATION_DETAIL_FAILURE, GET_ORGANIZATION_DETAIL_REQUEST, GET_ORGANIZATION_DETAIL_SUCCESS, GET_ORGANIZATION_LIST_FAILURE, GET_ORGANIZATION_LIST_REQUEST, GET_ORGANIZATION_LIST_SUCCESS, GET_WORK_LOCATION_DETAIL_FAILURE, GET_WORK_LOCATION_DETAIL_REQUEST, GET_WORK_LOCATION_DETAIL_SUCCESS, UPDATE_ORG_STATUS_FAILURE, UPDATE_ORG_STATUS_REQUEST, UPDATE_ORG_STATUS_SUCCESS } from "../../Constants/Settings/organizationConstant";
import { createOrganization, createOrganizationPolicy, createWorkLocationApi, fetchOrganizationDetails, fetchOrganizationList, fetchWorkLocationDetails, fetchWorkLocationList, updateOrgStatusApi } from "../../../services/settings/organization";
import { GET_WORK_LOCATION_LIST_FAILURE, GET_WORK_LOCATION_LIST_REQUEST, GET_WORK_LOCATION_LIST_SUCCESS } from "../../Constants/locationConstants";

export const createNewOrganization = (params) => async (dispatch) => {
    try {
        dispatch({ type: ADD_ORGANIZATION_REQUEST });
        const { data } = await createOrganization(params);
        const { message, status, success } = data;
        dispatch({
            type: ADD_ORGANIZATION_SUCCESS,
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
        dispatch({ type: ADD_ORGANIZATION_FAILURE, payload: error.message });
    }
};

export const getOrganizationDetails = (params) => async (dispatch) => {
    try {
        dispatch({ type: GET_ORGANIZATION_DETAIL_REQUEST });
        const response = await fetchOrganizationDetails(params);
        dispatch({
            type: GET_ORGANIZATION_DETAIL_SUCCESS,
            payload: response?.data,
        });
        return response.data;
    } catch (error) {
        toast.error(error.message);
        dispatch({ type: GET_ORGANIZATION_DETAIL_FAILURE, payload: error.message });
    }
};
export const getOrganizationList = (params) => async (dispatch) => {
    try {
        dispatch({ type: GET_ORGANIZATION_LIST_REQUEST });
        const response = await fetchOrganizationList(params);
        dispatch({
            type: GET_ORGANIZATION_LIST_SUCCESS,
            payload: response?.data,
        });
        return response.data;
    } catch (error) {
        toast.error(error.message);
        dispatch({ type: GET_ORGANIZATION_LIST_FAILURE, payload: error.message });
    }
};

export const createOrgPolicy = (params) => async (dispatch) => {
    try {
        dispatch({ type: ADD_ORGANIZATION_POLICY_REQUEST });
        const { data } = await createOrganizationPolicy(params);
        const { message, status, success } = data;
        dispatch({
            type: ADD_ORGANIZATION_POLICY_SUCCESS,
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
        dispatch({ type: ADD_ORGANIZATION_POLICY_FAILURE, payload: error.message });
    }
};

export const getWorkLocList = (params) => async (dispatch) => {
    try {
        dispatch({ type: GET_WORK_LOCATION_LIST_REQUEST });
        const response = await fetchWorkLocationList(params);
        dispatch({
            type: GET_WORK_LOCATION_LIST_SUCCESS,
            payload: response?.data,
        });
        return response.data;
    } catch (error) {
        toast.error(error.message);
        dispatch({ type: GET_WORK_LOCATION_LIST_FAILURE, payload: error.message });
    }
};

export const getWorkLocDetails = (params) => async (dispatch) => {
    try {
        dispatch({ type: GET_WORK_LOCATION_DETAIL_REQUEST });
        const response = await fetchWorkLocationDetails(params);
        dispatch({
            type: GET_WORK_LOCATION_DETAIL_SUCCESS,
            payload: response?.data,
        });
        return response.data;
    } catch (error) {
        toast.error(error.message);
        dispatch({ type: GET_WORK_LOCATION_DETAIL_FAILURE, payload: error.message });
    }
};


export const createWorkLocation = (params) => async (dispatch) => {
    try {
        dispatch({ type: ADD_WORK_LOCATION_REQUEST });
        const response = await createWorkLocationApi(params);
        dispatch({
            type: ADD_WORK_LOCATION_SUCCESS,
            payload: response?.data,
        });
         if (response?.status) {
            toast.success(response?.data?.message || "Created successfully.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return response?.data;
        } else {
            toast.error(response?.data?.message || "Error during Create", {
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
        dispatch({ type: ADD_WORK_LOCATION_FAILURE, payload: error.message });
    }
};

export const updateOrgStatus = (params) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_ORG_STATUS_REQUEST });
        const { data } = await updateOrgStatusApi(params)
        const { message, success } = data;
        dispatch({
            type: UPDATE_ORG_STATUS_SUCCESS,
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
        dispatch({ type: UPDATE_ORG_STATUS_FAILURE, payload: error.message });
    }
};