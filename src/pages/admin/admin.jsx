import React from 'react'
import {Row, Col} from 'antd'

import Header from '../../components/header/header'
import Footer from '../../components/footer/footer'
import LeftNav from '../../components/left-nav/left-nav'

import './admin.less'

export default class Admin extends React.Component {

  render() {
    return (
      <Row className="container">
        <Col span={4} className="left-nav">
          <LeftNav/>
        </Col>
        <Col span={20} className="main">
          <Header/>
          <Row className="content">
            {this.props.children}
          </Row>
          <Footer/>
        </Col>
      </Row>
    )
  }
}
