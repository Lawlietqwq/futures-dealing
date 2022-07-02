import { asyncRoutes, constantRoutes } from '@/router/index'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(role, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(role)
  } else {
    return true
  }
}


/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, role) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(role, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, role)
      }
      res.push(tmp)
    }
  })

  return res
}



const state = {
  routes: [],
  addRoutes: []
}

// const mutations = {
//   SET_ROUTES: (state, routes) => {
//     state.addRoutes = routes
//     state.routes = constantRoutes.concat(routes)
//   }
// }

// const actions = {
//   setRoutes({ commit }, role) {
//     return new Promise(resolve => {
//       let accessedRoutes
//       if (role) {
//         accessedRoutes = asyncRoutes || []
//       } else {
//         accessedRoutes = filterAsyncRoutes(asyncRoutes, role)
//       }
//       commit('SET_ROUTES', accessedRoutes)
//       resolve(accessedRoutes)
//     })
//   }
// }
const mutations = {
  setRoutes(state, routes) {
    state.routes = constantRoutes.concat(routes)
  },
  setAllRoutes(state, routes) {
    state.routes = constantRoutes.concat(routes)
  },
  setPartialRoutes(state, routes) {
    state.partialRoutes = constantRoutes.concat(routes)
  },
  setMockRoutes(state) {
    state.routes = constantRoutes
  },
}


const actions = {
  async setRoutes({ commit }, permissions) {
    //只过滤动态路由permissions，admin不再默认拥有全部权限
    const finallyAsyncRoutes = await filterAsyncRoutes(
      [...asyncRoutes],
      permissions
    )
    commit('setRoutes', finallyAsyncRoutes)
    return finallyAsyncRoutes
  },
  async setAllRoutes({ commit }) {
    let { data } = await getRouterList()
    data.push({ path: '*', redirect: '/404', hidden: true })
    let accessRoutes = convertRouter(data)
    commit('setAllRoutes', accessRoutes)
    return accessRoutes
  },
  setPartialRoutes({ commit }, accessRoutes) {
    commit('setPartialRoutes', accessRoutes)
    return accessRoutes
  },
  setMockRoutes({ commit }) {
    commit('setMockRoutes')
    return true
  },
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
