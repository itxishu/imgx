import React, { Component } from 'react';
import PropTypes from 'prop-types';

const pattern = new RegExp('http(s)?://[^s]*');
const defaultImg = 'https://img.kaikeba.com/22857172219102bybu.jpeg';

const imglazyLoadInit = {
  filter: 'blur(20px)',
  opacity: 1,
};
const imglazyLoadLoaded = {
  filter: 'blur(0px)',
  opacity: 0,
  transition: 'filter ease 1',
  animationFillMode: 'both',
};

class Imgx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      blurLayoutCss: {
        zIndex: 1,
      },
      loadedClassName: imglazyLoadInit,
    };
  }

  static defaultProps = {
    imageLoadType: 'qiniu',
    delayTime: 0.6,
    isHttps: true,
  };

  componentWillUnmount() {
    this.blurTimer = null;
  }

  // 图片加载完
  onLoad = () => {
    const { beforeLoad, delayTime } = this.props;
    const _time = delayTime ?? 0.6;
    this.setState({
      loaded: true,
      loadedClassName: {
        transitionDuration: `${_time}s`,
        ...imglazyLoadLoaded,
      },
    });
    beforeLoad && beforeLoad(); // 回调

    // 动效remove
    this.blurTimer = setTimeout(() => {
      this.setState({
        blurLayoutCss: {
          zIndex: -1,
          display: 'none',
        },
      });
    }, _time * 1000);
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
      qiniu: `${curSrc}?imageMogr2/thumbnail/100x100`,
      oss: '',
      custom: placeholderSrc, // 用户自定义
    };
    return newImgType[imageLoadType] || '';
  };

  handleImgUrl = (url) => {
    let newUrlStr = url;
    if (/\?imageView2\//.test(newUrlStr)) {
      const reg = newUrlStr.match(/(?<u>.*)\?.*/);
      newUrlStr = reg?.groups?.u || newUrlStr;
    }
    return newUrlStr || '';
  };

  // 图片组件
  lazyLoadImage = () => {
    const {
      delayTime,
      placeholderSrc,
      wrapperProps,
      imageLoadType,
      beforeLoad,
      isHttps,
      ...imgProps
    } = this.props;

    return (
      <img
        onLoad={this.onLoad}
        {...imgProps}
        style={{
          // display: this.state.loaded ? 'inline-block' : 'none',
          width: '100%',
          height: '100%',
        }}
      />
    );
  };

  render() {
    const { height, width, className, onClick } = this.props;
    const { loadedClassName, blurLayoutCss } = this.state;

    return (
      <div
        className={`${className || ''}`}
        style={{
          height: height,
          width: width,
          color: 'red',
          position: 'relative',
        }}
        onClick={onClick}
      >
        {this.lazyLoadImage()}
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
            backgroundColor: 'transparent',
            ...loadedClassName,
            ...blurLayoutCss,
          }}
        >
          <img
            src={this.handleLoadImg()}
            style={{
              width: '100%',
              height: '100%',
            }}
          ></img>
        </div>
      </div>
    );
  }
}

Imgx.propTypes = {
  imageLoadType: PropTypes.string, // 低清晰图类型，custom自定义, qiniu七牛
  placeholderSrc: PropTypes.string, // 自定义低清晰url
  delayTime: PropTypes.number, // 动画持续时间
  src: PropTypes.string.isRequired,
  beforeLoad: PropTypes.func, // 加载后回调
  onClick: PropTypes.func,
  isHttps: PropTypes.bool, // 图片是否必须https
};

export default Imgx;
export { Imgx };
