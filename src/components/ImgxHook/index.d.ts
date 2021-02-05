export interface ImgxHookProps {
  src: string;
  delayTime: number;
  imageLoadType: 'qiniu' | 'custom';
  placeholderSrc?: string;
  className?: string;
  wrapperClassName?: string;
  height?: number;
  width?: number;
  beforeLoad?: Function;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  errorImgUrl?: string;
  alt?: string;
  imgHitWidth?: number;
  quality?: number;
  loading?: 'lazy' | 'eager' | undefined;
  offset: string;
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
