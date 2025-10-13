import { apiController } from '../configs/apiController';
import { objectToQueryString } from '../utils/helper';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const fetchEmployeeStats = async (queryParams) => {
    try {
        const token = localStorage.getItem('AccessToken');
        const query = queryParams ? objectToQueryString(queryParams) : '';
        let config = {
            method: 'post',
            url: API_URL + `/employee/stats` + query,
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

export const fetchEmpAttendanceOverview = async (queryParams) => {
    try {
        const token = localStorage.getItem('AccessToken');
        const query = queryParams ? objectToQueryString(queryParams) : '';
        let config = {
            method: 'post',
            url: API_URL + `/attendance/overview` + query,
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

export const fetchLeaveReport = async () => {
    try {
        const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/leavetype/report`,
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

export const createQuickLink = async (data) => {
    try {
        const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/quicklinks/create/update`,
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

export const fetchQuickLinkList = async (queryParams) => {
    try {
        const token = localStorage.getItem('AccessToken');
        const query = queryParams ? objectToQueryString(queryParams) : '';
        let config = {
            method: 'post',
            url: API_URL + `/quicklinks/list` + query,
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

export const fetchQuickLinkDetails = async (queryParams) => {
    try {
        const token = localStorage.getItem('AccessToken');
        const query = queryParams ? objectToQueryString(queryParams) : '';
        let config = {
            method: 'post',
            url: API_URL + `/quicklinks/details` + query,
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

export const deleteQuickLinkApi = async (data) => {
    try {
        const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/quicklinks/delete`,
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