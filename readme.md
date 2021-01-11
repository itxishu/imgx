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
|  delayTime   |   number  |  0.6   |   过渡动画持续时间  |
|  src   |  String   |     |  图片地址   |
|  imageLoadType   |   String  |  qiniu   |  低清图类型，可开启自定义模式，配合placeholderSrc使用   |
|  placeholderSrc   |   String  |     |   低清图url地址  |
|  beforeLoad   | Function    |     |  img加载后回调   |
|  onClick   | Function    |     | imx点击事件    |
|   errorImgUrl  |  String   |     |  图片加载失败后，显示的图片   |
<!-- |     |     |     |     | -->
