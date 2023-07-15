import * as authApi from "@/utils/auth"

const getters = {
    sidebar: state => state.app.sidebar,
    size: state => state.app.size,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    introduction: state => state.user.introduction,
    role: state => state.user.role,
    permission_routes: state => state.permission.routes,
    errorLogs: state => state.errorLog.logs,
    uid:state => {
      state.user.uid = authApi.getUserInfo().uid
      return state.user.uid
    },
    userInfo:state => {
      state.user.userInfo = authApi.getUserInfo()
      return state.user.userInfo
    },
  }
  export default getters
  