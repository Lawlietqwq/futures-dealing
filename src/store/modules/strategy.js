import * as strategyApi from '@/api/strategy'


const state = {
  strategyId: null,
  strategyName: '',
  strategyRemark: '',
  strategyParams: [],
}

const mutations = {
  SET_STRATEGYID: (state, strategyId) => {
    state.strategyId = strategyId
  },
  SET_STRATEGYNAME: (state, strategyName) => {
    state.strategyName = strategyName
  },
  SET_STRATEGYREMARK: (state, strategyRemark) => {
    state.strategyRemark = strategyRemark
  },
  SET_STRATEGYPARAMS: (state, strategyParams) => {
    state.strategyParams = strategyParams
  },

}

const actions = {
  // get all strategy
  getAllStrategy({commit}, uid=null){
    return Promise((resolve, reject) => {
      strategyApi.get_all_strategy_template().then(res => {
        if (res.statusCode = 200){
          resolve()
        }
        resolve(res.data)
      }).catch(e => {
        reject(e)
      })
    })
  },
  // get strategy by sid
  getStrategyById({ commit }, strategyId) {
    return new Promise((resolve, reject) => {
      strategyApi.get().then(res => {
        const { data } = response
        if (response.state ==1000){
        commit('SET_TOKEN', data.token)
        commit('SET_UID', data.user.uid)
        }
        resolve(response.state)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
