// let isInitWebp = false; // 是否初始化判断webp
// let _isSupportWebp = false;
export const checkServer = typeof window === 'undefined';

// 浏览器是否兼容webp
export const isSupportWebp = () => {
  // if (isInitWebp) return _isSupportWebp;
  // isInitWebp = true;
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

export const addImgUrlWebp = (url, fixUrl = '') => {
  let newUrlStr = url;
  const isUrlFormat = /\/(format)\/(.*)/g.test(newUrlStr);
  // 转换格式容错处理
  if (!isUrlFormat) {
    const tailFixStr = /\/$/g.test(newUrlStr) ? '' : '/';
    newUrlStr += `${fixUrl}${tailFixStr}format/webp`;
  }
  return newUrlStr;
};

export const getInt = (x) => {
  if (typeof x === 'number') {
    return x;
  }
  if (typeof x === 'string') {
    return parseInt(x, 10);
  }
  return undefined;
};

// check_webp_feature:
//   'feature' can be one of 'lossy', 'lossless', 'alpha' or 'animation'.
//   'callback(feature, result)' will be passed back the detection result (in an asynchronous way!)
export function check_webp_feature() {
  return new Promise((reslove, reject) => {
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
}
