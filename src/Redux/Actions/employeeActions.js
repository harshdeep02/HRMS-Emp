import { addImportedData, createEmpAddress, createEmpDocument, createEmpEducation, createEmpExperience, createEmployee, createEmpRemarks, deleteEmpDocument, deleteEmpEducation, deleteEmpExperience, deleteEmployeeApi, deleteEmpRemark, fetchBirthdayList, fetchEmployeeDetails, fetchEmployeeList, updateStatus } from "../../services/employee";
import { ADD_EMP_ADDRESS_FAILURE, ADD_EMP_ADDRESS_REQUEST, ADD_EMP_ADDRESS_SUCCESS, ADD_EMP_DOCUMENT_FAILURE, ADD_EMP_DOCUMENT_REQUEST, ADD_EMP_DOCUMENT_SUCCESS, ADD_EMP_EDUCATION_FAILURE, ADD_EMP_EDUCATION_REQUEST, ADD_EMP_EDUCATION_SUCCESS, ADD_EMP_EXPERIENCE_FAILURE, ADD_EMP_EXPERIENCE_REQUEST, ADD_EMP_EXPERIENCE_SUCCESS, ADD_EMP_REMARK_FAILURE, ADD_EMP_REMARK_REQUEST, ADD_EMP_REMARK_SUCCESS, ADD_EMPLOYEE_FAILURE, ADD_EMPLOYEE_REQUEST, ADD_EMPLOYEE_SUCCESS, DELETE_EMP_DOCUMENT_FAILURE, DELETE_EMP_DOCUMENT_REQUEST, DELETE_EMP_DOCUMENT_SUCCESS, DELETE_EMP_EDUCATION_FAILURE, DELETE_EMP_EDUCATION_REQUEST, DELETE_EMP_EDUCATION_SUCCESS, DELETE_EMP_EXPERIENCE_FAILURE, DELETE_EMP_EXPERIENCE_REQUEST, DELETE_EMP_EXPERIENCE_SUCCESS, DELETE_EMP_REMARK_FAILURE, DELETE_EMP_REMARK_REQUEST, DELETE_EMP_REMARK_SUCCESS, DELETE_EMPLOYEE_FAILURE, DELETE_EMPLOYEE_REQUEST, DELETE_EMPLOYEE_SUCCESS, GET_EMP_BIRTHDAY_LIST_FAILURE, GET_EMP_BIRTHDAY_LIST_REQUEST, GET_EMP_BIRTHDAY_LIST_SUCCESS, GET_EMPLOYEE_DETAIL_FAILURE, GET_EMPLOYEE_DETAIL_REQUEST, GET_EMPLOYEE_DETAIL_SUCCESS, GET_EMPLOYEE_LIST_FAILURE, GET_EMPLOYEE_LIST_REQUEST, GET_EMPLOYEE_LIST_SUCCESS, IMPORT_EMP_DATA_FAILURE, IMPORT_EMP_DATA_REQUEST, IMPORT_EMP_DATA_SUCCESS, UPDATE_EMPLOYEE_STATUS_FAILURE, UPDATE_EMPLOYEE_STATUS_REQUEST, UPDATE_EMPLOYEE_STATUS_SUCCESS } from "../Constants/employeeConstants";
import { toast } from "react-toastify";

export const createNewEmployee = (params) => async (dispatch) => {
    try {
        dispatch({ type: ADD_EMPLOYEE_REQUEST });
        const { data } = await createEmployee(params);
        console.log("data", data);

        const { message, status } = data;
        dispatch({
            type: ADD_EMPLOYEE_SUCCESS,
            payload: data,
        });
        if (status) {
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
        dispatch({ type: ADD_EMPLOYEE_FAILURE, payload: error.message });
    }
};

export const addEmpAddress = (params) => async (dispatch) => {
    try {
        dispatch({ type: ADD_EMP_ADDRESS_REQUEST });
        const { data } = await createEmpAddress(params);
        const { message, status } = data;
        dispatch({
            type: ADD_EMP_ADDRESS_SUCCESS,
            payload: data,
        });
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
        dispatch({ type: ADD_EMP_ADDRESS_FAILURE, payload: error.message });
    }
};

export const addEmpExperience = (params) => async (dispatch) => {
    try {
        dispatch({ type: ADD_EMP_EXPERIENCE_REQUEST });
        const { data } = await createEmpExperience(params);
        const { message, status, success } = data;
        dispatch({
            type: ADD_EMP_EXPERIENCE_SUCCESS,
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
        dispatch({ type: ADD_EMP_EXPERIENCE_FAILURE, payload: error.message });
    }
};

export const addEmpEducation = (params) => async (dispatch) => {
    try {
        dispatch({ type: ADD_EMP_EDUCATION_REQUEST });
        const { data } = await createEmpEducation(params);
        const { message, status, success } = data;
        dispatch({
            type: ADD_EMP_EDUCATION_SUCCESS,
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
        dispatch({ type: ADD_EMP_EDUCATION_FAILURE, payload: error.message });
    }
};

export const addEmpDocument = (params) => async (dispatch) => {
    try {
        dispatch({ type: ADD_EMP_DOCUMENT_REQUEST });
        const { data } = await createEmpDocument(params);
        const { message, status, success } = data;
        dispatch({
            type: ADD_EMP_DOCUMENT_SUCCESS,
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
        dispatch({ type: ADD_EMP_DOCUMENT_FAILURE, payload: error.message });
    }
};

export const addEmpRemark = (params) => async (dispatch) => {
    try {
        dispatch({ type: ADD_EMP_REMARK_REQUEST });
        const { data } = await createEmpRemarks(params);
        const { message, status, success } = data;
        dispatch({
            type: ADD_EMP_REMARK_SUCCESS,
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
        dispatch({ type: ADD_EMP_REMARK_FAILURE, payload: error.message });
    }
};

export const getEmployeeList = (params) => async (dispatch) => {
    dispatch({ type: GET_EMPLOYEE_LIST_REQUEST });
    try {
        const response = await fetchEmployeeList(params);
        dispatch({ type: GET_EMPLOYEE_LIST_SUCCESS, payload: response.data });
        return response.data; // 👈 return response so caller can await it
    } catch (error) {
        dispatch({ type: GET_EMPLOYEE_LIST_FAILURE, payload: error.message });
        throw error; // 👈 throw so caller can catch it
    }
};

export const getEmpBirthdayList = (params) => async (dispatch) => {
    dispatch({ type: GET_EMP_BIRTHDAY_LIST_REQUEST });
    try {
        const response = await fetchBirthdayList(params);
        dispatch({ type: GET_EMP_BIRTHDAY_LIST_SUCCESS, payload: response.data });
        return response.data; // 👈 return response so caller can await it
    } catch (error) {
        dispatch({ type: GET_EMP_BIRTHDAY_LIST_FAILURE, payload: error.message });
        throw error; // 👈 throw so caller can catch it
    }
};

export const getEmployeeDetails = (params) => async (dispatch) => {
    dispatch({ type: GET_EMPLOYEE_DETAIL_REQUEST });
    try {
        const response = await fetchEmployeeDetails(params);
        dispatch({ type: GET_EMPLOYEE_DETAIL_SUCCESS, payload: response.data });
        return response
    } catch (error) {
        dispatch({ type: GET_EMPLOYEE_DETAIL_FAILURE, payload: error.message });
    }
};

export const deleteEmployee = (params, navigate) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_EMPLOYEE_REQUEST });
        const { data } = await deleteEmployeeApi(params);
        const { message, success } = data;
        dispatch({
            type: DELETE_EMPLOYEE_SUCCESS,
            payload: data,
        });
        if (success) {
            toast.success(message || "Deleted successfully.", {
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
                navigate("/employee-list");
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
        dispatch({ type: DELETE_EMPLOYEE_FAILURE, payload: error.message });
    }
};

export const removeEmpExperience = (params) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_EMP_EXPERIENCE_REQUEST });
        const { data } = await deleteEmpExperience(params);
        const { message, success } = data;
        dispatch({
            type: DELETE_EMP_EXPERIENCE_SUCCESS,
            payload: data,
        });
        if (success) {
            toast.success(message || "Deleted successfully.", {
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
        dispatch({ type: DELETE_EMP_EXPERIENCE_FAILURE, payload: error.message });
    }
};

export const removeEmpEducation = (params) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_EMP_EDUCATION_REQUEST });
        const { data } = await deleteEmpEducation(params);
        const { message, success } = data;
        dispatch({
            type: DELETE_EMP_EDUCATION_SUCCESS,
            payload: data,
        });
        if (success) {
            toast.success(message || "Deleted successfully.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            // setTimeout(() => {
            //     navigate("/employee-list");
            // }, 1500);
            return data;
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
        dispatch({ type: DELETE_EMP_EDUCATION_FAILURE, payload: error.message });
    }
};

export const removeEmpDocument = (params) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_EMP_DOCUMENT_REQUEST });
        const { data } = await deleteEmpDocument(params);
        const { message, success } = data;
        dispatch({
            type: DELETE_EMP_DOCUMENT_SUCCESS,
            payload: data,
        });
        if (success) {
            toast.success(message || "Deleted successfully.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            // setTimeout(() => {
            //     navigate("/employee-list");
            // }, 1500);
            return data;
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
        dispatch({ type: DELETE_EMP_DOCUMENT_FAILURE, payload: error.message });
    }
};

export const removeEmpRemark = (params) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_EMP_REMARK_REQUEST });
        const { data } = await deleteEmpRemark(params);
        const { message, success } = data;
        dispatch({
            type: DELETE_EMP_REMARK_SUCCESS,
            payload: data,
        });
        if (success) {
            toast.success(message || "Deleted successfully.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            // setTimeout(() => {
            //     navigate("/employee-list");
            // }, 1500);
            return data;
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
        dispatch({ type: DELETE_EMP_REMARK_FAILURE, payload: error.message });
    }
};

export const updateEmployeeStatus = (params) => async (dispatch) => {

    try {
        dispatch({ type: UPDATE_EMPLOYEE_STATUS_REQUEST });
        const { data } = await updateStatus(params)
        const { message, success } = data;
        dispatch({
            type: UPDATE_EMPLOYEE_STATUS_SUCCESS,
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
        dispatch({ type: UPDATE_EMPLOYEE_STATUS_FAILURE, payload: error.message });
    }
};

export const importEmployees = (file) => async (dispatch) => {
    try {
        dispatch({ type: IMPORT_EMP_DATA_REQUEST });
        const { data } = await addImportedData(file);
        const { message, status, success } = data;
        dispatch({
            type: IMPORT_EMP_DATA_SUCCESS,
            payload: data,
        });
        if (status) {
            toast.success(message);
            //  || "Created successfully.", {
            //     position: "top-right",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "light",
            // });
            return data;
        } else {
            toast.error(message);
            // || "Error during Create", {
            //     position: "top-right",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "light",
            // });
        }
    } catch (error) {
        toast.error(error.message);
        dispatch({ type: IMPORT_EMP_DATA_FAILURE, payload: error.message });
    }
};
