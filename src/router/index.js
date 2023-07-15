import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
    {
      path: '/redirect',
      component: Layout,
      hidden: true,
      children: [
        {
          path: '/redirect/:path(.*)',
          component: () => import('@/views/redirect/index')
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/register/index'),
      hidden: true
    },
    

    {
      path: '/404',
      component: () => import('@/views/error-page/404'),
      hidden: true
    },
    {
      path: '/401',
      component: () => import('@/views/error-page/401'),
      hidden: true
    },

    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '',
          component: () => import('@/views/strategyView/index'),
          name: 'StrategyPage',
          meta: { title: '策略列表', icon: 'component', noCache: true }
        }
      ]
    },
    {
      path: '/create',
      component: Layout,
      children: [
        {
          path: 'index',
          component: () => import('@/views/createView/index'),
          name: 'CreatePage',
          meta: { title: '创建实例', icon: 'edit', noCache: true }
        }
      ]
    },
    {
      path: '/model',
      component: Layout,
      children: [
        {
          path: 'index',
          component: () => import('@/views/model/index'),
          name: 'ModelPage',
          meta: { title: '策略实例', icon: 'list', noCache: true }
        }
      ]
    },
    
    {
      path: '/position',
      component: Layout,
      children: [
        {
          path: 'index',
          component: () => import('@/views/position/index'),
          name: 'PositionPage',
          meta: { title: '持仓列表', icon: 'chart', noCache: true }
        }
      ]
    },
    {
      path: '/record',
      component: Layout,
      children: [
        {
          path: 'index',
          component: () => import('@/views/record/index'),
          name: 'RecordPage',
          meta: { title: '交易记录', icon: 'lock', noCache: true }
        }
      ]
    },

    { path: '*', redirect: '/404', hidden: true }

  ]
  
  /**
   * asyncRoutes
   * the routes that need to be dynamically loaded based on user roles
   */
  export const asyncRoutes = [
  
  
    // {
    //   path: '/caseView',
    //   component: () => import('@/views/caseView/index'),
    //   name: 'caseView',
    // },
  
    // {
    //   path: '/caseDetail',
    //   component: () => import('@/views/caseDetail/index'),
    //   name: 'caseDetail',
    // },
  
    // {
    //   path: '/icon',
    //   component: Layout,
    //   children: [
    //     {
    //       path: 'index',
    //       component: () => import('@/views/icons/index'),
    //       name: 'Icons',
    //       meta: { title: 'Icons', icon: 'icon', noCache: true }
    //     }
    //   ]
    // },
  
    /** when your routing map is too long, you can split it into small modules **/
    // componentsRouter,
    // chartsRouter,
    // nestedRouter,
    // tableRouter,
  
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
  ]
  
  const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })
  
  const router = createRouter()
  
  // Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
  export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
  }
  
  export default router
  