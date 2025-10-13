import { useState, useEffect } from 'react';
import './AddEmloyee.scss';
import './NavbarForm.scss';
import { toast } from "react-toastify";
import { Pencil, Trash2, FolderPen, Info, FileUp, Eye, X, CirclePlus, Calendar } from 'lucide-react';
import FormDatePicker from '../../../utils/common/FormDatePicker.jsx';
import TextAreaWithLimit from '../../../utils/common/TextAreaWithLimit.jsx';
import { DocumentUpload } from '../../../utils/common/DocumentUpload/DocumentUpload.jsx';
import SelectDropdown from '../../../utils/common/SelectDropdown/SelectDropdown.jsx';
import { showMasterData, showMastersValue } from '../../../utils/helper.js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SaveButton from '../../../utils/common/SaveButton.jsx';
import ConfirmPopup from '../../../utils/common/ConfirmPopup.jsx';
import { addEmpRemark, removeEmpRemark } from '../../../Redux/Actions/employeeActions.js';
import './remarks.scss';
import ListDataNotFound from '../../../utils/common/ListDataNotFound.jsx';

const initialRemarkState = {
  remark_type: "",
  issued_date: "",
  description: "",
  remark_attachment: null,
};

const RemarksForm = ({ isEditPage, isEditMode, setIsEditMode, formData, setFormData, id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addUpdateRemark = useSelector((state) => state?.addEmpRemark);
  const deleteRemark = useSelector((state) => state?.deleteEmpRemark);

  const [currentRemark, setCurrentRemark] = useState(initialRemarkState);
  const [editingIndex, setEditingIndex] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRemId, setSelectedRemId] = useState(null);

  const remarks_type_options = showMasterData("11");
  const masterData = useSelector(state => state?.masterData?.data);

  useEffect(() => {
    if (editingIndex !== null) {
      setCurrentRemark(formData?.remarks[editingIndex]);
      window.scrollTo(0, 0);
    }
  }, [editingIndex, formData?.remarks]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrentRemark(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setCurrentRemark(prev => ({ ...prev, [name]: date }));
  };

  const handleSelect = (name, value) => {
    setCurrentRemark(prev => ({ ...prev, [name]: value?.id }));
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setCurrentRemark(formData?.remarks[index]);
    setShowPopup(true);
    setIsEditMode(true);
    navigate(`/edit-employee/${id}`);
  };

  const handleNew = () => {
    setCurrentRemark(initialRemarkState);
    setShowPopup(true);
    setIsEditMode(true);
  };

  const handleView = (index) => {
    setEditingIndex(index);
    setCurrentRemark(formData?.remarks[index]);
    setShowPopup(true);
  };

  const handleDeleteClick = (rem_id) => {
    setSelectedRemId(rem_id);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedRemId) return;
    const sendData = { user_id: id, remark_id: selectedRemId };
    dispatch(removeEmpRemark(sendData)).then((res) => {
      if (res?.success) {
        const filteredRemarks = (res?.remarks?.length > 0) ? res?.remarks?.map((item) => ({
          id: item?.id,
          remark_type: item?.remark_type || "",
          issued_date: item?.issued_date || "",
          description: item?.description || "",
          remark_attachment: JSON.parse(item?.remark_attachment || null),
        })) : [];
        setFormData(prev => ({ ...prev, remarks: filteredRemarks }));
        setShowModal(false);
        setSelectedRemId(null);
      }
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setCurrentRemark(initialRemarkState);
    setShowPopup(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentRemark?.remark_type) {
      toast.error("Remark Type is required.");
      return;
    }
    const formDataToSubmit = {
      user_id: id,
      remarks: [{
        ...currentRemark,
        remark_attachment: typeof currentRemark?.remark_attachment === "string"
          ? currentRemark?.remark_attachment
          : currentRemark?.remark_attachment
            ? JSON.stringify(currentRemark?.remark_attachment)
            : null
      }]
    };
    dispatch(addEmpRemark(formDataToSubmit)).then((res) => {
      if (res?.success) {
        navigate(`/employee-details/${id}`);
        const filteredRemarks = (res?.remarks?.length > 0) ? res?.remarks?.map((item) => ({
          id: item?.id,
          remark_type: item?.remark_type || "",
          issued_date: item?.issued_date || "",
          description: item?.description || "",
          remark_attachment: JSON.parse(item?.remark_attachment || null),
        })) : [];
        setFormData((prev) => ({ ...prev, remarks: filteredRemarks }));
        handleCancel();
      }
    });
  };

  return (
    <div
      id="Remarks_form_container"
      className={` ${isEditPage ? 'isEditPage' : ''} ${showPopup ? "popup-overlay" : "Dcumnet_forms"} ${showPopup ? "active" : ""}`}
    >
      <ConfirmPopup
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        type="delete"
        module="Remark"
        loading={deleteRemark?.loading}
      />

      <div className={`${showPopup ? 'popup-content' : ''}`}>
        <div id='form' className='bEdit'>
          <div className='div_heading head_pop'>
            <div>
              <h2>Remarks</h2>
              <p className='ppp'>Basic employee remarks</p>
            </div>
            {showPopup &&
              <div
                onClick={handleCancel}
                className="action-btn close-btn">
                <X size={22} />
              </div>
            }
            {isEditMode && !showPopup &&
              <div
                onClick={() => handleNew()}
                className="action-btn add-btn">
                <CirclePlus size={20} /> Add
              </div>
            }
          </div>

          {!showPopup && !isEditMode && (
            <div className="header-actions">
              <button className="action-btn edit_btn" onClick={() => { setIsEditMode(true); navigate(`/edit-employee/${id}`) }}>
                Edit
              </button>
            </div>
          )}

          {showPopup &&
            <>
              <div className="from1">
                <div className="form-group">
                  <label><FolderPen size={20} />Remark Type</label>
                  <SelectDropdown
                    selectedValue={currentRemark?.remark_type}
                    options={remarks_type_options}
                    onSelect={handleSelect}
                    type="remark_type"
                    disabled={!isEditMode}
                  />
                </div>

                <div className="form-group">
                  <label> <Calendar size={20} strokeWidth={1.25} /> <p>Issued Date</p></label>
                  <FormDatePicker
                    label="Issued Date"
                    onDateChange={handleDateChange}
                    initialDate={currentRemark?.issued_date}
                    type="issued_date"
                    disabled={!isEditMode}
                  />
                </div>

                <div className="form-group attachment_form">
                  <label><Info size={20} />Description</label>
                  <TextAreaWithLimit
                    name="description"
                    value={currentRemark?.description}
                    formsValues={{
                      handleChange: handleChange,
                      form: currentRemark
                    }}
                    disabled={!isEditMode}
                  />
                </div>

                <div className="form-group attachment_form">

                  <label><FileUp size={20} />Upload Attachments</label>
                  <DocumentUpload
                    formData={{ remarks: [currentRemark] }}
                    setFormData={(data) => setCurrentRemark(data?.remarks[0])}
                    loading={imageUploading}
                    setLoading={setImageUploading}
                    section="remarks"
                    index={0}
                    fieldName="remark_attachment"
                    fileName="Upload Document"
                    className='full_w'
                    disabled={!isEditMode}
                  />
                </div>
              </div>

              {isEditMode &&
                <div className="form-actions-footer">
                  <SaveButton
                    loading={addUpdateRemark?.loading}
                    editingIndex={editingIndex}
                    handleSubmit={handleSave}
                    handleCancel={handleCancel}
                  />
                </div>
              }
            </>
          }
        </div>

        {!showPopup && (
          <>
            <hr style={{ marginBottom: '0px' }} className='hr_line' />
            {formData?.remarks?.length > 0 &&
              formData?.remarks?.map((remark, index) => (
                remark?.remark_type && (
                  <div className="saved-list-container" key={remark?.id || index}>
                    <div className={`saved-experience-item ${!isEditMode ? 'isEditMode_card_item' : ''}`}>
                      <div className="item-details">
                        <p className="item-company">{showMastersValue(masterData, "11", remark?.remark_type)}</p>
                        <p className="item-role-dates">{remark?.issued_date || "No Date"}</p>
                      </div>
                      <div className="item-actions">
                        {isEditMode ?
                          <>
                            <div onClick={() => handleEdit(index)} className="action-btn edit-btn">
                              Edit
                            </div>
                            <div onClick={() => handleDeleteClick(remark?.id)} className="action-btn delete-btn">
                              <Trash2 size={16} /> Delete
                            </div>
                          </>
                          :
                          <>
                            <div onClick={() => handleView(index)} className="action-btn edit-btn">
                              <Eye size={16} /> View
                            </div>
                          </>
                        }
                      </div>
                    </div>
                  </div>
                )
              ))
            }
          </>
        )}
      </div>
      {formData?.experiences?.length === 0 && !showModal && !showPopup && (
        <ListDataNotFound module="Remark" form={true} />
      )}
    </div>
  );
};

export default RemarksForm;
