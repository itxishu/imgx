import React, { useEffect, useRef } from 'react';
import { checkWebpFeature, getImgGzip, getOssImgGzip, getParseUrl, getQiniuImgGzip } from '../../utils';
import { useSafaState } from '../../utils/use-safeState';
import { useIntersection } from '../../utils/use-intersection';
import {
  ImgxHookProps,
  LoadedClassNameData,
  GenImgAttrsResult,
} from '../../typings/imgx.d';

const pattern = new RegExp('http(s)?://[^s]*');
const defaultImg = 'https://img.kaikeba.com/22857172219102bybu.jpeg';
// img空 占位符
const imgEmptySrc =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

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

let isWebp: boolean = false;

const ImgxHook = ({
  src = '',
  delayTime = 0.6,
  imageLoadType = 'qiniu',
  placeholderSrc = '',
  className,
  wrapperClassName,
  height,
  width,
  beforeLoad,
  onClick,
  errorImgUrl,
  alt,
  imgHitWidth, // 图片压缩宽度
  imgHitHeight,
  crop,
  quality = 85,
  loading = 'lazy',
  offset = '200px',
  placeholderMode = 'eager',
  domain = {
    qiniu: ['img.kaikeba.com'],
    oss: ['image-demo.oss-cn-hangzhou.aliyuncs.com'],
  }
}: ImgxHookProps) => {
  const [blurLayoutCss, setBlurLayoutCss] = useSafaState({
    zIndex: 1,
  });
  const [loadedClassName, setLoadedClassName] =
    useSafaState<LoadedClassNameData>(imglazyLoadInit);
  const [imgUrl, setImgUrl] = useSafaState(''); // 图片加载完url
  const imgRef = useRef<any>(null);
  const timeFn = useRef<any>(null);
  const isLazy = loading === 'lazy' || typeof loading === 'undefined';
  const [setRef, isIntersected] = useIntersection({
    rootMargin: offset,
    disabled: !isLazy,
  });
  const isVisible = !isLazy || isIntersected;

  useEffect(() => {
    handleImgUrl();
    return () => {
      clearTimeout(timeFn.current);
    };
  }, [src]);

  // 图片src链接处理
  const handleImgUrl = async () => {
    isWebp = await checkWebpFeature();
    const { qiniu, oss } = domain || {}
    const urlObj = getParseUrl(src)
    let newImgSrc = src
    
    // 七牛
    if (qiniu?.includes(urlObj.host || '')) {
      newImgSrc = getQiniuImgGzip({
        src,
        quality,
        width: imgHitWidth,
        height: imgHitHeight,
        isWebp,
        crop,
      })
    }

    // oss阿里云
    if (oss?.includes(urlObj.host || '')) {
      newImgSrc = getOssImgGzip({
        src,
        quality,
        width: imgHitWidth,
        height: imgHitHeight,
        isWebp,
        crop,
      })
    }

    setImgUrl(newImgSrc);
  };

  const imgAttributes: GenImgAttrsResult = {
    src: isVisible ? imgUrl : imgEmptySrc,
    srcSet: undefined,
    sizes: undefined,
  };

  // 图片加载完
  const onLoad = () => {
    const time = delayTime ?? 0.6;
    setLoadedClassName({
      transitionDuration: `${time}s`,
      ...imglazyLoadLoaded,
    });
    beforeLoad?.(imgRef?.current); // 回调

    // 动效remove
    timeFn.current = setTimeout(() => {
      setBlurLayoutCss({
        zIndex: -1,
        // display: 'none',
      });
    }, time * 1000);
  };

  // 过滤缩略图参数
  const fillerPlaceholderSrc = (url: string) => {
    let newUrlStr = url;
    if (/\?(imageView2|imageMogr2)\//.test(newUrlStr)) {
      const reg = newUrlStr.match(/(?<u>.*)\?.*/);
      newUrlStr = reg?.groups?.u || newUrlStr;
    }

    if(/\?(x-oss-process=image)\//.test(newUrlStr)){
      const reg = newUrlStr.match(/(?<u>.*)\?.*/);
      newUrlStr = reg?.groups?.u || newUrlStr;
    }
    return newUrlStr || '';
  };

  // 占位符图片url
  const handlePlaceholderSrc = () => {
    // 懒加载模式
    if(!isVisible && placeholderMode !== 'eager') return ''

    let curSrc = src;
    curSrc = pattern.test(src) ? fillerPlaceholderSrc(src) : defaultImg;

    // 占位低清晰图支持类型
    const newImgType = {
      qiniu: `${curSrc}?imageMogr2/thumbnail/100x`,
      oss: `${curSrc}?x-oss-process=image/interlace,1/resize,l_100`,
      custom: placeholderSrc, // 用户自定义
    };
    return newImgType[imageLoadType] || '';
  };
  
  const loadedImg = (): JSX.Element => {
    return (
      <img
        ref={(el: Element | null) => {
          setRef(el);
          imgRef.current = el;
        }}
        onLoad={isVisible ? onLoad : undefined}
        {...imgAttributes}
        onError={() => {
          if (errorImgUrl) {
            setImgUrl(errorImgUrl);
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
      {typeof window !== 'undefined' ? loadedImg() : null}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0,
          overflow: 'hidden',
          backgroundColor: 'transparent',
          ...loadedClassName,
          ...blurLayoutCss,
        }}
      >
        <img
          src={handlePlaceholderSrc()}
          style={{
            width: '100%',
            // height: '100%',
          }}
          alt={alt || ''}
        />
      </div>
    </div>
  );
};

export default ImgxHook;
