export interface ImgxHookProps {
  src: string;
  /** 动画持续时间 */
  delayTime?: number;
  /** 低清晰图类型，默认qiniu七牛 */
  imageLoadType?: 'qiniu' | 'custom' | 'oss';
  /** 自定义低清晰url */
  placeholderSrc?: string;
  /** img图片样式 */
  className?: string;
  /** 组件外层样式，必须定义宽度，低倍图过渡效果动画才有效果 */
  wrapperClassName?: string;
  height?: number;
  width?: number;
  /** 加载后回调 */
  beforeLoad?: Function;
  /** 图片点击事件 */
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  /** 图片加载失败后，显示的图片 */
  errorImgUrl?: string;
  alt?: string;
  /**
   * 图片压缩宽度，等比压缩图片，无需设置压缩高度
   */
  imgHitWidth?: number;
  /**
   * 图片压缩高度，只有开启crop剪裁功能才有效果
   */
  imgHitHeight?: number;
  /**
   * 剪裁模式，默认不剪裁，只是等比缩放
   * @northWest 左上
   * @north 中上
   * @northEast 右上
   * @west 左中
   * @center 居中
   * @east 右中
   * @southWest 左下
   * @south 中下
   * @southEast 右下
   */
  crop?: CropType;
  /** 压缩质量 */
  quality?: number;
  /** 图片加载模式，默认开启懒加载 */
  loading?: 'lazy' | 'eager' | undefined;
  /** 图片懒加载偏移距离，默认可视区外200px内就开始加载图片 */
  offset?: string;
  /** 低清图加载模式，默认预加载eager */
  placeholderMode?: 'lazy' | 'eager';
  /**
   * 自定义图片cdn的域名前缀
   */
  domain?: DomainData;
}

export interface DomainData {
  /**
   * 七牛域名，无需https://前缀
   */
  qiniu?: string[];
  /**
   * oss阿里云域名，无需https://前缀
   */
  oss?: string[];
}

// 图片加载样式
export interface LoadedClassNameData {
  filter: string;
  opacity: number;
  transitionDuration?: string;
}

export type GenImgAttrsResult = {
  src: string;
  srcSet: string | undefined;
  sizes: string | undefined;
};
