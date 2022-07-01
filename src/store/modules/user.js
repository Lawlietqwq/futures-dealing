import * as userApi from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  uid: -1,
  role: -1
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_UID: (state, uid) => {
    state.uid = uid
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      userApi.login(JSON.stringify({ username: username.trim(), password: password })).then(response => {
        // var response = JSON.parse(response)
        const { data } = response
        // console.log(response)
        // console.log(data)
        if (response.state ==1000){
        commit('SET_TOKEN', data.token)//state更新
        commit('SET_UID', data.user.uid)//state更新
        // commit('SET_ROLE', data.user.role)//state更新
        // setToken(data.token)//cookie更新
        }
        resolve(response.state)
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

        // roles must be a non-empty array
        // if (role<0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }

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
        commit('SET_ROLE', -1)
        commit('SET_UID', -1)
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve() 
      }).catch(error => {
        reject(error)
      })
    })
  },

    // forget password
  getQuestion({ commit }, username) { 
    return new Promise((resolve, reject) => {
      userApi.get_safe_question(JSON.stringify({username: username})).then(response => {
        resolve({stateCode:response.state, question:response.data.question})
      }).catch(error => {
        reject(error)
      })
    })
  },

  // forget password
  checkAnswer({ commit }, form) {
      return new Promise((resolve, reject) => {
        userApi.check_question_answer(JSON.stringify({username:form.username,answer:form.answer})).then(response => {
          console.log('is',response)
          if(response.state == 2000){
            const data = response.data.tmpToken
            commit('SET_TOKEN', data.token)
            commit('SET_UID', data.userId)
          }
          resolve(response.state)
        }).catch(error => {
          reject(error)
        })
      })
    },

  // forget password
  resetPass({ commit }, form) {
    return new Promise((resolve, reject) => {
      userApi.reset_forget_password(JSON.stringify({username:form.username,newPassword:form.answer})).then(response => {
        resolve(response.state)
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
    const accessRoutes = await dispatch('permission/generateRoutes', role, { root: true })
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
