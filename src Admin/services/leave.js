import { apiController } from '../configs/apiController';
import { objectToQueryString } from '../utils/helper';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const createLeave = async (data) => {
    try {
        const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/leave/create/update`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: data
        };
        const request = apiController(config);
        return request;
    } catch (error) {
        console.log(error);
    }
}

export const fetchLeaveList = async (queryParams) => {
    try {
        const token = localStorage.getItem('AccessToken');
        const query = queryParams ? objectToQueryString(queryParams) : '';
        let config = {
            method: 'post',
            url: API_URL + `/leave/list` + query,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const request = apiController(config);
        return request;
    } catch (error) {
        console.log(error);
    }
}

export const fetchLeaveDetails = async (queryParams) => {
    try {
        const token = localStorage.getItem('AccessToken');
        const query = queryParams ? objectToQueryString(queryParams) : '';
        let config = {
            method: 'post',
            url: API_URL + `/leave/details` + query,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const request = apiController(config);
        return request;
    } catch (error) {
        console.log(error);
    }
}

export const fetchEmpLeaveDetails = async (queryParams) => {
    try {
        const token = localStorage.getItem('AccessToken');
        const query = queryParams ? objectToQueryString(queryParams) : '';
        let config = {
            method: 'post',
            url: API_URL + `/leave/employee` + query,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const request = apiController(config);
        return request;
    } catch (error) {
        console.log(error);
    }
}
export const fetchLeaveSummaryDetails = async (queryParams) => {
    try {
        const token = localStorage.getItem('AccessToken');
        const query = queryParams ? objectToQueryString(queryParams) : '';
        console.log("query", query);

        let config = {
            method: 'post',
            url: API_URL + `/leave/summary` + query,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const request = apiController(config);
        return request;
    } catch (error) {
        console.log(error);
    }
}
export const updateLeaveStatusApi = async (data) => {
    try {
        const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/leave/status/update`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: data
        };
        const request = apiController(config);
        return request;
    } catch (error) {
        console.log(error);
    }
}

export const deleteLeaveApi = async (data) => {
    try {
        const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/leave/delete`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: data
        };
        const request = apiController(config);
        return request;
    } catch (error) {
        console.log(error);
    }
}
