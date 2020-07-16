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
**style.css**

```css
:global(.imglazy-load-wrap) {
  width: 100%;
  /* position: relative;
  display: inline-block;
  overflow: hidden; */
}

:global(.imglazy-load-image-init) {
  width: 100%;
  filter: blur(20px);
}

:global(.imglazy-load-image-loaded) {
  width: 100%;
  filter: blur(20px);
  animation: imgLazyAniblur 2.6s ease 1;
  animation-fill-mode: both;
}

/* :global() */
@keyframes imgLazyAniblur {
  form {
    filter: blur(20px);
  }
  to {
    filter: blur(0px);
  }
}

```

```javascript
import React from 'react';
import { Imgx } from 'imgx';

const DemoPage = ({ images, }) => (
  <div>
    <Imgx
      src={"https://n1-q.mafengwo.net/s15/M00/52/1F/CoUBGV4DS8iAYKvfACPhDULBto4374.png"} // 图片地定
      height={'200px'}
      width={500}
      className={'cssName'} // img图片样式
      wrapperClassName={'wrapCssName'} // 外层样式定义
      delayTime={3} // 动画持续时间
      imageLoadType={"custom"} // 低清图类型，使用自定义，默认七牛
      placeholderSrc={"https://img95.699pic.com/photo/50055/5642.jpg_wh300.jpg"} // 低清图url，只有开启自定义模式才生效
    />
  </div>
);

```
