<h1 align="center"> Imgx  </h1>
<p align="center">
  <b >图片渐进加载</b>
</p>

<br>

## intro

> 让图片渐进的加载

## 支持

* 务必：原图cdn地址是七牛云

## how to use?

``` jsx
import React from 'react';
import { Imgx } from '@kkb/imgx';

const DemoPage = ({ images }) => (
  <div>
    <Imgx
      src={"https://n1-q.mafengwo.net/s15/M00/52/1F/CoUBGV4DS8iAYKvfACPhDULBto4374.png"}
      wrapperClassName={'cssName'} // 外层样式，必须定义宽高，这样才有动画渐变效果
      className={'cssName'} // img标签样式
      delayTime={2.3} // 动画持续时间
      beforeLoad={() => {}} // 加载后回调
      onClick={(e) => {}} // 点击事件
      errorImgUrl={"url"} // 图片加载失败后，显示的图片
    />
  </div>
);

```

## 组件参数props介绍

| 名称 | 类型 | 默认值 | 描述 |
| :-: | :-: | :-: | :-: |
|  wrapperClassName    |   String  |     |   组件外层样式，必须定义宽度，低倍图过渡效果动画才有  |
|  className    |   String  |     |   img图片样式  |
|  src   |  String   |     |  图片地址   |
|  delayTime   |   number  |  1   |   过渡动画持续时间，单位秒  |
|  imageLoadType   |   String  |  qiniu   |  低清图类型，可开启自定义模式，配合placeholderSrc使用   |
|  placeholderSrc   |   String  |     |   低清图url地址  |
|  beforeLoad   | Function    |     |  img加载后回调   |
|  onClick   | Function    |     | imx点击事件    |
|   errorImgUrl  |  String   |     |  图片加载失败后，显示的图片   |
<!-- |     |     |     |     | -->
