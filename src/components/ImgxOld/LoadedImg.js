import React from 'react';
import { isSupportWebp, addImgUrlWebp, checkServer } from '../../utils';

class LoadedImg extends React.Component {
  imgRef;
  constructor(props) {
    super(props);
    this.state = {
      isWebp: isSupportWebp(),
      imgSrc: null,
    };
  }

  // componentDidMount() {
  //   this.setState({
  //     imgSrc: this.handleUrl(),
  //   });
  // }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   const { isWebp } = prevState;
  //   let _imgSrc = nextProps.src;
  //   console.log('>>>', _imgSrc);
  //   // 兼容webp格式
  //   if (/\?(imageView2|imageMogr2)\//.test(_imgSrc) && isWebp) {
  //     _imgSrc = addImgUrlWebp(_imgSrc);
  //   } else if (isWebp) {
  //     _imgSrc = addImgUrlWebp(_imgSrc, '?imageMogr2');
  //   }

  //   return {
  //     imgSrc: _imgSrc,
  //   };
  // }

  // handleUrl = () => {
  //   const { isWebp } = this.state;
  //   let newUrlStr = this.props.src;

  //   // 兼容webp格式
  //   if (/\?(imageView2|imageMogr2)\//.test(newUrlStr) && isWebp) {
  //     newUrlStr = addImgUrlWebp(newUrlStr);
  //   } else if (isWebp) {
  //     newUrlStr = addImgUrlWebp(newUrlStr, '?imageMogr2');
  //   }
  //   return newUrlStr;
  // };

  render() {
    const { alt, errorImgUrl, className, onLoad } = this.props;

    return (
      <img
        ref={(refs) => (this.imgRef = refs)}
        onLoad={() => onLoad?.(this.imgRef)}
        src={this.props.src}
        onError={(e) => {
          if (errorImgUrl) {
            e.target.onerror = null;
            e.target.src = `${errorImgUrl}`;
          }
        }}
        alt={alt || ''}
        className={className || ''}
        // style={{
        //   width: '100%',
        //   height: '100%',
        // }}
      />
    );
  }
}

export default LoadedImg;
