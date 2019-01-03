import React from 'react'
import {Form, Input, Button} from 'antd'

import {reqLogin} from '../../api'
import MemoryUtils from '../../utils/MemoryUtils'
import storageUtils from '../../utils/storageUtils'
import './index.less'

const FormItem = Form.Item

export default class Login extends React.Component {

  state = {
    errorMsg: ''
  }

  loginReq = async ({username, password}) => {
    const result = await reqLogin(username, password)
    if (result.status === 0) {
      const user = result.data
      MemoryUtils.user = user
      storageUtils.saveUser(user)
      this.props.history.replace('/home')
    } else {
      const errorMsg = result.msg
      this.setState({errorMsg})
    }
  }

  render() {
    return (
      <div className='login'>
        <div className="login-header">
          <div className="logo">
            <img src="/assets/logo.png" alt="硅谷后台管理系统"/>
            React项目: 后台管理系统
          </div>
        </div>

        <div className="login-content-wrap">
          <div className="login-content">
            <div className="word">共享出行 <br/>引领城市新经济</div>
            <div className="login-box">
              <div className="error-msg-wrap">
                <div
                  className={this.state.errorMsg ? "show" : ""}>
                  {this.state.errorMsg}
                </div>
              </div>
              <div className="title">用户登陆</div>
              <LoginForm ref="login" loginSubmit={this.loginReq}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class LoginForm extends React.Component {

  state = {}

  loginSubmit = (e) => {

    e && e.preventDefault()

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        var formValues = this.props.form.getFieldsValue()
        this.props.loginSubmit({
          username: formValues.username,
          password: formValues.password
        })
      }
    })
  }

  checkUsername = (rule, value, callback) => {
    var reg = /^\w+$/
    if (!value) {
      callback('请输入用户名!')
    } else if (!reg.test(value)) {
      callback('用户名只允许输入英文字母')
    } else {
      callback()
    }
  }

  checkPassword = (rule, value, callback) => {
    if (!value) {
      callback('请输入密码!')
    } else {
      callback()
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <Form className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{validator: this.checkUsername}]
          })(
            <Input placeholder="用户名"/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{validator: this.checkPassword}]
          })(
            <Input type="password" placeholder="密码"/>
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.loginSubmit} className="login-form-button">
            登录
          </Button>
        </FormItem>
      </Form>
    )
  }
}

LoginForm = Form.create({})(LoginForm)
