import React, { useEffect, useState } from 'react'
import { WorkLocationForm } from './WorkLocationForm'
import { WorkLocationStatusOptions } from '../../../../utils/Constant';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import StatusDropdown from '../../../../utils/common/StatusDropdown/StatusDropdown';
import Loader from '../../../../utils/common/Loader/Loader';
import bannerImg from '../../../../assets/map_pin_svg.svg';
import { getCityList, getStateList } from '../../../../Redux/Actions/locationActions';
import { getWorkLocDetails } from '../../../../Redux/Actions/Settings/organizationActions';

export const WorkLocationDetails = () => {

    const { id } = useParams()
    const location = useLocation();
    const {orgId} = location?.state || {};
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const renderHeader = () => {
        switch (viewMode) {
            case 'add': return 'Add New Work Location';
            case 'edit': return 'Edit Work Location';
            case 'detail': default: return 'Work Location Details';
        }
    };
    const renderMark = () => {
        switch (viewMode) {
            case 'add': return 'Fill The Information';
            case 'edit': return 'Edit Information';
            case 'detail': default: return 'Provided Details!';
        }
    };

    const renderHeaderInfo = () => {
        switch (viewMode) {
            case 'add': return "You're just one step away from adding the new Work Location! ";
            case 'edit': return "Here’s the information about the ticket details you’ve filled. ";
            case 'detail': default: return "see details that Role has been assigned for specific Work location ";
        }
    };

    const [viewMode, setViewMode] = useState('');
    const [formData, setFormData] = useState({
        work_location_name: '',
        street_address1: '',
        street_address2: '',
        state_id: '',
        city_id: '',
        zip_code: '',
        status: 1
    });

    const WorkLocData = useSelector((state) => state?.WorkLocDetail);
    const LocationDetails = WorkLocData?.data?.data;
    const LocationLoading = WorkLocData?.loading || false;

    const fetchState = (search = "", id = "") => {
        const sendData = {
            country_id: 101
        };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getStateList(sendData));
    };

    const fetchCity = (search = "", id = "") => {
        const sendData = {
            state_id: id,
        };
        if (search) {
            sendData["search"] = search;
        }
        dispatch(getCityList(sendData));
    };

    useEffect(() => {
        if (id && LocationDetails?.id !== id) {
            dispatch(getWorkLocDetails({ id }));
        }
    }, [id]);

    useEffect(() => {
        if (LocationDetails && id) {
            setFormData((prev) => ({
                ...prev,
                work_location_name: LocationDetails?.work_location_name,
                street_address1: LocationDetails?.street_address1,
                street_address2: LocationDetails?.street_address2,
                state_id: LocationDetails?.state_id,
                city_id: LocationDetails?.city_id,
                zip_code: LocationDetails?.zip_code,
                status: LocationDetails?.status
            }));

            if (LocationDetails?.state_id) fetchCity("", LocationDetails?.state_id);
            if (LocationDetails?.country_id) fetchState("", LocationDetails?.country_id);
        }
    }, [LocationDetails])

    useEffect(() => {
        if (location.pathname.includes("add-work-location")) {
            setViewMode('add')
        }
        else if (location.pathname.includes("edit-work-location")) {
            setViewMode('edit')
        }
        else if (location.pathname.includes("work-location-details")) {
            setViewMode('detail')
        }
    }, [location])

    const handleEditClick = () => {
        navigate(`/settings/edit-work-location/${id}`, {state:{orgId}});
    };

    const handleStatus = (val) => {
        setFormData(prevData => ({
            ...prevData,
            status: val,
        }));
    }

    if (LocationLoading) {
        return <div className="loading-state"> <Loader /> </div>;
    }

    return (
        <div className="dept-page-co ntainer">
            <button onClick={() => navigate(`${viewMode == 'edit' ? `/settings/work-location-details/${id}` : `/settings/organization-work-locations/${orgId}`}`,{state:{orgId}})} className="close_nav header_close">Close</button>
            <div className="dept-page-container">
                <h2 className="dept-page-main-heading">{renderHeader()}</h2>
                <div className="dept-page-content-wrapper">
                    <div className="dept-page-left-panel">
                        <h3 className="dept-page-mark-text">{renderMark()}</h3>
                        <p className="dept-page-info-text">{renderHeaderInfo()}</p>
                        <div className="dept-page-illustration-box">
                            <img className=' ' src={bannerImg} alt="Illustration" />
                        </div>
                    </div>
                    <div className="dept-page-right-panel">
                        <div className="dept-page-cover-section">
                            <div className="dept-page-basic-info-section dept-page-basic-info-section_2">
                                <h3>Basic Information</h3>
                                <p className="dept-page-subtitle">{viewMode !== "detail" ? "Please Provide" : ''} Location Basic Details Below.</p>
                            </div>
                            {/* {viewMode !== "detail" ? */}
                            <StatusDropdown
                                options={WorkLocationStatusOptions?.filter((item) => item?.label !== "All")?.map((item) => ({
                                    value: item?.id,
                                    label: item?.label,
                                    icon: item?.icon,
                                }))}
                                defaultValue={formData?.status}
                                onChange={(val) => handleStatus(val)}
                                viewMode={viewMode !== "detail"}
                            />
                            {/* :
                                <div className="status-dropdown">
                                    <div className={`status-label dropdown-trigger`}>
                                        {announcementStatusOptions?.filter((item) => item.id == formData?.status)?.[0]?.label}
                                    </div>
                                </div>
                            } */}
                        </div>
                        {viewMode === 'detail' && (
                            <button className="dept-page-edit-btn" onClick={handleEditClick}>
                                {/*  */}
                                Edit
                            </button>
                        )}
                        <WorkLocationForm
                            viewMode={viewMode}
                            formData={formData}
                            setFormData={setFormData}
                            fetchState={fetchState}
                            fetchCity={fetchCity}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
