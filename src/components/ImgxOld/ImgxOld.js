import React from 'react';
import LoadedImg from './components/LoadedImg';
import { isSupportWebp, addImgUrlWebp, checkServer } from './utils';
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

class Imgx extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      blurLayoutCss: {
        zIndex: 1,
      },
      loadedClassName: imglazyLoadInit,
      imgDom: null,
    };
  }

  static defaultProps = {
    src: '', // 图片url
    delayTime: 1.3, // 动画持续时间
    isHttps: true, // 图片是否必须https
    imageLoadType: 'qiniu', // 低清晰图类型，默认qiniu七牛
    placeholderSrc: '', // 自定义低清晰url
    // beforeLoad: () => {} // 加载后回调
    // onClick: () => {} // 点击事件
    // errorImgUrl: "url", // 图片加载失败后，显示的图片
  };

  componentWillUnmount() {
    this.blurTimer = null;
  }

  // 图片加载完
  onLoad = (imgRef) => {
    const { beforeLoad, delayTime } = this.props;
    const _time = delayTime ?? 0.6;
    this.setState({
      loaded: true,
      loadedClassName: {
        transitionDuration: `${_time}s`,
        ...imglazyLoadLoaded,
      },
    });
    beforeLoad?.(imgRef);

    // 动效remove
    this.blurTimer = setTimeout(() => {
      // clearTimeout(this.blurTimer);
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
    let fillUrl = url;
    if (/\?(imageView2|imageMogr2)\//.test(fillUrl)) {
      const reg = fillUrl.match(/(?<u>.*)\?.*/);
      fillUrl = reg?.groups?.u || fillUrl;
    }
    return fillUrl || '';
  };

  loadedImg = () => {
    const { alt, errorImgUrl, src, className } = this.props;
    const isWebp = isSupportWebp();
    let newUrlStr = src;
    // 兼容webp格式
    if (/\?(imageView2|imageMogr2)\//.test(newUrlStr) && isWebp) {
      newUrlStr = addImgUrlWebp(newUrlStr);
    } else if (isWebp) {
      newUrlStr = addImgUrlWebp(newUrlStr, '?imageMogr2');
    }

    return (
      <img
        ref={(refs) => (this.imgRef = refs)}
        onLoad={() => this.onLoad(this.imgRef)}
        src={newUrlStr}
        onError={(e) => {
          if (errorImgUrl) {
            e.target.onerror = null;
            e.target.src = `${errorImgUrl}`;
          }
        }}
        alt={alt || ''}
        className={className || ''}
      />
    );
  };

  render() {
    const { height, width, wrapperClassName, onClick } = this.props;
    const { loadedClassName, blurLayoutCss } = this.state;

    return (
      <div
        className={`${wrapperClassName || ''}`}
        style={{
          width,
          height,
          position: 'relative',
        }}
        onClick={onClick}
      >
        {this.loadedImg()}
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
