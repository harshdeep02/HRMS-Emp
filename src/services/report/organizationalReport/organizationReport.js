import { apiController } from '../../../configs/apiController';
import { objectToQueryString } from '../../../utils/helper';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;


export const fetchLeaveTrackerReport = async (queryParams) => {
    try {
        const token = localStorage.getItem('AccessToken');
        const query = queryParams ? objectToQueryString(queryParams) : '';
        let config = {
            method: 'post',
            url: API_URL + `/organisation/leave/report/status` + query,
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

export const fetchEmployeeAttritionApi = async (queryParams) => {
    try {
        const token = localStorage.getItem('AccessToken');
        const query = queryParams ? objectToQueryString(queryParams) : '';
        let config = {
            method: 'post',
            url: API_URL + `/myreport/attrition`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: queryParams
        };
        const request = apiController(config);
        return request;
    } catch (error) {
        console.log(error);
    }
}