import React, { Component } from "react";
import PropTypes from "prop-types";
const pattern = new RegExp("http(s)?://[^s]*");
const defaultImg = "https://img.kaikeba.com/22857172219102bybu.jpeg";
class ImgLoad extends Component {
  state = {
    loaded: false
  };
  onLoad = () => {
    this.setState({ loaded: true });
  };
  render() {
    let { src, imageProcess, ...props } = this.props;
    const { loaded } = this.state;
    const curSrc = pattern.test(src) ? src : defaultImg;
    src = loaded ? `${src}` : `${curSrc}${imageProcess}`;
    return <img src={src} onLoad={this.onLoad} {...props} />;
  }
}

export default ImgLoad;
ImgLoad.propTypes = { imageProcess: PropTypes.string };
ImgLoad.defaultProps = {
  imageProcess:
    "?imageMogr2/thumbnail/30x30/format/webp/blur/1x0/quality/75|imageslim"
};
