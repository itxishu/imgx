import React from 'react';
import { message } from 'antd';
import { connect } from 'react-redux';
import Modals from './Modals/index';
import { toLogin } from '../../../utils/common';
import HeadFloating from './HeadFloating';
import { GET_LEARN_URL } from '../../../consts/env';
import styles from './index.module.styl';

const tabList = [
  {
    name: '首页',
    key: 'home',
    url: '/'
  },
  {
    name: '公开课',
    key: 'openSubject',
    url: '/open'
  },
  {
    name: '体验课',
    key: 'expSubject',
    url: '/experience'
  },
  {
    name: 'VIP课',
    key: 'vipSubject',
    url: '/vip'
  },
  {
    name: '人才服务',
    key: 'talent',
    url: '/talent'
  },
  {
    name: '企业服务',
    key: 'enterprise',
    url: 'https://es.kaikeba.com/home'
  }
];

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabType: this.props.tabType, // resume#job#deliver
      // pathName: window.location.pathname,
      loginFlag: '',
      modalFlag: false
    };
  }

  componentDidMount() {
    this.loginData();
  }

  changeTab = (type, url) => {
    if (type !== this.state.tabType) {
      this.setState({
        tabType: type
      });
    }
    // window.location.href = url
  };

  openModal = () => {
    this.setState({
      modalFlag: true
    });
  };

  closeModal = () => {
    this.setState({
      modalFlag: false
    });
  };

  loginData = () => {
    const { getInfoData } = this.props;

    getInfoData()
      .then(res => {
        if (res.code !== -505) {
          console.log(window.gio, 'gio');
          console.log(res, 'resresresresresresresresresresresres');
          window.gio('setUserId', res.data.uid);
          this.setState({
            loginFlag: false
          });
        } else {
          this.setState({
            loginFlag: true
          });
        }
      })
      .catch(error => {
        if (error) {
          this.setState({
            loginFlag: true
          });
        }
      });
  };

  loginOut = () => {
    const { outLogin } = this.props;

    outLogin().then(res => {
      if (res) {
        this.loginData();
        message.success('退出成功', 1);
      }
    });
  };

  toUrl = link => {
    window.open(link);
  };

  submmit = values => {
    const { postProduct } = this.props;
    let params = {
      channel: 3, // 1:ios, 2:android, 3:web
      remark: values.text, // 建议内容
      contact: values.phone || '' // 联系方式
    };
    postProduct(params).then(res => {
      if (res.code === 1) {
        message.success('提交成功', 1);
        this.closeModal();
      } else if (res.code === -10011) {
        message.error(res.msg, 1);
        this.closeModal();
      } else {
        message.success('请先登录', 1);
        window.location.reload();
      }
    });
  };

  render() {
    const { tabType } = this.state;
    return (
      <div className={styles.headerArea}>
        <div className={styles.headerAreaMain}>
          <div
            className={styles.logo}
            onClick={() => (window.location.href = '/')}
          >
            <img src="https://img.kaikeba.com/a/92910181600202fyjk.png" />
          </div>

          <div className={styles.employmentTabs}>
            {tabList.map((item, index) => {
              return (
                <a
                  className={
                    tabType === item.key
                      ? `${styles.employmentTabsList} ${styles.employmentTabsListActive}`
                      : styles.employmentTabsList
                  }
                  onClick={() => this.changeTab(item.key, item.url)}
                  href={item.url}
                  key={index}
                >
                  {item.name}
                  <div
                    key={index}
                    className={styles.employmentTabsListShow}
                  ></div>
                </a>
              );
            })}
          </div>

          <div className={styles.login}>
            <div
              className={styles.mySubject}
              onClick={() => this.toUrl(`${GET_LEARN_URL}/home`)}
            >
              我的课程
            </div>
            {this.state.loginFlag ? (
              <div className={styles.loginLine}></div>
            ) : (
              ''
            )}
            {this.state.loginFlag ? (
              <div className={styles.loginBtn}>
                <div onClick={() => toLogin()} className={styles.log}>
                  登录
                </div>
                <div onClick={() => toLogin()} className={styles.reg}>
                  免费注册
                </div>
              </div>
            ) : (
              <div className={styles.navHeadFloat}>
                <HeadFloating
                  getLoginData={this.props.UserInfo}
                  openModal={this.openModal}
                  loginOut={this.loginOut}
                />
              </div>
            )}
          </div>
        </div>
        <Modals
          key="Modals"
          modalFlag={this.state.modalFlag}
          closeModal={this.closeModal}
          submmits={this.submmit}
        />
      </div>
    );
  }
}

export default connect(
  ({ header }) => ({ ...header }),
  ({ header }) => ({ ...header })
)(Header);
