import { fetchAppraisalList } from "../../../../services/report/MyReport/performance";
import { GET_APPRAISAL_LIST_FAILURE, GET_APPRAISAL_LIST_REQUEST, GET_APPRAISAL_LIST_SUCCESS } from "../../../Constants/report/myReport/reportsConstants";

export const getAppraisalList = (params) => async (dispatch) => {
    dispatch({ type: GET_APPRAISAL_LIST_REQUEST });
    try {
        const response = await fetchAppraisalList(params);
        dispatch({ type: GET_APPRAISAL_LIST_SUCCESS, payload: response.data });
        return response.data;
    } catch (error) {
        dispatch({ type: GET_APPRAISAL_LIST_FAILURE, payload: error.message });
        throw error; 
    }
};