import {
    Phone,
    Proportions,
    Mail,
    Rows4,
    User
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import { toast } from "react-toastify";
import { handleFormError, showMasterData } from "../../../utils/helper.js";
import { useNavigate, useParams } from 'react-router-dom';
import SaveBtn from '../../../utils/common/SaveBtn.jsx';
import { createNewTrainer, getTrainerDetails } from '../../../Redux/Actions/trainerActions.js';
import SelectDropdown from '../../../utils/common/SelectDropdown/SelectDropdown.jsx';

const TrainerForm = ({ viewMode, formData, setFormData }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    //Data from redux
    const createUpdateTrainer = useSelector((state) => state?.createTrainer);
    const training_type_options = showMasterData("22");

    const trainer_name_ref = useRef(null);
    const training_type_ref = useRef(null);
    const email_ref = useRef(null);

    const [errors, setErrors] = useState({
        trainer_name: false,
        training_type: false,
        email: false
    });

    const basicRequiredFields = [
        {
            key: "trainer_name",
            label: "Please fill Trainer Name",
            required: true,
            ref: trainer_name_ref,
        },
        {
            key: "training_type",
            label: "Please select Training Type",
            required: true,
            ref: training_type_ref,
        },
        {
            key: "email",
            label: "Please fill Email",
            required: true,
            ref: email_ref,
        }
    ];

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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Update only basicDetails errors
        setErrors((prevState) => ({
            ...prevState,
            [name]: false, // Clear error for this field
        }));
    };

    const handleSelect = async (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value?.id,
        }));
        setErrors((prevState) => ({
            ...prevState,
            [name]: false, // Clear error for this field
        }));
    };

    const handleSaveOrUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSubmit = {
            ...formData,
        };
        if (viewMode === "edit") {
            formDataToSubmit["id"] = id;
        }
        dispatch(createNewTrainer(formDataToSubmit))
            .then((res) => {
                if (res?.status === 200) {
                    navigate(id ? `/trainer-details/${id}` : `/trainer-list`);
                    if (id) dispatch(getTrainerDetails({ id }));
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });
    };

    const isDetailView = viewMode === "detail";

    return (
        <>
            <div className={`dept-page-basic-info-section ${viewMode === "edit" ? "isEditPage" : ""}`}>

                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><User size={20} strokeWidth={1.5} /></div>
                    <label className={!isDetailView ? "color_red" : ''}>Trainer Name{!isDetailView ? <span>*</span> : ''}</label>
                    <input
                        ref={trainer_name_ref}
                        type="text"
                        name='trainer_name'
                        value={formData?.trainer_name}
                        onChange={handleChange}
                        disabled={isDetailView}
                        className={errors?.trainer_name ? 'error' : ''}
                    />
                </div>

                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Rows4 size={20} strokeWidth={1.5} /></div>
                    <label className={!isDetailView ? "color_red" : ''}>Training Type{!isDetailView ? <span>*</span> : ''}</label>
                    <SelectDropdown
                        ref={training_type_ref}
                        selectedValue={formData?.training_type}
                        options={training_type_options}
                        onSelect={handleSelect}
                        type="training_type"
                        disabled={isDetailView}
                        selectedName={training_type_options?.find(item => item?.id == formData?.training_type)?.label || ""}
                    />
                </div>

                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Mail size={20} strokeWidth={1.5} /></div>
                    <label className={!isDetailView ? "color_red" : ''}>Email ID{!isDetailView ? <span>*</span> : ''}</label>

                    <input
                        ref={email_ref}
                        type="email"
                        name='email'
                        value={formData?.email}
                        onChange={handleChange}
                        disabled={isDetailView}
                        className={errors?.email ? 'error' : ''}
                    />
                </div>

                <div className="dept-page-input-group">
                    <div className="dept-page-icon-wrapper"><Phone size={20} strokeWidth={1.5} /></div>
                    <label>Contact Number</label>
                    <input
                        type="tel"
                        name='contact_no'
                        value={formData?.contact_no}
                        onChange={handleChange}
                        disabled={isDetailView}
                    />
                </div>

                <div className="dept-page-input-group attachment_form">
                    <div className="dept-page-icon-wrapper"><Proportions size={20} strokeWidth={1.5} /></div>
                    <label>Description</label>
                    <textarea
                        name='description'
                        value={formData?.description}
                        disabled={isDetailView}
                        onChange={handleChange}
                        rows={5}
                    />
                </div>
            </div>

            {(viewMode === "add" || viewMode === "edit") && (
                <SaveBtn
                    handleSubmit={handleSaveOrUpdate}
                    viewMode={viewMode}
                    loading={createUpdateTrainer?.loading}
                    color="#fff"
                    btntype='buttom_fix_btn' 
                />
            )}
        </>
    );
};

export default TrainerForm;