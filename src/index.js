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
      imgUrl: '',
      imgDom: null,
    };
  }

  static defaultProps = {
    src: '', // 图片url
    delayTime: 0.6, // 动画持续时间
    isHttps: true, // 图片是否必须https
    imageLoadType: 'qiniu', // 低清晰图类型，默认qiniu七牛
    placeholderSrc: '', // 自定义低清晰url
    // beforeLoad: () => {} // 加载后回调
    // onClick: () => {} // 点击事件
  };

  componentDidMount() {
    this.setState({
      imgUrl: this.handleLoadImg(), // 缩略小图
      imgDom: this.lazyLoadImage(),
    });
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
      qiniu: `${curSrc}?imageMogr2/thumbnail/10x10`,
      oss: '',
      custom: placeholderSrc, // 用户自定义
    };
    return newImgType[imageLoadType] || '';
  };

  // 过滤参数
  handleImgUrl = (url) => {
    let newUrlStr = url;
    if (/\?(imageView2|imageMogr2)\//.test(newUrlStr)) {
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
    let newUrlStr = imgProps.src;
    const isWebp = isSupportWebp();
    // 兼容webp格式
    if (/\?(imageView2|imageMogr2)\//.test(newUrlStr) && isWebp) {
      const isUrlFormat = /\/(format)\/(.*)/g.test(newUrlStr);
      // 转换格式容错处理
      if (!isUrlFormat) {
        const tailFixStr = /\/$/g.test(newUrlStr) ? '' : '/';
        newUrlStr += `${tailFixStr}format/webp`;
      }
    }

    return (
      <img
        onLoad={this.onLoad}
        {...imgProps}
        src={newUrlStr}
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
    const { loadedClassName, blurLayoutCss, imgDom } = this.state;

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
        {imgDom}
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
            src={this.state.imgUrl}
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
