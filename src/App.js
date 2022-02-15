import React from 'react';
import { Imgx } from './index';
import styles from './index.less';

const App = () => {
  return (
    <div
      style={
        {
          // backgroundColor: 'rgba(221,232,12,0.4)',
        }
      }
    >
      hello npmBase
      <div style={{ height: '600vh' }}>m内容</div>
      <div className={styles.demoWrap}>
        <Imgx
          src="https://img.kaikeba.com/922272211202uihd.jpg"
          errorImgUrl="https://img.kaikeba.com/316141202202qlxs.jpg" // 图片加载失败后，显示的图片
          wrapperClassName={styles.boxWrap} // 外层样式，必须定义宽高，这样才有动画渐变效果
          // className={styles.boxWrap} // img标签样式
          delayTime={2.3} // 动画持续时间
          beforeLoad={(config) => {
            console.log('加载后', config);
          }} // 加载后回调
          onClick={(e) => {
            console.log('点击', e);
          }} // 点击事件
          // width={400}
          // height={400}
          // imgHitWidth={600}
          // loading="eager"
        />
      </div>
    </div>
  );
};
export default App;
