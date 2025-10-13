import { apiController } from '../configs/apiController';
import { objectToQueryString } from '../utils/helper';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const createShift = async (data) => {
    try {
        const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/shift/master/create/update`,
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

export const assignShift = async (data) => {
    try {
        const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/shiftcraete/update`,
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

export const fetchAssignShiftList = async (queryParams) => {
    try {
        const query = queryParams ? objectToQueryString(queryParams) : '';
        const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/assignShift/list` + query,
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

export const fetchShiftList = async (queryParams) => {
    try {
        const query = queryParams ? objectToQueryString(queryParams) : '';
        const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/shift/master/list` + query,
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

export const fetchAssignShiftDetails = async (queryParams) => {
    try {
        const token = localStorage.getItem('AccessToken');
        const query = queryParams ? objectToQueryString(queryParams) : '';
        let config = {
            method: 'post',
            url: API_URL + `/shift/master/details` + query,
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

export const fetchShiftMasterDetails = async (queryParams) => {
    try {
        const token = localStorage.getItem('AccessToken');
        const query = queryParams ? objectToQueryString(queryParams) : '';
        let config = {
            method: 'post',
            url: API_URL + `/shift/master/details` + query,
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

export const updateShiftMasterStatus = async (data) => {
    try {
        const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/shift/master/status/update`,
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

export const deleteShiftMaster = async (data) => {
    try {
        const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/shift/master/delete`,
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

export const deleteAssignShiftMaster = async (data) => {
    try {
        const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/assign/shift/delete`,
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