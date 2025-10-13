import { apiController } from '../../../configs/apiController';
import { objectToQueryString } from '../../../utils/helper';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const fetchAppraisalList = async (queryParams) => {
    try {
        const token = localStorage.getItem('AccessToken');
        const query = queryParams ? objectToQueryString(queryParams) : '';
        let config = {
            method: 'post',
            url: API_URL + `/myreport/appraisal`,
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