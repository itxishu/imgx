import React from 'react';
import { addImgUrlWebp, checkWebpFeature } from '../../utils';

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

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      blurLayoutCss: {
        zIndex: 1,
      },
      loadedClassName: imglazyLoadInit,
      initImg: false,
      iswebp: false,
    };
  }

  componentDidMount() {
    checkWebpFeature().then((res) => {
      this.setState({
        iswebp: res,
        initImg: true,
      });
    });
  }

  componentWillUnmount() {
    this.blurTimer = null;
  }

  // 图片加载完
  onLoad = (imgRef) => {
    const { beforeLoad, delayTime } = this.props;
    const time = delayTime ?? 0.6;
    this.setState({
      loaded: true,
      loadedClassName: {
        transitionDuration: `${time}s`,
        ...imglazyLoadLoaded,
      },
    });
    beforeLoad?.(imgRef);

    // 动效remove
    this.blurTimer = setTimeout(() => {
      clearTimeout(this.blurTimer);
      this.setState({
        blurLayoutCss: {
          zIndex: -1,
          display: 'none',
        },
      });
    }, time * 1000);
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
    const {
      delayTime,
      isHttps,
      imageLoadType,
      placeholderSrc,
      onClick,
      errorImgUrl,
      wrapperClassName,
      beforeLoad,
      src,
      ...imgAll
    } = this.props;
    let newUrlStr = src;
    const { iswebp, initImg } = this.state;
    if (!initImg) return null;
    if (/\?(imageView2|imageMogr2)\//.test(newUrlStr) && iswebp) {
      // 兼容webp格式
      newUrlStr = addImgUrlWebp(newUrlStr);
    } else if (iswebp) {
      newUrlStr = addImgUrlWebp(newUrlStr, '?imageMogr2');
    }

    return (
      <img
        ref={(refs) => {
          this.imgRef = refs;
        }}
        src={newUrlStr}
        alt={imgAll.alt || ''}
        onLoad={() => this.onLoad(this.imgRef)}
        onError={(e) => {
          if (errorImgUrl) {
            e.target.onerror = null;
            e.target.src = `${errorImgUrl}`;
          }
        }}
        loading="lazy"
        decoding="async"
        {...imgAll}
        style={{
          display: this.state.loaded ? 'none' : 'inherit',
        }}
      />
    );
  };

  render() {
    const { height, width, wrapperClassName, onClick, alt } = this.props;
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
            alt={alt}
          />
        </div>
      </div>
    );
  }
}

export default Imgx;
