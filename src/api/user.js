import httpRequest from '@/utils/request'
import store from '@/store'

export async function login(data){
    return await httpRequest.login('/login', data)
}

export async function logout(){
    return await httpRequest.post('/logout',null)
}

export async function register(data){
    return await httpRequest.post('/register', data)
}

export async function getUserInfo(){
    return await httpRequest.get('/userInfo', null)
}

export async function getAllCompany(){
    return await httpRequest.get('/company', null)
}

