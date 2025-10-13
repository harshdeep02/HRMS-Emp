import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import './PopUpEditor.scss';

/**
 * A reusable popup editor component using PrimeReact's Dialog and Editor.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.visible - Controls the visibility of the dialog.
 * @param {function} props.onHide - Callback function to execute when the dialog is hidden.
 * @param {string} props.headerText - The title text for the dialog header.
 * @param {string} props.initialValue - The initial HTML content for the editor.
 * @param {function} props.onSave - Callback function that receives the editor content when the 'Update' button is clicked.
 */
const PopUpEditor = ({ visible, onHide, headerText, initialValue, onSave }) => {
  const [content, setContent] = useState(initialValue);

  // Update internal state if the initialValue prop changes
  useEffect(() => {
    setContent(initialValue);
  }, [initialValue]);

  const handleSave = () => {
    if (onSave) {
      onSave(content);
    }
    onHide(); // Close the dialog after saving
  };

  // Customizing the toolbar to match the image
  const editorHeader = (
    <span className="ql-formats">
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic" aria-label="Italic"></button>
      <button className="ql-underline" aria-label="Underline"></button>
      <button className="ql-link" aria-label="Link"></button>
      <select className="ql-align" aria-label="Alignment"></select>
    </span>
  );

  const dialogFooter = (
    <div>
      <Button label="Update" icon="pi pi-check" onClick={handleSave} className="p-button-primary"/>
    </div>
  );

  return (
      <Dialog
        header={headerText}
        visible={visible}
        style={{ width: '50vw' }}
        onHide={onHide}
        footer={dialogFooter}
        className="popup-editor-dialog"
        modal
        blockScroll
      >
        <Editor
          value={content}
          onTextChange={(e) => setContent(e.htmlValue)}
          style={{ height: '320px' }}
          headerTemplate={editorHeader}
        />
      </Dialog>
  
  );
};

// PropTypes for type-checking
PopUpEditor.propTypes = {
  visible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  headerText: PropTypes.string,
  initialValue: PropTypes.string,
  onSave: PropTypes.func.isRequired,
};

// Default values for props
PopUpEditor.setDefaultProps = {
  headerText: 'Edit Content',
  initialValue: '',
};

export default PopUpEditor;
