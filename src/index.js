import React, { Component } from 'react';
import PropTypes from 'prop-types';

const pattern = new RegExp('http(s)?://[^s]*');
const defaultImg = 'https://img.kaikeba.com/22857172219102bybu.jpeg';

class Imgx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  static defaultProps = {
    imageLoadType: 'qiniu',
    delayTime: 1.6,
  };

  // 图片加载完
  onLoad = () => {
    const { beforeLoad } = this.props;
    this.setState({
      loaded: true,
    });
    beforeLoad && beforeLoad(); // 回调
  };

  // 占位符图片url
  handleLoadImg = () => {
    const { imageLoadType, src, placeholderSrc } = this.props;
    const curSrc = pattern.test(src) ? src : defaultImg;
    // 占位低清晰图支持类型
    const newImgType = {
      qiniu: `${curSrc}?imageMogr2/thumbnail/200x200/blur/1x0/quality/15|imageslim`,
      oss: '',
      custom: placeholderSrc, // 用户自定义
    };
    return newImgType[imageLoadType] || '';
  };

  // 图片组件
  getImg = () => {
    const {
      delayTime,
      placeholderSrc,
      wrapperClassName,
      wrapperProps,
      imageLoadType,
      beforeLoad,
      ...imgProps
    } = this.props;
    const { loaded } = this.state;

    return <img onLoad={this.onLoad} {...imgProps} />;
  };

  getWrappedLazyLoadImage(lazyLoadImage) {
    const { height, width, wrapperClassName, wrapperProps, delayTime } = this.props;
    const { loaded } = this.state;

    const loadedClassName = loaded ? 'imglazy-load-image-loaded' : 'imglazy-load-image-init';

    return (
      <span
        className={`imglazy-load-wrap ${loadedClassName} ${wrapperClassName || ''}`}
        style={{
          backgroundImage: loaded ? `` : `url(${this.handleLoadImg()})`,
          backgroundSize: loaded ? '' : '100% 100%',
          color: 'transparent',
          display: 'inline-block',
          height: height,
          width: width,
          animationDuration: `${delayTime || 2.6}s`,
        }}
        {...wrapperProps}
      >
        {lazyLoadImage}
      </span>
    );
  }

  render() {
    const lazyLoadImage = this.getImg();
    return this.getWrappedLazyLoadImage(lazyLoadImage);
  }
}

Imgx.propTypes = {
  imageLoadType: PropTypes.string, // 低清晰图默认类型qiniu，类型custom 可自定义低清晰图片url
  placeholderSrc: PropTypes.string, // 自定义占位低清晰图url
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  delayTime: PropTypes.number, // 动画持续时间
  src: PropTypes.string.isRequired,
  beforeLoad: PropTypes.func, // 加载后回调
};

export default Imgx;
export { Imgx };
