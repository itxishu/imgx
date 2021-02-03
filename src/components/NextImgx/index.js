import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { checkWebpFeature, getImgGzip } from '../../utils';

const pattern = new RegExp('http(s)?://[^s]*');
const defaultImg = 'https://img.kaikeba.com/22857172219102bybu.jpeg';
const nextImageLoader = ({ src, width, quality, iswebp }) => {
  return getImgGzip({ src, width, quality, iswebp });
};
const imglazyLoadInit = {
  filter: 'blur(8px)',
  opacity: 1,
};
const imglazyLoadLoaded = {
  filter: 'blur(0px)',
  opacity: 0,
  transition: 'filter ease 1',
  animationFillMode: 'both',
};

const NextImgx = ({
  src = '', // 图片url
  delayTime = 0.6, // 动画持续时间
  isHttps = true, // 图片是否必须https
  imageLoadType = 'qiniu', // 低清晰图类型，默认qiniu七牛
  placeholderSrc = '', // 自定义低清晰url
  className,
  wrapperClassName,
  layout,
  height,
  width,
  quality,
  imgHitWidth,
  beforeLoad, // 加载后回调
  onClick, // 点击事件
  errorImgUrl, // 图片加载失败后，显示的图片
  alt,
}) => {
  // const imgRef = useRef(null);
  const blurTimer = useRef(null);
  // const [loaded, setLoaded] = useState(true);
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
    loadedImg().then((imgElement) => {
      setImgLazyedDom(imgElement);
    });
  }, [src, placeholderSrc]);

  // 图片容错处理
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (loaded) {
  //       setLoaded(false);
  //       onLoad();
  //     }
  //   }, 5000);
  // }, []);

  // 图片加载完
  const onLoad = () => {
    const time = delayTime ?? 0.4;
    // setLoaded(true);
    setLoadedClassName({
      transitionDuration: `${time}s`,
      ...imglazyLoadLoaded,
    });
    beforeLoad?.(); // 回调

    // 动效remove
    blurTimer.current = setTimeout(() => {
      setBlurLayoutCss({
        zIndex: -1,
        // display: 'none'
      });
    }, time * 1000);
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

  const loadedImg = async () => {
    const iswebp = await checkWebpFeature();
    return (
      <Image
        // ref={imgRef}
        onLoad={onLoad}
        src={src}
        onError={(e) => {
          if (errorImgUrl) {
            e.target.onerror = null;
            e.target.src = `${errorImgUrl}`;
          }
        }}
        height={height}
        width={width}
        loader={(data) =>
          nextImageLoader({
            src: data.src,
            quality,
            width: imgHitWidth,
            iswebp,
          })
        }
        layout={layout} // 图片平铺模式 fill responsive intrinsic fixed
        alt={alt || ''}
        className={className || ''}
        style={
          className
            ? null
            : {
                width: '100%',
                height: '100%',
              }
        }
      />
    );
  };

  return (
    <div
      className={`${wrapperClassName || ''}`}
      style={{
        height,
        width,
        position: 'relative',
        overflow: 'hidden',
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
          alt={alt || ''}
        />
      </div>
    </div>
  );
};

export default NextImgx;
