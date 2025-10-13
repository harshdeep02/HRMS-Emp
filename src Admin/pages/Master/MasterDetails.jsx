import { Pencil } from 'lucide-react'
import { useRef, useState } from 'react'
import './MasterDetails.scss'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SaveBtn from '../../utils/common/SaveBtn'
import { handleFormError } from '../../utils/helper'
import { toast } from "react-toastify";
import { editMasterOption, getMasterList } from '../../Redux/Actions/Settings/masterActions'

export const MasterDetails = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const label_ref = useRef(null);

    //Data from redux
    const masterEdit = useSelector((state) => state?.editMaster);
    const masterData = useSelector((state) => state?.masterData);
    const masterList = masterData?.data || [];

    const mains = masterList?.filter(item => item?.type === 0);
    const groupedMasters = mains?.map((main, index) => {
        const options = masterList?.filter(item => item?.type === main?.labelid);
        return { ...main, options };
    });
    const selectedMaster = groupedMasters?.find((master) => master?.labelid == id);

    const [editableId, setEditableId] = useState(null);
    const [newLabel, setNewLabel] = useState("");

    const [errors, setErrors] = useState({
        label: false,
    });

    const handleEdit = (id, value) => {
        setEditableId(id);
        setNewLabel(value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewLabel(value);
        setErrors((prev) => ({
            ...prev,
            [name]: false
        }))
    };

    const handleCancel = () => {
        const prevValue = selectedMaster?.options?.find((item) => item?.id === editableId)
        setNewLabel(prevValue?.label)
        setEditableId('')
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (newLabel?.length === 0) {
            setErrors((prev) => ({ ...prev, label: true }));
            toast.error("Please fill Label");
            handleFormError(label_ref);
            return;
        }

        let payload = {
            id: editableId,
            label: newLabel
        }

        dispatch(editMasterOption(payload))
            .then((res) => {
                if (res?.success) {
                    dispatch(getMasterList());
                    setEditableId('');
                    setNewLabel("");
                }
            })
            .catch((error) => {
                console.log("error-", error);
            });
    };

    return (
        <div className="masterDetailsMain">
            <button onClick={() => navigate(`/settings/master-list`)} className="close_nav header_close">Close</button>

            <div className="masterDetailsBody">
                <div className="masterBodyHead">
                    <div className="masterBodyHeadLeft">{selectedMaster?.label} Master List</div>
                    {/* <div className="masterBodyHeadRight">
                        <div className="masterBodyHeadRightIcon"> <Pencil size={22} /></div>
                        <div className="masterBodyHeadRightText">Edit</div>
                    </div> */}
                </div>
                <div className="masterBodyBottomMain">
                    {/* <div className="masterBodyBottom">
                        {selectedMaster?.options?.map((item) => <div key={item.id} className={`masterBodyText ${editableId === item.id ? "editable" : ""}`}>
                            <input type="text" value={item.label}
                                disabled={editableId !== item.id}
                                onChange={(e) => handleChange(item.id, e.target.value)}
                                className={editableId === item.id ? "editable" : ""}
                            />
                            <div className="masterBodyBottomEditIcon" onClick={() => handleEdit(item.id)}> <Pencil
                                style={editableId === item.id ? { display: 'none' } : {}} size={20} /></div>
                        </div>)}
                    </div> */}
                    <div className="masterBodyBottom">
                        {selectedMaster?.options?.map((item) => <div key={item?.id} className={`masterBodyText ${editableId === item?.id ? "editable" : ""}`}>
                            <input
                                ref={label_ref}
                                type="text"
                                name="label"
                                value={editableId === item?.id ? newLabel : item?.label}
                                disabled={editableId !== item?.id}
                                onChange={handleChange}
                                className={editableId === item?.id ? "editable" : ""}
                            />
                            <div className="masterBodyBottomEditIcon" onClick={() => handleEdit(item?.id, item?.label)}> <Pencil
                                style={editableId === item?.id ? { display: 'none' } : {}} size={20} /></div>
                        </div>)}
                    </div>
                </div>
                {/* {editableId &&
                    <div className="newMasterPopupFooter">
                        <div className="newMasterpopupFooterAddBtn">SAVE</div>
                        <div className="newMasterpopupFooterCancelBtn" onClick={handleCancel}>CANCEL</div>
                    </div>
                } */}
                {editableId &&
                    <div className="Master">
                        <SaveBtn handleSubmit={handleUpdate} btntype=' '
                            viewMode={'edit'} loading={masterEdit?.loading} color='#fff' />
                    </div>

                }
            </div>
        </div>
    )
}
