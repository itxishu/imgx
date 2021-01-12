import React, { Component } from 'react';
import { isSupportWebp } from './utils';

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
      isWebp: false,
    };
  }

  static defaultProps = {
    src: '', // 图片url
    delayTime: 1, // 动画持续时间
    isHttps: true, // 图片是否必须https
    imageLoadType: 'qiniu', // 低清晰图类型，默认qiniu七牛
    placeholderSrc: '', // 自定义低清晰url
    // beforeLoad: () => {} // 加载后回调
    // onClick: () => {} // 点击事件
    // errorImgUrl: "url", // 图片加载失败后，显示的图片
  };

  componentDidMount() {
    this.setState({ isWebp: isSupportWebp() });
  }

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
    beforeLoad?.(); // 回调

    // 动效remove
    this.blurTimer = setTimeout(() => {
      clearTimeout(this.blurTimer);
      this.setState({
        blurLayoutCss: {
          zIndex: -1,
          display: 'none',
        },
      });
    }, _time * 1000);
  };

  // 占位符图片url
  handlePlaceholderSrc = () => {
    const { imageLoadType, src, placeholderSrc, isHttps } = this.props;
    let curSrc = src;
    if (isHttps) {
      curSrc = pattern.test(src) ? this.fillerPlaceholderSrc(src) : defaultImg;
    }
    // 占位低清晰图支持类型
    const newImgType = {
      qiniu: `${curSrc}?imageMogr2/thumbnail/100x100`,
      oss: '',
      custom: placeholderSrc, // 用户自定义
    };
    return newImgType[imageLoadType] || '';
  };

  // 过滤缩略图参数
  fillerPlaceholderSrc = (url) => {
    let newUrlStr = url;
    if (/\?(imageView2|imageMogr2)\//.test(newUrlStr)) {
      const reg = newUrlStr.match(/(?<u>.*)\?.*/);
      newUrlStr = reg?.groups?.u || newUrlStr;
    }
    return newUrlStr || '';
  };

  addImgUrlWebp = (url, fixUrl = '') => {
    let newUrlStr = url;
    const isUrlFormat = /\/(format)\/(.*)/g.test(newUrlStr);
    // 转换格式容错处理
    if (!isUrlFormat) {
      const tailFixStr = /\/$/g.test(newUrlStr) ? '' : '/';
      newUrlStr += `${fixUrl}${tailFixStr}format/webp`;
    }
    return newUrlStr;
  };

  // 图片url
  getLoadedImgUrl = () => {
    const { src } = this.props;
    const { isWebp } = this.state;
    let newUrlStr = src;

    // 兼容webp格式
    if (/\?(imageView2|imageMogr2)\//.test(newUrlStr) && isWebp) {
      newUrlStr = this.addImgUrlWebp(newUrlStr);
    } else if (isWebp) {
      newUrlStr = this.addImgUrlWebp(newUrlStr, '?imageMogr2');
    }

    return newUrlStr;
  };

  render() {
    const { height, width, className, onClick, alt, errorImgUrl } = this.props;
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
        <img
          onLoad={this.onLoad}
          src={this.getLoadedImgUrl()}
          onError={(e) => {
            if (errorImgUrl) {
              e.target.onerror = null;
              e.target.src = `${errorImgUrl}`;
            }
          }}
          alt={alt || ''}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
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
            src={this.handlePlaceholderSrc()}
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

export default Imgx;
export { Imgx };
