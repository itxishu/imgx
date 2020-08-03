import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import styles from './index.module.styl';

const { TextArea } = Input;

class Modals extends React.Component {
  constructor(porps) {
    super(porps);
    this.state = {
      textAreaData: ''
    };
  }

  textChange = v => {
    this.setState({
      textAreaData: v.target.value
    });
  };

  render() {
    return (
      <Modal
        visible={this.props.modalFlag}
        footer={null}
        style={{ top: '30%', width: '480px' }}
        maskClosable={false}
        onCancel={this.props.closeModal}
      >
        <div className={styles.modalHeader}>
          <p>意见反馈</p>
        </div>
        <Form onFinish={values => this.props.submmits(values)}>
          <Form.Item
            label="评价"
            name="text"
            rules={[{ required: true, message: '请输入页面名称' }]}
          >
            <TextArea
              id="text"
              style={{ resize: 'none' }}
              autoSize={{ minRows: 6, maxRows: 6 }}
              onChange={this.textChange}
              placeholder={
                '请输入您对产品使用中的意见或建议，您宝贵的建议就是我们前进的动力（可输140个字呦～）'
              }
            />
          </Form.Item>
          <Form.Item label="联系方式" name="phone">
            <Input
              placeholder="请留下您的联系方式"
              className={styles.phoneInput}
              maxLength="20"
            />
          </Form.Item>
          <div className={styles.subBox}>
            <Button
              className={
                this.state.textAreaData === ''
                  ? styles.btn2
                  : `${styles.btn2} ${styles.btn2False}`
              }
              type="primary"
              htmlType="submit"
              disabled={this.state.textAreaData === ''}
            >
              提交
            </Button>
            {/* <a href="javascript:;" >
              提交
            </a> */}
          </div>
        </Form>
      </Modal>
    );
  }
}

export default Modals;
