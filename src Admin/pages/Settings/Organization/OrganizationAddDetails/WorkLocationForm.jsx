import { Crosshair, FolderPen, Mail, MapPin, MapPinned } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import SelectDropdown from '../../../../utils/common/SelectDropdown/SelectDropdown'
import { useDispatch, useSelector } from 'react-redux'
import SaveBtn from '../../../../utils/common/SaveBtn'
import { createWorkLocation, getWorkLocDetails } from '../../../../Redux/Actions/Settings/organizationActions'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { handleFormError } from '../../../../utils/helper'

export const WorkLocationForm = ({ viewMode, formData, setFormData, fetchCity, fetchState }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const { orgId } = location?.state || {}

    const addWorkLocation = useSelector((state) => state?.addWorkLocation);
    const organizationDetailData = useSelector((state) => state?.organizationDetail);
    const organizationDetail = organizationDetailData?.data?.data || {};

    const stateData = useSelector((state) => state?.stateList);
    const stateLists = stateData?.data?.country || [];

    const cityData = useSelector((state) => state?.cityList);
    const cityLists = cityData?.data?.country || [];

    const stateOptions = useMemo(
        () => stateLists?.map(item => ({ id: item?.id, label: item?.name })),
        [stateLists]
    );

    const cityOptions = useMemo(
        () => cityLists?.map(item => ({ id: item?.id, label: item?.name })),
        [cityLists]
    );

    const work_location_name_ref = useRef(null);
    const state_id_ref = useRef(null);
    const city_id_ref = useRef(null);
    const zip_code_ref = useRef(null);

    const [errors, setErrors] = useState({
        work_location_name: false,
        state_id: false,
        city_id: false,
        zip_code: false,
    });

    const basicRequiredFields = [
        {
            key: "work_location_name",
            label: "Please fill work location name",
            required: true,
            ref: work_location_name_ref,
        },
        {
            key: "state_id",
            label: "Please fill State name",
            required: true,
            ref: state_id_ref,
        }, {
            key: "city_id",
            label: "Please fill City name",
            required: true,
            ref: city_id_ref,
        }, {
            key: "zip_code",
            label: "Please fill Pin Code",
            required: true,
            ref: zip_code_ref,
        },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSelect = (name, item) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: item?.id,
        }));
        if (name === "state_id") fetchCity("", item?.id);
        setErrors((prev) => ({
            ...prev,
            [name]: false,
        }));
    };


    const validateForm = () => {
        for (let field of basicRequiredFields) {
            const value = formData[field.key];
            if (
                field.required &&
                (!value || (typeof value === "string" && !value.trim()))
            ) {
                setErrors((prev) => ({ ...prev, [field.key]: field.label }));
                toast.error(field.label);
                handleFormError(field?.ref);
                return false;
            }
        }
        return true;
    };


    const handleSaveOrUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSubmit = {
            ...formData,
            organisation_id: organizationDetail?.organisation_id
        };
        
        if (viewMode === "edit") {
            formDataToSubmit["id"] = id;
        }

        dispatch(createWorkLocation(formDataToSubmit))
            .then((res) => {
                if (res?.status) {
                    navigate(
                        id
                            ? `/settings/work-location-details/${id}`
                            : `/settings/organization-work-locations/${orgId}`
                        , { state: { orgId } });
                    if (id) {
                        dispatch(getWorkLocDetails({ id }));
                    }
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });
    }

    const isDetailView = viewMode === "detail";

    return (
        <>
            <div
                className={`dept-page-basic-info-section`}>
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper">
                        <Mail size={20} />
                    </div>
                    <label className={viewMode !== "detail" ? "color_red" : ""}>
                        Work Location Name
                        {viewMode !== "detail" && <b className="color_red">*</b>}
                    </label>
                    <input
                        ref={work_location_name_ref}
                        type="text"
                        name="work_location_name"
                        value={formData?.work_location_name}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper">
                        <FolderPen size={20} />
                    </div>
                    <label>
                        Street 1
                    </label>
                    <input
                        type="text"
                        name="street_address1"
                        value={formData?.street_address1}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper">
                        <FolderPen size={20} />
                    </div>
                    <label>
                        Street 2
                    </label>
                    <input
                        type="text"
                        name="street_address2"
                        value={formData?.street_address2}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><MapPin size={20} /></div>
                    <label className={viewMode !== "detail" ? "color_red" : ""}>State{viewMode !== "detail" && <b className="color_red">*</b>}</label>
                    <SelectDropdown
                        ref={state_id_ref}
                        selectedValue={formData?.state_id}
                        options={stateOptions}
                        onSelect={(name, value) => handleSelect(name, value)}
                        searchPlaceholder="Search state"
                        type="state_id"
                        loading={stateData?.loading}
                        showSearchBar={true}
                        disabled={isDetailView}
                        searchMode="local"
                    />
                </div>
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Crosshair size={20} /></div>
                    <label className={viewMode !== "detail" ? "color_red" : ""}>City{viewMode !== "detail" && <b className="color_red">*</b>}</label>
                    <SelectDropdown
                        ref={city_id_ref}
                        selectedValue={formData?.city_id}
                        options={cityOptions}
                        onSelect={(name, value) => handleSelect(name, value)}
                        searchPlaceholder="Search City"
                        type="city_id"
                        loading={cityData?.loading}
                        showSearchBar={true}
                        disabled={isDetailView}
                        searchMode="local"
                    />
                </div>

                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper">
                        <MapPinned size={20} />
                    </div>
                    <label className={viewMode !== "detail" ? "color_red" : ""}>
                        Pin Code{viewMode !== "detail" && <b className="color_red">*</b>}
                    </label>
                    <input
                        ref={zip_code_ref}
                        type="text"
                        name="zip_code"
                        value={formData?.zip_code}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>
            </div>

            {(viewMode === "add" || viewMode === "edit") && (
                <SaveBtn
                    handleSubmit={handleSaveOrUpdate}
                    loading={addWorkLocation?.loading}
                    color="#fff"
                    viewMode={viewMode}
                    btntype='buttom_fix_btn'
                />
            )}
        </>
    )
}
