import { apiController } from '../../configs/apiController';
import { objectToQueryString } from '../../utils/helper';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const createNewMaster = async (data) => {
    try {
        const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/master/create/update`,
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

export const fetchMasterstList = async (queryParams) => {
    try {
        const token = localStorage.getItem('AccessToken');
        const query = queryParams ? objectToQueryString(queryParams) : '';
        let config = {
            method: 'post',
            url: API_URL + `/master/fetch/required` + query,
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


export const updateMasterOption = async (queryParams) => {
    try {
        const token = localStorage.getItem('AccessToken');
        const query = queryParams ? objectToQueryString(queryParams) : '';
        let config = {
            method: 'post',
            url: API_URL + `/master/label/update` + query,
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