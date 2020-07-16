import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import addImg from '../images/add.png';
import React from 'react';

const iconObj = {
  'add': addImg,
};

const tooltipObj = {
  'add': 'Add Row'
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
