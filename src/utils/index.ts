export const checkServer = typeof window === 'undefined';

const defaultQuality = 85;

// 浏览器是否兼容webp
export const isSupportWebp = (): boolean => {
  try {
    if (checkServer) return false;
    const isWebp = document
      ?.createElement('canvas')
      .toDataURL('image/webp', 0.1)
      .includes('data:image/webp');
    return isWebp;
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
  quality?: number;
  isWebp?: boolean;
}

// 七牛压缩指定宽
export const getImgGzip = ({
  src,
  width,
  quality = 85,
  isWebp,
}: ImgGzipData): string => {
  let newUrl = src;
  if (!/\?(imageView2|imageMogr2)\//.test(newUrl)) {
    newUrl = `${src}?imageMogr2/quality/${quality}`;
    if (width) {
      newUrl += `/thumbnail/${width || ''}x`;
    }

    if (isWebp) {
      newUrl += `/format/webp`;
    }
  }

  return newUrl;
};

export type CropType =
  | 'northWest'
  | 'north'
  | 'northEast'
  | 'west'
  | 'center'
  | 'east'
  | 'southWest'
  | 'south'
  | 'southEast';

interface ImgGzipData {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  isWebp?: boolean;
  crop?: CropType;
}

/**
 * oss图片压缩 及webp
 */
export const getOssImgGzip = ({
  src,
  width,
  height,
  quality = defaultQuality,
  isWebp,
  crop,
}: ImgGzipData): string => {
  let newUrl = src;
  const cropOpts = {
    northWest: ',g_nw',
    north: ',g_north',
    northEast: ',g_ne',
    west: ',g_west',
    center: ',g_center',
    east: ',g_east',
    southWest: ',g_sw',
    south: ',g_south',
    southEast: ',g_se',
  };
  // 处理宽度字符串字段
  function handleWH(w?: number, h?: number): string {
    let whStr = '';
    if (w) {
      whStr += `w_${w}`;
    }
    if (h) whStr += `h_${h}`;
    return whStr;
  }
  if (!/\?(x-oss-process=image)\//.test(newUrl)) {
    newUrl = `${src}?x-oss-process=image/quality,Q_${quality}/interlace,1`;
    if (width && !crop) {
      newUrl += `/resize,l_${width}`;
    }
    const cropWHData = handleWH(width, height);
    if (crop && cropOpts[crop] && cropWHData) {
      newUrl += `/crop,${cropWHData}${cropOpts[crop]}`;
    }

    if (isWebp) {
      newUrl += `/format,webp`;
    }
  }

  return newUrl;
};

/**
 * 七牛压缩指定宽 及webp
 */
export const getQiniuImgGzip = ({
  src,
  width,
  height,
  quality = defaultQuality,
  isWebp,
  crop,
}: ImgGzipData): string => {
  let newUrl = src;

  const cropOpts = {
    northWest: 'NorthWest',
    north: 'North',
    northEast: 'NorthEast',
    west: 'West',
    center: 'Center',
    east: 'East',
    southWest: 'SouthWest',
    south: 'South',
    southEast: 'SouthEast',
  };

  // 处理宽度字符串字段
  function handleWH(w?: number, h?: number): string {
    if (!w && !h) return '';
    const whStr = `${w || ''}x${h || ''}`;
    return whStr;
  }

  if (!/\?(imageView2|imageMogr2)\//.test(newUrl)) {
    newUrl = `${src}?imageMogr2/quality/${quality}/ignore-error/1`;
    if (width && !crop) {
      newUrl += `/thumbnail/${width}x`;
    }

    if (crop && cropOpts[crop]) {
      newUrl += `/gravity/${cropOpts[crop]}`;
      const cropWHData = handleWH(width, height);
      if (cropWHData) newUrl += `/crop/${cropWHData}`;
    }

    if (isWebp) {
      newUrl += `/format/webp`;
    }
  }

  return newUrl;
};

export interface ParseUrlResData {
  url?: string;
  scheme?: string;
  slash?: string;
  host?: string;
  port?: string;
  path?: string;
  query?: string;
  hash?: string;
}

/**
 * 解析url，返回url各参数解析，如端口号等
 */
export const getParseUrl = (url: string): ParseUrlResData => {
  const parseUrl =
    /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
  const result: any = parseUrl.exec(url);
  const blanks = '       ';
  const fields = [
    'url',
    'scheme', // 协议
    'slash', // 斜线
    'host', // 主机名
    'port', // 端口
    'path', // 路径
    'query', // 参数
    'hash', // 锚点
  ];
  const data: ParseUrlResData = {};
  fields.forEach((field, i) => {
    data[field] = `${blanks.substr(field.length)}${result[i]}`.trim();
  });
  return data;
};
