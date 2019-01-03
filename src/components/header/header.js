import React from 'react'
import {Row, Col} from "antd"

import MemoryUtils from '../../utils/MemoryUtils'
import './index.less'
import Util from '../../utils/utils'
import {reqWeather} from '../../api'
import {connect} from 'react-redux'

class Header extends React.Component {
  state = {
    userName: MemoryUtils.user.username,
    sysTime: Util.formateDate(new Date().getTime()),
    dayPictureUrl: '',
    weather: ''
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      let sysTime = Util.formateDate(new Date().getTime());
      this.setState({
        sysTime
      })
    }, 1000)
    this.getWeatherAPIData();
  }


  // 获取指定地址的天气信息
  getWeatherAPIData = async () => {
    let city = '北京'
    const {dayPictureUrl, weather} = await reqWeather(city)
    this.setState({
      dayPictureUrl,
      weather
    })
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const {menuName, menuType} = this.props;
    return (
      <div className="header">
        <Row className="header-top">
          <Col span={24}>
            <span>欢迎，{this.state.userName}</span>
            <a href="javascript:">退出</a>
          </Col>
        </Row>
        <Row className="breadcrumb">
          <Col span={4} className="breadcrumb-title">
            {menuName || '首页'}
          </Col>
          <Col span={20} className="weather">
            <span className="date">{this.state.sysTime}</span>
            <span className="weather-img">
              <img src={this.state.dayPictureUrl} alt=""/>
            </span>
            <span className="weather-detail">
              {this.state.weather}
            </span>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(
  state => ({menuName: state.menu.name})
)(Header)