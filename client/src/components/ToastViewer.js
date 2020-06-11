import React, { useState, useEffect } from 'react';
import { Toast } from 'react-bootstrap';
import ImageHelper from './ImageHelper';

const ToastViewer = props => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(props.show);
  });

  const handleClose = () => {
    setShow(false);
    props.setShow();
  };

  return (
    props.show && (
      <Toast
        style={{
          position: 'absolute',
          top: 10,
          right: 10
        }}
        onClose={handleClose}
        show={show}
        autohide
        delay={5000}
      >
        <Toast.Header className={props.mode + '-header'}>
          <ImageHelper mode={props.mode} className="toast-image" />
          <strong className="mr-auto">{props.header}</strong>
          <small>just now</small>
        </Toast.Header>
        <Toast.Body className={props.mode + '-body'}>{props.body}</Toast.Body>
      </Toast>
    )
  );
};

export default ToastViewer;
