import {combineReducers} from 'redux'

import {
  SET_MENU_NAME
} from './action-types'

const initXxx = {}

function xxx(state = initXxx, action) {
  switch (action.type) {

    default:
      return state
  }
}

const initYyy = []

function yyy(state = initYyy, action) {
  switch (action.type) {

    default:
      return state
  }
}

const initMenu = {
  name: ''
}
function menu(state = initMenu, action) {
  switch (action.type) {
    case SET_MENU_NAME:
      return {...state, name: action.data}
    default:
      return state
  }
}

export default combineReducers({
  xxx,
  yyy,
  menu
})