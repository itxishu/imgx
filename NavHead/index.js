import React from 'react';
import { message } from 'antd';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import Modals from '../Head/Modals';
import sendBehaviour from '../../../utils/kuick-sdk/behaviour';
import { isMobile, loginPc, GetUrlParam } from '../../../utils/common';
import HeadFloating from '../Head/HeadFloating';
import request from '../../../utils/request';
import { GET_LOGIN_URL } from '../../../consts/env';
import { coursePlatType } from '../../../consts/statusCode';
import styles from './index.module.styl';

const cx = classNames.bind(styles);

const navMenu = [
  {
    link: '/',
    key: 'home',
    text: '首页'
  },
  {
    link: '/open',
    key: 'openSubject',
    text: '公开课'
  },
  {
    link: '/experience',
    key: 'expSubject',
    text: '体验课'
  },
  {
    link: '/vip',
    key: 'vipSubject',
    text: 'VIP课'
  }
  // {
  //   link: '/talent',
  //   key: 'talent',
  //   text: '人才服务'
  // }
];

const navMap = [
  ['click_firstpage', '点击首页'],
  ['click_openclass', '点击公开课'],
  ['click_Microclass', '点击微课'],
  ['click_smallclass', '点击小课'],
  ['click_bigclass', '点击大课'],
  ['click_Factoryclass', '点击厂课'],
  ['click_Workclass', '点击新职课']
];
class NavHead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pathName: window.location.pathname,
      loginFlag: true,
      modalFlag: false,
      getLoginData: {},
      isVip: true,
      kkbCode: null
    };
  }

  componentDidMount() {
    let appId = GetUrlParam('appId');
    if (appId) {
      this.getKcode(20);
    } else {
      this.getKcode(10);
    }

    if (!isMobile()) {
      this.loginData();
    }
  }

  // 获取kcode
  getKcode = kcode => {
    let cId = GetUrlParam('c');

    this.props
      .getCourseInfo({
        id: cId,
        platType: coursePlatType.pc,
        code: kcode
      })
      .then(res => {
        if (res.kkbCode) {
          this.setState({
            kkbCode: res.kkbCode
          });
        }
      });
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
    this.props.getUserInfo().then(res => {
      if (res && res.data && res.data.uid) {
        this.setState({
          loginFlag: false,
          getLoginData: res.data
        });
      } else {
        this.setState({
          loginFlag: true,
          getLoginData: {}
        });
      }
    });
  };

  loginOut = () => {
    request.post(`${GET_LOGIN_URL}/logout`).then(res => {
      if (res) {
        this.loginData();
        message.success('退出成功', 1);
        window.location.reload();
      }
    });
  };

  toLogin = () => {
    loginPc(['wx', 'phone'], this.state.kkbCode);
  };

  toUrl = link => {
    window.open(link);
  };

  handleClick = (index, item) => {
    sendBehaviour({
      action: navMap[index][0],
      description: navMap[index][1],
      content: {
        courseName: item.text,
        pageTitle: item.text,
        pageUrl: item.link
      }
    });
  };

  render() {
    const { tabType } = this.props;
    return (
      <div className={styles.newHeadNav}>
        <div className={cx('headNavArea', 'clearfix', 'head')}>
          <div className={styles.nav}>
            <ul className={styles.navMenu}>
              {navMenu.map((item, index) => {
                return (
                  <li
                    key={index}
                    className={
                      isMobile() ? styles.mcNormalLi : styles.pcNormalLi
                    }
                  >
                    <a
                      href={item.link}
                      className={
                        tabType === item.key
                          ? styles.navActive
                          : styles.navNormal
                      }
                    >
                      {item.text === '首页' ? '开课吧首页' : item.text}
                    </a>
                  </li>
                );
              })}
              <li key="企业" className={styles.pcNormalLi}>
                <a
                  onClick={this.toUrl.bind(this, 'https://es.kaikeba.com/home')}
                >
                  企业服务
                </a>
              </li>
            </ul>
            <div>
              {this.state.loginFlag ? (
                <p className={styles.enterprise} onClick={this.toLogin}>
                  登录 / 注册
                </p>
              ) : (
                <div className={styles.navHeadFloats}>
                  <HeadFloating
                    getLoginData={this.state.getLoginData}
                    openModal={this.openModal}
                    loginOut={this.loginOut}
                    flag="nav"
                  />
                </div>
              )}
              <p
                className={styles.learnCenter}
                onClick={this.toUrl.bind(this, 'https://learn.kaikeba.com/')}
              >
                我的课程
              </p>
            </div>
          </div>
        </div>
        <Modals
          key="Modals"
          modalFlag={this.state.modalFlag}
          closeModal={this.closeModal}
        />
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};
const mapDispatchToProps = dispatch => {
  return {
    getCourseInfo: params => dispatch.appOpen.getCourseInfo(params),
    getUserInfo: params => dispatch.header.getInfoData(params)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavHead);
