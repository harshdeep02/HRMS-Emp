import { Dice4, GraduationCap, X } from 'lucide-react'
import { useRef, useState } from 'react'
import './AddNewMasterPopup.scss'
import { handleFormError } from '../../utils/helper';
import { createUpdateMaster, getMasterList } from '../../Redux/Actions/Settings/masterActions';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import SaveBtn from '../../utils/common/SaveBtn';

export const AddNewMasterPopup = ({ setAddNewShowMasterPopUp }) => {

    const ref = useRef();
    const master_name_ref = useRef(null);
    const label_ref = useRef(null);
    const dispatch = useDispatch();

    //Data from redux
    const masterCreate = useSelector((state) => state?.createMaster);

    // ✅ Single formData state
    const [formData, setFormData] = useState({
        type: 0,
        mastername: "",
        label: []
    });

    const [errors, setErrors] = useState({
        mastername: false,
        label: false,
    });

    const [textareaInput, setTextareaInput] = useState('');

    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setTextareaInput(value);
        setErrors((prev) => ({
            ...prev,
            [name]: false
        }))
    }

    const handleChangeMasterName = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({
            ...prev,
            [name]: false
        }))
    }

    const handleKeys = (e) => {
        if (e.key === "Enter" && textareaInput.trim() !== "") {
            e.preventDefault();
            setFormData((prev) => ({
                ...prev,
                label: [...prev.label, textareaInput.trim()]
            }));
            setTextareaInput('');
        } else if (e.key === "Backspace" && textareaInput === "") {
            setFormData((prev) => ({
                ...prev,
                label: prev.label.slice(0, prev.label.length - 1)
            }));
        }
    };

    const removeTag = (i) => {
        setFormData((prev) => ({
            ...prev,
            label: prev.label.filter((_, index) => index !== i)
        }));
    };

    const basicRequiredFields = [
        {
            key: "mastername",
            label: "Please fill Master Name",
            required: true,
            ref: master_name_ref,
        },
        {
            key: "label",
            label: "Please fill Master Value",
            required: true,
            ref: label_ref,
        }
    ];

    const validateForm = (updateFormData) => {
        for (let field of basicRequiredFields) {
            const value = updateFormData[field.key];

            let isEmpty = false;

            if (Array.isArray(value)) {
                isEmpty = value.length === 0;
            } else if (typeof value === "string") {
                isEmpty = !value.trim();
            } else {
                isEmpty = !value;
            }

            if (field.required && isEmpty) {
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

        let updateFormData = { ...formData }
        if (textareaInput.trim() !== '') {
            updateFormData = {
                ...updateFormData,
                label: [...updateFormData?.label, textareaInput.trim()]
            }
            setFormData(updateFormData);
            setTextareaInput('');
        }
        if (!validateForm(updateFormData)) return;

        dispatch(createUpdateMaster(updateFormData))
            .then((res) => {
                if (res?.success) {
                    dispatch(getMasterList());
                    setAddNewShowMasterPopUp(false);
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });
    };

    return (
        <div className="newMasterPopupOverlay" onClick={(e) => !ref?.current.contains(e.target) ? setAddNewShowMasterPopUp(false) : ''}>
            <div ref={ref} className="newMasterPopUpMain">
                <div className="newMasterPopupHead">
                    <div className="newMasterPopHeadTxt1">New Master</div>
                    <div className="newMasterPopHeadTxt2">Add Basic information for creating master </div>
                </div>
                <button className='master_popup_close' onClick={() => setAddNewShowMasterPopUp(false)}>Close</button>

                <div className="newMasterPopupBody">
                    {/* Master Name */}
                    <div className="newMasterPopRow">
                        <div className="newMasterPopRowLeft">
                            <div className="masterPopRowLeftIcon"><GraduationCap size={20} /></div>
                            <div className="newMasterPopRowLeftText">Master name</div>
                        </div>
                        <div className="newMasterPopRowRight">
                            <input
                                ref={master_name_ref}
                                type="text"
                                name="mastername"
                                placeholder=''
                                value={formData?.mastername}
                                onChange={handleChangeMasterName}
                            />
                        </div>
                    </div>

                    {/* Labels */}
                    <div className="newMasterPopRow">
                        <div className="newMasterPopRowLeft newMasterAddspace">
                            <div className="masterPopRowLeftIcon"><Dice4 size={20} /></div>
                            <div className="newMasterPopRowLeftText">Value</div>
                        </div>
                        <div className=".newMasterPopRowRight">
                            <div className="">
                                <div className="newMasterAllTags">
                                    {formData?.label?.map((tag, index) => (
                                        <div key={index} className="tag">
                                            {tag}
                                            <span className='removeTag' onClick={() => removeTag(index)}>
                                                <X size={16} />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <textarea
                                    ref={label_ref}
                                    value={textareaInput}
                                    name="label"
                                    className='master_textarea'
                                    onChange={handleChangeValue}
                                    onKeyDown={handleKeys}
                                    style={formData?.label?.length >= 1 ? { height: '88px' } : {}}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="newMasterPopupFooter">
                    <div className="newMasterpopupFooterCancelBtn" onClick={() => setAddNewShowMasterPopUp(false)}>CANCEL</div>
                    <div className="newMasterpopupFooterAddBtn" onClick={handleSaveOrUpdate}>SAVE</div>
                </div> */}
                <div className="Master buttom_fix_btn_master">
                    <SaveBtn handleSubmit={handleSaveOrUpdate} btntype=''
                        viewMode={'add'} loading={masterCreate?.loading} color='#fff' />
                </div>
            </div>
        </div>
    )
}
