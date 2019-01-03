import React, {Component} from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import Login from './pages/login/login'
import Admin from './pages/admin/admin'
import Home from './pages/home/home'
import Product from './pages/product/product'
import Category from './pages/category/category'
import City from './pages/city/city'
import Order from './pages/order/order'
import User from './pages/user/user'
import Permission from './pages/permission/permission'
import Bar from './pages/charts/bar'
import Line from './pages/charts/line'
import Pie from './pages/charts/pie'

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login}/>
          <Route path='/' render={() => (
            <Admin>
              <Switch>
                <Route path='/home' component={Home}/>
                <Route path='/category' component={Category}/>
                <Route path='/product' component={Product}/>

                <Route path='/city' component={City}/>
                <Route path='/order' component={Order}/>
                <Route path='/user' component={User}/>
                <Route path='/permission' component={Permission}/>
                <Route path="/charts/bar" component={Bar}/>
                <Route path="/charts/pie" component={Pie}/>
                <Route path="/charts/line" component={Line}/>
                <Redirect to='/home'/>
              </Switch>
            </Admin>
          )}/>
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App