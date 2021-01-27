import React from 'react';
import { Imgx } from './index';

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
      <Imgx
        src="https://img.kaikeba.com/platform/247103210202xrti.jpg"
        wrapperClassName="cssName" // 外层样式，必须定义宽高，这样才有动画渐变效果
        className="cssName" // img标签样式
        delayTime={2.3} // 动画持续时间
        beforeLoad={(config) => {
          console.log('加载后', config);
        }} // 加载后回调
        onClick={(e) => {
          console.log('点击', e);
        }} // 点击事件
      />
    </div>
  );
};
export default App;
