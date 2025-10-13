import React, { useEffect, useMemo, useState } from 'react'
import './ShiftsDetails.scss'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getOrgData } from '../../../utils/helper'
import { getOrgSett, updateOrgSett } from '../../../Redux/Actions/Settings/attendanceActions'
import ConfirmPopup from '../../../utils/common/ConfirmPopup'
import SelectDropdown from '../../../utils/common/SelectDropdown/SelectDropdown'
import { getShiftList } from '../../../Redux/Actions/shiftActions'

export const GeneralSetting = () => {
    const [popupData, setPopupData] = useState({module:''})
    const [showModal, setShowModal] = useState(false);
    const [checkBoxKey, setCheckBoxKey] = useState(null);
    const [checked, setChecked] = useState({
        compensatory_off: 0,
        email: 0,
        feed: 0,
        default_shift_id: 7,
    })

    const location = useLocation();
    const dispatch = useDispatch();
    const { id } = getOrgData()

    //Data from redux
    const updateOrgSetting = useSelector((state) => state?.updateOrgSett);
    const orgSettingDetail = useSelector((state) => state?.orgSettings);
    const orgSettingData = orgSettingDetail?.data?.settings;
    const applicantDetailLoading = orgSettingDetail?.loading || false;

    const shiftData = useSelector((state) => state?.shiftList);
    const shiftLists = shiftData?.data?.result || [];

    const shiftOptions = useMemo(
        () => shiftLists?.map(d => ({ id: d?.id, label: d?.shift_name })),
        [shiftLists]
    );

    useEffect(() => {
        if (id && !orgSettingData) {
            dispatch(getOrgSett({ id }));
        }
        if (id && shiftLists?.length === 0) {
            dispatch(getShiftList());
        }
    }, [id]);

    useEffect(() => {
        if (orgSettingData) {
            setChecked((prev) => ({
                ...prev,
                compensatory_off: orgSettingData?.compensatory_off,
                email: orgSettingData?.email,
                feed: orgSettingData?.feed,
                default_shift_id: orgSettingData?.default_shift_id,
            }));
        }
    }, [orgSettingData]);

    const handleConfirmDelete = () => {
        if (!checkBoxKey) return;
        const formDataToSubmit = {
            ...checked,
            organisation_id: id,
        };
        if (checkBoxKey?.name === "default_shift_id") {
            formDataToSubmit["default_shift_id"] = checkBoxKey?.shift_id;
        }
        else {
            formDataToSubmit[checkBoxKey] = checked[checkBoxKey] === 1 ? 0 : 1

        }

        dispatch(updateOrgSett(formDataToSubmit))
            .then((res) => {
                if (res?.success) {
                    dispatch(getOrgSett({ organisation_id: id }))
                        .then((res) => {
                            if (res?.success) { setShowModal(false) }
                        })
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });
    }

    const handleCheck = (key) => {
        setPopupData({module:key})
        setCheckBoxKey(key)
        setShowModal(true)
    }
    const handleSelect = async (name, value) => {
        setPopupData({module:value?.label})
        setCheckBoxKey({ name, shift_id: value?.id })
        setShowModal(true)

    };

    if (applicantDetailLoading && updateOrgSetting?.loading) {
        return (
            <div className="loading-state">
                <Loader />
            </div>
        );
    }

    return (
        <div className="generalSettingMain otherDetailPageSroll">
            <div className="genSetRow1 genSetCom">
                <div className="setRow1Head">General Settings</div>
                <div className="setRow1Body">Select the methods that you commonly use in your organization to track your employee leaves</div>
            </div>
            <div className="genSetRow2 genSetCom">
                <div className="setRow2Left">
                    <div className="methodtoggleBtn">
                        <div className="address-container">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    name='compensatory_off'
                                    checked={checked?.compensatory_off === 1 ? true : false}
                                    onChange={() => handleCheck('compensatory_off')}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="setRow2Right">
                    <div className="setRow2Head">Compensatory Off</div>
                    <div className="setRow2Body">Compensatory Off is an entitled leave that an employee can take on a regular working day as compensation for working on a holiday or weekend</div>
                </div>
            </div>
            <div className="genSetRow3 genSetCom">
                <div className="setRow3Head">Notify employees on a shift change through</div>
                <div className="setRow3Body">Send an automated notification through the selected method when the employee shift is changed</div>
                <div className="setRow3Check">
                    <div className="setEmailCheck">
                        <input className='custom-checkbox' type="checkbox" name='email' checked={checked?.email === 1 ? true : false} onClick={() => handleCheck('email')} />
                        <span>Email</span>
                    </div>
                    <div className="setFeedCheck">
                        <input className='custom-checkbox' type="checkbox" name='feed' checked={checked?.feed === 1 ? true : false} onClick={() => handleCheck('feed')} />
                        <span>Feed</span>
                    </div>
                </div>
            </div>
            <div className="genSetRow4 genSetCom">
                <div className="setRow4Head">Select the default work shift for employees</div>
                <div className="setRow4Body">By default, employees will be mapped to the default shift unless they are specifically mapped to another shift</div>
                <div className="setRow4Bot">
                    {/* <select>
                <option value="" disabled selected>General Shift 09.00 am - 06.00 Pm </option> */}
                    {/* </select> */}
                    <SelectDropdown
                        selectedValue={checked?.default_shift_id}
                        options={shiftOptions}
                        onSelect={handleSelect}
                        type="default_shift_id"
                        loading={shiftData?.loading}
                    />
                </div>
            </div>


            <ConfirmPopup
                open={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmDelete}
                type={checked[popupData.module] === 1 ? "disable" : "enable"}
                module={popupData?.module?.split("_").map((item)=>item[0]?.toUpperCase()+item?.slice(1))?.join(" ")}
                loading={updateOrgSetting?.loading || applicantDetailLoading}
            />
        </div>
    )
}
