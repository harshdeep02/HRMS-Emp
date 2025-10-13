import React, { useEffect, useState } from 'react'
import './AttendanceDetails.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrgData } from '../../../utils/helper';
import { getOrgSett, updateOrgSett } from '../../../Redux/Actions/Settings/attendanceActions';
import Loader from '../../../utils/common/Loader/Loader';
import ConfirmPopup from '../../../utils/common/ConfirmPopup';
// import '../../Users/UsersList.scss'

export const AttendanceMethods = () => {
        const [showModal, setShowModal] = useState(false);
        const [checkBoxKey, setCheckBoxKey] = useState(null);
    const [checked, setChecked] = useState({
        regularization:0,
        hourly_permission:0,
        break:0,
        office_in:0
    })
    const defaultMethods = [
        {findKey: "regularization", head: "Regularization", content:"An option given to employees to raise a request and rectify their incorrect or missed attendance entrie",isCheck:checked?.regularization},
        {findKey: "hourly_permission", head: "Hourly Permission", content:"Set up hourly permissions for short requests for time away from work during office hours",isCheck:checked?.hourly_permission},
        {findKey: "break", head: "Break", content:"Configure breaks for employees to log their time away from work",isCheck:checked?.break},
        {findKey: "office_in", head: "Office In and Remote In", content:"Check-in will be differentiated as either office-in or remote-in, in order to differentiate office-goers and remote workers",isCheck:checked?.office_in},
    ]

        const location = useLocation();
        const dispatch = useDispatch();
        const {id} = getOrgData()
    
        //Data from redux
        const updateOrgSetting = useSelector((state) => state?.updateOrgSett);
        const orgSettingDetail = useSelector((state) => state?.orgSettings);
        const orgSettingData = orgSettingDetail?.data?.settings;
        const applicantDetailLoading = orgSettingDetail?.loading || false;
        
        const [formData, setFormData] = useState(defaultMethods)
        const [popupData, setPopupData] = useState({module:''})

        useEffect(() => {
                if (id && !orgSettingData) {
                    dispatch(getOrgSett({ id }));
                }
        }, [id]);
        useEffect(() => {
        setFormData(prev =>
            prev.map(item => ({
            ...item,
            isCheck: checked[item.findKey],
            }))
        );
        }, [checked]);
        
        useEffect(() => {
            if (orgSettingData) {
                setChecked((prev) => ({
                    ...prev,
                    regularization: orgSettingData?.regularization,
                    hourly_permission: orgSettingData?.hourly_permission,
                    break: orgSettingData?.break,
                    office_in: orgSettingData.office_in
                }));
            }
        }, [orgSettingData]);

    const handleConfirmDelete =()=>{
        if(!checkBoxKey)return;
        // setChecked((prev)=>({
        //         ...prev,
        //         [checkBoxKey] : prev[checkBoxKey] === 1 ? 0: 1
        //     }))

            const formDataToSubmit = {
              ...checked,  
            organisation_id:id,
            [checkBoxKey] : checked[checkBoxKey] === 1 ? 0 : 1
        };

        dispatch(updateOrgSett(formDataToSubmit))
        .then((res) => {
            if (res?.success) {
             dispatch(getOrgSett({ organisation_id : id }))
             .then((res)=>{
                if (res?.success) {setShowModal(false )}
             })
            //  if(!applicantDetailLoading)setShowModal(false )
            }
        })
        .catch((error) => {
            console.log("error-", error);
        });         
        }

        const handleCheck = (key)=>{
            setPopupData({module:key})
            setCheckBoxKey(key)
            setShowModal(true)
        }
      if (applicantDetailLoading && updateOrgSetting?.loading) {
    return (
      <div className="loading-state">
        <Loader />
      </div>
    );
  }

  return (
    <div className="attendanceMethodMain">
        <div className="AttenanceMethodHead">
            <div className="AttenanceMethodHeadUp">Attendance Methods</div>
            <div className="AttenanceMethodHeadDwn">Select the methods that you commonly use in your organization to track your employee leaves</div>
        </div>
        <div className="AttenanceMethodBody ">
            {formData.map((row,i)=>(
                 <div key={i} className="attendanceBodyRow">
                <div className="methodtoggleBtn">
                    <div className="address-container">
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={row.isCheck === 1? true: false}
                                onChange={()=>handleCheck(row?.findKey)}
                                />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    </div>
                <div className="methodBodyRowRight">
                    <div className="rowRightHead">{row.head}</div>
                    <div className="rowRightBody">{row.content}</div>
                </div>
            </div>
            ))}
           
        </div>
         <ConfirmPopup
                open={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmDelete}
                type={checked[popupData.module] == 1 ? "disable" : "enable"}
                module={popupData?.module?.split("_")?.map((item)=>item[0]?.toUpperCase()+item?.slice(1))?.join(" ")}
                loading={updateOrgSetting?.loading|| applicantDetailLoading}
            />
    </div>
  )
}
