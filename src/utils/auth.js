import Cookies from 'js-cookie'
import store from '@/store'

const tokenKey = 'Admin-Token'
const uidKey = 'Admin-Uid'
const usernameKey = 'Admin-Username'
const emailKey = 'Admin-Email'
const accountKey = 'Admin-Account'
const tradingAccountKey = 'Admin-TradingAccount'

export function getToken() {
  return localStorage.getItem(tokenKey)
}

export function setToken(token) {
  return localStorage.setItem(tokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(tokenKey)
}

export function getUid() {
  return localStorage.getItem(uidKey)
}

export function setUid(uid) {
  return localStorage.setItem(uidKey, uid)
}

export function removeUid() {
  return localStorage.removeItem(uidKey)
}

export function getUsername() {
  return localStorage.getItem(usernameKey)
}

export function setUsername(username) {
  return localStorage.setItem(usernameKey, username)
}

export function removeUsername() {
  return localStorage.removeItem(usernameKey)
}

export function getEmail() {
  return localStorage.getItem(emailKey)
}

export function setEmail(email) {
  return localStorage.setItem(emailKey, email)
}

export function removeEmail() {
  return localStorage.removeItem(emailKey)
}

export function getAccount() {
  return localStorage.getItem(accountKey)
}

export function setAccount(account) {
  return localStorage.setItem(accountKey, account)
}

export function removeAccount() {
  return localStorage.removeItem(accountKey)
}

export function getTradingAccount() {
  return localStorage.getItem(tradingAccountKey)
}

export function setTradingAccount(tradingAccount) {
  return localStorage.setItem(tradingAccountKey, tradingAccount)
}

export function removeTradingAccount() {
  return localStorage.removeItem(tradingAccountKey)
}


export function setLocalStorage(name, value){
  return localStorage.setItem(name, value)

}

export function getLocalStorage(name){
  return localStorage.getItem(name)

}

export function clearLocalStorage(){
  return localStorage.clear()
}