import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import './css/blur.css';

const pattern = new RegExp('http(s)?://[^s]*');
const defaultImg = 'https://img.kaikeba.com/22857172219102bybu.jpeg';

const imglazyLoadInit = {
  width: '100%',
  filter: 'blur(20px)',
  color: 'transparent',
  display: 'inline-block',
};
const imglazyLoadLoaded = {
  ...imglazyLoadInit,
  filter: 'blur(0px)',
  transition: 'filter ease 1',
  animationFillMode: 'both',
};

class Imgx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loadedClassName: imglazyLoadInit,
    };
  }

  static defaultProps = {
    imageLoadType: 'qiniu',
    delayTime: 0.6,
    isHttps: true,
  };

  // 图片加载完
  onLoad = () => {
    const { beforeLoad, delayTime } = this.props;
    this.setState({
      loaded: true,
      loadedClassName: {
        transitionDuration: `${delayTime || 0.6}s`,
        ...imglazyLoadLoaded,
      },
    });
    beforeLoad && beforeLoad(); // 回调
  };

  // 占位符图片url
  handleLoadImg = () => {
    const { imageLoadType, src, placeholderSrc, isHttps } = this.props;
    let curSrc = src;
    if (isHttps) {
      curSrc = pattern.test(src) ? this.handleImgUrl(src) : defaultImg;
    }
    // 占位低清晰图支持类型
    const newImgType = {
      qiniu: `${curSrc}?imageMogr2/thumbnail/100x100/blur/1x0/quality/15|imageslim`,
      oss: '',
      custom: placeholderSrc, // 用户自定义
    };
    return newImgType[imageLoadType] || '';
  };

  handleImgUrl = (url) => {
    let newUrlStr = url;
    // qiniu处理
    if (/\?imageView2\//.test(newUrlStr)) {
      const reg = newUrlStr.match(/(?<u>.*)\?.*/);
      newUrlStr = reg?.groups?.u || newUrlStr;
    }
    return newUrlStr || '';
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
      isHttps,
      ...imgProps
    } = this.props;
    const { loaded } = this.state;

    return <img onLoad={this.onLoad} {...imgProps} />;
  };

  getWrappedLazyLoadImage(lazyLoadImage) {
    const { height, width, wrapperClassName, wrapperProps, delayTime } = this.props;
    const { loaded, loadedClassName } = this.state;

    return (
      <span
        className={`imglazy-load-wrap ${wrapperClassName || ''}`}
        style={{
          backgroundImage: loaded ? `` : `url(${this.handleLoadImg()})`,
          backgroundSize: loaded ? '' : '100% 100%',
          height: height,
          width: width,

          ...loadedClassName,
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
  isHttps: PropTypes.bool, // 图片是否必须https
};

export default Imgx;
export { Imgx };
