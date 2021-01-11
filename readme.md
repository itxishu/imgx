<h1 align="center"> Imgx  </h1>
<p align="center">
  <b >图片渐进加载</b>
</p>

<br>

## intro

> 让图片渐进的加载

## 支持

* 务必：原图cdn地址是七牛云

1.0.xx 老版本内联样式
1.1.xx 新版本，div外层元素，与1.0.xx老版本不兼容

## how to use?

``` jsx
import React from 'react';
import { Imgx } from '@kkb/imgx';

const DemoPage = ({ images }) => (
  <div>
    <Imgx
      src={"https://n1-q.mafengwo.net/s15/M00/52/1F/CoUBGV4DS8iAYKvfACPhDULBto4374.png"}
      className={'cssName'}
      delayTime={3.3} // 动画持续时间
      imageLoadType={"custom"} // 低清图类型，qiniu七牛、custom自定义
      // 低清图url，只有开启自定义模式才生效
      placeholderSrc={"https://img95.699pic.com/photo/50055/5642.jpg_wh300.jpg"}
      beforeLoad={() => {}} // 加载后回调
      onClick={(e) => {}} // 点击事件
      errorImgUrl={"url"} // 图片加载失败后，显示的图片
    />
  </div>
);

```
