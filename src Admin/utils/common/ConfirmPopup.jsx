import { Button, Dialog, DialogDismiss, DialogHeading } from "@ariakit/react";
import './ConfirmPopup.css';
import { Info } from 'lucide-react';
import LoadingButton from './LoadingButton';

const ConfirmPopup = ({ open, onClose, onConfirm, type, module, role = "", loading, confimationText }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      getPersistentElements={() => document.querySelectorAll(".Toastify")}
      backdrop={<div className="backdrop" />}
      className="dialog"
    >
      {/* Icon */}
      <div className="icon-wrapper">
        <span className="info-icon"><Info size={48} strokeWidth={2.25} /></span>
      </div>

      {/* Heading */}
      <DialogHeading className="heading">
        {module === "login" ? `Are you sure you want to Login ${type} for this ${role}?` : `Are you sure you want to ${type} ${type === "delete" ? 'this' : ''} ${module}?`}
      </DialogHeading>

      {/* Buttons */}
      <div className="buttons">
        <DialogDismiss
          className="btn cancel-btn"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </DialogDismiss>
        <Button
          className="btn delete-btn"
          disabled={loading}
          onClick={onConfirm}
        >
          {loading ? <LoadingButton loading={loading} color='#fff' /> : (type === "disable" ? "Yes, Disable" : type === "enable" ? "Yes, Enable" : type === "update" ? "Yes, Update" : type === "Sent" ? "Yes, Send" : type === "Approve" ? "Yes, Approve" : type === "Declined" ? "Yes, Declined" : "Yes, Delete")}
        </Button>
      </div>
    </Dialog>
  );
};

export default ConfirmPopup;