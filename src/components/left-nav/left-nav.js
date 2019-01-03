import React from 'react'
import {Menu, Icon} from 'antd';
import {NavLink} from 'react-router-dom'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {switchMenu} from '../../redux/actions'
import menuConfig from './../../config/menuConfig'
import './index.less'

const SubMenu = Menu.SubMenu;

class LeftNav extends React.Component {

  state = {
    currentKey: ''
  }

  // 菜单点击
  handleClick = ({item, key}) => {
    if (key !== this.state.currentKey) {
      this.props.switchMenu(item.props.title)
      this.setState({
        currentKey: key
      })
    }
  }

  componentWillMount() {
    const menuTreeNodes = this.renderMenu(menuConfig);

    this.menuTreeNodes = menuTreeNodes
  }

  // 菜单渲染
  renderMenu = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <SubMenu title={item.title} key={item.key}>
            {this.renderMenu(item.children)}
          </SubMenu>
        )
      }
      return (
        <Menu.Item title={item.title} key={item.key}>
          <NavLink to={item.key}>{item.title}</NavLink>
        </Menu.Item>
      )
    })
  }

  homeHandleClick = () => {
    this.props.switchMenu('首页')
    this.setState({
      currentKey: ""
    })
  };

  render() {
    const path = this.props.location.pathname
    return (
      <div>
        <NavLink to="/home" onClick={this.homeHandleClick}>
          <div className="logo">
            <img src="/assets/logo.png" alt="logo"/>
            <h1>硅谷后台</h1>
          </div>
        </NavLink>
        <Menu
          onClick={this.handleClick}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[path]}
        >
          {this.menuTreeNodes}
        </Menu>
      </div>
    );
  }
}

export default connect(
  state => ({}),
  {switchMenu}
)(withRouter(LeftNav))