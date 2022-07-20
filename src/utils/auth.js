import Cookies from 'js-cookie'
import store from '@/store'

const tokenKey = 'Admin-Token'
const userInfoKey = 'Admin-UserInfo'
// const uidKey = 'Admin-Uid'
// const usernameKey = 'Admin-Username'
// const emailKey = 'Admin-Email'
// const xinyiKey = 'Admin-XinyiAccount'
// const xinyiPwdKey = 'Admin-XinyiPwd'
// const tradingAccountKey = 'Admin-TradingAccount'
// const tradingPwdKey = 'Admin-TradingPwd'
// const companyKey = 'Admin-Company'

export function getToken() {
  return localStorage.getItem(tokenKey)
}

export function setToken(token) {
  return localStorage.setItem(tokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(tokenKey)
}

export function getUserInfo() {
  return JSON.parse(localStorage.getItem(userInfoKey))
}

export function setUserInfo(userInfo) {
  return localStorage.setItem(userInfoKey, JSON.stringify(userInfo))
}

export function removeUserInfo() {
  return localStorage.removeItem(userInfoKey)
}

// export function getUid() {
//   return localStorage.getItem(uidKey)
// }

// export function setUid(uid) {
//   return localStorage.setItem(uidKey, uid)
// }

// export function removeUid() {
//   return localStorage.removeItem(uidKey)
// }

// export function getUsername() {
//   return localStorage.getItem(usernameKey)
// }

// export function setUsername(username) {
//   return localStorage.setItem(usernameKey, username)
// }

// export function removeUsername() {
//   return localStorage.removeItem(usernameKey)
// }

// export function getEmail() {
//   return localStorage.getItem(emailKey)
// }

// export function setEmail(email) {
//   return localStorage.setItem(emailKey, email)
// }

// export function removeEmail() {
//   return localStorage.removeItem(emailKey)
// }

// export function getXinyiAccount() {
//   return localStorage.getItem(xinyiKey)
// }

// export function setXinyiAccount(xinyiAccount) {
//   return localStorage.setItem(xinyiKey, xinyiAccount)
// }

// export function removeXinyiAccount() {
//   return localStorage.removeItem(xinyiKey)
// }

// export function getXinyiAccount() {
//   return localStorage.getItem(xinyiKey)
// }

// export function setXinyiAccount(xinyiAccount) {
//   return localStorage.setItem(xinyiKey, xinyiAccount)
// }

// export function removeXinyiAccount() {
//   return localStorage.removeItem(xinyiKey)
// }

// export function getTradingAccount() {
//   return localStorage.getItem(tradingAccountKey)
// }

// export function setTradingAccount(tradingAccount) {
//   return localStorage.setItem(tradingAccountKey, tradingAccount)
// }

// export function removeTradingAccount() {
//   return localStorage.removeItem(tradingAccountKey)
// }


export function setLocalStorage(name, value){
  return localStorage.setItem(name, value)

}

export function getLocalStorage(name){
  return localStorage.getItem(name)

}

export function clearLocalStorage(){
  return localStorage.clear()
}