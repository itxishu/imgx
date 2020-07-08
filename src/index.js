import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

const pattern = new RegExp('http(s)?://[^s]*');
const defaultImg = 'https://img.kaikeba.com/22857172219102bybu.jpeg';

class Imgx extends Component {
  state = {
    loaded: false,
    widthNum: '100%',
    imgStyle: styles.blurImg,
  };
  onLoad = () => {
    this.setState({
      loaded: true,
      imgStyle: styles.blurImgAni,
    });
  };
  render() {
    let { src, imageProcess, width, ...props } = this.props;
    const { loaded, widthNum } = this.state;
    const curSrc = pattern.test(src) ? src : defaultImg;
    const num = width || widthNum;
    src = loaded ? `${src}` : `${curSrc}${imageProcess}`;
    return (
      <img
        src={src}
        width={num}
        onLoad={this.onLoad}
        {...props}
        className={`${props.className || ''} ${this.state.imgStyle}`}
      />
    );
  }
}

Imgx.propTypes = { imageProcess: PropTypes.string };
Imgx.defaultProps = {
  imageProcess: '?imageMogr2/thumbnail/200x200/blur/1x0/quality/15|imageslim',
};

export { Imgx };
