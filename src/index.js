import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import MemoryUtils from './utils/MemoryUtils'
import storageUtils from './utils/storageUtils'

import store from './redux/store'
import App from './App'

const user = storageUtils.getUser()
if (user && user.id) {
  MemoryUtils.user = user
}

ReactDOM.render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('root'))

