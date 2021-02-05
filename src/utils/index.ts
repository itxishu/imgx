export const checkServer = typeof window === 'undefined';

// 浏览器是否兼容webp
export const isSupportWebp = (): boolean => {
  try {
    if (checkServer) return false;
    const iswebp = document
      ?.createElement('canvas')
      .toDataURL('image/webp', 0.1)
      .includes('data:image/webp');
    return iswebp;
  } catch (err) {
    return false;
  }
};

// 七牛图片后缀添加webp
export const addImgUrlWebp = (url: string, fixUrl = ''): string => {
  let newUrlStr = url;
  const isUrlFormat = /\/(format)\/(.*)/g.test(newUrlStr);
  // 转换格式容错处理
  if (!isUrlFormat) {
    const tailFixStr = /\/$/g.test(newUrlStr) ? '' : '/';
    newUrlStr += `${fixUrl}${tailFixStr}format/webp`;
  }
  return newUrlStr;
};

export const getInt = (x: number | string): number | undefined => {
  if (typeof x === 'number') {
    return x;
  }
  if (typeof x === 'string') {
    return parseInt(x, 10);
  }
  return undefined;
};

// 判断是否webp
export const checkWebpFeature = (): Promise<boolean> => {
  return new Promise((reslove) => {
    // const kTestImages = {
    //   lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
    //   lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
    //   alpha:
    //     'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
    //   animation:
    //     'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
    // };
    const img = new Image();
    img.onload = function () {
      const result = img.width > 0 && img.height > 0;
      reslove(result);
    };
    img.onerror = function () {
      reslove(false);
    };
    img.src =
      'data:image/webp;base64,' +
      'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
  });
};

interface ImgGzipData {
  src: string;
  width?: number;
  quality: number;
  iswebp?: boolean;
}

// 七牛压缩指定宽
export const getImgGzip = ({
  src,
  width,
  quality = 75,
  iswebp,
}: ImgGzipData): string => {
  let newUrl = src;
  if (!/\?(imageView2|imageMogr2)\//.test(newUrl)) {
    newUrl = `${src}?imageMogr2/quality/${quality}`;
    if (width) {
      newUrl += `/thumbnail/${width || ''}x`;
    }

    if (iswebp) {
      newUrl += `/format/webp`;
    }
  }

  return newUrl;
};
