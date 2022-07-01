import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // withCredentials: true,
  timeout: 0, // request timeout
  crossDomain: true,
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation

    // }
    //   config.headers['C'] = getToken()    
    config.headers = {
      // 'token': store.getters.token,    
      // 'uid': store.getters.uid,
      'Content-Type': 'application/json',
    }
    // if(store.getters.token)
    // config.headers['token']=store.getters.token
    // if(store.getters.uid>=0)
    // config.headers['uid']=store.getters.uid
    // return config
    return {
      method:config.method,
      url:config.url,
      headers:config.headers,
      data:config.data
    }
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // var response = JSON.parse(response)
    const res = JSON.parse(response.data)
    // 状态码不是200，报错
    if (res.code !== 200) {
      Message({
        message: res.message || '错误',
        type: 'error',
        duration: 5 * 1000
      })

    /*
    50008：非法token
    50012：其他用户登录
    50014：token过期
    */

      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // 重新登录
        MessageBox.confirm('您已登出，请重新登录','警告', {
          confirmButtonText: '重新登录',
          cancelButtonText: '退出',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || '错误'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  return res
  }
)

export default service
