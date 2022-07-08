import * as userApi from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router/index'

const state = {
  token: getToken(),
  username: '',
  uid: -1,
  email: '',
  account: '',
  tradingAccount: '',
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
  },
  SET_TRADINGACCOUNT: (state, tradingAccount) => {
    state.tradingAccount = tradingAccount
  },
  SET_UID: (state, uid) => {
    state.uid = uid
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    console.log(userInfo)
    return new Promise((resolve, reject) => {
      userApi.login(userInfo).then(res => {
        console.log(res)
        commit('SET_TOKEN', res.token)//state更新
        // commit('SET_UID', data.uid)//state更新
        // commit('SET_EMAIL', data.email)//state更新
        // commit('SET_USERNAME', data.username)//state更新
        // commit('SET_TRADINGACCOUNT', data.tradingAccount)//state更新
        // commit('SET_ACCOUNT', data.account)//state更新
        setToken(res.token)//cookie更新
        console.log(res.token,'token')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user register
  register({ commit }, userInfo) {
    const { username, password, email, question, answer } = userInfo
    return new Promise((resolve, reject) => {
      userApi.register(JSON.stringify({ username: username.trim(), password:password.trim(), email: email, question: question, answer: answer })).then(response => {
        console.log('response,',response)
        // var response = JSON.parse(response)
        resolve(response.state)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      userApi.get_user_detail().then(response => {
        const { user } = response.data

        if (!user) {
          reject('Verification failed, please Login again.')
        }

        const { role, userName } = user


        commit('SET_ROLE', role)
        commit('SET_NAME', userName)
        // commit('SET_AVATAR', avatar)
        // commit('SET_INTRODUCTION', introduction)
        resolve(user)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      userApi.login_out().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_UID', -1)
        removeToken()
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
      commit('SET_TOKEN', '')
      commit('SET_ROLE', -1)
      commit('SET_UID', -1)
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, roles) {
    // const token = roles + '-token'

    // commit('SET_TOKEN', token)
    // setToken(token)

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
