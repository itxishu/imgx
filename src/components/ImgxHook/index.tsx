import React, { useState, useEffect, useRef, useCallback } from 'react';
import { checkWebpFeature, getImgGzip } from '../../utils';
import { useIntersection } from '../../utils/use-intersection';
import {
  ImgxHookProps,
  LoadedClassNameData,
  GenImgAttrsResult,
} from './index.d';

const pattern = new RegExp('http(s)?://[^s]*');
const defaultImg = 'https://img.kaikeba.com/22857172219102bybu.jpeg';

const imglazyLoadInit: LoadedClassNameData = {
  filter: 'blur(8px)',
  opacity: 1,
};
const imglazyLoadLoaded = {
  filter: 'blur(0px)',
  opacity: 0,
  transition: 'filter ease 1',
  animationFillMode: 'both',
};

const ImgxHook = ({
  src = '', // 图片url
  delayTime = 0.6, // 动画持续时间
  imageLoadType = 'qiniu', // 低清晰图类型，默认qiniu七牛
  placeholderSrc = '', // 自定义低清晰url
  className,
  wrapperClassName,
  height,
  width,
  beforeLoad, // 加载后回调
  onClick, // 点击事件
  errorImgUrl, // 图片加载失败后，显示的图片
  alt,
  imgHitWidth, // 图片压缩宽度
  quality = 75, // 压缩质量
  loading,
  offset = '100px', // 图片懒加载偏移距离，默认可视区外100px内就开始加载图片
}: ImgxHookProps) => {
  const blurTimer = useRef<any>(null);
  const [blurLayoutCss, setBlurLayoutCss] = useState({
    zIndex: 1,
  });
  const [loadedClassName, setLoadedClassName] = useState<LoadedClassNameData>(
    imglazyLoadInit,
  );
  const [imgLazyedDom, setImgLazyedDom] = useState<JSX.Element>();
  const isLazy = loading === 'lazy' || typeof loading === 'undefined';
  const [setRef, isIntersected, imgRef] = useIntersection({
    rootMargin: offset,
    disabled: !isLazy,
  });
  const isVisible = !isLazy || isIntersected;
  const imgAttributes: GenImgAttrsResult = {
    src:
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    srcSet: undefined,
    sizes: undefined,
  };

  useEffect(() => {
    return () => {
      blurTimer.current = null;
    };
  }, []);

  useEffect(() => {
    loadedImg().then((imgElement) => {
      setImgLazyedDom(imgElement);
    });
  }, [src, placeholderSrc, isVisible]);

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
  const onLoad = useCallback(() => {
    const time = delayTime ?? 0.6;
    setLoadedClassName({
      transitionDuration: `${time}s`,
      ...imglazyLoadLoaded,
    });
    beforeLoad?.(imgRef?.current); // 回调

    // 动效remove
    blurTimer.current = setTimeout(() => {
      setBlurLayoutCss({
        zIndex: -1,
        // display: 'none',
      });
    }, time * 1000);
  }, [src]);

  // 占位符图片url
  const handlePlaceholderSrc = () => {
    let curSrc = src;
    curSrc = pattern.test(src) ? fillerPlaceholderSrc(src) : defaultImg;

    // 占位低清晰图支持类型
    const newImgType = {
      qiniu: `${curSrc}?imageMogr2/thumbnail/100x`,
      oss: '',
      custom: placeholderSrc, // 用户自定义
    };
    return newImgType[imageLoadType] || '';
  };

  // 过滤缩略图参数
  const fillerPlaceholderSrc = (url: string) => {
    let newUrlStr = url;
    if (/\?(imageView2|imageMogr2)\//.test(newUrlStr)) {
      const reg = newUrlStr.match(/(?<u>.*)\?.*/);
      newUrlStr = reg?.groups?.u || newUrlStr;
    }
    return newUrlStr || '';
  };

  const loadedImg = async (): Promise<JSX.Element> => {
    if (!isVisible) {
      return (
        <img
          ref={setRef}
          alt={alt || ''}
          className={className || ''}
          style={
            className
              ? undefined
              : {
                  width: '100%',
                  height: '100%',
                }
          }
          {...imgAttributes}
        />
      );
    }

    const iswebp = await checkWebpFeature();
    const newUrlStr = getImgGzip({ src, width: imgHitWidth, quality, iswebp });

    return (
      <img
        ref={setRef}
        onLoad={onLoad}
        src={newUrlStr}
        onError={(e: any) => {
          if (errorImgUrl) {
            e.target.onerror = null;
            e.target.src = `${errorImgUrl}`;
          }
        }}
        alt={alt || ''}
        className={className || ''}
        style={
          className
            ? undefined
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

export default ImgxHook;
