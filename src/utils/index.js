let isInitWebp = false; // 是否初始化判断webp
let _isSupportWebp = false;
export const checkServer = process.browser === false && typeof window === 'undefined';

// 浏览器是否兼容webp
export const isSupportWebp = () => {
  if (isInitWebp) return _isSupportWebp;
  isInitWebp = true;
  try {
    if (!checkServer) {
      _isSupportWebp = document
        ?.createElement('canvas')
        .toDataURL('image/webp', 0.1)
        .includes('data:image/webp');
      return _isSupportWebp;
    }
    return false;
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
