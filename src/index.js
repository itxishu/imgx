import React, { useState, useEffect, useRef } from 'react';
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

const Imgx = ({
  src = '', // 图片url
  delayTime = 1, // 动画持续时间
  isHttps = true, // 图片是否必须https
  imageLoadType = 'qiniu', // 低清晰图类型，默认qiniu七牛
  placeholderSrc = '', // 自定义低清晰url
  className,
  height,
  width,
  beforeLoad, // 加载后回调
  onClick, // 点击事件
  errorImgUrl, // 图片加载失败后，显示的图片
  alt,
}) => {
  const imgRef = useRef(null);
  let blurTimer = useRef(null);
  // const [loaded, setLoaded] = useState(false);
  const [blurLayoutCss, setBlurLayoutCss] = useState({
    zIndex: 1,
  });
  const [loadedClassName, setLoadedClassName] = useState(imglazyLoadInit);
  const [imgLazyedDom, setImgLazyedDom] = useState(null);

  useEffect(() => {
    return () => {
      blurTimer.current = null;
    };
  }, []);

  useEffect(() => {
    const isWebp = isSupportWebp();
    const _imgDom = loadedImg(isWebp);
    setImgLazyedDom(_imgDom);
  }, [src, placeholderSrc]);

  // 图片加载完
  const onLoad = () => {
    const _time = delayTime ?? 0.6;
    // setLoaded(true);
    setLoadedClassName({
      transitionDuration: `${_time}s`,
      ...imglazyLoadLoaded,
    });
    beforeLoad?.(imgRef.current); // 回调

    // 动效remove
    blurTimer.current = setTimeout(() => {
      setBlurLayoutCss({
        zIndex: -1,
        display: 'none',
      });
    }, _time * 1000);
  };

  // 占位符图片url
  const handlePlaceholderSrc = () => {
    let curSrc = src;
    if (isHttps) {
      curSrc = pattern.test(src) ? fillerPlaceholderSrc(src) : defaultImg;
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
  const fillerPlaceholderSrc = (url) => {
    let newUrlStr = url;
    if (/\?(imageView2|imageMogr2)\//.test(newUrlStr)) {
      const reg = newUrlStr.match(/(?<u>.*)\?.*/);
      newUrlStr = reg?.groups?.u || newUrlStr;
    }
    return newUrlStr || '';
  };

  const addImgUrlWebp = (url, fixUrl = '') => {
    let newUrlStr = url;
    const isUrlFormat = /\/(format)\/(.*)/g.test(newUrlStr);
    // 转换格式容错处理
    if (!isUrlFormat) {
      const tailFixStr = /\/$/g.test(newUrlStr) ? '' : '/';
      newUrlStr += `${fixUrl}${tailFixStr}format/webp`;
    }
    return newUrlStr;
  };

  const loadedImg = (isWebp) => {
    let newUrlStr = src;

    // 兼容webp格式
    if (/\?(imageView2|imageMogr2)\//.test(newUrlStr) && isWebp) {
      newUrlStr = addImgUrlWebp(newUrlStr);
    } else if (isWebp) {
      newUrlStr = addImgUrlWebp(newUrlStr, '?imageMogr2');
    }

    return (
      <img
        ref={imgRef}
        onLoad={onLoad}
        src={newUrlStr}
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
    );
  };

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
      {imgLazyedDom}
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
          src={handlePlaceholderSrc()}
          style={{
            width: '100%',
            height: '100%',
          }}
        ></img>
      </div>
    </div>
  );
};

export default Imgx;
export { Imgx };
