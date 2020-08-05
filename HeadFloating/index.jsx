import React from 'react';
import { GET_LEARN_URL } from '../../../../consts/env';
// import { Link } from 'react-router-dom';
import styles from './index.mobule.styl';

export default class HeadFloating extends React.Component {
  render() {
    const { nickname, avatar, gender } = this.props.getLoginData;
    let picUrl = 'https://img.kaikeba.com/a/21521192500202qabo.png';
    if (avatar) {
      picUrl = avatar;
    } else if (gender === 2) {
      picUrl = 'https://img.kaikeba.com/a/30621192500202ukms.png';
    }
    return (
      <div
        className={
          this.props.flag === 'nav'
            ? `${styles.headPic} ${styles.headPicD}`
            : styles.headPic
        }
      >
        <img src={picUrl} />
        <div className={styles.headModalWhite}></div>
        <div
          className={
            this.props.flag === 'nav'
              ? `${styles.headModal} ${styles.headModalD}`
              : styles.headModal
          }
        >
          <div className={styles.headModalMain}>
            <div className={styles.headModalMainPic}>
              <img src={picUrl} />
              <p>{nickname}</p>
            </div>
            {/* <a key={i} href={item.url} >
                  {item.name}
                </a> */}
            <div className={styles.headModalMainUrl}>
              <div
                className={styles.headModalMainItem}
                target="_blank"
                onClick={() => window.open(`${GET_LEARN_URL}/home`)}
              >
                <img src="https://img.kaikeba.com/a/40625192500202jhlk.png" />
                我的课程
              </div>
              <div
                className={styles.headModalMainItem}
                target="_blank"
                onClick={() => window.open(`${GET_LEARN_URL}/account`)}
              >
                <img src="https://img.kaikeba.com/a/50345192500202uefo.png" />
                账户管理
              </div>
              <a
                className={styles.headModalMainItem}
                tag="div"
                href="/hometalent"
              >
                <img src="https://img.kaikeba.com/a/23345192500202lnew.png" />
                人才服务
              </a>
              <div
                className={styles.headModalMainItem}
                onClick={() => this.props.openModal()}
              >
                <img src="https://img.kaikeba.com/a/24345192500202txij.png" />
                意见反馈
              </div>
            </div>
            <div
              className={styles.headModalOut}
              onClick={() => {
                this.props.loginOut();
              }}
            >
              安全退出
            </div>
          </div>
        </div>
      </div>
    );
  }
}
