import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = props => {
  return (
    <Modal.Dialog
      style={{
        position: 'absolute',
        top: '50px',
        right: '50%'
      }}
    >
      <Modal.Header className={props.mode + '-modal-header'}>
        <Modal.Title className="confirm-modal-header">
          {props.title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className={props.mode + '-modal-body'}>
        <p>{props.body}</p>
      </Modal.Body>

      <Modal.Footer className={props.mode + '-modal-footer'}>
        <Button
          onClick={props.firstButton}
          variant="danger"
          className="modal-button"
        >
          {props.firstText}
        </Button>
        <Button
          onClick={props.secondButton}
          variant="secondary"
          className="modal-button"
        >
          {props.secondText}
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default ConfirmModal;
