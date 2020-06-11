import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import DropZone from './DropZone';

const UploadModal = (props) => {
  return (
    <Modal.Dialog
      style={{
        position: 'fixed',
        top: '25%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Modal.Header className={props.mode + '-modal-header'}>
        <Modal.Title className="confirm-modal-header">
          {'Upload: ' + props.sheet + ' csv'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className={props.mode + '-modal-body'}>
        <DropZone sendFile={props.sendFile} sheet={props.sheet} />
      </Modal.Body>
      <Modal.Footer className={props.mode + '-modal-footer'}>
        <Button
          onClick={() => props.setUpload(false)}
          variant="secondary"
          className="modal-button"
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default UploadModal;
