import * as taskApi from '@/utils/timer'

const state = {
  myTarget:null,
}

const mutations = {
  SET_MYTARGET: (state, myTarget) => {
    state.myTarget = myTarget
  },

}

const actions = {
  // 设定定时任务
  setMyTarget({commit}, myTarget){
      if(state.myTarget != null) taskApi.stopIntervalTask(state.myTarget) 
      commit('SET_MYTARGET', myTarget)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
