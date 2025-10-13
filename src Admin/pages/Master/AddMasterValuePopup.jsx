import { useRef, useState } from 'react';
import './AddMasterValuePopup.scss';
import { Dice4, GraduationCap, X } from 'lucide-react';
import { handleFormError } from '../../utils/helper';
import { createUpdateMaster, getMasterList } from '../../Redux/Actions/Settings/masterActions';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import SaveBtn from '../../utils/common/SaveBtn';

export const AddMasterValuePopup = ({ field, id, setShowMasterPopUp }) => {

    const ref = useRef();
    const label_ref = useRef(null);
    const dispatch = useDispatch();

    //Data from redux
    const masterCreate = useSelector((state) => state?.createMaster);

    // ✅ Single formData state
    const [formData, setFormData] = useState({
        type: id,
        mastername: field,
        label: []
    });

    const [errors, setErrors] = useState({
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
            key: "label",
            label: "Please fill Master Value",
            required: true,
            ref: label_ref,
        }
    ];

    const validateForm = (updatedFormData) => {
        for (let field of basicRequiredFields) {
            const value = updatedFormData[field.key];
            let isEmpty = false;
            if (Array.isArray(value)) {
                isEmpty = value.length === 0;
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
                    setShowMasterPopUp(false);
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });
    };

    return (
        <div className="masterPopupOverlay" onClick={(e) => !ref?.current.contains(e.target) ? setShowMasterPopUp(false) : ''}>
            <div ref={ref} className="masterPopUpMain">
                <div className="masterPopupHead">
                    <div className="masterPopHeadTxt1">Add {field}</div>
                    <div className="masterPopHeadTxt2">Add the values below</div>
                </div>
                <button className='master_popup_close' onClick={() => setShowMasterPopUp(false)}>Close</button>
                <div className="masterPopupBody">
                    {/* Master Name/Field */}
                    <div className="masterPopRow">
                        <div className="masterPopRowLeft">
                            <div className="masterPopRowLeftIcon"><GraduationCap size={20} /></div>
                            <div className="masterPopRowLeftText">Field name</div>
                        </div>
                        <div className="masterPopRowRight">
                            {/* <input type="text" placeholder='Enter Degree Name' value={field} disabled/> */}
                            <div>{field}</div>
                        </div>
                    </div>
                    {/* Labels/Values */}
                    <div className="newMasterPopRow">
                        <div className="newMasterPopRowLeft newMasterAddspace">
                            <div className="masterPopRowLeftIcon"><Dice4 size={20} /></div>
                            <div className="newMasterPopRowLeftText">Value</div>
                        </div>
                        <div className="newMasterPopRowRight">
                            <div className="newMasterPopRowRightTextarea">
                                <div className="newMasterAllTags">
                                    {formData?.label?.map((tag, index) => (
                                        <div key={index} className="tag">
                                            {tag}
                                            <span className='removeTag' onClick={() => removeTag(index)}>
                                                <X size={18} />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <textarea
                                    ref={label_ref}
                                    name="label"
                                    value={textareaInput}
                                    onChange={handleChangeValue}
                                    onKeyDown={handleKeys}
                                    className='master_textarea'
                                    style={formData?.label?.length >= 1 ? { height: '88px' } : {}}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="masterPopupFooter">
                    <div className="masterpopupFooterCancelBtn" onClick={() => setShowMasterPopUp(false)}>CANCEL</div>
                    <div className="masterpopupFooterAddBtn" onClick={handleSaveOrUpdate}>ADD</div>
                </div> */}
                <div className="Master buttom_fix_btn_master">
                    <SaveBtn handleSubmit={handleSaveOrUpdate} btntype=''
                        viewMode={'edit'} loading={masterCreate?.loading} color='#fff' />
                </div>
            </div>
        </div>
    )
}
