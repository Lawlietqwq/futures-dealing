import * as userApi from '@/api/user'
import * as authApi from '@/utils/auth'
import router, { resetRouter } from '@/router/index'

const state = {
  token: authApi.getToken(),
  uid: authApi.getUserInfo()?authApi.getUserInfo().uid:0,
  userInfo: authApi.getUserInfo()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_UID: (state, uid) => {
    state.uid = uid
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    // console.log(userInfo)
    return new Promise((resolve, reject) => {
      userApi.login(userInfo).then(res => {
        // console.log(res)
        commit('SET_TOKEN', res.token)//state更新
        authApi.setToken(res.token)//localStorage更新
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      userApi.getUserInfo().then(res => {
        var userInfo = res.data
        // console.log(userInfo,'info')

        userInfo.uid = parseInt(userInfo.uid)
        if (!userInfo) {
          reject('认证失败，请重新登录')
        }
        commit('SET_UID', userInfo.uid)
        authApi.setUserInfo(userInfo)
        commit('SET_USERINFO', userInfo)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      userApi.logout().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_UID', -1)
        authApi.removeToken()
        resetRouter()
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve() 
      }).catch(error => {
        reject(error)
      })
    })
  },


  
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', null)
      commit('SET_USERINFO', null)
      commit('SET_UID', null)
      authApi.clearLocalStorage()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, roles) {

    const { role } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/setRoutes', role, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
