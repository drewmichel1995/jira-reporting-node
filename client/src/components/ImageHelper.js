import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import deleteImg from '../images/delete.png';
import editImg from '../images/edit.png';
import saveImg from '../images/save.png';
import addImg from '../images/add.png';
import successImg from '../images/success.png';
import errorImg from '../images/error.png';
import downloadImg from '../images/download.png';
import uploadImg from '../images/upload.png';
import discardImg from '../images/discard.png';
import React from 'react';

const iconObj = {
  'delete': deleteImg,
  'edit': editImg,
  'save': saveImg,
  'add': addImg,
  'success': successImg,
  'error': errorImg,
  'download': downloadImg,
  'upload': uploadImg,
  'discard': discardImg,
};

const tooltipObj = {
  'delete': 'Discard Changes',
  'edit': 'Edit',
  'save': 'Save',
  'add': 'Add Row',
  'success': 'Success',
  'error': 'Error',
  'download': 'Download CSV',
  'upload': 'Upload CSV',
  'discard': 'Delete Selected Rows',
};

class ImageHelper extends React.Component {
  render() {
    return (
      <OverlayTrigger
        key="bottom"
        placement="bottom"
        overlay={
          <Tooltip id={`tooltip-${this.props.mode}`}>
            {tooltipObj[this.props.mode]}
          </Tooltip>
        }
      >
        <img
          style={{
            width: this.props.width,
            color: this.props.color,
            justifyContent: 'center',
          }}
          alt={this.props.mode}
          src={iconObj[this.props.mode]}
          className={this.props.className}
        />
      </OverlayTrigger>
    );
  }
}

ImageHelper.defaultProps = {
  width: '1.5rem',

  color: 'gainsboro',
};

export default ImageHelper;
