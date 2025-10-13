import { apiController } from '../../configs/apiController';
import { objectToQueryString } from '../../utils/helper';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const loginEnableDisable = async (data) => {
    try {
        const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/login/enabledisable`,
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

export const fetchUserList = async (queryParams) => {
    try {
        const token = localStorage.getItem('AccessToken');
        const query = queryParams ? objectToQueryString(queryParams) : '';
        console.log("query",query);
        
        let config = {
            method: 'post',
            url: API_URL + `/user/list` + query,
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

export const setUserLoginRole = async (data) => {
    try {
        const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/role/update`,
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


export const updateUserStatusApi = async (data) => {
    try {
        const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/jobopening/status/update`,
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