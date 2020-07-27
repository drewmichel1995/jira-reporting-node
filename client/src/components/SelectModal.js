import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const SelectModal = props => {

  const onStatusSelect = (event) => {
    props.setStatus(event.target.value);
  }
  
  return (
    <Modal  show={props.show} onHide={props.secondButton}>
      <Modal.Header className={props.mode + '-modal-header'}>
        <Modal.Title className="confirm-modal-header">
          {props.title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className={props.mode + '-modal-body'}>
        <p>{props.body}</p>
        <Form.Control
          as="select"
          className="my-1 mr-sm-2"
          id="inlineFormCustomSelectPref"
          onChange={onStatusSelect}
         >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </Form.Control>
      </Modal.Body>

      <Modal.Footer className={props.mode + '-modal-footer'}>
        <Button
          onClick={props.firstButton}
          variant="primary"
          className="modal-button"
        >
          {props.firstText}
        </Button>
        <Button
          onClick={props.secondButton}
          variant="danger"
          className="modal-button"
        >
          {props.secondText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SelectModal;
