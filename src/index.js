import React, { Component } from "react";
import PropTypes from "prop-types";
const pattern = new RegExp("http(s)?://[^s]*");
const defaultImg = "https://img.kaikeba.com/22857172219102bybu.jpeg";
class ImgLoad extends Component {
  state = {
    loaded: false,
    widthNum: "100%",
  };
  onLoad = () => {
    this.setState({ loaded: true });
  };
  render() {
    let { src, imageProcess, width, ...props } = this.props;
    const { loaded, widthNum } = this.state;
    const num = width || widthNum;
    const curSrc = pattern.test(src) ? src : defaultImg;
    src = loaded ? `${src}` : `${curSrc}${imageProcess}`;
    return <img src={src} width={num} onLoad={this.onLoad} {...props} />;
  }
}

export default ImgLoad;
ImgLoad.propTypes = { imageProcess: PropTypes.string };
ImgLoad.defaultProps = {
  imageProcess:
  "?imageMogr2/thumbnail/20x20/blur/1x0/quality/75|imageslim"
};
