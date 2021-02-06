<h1 align="center"> Imgx  </h1>
<p align="center">
  <b >图片渐进加载</b>
</p>

<br>

## intro

> 让图片渐进的加载

react版本必须为17.x.x 以上。

## 支持

* 务必：原图cdn地址是七牛云

## how to use?

``` jsx
import React from 'react';
import { Imgx } from '@kkb/imgx';

const DemoPage = ({ images }) => (
  <div>
    <Imgx
      src={"https://img.kaikeba.com/platform/247103210202xrti.jpg"}
      wrapperClassName={'cssName'} // 外层样式，必须定义宽高，这样才有动画渐变效果
      className={'cssName'} // img标签样式
      delayTime={2.3} // 动画持续时间
      beforeLoad={() => {}} // 加载后回调
      onClick={(e) => {}} // 点击事件
      errorImgUrl={"url"} // 图片加载失败后，显示的图片
      imgHitWidth={400} // 图片压缩宽度（等比压缩）
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
|   imgHitWidth  |   number  |     |  图片压缩宽度，等比压缩图片，无需设置压缩高度   |
|  delayTime   |   number  |  1   |   过渡动画持续时间，单位秒  |
|  beforeLoad   | Function    |     |  img加载后回调   |
|  onClick   | Function    |     | imx点击事件    |
|  errorImgUrl  |  String   |     |  图片加载失败后，显示的图片   |
|  loading   |   "lazy" 、 "eager"  |   lazy  |  图片加载模式，lazy懒加载，eager同步加载   |
|  offset   |   String  |  200px   |  懒加载偏移量，默认可视区外200px内就开始加载图片   |
|  quality   |  number   |  85   |  图片压缩质量，0-100区间   |
<!-- |     |     |     |     | -->
