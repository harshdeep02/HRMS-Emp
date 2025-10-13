import { apiController } from '../configs/apiController';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
import { objectToQueryString } from '../utils/helper';

export const loginApi = async (data) => {
    try {
        let config = {
            method: 'post',
            url: API_URL + `/login`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: data
        };
        const request = apiController(config);
        return request;
    } catch (error) {
        console.log(error);
    }
}

export const fetchTodayAttendance = async (queryParams) => {
    try {
        const query = queryParams ? objectToQueryString(queryParams) : '';
         const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/attendance/today` + query,
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

export const attendancePunchApi = async (data) => {
    try {
         const token = localStorage.getItem('AccessToken');
        let config = {
            method: 'post',
            url: API_URL + `/attendance/punchin/punchout`,
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

export async function setUserData(data) {
    localStorage.setItem("UserData", JSON.stringify(data));
}

// export async function getUserData() {
//     return JSON.parse(localStorage.getItem("UserData"));
// }

export function getUserData() {
    const userData = localStorage.getItem("UserData");
    return userData ? JSON.parse(userData) : null;
}
