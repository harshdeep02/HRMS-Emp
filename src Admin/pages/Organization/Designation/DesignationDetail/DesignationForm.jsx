import {
    Users,
    Building2,
    Parentheses,
    Warehouse,
    AppWindowMac,
    Proportions
} from 'lucide-react';
// import './DepartmentDetail.scss';
import SelectDropdown from '../../../../utils/common/SelectDropdown/SelectDropdown.jsx';
import { useDispatch, useSelector } from 'react-redux';
import TextAreaWithLimit from '../../../../utils/common/TextAreaWithLimit.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { createNewDesignation, getDesignationDetails } from '../../../../Redux/Actions/designationActions.js';
import { toast } from 'react-toastify';
import { handleFormError } from "../../../../utils/helper.js";
import SaveBtn from '../../../../utils/common/SaveBtn.jsx';
import { useMemo, useRef, useState } from 'react';

const DesignationForm = ({ viewMode, formData, setFormData, handleSearch }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    //Data from redux
    const createUpdateDesignation = useSelector((state) => state?.createDesignation);
    const designationDetails = useSelector((state) => state?.designationDetails);
    const designationDetail = designationDetails?.data?.designation;
    const departmentData = useSelector((state) => state?.departmentList);
    const departmentLists = departmentData?.data?.department || [];

    const departmentOptions = useMemo(
        () => departmentLists?.map(d => ({ id: d.id, label: d.department_name })),
        [departmentLists]
    );

    const designation_name_ref = useRef(null);
    const department_ref = useRef(null);

    const [errors, setErrors] = useState({
        designation_name: false,
        department_id: false,
    });

    const basicRequiredFields = [
        { key: "designation_name", label: "Please fill name", required: true, ref: designation_name_ref },
        { key: "department_id", label: "Please select department", required: true, ref: department_ref },
    ];

    const handleSelect = (name, item) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: item?.id,
        }));
        setErrors(prev => ({
            ...prev,
            [name]: false,
        }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: false, // Clear error for this field
        }));
    };

    const validateForm = () => {
        for (let field of basicRequiredFields) {
            const value = formData[field.key];
            if (!value || (typeof value === "string" && !value.trim())) {
                setErrors(prev => ({ ...prev, [field.key]: field.label }));
                toast.error(field.label);
                handleFormError(field?.ref);
                return false;
            }
        }
        return true;
    };

    const handleSaveOrUpdate = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSubmit = { ...formData };

        if (viewMode === 'edit') {
            formDataToSubmit["id"] = id;
        }

        dispatch(createNewDesignation(formDataToSubmit))
            .then((res) => {
                if (res?.status === 200) {
                    navigate(id ? `/designation-details/${id}` : `/designation-list`);
                    if (id) {
                        dispatch(getDesignationDetails({ id }))
                    }
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });
    };

    return (
        <>
            <div className={`dept-page-basic-info-section ${viewMode === "edit" ? "isEditPage" : ""}}`}>
                {/* <h3>Basic Information</h3>
                <p className="dept-page-subtitle">Basic profile overview</p> */}
                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Warehouse size={20} strokeWidth={1.5} /></div>
                    <label className={viewMode !== "detail" ? 'color_red' : ""}>Designation Name{viewMode !== "detail" && <b className='color_red'>*</b>}</label>
                    <input
                        ref={designation_name_ref}
                        type="text"
                        name="designation_name"
                        value={formData?.designation_name}
                        onChange={handleChange}
                        disabled={viewMode === 'detail'}
                    />
                </div>

                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><AppWindowMac size={20} strokeWidth={1.5} /></div>
                    <label className={viewMode !== "detail" ? 'color_red' : ""}>Department{viewMode !== "detail" && <b className='color_red'>*</b>}</label>
                    <SelectDropdown
                        ref={department_ref}
                        selectedValue={formData?.department_id}
                        options={departmentOptions}
                        onSelect={handleSelect}
                        searchPlaceholder="Search department"
                        handleSearch={handleSearch}
                        type="department_id"
                        loading={departmentData?.loading}
                        showSearchBar={true}
                        disabled={viewMode === 'detail'}
                        selectedName={viewMode === 'detail' ? designationDetail?.department?.department_name : ""}
                    />
                </div>

                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Proportions size={20} strokeWidth={1.5} /></div>
                    <label>Description</label>
                    {viewMode === 'detail' ? (
                        <textarea
                            value={formData?.description || '-'}
                            disabled
                            className="text-area-disabled"
                        />
                    ) : (
                        <TextAreaWithLimit
                            name="description"
                            value={formData?.description}
                            formsValues={{
                                handleChange: handleChange,
                                form: formData
                            }}
                        />
                    )}
                </div>
            </div>
            {(viewMode === "add" || viewMode === "edit") && (
                <SaveBtn handleSubmit={handleSaveOrUpdate} btntype='buttom_fix_btn'
                    viewMode={viewMode} loading={createUpdateDesignation?.loading} color='#fff' />
            )}
        </>
    );
};

export default DesignationForm;